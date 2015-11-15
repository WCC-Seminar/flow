/// <reference path="ref.ts" />
function main() : void {
  // prepare {{{
  // the canvas we're using
  var c = <HTMLCanvasElement>document.getElementById('world');
  var dots = spawnN(initSpawnConfig, 50);
  var pressed = [];
  addKeyHandler(pressed);
  // }}}
  // mainLoop {{{
  function mainLoop(t0, t1){
    // time from last step
    var t = t1-t0;
    clearCanv(c);
    player.drawOn(c);
    
    // draw each dot (forEach?)
    dots.map( d => {d.drawOn(c);})
    
    // remove dots that are outside of canvas.
    // need to rethink here if we implement more complex algorithms for
    // individual moving.
    dots = dots.filter( d => {
      d.moveInplace(t/100);
      return d.inside(500,500)
    });
    
    // accelerate / decelerate according to the user interaction. {{{
    var a = fromPressed(pressed);
    if (a.x !== 0 || a.y !== 0) {
      // in place .. wierd...
      player.accelInplace(maxPlayerSpeed, sMul((t/100), a));
      player.moveInplace(t/100);
    }
    else {
      // no user interaction! Let's stop..
      player.decelInplace(0.9);
      player.moveInplace(t/100);
    }
    // }}}
    replenishDots(100,dots);
    handleCollision(player,dots);
    requestAnimationFrame(t2 => {mainLoop(t1,t2);});
  }
  // }}}
  // now, run!
  requestAnimationFrame(t => {mainLoop(0,t);});
}

window.addEventListener(
  'load', main
);
