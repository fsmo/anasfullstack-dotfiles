/**
 * AudienceListController
 *
 * @description :: Server-side logic for managing Audiencelists
 */

module.exports = {

  /**
   * `AudienceListController.create()`
   */
  create: function (req, res, next) {
    'use strict';
    var params = req.params.all();
    
    sails.log.debug('creating new audience list');
    
    AudienceList.create(params, function(err, list){
      if (err){return next(err);}
    })
    return res.json({
      todo: 'create() is not implemented yet!'
    });
  },


  /**
   * `AudienceListController.read()`
   */
  read: function (req, res) {
    'use strict';
    return res.json({
      todo: 'read() is not implemented yet!'
    });
  },


  /**
   * `AudienceListController.update()`
   */
  update: function (req, res) {
    'use strict';
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },


  /**
   * `AudienceListController.delete()`
   */
  delete: function (req, res) {
    'use strict';
    return res.json({
      todo: 'delete() is not implemented yet!'
    });
  }
};
