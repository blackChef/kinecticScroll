
var view = document.querySelector('.view');
var max = view.scrollHeight - window.innerHeight;
var min = 0;
var offset = 0;
var startDragging = false;
var snap = 30;

var timeConstant = 325; // ms
var velocity, amplitude, lastOffset, lastTimestamp, trackTicker, target;


if (typeof window.ontouchstart !== 'undefined') {
 view.addEventListener('touchstart', tap);
 view.addEventListener('touchmove', drag);
 view.addEventListener('touchend', release);
}
view.addEventListener('mousedown', tap);
view.addEventListener('mousemove', drag);
view.addEventListener('mouseup', release);


function tap(event) {
  event.preventDefault();
  startDragging = true;
  reference = getYpos(event);

  velocity = 0;
  amplitude = 0;
  lastOffset = offset;
  lastTimestamp = Date.now();
  trackTicker = setInterval(function() {
    track();
  }, 30);
}

function drag(event) {
  event.preventDefault();
  var y;
  var deltaY;

  if (startDragging) {
    y = getYpos(event);
    deltaY = reference - y;

    if ( Math.abs(deltaY) > 2 ) {
      reference = y;
      scroll(offset + deltaY);
    }
  }
}

function release(event) {
  event.preventDefault();
  startDragging = false;

  clearInterval(trackTicker);
  document.querySelector('.velocity').innerHTML = velocity;
  if ( Math.abs(velocity) > 1 ) {
    amplitude = 0.8 * velocity;
    target = Math.round(offset + amplitude);
    // snap
    target = Math.round( target / snap ) * snap;
    lastTimestamp = Date.now();
    autoScroll();
  }
}


function getYpos(event) {
  // touch event
  if (event.targetTouches && (event.targetTouches.length >= 1)) {
    return event.targetTouches[0].clientY;
  }

  // mouse event
  return event.clientY;
}

function scroll(y) {
  if (y > max) {
    offset = max;
  } else if (y < min) {
    offset = min;
  } else {
    offset = y;
  }

  view.style.transform = 'translateY(' + (-offset) + 'px)';
}

function track() {
  var now = Date.now();
  var elapsed = now - lastTimestamp;
  lastTimestamp = now;

  var deltaY = offset - lastOffset;
  lastOffset = offset;

  velocity = 1000 * deltaY / (elapsed + 1);
}

function autoScroll() {
  if (!amplitude) {
    return;
  }

  var elapsed = Date.now() - lastTimestamp;
  var delta = amplitude * Math.exp(-elapsed / timeConstant);
  delta = Math.round(delta);

  if (Math.abs(delta) < 5) {
    scroll(target);
    return;
  }

  scroll(target - delta);
  requestAnimationFrame(function() {
    autoScroll();
  });
}