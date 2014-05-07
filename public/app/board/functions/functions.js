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
    point3: Point p3
  }
  */
  var AngleFunction = function(JXG, options) {
    this.options = options;
    this.JXG     = JXG;
  };
  AngleFunction.prototype.run = function() {
    return this.JXG.Math.Geometry.rad(
      this.options[0],
      this.options[1],
      this.options[2]
    );
  };

  /* 
  Options:
    X:        [point1, point2, point3, ...],
    Y:        [point1, point2, point3, ...],
    vertices: unsigned integer,

   */

  /* http://alienryderflex.com/polygon_area/ */

  var polygonAreaFunction = function(JXG, options) {
    this.options = options;    
  }

  polygonAreaFunction.prototype.run = function() {
    var area = 0,
        j    = this.options.vertices-1,
        i;
    for (i = 0; i < this.options.vertices; i++) {
      area = area + (this.options.X[j] + this.options.X[i]) * (this.options.Y[j] - this.options.Y[i]);
      j    = i;
    }

    return Math.abs( area / 2 );
  };

  /* 
  Options:
    Radius: Float
  */

  var CircleAreaFunction = function(JXG, options) {
    this.options = options;    
  };

  CircleAreaFunction.prototype.run = function() {
    return Math.PI * Math.pow(this.options.radius, 2);    
  };

  return {
    Constructor:  GeometryFunction,
    angle:        AngleFunction,
    polygon_area: polygonAreaFunction,
    circle_area:  CircleAreaFunction
  };

})();

module.exports = GeometryFunction;