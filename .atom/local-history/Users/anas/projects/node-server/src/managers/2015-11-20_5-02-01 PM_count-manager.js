var _ = require('underscore');
var P = require('bluebird');
var orm = pRequire('/orm');
var error = pRequire('/lib/error');

var modelUtil = pRequire('/lib/model-util');
var CommentsController = pRequire('/controllers/comment-controller');
var LikesController = pRequire('/controllers/like-controller');
var BookmarksController = pRequire('/controllers/bookmark-controller');
var ObjectTypeController = pRequire('/controllers/object-type-controller');

function getModel(objType) {
  return orm.getModel(objType);
}

function getCounterRecord(objectType, objectId) {
  return ObjectTypeController.getObjectTypeId(objectType)
    .then(function(objectTypeId) {
      return getModel('object_counters')
        .findOne()
        .where({
          object_id: objectId,
          object_type_id: objectTypeId
        });
    });
}
exports.getCounterRecord=getCounterRecord;

function updateCounter(objectType, objectId, counterType, counter) {
  var createQuery = {};
  var objectCounterName;
  return ObjectTypeController.getObjectTypeId(objectType)
    .then(function(objectTypeId) {
      createQuery = {
        object_id: objectId,
        object_type_id: objectTypeId
      };
      createQuery[counterType] = counter[counterType];
      return getCounterRecord(objectType, objectId)
        .then(function(record) {
          if (record) {
            return modelUtil.update(record, [counterType], counter);
          } else {
            return getModel('object_counters')
              .create(createQuery).toPromise();
          }
        });
    });
}

function incrementCounterValue(objectType, objectId, counterType) {
  return getCounterRecord(objectType, objectId)
    .then(function(record) {
      var counter = {};
      if (!record) {
        counter[counterType] = 1;
      } else {
        counter[counterType] = record[counterType] + 1;
      }
      return updateCounter(objectType, objectId, counterType, counter);
    });
}

// comments Count
function UpdateCommentsCount(objectType, objectId) {
  return CommentsController.getCommentsForObjectType(objectType, objectId)
    .then(function(results) {
      var counter = {
        comment_count: results.length
      };
      return updateCounter(objectType, objectId, 'comment_count', counter);
    });
}
exports.UpdateCommentsCount = UpdateCommentsCount;

// likes Count
function UpdateLikesCount(objectType, objectId) {
  return LikesController.getLikesForObject(objectType, objectId)
    .then(function(results) {
      var counter = {
        like_count: results.length
      };
      return updateCounter(objectType, objectId, 'like_count', counter);
    });
}
exports.UpdateLikesCount = UpdateLikesCount;

// bookmark Count
function UpdateBookmarksCount(objectType, objectId) {
  return BookmarksController.getBookmarksForObject(objectType, objectId)
    .then(function(results) {
      var counter = {
        bookmark_count: results.length
      };
      return updateCounter(objectType, objectId, 'bookmark_count', counter);
    });
}
exports.UpdateBookmarksCount = UpdateBookmarksCount;

// Views Count
function UpdateViewsCount(objectType, objectId) {
return incrementCounterValue(objectType, objectId, 'view_count');
}
exports.UpdateViewsCount = UpdateViewsCount;

// plays Count
function UpdatePlaysCount(objectType, objectId) {
return incrementCounterValue(objectType, objectId, 'play_count');
}
exports.UpdatePlaysCount = UpdatePlaysCount;

function getUserCounters(userId) {
  return getModel('song')
    .find({
        author_id: userId,
        is_deleted: false },
        { fields: { song_id: 1 } }
    ).then(function(songIds) {
      return P.map(songIds, function(song){
        return getModel('object_counters').find({ object_id: song.song_id })
      }).then(function(counters){
        return _.filter(counters, function(counter){ return !!counter; });
      })
})
}
