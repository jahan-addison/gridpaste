var assert     = require('assert'),
    db         = require('../database'),
    users      = require('../services/userservice'),
    bcrypt     = require('bcrypt-nodejs');

describe('User', function() {

    db.connect();

    var mockUsername       = 'dummy',
        mockUnusedUsername = 'dummy2',
        mockPassword       = 'dummy1',
        mockEmail          = 'dummy@example.com',
        mockUnusedEmail    = 'dummy2@example.com';

    before(function(done) {
        bcrypt.hash(mockPassword, null, null, function(err, hash){
            db.users.create({
                    username: mockUsername,
                    password: hash,
                    email: mockEmail
            }).success(function() {
                done();
            })
        });
    });

    after(function(done) {
        db.users.destroy({
            email: mockEmail
        }).success(function() {
            done();
        })
    });

    describe('#usernameExists()', function() {
        it('should prevent duplicate username entries', function(done) {
            users.usernameExists(db, mockUsername, function(result) {
                assert.equal(result, true);
            });
            users.usernameExists(db, mockUnusedUsername, function(result) {
                assert.equal(result, false);
            });
            done();
        });
    });

    describe('#emailExists()', function() {
        it('should prevent duplicate email entries', function(done) {
            users.emailExists(db, mockEmail, function(result) {
                assert.equal(result, true);
            });
            users.emailExists(db, mockUnusedEmail, function(result) {
                assert.equal(result, false);
            });
            done();
        });
    });

    describe('#register()', function() {
        it('should register successfully', function(done) {
            users.register(db, mockUsername, mockPassword, mockEmail, function() {
                done();
            })
        });
    })
});
