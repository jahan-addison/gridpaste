var draw = require('../public/app/events/draw'),
    misc = require('../public/app/events/misc');

describe("misc Command concrete", function() {
  var brd, command, circle;
  before(function(done) {
    document.body.innerHTML = window.__html__['browser_test/fixtures/delete.html'];
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
  beforeEach(function() {
    circle  = new draw.circle(brd);
    circle.execute();
  });
  afterEach(function() {
    try { command.remove(); } catch(e) {}
    circle.remove();
  });
  describe("misc.delete_ command", function() {
    it("should receive arguments from DOM if not provided and 'delete' a figure", function() {
      command = new misc.delete_(brd);
      command.execute();
      brd.shapes[0].isVisible.should.be.false;
    });
    it("should use passed arguments if provided and 'delete' a figure", function() {
      command = new misc.delete_(brd, {
        figure: 'A1'}
      );
      command.execute();
      brd.shapes[0].isVisible.should.be.false;
    });
    it("can be undone", function() {
      command = new misc.delete_(brd);
      command.execute();
      brd.shapes[0].isVisible.should.be.false;
      command.remove();
      brd.shapes[0].isVisible.should.be.true;
    });
  });
});