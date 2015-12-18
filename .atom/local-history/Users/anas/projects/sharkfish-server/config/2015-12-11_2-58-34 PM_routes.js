module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'get /auth/facebook': 'AuthController.facebook',
  'get /auth/facebook/callback': 'AuthController.facebookCallback',
  'get /auth/:provider/:action': 'AuthController.callback',

  'get /logout': 'AuthController.logout',

  'get /user/:id?': 'UserController.read',
  'post /user': 'UserController.create',
  'put /user/:id?': 'UserController.update',
  'delete /user/:id?': 'UserController.delete',

  'post /forget-my-password': 'UserController.forgotPassword',
  'post /update-my-password': 'UserController.updatePassword'

};
