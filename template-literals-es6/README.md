
Template Literals (ES6) Sample
===

See https://googlechrome.github.io/samples/template-literals-es6/index.html for a live demo.

Learn more at https://www.chromestatus.com/features/4743002513735680



Tagged template strings

A more advanced form of template strings are tagged template strings. With
them you are able to modify the output of template strings using a function.
The first argument contains an array of string literals ("Hello " and " world" in this example).
The second, and each argument after the first one, are the values of the processed (or sometimes called cooked)
substitution expressions ("15" and "50" here). In the end, your function returns your manipulated string.

var a = 5;
var b = 10;

function tag(strings, ...values) {
  console.log(strings[0]); // "Hello "
  console.log(strings[1]); // " world"
  console.log(values[0]);  // 15
  console.log(values[1]);  // 50

  return "Bazinga!";
}

tag`Hello ${ a + b } world ${ a * b}`;
// "Bazinga!"



