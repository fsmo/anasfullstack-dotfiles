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
} else {
  sendGridAuth = require('../../config/local').sendGridAuth;
}

module.exports = {
  /**
   * `User.create()`
   */
  create: function(req, res) {
    'use strict';

    var params = req.params.all();

    if (!(params.email && params.password)) {
      sails.log.error('Can not Create user without userName && password!!');
      return res.badRequest('No userName or password found!');
    }

    User.create(params, function(err, user) {
      if (err) {
        sails.log.error(err);
        return res.forbidden(err);
      }

      res.status(201);
      res.json(user);
    });
  },

  /**
   * `User.read()`
   */
  read: function(req, res) {
    'use strict';

    var id = req.param('id');

    if (id) {
      User.findOne({
        id: id,
        isDeleted: false
      }, function(err, user) {
        if (err) {
          sails.log.error(err);
          return res.serverError(err);
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
        sort: req.param('sort') || undefined,
        isDeleted: false
      };
      sails.log.debug('query options', options);

      User.find(options, function(err, user) {

        if (err) {
          sails.log.error(err);
          return res.serverError(err);
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
      return res.badRequest('Id is not provided!!!!!! :@');
    }

    var criteria = _.merge(req.params.all(), req.body);

    User.findOne({
      id: id,
      isDeleted: false
    }, function(err, user) {

      if (err) {
        sails.log.error(err);
        return res.serverError(err);
      }

      if (!user) {
        return res.notFound();
      }

      User.update(user, criteria, function(err, user) {

        if (err) {
          sails.log.error(err);
          return res.serverError(err);
        }

        if (user.length === 0) {
          return res.notFound();
        }

        res.json(user);
      });
    });
  },

  /**
   * `User.delete()`
   */
  delete: function(req, res, next) {
    'use strict';

    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided!!!!!! :@');
    }

    User.findOne({
      id: id,
      isDeleted: false
    }, function(err, user) {

      if (err) {
        sails.log.error(err);
        return res.serverError(err);
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

  forgotPassword: function(req, res) {
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
          email: req.body.email,
          isDeleted: false
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
        var sendgrid = require('sendgrid')(sendGridAuth.user, sendGridAuth.pass);
        sendgrid.send({
          to: user.email,
          from: 'passwordreset@sharkfish.com',
          subject: 'sharkfish Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the ' +
            'password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }, function(err, json) {
          if (err) {
            sails.log.error(err);
            done(err);
          }
          sails.log.info(json);
          done();
        });
      }
    ], function(err) {
      if (err) {
        sails.log.error(err);
        return res.serverError(err);
      }
      res.ok('Reset Email sent!');
    });
  },

  updatePassword: function(req, res) {
    'use strict';
    var params = req.params.all();

    if (!(params && params.token && params.newPassword)) {
      return res.badRequest('You have missed a Token or a new password!!');
    }

    User.findOne({
      resetPasswordToken: params.token,
      isDeleted: false,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }, function(err, user) {

      if (!user) {
        return res.forbidden('Worng URL or Expired Token!!');
      }

      var criteria = {
        newPassword: params.newPassword
      };

      User.update(user, criteria, function(err, result) {
        if (err) {
          sails.log.error(err);
          return res.serverError(err);
        }
        return res.json(result);
      });
    });
  }
};
