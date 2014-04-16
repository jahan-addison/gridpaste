var transform = require('../board/transform'),
    coords    = require('../helper/coords')();

/* Commands */

/*--
Interface Command {
  public void   constructor(JSXGraph board, Object Arguments)
  public void   remove()
  public object execute()
}
--*/

var rotate = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    degrees: parseInt($('input[name="degrees"]:last').val()),
  },
    usrPoints = this.points = {};  

  args.points = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == args.figure) {
      args.points = shape.usrSetCoords;
    }
  });
  delete args.figure;
  this.rotate = new transform(board, "rotate", args);
  this.remove = function() {
    for (p in this.points) {
      console.log(p);
      if (this.points.hasOwnProperty(p)) {
        console.log(this.points[p]);
        // free it 
        board.points[p].setPosition(JXG.COORDS_BY_USER, this.points[p]);
        board.update();
      }
    }
  };
  this.execute = function() {
    args.points.forEach(function(p) {
      Object.defineProperty(usrPoints, p.name, {
        value: [
          board.points[p.name].coords.usrCoords[1],
          board.points[p.name].coords.usrCoords[2]
        ],
        enumerable: true
      });
    });
    this.rotate.apply();
    return args;
  };
};

module.exports = {
  rotate: rotate
};