module.exports.policies = {
  '*': 'true',
  'testController': {
    'public': 'passport',
    'private': ['isAuthenticated']
  }
};
