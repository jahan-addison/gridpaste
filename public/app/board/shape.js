var Shape = function(board, shape, parents, options) {
  this.board   = board;
  this.shape   = shape;
  this.parents = parents;
  this.options = options || {};
};

Shape.prototype = (function() {
  /* Private */
  var createShapeLabel = function() {
      return "A" + (this.board.shapes.length + 1);
  };
  /* Public */
  return {
    Constructor: Shape,
    add: function() {
      this.options.name           = this.options.name || createShapeLabel.call(this);
      this.options.withLabel      = true;
      this.options.hasInnerPoints = true;
      var points = this.parents.pop(), // full list of points 
          s      = this.board.create(this.shape, this.parents, this.options);
      s.usrSetCoords = points;
      s.on("mouseover", (require("../helper/drag")));
      this.board.shapes.push(s);
      return s;
    }
  };
})();


module.exports = Shape;