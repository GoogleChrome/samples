import "./util.js";

const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");
const compose = document.querySelector(".compose");
const messages = document.querySelector(".messages");

const virtualKeyboardSupported = "virtualKeyboard" in navigator;

form.addEventListener("submit", e => {
  e.preventDefault();
  writeMessage();
  input.focus();
  if (virtualKeyboardSupported) {
    navigator.virtualKeyboard.show();
  }  
});

const writeMessage = (safe = false) => {
  if (!input.value) {
    return;
  }
  const li = document.createElement("li");
  li.classList.add("me");
  safe ? (li.innerHTML = input.value) : (li.textContent = input.value);
  ul.append(li);
  li.scrollIntoView();
  input.value = "";

  setTimeout(() => {
    const li = document.createElement("li");
    li.classList.add("them");
    li.textContent = ["LOL, yeah!", "What?", "No way.", "Awesome!!1!"][
      Math.floor(Math.random() * 4)
    ];
    ul.append(li);
    li.scrollIntoView();
  }, Math.floor(Math.random() * 3 + 1) * 500);
};

if (!virtualKeyboardSupported) {
  ul.innerHTML = "";
  input.value = "😔 Your device does not support the VirtualKeyboard API.";
  writeMessage();
} else {
  navigator.virtualKeyboard.overlaysContent = true;

  let previousWidth;
  let previousHeight;

  navigator.virtualKeyboard.addEventListener("geometrychange", e => {    
    let { x, y, width, height } = e.target.boundingRect;
    x = Math.abs(x);
    y = Math.abs(y);
    width = Math.abs(width);
    height = Math.abs(height);
    if (previousWidth === width && previousHeight === height) {
      return;
    }
    previousWidth = width;
    previousHeight = height;
    input.value = `⌨️ geometrychange<br>x: ${x} y: ${y} width: ${width} height: ${height}`;
    writeMessage(true);
  });
}

ul.hidden = false;
