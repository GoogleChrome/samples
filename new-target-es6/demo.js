'use strict';
class Parent {
  constructor() {
    // new.target is a constructor reference, and new.target.name is human-friendly name.
    /* jshint ignore:start */
    ChromeSamples.log('Hello from Parent! ' +
      'I was constructed via new ' + new.target.name + '()');
    /* jshint ignore:end */
  }
}

class FirstChild extends Parent {}

class SecondChild extends Parent {}

function notAConstructor() {
  /* jshint ignore:start */
  ChromeSamples.log('Hello from notAConstructor()! My new.target is ' +
    new.target);
  /* jshint ignore:end */
}

// Call all the constructors and the function when the page loads.
new Parent();
new FirstChild();
new SecondChild();
notAConstructor();
