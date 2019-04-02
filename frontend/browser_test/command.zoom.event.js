var zoom = require('../app/javascripts/events/zoom');

describe("zoom Command concrete", function() {
  var brd, command;
  before(function(done) {
    document.body.innerHTML = window.__html__['browser_test/fixtures/zoom.html'];
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
    brd.zoom100();
  });
  describe("zoom.in command", function() {
    it("should zoom in", function() {
      command = new zoom.zoomIn(brd);
      command.execute();
      brd.zoomX.should.equal(1.25);
      brd.zoomY.should.equal(1.25);
    });
    it("can be undone", function() {
      command = new zoom.zoomIn(brd);
      command.execute();
      command.remove();
      brd.zoomX.should.equal(1);
      brd.zoomY.should.equal(1);
    });
  });
  describe("zoom.out command", function() {
    it("should zoom out", function() {
      command = new zoom.zoomOut(brd);
      command.execute();
      brd.zoomX.should.equal(0.8);
      brd.zoomY.should.equal(0.8);
    });
    it("can be undone", function() {
      command = new zoom.zoomOut(brd);
      command.execute();
      command.remove();
      brd.zoomX.should.equal(1);
      brd.zoomY.should.equal(1);
    });
  });
});