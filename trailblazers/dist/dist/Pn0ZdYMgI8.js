(function () {
  const destinations = {"amalfi-coast-winding-roads":{"countryCode":"IT","country":{"en":"Italy","es":"Italia","ja":"イタリア"},"cityName":"Amalfi Coast","souvenir":{"name":"Limoncello bottle","temuUrl":"https://www.temu.com/search_result.html?search_key=limoncello+bottle+souvenir&search_method=user"}},"bali-spiritual-sanctuary":{"countryCode":"ID","country":{"en":"Indonesia","es":"Indonesia","ja":"インドネシア"},"cityName":"Bali","souvenir":{"name":"Balinese mask","temuUrl":"https://www.temu.com/search_result.html?search_key=balinese+mask+wall+decor&search_method=user"}},"banff-turquoise-waters":{"countryCode":"CA","country":{"en":"Canada","es":"Canadá","ja":"カナダ"},"cityName":"Banff","souvenir":{"name":"Maple leaf keyring","temuUrl":"https://www.temu.com/search_result.html?search_key=canada+maple+leaf+keychain+souvenir&search_method=user"}},"cape-town-table-mountain":{"countryCode":"ZA","country":{"en":"South Africa","es":"Sudáfrica","ja":"南アフリカ"},"cityName":"Cape Town","souvenir":{"name":"Beaded bracelet","temuUrl":"https://www.temu.com/search_result.html?search_key=african+beaded+bracelet+souvenir&search_method=user"}},"machu-picchu-ancient-echoes":{"countryCode":"PE","country":{"en":"Peru","es":"Perú","ja":"ペルー"},"cityName":"Machu Picchu","souvenir":{"name":"Alpaca plush","temuUrl":"https://www.temu.com/search_result.html?search_key=alpaca+plush+toy+peru+souvenir&search_method=user"}},"new-york-concrete-jungle":{"countryCode":"US","country":{"en":"United States","es":"Estados Unidos","ja":"アメリカ合衆国"},"cityName":"New York","souvenir":{"name":"Statue of Liberty keyring","temuUrl":"https://www.temu.com/search_result.html?search_key=statue+of+liberty+keychain+souvenir&search_method=user"}},"paris-midnight-stroll":{"countryCode":"FR","country":{"en":"France","es":"Francia","ja":"フランス"},"cityName":"Paris","souvenir":{"name":"Eiffel Tower keyring","temuUrl":"https://www.temu.com/search_result.html?search_key=eiffel+tower+keychain+souvenir&search_method=user"}},"petra-rose-red-city":{"countryCode":"JO","country":{"en":"Jordan","es":"Jordania","ja":"ヨルダン"},"cityName":"Petra","souvenir":{"name":"Sand art bottle","temuUrl":"https://www.temu.com/search_result.html?search_key=jordan+sand+art+bottle+souvenir&search_method=user"}},"reykjavik-northern-lights":{"countryCode":"IS","country":{"en":"Iceland","es":"Islandia","ja":"アイスランド"},"cityName":"Reykjavik","souvenir":{"name":"Viking helmet","temuUrl":"https://www.temu.com/search_result.html?search_key=viking+helmet+souvenir+toy&search_method=user"}},"santorini-blue-and-white":{"countryCode":"GR","country":{"en":"Greece","es":"Grecia","ja":"ギリシャ"},"cityName":"Santorini","souvenir":{"name":"Blue-dome church miniature","temuUrl":"https://www.temu.com/search_result.html?search_key=santorini+blue+dome+church+miniature&search_method=user"}},"serengeti-safari-sunrise":{"countryCode":"TZ","country":{"en":"Tanzania","es":"Tanzania","ja":"タンザニア"},"cityName":"Serengeti","souvenir":{"name":"Wooden elephant carving","temuUrl":"https://www.temu.com/search_result.html?search_key=african+wooden+elephant+carving+figurine&search_method=user"}},"tokyo-neon-nights":{"countryCode":"JP","country":{"en":"Japan","es":"Japón","ja":"日本"},"cityName":"Tokyo","souvenir":{"name":"Maneki-neko lucky cat","temuUrl":"https://www.temu.com/search_result.html?search_key=maneki+neko+lucky+cat+figurine&search_method=user"}},"amsterdam-canal-city":{"countryCode":"NL","country":{"en":"Netherlands","es":"Países Bajos","ja":"オランダ"},"cityName":"Amsterdam","souvenir":{"name":"Wooden clogs","temuUrl":"https://www.temu.com/search_result.html?search_key=dutch+wooden+clogs+souvenir&search_method=user"}},"bangkok-golden-temples":{"countryCode":"TH","country":{"en":"Thailand","es":"Tailandia","ja":"タイ"},"cityName":"Bangkok","souvenir":{"name":"Buddha figurine","temuUrl":"https://www.temu.com/search_result.html?search_key=thai+buddha+figurine+souvenir&search_method=user"}},"berlin-through-the-wall":{"countryCode":"DE","country":{"en":"Germany","es":"Alemania","ja":"ドイツ"},"cityName":"Berlin","souvenir":{"name":"Brandenburg Gate model","temuUrl":"https://www.temu.com/search_result.html?search_key=brandenburg+gate+model+souvenir+berlin&search_method=user"}},"buenos-aires-tango-nights":{"countryCode":"AR","country":{"en":"Argentina","es":"Argentina","ja":"アルゼンチン"},"cityName":"Buenos Aires","souvenir":{"name":"Tango dancer figurine","temuUrl":"https://www.temu.com/search_result.html?search_key=tango+dancer+figurine+argentina+souvenir&search_method=user"}},"dubrovnik-walls-adriatic":{"countryCode":"HR","country":{"en":"Croatia","es":"Croacia","ja":"クロアチア"},"cityName":"Dubrovnik","souvenir":{"name":"Lavender sachet","temuUrl":"https://www.temu.com/search_result.html?search_key=lavender+sachet+bag+souvenir&search_method=user"}},"edinburgh-castle-highlands":{"countryCode":"GB","country":{"en":"United Kingdom","es":"Reino Unido","ja":"イギリス"},"cityName":"Edinburgh","souvenir":{"name":"Scottish whisky miniature","temuUrl":"https://www.temu.com/search_result.html?search_key=scottish+whisky+miniature+bottle+souvenir&search_method=user"}},"halong-bay-emerald-waters":{"countryCode":"VN","country":{"en":"Vietnam","es":"Vietnam","ja":"ベトナム"},"cityName":"Ha Long Bay","souvenir":{"name":"Conical hat (Nón lá)","temuUrl":"https://www.temu.com/search_result.html?search_key=vietnam+conical+hat+non+la+souvenir&search_method=user"}},"havana-vintage-streets":{"countryCode":"CU","country":{"en":"Cuba","es":"Cuba","ja":"キューバ"},"cityName":"Havana","souvenir":{"name":"Vintage car model","temuUrl":"https://www.temu.com/search_result.html?search_key=classic+vintage+car+model+1950s+toy&search_method=user"}},"istanbul-two-continents":{"countryCode":"TR","country":{"en":"Turkey","es":"Turquía","ja":"トルコ"},"cityName":"Istanbul","souvenir":{"name":"Nazar evil eye charm","temuUrl":"https://www.temu.com/search_result.html?search_key=turkish+nazar+evil+eye+charm+amulet&search_method=user"}},"lisbon-seven-hills":{"countryCode":"PT","country":{"en":"Portugal","es":"Portugal","ja":"ポルトガル"},"cityName":"Lisbon","souvenir":{"name":"Azulejo tile coaster","temuUrl":"https://www.temu.com/search_result.html?search_key=portuguese+azulejo+tile+coaster+souvenir&search_method=user"}},"maldives-overwater-paradise":{"countryCode":"MV","country":{"en":"Maldives","es":"Maldivas","ja":"モルディブ"},"cityName":"Maldives","souvenir":{"name":"Tropical shell necklace","temuUrl":"https://www.temu.com/search_result.html?search_key=tropical+shell+necklace+beach+souvenir&search_method=user"}},"marrakech-medina-maze":{"countryCode":"MA","country":{"en":"Morocco","es":"Marruecos","ja":"モروッコ"},"cityName":"Marrakech","souvenir":{"name":"Moroccan lantern","temuUrl":"https://www.temu.com/search_result.html?search_key=moroccan+lantern+candle+holder+souvenir&search_method=user"}},"masai-mara-great-migration":{"countryCode":"KE","country":{"en":"Kenya","es":"Kenia","ja":"ケニア"},"cityName":"Maasai Mara","souvenir":{"name":"Wooden giraffe figurine","temuUrl":"https://www.temu.com/search_result.html?search_key=wooden+giraffe+figurine+africa+souvenir&search_method=user"}},"mexico-city-ancient-modern":{"countryCode":"MX","country":{"en":"Mexico","es":"México","ja":"メキシコ"},"cityName":"Mexico City","souvenir":{"name":"Sugar skull figurine","temuUrl":"https://www.temu.com/search_result.html?search_key=sugar+skull+calavera+figurine+day+of+dead&search_method=user"}},"mumbai-city-of-dreams":{"countryCode":"IN","country":{"en":"India","es":"India","ja":"インド"},"cityName":"Mumbai","souvenir":{"name":"Elephant figurine","temuUrl":"https://www.temu.com/search_result.html?search_key=indian+elephant+figurine+ganesha+souvenir&search_method=user"}},"prague-fairy-tale-city":{"countryCode":"CZ","country":{"en":"Czech Republic","es":"República Checa","ja":"チェコ共和国"},"cityName":"Prague","souvenir":{"name":"Bohemian crystal glass","temuUrl":"https://www.temu.com/search_result.html?search_key=bohemian+crystal+wine+glass+souvenir&search_method=user"}},"queenstown-adventure-capital":{"countryCode":"NZ","country":{"en":"New Zealand","es":"Nueva Zelanda","ja":"ニュージーランド"},"cityName":"Queenstown","souvenir":{"name":"Kiwi bird plush","temuUrl":"https://www.temu.com/search_result.html?search_key=kiwi+bird+plush+toy+new+zealand+souvenir&search_method=user"}},"rio-carnival-colours":{"countryCode":"BR","country":{"en":"Brazil","es":"Brasil","ja":"ブラジル"},"cityName":"Rio de Janeiro","souvenir":{"name":"Carnival feather mask","temuUrl":"https://www.temu.com/search_result.html?search_key=carnival+masquerade+feather+mask+brazil&search_method=user"}},"seoul-ancient-modern":{"countryCode":"KR","country":{"en":"South Korea","es":"Corea del Sur","ja":"韓国"},"cityName":"Seoul","souvenir":{"name":"Hahoetal mask","temuUrl":"https://www.temu.com/search_result.html?search_key=korean+traditional+hahoetal+mask+souvenir&search_method=user"}},"sydney-harbour-sunrise":{"countryCode":"AU","country":{"en":"Australia","es":"Australia","ja":"オーストラリア"},"cityName":"Sydney","souvenir":{"name":"Opera House model","temuUrl":"https://www.temu.com/search_result.html?search_key=sydney+opera+house+model+souvenir&search_method=user"}},"valencia-city-of-light":{"countryCode":"ES","country":{"en":"Spain","es":"España","ja":"スペイン"},"cityName":"Valencia","souvenir":{"name":"Paella pan","temuUrl":"https://www.temu.com/search_result.html?search_key=paella+pan+spanish+souvenir&search_method=user"}}};
  const locale = "ja";
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