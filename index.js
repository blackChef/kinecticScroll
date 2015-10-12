
var view = document.querySelector('.view');

var currentOffset = 0;
var lastEventPos, isPressed, velocity;


// set up events
if (typeof window.ontouchstart !== 'undefined') {
  view.addEventListener('touchstart', tap);
  view.addEventListener('touchmove', drag);
  view.addEventListener('touchend', release);
} else {
  view.addEventListener('mousedown', tap);
  view.addEventListener('mousemove', drag);
  view.addEventListener('mouseup', release);
}

function tap(event) {
  event.preventDefault();
  isPressed = true;
  lastEventPos = getEventPos(event);
  trackVelocity();
}

function drag(event) {
  event.preventDefault();

  var currentEventPos = getEventPos(event);
  var delta = lastEventPos - currentEventPos;

  if ( Math.abs(delta) > 2 ) {
    lastEventPos = currentEventPos;
    moveView (currentOffset + delta);
  }
}

function release(event) {
  event.preventDefault();
  isPressed = false;

  if ( Math.abs(velocity) > 10 ) {
    var snap = 30;

    var targetOffset = currentOffset + 0.5 * velocity;
    targetOffset = Math.round( targetOffset / snap ) * snap; // snap

    var inertialMoveDistance = targetOffset - currentOffset;

    inertialMove(inertialMoveDistance);
  }
}


function moveView(distance) {
  var max = view.scrollHeight - window.innerHeight;
  var min = 0;

  distance = Math.round(distance);

  if (distance > max) {
    distance = max;
  } else if (distance < min) {
    distance = min;
  }

  view.style.transform = 'translateY(' + (-distance) + 'px)';
  currentOffset = distance;
}

function trackVelocity() {
  var lastTime = Date.now();
  var lastOffset = currentOffset;

  function loop() {
    var currentTime = Date.now();
    var elapsed = currentTime - lastTime;
    lastTime = currentTime;

    var delta = currentOffset - lastOffset;
    lastOffset = currentOffset;

    velocity = 1000 * delta / elapsed;

    if (!isPressed) {
      return;
    }

    requestAnimationFrame(loop);
  }


  requestAnimationFrame(loop);
}


function exponentialDecay (deltaTime, timeConstant) {
  return 1 - Math.exp(-deltaTime / timeConstant);
}

function inertialMove(inertialMoveDistance) {
  var timeConstant = 125; // ms 跟惯性运动的时间成正比
  var startTime = Date.now();
  var offsetWhenRelease = currentOffset;

  function loop() {
    var progress = exponentialDecay(Date.now() - startTime, timeConstant);

    if ( (1 - progress).toFixed(3) == 0.001) {
      progress = 1;
    }

    var distance = offsetWhenRelease + inertialMoveDistance * progress;

    moveView(distance);

    if (progress == 1 || isPressed) {
      return;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}


function getEventPos(event, dir) {
  dir = dir || 'y';

  // touch event
  if (event.targetTouches && (event.targetTouches.length >= 1)) {
    return event.targetTouches[0]['client' + dir.toUpperCase()];
  }

  // mouse event
  return event['client' + dir.toUpperCase()];
}
