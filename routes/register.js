
/*
 * Registration
 */

var users = require('../services/userservice');
var util = require('util');

exports.action = function(req, res) {
	req.checkBody('username', 'Invalid username!').notEmpty().isAlpha();
	req.checkBody('password', 'Invalid password!').notEmpty();
	req.checkBody('email', 'Invalid email!').notEmpty().isEmail();

	var errors = req.validationErrors();
  	if (errors && errors.length > 0) {
		res.send(errors[0].msg);
		return;
	}

	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	users.usernameExists(req.db, username, function(exists) {
    	if (exists) {
      		res.send("Someone already has that username.")
    	} else {
    		users.emailExists(req.db, email, function(exists) {
		    	if (exists) {
		      		res.send("Someone already has that email.")
		    	} else {
		    		users.register(req.db, username, password, email, function() {
				    	res.send("Registered Successfully!");
				    });
		    	}
		  	});
    	}
  	});
};
