'use strict';

let result;
function getWritableStream(queuingStrategy) {
	const decoder = new TextDecoder("utf-8");
	result = "";
	return new WritableStream({
		// Implement the sink
		write(chunk) {
			return new Promise((resolve, reject) => {
				let buffer = new ArrayBuffer(2);
				let view = new Uint16Array(buffer);
				view[0] = chunk;
				let decoded = decoder.decode(view, {stream: true});
				ChromeSamples.log("Chunk decoded: " + decoded);
				result += decoded
				resolve();
			});
		},
		close() {
			result = "[MESSAGE RECEIVED] " + result;
			ChromeSamples.log(result);
		},
		abort(e) {
			ChromeSamples.log("[SINK] Error: " + e);
		}
	}, queuingStrategy);
}

function sendMessage(message) {
	// defaultWriter is of type WritableStreamDefaultWriter
	const defaultWriter = writable.getWriter();
	const encoder = new TextEncoder();
	const encoded = encoder.encode(message, {stream: true});
	encoded.forEach(chunk => {
		defaultWriter.ready
		.then(() => {
			defaultWriter.write(chunk)
			.then(() => ChromeSamples.log("Chunk written to sink. 'defaultWriter.write()' promise resolved."))
			.catch(e => ChromeSamples.log("[CHUNK] Error: " + e));
		});
	})
	// Calling ready insures that all chunks are written to the sink before the writer is closed.
	defaultWriter.ready
	.then(() => {
		defaultWriter.close()
		.then(() => ChromeSamples.log("All chunks written. 'defaultWriter.close()' promise resolved."))
		.catch(e => ChromeSamples.log("[STREAM] Error: " + e));
	});
}

let writable;
document.querySelector('#sendMessage').addEventListener('click', function() {
	// Clear the output from the previous call to sendMessage().
	ChromeSamples.clearLog();
	// Streams are only meant be used once. Get a stream for each message.
	writable = getWritableStream(new CountQueuingStrategy({highWaterMark: 1}));
	let message = document.querySelector('#input');
	sendMessage(message.value);
	message.value = "";
})