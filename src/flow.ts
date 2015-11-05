// helpeer.hs {{{
class Point {
  public x:number; y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}

function vAdd(v0:Point, v1:Point) : Point {
  return (new Point(v0.x + v1.x, v0.y + v1.y));
}

function sMul(a:number, v:Point) : Point {
  return (new Point(a*v.x, a*v.y));
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
  public loc:Point;
  public vel:Point;
  public col:RGB;
  public dir:number;
  private alpha:number = 0.5;
  
  constructor (l:Point, v:Point, c:RGB, d:number){
    this.loc=l; this.vel=v; this.col=c; this.dir=d;
  }

  public drawOn(c: HTMLCanvasElement) : void {
    var ctx = c.getContext('2d');
    // FIXME
    ctx.fillStyle = "rgba(" +
      this.col.r.toString() + ", " +
      this.col.g.toString() + ", " +
      this.col.b.toString() + ", " +
      this.alpha.toString() + ")";
    ctx.arc(this.loc.x, this.loc.y, this.dir, 0, 2*Math.PI);
    ctx.fill();
  }
}

// }}}

function main() : void {
  console.log('hi');
  var n : Point = new Point(4,5);
  console.log(n);
  console.log(vAdd(n,n));
  console.log(sMul(4.2,n));
  var c = <HTMLCanvasElement>document.getElementById('world');
  var p : Dot = new Dot (new Point(50,50), new Point(0,0), new RGB(230,34,230),40);
  p.drawOn(c);
}

window.addEventListener(
  'load', main
)
