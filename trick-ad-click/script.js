

const iframes = document.querySelectorAll('iframe');

document.querySelectorAll('figure').forEach((figure, i) => figure.addEventListener('click', () => {
  alert(i === 0 ? '🐈 Here is your cat video!' : '🐶 Here is your puppy video!');
}));

document.querySelector('input').addEventListener('input', (e) => {  
  iframes.forEach(iframe => iframe.classList.toggle('animate')); 
});