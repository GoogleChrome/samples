// ES2015 destructuring assignment lets you extract data from arrays or objects
// using a syntax similar to the construction of array and object literals
var cats = ['😹', '🙀', '😻'];
var catAges = {sam: 12, passy: 14, surma: 16};

// Access the first three items of an array in ES5
var one = cats[0];
var two = cats[1];
var three = cats[2];
ChromeSamples.log(one, two, three);

// Destructure the array in ES2015
var [a, b, c] = cats;
ChromeSamples.log(a, b, c);

// Destructure an array omitting certain values
var [x, , y] = cats;
ChromeSamples.log(x, y);

// Destructure an array using the ES2015 rest operator
var [kitty, ...otherKitties] = cats;
ChromeSamples.log(kitty, otherKitties);

// Destructure an object
var {passy, surma} = catAges;
ChromeSamples.log(passy, surma);

// Destructure an object, binding variables to different properties
var {sam: cat1, passy: cat2, surma: cat3} = catAges;
ChromeSamples.log(cat1, cat2, cat3);

// Default values for function object parameters
var request = ({
  url: url = 'github.com', crossDomain: crossDomain = true},
  ...data) => {
  ChromeSamples.log(`url: ${url}, crossDomain: ${crossDomain}, data: ${data}`);
};

request({url: 'thecatapi.com'}, 'cute', 'kittens');
