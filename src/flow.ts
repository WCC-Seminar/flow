// helpeer.hs {{{
class Vector {
  public x:number; y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}

// Vector plus Vector
function vAdd(v0:Vector, v1:Vector) : Vector {
  return (new Vector(v0.x + v1.x, v0.y + v1.y));
}

// scalar times Vector
function sMul(a:number, v:Vector) : Vector {
  return (new Vector(a*v.x, a*v.y));
}

// returns (dist (v0,v1))^2.
function distSq(v0:Vector, v1:Vector): number {
  return (Math.pow(v0.x-v1.x, 2) + Math.pow(v0.y-v1.y, 2));
}

// normalize a vector so that its norm is equal or less than d.
function fitIn(d:number, v:Vector) : Vector {
  var s = v.x*v.x + v.y*v.y;
  if (s <= d) {
    return v;
  }
  else {
    return sMul((Math.sqrt(d/s)), v);
  }
}


// }}}

// colour.hs {{{
class HSV {
  public h:number; s:number; v:number;
  constructor (h:number, s:number, v:number){
    this.h = h; this.s=s; this.v=v;
  }
  
  public toRGB(): RGB {
    var san = function (x:number, y:number, z:number):RGB {
      return new RGB(Math.floor(x*255), Math.floor(y*255), Math.floor(z*255))
    }
    if (this.s == 0) {
      return san(this.v, this.v, this.v);
    }
    else if (this.v == 0){
      return san(0,0,0);
    }
    else {
      var v = this.v;
      var hi = Math.floor(this.h/60);
      var f = this.h/60 - hi;
      var m = this.v*(1-this.s);
      var x =  (hi % 2 == 0) ? this.v * (1- (1-f)*this.s): this.v * (1- f*this.s);
      switch(hi){
        case (0):
          return san(v,x,m);
        case (1):
            return san(x,v,m);
        case (2):
            return san (m,v,x);
        case (3):
            return san(m,x,v);
        case (4):
            return san(x,m,v);
        default:
            return san(v,m,x);
      }
    }
  }
}

class RGB {
  public r:number; g:number; b:number;
  constructor (r:number, g:number, b:number){
    this.r = r; this.g=g; this.b=b;
  }
  
  withAlpha(a:number) : RGBA {
    return (new RGBA (this.r, this.g, this.b, a));
  }
}

class RGBA{
  public r:number; g:number; b:number; a:number;
  constructor (r:number, g:number, b:number, a:number){
    this.r = r; this.g=g; this.b=b; this.a=a;
  }
}

// }}}

// base.hs {{{
class Dot {
  public loc:Vector; // location
  public vel:Vector; // velocity
  public col:RGBA;    // colour used for this dot
  public dia:number; // diameter
  
  constructor (l:Vector, v:Vector, c:RGBA, d:number){
    this.loc=l; this.vel=v; this.col=c; this.dia=d;
  }

  public drawOn(c: HTMLCanvasElement) : void {
    var ctx = c.getContext('2d');
    // FIXME
    ctx.beginPath();
    ctx.fillStyle = "rgba(" +
      this.col.r.toString() + ", " +
      this.col.g.toString() + ", " +
      this.col.b.toString() + ", " +
      this.col.a.toString() + ")";
    ctx.arc(this.loc.x, this.loc.y, this.dia, 0, 2*Math.PI);
    ctx.fill();
  }
  
  public move(t:number) : Dot {
    var newLoc = vAdd(this.loc, sMul(t,this.vel));
    return new Dot (newLoc, this.vel, this.col, this.dia);
  }
  
  // move (by v*t), in place.
  public moveInplace(t:number) : void {
    this.loc = vAdd(this.loc, sMul(t,this.vel));
  }
  
  // accelerate in place by dv, resulting in speed not exceeding maxSpeed.
  public accelInplace(maxSpeed:number, dv: Vector) : void {
    this.vel = fitIn(maxSpeed, vAdd(dv, this.vel));
  }
  
  // decelerate. Mainly for decelerating smoothly when the player presses
  // no buttons.
  public decelInplace(ratio: number): void {
    this.vel = sMul(ratio, this.vel);
  }

  // is this dot inside the rectangular (width*height)?
  public inside(w:number, h:number) : boolean {
    var x = this.loc.x; var y = this.loc.y;
    return (0 <= x && x <= w && 0 <= y && y <= h);
  }
}

// is two dots colliding?
function collides (d0: Dot, d1:Dot) : boolean {
  return (Math.pow((d0.dia + d1.dia),2) <= distSq(d0.loc, d1.loc));
}

// }}}

// spawn.hs {{{
class SpawnConfig {
  public w : number; // width
  public h : number; // height
  constructor (w:number, h:number) {
    this.w = w; this.h = h;
  }
}

// used for initialising
var initSpawnConfig = new SpawnConfig(500,250);
// used for supplementation for lost dots
var updateSpawnConfig = new SpawnConfig(500,10);

// helper. Num -> Num -> IO Num
function randomR(lowerBound : number, upperBound : number) : number{
  return (Math.random()*(upperBound-lowerBound) + lowerBound);
}

// spawn one dot
function spawn (c: SpawnConfig) : Dot{
  var loc = new Vector(randomR(0,c.w), randomR(0,c.h));
  // FIXME : hard coded variance
  var vel = new Vector(randomR(-2,2), 5+randomR(-2,2));
  var colour = (new HSV(randomR(0,360), 0.8, 1.0)).toRGB().withAlpha(0.5);
  // FIXME : hard coded size
  var dia = randomR(3,15)
  return (new Dot (loc,vel,colour,dia));
}

// spawn n dots
function spawnN (c: SpawnConfig, n: number) : Dot[] {
  // map skips (and preserves) undefined!?
  var dots = new Array(n);
  for (var i=0; i<n; i++){
    dots[i] = spawn(c);
  }
  return dots;
}

// }}}

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
    default:
      return (new Vector(0,0));
  }
}

// given a list of pressed keys, returns the acceleration.
function fromPressed(pressed: boolean[]) : Vector {
  return (
    pressed
      .map((pr,i) => {return (keyConfig(i)); })
      .reduce(((acc, v) => {return vAdd(acc,v)}), new Vector(0,0))
      );
}

// }}}

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
    if (a.x !== 0 && a.y !== 0) {
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
)
