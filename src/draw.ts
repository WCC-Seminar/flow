/// <reference path="ref.ts" />


var drawMain=drawDefault;




function clearCanv(c : HTMLCanvasElement) : void {
  c.getContext('2d').clearRect(0,0, c.width, c.height);
}

function drawInit(){
  game.canvas= <HTMLCanvasElement>document.getElementById('world');
  game.canvasArr[0]=game.canvas;
  if(game.settings.isBuffer){
    game.canvasArr[1] = <HTMLCanvasElement>document.createElement('canvas');
    game.canvasArr[1].width = 500;
    game.canvasArr[1].height = 500;
    if(game.settings.isDoubleBuffer){
      game.canvasArr[1].id="world_sub";
      game.canvasArr[1].hidden=true;
      document.getElementById('game').appendChild(game.canvasArr[1]);
    }
  }
}

function draw(){
  if(game.settings.isDoubleBuffer===true){
    //double buffering
    if (typeof draw.buffer === 'undefined') {
      draw.buffer = false;
    }
    clearCanv(game.canvasArr[Number(draw.buffer)])
    drawMain(game.canvasArr[Number(draw.buffer)]);
    game.canvasArr[Number(!draw.buffer)].hidden=true;
    game.canvasArr[Number(draw.buffer)].hidden=false;
    draw.buffer=!draw.buffer;
    
  }else  if(game.settings.isBuffer===true){
    //draw after drawing on buffer
    clearCanv(game.canvasArr[1])
    drawMain(game.canvasArr[1]);
    clearCanv(game.canvas);
    game.canvas.getContext('2d').drawImage(game.canvasArr[1],0,0);
    
  }else{
    //normal
    clearCanv(game.canvas);
    drawMain(game.canvas);
  }
}
module draw{
  export var buffer=false;
}


function drawDefault(c:HTMLCanvasElement){
  drawAll(game.vars.drawList,c);
  /*
  game.data.obj.player.drawOn(c);
  // draw each dot (forEach?)
  game.data.obj.dots.map( d => {d.drawOn(c);})
//*/
}

function drawAll(obj:any,c:HTMLCanvasElement){
    if(obj instanceof Array){
      obj.map(d => {drawAll(d,c);})
    }else if(typeof obj.drawOn==='function'){
        obj.drawOn(c);
    }
}
