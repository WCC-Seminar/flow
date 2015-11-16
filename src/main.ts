/// <reference path="ref.ts" />


function firstInit():void{
  drawInit();
  game.log = document.getElementById('log');
  addKeyHandler(game.control.pressed);
  gameMain=gameInit;
}



function main() : void {
  // prepare {{{
  firstInit();
  // }}}
  // mainLoop {{{
  function mainLoop(t0, t1){
    // time from last step
    game.vars.t = t1-t0;
    gameMain();
    requestAnimationFrame(t2 => {mainLoop(t1,t2);});
  }
  // }}}
  // now, run!
  requestAnimationFrame(t => {mainLoop(0,t);});
}


//*
window.addEventListener(
  'load', main
);
//*/

//window.onload=main;
