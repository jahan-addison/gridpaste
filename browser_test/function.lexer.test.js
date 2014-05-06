var Lexer = require('../public/app/board/functions/lexer');

describe("Geometry Function Tokenizer", function() {

  var tokens = Object.freeze({
    T_UNKNOWN:     1,
    T_INTEGER:     2,
    T_FLOAT:       3,
    T_LETTER:      4,
    T_OPEN_PAREN:  5,
    T_CLOSE_PAREN: 6,
    T_COMMA:       7,
    T_IDENTIFIER:  8,
    T_EQUAL:       9,
    T_LABEL:       10,
    T_EOL:         11
  });
  var llex_test;

  describe("#getNextToken", function() {
    describe("T_UNKNOWN", function() {
      it('should return T_UNKNOWN', function() {
        llex_test = new Lexer("$%^");
        expect(llex_test.getNextToken()).to.equal(tokens.T_UNKNOWN);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("    ^!@     ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_UNKNOWN);
      });
      it('should pass unknown character to scanner pointer', function() {
        llex_test = new Lexer("   .$%   ");
        llex_test.getNextToken();
        expect(llex_test.scanner).to.equal('.');
      });
    });
    describe("T_INTEGER", function() {
      it('should return T_INTEGER', function() {
        llex_test = new Lexer("12345");
        expect(llex_test.getNextToken()).to.equal(tokens.T_INTEGER);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("   123456   ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_INTEGER);
      });
      it('should pass integer to scanner pointer', function() {
        llex_test = new Lexer(" 5634");
        llex_test.getNextToken();
        expect(llex_test.scanner).to.equal('5634');
      });      
    });
    describe("T_FLOAT", function() {
      it('should return T_FLOAT', function() {
        llex_test = new Lexer("55.5512");
        expect(llex_test.getNextToken()).to.equal(tokens.T_FLOAT);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("    24.551    ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_FLOAT);
      });
      it('should pass float to scanner pointer', function() {
        llex_test = new Lexer(" 10.192");
        llex_test.getNextToken();
        expect(llex_test.scanner).to.equal('10.192');
      });      
    });
    describe("T_LETTER", function() {
      it('should return T_LETTER', function() {
        llex_test = new Lexer("A");
        expect(llex_test.getNextToken()).to.equal(tokens.T_LETTER);
      });
      it('should be uppercase', function() {
        llex_test = new Lexer("a");
        expect(llex_test.getNextToken()).to.not.equal(tokens.T_LETTER);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("    N    ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_LETTER);
      });
      it('should pass letter to scanner pointer', function() {
        llex_test = new Lexer(" Z");
        llex_test.getNextToken();
        expect(llex_test.scanner).to.equal('Z');
      });      
    });
    describe("T_OPEN_PAREN", function() {
      it('should return T_OPEN_PAREN', function() {
        llex_test = new Lexer("(");
        expect(llex_test.getNextToken()).to.equal(tokens.T_OPEN_PAREN);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("   (   ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_OPEN_PAREN);
      });      
    });
    describe("T_CLOSE_PAREN", function() {
      it('should return T_CLOSE_PAREN', function() {
        llex_test = new Lexer(")");
        expect(llex_test.getNextToken()).to.equal(tokens.T_CLOSE_PAREN);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("   )   ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_CLOSE_PAREN);
      });      
    });
    describe("T_COMMA", function() {
      it('should return T_COMMA', function() {
        llex_test = new Lexer(",");
        expect(llex_test.getNextToken()).to.equal(tokens.T_COMMA);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("   ,   ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_COMMA);
      });      
    });
    describe("T_IDENTIFIER", function() {
      it('should return T_IDENTIFIER', function() {
        llex_test = new Lexer("abcdef");
        expect(llex_test.getNextToken()).to.equal(tokens.T_IDENTIFIER);
      });
      it('should be lowercase', function() {
        llex_test = new Lexer("ABC");
        expect(llex_test.getNextToken()).to.not.equal(tokens.T_IDENTIFIER);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("    abcdef    ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_IDENTIFIER);
      });
      it('should pass identifier to scanner pointer', function() {
        llex_test = new Lexer(" abcde");
        llex_test.getNextToken();
        expect(llex_test.scanner).to.equal('abcde');
      });      
    });
    describe("T_EQUAL", function() {
      it('should return T_EQUAL', function() {
        llex_test = new Lexer("=");
        expect(llex_test.getNextToken()).to.equal(tokens.T_EQUAL);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("   =   ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_EQUAL);
      });      
    });
    describe("T_LABEL", function() {
      it('should return T_LABEL', function() {
        llex_test = new Lexer("A12");
        expect(llex_test.getNextToken()).to.equal(tokens.T_LABEL);
      });
      it('should pass label to scanner pointer', function() {
        llex_test = new Lexer("Z56");
        llex_test.getNextToken();
        expect(llex_test.scanner).to.equal('Z56');
      });      
      it('should begin with single uppercase letter', function() {
        llex_test = new Lexer("AB56");
        expect(llex_test.getNextToken()).to.not.equal(tokens.T_LABEL);
        llex_test = new Lexer("abc56");        
        expect(llex_test.getNextToken()).to.not.equal(tokens.T_LABEL);
      });
      it('should end with an integer', function() {
        llex_test = new Lexer("A56");
        expect(llex_test.getNextToken()).to.equal(tokens.T_LABEL);
        expect(llex_test.scanner.split(/[A-Z]/g)[1]).to.equal('56');
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("    Q15    ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_LABEL);
      });
    });
    describe("T_EOL", function() {
      it('should return EOL', function() {
        llex_test = new Lexer("A");
        llex_test.getNextToken(); // pass 'A'
        expect(llex_test.getNextToken()).to.equal(tokens.T_EOL);
      });
      it('should skip whitespace', function() {
        llex_test = new Lexer("      ");
        expect(llex_test.getNextToken()).to.equal(tokens.T_EOL);
      });      
    });
  });
});