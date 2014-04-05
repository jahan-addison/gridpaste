var slider    = require('./slider'),
    element   = require('./element'),
    Events    = {};

/* Extend jQuery for input to coordinates */
jQuery.fn.coord = function() {
  if (this.val()) {
    if (this.val().indexOf(',') !== -1) {
      return this.val().split(',')
        .map(function(e) {
          return parseFloat(e);
        });
    }
  }
};

Events.create = function(board) {

  // Create Circle
  $('#elements .col:first-child .button:first-child').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="circle-p1">Center Point (x,y):</label><input type="text" name="center" class="inside" value="0.0,0.0" />',
      '<label for="radius">Radius:</label><input type="text" name="radius" class="inside" value="0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var circle = new element(board, "circle", {
        center: $('input[name="center"]').coord(),
        radius: parseFloat($('input[name="radius"]').val())
      });

      circle.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Angle
  $('#elements .col:first-child .button:first-child + .button').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Point 1 (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<label for="point2">Center Point (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<label for="point3">Point 3 (x,y):</label><input type="text" name="point3" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var angle = new element(board, "angle", {
        point1: $('input[name="point1"]').coord(),
        point2: $('input[name="point2"]').coord(),
        point3: $('input[name="point3"]').coord()
      });

      angle.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Arc
  $('#elements .col:first-child .button:first-child + .button + .button').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Center Point (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<label for="point2">Point 2 (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<label for="point3">Point 3 (x,y):</label><input type="text" name="point3" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var arc = new element(board, "arc", {
        point1: $('input[name="point1"]').coord(),
        point2: $('input[name="point2"]').coord(),
        point3: $('input[name="point3"]').coord()
      });

      arc.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Ellipse
  $('#elements .col:nth-child(2) .button:first-child').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Point 1 (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<label for="point2">Point 2 (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<label for="point3">Point 3 (x,y):</label><input type="text" name="point3" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var ellipse = new element(board, "ellipse", {
        point1: $('input[name="point1"]').coord(),
        point2: $('input[name="point2"]').coord(),
        point3: $('input[name="point3"]').coord()
      });

      ellipse.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Segment
  $('#elements .col:nth-child(2) .button:first-child + .button').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">End Point 1 (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<br/><label for="point2">End Point 2 (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var segment = new element(board, "segment", {
        point1: $('input[name="point1"]').coord(),
        point2: $('input[name="point2"]').coord(),
      });

      segment.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Line
  $('#elements .col:nth-child(2) .button:first-child + .button + .button').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Point 1 (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<label for="point2">Point 2 (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var line = new element(board, "line", {
        point1: $('input[name="point1"]').coord(),
        point2: $('input[name="point2"]').coord(),
      });

      line.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Parabola
  $('#elements .col:nth-child(3) .button:first-child ').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Line Point 1 (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<br /><label for="point2">Line point 2 (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<label for="point3">Center Point (x,y):</label><input type="text" name="point3" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var parabola = new element(board, "parabola", {
        point1: $('input[name="point1"]').coord(),
        point2: $('input[name="point2"]').coord(),
        point3: $('input[name="point3"]').coord(),
      });

      parabola.draw();

      $('.close-slider').click();
    });
  });

  //-----------------------------------------------------------------------

  // Create Polygon
  $('#elements .col:nth-child(3) .button:first-child + .button').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Point 1 (x,y):</label><input type="text" name="point1" class="inside" value="0.0,0.0" />',
      '<label for="point2">Point 2 (x,y):</label><input type="text" name="point2" class="inside" value="0.0,0.0" />',
      '<label for="point3">Point 3 (x,y):</label><input type="text" name="point3" class="inside" value="0.0,0.0" />',
      '<div class="button more">Add point</div>',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n"), 230, 'auto'); 

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

      $('.close-slider').click();
    });
  });


  //-----------------------------------------------------------------------

  // Create Point
  $('#elements .col:nth-child(3) .button:first-child + .button + .button').click(function() {
    slider([
      '<div class="draw-element">',
      '<label for="point1">Point (x,y):</label><input type="text" name="point" class="inside" value="0.0,0.0" />',
      '<div class="button draw">Draw to board</div>',
      '</div>'
    ].join("\n")); 

    $('.draw').click(function() {
      var point = new element(board, "point", {
        point: $('input[name="point"]').coord(),
      });

      point.draw();

      $('.close-slider').click();
    });
  });

};



module.exports = Events;