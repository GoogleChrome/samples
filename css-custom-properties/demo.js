'use strict';

// Auxiliary method. Retrieves and sanitises the value of a custom property.
var getVariable = function(styles, propertyName) {
  return String(styles.getPropertyValue(propertyName)).trim();
};

// Auxiliary method. Sets the value of a custom property at the document level.
var setDocumentVariable = function(propertyName, value) {
  document.documentElement.style.setProperty(propertyName, value);
};

// Sets the document color scheme to the color scheme of the clicked element.
// This illustrates how it's easy to make a change affecting a large number of
// elements by simply changing a few custom properties.
var chooseDefaultColor = function(event) {
  // Get the styles for the event target (the clicked button), so we can see
  // what its custom properties are set to.
  var styles = getComputedStyle(event.target);

  // Get the values for the button's colours...
  var primary = getVariable(styles, '--primary-color');
  var text = getVariable(styles, '--primary-color-text');
  // ... and apply them to the document.
  setDocumentVariable('--primary-color', primary);
  setDocumentVariable('--primary-color-text', text);
};

// Initialise page controls.
window.addEventListener('load', function() {
  // Get the styles for the document.
  // This is where we've chosen to store all the global variables we use.
  var styles = getComputedStyle(document.documentElement);

  var quantum = document.getElementById('quantum');
  var gutter = document.getElementById('gutter');
  var columns = document.getElementById('columns');

  // Set up event handlers for buttons.
  var buttons = document.querySelectorAll('.picker-button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', chooseDefaultColor);
  }

  // Retrieve initial custom property values and update controls.
  quantum.value = getVariable(styles, '--spacing-unit').replace('px', '');
  gutter.value = getVariable(styles, '--margins');
  columns.value = getVariable(styles, '--grid-columns');

  // Set up event handlers for having the sliders update the custom properties
  // at the document level.
  quantum.addEventListener('input', function() {
    setDocumentVariable('--spacing-unit', quantum.value + 'px');
  });

  gutter.addEventListener('input', function() {
    setDocumentVariable('--margins', gutter.value);
  });

  columns.addEventListener('input', function() {
    setDocumentVariable('--grid-columns', columns.value);
  });
});
