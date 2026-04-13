class Util {
  static pad(num, digits = 2) {
    let zeroes = new Array(digits + 1).join(0);
    return `${zeroes}${num}`.slice(-1 * digits);
  }

  static log(message) {
    Util.output("log", message);
  }
  static error(message, error) {
    Util.output("error", message, error);
  }
  static output(type, ...messages) {
    let now = new Date();
    let date = `${Util.pad(now.getUTCHours())}:${Util.pad(
      now.getUTCMinutes()
    )}:${Util.pad(now.getUTCSeconds())}.${Util.pad(
      now.getUTCMilliseconds(),
      3
    )}`;
    console[type](`[11ty][${date} UTC]`, ...messages);
  }

  static capitalize(word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1);
  }

  static matchRootAttributes(htmlContent) {
    // Workaround for morphdom bug with attributes on <html> https://github.com/11ty/eleventy-dev-server/issues/6
    // Note also `childrenOnly: true` above
    const parser = new DOMParser();
    let parsed = parser.parseFromString(htmlContent, "text/html");
    let parsedDoc = parsed.documentElement;
    let newAttrs = parsedDoc.getAttributeNames();

    let docEl = document.documentElement;
    // Remove old
    let removedAttrs = docEl.getAttributeNames().filter(name => !newAttrs.includes(name));
    for(let attr of removedAttrs) {
      docEl.removeAttribute(attr);
    }

    // Add new
    for(let attr of newAttrs) {
      docEl.setAttribute(attr, parsedDoc.getAttribute(attr));
    }
  }

  static isEleventyLinkNodeMatch(from, to) {
    // Issue #18 https://github.com/11ty/eleventy-dev-server/issues/18
    // Don’t update a <link> if the _11ty searchParam is the only thing that’s different
    if(from.tagName !== "LINK" || to.tagName !== "LINK") {
      return false;
    }

    let oldWithoutHref = from.cloneNode();
    let newWithoutHref = to.cloneNode();

    oldWithoutHref.removeAttribute("href");
    newWithoutHref.removeAttribute("href");

    // if all other attributes besides href match
    if(!oldWithoutHref.isEqualNode(newWithoutHref)) {
      return false;
    }

    let oldUrl = new URL(from.href);
    let newUrl = new URL(to.href);

    // morphdom wants to force href="style.css?_11ty" => href="style.css"
    let paramName = EleventyReload.QUERY_PARAM;
    let isErasing = oldUrl.searchParams.has(paramName) && !newUrl.searchParams.has(paramName);
    if(!isErasing) {
      // not a match if _11ty has a new value (not being erased)
      return false;
    }

    oldUrl.searchParams.set(paramName, "");
    newUrl.searchParams.set(paramName, "");

    // is a match if erasing and the rest of the href matches too
    return oldUrl.toString() === newUrl.toString();
  }

  // https://github.com/patrick-steele-idem/morphdom/issues/178#issuecomment-652562769
  static runScript(source, target) {
    let script = document.createElement('script');

    // copy over the attributes
    for(let attr of [...source.attributes]) {
      script.setAttribute(attr.nodeName ,attr.nodeValue);
    }

    script.innerHTML = source.innerHTML;
    (target || source).replaceWith(script);
  }

  static fullPageReload() {
    Util.log(`Page reload initiated.`);
    window.location.reload();
  }
}

class EleventyReload {
  static QUERY_PARAM = "_11ty";

  static reloadTypes = {
    css: (files, build = {}) => {
      // Initiate a full page refresh if a CSS change is made but does match any stylesheet url
      // `build.stylesheets` available in Eleventy v3.0.1-alpha.5+
      if(Array.isArray(build.stylesheets)) {
        let match = false;
        for (let link of document.querySelectorAll(`link[rel="stylesheet"]`)) {
          if (link.href) {
            let url = new URL(link.href);
            if(build.stylesheets.includes(url.pathname)) {
              match = true;
            }
          }
        }

        if(!match) {
          Util.fullPageReload();
          return;
        }
      }

      for (let link of document.querySelectorAll(`link[rel="stylesheet"]`)) {
        if (link.href) {
          let url = new URL(link.href);
          url.searchParams.set(this.QUERY_PARAM, Date.now());
          link.href = url.toString();
        }
      }

      Util.log(`CSS updated without page reload.`);
    },
    default: async (files, build = {}) => {
      let morphed = false;
      let domdiffTemplates = (build?.templates || []).filter(({url, inputPath}) => {
        return url === document.location.pathname && (files || []).includes(inputPath);
      });

      if(domdiffTemplates.length === 0) {
        Util.fullPageReload();
        return;
      }

      try {
        // Important: using `./` allows the `.11ty` folder name to be changed
        const { default: morphdom } = await import(`./morphdom.js`);

        for (let {url, inputPath, content} of domdiffTemplates) {
          // Notable limitation: this won’t re-run script elements or JavaScript page lifecycle events (load/DOMContentLoaded)
          morphed = true;

          morphdom(document.documentElement, content, {
            childrenOnly: true,
            onBeforeElUpdated: function (fromEl, toEl) {
              if (fromEl.nodeName === "SCRIPT" && toEl.nodeName === "SCRIPT") {
                if(toEl.innerHTML !== fromEl.innerHTML) {
                  Util.log(`JavaScript modified, reload initiated.`);
                  window.location.reload();
                }

                return false;
              }

              // Speed-up trick from morphdom docs
              // https://dom.spec.whatwg.org/#concept-node-equals
              if (fromEl.isEqualNode(toEl)) {
                return false;
              }

              if(Util.isEleventyLinkNodeMatch(fromEl, toEl)) {
                return false;
              }

              return true;
            },
            addChild: function(parent, child) {
              // Declarative Shadow DOM https://github.com/11ty/eleventy-dev-server/issues/90
              if(child.nodeName === "TEMPLATE" && child.hasAttribute("shadowrootmode")) {
                let root = parent.shadowRoot;
                if(root) {
                  // remove all shadow root children
                  while(root.firstChild) {
                    root.removeChild(root.firstChild);
                  }
                }
                for(let newChild of child.content.childNodes) {
                  root.appendChild(newChild);
                }
              } else {
                parent.appendChild(child);
              }
            },
            onNodeAdded: function (node) {
              if (node.nodeName === 'SCRIPT') {
                Util.log(`JavaScript added, reload initiated.`);
                window.location.reload();
              }
            },
            onElUpdated: function(node) {
              // Re-attach custom elements
              if(customElements.get(node.tagName.toLowerCase())) {
                let placeholder = document.createElement("div");
                node.replaceWith(placeholder);
                requestAnimationFrame(() => {
                  placeholder.replaceWith(node);
                  placeholder = undefined;
                });
              }
            }
          });

          Util.matchRootAttributes(content);
          Util.log(`HTML delta applied without page reload.`);
        }
      } catch(e) {
        Util.error( "Morphdom error", e );
      }

      if (!morphed) {
        Util.fullPageReload();
      }
    }
  }

  constructor() {
    this.connectionMessageShown = false;
    this.reconnectEventCallback = this.reconnect.bind(this);
  }

  init(options = {}) {
    if (!("WebSocket" in window)) {
      return;
    }

    let documentUrl = new URL(document.location.href);

    let reloadPort = new URL(import.meta.url).searchParams.get("reloadPort");
    if(reloadPort) {
      documentUrl.port = reloadPort;
    }

    let { protocol, host } = documentUrl;

    // works with http (ws) and https (wss)
    let websocketProtocol = protocol.replace("http", "ws");

    let socket = new WebSocket(`${websocketProtocol}//${host}`);

    socket.addEventListener("message", async (event) => {
      try {
        let data = JSON.parse(event.data);
        // Util.log( JSON.stringify(data, null, 2) );

        let { type } = data;

        if (type === "eleventy.reload") {
          await this.onreload(data);
        } else if (type === "eleventy.msg") {
          Util.log(`${data.message}`);
        } else if (type === "eleventy.error") {
          // Log Eleventy build errors
          // Extra parsing for Node Error objects
          let e = JSON.parse(data.error);
          Util.error(`Build error: ${e.message}`, e);
        } else if (type === "eleventy.status") {
          // Full page reload on initial reconnect
          if (data.status === "connected" && options.mode === "reconnect") {
            window.location.reload();
          }

          if(data.status === "connected") {
            // With multiple windows, only show one connection message
            if(!this.isConnected) {
              Util.log(Util.capitalize(data.status));
            }

            this.connectionMessageShown = true;
          } else {
            if(data.status === "disconnected") {
              this.addReconnectListeners();
            }

            Util.log(Util.capitalize(data.status));
          }
        } else {
          Util.log("Unknown event type", data);
        }
      } catch (e) {
        Util.error(`Error parsing ${event.data}: ${e.message}`, e);
      }
    });

    socket.addEventListener("open", () => {
      // no reconnection when the connect is already open
      this.removeReconnectListeners();
    });

    socket.addEventListener("close", () => {
      this.connectionMessageShown = false;
      this.addReconnectListeners();
    });
  }

  reconnect() {
    Util.log( "Reconnecting…" );
    this.init({ mode: "reconnect" });
  }

  async onreload({ subtype, files, build }) {
    if(!EleventyReload.reloadTypes[subtype]) {
      subtype = "default";
    }

    await EleventyReload.reloadTypes[subtype](files, build);
  }

  addReconnectListeners() {
    this.removeReconnectListeners();

    window.addEventListener("focus", this.reconnectEventCallback);
    window.addEventListener("visibilitychange", this.reconnectEventCallback);
  }

  removeReconnectListeners() {
    window.removeEventListener("focus", this.reconnectEventCallback);
    window.removeEventListener("visibilitychange", this.reconnectEventCallback);
  }
}

let reloader = new EleventyReload();
reloader.init();