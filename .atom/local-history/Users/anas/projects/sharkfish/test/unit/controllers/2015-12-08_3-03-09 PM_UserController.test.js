var request = require('supertest');
var assert = require('chai').assert;

describe('#UserController', function() {
  'use strict';

  describe('create', function() {

    it('should create new user given email and a password', function(done) {
      request(sails.hooks.http.app)
      .post('/register')
      .send({email: 'anas@gmail.com', password: '123456'})
      .end(function(err, res) {
        sails.log.debug('res', res.body.email);
        assert.isNull(err, 'err equal to null');
        assert.equal(res.status, 201, 'res.status equal to 201');
        assert.equal(res.body.email, 'anas@gmail.com', 'res.body.email equal to anas@gmail.com');
        assert.isUndefined(res.body.password, 'res.body.password equal to null');
        done();
      });
    });

    it('should make sure unique email added', function(done) {
      request(sails.hooks.http.app)
        .post('/register')
        .send({email: 'anas@gmail.com', password: '123456'})
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
        });
    });

    it('should make sure a real email added', function(done) {
      request(sails.hooks.http.app)
        .post('/register')
        .send({email: 'anasl.com', password: '123456'})
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
        });
    });

    it('should make sure a password length of 6', function(done) {
      request(sails.hooks.http.app)
        .post('/register')
        .send({email: 'anasl.com', password: '126'})
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
			});
    });

    it('should make sure an email added', function(done) {
      request(sails.hooks.http.app)
      .post('/register')
      .send({emasil: 'anasl.com', password: '126'})
			.end(function(err, res) {
  assert.isNull(err, 'err equal to null');
  assert.equal(res.status, 400, 'res.status equal to 400');
  done();
			});
    });

    it('should make sure a password added of length of 6', function(done) {
      request(sails.hooks.http.app)
      .post('/register')
      .send({email: 'anasl.com'})
			.end(function(err, res) {
  assert.isNull(err, 'err equal to null');
  assert.equal(res.status, 400, 'res.status equal to 400');
  done();
			});
    });

  });
});
