module.exports.policies = {
  '*': ['passport'],

  'AuthController': {
    'emailLogin': 'passport',
    'facebookLogin': 'passport',
    'facebookCallback': 'passport'
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
