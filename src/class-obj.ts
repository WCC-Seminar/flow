/// <reference path="ref.ts" />
/// <reference path="class-objnode.ts" />

class ObjBox implements Obj{
  public drawOn(c:HTMLCanvasElement){
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "rgba(" +
      this.col.r.toString() + ", " +
      this.col.g.toString() + ", " +
      this.col.b.toString() + ", " +
      this.col.a.toString() + ")";
    ctx.fillRect(this.loc.x -this.size.x/2, this.loc.y-this.size.y/2 , this.size.x , this.size.y);
    ctx.fillStyle = "rgba(0,0,0,"+ this.col.a.toString() +")";
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(this.text,this.loc.x,this.loc.y,this.size.y);
  }
  constructor(
    public loc:Vector, //center position, NOT the lefttop position
    public size:Vector,
    protected col:RGBA=new RGBA(0,0,0,0),
    public text:string=""){}
}


class ObjTextBox extends ObjBox{
  public drawOn(c:HTMLCanvasElement){
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "rgba(" +
      this.col.r.toString() + ", " +
      this.col.g.toString() + ", " +
      this.col.b.toString() + ", " +
      this.col.a.toString() + ")";
    ctx.fillRect(this.loc.x -this.size.x/2, this.loc.y-this.size.y/2 , this.size.x , this.size.y);
    ctx.fillStyle = "#000000";
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(this.text,this.loc.x,this.loc.y,this.size.x);
  }
}
