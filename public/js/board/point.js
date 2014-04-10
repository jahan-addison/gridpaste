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
      var point = getPointIfExists.call(this);
      if (!point) {
        var p = this.board.create("point", this.coords);
        Object.defineProperty(this.board.points, p.name, 
          {value: p,
           enumerable: true});
        return p;
      } else {
        return point;
      }
    }
  }; 

})();

module.exports = Point;