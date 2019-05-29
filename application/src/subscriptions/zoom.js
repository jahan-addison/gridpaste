var command    = require('../events/run'),
Rx             = require('rx-lite').Rx;

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