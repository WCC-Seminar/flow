/// <reference path="ref.ts" />

var gameInit=gameInitDefault;
var gameStart=gameStartDefault;
var gameMain;//initialized at firstInit()


function gameInitDefault(){gameMain=gameStartDefault;}
function gameStartDefault(){
  game.data.obj.dots = spawnN(initSpawnConfig, initDots);
  game.data.stage.playerInitPos=new Vector(250,450);
  game.data.obj.player=new Dot(
    game.data.stage.playerInitPos,
    new Vector (0,0),
    normalColor,
    5
  )
  game.vars.drawList=[];
  game.vars.drawList.push(game.data.obj.player);
  game.vars.drawList.push(game.data.obj.dots);


  //test message
  //*
  gameWindow.appendChild(
    createSelectorBox(
      "test message, press 'Z' key to close this window",
      new Vector(250,250),new Vector(400,250),
      [["OK",(function(){gameMain=gameBodyDefault;})]]
    ).getFocused());//*/
  /*
  gameWindow.appendChild(
    createMessageBox(
      "test message, press 'Z' key to close this window",
      new Vector(250,250),new Vector(400,250),
      "OK",(function(){gameMain=gameBodyDefault;})
    ).getFoucused());//*/
  
  gameMain=gameBodyDefault0;
}

function gameBodyDefault0(){
  fromPressed(game.control.pressed);
}

function gameBodyDefault(){  
  var t=1000/60;//game.vars.t;
  var player=game.data.obj.player;
  // remove dots that are outside of canvas.
  // need to rethink here if we implement more complex algorithms for
  // individual moving.
  /*
  game.data.obj.dots = game.data.obj.dots.filter( d => {
    d.moveInplace(t/100);
    if( d.inside(
        -game.consts.canvasMargin,
        -game.consts.canvasMargin,
      game.consts.canvasWidth + game.consts.canvasMargin,
      game.consts.canvasHeight + game.consts.canvasMargin
    )){return true;}else{delete d;return false;}
  });
  //*/;
  for (var i=game.data.obj.dots.length;i--;){
    game.data.obj.dots[i].moveInplace(t/100);
    if( !game.data.obj.dots[i].inside(
        -game.consts.canvasMargin,
        -game.consts.canvasMargin,
      game.consts.canvasWidth + game.consts.canvasMargin,
      game.consts.canvasHeight + game.consts.canvasMargin
    )){ delete game.data.obj.dots[i];game.data.obj.dots.splice(i,1);}
  }

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
  replenishDots(maxDots,game.data.obj.dots);
  handleCollision(player,game.data.obj.dots);
}
