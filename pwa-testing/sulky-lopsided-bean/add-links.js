const urls = [
  {url: window.location.origin + "/black/", text: "navigate-existing"},
  {url: window.location.origin + "/brown/", text: "focus-existing"},
  {url: window.location.origin + "/white/", text: "navigate-new"},
  {url: "about:blank", text: ""},
];

document.body.appendChild(document.createElement("hr"));

const header = document.createElement('h2');
header.textContent = "~~ Link capturing testing fun below! ~~"
document.body.appendChild(header);

const explain = document.createElement("p");
explain.textContent = "(this frame is 'embeddedFrame' and should be navigated when any of the links below are used that target it)"
document.body.appendChild(explain);

const iframe = document.createElement("iframe");
// iframe.src = urls[0];
iframe.name = "embeddedFrame";
document.body.appendChild(iframe);

for (const pair of urls) {
  const url = pair.url;
  const heading = document.createElement("h3");
  heading.textContent = url + " - " + pair.text;
  document.body.appendChild(heading);

  const list = document.createElement("ul");
  document.body.appendChild(list);

  let currentList = list;

  function subList(name) {
    const sub = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = name;
    li.appendChild(sub);
    list.appendChild(li);
    currentList = sub;
  }

  function addItem(item) {
    const li = document.createElement("li");
    li.appendChild(item);
    currentList.appendChild(li);
  }

  for (const target of ["_self", "embeddedFrame", "_blank", "otherFrameName"]) {
    subList("Frame: " + target);
    
    const linkNoArgs = document.createElement('a');
    linkNoArgs.textContent = `target="${target}"`;
    linkNoArgs.href = url;
    linkNoArgs.target = target;
    addItem(linkNoArgs);
    
    const link = document.createElement("a");
    link.textContent = `target="${target}" rel=opener`;
    link.href = url;
    link.target = target;
    link.rel = "opener";
    addItem(link);

    const link2 = document.createElement("a");
    link2.textContent = `target="${target}" rel=noopener`;
    link2.href = url;
    link2.target = target;
    link2.rel = "noopener";
    addItem(link2);
    
    
    const buttonNoArgs = document.createElement('button');
    buttonNoArgs.textContent = 'window.open(url)';
    buttonNoArgs.onclick = () => {
      window.open(url);
    }
    // Rough way of handling middle clicks.
    buttonNoArgs.onauxclick = () => {
      window.open(url);
    }
    addItem(buttonNoArgs);
    
    const buttonTargetOnly = document.createElement('button');
    buttonTargetOnly.textContent = 'window.open(url, "'+target+')';
    buttonTargetOnly.onclick = () => {
      window.open(url, target);
    }
    // Rough way of handling middle clicks.
    buttonTargetOnly.onauxclick = () => {
      window.open(url, target);
    }
    addItem(buttonTargetOnly);

    const button = document.createElement("button");
    button.textContent = "window.open(url, '" + target + "', 'opener')";
    button.onclick = () => {
      window.open(url, target, 'opener');
    };
    // Rough way of handling middle clicks.
    button.onauxclick = () => {
      window.open(url, target, 'opener');
    };
    addItem(button);

    const button2 = document.createElement("button");
    button2.textContent = "window.open(url, '" + target + "', 'noopener')";
    button2.onclick = () => {
      window.open(url, target, "noopener");
    };
    // Rough way of handling middle clicks.
    button2.onauxclick = () => {
      window.open(url, target, "noopener");
    };
    addItem(button2);

    const button3 = document.createElement("button");
    button3.textContent =
      "window.open('about:blank', '" + target + "').window.location.href = " +
      url;
    button3.onclick = () => {
      window.open("about:blank", target).window.location.href = url;
    };
    // Rough way of handling middle clicks.
    button3.onauxclick = () => {
      window.open("about:blank", target).window.location.href = url;
    };
    addItem(button3);

      // this is not possible! yay!
    // const button4 = document.createElement("button");
    // button4.textContent =
    //   "window.open('about:blank', '"+target+"', noopener).window.location.href = " +
    //   url;
    // button4.onclick = () => {
    //   window.open("about:blank", target, "noopener").window.location.href = url;
    // };
    // // Rough way of handling middle clicks.
    // button4.onauxclick = () => {
    //   window.open("about:blank", target, "noopener").window.location.href = url;
    // };
    // addItem(button4);
  }
}
