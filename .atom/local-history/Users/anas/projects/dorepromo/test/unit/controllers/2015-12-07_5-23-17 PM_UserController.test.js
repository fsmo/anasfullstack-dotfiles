var request = require('supertest');
var assert = require('chai').assert;

describe('#UserController', function () {
	'use strict';

	describe('create', function () {

		it('should create new user given email and a password', function (done) {
			request(sails.hooks.http.app)
			.post('/register')
			.send({ email:'anas@gmail.com', password:'123456' })
			.end(function (err, res) {
				sails.log.debug('res', res.body.email);
				assert.isNull(err, 'err equal to null');
				assert.equal(res.status, 201, 'res.status equal to 201');
				assert.equal(res.body.email, 'anas@gmail.com', 'res.body.email equal to anas@gmail.com');
				assert.isUndefined(res.body.password, 'res.body.password equal to null');
				done();
			});
		});

		it('should create new user given email and a password', function (done) {
			request(sails.hooks.http.app)
			.post('/register')
			.send({ email:'anas@gmail.com', password:'123456' })
			.end(function (err, res) {
				sails.log.debug('res', res.body.email);
				assert.isNull(err, 'err equal to null');
				assert.equal(res.status, 201, 'res.status equal to 201');
				assert.equal(res.body.email, 'anas@gmail.com', 'res.body.email equal to anas@gmail.com');
				assert.isUndefined(res.body.password, 'res.body.password equal to null');
				done();
			});
		});

	});
});
