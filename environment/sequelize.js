var Sequelize = require('sequelize'),
		fs        = require('fs'),
		path      = require('path'),
    config    = require('../config').sequelize,
    sequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	logging: false,
	define: {timestamps: false, freezeTableName:true}
}),
    models    = __dirname + '/users',
    db        = {};

fs
	.readdirSync(models)
	.filter(function(file) {
		return (file.indexOf('.') !== 0);
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(models, file));
		if (typeof model !== 'undefined') {
			db[model.name] = model;
		} else {
			console.log('model placeholder: %s', file);
		}
	});

Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize   = sequelize;
db.Sequelize   = Sequelize;
module.exports = db;