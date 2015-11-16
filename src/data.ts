/// <reference path="ref.ts" />

module game {
  export var canvas:HTMLCanvasElement;
  export var canvasArr:HTMLCanvasElement[]=[];
  export var log;
  export module data{
    export var dots:Dot[];
  };
  export module settings{
    export var isBuffer;
    export var isDoubleBuffer;
  }
  export module control{
    export var pressed=[];
  }
  export module vars {
    export var t:number;
    export var fps=60;
  }
}
