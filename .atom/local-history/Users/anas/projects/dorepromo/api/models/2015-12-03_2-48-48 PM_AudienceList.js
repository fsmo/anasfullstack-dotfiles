/**
* AudienceList.js
*
* @description :: AudienceList Model
**/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      unique: true,
      required: true
    },

    members: {
      collection: 'AudienceMember',
      via       : 'lists'
    }
  }
};
