/**
 * User.js
 *
 * @description :: User Model
 */
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    username: {
  type: 'string',
  unique: true,
  index: true,
  notNull: true
},
email: {
  type: 'email',
  unique: true,
  index: true
},
passports: {
  collection: 'Passport',
  via: 'user'
},

getGravatarUrl: function() {
  var md5 = crypto.createHash('md5');
  md5.update(this.email || '');
  return 'https://gravatar.com/avatar/' + md5.digest('hex');
},

    password: {
      type: 'string',
      minLength: 6
    },

    facebookId: {
      type: 'string',
      unique: true
    },

    emailVerified: {
      type: 'boolean',
      defaultsTo: false
    },

    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    },

    resetPasswordToken: {
      type: 'string'
    },

    resetPasswordExpires: {
      type: 'Date'
    },

    provider: 'STRING',
    uid: 'STRING',
    name: 'STRING',
    firstname: 'STRING',
    lastname: 'STRING',

    //overridig the default to json function
    toJSON: function() {
      'use strict';
      var obj = this.toObject();
      delete obj.password;
      if (obj.resetPasswordToken) {
        delete obj.resetPasswordToken;
      }
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    'use strict';

    if (!user.password) {
      cb();
    }

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, crypted) {
        if (err) {
          sails.log.error(err);
          cb(err);
        } else {
          user.password = crypted;
          cb();
        }
      });
    });
  },

  beforeUpdate: function(user, cb) {
    'use strict';

    if (!user.newPassword) {
      cb();
    } else {

      bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          sails.log.error(err);
          cb(err);
        }

        bcrypt.hash(String(user.newPassword), salt, function(err, crypted) {
          if (err) {
            sails.log.error(err);
            cb(err);
          }

          delete user.newPassword;
          user.password = crypted;
          return cb();
        });
      });
    }
  }
};

var _ = require('lodash');
var crypto = require('crypto');

module.exports = {
  attributes: {
    username: {
      type: 'string',
      unique: true,
      index: true,
      notNull: true
    },
    email: {
      type: 'email',
      unique: true,
      index: true
    },
    passports: {
      collection: 'Passport',
      via: 'user'
    },

    getGravatarUrl: function() {
      var md5 = crypto.createHash('md5');
      md5.update(this.email || '');
      return 'https://gravatar.com/avatar/' + md5.digest('hex');
    },

    toJSON: function() {
      var user = this.toObject();
      delete user.password;
      user.gravatarUrl = this.getGravatarUrl();
      return user;
    }
  },

  beforeCreate: function(user, next) {
    if (_.isEmpty(user.username)) {
      user.username = user.email;
    }
    next();
  },

  /**
   * Register a new User with a passport
   */
  register: function(user) {
    return new Promise(function(resolve, reject) {
      sails.services.passport.protocols.local.createUser(user, function(error, created) {
        if (error) return reject(error);

        resolve(created);
      });
    });
  }
};
