var request = require('supertest');
var assert = require('chai').assert;

describe('AudienceListController', function() {
  'use strict';

  describe('#create()', function() {

    it('should create new audience list', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testName'})
        .end(function(err, res){
          assert.isNull(err, 'error is null');
          assert.equal(res.status, 201, 'res.status equal 201');
          done();
        });
    });

    it('should make sure a unique list name require', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testName'})
        .end(function(err, res){
          assert.isNotNull(err, 'error is not null');
          // assert.equal(res.status, 403, 'res.status equal 403');
          done();
        });
    });
  });
});
