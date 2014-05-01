var command    = require('../events/run'),
    Rx         = require('../../components/rxjs/rx.lite').Rx;

module.exports = function(App) {
  var $zoomSources      = $('.zoom.in, .zoom.out');
  var $zoomSource       = Rx.Observable.fromEvent($zoomSources, "click");


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
      App.storeAndExecute($command);
      if (App.length > 0) {
        $('.button.undo').addClass('visible');
      }   
    } 
  });

}