var func   = require('../public/app/events/function'),
    shape  = require('../public/app/board/shape'),
    point  = require('../public/app/board/point'),
    Parser = require('../public/app/board/functions/parser');

describe("function Command concrete", function() {
  var brd, command;
  before(function(done) {
    document.body.innerHTML = window.__html__['browser_test/fixtures/function.html'];
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
  describe("function.angle command", function() {
    before(function(done) {
      var p1 = new point(brd, [-25,25]).add(),
          p2 = new point(brd, [-25,0]).add();
          p3 = new point(brd, [0,0]).add();
      new shape(brd, "polygon", 
        [p1, p2, p3, [p1,p2,p3]]
      ).add();
      done();
    });
    beforeEach(function() {
      $('.function').eq(0).val('=angle(C,B,A)');
    });
    it("should accept a 3-ary function", function() {
      $('.function').eq(0).val('=angle(C,B)');
      expect(function() { command = new func.angle(brd); }).to.throw("requires 3 points");
    });
    it("should accept 3 letters (points)", function() {
      $('.function').eq(0).val('=angle(A1,B,C)');
      expect(function() { command = new func.angle(brd); }).to.throw("invalid argument types");
    });
    it("should compute the angle from a user-called form", function() {
      command = new func.angle(brd);
      expect(function() { command.execute(); }).to.not.throw();
    });
    it("should compute the angle from imported arguments", function() {
      var parser = new Parser($('.function').eq(0).val());
      parser.run();
      command = new func.angle(brd, parser.arguments);
      expect(function() { command.execute(); }).to.not.throw();
    });
    it("should add an annotation of the angle to the board", function() {
      command = new func.angle(brd);
      expect(function() { command.execute(); }).to.not.throw();
      brd.shapes[1].should.be.instanceof(JXG.Text);
      brd.shapes[1].content.should.equal("'' + '∠CBA: 90°'")
    });
    it("can be undone", function() {
      command = new func.angle(brd);
      expect(function() { command.execute(); }).to.not.throw();
      command.remove();
      brd.shapes.length.should.equal(1);
    });
  });
  describe("function.area command", function() {
    beforeEach(function() {
      $('.function').eq(0).val('=angle(A1)');
    });
    describe("polymorphism", function() {
      describe("circle", function() {
        beforeEach(function(done) {
          var p1 = new point(brd, [10,10]).add();
          new shape(brd, "circle", 
            [p1, 25, [p1]]
          ).add();
          done();
        });
        afterEach(function() {
          brd.removeObject(brd.points.A);
          brd.removeObject(brd.shapes.pop());
        })
        it("should accept 1 label", function() {
          $('.function').eq(0).val('=area(H)');
          expect(function() { command = new func.area(brd); }).to.throw("structure not found");
        });
        it("should compute the area from a user-called form", function() {
          expect(function() { command = new func.area(brd); }).to.not.throw();
        });
        it("should compute the angle from imported arguments", function() {
          var parser = new Parser($('.function').eq(0).val());
          parser.run();
          command = new func.area(brd, parser.arguments);
          expect(function() { command.execute(); }).to.not.throw();
        });
        it("should add an annotation of the angle to the board", function() {
          command = new func.area(brd);
          expect(function() { command.execute(); }).to.not.throw();
          brd.shapes[1].should.be.instanceof(JXG.Text);
          brd.shapes[1].content.should.equal("'' + 'Area: 1963.50'")
        });
        it("can be undone", function() {
          command = new func.area(brd);
          expect(function() { command.execute(); }).to.not.throw();
          command.remove();
          brd.shapes.length.should.equal(1);
        });
      });
      describe("polygon", function() {
        beforeEach(function(done) {
          var p1 = new point(brd, [-25,25]).add(),
              p2 = new point(brd, [-25,0]).add();
              p3 = new point(brd, [0,0]).add();
          new shape(brd, "polygon", 
            [p1, p2, p3, [p1,p2,p3]]
          ).add();
          done();
        });
        afterEach(function() {
          brd.removeObject(brd.points.A);
          brd.removeObject(brd.shapes.pop());
        })
        it("should accept 1 label", function() {
          $('.function').eq(0).val('=area(H)');
          expect(function() { command = new func.area(brd); }).to.throw("structure not found");
        });
        it("should compute the area from a user-called form", function() {
          expect(function() { command = new func.area(brd); }).to.not.throw();
        });
        it("should compute the angle from imported arguments", function() {
          var parser = new Parser($('.function').eq(0).val());
          parser.run();
          command = new func.area(brd, parser.arguments);
          expect(function() { command.execute(); }).to.not.throw();
        });
        it("should add an annotation of the angle to the board", function() {
          command = new func.area(brd);
          expect(function() { command.execute(); }).to.not.throw();
          brd.shapes[1].should.be.instanceof(JXG.Text);
          brd.shapes[1].content.should.equal("'' + 'Area: 312.50'")
        });
        it("can be undone", function() {
          command = new func.area(brd);
          expect(function() { command.execute(); }).to.not.throw();
          command.remove();
          brd.shapes.length.should.equal(1);
        });
      });
    });
  });
});