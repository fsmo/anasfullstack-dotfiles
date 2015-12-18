
require('./pRequire');
var CronJob = require('cron').CronJob;

function createCronJob(time, onTick, onComplete){
  var cronJob = new CronJob({
    cronTime  : time,
    onTick    : onTick,
    onComplete: onComplete,
    start     : false,
    timeZone  : 'CET'
  });
  return cronJob;
}

(function initCron(handler) {
  var loadCredentials = require('./../credentials').loadCredentials;
  var log             = pRequire('/lib/log');
  var process         = require('process');

  loadCredentials(function(err, credentials) {
    if(err) { throw err; }

    var global = require('./global');

    global.setCredentials(credentials);

    var orm    = pRequire('/orm');

    orm.init(function() {
      var Seo     = pRequire('/managers/seo-manager').seoManager;
      var ML      = pRequire('/managers/mailing-list-manager').mailingLists;

      var running = ' cron job is now runnning!!';
      var ended   = ' cron job ended!!';
      var stopped = ' cron job stopped!!!';

      var cronTimes = {
      a : '00 51 11 * * *',
      b : '00 53 11 * * *',
      c : '00 03 12 * * *',
      d : '00 20 12 * * *',
      e : '00 28 12 * * *',
      f : '00 55 12 * * *',
      g1: '00 11 13 * * *',
      g2: '00 13 13 * * *',
      g3: '00 16 13 * * *',
      g4: '00 18 13 * * *',
      h : '00 22 13 * * *',
      i : '00 49 13 * * *',
      j : '00 54 13 * * *',
      k : '00 56 13 * * *',
      l : '00 30 15 * * *'
      };
      // var cronTimes = {
      // a : '00 15 04 * * *',
      // b : '00 30 04 * * *',
      // c : '00 00 05 * * *',
      // d : '00 30 05 * * *',
      // e : '00 00 06 * * *',
      // f : '00 30 06 * * *',
      // g1: '00 00 07 * * *',
      // g2: '00 15 07 * * *',
      // g3: '00 30 07 * * *',
      // g4: '00 45 07 * * *',
      // h : '00 00 08 * * *',
      // i : '00 00 09 * * *',
      // j : '00 30 09 * * *',
      // k : '00 00 10 * * *',
      // l : '00 15 10 * * *'
      // };

      //updateTopTagsMatView cron job runs daily at 04:15
      var updateTopTagsMatView = createCronJob(cronTimes.a,
        function() {
          log.info('updateTopTagsMatView', running, 'process # ', process.pid);

          orm.getModel('materialized_top_tags_view')
            .query('REFRESH MATERIALIZED VIEW materialized_top_tags_view;',
              function() {
                log.info('updateTopTagsMatView', ended);
                updateTopTagsMatView.stop();
              });
        },
        function() {
          log.info('updateTopTagsMatView', stopped, 'process # ', process.pid);
        });
      updateTopTagsMatView.start();

      //updateSongMatView cron job runs daily at 04:30
      var updateSongMatView = createCronJob(cronTimes.b,
        function() {
          log.info('updateSongMatView', running, 'process # ', process.pid);

          orm.getModel('materialized_song_view')
            .query('REFRESH MATERIALIZED VIEW materialized_song_view;',
              function() {
                log.info('updateSongMatView cron job ended');
                updateSongMatView.stop();
              });
        },
        function() {
          log.info('updateSongMatView', stopped, 'process # ', process.pid);
        });
      updateSongMatView.start();

      // addGaveUpUsers cron job runs daily at 05:00
      var addGaveUpUsers = createCronJob(cronTimes.c,
        function() {
          log.info('addGaveUpUsers', running, 'process # ', process.pid);
          ML.addGaveUpUsersToQueue().then(function() {
            addGaveUpUsers.stop();
          });
        },
        function() {
          log.info('addGaveUpUsers', stopped, 'process # ', process.pid);
        });
      addGaveUpUsers.start();

      // addNoNewSongsUsers cron job runs daily at 05:30
      var addNoNewSongsUsers = createCronJob(cronTimes.d,
        function() {
          log.info('addNoNewSongsUsers', running, 'process # ', process.pid);
          ML.addNoNewSongsUsersToQueue().then(function() {
            addNoNewSongsUsers.stop();
          });
        },
        function() {
          log.info('addNoNewSongsUsers', stopped, 'process # ', process.pid);
        });
      addNoNewSongsUsers.start();

      // addNoSongsUsers cron job runs daily at 06:00
      var addNoSongsUsers = createCronJob(cronTimes.e,
        function() {
          log.info('addNoSongsUsers', running, 'process # ', process.pid);
          ML.addNoSongsUsersToQueue().then(function() {
            addNoSongsUsers.stop();
          });
        },
        function() {
          log.info('addNoSongsUsers', stopped, 'process # ', process.pid);
        });
      addNoSongsUsers.start();

      // cron job runs daily at 06:30
      var addUsersWith10Songs = createCronJob(cronTimes.f,
        function() {
          log.info('addUsersWith10Songs', running, 'process # ', process.pid);
          ML.addUsersWith10SongsToQueue().then(function() {
            addUsersWith10Songs.stop();
          });
        },
        function() {
          log.info('addUsersWith10Songs', stopped, 'process # ', process.pid);
        });
      addUsersWith10Songs.start();

      // addNewUsersMainList cron job runs daily at 07:00
      var addNewUsersMainList = createCronJob(cronTimes.g1,
        function() {
          log.info('addNewUsersMainList', running, 'process # ', process.pid);

          ML.addNewUsersToRegistrationLists(1, ML.mailingListsNames.mainList)
            .then(function() {
              addNewUsersMainList.stop();
            });
        },
        function() {
          log.info('addNewUsersMainList', stopped, 'process # ', process.pid);
        });
      addNewUsersMainList.start();

      // addNewUsersToStudioList cron job runs daily at 07:15
      var addNewUsersToStudioList = createCronJob(cronTimes.g2,
        function() {
          log.info('addNewUsersToStudioList', running, 'process # ', process.pid);

          ML.addNewUsersToRegistrationLists(2, ML.mailingListsNames.studioList).then(function() {
            addNewUsersToStudioList.stop();
          });
        },
        function() {
          log.info('addNewUsersToStudioList', stopped, 'process # ', process.pid);
        });
      addNewUsersToStudioList.start();

      // addNewUsersToRegistration cron job runs daily at 07:30
    var addNewUsersToRegistration = createCronJob(cronTimes.g3,
      function() {
        log.info('addNewUsersToRegistration', running, 'process # ', process.pid);

        ML.addNewUsersToRegistrationLists(3, ML.mailingListsNames.expressList).then(function() {
          addNewUsersToRegistration.stop();
        });
      },
      function() {
        log.info('addNewUsersToRegistration', stopped, 'process # ', process.pid);
      });
    addNewUsersToRegistration.start();

      // addNewUsersToOthersList cron job runs daily at 07:45
      var addNewUsersToOthersList = createCronJob(cronTimes.g4,
        function() {
          log.info('addNewUsersToOthersList', running, 'process # ', process.pid);

          ML.addNewUsersToRegistrationLists(4, ML.mailingListsNames.mainList).then(function() {
            addNewUsersToOthersList.stop();
          });
        },
        function() {
          log.info('addNewUsersToOthersList', stopped, 'process # ', process.pid);
        });
      addNewUsersToOthersList.start();

      // addUsersToMailingList cron job runs daily at 08:00
      var addUsersToMailingList = createCronJob(cronTimes.h,
        function() {
          log.info('addUsersToMailingList', running, 'process # ', process.pid);

          ML.addUsersToMailingList().then(function() {
            addUsersToMailingList.stop();
          });
        },
        function() {
          log.info('addUsersToMailingList', stopped, 'process # ', process.pid);
        });
      addUsersToMailingList.start();

      // createProfileIndexes cron job runs daily at 09:00
      var createProfileIndexes = createCronJob(cronTimes.i,
        function() {
          log.info('createProfileIndexes', running, 'process # ', process.pid);

          Seo.createProfileIndexPages().then(function() {
            createProfileIndexes.stop();
          });
        },
        function() {
          log.info('createProfileIndexes', stopped, 'process # ', process.pid);
        });
      createProfileIndexes.start();

      // createSongsIndexes cron job runs daily at 09:30
      var createSongsIndexes = createCronJob(cronTimes.j,
        function() {
          log.info('createSongsIndexes', running, 'process # ', process.pid);

          Seo.createSongsIndexPages().then(function() {
            createSongsIndexes.stop();
          });
        },
        function() {
          log.info('createSongsIndexes', stopped, 'process # ', process.pid);
        });
      createSongsIndexes.start();

      // createSitemapsIndex cron job runs daily at 10:00
      var createSitemapsIndex = createCronJob(cronTimes.k,
        function() {
          log.info('createSitemapsIndex', running, 'process # ', process.pid);

          Seo.createSitemapsIndexPage().then(function() {
            createSitemapsIndex.stop();
          });
        },
        function() {
          log.info('createSitemapsIndex', stopped, 'process # ', process.pid);
        });
      createSitemapsIndex.start();

      //uploadSiteMaps cron job runs daily at 10:15
      var uploadSiteMaps = createCronJob(cronTimes.l, function() {
        log.info('uploadSiteMaps', running);
        Seo.uploadSiteMaps().then(function() {
            uploadSiteMaps.stop();
          });
        },
        function() {
          log.info('uploadSiteMaps', stopped);
        });
      uploadSiteMaps.start();
    });
  });
}());
