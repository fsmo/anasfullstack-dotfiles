
require('./pRequire');
var CronJob = require('cron').CronJob;

function createCronJob(time,onTick){
  var cronJob = new CronJob({
    cronTime: time,
    onTick  : onTick,
    start   : false,
    timeZone: 'CET'
  });
  return cronJob;
}

(function initCron(handler) {
  var loadCredentials = require('./../credentials').loadCredentials;
  var log             = pRequire('/lib/log');

  loadCredentials(function(err, credentials) {
    if(err) { throw err; }

    var global = require('./global');
    var orm    = pRequire('/orm');

    global.setCredentials(credentials);

    orm.init(function() {
      var Seo = pRequire('/managers/seo-manager').seoManager;
      var ML  = pRequire('/managers/mailing-list-manager').mailingLists;

      // cron job runs daily at 02:00
      var createProfileIndexes = createCronJob('00 00 02 * * *',function() {
        log.info('createProfileIndexes Cron Job at 02:00 is now runnning!!');
        Seo.createProfileIndexPages();
      });
      createProfileIndexes.start();

      // cron job runs daily at 02:30
      var createSongsIndexes = createCronJob('00 30 02 * * *',function() {
        log.info('createSongsIndexes Cron Job at 02:30 is now runnning!!');
        Seo.createSongsIndexPages();
      });
      createSongsIndexes.start();

      // cron job runs daily at 03:00
      var createSitemapsIndex = createCronJob('00 00 03 * * *',function() {
        log.info('createSitemapsIndexPage Cron Job at 03:00 is now runnning!!');
        Seo.createSitemapsIndexPage();
      });
      createSitemapsIndex.start();

      // cron job runs daily at 03:30
      var uploadSiteMaps = createCronJob('00 30 03 * * *',function() {
        log.info('createSitemapsIndexPage Cron Job at 03:30 is now runnning!!');
        Seo.uploadSiteMaps();
      });
      uploadSiteMaps.start();

      // cron job runs daily at 04:00
      var addGaveUpUsers = createCronJob('00 00 04 * * *',function() {
        log.info('addGaveUpUsers Cron Job at 04:00  is now runnning!!');
        ML.addGaveUpUsersToQueue();
      });
      addGaveUpUsers.start();

      // cron job runs daily at 04:30
      var addNoSongsUsers = createCronJob('00 30 04 * * *',function() {
        log.info('addNoSongsUsersJob at 04:30  is now runnning!!');
        ML.addNoSongsUsersToQueue();
      });
      addNoSongsUsers.start();

      // cron job runs daily at 05:00
      var addNoNewSongsUsers = createCronJob('00 00 05 * * *',function() {
        log.info('addNoNewSongsUsers Cron Job at 05:00  is now runnning!!');
        ML.addNoNewSongsUsersToQueue();
      });
      addNoNewSongsUsers.start();

      // cron job runs daily at 05:30
      var addUsersWith10Songs = createCronJob('00 30 05 * * *',function() {
        log.info('addUsersWith10Songs Cron Job at 05:30  is now runnning!!');
        ML.addUsersWith10SongsToQueue();
      });
      addUsersWith10Songs.start();

      // cron job runs daily at 06:00
      var ddNewUsersToRegistration = createCronJob('00 00 06 * * *',function() {
        log.info('Daily Cron Job at 06:00  is now runnning!!');
        ML.addNewUsersToRegistrationLists(1, ML.mailingListsNames.mainList);
        ML.addNewUsersToRegistrationLists(2, ML.mailingListsNames.studioList);
        ML.addNewUsersToRegistrationLists(3, ML.mailingListsNames.expressList);
        ML.addNewUsersToRegistrationLists(4, ML.mailingListsNames.mainList);
      });
      ddNewUsersToRegistration.start();

      // cron job runs daily at 12:00
      var dailyJob3 = createCronJob('00 00 12 * * *',function() {
        log.info('Daily Cron Job # 3  at 12:00  is now runnning!!');
        ML.addUsersToMailingList();

      });
      dailyJob3.start();

      // cron job runs daily at 18:00
      var dailyJob4 = createCronJob('00 00 18 * * *',function() {
        log.info('Daily Cron Job # 4  at 18:00  is now runnning!!');

      });
      dailyJob4.start();
    });
  });
}());
