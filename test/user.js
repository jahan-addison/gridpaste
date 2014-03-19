
var assert     = require('assert'),
    db         = require('../database'),
    users      = require('../services/userservice');


describe('User', function() {

    db.connect();

    before(function(done) {
        users.register(db, "dummy", "dummy1", "dummy@example.com", function() {
            done();
        });
    });

    after(function(done) {
        db.users.find({email: 'dummy@example.com'})
        .success(function(results) {
            db.query('DELETE FROM users WHERE email = "dummy@example.com"')
            done();
        });
    });

    describe('#usernameExists()', function() {
        it('should prevent duplicate username entries', function(done) {
            users.usernameExists(db, 'dummy', function(result) {
                assert.equal(result, true);
            });
            users.usernameExists(db, 'dummy2', function(result) {
                assert.equal(result, false);
            });
            done();
        });
    });

    describe('#emailExists()', function() {
        it('should prevent duplicate email entries', function(done) {
            users.emailExists(db, 'dummy@example.com', function(result) {
                assert.equal(result, true);
            });
            users.emailExists(db, 'dummy2@example.com', function(result) {
                assert.equal(result, false);
            });
            done();
        });
    });

    describe('#register()', function() {
        it('should register successfully', function(done) {
            users.register(db, 'dummy', 'dummy1', 'dummy@example.com', function() {
                done();
            })
        });
    })

});
