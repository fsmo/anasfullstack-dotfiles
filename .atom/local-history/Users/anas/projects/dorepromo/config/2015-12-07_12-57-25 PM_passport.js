var passport = require('passport');
var localStrategy = require('passport-local');
var bcrypt =  require('bcrypt');

passport.serializeUser(function (user,done) {
	'use strict';
	done(null, user.id);
});

passport.des
