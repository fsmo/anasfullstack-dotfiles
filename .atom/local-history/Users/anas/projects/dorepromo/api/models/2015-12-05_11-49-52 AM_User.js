/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		userName: {
			type: 'string',
			required: true,
			unique: true
		},

		password: {
			type: 'string',
			required: true
		},

		toJson: function (){
			'use strict';
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}

	}
};
