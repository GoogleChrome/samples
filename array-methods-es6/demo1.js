Array.from(new Set([1, 1, 2, 3]));         // [1, 2, 3]
Array.from('hello');                       // ["h", "e", "l", "l", "o"]
Array.from('hello', x => x.charCodeAt(0)); // [104, 101, 108, 108, 111]
