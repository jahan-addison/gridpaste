/* The Invoker */

var Operation = function(board) {
  var _commands = [];
  this.commands = _commands;
  Object.defineProperty(this, "length", {
    get: function() { return _commands.length }
  });
  
  this.storeAndExecute = function(command) {
    var $command =  new command(board),
        args     =  $command.execute();
    _commands.push({
      arguments:   args,
      'command':   $command,
      'toString':  $command.constructor.toString()
    });
  };
  
  this.undoLastExecute = function() {
   var $command = _commands.pop();
   $command.command.remove();
  };
};

module.exports = Operation;