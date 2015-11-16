/// <reference path="ref.ts" />

var gameInit=gameInitDefault;
var gameStart=gameStartDefault;
var gameMain;//initialized at firstInit()




function gameInitDefault(){gameMain=gameStartDefault;}
function gameStartDefault(){
  game.data.dots = spawnN(initSpawnConfig, initDots);
  gameMain=gameBodyDefault;
}

function gameBodyDefault(){  
  var t=game.vars.t;
  // remove dots that are outside of canvas.
  // need to rethink here if we implement more complex algorithms for
  // individual moving.
  game.data.dots = game.data.dots.filter( d => {
    d.moveInplace(t/100);
    if( d.inside(
        -game.consts.canvasMargin,
        -game.consts.canvasMargin,
      game.consts.canvasWidth + game.consts.canvasMargin,
      game.consts.canvasHeight + game.consts.canvasMargin
    )){return true;}else{delete d;return false;}
  });
  
  // accelerate / decelerate according to the user interaction. {{{
  var a = fromPressed(game.control.pressed);
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
  replenishDots(maxDots,game.data.dots);
  handleCollision(player,game.data.dots);
  draw();
  game.log.innerHTML=" FPS: "+(game.vars.fps=50/t+19*game.vars.fps/20);
}
