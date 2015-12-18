var request = require('supertest');
var assert = require('chai').assert;

describe('AuthController', function () {
	describe('emailLogin',fuction(){
		it('Should log user with a correct user name and password',function(done){
			request(sails.hooks.http.app)
				.post('/login/email')
				.send()
		})
	})
})
