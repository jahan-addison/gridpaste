var point = require('./point');

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

    this.board.create("circle", [p1, this.options.radius]);
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

    this.board.create("angle", [p1, p2, p3]);

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

    this.board.create("arc", [p1, p2, p3]);

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

    this.board.create("ellipse", [p1, p2, p3]);

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

    this.board.create("segment", [p1, p2]);

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

    this.board.create("line", [p1, p2]);

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

    var l1 = this.board.create("line",
      [p1, p2]
    );
    var p3 = new point(this.board, this.options.point3).add();

    this.board.create("parabola", [p3, l1]);

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
      var point = new point(this.board, this.options[i]).add();
      vertices.push(point);      
    }

    this.board.create("polygon", vertices);

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