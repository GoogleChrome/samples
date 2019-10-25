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

// init
const container = document.querySelector('#formcontainer');
const textcontainer = document.querySelector('#textcontainer'); 
const fontDecor = document.querySelector('.font-decorvar'); 
const fontGing = document.querySelector('.font-ging'); 
const fontAmstel = document.querySelector('.font-amstelvar'); 
let selectedElement = document.querySelector('.selected'); 


// Set style value
function setStyles (property, value) {
	return document.documentElement.querySelector(".selected").style.setProperty(property, value);
}

// Updates selected element and adds a '.selected' class.  
function updateSelectedElement (element, myClass )  {
  selectedElement = element;
  element.classList.add(myClass);
}

function addReplaceClass (fontElement, newClass, oldClass) {	
	// select elements that need a new class
	const elements = document.querySelectorAll(fontElement);

	for (let index = 0; index < elements.length; index++) {
		elements[index].classList.remove(oldClass);
		elements[index].classList.add(newClass);
	}
}

function updateInputElements(e) {
		// setting up the instances
		const rowContainer = e.target.parentNode;
		const slider = rowContainer.querySelector(".slider"); 
		const textbox = rowContainer.querySelector(".textbox");
		const styleType = slider.getAttribute("id");
		const sliderValue = e.target.value;

		// setting values
		slider.value = sliderValue;
		textbox.value = sliderValue;

		// Checks and updates the input field so they don't go over their maximum.
		const slidermax = Number(slider.getAttribute("max"));
		if (textbox.value > slidermax) {
			textbox.value = slidermax;
		}

		// updating the value attribute as well. 
		textbox.setAttribute('value', textbox.value);

		// setting the style
		setStyles(`--${styleType}`, sliderValue);
}

function updateTextBlocks (e) {
	// select currently clicked element
	let selectedElement = e.srcElement;
	const parentNode = selectedElement.parentNode; 
	
	if (parentNode.classList.contains('clickable')) {
		selectedElement = parentNode
	}

	if (selectedElement.classList.contains('clickable')) {
		addReplaceClass ('.clickable', 'unselected' , 'selected');
		updateSelectedElement(selectedElement, 'selected');
	} 

	// disable all selected items
	if (selectedElement.classList.contains('clickable')) {
		addReplaceClass ('.form-row', 'disabled' , 'enabled');
	}

	if (selectedElement.id == "font-decorvar") {	
		addReplaceClass ('.font-decorvar', 'enabled' , 'disabled');
	}

	if (selectedElement.id == "font-gingham") {	
		addReplaceClass ('.font-ging', 'enabled' , 'disabled');
	}	

	if (selectedElement.id == "font-amstelvar") {	
		addReplaceClass ('.font-amstel', 'enabled' , 'disabled');
	}	
}

window.addEventListener('load', function() {
	// Updates all inputs and their values depending on what the user has changed. 
	container.addEventListener('input', updateInputElements);

	// Updates selects and deselects textblocks
	textcontainer.addEventListener('click', updateTextBlocks);
});