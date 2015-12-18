/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
var passport = require('passport');

module.exports = {

  emailLogin: function(req, res) {
    'use strict';

    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: info.message,
          user: user
        });
      }

      req.logIn(user, function(err) {
        if (err) {
          res.send(err);
        }

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  facebookLogin: function(req, res) {
  Facebook.getLoginUrl({
    appId: fbClientId,
    callbackUrl: callbackUrl,
    permissions: ['public_profile']
  }).exec({
    error: function(err) { },

    success: function(result) {
      return res.redirect(result);
    }
  });
},

  facebookCallback: function(req, res){
  var code = req.params.all()['code'];

  Facebook.getAccessToken({
    appId: fbClientId,
    appSecret: fbSecret,
    code: code,
    callbackUrl: callbackUrl
  }).exec({
    error: function (err){ },
    success: function (result){
      var token = result.token;

      // Get information about the Facebook user with the specified access token.
      Facebook.getUserByAccessToken({
        accessToken: token
      }).exec({
        error: function (err){ },

        success: function (result){
          // Result will include the user's profile information for consumption.
        }

      });
    }
  });
},
  logout: function(req, res) {
    'use strict';
    req.logout();
    res.redirect('/');
  }
};