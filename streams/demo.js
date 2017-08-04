'use strict';

let result = "";
const decoder = new TextDecoder("utf-8");
const writable = new WritableStream({
	write(chunk) {
		let buffer = new ArrayBuffer(2);
		let view = new Uint16Array(buffer);
		view[0] = chunk;
		let decoded = decoder.decode(view, {stream: true});
		ChromeSamples.log("Chunk decoded: " + decoded);
		result += decoded
	},
	close() {
		result = "[MESSAGE RECEIVED] " + result;
		ChromeSamples.log(result);
	},
	abort(e) {
		ChromeSamples.log("[SINK] Error: " + e);
	}
});

function sendMessage(message) {
	// defaultWriter is of type WritableStreamDefaultWriter
	const defaultWriter = writable.getWriter();
	const encoder = new TextEncoder();
	const encoded = encoder.encode(message, {stream: true});
	defaultWriter.ready
	.then(() => {
		encoded.forEach(chunk => {
			defaultWriter.write(chunk)
			.then(() => ChromeSamples.log("Chunk written to sink. 'defaultWriter.write()` promise resolved."))
			.catch(e => ChromeSamples.log("[CHUNK] Error: " + e));
		});
		defaultWriter.close()
		.then(() => ChromeSamples.log("All chunks written. 'defaultWriter.close()` promise resolved."))
		.catch(e => ChromeSamples.log("[STREAM] Error: " + e));
	});
}


document.querySelector('#sendMessage').addEventListener('click', function() {
	ChromeSamples.clearLog();
	let entry = document.querySelector('#input');
	sendMessage(entry.value);
	entry.value = "";
});