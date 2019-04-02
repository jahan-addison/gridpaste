;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
$(function() {
  'use strict';
  var board;
  (function() {
    var xx =  $(window).width()  / 17,
        yy =  $(window).height() / 15.7;   
    /* Board Options */
    JXG.Options.angle.orthoType     = "root";
    JXG.Options.angle.radius        = 25;
    JXG.Options.polygon.fillOpacity = 0.46;
    JXG.Options.polygon.fillColor   = "#0ece16";
    JXG.Options.elements.fixed      = false;
    JXG.Options.text.parse          = false;
    board  = JXG.JSXGraph.initBoard('grid', {
      boundingbox:     [-xx,yy,xx,-yy],
      keepaspectratio: true,
      showCopyright:   false,
      showNavigation:  false 
    });
    board.points = {};
    board.shapes = [];
    board.xx     = xx;
    board.yy     = yy;
    board.axx    = board.create('axis',[[0,0],[1,0]]);
    board.axy    = board.create('axis',[[0,0],[0,1]]);
    board.unsuspendUpdate();    
  })();
  if (!$('#application').hasClass('paste')) {
    /* Subscribe to application */
    var App = window.app = require('./subscribe')(board);
    require('./helper/helpers')  (App, board);  /* various UI helpers */
    require('./decorators/mouse')(App);         /* dragging decoration */
  } else {
    /* Play Paste */
    require('./helper/play')($AppPaste, board);
    $('.play').click();
    // Replay button
    $('.replay').click(function() {
      require('./helper/play')($AppPaste, board);
    });
    // Start new button
    $('.new').click(function() {
      window.location.href = '/';
    });
  }
}); 
},{"./subscribe":2,"./helper/helpers":3,"./decorators/mouse":4,"./helper/play":5}],4:[function(require,module,exports){
module.exports = function(App) {
  MouseEvent.prototype.srcApp = App;
}
},{}],2:[function(require,module,exports){
var execute    = require('./operation');

module.exports = function(board) {

  // The application request object
  var operationExec = new execute(board);

  require('./subscriptions/board')    (operationExec); /* Board subscription */

  require('./subscriptions/function') (operationExec); /* Function subscription */

  require('./subscriptions/zoom')     (operationExec, board); /* Zoom subscription */

  // return the request object to the front controller
  return operationExec;
};

},{"./operation":6,"./subscriptions/function":7,"./subscriptions/board":8,"./subscriptions/zoom":9}],5:[function(require,module,exports){
var iterator = require('../iterate'),
    command  = require('../events/run');

module.exports = function(App, board) {
  if (board.playing) {
    return false;
  }
  if (typeof board.playing === 'undefined') {
    board.playing = true;
  }
  var clear = function(board) {
    for(point in board.points) {
      if (board.points.hasOwnProperty(point)) {
        board.removeObject(board.points[point]);
      }
    }
    board.points = {};
    var size = board.shapes.length;
    for (var i = 0; i < size; i++) {
      board.removeObject(board.shapes[i]);
    }
    board.shapes = [];
    $('.undo').removeClass('visible');
    board.zoom100();
    board.update();
  };
  if ($('#application').hasClass('paste')) {
    clear(board);
    var AppIterator = new iterator($AppPaste);
    board.animate();
    var play;
    $('.replay').addClass('dim');
    play = setInterval(function() {
      var next         = AppIterator.next();
      target           = next.toString.split('.');       
      var $constructor = command[target[0]][target[1]];
      require('./position')(next.arguments, board);
      var $command     = new $constructor(board, next.arguments);      
      $command.execute();
      if(!AppIterator.hasNext()) {
        clearInterval(play);
        $('.replay').removeClass('dim');
        board.playing = undefined;
      }
    }, 1100);
  } else {
    $('.play').click(function() {
      clear(board);
      if (!Object.isFrozen(App)) {
        return false;
      }
      var AppIterator = new iterator(App.getRecorded);
      board.animate();
      var play;
      play = setInterval(function() {
        var next         = AppIterator.next();
        target           = next.toString.split('.');       
        var $constructor = command[target[0]][target[1]];
        var $command     = new $constructor(board, next.arguments);      
        $command.execute();
        if(!AppIterator.hasNext()) {
          clearInterval(play);
          board.playing = undefined;
          $('.play').unbind()
            .addClass('dim');
        }
      }, 1100);
    });
  }
};
},{"../events/run":10,"./position":11,"../iterate":12}],3:[function(require,module,exports){
module.exports = function(App, board) {
  require('./more')  ();           // attach event to "more" button for polygon construction
  require('./undo')  (App);        // attach event to undo button
  require('./record')(App);        // attach event to record button
  require('./clear') (App);        // attach event to clear button
  require('./drag')  (board);      // attach event to drag
  require('./play')  (App, board); // attach event to UI play button after recording
  require('./share')    (App)    // attach event to share button
  require('./bindings') (App);   // attach keyboard bindings
  require('./mouse')    (board); // show coordinates at cursor
  require('./dirty')    (App);   // prevent 'dirty board' 
};

},{"./more":13,"./record":14,"./undo":15,"./clear":16,"./drag":17,"./play":5,"./share":18,"./bindings":19,"./mouse":20,"./dirty":21}],13:[function(require,module,exports){
module.exports = function() {
  $(function() {
    var points = 3;
    $('#application').on('click', '.more', function() {
      if ($(this).parent().find('.inside').length == 3) {
        points = 3;
      }
      points++;
      var more = '<label for="point'+ points + '">Point ' + points + ' (x,y):</label><input type="text" name="point'+ points +'" class="inside" value="0.0,0.0" />';
      $(this).before(more);
    });
  });
};
},{}],14:[function(require,module,exports){
module.exports = function(App) {
  $(function() {
    $('.start-record').click(function() {
      $('.clear').click();
      App.startRecording();
      $(this).html('Recording').addClass('dim');
      $(this).unbind();
    });
    $('.end-record').click(function() {
      if (!App.isRecording) {
        return;
      }
      $('.share').removeClass('hidden');
      App.stopRecording();
      $('#application').addClass('off'); // turn subscriptions off 
      $(this)
        .html('Finished')
        .addClass('finished')
        .prev()
        .html('Start Record');
      $(this).unbind();
      Object.freeze(App); // we're done
      $('.delete_').addClass('hidden');
      $('.undo').removeClass('visible');
      $('.reset').show();
      $('.reset').click(function() {
        window.location.reload();
      });
      $('.clear').hide()
        .prev().show();
    });
  });
};
},{}],15:[function(require,module,exports){
module.exports = function(App) {
  $(function() {
    $('.button.undo').click(function() {
      App.undoLastExecute();
      if(App.length === 0) {
        $(this).removeClass('visible');
      }
    });
  });
};
},{}],20:[function(require,module,exports){
module.exports = function(board) {
  var getMouseCoords = function(e, i) {
    var cPos = board.getCoordsTopLeftCorner(e, i),
      absPos = JXG.getPosition(e, i),
      dx = absPos[0]-cPos[0],
      dy = absPos[1]-cPos[1];
    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
  }, i, still;
  board.on("mousemove", function(evt) {
    if (typeof still !== 'undefined') {
      clearTimeout(still);
      if (typeof board.usrAt !== 'undefined') {
        board.removeObject(board.usrAt);
      }
    }
    still = setTimeout(function() {
      var coords = getMouseCoords(evt, i)
        .usrCoords
        .map(function(e) { 
          return e;
        });
      board.usrAt = board.create("text", 
        [parseFloat(coords[1] + 1.2), parseFloat(coords[2] + .5), // away from cursor
        "(" + coords[1] + "," + coords[2] + ")"]
      );
    }, 1000);
  });
  $('#grid').mouseout(function() {
    clearTimeout(still);
  });
};

},{}],11:[function(require,module,exports){
module.exports = function(args, board) {
  var translateX   = false,
      translateY   = false,
      placeX       = 0,
      placeY       = 0;

      
  var move = function(point) {
    var place;
    if (translateX || Math.abs(point[0]) > board.xx) {
      if (point[0] < 0) {
        if (placeX) {
          place = (-placeX / 2) - 3;
        }
        place    = place || point[0] + board.xx - 3;
        point[0] = point[0] - ((placeX) ? place * 2 : place);      
      } else {
        if (placeX) {
          place = (placeX / 2) + 3;
        }
        place    = place || point[0] - board.xx - 3;
        point[0] = point[0] - ((placeX) ? place * 2 : place);
      }
    }
    if (translateY || Math.abs(point[1]) > board.yy) {    
      if (point[1] < 0) {
        if (placeY) {
          place = (-placeY / 1) - 3;
        }
        place    = place || point[1] + board.yy + 3;
        point[1] = point[1] - place;      
      } else {
        if (placeY) {
          place = (placeY / 1) + 3;
        }
        place    = place || point[1] - board.yy + 3;
        point[1] = point[1] - place;
      }
    }
  };

  // first pass
  for(arg in args) {
    if (args.hasOwnProperty(arg)) {
      if ($.isArray(args[arg])) {
        if (arg == 'center' || arg == 'position') {
          var point = args[arg];
          if (Math.abs(point[0]) > board.xx || Math.abs(point[1]) > board.yy) {
            move(args[arg]);
          }
        }
        if (arg.indexOf("point") !== -1) {
          var point = args[arg];
          if (Math.abs(point[0]) > board.xx) {
            translateX = true;
            if (Math.abs(point[0]) - board.xx > placeX) {
              placeX = Math.abs(point[0]) - board.xx;
            }
          }
          if (Math.abs(point[1]) > board.yy) {
            translateY = true;
            if (Math.abs(point[1]) - board.yy > placeY) {
              placeY = Math.abs(point[1]) - board.yy;
            }
          }
        }
      }
    }
  }
  // second pass, perform distance-preserving translation
  if (translateX || translateY) {
    for(arg in args) {
      if (args.hasOwnProperty(arg)) {
        if ($.isArray(args[arg])) {
          if (arg.match(/point\d?/)) {
            move(args[arg]);            
          }
        }
      }
    }    
  }
};
},{}],12:[function(require,module,exports){
/* The Iterator */

var Iterator = function(List) {
  this.step = 0;
  this.list = List;
};

Iterator.prototype.hasNext = function() {
  return this.step < this.list.length;
};

Iterator.prototype.next    = function() {
  return this.list[this.step++];
};

Iterator.prototype.hasPrev = function() {
  return this.step > 0;
};

Iterator.prototype.prev    = function() {
  return this.list[--this.step];
};

module.exports = Iterator;
},{}],21:[function(require,module,exports){
module.exports = function(App) {
  $(window).on('beforeunload', function() {
    if (!$('#application').hasClass('shared')) {
      if (App.isRecording && App.length) {
        return "You have an unsaved grid paste! Are you sure you want to leave?";
      }
    }
  });
};
},{}],6:[function(require,module,exports){
/* The Invoker */

var Operation = function(board) {
  var _commands = [];
  this.commands = _commands;
  this.board    = board;
};

Object.defineProperty(Operation.prototype, "length", {
  get: function() { return this.commands.length }
});

Object.defineProperty(Operation.prototype, "last", {
  get: function() { return this.commands[this.length-1] }
});

Operation.prototype.store = function(command, args) {
  var $command =  new command.command(this.board, args);
  this.commands.push({
    arguments:   args,
    'command':   $command,
    'toString':  command.targetOperation + '.' + command.targetCommand
  });
}

Operation.prototype.storeAndExecute = function(command, args) {
  var $command =  new command.command(this.board, args),
      args     =  $command.execute();
  this.commands.push({
    arguments:   args,
    'command':   $command,
    'toString':  command.targetOperation + '.' + command.targetCommand
  });
};

Operation.prototype.clearCommandList = function() {
  this.commands = [];
};

Operation.prototype.undoLastExecute = function() {
   var $command = this.commands.pop();
   $command.command.remove();
};

/* Decorators */
  require("./decorators/recording")(Operation);

module.exports = Operation;
},{"./decorators/recording":22}],7:[function(require,module,exports){
var command    = require('../events/run'),
    Parser     = require('../board/functions/parser'),
    Rx         = require('../../components/rxjs/rx.lite').Rx;

module.exports = function(App) {
  var $sources = $('.function'),
      $source  = Rx.Observable.fromEvent($sources, "keypress");
  // Filter when the application is 'off'
  $source      = $source.filter(function() {
    return !$('#application').hasClass('off');
  });
  var $functionSubscription = $source.subscribe(function(e) {
    if (e.keyCode == 13) {
      var func = new Parser(e.target.value);
      try {
        func.run(); // generate parse tree
      } catch(e) {
        // syntax error
        alert("Syntax: " + e.message);
        return false;
      }
      var targetOperation = 'func',
          targetCommand   = func.identifier || 'plot';
      if (targetCommand in command[targetOperation] === false) {
        alert("Warning: This GeometryFunction does not exist");
        return;        
      }
      var $command        = {
        'targetOperation': targetOperation,
        'targetCommand':   targetCommand,
        'command':         command[targetOperation][targetCommand]
      };
      if (targetCommand === 'plot') {
          // before storeAndExecute ensure the plot compiles
          try {
            App.board.jc.snippet(e.target.value, true, 'x,y', true);
          } catch(e) {  
            alert("Expression Error: " + e.message);           
            return;
          }
      }
      try {
        App.storeAndExecute($command);
      } catch(e) {
        alert("Warning: " + e.message.replace("JSXGraph: ", ''));
        return;
      }
      e.target.value = "";
      if (App.length > 0) {
        $('.button.undo').addClass('visible');
        if (targetCommand === 'plot') {
          $('.button.delete_').removeClass('hidden')
        }
      }
      $('.close-slider').click();
    }
  },
  function(e) {
    console.log("Error: %s", e.message);
  });
};
},{"../events/run":10,"../board/functions/parser":23,"../../components/rxjs/rx.lite":24}],9:[function(require,module,exports){
var command    = require('../events/run'),
    Rx         = require('../../components/rxjs/rx.lite').Rx;

module.exports = function(App, board) {
  var $zoomSources      = $('.zoom.in, .zoom.out');
  var $zoomSource       = Rx.Observable.fromEvent($zoomSources, "click");

  // Filter when the application is 'off'
  $zoomSource = $zoomSource.filter(function() {
    return !$('#application').hasClass('off');
  });

  var $zoomSubscription = $zoomSource.subscribe(function(e) {
    var target          = $(e.target),
        targetCommand = target.hasClass('in') ? 'zoomIn' : 'zoomOut'; 
    if ((targetCommand == 'zoomIn'  && board.zoomX < 5.9) ||
        (targetCommand == 'zoomOut' && board.zoomX > 0.167)) {
      var $command  = {
        'targetOperation': 'zoom',
        'targetCommand':   targetCommand,
        'command':         command['zoom'][targetCommand]
      };
      try {
        App.storeAndExecute($command);
      } catch(e) {
        alert("Warning: " + e.message.replace("JSXGraph: ", ''));
        return;
      }
      if (App.length > 0) {
        $('.button.undo').addClass('visible');
      }   
    } 
  });

}
},{"../events/run":10,"../../components/rxjs/rx.lite":24}],8:[function(require,module,exports){
var command    = require('../events/run'),
    slider     = require('../helper/slider'),
    validate   = require('../helper/validate')(),
    Rx         = require('../../components/rxjs/rx.lite').Rx;

module.exports = function(App) {
  /**
    Pre-queries
   */
  var $querySources  = $([
    '.circle',   '  .angle',   '.arc',
    '.ellipse',    '.segment', '.line',
     '.polygon',   '.point',   '.text',
     '.rotate',    '.reflect', '.shear',
     '.translate', '.scale',   '.delete_'
  ].join(','));
  // The query observer prepares the way for the following operations subscription
  var $querySource       = Rx.Observable.fromEvent($querySources, 'click');
  // Filter queries when the application is 'off'
  $querySource           = $querySource.filter(function() {
    return !$('#application').hasClass('off');
  });
  var warned = 0;
  var $querySubscription = $querySource.subscribe(function(e) {
    // before we do anything, warn if not recording after 4 queries
    warned++;
    if (!App.isRecording && warned == 4) {
      alert('Warning: Your actions are not being recorded! Press "Start Record" or the tab key to begin recording');
    }
    var target = $(e.target);
    if (!$('.slider').length) {
      slider(target.next().html(), 230, 'auto', '#application', target.parent().parent()); 
    }
  }); 
  
  /**
    Board operations
   */

  var $operationSources      = '.button.draw, .button.transform, .button.misc';
  var $operationSource       = Rx.Observable.fromEventPattern(
    function addHandler(h) { $('#application').on('click', $operationSources, h) },  
    function delHandler(h) { $('#application').off('click', $operationSources, h) }  
  );

  var $operationSubscription = $operationSource.subscribe(function(e) {
    var target    = $(e.target).parent().attr('class').split('-');
    var targetOperation = target[0],
        targetCommand   = target[1];
    // validation error
    if ($(e.target).parent().find('[data-error]').length) {
      alert($(e.target).parent().find('[data-error]').first().attr('data-error'));
      return;
    }
    // the request
    var $command  = {
      'targetOperation': targetOperation,
      'targetCommand':   targetCommand,
      'command':         command[targetOperation][targetCommand]
    };
    try {
      App.storeAndExecute($command);
    } catch(e) {
      alert("Warning: " + e.message.replace("JSXGraph: ", ''));
      return;
    }
    if (App.length > 0) {
      $('.button.delete_').removeClass('hidden')
      $('.button.undo').addClass('visible');
    }
    $('.close-slider').click();
  },
    function(e) {
      console.log("Error: %s", e.message);
    });
};
},{"../events/run":10,"../helper/validate":25,"../helper/slider":26,"../../components/rxjs/rx.lite":24}],16:[function(require,module,exports){
var execute = require('../operation');

module.exports = function(App) {
  $(function() {
    var board = App.board;
    $('.button.clear').click(function() {
      for(point in board.points) {
        if (board.points.hasOwnProperty(point)) {
          board.removeObject(board.points[point]);
        }
      }
      board.points = {};
      var size = board.shapes.length;
      for (var i = 0; i < size; i++) {
        board.removeObject(board.shapes[i]);
      }
      board.shapes = [];
      $('.function').val('');
      $('.undo').removeClass('visible');
      board.zoom100();
      board.update();

      App.clearCommandList();

      // Reset recording UI
      require('./record')(App); // reattach record events   
      $('.start-record').removeClass('dim').html('Start Record');
      $('.end-record').removeClass('dim').html('End Record');
    })
  });
};
},{"../operation":6,"./record":14}],18:[function(require,module,exports){
var slider = require('./slider');

module.exports = function(App) {
  var $html;
  $(function() {
    $('.share').click(function() {
      if (Object.isFrozen(App)) {
        var done;
        if (typeof $html !== 'undefined') {
          slider($html, 230, 'auto', '#application', $('#transform'));           
          return;
        }
        slider($(this).next().html(), 230, 'auto', '#application', $('#transform')); 
        $('#application').on('click', '.submit', function() {
          var $paste = App.getRecorded.map(function(e) {
            delete e.command; // we no longer need constructors
            return e;
          });
          var data   = {
            title: $('input.title:last').val(),
            paste: $paste
          };
          $('.close-slider').click();
          $.ajax({
            url: '/paste',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json",
            complete: function(token) {
              $html = ['<div class="misc-done">',
                '<label for="url">The URL!</label><input type="text" name="url" class="inside url" value="',
                document.location.href + token.responseJSON.token,
                '" />',
                '</div>'
              ].join('');
              $('#application').addClass('shared');
              slider($html, 250, 'auto', '#application', $('#transform'));
            }
          });
        });
      }
    })
  });
}
},{"./slider":26}],17:[function(require,module,exports){
var transform = require('../events/transform');
var last = [],
  initialX,
  initialY,
  dragged,
  initial;
module.exports = function(e) {
  if (e.srcApp && Object.isFrozen(e.srcApp)) {
    // the paste is complete
    this.isDraggable = false;
    return false;
  }
  if ($('#application').hasClass('paste')) {
    this.isDraggable = false;
    return false;
  }
  if(this instanceof JXG.Point === false
    && typeof this.usrSetCoords === 'undefined') {
    return false;
  }
  if (this instanceof JXG.Text === true) {
    // delegate to text event
    require('./text.js')(e.srcApp.board, this);
    // prevent drag
    this.isDraggable = false;
    return false;
  }
  // check the type of point
  if (this instanceof JXG.Point === true) {
    if (Object.keys(this.childElements).length > 1) {
      this.isDraggable = false;
      return false;
    }
  }
  if (typeof this.usrSetCoords !== 'undefined') {
    initialX = e.srcApp.board.points[this.usrSetCoords[0].name].X();
    initialY = e.srcApp.board.points[this.usrSetCoords[0].name].Y();
    initial  = this.usrSetCoords.map(function(m) {
      return [e.srcApp.board.points[m.name].X(), e.srcApp.board.points[m.name].Y()];
    });    
  } else {
    initialX = e.srcApp.board.points[this.name].X();
    initialY = e.srcApp.board.points[this.name].Y();
    initial  = [[initialX, initialY]];   
  }
  this.on('drag', function(e) { 
    dragged = this;
    e.preventDefault();
    this.on("mouseup", function(e) {
      if (last.length === 0) {
        last = [e.x,e.y];
      } else {
        if (e.x == last[0] && e.y == last[1]) {
          return;
        } else {
          last = [e.x, e.y];
        }
      }
      var distanceX,
          distanceY;
      if (typeof this.X !== 'function') {
        distanceX = this.usrSetCoords[0].X() - initialX;
        distanceY = this.usrSetCoords[0].Y() - initialY;
      } else {
        distanceX = this.X()  - initialX;
        distanceY = this.Y()  - initialY;      
      }

      var drag = transform.drag;
      e.srcApp.store({
        targetOperation: 'transform',
        targetCommand:   'drag',
        command:          drag
      }, {
        figure: this.name,
        initial: initial,
        values: [distanceX, distanceY]
      });
    }.bind(dragged));
  });
};
},{"./text.js":27,"../events/transform":28}],10:[function(require,module,exports){

module.exports = {
  draw:      require('./draw'),
  transform: require('./transform'),
  zoom:      require('./zoom'),
  func:      require('./function'),
  misc:      require('./misc')
};


},{"./draw":29,"./transform":28,"./zoom":30,"./function":31,"./misc":32}],19:[function(require,module,exports){
var command = require('../events/run'),
    slider     = require('../helper/slider');

require('../../components/mousetrap/mousetrap.min');

module.exports = function(App) {
  var drawBindLimit      = 9,
      transformBindLimit = 5,
      i;
  $(function() {
    /* Zoom in/out */
    Mousetrap.bind('ctrl =', function() { $('.zoom.in').click(); });
    Mousetrap.bind('ctrl -', function() { $('.zoom.out').click(); });
    /* Function */
    Mousetrap.bind('f', function() { setTimeout(function() { $('.function').focus(); },200); });
    /* Undo */
    Mousetrap.bind('ctrl+z', function() { $('.undo').click(); });    
    /* Repeat last command */
    Mousetrap.bind('ctrl+enter', function() {
      if (!App.length) {
        return;
      }
      var target   = App.last.toString.split('.');
      if (target[1] == 'drag') {
        return false;
      }
      var $command = {
        targetOperation: target[0],
        targetCommand:   target[1],
        command:         command[target[0]][target[1]] 
      };
      try {
        App.storeAndExecute($command, App.last.arguments);
      } catch(e) {
        alert("Warning: " + e.message.replace("JSXGraph: ", ''));
        return;
      }
    });
    /* Clear */
    Mousetrap.bind('m c', function() { $('.clear').click(); });
    /* Start recording */
    Mousetrap.bind('tab', function() { $('.start-record').click(); return false; });    
    /* Cancel query */
    Mousetrap.bind('escape', function() { $('.close-slider').click(); });        

    Mousetrap.stopCallback = function(e, element, combo) {
      // if the element has the class "mousetrap" then no need to stop
      if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
          return false;
      }
      // Allow escape while in queries
      if ($(element).parent().parent().hasClass('slider') && combo.match(/esc|escape/)) {
        return false;
      }
      // stop for input, select, and textarea
      return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
    };
    
    /* Draw */
    for(i = 0; i < drawBindLimit; i++) {
      Mousetrap.bind('d ' + (i+1), 
        new Function("$('#elements .button').not('.draw').not('.more').eq("+i+").click();")
      ); 
    }
    /* Transform */
    for(i = 0; i < transformBindLimit; i++) {
      Mousetrap.bind('t ' + (i+1), 
        new Function("$('#transform .button').not('.transform').not('.more').eq("+i+").click();")
      ); 
    }
  // Keyboard helper box
    $('.keyboard-hints').click(function() {
      if (!$('.slider').length) {
        slider($('.keyboard-helper').html(), 200, 460, '#application', 'body', 'top');      
      }
    })
  });
};
},{"../helper/slider":26,"../events/run":10,"../../components/mousetrap/mousetrap.min":33}],22:[function(require,module,exports){
/*
  OperationDecorator
*/

module.exports = function(Operation) {
  var recording = false;
  
  var recorded  = [];

  Object.defineProperty(Operation.prototype, "getRecorded", {
    get: function() { return recorded; }
  });

  Object.defineProperty(Operation.prototype, "isRecording", {
    get: function() { return recording; }
  });

  Operation.prototype.startRecording = function() {
    recording = true;
  };
  Operation.prototype.stopRecording  = function() {
    recording = false;
  };

  var execute = Operation.prototype.storeAndExecute;
  // proxy
  Operation.prototype.storeAndExecute = function() {
    execute.apply(this, arguments);
    if (recording) {
      recorded.push(this.commands[this.commands.length - 1]);
    }
  };
  
  var store = Operation.prototype.store;
  // proxy
  Operation.prototype.store = function() {
    store.apply(this, arguments);
    if (recording) {
      recorded.push(this.commands[this.commands.length - 1]);
    }
  };

  var remove = Operation.prototype.undoLastExecute;
  // proxy
  Operation.prototype.undoLastExecute = function() {
    if (recording) {
      recorded.pop();
    }
    return remove.apply(this, arguments);
  };

  var clear  = Operation.prototype.clearCommandList;
  // proxy
  Operation.prototype.clearCommandList = function() {
    if (recording) {
      recorded = [];
    }
    return clear.apply(this, arguments);
  }; 
};

},{}],26:[function(require,module,exports){
module.exports = function(content, width, height, source, top, slide) {
  var animate = {};
  var $block = $('<div class="slider"> <div class="close-slider">x</div> </div>');
  var slideCSS = (slide && slide == 'top') ? {
      width:  width  || 230,
      height: height || 200,
      position: 'absolute',
      top: -height || -200,
      right: width / 1.35
    } : {
      width:  width  || 230,
      height: height || 200,
      position: 'absolute',
      top: top.offset().top  || $('#elements').offset().top,
      left: -width   || -230
    };
  $block.append(content)
    .appendTo(source || 'body')
    .css(slideCSS)
  animate[slide || 'left'] = 0;
  $block.animate(animate, 370, function() {
    $block.find('input:first').focus();
  });
  $('.slider input').keydown( function(e) {
    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    if(key == 13) {
      e.preventDefault();
      if ($block.find('.button').length == 2) {
        $block.find('.button').eq(1).click();        
      } else {
        $block.find('.button').click();
      }
    }
  });
  $('.close-slider').click(function() {
    $(this).parent()
      .find('*')
      .unbind('click');
     animate[slide || 'left'] = (slide == 'top') ? -height || -230 : -width || -230;
    $block.animate(animate, 370, function() {
      $(this).remove();
    });
  });
};
},{}],27:[function(require,module,exports){
var still;
module.exports = function(board, text) {
  if (typeof text.labelAt !== 'undefined') {
    return false;
  }
    still = setTimeout(function() {
      text.labelAt = board.create("text", 
        [text.X() - 5, text.Y(), // away from cursor
        text.name]
      );
      setTimeout(function() {
        if (typeof text.labelAt !== 'undefined') {
          clearTimeout(still);
          if (typeof text.labelAt !== 'undefined') {
            board.removeObject(text.labelAt);
            delete text.labelAt;
          }
        }        
      }, 1000);
    }, 300);
};
},{}],34:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],24:[function(require,module,exports){
(function(process,global){// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

;(function (undefined) {

  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  var root = (objectTypes[typeof window] && window) || this,
    freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
    freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
    moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
    freeGlobal = objectTypes[typeof global] && global;
  
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  var Rx = { 
      internals: {}, 
      config: {
        Promise: root.Promise // Detect if promise exists
      },
      helpers: { }
  };
    
  // Defaults
  var noop = Rx.helpers.noop = function () { },
    identity = Rx.helpers.identity = function (x) { return x; },
    defaultNow = Rx.helpers.defaultNow = Date.now,
    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
    isPromise = Rx.helpers.isPromise = function (p) { return typeof p.then === 'function' && p.then !== Rx.Observable.prototype.then; },
    asArray = Rx.helpers.asArray = function () { return Array.prototype.slice.call(arguments); },
    not = Rx.helpers.not = function (a) { return !a; };

  // Errors
  var sequenceContainsNoElements = 'Sequence contains no elements.';
  var argumentOutOfRange = 'Argument out of range';
  var objectDisposed = 'Object has been disposed';
  function checkDisposed() { if (this.isDisposed) { throw new Error(objectDisposed); } }

  // Shim in iterator support
  var $iterator$ = (typeof Symbol === 'object' && Symbol.iterator) ||
    '_es6shim_iterator_';
  // Firefox ships a partial implementation using the name @@iterator.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
  // So use that name if we detect it.
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }
  var doneEnumerator = { done: true, value: undefined };

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    errorClass = '[object Error]',
    funcClass = '[object Function]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

  var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,  
    supportsArgsClass = toString.call(arguments) == argsClass, // For less <IE9 && FF<4
    suportNodeClass,
    errorProto = Error.prototype,
    objectProto = Object.prototype,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

  try {
      suportNodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
  } catch(e) {
      suportNodeClass = true;
  }

  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'
  ];

  var nonEnumProps = {};
  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectClass] = { 'constructor': true };

  var support = {};
  (function () {
    var ctor = function() { this.x = 1; },
      props = [];

    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new ctor) { props.push(key); }      
    for (key in arguments) { }

    // Detect if `name` or `message` properties of `Error.prototype` are enumerable by default.
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

    // Detect if `prototype` properties are enumerable by default.
    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

    // Detect if `arguments` object indexes are non-enumerable
    support.nonEnumArgs = key != 0;

    // Detect if properties shadowing those on `Object.prototype` are non-enumerable.
    support.nonEnumShadows = !/valueOf/.test(props);
  }(1));

  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // https://code.google.com/p/v8/issues/detail?id=2291
    var type = typeof value;
    return value && (type == 'function' || type == 'object') || false;
  }

  function keysIn(object) {
    var result = [];
    if (!isObject(object)) {
      return result;
    }
    if (support.nonEnumArgs && object.length && isArguments(object)) {
      object = slice.call(object);
    }
    var skipProto = support.enumPrototypes && typeof object == 'function',
        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);

    for (var key in object) {
      if (!(skipProto && key == 'prototype') &&
          !(skipErrorProps && (key == 'message' || key == 'name'))) {
        result.push(key);
      }
    }

    if (support.nonEnumShadows && object !== objectProto) {
      var ctor = object.constructor,
          index = -1,
          length = shadowedProps.length;

      if (object === (ctor && ctor.prototype)) {
        var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object),
            nonEnum = nonEnumProps[className];
      }
      while (++index < length) {
        key = shadowedProps[index];
        if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
    }
    return result;
  }

  function internalFor(object, callback, keysFunc) {
    var index = -1,
      props = keysFunc(object),
      length = props.length;

    while (++index < length) {
      var key = props[index];
      if (callback(object[key], key, object) === false) {
        break;
      }
    }
    return object;
  }   

  function internalForIn(object, callback) {
    return internalFor(object, callback, keysIn);
  }

  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  function isArguments(value) {
    return (value && typeof value == 'object') ? toString.call(value) == argsClass : false;
  }

  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (!supportsArgsClass) {
    isArguments = function(value) {
      return (value && typeof value == 'object') ? hasOwnProperty.call(value, 'callee') : false;
    };
  }

  function isFunction(value) {
    return typeof value == 'function';
  }

  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value == 'function' && toString.call(value) == funcClass;
    };
  }        

  var isEqual = Rx.internals.isEqual = function (x, y) {
    return deepEquals(x, y, [], []); 
  };

  /** @private
   * Used for deep comparison
   **/
  function deepEquals(a, b, stackA, stackB) {
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }

    var type = typeof a,
        otherType = typeof b;

    // exit early for unlike primitive values
    if (a === a && (a == null || b == null ||
        (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
      return false;
    }

    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);

    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
        return +a == +b;

      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return (a != +a)
          ? b != +b
          // but treat `-0` vs. `+0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);

      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {

      // exit for functions and DOM nodes
      if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;

      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB &&
            !(hasOwnProperty.call(a, 'constructor') && hasOwnProperty.call(b, 'constructor')) &&
            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
            ('constructor' in a && 'constructor' in b)
          ) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
    var initedStack = !stackA;
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;

    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);

    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      // compare lengths to determine if a deep comparison is necessary
      length = a.length;
      size = b.length;
      result = size == length;

      if (result) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];

          if (!(result = deepEquals(a[size], value, stackA, stackB))) {
            break;
          }
        }
      }
    }
    else {
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      internalForIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB));
        }
      });

      if (result) {
        // ensure both objects have the same number of properties
        internalForIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
    }
    stackA.pop();
    stackB.pop();

    return result;
  }
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
    var hasProp = {}.hasOwnProperty;

    /** @private */
    var inherits = this.inherits = Rx.internals.inherits = function (child, parent) {
        function __() { this.constructor = child; }
        __.prototype = parent.prototype;
        child.prototype = new __();
    };

    /** @private */    
    var addProperties = Rx.internals.addProperties = function (obj) {
        var sources = slice.call(arguments, 1);
        for (var i = 0, len = sources.length; i < len; i++) {
            var source = sources[i];
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    };

    // Rx Utils
    var addRef = Rx.internals.addRef = function (xs, r) {
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer));
        });
    };

    // Collection polyfills
    function arrayInitialize(count, factory) {
        var a = new Array(count);
        for (var i = 0; i < count; i++) {
            a[i] = factory();
        }
        return a;
    }

    // Collections
    var IndexedItem = function (id, value) {
        this.id = id;
        this.value = value;
    };

    IndexedItem.prototype.compareTo = function (other) {
        var c = this.value.compareTo(other.value);
        if (c === 0) {
            c = this.id - other.id;
        }
        return c;
    };

    // Priority Queue for Scheduling
    var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
        this.items = new Array(capacity);
        this.length = 0;
    };

    var priorityProto = PriorityQueue.prototype;
    priorityProto.isHigherPriority = function (left, right) {
        return this.items[left].compareTo(this.items[right]) < 0;
    };

    priorityProto.percolate = function (index) {
        if (index >= this.length || index < 0) {
            return;
        }
        var parent = index - 1 >> 1;
        if (parent < 0 || parent === index) {
            return;
        }
        if (this.isHigherPriority(index, parent)) {
            var temp = this.items[index];
            this.items[index] = this.items[parent];
            this.items[parent] = temp;
            this.percolate(parent);
        }
    };

    priorityProto.heapify = function (index) {
        if (index === undefined) {
            index = 0;
        }
        if (index >= this.length || index < 0) {
            return;
        }
        var left = 2 * index + 1,
            right = 2 * index + 2,
            first = index;
        if (left < this.length && this.isHigherPriority(left, first)) {
            first = left;
        }
        if (right < this.length && this.isHigherPriority(right, first)) {
            first = right;
        }
        if (first !== index) {
            var temp = this.items[index];
            this.items[index] = this.items[first];
            this.items[first] = temp;
            this.heapify(first);
        }
    };
    
    priorityProto.peek = function () {  return this.items[0].value; };

    priorityProto.removeAt = function (index) {
        this.items[index] = this.items[--this.length];
        delete this.items[this.length];
        this.heapify();
    };

    priorityProto.dequeue = function () {
        var result = this.peek();
        this.removeAt(0);
        return result;
    };

    priorityProto.enqueue = function (item) {
        var index = this.length++;
        this.items[index] = new IndexedItem(PriorityQueue.count++, item);
        this.percolate(index);
    };

    priorityProto.remove = function (item) {
        for (var i = 0; i < this.length; i++) {
            if (this.items[i].value === item) {
                this.removeAt(i);
                return true;
            }
        }
        return false;
    };
    PriorityQueue.count = 0;
    /**
     * Represents a group of disposable resources that are disposed together.
     * @constructor
     */
    var CompositeDisposable = Rx.CompositeDisposable = function () {
        this.disposables = argsOrArray(arguments, 0);
        this.isDisposed = false;
        this.length = this.disposables.length;
    };

    var CompositeDisposablePrototype = CompositeDisposable.prototype;

    /**
     * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
     * @param {Mixed} item Disposable to add.
     */    
    CompositeDisposablePrototype.add = function (item) {
        if (this.isDisposed) {
            item.dispose();
        } else {
            this.disposables.push(item);
            this.length++;
        }
    };

    /**
     * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
     * @param {Mixed} item Disposable to remove.
     * @returns {Boolean} true if found; false otherwise.
     */
    CompositeDisposablePrototype.remove = function (item) {
        var shouldDispose = false;
        if (!this.isDisposed) {
            var idx = this.disposables.indexOf(item);
            if (idx !== -1) {
                shouldDispose = true;
                this.disposables.splice(idx, 1);
                this.length--;
                item.dispose();
            }

        }
        return shouldDispose;
    };

    /**
     *  Disposes all disposables in the group and removes them from the group.  
     */
    CompositeDisposablePrototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            var currentDisposables = this.disposables.slice(0);
            this.disposables = [];
            this.length = 0;

            for (var i = 0, len = currentDisposables.length; i < len; i++) {
                currentDisposables[i].dispose();
            }
        }
    };

    /**
     * Removes and disposes all disposables from the CompositeDisposable, but does not dispose the CompositeDisposable.
     */   
    CompositeDisposablePrototype.clear = function () {
        var currentDisposables = this.disposables.slice(0);
        this.disposables = [];
        this.length = 0;
        for (var i = 0, len = currentDisposables.length; i < len; i++) {
            currentDisposables[i].dispose();
        }
    };

    /**
     * Determines whether the CompositeDisposable contains a specific disposable.    
     * @param {Mixed} item Disposable to search for.
     * @returns {Boolean} true if the disposable was found; otherwise, false.
     */    
    CompositeDisposablePrototype.contains = function (item) {
        return this.disposables.indexOf(item) !== -1;
    };

    /**
     * Converts the existing CompositeDisposable to an array of disposables
     * @returns {Array} An array of disposable objects.
     */  
    CompositeDisposablePrototype.toArray = function () {
        return this.disposables.slice(0);
    };
    
    /**
     * Provides a set of static methods for creating Disposables.
     *
     * @constructor 
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     */
    var Disposable = Rx.Disposable = function (action) {
        this.isDisposed = false;
        this.action = action || noop;
    };

    /** Performs the task of cleaning up resources. */     
    Disposable.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.action();
            this.isDisposed = true;
        }
    };

    /**
     * Creates a disposable object that invokes the specified action when disposed.
     * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
     * @return {Disposable} The disposable object that runs the given action upon disposal.
     */
    var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

    /** 
     * Gets the disposable that does nothing when disposed. 
     */
    var disposableEmpty = Disposable.empty = { dispose: noop };

    var BooleanDisposable = (function () {
        function BooleanDisposable (isSingle) {
            this.isSingle = isSingle;
            this.isDisposed = false;
            this.current = null;
        }

        var booleanDisposablePrototype = BooleanDisposable.prototype;

        /**
         * Gets the underlying disposable.
         * @return The underlying disposable.
         */
        booleanDisposablePrototype.getDisposable = function () {
            return this.current;
        };

        /**
         * Sets the underlying disposable.
         * @param {Disposable} value The new underlying disposable.
         */  
        booleanDisposablePrototype.setDisposable = function (value) {
            if (this.current && this.isSingle) {
                throw new Error('Disposable has already been assigned');
            }

            var shouldDispose = this.isDisposed, old;
            if (!shouldDispose) {
                old = this.current;
                this.current = value;
            }
            if (old) {
                old.dispose();
            }
            if (shouldDispose && value) {
                value.dispose();
            }
        };

        /** 
         * Disposes the underlying disposable as well as all future replacements.
         */
        booleanDisposablePrototype.dispose = function () {
            var old;
            if (!this.isDisposed) {
                this.isDisposed = true;
                old = this.current;
                this.current = null;
            }
            if (old) {
                old.dispose();
            }
        };

        return BooleanDisposable;
    }());

    /**
     * Represents a disposable resource which only allows a single assignment of its underlying disposable resource.
     * If an underlying disposable resource has already been set, future attempts to set the underlying disposable resource will throw an Error.
     */
    var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = (function (super_) {
        inherits(SingleAssignmentDisposable, super_);

        function SingleAssignmentDisposable() {
            super_.call(this, true);
        }

        return SingleAssignmentDisposable;
    }(BooleanDisposable));

    /**
     * Represents a disposable resource whose underlying disposable resource can be replaced by another disposable resource, causing automatic disposal of the previous underlying disposable resource.
     */
    var SerialDisposable = Rx.SerialDisposable = (function (super_) {
        inherits(SerialDisposable, super_);

        function SerialDisposable() {
            super_.call(this, false);
        }

        return SerialDisposable;
    }(BooleanDisposable));

    /**
     * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
     */  
    var RefCountDisposable = Rx.RefCountDisposable = (function () {

        function InnerDisposable(disposable) {
            this.disposable = disposable;
            this.disposable.count++;
            this.isInnerDisposed = false;
        }

        InnerDisposable.prototype.dispose = function () {
            if (!this.disposable.isDisposed) {
                if (!this.isInnerDisposed) {
                    this.isInnerDisposed = true;
                    this.disposable.count--;
                    if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
                        this.disposable.isDisposed = true;
                        this.disposable.underlyingDisposable.dispose();
                    }
                }
            }
        };

        /**
         * Initializes a new instance of the RefCountDisposable with the specified disposable.
         * @constructor
         * @param {Disposable} disposable Underlying disposable.
          */
        function RefCountDisposable(disposable) {
            this.underlyingDisposable = disposable;
            this.isDisposed = false;
            this.isPrimaryDisposed = false;
            this.count = 0;
        }

        /** 
         * Disposes the underlying disposable only when all dependent disposables have been disposed 
         */
        RefCountDisposable.prototype.dispose = function () {
            if (!this.isDisposed) {
                if (!this.isPrimaryDisposed) {
                    this.isPrimaryDisposed = true;
                    if (this.count === 0) {
                        this.isDisposed = true;
                        this.underlyingDisposable.dispose();
                    }
                }
            }
        };

        /**
         * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.      
         * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
         */        
        RefCountDisposable.prototype.getDisposable = function () {
            return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
        };

        return RefCountDisposable;
    })();

    var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
        this.scheduler = scheduler;
        this.state = state;
        this.action = action;
        this.dueTime = dueTime;
        this.comparer = comparer || defaultSubComparer;
        this.disposable = new SingleAssignmentDisposable();
    }

    ScheduledItem.prototype.invoke = function () {
        this.disposable.setDisposable(this.invokeCore());
    };

    ScheduledItem.prototype.compareTo = function (other) {
        return this.comparer(this.dueTime, other.dueTime);
    };

    ScheduledItem.prototype.isCancelled = function () {
        return this.disposable.isDisposed;
    };

    ScheduledItem.prototype.invokeCore = function () {
        return this.action(this.scheduler, this.state);
    };

    /** Provides a set of static properties to access commonly used schedulers. */
    var Scheduler = Rx.Scheduler = (function () {

        function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
            this.now = now;
            this._schedule = schedule;
            this._scheduleRelative = scheduleRelative;
            this._scheduleAbsolute = scheduleAbsolute;
        }

        function invokeRecImmediate(scheduler, pair) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable(),
            recursiveAction = function (state1) {
                action(state1, function (state2) {
                    var isAdded = false, isDone = false,
                    d = scheduler.scheduleWithState(state2, function (scheduler1, state3) {
                        if (isAdded) {
                            group.remove(d);
                        } else {
                            isDone = true;
                        }
                        recursiveAction(state3);
                        return disposableEmpty;
                    });
                    if (!isDone) {
                        group.add(d);
                        isAdded = true;
                    }
                });
            };
            recursiveAction(state);
            return group;
        }

        function invokeRecDate(scheduler, pair, method) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable(),
            recursiveAction = function (state1) {
                action(state1, function (state2, dueTime1) {
                    var isAdded = false, isDone = false,
                    d = scheduler[method].call(scheduler, state2, dueTime1, function (scheduler1, state3) {
                        if (isAdded) {
                            group.remove(d);
                        } else {
                            isDone = true;
                        }
                        recursiveAction(state3);
                        return disposableEmpty;
                    });
                    if (!isDone) {
                        group.add(d);
                        isAdded = true;
                    }
                });
            };
            recursiveAction(state);
            return group;
        }

        function invokeAction(scheduler, action) {
            action();
            return disposableEmpty;
        }

        var schedulerProto = Scheduler.prototype;
        
        /**
         * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.       
         * @param {Number} period Period for running the work periodically.
         * @param {Function} action Action to be executed.
         * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
         */        
        schedulerProto.schedulePeriodic = function (period, action) {
            return this.schedulePeriodicWithState(null, period, function () {
                action();
            });
        };

        /**
         * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.       
         * @param {Mixed} state Initial state passed to the action upon the first iteration.
         * @param {Number} period Period for running the work periodically.
         * @param {Function} action Action to be executed, potentially updating the state.
         * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
         */
        schedulerProto.schedulePeriodicWithState = function (state, period, action) {
            var s = state, id = setInterval(function () {
                s = action(s);
            }, period);
            return disposableCreate(function () {
                clearInterval(id);
            });
        };

        /**
         * Schedules an action to be executed.        
         * @param {Function} action Action to execute.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.schedule = function (action) {
            return this._schedule(action, invokeAction);
        };

        /**
         * Schedules an action to be executed.    
         * @param state State passed to the action to be executed.
         * @param {Function} action Action to be executed.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithState = function (state, action) {
            return this._schedule(state, action);
        };

        /**
         * Schedules an action to be executed after the specified relative due time.       
         * @param {Function} action Action to execute.
         * @param {Number} dueTime Relative time after which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithRelative = function (dueTime, action) {
            return this._scheduleRelative(action, dueTime, invokeAction);
        };

        /**
         * Schedules an action to be executed after dueTime.     
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to be executed.
         * @param {Number} dueTime Relative time after which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative(state, dueTime, action);
        };

        /**
         * Schedules an action to be executed at the specified absolute due time.    
         * @param {Function} action Action to execute.
         * @param {Number} dueTime Absolute time at which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
          */
        schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
            return this._scheduleAbsolute(action, dueTime, invokeAction);
        };

        /**
         * Schedules an action to be executed at dueTime.     
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to be executed.
         * @param {Number}dueTime Absolute time at which to execute the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute(state, dueTime, action);
        };

        /**
         * Schedules an action to be executed recursively.
         * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursive = function (action) {
            return this.scheduleRecursiveWithState(action, function (_action, self) {
                _action(function () {
                    self(_action);
                });
            });
        };

        /**
         * Schedules an action to be executed recursively.     
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithState = function (state, action) {
            return this.scheduleWithState({ first: state, second: action }, function (s, p) {
                return invokeRecImmediate(s, p);
            });
        };

        /**
         * Schedules an action to be executed recursively after a specified relative due time.     
         * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.
         * @param {Number}dueTime Relative time after which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
            return this.scheduleRecursiveWithRelativeAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        /**
         * Schedules an action to be executed recursively after a specified relative due time.  
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
         * @param {Number}dueTime Relative time after which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithRelativeAndState');
            });
        };

        /**
         * Schedules an action to be executed recursively at a specified absolute due time.    
         * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.
         * @param {Number}dueTime Absolute time at which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
            return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, function (_action, self) {
                _action(function (dt) {
                    self(_action, dt);
                });
            });
        };

        /**
         * Schedules an action to be executed recursively at a specified absolute due time.     
         * @param {Mixed} state State passed to the action to be executed.
         * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
         * @param {Number}dueTime Absolute time at which to execute the action for the first time.
         * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
         */
        schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute({ first: state, second: action }, dueTime, function (s, p) {
                return invokeRecDate(s, p, 'scheduleWithAbsoluteAndState');
            });
        };

        /** Gets the current time according to the local machine's system clock. */
        Scheduler.now = defaultNow;

        /**
         * Normalizes the specified TimeSpan value to a positive value.
         * @param {Number} timeSpan The time span value to normalize.
         * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
         */   
        Scheduler.normalize = function (timeSpan) {
            if (timeSpan < 0) {
                timeSpan = 0;
            }
            return timeSpan;
        };

        return Scheduler;
    }());

    var normalizeTime = Scheduler.normalize;
    
    /**
     * Gets a scheduler that schedules work immediately on the current thread.
     */    
    var immediateScheduler = Scheduler.immediate = (function () {

        function scheduleNow(state, action) { return action(this, state); }

        function scheduleRelative(state, dueTime, action) {
            var dt = normalizeTime(dt);
            while (dt - this.now() > 0) { }
            return action(this, state);
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
    }());

    /** 
     * Gets a scheduler that schedules work as soon as possible on the current thread.
     */
    var currentThreadScheduler = Scheduler.currentThread = (function () {
        var queue;

        function runTrampoline (q) {
            var item;
            while (q.length > 0) {
                item = q.dequeue();
                if (!item.isCancelled()) {
                    // Note, do not schedule blocking work!
                    while (item.dueTime - Scheduler.now() > 0) {
                    }
                    if (!item.isCancelled()) {
                        item.invoke();
                    }
                }
            }            
        }

        function scheduleNow(state, action) {
            return this.scheduleWithRelativeAndState(state, 0, action);
        }

        function scheduleRelative(state, dueTime, action) {
            var dt = this.now() + Scheduler.normalize(dueTime),
                    si = new ScheduledItem(this, state, action, dt),
                    t;
            if (!queue) {
                queue = new PriorityQueue(4);
                queue.enqueue(si);
                try {
                    runTrampoline(queue);
                } catch (e) { 
                    throw e;
                } finally {
                    queue = null;
                }
            } else {
                queue.enqueue(si);
            }
            return si.disposable;
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        var currentScheduler = new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
        currentScheduler.scheduleRequired = function () { return queue === null; };
        currentScheduler.ensureTrampoline = function (action) {
            if (queue === null) {
                return this.schedule(action);
            } else {
                return action();
            }
        };

        return currentScheduler;
    }());

    var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
        function tick(command, recurse) {
            recurse(0, this._period);
            try {
                this._state = this._action(this._state);
            } catch (e) {
                this._cancel.dispose();
                throw e;
            }
        }

        function SchedulePeriodicRecursive(scheduler, state, period, action) {
            this._scheduler = scheduler;
            this._state = state;
            this._period = period;
            this._action = action;
        }

        SchedulePeriodicRecursive.prototype.start = function () {
            var d = new SingleAssignmentDisposable();
            this._cancel = d;
            d.setDisposable(this._scheduler.scheduleRecursiveWithRelativeAndState(0, this._period, tick.bind(this)));

            return d;
        };

        return SchedulePeriodicRecursive;
    }());

    
    var scheduleMethod, clearMethod = noop;
    (function () {

        var reNative = RegExp('^' +
          String(toString)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/toString| for [^\]]+/g, '.*?') + '$'
        );

        var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
            !reNative.test(setImmediate) && setImmediate,
            clearImmediate = typeof (clearImmediate = freeGlobal && moduleExports && freeGlobal.clearImmediate) == 'function' &&
            !reNative.test(clearImmediate) && clearImmediate;

        function postMessageSupported () {
            // Ensure not in a worker
            if (!root.postMessage || root.importScripts) { return false; }
            var isAsync = false, 
                oldHandler = root.onmessage;
            // Test for async
            root.onmessage = function () { isAsync = true; };
            root.postMessage('','*');
            root.onmessage = oldHandler;

            return isAsync;
        }

        // Use in order, nextTick, setImmediate, postMessage, MessageChannel, script readystatechanged, setTimeout
        if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
            scheduleMethod = process.nextTick;
        } else if (typeof setImmediate === 'function') {
            scheduleMethod = setImmediate;
            clearMethod = clearImmediate;
        } else if (postMessageSupported()) {
            var MSG_PREFIX = 'ms.rx.schedule' + Math.random(),
                tasks = {},
                taskId = 0;

            function onGlobalPostMessage(event) {
                // Only if we're a match to avoid any other global events
                if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
                    var handleId = event.data.substring(MSG_PREFIX.length),
                        action = tasks[handleId];
                    action();
                    delete tasks[handleId];
                }
            }

            if (root.addEventListener) {
                root.addEventListener('message', onGlobalPostMessage, false);
            } else {
                root.attachEvent('onmessage', onGlobalPostMessage, false);
            }

            scheduleMethod = function (action) {
                var currentId = taskId++;
                tasks[currentId] = action;
                root.postMessage(MSG_PREFIX + currentId, '*');
            };
        } else if (!!root.MessageChannel) {
            var channel = new root.MessageChannel(),
                channelTasks = {},
                channelTaskId = 0;

            channel.port1.onmessage = function (event) {
                var id = event.data,
                    action = channelTasks[id];
                action();
                delete channelTasks[id];
            };

            scheduleMethod = function (action) {
                var id = channelTaskId++;
                channelTasks[id] = action;
                channel.port2.postMessage(id);     
            };
        } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {
            
            scheduleMethod = function (action) {
                var scriptElement = root.document.createElement('script');
                scriptElement.onreadystatechange = function () { 
                    action();
                    scriptElement.onreadystatechange = null;
                    scriptElement.parentNode.removeChild(scriptElement);
                    scriptElement = null;  
                };
                root.document.documentElement.appendChild(scriptElement);  
            };
 
        } else {
            scheduleMethod = function (action) { return setTimeout(action, 0); };
            clearMethod = clearTimeout;
        }
    }());

    /** 
     * Gets a scheduler that schedules work via a timed callback based upon platform.
     */
    var timeoutScheduler = Scheduler.timeout = (function () {

        function scheduleNow(state, action) {
            var scheduler = this,
                disposable = new SingleAssignmentDisposable();
            var id = scheduleMethod(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
                clearMethod(id);
            }));
        }

        function scheduleRelative(state, dueTime, action) {
            var scheduler = this,
                dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
                return scheduler.scheduleWithState(state, action);
            }
            var disposable = new SingleAssignmentDisposable();
            var id = setTimeout(function () {
                if (!disposable.isDisposed) {
                    disposable.setDisposable(action(scheduler, state));
                }
            }, dt);
            return new CompositeDisposable(disposable, disposableCreate(function () {
                clearTimeout(id);
            }));
        }

        function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
    })();

    /**
     *  Represents a notification to an observer.
     */
    var Notification = Rx.Notification = (function () {
        function Notification(kind, hasValue) { 
            this.hasValue = hasValue == null ? false : hasValue;
            this.kind = kind;
        }

        var NotificationPrototype = Notification.prototype;

        /**
         * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
         * 
         * @memberOf Notification
         * @param {Any} observerOrOnNext Delegate to invoke for an OnNext notification or Observer to invoke the notification on..
         * @param {Function} onError Delegate to invoke for an OnError notification.
         * @param {Function} onCompleted Delegate to invoke for an OnCompleted notification.
         * @returns {Any} Result produced by the observation.
         */
        NotificationPrototype.accept = function (observerOrOnNext, onError, onCompleted) {
            if (arguments.length === 1 && typeof observerOrOnNext === 'object') {
                return this._acceptObservable(observerOrOnNext);
            }
            return this._accept(observerOrOnNext, onError, onCompleted);
        };

        /**
         * Returns an observable sequence with a single notification.
         * 
         * @memberOf Notification
         * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
         * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
         */
        NotificationPrototype.toObservable = function (scheduler) {
            var notification = this;
            scheduler || (scheduler = immediateScheduler);
            return new AnonymousObservable(function (observer) {
                return scheduler.schedule(function () {
                    notification._acceptObservable(observer);
                    if (notification.kind === 'N') {
                        observer.onCompleted();
                    }
                });
            });
        };

        return Notification;
    })();

    /**
     * Creates an object that represents an OnNext notification to an observer.
     * @param {Any} value The value contained in the notification.
     * @returns {Notification} The OnNext notification containing the value.
     */
    var notificationCreateOnNext = Notification.createOnNext = (function () {

        function _accept (onNext) {
            return onNext(this.value);
        }

        function _acceptObservable(observer) {
            return observer.onNext(this.value);
        }

        function toString () {
            return 'OnNext(' + this.value + ')';
        }

        return function (value) {
            var notification = new Notification('N', true);
            notification.value = value;
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification;
        };
    }());

    /**
     * Creates an object that represents an OnError notification to an observer.
     * @param {Any} error The exception contained in the notification.
     * @returns {Notification} The OnError notification containing the exception.
     */
    var notificationCreateOnError = Notification.createOnError = (function () {

        function _accept (onNext, onError) {
            return onError(this.exception);
        }

        function _acceptObservable(observer) {
            return observer.onError(this.exception);
        }

        function toString () {
            return 'OnError(' + this.exception + ')';
        }

        return function (exception) {
            var notification = new Notification('E');
            notification.exception = exception;
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification;
        };
    }());

    /**
     * Creates an object that represents an OnCompleted notification to an observer.
     * @returns {Notification} The OnCompleted notification.
     */
    var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {

        function _accept (onNext, onError, onCompleted) {
            return onCompleted();
        }

        function _acceptObservable(observer) {
            return observer.onCompleted();
        }

        function toString () {
            return 'OnCompleted()';
        }

        return function () {
            var notification = new Notification('C');
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification;
        };
    }());

  var Enumerator = Rx.internals.Enumerator = function (next) {
    this._next = next;
  };

  Enumerator.prototype.next = function () {
    return this._next();
  };

  Enumerator.prototype[$iterator$] = function () { return this; }

  var Enumerable = Rx.internals.Enumerable = function (iterator) {
      this._iterator = iterator;
  };

  Enumerable.prototype[$iterator$] = function () {
      return this._iterator();
  };

  Enumerable.prototype.concat = function () {
      var sources = this;
      return new AnonymousObservable(function (observer) {
        var e;
        try {
          e = sources[$iterator$]();
        } catch(err) {
          observer.onError();
          return;
        }

        var isDisposed, 
          subscription = new SerialDisposable();
        var cancelable = immediateScheduler.scheduleRecursive(function (self) {
          var currentItem;
          if (isDisposed) { return; }

          try {
            currentItem = e.next();
          } catch (ex) {
            observer.onError(ex);
            return;
          }

          if (currentItem.done) {
            observer.onCompleted();
            return;
          }

          // Check if promise
          var currentValue = currentItem.value;
          isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

          var d = new SingleAssignmentDisposable();
          subscription.setDisposable(d);
          d.setDisposable(currentValue.subscribe(
            observer.onNext.bind(observer),
            observer.onError.bind(observer),
            function () { self(); })
          );
        });

        return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
          isDisposed = true;
        }));
      });
  };

  Enumerable.prototype.catchException = function () {
    var sources = this;
    return new AnonymousObservable(function (observer) {
      var e;
      try {
        e = sources[$iterator$]();
      } catch(err) {
        observer.onError();
        return;
      }

      var isDisposed, 
        lastException,
        subscription = new SerialDisposable();
      var cancelable = immediateScheduler.scheduleRecursive(function (self) {
        if (isDisposed) { return; }

        var currentItem;
        try {
          currentItem = e.next();
        } catch (ex) {
          observer.onError(ex);
          return;
        }

        if (currentItem.done) {
          if (lastException) {
            observer.onError(lastException);
          } else {
            observer.onCompleted();
          }
          return;
        }

        // Check if promise
        var currentValue = currentItem.value;
        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));        

        var d = new SingleAssignmentDisposable();
        subscription.setDisposable(d);
        d.setDisposable(currentValue.subscribe(
          observer.onNext.bind(observer),
          function (exn) {
            lastException = exn;
            self();
          },
          observer.onCompleted.bind(observer)));
      });
      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
        isDisposed = true;
      }));
    });
  };


  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
    if (repeatCount == null) { repeatCount = -1; }
    return new Enumerable(function () {
      var left = repeatCount;
      return new Enumerator(function () {
        if (left === 0) { return doneEnumerator; }
        if (left > 0) { left--; }
        return { done: false, value: value };
      });
    });
  };

  var enumerableFor = Enumerable.forEach = function (source, selector, thisArg) {
    selector || (selector = identity);
    return new Enumerable(function () {
      var index = -1;
      return new Enumerator(
        function () {
          return ++index < source.length ?
            { done: false, value: selector.call(thisArg, source[index], index, source) } :
            doneEnumerator;
        });
    });
  };

    /**
     * Supports push-style iteration over an observable sequence.
     */
    var Observer = Rx.Observer = function () { };

    /**
     *  Creates a notification callback from an observer.
     *  
     * @param observer Observer object.
     * @returns The action that forwards its input notification to the underlying observer.
     */
    Observer.prototype.toNotifier = function () {
        var observer = this;
        return function (n) {
            return n.accept(observer);
        };
    };

    /**
     *  Hides the identity of an observer.

     * @returns An observer that hides the identity of the specified observer. 
     */   
    Observer.prototype.asObserver = function () {
        return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this));
    };

    /**
     *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
     *  
     * @static
     * @memberOf Observer
     * @param {Function} [onNext] Observer's OnNext action implementation.
     * @param {Function} [onError] Observer's OnError action implementation.
     * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
     * @returns {Observer} The observer object implemented using the given actions.
     */
    var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
        onNext || (onNext = noop);
        onError || (onError = defaultError);
        onCompleted || (onCompleted = noop);
        return new AnonymousObserver(onNext, onError, onCompleted);
    };

    /**
     *  Creates an observer from a notification callback.
     *  
     * @static
     * @memberOf Observer
     * @param {Function} handler Action that handles a notification.
     * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
     */
    Observer.fromNotifier = function (handler) {
        return new AnonymousObserver(function (x) {
            return handler(notificationCreateOnNext(x));
        }, function (exception) {
            return handler(notificationCreateOnError(exception));
        }, function () {
            return handler(notificationCreateOnCompleted());
        });
    };
    
    /**
     * Abstract base class for implementations of the Observer class.
     * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages. 
     */
    var AbstractObserver = Rx.internals.AbstractObserver = (function (_super) {
        inherits(AbstractObserver, _super);

        /**
         * Creates a new observer in a non-stopped state.
         *
         * @constructor
         */
        function AbstractObserver() {
            this.isStopped = false;
            _super.call(this);
        }

        /**
         * Notifies the observer of a new element in the sequence.
         *  
         * @memberOf AbstractObserver
         * @param {Any} value Next element in the sequence. 
         */
        AbstractObserver.prototype.onNext = function (value) {
            if (!this.isStopped) {
                this.next(value);
            }
        };

        /**
         * Notifies the observer that an exception has occurred.
         * 
         * @memberOf AbstractObserver
         * @param {Any} error The error that has occurred.     
         */    
        AbstractObserver.prototype.onError = function (error) {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(error);
            }
        };

        /**
         * Notifies the observer of the end of the sequence.
         */    
        AbstractObserver.prototype.onCompleted = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this.completed();
            }
        };

        /**
         * Disposes the observer, causing it to transition to the stopped state.
         */
        AbstractObserver.prototype.dispose = function () {
            this.isStopped = true;
        };

        AbstractObserver.prototype.fail = function (e) {
            if (!this.isStopped) {
                this.isStopped = true;
                this.error(e);
                return true;
            }

            return false;
        };

        return AbstractObserver;
    }(Observer));

  /**
   * Class to create an Observer instance from delegate-based implementations of the on* methods.
   */
  var AnonymousObserver = Rx.AnonymousObserver = (function (_super) {
    inherits(AnonymousObserver, _super);

    /**
     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
     * @param {Any} onNext Observer's OnNext action implementation.
     * @param {Any} onError Observer's OnError action implementation.
     * @param {Any} onCompleted Observer's OnCompleted action implementation.  
     */      
    function AnonymousObserver(onNext, onError, onCompleted) {
      _super.call(this);
      this._onNext = onNext;
      this._onError = onError;
      this._onCompleted = onCompleted;
    }

    /**
     * Calls the onNext action.
     * @param {Any} value Next element in the sequence.   
     */     
    AnonymousObserver.prototype.next = function (value) {
      this._onNext(value);
    };

    /**
     * Calls the onError action.
     * @param {Any} error The error that has occurred.   
     */     
    AnonymousObserver.prototype.error = function (exception) {
      this._onError(exception);
    };

    /**
     *  Calls the onCompleted action.
     */        
    AnonymousObserver.prototype.completed = function () {
      this._onCompleted();
    };

    return AnonymousObserver;
  }(AbstractObserver));

    var observableProto;

    /**
     * Represents a push-style collection.
     */
    var Observable = Rx.Observable = (function () {

        /**
         * @constructor
         * @private
         */
        function Observable(subscribe) {
            this._subscribe = subscribe;
        }

        observableProto = Observable.prototype;

        observableProto.finalValue = function () {
            var source = this;
            return new AnonymousObservable(function (observer) {
                var hasValue = false, value;
                return source.subscribe(function (x) {
                    hasValue = true;
                    value = x;
                }, observer.onError.bind(observer), function () {
                    if (!hasValue) {
                        observer.onError(new Error(sequenceContainsNoElements));
                    } else {
                        observer.onNext(value);
                        observer.onCompleted();
                    }
                });
            });
        };

        /**
         *  Subscribes an observer to the observable sequence.
         *  
         * @example
         *  1 - source.subscribe();
         *  2 - source.subscribe(observer);
         *  3 - source.subscribe(function (x) { console.log(x); });
         *  4 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); });
         *  5 - source.subscribe(function (x) { console.log(x); }, function (err) { console.log(err); }, function () { console.log('done'); });
         *  @param {Mixed} [observerOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
         *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
         *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
         *  @returns {Diposable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler. 
         */
        observableProto.subscribe = observableProto.forEach = function (observerOrOnNext, onError, onCompleted) {
            var subscriber;
            if (typeof observerOrOnNext === 'object') {
                subscriber = observerOrOnNext;
            } else {
                subscriber = observerCreate(observerOrOnNext, onError, onCompleted);
            }

            return this._subscribe(subscriber);
        };

        /**
         *  Creates a list from an observable sequence.
         *  
         * @memberOf Observable
         * @returns An observable sequence containing a single element with a list containing all the elements of the source sequence.  
         */
        observableProto.toArray = function () {
            function accumulator(list, i) {
                var newList = list.slice(0);
                newList.push(i);
                return newList;
            }
            return this.scan([], accumulator).startWith([]).finalValue();
        };

        return Observable;
    })();

  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (_super) {
    inherits(ScheduledObserver, _super);

    function ScheduledObserver(scheduler, observer) {
      _super.call(this);
      this.scheduler = scheduler;
      this.observer = observer;
      this.isAcquired = false;
      this.hasFaulted = false;
      this.queue = [];
      this.disposable = new SerialDisposable();
    }

    ScheduledObserver.prototype.next = function (value) {
      var self = this;
      this.queue.push(function () {
        self.observer.onNext(value);
      });
    };

    ScheduledObserver.prototype.error = function (exception) {
      var self = this;
      this.queue.push(function () {
        self.observer.onError(exception);
      });
    };

    ScheduledObserver.prototype.completed = function () {
      var self = this;
      this.queue.push(function () {
        self.observer.onCompleted();
      });
    };

    ScheduledObserver.prototype.ensureActive = function () {
      var isOwner = false, parent = this;
      if (!this.hasFaulted && this.queue.length > 0) {
        isOwner = !this.isAcquired;
        this.isAcquired = true;
      }
      if (isOwner) {
        this.disposable.setDisposable(this.scheduler.scheduleRecursive(function (self) {
          var work;
          if (parent.queue.length > 0) {
            work = parent.queue.shift();
          } else {
            parent.isAcquired = false;
            return;
          }
          try {
            work();
          } catch (ex) {
            parent.queue = [];
            parent.hasFaulted = true;
            throw ex;
          }
          self();
        }));
      }
    };

    ScheduledObserver.prototype.dispose = function () {
      _super.prototype.dispose.call(this);
      this.disposable.dispose();
    };

    return ScheduledObserver;
  }(AbstractObserver));

    /**
     *  Creates an observable sequence from a specified subscribe method implementation.
     *  
     * @example
     *  var res = Rx.Observable.create(function (observer) { return function () { } );
     *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } ); 
     *  var res = Rx.Observable.create(function (observer) { } ); 
     *  
     * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
     * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
     */
    Observable.create = Observable.createWithDisposable = function (subscribe) {
        return new AnonymousObservable(subscribe);
    };

    /**
     *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
     *  
     * @example
     *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });    
     * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence.
     * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
     */
    var observableDefer = Observable.defer = function (observableFactory) {
        return new AnonymousObservable(function (observer) {
            var result;
            try {
                result = observableFactory();
            } catch (e) {
                return observableThrow(e).subscribe(observer);
            }

            // Check if promise
            isPromise(result) && (result = observableFromPromise(result));
            return result.subscribe(observer);
        });
    };

    /**
     *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
     *  
     * @example
     *  var res = Rx.Observable.empty();  
     *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);  
     * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
     * @returns {Observable} An observable sequence with no elements.
     */
    var observableEmpty = Observable.empty = function (scheduler) {
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onCompleted();
            });
        });
    };

    /**
     *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
     *  
     * @example
     *  var res = Rx.Observable.fromArray([1,2,3]);
     *  var res = Rx.Observable.fromArray([1,2,3], Rx.Scheduler.timeout);
     * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
     * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
     */
    var observableFromArray = Observable.fromArray = function (array, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return scheduler.scheduleRecursive(function (self) {
                if (count < array.length) {
                    observer.onNext(array[count++]);
                    self();
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

  /**
   *  Converts an iterable into an Observable sequence
   *  
   * @example
   *  var res = Rx.Observable.fromIterable(new Map());
   *  var res = Rx.Observable.fromIterable(new Set(), Rx.Scheduler.timeout);
   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
   * @returns {Observable} The observable sequence whose elements are pulled from the given generator sequence.
   */
  Observable.fromIterable = function (iterable, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return new AnonymousObservable(function (observer) {
      var iterator;
      try {
        iterator = iterable[$iterator$]();
      } catch (e) {
        observer.onError(e);
        return;
      }

      return scheduler.scheduleRecursive(function (self) {
        var next;
        try {
          next = iterator.next();
        } catch (err) {
          observer.onError(err);
          return;
        }

        if (next.done) {
          observer.onCompleted();
        } else {
          observer.onNext(next.value);
          self();
        }
      });
    });
  };

    /**
     *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
     *  
     * @example
     *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
     *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
     * @param {Mixed} initialState Initial state.
     * @param {Function} condition Condition to terminate generation (upon returning false).
     * @param {Function} iterate Iteration step function.
     * @param {Function} resultSelector Selector function for results produced in the sequence.
     * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
     * @returns {Observable} The generated sequence.
     */
    Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            var first = true, state = initialState;
            return scheduler.scheduleRecursive(function (self) {
                var hasResult, result;
                try {
                    if (first) {
                        first = false;
                    } else {
                        state = iterate(state);
                    }
                    hasResult = condition(state);
                    if (hasResult) {
                        result = resultSelector(state);
                    }
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (hasResult) {
                    observer.onNext(result);
                    self();
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
     * @returns {Observable} An observable sequence whose observers will never get called.
     */
    var observableNever = Observable.never = function () {
        return new AnonymousObservable(function () {
            return disposableEmpty;
        });
    };

    /**
     *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
     *  
     * @example
     *  var res = Rx.Observable.range(0, 10);
     *  var res = Rx.Observable.range(0, 10, Rx.Scheduler.timeout);
     * @param {Number} start The value of the first integer in the sequence.
     * @param {Number} count The number of sequential integers to generate.
     * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
     * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
     */
    Observable.range = function (start, count, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.scheduleRecursiveWithState(0, function (i, self) {
                if (i < count) {
                    observer.onNext(start + i);
                    self(i + 1);
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
     *  
     * @example
     *  var res = Rx.Observable.repeat(42);
     *  var res = Rx.Observable.repeat(42, 4);
     *  3 - res = Rx.Observable.repeat(42, 4, Rx.Scheduler.timeout);
     *  4 - res = Rx.Observable.repeat(42, null, Rx.Scheduler.timeout);
     * @param {Mixed} value Element to repeat.
     * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
     * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
     * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
     */
    Observable.repeat = function (value, repeatCount, scheduler) {
        scheduler || (scheduler = currentThreadScheduler);
        if (repeatCount == null) {
            repeatCount = -1;
        }
        return observableReturn(value, scheduler).repeat(repeatCount);
    };

    /**
     *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
     *  There is an alias called 'returnValue' for browsers <IE9.
     *  
     * @example
     *  var res = Rx.Observable.return(42);
     *  var res = Rx.Observable.return(42, Rx.Scheduler.timeout);
     * @param {Mixed} value Single element in the resulting observable sequence.
     * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
     * @returns {Observable} An observable sequence containing the single specified element.
     */
    var observableReturn = Observable['return'] = Observable.returnValue = function (value, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onNext(value);
                observer.onCompleted();
            });
        });
    };

    /**
     *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
     *  There is an alias to this method called 'throwException' for browsers <IE9.
     *  
     * @example
     *  var res = Rx.Observable.throwException(new Error('Error'));
     *  var res = Rx.Observable.throwException(new Error('Error'), Rx.Scheduler.timeout);
     * @param {Mixed} exception An object used for the sequence's termination.
     * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
     * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
     */
    var observableThrow = Observable['throw'] = Observable.throwException = function (exception, scheduler) {
        scheduler || (scheduler = immediateScheduler);
        return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
                observer.onError(exception);
            });
        });
    };

    function observableCatchHandler(source, handler) {
        return new AnonymousObservable(function (observer) {
            var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
            subscription.setDisposable(d1);
            d1.setDisposable(source.subscribe(observer.onNext.bind(observer), function (exception) {
                var d, result;
                try {
                    result = handler(exception);
                } catch (ex) {
                    observer.onError(ex);
                    return;
                }
                d = new SingleAssignmentDisposable();
                subscription.setDisposable(d);
                d.setDisposable(result.subscribe(observer));
            }, observer.onCompleted.bind(observer)));
            return subscription;
        });
    }

    /**
     * Continues an observable sequence that is terminated by an exception with the next observable sequence.
     * @example
     * 1 - xs.catchException(ys)
     * 2 - xs.catchException(function (ex) { return ys(ex); })
     * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
     * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
     */      
    observableProto['catch'] = observableProto.catchException = function (handlerOrSecond) {
        if (typeof handlerOrSecond === 'function') {
            return observableCatchHandler(this, handlerOrSecond);
        }
        return observableCatch([this, handlerOrSecond]);
    };

    /**
     * Continues an observable sequence that is terminated by an exception with the next observable sequence.
     * 
     * @example
     * 1 - res = Rx.Observable.catchException(xs, ys, zs);
     * 2 - res = Rx.Observable.catchException([xs, ys, zs]);
     * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
     */
    var observableCatch = Observable.catchException = Observable['catch'] = function () {
        var items = argsOrArray(arguments, 0);
        return enumerableFor(items).catchException();
    };

    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.
     * This can be in the form of an argument list of observables or an array.
     *
     * @example
     * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
     * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
     * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function. 
     */
    observableProto.combineLatest = function () {
        var args = slice.call(arguments);
        if (Array.isArray(args[0])) {
            args[0].unshift(this);
        } else {
            args.unshift(this);
        }
        return combineLatest.apply(this, args);
    };

    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences produces an element.
     * 
     * @example
     * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
     * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });     
     * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
     */
    var combineLatest = Observable.combineLatest = function () {
        var args = slice.call(arguments), resultSelector = args.pop();
        
        if (Array.isArray(args[0])) {
            args = args[0];
        }

        return new AnonymousObservable(function (observer) {
            var falseFactory = function () { return false; },
                n = args.length,
                hasValue = arrayInitialize(n, falseFactory),
                hasValueAll = false,
                isDone = arrayInitialize(n, falseFactory),
                values = new Array(n);

            function next(i) {
                var res;
                hasValue[i] = true;
                if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
                    try {
                        res = resultSelector.apply(null, values);
                    } catch (ex) {
                        observer.onError(ex);
                        return;
                    }
                    observer.onNext(res);
                } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
                    observer.onCompleted();
                }
            }

            function done (i) {
                isDone[i] = true;
                if (isDone.every(identity)) {
                    observer.onCompleted();
                }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
                (function (i) {
                    subscriptions[i] = new SingleAssignmentDisposable();
                    subscriptions[i].setDisposable(args[i].subscribe(function (x) {
                        values[i] = x;
                        next(i);
                    }, observer.onError.bind(observer), function () {
                        done(i);
                    }));
                }(idx));
            }

            return new CompositeDisposable(subscriptions);
        });
    };

    /**
     * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
     * 
     * @example
     * 1 - concatenated = xs.concat(ys, zs);
     * 2 - concatenated = xs.concat([ys, zs]);
     * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order. 
     */ 
    observableProto.concat = function () {
        var items = slice.call(arguments, 0);
        items.unshift(this);
        return observableConcat.apply(this, items);
    };

    /**
     * Concatenates all the observable sequences.
     * 
     * @example
     * 1 - res = Rx.Observable.concat(xs, ys, zs);
     * 2 - res = Rx.Observable.concat([xs, ys, zs]);
     * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order. 
     */
    var observableConcat = Observable.concat = function () {
        var sources = argsOrArray(arguments, 0);
        return enumerableFor(sources).concat();
    };  

    /**
     * Concatenates an observable sequence of observable sequences.
     * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order. 
     */ 
    observableProto.concatObservable = observableProto.concatAll =function () {
        return this.merge(1);
    };

    /**
     * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
     * Or merges two observable sequences into a single observable sequence.
     * 
     * @example
     * 1 - merged = sources.merge(1);
     * 2 - merged = source.merge(otherSource);  
     * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
     * @returns {Observable} The observable sequence that merges the elements of the inner sequences. 
     */ 
    observableProto.merge = function (maxConcurrentOrOther) {
        if (typeof maxConcurrentOrOther !== 'number') {
            return observableMerge(this, maxConcurrentOrOther);
        }
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var activeCount = 0,
                group = new CompositeDisposable(),
                isStopped = false,
                q = [],
                subscribe = function (xs) {
                    var subscription = new SingleAssignmentDisposable();
                    group.add(subscription);

                    // Check for promises support
                    if (isPromise(xs)) { xs = observableFromPromise(xs); }

                    subscription.setDisposable(xs.subscribe(observer.onNext.bind(observer), observer.onError.bind(observer), function () {
                        var s;
                        group.remove(subscription);
                        if (q.length > 0) {
                            s = q.shift();
                            subscribe(s);
                        } else {
                            activeCount--;
                            if (isStopped && activeCount === 0) {
                                observer.onCompleted();
                            }
                        }
                    }));
                };
            group.add(sources.subscribe(function (innerSource) {
                if (activeCount < maxConcurrentOrOther) {
                    activeCount++;
                    subscribe(innerSource);
                } else {
                    q.push(innerSource);
                }
            }, observer.onError.bind(observer), function () {
                isStopped = true;
                if (activeCount === 0) {
                    observer.onCompleted();
                }
            }));
            return group;
        });
    };

    /**
     * Merges all the observable sequences into a single observable sequence.  
     * The scheduler is optional and if not specified, the immediate scheduler is used.
     * 
     * @example
     * 1 - merged = Rx.Observable.merge(xs, ys, zs);
     * 2 - merged = Rx.Observable.merge([xs, ys, zs]);
     * 3 - merged = Rx.Observable.merge(scheduler, xs, ys, zs);
     * 4 - merged = Rx.Observable.merge(scheduler, [xs, ys, zs]);    
     * @returns {Observable} The observable sequence that merges the elements of the observable sequences. 
     */  
    var observableMerge = Observable.merge = function () {
        var scheduler, sources;
        if (!arguments[0]) {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 1);
        } else if (arguments[0].now) {
            scheduler = arguments[0];
            sources = slice.call(arguments, 1);
        } else {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 0);
        }
        if (Array.isArray(sources[0])) {
            sources = sources[0];
        }
        return observableFromArray(sources, scheduler).mergeObservable();
    };   

  /**
   * Merges an observable sequence of observable sequences into an observable sequence.
   * @returns {Observable} The observable sequence that merges the elements of the inner sequences.   
   */  
  observableProto.mergeObservable = observableProto.mergeAll =function () {
    var sources = this;
    return new AnonymousObservable(function (observer) {
      var group = new CompositeDisposable(),
        isStopped = false,
        m = new SingleAssignmentDisposable();

      group.add(m);
      m.setDisposable(sources.subscribe(function (innerSource) {
        var innerSubscription = new SingleAssignmentDisposable();
        group.add(innerSubscription);

        // Check if Promise or Observable
        if (isPromise(innerSource)) {
            innerSource = observableFromPromise(innerSource);
        }

        innerSubscription.setDisposable(innerSource.subscribe(function (x) {
            observer.onNext(x);
        }, observer.onError.bind(observer), function () {
            group.remove(innerSubscription);
            if (isStopped && group.length === 1) { observer.onCompleted(); }
        }));
      }, observer.onError.bind(observer), function () {
        isStopped = true;
        if (group.length === 1) { observer.onCompleted(); }
      }));
      return group;
    });
  };

    /**
     * Returns the values from the source observable sequence only after the other observable sequence produces a value.
     * @param {Observable} other The observable sequence that triggers propagation of elements of the source sequence.
     * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.    
     */
    observableProto.skipUntil = function (other) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var isOpen = false;
            var disposables = new CompositeDisposable(source.subscribe(function (left) {
                if (isOpen) {
                    observer.onNext(left);
                }
            }, observer.onError.bind(observer), function () {
                if (isOpen) {
                    observer.onCompleted();
                }
            }));

            var rightSubscription = new SingleAssignmentDisposable();
            disposables.add(rightSubscription);
            rightSubscription.setDisposable(other.subscribe(function () {
                isOpen = true;
                rightSubscription.dispose();
            }, observer.onError.bind(observer), function () {
                rightSubscription.dispose();
            }));

            return disposables;
        });
    };

    /**
     * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
     * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.  
     */
    observableProto['switch'] = observableProto.switchLatest = function () {
        var sources = this;
        return new AnonymousObservable(function (observer) {
            var hasLatest = false,
                innerSubscription = new SerialDisposable(),
                isStopped = false,
                latest = 0,
                subscription = sources.subscribe(function (innerSource) {
                    var d = new SingleAssignmentDisposable(), id = ++latest;
                    hasLatest = true;
                    innerSubscription.setDisposable(d);

                    // Check if Promise or Observable
                    if (isPromise(innerSource)) {
                        innerSource = observableFromPromise(innerSource);
                    }

                    d.setDisposable(innerSource.subscribe(function (x) {
                        if (latest === id) {
                            observer.onNext(x);
                        }
                    }, function (e) {
                        if (latest === id) {
                            observer.onError(e);
                        }
                    }, function () {
                        if (latest === id) {
                            hasLatest = false;
                            if (isStopped) {
                                observer.onCompleted();
                            }
                        }
                    }));
                }, observer.onError.bind(observer), function () {
                    isStopped = true;
                    if (!hasLatest) {
                        observer.onCompleted();
                    }
                });
            return new CompositeDisposable(subscription, innerSubscription);
        });
    };

    /**
     * Returns the values from the source observable sequence until the other observable sequence produces a value.
     * @param {Observable} other Observable sequence that terminates propagation of elements of the source sequence.
     * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.   
     */
    observableProto.takeUntil = function (other) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(
                source.subscribe(observer),
                other.subscribe(observer.onCompleted.bind(observer), observer.onError.bind(observer), noop)
            );
        });
    };

    function zipArray(second, resultSelector) {
        var first = this;
        return new AnonymousObservable(function (observer) {
            var index = 0, len = second.length;
            return first.subscribe(function (left) {
                if (index < len) {
                    var right = second[index++], result;
                    try {
                        result = resultSelector(left, right);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    observer.onNext(result);
                } else {
                    observer.onCompleted();
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    }    

    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
     * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the sources.
     *
     * @example
     * 1 - res = obs1.zip(obs2, fn);
     * 1 - res = x1.zip([1,2,3], fn);  
     * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function. 
     */   
    observableProto.zip = function () {
        if (Array.isArray(arguments[0])) {
            return zipArray.apply(this, arguments);
        }
        var parent = this, sources = slice.call(arguments), resultSelector = sources.pop();
        sources.unshift(parent);
        return new AnonymousObservable(function (observer) {
            var n = sources.length,
              queues = arrayInitialize(n, function () { return []; }),
              isDone = arrayInitialize(n, function () { return false; });
              
            var next = function (i) {
                var res, queuedValues;
                if (queues.every(function (x) { return x.length > 0; })) {
                    try {
                        queuedValues = queues.map(function (x) { return x.shift(); });
                        res = resultSelector.apply(parent, queuedValues);
                    } catch (ex) {
                        observer.onError(ex);
                        return;
                    }
                    observer.onNext(res);
                } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
                    observer.onCompleted();
                }
            };

            function done(i) {
                isDone[i] = true;
                if (isDone.every(function (x) { return x; })) {
                    observer.onCompleted();
                }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
                (function (i) {
                    subscriptions[i] = new SingleAssignmentDisposable();
                    subscriptions[i].setDisposable(sources[i].subscribe(function (x) {
                        queues[i].push(x);
                        next(i);
                    }, observer.onError.bind(observer), function () {
                        done(i);
                    }));
                })(idx);
            }

            return new CompositeDisposable(subscriptions);
        });
    };
    /**
     * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
     * @param arguments Observable sources.
     * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
     * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
     */
    Observable.zip = function () {
        var args = slice.call(arguments, 0),
            first = args.shift();
        return first.zip.apply(first, args);
    };

    /**
     * Merges the specified observable sequences into one observable sequence by emitting a list with the elements of the observable sequences at corresponding indexes.
     * @param arguments Observable sources.
     * @returns {Observable} An observable sequence containing lists of elements at corresponding indexes.
     */
    Observable.zipArray = function () {
        var sources = argsOrArray(arguments, 0);
        return new AnonymousObservable(function (observer) {
            var n = sources.length,
              queues = arrayInitialize(n, function () { return []; }),
              isDone = arrayInitialize(n, function () { return false; });

            function next(i) {
                if (queues.every(function (x) { return x.length > 0; })) {
                    var res = queues.map(function (x) { return x.shift(); });
                    observer.onNext(res);
                } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
                    observer.onCompleted();
                    return;
                }
            };

            function done(i) {
                isDone[i] = true;
                if (isDone.every(identity)) {
                    observer.onCompleted();
                    return;
                }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
                (function (i) {
                    subscriptions[i] = new SingleAssignmentDisposable();
                    subscriptions[i].setDisposable(sources[i].subscribe(function (x) {
                        queues[i].push(x);
                        next(i);
                    }, observer.onError.bind(observer), function () {
                        done(i);
                    }));
                })(idx);
            }

            var compositeDisposable = new CompositeDisposable(subscriptions);
            compositeDisposable.add(disposableCreate(function () {
                for (var qIdx = 0, qLen = queues.length; qIdx < qLen; qIdx++) {
                    queues[qIdx] = [];
                }
            }));
            return compositeDisposable;
        });
    };

    /**
     *  Hides the identity of an observable sequence.
     * @returns {Observable} An observable sequence that hides the identity of the source sequence.    
     */
    observableProto.asObservable = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(observer);
        });
    };

    /**
     * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
     * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
     */ 
    observableProto.dematerialize = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                return x.accept(observer);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Returns an observable sequence that contains only distinct contiguous elements according to the keySelector and the comparer.
     *  
     *  var obs = observable.distinctUntilChanged();
     *  var obs = observable.distinctUntilChanged(function (x) { return x.id; });
     *  var obs = observable.distinctUntilChanged(function (x) { return x.id; }, function (x, y) { return x === y; });
     *
     * @param {Function} [keySelector] A function to compute the comparison key for each element. If not provided, it projects the value.
     * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
     * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.   
     */
    observableProto.distinctUntilChanged = function (keySelector, comparer) {
        var source = this;
        keySelector || (keySelector = identity);
        comparer || (comparer = defaultComparer);
        return new AnonymousObservable(function (observer) {
            var hasCurrentKey = false, currentKey;
            return source.subscribe(function (value) {
                var comparerEquals = false, key;
                try {
                    key = keySelector(value);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (hasCurrentKey) {
                    try {
                        comparerEquals = comparer(currentKey, key);
                    } catch (exception) {
                        observer.onError(exception);
                        return;
                    }
                }
                if (!hasCurrentKey || !comparerEquals) {
                    hasCurrentKey = true;
                    currentKey = key;
                    observer.onNext(value);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
     *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
     *  
     * @example
     *  var res = observable.doAction(observer);
     *  var res = observable.doAction(onNext);
     *  var res = observable.doAction(onNext, onError);
     *  var res = observable.doAction(onNext, onError, onCompleted);
     * @param {Mixed} observerOrOnNext Action to invoke for each element in the observable sequence or an observer.
     * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
     * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
     * @returns {Observable} The source sequence with the side-effecting behavior applied.   
     */
    observableProto['do'] = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
        var source = this, onNextFunc;
        if (typeof observerOrOnNext === 'function') {
            onNextFunc = observerOrOnNext;
        } else {
            onNextFunc = observerOrOnNext.onNext.bind(observerOrOnNext);
            onError = observerOrOnNext.onError.bind(observerOrOnNext);
            onCompleted = observerOrOnNext.onCompleted.bind(observerOrOnNext);
        }
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
                try {
                    onNextFunc(x);
                } catch (e) {
                    observer.onError(e);
                }
                observer.onNext(x);
            }, function (exception) {
                if (!onError) {
                    observer.onError(exception);
                } else {
                    try {
                        onError(exception);
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onError(exception);
                }
            }, function () {
                if (!onCompleted) {
                    observer.onCompleted();
                } else {
                    try {
                        onCompleted();
                    } catch (e) {
                        observer.onError(e);
                    }
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
     *  
     * @example
     *  var res = observable.finallyAction(function () { console.log('sequence ended'; });
     * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
     * @returns {Observable} Source sequence with the action-invoking termination behavior applied. 
     */  
    observableProto['finally'] = observableProto.finallyAction = function (action) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var subscription = source.subscribe(observer);
            return disposableCreate(function () {
                try {
                    subscription.dispose();
                } catch (e) { 
                    throw e;                    
                } finally {
                    action();
                }
            });
        });
    };

    /**
     *  Ignores all elements in an observable sequence leaving only the termination messages.
     * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.    
     */
    observableProto.ignoreElements = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(noop, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Materializes the implicit notifications of an observable sequence as explicit notification values.
     * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
     */    
    observableProto.materialize = function () {
        var source = this;
        return new AnonymousObservable(function (observer) {
            return source.subscribe(function (value) {
                observer.onNext(notificationCreateOnNext(value));
            }, function (e) {
                observer.onNext(notificationCreateOnError(e));
                observer.onCompleted();
            }, function () {
                observer.onNext(notificationCreateOnCompleted());
                observer.onCompleted();
            });
        });
    };

    /**
     *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
     *  
     * @example
     *  var res = repeated = source.repeat();
     *  var res = repeated = source.repeat(42);
     * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
     * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.   
     */
    observableProto.repeat = function (repeatCount) {
        return enumerableRepeat(this, repeatCount).concat();
    };

    /**
     *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
     *  
     * @example
     *  var res = retried = retry.repeat();
     *  var res = retried = retry.repeat(42);
     * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
     * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully. 
     */
    observableProto.retry = function (retryCount) {
        return enumerableRepeat(this, retryCount).catchException();
    };

    /**
     *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
     *  For aggregation behavior with no intermediate results, see Observable.aggregate.
     * @example
     *  var res = source.scan(function (acc, x) { return acc + x; });
     *  var res = source.scan(0, function (acc, x) { return acc + x; });
     * @param {Mixed} [seed] The initial accumulator value.
     * @param {Function} accumulator An accumulator function to be invoked on each element.
     * @returns {Observable} An observable sequence containing the accumulated values.
     */
    observableProto.scan = function () {
        var hasSeed = false, seed, accumulator, source = this;
        if (arguments.length === 2) {
            hasSeed = true;
            seed = arguments[0];
            accumulator = arguments[1];        
        } else {
            accumulator = arguments[0];
        }
        return new AnonymousObservable(function (observer) {
            var hasAccumulation, accumulation, hasValue;
            return source.subscribe (
                function (x) {
                    try {
                        if (!hasValue) {
                            hasValue = true;
                        }
     
                        if (hasAccumulation) {
                            accumulation = accumulator(accumulation, x);
                        } else {
                            accumulation = hasSeed ? accumulator(seed, x) : x;
                            hasAccumulation = true;
                        }                    
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
     
                    observer.onNext(accumulation);
                },
                observer.onError.bind(observer),
                function () {
                    if (!hasValue && hasSeed) {
                        observer.onNext(seed);
                    }
                    observer.onCompleted();
                }
            );
        });
    };

    /**
     *  Bypasses a specified number of elements at the end of an observable sequence.
     * @description
     *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
     *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.     
     * @param count Number of elements to bypass at the end of the source sequence.
     * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.   
     */
    observableProto.skipLast = function (count) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                q.push(x);
                if (q.length > count) {
                    observer.onNext(q.shift());
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
     *  
     *  var res = source.startWith(1, 2, 3);
     *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
     *  
     * @memberOf Observable#
     * @returns {Observable} The source sequence prepended with the specified values.  
     */
    observableProto.startWith = function () {
        var values, scheduler, start = 0;
        if (!!arguments.length && 'now' in Object(arguments[0])) {
            scheduler = arguments[0];
            start = 1;
        } else {
            scheduler = immediateScheduler;
        }
        values = slice.call(arguments, start);
        return enumerableFor([observableFromArray(values, scheduler), this]).concat();
    };

    /**
     *  Returns a specified number of contiguous elements from the end of an observable sequence, using an optional scheduler to drain the queue.
     *  
     * @example
     *  var res = source.takeLast(5);
     *  var res = source.takeLast(5, Rx.Scheduler.timeout);
     *  
     * @description
     *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
     *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
     * @param {Number} count Number of elements to take from the end of the source sequence.
     * @param {Scheduler} [scheduler] Scheduler used to drain the queue upon completion of the source sequence.
     * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
     */   
    observableProto.takeLast = function (count, scheduler) {
        return this.takeLastBuffer(count).selectMany(function (xs) { return observableFromArray(xs, scheduler); });
    };

    /**
     *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
     *  
     * @description
     *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
     *  source sequence, this buffer is produced on the result sequence.       
     * @param {Number} count Number of elements to take from the end of the source sequence.
     * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
     */
    observableProto.takeLastBuffer = function (count) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                q.push(x);
                if (q.length > count) {
                    q.shift();
                }
            }, observer.onError.bind(observer), function () {
                observer.onNext(q);
                observer.onCompleted();
            });
        });
    };

    /**
     *  Projects each element of an observable sequence into a new form by incorporating the element's index.
     * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source. 
     */
    observableProto.select = observableProto.map = function (selector, thisArg) {
        var parent = this;
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return parent.subscribe(function (value) {
                var result;
                try {
                    result = selector.call(thisArg, value, count++, parent);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                observer.onNext(result);
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    function selectMany(selector) {
      return this.select(function (x, i) {
        var result = selector(x, i);
        return isPromise(result) ? observableFromPromise(result) : result;
      }).mergeObservable();
    }

    /**
     *  One of the Following:
     *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
     *  
     * @example
     *  var res = source.selectMany(function (x) { return Rx.Observable.range(0, x); });
     *  Or:
     *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
     *  
     *  var res = source.selectMany(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
     *  Or:
     *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
     *  
     *  var res = source.selectMany(Rx.Observable.fromArray([1,2,3]));
     * @param selector A transform function to apply to each element or an observable sequence to project each element from the 
     * source sequence onto which could be either an observable or Promise.
     * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
     * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   
     */
    observableProto.selectMany = observableProto.flatMap = function (selector, resultSelector) {
      if (resultSelector) {
          return this.selectMany(function (x, i) {
            var selectorResult = selector(x, i),
              result = isPromise(selectorResult) ? observableFromPromise(selectorResult) : selectorResult;

            return result.select(function (y) {
              return resultSelector(x, y, i);
            });
          });
      }
      if (typeof selector === 'function') {
        return selectMany.call(this, selector);
      }
      return selectMany.call(this, function () {
        return selector;
      });
    };

    /**
     *  Projects each element of an observable sequence into a new sequence of observable sequences by incorporating the element's index and then 
     *  transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
     * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source producing an Observable of Observable sequences 
     *  and that at any point in time produces the elements of the most recent inner observable sequence that has been received.
     */
    observableProto.selectSwitch = observableProto.flatMapLatest = function (selector, thisArg) {
        return this.select(selector, thisArg).switchLatest();
    };

    /**
     * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
     * @param {Number} count The number of elements to skip before returning the remaining elements.
     * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.   
     */
    observableProto.skip = function (count) {
        if (count < 0) {
            throw new Error(argumentOutOfRange);
        }
        var observable = this;
        return new AnonymousObservable(function (observer) {
            var remaining = count;
            return observable.subscribe(function (x) {
                if (remaining <= 0) {
                    observer.onNext(x);
                } else {
                    remaining--;
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
     *  The element's index is used in the logic of the predicate function.
     *  
     *  var res = source.skipWhile(function (value) { return value < 10; });
     *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
     * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
     * @param {Any} [thisArg] Object to use as this when executing callback.     
     * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.   
     */
    observableProto.skipWhile = function (predicate, thisArg) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var i = 0, running = false;
            return source.subscribe(function (x) {
                if (!running) {
                    try {
                        running = !predicate.call(thisArg, x, i++, source);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                }
                if (running) {
                    observer.onNext(x);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
     *  
     *  var res = source.take(5);
     *  var res = source.take(0, Rx.Scheduler.timeout);
     * @param {Number} count The number of elements to return.
     * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
     * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.  
     */
    observableProto.take = function (count, scheduler) {
        if (count < 0) {
            throw new Error(argumentOutOfRange);
        }
        if (count === 0) {
            return observableEmpty(scheduler);
        }
        var observable = this;
        return new AnonymousObservable(function (observer) {
            var remaining = count;
            return observable.subscribe(function (x) {
                if (remaining > 0) {
                    remaining--;
                    observer.onNext(x);
                    if (remaining === 0) {
                        observer.onCompleted();
                    }
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Returns elements from an observable sequence as long as a specified condition is true.
     *  The element's index is used in the logic of the predicate function.
     *  
     * @example
     *  var res = source.takeWhile(function (value) { return value < 10; });
     *  var res = source.takeWhile(function (value, index) { return value < 10 || index < 10; });
     * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
     * @param {Any} [thisArg] Object to use as this when executing callback.     
     * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.  
     */
    observableProto.takeWhile = function (predicate, thisArg) {
        var observable = this;
        return new AnonymousObservable(function (observer) {
            var i = 0, running = true;
            return observable.subscribe(function (x) {
                if (running) {
                    try {
                        running = predicate.call(thisArg, x, i++, observable);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    if (running) {
                        observer.onNext(x);
                    } else {
                        observer.onCompleted();
                    }
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
     *  
     * @example
     *  var res = source.where(function (value) { return value < 10; });
     *  var res = source.where(function (value, index) { return value < 10 || index < 10; });
     * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.   
     */
    observableProto.where = observableProto.filter = function (predicate, thisArg) {
        var parent = this;
        return new AnonymousObservable(function (observer) {
            var count = 0;
            return parent.subscribe(function (value) {
                var shouldRun;
                try {
                    shouldRun = predicate.call(thisArg, value, count++, parent);
                } catch (exception) {
                    observer.onError(exception);
                    return;
                }
                if (shouldRun) {
                    observer.onNext(value);
                }
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
        });
    };

    /**
     * Converts a callback function to an observable sequence. 
     * 
     * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
     * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
     */
    Observable.fromCallback = function (func, scheduler, context, selector) {
        scheduler || (scheduler = immediateScheduler);
        return function () {
            var args = slice.call(arguments, 0);

            return new AnonymousObservable(function (observer) {
                return scheduler.schedule(function () {
                    function handler(e) {
                        var results = e;
                        
                        if (selector) {
                            try {
                                results = selector(arguments);
                            } catch (err) {
                                observer.onError(err);
                                return;
                            }
                        } else {
                            if (results.length === 1) {
                                results = results[0];
                            }
                        }

                        observer.onNext(results);
                        observer.onCompleted();
                    }

                    args.push(handler);
                    func.apply(context, args);
                });
            });
        };
    };

    /**
     * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
     * @param {Function} func The function to call
     * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
     * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
     * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.     
     * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
     */
    Observable.fromNodeCallback = function (func, scheduler, context, selector) {
        scheduler || (scheduler = immediateScheduler);
        return function () {
            var args = slice.call(arguments, 0);

            return new AnonymousObservable(function (observer) {
                return scheduler.schedule(function () {
                    
                    function handler(err) {
                        if (err) {
                            observer.onError(err);
                            return;
                        }

                        var results = slice.call(arguments, 1);
                        
                        if (selector) {
                            try {
                                results = selector(results);
                            } catch (e) {
                                observer.onError(e);
                                return;
                            }
                        } else {
                            if (results.length === 1) {
                                results = results[0];
                            }
                        }

                        observer.onNext(results);
                        observer.onCompleted();
                    }

                    args.push(handler);
                    func.apply(context, args);
                });
            });
        };
    };

    function createListener (element, name, handler) {
        // Node.js specific
        if (element.addListener) {
            element.addListener(name, handler);
            return disposableCreate(function () {
                element.removeListener(name, handler);
            });
        } else if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
                element.removeEventListener(name, handler, false);
            });
        }
    }

    function createEventListener (el, eventName, handler) {
        var disposables = new CompositeDisposable();

        // Asume NodeList
        if (el && el.length) {
            for (var i = 0, len = el.length; i < len; i++) {
                disposables.add(createEventListener(el[i], eventName, handler));
            }
        } else if (el) {
            disposables.add(createListener(el, eventName, handler));
        }

        return disposables;
    }

    /**
     * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
     *
     * @example
     *   var source = Rx.Observable.fromEvent(element, 'mouseup');
     * 
     * @param {Object} element The DOMElement or NodeList to attach a listener.
     * @param {String} eventName The event name to attach the observable sequence.
     * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.     
     * @returns {Observable} An observable sequence of events from the specified element and the specified event.
     */
    Observable.fromEvent = function (element, eventName, selector) {
        return new AnonymousObservable(function (observer) {
            return createEventListener(
                element, 
                eventName, 
                function handler (e) { 
                    var results = e;

                    if (selector) {
                        try {
                            results = selector(arguments);
                        } catch (err) {
                            observer.onError(err);
                            return
                        }
                    }

                    observer.onNext(results); 
                });
        }).publish().refCount();
    };
    /**
     * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
     * @param {Function} addHandler The function to add a handler to the emitter.
     * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
     * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
     * @returns {Observable} An observable sequence which wraps an event from an event emitter
     */
    Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
        return new AnonymousObservable(function (observer) {
            function innerHandler (e) {
                var result = e;
                if (selector) {
                    try {
                        result = selector(arguments);
                    } catch (err) {
                        observer.onError(err);
                        return;
                    }
                }
                observer.onNext(result);
            }

            var returnValue = addHandler(innerHandler);
            return disposableCreate(function () {
                if (removeHandler) {
                    removeHandler(innerHandler, returnValue);
                }
            });
        }).publish().refCount();
    };

  /**
   * Converts a Promise to an Observable sequence
   * @param {Promise} An ES6 Compliant promise.
   * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
   */
  var observableFromPromise = Observable.fromPromise = function (promise) {
    return new AnonymousObservable(function (observer) {
      promise.then(
        function (value) {
          observer.onNext(value);
          observer.onCompleted();
        }, 
        function (reason) {
          observer.onError(reason);
        });

      return function () {
        if (promise && promise.abort) {
          promise.abort();
        }
      }
    });
  };
    /*
     * Converts an existing observable sequence to an ES6 Compatible Promise
     * @example
     * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
     * 
     * // With config
     * Rx.config.Promise = RSVP.Promise;
     * var promise = Rx.Observable.return(42).toPromise();
     * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
     * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
     */
    observableProto.toPromise = function (promiseCtor) {
        promiseCtor || (promiseCtor = Rx.config.Promise);
        if (!promiseCtor) {
            throw new Error('Promise type not provided nor in Rx.config.Promise');
        }
        var source = this;
        return new promiseCtor(function (resolve, reject) {
            // No cancellation can be done
            var value, hasValue = false;
            source.subscribe(function (v) {
                value = v;
                hasValue = true;
            }, function (err) {
                reject(err);
            }, function () {
                if (hasValue) {
                    resolve(value);
                }
            });
        });
    };
  /**
   * Invokes the asynchronous function, surfacing the result through an observable sequence.
   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
   */
  Observable.startAsync = function (functionAsync) {
    var promise;
    try {
      promise = functionAsync();
    } catch (e) {
      return observableThrow(e);
    }
    return observableFromPromise(promise);
  }

    /**
     * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
     * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
     * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
     * 
     * @example
     * 1 - res = source.multicast(observable);
     * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
     * 
     * @param {Function|Subject} subjectOrSubjectSelector 
     * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
     * Or:
     * Subject to push source elements into.
     * 
     * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.multicast = function (subjectOrSubjectSelector, selector) {
        var source = this;
        return typeof subjectOrSubjectSelector === 'function' ?
            new AnonymousObservable(function (observer) {
                var connectable = source.multicast(subjectOrSubjectSelector());
                return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect());
            }) :
            new ConnectableObservable(source, subjectOrSubjectSelector);
    };

    /**
     * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
     * This operator is a specialization of Multicast using a regular Subject.
     * 
     * @example
     * var resres = source.publish();
     * var res = source.publish(function (x) { return x; });
     * 
     * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.publish = function (selector) {
        return !selector ?
            this.multicast(new Subject()) :
            this.multicast(function () {
                return new Subject();
            }, selector);
    };

    /**
     * Returns an observable sequence that shares a single subscription to the underlying sequence.
     * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
     * 
     * @example
     * var res = source.share();
     * 
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
     */
    observableProto.share = function () {
        return this.publish(null).refCount();
    };

    /**
     * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
     * This operator is a specialization of Multicast using a AsyncSubject.
     * 
     * @example
     * var res = source.publishLast();
     * var res = source.publishLast(function (x) { return x; });
     * 
     * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.publishLast = function (selector) {
        return !selector ?
            this.multicast(new AsyncSubject()) :
            this.multicast(function () {
                return new AsyncSubject();
            }, selector);
    };

    /**
     * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
     * This operator is a specialization of Multicast using a BehaviorSubject.
     * 
     * @example
     * var res = source.publishValue(42);
     * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
     * 
     * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
     * @param {Mixed} initialValue Initial value received by observers upon subscription.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.publishValue = function (initialValueOrSelector, initialValue) {
        return arguments.length === 2 ?
            this.multicast(function () {
                return new BehaviorSubject(initialValue);
            }, initialValueOrSelector) :
            this.multicast(new BehaviorSubject(initialValueOrSelector));
    };

    /**
     * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
     * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
     * 
     * @example
     * var res = source.shareValue(42);
     * 
     * @param {Mixed} initialValue Initial value received by observers upon subscription.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
     */
    observableProto.shareValue = function (initialValue) {
        return this.publishValue(initialValue).
            refCount();
    };

    /**
     * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
     * This operator is a specialization of Multicast using a ReplaySubject.
     * 
     * @example
     * var res = source.replay(null, 3);
     * var res = source.replay(null, 3, 500);
     * var res = source.replay(null, 3, 500, scheduler);
     * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
     * 
     * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
     * @param bufferSize [Optional] Maximum element count of the replay buffer.
     * @param window [Optional] Maximum time length of the replay buffer.
     * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
     */
    observableProto.replay = function (selector, bufferSize, window, scheduler) {
        return !selector ?
            this.multicast(new ReplaySubject(bufferSize, window, scheduler)) :
            this.multicast(function () {
                return new ReplaySubject(bufferSize, window, scheduler);
            }, selector);
    };

    /**
     * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
     * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
     * 
     * @example
     * var res = source.shareReplay(3);
     * var res = source.shareReplay(3, 500);
     * var res = source.shareReplay(3, 500, scheduler);
     * 

     * @param bufferSize [Optional] Maximum element count of the replay buffer.
     * @param window [Optional] Maximum time length of the replay buffer.
     * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
     * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
     */
    observableProto.shareReplay = function (bufferSize, window, scheduler) {
        return this.replay(null, bufferSize, window, scheduler).refCount();
    };

    /** @private */
    var ConnectableObservable = Rx.ConnectableObservable = (function (_super) {
        inherits(ConnectableObservable, _super);

        /**
         * @constructor
         * @private
         */
        function ConnectableObservable(source, subject) {
            var state = {
                subject: subject,
                source: source.asObservable(),
                hasSubscription: false,
                subscription: null
            };

            this.connect = function () {
                if (!state.hasSubscription) {
                    state.hasSubscription = true;
                    state.subscription = new CompositeDisposable(state.source.subscribe(state.subject), disposableCreate(function () {
                        state.hasSubscription = false;
                    }));
                }
                return state.subscription;
            };

            function subscribe(observer) {
                return state.subject.subscribe(observer);
            }

            _super.call(this, subscribe);
        }

        /**
         * @private
         * @memberOf ConnectableObservable
         */
        ConnectableObservable.prototype.connect = function () { return this.connect(); };

        /**
         * @private
         * @memberOf ConnectableObservable
         */        
        ConnectableObservable.prototype.refCount = function () {
            var connectableSubscription = null, count = 0, source = this;
            return new AnonymousObservable(function (observer) {
                var shouldConnect, subscription;
                count++;
                shouldConnect = count === 1;
                subscription = source.subscribe(observer);
                if (shouldConnect) {
                    connectableSubscription = source.connect();
                }
                return disposableCreate(function () {
                    subscription.dispose();
                    count--;
                    if (count === 0) {
                        connectableSubscription.dispose();
                    }
                });
            });
        };

        return ConnectableObservable;
    }(Observable));

    function observableTimerTimeSpan(dueTime, scheduler) {
        var d = normalizeTime(dueTime);
        return new AnonymousObservable(function (observer) {
            return scheduler.scheduleWithRelative(d, function () {
                observer.onNext(0);
                observer.onCompleted();
            });
        });
    }

    function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
        if (dueTime === period) {
            return new AnonymousObservable(function (observer) {
                return scheduler.schedulePeriodicWithState(0, period, function (count) {
                    observer.onNext(count);
                    return count + 1;
                });
            });
        }
        return observableDefer(function () {
            return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler);
        });
    }

    /**
     *  Returns an observable sequence that produces a value after each period.
     *  
     * @example
     *  1 - res = Rx.Observable.interval(1000);
     *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
     *      
     * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
     * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
     * @returns {Observable} An observable sequence that produces a value after each period.
     */
    var observableinterval = Observable.interval = function (period, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return observableTimerTimeSpanAndPeriod(period, period, scheduler);
    };

    /**
     *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
     *  
     * @example
     *  var res = Rx.Observable.timer(5000);
     *  var res = Rx.Observable.timer(5000, 1000);
     *  var res = Rx.Observable.timer(5000, Rx.Scheduler.timeout);
     *  var res = Rx.Observable.timer(5000, 1000, Rx.Scheduler.timeout);
     *  
     * @param {Number} dueTime Relative time (specified as an integer denoting milliseconds) at which to produce the first value.
     * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
     * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
     */
    var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
        var period;
        scheduler || (scheduler = timeoutScheduler);
        if (typeof periodOrScheduler === 'number') {
            period = periodOrScheduler;
        } else if (typeof periodOrScheduler === 'object' && 'now' in periodOrScheduler) {
            scheduler = periodOrScheduler;
        }
        return period === undefined ?
            observableTimerTimeSpan(dueTime, scheduler) :
            observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
    };

    /**
     *  Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.
     *  
     * @example
     *  var res = Rx.Observable.delay(5000);
     *  var res = Rx.Observable.delay(5000, 1000, Rx.Scheduler.timeout);
     * @memberOf Observable#
     * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
     * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} Time-shifted sequence.
     */
    observableProto.delay = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;  
        return new AnonymousObservable(function (observer) {
            var active = false,
                cancelable = new SerialDisposable(),
                exception = null,
                q = [],
                running = false,
                subscription;
            subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
                var d, shouldRun;
                if (notification.value.kind === 'E') {
                    q = [];
                    q.push(notification);
                    exception = notification.value.exception;
                    shouldRun = !running;
                } else {
                    q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
                    shouldRun = !active;
                    active = true;
                }
                if (shouldRun) {
                    if (exception !== null) {
                        observer.onError(exception);
                    } else {
                        d = new SingleAssignmentDisposable();
                        cancelable.setDisposable(d);
                        d.setDisposable(scheduler.scheduleRecursiveWithRelative(dueTime, function (self) {
                            var e, recurseDueTime, result, shouldRecurse;
                            if (exception !== null) {
                                return;
                            }
                            running = true;
                            do {
                                result = null;
                                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
                                    result = q.shift().value;
                                }
                                if (result !== null) {
                                    result.accept(observer);
                                }
                            } while (result !== null);
                            shouldRecurse = false;
                            recurseDueTime = 0;
                            if (q.length > 0) {
                                shouldRecurse = true;
                                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
                            } else {
                                active = false;
                            }
                            e = exception;
                            running = false;
                            if (e !== null) {
                                observer.onError(e);
                            } else if (shouldRecurse) {
                                self(recurseDueTime);
                            }
                        }));
                    }
                }
            });
            return new CompositeDisposable(subscription, cancelable);
        });
    };

    /**
     *  Ignores values from an observable sequence which are followed by another value before dueTime.
     *  
     * @example
     *  1 - res = source.throttle(5000); // 5 seconds
     *  2 - res = source.throttle(5000, scheduler);        
     * 
     * @param {Number} dueTime Duration of the throttle period for each value (specified as an integer denoting milliseconds).
     * @param {Scheduler} [scheduler]  Scheduler to run the throttle timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} The throttled sequence.
     */
    observableProto.throttle = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return this.throttleWithSelector(function () { return observableTimer(dueTime, scheduler); })
    };

    /**
     *  Records the time interval between consecutive values in an observable sequence.
     *  
     * @example
     *  1 - res = source.timeInterval();
     *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
     *      
     * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence with time interval information on values.
     */
    observableProto.timeInterval = function (scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return observableDefer(function () {
            var last = scheduler.now();
            return source.select(function (x) {
                var now = scheduler.now(), span = now - last;
                last = now;
                return {
                    value: x,
                    interval: span
                };
            });
        });
    };

    /**
     *  Records the timestamp for each value in an observable sequence.
     *  
     * @example
     *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
     *  2 - res = source.timestamp(Rx.Scheduler.timeout);
     *      
     * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the timeout scheduler is used.
     * @returns {Observable} An observable sequence with timestamp information on values.
     */
    observableProto.timestamp = function (scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return this.select(function (x) {
            return {
                value: x,
                timestamp: scheduler.now()
            };
        });
    };

    function sampleObservable(source, sampler) {
        
        return new AnonymousObservable(function (observer) {
            var atEnd, value, hasValue;

            function sampleSubscribe() {
                if (hasValue) {
                    hasValue = false;
                    observer.onNext(value);
                }
                if (atEnd) {
                    observer.onCompleted();
                }
            }

            return new CompositeDisposable(
                source.subscribe(function (newValue) {
                    hasValue = true;
                    value = newValue;
                }, observer.onError.bind(observer), function () {
                    atEnd = true;
                }),
                sampler.subscribe(sampleSubscribe, observer.onError.bind(observer), sampleSubscribe)
            );
        });
    }

    /**
     *  Samples the observable sequence at each interval.
     *  
     * @example
     *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
     *  2 - res = source.sample(5000); // 5 seconds
     *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
     *      
     * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
     * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
     * @returns {Observable} Sampled observable sequence.
     */
    observableProto.sample = function (intervalOrSampler, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        if (typeof intervalOrSampler === 'number') {
            return sampleObservable(this, observableinterval(intervalOrSampler, scheduler));
        }
        return sampleObservable(this, intervalOrSampler);
    };

    /**
     *  Returns the source observable sequence or the other observable sequence if dueTime elapses.
     *  
     * @example
     *  1 - res = source.timeout(new Date()); // As a date
     *  2 - res = source.timeout(5000); // 5 seconds
     *  3 - res = source.timeout(new Date(), Rx.Observable.returnValue(42)); // As a date and timeout observable
     *  4 - res = source.timeout(5000, Rx.Observable.returnValue(42)); // 5 seconds and timeout observable
     *  5 - res = source.timeout(new Date(), Rx.Observable.returnValue(42), Rx.Scheduler.timeout); // As a date and timeout observable
     *  6 - res = source.timeout(5000, Rx.Observable.returnValue(42), Rx.Scheduler.timeout); // 5 seconds and timeout observable
     *      
     * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
     * @param {Observable} [other]  Sequence to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
     * @param {Scheduler} [scheduler]  Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.
     * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
     */
    observableProto.timeout = function (dueTime, other, scheduler) {
        var schedulerMethod, source = this;
        other || (other = observableThrow(new Error('Timeout')));
        scheduler || (scheduler = timeoutScheduler);
        if (dueTime instanceof Date) {
            schedulerMethod = function (dt, action) {
                scheduler.scheduleWithAbsolute(dt, action);
            };
        } else {
            schedulerMethod = function (dt, action) {
                scheduler.scheduleWithRelative(dt, action);
            };
        }
        return new AnonymousObservable(function (observer) {
            var createTimer,
                id = 0,
                original = new SingleAssignmentDisposable(),
                subscription = new SerialDisposable(),
                switched = false,
                timer = new SerialDisposable();
            subscription.setDisposable(original);
            createTimer = function () {
                var myId = id;
                timer.setDisposable(schedulerMethod(dueTime, function () {
                    switched = id === myId;
                    var timerWins = switched;
                    if (timerWins) {
                        subscription.setDisposable(other.subscribe(observer));
                    }
                }));
            };
            createTimer();
            original.setDisposable(source.subscribe(function (x) {
                var onNextWins = !switched;
                if (onNextWins) {
                    id++;
                    observer.onNext(x);
                    createTimer();
                }
            }, function (e) {
                var onErrorWins = !switched;
                if (onErrorWins) {
                    id++;
                    observer.onError(e);
                }
            }, function () {
                var onCompletedWins = !switched;
                if (onCompletedWins) {
                    id++;
                    observer.onCompleted();
                }
            }));
            return new CompositeDisposable(subscription, timer);
        });
    };

    /**
     *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
     * 
     * @example 
     *  res = source.generateWithRelativeTime(0, 
     *      function (x) { return return true; }, 
     *      function (x) { return x + 1; }, 
     *      function (x) { return x; }, 
     *      function (x) { return 500; }
     *  );
     *      
     * @param {Mixed} initialState Initial state.
     * @param {Function} condition Condition to terminate generation (upon returning false).
     * @param {Function} iterate Iteration step function.
     * @param {Function} resultSelector Selector function for results produced in the sequence.
     * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
     * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
     * @returns {Observable} The generated sequence.
     */
    Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var first = true,
                hasResult = false,
                result,
                state = initialState,
                time;
            return scheduler.scheduleRecursiveWithRelative(0, function (self) {
                if (hasResult) {
                    observer.onNext(result);
                }
                try {
                    if (first) {
                        first = false;
                    } else {
                        state = iterate(state);
                    }
                    hasResult = condition(state);
                    if (hasResult) {
                        result = resultSelector(state);
                        time = timeSelector(state);
                    }
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                if (hasResult) {
                    self(time);
                } else {
                    observer.onCompleted();
                }
            });
        });
    };

    /**
     *  Time shifts the observable sequence by delaying the subscription.
     *  
     * @example
     *  1 - res = source.delaySubscription(5000); // 5s
     *  2 - res = source.delaySubscription(5000, Rx.Scheduler.timeout); // 5 seconds
     *      
     * @param {Number} dueTime Absolute or relative time to perform the subscription at.
     * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
     * @returns {Observable} Time-shifted sequence.
     */
    observableProto.delaySubscription = function (dueTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        return this.delayWithSelector(observableTimer(dueTime, scheduler), function () { return observableEmpty(); });
    };

    /**
     *  Time shifts the observable sequence based on a subscription delay and a delay selector function for each element.
     *  
     * @example
     *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(5000); }); // with selector only
     *  1 - res = source.delayWithSelector(Rx.Observable.timer(2000), function (x) { return Rx.Observable.timer(x); }); // with delay and selector
     *
     * @param {Observable} [subscriptionDelay]  Sequence indicating the delay for the subscription to the source. 
     * @param {Function} delayDurationSelector Selector function to retrieve a sequence indicating the delay for each given element.
     * @returns {Observable} Time-shifted sequence.
     */
    observableProto.delayWithSelector = function (subscriptionDelay, delayDurationSelector) {
        var source = this, subDelay, selector;
        if (typeof subscriptionDelay === 'function') {
            selector = subscriptionDelay;
        } else {
            subDelay = subscriptionDelay;
            selector = delayDurationSelector;
        }
        return new AnonymousObservable(function (observer) {
            var delays = new CompositeDisposable(), atEnd = false, done = function () {
                if (atEnd && delays.length === 0) {
                    observer.onCompleted();
                }
            }, subscription = new SerialDisposable(), start = function () {
                subscription.setDisposable(source.subscribe(function (x) {
                    var delay;
                    try {
                        delay = selector(x);
                    } catch (error) {
                        observer.onError(error);
                        return;
                    }
                    var d = new SingleAssignmentDisposable();
                    delays.add(d);
                    d.setDisposable(delay.subscribe(function () {
                        observer.onNext(x);
                        delays.remove(d);
                        done();
                    }, observer.onError.bind(observer), function () {
                        observer.onNext(x);
                        delays.remove(d);
                        done();
                    }));
                }, observer.onError.bind(observer), function () {
                    atEnd = true;
                    subscription.dispose();
                    done();
                }));
            };

            if (!subDelay) {
                start();
            } else {
                subscription.setDisposable(subDelay.subscribe(function () {
                    start();
                }, observer.onError.bind(observer), function () { start(); }));
            }

            return new CompositeDisposable(subscription, delays);
        });
    };

    /**
     *  Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.
     *  
     * @example
     *  1 - res = source.timeoutWithSelector(Rx.Observable.timer(500)); 
     *  2 - res = source.timeoutWithSelector(Rx.Observable.timer(500), function (x) { return Rx.Observable.timer(200); });
     *  3 - res = source.timeoutWithSelector(Rx.Observable.timer(500), function (x) { return Rx.Observable.timer(200); }, Rx.Observable.returnValue(42));
     *      
     * @param {Observable} [firstTimeout]  Observable sequence that represents the timeout for the first element. If not provided, this defaults to Observable.never().
     * @param {Function} [timeoutDurationSelector] Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
     * @param {Observable} [other]  Sequence to return in case of a timeout. If not provided, this is set to Observable.throwException(). 
     * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
     */
    observableProto.timeoutWithSelector = function (firstTimeout, timeoutdurationSelector, other) {
        if (arguments.length === 1) {
            timeoutdurationSelector = firstTimeout;
            var firstTimeout = observableNever();
        }
        other || (other = observableThrow(new Error('Timeout')));
        var source = this;
        return new AnonymousObservable(function (observer) {
            var subscription = new SerialDisposable(), timer = new SerialDisposable(), original = new SingleAssignmentDisposable();

            subscription.setDisposable(original);

            var id = 0, switched = false, setTimer = function (timeout) {
                var myId = id, timerWins = function () {
                    return id === myId;
                };
                var d = new SingleAssignmentDisposable();
                timer.setDisposable(d);
                d.setDisposable(timeout.subscribe(function () {
                    if (timerWins()) {
                        subscription.setDisposable(other.subscribe(observer));
                    }
                    d.dispose();
                }, function (e) {
                    if (timerWins()) {
                        observer.onError(e);
                    }
                }, function () {
                    if (timerWins()) {
                        subscription.setDisposable(other.subscribe(observer));
                    }
                }));
            };

            setTimer(firstTimeout);
            var observerWins = function () {
                var res = !switched;
                if (res) {
                    id++;
                }
                return res;
            };

            original.setDisposable(source.subscribe(function (x) {
                if (observerWins()) {
                    observer.onNext(x);
                    var timeout;
                    try {
                        timeout = timeoutdurationSelector(x);
                    } catch (e) {
                        observer.onError(e);
                        return;
                    }
                    setTimer(timeout);
                }
            }, function (e) {
                if (observerWins()) {
                    observer.onError(e);
                }
            }, function () {
                if (observerWins()) {
                    observer.onCompleted();
                }
            }));
            return new CompositeDisposable(subscription, timer);
        });
    };

    /**
     *  Ignores values from an observable sequence which are followed by another value within a computed throttle duration.
     *  
     * @example
     *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(x + x); }); 
     * 
     * @param {Function} throttleDurationSelector Selector function to retrieve a sequence indicating the throttle duration for each given element.
     * @returns {Observable} The throttled sequence.
     */
    observableProto.throttleWithSelector = function (throttleDurationSelector) {
        var source = this;
        return new AnonymousObservable(function (observer) {
            var value, hasValue = false, cancelable = new SerialDisposable(), id = 0, subscription = source.subscribe(function (x) {
                var throttle;
                try {
                    throttle = throttleDurationSelector(x);
                } catch (e) {
                    observer.onError(e);
                    return;
                }
                hasValue = true;
                value = x;
                id++;
                var currentid = id, d = new SingleAssignmentDisposable();
                cancelable.setDisposable(d);
                d.setDisposable(throttle.subscribe(function () {
                    if (hasValue && id === currentid) {
                        observer.onNext(value);
                    }
                    hasValue = false;
                    d.dispose();
                }, observer.onError.bind(observer), function () {
                    if (hasValue && id === currentid) {
                        observer.onNext(value);
                    }
                    hasValue = false;
                    d.dispose();
                }));
            }, function (e) {
                cancelable.dispose();
                observer.onError(e);
                hasValue = false;
                id++;
            }, function () {
                cancelable.dispose();
                if (hasValue) {
                    observer.onNext(value);
                }
                observer.onCompleted();
                hasValue = false;
                id++;
            });
            return new CompositeDisposable(subscription, cancelable);
        });
    };

    /**
     *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
     *  
     *  1 - res = source.skipLastWithTime(5000);     
     *  2 - res = source.skipLastWithTime(5000, scheduler); 
     *      
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.          
     * @param {Number} duration Duration for skipping elements from the end of the sequence.
     * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
     * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
     */
    observableProto.skipLastWithTime = function (duration, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            var q = [];
            return source.subscribe(function (x) {
                var now = scheduler.now();
                q.push({ interval: now, value: x });
                while (q.length > 0 && now - q[0].interval >= duration) {
                    observer.onNext(q.shift().value);
                }
            }, observer.onError.bind(observer), function () {
                var now = scheduler.now();
                while (q.length > 0 && now - q[0].interval >= duration) {
                    observer.onNext(q.shift().value);
                }
                observer.onCompleted();
            });
        });
    };

    /**
     *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
     *  
     * @example
     *  1 - res = source.takeLastWithTime(5000, [optional timer scheduler], [optional loop scheduler]); 
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.    
     * @param {Number} duration Duration for taking elements from the end of the sequence.
     * @param {Scheduler} [timerScheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @param {Scheduler} [loopScheduler]  Scheduler to drain the collected elements. If not specified, defaults to Rx.Scheduler.immediate.
     * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
     */
    observableProto.takeLastWithTime = function (duration, timerScheduler, loopScheduler) {
        return this.takeLastBufferWithTime(duration, timerScheduler).selectMany(function (xs) { return observableFromArray(xs, loopScheduler); });
    };

    /**
     *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.takeLastBufferWithTime(5000, [optional scheduler]); 
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.   
     * @param {Number} duration Duration for taking elements from the end of the sequence.
     * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
     */
    observableProto.takeLastBufferWithTime = function (duration, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var q = [];

            return source.subscribe(function (x) {
                var now = scheduler.now();
                q.push({ interval: now, value: x });
                while (q.length > 0 && now - q[0].interval >= duration) {
                    q.shift();
                }
            }, observer.onError.bind(observer), function () {
                var now = scheduler.now(), res = [];
                while (q.length > 0) {
                    var next = q.shift();
                    if (now - next.interval <= duration) {
                        res.push(next.value);
                    }
                }

                observer.onNext(res);
                observer.onCompleted();
            });
        });
    };

    /**
     *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.takeWithTime(5000,  [optional scheduler]); 
     * @description
     *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
     *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
     *  result sequence. This causes elements to be delayed with duration.    
     * @param {Number} duration Duration for taking elements from the start of the sequence.
     * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
     */
    observableProto.takeWithTime = function (duration, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var t = scheduler.scheduleWithRelative(duration, function () {
                observer.onCompleted();
            });

            return new CompositeDisposable(t, source.subscribe(observer));
        });
    };

    /**
     *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.skipWithTime(5000, [optional scheduler]); 
     *  
     * @description     
     *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
     *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
     *  may not execute immediately, despite the zero due time.
     *  
     *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.      
     * @param {Number} duration Duration for skipping elements from the start of the sequence.
     * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
     */
    observableProto.skipWithTime = function (duration, scheduler) {
        var source = this;
        scheduler || (scheduler = timeoutScheduler);
        return new AnonymousObservable(function (observer) {
            var open = false,
                t = scheduler.scheduleWithRelative(duration, function () { open = true; }),
                d = source.subscribe(function (x) {
                    if (open) {
                        observer.onNext(x);
                    }
                }, observer.onError.bind(observer), observer.onCompleted.bind(observer));

            return new CompositeDisposable(t, d);
        });
    };

    /**
     *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
     *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time>.
     *  
     * @examples
     *  1 - res = source.skipUntilWithTime(new Date(), [optional scheduler]);         
     * @param startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
     * @param scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
     * @returns {Observable} An observable sequence with the elements skipped until the specified start time. 
     */
    observableProto.skipUntilWithTime = function (startTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            var open = false,
                t = scheduler.scheduleWithAbsolute(startTime, function () { open = true; }),
                d = source.subscribe(function (x) {
                    if (open) {
                        observer.onNext(x);
                    }
                }, observer.onError.bind(observer), observer.onCompleted.bind(observer));

            return new CompositeDisposable(t, d);
        });
    };

    /**
     *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
     *  
     * @example
     *  1 - res = source.takeUntilWithTime(new Date(), [optional scheduler]);   
     * @param {Number} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
     * @param {Scheduler} scheduler Scheduler to run the timer on.
     * @returns {Observable} An observable sequence with the elements taken until the specified end time.
     */
    observableProto.takeUntilWithTime = function (endTime, scheduler) {
        scheduler || (scheduler = timeoutScheduler);
        var source = this;
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(scheduler.scheduleWithAbsolute(endTime, function () {
                observer.onCompleted();
            }),  source.subscribe(observer));
        });
    };

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausable(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */
  observableProto.pausable = function (pauser) {
    var self = this;
    return new AnonymousObservable(function (observer) {
      var conn = self.publish(),
        subscription = conn.subscribe(observer),
        connection = disposableEmpty;

      var pausable = pauser.distinctUntilChanged().subscribe(function (b) {
        if (b) {
          connection = conn.connect();
        } else {
          connection.dispose();
          connection = disposableEmpty;
        }
      });

      return new CompositeDisposable(subscription, connection, pausable);
    });
  };
  function combineLatestSource(source, subject, resultSelector) {
    return new AnonymousObservable(function (observer) {
      var n = 2,
        hasValue = [false, false],
        hasValueAll = false,
        isDone = false,
        values = new Array(n);

      function next(x, i) {
        values[i] = x
        var res;
        hasValue[i] = true;
        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
            try {
                res = resultSelector.apply(null, values);
            } catch (ex) {
                observer.onError(ex);
                return;
            }
            observer.onNext(res);
        } else if (isDone) {
            observer.onCompleted();
        }
      }

      return new CompositeDisposable(
        source.subscribe(
          function (x) {
            next(x, 0);
          },
          observer.onError.bind(observer),
          function () {
            isDone = true;
            observer.onCompleted();
          }),
        subject.subscribe(
          function (x) {
            next(x, 1);
          },
          observer.onError.bind(observer))
        );
    });
  }

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
   * and yields the values that were buffered while paused.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */  
  observableProto.pausableBuffered = function (subject) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var q = [], previous = true;
      
      var subscription =  
        combineLatestSource(
          source,
          subject.distinctUntilChanged(), 
          function (data, shouldFire) {
            return { data: data, shouldFire: shouldFire };      
          })
          .subscribe(
            function (results) {
              if (results.shouldFire && previous) {
                observer.onNext(results.data);
              }
              if (results.shouldFire && !previous) {
                while (q.length > 0) {
                  observer.onNext(q.shift());
                }
                previous = true;
              } else if (!results.shouldFire && !previous) {
                q.push(results.data);
              } else if (!results.shouldFire && previous) {
                previous = false;
              }

            }, 
            observer.onError.bind(observer),
            observer.onCompleted.bind(observer)
          );

      subject.onNext(false);

      return subscription;
    });
  };

  /**
   * Attaches a controller to the observable sequence with the ability to queue.
   * @example
   * var source = Rx.Observable.interval(100).controlled();
   * source.request(3); // Reads 3 values
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */ 
  observableProto.controlled = function (enableQueue) {
    if (enableQueue == null) {  enableQueue = true; }
    return new ControlledObservable(this, enableQueue);
  };
  var ControlledObservable = (function (_super) {

    inherits(ControlledObservable, _super);

    function subscribe (observer) {
      return this.source.subscribe(observer);
    }

    function ControlledObservable (source, enableQueue) {
      _super.call(this, subscribe);
      this.subject = new ControlledSubject(enableQueue);
      this.source = source.multicast(this.subject).refCount();
    }

    ControlledObservable.prototype.request = function (numberOfItems) {
      if (numberOfItems == null) { numberOfItems = -1; }
      return this.subject.request(numberOfItems);
    };

    return ControlledObservable;

  }(Observable));

    var ControlledSubject = Rx.ControlledSubject = (function (_super) {

        function subscribe (observer) {
            return this.subject.subscribe(observer);
        }

        inherits(ControlledSubject, _super);

        function ControlledSubject(enableQueue) {
            if (enableQueue == null) {
                enableQueue = true;
            }

            _super.call(this, subscribe);
            this.subject = new Subject();
            this.enableQueue = enableQueue;
            this.queue = enableQueue ? [] : null;
            this.requestedCount = 0;
            this.requestedDisposable = disposableEmpty;
            this.error = null;
            this.hasFailed = false;
            this.hasCompleted = false;
            this.controlledDisposable = disposableEmpty;
        }

        addProperties(ControlledSubject.prototype, Observer, {
            onCompleted: function () {
                checkDisposed.call(this);
                this.hasCompleted = true;

                if (!this.enableQueue || this.queue.length === 0) {
                    this.subject.onCompleted();
                }
            },
            onError: function (error) {
                checkDisposed.call(this);
                this.hasFailed = true;
                this.error = error;

                if (!this.enableQueue || this.queue.length === 0) {
                    this.subject.onError(error);
                }   
            },
            onNext: function (value) {
                checkDisposed.call(this);
                var hasRequested = false;

                if (this.requestedCount === 0) {
                    if (this.enableQueue) {
                        this.queue.push(value);
                    }
                } else {
                    if (this.requestedCount !== -1) {
                        if (this.requestedCount-- === 0) {
                            this.disposeCurrentRequest();
                        }
                    }
                    hasRequested = true;
                }

                if (hasRequested) {
                    this.subject.onNext(value);
                }
            },
            _processRequest: function (numberOfItems) {
                if (this.enableQueue) {
                    //console.log('queue length', this.queue.length);

                    while (this.queue.length >= numberOfItems && numberOfItems > 0) {
                        //console.log('number of items', numberOfItems);
                        this.subject.onNext(this.queue.shift());
                        numberOfItems--;
                    }

                    if (this.queue.length !== 0) {
                        return { numberOfItems: numberOfItems, returnValue: true };
                    } else {
                        return { numberOfItems: numberOfItems, returnValue: false };
                    }
                }

                if (this.hasFailed) {
                    this.subject.onError(this.error);
                    this.controlledDisposable.dispose();
                    this.controlledDisposable = disposableEmpty;
                } else if (this.hasCompleted) {
                    this.subject.onCompleted();
                    this.controlledDisposable.dispose();
                    this.controlledDisposable = disposableEmpty;                   
                }

                return { numberOfItems: numberOfItems, returnValue: false };
            },
            request: function (number) {
                checkDisposed.call(this);
                this.disposeCurrentRequest();
                var self = this,
                    r = this._processRequest(number);

                number = r.numberOfItems;
                if (!r.returnValue) {
                    this.requestedCount = number;
                    this.requestedDisposable = disposableCreate(function () {
                        self.requestedCount = 0;
                    });

                    return this.requestedDisposable
                } else {
                    return disposableEmpty;
                }
            },
            disposeCurrentRequest: function () {
                this.requestedDisposable.dispose();
                this.requestedDisposable = disposableEmpty;
            },

            dispose: function () {
                this.isDisposed = true;
                this.error = null;
                this.subject.dispose();
                this.requestedDisposable.dispose();
            }
        });

        return ControlledSubject;
    }(Observable));
    var AnonymousObservable = Rx.AnonymousObservable = (function (_super) {
        inherits(AnonymousObservable, _super);

        // Fix subscriber to check for undefined or function returned to decorate as Disposable
        function fixSubscriber(subscriber) {
            if (typeof subscriber === 'undefined') {
                subscriber = disposableEmpty;
            } else if (typeof subscriber === 'function') {
                subscriber = disposableCreate(subscriber);
            }

            return subscriber;
        }

        function AnonymousObservable(subscribe) {
            if (!(this instanceof AnonymousObservable)) {
                return new AnonymousObservable(subscribe);
            }

            function s(observer) {
                var autoDetachObserver = new AutoDetachObserver(observer);
                if (currentThreadScheduler.scheduleRequired()) {
                    currentThreadScheduler.schedule(function () {
                        try {
                            autoDetachObserver.setDisposable(fixSubscriber(subscribe(autoDetachObserver)));
                        } catch (e) {
                            if (!autoDetachObserver.fail(e)) {
                                throw e;
                            } 
                        }
                    });
                } else {
                    try {
                        autoDetachObserver.setDisposable(fixSubscriber(subscribe(autoDetachObserver)));
                    } catch (e) {
                        if (!autoDetachObserver.fail(e)) {
                            throw e;
                        }
                    }
                }

                return autoDetachObserver;
            }

            _super.call(this, s);
        }

        return AnonymousObservable;

    }(Observable));

    /** @private */
    var AutoDetachObserver = (function (_super) {
        inherits(AutoDetachObserver, _super);

        function AutoDetachObserver(observer) {
            _super.call(this);
            this.observer = observer;
            this.m = new SingleAssignmentDisposable();
        }

        var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

        AutoDetachObserverPrototype.next = function (value) {
            var noError = false;
            try {
                this.observer.onNext(value);
                noError = true;
            } catch (e) { 
                throw e;                
            } finally {
                if (!noError) {
                    this.dispose();
                }
            }
        };

        AutoDetachObserverPrototype.error = function (exn) {
            try {
                this.observer.onError(exn);
            } catch (e) { 
                throw e;                
            } finally {
                this.dispose();
            }
        };

        AutoDetachObserverPrototype.completed = function () {
            try {
                this.observer.onCompleted();
            } catch (e) { 
                throw e;                
            } finally {
                this.dispose();
            }
        };

        AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
        AutoDetachObserverPrototype.getDisposable = function (value) { return this.m.getDisposable(); };
        /* @private */
        AutoDetachObserverPrototype.disposable = function (value) {
            return arguments.length ? this.getDisposable() : setDisposable(value);
        };

        AutoDetachObserverPrototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.m.dispose();
        };

        return AutoDetachObserver;
    }(AbstractObserver));

    /** @private */
    var InnerSubscription = function (subject, observer) {
        this.subject = subject;
        this.observer = observer;
    };

    /**
     * @private
     * @memberOf InnerSubscription
     */
    InnerSubscription.prototype.dispose = function () {
        if (!this.subject.isDisposed && this.observer !== null) {
            var idx = this.subject.observers.indexOf(this.observer);
            this.subject.observers.splice(idx, 1);
            this.observer = null;
        }
    };

    /**
     *  Represents an object that is both an observable sequence as well as an observer.
     *  Each notification is broadcasted to all subscribed observers.
     */
    var Subject = Rx.Subject = (function (_super) {
        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                return new InnerSubscription(this, observer);
            }
            if (this.exception) {
                observer.onError(this.exception);
                return disposableEmpty;
            }
            observer.onCompleted();
            return disposableEmpty;
        }

        inherits(Subject, _super);

        /**
         * Creates a subject.
         * @constructor
         */      
        function Subject() {
            _super.call(this, subscribe);
            this.isDisposed = false,
            this.isStopped = false,
            this.observers = [];
        }

        addProperties(Subject.prototype, Observer, {
            /**
             * Indicates whether the subject has observers subscribed to it.
             * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
             */         
            hasObservers: function () {
                return this.observers.length > 0;
            },
            /**
             * Notifies all subscribed observers about the end of the sequence.
             */                          
            onCompleted: function () {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onCompleted();
                    }

                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the exception.
             * @param {Mixed} error The exception to send to all observers.
             */               
            onError: function (exception) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = exception;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(exception);
                    }

                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the arrival of the specified element in the sequence.
             * @param {Mixed} value The value to send to all observers.
             */                 
            onNext: function (value) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            /**
             * Unsubscribe all observers and release resources.
             */                
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
            }
        });

        /**
         * Creates a subject from the specified observer and observable.
         * @param {Observer} observer The observer used to send messages to the subject.
         * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
         * @returns {Subject} Subject implemented using the given observer and observable.
         */
        Subject.create = function (observer, observable) {
            return new AnonymousSubject(observer, observable);
        };

        return Subject;
    }(Observable));

    /**
     *  Represents the result of an asynchronous operation.
     *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
     */   
    var AsyncSubject = Rx.AsyncSubject = (function (_super) {

        function subscribe(observer) {
            checkDisposed.call(this);
            
            if (!this.isStopped) {
                this.observers.push(observer);
                return new InnerSubscription(this, observer);
            }

            var ex = this.exception,
                hv = this.hasValue,
                v = this.value;

            if (ex) {
                observer.onError(ex);
            } else if (hv) {
                observer.onNext(v);
                observer.onCompleted();
            } else {
                observer.onCompleted();
            }

            return disposableEmpty;
        }

        inherits(AsyncSubject, _super);

        /**
         * Creates a subject that can only receive one value and that value is cached for all future observations.
         * @constructor
         */ 
        function AsyncSubject() {
            _super.call(this, subscribe);

            this.isDisposed = false;
            this.isStopped = false;
            this.value = null;
            this.hasValue = false;
            this.observers = [];
            this.exception = null;
        }

        addProperties(AsyncSubject.prototype, Observer, {
            /**
             * Indicates whether the subject has observers subscribed to it.
             * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
             */         
            hasObservers: function () {
                checkDisposed.call(this);
                return this.observers.length > 0;
            },
            /**
             * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
             */ 
            onCompleted: function () {
                var o, i, len;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    var os = this.observers.slice(0),
                        v = this.value,
                        hv = this.hasValue;

                    if (hv) {
                        for (i = 0, len = os.length; i < len; i++) {
                            o = os[i];
                            o.onNext(v);
                            o.onCompleted();
                        }
                    } else {
                        for (i = 0, len = os.length; i < len; i++) {
                            os[i].onCompleted();
                        }
                    }

                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the exception.
             * @param {Mixed} error The exception to send to all observers.
             */ 
            onError: function (exception) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = exception;

                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(exception);
                    }

                    this.observers = [];
                }
            },
            /**
             * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
             * @param {Mixed} value The value to store in the subject.
             */             
            onNext: function (value) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.value = value;
                    this.hasValue = true;
                }
            },
            /**
             * Unsubscribe all observers and release resources.
             */
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
                this.exception = null;
                this.value = null;
            }
        });

        return AsyncSubject;
    }(Observable));

    /** @private */
    var AnonymousSubject = (function (_super) {
        inherits(AnonymousSubject, _super);

        function subscribe(observer) {
            return this.observable.subscribe(observer);
        }

        /**
         * @private
         * @constructor
         */
        function AnonymousSubject(observer, observable) {
            _super.call(this, subscribe);
            this.observer = observer;
            this.observable = observable;
        }

        addProperties(AnonymousSubject.prototype, Observer, {
            /**
             * @private
             * @memberOf AnonymousSubject#
            */
            onCompleted: function () {
                this.observer.onCompleted();
            },
            /**
             * @private
             * @memberOf AnonymousSubject#
            */            
            onError: function (exception) {
                this.observer.onError(exception);
            },
            /**
             * @private
             * @memberOf AnonymousSubject#
            */            
            onNext: function (value) {
                this.observer.onNext(value);
            }
        });

        return AnonymousSubject;
    }(Observable));

    /**
     *  Represents a value that changes over time.
     *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
     */
    var BehaviorSubject = Rx.BehaviorSubject = (function (_super) {
        function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
                this.observers.push(observer);
                observer.onNext(this.value);
                return new InnerSubscription(this, observer);
            }
            var ex = this.exception;
            if (ex) {
                observer.onError(ex);
            } else {
                observer.onCompleted();
            }
            return disposableEmpty;
        }

        inherits(BehaviorSubject, _super);

        /**
         * @constructor
         *  Initializes a new instance of the BehaviorSubject class which creates a subject that caches its last value and starts with the specified value.
         *  @param {Mixed} value Initial value sent to observers when no other value has been received by the subject yet.
         */       
        function BehaviorSubject(value) {
            _super.call(this, subscribe);

            this.value = value,
            this.observers = [],
            this.isDisposed = false,
            this.isStopped = false,
            this.exception = null;
        }

        addProperties(BehaviorSubject.prototype, Observer, {
            /**
             * Indicates whether the subject has observers subscribed to it.
             * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
             */         
            hasObservers: function () {
                return this.observers.length > 0;
            },
            /**
             * Notifies all subscribed observers about the end of the sequence.
             */ 
            onCompleted: function () {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onCompleted();
                    }

                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the exception.
             * @param {Mixed} error The exception to send to all observers.
             */             
            onError: function (error) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var os = this.observers.slice(0);
                    this.isStopped = true;
                    this.exception = error;

                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onError(error);
                    }

                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the arrival of the specified element in the sequence.
             * @param {Mixed} value The value to send to all observers.
             */              
            onNext: function (value) {
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.value = value;
                    var os = this.observers.slice(0);
                    for (var i = 0, len = os.length; i < len; i++) {
                        os[i].onNext(value);
                    }
                }
            },
            /**
             * Unsubscribe all observers and release resources.
             */            
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
                this.value = null;
                this.exception = null;
            }
        });

        return BehaviorSubject;
    }(Observable));

    /**
     * Represents an object that is both an observable sequence as well as an observer.
     * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
     */  
    var ReplaySubject = Rx.ReplaySubject = (function (_super) {

        function RemovableDisposable (subject, observer) {
            this.subject = subject;
            this.observer = observer;
        };

        RemovableDisposable.prototype.dispose = function () {
            this.observer.dispose();
            if (!this.subject.isDisposed) {
                var idx = this.subject.observers.indexOf(this.observer);
                this.subject.observers.splice(idx, 1);
            }
        };

        function subscribe(observer) {
            var so = new ScheduledObserver(this.scheduler, observer),
                subscription = new RemovableDisposable(this, so);
            checkDisposed.call(this);
            this._trim(this.scheduler.now());
            this.observers.push(so);

            var n = this.q.length;

            for (var i = 0, len = this.q.length; i < len; i++) {
                so.onNext(this.q[i].value);
            }

            if (this.hasError) {
                n++;
                so.onError(this.error);
            } else if (this.isStopped) {
                n++;
                so.onCompleted();
            }

            so.ensureActive(n);
            return subscription;
        }

        inherits(ReplaySubject, _super);

        /**
         *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
         *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
         *  @param {Number} [windowSize] Maximum time length of the replay buffer.
         *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
         */
        function ReplaySubject(bufferSize, windowSize, scheduler) {
            this.bufferSize = bufferSize == null ? Number.MAX_VALUE : bufferSize;
            this.windowSize = windowSize == null ? Number.MAX_VALUE : windowSize;
            this.scheduler = scheduler || currentThreadScheduler;
            this.q = [];
            this.observers = [];
            this.isStopped = false;
            this.isDisposed = false;
            this.hasError = false;
            this.error = null;
            _super.call(this, subscribe);
        }

        addProperties(ReplaySubject.prototype, Observer, {
            /**
             * Indicates whether the subject has observers subscribed to it.
             * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
             */         
            hasObservers: function () {
                return this.observers.length > 0;
            },            
            /* @private  */
            _trim: function (now) {
                while (this.q.length > this.bufferSize) {
                    this.q.shift();
                }
                while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
                    this.q.shift();
                }
            },
            /**
             * Notifies all subscribed observers about the arrival of the specified element in the sequence.
             * @param {Mixed} value The value to send to all observers.
             */              
            onNext: function (value) {
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    var now = this.scheduler.now();
                    this.q.push({ interval: now, value: value });
                    this._trim(now);

                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onNext(value);
                        observer.ensureActive();
                    }
                }
            },
            /**
             * Notifies all subscribed observers about the exception.
             * @param {Mixed} error The exception to send to all observers.
             */                 
            onError: function (error) {
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    this.error = error;
                    this.hasError = true;
                    var now = this.scheduler.now();
                    this._trim(now);
                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onError(error);
                        observer.ensureActive();
                    }
                    this.observers = [];
                }
            },
            /**
             * Notifies all subscribed observers about the end of the sequence.
             */             
            onCompleted: function () {
                var observer;
                checkDisposed.call(this);
                if (!this.isStopped) {
                    this.isStopped = true;
                    var now = this.scheduler.now();
                    this._trim(now);
                    var o = this.observers.slice(0);
                    for (var i = 0, len = o.length; i < len; i++) {
                        observer = o[i];
                        observer.onCompleted();
                        observer.ensureActive();
                    }
                    this.observers = [];
                }
            },
            /**
             * Unsubscribe all observers and release resources.
             */               
            dispose: function () {
                this.isDisposed = true;
                this.observers = null;
            }
        });

        return ReplaySubject;
    }(Observable));

    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        root.Rx = Rx;

        define(function() {
            return Rx;
        });
    } else if (freeExports && freeModule) {
        // in Node.js or RingoJS
        if (moduleExports) {
            (freeModule.exports = Rx).Rx = Rx;
        } else {
          freeExports.Rx = Rx;
        }
    } else {
        // in a browser or Rhino
        root.Rx = Rx;
    }
}.call(this));
})(require("__browserify_process"),window)
},{"__browserify_process":34}],30:[function(require,module,exports){
/* Commands */

/*--
Interface Command {
  public void   constructor(JSXGraph board, Object Arguments)
  public void   remove()
  public object execute()
}
--*/

var zoomIn = function(board, args) {
  this.remove = function() {
    board.zoomOut();
  };
  this.execute = function() {
    board.zoomIn();
    return {
      'X': board.zoomX,
      'Y': board.zoomY
    };
  }
};

//-----------------------------------------------------------------------

var zoomOut = function(board, args) {
  this.remove = function() {
    board.zoomIn();
  };
  this.execute = function() {
    board.zoomOut();
    return {
      'X': board.zoomX,
      'Y': board.zoomY
    };
  };
};


module.exports = {
  zoomIn: zoomIn,
  zoomOut: zoomOut
};
},{}],32:[function(require,module,exports){
/* Commands */

/*--
Interface Command {
  public void   constructor(JSXGraph board, object Arguments)
  public void   remove()
  public object execute()
}
--*/

var delete_ = function(board, args) {
  var args = args || {
    figure: $('input[name="figure"]:last').val()
  };
  this.remove = function() {
    this.figure.visible(true);
    this.figure.isVisible = true;
    for (i in this.figure.ancestors) {
      if (this.figure.ancestors.hasOwnProperty(i)) {
        this.figure.ancestors[i].visible(true);
        this.figure.ancestors[i].isVisible = true;
      }
    }
  };
  this.execute = function() {
    for(var i = 0; i <  board.shapes.length; i++) {
      if (board.shapes[i].name == args.figure) {
        board.shapes[i].visible(false);
        this.figure           = board.shapes[i];
        this.figure.isVisible = false;
        for (i in this.figure.ancestors) {
          this.figure.ancestors[i].visible(false);          
          this.figure.ancestors[i].isVisible = false;
        }
      }
    }
    // try with a single point
    if (typeof this.figure === 'undefined') {
      for(p in board.points) {
        if (board.points.hasOwnProperty(p)) {
          if (board.points[p].name + '0' == args.figure) {
            this.figure           = board.points[p];
            this.figure.isVisible = false;
            this.figure.visible(false);
          }
        }
      }
    }
    if (typeof this.figure === 'undefined') {
      throw ReferenceError("Could not find figure '" + args.figure + "'");
    }
    return args;
  };
};

module.exports = {
  delete_: delete_
};
},{}],33:[function(require,module,exports){
/* mousetrap v1.4.6 craig.is/killing/mice */
(function(J,r,f){function s(a,b,d){a.addEventListener?a.addEventListener(b,d,!1):a.attachEvent("on"+b,d)}function A(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);a.shiftKey||(b=b.toLowerCase());return b}return h[a.which]?h[a.which]:B[a.which]?B[a.which]:String.fromCharCode(a.which).toLowerCase()}function t(a){a=a||{};var b=!1,d;for(d in n)a[d]?b=!0:n[d]=0;b||(u=!1)}function C(a,b,d,c,e,v){var g,k,f=[],h=d.type;if(!l[a])return[];"keyup"==h&&w(a)&&(b=[a]);for(g=0;g<l[a].length;++g)if(k=
l[a][g],!(!c&&k.seq&&n[k.seq]!=k.level||h!=k.action||("keypress"!=h||d.metaKey||d.ctrlKey)&&b.sort().join(",")!==k.modifiers.sort().join(","))){var m=c&&k.seq==c&&k.level==v;(!c&&k.combo==e||m)&&l[a].splice(g,1);f.push(k)}return f}function K(a){var b=[];a.shiftKey&&b.push("shift");a.altKey&&b.push("alt");a.ctrlKey&&b.push("ctrl");a.metaKey&&b.push("meta");return b}function x(a,b,d,c){m.stopCallback(b,b.target||b.srcElement,d,c)||!1!==a(b,d)||(b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation?
b.stopPropagation():b.cancelBubble=!0)}function y(a){"number"!==typeof a.which&&(a.which=a.keyCode);var b=A(a);b&&("keyup"==a.type&&z===b?z=!1:m.handleKey(b,K(a),a))}function w(a){return"shift"==a||"ctrl"==a||"alt"==a||"meta"==a}function L(a,b,d,c){function e(b){return function(){u=b;++n[a];clearTimeout(D);D=setTimeout(t,1E3)}}function v(b){x(d,b,a);"keyup"!==c&&(z=A(b));setTimeout(t,10)}for(var g=n[a]=0;g<b.length;++g){var f=g+1===b.length?v:e(c||E(b[g+1]).action);F(b[g],f,c,a,g)}}function E(a,b){var d,
c,e,f=[];d="+"===a?["+"]:a.split("+");for(e=0;e<d.length;++e)c=d[e],G[c]&&(c=G[c]),b&&"keypress"!=b&&H[c]&&(c=H[c],f.push("shift")),w(c)&&f.push(c);d=c;e=b;if(!e){if(!p){p={};for(var g in h)95<g&&112>g||h.hasOwnProperty(g)&&(p[h[g]]=g)}e=p[d]?"keydown":"keypress"}"keypress"==e&&f.length&&(e="keydown");return{key:c,modifiers:f,action:e}}function F(a,b,d,c,e){q[a+":"+d]=b;a=a.replace(/\s+/g," ");var f=a.split(" ");1<f.length?L(a,f,b,d):(d=E(a,d),l[d.key]=l[d.key]||[],C(d.key,d.modifiers,{type:d.action},
c,a,e),l[d.key][c?"unshift":"push"]({callback:b,modifiers:d.modifiers,action:d.action,seq:c,level:e,combo:a}))}var h={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},B={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},H={"~":"`","!":"1",
"@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},G={option:"alt",command:"meta","return":"enter",escape:"esc",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p,l={},q={},n={},D,z=!1,I=!1,u=!1;for(f=1;20>f;++f)h[111+f]="f"+f;for(f=0;9>=f;++f)h[f+96]=f;s(r,"keypress",y);s(r,"keydown",y);s(r,"keyup",y);var m={bind:function(a,b,d){a=a instanceof Array?a:[a];for(var c=0;c<a.length;++c)F(a[c],b,d);return this},
unbind:function(a,b){return m.bind(a,function(){},b)},trigger:function(a,b){if(q[a+":"+b])q[a+":"+b]({},a);return this},reset:function(){l={};q={};return this},stopCallback:function(a,b){return-1<(" "+b.className+" ").indexOf(" mousetrap ")?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable},handleKey:function(a,b,d){var c=C(a,b,d),e;b={};var f=0,g=!1;for(e=0;e<c.length;++e)c[e].seq&&(f=Math.max(f,c[e].level));for(e=0;e<c.length;++e)c[e].seq?c[e].level==f&&(g=!0,
b[c[e].seq]=1,x(c[e].callback,d,c[e].combo,c[e].seq)):g||x(c[e].callback,d,c[e].combo);c="keypress"==d.type&&I;d.type!=u||w(a)||c||t(b);I=g&&"keydown"==d.type}};J.Mousetrap=m;"function"===typeof define&&define.amd&&define(m)})(window,document);

},{}],25:[function(require,module,exports){
var Lexer = require('../board/functions/lexer');

module.exports = function() {
  var Types = Object.freeze({
    coord: "A coordinate must be an ordered pair separated by a comma",
    radius: "A radius here must be a positive number",
    pixel:  "A size in pixels is defined by a positive number",
    text:   "",
    point:  "A point is a single uppercase letter that identifies a defined point on the plane",
    axis:   "An axis must be either 'X' or 'Y', case-sensitive",  
    figure: "A figure should begin with an uppercase letter and an integer",
    value:  "A value is an ordered pair e.g. 'x,y', similar to coordinates",
    degrees: "Here a degrees must always be a positive number"    
  });
  $(document).on('focusout keyup', '[data-type]', function() {
    var value = $(this).val(),
        type  = $(this).attr('data-type'),
        failed,
        lexer;
    switch(type) {
      case 'coord':
      case 'value':
        if (value.indexOf(',') === -1) {
          failed = Types[type];
        }
        value = value.split(',');
        if (!$.isNumeric(value[0]) || !$.isNumeric(value[1])) {
          failed = Types[type];          
        }
        break;
      case 'radius':
      case 'pixel':
      case 'degrees':
        if (parseInt(value) < 0 || ! $.isNumeric(value)) {
          failed = Types[type]
        }
        break;
      case 'axis':
        if (value !== 'X' && value !== 'Y') {
          failed = Types[type];
        }
        break;
      case 'point':
        lexer = new Lexer(value);
        // expect a letter and EOF.
        var tokens = [lexer.getNextToken(), lexer.getNextToken()];
        if (tokens[0] != 4 || tokens[1] != 12) {
          failed = Types[type];
        }
        break;        
      case 'figure':
        lexer = new Lexer(value);
        // expect a label and EOF.
        console.log(lexer);
        var tokens = [lexer.getNextToken(), lexer.getNextToken()];
        if (tokens[0] != 10 || tokens[1] != 12) {
          failed = Types[type];
        }
        break;
    }
    if (typeof failed !== 'undefined') {
      $(this).attr('data-error', failed);
      failed = undefined;
    } else {
      $(this).removeAttr('data-error');
    }
  });
};
},{"../board/functions/lexer":35}],23:[function(require,module,exports){
var Lexer = require('./lexer');

/*
 * Geometry Function Parser
 */

var Parser = function(expr) {
  this.llex       = new Lexer(expr);
  this._arguments = [];
  this._identifier;
  Object.defineProperty(this, "arguments", {
    get: function() { return this._arguments; }
  });
  Object.defineProperty(this, "identifier", {
    get: function() { return this._identifier; }
  });
  Object.defineProperty(this, "object", {
    get: function() {return {
        'identifier': this._identifier, 
        'arguments':  this._arguments
      };
    }
  });
};

Parser.prototype = (function() {
  var tokens = Object.freeze({
    T_UNKNOWN:     1,
    T_INTEGER:     2,
    T_FLOAT:       3,
    T_LETTER:      4,
    T_OPEN_PAREN:  5,
    T_CLOSE_PAREN: 6,
    T_COMMA:       7,
    T_IDENTIFIER:  8,
    T_EQUAL:       9,
    T_LABEL:       10,
    T_EXPR:        11,
    T_EOL:         12
  });

  var token_strings = Object.freeze({
    1:     "unknown",
    2:     "integer",
    3:       "float",
    4:      "letter",
    5:           "(",
    6:           ")",
    7:           ",",
    8:  "identifier",
    9:           "=",
    10:      "label",
    11: "expression",
    12:        "EOL"
  });

  var t_error = function(llex, token, expected) {
    if (expected instanceof Array) {
      expected = expected[0];
    }
    var unexpected = (token_strings[token] == "unknown") ?
      llex.scanner : token_strings[token];    
    var msg = ["Unexpected token: '",
      unexpected,
      "', expected ",
      token_strings[expected]
    ].join('');
    throw new Error(msg);
  };

  var accept  = function(t) {
    this.llex.getNextToken();
    if (t instanceof Array) {
      var isIn = false, lex  = this.llex;
      t.forEach(function(e) {
        if (e == lex.current_token) {
          isIn  = true;
        }
      });
      if (!isIn) {
        t_error(this.llex, this.llex.current_token, t);
        return false;
      }
    } else if (this.llex.current_token !== t) {
        t_error(this.llex, this.llex.current_token, t);
        return false;
    }
    return this.llex.current_token;
  };
    
  return {
    Constructor: Parser,
    run: function() {
      if (this.llex.expr[this.llex.pointer] == '=') {
        accept.call(this, tokens.T_EQUAL);
      }
      accept.call(this, [tokens.T_EXPR, tokens.T_IDENTIFIER]);
      if (this.llex.current_token == tokens.T_EXPR) {
        this._arguments.push({argument: this.llex.scanner, type: token_strings[tokens.T_EXPR]});
      } else {
        this._identifier = this.llex.scanner;
        accept.call(this, [tokens.T_OPEN_PAREN]);
        var token;
        do {
          token = accept.call(this, [tokens.T_LABEL, tokens.T_LETTER, tokens.T_INTEGER, tokens.T_FLOAT]);
          this._arguments.push({argument: this.llex.scanner, type: token_strings[token]});
        } while(accept.call(this, [tokens.T_COMMA, tokens.T_CLOSE_PAREN]) == tokens.T_COMMA);
      }
    accept.call(this, tokens.T_EOL);
    }
  };
})();

module.exports = Parser;

},{"./lexer":35}],28:[function(require,module,exports){
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

//-----------------------------------------------------------------------

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

//-----------------------------------------------------------------------

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

//-----------------------------------------------------------------------

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

//-----------------------------------------------------------------------

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

//-----------------------------------------------------------------------

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
},{"../board/transform":36,"../helper/coords":37}],29:[function(require,module,exports){
var element = require('../board/element'),
    coords  = require('../helper/coords')();

/* Commands */

/*--
  Interface Command {
    public void   constructor(JSXGraph board, Object Arguments)
    public void   remove()
    public object execute()
  }
--*/

var circle = function(board, args) {
  var args = args || {
    center: $('input[name="center"]:last').coord(),
    radius: parseFloat($('input[name="radius"]:last').val())
  };

  this.circle  = new element(board, "circle", args);
  this.remove  = function() {
    delete board.points[this.circleElement.center.name];
    board.removeObject(this.circleElement.center);
    board.removeObject(this.circleElement);
    board.shapes.pop();
  };
  this.execute = function() {
    this.circleElement = this.circle.draw(); 
    return args;
  };
};

//-----------------------------------------------------------------------


var angle = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord()
  };

  this.angle  = new element(board, "angle", args);
  this.remove = function() {
    delete board.points[this.angleElement.point1.name];
    delete board.points[this.angleElement.point2.name];
    delete board.points[this.angleElement.point3.name];
    board.removeObject(this.angleElement.point1);
    board.removeObject(this.angleElement.point2);
    board.removeObject(this.angleElement.point3);
    board.removeObject(this.angleElement);
    board.shapes.pop();
  };
  this.execute = function() {
    this.angleElement = this.angle.draw();
    return args;
  };
};

//-----------------------------------------------------------------------

var arc = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord()
  };

   this.arc     = new element(board, "arc", args);
   this.remove  = function() {
      delete board.points[this.arcElement.center.name];
      delete board.points[this.arcElement.point2.name];
      delete board.points[this.arcElement.point3.name];
      board.removeObject(this.arcElement.center);
      board.removeObject(this.arcElement.point2);
      board.removeObject(this.arcElement.point3);
      board.removeObject(this.arcElement);
      board.shapes.pop();
   };
   this.execute = function() {
      this.arcElement = this.arc.draw();
      return args;
   };
};

//-----------------------------------------------------------------------

var ellipse = function(board, args) {
  var args = args ||  {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
    point3: $('input[name="point3"]:last').coord()
  };

  this.ellipse = new element(board, "ellipse", args);
  this.remove  = function() {
    // curve points
    var curve = board.shapes.pop();
    board.removeObject(curve.usrSetCoords[0]);
    board.removeObject(curve.usrSetCoords[1]);
    board.removeObject(curve.usrSetCoords[2]);
    board.removeObject(this.ellipseElement);
  };
  this.execute = function() {
    this.ellipseElement = this.ellipse.draw()
    return args;
  };
};

//-----------------------------------------------------------------------

var segment = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
  };
  this.segment = new element(board, "segment", args);
  this.remove  = function() {
    delete board.points[this.segmentElement.point1.name];
    delete board.points[this.segmentElement.point2.name];
    board.removeObject(this.segmentElement.point1);
    board.removeObject(this.segmentElement.point2);
    board.removeObject(this.segmentElement);
    board.shapes.pop();
  };
  this.execute = function() {
    this.segmentElement = this.segment.draw();
    return args;
  };
};

//-----------------------------------------------------------------------

var line = function(board, args) {
  var args = args || {
    point1: $('input[name="point1"]:last').coord(),
    point2: $('input[name="point2"]:last').coord(),
  };
  this.line    = new element(board, "line", args);
  this.remove  = function() {
    delete board.points[this.lineElement.point1.name];
    delete board.points[this.lineElement.point2.name];
    board.removeObject(this.lineElement.point1);
    board.removeObject(this.lineElement.point2);
    board.removeObject(this.lineElement);
    board.shapes.pop();
  };
  this.execute = function() {
    this.lineElement = this.line.draw();
    return args;
  };
};

//-----------------------------------------------------------------------

var polygon = function(board, args) {
  var points   = 3,
      vertices = {};
  $('.draw-polygon:last input').each(function(i,m) {
    vertices["point"+i] = $(m).coord();
  });
  args = args || vertices;

  this.polygon = new element(board, "polygon", args);
  this.remove = function() {
    this.polygonElement.vertices.pop();
    this.polygonElement.vertices.forEach(function(vertex) {
      delete board.points[vertex.name];
      board.removeObject(vertex);
    });
    board.removeObject(this.polygonElement);
    board.shapes.pop();
  };
  this.execute = function() {
    this.polygonElement = this.polygon.draw();
    return args;
  };
};

//-----------------------------------------------------------------------

var point = function(board, args) {
  var args = args || {
    point: $('input[name="point"]:last').coord(),
  };
  this.point = new element(board, "point", args);
  this.remove  = function() {
    delete board.points[this.pointElement.name];
    board.removeObject(this.pointElement);
  };
  this.execute = function() {
    this.pointElement = this.point.draw();
    return args;
  };
};

//-----------------------------------------------------------------------

var text = function(board, args) {
  var args = args || {
    position: $('input[name="position"]:last').coord(),
    size:     parseInt($('input[name="size"]:last').val()),
    text:     $('input[name="text"]:last').val()       
  };
  this.text = new element(board, "text", args);
  this.remove = function() {
    board.removeObject(this.textElement);
    board.shapes.pop();
  };
  this.execute = function() {
    this.textElement = this.text.draw();
    return args;
  };
};


module.exports = {
  circle: circle,
  angle: angle,
  arc: arc,
  ellipse: ellipse,
  segment: segment,
  line: line,
  polygon: polygon,
  point: point,
  text: text
};
},{"../board/element":38,"../helper/coords":37}],31:[function(require,module,exports){
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
        radians = result.toFixed(2),
        deg     = radiansToDegrees(result).toFixed(2);
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

//-----------------------------------------------------------------------

var area = function(board, args) {
  var parse;
  if (typeof args === 'undefined') {
    parse = new Parser($('input.function').val());
    parse.run();
    if (parse.arguments.length != 1) {
      throw new SyntaxError("requires 1 argument");
    }
    args = parse.arguments;
  } else {
    if (typeof args.args !== 'undefined') {
      args = args.args;
    }
  }
  var label  = args[0].argument,
      shape;
  board.shapes.forEach(function(e) {
    if (e.name === label) {
      shape = e;
    }
  });
  if (!shape) {
    throw new ReferenceError("structure not found");
  }
  // Polymorphic object construction
  if (shape.vertices) {
    return PolygonArea.apply(this, arguments);
  } 
  else if (shape.radius) {
    return CircleArea.apply(this,arguments);
  } else {
    throw new Error("unrecognized structure to compute area");
  }
};

//-----------------------------------------------------------------------


var CircleArea  = function(board, args) {
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
      realArgs,
      shape;
  board.shapes.forEach(function(e) {
    if (e.name === label) {
      shape = e;
    }
  });
  if (typeof shape === 'undefined') {
    throw new ReferenceError("structure " + label + " does not exist");
  }
  if (typeof shape.radius === 'undefined') {
    throw new ReferenceError("structure " + label + " is not a circle");
  }
  realArgs  = {radius: shape.radius};
  this.func = new func(JXG, "circle_area", realArgs); 
  this.execute = function() {
    var result  = this.func.run();
    this.textElement = new element(board, "text", {
      position: [shape.center.coords.usrCoords[1],
      shape.center.coords.usrCoords[2] - 2],
      size: 18,
      text: "Area: " + result.toFixed(2)
    }).draw();
    return args;
  };
  this.remove = function() {
      board.removeObject(this.textElement);
      board.shapes.pop();
  };
};

var PolygonArea = function(board, args) {
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
  this.func = new func(JXG, "polygon_area", realArgs); 
  this.execute = function() {
    var result  = this.func.run();
    this.textElement = new element(board, "text", {
      position: [realArgs.X[0] + 5, realArgs.Y[0] + 1],
      size: 18,
      text: "Area: " + parseFloat(result).toFixed(2)
    }).draw();
    return args;
  };
  this.remove = function() {
      board.removeObject(this.textElement);
      board.shapes.pop();
  }; 
};

//-----------------------------------------------------------------------

var plot = function(board, args) {
  if (typeof args === 'undefined') {
    var parse = new Parser($('input.function').val());
    parse.run();
    if (parse.arguments.length != 1) {
      throw new SyntaxError("requires 1 argument");
    }
     var funcArgs = args = parse.arguments;
     args = args[0].argument;
  } else {
    if (typeof args.args !== 'undefined') {
      args = args.args;
    }
  }
  var realArgs = {equation: args, board: board}
  this.func = new func(JXG, "plot", realArgs);
  this.execute = function() {
    try {
      var result = this.func.run();
    } catch(e) {
      alert("Expression Error: " + e.message);
      return {failed: true};
    }
    this.functionElement = new element(board, "func", [result,
      function(){ 
        var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[0,0],board);
        return c.usrCoords[1];
      },
      function(){ 
        var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[board.canvasWidth,0],board);
        return c.usrCoords[1];
      }]).draw();
    return args;
  };
  this.remove = function() {
    board.removeObject(this.functionElement);
    board.shapes.pop();
  };
};

module.exports = {
  angle: angle,
  area:  area,
  plot:  plot,
};
},{"../board/functions/functions":39,"../board/functions/parser":23,"../board/element":38}],35:[function(require,module,exports){
/*
 * Geometry Function Tokenizer
 */

 var Lexer = function(expr) {
  this.current_token;
  this.expr    = expr;
  this._pointer = 0;
  this._scanner;
  Object.defineProperty(this, "scanner", {
    get: function() { return this._scanner; }
  });
  Object.defineProperty(this, "pointer", {
    get: function() { return this._pointer; }
  });
};

Lexer.prototype = (function() {
  var tokens = Object.freeze({
    T_UNKNOWN:     1,
    T_INTEGER:     2,
    T_FLOAT:       3,
    T_LETTER:      4,
    T_OPEN_PAREN:  5,
    T_CLOSE_PAREN: 6,
    T_COMMA:       7,
    T_IDENTIFIER:  8,
    T_EQUAL:       9,
    T_LABEL:       10,
    T_EXPR:        11,
    T_EOL:         12
  });
  var skipWhitespace = function() {
    while(/[\s\t\n]/.test(this.expr[this._pointer])) {
      this._pointer++;
    }
  };
  return {
    Constructor: Lexer,
    getNextToken: function() {
      skipWhitespace.call(this);
      this._scanner = undefined;
      // T_EOL
      if (this._pointer >= this.expr.length) {
        return this.current_token = tokens.T_EOL;
      }
      // T_EXPR
      if (/^.*?\bx\b.*?$/.test(this.expr)) {
        this._scanner = this.expr;
        this._pointer = this._scanner.length;
        return this.current_token = tokens.T_EXPR;
      }
      // T_IDENTIFIER
      if (/[a-z]/.test(this.expr[this._pointer])) {
        this._scanner = '';
        while(/[a-z]/.test(this.expr[this._pointer]) &&
          !(this._pointer >= this.expr.length)) {
          this._scanner += this.expr[this._pointer];
          this._pointer++;
        }
        return this.current_token = tokens.T_IDENTIFIER;
      }
      // T_OPEN_PAREN
      if (/\(/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_OPEN_PAREN;
      }
      // T_CLOSE_PAREN
      if (/\)/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_CLOSE_PAREN;
      }
      // T_COMMA
      if (/,/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_COMMA;
      }
      // T_EQUAL
      if (/\=/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_EQUAL;
      }
      // T_LETTER
      if (/[A-Z]/.test(this.expr[this._pointer])) {
        var token;
        this._scanner = this.expr[this._pointer];
        this._pointer++;
        if (/[0-9]/.test(this.expr[this._pointer])) {
          // T_LABEL
          while(/[0-9]/.test(this.expr[this._pointer]) &&
          !(this._pointer >= this.expr.length)) {
            token = tokens.T_LABEL;
            this._scanner += this.expr[this._pointer];
            this._pointer++;
          }                  
        }
        return this.current_token = (token || tokens.T_LETTER);
      }
      // T_INTEGER
      if (/[0-9]/.test(this.expr[this._pointer])) {
        this._scanner = '';
        var token;
        while(/[0-9]/.test(this.expr[this._pointer]) &&
          !(this._pointer >= this.expr.length)) {
          this._scanner += this.expr[this._pointer];
          this._pointer++;
            // T_FLOAT
          if (this.expr[this._pointer] === '.') {
            if (token) {
              this._scanner             = this.expr[this._pointer];
              return this.current_token = tokens.T_UNKNOWN;
            }
            this._scanner       += this.expr[this._pointer++];
            this.current_token  = token = tokens.T_FLOAT;
          }
        }
        return this.current_token = (token || tokens.T_INTEGER);
      }
      // T_UNKNOWN
      this._scanner             = this.expr[this._pointer];
      return this.current_token = tokens.T_UNKNOWN;
    },
  };
})();

module.exports = Lexer;
},{}],36:[function(require,module,exports){
/*
  BoardTransform Factory
  */

var BoardTransform = function(board, transform, options) {
  this.board  = board;
  this.options = options;
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
    center   Point  pt
    points:  [Point p1, Point p2, ...]
  }
  */

  var RotateTransform = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  RotateTransform.prototype.apply = function() {
    var transform = this.board.create("transform", 
      [degreeToRadian.call(this, this.options.degrees),
      this.options.center], {type: "rotate"});
    transform.applyOnce(this.options.points);
    this.board.update();
  };

  //-----------------------------------------------------------------------

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

    transform.applyOnce(this.options.points);
    this.board.update();
  };

  //-----------------------------------------------------------------------

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
    transform.applyOnce(this.options.points);
    this.board.update();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    values:  [float, float]
    points:  [Point p1, Point p2, ...]
  }
  */

  var TranslateTransform = function(board, options) {
    this.options = options;
    this.board   = board;
  }

  TranslateTransform.prototype.apply = function() {
    var transform = this.board.create("transform", 
      this.options.values,
      {type: "translate"});
    transform.applyOnce(this.options.points);
    this.board.update();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    values:  [float, float]
    points:  [Point p1, Point p2, ...]
  }
  */

  var ScaleTransform = function(board, options) {
    this.options = options;
    this.board   = board;
  }

  ScaleTransform.prototype.apply = function() {
    var transform = this.board.create("transform", 
      this.options.values.map(function(e) {
        //return e / 5;
        return e;
      }),
      {type: "scale"});
    transform.applyOnce(this.options.points);
    this.board.update();
  };

  return {
    Constructor: BoardTransform,
    rotate:      RotateTransform,
    reflect:     ReflectTransform,
    shear:       ShearTransform,
    translate:   TranslateTransform,
    scale:       ScaleTransform
  };

})();

module.exports = BoardTransform;
},{}],37:[function(require,module,exports){
module.exports = function() {
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
};

},{}],39:[function(require,module,exports){
/* GeometryFunction Factory */

var GeometryFunction = function(JXG, func, options) {
  return new this[func](JXG, options);
};

GeometryFunction.prototype = (function() {

/*--
  Interface Function {
    public void   constructor(JXG, Object options)
    public void   run()
  }
*--*/

  /*
  Options: {
    point1: Point p1,
    point2: Point p2,
    point3: Point p3
  }
  */
  var AngleFunction = function(JXG, options) {
    this.options = options;
    this.JXG     = JXG;
  };
  AngleFunction.prototype.run = function() {
    return this.JXG.Math.Geometry.rad(
      this.options[0],
      this.options[1],
      this.options[2]
    );
  }; 

  /* 
  Options:
    X:        [point1, point2, point3, ...],
    Y:        [point1, point2, point3, ...],
    vertices: unsigned integer,

   */

  /* http://alienryderflex.com/polygon_area/ */

  var polygonAreaFunction = function(JXG, options) {
    this.options = options;    
  }

  polygonAreaFunction.prototype.run = function() {
    var area = 0,
        j    = this.options.vertices-1,
        i;
    for (i = 0; i < this.options.vertices; i++) {
      area = area + (this.options.X[j] + this.options.X[i]) * (this.options.Y[j] - this.options.Y[i]);
      j    = i;
    }

    return Math.abs( area / 2 );
  };

  /* 
  Options:
    radius: Float
  */

  var CircleAreaFunction = function(JXG, options) {
    this.options = options;    
  };

  CircleAreaFunction.prototype.run = function() {
    return Math.PI * Math.pow(this.options.radius, 2);    
  };


  /*
  Options:
    board:    Object
    equation: String
  */

  var PlotFunction = function(JXG, options) {
    this.options = options;
    this.jc      = options.board.jc // JessieCode
  };

  PlotFunction.prototype.run = function() {
    return this.jc.snippet(this.options.equation, true, 'x,y', true);  
  };

  /* @TODO: */

  /*
  Options:
    vertices1: [Point p1, Point p2, Point p3, ...],
    vertices2: [Point p1, Point p2, Point p3, ...]
  */

  var PolygonCongruentFunction = function(JXG, options) {
    this.options = options;
  }

  PolygonCongruentFunction.prototype.run = function() {

  };

  /*
  Options:
    line1: [[Point p1, Point p2], [Point p3, Point p4]],
    line2: [[Point p1, Point p2], [Point p3, Point p4]],
  */

  var LineSegmentCongruentFunction = function(JXG, options) {
    this.options = options;
  }

  LineSegmentCongruentFunction.prototype.run = function() {

  };

  /*
  Options:
    radius1: unsigned int
    radius2: unsigned int
  */

  var CircleCongruentFunction = function(JXG, options) {
    this.options = options;
  }

  CircleCongruentFunction.prototype.run = function() {

  };

  return {
    Constructor:  GeometryFunction,
    angle:        AngleFunction,
    polygon_area: polygonAreaFunction,
    circle_area:  CircleAreaFunction,
    plot:         PlotFunction
  };

})();

module.exports = GeometryFunction;
},{}],38:[function(require,module,exports){
var point = require('./point'),
    shape = require('./shape')

/*
  BoardElement Factory
  */

var BoardElement = function(board, element, options) {
  this.element = element;
  this.options = options;
  return new this[element](board, options);
}

BoardElement.prototype = (function() {

/*--
  Interface Element {
    public void   constructor(JSXGraph board, Object options)
    public object draw()
  }
*--*/

  /*
  Options: {
    center: [float, float],
    radius: float
  }
  */
  var circleElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  circleElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.center).add();
    return new shape(this.board, "circle", [p1, this.options.radius, [p1]]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float],
    point 3: [float, float]
  }
  */
  var angleElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  angleElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();
    var p3 = new point(this.board, this.options.point3).add();

    return new shape(this.board, "angle", [p1, p2, p3, [p1, p2, p3]]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float],
    point 3: [float, float]
  }
  */
  var arcElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  arcElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add(); 
    var p2 = new point(this.board, this.options.point2).add();
    var p3 = new point(this.board, this.options.point3).add();

    return new shape(this.board, "arc", [p1, p2, p3, [p1, p2, p3]]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float],
    point 3: [float, float]
  }
  */
  var ellipseElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  ellipseElement.prototype.draw = function() {
    // curve points
    var p1 = new point(this.board, this.options.point1).add(); 
    var p2 = new point(this.board, this.options.point2).add();
    var p3 = new point(this.board, this.options.point3).add();
    
    return new shape(this.board, "ellipse", [p1, p2, p3, [p1, p2, p3]]).add();

  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float]
  }
  */
  var segmentElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  segmentElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();

    return new shape(this.board, "segment", [p1, p2, [p1, p2]]).add();

  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    point 2: [float, float]
  }
  */
  var lineElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  lineElement.prototype.draw = function() {
    var p1 = new point(this.board, this.options.point1).add();
    var p2 = new point(this.board, this.options.point2).add();

    return new shape(this.board, "line", [p1, p2, [p1, p2]]).add();
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point 1: [float, float],
    ...
  }
  */
  var polygonElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  polygonElement.prototype.draw = function() {

    var vertices = [];
    for(i in this.options) {
      vertices.push(new point(this.board, this.options[i]).add());
    }
    vertices.push(vertices);
    var polygon = new shape(this.board, "polygon", vertices).add();
    polygon.hasInnerPoints  = true;
    return polygon;
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    point: [float, float]
  }
  */
  var pointElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  pointElement.prototype.draw = function() {
   
    return new point(this.board, this.options.point).add();
   
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    options: [Function, X, Y]
  }
  */

  var functionElement = function(board, options) {
    this.options = options;
    this.board   = board;
  }

  functionElement.prototype.draw = function() {
    var curve = new shape(this.board, 'functiongraph', this.options.concat(this.options[0]), {
      fixed: true,
      strokewidth: 2
    });
    curve = curve.add();

    return curve;
  };

  //-----------------------------------------------------------------------

  /*
  Options: {
    position: [float, float],
    size:     int,
    text:     string
  }
  */

  var textElement = function(board, options) {
    this.options = options;
    this.board   = board;
  };

  textElement.prototype.draw = function() {
    return new shape(this.board, "text", 
      [this.options.position[0],
      this.options.position[1],
      this.options.text,
      [this.options.position[0],
      this.options.position[1]]],
      {
        fontSize: this.options.size
      }).add();
  };

  return {
    Constructor: BoardElement,
    circle:      circleElement,
    angle:       angleElement,
    arc:         arcElement,
    ellipse:     ellipseElement,
    segment:     segmentElement,
    func:        functionElement,
    line:        lineElement,
    polygon:     polygonElement,
    point:       pointElement,
    text:        textElement
  };

})();

module.exports = BoardElement; 
},{"./point":40,"./shape":41}],40:[function(require,module,exports){
var Point = function(board, coords) {
  this.board  = board;
  this.coords = coords;
};

Point.prototype = (function() {
  /* Private */
  var getPointIfExists = function() {
    var points = this.board.points;
    for (point in this.board.points) {
      if (this.board.points.hasOwnProperty(point)) {
        if (points[point].coords.usrCoords[1] == this.coords[0] &&
            points[point].coords.usrCoords[2] == this.coords[1]) {
          return points[point];
        }
      }
    }
    return false;
  };
  /* Public */
  return {
    Constructor: Point,
    add: function() {
      //var point = getPointIfExists.call(this);
      var point = false;
      if (!point) {
        var p = this.board.create("point", this.coords, { infoboxDigits: 'none'});
        Object.defineProperty(this.board.points, p.name, 
          {value: p,
           enumerable:   true,
           configurable: true});
        // prevent dilation
        p.on("mousedown", (require("../helper/drag")));
        p.on("mouseout",  function(e) { this.isDraggable = true; });
        return p;
      } else {
        return point;
      }
    }
  }; 

})();

module.exports = Point;

},{"../helper/drag":17}],41:[function(require,module,exports){
var Shape = function(board, shape, parents, options) {
  this.board   = board;
  this.shape   = shape;
  this.parents = parents;
  this.options = options || {};
};

Shape.prototype = (function() {
  /* Private */
  var createShapeLabel = function() {
      return "A" + (this.board.shapes.length + 1);
  };
  /* Public */
  return {
    Constructor: Shape,
    add: function() {
      this.options.name           = this.options.name || createShapeLabel.call(this);
      this.options.withLabel      = true;
      this.options.hasInnerPoints = true;
      var points = this.parents.pop(), // full list of points 
          s      = this.board.create(this.shape, this.parents, this.options);
      s.usrSetCoords = (typeof points == 'function') ? undefined : points;
      s.on("mouseover", (require("../helper/drag")));
      this.board.shapes.push(s);
      return s;
    }
  };
})();


module.exports = Shape;
},{"../helper/drag":17}]},{},[1])
;