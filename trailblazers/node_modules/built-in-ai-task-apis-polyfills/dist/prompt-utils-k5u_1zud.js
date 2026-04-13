//#region prompt-utils.js
function e(e, t, n, r) {
	if (!(typeof t == "string" ? e.includes(t) : e.search(t) !== -1)) throw Error(`Prompt template substitution failed for "${r}"`);
	return e.replace(t, n);
}
//#endregion
export { e as t };
