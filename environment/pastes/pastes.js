var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PastesSchema = new Schema({
  id:       String,
  title:    String,
  user:     {type: String, default: 'anonymous'},
  paste:    [{
    arguments: [String],
    toString:  String
  }]
});

module.exports = mongoose.model('Pastes', PastesSchema);
