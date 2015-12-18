module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'get /auth/local': 'AuthController.emailLogin',
  'get /login/facebook': 'AuthController.facebookLogin',
  'get /login/twitter': 'AuthController.twitterLogin',
  'get /login/google': 'AuthController.googleLogin',

  'get /logout': 'AuthController.logout',

  'get /user/:id?': 'UserController.read',
  'post /user': 'UserController.create',
  'put /user/:id?': 'UserController.update',
  'delete /user/:id?': 'UserController.delete',

  'post /forget-my-password': 'UserController.forgotPassword',
  'post /update-my-password': 'UserController.updatePassword'

};
