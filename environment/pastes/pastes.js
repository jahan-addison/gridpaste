var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PastesSchema = new Schema({
  id:       String,
  user:     {type: String, default: 'Anon'},
  paste:    [{
    arguments: String,
    toString:  String
  }]
});

module.exports = mongoose.model('Pastes', PastesSchema);
