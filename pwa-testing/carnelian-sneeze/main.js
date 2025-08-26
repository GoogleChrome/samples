const locationInput = document.getElementById('location');
const navigateButton = document.getElementById('navigate');

locationInput.value = localStorage.getItem('lastUrl') || 'example.com'; 

const doNavigation = () => {
  let newLocation = locationInput.value;
  if (!newLocation) {
    return;
  }
  
  if (!newLocation.includes('://')) {
      newLocation = 'http://' + newLocation;
  }
  
  localStorage.setItem('lastUrl', locationInput.value);
  window.location = newLocation;
};

navigateButton.addEventListener('click', doNavigation);
locationInput.addEventListener('keypress', event => {
  if (event.keyCode !== 13) {
    return;
  }
  
  doNavigation();
});