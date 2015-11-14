/// <reference path="ref.ts" />
// flow.hs {{{
function clearCanv(c : HTMLCanvasElement) : void {
  c.getContext('2d').clearRect(0,0, c.width, c.height);
}

var normalColor : RGBA = new RGBA (0, 250, 100, 0.7);
var hitColor : RGBA = new RGBA(230,150,100,0.7);

var player : Dot = new Dot (
  new Vector(250, 450),
  new Vector (0,0),
  normalColor,
  5
);

var maxPlayerSpeed : number = 30;

function handleCollision(pl : Dot, dots: Dot[]) : void{
  // if any of the dot collides ..
  for (var i=0; i<dots.length; i++){
    if (collides(pl, dots[i])) {
      pl.col = hitColor;
      return;
    }
  }
  pl.col = normalColor;
}

// add another dot if there are less than required.
// (I took add-one-dot-at-a-time strategy here to avoid many dots rushing in.)
function replenishDots(n:number, ds:Dot[]) : void {
  if (ds.length < n) {
    ds.push(spawn(updateSpawnConfig));
  }
}
// }}}
