module.exports.http = {
  passportInit: require('passport').initialize(),
  passportSession: require('passport').session(),

  sessionRequired: function(req, res, next) {
    'use strict';
    if (!req.session) {
      return next(new Error('oh no')); // handle error
    }
    next(); // otherwise continue
  },

  middleware: {
    order: [
    'startRequestTimer',
    'cookieParser',
    'session',
    'bodyParser',
    'passportInit',
    'passportSession',
    'myRequestLogger',
    'handleBodyParserError',
    'compress',
    'methodOverride',
    'poweredBy',
    'sessionRequired',
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
