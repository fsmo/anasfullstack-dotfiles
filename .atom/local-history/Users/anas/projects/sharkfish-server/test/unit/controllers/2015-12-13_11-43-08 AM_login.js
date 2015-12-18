var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
  'username': 'anas.ieee@',
  'password': 'iamtheluchadore'
};

exports.login = function(request, done) {
  request
    .post('/login')
    .send(theAccount)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};
