/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 */
/*globals User*/
var passport = require('passport');
var Facebook = require('machinepack-facebook');

var facebookAuth;
var twitterAuth;
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

if (process.env.TWITTER_AUTH) {
  twitterAuth = JSON.parse(process.env.TWITTER_AUTH);
} else {
  twitterAuth = require('../../config/local.js').socialIds.twitter;
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
  // 
  // facebookLogin: function(req, res) {
  //   'use strict';
  //   Facebook.getLoginUrl({
  //     appId: facebookAuth.clientID,
  //     callbackUrl: facebookCallbackUrl,
  //     permissions: ['email', 'public_profile']
  //   }).exec({
  //     error: function(err) {
  //       if (err) {
  //         sails.log.error(err);
  //         res.serverError();
  //       }
  //     },
  // 
  //     success: function(result) {
  //       console.log(result);
  //       return res.redirect(result);
  //     }
  //   });
  // },
  // 
  // facebookCallback: function(req, res) {
  //   'use strict';
  //   var params = req.params.all();
  //   var code = params.code;
  // 
  //   Facebook.getAccessToken({
  //     appId: facebookAuth.clientID,
  //     appSecret: facebookAuth.clientSecret,
  //     code: code,
  //     callbackUrl: facebookCallbackUrl
  //   }).exec({
  //     error: function(err) {
  //       if (err) {
  //         sails.log.error(err);
  //         res.serverError();
  //       }
  //     },
  //     success: function(result) {
  //       var token = result.token;
  //       console.log('token result', result);
  // 
  //       // Get information about the Facebook user with the specified access token.
  //       Facebook.getUserByAccessToken({
  //         accessToken: token
  //       }).exec({
  //         error: function(err) {
  //           if (err) {
  //             sails.log.error(err);
  //             res.serverError();
  //           }
  //         },
  // 
  //         success: function(result) {
  //           console.log('user result', result);
  //           User.findOne({
  //             or: [{
  //               facebookId: result.id
  //             }, {
  //               email: result.email
  //             }]
  //           }).exec(function(err, user) {
  //             if (user) {
  // 
  //               passport.authenticate('local-facebook', function(err, user, info) {
  //                 console.log(user);
  // 
  //                 if ((err) || (!user)) {
  //                   sails.log.error(info);
  //                   return res.forbidden();
  //                 }
  // 
  //                 req.logIn(user, function(err) {
  //                   if (err) {
  //                     sails.log.error(err);
  //                     res.serverError();
  //                   }
  // 
  //                   req.session.authenticated = true;
  //                   req.session.userId = user.id;
  // 
  //                   sails.log.debug('emailLogin req session', req.session);
  //                   sails.log.info('user', user.email, 'authenticated successfully');
  // 
  //                   return res.send({
  //                     message: info.message,
  //                     user: user
  //                   });
  //                 });
  //               })(user, res);
  // 
  //             } else {
  //               console.log('NOuser');
  //               var newUser = {
  //                 facebookId: result.id,
  //                 email: result.email,
  //                 firstName: result.first_name,
  //                 lastName: result.last_name,
  //                 fullName: result.name,
  //                 timezone: result.timezone
  //               };
  //               User.create(newUser, function(err, dbUser) {
  //                 if (err) {
  //                   sails.log.error(err);
  //                   res.serverError();
  //                 }
  // 
  //                 passport.authenticate('facebook', function(err, user, info) {
  // 
  //                   if ((err) || (!user)) {
  //                     sails.log.error(info.message);
  //                     return res.forbidden();
  //                   }
  // 
  //                   req.logIn(user, function(err) {
  //                     if (err) {
  //                       sails.log.error(err);
  //                       res.serverError();
  //                     }
  // 
  //                     req.session.authenticated = true;
  //                     req.session.userId = user.id;
  // 
  //                     sails.log.debug('emailLogin req session', req.session);
  //                     sails.log.info('user', user.email, 'authenticated successfully');
  // 
  //                     return res.send({
  //                       message: info.message,
  //                       user: user
  //                     });
  //                   });
  //                 })(req, res);
  //               });
  //               // Create a new user and log the user in
  //             }
  //           });
  //         }
  // 
  //       });
  //     }
  //   });
  // },
  // facebookLogin: function(req, res) {
  //   'use strict';
  //   passport.authenticate('facebook', function(err, user, info) {
  //     if ((err) || (!user)) {
  //       sails.log.error(info.message);
  //       return res.forbidden();
  //     }
  //
  //     req.logIn(user, function(err) {
  //       if (err) {
  //         sails.log.error(err);
  //         res.serverError();
  //       }
  //
  //       req.session.authenticated = true;
  //       req.session.userId = user.id;
  //
  //       sails.log.info('user', user.id, 'authenticated successfully');
  //
  //       return res.send({
  //         message: info.message,
  //         user: user
  //       });
  //     });
  //   });
  // },
  //
  // 'facebookCallback': function(req, res, next) {
  //   'use strict';
  //   passport.authenticate('facebook',
  //     function(req, res) {
  //       sails.log.info('user', req.user.id, 'authenticated successfully');
  //       res.ok('user', req.user.id, 'authenticated successfully');
  //     })(req, res, next);
  // },

  logout: function(req, res) {
    'use strict';
    req.logout();
    delete req.user;
    delete req.session.passport;
    req.session.authenticated = false;

    res.ok('Log out successfully!!');
  }

};
