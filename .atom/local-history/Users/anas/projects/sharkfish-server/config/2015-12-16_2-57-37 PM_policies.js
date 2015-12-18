module.exports.policies = {
  '*': ['passport'],

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