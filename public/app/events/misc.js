/* Commands */

/*--
Interface Command {
  public void   constructor(JSXGraph board, object Arguments)
  public void   remove()
  public object execute()
}
--*/

var delete_ = function(board, args) {
  var args = args || {
    figure: $('input[name="figure"]:last').val()
  };
  this.remove = function() {
    this.figure.visible(true);
    this.figure.isVisible = true;
    for (i in this.figure.ancestors) {
      if (this.figure.ancestors.hasOwnProperty(i)) {
        this.figure.ancestors[i].visible(true);
        this.figure.ancestors[i].isVisible = true;
      }
    }
  };
  this.execute = function() {
    for(var i = 0; i <  board.shapes.length; i++) {
      if (board.shapes[i].name == args.figure) {
        board.shapes[i].visible(false);
        this.figure           = board.shapes[i];
        this.figure.isVisible = false;
        for (i in this.figure.ancestors) {
          this.figure.ancestors[i].visible(false);          
          this.figure.ancestors[i].isVisible = false;
        }
      }
    }
    if (typeof this.figure === 'undefined') {
      throw ReferenceError("Could not find figure '" + args.figure + "'");
    }
    return args;
  };
};

module.exports = {
  delete_: delete_
};