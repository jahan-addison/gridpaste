var shape     = require('../public/app/board/shape'),
    point     = require('../public/app/board/point'),
    transform = require('../public/app/events/transform');

describe("transform Command concrete", function() {
  var brd, command;
  before(function(done) {

    document.body.innerHTML = window.__html__['browser_test/fixtures/transform.html'];
    brd = JXG.JSXGraph.initBoard('grid', {
      boundingbox:     [-50, 50, 50, -50],
      keepaspectratio: true,
      showCopyright:   false,
      showNavigation:  false,
      axis:            true
      });
    brd.points = {};
    brd.shapes = [];
    var p1 = new point(brd, [-25,25]).add(),
        p2 = new point(brd, [-25,0]).add();
        p3 = new point(brd, [0,0]).add();
    new shape(brd, "polygon", 
      [p1, p2, p3, [p1,p2,p3]]
    ).add();
    brd.axx = brd.create('axis',[[0,0],[1,0]]);
    brd.axy = brd.create('axis',[[0,0],[0,1]]);
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
  afterEach(function() {
    try { command.remove(); } catch(e) {}
  });
  describe("transform.rotate command", function() {
    it("should receive arguments from DOM if not provided and perform a rotation", function() {
      command = new transform.rotate(brd);
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-42.68','17.68'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-7.32','17.68'])).to.be.true;
    });
    it("should use passed arguments if provided and perform a rotation", function() {
      command = new transform.rotate(brd, {
        figure: "A1", 
        degrees: '45'});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-42.68','17.68'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-7.32','17.68'])).to.be.true;
    });
    it("can be undone", function() {
      command = new transform.rotate(brd);
      command.execute();
      command.remove();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
  describe("transform.reflect command", function() {
    it("should receive arguments from DOM if not provided and perform a reflection", function() {
      command = new transform.reflect(brd);
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','-25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("should use passed arguments if provided and perform a reflection", function() {
      command = new transform.reflect(brd, {
        figure: "A1", 
        line: 'Y'});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("should work on a single point", function() {
      command = new transform.reflect(brd, {
        figure: "A0", 
        line: 'Y'});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','25.00'])).to.be.true;
    });
    it("can be undone", function() {
      command = new transform.reflect(brd);
      command.execute();
      command.remove();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
  describe("transform.shear command", function() {
    it("should receive arguments from DOM if not provided and perform a shear", function() {
      command = new transform.shear(brd);
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-5.37','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("should use passed arguments if provided and perform a shear", function() {
      command = new transform.shear(brd, {
        figure: "A1", 
        degrees: '45'});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-5.37','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("can be undone", function() {
      command = new transform.shear(brd);
      command.execute();
      command.remove();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
  describe("transform.translate command", function() {
    it("should receive arguments from DOM if not provided and perform a translate", function() {
      command = new transform.translate(brd);
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','0.00'])).to.be.true;
    });
    it("should use passed arguments if provided and perform a translate", function() {
      command = new transform.translate(brd, {
        figure: "A1", 
        values: [25,0]});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','25.00','0.00'])).to.be.true;
    });
    it("should work on a single point", function() {
      command = new transform.translate(brd, {
        figure: "A0", 
        values: [25, 0]});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','25.00'])).to.be.true;
    });
    it("can be undone", function() {
      command = new transform.translate(brd);
      command.execute();
      command.remove();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
  describe("transform.scale command", function() {
    before(function() {
      $('input[name="values"]').val('2.0,1.0');
    })
    it("should receive arguments from DOM if not provided and perform a scale", function() {
      command = new transform.scale(brd);
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-50.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-50.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("should use passed arguments if provided and perform a scale", function() {
      command = new transform.scale(brd, {
        figure: "A1", 
        values: [2.0,1.0]});
      command.execute();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-50.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-50.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
    it("can be undone", function() {
      command = new transform.scale(brd);
      command.execute();
      command.remove();
      expect(brd.points.A.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','25.00'])).to.be.true;
      expect(brd.points.B.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','-25.00','0.00'])).to.be.true;
      expect(brd.points.C.coords.usrCoords.map(function(e) { return e.toFixed(2)}).equals(['1.00','0.00','0.00'])).to.be.true;
    });
  });
});