module.exports.policies = {
  '*': 'sessionAuth',
  'AuthController': [
    'emailLogin': 'passport'
  ],

  'testController': {
    'public': 'passport',
    'private': ['passport', 'sessionAuth']
  }
};
