var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, datatypes) {

  var Users = sequelize.define('Users', {
      id: { type: datatypes.BIGINT, autoIncrement: true, primaryKey: true },
      username: datatypes.STRING,
      password: datatypes.STRING,
      email: datatypes.STRING
    }, {
      classMethods: {
       // associate: function(models) {
       //   Users.hasOne(models.Sessions);
       // },
        usernameExists: function(username, callback) {
          return Users.count({
            where: { username: username }
          }).success(callback); 
        },
        emailExists: function(email, callback) {
         return Users.count({
            where: { email: email }
          }).success(callback) ;
        },
        register: function(username, password, email, callback) {
          bcrypt.hash(password, null, null, function(err, hash){
            Users.create({
              username: username,
              password: hash,
              email: email
            }).success(callback);
          });
        }
      }
  });

  return Users;
};

