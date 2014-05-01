/* GeometryFunction Factory */

var GeometryFunction = function(JXG, func, options) {
  return new this[func](JXG, options);
};

GeometryFunction.prototype = (function() {

/*--
  Interface Function {
    public void   constructor(JXG, Object options)
    public void   run()
  }
*--*/

  /*
  Options: {
    point1: Point p1,
    point2: Point p2,
    point3: Point p3 (optional)
  }
  */
  var AngleFunction = function(board, options) {
    this.options = options;
    this.board   = board;
  };
  AngleFunction.prototype.run = function() {
    return JXG.Math.Geometry.rad(
      this.options[0],
      this.options[1],
      this.options[2]
    );
  };

  return {
    Constructor: GeometryFunction,
    angle:       AngleFunction
  };

})();

module.exports = GeometryFunction;