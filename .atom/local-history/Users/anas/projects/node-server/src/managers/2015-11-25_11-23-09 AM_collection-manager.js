var _ = require('underscore');
var P = require('bluebird');
var orm = pRequire('/orm');

var CountManager = pRequire('/managers/count-manager');
var SongManager = pRequire('/managers/song-manager');
var SongController = pRequire('/controllers/song-controller');

function getModel(modelName) {
  return orm.getModel(modelName);
}

function getAllUserCollections(userId) {
  return getModel('song_collection')
    .find({
      'owner_id': userId
    })
    .then(function(collections) {
      // injectecting number of songs in each collection
      return P.map(collections, function(collection) {
        return getModel('song_folder')
          .count({collection_id: collection.collection_id})
          .then(function(songCount) {
            collection.song_count = songCount;
            // injecting counters info in each collection
            return CountManager.getCounterRecord('collection', collection.collection_id)
              .then(function(counter) {
                if (counter) {
                  collection.collection_counters = counter;
                }
                return collection;
              });
          });
      });
    })
    .then(function(collections) {
      return ({
        'collections': collections
      });
    });
}
exports.getAllUserCollections = getAllUserCollections;

function getCollectionSongs(req) {
  var query = SongManager.songsSearchQuery(req, true);
  query.search = _.extend({
    'collection_id': req.params.collection_id
  }, query.search || {});
  if (req.query.user_id) {
    query.search.author_id = req.query.user_id;
  }
  return getModel('collections_songs_view')
    .find(query.search)
    .skip(query.offset)
    .sort('song_folder_serial_id')
    .limit(query.limit)
    .then(function(songs) {
      return P.map(songs, function(song) {
        return SongController.populateSongCurrentPermissions(song, req.user, null)
          .then(function(result) {
            return result;
          });
      }).then(function(songsList){
        return ({'songs': songsList});
      });
    });
}
exports.getCollectionSongs = getCollectionSongs;
