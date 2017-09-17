/*
 * Geometry Function Tokenizer
 */

 var Lexer = function(expr) {
  this.current_token;
  this.expr    = expr;
  this._pointer = 0;
  this._scanner;
  Object.defineProperty(this, "scanner", {
    get: function() { return this._scanner; }
  });
  Object.defineProperty(this, "pointer", {
    get: function() { return this._pointer; }
  });
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
    T_EXPR:        11,
    T_EOL:         12
  });
  var skipWhitespace = function() {
    while(/[\s\t\n]/.test(this.expr[this._pointer])) {
      this._pointer++;
    }
  };
  return {
    Constructor: Lexer,
    getNextToken: function() {
      skipWhitespace.call(this);
      this._scanner = undefined;
      // T_EOL
      if (this._pointer >= this.expr.length) {
        return this.current_token = tokens.T_EOL;
      }
      // T_EXPR
      if (/^.*?\bx\b.*?$/.test(this.expr)) {
        this._scanner = this.expr;
        this._pointer = this._scanner.length;
        return this.current_token = tokens.T_EXPR;
      }
      // T_IDENTIFIER
      if (/[a-z]/.test(this.expr[this._pointer])) {
        this._scanner = '';
        while(/[a-z]/.test(this.expr[this._pointer]) &&
          !(this._pointer >= this.expr.length)) {
          this._scanner += this.expr[this._pointer];
          this._pointer++;
        }
        return this.current_token = tokens.T_IDENTIFIER;
      }
      // T_OPEN_PAREN
      if (/\(/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_OPEN_PAREN;
      }
      // T_CLOSE_PAREN
      if (/\)/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_CLOSE_PAREN;
      }
      // T_COMMA
      if (/,/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_COMMA;
      }
      // T_EQUAL
      if (/\=/.test(this.expr[this._pointer])) {
        this._pointer++;
        return this.current_token = tokens.T_EQUAL;
      }
      // T_LETTER
      if (/[A-Z]/.test(this.expr[this._pointer])) {
        var token;
        this._scanner = this.expr[this._pointer];
        this._pointer++;
        if (/[0-9]/.test(this.expr[this._pointer])) {
          // T_LABEL
          while(/[0-9]/.test(this.expr[this._pointer]) &&
          !(this._pointer >= this.expr.length)) {
            token = tokens.T_LABEL;
            this._scanner += this.expr[this._pointer];
            this._pointer++;
          }                  
        }
        return this.current_token = (token || tokens.T_LETTER);
      }
      // T_INTEGER
      if (/[0-9]/.test(this.expr[this._pointer])) {
        this._scanner = '';
        var token;
        while(/[0-9]/.test(this.expr[this._pointer]) &&
          !(this._pointer >= this.expr.length)) {
          this._scanner += this.expr[this._pointer];
          this._pointer++;
            // T_FLOAT
          if (this.expr[this._pointer] === '.') {
            if (token) {
              this._scanner             = this.expr[this._pointer];
              return this.current_token = tokens.T_UNKNOWN;
            }
            this._scanner       += this.expr[this._pointer++];
            this.current_token  = token = tokens.T_FLOAT;
          }
        }
        return this.current_token = (token || tokens.T_INTEGER);
      }
      // T_UNKNOWN
      this._scanner             = this.expr[this._pointer];
      return this.current_token = tokens.T_UNKNOWN;
    },
  };
})();

module.exports = Lexer;