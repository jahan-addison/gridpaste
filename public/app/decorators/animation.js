/*
  JXG.Transformations.prototype.applyOnce Decorator
  @NOTE not in use
*/  

module.exports = function(JXG) {
  var transform = JXG.Transformation.prototype.applyOnce;
  JXG.Transformation.prototype.applyOnce = function(p, animate) {
    var c, len, i, animate = animate || false;

    if (!p instanceof Array) {
      p = [p];
    }

    len = p.length;

    for (i = 0; i < len; i++) {
      this.update();
      c = JXG.Math.matVecMult(this.matrix, p[i].coords.usrCoords);
      if (animate) {
        p[i].moveTo(c, 700);
      } else {
        p[i].coords.setCoordinates(JXG.COORDS_BY_USER, c);
      }
    }
  }; 
};
