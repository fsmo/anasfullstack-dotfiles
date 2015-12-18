
var _ = require('underscore');
var Waterline = require('waterline');
// var diskAdapter = require('sails-disk');
var pgAdapter = require('sails-postgresql');

var global = require('./global');

var ormConfig = {
  adapters: {
    // disk: diskAdapter,
    pg: pgAdapter
  },

  connections: {
    // diskConnection: { adapter: 'disk' },
    pgConnection: _.extend({ adapter: 'pg' }, global.credentials.postgres)
  },

  defaults: {
    autoPK: false,  // Prevent automatic primary key
    autoCreatedAt: false,
    autoUpdatedAt: false,
    migrate: 'safe' // Don't let waterline alter tables
  }
};

var orm = new Waterline();
var models = null;

orm.loadCollection(pRequire('/models/apple-transaction'));
orm.loadCollection(pRequire('/models/comment'));
orm.loadCollection(pRequire('/models/group-member'));
orm.loadCollection(pRequire('/models/object-type'));
orm.loadCollection(pRequire('/models/platform-id'));
orm.loadCollection(pRequire('/models/song'));
orm.loadCollection(pRequire('/models/song-meta'));
orm.loadCollection(pRequire('/models/song-static-info'));
orm.loadCollection(pRequire('/models/user'));
orm.loadCollection(pRequire('/models/userSecret'));
orm.loadCollection(pRequire('/models/user-subscription-status'));
orm.loadCollection(pRequire('/models/subscription-voucher-code'));
orm.loadCollection(pRequire('/models/subscription-provider-data'));
orm.loadCollection(pRequire('/models/mailing-list-queue'));
orm.loadCollection(pRequire('/models/object-counters'));
orm.loadCollection(pRequire('/models/likes'));
orm.loadCollection(pRequire('/models/bookmark'));
orm.loadCollection(pRequire('/models/collection'));
orm.loadCollection(pRequire('/models/song-revision'));
orm.loadCollection(pRequire('/models/action'));
orm.loadCollection(pRequire('/models/action-type'));
orm.loadCollection(pRequire('/models/user-flag'));
orm.loadCollection(pRequire('/models/user-flag-to-user'));
orm.loadCollection(pRequire('/models/song-folder'));
orm.loadCollection(pRequire('/models/recording-song-view'));
orm.loadCollection(pRequire('/models/bookmarked-songs-view'));
orm.loadCollection(pRequire('/models/collections-songs-view'));
orm.loadCollection(pRequire('/models/materialized-song-view'));
orm.loadCollection(pRequire('/models/materialized-top-tags-view'));
orm.loadCollection(pRequire('/models/materialized-top-songs-view'));

orm.loadCollection(pRequire('/models/tag'));
orm.loadCollection(pRequire('/models/tag_to_object'));

exports.init = function(callback) {
  orm.initialize(ormConfig, function(err, result) {
    if(err) throw err;

    models = result.collections;

    callback();
  });
};

exports.getModel = function(name) {
  return models[name];
};
