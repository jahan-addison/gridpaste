module.exports = function(board) {
  $(function() {
    $('.zoom').click(function() {
      if ($(this).attr('class').indexOf('in') != -1) {
        board.zoomIn();
      }
      if ($(this).attr('class').indexOf('out') != -1) {
        board.zoomOut();
    }
    });
  });
};