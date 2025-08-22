import {clearCanvas, colorInput} from './script.mjs';

const BLACK = '#000000';
const WHITE = '#ffffff';

const darkModeMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
let darkMode = darkModeMediaQueryList.matches;
let canvasBackground = darkMode ? BLACK : WHITE;
let canvasColor = darkMode ? WHITE : BLACK;
darkModeMediaQueryList.addListener(() => {  
  darkMode = darkModeMediaQueryList.matches;  
  canvasBackground = darkMode ? BLACK : WHITE;
  canvasColor = darkMode ? WHITE : BLACK;
  colorInput.value = canvasColor;
  clearCanvas(canvasBackground);
});

export {canvasBackground, canvasColor};
