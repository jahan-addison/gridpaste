var iterator = require('../iterate'),
    command  = require('../events/run');


module.exports = function(App, board) {

  var clear = function(board) {
    for(point in board.points) {
      if (board.points.hasOwnProperty(point)) {
        board.removeObject(board.points[point]);
        delete board.points[point];
      }
    }
    var size = board.shapes.length;
    for (var i = 0; i < size; i++) {
      board.removeObject(board.shapes[i]);
      board.shapes.splice(i, 1);
    }
    board.shapes.splice(0, 1);
    $('.undo').removeClass('visible');
    board.zoom100();
    board.update();
  };
  clear(board);
  if ($('#application').hasClass('paste')) {
    var AppIterator = new iterator($AppPaste);
    board.animate();
    var play;
    play = setInterval(function() {
      var next         = AppIterator.next();
      console.log(next);
      target           = next.toString.split('.');       
      var $constructor = command[target[0]][target[1]];
      var $command     = new $constructor(board, next.arguments);      
      $command.execute();
      if(!AppIterator.hasNext()) {
        clearInterval(play);
      }
    }, 1100);
  } else {
    $('.play').click(function() {
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
          $('.play').unbind()
            .addClass('dim');
        }
      }, 1100);
    });
  }
};