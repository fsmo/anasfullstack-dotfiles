var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'materialized_top_tags_view',
  viewName: 'materialized_top_tags_view',
  connection: 'pgConnection',
  attributes: {
    song_id: {
      type: 'string',
    },

    source_type: {
      type: 'string',
    },

    author_id: {
      type: 'string',
    },

    title: {
      type: 'string',
    },

    creation_date: {
      type: 'datetime',
    },

    isAuthor: function(user) {
      return user && user.user_id === this.author_id;
    }
  }
});
