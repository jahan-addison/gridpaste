var iterator = require('../iterate'),
    command  = require('../events/run');


module.exports = function(App, board) {
  if (board.playing) {
    return false;
  }
  if (typeof board.playing === 'undefined') {
    board.playing = true;
  }
  var clear = function(board) {
    for(point in board.points) {
      if (board.points.hasOwnProperty(point)) {
        board.removeObject(board.points[point]);
      }
    }
    board.points = {};
    var size = board.shapes.length;
    for (var i = 0; i < size; i++) {
      board.removeObject(board.shapes[i]);
    }
    board.shapes = [];
    $('.undo').removeClass('visible');
    board.zoom100();
    board.update();
  };
  if ($('#application').hasClass('paste')) {
    clear(board);
    var AppIterator = new iterator($AppPaste);
    board.animate();
    var play;
    play = setInterval(function() {
      var next         = AppIterator.next();
      target           = next.toString.split('.');       
      var $constructor = command[target[0]][target[1]];
      var $command     = new $constructor(board, next.arguments);      
      $command.execute();
      if(!AppIterator.hasNext()) {
        clearInterval(play);
        board.playing = undefined;
      }
    }, 1100);
  } else {
    $('.play').click(function() {
      clear(board);
      if (!Object.isFrozen(App)) {
        return false;
      }
      var AppIterator = new iterator(App.getRecorded);
      board.animate();
      var play;
      play = setInterval(function() {
        var next         = AppIterator.next();
        target           = next.toString.split('.');       
        var $constructor = command[target[0]][target[1]];
        var $command     = new $constructor(board, next.arguments);      
        $command.execute();
        if(!AppIterator.hasNext()) {
          clearInterval(play);
          board.playing = undefined;
          $('.play').unbind()
            .addClass('dim');
        }
      }, 1100);
    });
  }
};