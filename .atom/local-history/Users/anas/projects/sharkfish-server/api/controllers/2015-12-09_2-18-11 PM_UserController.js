/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 */
 /* global User */

module.exports = {
  /**
  * `User.create()`
  */
  create: function(req, res, next) {
    'use strict';

    var params = req.params.all();

    if (!params.email) {
      sails.log.error('Can not Create user without userName!');
      return res.badRequest('No userName found!');
    }

    if (!params.password) {
      sails.log.error('Can not Create user without password!');
      return res.badRequest('No password found!');
    }

    User.create(params, function(err, user) {
      if (err) {
        sails.log.error(err);
        res.badRequest();
        return next(err);
      }
      res.status(201);
      res.json(user);
    });
  },

  /**
   * `User.read()`
   */
  read: function(req, res, next) {
    'use strict';

    var id = req.param('id');

    if (id) {
      User.findOne(id, function(err, user) {
        if (err) {
          sails.log.error(err);
          return next(err);
        }

        if (user === undefined) {
          return res.notFound();
        }

        res.json(user);
      });

    } else {

      var options = {
        limit: req.param('limit') || undefined,
        skip: req.param('skip') || undefined,
        sort: req.param('sort') || undefined
      };
      sails.log.debug('query options', options);

      User.find(options, function(err, user) {

        if (err) {
          sails.log.err(err);
          return next(err);
        }

        if (user === undefined) {
          return res.notFound();
        }

        res.json(user);
      });
    }
  },

  /**
  * `User.update()`
  */
  update: function(req, res, next) {
  'use strict';

  var id = req.param('id');

  if (!id) {
    return res.badRequest('No id provided!!!!!!');
  }

  var criteria = _.merge(req.params.all(), req.body);

  User.update(id, criteria, function(err, user) {
    if (err) {
      sails.log.error(err);
      return next(err);
    }

    if (user.length === 0) {
      return res.notFound();
    }

    res.json(user);
  });

	},

  /**
  	 * `User.delete()`
  	 */
  delete: function(req, res, next) {
    'use strict';

    var id = req.param('id');

    if (!id) {
      return res.badRequest('No id provided!!!!!!');
    }

    User.findOne(id, function(err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.notFound();
      }

      var criteria = {isDeleted: true};

      User.update(id, criteria, function(err, user) {
        if (err) {
          sails.log.error(err);
          return next(err);
        }

        if (user.length === 0) {
          return res.notFound();
        }

        res.ok('User Deleted Successfully');
      });
    });

  }
};
