/// <reference path="ref.ts" />

class ObjNode {
  public next:()=>void = this.parent?this.parent.next:function(){};
  public back:()=>void = this.parent?this.parent.back:function(){};
  public up:()=>void = this.parent?this.parent.up:function(){};
  public down:()=>void = this.parent?this.parent.down:function(){};
  public right:()=>void =this.parent?this.parent.right:function(){};
  public left:()=>void = this.parent?this.parent.left:function(){};
  
  public appendChild(newChild:ObjNode){
    newChild.parent=this;
    this.focusNum=this.children.push(newChild)-1;
    return this;
  }
  public remove(){
    this.children.map(d =>d.remove());
    delete this.children;
    var n=this.parent.children.indexOf(this);
    delete this.parent.children[n];
    this.parent.children.splice(n,1);
    
  }
  public focusNum:number=0;
  public focus():ObjNode{
    return (this.children[this.focusNum])?(this.children[this.focusNum]).focus():this;
  }
  public getFocus(){
    if(!this.parent){
      this.parent.focusNum=this.parent.children.indexOf(this);
      this.parent.getFocus();
    }
  }
  
  public drawOn(c){
    if(this.visible&&typeof this.obj.drawOn==='function'){this.obj.drawOn(c)};
    //for(var i=0;i<this.children.length;i++){this.children[i].drawOn(c);}
    drawAll(this.children,c);
  }
  
  constructor(
    public obj:Obj,
    public parent:ObjNode=undefined,
    private visible=true,
    public children:ObjNode[]=[]
  ){ this.parent?this.parent.appendChild(this):false; }
}


class ObjNodeSuperWindow extends ObjNode{
  public appendChild(newChild:ObjNode):ObjNodeSuperWindow{ super.appendChild(newChild);return this;}
  public children:ObjNodeSuperWindow[];
  public obj:ObjBox;
  public closeWindow:()=>void=function(){
    //if(this.parent instanceof ObjNodeSuperWindow){this.parent.closeWindow();}
    this.remove();}
}
class ObjNodeWindow extends ObjNodeSuperWindow{
  public next=function(){};//this.closeWindow;
  public back=function(){}//this.closeWindow;
  public up= function(){};
  public down= function(){};
  public right=function(){};
  public left=function(){};
  public closeWindow:()=>void=function(){this.remove();}
}


//Use ObjNodeSelectorV or ObjNodeSelectorH
class ObjNodeSelector extends ObjNodeSuperWindow{
  public next=this.children?this.focus().next:function(){};
  public back=this.parent?this.parent.back:function(){};
  public selectForward(){return this.focusNum=(this.focusNum+1)%this.children.length;}
  public selectBackward(){return this.focusNum=(this.focusNum+this.children.length-1)%this.children.length;}
  constructor(
    obj:ObjBox,
    public children?:ObjNodeSuperWindow[],
    parent?:ObjNode
  ){
    super(obj,parent,true,children);
  }  
}

class ObjNodeSelectorV extends ObjNodeSelector{
  public up=super.selectBackward;
  public down=super.selectForward;
  private alignChildren(){
    var w=this.obj.size.y/2;
    for(var i=this.children.length;i--;){
      this.children[i].obj.loc.x=this.obj.loc.x;
      this.children[i].obj.loc.y=this.obj.loc.y
        +((2*i+1)/this.children.length-1)*w;
    }
  }
  public appendChild(newChild:ObjNodeSuperWindow){
    super.appendChild(newChild);
    this.alignChildren();
    return this;
  }
  constructor(obj:ObjBox, children:ObjNodeSuperWindow[]=[], parent?:ObjNode ){
    super(obj,children,parent);
    this.alignChildren();
    this.focusNum=0;
  }
}


class ObjNodeSelectorH extends ObjNodeSelector{
  public right=super.selectForward;
  public left=super.selectBackward;
  private alignChildren(){
    for(var i=this.children.length;i--;){
      this.children[i].obj.loc.y=this.obj.loc.y;
      this.children[i].obj.loc.x=this.obj.loc.x
        +((2*i+1)/this.children.length-1)*this.obj.size.x/2;
    }
  }
  public appendChild(newChild:ObjNodeSuperWindow){
    super.appendChild(newChild);
    this.alignChildren();
    return this;
  }
  constructor(public obj:ObjBox, children:ObjNodeSuperWindow[]=[],parent?:ObjNode){
    super(obj,children,parent);
    this.alignChildren();
    this.focusNum=0;
  }
}

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

class ObjNodeSelectorButton extends ObjNodeSuperWindow{
  constructor(
    public obj:ObjBox,
    public closeTarget:ObjNodeSuperWindow,
    public next?:()=>any,
    public parent:ObjNodeSuperWindow=undefined
  ){
    super(obj,parent);
    this.next=function(){this.closeTarget.closeWindow();next&&next();};
  }
}

function createMessageBox(
  text:string,
  loc:Vector,
  size:Vector,
  buttonText:string="OK",
  next?:()=>any,
  parent:ObjNode=undefined
){
  var newCreatedWindow:ObjNodeWindow=new ObjNodeWindow(
    new ObjBox(
      loc,size,new RGBA(240,240,240,240)
    ),parent)
    .appendChild(
      new ObjNodeWindow(
        new ObjTextBox(
          new Vector(loc.x,loc.y-size.y*1/8),
          new Vector(size.x*0.9,size.y*0.7),
          new RGBA(0,0,0,0),
          text)));
  
  var newCreatedButton=new ObjNodeSelectorButton(
    new ObjBox(
      new Vector(loc.x,loc.y+size.y*1/4),
      new Vector(size.x/5,size.y/6),
      new RGBA(220,220,220,128),
      "OK"
    ),
    newCreatedWindow,
    next
  );
  
  return newCreatedWindow.appendChild(newCreatedButton);
}


function createSelectorBox(
  text:string,
  loc:Vector,
  size:Vector,
  buttons:[string,()=>any][],
  parent:ObjNode=undefined
){
  var newCreatedWindow:ObjNodeWindow=new ObjNodeWindow(
    new ObjBox(
      loc,size,new RGBA(240,240,240,240)
    ),parent)
    .appendChild(
      new ObjNodeWindow(
        new ObjTextBox(
          new Vector(loc.x,loc.y-size.y*1/8),
          new Vector(size.x*0.9,size.y*0.7),
          new RGBA(0,0,0,0),
          text)));
  var boxlocy=loc.y+size.y*1/4;

  return newCreatedWindow.appendChild(
    new ObjNodeSelectorH(
      new ObjBox(
        new Vector(loc.x,boxlocy),
        new Vector(size.x*0.9,size.y/3)
      ),
      buttons.map( btn => {
        return new ObjNodeSelectorButton(
          new ObjBox(
            new Vector(loc.x,boxlocy),
            new Vector(Math.min(size.x/5,size.x*0.8/buttons.length),size.y/6),
            new RGBA(220,220,220,128),
            btn[0]
          ),
          newCreatedWindow,
          btn[1]
        );
      }))
  );
}

var gameWindow=new ObjNode(undefined,undefined,false);
