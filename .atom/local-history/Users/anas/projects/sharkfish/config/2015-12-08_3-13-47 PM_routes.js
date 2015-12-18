module.exports.routes = {

  '/': {view: 'homepage'},

  'post /login/email': 'AuthController.emailLogin',
  'get /logout': 'AuthController.logout',

  'post /register': 'UserController.create'

};
