const luxToOpacity = (lux) => {
  if (lux > 250) {
    return 1;
  }
  return lux / 250;
};

const sensor = new window.AmbientLightSensor();
sensor.onreading = () => {
  console.log('Current light level:', sensor.illuminance);
  document.documentElement.style.setProperty(
    '--opacity',
    luxToOpacity(sensor.illuminance),
  );
};
sensor.onerror = (event) => {
  console.log(event.error.name, event.error.message);
};

(async () => {
  const {state} = await navigator.permissions.query({name: 'ambient-light-sensor'});
  if (state === 'granted') {
    sensor.start();
  }  
})();
