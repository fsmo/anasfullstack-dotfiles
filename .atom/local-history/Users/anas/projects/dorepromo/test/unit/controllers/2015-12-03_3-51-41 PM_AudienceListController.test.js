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
        .send({name: 'testList125'})

        .then(function(res){
          expect(res).to.have.status(201);
          res.body.should.be.a('json');
        })

        .catch(function(err){
          throw err;
          done();
        })
        
        .finally(function(){
          done();
        });
    });


  });
});
