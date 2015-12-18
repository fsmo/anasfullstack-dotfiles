var request = require('supertest');
var assert = require('chai').assert;

describe('#UserController', function () {
	'use strict';

	describe('create', function () {
		it('should create new user given email and a password', function (done) {
			request(sails.hooks.http.app)
			.post('/register')
			.send({ user:{ username:'anas@anas.anas', password:123456 }})
			.end(function (err, res) {
				sails.log.debug('res', res);
				assert.isNull(err, 'err equal to null');
				assert.equals(res.status, 201, 'res.status equal to 201');
				done();
			});
		});
	});
});
