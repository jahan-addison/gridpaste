var mongoose = require('mongoose'),
    config   = require('../config').mongo;

mongoose.connect(config.url);

var db = mongoose.connection;

module.exports = db;