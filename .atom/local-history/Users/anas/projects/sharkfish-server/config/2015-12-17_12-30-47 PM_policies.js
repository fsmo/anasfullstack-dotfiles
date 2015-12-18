module.exports.policies = {
  '*': ['passport', 'sessionAuth'],

  'AuthController': {
    'emailLogin': 'passport',
    'facebookLogin': 'passport',
    'facebookCallback': 'passport',
    'logout': 'sessionAuth'
  },

  'UserController': {
    'create': 'passport',
    'forgotPassword': 'passport'
  },

  'testController': {
    'public': 'passport',
    'private': ['passport', 'sessionAuth']
  }
};
