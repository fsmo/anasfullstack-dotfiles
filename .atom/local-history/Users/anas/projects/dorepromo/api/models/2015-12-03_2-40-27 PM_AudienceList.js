/**
* AudienceList.js
*
* @description :: AudienceList Model
**/

module.exports = {

  attributes: {
    name: {type: 'string'},
    owners: {
  collection: 'AudienceList',
  via       : 'AudienceMembers'
}
  }
};
