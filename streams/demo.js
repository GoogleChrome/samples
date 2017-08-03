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
	const writer = writable.getWriter();
	const encoder = new TextEncoder();
	const encoded = encoder.encode(message, {stream: true});
	encoded.forEach(chunk => {
		writer.write(chunk)
		.then(() => ChromeSamples.log("Chunk written to sink. 'writer.write()` promise resolved."))
		.catch(e => ChromeSamples.log("[CHUNK] Error: " + e));
	});
	writer.close()
	.then(() => ChromeSamples.log("All chunks written. 'writer.close()` promise resolved."))
	.catch(e => ChromeSamples.log("[STREAM] Error: " + e));
}


document.querySelector('#sendMessage').addEventListener('click', function() {
	ChromeSamples.clearLog();
	let entry = document.querySelector('#input');
	sendMessage(entry.value);
	entry.value = "";
});