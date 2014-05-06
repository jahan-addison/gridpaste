$(function() {
  'use strict';
  var board;
  (function() {
    var $paste = $('#application').hasClass('paste');
    var xx =  $(window).width()  / 17,
        yy =  $(window).height() / 15.7;   
    /* Board Options */
    JXG.Options.angle.orthoType     = "root";
    JXG.Options.angle.radius        = 25;
    JXG.Options.polygon.fillOpacity = 0.46;
    JXG.Options.polygon.fillColor   = "#0ece16";
    JXG.Options.elements.fixed      = true;
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
    /* Show coordinates at mouse */
    if (!$paste) {
      require('./helper/mouse')(board);
    }
    board.unsuspendUpdate();    
  })();
  if (!$('#application').hasClass('paste')) {
    /* Subscribe to application */
    var App = require('./subscribe')(board);
  } else {
    /* Play Paste */
    require('./helper/play')($AppPaste, board);
    $('.play').click();
    // Replay button
    $('.replay').click(function() {
      require('./helper/play')($AppPaste, board);
    });
    // Start new button
    $('.new').click(function() {
      window.location.href = '/';
    });
  }
}); 