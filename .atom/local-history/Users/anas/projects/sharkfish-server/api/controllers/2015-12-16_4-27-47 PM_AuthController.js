/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
/*globals User*/
var passport = require('passport');
var Facebook = require('machinepack-facebook');

var facebookAuth;
var facebookCallbackUrl;

if (process.env.FACEBOOK_AUTH) {
  facebookAuth = JSON.parse(process.env.FACEBOOK_AUTH);
} else {
  facebookAuth = require('../../config/local.js').socialIds.facebook;
}

if (process.env.BASE_URL) {
  facebookCallbackUrl = process.env.BASE_URL + '/login/facebook/callback';
} else {
  facebookCallbackUrl = require('../../config/local.js').baseUrl + '/login/facebook/callback';
}

function authenticateFacebook(req, res) {
  'use strict';
  return passport.authenticate('custom-facebook', function(err, user, info) {

    if ((err) || (!user)) {
      sails.log.error(info);
      return res.forbidden();
    }

    req.logIn(user, function(err) {
      if (err) {
        sails.log.error(err);
        res.serverError();
      }

      req.session.authenticated = true;
      req.session.userId = user.id;

      sails.log.debug('facelogin req session', req.session);
      sails.log.info('user', user, 'authenticated successfully');

      return res.send({
        message: info,
        user: user
      });
    });
  })(req);
}

module.exports = {

  emailLogin: function(req, res) {
    'use strict';
    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        sails.log.error(info.message);
        return res.forbidden();
      }

      req.logIn(user, function(err) {
        if (err) {
          sails.log.error(err);
          res.serverError();
        }

        req.session.authenticated = true;
        req.session.userId = user.id;

        sails.log.debug('emailLogin req session', req.session);
        sails.log.info('user', user.email, 'authenticated successfully');

        return res.send({
          message: info.message,
          user: user
        });
      });
    })(req, res);
  },

  facebookLogin: function(req, res) {
    'use strict';
    Facebook.getLoginUrl({
      appId: facebookAuth.clientID,
      callbackUrl: facebookCallbackUrl,
      permissions: ['emails', 'email', 'public_profile']
    }).exec({
      error: function(err) {
        if (err) {
          sails.log.error(err);
          res.serverError();
        }
      },

      success: function(result) {
        sails.log.debug('facebookLogin.getLoginUrl', result);
        return res.redirect(result);
      }
    });
  },

  facebookCallback: function(req, res) {
    'use strict';
    var params = req.params.all();
    var code = params.code;

    Facebook.getAccessToken({
      appId: facebookAuth.clientID,
      appSecret: facebookAuth.clientSecret,
      code: code,
      callbackUrl: facebookCallbackUrl
    }).exec({
      error: function(err) {
        if (err) {
          sails.log.error(err);
          res.serverError();
        }
      },

      success: function(result) {
        var token = result.token;
        sails.log.debug('token result', result);

        // Get information about the Facebook user with the specified access token.
        Facebook.getUserByAccessToken({
          accessToken: token
        }).exec({
          error: function(err) {
            if (err) {
              sails.log.error(err);
              res.serverError();
            }
          },

          success: function(result) {
            console.log(result);
            User.findOne({
              or: [
                {facebookId: result.id},
                {email: result.email}
              ]
            }).exec(function(err, dbUser) {
              if (dbUser) {
                req.body = dbUser;
                authenticateFacebook(req, res);
              } else {
                // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                var newUser = {
                  facebookId: result.id,
                  email: result.email,
                  firstName: result.first_name, /* jshint ignore:line */
                  lastName: result.last_name, /* jshint ignore:line */
                  fullName: result.name,
                  timezone: result.timezone
                };
                // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                User.create(newUser, function(err, dbUser) {
                  if (err) {
                    sails.log.error(err);
                    res.serverError();
                  }

                  req.body = dbUser;
                  authenticateFacebook(req, res);
                });
              }
            });
          }
        });
      }
    });
  },

  logout: function(req, res) {
    'use strict';
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    res.ok('Log out successfully!!');
  }

};
