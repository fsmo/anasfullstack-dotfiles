var request = require('supertest');
var assert = require('chai').assert;

describe('AudienceListController', function() {
  'use strict';

  describe('#create()', function() {

    it('should create new audience list giving a name', function(done) {
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

    it('should create new audience list giving a name, id & campaign', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({_id: 'Loremipsumdolorsitamet', name: 'promoCampaintestName', campaign: 'promoCampaign'})
        .end(function(err, res){
          assert.isNull(err, 'error is null');
          assert.equal(res.status, 201, 'res.status equal 201');
          assert.equal(res.body.name, 'promoCampaintestName', 'res.body.name equal promoCampaintestName');
          assert.equal(res.body.campaign, 'promoCampaign', 'res.body.campaign equal promoCampaign');
          done();
        });
    });

    it('Make sure that List name is required', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
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

    it('should make sure name is more than 5 litters', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'tes'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });

    it('should make sure name is less than 50 litters', function(done) {
      request(sails.hooks.http.app)
        .post('/audiencelist')
        .send({name: 'Lorem ipsum dolor sit amet, consectetur adipiscing sed.'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });
  });

  describe('#read()', function(){

    it('should return one mailing list object by id', function(done){
      request(sails.hooks.http.app)
        .get('/audiencelist/?id=Loremipsumdolorsitamet')
        .end(function(err, res){
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.isObject(res.body, 'body is object');
          assert.equal(res.body.name, 'promoCampaintestName');
          assert.equal(res.body.campaign, 'promoCampaign');
          done();
      });
    });

    it('should return error not found for searching not found List', function(done){
      request(sails.hooks.http.app)
      .get('/audiencelist/?id=Loremipsumdolorsitamet2324')
      .end(function(err, res){
        assert.equal(res.status, 404, 'res.status equal 404');
        done();
      });
    });

    it('should return an array containing all audience lists that exist', function(done){
      request(sails.hooks.http.app)
        .get('/audiencelist')
        .end(function(err, res){
          assert.equal(res.status, 200, 'res.status equal 200')
          assert.isArray(res.body, 'res.body is Array')
          assert.equal(res.body.length, 2, 'res.body.length is equal to 2');
          done();
        });
    });
  });

  describe('#update()', function(){

    it('should update audience list name giving id', function(done){
      request(sails.hooks.http.app)
        .put('/audiencelist/?id=Loremipsumdolorsitamet')
        .send({name: 'newName', target: 'USA audience'})
        .end(function(err, res){
          assert.equal(res.status, 200, 'res.status equal 200');
          assert.equal(res.body[0].name, 'newName', 'res.body[0].name is equal to newName');
          assert.equal(res.body[0].target, 'USA audience', 'res.body[0].target is equal to USA audience');
          done();
        });
    });

    it('should make sure that there is an id provided', function(done){
      request(sails.hooks.http.app)
        .put('/audiencelist')
        .send({name: 'newName'})
        .end(function(err, res){
          assert.equal(res.status, 400, 'res.status equal 400');
          done();
        });
    });
  });

  describe('#delete', function(){

    it('should delete audience list given id', function(done){
      request(sails.hooks.http.app)
        .delete('/audiencelist/?id=Loremipsumdolorsitamet')
        .end(function(err, result){
          assert.isNull(err, 'error is equal to null');
          assert.equal(result.status, 200, 'res.status is equal to 200');
          assert.isNotNull(result.name[0]);
          done();
        });
    });
  });
});
