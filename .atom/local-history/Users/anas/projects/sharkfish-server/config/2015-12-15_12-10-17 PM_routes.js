module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'post /login/email': 'AuthController.emailLogin',
  'get /login/facebook': 'AuthController.facebookLogin',
  'get /login/twitter': 'AuthController.twitterLogin',

  'get /logout': 'AuthController.logout',

  'get /user/:id?': 'UserController.read',
  'post /user': 'UserController.create',
  'put /user/:id?': 'UserController.update',
  'delete /user/:id?': 'UserController.delete',

  'post /forget-my-password': 'UserController.forgotPassword',
  'post /update-my-password': 'UserController.updatePassword',

  'post /public': 'testController.public',
  'post /private': 'testController.private',

};
