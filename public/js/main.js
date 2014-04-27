$(function() {
  'use strict';
  var board;
  (function() {
    var $paste = $('#application').hasClass('paste');
    var xx = $paste ? 120 : 100,
        yy = $paste ? 60  : 55;   
    /* Board Options */
    JXG.Options.angle.orthoType = "root";
    JXG.Options.angle.radius    = 25;
    JXG.Options.elements.fixed  = true;
    board  = JXG.JSXGraph.initBoard('grid', {
      boundingbox:     [-xx,yy,xx,-yy],
      keepaspectratio: true,
      showCopyright:   false,
      showNavigation:  false 
    });
    board.points = {};
    board.shapes = [];
    var axx      = board.axx = board.create('axis',[[0,0],[1,0]]);
    var axy      = board.axy = board.create('axis',[[0,0],[0,1]]);
     
    board.unsuspendUpdate();    
  })();
  if (!$('#application').hasClass('paste')) {
    /* Subscribe to application */
    var App  = require('./subscribe')(board);
  } else {
    /* Play Paste */
    require('./helper/play')($AppPaste, board);
    $('.play').click();
    // Replay
    $('.replay').click(function() {
      require('./helper/play')($AppPaste, board);
    });
    // Start new
    $('.new').click(function() {
      window.location.href = '/';
    });
  }
}); 