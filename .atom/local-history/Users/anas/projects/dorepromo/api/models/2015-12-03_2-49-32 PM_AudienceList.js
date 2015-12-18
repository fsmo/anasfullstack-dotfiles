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
      required: true,
      minLength: 5,
      maxLength: 50
    },

    members: {
      collection: 'AudienceMember',
      via       : 'lists'
    }
  }
};
