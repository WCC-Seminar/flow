/// <reference path="ref.ts" />
// flow.hs {{{
var normalColor : RGBA = new RGBA (0, 250, 100, 0.7);
var hitColor : RGBA = new RGBA(230,150,100,0.7);

var maxPlayerSpeed : number = 30;

function handleCollision(pl : Dot, dots: Dot[]) : void{
  // if any of the dot collides ..
  for (var i=0; i<dots.length; i++){
    if(dots[i].near(pl.loc)){
      if (collides(pl, dots[i])) {
        pl.col = hitColor;
        return;
      }}
  }
  pl.col = normalColor;
}


// add another dot if there are less than required.
// (I took add-one-dot-at-a-time strategy here to avoid many dots rushing in.)
/*
function replenishDots(n:number, ds:Dot[]) : void {
  if (ds.length < n) {
    ds.push(spawn(updateSpawnConfig));
    //return replenishDots(n,ds); //for tests
  }
}
//*/
function replenishDotsTest(n:number, ds:Dot[]) : void {
  var cnt=0;
  while (ds.length < n) {
    if(game.vars.t<50*cnt/3){return;}
    cnt=cnt+1;
    ds.push(spawn(updateSpawnConfig));
  }
}
var replenishDots=replenishDotsTest;
// }}}
