var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'materialized_top_tags_view',
  viewName: 'materialized_top_tags_view',
  connection: 'pgConnection',
  attributes: {
    name: {
      type: 'string',
    },

    tag_id: {
      type: 'integer',
    },

    song_count: {
      type: 'integer',
    }
  }
});
