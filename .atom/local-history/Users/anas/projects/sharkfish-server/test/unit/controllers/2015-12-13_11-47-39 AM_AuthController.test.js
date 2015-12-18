var request = require('supertest')(sails.hooks.http.app);
var assert = require('chai').assert;
var login = require('./login');

require('./UserController.test.js');

describe('AuthController', function() {
  'use strict';

  describe('emailLogin', function() {
    it('Should log user with a correct user name and password', function(done) {
      request
        .post('/login/email')
        .send({
          email: 'anas@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status is equal to 200');
          done();
        });
    });

    it('Should not log user in with a correct user name and wrong password', function(done) {
      request
        .post('/login/email')
        .send({
          email: 'anas@gmail.com',
          password: '12345we6'
        })
        .end(function(err, res) {
          assert.equal(res.status, 403, 'res.status is equal to 403');
          done();
        });
    });

    it('Should not log user in with a wrong user name or wrong password', function(done) {
      request
        .post('/login/email')
        .send({
          email: 'anas123@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.isNull(err, 'err is equal to null');
          assert.equal(res.status, 403, 'res.status is equal to 403');
          done();
        });
    });
  });

  describe('logout', function() {
    var agent;

    before(function(done) {
   login.login(request, function(loginAgent) {
     agent = loginAgent;
     done();
   });
 });

    it('Should logout logged in user', function(done) {
      var req = request.get('/admin');
    agent.attachCookies(req);
      request
        .get('/logout')
        .end(function(err, res) {
          assert.isNull(err, 'err is equal to null');
          assert.equal(res.status, 200, 'res.status equal to 200');
          done();
        });
    });
  });
});
