/* The Invoker */

var Operation = function(board) {
  var _commands = [];
  this.commands = _commands;
  this.board    = board;
};

Object.defineProperty(Operation.prototype, "length", {
  get: function() { return this.commands.length }
});

Object.defineProperty(Operation.prototype, "last", {
  get: function() { return this.commands[this.length-1] }
});

Operation.prototype.store = function(command, args) {
  var $command =  new command.command(this.board, args);
  this.commands.push({
    arguments:   args,
    'command':   $command,
    'toString':  command.targetOperation + '.' + command.targetCommand
  });
}

Operation.prototype.storeAndExecute = function(command, args) {
  var $command =  new command.command(this.board, args),
      args     =  $command.execute();
  this.commands.push({
    arguments:   args,
    'command':   $command,
    'toString':  command.targetOperation + '.' + command.targetCommand
  });
};

Operation.prototype.clearCommandList = function() {
  this.commands = [];
};

Operation.prototype.undoLastExecute = function() {
   var $command = this.commands.pop();
   $command.command.remove();
};

/* Decorators */
  require("./decorators/recording")(Operation);

module.exports = Operation;