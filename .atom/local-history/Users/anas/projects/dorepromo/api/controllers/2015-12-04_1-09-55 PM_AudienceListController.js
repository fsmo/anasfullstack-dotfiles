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
    sails.log.debug('read id', id);

    if (id){
      AudienceList.findOne(id, function(err, list){
        if (err){
          sails.log.error(err);
          return next(err);
        }

        if (list === undefined){ return res.notFound(); }

        res.json(list);
      });

    }else{

      var options = {
        limit: req.param('limit') || undefined,
        skip : req.param('limit') || undefined,
        sort : req.param('sort') || undefined
      };
      sails.log.debug('query options', options);

      AudienceList.find(options, function(err, list){

        if (err){
          sails.log.err(err);
          return next(err);
        }

        if (list === undefined){ return res.notFound();}

        res.json(list);
      });
    }

  },


  /**
   * `AudienceListController.update()`
   */
  update: function (req, res, next) {
    'use strict';

    var id = req.param('id');

    if(!id){ return res.badRequest('No id provided!!!!!!');}

    var criteria = _.merge(req.params.all(), req.body);

    AudienceList.update(id, criteria, function(err, list){
      if (err){
        sails.log.error(err);
        return next(err);
      }

      if(list.length === 0){return res.notFound();}

      res.json(list);
    });

  },


  /**
   * `AudienceListController.delete()`
   */
  delete: function (req, res, next) {
    'use strict';

    var id = req.param('id');
    if(!id){ return res.badRequest('No id provided!!!!!!');}

    AudienceList.findOne(id, function(err, list){
      if (err){ return next(err); }

      if (!list){return res.notFound();}

      AudienceList.destroy(id, function(err){
        if (err){return next(err);}

        return res.json(list);
      });
    });

  }
};
