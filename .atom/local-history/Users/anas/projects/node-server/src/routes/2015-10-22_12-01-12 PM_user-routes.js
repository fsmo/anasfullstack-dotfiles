var geoip = require('geoip-lite');
var P = require('bluebird');
var passport = require('passport');
var cookieSignature = require('cookie-signature');
var orm = pRequire('/orm');
var fs = require('fs');
var base64 = require('base64-stream');
var path = require('path');
var str = require('string-to-stream');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;

var UserManager = pRequire('/managers/user-manager');
var UserController = pRequire('/controllers/user-controller');
var SubscriptionController = pRequire('/controllers/subscription-controller');
var modelUtil = pRequire('/lib/model-util');
var LocationManager = pRequire('/managers/location-manager');
var FlagsManager = pRequire('/managers/user-flags-manager');

var apiUtil = pRequire('/lib/api-util');
var auth = pRequire('/lib/auth');
var global = pRequire('/global');
var idgen = pRequire('/lib/idgen');

var apiApp = global.apiApp;

passport.serializeUser(function(user, done) {
  done(null, user.user_id);
});

passport.deserializeUser(function(id, done) {
  UserManager.getById(id).done(function(user) {
    done(null, user);
  }, function(err) {
    done(null, false);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password'
  },
  function(username, password, done) {
    UserController.checkCredentials(username, password).done(function(user) {
      done(null, user);
    }, function(err) {
      done(err);
    });
  }));

function loginFacebook(platform) {
  return function(accessToken, refreshToken, profile, done) {
    UserController.checkFacebook(accessToken, refreshToken, profile, platform).done(function(user) {
      done(null, user);
    }, function(err) {
      done(err);
    });
  };
}

function getLocation(req) {
  var xForward = req.headers['x-forwarded-for'];
  //  var xForward = '213.89.175.191, 205.251.218.67';
  var ipSplited = null;
  if (xForward) {
    ipSplited = xForward.split(",")[0];
  }
  var ip = ipSplited || req.connection.remoteAddress;
  var location = geoip.lookup(ip);
  if ( location && location.country){
    var countryFullname =  LocationManager.findByCode(location.country);
    location.countryFullname = countryFullname.name;
  }
  return location;
}

function setCountryIfNotFound(req) {
  var location = getLocation(req);
  var userInfo = null;
  if (req && req.user){userInfo = req.user.getPrivateObject();}
  if (userInfo && userInfo.country === null && location !== null) {
    userLocation = {};
    userLocation.country = location.countryFullname;
    var userQuery = {};
    userQuery.user_id = userInfo.user_id;
    return orm.getModel('user')
      .findOne(userQuery)
      .then(function(user) {
        return modelUtil.update(user, ['country'], userLocation);
      });
  } else {
    return true;
  }
}

passport.use('facebook_web', new FacebookStrategy({
    clientID: global.credentials.facebook.clientID,
    clientSecret: global.credentials.facebook.clientSecret,
    callbackURL: 'https://my.scorecloud.com/api/2.0/login/facebook/web/fallback',
    enableProof: false
  },
  loginFacebook('web')
));

passport.use('facebook_studio', new FacebookStrategy({
    clientID: global.credentials.facebook.clientID,
    clientSecret: global.credentials.facebook.clientSecret,
    callbackURL: 'https://my.scorecloud.com/api/2.0/login/facebook/studio/fallback',
    enableProof: false
  },
  loginFacebook('studio')
));

passport.use(new FacebookTokenStrategy({
    clientID: global.credentials.facebook.clientID,
    clientSecret: global.credentials.facebook.clientSecret
  },
  loginFacebook('ios')
));

// Web Facebook login

apiApp.get('/login/facebook/web',
  function(req, res, next) {
    setCountryIfNotFound(req);
    FlagsManager.addLoginFlag(req);
    req.session.facebookRedirectTo = req.header('Referer');
    next();
  },
  passport.authenticate('facebook_web', {
    scope: ['public_profile', 'email', 'user_friends']
  }));

apiApp.get('/login/facebook/web/fallback',
  passport.authenticate('facebook_web', {
    failureRedirect: '/'
  }),
  function(req, res) {
    var target = req.session.facebookRedirectTo || '/';
    delete req.session.facebookRedirectTo;
    res.redirect(target);
  });

// Studio Facebook login

apiApp.get('/login/facebook/studio',
  passport.authenticate('facebook_studio', {
    scope: ['public_profile', 'email', 'user_friends']
  }));

apiApp.get('/login/facebook/studio/fallback',
  passport.authenticate('facebook_studio', {
    failureRedirect: '/api/2.0/login/facebook/studio/failure'
  }),
  function(req, res) {
    setCountryIfNotFound(req);
    FlagsManager.addLoginFlag(req);
    res.redirect('/api/2.0/login/facebook/studio/success?session=' + encodeURIComponent(req.cookies.session_id));
  });

apiApp.get('/login/facebook/studio/success', function(req, res) {
  res.send('login success');
});
apiApp.get('/login/facebook/studio/failure', function(req, res) {
  res.send('login failed');
});

function sendUserLoginResponse(req, res) {
  var userObj = req.user.getPrivateObject();

  userObj.session_id = encodeURIComponent(
    's:' + cookieSignature.sign(req.sessionID, global.sessionSecret));

  res.json(userObj);
}

// iOS facebook login

apiApp.post('/login/facebook/token',
  global.parseFormData,
  passport.authenticate('facebook-token'),
  SubscriptionController.middleware.withSubscriptionStatus(),
  function(req, res, next) {
    setCountryIfNotFound(req);
    FlagsManager.addLoginFlag(req);
    next();
  },
  sendUserLoginResponse);

apiApp.post('/login',
  global.parseFormData,
  passport.authenticate('local'),
  SubscriptionController.middleware.withSubscriptionStatus(),
  function(req, res, next) {
    setCountryIfNotFound(req);
    FlagsManager.addLoginFlag(req);
    next();
  },
  sendUserLoginResponse);

function logout(req, res) {
  req.logout();

  req.session.regenerate(function(err) {
    res.send();
  });
}

apiApp.post('/logout', logout);
global.app.get('/logout', logout);

apiApp.get('/current-user/info',
  auth.requireLogin,
  SubscriptionController.middleware.withSubscriptionStatus(),
  function(req, res) {
    res.json(req.user.getPrivateObject());
  });

apiApp.get('/user/:id/info', function(req, res) {
  UserManager.getById(req.params.id).then(function(user) {
    res.json(user.getPublicObject());
  }, function(err) {
    apiUtil.sendError(res, err);
  });
});

apiApp.post('/current-user/update', global.parseFormData, auth.requireLogin, function(req, res) {
  UserController.update(req.user, req.body).then(function(user) {
    res.json(user.getPrivateObject());
  }, function(err) {
    apiUtil.sendError(res, err);
  });
});

apiApp.get('/current-user/location', function(req, res) {
  res.json(getLocation(req));
});

apiApp.get('/current-user/delete-account',
  function(req, res) {
    apiUtil.sendResponse(res, DeactivateManager.deleteAllUserInfo(req.user.user_id));
  }
);

// TESTESTESTESTESTESTEST

var spawn = require('child_process').spawn;
var util = pRequire('/lib/util');

function soxWrapper(stream, args) {
  var sox = spawn('sox', args);
  stream.pipe(sox.stdin);
  return { promise: util.promisifyProcess(sox), stream: sox.stdout };
}

function pcmToOgg(stream) {
  // var args = [
  //   '-r', '44100', '-e', 'signed', '-b', '16', '-c', '1', '-t', 'raw', '-',
  //   '-C', '3.0', '-r', '44100', '-t', 'ogg', 'teststream_node.ogg' //'-'
  // ];


  var args = [ '-t', 'mp3', '-', '-C', '96.0', '-r', '44100', '-t', 'mp3', '-' ];
  return soxWrapper(stream, args);
}

apiApp.post('/test-goldfish', function(req, res) {
  idgen.generateId().then(function(id) {
    var chunkName = id;
    var jsonFileDir = path.normalize(__dirname + '/../record-analysis/' + chunkName + '.ogg');
    var writeStream = fs.createWriteStream(jsonFileDir);

    // var args = ['--i', '-D', '-'];
    // var soxi = spawn('sox', args);
    //
    // req.pipe(soxi.stdin);
    // soxi.stdout.pipe(process.stdout);

    var convert = pcmToOgg(req);

    convert.stream.pipe(writeStream);

    convert.promise.then(function() {
      res.send('Write Stream End');
    });

    // req.pipe(writeStream);

    // req.on('end', function() {
      // res.send('Write Stream End');
    // });
  });
});
