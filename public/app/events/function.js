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
    return args;
  };
  this.remove = function() {
      board.removeObject(this.textElement);
      board.shapes.pop();
  };
};

var area = function(board, args) {
  if (typeof args === 'undefined') {
    var parse = new Parser($('input.function').val());
    parse.run();
    if (parse.arguments.length != 1) {
      throw new SyntaxError("requires 1 argument");
    }
    var valid = parse.arguments.every(function(e) {
      return e.type == "label";
    });
    if (!valid) {
      throw new SyntaxError("invalid argument type");
    }
     var funcArgs = args = parse.arguments;
  } else {
    if (typeof args.args !== 'undefined') {
      args = args.args;
    }
  } 
  var label  = args.map(function(e) {
    return e.argument;
  }).join(''),
      realArgs = {},
      shape;
  board.shapes.forEach(function(e) {
    if (e.name === label) {
      shape = e;
    }
  });
  if (typeof shape === 'undefined') {
    throw new ReferenceError("structure " + label + " does not exist");
  }
  if (typeof shape.vertices === 'undefined') {
    throw new ReferenceError("structure " + label + " is not a polygon");
  }
  realArgs.X        = [];
  realArgs.Y        = [];
  realArgs.vertices = 0;
  var temp = shape.vertices.pop();
  shape.vertices.forEach(function(vertex) {
    realArgs.X.push(vertex.coords.usrCoords[1]);
    realArgs.Y.push(vertex.coords.usrCoords[2]);
    realArgs.vertices++;
  });
  shape.vertices.push(temp);
  this.func = new func(JXG, "area", realArgs); 
  this.execute = function() {
    var result  = this.func.run();
    this.textElement = new element(board, "text", {
      position: [realArgs.X[0] + 5, realArgs.Y[0] + 1],
      size: 18,
      text: "Area: " + parseFloat(result)
    }).draw();
    return args;
  };
  this.remove = function() {
      board.removeObject(this.textElement);
      board.shapes.pop();
  }; 
};

module.exports = {
  angle: angle,
  area:  area
};