const isHapticsSupported = 'playHaptics' in navigator;
const supportBanner = document.getElementById('supportBanner');
if (!isHapticsSupported && supportBanner) {
  supportBanner.hidden = false;
}

ChromeSamples.log('Ready. Interact with a widget or effect button above.');

const intensitySlider = document.getElementById('intensity');
const intensityVal = document.getElementById('intensityVal');
const controlBar = document.getElementById('controlBar');
const statusBadge = document.getElementById('statusBadge');
const statusCode = document.getElementById('statusCode');
const logOutput = document.getElementById('log');

intensitySlider.addEventListener('input', () => {
  intensityVal.textContent = Number(intensitySlider.value).toFixed(1);
});

function playSampleHaptic(effect, contextLabel) {
  const intensity = Number(parseFloat(intensitySlider.value).toFixed(1));
  const callExpr = intensity === 1 ?
    `navigator.playHaptics('${effect}')` :
    `navigator.playHaptics('${effect}', ${intensity})`;

  statusBadge.textContent = effect;
  statusBadge.className = `effect-pill ${effect}`;
  statusCode.textContent = callExpr;

  controlBar.classList.remove('pulse');
  controlBar.getBoundingClientRect();
  controlBar.classList.add('pulse');

  if (isHapticsSupported) {
    navigator.playHaptics(effect, intensity);
    ChromeSamples.log(`> ${callExpr}  // ${contextLabel}`);
  } else {
    ChromeSamples.log(`> [simulated] ${callExpr}  // ${contextLabel}`);
  }

  if (logOutput) {
    logOutput.scrollTop = logOutput.scrollHeight;
  }
}

// ---------------------------------------------------------------------------
// 1. Scroll-Snap Carousel ('tick' mid-scroll, 'align' / 'edge' when settled)
// ---------------------------------------------------------------------------
const carousel = document.getElementById('snapCarousel');
const slides = Array.from(carousel.querySelectorAll('.carousel-card'));
const dotsContainer = document.getElementById('carouselDots');
const carouselPosition = document.getElementById('carouselPosition');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let settledIndex = 0;
let changingIndex = 0;
let carouselInteracted = false;

slides.forEach((_, idx) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'carousel-dot' + (idx === 0 ? ' is-active' : '');
  dot.setAttribute('aria-label', `Jump to card ${idx + 1}`);
  dot.addEventListener('click', () => scrollToSlide(idx));
  dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function syncCarouselUI(activeIdx, pendingIdx = activeIdx) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('is-snapped', idx === activeIdx);
  });
  dots.forEach((dot, idx) => {
    const isPending = idx === pendingIdx && idx !== activeIdx;
    dot.classList.toggle('is-active', idx === activeIdx);
    dot.classList.toggle('is-changing', isPending);
  });
  carouselPosition.textContent = `Card ${activeIdx + 1} of ${slides.length}`;
  prevBtn.disabled = activeIdx === 0;
  nextBtn.disabled = activeIdx === slides.length - 1;
}

function scrollToSlide(targetIdx) {
  const clamped = Math.max(0, Math.min(slides.length - 1, targetIdx));
  carouselInteracted = true;
  slides[clamped].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

prevBtn.addEventListener('click', () => scrollToSlide(settledIndex - 1));
nextBtn.addEventListener('click', () => scrollToSlide(settledIndex + 1));
carousel.addEventListener('pointerdown', () => {
  carouselInteracted = true;
});
carousel.addEventListener('wheel', () => {
  carouselInteracted = true;
}, {passive: true});

function handleSettledSnap(nextIdx) {
  if (nextIdx === -1 || nextIdx === settledIndex) {
    return;
  }
  settledIndex = nextIdx;
  changingIndex = nextIdx;
  syncCarouselUI(settledIndex);
  if (!carouselInteracted) {
    return;
  }

  const isBoundary = settledIndex === 0 || settledIndex === slides.length - 1;
  const boundSide = settledIndex === 0 ? 'start' : 'end';
  const label = isBoundary ?
    `Carousel boundary (${boundSide})` :
    `Carousel snapped to card ${settledIndex + 1}`;
  playSampleHaptic(isBoundary ? 'edge' : 'align', label);
}

if ('onscrollsnapchanging' in carousel) {
  carousel.addEventListener('scrollsnapchanging', event => {
    const nextIdx = slides.indexOf(event.snapTargetInline);
    if (nextIdx === -1 || nextIdx === changingIndex) {
      return;
    }
    changingIndex = nextIdx;
    syncCarouselUI(settledIndex, changingIndex);
    if (carouselInteracted) {
      playSampleHaptic('tick', `Carousel passing card ${nextIdx + 1}`);
    }
  });

  carousel.addEventListener('scrollsnapchange', event => {
    handleSettledSnap(slides.indexOf(event.snapTargetInline));
  });
} else {
  let scrollSettleTimer = null;
  carousel.addEventListener('scroll', () => {
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let closestIdx = 0;
    let bestDist = Infinity;
    slides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        closestIdx = idx;
      }
    });
    if (closestIdx !== changingIndex) {
      changingIndex = closestIdx;
      syncCarouselUI(settledIndex, changingIndex);
      if (carouselInteracted) {
        playSampleHaptic('tick', `Carousel passing card ${closestIdx + 1}`);
      }
    }
    clearTimeout(scrollSettleTimer);
    scrollSettleTimer = setTimeout(() => handleSettledSnap(closestIdx), 110);
  }, {passive: true});
}

syncCarouselUI(0);

// ---------------------------------------------------------------------------
// 2. Stepped Scrubber ('tick' on 1..9, 'edge' on 0 or 10)
// ---------------------------------------------------------------------------
const detentScrubber = document.getElementById('detentScrubber');
const scrubberVal = document.getElementById('scrubberVal');
const detentTicks = document.getElementById('detentTicks');
let lastScrubberStep = parseInt(detentScrubber.value, 10);

for (let i = 0; i <= 10; i++) {
  const dot = document.createElement('div');
  const edgeClass = i === 0 || i === 10 ? ' edge-dot' : '';
  const activeClass = i === lastScrubberStep ? ' active' : '';
  dot.className = `detent-dot${edgeClass}${activeClass}`;
  detentTicks.appendChild(dot);
}

detentScrubber.addEventListener('input', () => {
  const step = parseInt(detentScrubber.value, 10);
  if (step === lastScrubberStep) {
    return;
  }
  lastScrubberStep = step;

  Array.from(detentTicks.children).forEach((dot, idx) => {
    dot.classList.toggle('active', idx === step);
  });

  if (step === 0 || step === 10) {
    const bound = step === 0 ? 'Min' : 'Max';
    scrubberVal.textContent = `${step} / 10 (${bound})`;
    playSampleHaptic('edge', `Scrubber ${bound.toLowerCase()} bound`);
  } else {
    scrubberVal.textContent = `${step} / 10`;
    playSampleHaptic('tick', `Scrubber step ${step}`);
  }
});

// ---------------------------------------------------------------------------
// 3. Magnetic Alignment Guide ('hint', 'align', 'edge')
// ---------------------------------------------------------------------------
const snapTrack = document.getElementById('snapTrack');
const snapPuck = document.getElementById('snapPuck');
let snapDragging = false;
let puckOffset = -72;
let wasInHintZone = false;
let wasSnapped = false;
let wasAtTrackEdge = false;

function renderSnapPuck(offset) {
  snapPuck.style.transform = `translateX(${offset}px)`;
}
renderSnapPuck(puckOffset);

snapTrack.addEventListener('pointerdown', e => {
  snapDragging = true;
  snapTrack.setPointerCapture(e.pointerId);
  const rect = snapTrack.getBoundingClientRect();
  const offset = e.clientX - (rect.left + rect.width / 2);
  updateSnapPosition(offset, rect.width / 2 - 34);
});

snapTrack.addEventListener('pointermove', e => {
  if (!snapDragging) {
    return;
  }
  const rect = snapTrack.getBoundingClientRect();
  const offset = e.clientX - (rect.left + rect.width / 2);
  updateSnapPosition(offset, rect.width / 2 - 34);
});

function endSnapDrag() {
  snapDragging = false;
}
snapTrack.addEventListener('pointerup', endSnapDrag);
snapTrack.addEventListener('pointercancel', endSnapDrag);

function updateSnapPosition(rawOffset, maxOffset) {
  const clamped = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
  const absDist = Math.abs(clamped);
  const SNAP_RADIUS = 12;
  const HINT_RADIUS = 44;

  const isSnapped = absDist <= SNAP_RADIUS;
  const isInHint = absDist <= HINT_RADIUS && !isSnapped;
  const isAtEdge = absDist >= maxOffset - 1;

  if (isSnapped) {
    puckOffset = 0;
    snapPuck.textContent = 'ALIGNED';
  } else {
    puckOffset = clamped;
    snapPuck.textContent = isAtEdge ? 'EDGE' : 'DRAG';
  }
  renderSnapPuck(puckOffset);

  snapTrack.classList.toggle('snapped', isSnapped);
  snapTrack.classList.toggle('in-hint', isInHint);
  snapTrack.classList.toggle('at-edge', isAtEdge);

  if (isSnapped && !wasSnapped) {
    playSampleHaptic('align', 'Snapped to center guide');
  } else if (isInHint && !wasInHintZone && !wasSnapped) {
    playSampleHaptic('hint', 'Entered snap approach zone');
  } else if (isAtEdge && !wasAtTrackEdge) {
    playSampleHaptic('edge', 'Reached track boundary');
  }

  wasSnapped = isSnapped;
  wasInHintZone = isInHint;
  wasAtTrackEdge = isAtEdge;
}

// ---------------------------------------------------------------------------
// 4. Swipe-to-Confirm ('hint' on threshold cross, 'success' on release)
// ---------------------------------------------------------------------------
const swipeTrack = document.getElementById('swipeTrack');
const swipeThumb = document.getElementById('swipeThumb');
const swipeLabel = document.getElementById('swipeLabel');
let swipeDragging = false;
let wasSwipeEligible = false;

swipeTrack.addEventListener('pointerdown', e => {
  swipeDragging = true;
  swipeTrack.classList.remove('confirmed');
  swipeTrack.setPointerCapture(e.pointerId);
});

swipeTrack.addEventListener('pointermove', e => {
  if (!swipeDragging) {
    return;
  }
  const maxTravel = swipeTrack.clientWidth - swipeThumb.offsetWidth - 8;
  const rawX = e.clientX - swipeTrack.getBoundingClientRect().left - 24;
  const dx = Math.max(0, Math.min(maxTravel, rawX));
  const progress = dx / maxTravel;
  swipeThumb.style.transform = `translateX(${dx}px)`;

  const isEligible = progress >= 0.7;
  if (isEligible !== wasSwipeEligible) {
    wasSwipeEligible = isEligible;
    swipeTrack.classList.toggle('eligible', isEligible);
    swipeLabel.textContent = isEligible ?
      'Release to confirm' :
      'Slide past threshold to confirm →';
    const reason = isEligible ?
      'Crossed confirmation threshold' :
      'Backed below threshold';
    playSampleHaptic('hint', reason);
  }
});

function endSwipeDrag() {
  if (!swipeDragging) {
    return;
  }
  swipeDragging = false;
  if (wasSwipeEligible) {
    wasSwipeEligible = false;
    swipeTrack.classList.remove('eligible');
    swipeTrack.classList.add('confirmed');
    swipeLabel.textContent = 'Action confirmed';
    swipeThumb.textContent = '✓';
    playSampleHaptic('success', 'Swipe confirmation completed');
    setTimeout(() => {
      swipeThumb.style.transform = 'translateX(0px)';
      swipeThumb.textContent = '→';
      swipeTrack.classList.remove('confirmed');
      swipeLabel.textContent = 'Slide past threshold to confirm →';
    }, 1000);
  } else {
    swipeThumb.style.transform = 'translateX(0px)';
    swipeTrack.classList.remove('eligible');
    swipeLabel.textContent = 'Slide past threshold to confirm →';
  }
}
swipeTrack.addEventListener('pointerup', endSwipeDrag);
swipeTrack.addEventListener('pointercancel', endSwipeDrag);

// ---------------------------------------------------------------------------
// 5. Verification Outcome ('success' vs 'error') & 6-Effect Palette
// ---------------------------------------------------------------------------
const pinInput = document.getElementById('pinInput');
const pinFeedback = document.getElementById('pinFeedback');

function verifyCode(forceValid) {
  if (forceValid === true) {
    pinInput.value = '1234';
  } else if (forceValid === false && pinInput.value.trim() === '1234') {
    pinInput.value = '9999';
  }

  const isValid = pinInput.value.trim() === '1234';
  pinInput.classList.remove('valid', 'invalid');
  pinInput.getBoundingClientRect();

  if (isValid) {
    pinInput.classList.add('valid');
    pinFeedback.style.color = 'var(--success-fg)';
    pinFeedback.textContent = 'Code verified. Played "success" confirmation.';
    playSampleHaptic('success', 'Valid verification code');
  } else {
    pinInput.classList.add('invalid');
    pinFeedback.style.color = 'var(--error-fg)';
    pinFeedback.textContent = 'Incorrect code. Played "error" alert.';
    playSampleHaptic('error', 'Invalid verification code');
  }
}

document.getElementById('verifyValidBtn').addEventListener('click', () => {
  verifyCode(true);
});
document.getElementById('verifyInvalidBtn').addEventListener('click', () => {
  verifyCode(false);
});

document.querySelectorAll('[data-haptic-effect]').forEach(button => {
  button.addEventListener('click', () => {
    playSampleHaptic(button.dataset.hapticEffect, 'Effect palette button');
  });
});
