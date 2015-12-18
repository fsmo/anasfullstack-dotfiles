module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'post /login/email': 'AuthController.emailLogin',

  'get /login/facebook': 'AuthController.facebookLogin',
  'get /login/facebook/callback': 'AuthController.facebookCallback',

  'get /login/twitter': 'AuthController.twitterLogin',
  'get /login/twitter/callback': 'AuthController.twitterCallback',

  'get /login/google': 'AuthController.googleLogin',
  'get /login/google/callback': 'AuthController.googleCallback',

  'get /logout': 'AuthController.logout',

  'get /user/:id?': 'UserController.read',
  'post /user': 'UserController.create',
  'put /user/:id?': 'UserController.update',
  'delete /user/:id?': 'UserController.delete',

  'post /forget-my-password': 'UserController.forgotPassword',
  'post /update-my-password': 'UserController.updatePassword'

};