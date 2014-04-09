var element = require('../board/element');

/* Commands */

var circle = function(board, args) {
  var args = args || {
    center: $('input[name="center"]:last').coord(),
    radius: parseFloat($('input[name="radius"]:last').val())
  };

  var circle = new element(board, "circle", args);
  circle.draw();
  return args;
};

var angle = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord()
  };

  var angle = new element(board, "angle", args);
  angle.draw();
  return args;
};

var arc = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord()
  };

  var arc = new element(board, "arc", args);
  arc.draw();
  return args;
};

var ellipse = function(board, args) {
  var args = args ||  {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord()
  };

  var ellipse = new element(board, "ellipse", args);
  ellipse.draw();
  return args;
};

var segment = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
  };
  
  var segment = new element(board, "segment", args);
  segment.draw();
  return args;
};

var line = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
  };

  var line = new element(board, "line", args);
  line.draw();
  return args;
};

var parabola = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord(),
  };

  var parabola = new element(board, "parabola", args);
  parabola.draw();
  return args;
};

var polygon = function(board, args) {
  var points   = 3,
      vertices = {};
  $('.draw-polygon:last input').each(function(i,m) {
    vertices["point"+i] = $(m).coord();
  });
  args = args || vertices;

  var polygon = new element(board, "polygon", args);
  polygon.draw();
  return args;
};

var point = function(board, args) {
  var args = args || {
    point: $('input[name="point"]:last').coord(),
  };

  var point = new element(board, "point", args);
  point.draw();
  return args;
};

/* Extend jQuery for input to coordinates */
$.fn.coord = function() {
  if (this.val()) {
    if (this.val().indexOf(',') !== -1) {
      return this.val().split(',')
        .map(function(e) {
          return parseFloat(e);
        });
    }
  }
};

module.exports = {
  circle: circle,
  angle: angle,
  arc: arc,
  ellipse: ellipse,
  segment: segment,
  line: line,
  parabola: parabola,
  polygon: polygon,
  point: point
};