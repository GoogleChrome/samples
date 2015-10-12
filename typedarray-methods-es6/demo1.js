Uint8Array.from(new Set([1, 1, 2, 3]));         // [1, 2, 3]
Uint8Array.from('hello');                       // [0, 0, 0, 0, 0]
Uint8Array.from('hello', x => x.charCodeAt(0)); // [104, 101, 108, 108, 111]
