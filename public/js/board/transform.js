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
    var transform = board.create("transform", 
      [degreeToRadian.call(this, this.options.degrees)],
      {type: "rotate"});

    transform.bindTo(this.options.points);
    board.update();
  };


  return {
    Constructor: BoardTransform,
    rotate:      RotateTransform
  };

})();

module.exports = BoardTransform;