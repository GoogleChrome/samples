'use strict';

var a = 'somestring';
var b = 5;
var c = {key: 'value'};

// The following two declarations are equivalent:
var es5 = {a: a, b: b, c: c};
var es6 = {a, b, c}; // Property name is inferred from variable name
ChromeSamples.log('es5:', es5);
ChromeSamples.log('es6:', es6);

function person(name, age) {
  return {name, age}; // Again, property name is inferred
}

var me = person('Alex', 26);
ChromeSamples.log('me:', me);

var tools = {
  add1(i) { // You don’t have to type `function` over and over
    return i + 1;
  },
  * countdown(i) { // also works with generators
    while (i > 0) {
      yield i--;
    }
  }
};
ChromeSamples.log('If you add1() to 5 you get', tools.add1(5));
