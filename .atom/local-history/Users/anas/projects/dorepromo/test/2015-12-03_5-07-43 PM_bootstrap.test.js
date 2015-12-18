var Sails = require('sails'),
  sails;

before(function(done){
  'use strict';
  this.timeout(5000);

  Sails.lift({
      log: {
        level: 'error'
      },
      models: {
        connection: 'test',
        migrate: 'drop'
      }
    }, function(err, server){
    sails = server;
    if (err) { return done(err);}

    done(err, sails);
  });
});

after(function(done){
  'use strict';
  Sails.lower(done);
});
