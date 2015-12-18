/**
* AudienceListModel.js
*
* @description :: Model for audience List
*/

module.exports = {

  attributes: {
    name: {
      type     : 'string',
      required : true,
      minLength: 5,
      maxLength: 25
    }
  }
};
