var assert = require('assert'),
    bcrypt = require('bcrypt-nodejs'),
    db     = require('../environment/sequelize'),
    util   = require('util'),
    Users  = db.Users; 

describe('User', function() {


    var mockUsername       = 'dummy',
        mockUnusedUsername = 'dummy2',
        mockPassword       = 'dummy1',
        mockEmail          = 'dummy@example.com',
        mockUnusedEmail    = 'dummy2@example.com';

    before(function(done) {
        bcrypt.hash(mockPassword, null, null, function(err, hash){
            Users.create({
                    username: mockUsername,
                    password: hash,
                    email: mockEmail
            }).success(function() {
                done();
            })
        });
    });

    after(function(done) {
        Users.destroy({
            email: mockEmail
        }).success(function() {
            done();
        })
    });

    describe('#usernameExists()', function() {
        it('should prevent duplicate username entries', function(done) {
            var t = Users.usernameExists(mockUsername, function(result) {
                assert.equal(result, true);
            });
            Users.usernameExists(mockUnusedUsername, function(result) {
                assert.equal(result, false);
            });
            done();
        });
    });

    describe('#emailExists()', function() {
        it('should prevent duplicate email entries', function(done) {
            Users.emailExists(mockEmail, function(result) {
                assert.equal(result, true);
            });
            Users.emailExists(mockUnusedEmail, function(result) {
                assert.equal(result, false);
            });
            done();
        });
    });

    describe('#register()', function() {
        it('should register successfully', function(done) {
            assert.doesNotThrow(function() {Users.register(mockUsername, mockPassword, mockEmail, function() {
                done();
            }); });
        });
    })
});
