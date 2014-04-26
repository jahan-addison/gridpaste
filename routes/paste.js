/*
 * Pastes
 */

 var Paste = require ('../environment/pastes/pastes');

exports.action = function(req, res) {
    require('crypto').pseudoRandomBytes(4, function(ex, buf) {
      var token = buf.toString('hex');
      console.log(token);
      new Paste({id: token, user: 'Anon', paste: req.body.paste}).save();      
      res.send();
    });
};
  