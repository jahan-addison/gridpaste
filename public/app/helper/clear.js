var execute = require('../operation');

module.exports = function(App) {
  $(function() {
    var board = App.board;
    $('.button.clear').click(function() {
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

      App.clearCommandList();

      // Reset recording UI
      require('./record')(App); // reattach record events   
      $('.start-record').removeClass('dim').html('Start Record');
      $('.end-record').removeClass('dim').html('End Record');
    })
  });
};