/**
 * userController
 *
 * @description :: Server-side logic for managing users
 */

module.exports = {
  googleLogin: function(req, res, next){
    var GoogleAPIsOAuth2v2 = require('machinepack-googleapisoauth2v2');

    // Generating an authentication URL
    GoogleAPIsOAuth2v2.getLoginUrl({
    clientId: local.,
    clientSecret: 'SomeSuperSecretKey',
    redirectUrl: 'http://localhost:1337/user/google/login',
    scope: [ 'https://www.googleapis.com/auth/plus.me' ],
    accessType: 'offline',
    }).exec({
    // An unexpected error occurred.
    error: function (err){

    },
    // OK.
    success: function (result){

    },
    });
  }
};
