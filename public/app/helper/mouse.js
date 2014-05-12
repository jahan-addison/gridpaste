module.exports = function(board) {
  var getMouseCoords = function(e, i) {
    var cPos = board.getCoordsTopLeftCorner(e, i),
      absPos = JXG.getPosition(e, i),
      dx = absPos[0]-cPos[0],
      dy = absPos[1]-cPos[1];
    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
  }, i, still;
  board.on("mousemove", function(evt) {
    if (typeof still !== 'undefined') {
      clearTimeout(still);
      if (typeof board.usrAt !== 'undefined') {
        board.removeObject(board.usrAt);
      }
    }
    still = setTimeout(function() {
      var coords = getMouseCoords(evt, i)
        .usrCoords
        .map(function(e) { 
          return parseInt(e); 
        });
      board.usrAt = board.create("text", 
        [coords[1] + 1.2, coords[2] + .5, // away from cursor
        "(" + coords[1] + "," + coords[2] + ")"]
      );
    }, 1000);
  });
  $('#grid').mouseout(function() {
    clearTimeout(still);
  });
};