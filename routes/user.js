var db    = require('../environment/sequelize'),
    util  = require('util'),
    Users = db.Users; 

/*
 * POST Register
 */

exports.register = function(req, res) {
  req.checkBody('username', 'Invalid username!').notEmpty().isAlphanumeric();
  req.checkBody('password', 'Invalid password!').notEmpty();
  req.checkBody('email',    'Invalid email!').notEmpty().isEmail();

  var errors = req.validationErrors();
    if (errors && errors.length > 0) {
    res.send(errors[0].msg);
    return;
  }

  var username = req.body.username;
  var password = req.body.password;
  var email    = req.body.email;

  Users.usernameExists(username, function(exists) {
      if (exists) {
          res.send("Someone already has that username.")
      } else {
        Users.emailExists(email, function(exists) {
          if (exists) {
              res.send("Someone already has that email.")
          } else {
            Users.register(username, password, email, function() {
              res.send("Registered Successfully!");
            });
          }
        });
      }
    });
};

/*
 * POST Login
 */
exports.login = function(req, res) {

};