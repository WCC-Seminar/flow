/// <reference path="ref.ts" />
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
  public inside(left:number,upper:number,right:number,lower:number) : boolean {
    var x = this.loc.x; var y = this.loc.y;
    return (left <= x && x <= right && upper <= y && y <= lower);
  }
  public near(point:Vector,dist:number=game.consts.distSmall){
    return this.inside(point.x-dist,point.y-dist,point.x+dist,point.y+dist);
  }
}

// is two dots colliding?
//only works on SLOW dots!!!
function collides (d0: Dot, d1:Dot) : boolean {
  return (Math.pow((d0.dia + d1.dia),2) >= distSq(d0.loc, d1.loc));
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
    if (this.s === 0) {
      return san(this.v, this.v, this.v);
    }
    else if (this.v === 0){
      return san(0,0,0);
    }
    else {
      var v = this.v;
      var hi = Math.floor(this.h/60);
      var f = this.h/60 - hi;
      var m = this.v*(1-this.s);
      var x =  (hi % 2 === 0) ? this.v * (1- (1-f)*this.s): this.v * (1- f*this.s);
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

//spawn
class SpawnConfig {
  public w : number; // width
  public h : number; // height
  constructor (w:number, h:number) {
    this.w = w; this.h = h;
  }
}
