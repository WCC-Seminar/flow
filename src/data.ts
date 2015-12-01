/// <reference path="ref.ts" />

module game {
  export var canvas:HTMLCanvasElement;
  export var canvasArr:HTMLCanvasElement[]=[];
  export var log;
  export module data{
    export module obj{
      export var dots:Dot[]=[];
      export var player:Dot;
    }
    export module stage{
      export var playerInitPos:Vector;
    }
  };
  export module settings{
    export var isBuffer;
    export var isDoubleBuffer;
  }
  export module control{
    export var pressed=[];
  }
  export module vars {
    //export var t:number=0;
    export var fps2=60;
    export var fps=60;
    export var drawList=[];
  }
}
