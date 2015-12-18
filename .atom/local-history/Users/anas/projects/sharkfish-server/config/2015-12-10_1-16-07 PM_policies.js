var passport = require('passport');

module.exports.policies = {
  '*': 'isAuthenticated',

  UserController: {
    'create': true,
    'forgotPassword': true,
    'updatePassword': true

  },

  AuthController: {
    '*': [
      // Initialize Passport
      passport.initialize(),

      // Use Passport's built-in sessions
      passport.session()
    ]
  }
};
