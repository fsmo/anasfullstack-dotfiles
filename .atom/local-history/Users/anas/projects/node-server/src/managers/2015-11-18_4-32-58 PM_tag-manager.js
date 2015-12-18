
var _     = require('underscore');
var P     = require('bluebird');
var orm   = pRequire('/orm');
var error = pRequire('/lib/error');

function getTagToObjectModel() {
  return orm.getModel('tag_to_object');
}

function getTopTagsModel(){
  return orm.getModel('materialized_top_tags_view')
}

function getTagsForSong(song) {
  return getTagToObjectModel().find({ object_id: song.song_id }).populate('tag_id').then(function(tags) {
    return tags;
  });
}
exports.getTagsForSong = getTagsForSong;

function getTagsSuggestions(){

}
