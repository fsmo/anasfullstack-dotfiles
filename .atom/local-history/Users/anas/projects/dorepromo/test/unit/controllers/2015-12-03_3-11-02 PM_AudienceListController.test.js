var request = require('supertest');

describe('AudienceListController', function() {
  'use strict';
  describe('#create()', function() {
    it('should create new audience list', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testList'})
        .expect(201, done);
    });
    it('should create new audience list with two features', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testList' })
        .expect(201, done);
    });
  });
});
