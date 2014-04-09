/* The Invoker */

var Operation = function(board) {
  this.commands = [];
  this.storeAndExecute = function(command) {
    var args =  command(board);
    this.commands.push({
      arguments: args,
      'command': command.toString()
    });
  }
  this.undoLastExecute = function() {

  };
};

module.exports = Operation;