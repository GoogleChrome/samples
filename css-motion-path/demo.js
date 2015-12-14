var firstScissorHalf = document.querySelector('#firstScissorHalf');
var secondScissorHalf = document.querySelector('#secondScissorHalf');

var positionKeyframes = [{motionOffset: '0%'}, {motionOffset: '100%'}];
var positionTiming = {duration: 12000, iterations: Infinity};
firstScissorHalf.animate(positionKeyframes, positionTiming);
secondScissorHalf.animate(positionKeyframes, positionTiming);

var firstRotationKeyframes = [
  {motionRotation: 'auto 0deg'},
  {motionRotation: 'auto -45deg'},
  {motionRotation: 'auto 0deg'}
];
var secondRotationKeyframes = [
  {motionRotation: 'auto 0deg'},
  {motionRotation: 'auto 45deg'},
  {motionRotation: 'auto 0deg'}
];
var rotationTiming = {duration: 1000, iterations: Infinity};
firstScissorHalf.animate(firstRotationKeyframes, rotationTiming);
secondScissorHalf.animate(secondRotationKeyframes, rotationTiming);
