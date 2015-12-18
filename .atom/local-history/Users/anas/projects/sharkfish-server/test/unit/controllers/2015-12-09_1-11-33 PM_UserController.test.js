var request = require('supertest');
var assert = require('chai').assert;

describe('#UserController', function() {
  'use strict';

  describe('create', function() {

    it('should create new user given email and a password', function(done) {
      request(sails.hooks.http.app)
      .post('/user')
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
        .post('/user')
        .send({email: 'anas@gmail.com', password: '123456'})
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
        });
    });

    it('should make sure a real email added', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({email: 'anasl.com', password: '123456'})
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
        });
    });

    it('should make sure a password length of 6', function(done) {
      request(sails.hooks.http.app)
        .post('/user')
        .send({email: 'anas@gmail.com', password: '126'})
        .end(function(err, res) {
          assert.isNull(err, 'err equal to null');
          assert.equal(res.status, 400, 'res.status equal to 400');
          done();
        });
    });
  });

  describe('#read()', function() {

    it('should return one user object by id', function(done) {
      request(sails.hooks.http.app)
        .get('/user/?id=Loremipsumdolorsitamet')
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.isObject(res.body, 'body is object');
          assert.equal(res.body.name, 'promoCampaintestName');
          assert.equal(res.body.campaign, 'promoCampaign');
          done();
        });
    });

    it('should return error not found for searching not found List', function(done) {
      request(sails.hooks.http.app)
      .get('/user/?id=Loremipsumdolorsitamet2324')
      .end(function(err, res) {
        assert.equal(res.status, 404, 'res.status equal 404');
        done();
      });
    });

    it('should return an array containing all audience lists that exist', function(done) {
      request(sails.hooks.http.app)
        .get('/audience_lists')
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.isArray(res.body, 'res.body is Array');
          assert.equal(res.body.length, 2, 'res.body.length is equal to 2');
          done();
        });
    });
  });

  describe('#update()', function() {

    it('should update audience list name giving id', function(done) {
      request(sails.hooks.http.app)
        .put('/audience_lists/?id=Loremipsumdolorsitamet')
        .send({name: 'newName', target: 'USA audience'})
        .end(function(err, res) {
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.equal(res.body[0].name, 'newName', 'res.body[0].name is equal to newName');
          assert.equal(res.body[0].target, 'USA audience', 'res.body[0].target is equal to USA audience');
          done();
        });
    });

    it('should make sure that there is an id provided', function(done) {
      request(sails.hooks.http.app)
        .put('/audience_lists')
        .send({name: 'newName'})
        .end(function(err, res) {
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });
  });

  describe('#delete', function() {

    it('should delete audience list given id', function(done) {
      request(sails.hooks.http.app)
        .delete('/audience_lists/?id=Loremipsumdolorsitamet')
        .end(function(err, result) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(result.status, 200, 'res.status is equal to 200');
          done();
        });
    });

    it('should make sure that id is provided', function(done) {
      request(sails.hooks.http.app)
        .delete('/audience_lists')
        .end(function(err, result) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(result.status, 400, 'res.status is equal to 400');
          done();
        });
    });

    it('should make sure that the audience list is there first', function(done) {
      request(sails.hooks.http.app)
        .delete('/audience_lists/?id=Loremipsumdolorsitamet123')
        .end(function(err, result) {
          assert.isNull(err, 'error is equal to null');
          assert.equal(result.status, 404, 'res.status is equal to 404');
          done();
        });
    });
  });
});
