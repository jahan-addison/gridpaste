var Lexer = require('./lexer');

/*
 * Geometry Function Parser
 */

var Parser = function(expr) {
  this.llex       = new Lexer(expr);
  this._arguments = [];
  this._identifier;
  Object.defineProperty(this, "arguments", {
    get: function() { return this._arguments; }
  });
  Object.defineProperty(this, "identifier", {
    get: function() { return this._identifier; }
  });
  Object.defineProperty(this, "object", {
    get: function() {return {
        'identifier': this._identifier, 
        'arguments':  this._arguments
      };
    }
  });
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
    T_EXPR:        11,
    T_EOL:         12
  });

  var token_strings = Object.freeze({
    1:     "unknown",
    2:     "integer",
    3:       "float",
    4:      "letter",
    5:           "(",
    6:           ")",
    7:           ",",
    8:  "identifier",
    9:           "=",
    10:      "label",
    11: "expression",
    12:        "EOL"
  });

  var t_error = function(llex, token, expected) {
    if (expected instanceof Array) {
      expected = expected[0];
    }
    var unexpected = (token_strings[token] == "unknown") ?
      llex.scanner : token_strings[token];    
    var msg = ["Unexpected token: '",
      unexpected,
      "', expected ",
      token_strings[expected]
    ].join('');
    throw new Error(msg);
  };

  var accept  = function(t) {
    this.llex.getNextToken();
    if (t instanceof Array) {
      var isIn = false, lex  = this.llex;
      t.forEach(function(e) {
        if (e == lex.current_token) {
          isIn  = true;
        }
      });
      if (!isIn) {
        t_error(this.llex, this.llex.current_token, t);
        return false;
      }
    } else if (this.llex.current_token !== t) {
        t_error(this.llex, this.llex.current_token, t);
        return false;
    }
    return this.llex.current_token;
  };
    
  return {
    Constructor: Parser,
    run: function() {
      if (this.llex.expr[this.llex.pointer] == '=') {
        accept.call(this, tokens.T_EQUAL);
      }
      accept.call(this, [tokens.T_EXPR, tokens.T_IDENTIFIER]);
      if (this.llex.current_token == tokens.T_EXPR) {
        this._arguments.push({argument: this.llex.scanner, type: token_strings[tokens.T_EXPR]});
      } else {
        this._identifier = this.llex.scanner;
        accept.call(this, [tokens.T_OPEN_PAREN]);
        var token;
        do {
          token = accept.call(this, [tokens.T_LABEL, tokens.T_LETTER, tokens.T_INTEGER, tokens.T_FLOAT]);
          this._arguments.push({argument: this.llex.scanner, type: token_strings[token]});
        } while(accept.call(this, [tokens.T_COMMA, tokens.T_CLOSE_PAREN]) == tokens.T_COMMA);
      }
    accept.call(this, tokens.T_EOL);
    }
  };
})();

module.exports = Parser;
