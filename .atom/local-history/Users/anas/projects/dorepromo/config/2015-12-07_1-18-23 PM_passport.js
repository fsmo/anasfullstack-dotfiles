/*global
User
*/
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bcrypt =  require('bcrypt');

passport.serializeUser(function (user, done) {
	'use strict';
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	'use strict';
	User.findOne({ id: id }, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
  },
  function (email, password, done) {

	User.findOne({ email: email }, function (err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, { message: 'Invalid Credintials!!' });
		}

		bcrypt.compare(password, user.password, function (err, res) {
			if (!res)
            return {done(null, false, {	message: 'Invalid Credintials!!'});}
			var returnUser = {
				email: user.email,
				createdAt: user.createdAt,
				id: user.id
			};
			return done(null, returnUser, {
				message: 'Logged In Successfully'
			});
		});
	});
  }
));
