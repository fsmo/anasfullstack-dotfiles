
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

      // addGaveUpUsers cron job runs daily at 05:00
      var addGaveUpUsers = createCronJob('00 00 05 * * *',function() {
        log.info('addGaveUpUsers cron job at 05:00  is now runnning!!');
        ML.addGaveUpUsersToQueue();
      });
      addGaveUpUsers.start();

      // addNoNewSongsUsers cron job runs daily at 05:30
      var addNoNewSongsUsers = createCronJob('00 30 05 * * *',function() {
        log.info('addNoNewSongsUsers cron job at 05:30  is now runnning!!');
        ML.addNoNewSongsUsersToQueue();
      });
      addNoNewSongsUsers.start();

      // addNoSongsUsers cron job runs daily at 06:00
      var addNoSongsUsers = createCronJob('00 00 06 * * *',function() {
        log.info('addNoSongsUsers cron Job at 06:00  is now runnning!!');
        ML.addNoSongsUsersToQueue();
      });
      addNoSongsUsers.start();

      // cron job runs daily at 06:30
      var addUsersWith10Songs = createCronJob('00 30 06 * * *',function() {
        log.info('addUsersWith10Songs cron job at 06:30  is now runnning!!');
        ML.addUsersWith10SongsToQueue();
      });
      addUsersWith10Songs.start();

      // addNewUsersToRegistration cron job runs daily at 07:00
      var addNewUsersToRegistration = createCronJob('00 00 07 * * *',function() {
        log.info('addNewUsersToRegistration cron job at 07:00  is now runnning!!');
        ML.addNewUsersToRegistrationLists(1, ML.mailingListsNames.mainList);
        ML.addNewUsersToRegistrationLists(2, ML.mailingListsNames.studioList);
        ML.addNewUsersToRegistrationLists(3, ML.mailingListsNames.expressList);
        ML.addNewUsersToRegistrationLists(4, ML.mailingListsNames.mainList);
      });
      addNewUsersToRegistration.start();

      // addUsersToMailingList cron job runs daily at 08:00
      var addUsersToMailingList = createCronJob('00 00 08 * * *',function() {
        log.info('addUsersToMailingList cron job at 08:00  is now runnning!!');
        ML.addUsersToMailingList();
      });
      addUsersToMailingList.start();

      // createProfileIndexes cron job runs daily at 09:00
      var createProfileIndexes = createCronJob('00 00 09 * * *',function() {
        log.info('createProfileIndexes cron job at 09:00 is now runnning!!');
        Seo.createProfileIndexPages();
      });
      createProfileIndexes.start();

      // createSongsIndexes cron job runs daily at 09:30
      var createSongsIndexes = createCronJob('00 30 09 * * *',function() {
        log.info('createSongsIndexes cron job at 09:30 is now runnning!!');
        Seo.createSongsIndexPages();
      });
      createSongsIndexes.start();

      // cron job runs daily at 03:00
      var createSitemapsIndex = createCronJob('00 00 03 * * *',function() {
        log.info('createSitemapsIndexPage cron job at 03:00 is now runnning!!');
        Seo.createSitemapsIndexPage();
      });
      createSitemapsIndex.start();

      // cron job runs daily at 03:30
      var uploadSiteMaps = createCronJob('00 30 03 * * *',function() {
        log.info('createSitemapsIndexPage cron job at 03:30 is now runnning!!');
        Seo.uploadSiteMaps();
      });
      uploadSiteMaps.start();
    });
  });
}());
