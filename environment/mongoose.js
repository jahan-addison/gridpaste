var mongoose = require('mongoose'),
    config   = require('../config').mongo;

mongoose.connect(config.url, function(err, res) {
  if (err) {
    console.log("Connecting to MongoDB failed: %s", err);
  }
});

var db = mongoose.connection;

module.exports = db;