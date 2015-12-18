/**
 * AudienceListController
 *
 * @description :: Server-side logic for managing Audiencelists
 */

module.exports = {

  /**
   * `AudienceListController.create()`
   */
  create: function(req, res, next) {
    'use strict';
    var params = req.params.all();

    sails.log.debug('creating new audience list');

    AudienceList.create(params, function(err, list) {
      if (err) {
        sails.log.error(err);
        res.badRequest();
        return next(err);
      }

      res.status(201);
      res.json(list);
    });
  },

  /**
   * `AudienceListController.read()`
   */
  read: function (req, res, next) {
    'use strict';
    var id = req.param('id');
    sails.log.debug(id);

    if (id){
      AudienceList.findOne(id, function(err, list){
        if (list === undefined){ return res.notFound(); }
        if (err){
          sails.log.error(err);
          return next(err);
        }
        res.json(list);
      });
    }

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
