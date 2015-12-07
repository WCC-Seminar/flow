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
  var lastDraw=0;
  var lastStep=0;
  var cnt=0;
  function mainLoop(t0, t1){
    // time from last step
    //game.vars.t = t1-t0;
    var t=t1-t0;
    lastDraw+=t;//game.vars.t;
    lastStep+=t;//game.vars.t;
    while(lastStep>0){
      gameMain();
      lastStep-=1000/60;
      game.vars.fps2=(++cnt)*1000/t1;
    };
    game.log.innerHTML=" FPS: "+Math.floor(game.vars.fps)+"/"+Math.floor(game.vars.fps2);
    //if(t<1100/60 || lastDraw>100){//Need to change here!!!
    draw();
    game.vars.fps=50/lastDraw+19*game.vars.fps/20;
    lastDraw=0;
    //}
    requestAnimationFrame(t2 => {mainLoop(t1,t2);});
  }
  // }}}
  // now, run!
  requestAnimationFrame(t => {mainLoop(0,t);});
}

window.addEventListener(
  'load', main
);
