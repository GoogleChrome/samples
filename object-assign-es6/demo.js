'use strict';

// Merge an object
let first = {name: 'Tony'};
let last = {lastName: 'Stark'};
let person = Object.assign(first, last);
ChromeSamples.log(person);
// {name: 'Tony', lastName: 'Stark'}
ChromeSamples.log(first);
// first = {name: 'Tony', lastName: 'Stark'} as the target also changed

// Merge multiple sources
let a = Object.assign({foo: 0}, {bar: 1}, {baz: 2});
ChromeSamples.log(a);
// {foo: 0, bar: 1, baz: 2}

// Merge and overwrite equal keys
let b = Object.assign({foo: 0}, {foo: 1}, {foo: 2});
ChromeSamples.log(b);
// {foo: 2}

// Clone an object
let obj = {person: 'Thor Odinson'};
let clone = Object.assign({}, obj);
ChromeSamples.log(clone);
// {person: 'Thor Odinson'}
