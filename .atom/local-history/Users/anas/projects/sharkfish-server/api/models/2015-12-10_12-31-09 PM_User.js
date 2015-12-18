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

    //overridig the default to json function
    toJSON: function() {
      'use strict';
      var obj = this.toObject();
      delete obj.password;
      if (obj.resetPasswordToken) {delete obj.resetPasswordToken;}
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    'use strict';

    if (!user.password) {cb();}

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
        console.log(salt);
        if (err) {
          sails.log.error(err);
          cb(err);
        }

        bcrypt.hash(user.newPassword, salt, function(err, crypted) {
          if (err) {
            sails.log.error(err);
            cb(err);
          }

          delete user.newPassword;
          user.password = crypted;
          cb();
        });
      });
    }
  }
};
