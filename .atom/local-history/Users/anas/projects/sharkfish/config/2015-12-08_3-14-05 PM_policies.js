var passport = require('passport');

module.exports.policies = {
  '*': true,

  AuthController: {
    '*': [
    // Initialize Passport
    passport.initialize(),

    // Use Passport's built-in sessions
    passport.session()
    ]
  }
};
