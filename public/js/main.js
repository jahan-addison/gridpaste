$(function() {
  'use strict';
  // start board
  var board;
  (function() {
    /* Board Options */
    JXG.Options.angle.orthoType = "root";
    JXG.Options.angle.radius    = 25;
    
    board     = JXG.JSXGraph.initBoard('grid', {boundingbox:[-100,60,100,-60]});
    var axx   = board.create('axis',[[0,0],[1,0]]);
    var axy   = board.create('axis',[[0,0],[0,1]]);
     
    board.unsuspendUpdate();    
  })();

  // Attach creation events
  require('./events').create(board);


}); 