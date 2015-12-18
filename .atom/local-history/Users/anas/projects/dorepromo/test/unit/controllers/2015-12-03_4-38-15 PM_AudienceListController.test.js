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
          assert.equal(err, null, 'error is null');
          assert.equal(res.status, 201, 'res.status equal 201');
          done();
        });
    });
  });
});
