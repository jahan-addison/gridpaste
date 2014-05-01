var command    = require('../events/run'),
    slider     = require('../helper/slider'),
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
     '.translate', '.scale'
  ].join(','));
  // The query observer prepares the way for the following operations subscription
  var $querySource       = Rx.Observable.fromEvent($querySources, 'click');
  var $querySubscription = $querySource.subscribe(function(e) {
    var target = $(e.target);
    if (!$('.slider').length) {
      slider(target.next().html(), 230, 'auto', '#application', target.parent().parent()); 
    }
  }); 
  
  /**
    Board operations
   */

  var $operationSources      = '.button.draw, .button.transform';
  var $operationSource       = Rx.Observable.fromEventPattern(
    function addHandler(h) { $('#application').on('click', $operationSources, h) },  
    function delHandler(h) { $('#application').off('click', $operationSources, h) }  
  );

  var $operationSubscription = $operationSource.subscribe(function(e) {
    var target    = $(e.target).parent().attr('class').split('-');
    var targetOperation = target[0],
        targetCommand   = target[1];
    // the request
    var $command  = {
      'targetOperation': targetOperation,
      'targetCommand':   targetCommand,
      'command':         command[targetOperation][targetCommand]
    };
    App.storeAndExecute($command);
    if (App.length > 0) {
      $('.button.undo').addClass('visible');
    }
    $('.close-slider').click();
  },
    function(e) {
      console.log("Error: %s", e.message);
    });
};