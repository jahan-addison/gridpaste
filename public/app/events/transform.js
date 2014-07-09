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
    center:  $('input[name="point"]:last').val(),
    degrees: parseInt($('input[name="degrees"]:last').val()),
  },
    usrPoints = this.points = {};  
  var transformArgs = {};
  for (arg in args) {
    if (args.hasOwnProperty(arg)) {
      transformArgs[arg] = args[arg];
    }
  }
  transformArgs.points = [];
  board.shapes.forEach(function(shape) {
    if (shape.name == transformArgs.figure) {
      transformArgs.points = shape.usrSetCoords;
    }
  });
  delete transformArgs.figure;
  this.rotate = new transform(board, "rotate", transformArgs);
  this.remove = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].update();
        board.points[p].setPosition(JXG.COORDS_BY_USER, this.points[p]);
        board.update();
      }
    }
  };
  this.execute = function() {
    transformArgs.points.forEach(function(p) {
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

var reflect = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    line:    $('input[name="axis"]:last').val(),
  },
    usrPoints = this.points = {};  
  var transformArgs = {};
  for (arg in args) {
    if (args.hasOwnProperty(arg)) {
      transformArgs[arg] = args[arg];
    }
  }
  this.line = transformArgs.line;
  transformArgs.points = [];
  if (transformArgs.line.toLowerCase() == "x") {
    transformArgs.line = board.axx;
  } else {
    transformArgs.line = board.axy;
  }
  board.shapes.forEach(function(shape) {
    if (shape.name == transformArgs.figure) {
      transformArgs.points = shape.usrSetCoords;
    }
  });
  // a single point
  if (!transformArgs.points.length) {
    for(p in board.points) {
      if (board.points.hasOwnProperty(p)) {
        if (board.points[p].name + '0' == transformArgs.figure) {
          transformArgs.points = [board.points[p]];
        }
      }
    }
  }
  delete transformArgs.figure;

  this.reflect = new transform(board, "reflect", transformArgs);
  this.remove = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].setPosition(JXG.COORDS_BY_USER, this.points[p]);
        board.update();
      }
    }
  };
  this.execute = function() {
    transformArgs.points.forEach(function(p) {
      Object.defineProperty(usrPoints, p.name, {
        value: [
          board.points[p.name].coords.usrCoords[1],
          board.points[p.name].coords.usrCoords[2]
        ],
        enumerable: true
      });
    });
    this.reflect.apply();
    return args;
  };
};

var shear = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    degrees: parseInt($('input[name="degrees"]:last').val()),
  },
    usrPoints = this.points = {};  
  var transformArgs = {};
  for (arg in args) {
    if (args.hasOwnProperty(arg)) {
      transformArgs[arg] = args[arg];
    }
  }
  transformArgs.points = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == transformArgs.figure) {
      transformArgs.points = shape.usrSetCoords;
    }
  });
  delete transformArgs.figure;
  this.shear = new transform(board, "shear", transformArgs);
  this.remove = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].setPosition(JXG.COORDS_BY_USER, this.points[p]);
        board.update();
      }
    }
  };
  this.execute = function() {
    transformArgs.points.forEach(function(p) {
      Object.defineProperty(usrPoints, p.name, {
        value: [
          board.points[p.name].coords.usrCoords[1],
          board.points[p.name].coords.usrCoords[2]
        ],
        enumerable: true
      });
    });
    this.shear.apply();
    return args;
  };
};

var translate = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    values:  $('input[name="values"]:last').coord(),
  },
    usrPoints = this.points = {};  
  var transformArgs = {};
  for (arg in args) {
    if (args.hasOwnProperty(arg)) {
      transformArgs[arg] = args[arg];
    }
  }
  transformArgs.points = [];
  board.shapes.forEach(function(shape) {
    if (shape.name == transformArgs.figure) {
      transformArgs.points = shape.usrSetCoords;
    }
  });
  // a single point
  if (!transformArgs.points.length) {
    for(p in board.points) {
      if (board.points.hasOwnProperty(p)) {
        if (board.points[p].name + '0' == transformArgs.figure) {
          transformArgs.points = [board.points[p]];
        }
      }
    }
  }
  delete transformArgs.figure;
  this.translate = new transform(board, "translate", transformArgs);
  this.remove    = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].setPosition(JXG.COORDS_BY_USER, this.points[p]);
        board.update();
      }
    }
  };
  this.execute = function() {
    transformArgs.points.forEach(function(p) {
      Object.defineProperty(usrPoints, p.name, {
        value: [
          board.points[p.name].coords.usrCoords[1],
          board.points[p.name].coords.usrCoords[2]
        ],
        enumerable: true
      });
    });
    this.translate.apply();
    return args;
  };
};

var drag = function(board, args) {
  var args     = args,
    usrPoints  = this.points = {}; 
  var transformArgs = {};
  for (arg in args) {
    if (args.hasOwnProperty(arg)) {
      transformArgs[arg] = args[arg];
    }
  }
  transformArgs = $.extend(true, {}, args);
  transformArgs.points = [];
  board.shapes.forEach(function(shape) {
    if (shape.name == transformArgs.figure) {
      transformArgs.points = shape.usrSetCoords;
    }
  });
  if (!this.initial) {
    this.initial = transformArgs.initial;
  }
  // a single point
  if (!transformArgs.points.length) {
    transformArgs.points.push(board.points[transformArgs.figure]);
  }
  delete transformArgs.figure;
  delete transformArgs.initial;
  this.translate = new transform(board, "translate", transformArgs);
  this.apply = function(p, where) {
    var c, len, i;
    console.log(where);
    if (!p instanceof Array) {
      p = [p];
    }
    len = p.length;
    for (i = 0; i < len; i++) {
      c = where.pop();
      p[i].moveTo(c);
     board.update();
   }
  };
  this.remove    = function() {
    this.apply(transformArgs.points, this.initial);
  };
  this.execute = function() {
  console.log(transformArgs);
    transformArgs.points.forEach(function(p) {
      Object.defineProperty(usrPoints, p.name, {
        value: [
          board.points[p.name].coords.usrCoords[1],
          board.points[p.name].coords.usrCoords[2]
        ],
        enumerable: true
      });
    });
    this.translate.apply();
    return args;
  };
};


var scale = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    values:  $('input[name="values"]:last').coord(),
  },
    usrPoints = this.points = {};  
  var transformArgs = {};
  for (arg in args) {
    if (args.hasOwnProperty(arg)) {
      transformArgs[arg] = args[arg];
    }
  }
  transformArgs.points = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == transformArgs.figure) {
      transformArgs.points = shape.usrSetCoords;
    }
  });
  delete transformArgs.figure;
  this.scale = new transform(board, "scale", transformArgs);
  this.remove    = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].setPosition(JXG.COORDS_BY_USER, this.points[p]);
        board.update();
      }
    }
  };
  this.execute = function() {
    transformArgs.points.forEach(function(p) {
      Object.defineProperty(usrPoints, p.name, {
        value: [
          board.points[p.name].coords.usrCoords[1],
          board.points[p.name].coords.usrCoords[2]
        ],
        enumerable: true
      });
    });
    this.scale.apply();
    return args
  };
};

module.exports = {
  rotate:    rotate,
  reflect:   reflect,
  shear:     shear,
  drag:      drag,
  translate: translate,
  scale:     scale
};