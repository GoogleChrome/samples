const wakeLockCheckbox = document.querySelector('#wakeLockCheckbox');
const statusDiv = document.querySelector('#statusDiv');
const reaquireCheckbox = document.querySelector('#reacquireCheckbox');
const fullScreenButton = document.querySelector('#fullScreenButton');

fullScreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    fullScreenButton.textContent = 'Leave Full Screen';
  } else {
    document.exitFullscreen();
    fullScreenButton.textContent = 'Enter Full Screen';
  }  
});

if ('WakeLock' in window && 'request' in window.WakeLock) {  
  let wakeLock = null;
  
  const requestWakeLock = () => {
    const controller = new AbortController();
    const signal = controller.signal;
    window.WakeLock.request('screen', {signal})
    .catch((e) => {      
      if (e.name === 'AbortError') {
        wakeLockCheckbox.checked = false;
        statusDiv.textContent = 'Wake Lock was aborted';
        console.log('Wake Lock was aborted');
      } else {
        statusDiv.textContent = `${e.name}, ${e.message}`;
        console.error(`${e.name}, ${e.message}`);
      }
    });
    wakeLockCheckbox.checked = true;
    statusDiv.textContent = 'Wake Lock is active';
    console.log('Wake Lock is active');
    return controller;
  };
  
  wakeLockCheckbox.addEventListener('change', () => {
    if (wakeLockCheckbox.checked) {
      wakeLock = requestWakeLock();
    } else {
      wakeLock.abort();
      wakeLock = null;
    }
  });
  
  const handleVisibilityChange = () => {    
    if (wakeLock !== null && document.visibilityState === 'visible') {
      wakeLock = requestWakeLock();
    }
  };    
  
  reaquireCheckbox.addEventListener('change', () => {
    if (reaquireCheckbox.checked) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleVisibilityChange);
    } else {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);      
    }
  });  
} else if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {  
  let wakeLock = null;
  
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', (e) => {
        console.log(e);
        wakeLockCheckbox.checked = false;
        statusDiv.textContent = 'Wake Lock was released';
        console.log('Wake Lock was released');                    
      });
      wakeLockCheckbox.checked = true;
      statusDiv.textContent = 'Wake Lock is active';
      console.log('Wake Lock is active');      
    } catch (e) {      
      wakeLockCheckbox.checked = false;
      statusDiv.textContent = `${e.name}, ${e.message}`;
      console.error(`${e.name}, ${e.message}`);
    } 
  };
  
  wakeLockCheckbox.addEventListener('change', () => {
    if (wakeLockCheckbox.checked) {
      requestWakeLock();
    } else {
      wakeLock.release();
      wakeLock = null;
    }
  });
  
  const handleVisibilityChange = () => {    
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  };    
  
  reaquireCheckbox.addEventListener('change', () => {
    if (reaquireCheckbox.checked) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('fullscreenchange', handleVisibilityChange);
    } else {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);      
    }
  });  
} else {  
  statusDiv.textContent = 'Wake Lock API not supported.';
  console.error('Wake Lock API not supported.');
}
