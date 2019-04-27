var element   = require('../app/javascripts/board/element'),
    transform = require('../app/javascripts/board/transform');

describe("BoardTransform Factory", function() {
  var brd, points, p;
  before(function(done) {
    document.body.innerHTML = window.__html__['browser_test/fixtures/board.html'];
    brd = JXG.JSXGraph.initBoard('grid', {
      boundingbox:     [-50, 50, 50, -50],
      keepaspectratio: true,
      showCopyright:   false,
      showNavigation:  false,
    });
    brd.xx     = brd.create('axis',[[0,0],[1,0]]);
    brd.yy     = brd.create('axis',[[0,0],[0,1]]);
    brd.points = {};
    brd.shapes = []

    Array.prototype.equals = function (array) {
      if (!array)
        return false;

      if (this.length != array.length)
        return false;

      for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
          if (!this[i].equals(array[i]))
            return false;
        }
          else if (this[i] != array[i]) {
            return false;
          }
      }
      return true;
    };

    done();
  });
  beforeEach(function(done) {
    var options = {
      point1: [-25, 25],
      point2: [-25, 0],
      point3: [0, 0]
    };
    new element(brd, "polygon", options).draw();
    done();
  });
  afterEach(function(done) {
    brd.removeObject(brd.points.A);
    brd.removeObject(brd.points.B);
    brd.removeObject(brd.points.C);
    brd.removeObject(brd.shapes.pop());
    brd.points = {};
    done();
  });
  describe("RotateTransform", function() {
    it("should perform a rotation per a center point", function() {
      p = new transform(brd, "rotate", {
        degrees: 45,
        center: brd.points.B,
        points: [brd.points.A, brd.points.B, brd.points.C]
      }).apply();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-42.68','17.68'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-7.32','17.68'])).to.be.true;
    });
  });
  describe("ReflectTransform", function() {
    it("should perform a reflection on the Y axis", function() {
      p = new transform(brd, "reflect", {
        line: brd.yy,
        points: [brd.points.A, brd.points.B, brd.points.C]
      }).apply();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("should perform a reflection on the X axis", function() {
      p = new transform(brd, "reflect", {
        line: brd.xx,
        points: [brd.points.A, brd.points.B, brd.points.C]
      }).apply();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','-25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
  describe("ShearTransform", function() {
    it("should perform a shear", function() {
      p = new transform(brd, "shear", {
        degrees: 25,
        points: [brd.points.A, brd.points.B, brd.points.C]
      }).apply();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-14.09','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
  describe("TranslateTransform", function() {
    it("should perform a translation", function() {
      p = new transform(brd, "translate", {
        values: [25, 0],
        points: [brd.points.A, brd.points.B, brd.points.C]
      }).apply();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','0.00'])).to.be.true;
    });
  });
  describe("ScaleTransform", function() {
    it("should perform a scale", function() {
      p = new transform(brd, "scale", {
        values: [2.0, 1.0],
        points: [brd.points.A, brd.points.B, brd.points.C]
      }).apply();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-50.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-50.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
});