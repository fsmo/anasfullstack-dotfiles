/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */
/* global User, async */

var crypto = require('crypto');
var sendGridAuth = {};

if (process.env.SENDGRID_USERNAME && process.env.SENDGRID_PASSWORD) {
  sendGridAuth = {
  user: process.env.SENDGRID_USERNAME,
  pass: process.env.SENDGRID_PASSWORD
};
}else {
  sendGridAuth = require('../../config/local').sendGridAuth;
}

module.exports = {
  /**
   * `User.create()`
   */
  create: function(req, res, next) {
    'use strict';

    var params = req.params.all();

    if (!params.email) {
      sails.log.error('Can not Create user without userName!');
      return res.badRequest('No userName found!');
    }

    if (!params.password) {
      sails.log.error('Can not Create user without password!');
      return res.badRequest('No password found!');
    }

    User.create(params, function(err, user) {
      if (err) {
        sails.log.error(err);
        res.badRequest();
        return next(err);
      }
      res.status(201);
      res.json(user);
    });
  },

  /**
   * `User.read()`
   */
  read: function(req, res, next) {
    'use strict';

    var id = req.param('id');

    if (id) {
      User.findOne(id, function(err, user) {
        if (err) {
          sails.log.error(err);
          return next(err);
        }

        if (user === undefined) {
          return res.notFound();
        }

        res.json(user);
      });

    } else {

      var options = {
        limit: req.param('limit') || undefined,
        skip: req.param('skip') || undefined,
        sort: req.param('sort') || undefined
      };
      sails.log.debug('query options', options);

      User.find(options, function(err, user) {

        if (err) {
          sails.log.err(err);
          return next(err);
        }

        if (user === undefined) {
          return res.notFound();
        }

        res.json(user);
      });
    }
  },

  /**
   * `User.update()`
   */
  update: function(req, res) {
    'use strict';

    var id = req.param('id');

    if (!id) {
      return res.badRequest('Id is not provided!!!!!!');
    }

    var criteria = _.merge(req.params.all(), req.body);

    User.update(id, criteria, function(err, user) {
      if (err) {
        sails.log.error(err);
        return res.badRequest(err);
      }

      if (user.length === 0) {
        return res.notFound();
      }

      res.json(user);
    });
  },

  /**
   * `User.delete()`
   */
  delete: function(req, res, next) {
    'use strict';

    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided!!!!!!');
    }

    User.findOne(id, function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.notFound();
      }

      var criteria = {
        isDeleted: true
      };

      User.update(id, criteria, function(err, user) {
        if (err) {
          sails.log.error(err);
          return next(err);
        }

        if (user.length === 0) {
          return res.notFound();
        }

        res.ok('User Deleted Successfully!!');
      });
    });

  },

  forgotPassword: function(req, res, next) {
    'use strict';

    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
          email: req.body.email
        }, function(err, user) {
          if (!user) {
            return res.notFound('No account with that email address exists.!!!!');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date(Date.now() + 3600000); // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var nodemailer = require('nodemailer');
        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'SendGrid',
          auth: sendGridAuth
        });

        var mailOptions = {
          to: user.email,
          from: 'passwordreset@sharkfish.com',
          subject: 'sharkfish Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the ' +
            'password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) {
        return next(err);
      }
      res.ok('Reset Email sent!');
    });
  }
};
