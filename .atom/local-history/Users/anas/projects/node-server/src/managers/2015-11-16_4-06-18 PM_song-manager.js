
var _     = require('underscore');

var orm   = pRequire('/orm');
var error = pRequire('/lib/error');
var auth  = pRequire('/lib/auth');
var idgen = pRequire('/lib/idgen');
var P     = require('bluebird');
var log   = pRequire('/lib/log');
var util  = pRequire('/lib/util');

var SongController = pRequire('/controllers/song-controller');

// Returns a model instance of models/song
function getModel() {
  return orm.getModel('song');
}
exports.getSongModel=getModel;

function getMetaModel() {
  return orm.getModel('song_meta');
}

function getRecordingSongViewModel() {
  return orm.getModel('recording_song_view');
}

function getMaterializedSongViewModel() {
  return orm.getModel('materialized_song_view');
}

function getBookmarkModel(){
  return orm.getModel('bookmark');
}

function getCollectionsSongsView() {
  return orm.getModel('collections_songs_view');
}

function getTagModel() {
  return orm.getModel('tag');
}

function getTagstoObject() {
  return orm.getModel('tag_to_object');
}

function createSong(user, properties) {
  return idgen.generateId().then(function(songId) {
    properties = _.extend({
      song_id      : songId,
      author_id    : user.user_id,
      title        : '',
      creation_date: new Date(),
      is_active    : true,
      is_shared    : false,
      is_deleted   : false,
      last_update  : new Date(),
      is_public    : false
    }, properties);

    return getModel().create(properties);
  });
}
exports.createSong = createSong;

function getById(id) {
  return getModel().findOne({song_id: id}).then(function(song) {
    if(song) { return song; }

    throw error.notFound('song not found');
  });
}
exports.getById = getById;

function searchByUserId(userId) {
  return getModel().find({ author_id: userId, is_active: true, is_deleted: false });
}
exports.searchByUserId = searchByUserId;

function search(searchObj) {
  searchObj = _.pick(searchObj, ['title', 'author_id']);

  return getModel().find(searchObj).toPromise();
}
exports.search = search;

function getSongMeta(id, createIfNotFound) {
  return getMetaModel().findOne({song_id: id}).then(function(songMeta) {
    if(songMeta) { return songMeta; }

    if(createIfNotFound) {
      return getMetaModel().create({song_id: id});
    } else {
      return null;
      // throw error.notFound('song meta not found');
    }
  });
}
exports.getSongMeta = getSongMeta;

function getSongsListFiltered(filter) {
  var query = {
    'is_public' : true,
    'is_deleted': false,
    'is_active' : true
  };
  query[filter] = {'!': null};
  var sort = {};
  sort[filter] = 'desc';
  return getModel()
    .find(query)
    .sort(sort)
    .limit(100);
}
exports.getSongsListFiltered = getSongsListFiltered;

function songsSearchQuery(req, currentUser) {
  var query = {};

// converting the old search query from popular –> popularity
  if(req.query && req.query.sort == 'popular'){
    req.query.sort = 'popularity';
  }

  query = _.extend({
    sort   : 'creation_date',
    offset : 0,
    limit  : 100,
    tag    : null,
    user_id: null
  }, req.query);

  if (currentUser && !req.query.limit) {
      query.limit = 100;
  }
  // if (query.tag) {
  //   query.search = _.extend({
  //     tags_names: {
  //       'contains': query.tag
  //     }
  //   }, query.search ||  {});
  //   }
  return query;
}
exports.songsSearchQuery=songsSearchQuery;

function getSongsBytag(req){
  return getTagModel().findOne({name: req.query.tag}).then(function(tag){
    if(tag){
      return getTagstoObject().find({tag_id:tag.tag_id}).then(function(tagObjects){
        if(tagObjects){
          return  P.map(tagObjects,function(tagObj){
            if(tagObj.object_type_id != 1){return;}
            return getModel().findOne({
              song_id: tagObj.object_id,
              is_public: true,
              is_deleted: false}).then(function(song){
                if(song){
                  return SongController.populateSongCurrentPermissions(song, req.user, null);
                }
              });
          }).then(function(songs){
            var allSongs = _.filter(songs,function(song){
              return song != null;
            });
            return {"songs" : allSongs};
          });
        }
      });
    }
  });
}

function getSongsList(req, currentUser, localQuery) {
  if (req.query && req.query.tag){
    return getSongsBytag(req);
  }else{
    var query    = localQuery || songsSearchQuery(req, currentUser);

    query.search = _.extend({
      is_deleted: false,
      is_active : true
    }, query.search || {});

    if (currentUser) {
      query.search.author_id = req.user.user_id;
    } else {
      query.search.is_public = true;
      if (query.user_id) {
        query.search.author_id = query.user_id;
      }
    }

    return getMaterializedSongViewModel()
      .find(query.search)
      .sort(query.sort + ' DESC')
      .skip(query.offset)
      .limit(query.limit)
      .then(function(songs) {
        return P.map(songs, function(song) {
            return SongController.populateSongCurrentPermissions(song, req.user, null)
              .then(function(result) {return result;});
          })
          .then(function(allSongs) {
            return ({"songs": allSongs});
          });
      });
  }
}
exports.getSongsList = getSongsList;

function getCurrentUserBookmarkedSongs(req) {
  var query = songsSearchQuery(req, true);
  query.search = _.extend({
    user_id: req.user.user_id
  }, query.search || {});
  return orm.getModel('bookmarked_songs_view')
    .find(query.search)
    .sort(query.sort + ' DESC')
    .skip(query.offset)
    .limit(query.limit)
    .then(function(songs) {
      return P.map(songs, function(song) {
        return SongController.populateSongCurrentPermissions(song, req.user, null)
          .then(function(result) {
            return result;
          });
      });
    });
}
exports.getCurrentUserBookmarkedSongs = getCurrentUserBookmarkedSongs;

function getCurrentUserUncollectedSongs(req) {
  var query = songsSearchQuery(req, true);

  query.search = _.extend({
    author_id: req.user.user_id
  }, query.search || {});

    return getCollectionsSongsView()
      .find({owner_id: req.user.user_id})
      .then(function(collectedSongs){
        return getRecordingSongViewModel()
        .find(query.search)
        .sort(query.sort + ' DESC')
        .then(function(userSongs){
          return P.map(userSongs,function(song){
              return  _.find(collectedSongs,function(collectedSong){
                return (collectedSong.song_id == song.song_id);
              });
          }).then(function(uncollected_songs){

            var unCollectedSongs = _.filter(uncollected_songs,function(song){return song ! = null;});
            var offset           = parseInt(query.offset);
            var limit            = parseInt(query.limit);
            var unCollected      = unCollectedSongs.slice(offset,offset+limit);

            return P.map(unCollected, function(song) {
              return SongController.populateSongCurrentPermissions(song, req.user, null)
                .then(function(result) {return result;  });
            }).then(function(songs){
              return {"songs" : songs};
            });
          });
        });
      });
  }
exports.getCurrentUserUncollectedSongs = getCurrentUserUncollectedSongs;

function getALLBestSongsList(req) {
  var query  = songsSearchQuery(req, false);
  query.sort = 'maturity';

  query.search = _.extend({
    'maturity': {'>': 5}
  }, query.search || {});

  return getSongsList(query, false);
}
exports.getBestSongsList = getALLBestSongsList;

function  getRecentBestSongsList(req) {
  var monthAgo = new Date();
  var query    = songsSearchQuery(req, false);

  monthAgo.setDate(monthAgo.getDate() - 30);

  query.search = _.extend({
    'maturity'     : {'>': 5},
    'creation_date': {'>': monthAgo},
  }, query.search || {});

  query.sort = 'maturity';

  return getSongsList(req, false, query );
}
exports.getRecentBestSongsList = getRecentBestSongsList;
