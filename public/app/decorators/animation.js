/*
  JXG.Transformations.prototype.applyOnce Decorator
*/  

module.exports = function(JXG) {
  var transform = JXG.Transformation.prototype.applyOnce;
 /* JXG.Transformation.prototype.applyOnce = function(p) {
    var c, len, i;

    if (!p instanceof Array) {
      p = [p];
    }

    len = p.length;

    for (i = 0; i < len; i++) {
      this.update();
      c = JXG.Math.matVecMult(this.matrix, p[i].coords.usrCoords);
      //p[i].coords.setCoordinates(JXG.COORDS_BY_USER, c);
      p[i].moveTo(c, 1000);
    }
  }; */
};
