var slider    = require('../helper/slider'),
    element   = require('../board/element');


var Run        = {},
    Run.create = {};

module.exports = Run;

Run.create.circle = function(board) {
  var circle = new element(board, "circle", {
    center: $('input[name="center"]').coord(),
    radius: parseFloat($('input[name="radius"]').val())
  });
  circle.draw();
};

Run.create.angle = function(board) {
  var angle = new element(board, "angle", {
    point1: $('input[name="point1"]').coord(),
    point2: $('input[name="point2"]').coord(),
    point3: $('input[name="point3"]').coord()
  });
  angle.draw();
};

Run.create.arc = function(board) {
  var arc = new element(board, "arc", {
    point1: $('input[name="point1"]').coord(),
    point2: $('input[name="point2"]').coord(),
    point3: $('input[name="point3"]').coord()
  });
  arc.draw();
  });
};

Run.create.ellipse = function(board) {
  var ellipse = new element(board, "ellipse", {
    point1: $('input[name="point1"]').coord(),
    point2: $('input[name="point2"]').coord(),
    point3: $('input[name="point3"]').coord()
  });
  ellipse.draw();
};

Run.create.segment = function(board) {
  var segment = new element(board, "segment", {
    point1: $('input[name="point1"]').coord(),
    point2: $('input[name="point2"]').coord(),
  });
  segment.draw();
};

Run.create.line = function(board) {
  var line = new element(board, "line", {
    point1: $('input[name="point1"]').coord(),
    point2: $('input[name="point2"]').coord(),
  });

  line.draw();
};

Run.create.parabola = function(board) {
  var parabola = new element(board, "parabola", {
    point1: $('input[name="point1"]').coord(),
    point2: $('input[name="point2"]').coord(),
    point3: $('input[name="point3"]').coord(),
  });
  parabola.draw();
};

Run.create.polygon = function(board) {
  var points   = 3,
      vertices = {};
  $('.more').click(function() {
    points++;
    var more = '<br /><label for="point'+ points + '">Point ' + points + ' (x,y):</label><input type="text" name="point'+ points +'" class="inside" value="0.0,0.0" />';
    $(this).before(more);
  });
  $('.draw').on('click', function() {
    $('.draw-element input').each(function(i,m) {
      vertices["point"+i] = $(m).coord();
    });
    var polygon = new element(board, "polygon", vertices);
    polygon.draw();
};

Run.create.point = function(board) {
  var point = new element(board, "point", {
    point: $('input[name="point"]').coord(),
  });
  point.draw();
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