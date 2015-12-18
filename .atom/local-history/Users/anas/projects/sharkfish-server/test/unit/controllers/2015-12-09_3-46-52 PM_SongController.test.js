var request = require('supertest'),
    should = require('chai').should();

describe('SongController', function() {
  'use strict';

  var agent = request.agent('http://localhost:1337') ;

  before(function(done) {
    agent
      .post('/auth/local')
      .send({identifier: 'email', password: 'password'})
        .end(function(err, res) {
          if (err) {return done(err);}

          done();
        });
  });

  after(function(done) {
    agent
      .get('/logout')
        .end(function(err, res) {
          if (err) {return done(err);}

          done();
        });
  });
  describe('create', function() {
    it('should return 201 for song creation after login', function(done) {
      agent
        .post('/song')
        .send({song: 'blabla'})
        .end(function(err, res) {
          if (err) {return done(err);}

          res.status.should.be.equal(201);
          done();
        });
    });
  });
});
