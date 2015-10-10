
var view = document.querySelector('.view');
var currentOffset = 0;
var snap = 30;

var timeConstant = 325; // ms 跟惯性运动的时间成正比
var velocity, trackVelocityTicker, isPressed;


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
  isPressed = true;
  reference = getEventYpos(event);
  trackVelocity();
}

function drag(event) {
  event.preventDefault();
  var y;
  var deltaY;

  y = getEventYpos(event);
  deltaY = reference - y;

  if ( Math.abs(deltaY) > 2 ) {
    reference = y;
    moveView (currentOffset + deltaY);
  }
}

function release(event) {
  event.preventDefault();
  isPressed = false;

  if ( Math.abs(velocity) > 10 ) {
    var amplitude = 0.5 * velocity;
    var inertialDistance = Math.round(currentOffset + amplitude);
    inertialDistance = Math.round( inertialDistance / snap ) * snap; // snap
    inertialMove(inertialDistance, amplitude);
  }
}


function moveView(y) {
  var max = view.scrollHeight - window.innerHeight;
  var min = 0;
  if (y > max) {
    distance = max;
  } else if (y < min) {
    distance = min;
  } else {
    distance = y;
  }

  view.style.transform = 'translateY(' + (-distance) + 'px)';
  currentOffset = distance;
}

function trackVelocity() {
  var lastTime = Date.now();
  var lastOffset = currentOffset;
  var velocities = [];

  function loop() {
    var currentTime = Date.now();
    var elapsed = currentTime - lastTime || 1;
    lastTime = currentTime;

    var deltaY = currentOffset - lastOffset;
    lastOffset = currentOffset;

    velocity = 1000 * deltaY / elapsed;
    // velocity = 100;

    if (!isPressed) {
      return;
    }

    requestAnimationFrame(loop);
  }


  trackVelocityTicker = requestAnimationFrame(loop);
}


function inertialMove(inertialDistance, amplitude) {
  var startTime = Date.now();

  function loop() {
    var currentTime = Date.now();
    var elapsed = currentTime - startTime;
    var delta =  Math.round( amplitude * Math.exp(-elapsed / timeConstant) );

    moveView(inertialDistance - delta);

    if (Math.abs(delta) === 0 || isPressed) {
      return;
    }

    requestAnimationFrame(loop);
  }

  loop();
}


function getEventYpos(event) {
  // touch event
  if (event.targetTouches && (event.targetTouches.length >= 1)) {
    return event.targetTouches[0].clientY;
  }

  // mouse event
  return event.clientY;
}
