var request = require('supertest');
var assert = require('chai').assert();

describe('SongController', function() {
  'use strict';

  var agent = request.agent('http://localhost:1337') ;

  before(function(done) {
    agent
      .post('/login/email')
      .send({email: 'email@email.com', password: 'password'})
        .end(function(err, res) {
          if (err) {return done(err);}
          assert.equal(res.status, 200, 'res.status equal to 200');

          done();
        });
  });

  after(function(done) {
    agent
      .get('/logout')
        .end(function(err, res) {
          if (err) {return done(err);}
          assert.equal(res.status, 200, 'res.status equal to 200');
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

          assert.equal(res.status, 201, 'res.status equal to 201');
          done();
        });
    });
  });
});
