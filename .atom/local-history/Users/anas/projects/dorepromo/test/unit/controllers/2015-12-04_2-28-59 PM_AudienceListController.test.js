var request            = require('supertest');
var assert             = require('chai').assert;
var async              = require('async');
var sampleAudinceLists = require('../sample_data/sample_audience_lists.json');

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

    it('should create new audience list for every item in the array', function(done) {
      var length1 = 0;

      async.forEach(sampleAudinceLists, function(item, cb) {
        length1++;
        request(sails.hooks.http.app)
          .post('/audiencelist')
          .send(item)
          .end(function(err, res) {
            assert.isNull(err, 'error is null');
            assert.equal(res.status, 201, 'res.status equal 201');
            assert.equal(res.body.name, item.name, 'res.body.name equal promoCampaintestName');
            cb();
          });
      });
      console.log(length1);
      done();
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
          assert.equal(res.body.length, sampleAudinceLists.length + 2, 'res.body.length is equal to 102');
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
          done();
        });
    });

    it('should make sure that id is provided', function(done){
      request(sails.hooks.http.app)
        .delete('/audiencelist')
        .end(function(err, result){
          assert.isNull(err, 'error is equal to null');
          assert.equal(result.status, 400, 'res.status is equal to 400');
          done();
        });
    });

    it('should make sure that the audience list is there first', function(done){
      request(sails.hooks.http.app)
        .delete('/audiencelist/?id=Loremipsumdolorsitamet123')
        .end(function(err, result){
          assert.isNull(err, 'error is equal to null');
          assert.equal(result.status, 404, 'res.status is equal to 404');
          done();
        });
    });
  });
});
