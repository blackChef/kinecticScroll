
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
  lastEventPos = getEventPos(event, 'x');
  trackVelocity();
}

function drag(event) {
  event.preventDefault();
  var currentEventPos = getEventPos(event, 'x');
  var delta = lastEventPos - currentEventPos;

  if ( Math.abs(delta) > 2 ) {
    lastEventPos = currentEventPos;
    moveView (currentOffset + delta);
  }
}

function release(event) {
  event.preventDefault();
  isPressed = false;

  var snap = window.innerWidth / 2;

  var targetOffset = currentOffset + 0.15 * velocity;
  targetOffset = Math.round( targetOffset / snap ) * snap; // snap

  var inertialMoveDistance = targetOffset - currentOffset;

  inertialMove(inertialMoveDistance);
}


function moveView(distance) {
  var max = view.scrollWidth - window.innerWidth;
  var min = 0;

  distance = Math.round(distance);

  if (distance > max) {
    distance = max;
  } else if (distance < min) {
    distance = min;
  }

  view.style.transform = 'translateX(' + (-distance) + 'px)';
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


function exponentialDecay (deltaTime) {
  // 因为 deltaTime 总是等于 1000 / 16 的倍数
  // 所以每一次惯性运动的持续时间是固定的
  var timeConstant = 125; // ms 跟惯性运动的时间成正比
  return 1 - Math.exp(-deltaTime / timeConstant);
}

function inertialMove(inertialMoveDistance) {
  var startTime = Date.now();
  var offsetWhenRelease = currentOffset;

  function loop() {
    var progress = exponentialDecay(Date.now() - startTime);

    var delta = inertialMoveDistance * progress;
    var distance = offsetWhenRelease + delta;

    moveView(distance);

    if (delta.toFixed(0) == inertialMoveDistance || isPressed) {
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
