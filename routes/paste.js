/*
 * Pastes
 */

 var Paste = require ('../environment/pastes/pastes');

exports.action = function(req, res) {
  req.checkBody('title', 'Please give a title!').notEmpty();
  req.checkBody('paste', 'Invalid paste JSON!').notEmpty().isJSON();

  require('crypto').pseudoRandomBytes(4, function(ex, buf) {
    new Paste({id: token, 
        title: req.body.title, 
        user:  'anonymous', 
        paste: req.body.paste}
    ).save(function(err) {
      if (err) throw err;
    });      
    res.send();
  });
};
  