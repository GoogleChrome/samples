// The Old ES5 way
function listAnimals() {
  var animals = Array.prototype.slice.call(arguments);
  animals.forEach(function(animal) {
    ChromeSamples.log(animal);
  });
}

listAnimals('🐯', '🐰', '🐘', '🐴', '🐥');

// New ES2015 way
// This allows you to just define a rest parameter, a real array
// which is a snapshot of the arguments passed to the function

function listAnimalsES2015(...animals) {
  animals.forEach(function(animal) {
    ChromeSamples.log(animal);
  });
}

listAnimalsES2015('🐯', '🐰', '🐘', '🐴', '🐥');

// This approach becomes even simpler with ES2015 fat arrows
function listAnimalsArrows(...animals) {
  animals.forEach(animal => ChromeSamples.log(animal));
}

listAnimalsArrows('🐯', '🐰', '🐘', '🐴', '🐥');

// Get the count of elements using the length property
function countArguments(...theArgs) {
  ChromeSamples.log(theArgs.length);
}

countArguments();  // 0
countArguments('🐩'); // 1
countArguments('🐩', '🐘', '🐥'); // 3

// Collect arguments from the second one to the end

function multiply(multiplier, ...theArgs) {
  return theArgs.map(function(element) {
    return multiplier * element;
  });
}

var arr = multiply(2, 1, 2, 3);
ChromeSamples.log(arr);

// Use the Array methods on rest parameters, but not
// on the arguments object

function sortRestArgs(...theArgs) {
  var sortedArgs = theArgs.sort();
  return sortedArgs;
}

ChromeSamples.log(sortRestArgs(5, 3, 7, 1)); // shows 1,3,5,7

function sortArguments() {
  var sortedArgs = arguments.sort();
  return sortedArgs; // this will never happen
}

// throws a TypeError: arguments.sort is not a function
try {
  ChromeSamples.log(sortArguments(5, 3, 7, 1));
} catch (error) {
  ChromeSamples.log(error.message);
}

/*
We could alternatively have used Array.from here:

function sortArguments() {
  return Array.from(arguments).sort();
};
 */
