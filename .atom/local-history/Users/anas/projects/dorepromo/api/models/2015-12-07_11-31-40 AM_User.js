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

		toJSON: function(){

		}
	}
};
