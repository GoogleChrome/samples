const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

document.documentElement.style.setProperty(
  "--100vh",
  `${window.innerHeight}px`
);

window.addEventListener(
  "resize",
  debounce(() => {
    document.documentElement.style.setProperty(
      "--100vh",
      `${window.innerHeight}px`
    );
  }, 100)
);
