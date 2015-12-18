module.exports.cors = {

  allRoutes: true,

  origin: '*',

  credentials: true,
  
  Access-Control-Allow-Credentials: true,

  methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',

  headers: 'content-type, Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept'

};
