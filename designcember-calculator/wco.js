const meta = document.querySelector('meta[name="theme-color"]');
const nodes = document.querySelectorAll(
  "#calc_display_surface, #calc_solar_cell, #calc_outside, #calc_inside"
);

const toggleWCO = () => {
  if (!navigator.windowControlsOverlay.visible) {
    meta.content = "";
  } else {
    meta.content = "#385975";
  }
  nodes.forEach(node => {
    node.classList.toggle("wco", navigator.windowControlsOverlay.visible);
  });
};

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

navigator.windowControlsOverlay.ongeometrychange = debounce(e => {
  toggleWCO();
}, 250);

toggleWCO();