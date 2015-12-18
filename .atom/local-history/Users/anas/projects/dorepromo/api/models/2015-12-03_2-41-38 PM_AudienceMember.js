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

    owners: {
      collection: 'AudienceList',
      via       : 'members'
    }

  }
};
