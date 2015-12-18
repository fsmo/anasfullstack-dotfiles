module.exports.policies = {
  '*': ['passport', 'sessionAuth'],

  'AuthController': {
    'emailLogin': 'passport',
    'facebookLogin': 'passport',
    'facebookCallback': 'passport'
  },

  'UserController': {
    'create': 'passport',
    'forgotPassword': 'passport',
    'updatePassword': 'passport'
  },

  'testController': {
    'public': 'passport',
    'private': ['passport', 'sessionAuth']
  },

  'SwaggerController': 'passport'
};
