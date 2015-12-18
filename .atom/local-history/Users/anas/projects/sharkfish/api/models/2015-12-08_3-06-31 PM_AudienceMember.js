/**
* AudienceMember.js
*
* @description :: AudienceMember Model
*/

module.exports = {

  attributes: {

    email: {
      type: 'email',
      required: true
    },

    lists: {
      collection: 'AudienceList',
      via: 'members'
    }

  }
};
