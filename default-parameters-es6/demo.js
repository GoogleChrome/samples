// Supply default values for parameters

// Before, using ES5...
function greetES5(message, to) {
  // Test parameter values in the function body, specifying a default
  to = to || 'DOM';
  // OR if (typeof to === undefined) { to = 'DOM'; }
  // OR if (arguments.length === 1) { to = 'DOM'; }
  ChromeSamples.log(message + ', ' + to);
}
greetES5('Good morning');
greetES5('Sup', 'CSS');

// After using ES2015/ES6...
// Define default parameter values in the function head
function greet(message, to = 'DOM') {
  ChromeSamples.log(message + ', ' + to);
}

greet('Good morning');
greet('Sup', 'CSS');

// Another example
function f(x, y = 12) {
  // y is 12 if not passed (or passed as undefined)
  ChromeSamples.log(`${x} + ${y} = ${x + y}`);
}

f(3);

// Here, the default parameter won't be used since we're passing in a value, even though 0 is false-y.
f(7, 0);

// For more info, read: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#Passing_undefined

// Default arguments are evaluated at call time. This means
// a new array is created each time the function is called here:
function append(value, array = []) {
  array.push(value);
  ChromeSamples.log(array);
}

append(1);
append(2); // [2] instead of [1, 2]
// For more info, read: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#Evaluated_at_call_time
