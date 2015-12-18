var chai   = require('chai'),
  chaiHttp = require('chai-http'),
  should   = require('chai').should();

chai.use(chaiHttp);

describe('AudienceListController', function() {
  'use strict';

  describe('#create()', function() {

    it('should create new audience list', function(done) {
      chai.request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testList12'})
        .expect(201, done);
    });

    it('should create new audience list with two features', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'testList1', maxFeatures: 'bla bla' })
        .expect(201, done);
    });
  });
});
