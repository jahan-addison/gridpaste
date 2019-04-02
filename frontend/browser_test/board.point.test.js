var point = require('../app/javascripts/board/point');

describe("Point", function() {
  var brd, a;
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
    done();
  });
  describe("#add", function() {
    before(function(done) {
      a = new point(brd, [10, -10]);
      done();
    });
    it("should construct a point", function() {
      a = a.add();
      a.should.be.instanceof(JXG.Point);
      brd.points.A.should.be.instanceof(JXG.Point);
      expect(brd.points.A.coords.usrCoords[0]).to.equal(1);
      expect(brd.points.A.coords.usrCoords[1]).to.equal(10);
      expect(brd.points.A.coords.usrCoords[2]).to.equal(-10);
    });
  });
})