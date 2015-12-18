var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
  identity: 'materialized_song_view',
  viewName: 'materialized_song_view',
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

    is_active: {
      type: 'boolean',
    },

    is_shared: {
      type: 'boolean',
    },

    is_deleted: {
      type: 'boolean',
    },

    is_unsorted: {
      type: 'boolean',
    },

    current_scld_id: {
      type: 'string',
    },

    meta: {
      type: 'object',
    },

    current_revision_id: {
      type: 'string',
    },

    last_update: {
      type: 'datetime',
    },

    is_public: {
      type: 'boolean',
    },

    permissions: {
      type: 'object',
    },

    maturity: {
      type: 'integer',
    },

    popularity: {
      type: 'integer',
    },

    comment_count: {
      type: 'integer',
    },

    like_count: {
      type: 'integer',
    },

    bookmark_count: {
      type: 'integer',
    },

    view_count: {
      type: 'integer',
    },

    play_count: {
      type: 'integer',
    },

    analysis_id: {
      type: 'string',
    },

    recording_id: {
      type: 'string',
    },

    cuex_id: {
      type: 'string',
    },

    scld_id: {
      type: 'string',
    },

    noise_level: {
      type: 'integer',
    },

    detail_level: {
      type: 'integer',
    },

    duration: {
      type: 'integer',
    },

    scls_id: {
      type: 'string',
    },

    username: {
      type: 'string',
    },

    display_name: {
      type: 'string',
    },

    tag_names: {
      type: 'string',
    },

    song_best_score: {
      type: 'integer',
    },

    isAuthor: function(user) {
      return user && user.user_id === this.author_id;
    }
  }
});
