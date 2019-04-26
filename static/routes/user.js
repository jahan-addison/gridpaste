var db    = require('../environment/sequelize'),
    util  = require('util'),
    Users = db.Users; 

/*
 * POST Register
 */

exports.register = function(req, res) {
  req.checkBody('username', 'Invalid username!').notEmpty().matches(/^[A-Za-z0-9-_.]{4,15}$/);
  req.checkBody('password', 'Invalid password!').notEmpty();
  req.checkBody('email',    'Invalid email!').notEmpty().isEmail();

  var errors = req.validationErrors();
    if (errors && errors.length > 0) {
      req.flash('error', errors[0].msg);
      res.redirect('/register');
      return;
  }

  var username = req.body.username;
  var password = req.body.password;
  var email    = req.body.email;

  Users.usernameExists(username, function(exists) {
      if (exists) {
          req.flash('error', "Someone already has that username.");
          res.redirect('/register');
      } else {
        Users.emailExists(email, function(exists) {
          if (exists) {
              req.flash('error', "Someone already has that email.");
              res.redirect('/register');
          } else {
            Users.register(username, password, email, function() {
              res.redirect('/');
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
  req.checkBody('username', 'Invalid username!').notEmpty().matches(/^[A-Za-z0-9-_.]{4,15}$/);
  req.checkBody('password', 'Invalid password!').notEmpty();

  var errors = req.validationErrors();
    if (errors && errors.length > 0) {
      req.flash('error', errors[0].msg);
      res.redirect('/login');
      return;
  }

  var username = req.body.username;
  var password = req.body.password;
  Users.isUser(username, password, function(err, result) {
    if (result) {
      Users.getUser(username, function(user) {
        if (!user) {
          req.flash('error', "An error occurred! Try again later."); 
          res.redirect('/login');      
        } else {
          req.session.loggedIn = true;
          req.session.user     = user.dataValues.username;
          req.session.email    = user.dataValues.email;
          res.redirect('/');         
        }
      })
    } else {
      req.flash('error', "This user does not exist!");
      res.redirect('/login');      
    }
  });
 
};