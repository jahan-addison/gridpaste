var transform = require('../events/transform');
var last = [],
  initialX,
  initialY,
  initial;
module.exports = function(e) {
  if($('#application').hasClass('paste')
  || (this instanceof JXG.Point === false
    && typeof this.usrSetCoords === 'undefined')) {
    return false;
  }
  // check the type of point
  if (this instanceof JXG.Point === true) {
    if (Object.keys(this.childElements).length > 1) {
      this.isDraggable = false;
      return false;
    }
  }
  initialX = e.srcApp.board.points[this.usrSetCoords[0].name].X();
  initialY = e.srcApp.board.points[this.usrSetCoords[0].name].Y();
  initial  = this.usrSetCoords.map(function(m) {
    return [e.srcApp.board.points[m.name].X(), e.srcApp.board.points[m.name].Y()];
  });
  console.log(initial);
  this.on('drag', function(e) { 
    e.preventDefault();
    this.on("mouseup", function(e) {
      if (last.length === 0) {
        last = [e.x,e.y];
      } else {
        if (e.x == last[0] && e.y == last[1]) {
          return;
        } else {
          last = [e.x, e.y];
        }
      }
     // console.log(initialX, this.usrSetCoords[0].X());
      var distanceX = this.X() || this.usrSetCoords[0].X() - initialX,
          distanceY = this.Y() || this.usrSetCoords[0].Y() - initialY;
      var drag = transform.drag;
      e.srcApp.store({
        targetOperation: 'transform',
        targetCommand:   'drag',
        command:          drag
      }, {
        figure: this.name,
        initial: initial,
        values: [distanceX, distanceY]
      });
    });
  });
};