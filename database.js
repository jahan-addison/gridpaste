var Sequelize = require('sequelize');
var config = require('./config');

var connection = new Sequelize(config.dbname, config.dbuser, config.dbpassword, {
	host: config.dbhost,
	logging: false,
	define: {timestamps: false, freezeTableName:true}
});

// tables

var Users = connection.define('users', {
				id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
				username: Sequelize.STRING,
				password: Sequelize.STRING,
				email: Sequelize.STRING
			});

exports.connect = function() {
	connection.sync();
	console.log('Connected to MySQL database at ' + config.dbhost + ' with user ' + config.dbuser);
}

exports.query = function(query, callback) {
	return connection.query(query, callback);
}

exports.users = Users;
