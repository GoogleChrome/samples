(function () {
  const destinations = {"amalfi-coast-winding-roads":{"countryCode":"IT","country":{"en":"Italy","es":"Italia","ja":"イタリア"}},"bali-spiritual-sanctuary":{"countryCode":"ID","country":{"en":"Indonesia","es":"Indonesia","ja":"インドネシア"}},"banff-turquoise-waters":{"countryCode":"CA","country":{"en":"Canada","es":"Canadá","ja":"カナダ"}},"cape-town-table-mountain":{"countryCode":"ZA","country":{"en":"South Africa","es":"Sudáfrica","ja":"南アフリカ"}},"machu-picchu-ancient-echoes":{"countryCode":"PE","country":{"en":"Peru","es":"Perú","ja":"ペルー"}},"new-york-concrete-jungle":{"countryCode":"US","country":{"en":"United States","es":"Estados Unidos","ja":"アメリカ合衆国"}},"paris-midnight-stroll":{"countryCode":"FR","country":{"en":"France","es":"Francia","ja":"フランス"}},"petra-rose-red-city":{"countryCode":"JO","country":{"en":"Jordan","es":"Jordania","ja":"ヨルダン"}},"reykjavik-northern-lights":{"countryCode":"IS","country":{"en":"Iceland","es":"Islandia","ja":"アイスランド"}},"santorini-blue-and-white":{"countryCode":"GR","country":{"en":"Greece","es":"Grecia","ja":"ギリシャ"}},"serengeti-safari-sunrise":{"countryCode":"TZ","country":{"en":"Tanzania","es":"Tanzania","ja":"タンザニア"}},"tokyo-neon-nights":{"countryCode":"JP","country":{"en":"Japan","es":"Japón","ja":"日本"}},"amsterdam-canal-city":{"countryCode":"NL","country":{"en":"Netherlands","es":"Países Bajos","ja":"オランダ"}},"bangkok-golden-temples":{"countryCode":"TH","country":{"en":"Thailand","es":"Tailandia","ja":"タイ"}},"berlin-through-the-wall":{"countryCode":"DE","country":{"en":"Germany","es":"Alemania","ja":"ドイツ"}},"buenos-aires-tango-nights":{"countryCode":"AR","country":{"en":"Argentina","es":"Argentina","ja":"アルゼンチン"}},"dubrovnik-walls-adriatic":{"countryCode":"HR","country":{"en":"Croatia","es":"Croacia","ja":"クロアチア"}},"edinburgh-castle-highlands":{"countryCode":"GB","country":{"en":"United Kingdom","es":"Reino Unido","ja":"イギリス"}},"halong-bay-emerald-waters":{"countryCode":"VN","country":{"en":"Vietnam","es":"Vietnam","ja":"ベトナム"}},"havana-vintage-streets":{"countryCode":"CU","country":{"en":"Cuba","es":"Cuba","ja":"キューバ"}},"istanbul-two-continents":{"countryCode":"TR","country":{"en":"Turkey","es":"Turquía","ja":"トルコ"}},"lisbon-seven-hills":{"countryCode":"PT","country":{"en":"Portugal","es":"Portugal","ja":"ポルトガル"}},"maldives-overwater-paradise":{"countryCode":"MV","country":{"en":"Maldives","es":"Maldivas","ja":"モルディブ"}},"marrakech-medina-maze":{"countryCode":"MA","country":{"en":"Morocco","es":"Marruecos","ja":"モロッコ"}},"masai-mara-great-migration":{"countryCode":"KE","country":{"en":"Kenya","es":"Kenia","ja":"ケニア"}},"mexico-city-ancient-modern":{"countryCode":"MX","country":{"en":"Mexico","es":"México","ja":"メキシコ"}},"mumbai-city-of-dreams":{"countryCode":"IN","country":{"en":"India","es":"India","ja":"インド"}},"prague-fairy-tale-city":{"countryCode":"CZ","country":{"en":"Czech Republic","es":"República Checa","ja":"チェコ共和国"}},"queenstown-adventure-capital":{"countryCode":"NZ","country":{"en":"New Zealand","es":"Nueva Zelanda","ja":"ニュージーランド"}},"rio-carnival-colours":{"countryCode":"BR","country":{"en":"Brazil","es":"Brasil","ja":"ブラジル"}},"seoul-ancient-modern":{"countryCode":"KR","country":{"en":"South Korea","es":"Corea del Sur","ja":"韓国"}},"sydney-harbour-sunrise":{"countryCode":"AU","country":{"en":"Australia","es":"Australia","ja":"オーストラリア"}}};
  const locale = "es";
  const siteBase = "/samples/trailblazers/dist/";

  const container = document.getElementById('world-map-container');
  const tooltip = document.getElementById('map-tooltip');
  if (!container) return;

  // Map slug → { countryCode, country }
  const destEntries = Object.entries(destinations);

  // Highlight each destination country
  destEntries.forEach(([slug, dest]) => {
    const code = dest.countryCode.toLowerCase();
    const el = container.querySelector('#' + code);
    if (!el) return;

    el.classList.add('destination-highlight');
    el.setAttribute('data-dest-slug', slug);
    el.setAttribute('data-dest-name', dest.country[locale] || dest.country['en']);
    el.setAttribute('data-dest-url', siteBase + locale + '/blog/' + slug + '/');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', (dest.country[locale] || dest.country['en']) + ' — click to read article');

    // Click to navigate
    el.addEventListener('click', (e) => {
      window.location.href = siteBase + locale + '/blog/' + slug + '/';
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = siteBase + locale + '/blog/' + slug + '/';
      }
    });
  });

  // Tooltip follow-mouse
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tooltip.style.left = (x + 14) + 'px';
    tooltip.style.top = (y - 36) + 'px';
  });

  container.addEventListener('mouseover', (e) => {
    const highlight = e.target.closest('.destination-highlight');
    if (highlight) {
      const name = highlight.getAttribute('data-dest-name');
      if (name) {
        tooltip.textContent = name;
        // re-add the ::before via data attr trick isn't needed – we override textContent,
        // so use innerHTML instead
        tooltip.innerHTML = '📍 ' + name;
        tooltip.style.opacity = '1';
      }
    }
  });

  container.addEventListener('mouseout', (e) => {
    const highlight = e.target.closest('.destination-highlight');
    if (highlight && !highlight.contains(e.relatedTarget)) {
      tooltip.style.opacity = '0';
    }
  });

  // Pan & zoom
  let scale = 1, panX = 0, panY = 0;
  let isPanning = false, startX = 0, startY = 0;

  const svg = container.querySelector('svg');
  if (!svg) return;

  function applyTransform() {
    svg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    svg.style.transformOrigin = 'center center';
  }

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.min(Math.max(scale * delta, 1), 6);
    if (scale === 1) { panX = 0; panY = 0; }
    applyTransform();
  }, { passive: false });

  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => { isPanning = false; });

  // Double-click to reset
  container.addEventListener('dblclick', () => {
    scale = 1; panX = 0; panY = 0;
    applyTransform();
  });
})();
// Thank you to https://github.com/daviddarnes/heading-anchors
// Thank you to https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/

let globalInstanceIndex = 0;

class HeadingAnchors extends HTMLElement {
	static register(tagName = "heading-anchors", registry = window.customElements) {
		if(registry && !registry.get(tagName)) {
			registry.define(tagName, this);
		}
	}

	static attributes = {
		exclude: "data-ha-exclude",
		prefix: "prefix",
		content: "content",
	}

	static classes = {
		anchor: "ha",
		placeholder: "ha-placeholder",
		srOnly: "ha-visualhide",
	}

	static defaultSelector = "h2,h3,h4,h5,h6";

	static css = `
.${HeadingAnchors.classes.srOnly} {
	clip: rect(0 0 0 0);
	height: 1px;
	overflow: hidden;
	position: absolute;
	width: 1px;
}
.${HeadingAnchors.classes.anchor} {
	position: absolute;
	left: var(--ha_offsetx);
	top: var(--ha_offsety);
	text-decoration: none;
	opacity: 0;
}
.${HeadingAnchors.classes.placeholder} {
	opacity: .3;
}
.${HeadingAnchors.classes.anchor}:is(:focus-within, :hover) {
	opacity: 1;
}
.${HeadingAnchors.classes.anchor},
.${HeadingAnchors.classes.placeholder} {
	display: inline-block;
	padding: 0 .25em;

	/* Disable selection of visually hidden label */
	-webkit-user-select: none;
	user-select: none;
}

@supports (anchor-name: none) {
	.${HeadingAnchors.classes.anchor} {
		position: absolute;
		left: anchor(left);
		top: anchor(top);
	}
}`;

	get supports() {
		return "replaceSync" in CSSStyleSheet.prototype;
	}

	get supportsAnchorPosition() {
		return CSS.supports("anchor-name: none");
	}

	constructor() {
		super();

		if(!this.supports) {
			return;
		}

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(HeadingAnchors.css);
		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

		this.headingStyles = {};
		this.instanceIndex = globalInstanceIndex++;
	}

	connectedCallback() {
		if (!this.supports) {
			return;
		}

		this.headings.forEach((heading, index) => {
			if(!heading.hasAttribute(HeadingAnchors.attributes.exclude)) {
				let anchor = this.getAnchorElement(heading);
				let placeholder = this.getPlaceholderElement();

				// Prefers anchor position approach for better accessibility
				// https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
				if(this.supportsAnchorPosition) {
					let anchorName = `--ha_${this.instanceIndex}_${index}`;
					placeholder.style.setProperty("anchor-name", anchorName);
					anchor.style.positionAnchor = anchorName;
				}

				heading.appendChild(placeholder);
				heading.after(anchor);
			}
		});
	}

	// Polyfill-only
	positionAnchorFromPlaceholder(placeholder) {
		if(!placeholder) {
			return;
		}

		let heading = placeholder.closest("h1,h2,h3,h4,h5,h6");
		if(!heading.nextElementSibling) {
			return;
		}

		// TODO next element could be more defensive
		this.positionAnchor(heading.nextElementSibling);
	}

	// Polyfill-only
	positionAnchor(anchor) {
		if(!anchor || !anchor.previousElementSibling) {
			return;
		}

		// TODO previous element could be more defensive
		let heading = anchor.previousElementSibling;
		this.setFontProp(heading, anchor);

		if(this.supportsAnchorPosition) {
			// quit early
			return;
		}

		let placeholder = heading.querySelector(`.${HeadingAnchors.classes.placeholder}`);
		if(placeholder) {
			anchor.style.setProperty("--ha_offsetx", `${placeholder.offsetLeft}px`);
			anchor.style.setProperty("--ha_offsety", `${placeholder.offsetTop}px`);
		}
	}

	setFontProp(heading, anchor) {
		let placeholder = heading.querySelector(`.${HeadingAnchors.classes.placeholder}`);
		if(placeholder) {
			let style = getComputedStyle(placeholder);
			let props = ["font-weight", "font-size", "line-height", "font-family"];
			let [weight, size, lh, family] = props.map(name => style.getPropertyValue(name));
			anchor.style.setProperty("font", `${weight} ${size}/${lh} ${family}`);
			let vars = style.getPropertyValue("font-variation-settings");
			if(vars) {
				anchor.style.setProperty("font-variation-settings", vars);
			}
		}
	}

	getAccessibleTextPrefix() {
		// Useful for i18n
		return this.getAttribute(HeadingAnchors.attributes.prefix) || "Jump to section titled";
	}

	getContent() {
		if(this.hasAttribute(HeadingAnchors.attributes.content)) {
			return this.getAttribute(HeadingAnchors.attributes.content);
		}
		return "#";
	}

	// Placeholder nests inside of heading
	getPlaceholderElement() {
		let ph = document.createElement("span");
		ph.setAttribute("aria-hidden", true);
		ph.classList.add(HeadingAnchors.classes.placeholder);
		let content = this.getContent();
		if(content) {
			ph.textContent = content;
		}

		ph.addEventListener("mouseover", (e) => {
			let placeholder = e.target.closest(`.${HeadingAnchors.classes.placeholder}`);
			if(placeholder) {
				this.positionAnchorFromPlaceholder(placeholder);
			}
		});

		return ph;
	}

	getAnchorElement(heading) {
		let anchor = document.createElement("a");
		anchor.href = `#${heading.id}`;
		anchor.classList.add(HeadingAnchors.classes.anchor);

		let content = this.getContent();
		anchor.innerHTML = `<span class="${HeadingAnchors.classes.srOnly}">${this.getAccessibleTextPrefix()}: ${heading.textContent}</span>${content ? `<span aria-hidden="true">${content}</span>` : ""}`;

		anchor.addEventListener("focus", e => {
			let anchor = e.target.closest(`.${HeadingAnchors.classes.anchor}`);
			if(anchor) {
				this.positionAnchor(anchor);
			}
		});

		anchor.addEventListener("mouseover", (e) => {
			// when CSS anchor positioning is supported, this is only used to set the font
			let anchor = e.target.closest(`.${HeadingAnchors.classes.anchor}`);
			this.positionAnchor(anchor);
		});

		return anchor;
	}

	get headings() {
		return this.querySelectorAll(this.selector.split(",").map(entry => `${entry.trim()}[id]`));
	}

	get selector() {
		return this.getAttribute("selector") || HeadingAnchors.defaultSelector;
	}
}

HeadingAnchors.register();

export { HeadingAnchors }
const urlParams = new URLSearchParams(window.location.search);
			const adminFromUrl = urlParams.get('admin') === 'true';
			const adminFromStorage = localStorage.getItem('admin') === 'true';

			if (adminFromUrl) {
				localStorage.setItem('admin', 'true');
			} else if (adminFromStorage) {
				urlParams.set('admin', 'true');
				window.location.search = urlParams.toString();
			}

			const isAdmin = adminFromUrl || adminFromStorage;
			if(isAdmin) {
				document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'initial');
				// Append ?admin=true to all internal links to maintain state
				document.querySelectorAll('a[href^="/"]').forEach(a => {
					const url = new URL(a.href, window.location.origin);
					if (!url.searchParams.has('admin')) {
						url.searchParams.set('admin', 'true');
						a.href = url.pathname + url.search + url.hash;
					}
				});
			}
window.addEventListener('DOMContentLoaded', (event) => {
				const searchToggle = document.getElementById('search-toggle');
				const searchOverlay = document.getElementById('search-overlay');
				const searchClose = document.getElementById('search-close');
				let pagefindInitialized = false;

				if (searchToggle && searchOverlay) {
					searchToggle.addEventListener('click', () => {
						searchOverlay.showModal();
						if (!pagefindInitialized) {
							new PagefindUI({ 
								element: "#search",
								showSubResults: true,
								resetStyles: false,
								translations: {
									clear_search: "×"
								}
							});
							pagefindInitialized = true;
						}
						// Focus input after init
						setTimeout(() => {
							const input = searchOverlay.querySelector('input');
							if (input) input.focus();
						}, 100);
					});

					searchClose.addEventListener('click', () => {
						searchOverlay.close();
					});
				}
			});