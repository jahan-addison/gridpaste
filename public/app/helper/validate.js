var Lexer = require('../board/functions/lexer');

module.exports = function() {
  var Types = Object.freeze({
    coord: "A coordinate must be two numbers separated by a comma",
    radius: "A radius here must be a positive number",
    pixel:  "A size in pixels is defined by a positive number",
    text:   "",
    axis:   "An axis must be either 'X' or 'Y', case-sensitive",  
    figure: "A figure should begin with an uppercase letter and a number",
    value:  "A value an amount in 'x,y', similar to coordinates",
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
      case 'figure':
        lexer = new Lexer(value);
        // expect a label and EOF.
        var tokens = [lexer.getNextToken(), lexer.getNextToken()];
        if (tokens[0] != 10 || tokens[1] != 11) {
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