ChromeSamples.log('Creating, using, and iterating over a Set:');
var randomIntegers = new Set();
// Generate a random integer in the range [1..10] five times,
// and use a Set to keep track of the distinct integers that were generated.
for (var i = 0; i < 5; i++) {
  randomIntegers.add(Math.floor(Math.random() * 10) + 1);
}

ChromeSamples.log(randomIntegers.size, 'distinct integers were generated.');
ChromeSamples.log('The number 10 was ' +
  (randomIntegers.has(10) ? '' : 'not ') + 'one of them.');
ChromeSamples.log('Here\'s all of them:');

// Use for...of to iterate over the items in the Set.
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iteration-statements
// The Set iterator yields a single value corresponding to each entry in the Set.
for (var integer of randomIntegers) {
  ChromeSamples.log(integer);
}

ChromeSamples.log('\nCreating and iterating over a Map:');
// Maps can be initialized by passing in an iterable value (https://people.mozilla.org/~jorendorff/es6-draft.html#sec-map-iterable)
// Here, we use an Array of Arrays to initialize. The first value in each sub-Array is the new
// Map entry's key, and the second is the item's value.
var typesOfKeys = new Map([
  ['one', 'My key is a string.'],
  ['1', 'My key is also a string'],
  [1, 'My key is a number'],
  [document.querySelector('#log'), 'My key is an object']
]);
// You can also call set() to add new keys/values to an existing Map.
typesOfKeys.set('!!!!', 'My key is excited!');

// Use for...of to iterate over the items in the Map.
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iteration-statements
// There are several types of Map iterators available.
// typesOfKeys.keys() can be used to iterate over just the keys:
ChromeSamples.log('Just the keys:');
for (var key of typesOfKeys.keys()) {
  ChromeSamples.log('  key: ', key);
}

// typesOfKeys.values() can be used to iterate over just the values:
ChromeSamples.log('Just the values:');
for (var value of typesOfKeys.values()) {
  ChromeSamples.log('  value: ', value);
}

// The default Map iterator yields an Array with two items; the first is the Map entry's key and the
// second is the Map entry's value. This default iterator is equivalent to typesOfKeys.entries().
ChromeSamples.log('Keys and values:');
// Alternative, ES6-idiomatic syntax currently supported in Safari & Firefox:
// for ([key, value] of typesOfKeys) { ... }
for (var item of typesOfKeys) {
  ChromeSamples.log('  ', item[0], ' -> ', item[1]);
}
