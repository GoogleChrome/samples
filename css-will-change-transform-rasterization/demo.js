window.addEventListener('load', function() {
  requestAnimationFrame(function() {
    var remainsBlurry = document.querySelector('#remainsBlurry');
    remainsBlurry.style.transform = 'scale(2, 2) translate3d(50px, 0, 0)';

    var noLongerBlurry = document.querySelector('#noLongerBlurry');
    noLongerBlurry.style.transform = 'scale(2, 2) translate3d(50px, 0, 0)';
  });
});
