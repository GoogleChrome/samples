'use strict';

const sink = {
	result: "",
	write(chunk) {
		this.result += String.fromCharCode(parseInt(chunk, 10));
	},
	close() {
		ChromeSamples.log(this.result);
	},
	abort(e) {
		ChromeSamples.log("[SINK] Error: " + e);
	}
}

const ws = new WritableStream(sink);
var msgArray = buffer("[STREAMED CONTENT]: This is only a test.");
textToStream(msgArray, ws)
	.then(() => ChromeSamples.log("All chunks written. Stream closed."))
	.catch(e => ChromeSamples.log("[STREAM] Error: " + e));

function buffer(string) {
	var utf8 = unescape(encodeURIComponent(string));

	var arr = [];
	for (var i = 0; i < utf8.length; i++) {
	    arr.push(utf8.charCodeAt(i));
	}
	return arr;
}

function textToStream(buffer, writableStream) {
	var writer = writableStream.getWriter();
	buffer.forEach(chunk => { 
		writer.write(chunk)
		.then(() => {
			ChromeSamples.log("Chunk written to sink.");
		})
		.catch(e => {
			ChromeSamples.log("[CHUNK] Error: " + e);
		});
	});
	return writer.close();
}
