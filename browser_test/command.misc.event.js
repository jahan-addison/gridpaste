var draw = require('../public/app/events/draw'),
    misc = require('../public/app/events/misc');

describe("msic Command concrete", function() {
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
  describe("misc.delete_ command", function() {
    it("should receive arguments from DOM if not provided and delete a figure", function() {
    });
    it("should use passed arguments if provided and delete a figure", function() {
    });
    it("can be undone", function() {
    });
  });
});