var point = require('../public/app/board/point');
var shape = require('../public/app/board/shape');

describe("Shape", function() {
  var brd, a, b;
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
  describe("#add", function() {
    before(function(done) {
      a = new point(brd, [0, 0]).add();
      b = new shape(brd, "circle", [a, 25, [a]]).add();
      done();
    });
    it("should construct a shape", function() {
      b.should.be.instanceof(JXG.Circle);
      brd.shapes[0].should.be.instanceof(JXG.Circle);
      expect(brd.shapes[0].name).to.equal("A1");
      expect(brd.shapes[0].radius).to.equal(25);
      expect(brd.shapes[0].center).to.equal(a);
    });
  });
})