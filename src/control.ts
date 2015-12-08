/// <reference path="ref.ts" />
/// <reference path="class-obj.ts" />
/// <reference path="class-objnode.ts" />

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

  var b= newCreatedWindow.appendChild(
    new ObjNodeSelectorH(
      new ObjBox(
        new Vector(loc.x,boxlocy),
        new Vector(size.x*0.9,size.y/3)
      ),[])
      );
b.children=
      buttons.map( btn => {
        return new ObjNodeSelectorButton(
          new ObjBox(
            new Vector(loc.x,boxlocy),
            new Vector(Math.min(size.x/5,size.x*0.8/buttons.length),size.y/6),
            new RGBA(220,220,220,128),
            btn[0]
          ),
          newCreatedWindow,
          btn[1],
          b
        )});
        return b;
}

var gameWindow=new ObjNode(undefined,undefined,false);
