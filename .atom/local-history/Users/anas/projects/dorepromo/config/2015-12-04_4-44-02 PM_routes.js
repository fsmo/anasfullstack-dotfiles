module.exports.routes = {

  '/': { view: 'homepage' },

  'post /audience_lists'       : 'AudienceListController.create',
  'get /audience_lists/:id?'   : 'AudienceListController.read',
  'put /audience_lists/:id?'   : 'AudienceListController.update',
  'delete /audience_lists/:id?': 'AudienceListController.destroy'

  'post /audience_lists'
};
