/*
 * Pastes
 */

var Paste        = require ('../environment/pastes/pastes'),
    randomstring = require("randomstring");

exports.action = function(req, res) {
  req.checkBody('title', 'Please give a title!').notEmpty();

  var errors = req.validationErrors();
    if (errors && errors.length > 0) {
    res.send(errors[0].msg);
    return;
  }
    var token = randomstring.generate(8);
    new Paste({id: token, 
        title: req.body.title, 
        user:  'anonymous', 
        paste: req.body.paste}
    ).save(function(err) {
      if (err) throw err;
      res.send({token: token});
    });      
};
  