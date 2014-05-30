/* Commands */

/*--
Interface Command {
  public void   constructor(JSXGraph board, Object Arguments)
  public void   remove()
  public object execute()
}
--*/

var delete_ = function(board, args) {
  var args = args || {
    obj: $('input[name="figure"]:last').val()
  };
  this.remove = function() {
    this.obj.visible(true);
    for (i in this.obj.ancestors) {
      if (this.obj.ancestors.hasOwnProperty(i)) {
        this.obj.ancestors[i].visible(true);
      }
    }
  };
  this.execute = function() {
    for(var i = 0; i <  board.shapes.length; i++) {
      if (board.shapes[i].name == args.obj) {
        board.shapes[i].visible(false);
        this.obj = board.shapes[i];
        for (i in this.obj.ancestors) {
          this.obj.ancestors[i].visible(false);          
        }
      }
    }
    if (typeof this.obj === 'undefined') {
      throw ReferenceError("Could not find figure '" + args.obj + "'");
    }
    return args;
  };
};

module.exports = {
  delete_: delete_
};