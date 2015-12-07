/// <reference path="ref.ts" />
// keyhander.hs {{{
var baseAccel = 5;
// what I want is basically a Set (of int).
function addKeyHandler(pressed: boolean[]) : void{
  // keep track of what's being pressed.
  document.addEventListener('keydown', function(e){
    pressed[e.keyCode] = true;
  })
  document.addEventListener('keyup', function(e){
    pressed[e.keyCode] = false;
  })
}

// TODO : reconsider implementation.
// Probably it's better if we just use Array or Obj.
function keyConfig(keyCode:number) : Vector {
  switch(keyCode){
  case 65: // a
  case 37: // Left
    return (new Vector(-baseAccel,0)); // left
  case 87: // w
  case 38: // Up
    return (new Vector(0, -baseAccel)); // up
  case 68: // d
  case 39: // Right
    return (new Vector(baseAccel,0)); // right
  case 83:
  case 40:
    return (new Vector(0,baseAccel)); // down
  case 90://Z for test
    gameWindow.focus().next();
    return (new Vector(0,0));
    
  default:
    return (new Vector(0,0));
  }
}

// given a list of pressed keys, returns the acceleration.
function fromPressed(pressed: boolean[]) : Vector {
  return (
    pressed
      .map((pr,i) => { return (pr ? (keyConfig(i)): new Vector(0,0)); })
      .reduce(((acc, v) => {return vAdd(acc,v)}), new Vector(0,0))
  );
}

// }}}
