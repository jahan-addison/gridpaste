/* The Invoker */

var Operation = function() {
  var commands = [];
  this.storeAndExecute = function(command) {
    commands.push(command);
    command();
  }
  this.undoLastExecute = function() {

  };
};

module.exports = Operation;