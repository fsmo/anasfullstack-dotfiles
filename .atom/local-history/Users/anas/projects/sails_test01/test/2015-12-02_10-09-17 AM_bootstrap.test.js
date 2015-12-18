var Sails = require('sails'),
  sails;

before(function(done){
  // Increase mocha timeout so that sails has enough time to lift
  this.timeout(5000)
})