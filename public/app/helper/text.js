var still;
module.exports = function(board, text) {
    still = setTimeout(function() {
      board.labelAt = board.create("text", 
        [text.X() - 5, text.Y(), // away from cursor
        text.name]
      );
      setTimeout(function() {
        if (typeof still !== 'undefined') {
          clearTimeout(still);
          if (typeof board.labelAt !== 'undefined') {
            board.removeObject(board.labelAt);
          }
        }        
      }, 1000);
    }, 300);

};