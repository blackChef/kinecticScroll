
var max = view.scrollHeight - window.innerHeight;
var min = 0;
var offset = 0;
var pressed = false;

var view = document.querySelector('.view');
if (typeof window.ontouchstart !== 'undefined') {
 view.addEventListener('touchstart', tap);
 view.addEventListener('touchmove', drag);
 view.addEventListener('touchend', release);
}
view.addEventListener('mousedown', tap);
view.addEventListener('mousemove', drag);
view.addEventListener('mouseup', release);


function tap(event) {
  pressed = true;
  reference = getYpos(event);
  event.preventDefault();
}

function drag(event) {
  var y;
  var deltaY;

  if (pressed) {
    y = getYpos(event);
    deltaY = reference - y;

    if ( Math.abs(deltaY) > 2 ) {
      reference = y;
      scroll(offset + deltaY);
    }
  }

  event.preventDefault();
}

function release(event) {
  pressed = false;
  event.preventDefault();
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

