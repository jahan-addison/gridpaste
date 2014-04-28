/*
 * Geometry Function Tokenizer
 */

 var Lexer = function(expr) {
  this.current_token;
  this.expr    = expr;
  this.pointer = 0;
  this.scanner;
 };
 Lexer.prototype = (function() {
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
  var skipWhitespace = function() {
    while(/[\s\t\n]/.test(this.expr[this.pointer])) {
      this.pointer++;
    }
  }
  return {
    Constructor: Lexer,
    // @todo: refactor with indexOf
    getNextToken: function() {
      skipWhitespace.call(this);
      this.scanner = undefined;
      // T_IDENTIFIER
      if (/[a-z]/.test(this.expr[this.pointer])) {
        this.scanner = '';
        while(/[a-z]/.test(this.expr[this.pointer])) {
          this.scanner += this.expr[this.pointer];
          this.pointer++;
        }
        return this.current_token = tokens.T_IDENTIFIER;
      }
      // T_OPEN_PAREN
      if (/\(/.test(this.expr[this.pointer])) {
        this.pointer++;
        return this.current_token = tokens.T_OPEN_PAREN;
      }
      // T_CLOSE_PAREN
      if (/\)/.test(this.expr[this.pointer])) {
        this.pointer++;
        return this.current_token = tokens.T_CLOSE_PAREN;
      }
      // T_COMMA
      if (/,/.test(this.expr[this.pointer])) {
        this.pointer++;
        return this.current_token = tokens.T_COMMA;
      }
      // T_EQUAL
      if (/\=/.test(this.expr[this.pointer])) {
        this.pointer++;
        return this.current_token = tokens.T_EQUAL;
      }
      // T_LETTER
      if (/[A-Z]/.test(this.expr[this.pointer])) {
        var token;
        this.scanner = this.expr[this.pointer];
        this.pointer++;
        if (/[0-9]/.test(this.expr[this.pointer])) {
          // T_LABEL
          while(/[0-9]/.test(this.expr[this.pointer])) {
            this.scanner += this.expr[this.pointer];
            this.pointer++;
          }                  
        }
        return this.current_token = tokens.T_LETTER;
      }
      // T_INTEGER
      if (/[0-9]/.test(this.expr[this.pointer])) {
        this.scanner = '';
        var token;
        while(/[0-9]/.test(this.expr[this.pointer])) {
          this.scanner += this.expr[this.pointer];
          this.pointer++;
            // T_FLOAT
          if (this.expr[this.pointer] === '.') {
            if (token) {
              return this.current_token = tokens.T_UNKNOWN;
            }
            this.scanner       += this.expr[this.pointer++];
            this.current_token  = token = tokens.T_FLOAT;
          }
        }
        return this.current_token = (token || tokens.T_INTEGER);
      }
      // T_EOL
      if (this.pointer === this.expr.length) {
        return this.current_token = tokens.T_EOL;
      }
      // T_UNKNOWN
      return this.current_token = tokens.T_UNKNOWN;
    },
  }
 })();