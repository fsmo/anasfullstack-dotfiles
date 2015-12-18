module.exports.http = {
  passportInit: require('passport').initialize(),
  passportSession: require('passport').session(),

  middleware: {
    order: [
    'startRequestTimer',
    'bodyParser',

    'cookieParser',
    'session',
    'passportInit',
    'passportSession',
    'myRequestLogger',
    'handleBodyParserError',
    'compress',
    'methodOverride',
    'poweredBy',
    'router',
    'www',
    'favicon',
    '404',
    '500'
    ],

    myRequestLogger: function(req, res, next) {
      'use strict';
      sails.log.info(Date(Date.now()), 'Requested :: ', req.method, req.url);
      return next();
    }

    // bodyParser: require('skipper')

  },

  cache: 31557600000
};
