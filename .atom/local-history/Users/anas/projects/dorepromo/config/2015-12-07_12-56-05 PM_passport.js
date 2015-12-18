var passport = require('passport');
var localStrategy = require('passport-local');
var bcrypt =  require('bcrypt');

passport.serializeUser(function(user,done){
  done(null, user.id);
})
