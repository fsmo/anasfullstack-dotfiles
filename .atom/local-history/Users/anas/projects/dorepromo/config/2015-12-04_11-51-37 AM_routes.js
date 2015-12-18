module.exports.routes = {

  '/': { view: 'homepage' },

  'post /audiencelist': 'AudienceListController.create',
  'get /audiencelist/ :id?': 'AudienceListController.read',
  'put /audiencelist/ :id?': 'AudienceListController.update'

};
