
require('./pRequire');
var schedule = require('node-schedule');

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
      var stopped = ' cron job stopped!!!';

      var cronTimes = {
        d15: '00 15 04 * * *',
        d30: '00 30 04 * * *',
        d45: '00 45 04 * * *',
        c: '00 00 05 * * *',
        d: '00 30 05 * * *',
        e: '00 00 06 * * *',
        f: '00 30 06 * * *',
        g1: '00 00 07 * * *',
        g2: '00 15 07 * * *',
        g3: '00 30 07 * * *',
        g4: '00 45 07 * * *',
        h: '00 00 08 * * *',
        i: '00 00 09 * * *',
        j: '00 30 09 * * *',
        k: '00 00 10 * * *',
        l: '00 15 10 * * *'
      };

      //updateTopTagsMatView cron job runs daily at 04:15
      schedule.scheduleJob(cronTimes.d15,
        function() {
          log.info('updateTopTagsMatView', running, 'process # ', process.pid);

          orm.getModel('materialized_top_tags_view')
            .query('REFRESH MATERIALIZED VIEW materialized_top_tags_view;',
              function() {
                log.info('updateTopTagsMatView', stopped, 'process # ', process.pid);
              });
        });

      //updateSongMatView cron job runs daily at 04:30
      schedule.scheduleJob(cronTimes.d30,
        function() {
          log.info('updateSongMatView', running, 'process # ', process.pid);

          orm.getModel('materialized_song_view')
            .query('REFRESH MATERIALIZED VIEW materialized_song_view;',
              function() {
                log.info('updateSongMatView', stopped, 'process # ', process.pid);
              });
        });

      //updateSongMatView cron job runs daily at 04:45
      schedule.scheduleJob(cronTimes.d45,
        function() {
          log.info('updateTopSongsMatView', running, 'process # ', process.pid);

          orm.getModel('materialized_top_songs_view')
            .query('REFRESH MATERIALIZED VIEW materialized_top_songs_view;',
              function() {
                log.info('updateTopSongsMatView', stopped, 'process # ', process.pid);
              });
        });

      // addGaveUpUsers cron job runs daily at 05:00
      schedule.scheduleJob(cronTimes.c,
        function() {
          log.info('addGaveUpUsers', running, 'process # ', process.pid);
          ML.addGaveUpUsersToQueue().then(function() {
            log.info('addGaveUpUsers', stopped, 'process # ', process.pid);
          });
        });

      // addNoNewSongsUsers cron job runs daily at 05:30
      schedule.scheduleJob(cronTimes.d,
        function() {
          log.info('addNoNewSongsUsers', running, 'process # ', process.pid);
          ML.addNoNewSongsUsersToQueue().then(function() {
            log.info('addNoNewSongsUsers', stopped, 'process # ', process.pid);
          });
        });

      // addNoSongsUsers cron job runs daily at 06:00
      schedule.scheduleJob(cronTimes.e,
        function() {
          log.info('addNoSongsUsers', running, 'process # ', process.pid);
          ML.addNoSongsUsersToQueue().then(function() {
            log.info('addNoSongsUsers', stopped, 'process # ', process.pid);
          });
        });

      // cron job runs daily at 06:30
      schedule.scheduleJob(cronTimes.f,
        function() {
          log.info('addUsersWith10Songs', running, 'process # ', process.pid);
          ML.addUsersWith10SongsToQueue().then(function() {
            log.info('addUsersWith10Songs', stopped, 'process # ', process.pid);
          });
        });

      // addNewUsersMainList cron job runs daily at 07:00
      schedule.scheduleJob(cronTimes.g1,
        function() {
          log.info('addNewUsersMainList', running, 'process # ', process.pid);

          ML.addNewUsersToRegistrationLists(1, ML.mailingListsNames.mainList)
            .then(function() {
              log.info('addNewUsersMainList', stopped, 'process # ', process.pid);
            });
        });

      // addNewUsersToStudioList cron job runs daily at 07:15
      schedule.scheduleJob(cronTimes.g2,
        function() {
          log.info('addNewUsersToStudioList', running, 'process # ', process.pid);

          ML.addNewUsersToRegistrationLists(2, ML.mailingListsNames.studioList).then(function() {
            log.info('addNewUsersToStudioList', stopped, 'process # ', process.pid);
          });
        });

      // addNewUsersToRegistration cron job runs daily at 07:30
    schedule.scheduleJob(cronTimes.g3,
      function() {
        log.info('addNewUsersToRegistration', running, 'process # ', process.pid);

        ML.addNewUsersToRegistrationLists(3, ML.mailingListsNames.expressList).then(function() {
          log.info('addNewUsersToRegistration', stopped, 'process # ', process.pid);
        });
      });

      // addNewUsersToOthersList cron job runs daily at 07:45
      schedule.scheduleJob(cronTimes.g4,
        function() {
          log.info('addNewUsersToOthersList', running, 'process # ', process.pid);

          ML.addNewUsersToRegistrationLists(4, ML.mailingListsNames.mainList).then(function() {
            log.info('addNewUsersToOthersList', stopped, 'process # ', process.pid);
          });
        });

      // addUsersToMailingList cron job runs daily at 08:00
      schedule.scheduleJob(cronTimes.h,
        function() {
          log.info('addUsersToMailingList', running, 'process # ', process.pid);

          ML.addUsersToMailingList().then(function() {
            log.info('addUsersToMailingList', stopped, 'process # ', process.pid);
          });
        });

      // createProfileIndexes cron job runs daily at 09:00
      schedule.scheduleJob(cronTimes.i,
        function() {
          log.info('createProfileIndexes', running, 'process # ', process.pid);

          Seo.createProfileIndexPages().then(function() {
            log.info('createProfileIndexes', stopped, 'process # ', process.pid);
          });
        });

      // createSongsIndexes cron job runs daily at 09:30
      schedule.scheduleJob(cronTimes.j,
        function() {
          log.info('createSongsIndexes', running, 'process # ', process.pid);

          Seo.createSongsIndexPages().then(function() {
            log.info('createSongsIndexes', stopped, 'process # ', process.pid);
          });
        });

      // createSitemapsIndex cron job runs daily at 10:00
      schedule.scheduleJob(cronTimes.k,
        function() {
          log.info('createSitemapsIndex', running, 'process # ', process.pid);

          Seo.createSitemapsIndexPage().then(function() {
            log.info('createSitemapsIndex', stopped, 'process # ', process.pid);
          });
        });

      //uploadSiteMaps cron job runs daily at 10:15
      schedule.scheduleJob(cronTimes.l, function() {
        log.info('uploadSiteMaps', running, 'process # ', process.pid);
        Seo.uploadSiteMaps().then(function() {
          log.info('uploadSiteMaps', stopped, 'process # ', process.pid);
          });
        });
    });
  });
}());
