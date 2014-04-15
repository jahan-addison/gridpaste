var Shape = function(board, shape, options) {
  this.board   = board;
  this.shape   = shape;
  this.options = options;
};

Shape.prototype = (function() {
  /* Private */
  var createShapeLabel = function() {
      return this.board.shapes.length + 1;
  };
  /* Public */
  return {
    Constructor: Shape,
    add: function() {
      var points = this.options.pop(), 
          s      = this.board.create(this.shape,
        this.options,
        {
          name: "Q" + createShapeLabel.call(this),
          withLabel: true
        }
      );
      s.usrSetCoords = points;
      this.board.shapes.push(s);
      return s;
    }
  };
})();


module.exports = Shape;