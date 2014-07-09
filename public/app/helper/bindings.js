var command = require('../events/run');
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
      var target   = App.last.toString.split('.'),
          $command = {
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
  });
};