/// <reference path="ref.ts" />
// spawn.hs {{{

// used for initialising
var initSpawnConfig = new SpawnConfig(500,250);
// used for supplementation for lost dots
var updateSpawnConfig = new SpawnConfig(500,10);

// helper. Num -> Num -> IO Num
function randomR(lowerBound : number, upperBound : number) : number{
  return (Math.random()*(upperBound-lowerBound) + lowerBound);
}

// spawn one dot
function spawnDefault (c: SpawnConfig) : Dot{
  var loc = new Vector(randomR(0,c.w), randomR(0,c.h));
  // FIXME : hard coded variance
  var vel = new Vector(randomR(-2,2), 5+randomR(-2,2));
  var colour = (new HSV(randomR(0,360), 0.8, 1.0)).toRGB().withAlpha(0.5);
  // FIXME : hard coded size
  var dia = randomR(3,15)
  return (new Dot (loc,vel,colour,dia));
}

var spawn=spawnDefault;

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
