const canvas = document.querySelector('canvas');
const colorInput = document.querySelector('#color');
const clearButton = document.querySelector('#clear');
const ephemeralInput = document.querySelector('#ephemeral');
const ephemeralLabel = document.querySelector('label[for="ephemeral"]');
const toolbar = document.querySelector('.toolbar');

let CANVAS_BACKGROUND = null;
let CANVAS_COLOR = null;

const loadDarkMode = async () => {
  if (window.matchMedia('(prefers-color-scheme)').matches !== 'not all') {
    ({canvasBackground: CANVAS_BACKGROUND, canvasColor: CANVAS_COLOR} = await import('./dark_mode.mjs'));
  } else {
    CANVAS_BACKGROUND = '#ffffff';
    CANVAS_COLOR = '#000000';
  }
};  

const ctx = canvas.getContext('2d', {
  alpha: false,
  desynchronized: true,
});

let curX = null;
let curY = null;
let pressed = false;
const Two_π = 2 * Math.PI;
const floor = Math.floor;

const clearCanvas = (colorOrEvent = CANVAS_BACKGROUND) => {    
  if (typeof colorOrEvent === 'string') {
    CANVAS_BACKGROUND = colorOrEvent;
  }
  ctx.fillStyle = CANVAS_BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colorInput.value;
};
clearButton.addEventListener('click', clearCanvas);

colorInput.addEventListener('input', () => {
  ctx.fillStyle = colorInput.value;
});

canvas.addEventListener('pointerdown', ({offsetX, offsetY}) => {
  curX = floor(offsetX);
  curY = floor(offsetY);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  pressed = true;
});

const pointerMove = ({offsetX, offsetY}) => {    
  curX = floor(offsetX);
  curY = floor(offsetY);    
};

const pointerUp = () => {
  pressed = false;
  canvas.removeEventListener('pointermove', pointerMove);
  canvas.removeEventListener('pointerup', pointerUp);
};

const draw = () => {
  if (pressed) {    
    ctx.beginPath();
    ctx.arc(
      curX,
      curY,
      25,
      0,
      Two_π
    );
    ctx.fill();
  }
  requestAnimationFrame(draw);
};

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - toolbar.offsetHeight;  
};

const getImageData = () => {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const putImageData = (imageData) => {
  ctx.putImageData(imageData, 0, 0);
};

(async () => {    
  await loadDarkMode();
  colorInput.value = CANVAS_COLOR;
  ctx.fillStyle = CANVAS_COLOR;
  resizeCanvas();
  clearCanvas();
  draw();
})();

let debounce = null;
window.addEventListener('resize', () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {      
    const imageData = getImageData();
    resizeCanvas();
    clearCanvas();
    putImageData(imageData);
    debounce = null;
  }, 250);
});

/* 🐡 Fugu features */ 

const loadIdleDetection = async () => {
  if ('IdleDetector' in window) {    
    import('./idle_detection.mjs');
  } else {
    document.querySelector('#nosupport').style.display = 'block';
  }
};

const loadPWACompat = () => {
  if (/\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)) {
    import('https://unpkg.com/pwacompat');
  }
}

(async () => {
  await Promise.all([    
    loadIdleDetection(),
  ]);
})();

export {
  // UI elements:
  colorInput,
  ephemeralInput,
  ephemeralLabel,
  // Functions:
  clearCanvas,
};
