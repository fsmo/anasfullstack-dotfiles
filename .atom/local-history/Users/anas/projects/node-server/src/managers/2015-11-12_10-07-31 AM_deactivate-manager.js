var _ = require('underscore');
var P = require('bluebird');
var orm = pRequire('/orm');
var error = pRequire('/lib/error');
var modelUtil = pRequire('/lib/model-util');
var log = pRequire('/lib/log');
var userManager = pRequire('/managers/user-manager');

function getModel(modelName) {
  return orm.getModel(modelName);
}

Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  };

  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
};

function deleteUserSongs(userId) {
  return getModel('song')
    .find({
      author_id: userId
    })
    .then(function(songs) {
      if (songs.length > 0) {
        log.debug('deleted Songs due to user deletion: ', songs.length);
        P.each(songs, function(song) {
          return modelUtil.update(song, ['is_deleted'], {
            'is_deleted': true
          });
        });
      }
    });

}

function deleteUserCollections(userId) {
  return getModel('song_collection')
    .find({owner_id: userId})
    .then(function(collections) {
      if (collections.length > 0) {

        log.debug('deleted Songs due to user deletion: ', collections.length);

        P.each(collections, function(collection) {
          return modelUtil.update(collection, ['is_deleted'], {'is_deleted': true});
        });
      }
    });
}

function checkUserDeleted(user) {
  if (user.username !== null && user.username.substring(0, 3) === 'DEL' && user.username.substring(9, 10) === ' ' || user.email !== null && user.email.substring(0, 3) === 'DEL' && user.email.substring(9, 10) === ' ' || user.facebook_id !== null && user.facebook_id.substring(0, 3) === 'DEL' && user.facebook_id.substring(9, 10) === ' ') {
    return true;
  } else {
    return false;
  }
}
exports.checkUserDeleted = checkUserDeleted;

function checkUserSubscribed(userId) {
  var now = new Date();
  return getModel('user_subscription_status')
    .findOne({
      user_id: userId,
      expiry_date: {'>': now}
    })
    .then(function(user_subscription) {
      return (!!user_subscription);
    });
}

function deleteUser(userId) {
  return userManager.getById(userId)
    .then(function(user) {
      var now                   = new Date().format("yyMMdd");
      var deleted               = "DEL" + now + " ";
      var userRegisterationDate = new Date(parseInt(user.registration_date) * 1000);

      if (checkUserDeleted(user)) {
        log.error('User already deleted!');
        return error.userError('User Already Deleted');
      } else {
        var updateObj = {
          username   : null,
          email      : null,
          facebook_id: null
        };
         return checkUserSubscribed(userId).then(function(subscribed){
           if(!subscribed){
             log.info("Deleting User # "+userId);
             
             if (user.username && user.username !== null) {
               updateObj.username = deleted + user.username;
             }
             
             if (user.email && user.email !== null) {
               updateObj.email = deleted + user.email;
             }
             
             if (user.facebook_id && user.facebook_id !== null) {
               var deletedFcId = deleted + user.facebook_id;
               updateObj.facebook_id = deletedFcId.substring(0, 20);
             }
             
             return modelUtil.update(user, ['username', 'email', 'facebook_id'], updateObj)
               .then(function() {
                 return deleteUserSongs(userId)
                   .then(function() {
                     return deleteUserCollections(userId)
                       .then(function() {
                         return ({'success': true});
                       });
                   });
               });
           } else {
             log.warning("someOne is trying to delete user # " + userId + " while he is a subscribed user !!!!!!!!");
             return error.userError('You can not delete subscribed user, fix that before deleting!!!');
           }
         });
       }
    });
}
exports.deleteAllUserInfo = deleteUser;
