var Parser = require('../public/app/board/functions/parser');

describe("Geometry Function Parser", function() {

  var parse;

  describe("#run", function() {
    it("should parse an identifier first", function() {
      parse = new Parser("");
      expect(function() { parse.run(); }).to.throw("Unexpected token: 'EOL', expected identifier"); 
      parse = new Parser("test(A)");
      expect(function() { parse.run(); }).to.not.throw();
    });
    it("can parse '=' before an identifier", function() {
      parse = new Parser("=test(A)");
      expect(function() { parse.run(); }).to.not.throw();
    });
    it("should set identifier pointer", function() {
      parse = new Parser("=abcde(B)");
      parse.run();
      expect(parse.identifier).to.equal("abcde");
    });
    it("should parse '(' after identifier", function() {
      parse = new Parser("abcde5(B)");
      expect(function() { parse.run(); }).to.throw("Unexpected token: 'integer', expected ("); 
      parse = new Parser("abcde(B5)");
      expect(function() { parse.run(); }).to.not.throw();      
    });
    describe("Arguments", function() {
      it("can be a label", function() {
        parse = new Parser("test(A1)");
        expect(function() { parse.run(); }).to.not.throw();
      });
      it("can be a letter", function() {
        parse = new Parser("test(B)");
        expect(function() { parse.run(); }).to.not.throw();
      });
      it("can be an integer", function() {
        parse = new Parser("test(5)");
        expect(function() { parse.run(); }).to.not.throw();        
      });
      it("can be a float", function() {
        parse = new Parser("test(5.5)");
        expect(function() { parse.run(); }).to.not.throw();                
      });
      it("can have arguments separated by ,", function() {
        parse = new Parser("test(1.2,3.333)");
        expect(function() { parse.run(); }).to.not.throw();                
        parse = new Parser("test(1.2Q1");
        expect(function() { parse.run(); }).to.throw("Unexpected token: 'label', expected ,");                   
      });
    });
    it("should parse ) after arguments", function() {
      parse = new Parser("test(1.2,2.3,4.5,6.7)");      
      expect(function() { parse.run(); }).to.not.throw();                
    });
    it("should set arguments pointer", function() {
      parse = new Parser("test(A,5)");
      parse.run();
      expect(parse.arguments.length).to.equal(2);
      expect(parse.arguments[0].argument).to.equal('A');
      expect(parse.arguments[0].type).to.equal("letter");
      expect(parse.arguments[1].argument).to.equal('5');
      expect(parse.arguments[1].type).to.equal('integer');      
    });
    it("should parse EOL after )", function() {
      parse = new Parser("test(A);");
      expect(function() { parse.run(); }).to.throw("Unexpected token: ';', expected EOL");                   
    });
    it("should set a composite parsed object pointer", function() {
      parse = new Parser("test(A,B)");
      parse.run();
      expect(parse.object).to.exist;
      expect(parse.object.identifier).to.equal("test");
      expect(parse.object.arguments.length).to.equal(2);
    });
  });
});