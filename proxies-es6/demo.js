'use strict';

// Proxying a normal object
var target = {};
var handler = {
  get(target, property, receiver) { // eslint-disable-line no-unused-vars
    return `Hello, ${property}!`;
  }
};

var myProxy = new Proxy(target, handler);
ChromeSamples.log(myProxy.folks);
// myProxy.folks would normally be undefined, but the proxied get handler provides a value.
// Outputs: Hello, folks!

// Proxying a function object
function sum(a, b) {
  return a + b;
}

var handler2 = {
  apply(target, thisArg, argumentsList) {
    ChromeSamples.log(`Calculate sum: ${argumentsList}`);
    return target.apply(thisArg, argumentsList);
  }
};

var proxy = new Proxy(sum, handler2);
ChromeSamples.log(proxy(1, 2));
// Calculate sum: 1,2
// 3

// Field interception with Proxy and the Reflect object.
//
// Reflect is a built-in object that provides methods for interceptable
// JavaScript operations. The methods are the same as those of proxy
// handlers. Reflect is not a function object, so it's not constructible.

var pioneer = new Proxy({}, {
  get(target, property, receiver) {
    ChromeSamples.log(`get called for field: ${property}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    ChromeSamples.log(`set called for field: ${property} and value: ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
});

pioneer.firstName = 'Grace';
pioneer.secondName = 'Hopper';

