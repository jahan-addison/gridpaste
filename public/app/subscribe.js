var execute    = require('./operation');

module.exports = function(board) {

  // The application request object
  var operationExec = new execute(board);

  require('./helper/helpers')(operationExec); // various UI helpers



  require('./subscriptions/board')    (operationExec); /* Board subscription */

  require('./subscriptions/function') (operationExec); /* Function subscription */

  require('./subscriptions/zoom')     (operationExec, board); /* Zoom subscription */

  // return the request object to the front controller
  return operationExec;
};
