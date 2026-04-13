//#region backends/base.js
var e = class {
	constructor(e) {
		this.modelName = e;
	}
	static availability(e) {
		return "available";
	}
	createSession(e, t, n) {
		throw Error("Not implemented");
	}
	async generateContent(e) {
		throw Error("Not implemented");
	}
	async generateContentStream(e) {
		throw Error("Not implemented");
	}
	async countTokens(e) {
		throw Error("Not implemented");
	}
	convertSchema(e) {
		return e;
	}
}, t = {
	firebase: { modelName: "gemini-2.5-flash-lite" },
	gemini: { modelName: "gemini-2.5-flash-lite" },
	openai: { modelName: "gpt-4o" },
	transformers: {
		modelName: "onnx-community/gemma-4-E2B-it-ONNX",
		device: "webgpu",
		dtype: "q4f16"
	}
};
//#endregion
export { e as n, t };
