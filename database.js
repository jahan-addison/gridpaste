var mysql = require('mysql');
var config = require('./config');

var connection = mysql.createConnection({
	host     : config.dbhost,
	user     : config.dbuser,
	password : config.dbpassword
});

exports.connect = function(db) {
	connection.connect();
	connection.query('USE ' + db);
	console.log('Connected to MySQL database at ' + config.dbhost + ' with user ' + config.dbuser);
}

exports.end = function() {
	connection.end();
}

exports.query = function(query, callback) {
	connection.query(query, callback);
}
