
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

  loadCredentials(function(err, credentials) {
    if(err) { throw err; }

    var global = require('./global');

    global.setCredentials(credentials);

    var orm    = pRequire('/orm');

    orm.init(function() {
      var Seo     = pRequire('/managers/seo-manager').seoManager;
      var ML      = pRequire('/managers/mailing-list-manager').mailingLists;
      var running = ' cron job is now runnning!!';
      var ended   = ' cron job ended!!'
      var stopeed = ' cron job stopped!!!'

      var cronTimes = {
        a: '00 15 04 * * *',
        b: '00 30 04 * * *',
        c: '00 00 05 * * *',
        d: '00 30 05 * * *',
        e: '00 00 06 * * *',
        f: '00 30 06 * * *',
        g: '00 00 07 * * *',
        h: '00 00 08 * * *',
        i: '00 00 09 * * *',
        j: '00 30 09 * * *',
        k: '00 00 10 * * *',
        l: '00 15 10 * * *'
      };
      // var cronTimes = {
      //   a: '00 15 04 * * *',
      //   b: '00 30 04 * * *',
      //   c: '00 00 05 * * *',
      //   d: '00 30 05 * * *',
      //   e: '00 00 06 * * *',
      //   f: '00 30 06 * * *',
      //   g: '00 00 07 * * *',
      //   h: '00 00 08 * * *',
      //   i: '00 00 09 * * *',
      //   j: '00 30 09 * * *',
      //   k: '00 00 10 * * *',
      //   l: '00 15 10 * * *'
      // };

      //updateTopTagsMatView cron job runs daily at 04:15
      var updateTopTagsMatView = createCronJob(cronTimes.a, function() {
        log.info('updateTopTagsMatView', running);

        orm.getModel('materialized_top_tags_view').query('REFRESH MATERIALIZED VIEW materialized_top_tags_view;', function(){
           log.info('updateTopTagsMatView cron job ended');
           updateTopTagsMatView.stop();
          });

      });
      updateTopTagsMatView.start();

      //updateSongMatView cron job runs daily at 04:30
      var updateSongMatView = createCronJob(cronTimes.b, function() {
        log.info('updateSongMatView', running);

        orm.getModel('materialized_song_view').query('REFRESH MATERIALIZED VIEW materialized_song_view;',
        function(){
          log.info('updateSongMatView cron job ended');
        });
      });
      updateSongMatView.start();

      // addGaveUpUsers cron job runs daily at 05:00
      var addGaveUpUsers = createCronJob(cronTimes.c, function() {
        log.info('addGaveUpUsers cron job started at 05:00  is now runnning!!');
        ML.addGaveUpUsersToQueue();
      });
      addGaveUpUsers.start();

      // addNoNewSongsUsers cron job runs daily at 05:30
      var addNoNewSongsUsers = createCronJob(cronTimes.d, function() {
        log.info('addNoNewSongsUsers cron job started at 05:30  is now runnning!!');
        ML.addNoNewSongsUsersToQueue();
      });
      addNoNewSongsUsers.start();

      // addNoSongsUsers cron job runs daily at 06:00
      var addNoSongsUsers = createCronJob(cronTimes.e, function() {
        log.info('addNoSongsUsers cron job started at 06:00  is now runnning!!');
        ML.addNoSongsUsersToQueue();
      });
      addNoSongsUsers.start();

      // cron job runs daily at 06:30
      var addUsersWith10Songs = createCronJob(cronTimes.f, function() {
        log.info('addUsersWith10Songs cron job started at 06:30  is now runnning!!');
        ML.addUsersWith10SongsToQueue();
      });
      addUsersWith10Songs.start();

      // addNewUsersToRegistration cron job runs daily at 07:00
      var addNewUsersToRegistration = createCronJob(cronTimes.g, function() {
        log.info('addNewUsersToRegistration cron job started at 07:00  is now runnning!!');
        ML.addNewUsersToRegistrationLists(1, ML.mailingListsNames.mainList);
        ML.addNewUsersToRegistrationLists(2, ML.mailingListsNames.studioList);
        ML.addNewUsersToRegistrationLists(3, ML.mailingListsNames.expressList);
        ML.addNewUsersToRegistrationLists(4, ML.mailingListsNames.mainList);
      });
      addNewUsersToRegistration.start();

      // addUsersToMailingList cron job runs daily at 08:00
      var addUsersToMailingList = createCronJob(cronTimes.h, function() {
        log.info('addUsersToMailingList cron job started at 08:00  is now runnning!!');
        ML.addUsersToMailingList();
      });
      addUsersToMailingList.start();

      // createProfileIndexes cron job runs daily at 09:00
      var createProfileIndexes = createCronJob(cronTimes.i, function() {
        log.info('createProfileIndexes cron job started at 09:00 is now runnning!!');

        Seo.createProfileIndexPages().then(function(){ createProfileIndexes.stop(); });

      }, function() {
        log.info('createSongsIndexes cron job stopped now!');
      });
      createProfileIndexes.start();

      // createSongsIndexes cron job runs daily at 09:30
      var createSongsIndexes = createCronJob(cronTimes.j,
      function() {
        log.info('createSongsIndexes cron job started at 09:30 is now runnning!!');

        Seo.createSongsIndexPages().then(function(){ createSongsIndexes.stop(); });

      }, function(){
          log.info('createSongsIndexes cron job stopped now!');
        });
      createSongsIndexes.start();

      // createSitemapsIndex cron job runs daily at 10:00
      var createSitemapsIndex = createCronJob(cronTimes.k, function() {
        log.info('createSitemapsIndexPage cron job started at 10:00 is now runnning!!');
        Seo.createSitemapsIndexPage();
      });
      createSitemapsIndex.start();

      //uploadSiteMaps cron job runs daily at 10:15
      var uploadSiteMaps = createCronJob(cronTimes.l, function() {
        log.info('uploadSiteMaps cron job started at 10:15 is now runnning!!');
        Seo.uploadSiteMaps();
      });
      uploadSiteMaps.start();
    });
  });
}());
