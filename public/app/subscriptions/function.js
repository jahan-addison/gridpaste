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