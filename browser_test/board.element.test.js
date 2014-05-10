var element = require('../public/app/board/element');

describe("BoardElement Factory", function() {
  var brd, a, b, c, p;
  before(function(done) {
    document.body.innerHTML = window.__html__['browser_test/fixtures/board.html'];
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
  afterEach(function(done) {
    brd.removeObject(brd.shapes.pop());
    done();
  });
  describe("circleElement", function() {
    before(function(done) {
      var options = {
        radius: 25,
        center: [0, 0]
      };
      p = new element(brd, "circle", options);
      done();
    });
    it("should draw a circle", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Circle);
      brd.shapes[0].should.be.instanceof(JXG.Circle);
    });
  });
  describe("angleElement", function() {
    before(function(done) {
      var options = {
        point1: [0, 0],
        point2: [10, 10],
        point3: [-10, -10]
      };
      p = new element(brd, "angle", options);
      done();
    });
    it("should draw an angle", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Curve);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
  });
  describe("arcElement", function() {
    before(function(done) {
      var options = {
        point1: [0, 0],
        point2: [10, 10],
        point3: [-10, -10]
      };
      p = new element(brd, "arc", options);
      done();
    });
    it("should draw an arc", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Curve);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
  });
  describe("ellipseElement", function() {
    before(function(done) {
      var options = {
        point1: [0, 0],
        point2: [10, 10],
        point3: [-10, -10]
      };
      p = new element(brd, "ellipse", options);
      done();
    });
    it("should draw an ellipse", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Curve);
      brd.shapes[0].should.be.instanceof(JXG.Curve);
    });
  });
  describe("segmentElement", function() {
    before(function(done) {
      var options = {
        point1: [0, 0],
        point2: [10, 10],
      };
      p = new element(brd, "segment", options);
      done();
    });
    it("should draw a segment", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Line);
      brd.shapes[0].should.be.instanceof(JXG.Line);
    });
  });
  describe("lineElement", function() {
    before(function(done) {
      var options = {
        point1: [0, 0],
        point2: [10, 10],
      };
      p = new element(brd, "line", options);
      done();
    });
    it("should draw a line", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Line);
      brd.shapes[0].should.be.instanceof(JXG.Line);
    });
  });
  describe("polygonElement", function() {
    before(function(done) {
      var options = {
        point1: [-25, 25],
        point2: [-25, 0],
        point3: [0, 0]
      };
      p = new element(brd, "polygon", options);
      done();
    });
    it("should draw a polygon", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Polygon);
      brd.shapes[0].should.be.instanceof(JXG.Polygon);
    });
  });
  describe("pointElement", function() {
    before(function(done) {
      var options = {
        point: [0, 0],
      };
      p = new element(brd, "point", options);
      done();
    });
    it("should draw a point", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Point);
      brd.points.A.should.be.instanceof(JXG.Point);
    });
    after(function(done) {
      brd.removeObject(brd.points.A);
      done();
    });
  });
  describe("textElement", function() {
    before(function(done) {
      var options = {
        position: [0, 0],
        size: 25,
        text: "test test"
      };
      p = new element(brd, "text", options);
      done();
    });
    it("should draw text", function() {
      p = p.draw();
      p.should.be.an.instanceof(JXG.Text);
      p.content.should.equal("'' + 'test test'");
      brd.shapes[0].should.be.instanceof(JXG.Text);
    });
  });
});
