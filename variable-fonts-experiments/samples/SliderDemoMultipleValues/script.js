/*
	Copyright 2018 Google Inc. All Rights Reserved.
	Licensed under the Apache License, Version 2.0 
	(the "License"); you may not use this file 
	except in compliance with the License.
	You may obtain a copy of the License at
	http://www.apache.org/licenses/LICENSE-2.0
	Unless required by applicable law or agreed to 
	in writing, software distributed under the License
	is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
	either express or implied.
	See the License for the specific language governing
	permissions and limitations under the License.
	Licensed under the Apache License, 
	Version 2.0 (the "License");
*/
'use strict';

//todu:
// change var to const or let.

// queryselect on parent then go down . 

// init
const container = document.querySelector('#formcontainer');
const textcontainer = document.querySelector('#textcontainer'); 

let selectedElement = document.querySelector('.selected'); 
let sliderWidth = document.documentElement.querySelector('#wdth');
let sliderWidthInput = sliderWidth.nextSibling.nextSibling
let slidersWeight = document.documentElement.querySelector('#wght');
let sliderWeightInput = slidersWeight.nextSibling.nextSibling


function setStyles (property, value) {
	return document.documentElement.querySelector(".selected").style.setProperty(property, value);
}

// get style value
function getStyles (element, value) {
	return getComputedStyle(element).getPropertyValue(value).trim()
}

// Adding a CSS class
// adapted from - https://www.sitepoint.com/add-remove-css-class-vanilla-js/
function addClass (element, myClass )  {
  // get all elements that match our selector
  element.classList.add(myClass);
  selectedElement = element;
}

function removeClass (selector, myClass, oldClass) {
  // get all elements that match our selector
  let elements = document.querySelectorAll(selector);
  
  // remove and reset class from all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.remove(myClass);
    elements[i].classList.add(oldClass);
  }
}

function updateSliderAndInput (element) {
	sliderWidth.value = getStyles(element, '--wdth');
	sliderWidthInput.value = sliderWidth.value
	slidersWeight.value = getStyles(element, '--wght');
	sliderWeightInput.value = sliderWidth.value
}

window.addEventListener('load', function() {

	container.addEventListener('input', function(e) {		
		// setting up the instances
		let slider = e.target;
		let textbox = slider.nextSibling.nextSibling;
		let styleType = e.srcElement.id;

		// conntecting the inputs values
		let sliderValue = slider.value;
		textbox.value = sliderValue; 

		// setting the style
		setStyles("--"+styleType, sliderValue);
	});

	textcontainer.addEventListener('click', function(e) {
		let theElement = e.srcElement;
		let slidersWidthValue = getStyles(theElement, '--wdth');
		let slidersWeightValue = getStyles(theElement, '--wght');
		

		updateSliderAndInput(theElement);
		
		if (theElement.classList.contains('clickable')) {
			removeClass( '.clickable', 'selected', 'unselected');
			addClass(theElement, 'selected');
		}
		
	});
});