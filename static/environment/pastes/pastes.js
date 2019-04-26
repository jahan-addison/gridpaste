var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PastesSchema = new Schema({
  id:       String,
  title:    String,
  user:     {type: String, default: 'anonymous'},
  paste:    [{
    arguments: Schema.Types.Mixed,
    toString:  String
  }]
});

PastesSchema.plugin(require('mongoose-paginate'));

module.exports = mongoose.model('Pastes', PastesSchema);
