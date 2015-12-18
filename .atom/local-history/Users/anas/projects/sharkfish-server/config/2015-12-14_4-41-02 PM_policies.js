module.exports.policies = {
  '*': 'passport',
  'testController': {
    'private': 'isAuthenticated'
  }
};
