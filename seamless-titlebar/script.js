if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* Handle buttons. */

document
  .getElementById("min-button")
  .addEventListener("click", async (event) => {
    await window.minimize();
  });

document
  .getElementById("max-button")
  .addEventListener("click", async (event) => {
    await window.maximize();
  });

document
  .getElementById("restore-button")
  .addEventListener("click", async (event) => {
    await window.restore();
  });

document.getElementById("close-button").addEventListener("click", (event) => {
  window.close();
});

// For accessibility this makes the tabbable windowing controls
// "clickable" with enter.
document.addEventListener("keydown", function (e) {
  if (e.code == "Enter" || e.code == "NumpadEnter") {
    document.activeElement.click();
  }
});

/* Fullscreen toggling */
document
  .getElementById("enter-fullscreen-btn")
  .addEventListener("click", (event) => {
    var elem = document.documentElement;
    elem.requestFullscreen();
  });
document
  .getElementById("exit-fullscreen-btn")
  .addEventListener("click", (event) => {
    document.exitFullscreen();
  });

/* Toggle window resizable. */

async function toggleResizable() {
  const isResizable = window.matchMedia(`(resizable: true)`).matches;

  try {
    await window.setResizable(!isResizable);
  } catch (error) {
    console.log("Setting a fixed size window failed: ", error);
  }
}

document
  .getElementById("toggle-resizable-btn")
  .addEventListener("click", (event) => {
    toggleResizable();
  });

document.getElementById("resizeby-btn").addEventListener("click", (event) => {
  window.resizeBy(30, 30);
});

// Set buttons to check display-state matchMedia on click.
for (const displayState of ["minimized", "maximized", "normal", "fullscreen"]) {
  document
    .getElementById(`${displayState}-match-media-btn`)
    .addEventListener("click", async (event) => {
      const result = window.matchMedia(
        `(display-state: ${displayState})`
      ).matches;
      alert(`Matches ${displayState}: ${result}`);
    });
}

// Set button to check if the window is resizable.
document
  .getElementById("resizable-match-media-btn")
  .addEventListener("click", async (event) => {
    const result = window.matchMedia(`(resizable: true)`).matches;
    alert(`IsTrue resizable: ${result}`);
  });

function onMoveScreenCoordUpdate() {
  document.getElementById("screenx").innerHTML = window.screenX;
  document.getElementById("screeny").innerHTML = window.screenY;
}
// window.addEventListener("move", (event) => onMoveScreenCoordUpdate());
window.onmove = (event) => onMoveScreenCoordUpdate();

addEventListener("load", (event) => {
  document.getElementById("screenx").innerHTML = window.screenX;
  document.getElementById("screeny").innerHTML = window.screenY;
});

for (const value of ["maximized", "fullscreen", "normal"]) {
  const mql = window.matchMedia(`(display-state: ${value})`);
  mql.onchange = (e) => {
    if (e.matches) {
      console.log(
        `This is a ${value} window of size ${window.innerHeight} * ${window.innerWidth} px`
      );
    }
  };
}

