var point = require('./point'),
    shape = require('./shape')

/*
  BoardElement Factory
  */

var BoardElement = function(board, element, options) {
  this.element = element;
  this.options = options;
  return new this[element](board, options);
}

BoardElement.prototype = (function() {

/*--
  Interface Element {
    public void   constructor(JSXGraph board, Object options)
    public void   draw()
  }
*--/

  /*
  Options: {
    center: [float, float],
    radius: float
  }
  */
  var circleElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  circleElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.center).add();
    return new shape(this.board, "circle", [p1, this.options.radius]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float],
    point 3: [float, float]
  }
  */
  var angleElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  angleElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();
    var p3 = new point(this.board, this.options.point3).add();

    return new shape(this.board, "angle", [p1, p2, p3]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float],
    point 3: [float, float]
  }
  */
  var arcElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  arcElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add(); 
    var p2 = new point(this.board, this.options.point2).add();
    var p3 = new point(this.board, this.options.point3).add();

    return new shape(this.board, "arc", [p1, p2, p3]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float],
    point 3: [float, float]
  }
  */
  var ellipseElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  ellipseElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();
    var p3 = new point(this.board, this.options.point3).add();

    return new shape(this.board, "ellipse", [p1, p2, p3]).add();

  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float]
  }
  */
  var segmentElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  segmentElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();

    return new shape(this.board, "segment", [p1, p2]).add();

  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float]
  }
  */
  var lineElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  lineElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();

    return new shape(this.board, "line", [p1, p2]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    line  1: [float, float],
    point 2: [float, float]
  }
  */
  var parabolaElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  parabolaElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();  
    var p2 = new point(this.board, this.options.point2).add();
    var s1 = new shape(this.board, "line", [p1, p2]).add();
    var p3 = new point(this.board, this.options.point3).add();

    return new shape(this.board, "parabola", [p3, s1]).add();

  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    ...
  }
  */
  var polygonElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  polygonElement.prototype.draw = function() {

    var vertices = [];
    for(i in this.options) {
      vertices.push(new point(this.board, this.options[i]).add());
    }

    return new shape(this.board, "polygon", vertices).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point: [float, float]
  }
  */
  var pointElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  pointElement.prototype.draw = function() {
   
    return new point(this.board, this.options.point).add();
   
  };

  return {
    Constructor: BoardElement,
    circle:      circleElement,
    angle:       angleElement,
    arc:         arcElement,
    ellipse:     ellipseElement,
    segment:     segmentElement,
    line:        lineElement,
    parabola:    parabolaElement,
    polygon:     polygonElement,
    point:       pointElement
  };

})();

module.exports = BoardElement; 