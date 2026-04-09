(function () {
  const canvas = document.getElementById('tshirt-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;   // 300
  const H = canvas.height;  // 340

  // ── Print area (percentages tuned to the chest of the t-shirt photo)
  // The source image is cropped via drawImage: sx=40, sy=80, sw=520, sh=520
  // Chest print zone in original 600×600: ~x225-375, y200-330
  // Mapped to 300×340 canvas with scale 300/520, 340/520:
  const PX = Math.round(W * 0.34);   // ≈ 102
  const PY = Math.round(H * 0.23);   // ≈ 78
  const PW = Math.round(W * 0.32);   // ≈ 96
  const PH = Math.round(H * 0.28);   // ≈ 95
  const PR = 5;                       // corner radius of print area

  let origPixels = null;   // raw RGBA from t-shirt (at canvas res)
  let maskPixels = null;   // raw RGBA from luminance matte mask
  let tshirtReady = false;
  let maskReady = false;
  let heroImgEl = null;
  let currentColor = [255, 255, 255]; // white (default)

  // ── Helpers ──────────────────────────────────────────────────────────
  function hexToRgb(hex) {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y,     x + w, y + r,     r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x,      y + h, x,      y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x,      y,     x + r,  y,         r);
    ctx.closePath();
  }

  // ── Load t-shirt ──────────────────────────────────────────────────────
  const tshirtImg = new Image();
  tshirtImg.onload = function () {
    // Draw cropped t-shirt (sx=40,sy=80,sw=520,sh=520) to canvas
    const tmp = document.createElement('canvas');
    tmp.width  = W;
    tmp.height = H;
    const tc = tmp.getContext('2d');
    tc.drawImage(tshirtImg, 40, 80, 520, 520, 0, 0, W, H);
    origPixels = tc.getImageData(0, 0, W, H).data;
    tshirtReady = true;
    render();
  };
  tshirtImg.src = '/samples/trailblazers/dist/img/tshirt.jpg';

  // ── Load mask ─────────────────────────────────────────────────────────
  const maskImg = new Image();
  maskImg.onload = function () {
    // The mask is 2048×2048; tshirt source is 600×600.
    // Apply the same proportional crop so mask aligns with the t-shirt.
    const scale = maskImg.naturalWidth / 600;
    const tmp = document.createElement('canvas');
    tmp.width  = W;
    tmp.height = H;
    const tc = tmp.getContext('2d');
    tc.drawImage(
      maskImg,
      Math.round(40 * scale), Math.round(80 * scale),
      Math.round(520 * scale), Math.round(520 * scale),
      0, 0, W, H
    );
    maskPixels = tc.getImageData(0, 0, W, H).data;
    maskReady = true;
    render();
  };
  maskImg.src = '/samples/trailblazers/dist/img/t-shirt-mask.png';

  // ── Load hero image ───────────────────────────────────────────────────
  function loadHeroImage(src) {
    return new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // ── Render ────────────────────────────────────────────────────────────
  function render() {
    if (!tshirtReady || !origPixels) return;

    const [cr, cg, cb] = currentColor;
    const out = ctx.createImageData(W, H);
    const d   = out.data;

    for (let i = 0; i < origPixels.length; i += 4) {
      const r = origPixels[i], g = origPixels[i + 1], b = origPixels[i + 2];
      const brightness = Math.max(r, g, b);
      const chroma     = brightness - Math.min(r, g, b);

      // Detect t-shirt fabric: bright AND near-grey (low saturation)
      if (chroma < 50 && brightness > 185) {
        // Multiply-blend with chosen colour to re-colour the fabric
        d[i]     = Math.round(r * cr / 255);
        d[i + 1] = Math.round(g * cg / 255);
        d[i + 2] = Math.round(b * cb / 255);
        d[i + 3] = 255;
      } else {
        // Background / skin → transparent
        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.putImageData(out, 0, 0);

    // ── Draw hero image in print area ────────────────────────────────
    if (heroImgEl) {
      ctx.save();
      roundRectPath(ctx, PX, PY, PW, PH, PR);
      ctx.clip();

      // Cover-fit the hero image into the print area
      const iAR = heroImgEl.naturalWidth  / heroImgEl.naturalHeight;
      const pAR = PW / PH;
      let sx = 0, sy = 0, sw = heroImgEl.naturalWidth, sh = heroImgEl.naturalHeight;
      if (iAR > pAR) {
        sw = sh * pAR;
        sx = (heroImgEl.naturalWidth - sw) / 2;
      } else {
        sh = sw / pAR;
        sy = (heroImgEl.naturalHeight - sh) / 2;
      }
      ctx.drawImage(heroImgEl, sx, sy, sw, sh, PX, PY, PW, PH);
      ctx.restore();

      // ── Fabric texture overlay: softly blend t-shirt brightness
      // over the print area so the photo looks printed on fabric
      const patch = ctx.getImageData(PX, PY, PW, PH);
      const cd    = patch.data;
      const strength = 0.18;
      for (let row = 0; row < PH; row++) {
        for (let col = 0; col < PW; col++) {
          const ci = (row * PW + col) * 4;
          const oi = ((PY + row) * W + (PX + col)) * 4;
          // Normalised brightness of original t-shirt pixel (0-1)
          const tb = origPixels[oi] / 255;
          cd[ci]     = Math.round(cd[ci]     * (1 - strength + strength * tb));
          cd[ci + 1] = Math.round(cd[ci + 1] * (1 - strength + strength * tb));
          cd[ci + 2] = Math.round(cd[ci + 2] * (1 - strength + strength * tb));
        }
      }
      ctx.putImageData(patch, PX, PY);
    }
  }

  // ── Colour swatch clicks ──────────────────────────────────────────────
  document.querySelectorAll('.tshirt-widget .tshirt-swatch').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.tshirt-widget .tshirt-swatch')
        .forEach((s) => s.classList.remove('active'));
      el.classList.add('active');
      currentColor = hexToRgb(el.dataset.color);
      render();
    });
  });

  // ── Init ──────────────────────────────────────────────────────────────
  (async function init() {
    // Find first content image (the post's hero photo)
    const heroEl = document.querySelector('heading-anchors p img');
    if (heroEl) {
      const src = heroEl.currentSrc || heroEl.src;
      heroImgEl = await loadHeroImage(src);
    }
    render();
  })();
})();
(function() {
    const shareButtons = document.querySelectorAll('.share-button');
    if (!navigator.share || shareButtons.length === 0) return;

    const footerShare = document.querySelector('.post-share-footer');
    if (footerShare) footerShare.style.display = 'block';

    const onShare = async () => {
      const title = "Seoul: Where Ancient Palaces Meet Neon Futures";
      const text = "Seoul is the city that reinvented itself without forgetting where it came from — a five-thousand-year-old culture running at full digital speed." || title;
      const url = window.location.href;
      const shareData = { title, text, url };

      // Try to find the hero image (first img in main)
      // We look for images that are likely from the blog content
      const firstImg = document.querySelector('main heading-anchors img');
      if (firstImg && firstImg.src) {
        try {
          const response = await fetch(firstImg.src);
          const blob = await response.blob();
          
          // Determine extension from mime type
          let extension = blob.type.split('/')[1] || 'jpg';
          if (extension === 'jpeg') extension = 'jpg';
          
          const file = new File([blob], `hero.${extension}`, { type: blob.type });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch (e) {
          console.warn('Could not fetch image for sharing:', e);
        }
      }

      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    };

    shareButtons.forEach(btn => {
      btn.style.display = 'inline-flex';
      btn.addEventListener('click', onShare);
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