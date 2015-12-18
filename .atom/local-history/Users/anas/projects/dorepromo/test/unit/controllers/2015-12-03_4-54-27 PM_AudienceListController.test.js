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
          assert.equal(res.body.name, 'testName', 'res.body.name equal testName');
          done();
        });
    });

    it('should make sure a unique list name is required', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testName'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });
  });
});
