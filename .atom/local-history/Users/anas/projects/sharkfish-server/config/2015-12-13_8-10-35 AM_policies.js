var passport = require('passport');

module.exports.policies = {
  '*': 'passport',

  AuthController: {
    '*': [
      // Initialize Passport
      passport.initialize(),

      // Use Passport's built-in sessions
      passport.session()
    ]
  }
};
