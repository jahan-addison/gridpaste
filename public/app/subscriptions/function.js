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
        console.log(e.message);
        alert("Syntax: " + e.message);
        return false;
      }
      var targetOperation = 'func',
          targetCommand   = func.identifier;
      if (targetCommand in command[targetOperation] === false) {
        alert("Warning: This GeometryFunction does not exist");
        return;        
      }
      var $command        = {
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
      e.target.value = "";
      
      if (App.length > 0) {
        $('.button.undo').addClass('visible');
      }
      $('.close-slider').click();
    }
  },
  function(e) {
    console.log("Error: %s", e.message);
  });
};