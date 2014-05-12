var Mongoose  = require('./mongoose.js')
  , Sequelize = require('./sequelize')
  , Paste     = require('./pastes/pastes');

Sequelize
  .sequelize
  .sync({ force: false })
  .complete(function(err) {
    if (err) {
      throw err
    } else {
      process.exit();
    }
  });