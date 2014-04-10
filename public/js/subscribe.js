var execute         = require('./operation'),
    command         = require('./events/run'),
    slider          = require('./helper/slider'),
    more            = require('./helper/more')(),
    Rx              = require('../components/rxjs/rx.lite').Rx;

module.exports = function(board) {

  var $querySources  = $([
    '.circle',   '.angle',   '.arc',
    '.ellipse',  '.segment', '.line',
    '.parabola', '.polygon', '.point',
    '.text'
  ].join(','));

  var $querySource       = Rx.Observable.fromEvent($querySources, 'click');
  var $querySubscription = $querySource.subscribe(function(e) {
    if (!$('.slider').length) {
      console.log("Querying operation");

      slider($(e.target).next().html(), 230, 'auto', '#application'); 
    }
  }); 

  var $operationSources      = '.button.draw, .button.transform';
  var $operationSource       = Rx.Observable.fromEventPattern(
    function addHandler(h) { $('#application').on('click', $operationSources, h) },  
    function delHandler(h) { $('#application').off('click', $operationSources, h) }  
  );

  var operationExec          = new execute(board);

  var $operationSubscription = $operationSource.subscribe(function(e) {
    console.log("Executing operation");
    var target    = $(e.target).parent().attr('class').split('-');
    var targetOperation = target[0],
        targetCommand   = target[1];
    operationExec.storeAndExecute(command[targetOperation][targetCommand]);
    $('.close-slider').click();
  },
    function(e) {
      console.log("Error: %s", e.message);
    }
  ); 

  return operationExec;
};
