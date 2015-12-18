var passport = require('passport');
var localStrategy = require('passport-local');
var bcrypt =  require('bcrypt');

passport.serializeUser(fucntion(user,done){
  done(null, user.id);
})
