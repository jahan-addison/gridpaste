var command    = require('../events/run'),
    Parser     = require('../board/functions/parser'),
    Rx         = require('../../components/rxjs/rx.lite').Rx;

module.exports = function(App) {
  var $sources = $('.function'),
      $source  = Rx.Observable.fromEvent($sources, "keypress");

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
      var $command        = {
        'targetOperation': targetOperation,
        'targetCommand':   targetCommand,
        'command':         command[targetOperation][targetCommand]
      };
      App.storeAndExecute($command);
      
      $('.function').val('');
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