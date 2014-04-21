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
      board.shapes.forEach(function(shape, i) {
        board.removeObject(shape);
        board.shapes.splice(i, 1);

      });
      board.update();

      App.clearCommandList();

      // Reset recording UI
      require('./record')(App); // reattach record events   
      $('.start-record').removeClass('dim').html('Start Record');
      $('.end-record').removeClass('dim').html('End Record');
    })
  });
};