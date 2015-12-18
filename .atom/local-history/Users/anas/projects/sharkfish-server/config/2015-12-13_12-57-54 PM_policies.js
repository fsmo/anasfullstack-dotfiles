module.exports.policies = {
  '*': 'passport',
  'testController': {
    'public': 'passport',
    'private': ['isAuthenticated']
  }
};
