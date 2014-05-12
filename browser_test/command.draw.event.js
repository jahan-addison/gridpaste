var draw = require('../public/app/events/draw');

describe("draw Command concrete", function() {
  var brd, command;
  before(function(done) {
    document.body.innerHTML = window.__html__['browser_test/fixtures/draw.html'];
    brd = JXG.JSXGraph.initBoard('grid', {
      boundingbox:     [-50, 50, 50, -50],
      keepaspectratio: true,
      showCopyright:   false,
      showNavigation:  false,
      axis:            true
      });
    brd.points = {};
    brd.shapes = [];
    done();
  });
  afterEach(function() {
    try { command.remove(); } catch(e) {}
  });
  describe("draw.circle command", function() {
    it("should receive arguments from DOM if not provided and draw a circle", function() {
      command = new draw.circle(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Circle);
    });
    it("should use passed arguments if provided and draw a circle", function() {
      command = new draw.circle(brd, {
        center: [0, 0], 
        radius: 25});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Circle);
    });
    it("can be undone", function() {
      command = new draw.circle(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
      expect(brd.points.A).to.be.undefined;
    });
  });
  describe("draw.angle command", function() {
    it("should receive arguments from DOM if not provided and draw an angle", function() {
      command = new draw.angle(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
    it("should use passed arguments if provided and draw an angle", function() {
      command = new draw.angle(brd, {
        point1: [-25,25], 
        point2: [-25,0],
        point3: [0,0]});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
    it("can be undone", function() {
      command = new draw.angle(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
      expect(brd.points.A).to.be.undefined;
      expect(brd.points.B).to.be.undefined;
      expect(brd.points.C).to.be.undefined;
    });
  });
  describe("draw.arc command", function() {
    it("should receive arguments from DOM if not provided and draw an arc", function() {
      command = new draw.arc(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
    it("should use passed arguments if provided and draw an arc", function() {
      command = new draw.arc(brd, {
        point1: [-25,25], 
        point2: [-25,0],
        point3: [0,0]});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
    it("can be undone", function() {
      command = new draw.arc(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
      expect(brd.points.A).to.be.undefined;
      expect(brd.points.B).to.be.undefined;
      expect(brd.points.C).to.be.undefined;
    });
  });
  describe("draw.ellipse command", function() {
    it("should receive arguments from DOM if not provided and draw an ellipse", function() {
      command = new draw.ellipse(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
    it("should use passed arguments if provided and draw an ellipse", function() {
      command = new draw.ellipse(brd, {
        point1: [-25,25], 
        point2: [-25,0],
        point3: [0,0]});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
    it("can be undone", function() {
      command = new draw.ellipse(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
    });
  });
  describe("draw.segment command", function() {
    it("should receive arguments from DOM if not provided and draw a segment", function() {
      command = new draw.segment(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Line);
    });
    it("should use passed arguments if provided and draw a segment", function() {
      command = new draw.segment(brd, {
        point1: [-25,25], 
        point2: [-25,0]});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Line);
    });
    it("can be undone", function() {
      command = new draw.segment(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
      expect(brd.points.A).to.be.undefined;
      expect(brd.points.B).to.be.undefined;
    });
  });
  describe("draw.line command", function() {
    it("should receive arguments from DOM if not provided and draw a line", function() {
      command = new draw.line(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Line);
    });
    it("should use passed arguments if provided and draw a line", function() {
      command = new draw.line(brd, {
        point1: [-25,25], 
        point2: [-25,0]});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Line);
    });
    it("can be undone", function() {
      command = new draw.line(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
      expect(brd.points.A).to.be.undefined;
      expect(brd.points.B).to.be.undefined;
    });
  });
  describe("draw.polygon command", function() {
    it("should receive arguments from DOM if not provided and draw a polygon", function() {
      command = new draw.polygon(brd);
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Polygon);
    });
    it("should use passed arguments if provided and draw a polygon", function() {
      command = new draw.polygon(brd, {
        point1: [-25,25], 
        point2: [-25,0],
        point3: [0,0]});
      command.execute();
      expect(brd.shapes.length).to.equal(1);
      brd.shapes[0].should.be.instanceof(JXG.Polygon);
    });
    it("can be undone", function() {
      command = new draw.polygon(brd);
      command.execute();
      command.remove();
      expect(brd.shapes.length).to.equal(0);
      expect(brd.points.A).to.be.undefined;
      expect(brd.points.B).to.be.undefined;
      expect(brd.points.C).to.be.undefined;
    });
  });
  describe("draw.point command", function() {
    it("should receive arguments from DOM if not provided and draw a point", function() {
      command = new draw.point(brd);
      command.execute();
      brd.points.A.should.be.instanceof(JXG.Point);
    });
    it("should use passed arguments if provided and draw a point", function() {
      command = new draw.point(brd, {
        point: [-25,25]});
      command.execute();
      brd.points.A.should.be.instanceof(JXG.Point);
    });
    it("can be undone", function() {
      command = new draw.point(brd);
      command.execute();
      command.remove();
      expect(brd.points.A).to.be.undefined;
    });
  });
});