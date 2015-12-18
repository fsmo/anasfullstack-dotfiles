var request = require('supertest');
var assert = require('chai').assert;
var cookie;

require('./UserController.test.js');

describe('AuthController', function() {
  'use strict';
  describe('emailLogin', function() {
    it('Should log user with a correct user name and password', function(done) {
      request(sails.hooks.http.app)
        .post('/login/email')
        .send({
          email: 'anas@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status is equal to 200');
          cookie = res.headers['set-cookie'];
          console.log('cookie', cookie);
          console.log('res.session', res.session);
          console.log('res.user', res.user);
          console.log('res.locals', res.locals);
          console.log(res.body);
          done();
        });
    });

    it('Should not log user in with a correct user name and wrong password', function(done) {
      request(sails.hooks.http.app)
        .post('/login/email')
        .send({
          email: 'anas@gmail.com',
          password: '123456'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status is equal to 200');
          cookie = res.headers['set-cookie'];
          console.log('cookie', cookie);
          console.log('res.session', res.session);
          console.log('res.user', res.user);
          console.log('res.locals', res.locals);
          console.log(res.body);
          done();
        });
    });
  });
});
