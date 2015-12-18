/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */

module.exports = {
	create: function (req, res, next) {
		'use strict';
		var newUser = req.body.user;
		sails.log.debug(newUser);

		if (!newUser.name) {
			sails.log.error('Can not Create user without userName!');
			return res.badRequest('No userName found!');
		}

		if (!newUser.password) {
			sails.log.error('Can not Create user without password!');
			return res.badRequest('No password found!');
		}

		User.create(newUser, function (err, user) {
			if (err) {
				return next(err);
			}
			res.status(201);
			res.json(user.toJSON);
		})
	}
};
