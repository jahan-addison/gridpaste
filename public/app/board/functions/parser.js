/*
 * Geometry Function Parser
 */

var lexer = require('./lexer');

var Parser = function(expr) {
  this.llex       = new lexer(expr);
  this._arguments = [];
  this._identifier;
};

Parser.prototype = (function() {
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

  var token_strings = Object.freeze({
    tokens.T_UNKNOWN:     "T_UNKNOWN",
    tokens.T_INTEGER:     "T_INTEGER",
    tokens.T_FLOAT:       "T_FLOAT",
    tokens.T_LETTER:      "T_LETTER",
    tokens.T_OPEN_PAREN:  "T_OPEN_PAREN",
    tokens.T_CLOSE_PAREN: "T_CLOSE_PAREN",
    tokens.T_COMMA:       "T_COMMA",
    tokens.T_IDENTIFIER:  "T_IDENTIFIER",
    tokens.T_EQUAL:       "T_EQUAL",
    tokens.T_LABEL:       "T_LABEL",
    tokens.T_EOL:         "T_EOL"
  });

  var t_error(token, expected) {
    var msg = ["Unexpected token: ",
      token_strings[token],
      ", expected ",
      token_strings[expected]
    ].join('');
    throw new Error(msg);
  }

  var accept  = function(t) {
    this.llex.getNextToken();
    if (t instanceof Array) {
      var isIn = false;
      t.forEach(function(e) {
        if (e == this.llex.current_token) {
          isIn = true;
        }
      });
      if (!isIn) {
        t_error(this.llex.current_token, t);
      }
    }
    if (this.llex.current_token !== t) {
        t_error(this.llex.current_token, t);
    }
    return true;
  };

  return {
    Constructor: Parser,
    parse: function() {
      accept.call(this, [T_LABEL, T_EQUAL]);
      if (!this.llex.current_token == T_LABEL) {
        accept.call(this, T_LABEL);
      }
      this._identifier = this.llex.scanner;
      accept.call(this, T_OPEN_PAREN);
      while(this.llex.current_token !== T_CLOSE_PAREN) {
        accept.call(this, [T_LABEL, T_LETTER, T_INTEGER, T_FLOAT]);
        this._arguments.push(this.llex.scanner);
        accept.call(this, T_COMMA);                
      }
      accept.call(this, T_CLOSE_PAREN);
    }
  }

})();