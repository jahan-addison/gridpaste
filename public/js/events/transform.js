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
  this.orig_args = args;
  if (typeof arguments[1] === 'undefined') {  
     this.orig_args = {
      figure:  $('input[name="figure"]:last').val(),
      degrees: parseInt($('input[name="degrees"]:last').val()),
    };
  }
  args.points    = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == args.figure) {
      args.points = shape.usrSetCoords;
    }
  });
  delete args.figure;
  this.rotate = new transform(board, "rotate", args);
  this.remove = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].free();
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
    return this.orig_args;
  };
};

var reflect = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    line:    $('input[name="axis"]:last').val(),
  },
    usrPoints = this.points = {};  
  this.orig_args = args;
  if (typeof arguments[1] === 'undefined') {  
     this.orig_args = {
      figure:  $('input[name="figure"]:last').val(),
      line:    $('input[name="axis"]:last').val(),
    };
  }
  this.line = args.line;
  args.points = [];

  if (args.line.toLowerCase() == "x") {
    args.line = board.axx;
  } else {
    args.line = board.axy;
  }

  board.shapes.forEach(function(shape) {
    if (shape.name == args.figure) {
      args.points = shape.usrSetCoords;
    }
  });
  delete args.figure;

  this.reflect = new transform(board, "reflect", args);
  this.remove = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].free();
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
    this.reflect.apply();
    return this.orig_args;
  };
};

var shear = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    degrees: parseInt($('input[name="degrees"]:last').val()),
  },
    usrPoints = this.points = {};  
  this.orig_args = args;
  if (typeof arguments[1] === 'undefined') {  
     this.orig_args = {
      figure:  $('input[name="figure"]:last').val(),
      degrees: parseInt($('input[name="degrees"]:last').val()),
    };
  }
  args.points = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == args.figure) {
      args.points = shape.usrSetCoords;
    }
  });
  delete args.figure;
  this.shear = new transform(board, "shear", args);
  this.remove = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].free();
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
    this.shear.apply();
    return this.orig_args;
  };
};

var translate = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    values:  $('input[name="values"]:last').coord(),
  },
    usrPoints = this.points = {};  
  this.orig_args = args;
  if (typeof arguments[1] === 'undefined') {  
     this.orig_args = {
      figure:  $('input[name="figure"]:last').val(),
      values:  $('input[name="values"]:last').coord(),
    };
  }
  args.points = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == args.figure) {
      args.points = shape.usrSetCoords;
    }
  });
  delete args.figure;
  this.translate = new transform(board, "translate", args);
  this.remove    = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].free();
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
    this.translate.apply();
    return this.orig_args;
  };
};

var scale = function(board, args) {
  var args   = args || {
    figure:  $('input[name="figure"]:last').val(),
    values:  $('input[name="values"]:last').coord(),
  },
    usrPoints = this.points = {};  
  this.orig_args = args;
  if (typeof arguments[1] === 'undefined') {  
     this.orig_args = {
      figure:  $('input[name="figure"]:last').val(),
      values:  $('input[name="values"]:last').coord(),
    };
  }
  args.points = [];

  board.shapes.forEach(function(shape) {
    if (shape.name == args.figure) {
      args.points = shape.usrSetCoords;
    }
  });
  delete args.figure;
  this.scale = new transform(board, "scale", args);
  this.remove    = function() {
    for (p in this.points) {
      if (this.points.hasOwnProperty(p)) {
        board.points[p].free();
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
    this.scale.apply();
    return this.orig_args;
  };
};

module.exports = {
  rotate:    rotate,
  reflect:   reflect,
  shear:     shear,
  translate: translate,
  scale:     scale
};