let ROWS;
let COLS;
const WINDOW_CHROME_Y = 51;
const WINDOW_CHROME_X = 1;

let popups = [];
let popupMonitor = null;
let cachedScreens = null;

document.querySelectorAll("input").forEach(input => {
  const onInputChange = () => {
    input.dataset.value = input.value;
    if (input.id === "rows") {
      ROWS = parseInt(input.value, 10);
    } else {
      COLS = parseInt(input.value, 10);
    }
  };
  input.addEventListener("input", onInputChange);
  onInputChange();
});

const createPopup = (screenX, screenY, width, height) => {
  const features = [
    `left=${screenX}`,
    `top=${screenY}`,
    `width=${width}`,
    `height=${height}`,
    `menubar=no`,
    `toolbar=no`,
    `location=no`,
    `status=no`,
    `resizable=yes`,
    `scrollbars=no`
  ].join(",");
  // TODO(crbug.com/1153004): The onPopupClose beforeunload works with about:blank popups...
  // return window.open("about:blank", Math.random().toString(), features);
  return window.open("iframe.html", Math.random().toString(), features);
};

const getScreensInfo = async () => {
  if ("getScreenDetails" in window) {
    if (cachedScreens) {
      return cachedScreens.screens;
    } else {
      cachedScreens = await window.getScreenDetails();
      cachedScreens.addEventListener("screenschange", async e => {
        console.log("screenschange", e);
        closeAllPopups();
        await elmerify();
      });
      cachedScreens.addEventListener("currentscreenchange", async e => {
        console.log("currentscreenchange", e);
      });
      return cachedScreens.screens;
    }
  }
  return [window.screen];
};

const onPopupClose = e => {
  e.preventDefault();
  closeAllPopups();
  return e.returnValue = "This string must be non-empty";
};

const closeAllPopups = () => {
  popups.forEach(popup => {
    popup.removeEventListener("beforeunload", onPopupClose);
    popup.close();
  });
  popups = [];  
  clearInterval(popupMonitor);
};

const checkPopupClose = () => {
  popups.forEach(popup => {
    if (popup.closed) {
      closeAllPopups();
      return;
    }
  });
}
const onPopupClick = async e => {
  const body = e.target.closest("body");
  popups.forEach(popup => {
    if (e.view === popup) {
      return;
    }
    popup.document.exitFullscreen();
  });
  try {
    if (e.view.document.fullscreenElement) {
      return await e.view.document.exitFullscreen();
    }
    const screensInterface = await e.view.getScreenDetails();
    let otherScreen = screensInterface.screens.filter(
      screen => screen !== screensInterface.currentScreen
    )[0];
    if (!otherScreen) {
      otherScreen = screensInterface.screens[0];
    }
    await body.requestFullscreen({
      screen: otherScreen
    });
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const elmerify = async () => {
  // For now, don't run in an iframe, but pop out to a new window.
  // TODO(crbug.com/1182855): Run full demo from iframe once it's supported.
  if (window.self !== window.top) {
    window.open(location.href)//, "", "noopener,noreferrer");
    return;
  }
  
  const screens = await getScreensInfo();

  popups = [];
  screens.forEach((screen, numScreen) => {
    let width = Math.floor((screen.availWidth - COLS * WINDOW_CHROME_X) / COLS);
    let height = Math.floor(
      (screen.availHeight - ROWS * WINDOW_CHROME_Y) / ROWS
    );
    loop: for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        let screenX = i * width + screen.availLeft + i * WINDOW_CHROME_X;
        let screenY = j * height + screen.availTop + j * WINDOW_CHROME_Y;
        const popup = createPopup(screenX, screenY, width, height);
        if (!popup) {
          popups.forEach(popup => popup.close());
          alert(
            "It looks like you are blocking popup windows. Please allow them as outlined at https://goo.gle/allow-popups."
          );
          break loop;
        }
        popup.addEventListener("beforeunload", onPopupClose);
        popup.addEventListener("click", onPopupClick);
        popups.push(popup);
      }
    }
  });
  
  // Workaround for beforeunload event listener not being called; see crbug.com/1153004.
  popupMonitor = setInterval(checkPopupClose, 500);
};

const init = async () => {
  await fetch("iframe.html");

  document.querySelector("button").addEventListener("click", async () => {
    closeAllPopups();
    await elmerify();
  });

  window.addEventListener("beforeunload", () => {
    closeAllPopups();
  });
};

init();
