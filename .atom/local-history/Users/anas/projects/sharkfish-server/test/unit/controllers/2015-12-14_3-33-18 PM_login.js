var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
  'username': 'anas.ieee@gmail.com',
  'password': '123456'
};

exports.login = function(request, done) {
  'use strict';
  request
    .post('/login/email')
    .send(theAccount)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};
