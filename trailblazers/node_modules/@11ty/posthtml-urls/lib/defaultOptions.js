"use strict";
const HTTP_EQUIV = "http-equiv";
const REFRESH = "refresh";

const isHttpEquiv = ({ attrs }) => {
	return attrs && (HTTP_EQUIV in attrs) && attrs[HTTP_EQUIV].toLowerCase() === REFRESH;
};

// Fork: pruned some deprecated tag/attribute combos here.
const DEFAULT_OPTIONS = {
	filter: {
		a: { href: true, ping: true },
		area: { href: true, ping: true },
		audio: { src: true },
		base: { href: true },
		blockquote: { cite: true },
		button: { formaction: true },
		del: { cite: true },
		embed: { src: true },
		form: { action: true },
		iframe: { src: true },
		img: { src: true, srcset: true },
		input: { formaction: true, src: true },
		ins: { cite: true },
		link: { href: true },
		meta: { content: isHttpEquiv },
		object: { data: true },
		q: { cite: true },
		script: { src: true },
		source: { src: true, srcset: true },
		track: { src: true },
		// video does not yet have srcset: https://scottjehl.com/posts/using-responsive-video/
		video: { poster: true, src: true },
	},
};

module.exports = DEFAULT_OPTIONS;
