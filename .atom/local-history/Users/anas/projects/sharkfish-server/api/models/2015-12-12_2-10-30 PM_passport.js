var bcrypt = require('bcryptjs');

function hashPassword(passport, next) {
  var config = sails.config.auth.bcrypt;
  var salt = config.salt || config.rounds;
  if (passport.password) {
    bcrypt.hash(passport.password, salt, function(err, hash) {
      if (err) {
        delete passport.password;
        sails.log.error(err);
        throw err;
      }
      passport.password = hash;
      next(null, passport);
    });
  } else {
    next(null, passport);
  }
}

var Passport = {
  attributes: {

    protocol: {type: 'alphanumeric', required: true},

    password: {type: 'string', minLength: 6},

    provider: {type: 'alphanumericdashed'},
    identifier: {type: 'string'},
    tokens: {type: 'json'},

    user: {model: 'User', required: true},
    
    validatePassword: function(password, next) {
      bcrypt.compare(password, this.password, next);
    }

  },

  /**
   * Callback to be run before creating a Passport.
   *
   * @param {Object}   passport The soon-to-be-created Passport
   * @param {Function} next
   */
  beforeCreate: function(passport, next) {
    hashPassword(passport, next);
  },

  /**
   * Callback to be run before updating a Passport.
   *
   * @param {Object}   passport Values to be updated
   * @param {Function} next
   */
  beforeUpdate: function(passport, next) {
    hashPassword(passport, next);
  }
};

module.exports = Passport;
