'use strict';

let result = "";
const decoder = new TextDecoder("utf-8");
const writable = new WritableStream({
	write(chunk) {
		let buffer = new ArrayBuffer(2);
		let view = new Uint16Array(buffer);
		view[0] = chunk;
		let decoded = decoder.decode(view, {stream: true});
		ChromeSamples.log(decoded);
		result += decoded
	},
	close() {
		ChromeSamples.log(result);
	},
	abort(e) {
		ChromeSamples.log("[SINK] Error: " + e);
	}
});

const message = "[STREAMED CONTENT]: This is only a test.";
textToStream(message, writable)
	.then(() => ChromeSamples.log("All chunks written. Stream closed."))
	.catch(e => ChromeSamples.log("[STREAM] Error: " + e));

function textToStream(message, writableStream) {
	const writer = writableStream.getWriter();
	const encoder = new TextEncoder();
	const encoded = encoder.encode(message, {stream: true});
	encoded.forEach(chunk => {
		writer.write(chunk)
		.then(() => ChromeSamples.log("Chunk written to sink."))
		.catch(e => ChromeSamples.log("[CHUNK] Error: " + e));
	});
	return writer.close();
}
