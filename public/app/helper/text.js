var still;
module.exports = function(board, text) {
  if (typeof text.labelAt !== 'undefined') {
    return false;
  }
    still = setTimeout(function() {
      text.labelAt = board.create("text", 
        [text.X() - 5, text.Y(), // away from cursor
        text.name]
      );
      setTimeout(function() {
        if (typeof text.labelAt !== 'undefined') {
          clearTimeout(still);
          if (typeof text.labelAt !== 'undefined') {
            board.removeObject(text.labelAt);
            delete text.labelAt;
          }
        }        
      }, 1000);
    }, 300);
};