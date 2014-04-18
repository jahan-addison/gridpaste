/*
  BoardTransform Factory
  */

var BoardTransform = function(board, transform, options) {
  this.board  = board;
  this.otions = options;
  return new this[transform](board, options);
};

BoardTransform.prototype = (function() {

  var degreeToRadian = function(deg) {
    return ( Math.PI / 180 ) * deg; 
  };

/*--
  Interface Transform {
    public void   constructor(JSXGraph board, Object options)
    public void   apply()
  }
*--*/

  /*
  Options: {
    degrees: signed int
    points:  [Point p1, Point p2, ...]
  }
  */

  var RotateTransform = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  RotateTransform.prototype.apply = function() {
    var transform = this.board.create("transform", 
      [degreeToRadian.call(this, this.options.degrees)],
      {type: "rotate"});

    transform.bindTo(this.options.points);
    this.board.update();
  };

  /*
  Options: {
    line:   Line line
    points: [Point p1, Point p2, ...]
  }
  */

  var ReflectTransform = function(board, options) {
    this.options = options;
    this.board   = board;
  }

  ReflectTransform.prototype.apply = function() {
    var transform = this.board.create("transform", 
      [this.options.line],
      {type: "reflect"});

    transform.bindTo(this.options.points);
    this.board.update();
  };

  /*
  Options: {
    degrees: signed int
    points:  [Point p1, Point p2, ...]
  }
  */

  var ShearTransform = function(board, options) {
    this.options = options;
    this.board   = board;
  }

  ShearTransform.prototype.apply = function() {
    var transform = this.board.create("transform", 
      [degreeToRadian.call(this, this.options.degrees), 0],
      {type: "shear"});
    console.log(degreeToRadian.call(this, this.options.degrees));
    transform.bindTo(this.options.points);
    this.board.update();
  };

  return {
    Constructor: BoardTransform,
    rotate:      RotateTransform,
    reflect:     ReflectTransform,
    shear:       ShearTransform
  };

})();

module.exports = BoardTransform;