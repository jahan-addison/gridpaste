var Point = function(board, coords) {
  this.board  = board;
  this.coords = coords;
};

Point.prototype = (function() {
  /* Private */
  var getPointIfExists = function() {
    var points = this.board.points;
    for (point in this.board.points) {
      if (this.board.points.hasOwnProperty(point)) {
        if (points[point].coords.usrCoords[1] == this.coords[0] &&
            points[point].coords.usrCoords[2] == this.coords[1]) {
          return points[point];
        }
      }
    }
    return false;
  };
  /* Public */
  return {
    Constructor: Point,
    add: function() {
      //var point = getPointIfExists.call(this);
      var point = false;
      if (!point) {
        var p = this.board.create("point", this.coords, { infoboxDigits: 'none'});
        Object.defineProperty(this.board.points, p.name, 
          {value: p,
           enumerable:   true,
           configurable: true});
        // prevent dilation
        p.on("mousedown", (require("../helper/drag")));
        p.on("mouseout",  function(e) { this.isDraggable = true; });
        return p;
      } else {
        return point;
      }
    }
  }; 

})();

module.exports = Point;
