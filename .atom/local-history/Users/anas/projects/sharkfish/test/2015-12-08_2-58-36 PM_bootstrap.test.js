var Sails = require('sails');
var sails;

before(function(done) {
  'use strict';
  this.timeout(5000);

  Sails.lift({},

  function(err, server) {
    sails = server;
    if (err) {
      return done(err);
    }

    done(err, sails);
  });
});

after(function(done) {
  'use strict';
  console.log();
  Sails.lower(done);
});
