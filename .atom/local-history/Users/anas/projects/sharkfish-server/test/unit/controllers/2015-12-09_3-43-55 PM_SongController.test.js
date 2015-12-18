var request = require('supertest'),
    should = require('chai').should();

describe('ImageController', function() {
  var agent = request.agent('http://localhost:1337') ;

  before(function(done){
      agent
        .post('/auth/local')
        .send({identifier: 'email', password: 'password'})
        .end(function(err, res) {
          if (err) return done(err);

          done();
        });
  })

  after(function(done){
      agent
        .get('/logout')
        .end(function(err, res) {
          if (err) return done(err);

          done();
        });
  })