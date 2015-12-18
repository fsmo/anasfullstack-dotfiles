var request = require('supertest');
var should  = require('chai').should();

describe('AudienceListController', function() {
  'use strict';

  describe('#create()', function() {

    it('should create new audience list', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testList1sd2123'})
        .end(function(err, res){
          err.should.be.null;
          res.status.should.be(201);
          done();
        });
    });
  });
});
