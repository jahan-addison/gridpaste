$(function() {
var brd = JXG.JSXGraph.initBoard('grid', {boundingbox:[-7,3,8,-3]});
var axx = brd.create('axis',[[0,0],[1,0]]);
var axy = brd.create('axis',[[0,0],[0,1]]);
 
brd.suspendUpdate();
brd.create('functiongraph', [function(t){ return Math.sin(t); },-10, 10],{strokeColor: "#cccccc"});
var s = brd.create('slider', [[0.75,-1.5],[5.75,-1.5],[0,0,10]], {name:'S',snapWidth:1});
var x0 = brd.create('glider', [0,0,axx], {name:'x_0'});
brd.create('functiongraph', [
  function(t) {
    var val = 0, i, sv = s.Value()+1, a;
    for(i = 0; i < sv; i++) {
                  if (i%4==0) {
                     a = Math.sin(x0.X());
                  } else if (i%4==1) {
                     a = Math.cos(x0.X());
                  } else if (i%4==2) {
                     a = -Math.sin(x0.X());
                  } else if (i%4==3) {
                     a = -Math.cos(x0.X());
                  }
              val = val + a*Math.pow(t-x0.X(), i) / JXG.Math.factorial(i);
    }
    return val;
  },
-10, 10], {strokeColor: "#bb0000"});
brd.unsuspendUpdate();

});