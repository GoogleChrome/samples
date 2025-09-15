navigator.serviceWorker.register('serviceworker.js');

const urls = [
  'https://googlechrome.github.io/samples/pwa-testing/continuous-harvest-tomato/',
];

for (const url of urls) {
  const heading = document.createElement('h3');
  heading.textContent = url;
  document.body.appendChild(heading);

  const list = document.createElement('ul');
  document.body.appendChild(list);

  function addItem(item) {
    const li = document.createElement('li');
    li.appendChild(item);
    list.appendChild(li);
  }

  for (const target of ['_self', '_parent', '_top', '_blank', 'name']) {
    const link = document.createElement('a');
    link.textContent = `target="${target}"`;
    link.href = url;
    link.target = target;
    addItem(link);
  }

  const regularButton = document.createElement('button');
  regularButton.textContent = 'window.open(url, "target=_blank")';
  regularButton.onclick = () => {
    window.open(url, 'target=_blank');
  }
  addItem(regularButton);

  const aboutBlankButton = document.createElement('button');
  aboutBlankButton.textContent = 'window.open("about:blank", "target=_blank") -> url';
  aboutBlankButton.onclick = () => {
    window.open('about:blank', 'target=_blank').location.href = url;
  }
  addItem(aboutBlankButton);
}