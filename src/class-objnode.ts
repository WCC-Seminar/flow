/// <reference path="ref.ts" />
/// <reference path="class-obj.ts" />

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
    (this.parent)&&(this.parent.focusNum=this.parent.children.indexOf(this))&&(this.parent.getFocus());    
    return this;
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
    return this;
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
    return this;
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
