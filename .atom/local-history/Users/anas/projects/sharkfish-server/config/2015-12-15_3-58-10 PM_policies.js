module.exports.policies = {
  '*': 'sessionAuth',
  'AuthController':[
    
  ]
  
  'testController': {
    'public': 'passport',
    'private': ['passport', 'sessionAuth']
  }
};
