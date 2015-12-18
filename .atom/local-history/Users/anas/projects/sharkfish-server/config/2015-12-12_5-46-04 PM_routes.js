module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'post /register': 'UserController.create',
  'get /logout': 'AuthController.logout',

  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback',

  'get /user/:id?': 'UserController.read',
  'get /user/me': 'UserController.me'
  'post /user': 'UserController.create',
  'put /user/:id?': 'UserController.update',
  'delete /user/:id?': 'UserController.delete',

  'post /forget-my-password': 'UserController.forgotPassword',
  'post /update-my-password': 'UserController.updatePassword'

};
