// helpeer.hs {{{
class Vector {
  public x:number; y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}

function vAdd(v0:Vector, v1:Vector) : Vector {
  return (new Vector(v0.x + v1.x, v0.y + v1.y));
}

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
}

// }}}

// base.hs {{{
class Dot {
  public loc:Vector;
  public vel:Vector;
  public col:RGB;
  public dia:number;
  private alpha:number = 0.5;
  
  constructor (l:Vector, v:Vector, c:RGB, d:number){
    this.loc=l; this.vel=v; this.col=c; this.dia=d;
  }

  public drawOn(c: HTMLCanvasElement) : void {
    var ctx = c.getContext('2d');
    // FIXME
    ctx.fillStyle = "rgba(" +
      this.col.r.toString() + ", " +
      this.col.g.toString() + ", " +
      this.col.b.toString() + ", " +
      this.alpha.toString() + ")";
    ctx.arc(this.loc.x, this.loc.y, this.dia, 0, 2*Math.PI);
    ctx.fill();
  }
  
  public move(t:number) : Dot {
    var newLoc = vAdd(this.loc, sMul(t,this.vel));
    // TODO
    return new Dot (newLoc, this.vel, this.col, this.dia);
  }
  
  public moveInplace(t:number) : void {
    this.loc = vAdd(this.loc, sMul(t,this.vel));
  }
  
  public accelInplace(maxSpeed:number, dv: Vector) : void {
    this.vel = fitIn(maxSpeed, vAdd(dv, this.vel));
  }
  
  public decelInplace(ratio: number): void {
    this.vel = sMul(ratio, this.vel);
  }

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

var initSpawnConfig = new SpawnConfig(500,250);
var updateSpawnConfig = new SpawnConfig(500,10);

// Num -> Num -> IO Num
function randomR(lowerBound : number, upperBound : number) : number{
  return (Math.random()*(upperBound-lowerBound) + lowerBound);
}

function spawn (c: SpawnConfig) : Dot{
  var loc = new Vector(randomR(0,c.w), randomR(0,c.h));
  // FIXME : hard coded variance
  var vel = new Vector(randomR(-2,2), 5+randomR(-2,2));
  var colour = (new HSV(randomR(0,360), 0.8, 1.0)).toRGB();
  // FIXME : hard coded size
  var dia = randomR(3,15)
  return (new Dot (loc,vel,colour,dia));
}

function spawnN (c: SpawnConfig, n: number) : Dot[] {
  // map skips (and preserves) undefined!?
  var dots = new Array(n);
  for (var i=0; i<n; i++){
    dots[i] = spawn(c);
  }
  return dots;
}

// }}}

function main() : void {
  console.log('hi');
  var n : Vector = new Vector(4,5);
  console.log(n);
  console.log(vAdd(n,n));
  console.log(sMul(4.2,n));
  var c = <HTMLCanvasElement>document.getElementById('world');
  var p : Dot = new Dot (new Vector(50,50), new Vector(0,0), new RGB(230,34,230),40);
  p.drawOn(c);
}

window.addEventListener(
  'load', main
)
