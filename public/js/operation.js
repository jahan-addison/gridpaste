/* The Invoker */

var Operation = function(board) {
  var _commands = [];
  Object.defineProperty(this, "length", {
    get: function() { return _commands.length }
  });
  
  this.storeAndExecute = function(command) {
    var args =  command(board);
    _commands.push({
      arguments: args,
      'command': command.toString()
    });
  };
  this.undoLastExecute = function() {

  };
};

module.exports = Operation;