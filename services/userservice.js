var bcrypt = require('bcrypt-nodejs');
var config = require('../config');

exports.usernameExists = function(db, uname, callback) {
	db.users.find({
		where: { username: uname }
	}).success(function(results) {
		callback(results != null);
	});	
}

exports.emailExists = function(db, umail, callback) {
	db.users.find({
		where: { email: umail }
	}).success(function(results) {
		callback(results != null);
	});	
}
exports
.register = function(db, uname, upass, umail, callback) {
	bcrypt.hash(upass, null, null, function(err, hash){
  	db.users.create({
			username: uname,
			password: upass,
			email: umail
		}).success(callback);
	});
}
