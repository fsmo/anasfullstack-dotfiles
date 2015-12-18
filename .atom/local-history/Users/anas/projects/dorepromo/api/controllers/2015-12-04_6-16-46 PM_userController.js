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
    clientId: '284875887706-4gku5u85022s3cbsde5rpvps88ekcfql.apps.googleusercontent.com',
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
