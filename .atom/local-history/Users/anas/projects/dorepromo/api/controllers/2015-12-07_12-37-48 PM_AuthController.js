/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
var passport = require('passport');

module.exports = {
	emailLogin: fucntion(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if ((err) || (!user)) {
				return res.send({
					message: info.message,
					user: user
				});
			}
			req.LogIn(user, function(err) {
				if (err) {
					res.forrbidden();
				}
				return res.send({
					message: info.message,
					user: user
				});
			});
		})(req, res);
	},

	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	}
};