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