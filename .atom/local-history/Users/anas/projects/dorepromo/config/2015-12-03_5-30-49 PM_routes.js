module.exports.routes = {

  '/': { view: 'homepage' },

  'post /audiencelist': 'AudienceListController.create',
  'get /audiencelist': 'AudienceListController.read'

};
