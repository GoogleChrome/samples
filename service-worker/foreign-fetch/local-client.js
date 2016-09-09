function updateRandom() {
  fetch('https://foreign-fetch-demo.appspot.com/random')
    .then(response => response.text())
    .then(number => ChromeSamples.setStatus(`Your random number is ${number}`));
}

document.querySelector('#random').addEventListener('click', updateRandom);

updateRandom();
