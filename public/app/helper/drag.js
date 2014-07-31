var transform = require('../events/transform');
var last = [],
  initialX,
  initialY,
  dragged,
  initial;
module.exports = function(e) {
  if ($('#application').hasClass('paste')) {
    this.isDraggable = false;
    return false;
  }
  if(this instanceof JXG.Point === false
    && typeof this.usrSetCoords === 'undefined') {
    return false;
  }
  if (this instanceof JXG.Text === true) {
    this.isDraggable = false;
    return false;
  }
  // check the type of point
  if (this instanceof JXG.Point === true) {
    if (Object.keys(this.childElements).length > 1) {
      this.isDraggable = false;
      return false;
    }
  }
  if (typeof this.usrSetCoords !== 'undefined') {
    initialX = e.srcApp.board.points[this.usrSetCoords[0].name].X();
    initialY = e.srcApp.board.points[this.usrSetCoords[0].name].Y();
    initial  = this.usrSetCoords.map(function(m) {
      return [e.srcApp.board.points[m.name].X(), e.srcApp.board.points[m.name].Y()];
    });    
  } else {
    initialX = e.srcApp.board.points[this.name].X();
    initialY = e.srcApp.board.points[this.name].Y();
    initial  = [[initialX, initialY]];   
  }
  this.on('drag', function(e) { 
    dragged = this;
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
      var distanceX,
          distanceY;
      if (typeof this.X !== 'function') {
        distanceX = this.usrSetCoords[0].X() - initialX;
        distanceY = this.usrSetCoords[0].Y() - initialY;
      } else {
        distanceX = this.X()  - initialX;
        distanceY = this.Y()  - initialY;      
      }

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
    }.bind(dragged));
  });
};