var _ = require('underscore');
var P = require('bluebird');
var S3 = require('awssum-amazon-s3').S3;
var fs = require('fs');
var path = require('path');
var request = require('request');
var querystring = require('querystring');

var global = pRequire('/global');
var auth = pRequire('/lib/auth');
var util = pRequire('/lib/util');
var log = pRequire('/lib/log');
var apiUtil = pRequire('/lib/api-util');
var idgen = pRequire('/lib/idgen');

var apiApp = global.apiApp;
var s3client = new S3(global.credentials.aws);
var getObject = P.promisify(s3client.GetObject);

var SongController = pRequire('/controllers/song-controller');
var SongManager = pRequire('/managers/song-manager');
var s3FileController = pRequire('/controllers/static-song/s3-file-controller');
var CountManager = pRequire('/managers/count-manager');
var MaturityManager = pRequire('/managers/maturity-manager');

function getScld(song) {
  return new P(function(resolve, reject) {
    var remotePath = 'scld/' + song.current_scld_id;

    var options = {
      BucketName: global.credentials.aws.bucket || 'scorecleaner-cloud',
      ObjectName: remotePath
    };

    s3client.GetObject(options, {
      stream: true
    }, function(err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data.Stream);
    });
  });
}

function getMidi(song, query) {
  var queryObj = _.extend({}, getSafeQuery(query), {
    song_id: song.song_id,
    current_scld_id: song.current_scld_id
  });

  return getScld(song).then(function(scldStream) {
    return scldStream.pipe(
      request.post('http://' + global.credentials.modusHost + ':8088/song-to-midi?' + querystring.stringify(queryObj)));
  });
}

function getSafeQuery(query) {
  var out = {};

  if (query.tonic && query.tonic.match(/^[A-G](b|#)?/)) {
    out.tonic = query.tonic;
  }

  var tempo = parseFloat(query.tempo);

  if (!isNaN(tempo) && isFinite(tempo)) {
    tempo = Math.max(0, Math.min(5, tempo));

    out.tempo = tempo;
  }

  return out;
}

function songCachePath(song, ending, query) {
  var scldId = song.current_scld_id;

  var safeQuery = getSafeQuery(query || {});
  var params = '_';

  if (song.current_revision_id) {
    params += '_rev_' + song.current_revision_id + '_';
  }
  if (safeQuery.tonic) {
    params += '_key_' + safeQuery.tonic + '_';
  }
  if (safeQuery.tempo) {
    params += '_tempo_' + safeQuery.tempo + '_';
  }

  return path.join(global.dirs.cache, 'song', '' + scldId + params + '.' + ending);
}

function remoteSongCachePath(song, ending, query) {
  var scldId = song.current_scld_id;

  var safeQuery = getSafeQuery(query || {});
  var params = '_';

  if(song.current_revision_id) { params += '_rev_' + song.current_revision_id + '_'; }
  if(safeQuery.tonic) { params += '_key_' + safeQuery.tonic + '_'; }
  if(safeQuery.tempo) { params += '_tempo_' + safeQuery.tempo + '_'; }

  return 'cached/song/' + scldId + params + '.' + ending;
}

function midiToWav(song, query, id) {
  var tmpPath = path.join(global.dirs.cache, 'song', id) + '.wav';
  return util.runCommand('fluidsynth', ['-nli', '-F',
    tmpPath,
    path.join(global.dirs.resources, 'FluidR3_GM_extended.sf2'),
    songCachePath(song, 'midi', query)
  ]).then(function() {
    return tmpPath;
  });
}

function wavToMp3(song, query, fileId) {
  return util.runCommand('lame', [
    fileId,
    songCachePath(song, 'mp3', query)
  ]);
}

function wavToOgg(song, query, fileId) {
  return util.runCommand('oggenc', [
    fileId,
    '-o',
    songCachePath(song, 'ogg', query)
  ]);
}

function songToMidi(song, query) {
  return getMidi(song, query).then(function(midiStream) {
    return new P(function(resolve, reject) {
      var filePath = songCachePath(song, 'midi', query);
      var fileStream = fs.createWriteStream(filePath);

      midiStream.pipe(fileStream);

      midiStream.on('error', function(err) {
        reject(err);
      });

      midiStream.on('end', function() {
        resolve();
      });
    });
  });
}

function songToWav(song, query) {
  return songToMidi(song, query).then(function() {
    return idgen.generateId().then(function(id) {
      return midiToWav(song, query, id);
    });
  });
}

function songToMp3(song, query) {
  return songToWav(song, query).then(function(fileId) {
    return wavToMp3(song, query, fileId);
  });
}

function songToOgg(song, query) {
  return songToWav(song, query).then(function(fileId) {
    return wavToOgg(song, query, fileId);
  });
}

function cacheFile(opts) {
  var getEtag = opts.getEtag;
  var getPath = opts.getPath;
  var createFile = opts.createFile;
  var getRemoteCachePath = opts.getRemoteCachePath;

  var currentFiles = {};

  return function(req, res) {
    var path = getPath(req);
    var cachePath = getRemoteCachePath(req);

    if (!currentFiles[path]) {
      currentFiles[path] = new P(function(resolve, reject) {
        s3FileController.existsOnS3(cachePath).then(function(exists) {
          if(exists) {
            resolve(true);
          } else {
            createFile(req, path).then(function() {
              var stream = fs.createReadStream(path);
              s3FileController.uploadToS3(stream, cachePath).then(null, function(err) {
                log.error('Error uploading to s3 cache', err);
              });
              resolve(false);
            });
          }
        });
      });
    }

    currentFiles[path]
      // Always remove the entry in currentFiles to prevent memory leaks
      .finally(function() {
        delete currentFiles[path];
      }).then(function(getFromS3) {
        if(getFromS3) {
          log.debug('Streaming file from S3 cache');
          apiUtil.setCacheHeaders(res, opts.daysToCache);
          res.set('ETag', getEtag(req));
          // mime.lookup(path);
          res.type(path);
          s3FileController.streamFromS3ToResponse(res, cachePath);
        } else {
          // we serve the generated file from our server
          apiUtil.setCacheHeaders(res, opts.daysToCache);
          res.set('ETag', getEtag(req));
          res.sendFile(path);
        }
      }, function(err) {
        apiUtil.sendError(res, err);
      });
  };
}

function regenerateCache() {
  return function(req, res) {
    var mp3Path = songCachePath(req.song, 'mp3', req.query);
    var mp3CachePath = remoteSongCachePath(req.song, 'mp3', req.query);

    var oggPath = songCachePath(req.song, 'ogg', req.query);
    var oggCachePath = remoteSongCachePath(req.song, 'ogg', req.query);

    var createMp3 = songToMp3(req.song, req.query);
    var createOgg = songToOgg(req.song, req.query);

    var cachePromises = P.all([
      createMp3.then(function() {
        var stream = fs.createReadStream(mp3Path);
        return s3FileController.uploadToS3(stream, mp3CachePath);
      }),
      createOgg.then(function() {
        var stream = fs.createReadStream(oggPath);
        return s3FileController.uploadToS3(stream, oggCachePath);
      })
    ]);

    cachePromises.then(function() {
      res.json({ success: true });
    }, function(err) {
      apiUtil.sendError(res, err);
    });
  };
}

function getSongEtag(song) {
  return '"' + song.song_id + song.current_revision_id + '"';
}

apiApp.get('/song/:id/playback.mp3',
  SongController.middleware.getSong(),
  SongController.middleware.requireSongPermission(['get_playback']),
  cacheFile({
    getEtag: function(req) {
      return getSongEtag(req.song);
    },

    getPath: function(req) {
      return songCachePath(req.song, 'mp3', req.query);
    },

    getRemoteCachePath: function(req) {
      return remoteSongCachePath(req.song, 'mp3', req.query);
    },

    createFile: function(req, path) {
      return songToMp3(req.song, req.query);
    },

    daysToCache: 30
  }));

apiApp.get('/song/:id/playback.ogg',
  SongController.middleware.getSong(),
  SongController.middleware.requireSongPermission(['get_playback']),
  cacheFile({
    getEtag: function(req) {
      return getSongEtag(req.song);
    },

    getPath: function(req) {
      return songCachePath(req.song, 'ogg', req.query);
    },

    getRemoteCachePath: function(req) {
      return remoteSongCachePath(req.song, 'ogg', req.query);
    },

    createFile: function(req, path) {
      return songToOgg(req.song, req.query);
    },

    daysToCache: 30
  }));

apiApp.get('/admin/song/:id/regenerate-cache',
  auth.requireAdmin(),
  SongController.middleware.getSong(),
  SongController.middleware.requireSongPermission(['get_playback']),
  regenerateCache()
  );

apiApp.get('/song/:id/increase-play-count',
  function(req, res) {
    apiUtil.sendResponse(res, CountManager.UpdatePlaysCount('song', req.params.id));
  }
);

apiApp.post('/song/:id/embed/set',
  global.parseFormData,
  auth.requireLogin,
  SongController.middleware.requireSongPermission(['edit_song']),
  function(req, res) {
    apiUtil.sendResponse(res,
      SongController.setSongEmbed(req.params.id, req.body.embed).then(function(meta) {
        MaturityManager.updateSongMaturity(req.params.id);
      })
    );
  });

apiApp.post('/song/:id/meta/save',
  global.parseFormData,
  auth.requireLogin,
  SongController.middleware.requireSongPermission(['edit_song']),
  function(req, res) {
    apiUtil.sendResponse(res,
      SongController.setSongDescription(req.params.id, req.body.description).then(function(description) {
        MaturityManager.updateSongMaturity(req.params.id);
      })
    );
  });

apiApp.post('/current-user/songs/find',
  auth.requireLogin,
  global.parseFormData,
  function(req, res) {
    SongManager.search({
      title: req.body.title,
      author_id: req.user.user_id
    }).then(function(songs) {
      res.json(songs);
    }, function(err) {
      apiUtil.sendError(res, err);
    });
  });

// getSongsList(req, currentUser, localQuery, cached)
// url accepts those queries (sort, limit, offset,tag) eg.  .../current-user/songs?sort=popularity&limit=10&offset=5&tag=rock
apiApp.get('/current-user/songs',
  auth.requireLogin,
  function(req, res) {
    apiUtil.sendResponse(res, SongManager.getSongsList(req, true, null, false));
  });

// url accepts those queries (sort, limit, offset,tag) eg.  .../current-user/uncollected?sort=popularity&limit=10&offset=5&tag=rock
apiApp.get('/current-user/uncollected',
  auth.requireLogin,
  function(req, res) {
    apiUtil.sendResponse(res, SongManager.getCurrentUserUncollectedSongs(req));
  });

// url accepts those queries (user_id,sort, limit, offset,tag) eg.  .../songs/search?user_id=....&sort=popularity&limit=10&offset=5&tag=rock
apiApp.get('/songs/search',
  function(req, res) {
    apiUtil.sendResponse(res, SongManager.getSongsList(req, false));
  });

function sendSongInfo(req, res) {
  var song = req.song;
  var out = null;

  if(req.user && song.isAuthor(req.user)) {
    out = song.getPrivateObject();
  } else {
    out = song.getPublicObject();
  }

  CountManager.getCounterRecord('song',song.song_id).then(function(counters){
    out.counters = counters;
    res.json(out);
  });
}

apiApp.get('/song/:id/info',
  SongController.middleware.getSong(),
  SongController.middleware.populateSong(),
  SongController.middleware.requireSongPermission(['view_song']),
  sendSongInfo);

apiApp.get('/song/:id/info/view',
  SongController.middleware.getSong(),
  SongController.middleware.populateSong(),
  SongController.middleware.requireSongPermission(['view_song']),
  function(req, res, next) {
    CountManager.UpdateViewsCount('song', req.song.song_id);
    next();
  },
  sendSongInfo);

apiApp.get('/songs/list/popularity',
  function(req, res) {
    apiUtil.sendResponse(res,
      SongManager.getSongsListFiltered('popularity'));
  });

apiApp.get('/songs/list/maturity',
  function(req, res) {
    apiUtil.sendResponse(res,
      SongManager.getSongsListFiltered('maturity'));
  });

apiApp.get('/songs/list/best',
  function(req, res) {
    apiUtil.sendResponse(res,
      SongManager.getBestSongsList(req));
  });

apiApp.get('/songs/list/best-recent',
  function(req, res) {
    apiUtil.sendResponse(res,
      SongManager.getRecentBestSongsList(req));
  });
