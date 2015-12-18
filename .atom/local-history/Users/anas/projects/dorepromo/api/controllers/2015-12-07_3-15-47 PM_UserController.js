/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */

module.exports = {
	create: function (req, res, next) {
		'use strict';
		var newUser = req.params.all();
		sails.log.debug(typeof newUser);
		sails.log.debug('newUser   ', newUser);

		if (!newUser.email) {
			sails.log.error('Can not Create user without userName!');
			return res.badRequest('No userName found!');
		}

		if (!newUser.password) {
			sails.log.error('Can not Create user without password!');
			return res.badRequest('No password found!');
		}

		User.create(newUser, function (err, user) {
			if (err) {
				sails.log.error(err);
				res.badRequest();
				return next(err);
			}
			res.status(201);
			res.json(user.toJSON);
		});
	}
};
