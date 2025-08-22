import {ephemeralInput, ephemeralLabel, clearCanvas} from './script.mjs';

const THRESHOLD = 60 * 1000;
const GRACE_PERIOD = 10;

const MESSAGE_UNCHECKED = `Ephemeral (Don't move your mouse during 60s after clicking.)`;
const MESSAGE_CHECKED = `Ephemeral (⏳ Clearing after ${THRESHOLD / 1000}s of inactivity)`;

let interval = null;
let counter = GRACE_PERIOD;

let controller = new AbortController();
let signal = controller.signal;

ephemeralInput.style.display = 'block';
ephemeralLabel.style.display = 'block';

ephemeralInput.addEventListener('change', async () => {
  if (ephemeralInput.checked) {    
    let state;
    try {
      state = await IdleDetector.requestPermission(); 
    } catch {
      state = await Notification.requestPermission(); 
    }
    if (state !== 'granted') {
      alert('You need to grant the idle detection permission for this demo to work.');
      return ephemeralInput.checked = false;
    }    
    
    try {
      let idleDetector = new IdleDetector();    
      idleDetector.addEventListener('change', () => { 
        const userState = idleDetector.userState;
        const screenState = idleDetector.screenState;
        console.log(`Idle change: ${userState}, ${screenState}.`);

        if (userState === 'idle') {
          interval = setInterval(() => {
            ephemeralLabel.textContent = `Ephemeral (🚨 Clearing in ${counter--}s)`;    
            if (counter === 0) {
              clearInterval(interval);
              clearCanvas();
              counter = GRACE_PERIOD;                    
              ephemeralLabel.textContent = MESSAGE_CHECKED; 
            }
          }, 1000);       
        } else {
          clearInterval(interval);
          counter = GRACE_PERIOD;      
          ephemeralLabel.textContent = MESSAGE_CHECKED; 
        }
      });
      idleDetector.start({
        threshold: THRESHOLD,
        signal,
      });
      ephemeralLabel.textContent = MESSAGE_CHECKED;    
    } catch (err) {
      console.error(err.name, err.message);
    }    
  } else {
    controller.abort();
    console.log('Idle detection stoppped.');
    controller = new AbortController();
    signal = controller.signal;
    clearInterval(interval);        
    counter = GRACE_PERIOD;
    ephemeralLabel.textContent = MESSAGE_UNCHECKED;
  }
});
