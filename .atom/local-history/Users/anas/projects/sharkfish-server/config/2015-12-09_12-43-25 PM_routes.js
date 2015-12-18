module.exports.routes = {

  '/': {view: 'homepage'},

  'post /login/email': 'AuthController.emailLogin',
  'get /logout': 'AuthController.logout',

  'get /user/:id?': 'UserController.create',
  'post /user': 'UserController.create',
  'put /user': 'UserController.create',

};
