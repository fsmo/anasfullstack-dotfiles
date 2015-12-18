/**
* AudienceList.js
*
* @description :: AudienceList Model
**/

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    members: {
      collection: 'AudienceMembers',
      via       : 'lists'
    }
  }
};
