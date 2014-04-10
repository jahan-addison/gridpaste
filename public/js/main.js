$(function() {
  'use strict';
  var board;
  (function() {
    /* Board Options */
    JXG.Options.angle.orthoType = "root";
    JXG.Options.angle.radius    = 25;
    JXG.Options.elements.fixed  = true;
    
    board        = JXG.JSXGraph.initBoard('grid', {
      boundingbox:     [-100,60,100,-60],
      keepaspectratio: true,
      showCopyright:   false,
      showNavigation:  false 
    });
    board.points = {};
    var axx      = board.create('axis',[[0,0],[1,0]]);
    var axy      = board.create('axis',[[0,0],[0,1]]);
     
    board.unsuspendUpdate();    
  })();

  /* Subscribe to application */
  var App = require('./subscribe')(board);

}); 