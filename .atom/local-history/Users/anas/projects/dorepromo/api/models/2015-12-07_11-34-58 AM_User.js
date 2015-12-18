/**
* User.js
*
* @description :: User Model
*/
var bcrypt = require('bcrypt');

module.exports = {

	attributes: {
		email: {
			type: 'email',
			required: true,
			unique: true
		},

		password: {
			type: 'string',
			minLength: 6,
			requied: true
		},

		toJSON: function () {
			'use strict';
			var obj = this.toObject();
			delete obj.password;
			return obj;
		},

		beforeCreate: fuction(user, cb){
			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(user.password, salt, fu)
			})
		}
	}
};
