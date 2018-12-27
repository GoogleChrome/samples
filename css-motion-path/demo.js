var firstScissorHalf = document.querySelector('#firstScissorHalf');
var secondScissorHalf = document.querySelector('#secondScissorHalf');

var positionKeyframes = [{offsetDistance: '0%'}, {offsetDistance: '100%'}];
var positionTiming = {duration: 12000, iterations: Infinity};
firstScissorHalf.animate(positionKeyframes, positionTiming);
secondScissorHalf.animate(positionKeyframes, positionTiming);

var firstRotationKeyframes = [
  {offsetRotate: 'auto 0deg'},
  {offsetRotate: 'auto -45deg'},
  {offsetRotate: 'auto 0deg'}
];
var secondRotationKeyframes = [
  {offsetRotate: 'auto 0deg'},
  {offsetRotate: 'auto 45deg'},
  {offsetRotate: 'auto 0deg'}
];
var rotationTiming = {duration: 1000, iterations: Infinity};
firstScissorHalf.animate(firstRotationKeyframes, rotationTiming);
secondScissorHalf.animate(secondRotationKeyframes, rotationTiming);
