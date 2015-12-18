/**
* AudienceMember.js
*
* @description :: AudienceMember Model
*/

module.exports = {

  attributes: {

    email: {
      type: 'string'
    },

    lists: {
      collection: 'AudienceList',
      via       : 'members'
    }

  }
};
