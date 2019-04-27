var Paste     = require ('../environment/pastes/pastes'),
    Mongoose  = require('../environment/mongoose');

describe('Paste', function() {
  var token = "faketoken";
  after(function(done) {
    Paste.find({id: token}).remove(done);
  });
  it("should save pastes", function(done) {
    new Paste({id: token, 
        title: "test", 
        user:  "tester", 
        paste: {arguments: ["test"], toString: "test"}}
    ).save(function(err) {
      if (err) throw err;
      done();
    });
  });
});