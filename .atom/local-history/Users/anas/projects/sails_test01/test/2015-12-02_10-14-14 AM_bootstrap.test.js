var Sails = require('sails'),
  sails;

before(function(done){
  // Increase mocha timeout so that sails has enough time to lift
  this.timeout(5000);
  sails.lift({},function(err, server){
    sails = server;
    if(err) {return done(err);}

    done(err, sails);
  });
})

after(function(done){
  sails.lower(done);
})
