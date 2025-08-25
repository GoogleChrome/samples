const pre = document.querySelector('pre');

const buttons = [
  document.querySelector('svg > g > path:nth-child(18)'), // Button 0
  document.querySelector('svg > g > path:nth-child(24)'), // Button 1
  document.querySelector('svg > g > path:nth-child(20)'), // Button 2
  document.querySelector('svg > g > path:nth-child(22)'), // Button 3
].map((button) => {
  button.classList.add('green');
  return button;
});

const hidButtons = [
  document.querySelector('svg > g > path:nth-child(12)'), // Assistant button
  document.querySelector('svg > g > path:nth-child(14)'), // Capture button
].map((button) => {
  button.classList.add('green');
  return button;
});

document.querySelector('button').addEventListener('click', async () => {
  const [stadia] = await navigator.hid.requestDevice({
    filters: [
      {
        vendorId: 6353,
        productId: 37888,
      },
    ],
  });
  await stadiaPrepare(stadia);
});

const stadiaPrepare = async (stadia) => {
  try {
    await stadia.open();
    stadia.addEventListener('inputreport', (event) => {
      // Extract the event data for button down and button up.
      const data = new Uint8Array(event.data.buffer);
      console.log('⌗🎮 HID data', data);
      pre.textContent = data.join(', ');
      if (event.reportId === 3) {
        if (data[0] === 8) {
          if (data[1] === 1) {
            hidButtons[1].classList.add('highlight');
          } else if (data[1] === 2) {
            hidButtons[0].classList.add('highlight');
          } else if (data[1] === 3) {
            hidButtons[0].classList.add('highlight');
            hidButtons[1].classList.add('highlight');
          } else {
            hidButtons[0].classList.remove('highlight');
            hidButtons[1].classList.remove('highlight');
          }
        }
      }
    });
  } catch {
    // Ignore silently.
  }
};

const reconnectStadia = async () => {
  try {
    const [stadia] = await navigator.hid.getDevices();
    if (stadia && stadia.vendorId === 6353 && stadia.productId === 37888) {
      await stadiaPrepare(stadia);
    }
  } catch {
    // Ignore silently.
  }
};

window.addEventListener('gamepadconnected', (event) => {
  console.log('✅ 🎮 A gamepad was connected:', event.gamepad);
  // Kick off the initial game loop iteration.
  pollGamepads();
  reconnectStadia();
});

window.addEventListener('gamepaddisconnected', (event) => {
  console.log('❌ 🎮 A gamepad was disconnected:', event.gamepad);
});

const pollGamepads = () => {
  // Always call `navigator.getGamepads()` inside of
  // the game loop, not outside.
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    // Disregard empty slots.
    if (!gamepad) {
      continue;
    }
    gamepad.buttons.forEach((button, index) => {
      // Ignore the other buttons.
      if (index > 3 || !buttons[index]) {
        return;
      }
      buttons[index].classList.toggle('highlight', button.pressed);
    });
  }
  // Call yourself upon the next animation frame.
  // (Typically this happens every 60 times per second.)
  window.requestAnimationFrame(pollGamepads);
};
