const onIntersection = (entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      const img = entry.target.querySelector('img');      
      const background = new Image();
      background.onload = () => {        
        img.classList.add('insight');
        img.style.backgroundImage = `url('${img.dataset.src}'`;        
      };      
      background.src = img.dataset.src;            
      img.classList.remove('outofsight');            
    }
  }
};

const observer = new IntersectionObserver(onIntersection);
document.querySelectorAll('li').forEach((li) => {
  observer.observe(li);
  const img = li.querySelector('img');
  img.onerror = () => { img.src = 'placeholder.svg'; };
});

window.addEventListener('load', () => {
  document.documentElement.style.setProperty('--duration', '1s');
});