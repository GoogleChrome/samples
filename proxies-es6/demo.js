'use strict';

// Proxying a normal object
var target = {};
var handler = {
  get(receiver, name = 'world') {
    return `Hello, ${name}!`;
  }
};

var p = new Proxy(target, handler);
ChromeSamples.log(p.folks);

// Proxying a function object
function sum(a, b) {
  return a + b;
}

var handler2 = {
  apply: function(target, thisArg, argumentsList) {
    console.log(`Calculate sum: ${argumentsList}`);
    return target.apply(thisArg, argumentsList);
  }
};

var proxy = new Proxy(sum, handler2);
ChromeSamples.log(proxy(1, 2));

// Field interception with Proxy and the Reflect API
var pioneer = new Proxy({}, {
  get: function(target, name, receiver) {
    ChromeSamples.log(`get called for field: ${name}`);
    return Reflect.get(target, name, receiver);
  },
  set: function(target, name, value, receiver) {
    ChromeSamples.log(`set called for field: ${name}, and value: ${value}`);
    return Reflect.set(target, name, value, receiver);
  }
});

pioneer.firstName = 'Grace';
pioneer.secondName = 'Hopper';

