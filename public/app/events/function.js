var func    = require('../board/functions/functions'),
    Parser  = require('../board/functions/parser'),
    element = require('../board/element');  

/* Commands */

/*--
Interface Command {
  public void   constructor(JSXGraph board, Object Arguments)
  public void   remove()
  public object execute()
}
--*/

var angle = function(board, args) {
  var radiansToDegrees = function(rad) {
    return ( 180 / Math.PI) * rad ;
  };
  if (typeof args === 'undefined') {
    var parse = new Parser($('input.function').val());
    parse.run();
    if (parse.arguments.length != 3) {
      throw new SyntaxError("requires 3 points")
    }
    var letters = '';
    var valid = parse.arguments.every(function(e) {
      return e.type == "letter";
    });
    if (!valid) {
      throw new SyntaxError("invalid argument types");
    }
     var funcArgs = args = parse.arguments;
  } else {
    if (typeof args.args !== 'undefined') {
      args = args.args;
    }
  } 
  var letters  = args.map(function(e) {
    return e.argument;
  }).join(''),
      realArgs = (this.args || args).map(function(e) {
        return board.points[e.argument];
  });
  this.func = new func(JXG, "angle", realArgs);
  this.execute = function() {
    var result  = this.func.run(),
        radians = result.toPrecision(2),
        deg     = radiansToDegrees(result).toPrecision(2);
    this.textElement = new element(board, "text", {
      position: [realArgs[1].coords.usrCoords[1],
      realArgs[1].coords.usrCoords[2] - 2],
      size: 20,
      text: "∠" + letters + ": " + parseFloat(deg) + "°"
    }).draw();
    $('.function').val('');
    return args;
  };
  this.remove = function() {
      board.removeObject(this.textElement);
      board.shapes.pop();
  };
};

module.exports = {
  angle: angle
};