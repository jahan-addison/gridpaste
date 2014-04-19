/* The Invoker */

var Operation = function(board) {
  var _commands = [];
  this.commands = _commands;
  this.board    = board;
  Object.defineProperty(this, "length", {
    get: function() { return this.commands.length }
  });
};

Operation.prototype.storeAndExecute = function(command) {
  var $command =  new command(this.board),
      args     =  $command.execute();
  this.commands.push({
    arguments:   args,
    'command':   $command,
    'toString':  $command.constructor.toString()
  });
};

Operation.prototype.undoLastExecute = function() {
   var $command = this.commands.pop();
   $command.command.remove();
};

/* Decorators */
  require("./decorators/recording")(Operation);

module.exports = Operation;