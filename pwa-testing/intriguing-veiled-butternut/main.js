navigator.serviceWorker.register('serviceworker.js');

const urls = [
  'https://intriguing-veiled-butternut.glitch.me/',
  'https://octagonal-handsomely-burrito.glitch.me/',
  'http://intriguing-veiled-butternut.glitch.me/',
  'http://octagonal-handsomely-burrito.glitch.me/',
  'https://bit.ly/3YfC0xv',
  'https://bit.ly/46o4G9J',
  'https://intriguing-veiled-butternut.glitch.me/burrito',
  'https://octagonal-handsomely-burrito.glitch.me/burrito',
  'https://intriguing-veiled-butternut.glitch.me/butternut',
  'https://octagonal-handsomely-burrito.glitch.me/butternut',
  'https://intriguing-veiled-butternut.glitch.me/?burrito',
  'https://octagonal-handsomely-burrito.glitch.me/?butternut',
  'https://www.google.com',
];

let count = 2;
let i = 1;

const iframe = document.createElement("iframe");
//iframe.src = urls[0];
iframe.name = "embeddedFrame"
document.body.appendChild(iframe);


for (const url of urls) {
  const heading = document.createElement('h3');
  heading.textContent = url;
  document.body.appendChild(heading);

  const list = document.createElement('ul');
  document.body.appendChild(list);
  
  let currentList = list;
  
  function subList(name) {
    const sub = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = name;
    li.appendChild(sub);
    list.appendChild(li);
    currentList = sub;
  }
  
  function addItem(item) {
    const li = document.createElement('li');
    li.appendChild(item);
    currentList.appendChild(li);
  }

  
  for (const target of ['_self', 'embeddedFrame', '_blank', 'otherFrameName']) {
    subList("Frame: " + target);
    
    const linkNoArgs = document.createElement('a');
    linkNoArgs.textContent = `target="${target}"`;
    linkNoArgs.href = url;
    linkNoArgs.target = target;
    addItem(linkNoArgs);
    
    const link = document.createElement('a');
    link.textContent = `target="${target}" rel=opener`;
    link.href = url;
    link.target = target;
    link.rel = "opener";
    addItem(link);
    
    const link2 = document.createElement('a');
    link2.textContent = `target="${target}" rel=noopener`;
    link2.href = url;
    link2.target = target;
    link2.rel = "noopener";
    addItem(link2);
    
    const buttonNoArgs = document.createElement('button');
    buttonNoArgs.textContent = 'window.open(url)';
    buttonNoArgs.onclick = () => {
      window.open(url);
    }
    // Rough way of handling middle clicks.
    buttonNoArgs.onauxclick = () => {
      window.open(url);
    }
    addItem(buttonNoArgs);
    
    const buttonTargetOnly = document.createElement('button');
    buttonTargetOnly.textContent = 'window.open(url, "'+target+')';
    buttonTargetOnly.onclick = () => {
      window.open(url, target);
    }
    // Rough way of handling middle clicks.
    buttonTargetOnly.onauxclick = () => {
      window.open(url, target);
    }
    addItem(buttonTargetOnly);
    
    
    const button = document.createElement('button');
    button.textContent = 'window.open(url, "'+target+'", "opener")';
    button.onclick = () => {
      window.open(url, target);
    }
    // Rough way of handling middle clicks.
    button.onauxclick = () => {
      window.open(url, target);
    }
    addItem(button);
  
    const button2 = document.createElement('button');
    button2.textContent = 'window.open(url, "'+target+'", "noopener")';
    button2.onclick = () => {
      window.open(url, target, 'noopener');
    }
    // Rough way of handling middle clicks.
    button2.onauxclick = () => {
      window.open(url, target, 'noopener');
    }
    addItem(button2);
    
    const button3 = document.createElement('button');
    button3.textContent = "window.open('about:blank', '"+target+"', opener).window.location.href = " + url;
    button3.onclick = () => {
      window.open("about:blank", target).window.location.href = url;
    }
    // Rough way of handling middle clicks.
    button3.onauxclick = () => {
      window.open("about:blank", target).window.location.href = url;
    }
    addItem(button3);
    
    const button4 = document.createElement('button');
    button4.textContent = "window.open('about:blank', '"+target+"', noopener).window.location.href = " + url;
    button4.onclick = () => {
      window.open("about:blank", target, 'noopener').window.location.href = url;
    }
    // Rough way of handling middle clicks.
    button4.onauxclick = () => {
      window.open("about:blank", target, 'noopener').window.location.href = url;
    }
    addItem(button4);
    
    if(i <= count) {
     const form_link = document.createElement('a');
     form_link.textContent = `FORM target="${target}" rel=opener`;
     form_link.href = url;
     form_link.onclick = function(e) {
      const f = document.createElement('form');
      f.setAttribute('method', 'post');
      f.setAttribute('action', url);
      f.setAttribute('target', target);
      f.setAttribute('rel', 'opener');
      f.setAttribute('id', "form_opener");
      const p = document.createElement('input');
      p.setAttribute('name', 'foo');
      p.setAttribute('value', 'bar');
      f.appendChild(p);
      document.body.appendChild(f);
      f.submit();
     };
     addItem(form_link);
      
    const form_link_2 = document.createElement('a');
     form_link_2.textContent = `FORM target="${target}" rel=noopener`;
     form_link_2.href = url;
     form_link_2.onclick = function(e) {
      const f = document.createElement('form');
      f.setAttribute('method', 'post');
      f.setAttribute('action', url);
      f.setAttribute('target', target);
      f.setAttribute('rel', 'noopener');
      f.setAttribute('id', 'form_noopener');
      const p = document.createElement('input');
      p.setAttribute('name', 'foo');
      p.setAttribute('value', 'bar');
      f.appendChild(p);
      document.body.appendChild(f);
      f.submit();
     };
     addItem(form_link_2);
  }
}
// Only add form post navigations for 2 anchor links.
  i++;
}

window.navigation.addEventListener("navigate", (event) => {
  console.log("Navigation" , event.destination.url);
});