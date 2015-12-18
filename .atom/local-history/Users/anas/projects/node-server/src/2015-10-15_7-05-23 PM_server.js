
if(!module.parent) {
  throw 'Don\'t run this file directly, run src/main.js instead!';
}

var _ = require('underscore');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var urlLib = require('url');
var colors = require('colors/safe');
var uid = require('uid-safe').sync;

var global = pRequire('/global');
var orm = pRequire('/orm');
var error = pRequire('/lib/error');
var log = pRequire('/lib/log');
var apiUtil = pRequire('/lib/api-util');

var app = global.app;

function randomColorFunction() {
  return colors[_.sample([
    'red', 'green', 'yellow',
    'blue', 'magenta', 'cyan', 'white'
  ])];
}

app.use(bodyParser);


////
//// Request logger
//// Adds a logger that outputs a randomly selected color and an id to every log message.

app.use(function(req, res, next) {
  var reqId = shortid.generate();
  req.requestId = reqId;

  var prefix = '';
  prefix += randomColorFunction()('■');
  prefix += ' ';

  prefix += reqId.replace(/^../, function(match) {
    return colors.bold(match);
  });

  prefix += colors.gray(' - ');

  req.logger = log.createLogger('[request]', {
    prefix: prefix
  });
  res.logger = req.logger; // for convenience

  next();
});

// Log at the beginning and end of every request.

app.use(function(req, res, next) {
  var parsedUrl = urlLib.parse(req.originalUrl);
  var logString = '';

  var methodColor = colors.reset;

  if(req.method === 'GET') {
    methodColor = colors.cyan;
  } else if(req.method === 'POST') {
    methodColor = colors.magenta;
  }

  logString += methodColor(req.method);
  logString += ' ';
  logString += colors.bold((parsedUrl.pathname.match(/[^\/]+$/) || [''])[0]);
  logString += colors.gray(' - ');

  if(parsedUrl.pathname.match(/^\/api\/2.0\//)) {
    logString += colors.gray('/api/2.0/');
  }

  logString +=
    parsedUrl.pathname
      .replace(/^\/api\/2.0\//, '')
      .replace(/\//g, colors.gray('/'));

  logString += colors.gray(parsedUrl.search || '');

  req.logger.info(logString);

  req.on('end', function() {
    req.logger.info('Response sent');
  });

  next();
});

app.use(require('cookie-parser')());

var PGStore = require('connect-pg-simple')(session);
var pg = require('../lib/pg');

app.use(session({
  name: 'session_id',
  secret: global.sessionSecret,
  cookie: { path: '/', httpOnly: true, secure: false,
    maxAge:
      3600000 * // hour
      24 *      // day
      30        // month
  },
  store: new PGStore({
    pg: pg,
    conString: global.credentials.postgres
  }),
  resave: true,
  saveUninitialized: true
}));

var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-timeout')('10m')); // timeout all requests after 10 min

app.get('/', function(req, res, next) {
  var redirectUrl = null;

  redirectUrl = 'my.scorecloud.com';

  if(req.hostname === 'api.scorecloud.com') {
    redirectUrl = 'my.scorecloud.com';
  } else if(req.hostname === 'alpha-api.scorecloud.com') {
    redirectUrl = 'alpha-my.scorecloud.com';
  }

  if(redirectUrl) {
    res.status(301).redirect('https://' + redirectUrl);
  } else {
    next();
  }
});


app.use('/api/2.0', global.apiApp);

require('./routes/admin-routes');
require('./routes/subscription-restrictions');
require('./routes/analysis-routes');
require('./routes/comment-routes');
require('./routes/song-routes');
require('./routes/static-song-routes');
require('./routes/user-routes');
require('./routes/subscription-routes');
require('./routes/like-routes.js');
require('./routes/bookmark-routes.js');
require('./routes/collection-routes.js');
require('./routes/location-routes.js');
require('./routes/notification-routes.js');
require('./routes/flags-routes.js');

var tags = [
  { name: 'A cappella', cssClass: 'acappella' },
  { name: 'Ambient' },
  { name: 'Assignments' },
  { name: 'Classical' },
  { name: 'Country' },
  { name: 'Dance' },
  { name: 'Electronic' },
  { name: 'Exercises' },
  { name: 'Folk' },
  { name: 'Funk' },
  { name: 'Game' },
  { name: 'Choir / Gospel', cssClass: 'choir-gospel' },
  { name: 'Hip-Hop' },
  { name: 'Jazz' },
  { name: 'Latin' },
  { name: 'Musical' },
  { name: 'Pop' },
  { name: 'Reggae' },
  { name: 'Rock' },
  { name: 'Soundtrack' },
  { name: 'Other' }
];

var _ = require('underscore');
var tagNames = _.pluck(tags, 'name');

global.apiApp.get('/tags/genres', function(req, res) {
  res.json(tagNames);
});

function init(handler) {
  orm.init(function() {
    app.use(handler);

    // Handle errors
    app.use(function(err, req, res, next) {
      if(err.code === 'ETIMEDOUT') {
        err = error.serverError({ errorType: 'timeout' });
      }

      apiUtil.sendError(res, err);
    });

    app.listen(global.port);
    log.info('Listening on port ' + global.port);
  });
}
exports.init = init;
