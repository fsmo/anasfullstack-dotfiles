/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */

module.exports = {
	create: function (req, res, next) {
		'use strict';
		var newUser = req.body.user;
		if (!newUser.name) {
			sails.log.error('Can not Create user without userName!');
			return res.badRequest('No userName found!');
		}
	}
};
