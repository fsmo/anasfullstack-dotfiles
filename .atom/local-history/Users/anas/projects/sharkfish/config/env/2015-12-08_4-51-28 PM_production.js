module.exports = {

  models: {
    connection: 'mongo',
    url: process.env.MONGOLAB_URI
  },

  port: 443,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
