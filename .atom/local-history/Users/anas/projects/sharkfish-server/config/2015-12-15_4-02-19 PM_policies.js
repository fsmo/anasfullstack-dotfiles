module.exports.policies = {
  '*': ['passport', 'sessionAuth'],

  'AuthController': {
    'emailLogin': 'passport'
  },

  'testController': {
    'public': 'passport',
    'private': ['passport', 'sessionAuth']
  }
};
