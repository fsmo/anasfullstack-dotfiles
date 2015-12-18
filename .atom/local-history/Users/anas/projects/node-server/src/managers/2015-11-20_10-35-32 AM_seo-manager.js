var P                 = require('bluebird');
var orm               = pRequire('/orm');
var log               = pRequire('/lib/log');
var fs                = require('fs');
var path              = require('path');
var _                 = require('underscore');
var global            = pRequire('/global');

var now               = new Date();
var xmlFilesObjects   = [];
var linksLimit        = 50;

var XMLWriter         = require('xml-writer');
var S3Controller      = pRequire('/controllers/static-song/s3-file-controller');
var Glob              = require('glob');

function getSongModel() {
  return orm.getModel('song');
}

function createNewXmlFile(fileName, folderName){
  var file = {};
  file.ws  = fs.createWriteStream(__dirname + '/../sitemaps/' + folderName + '/' + fileName + '.xml');

  file.xw  = new XMLWriter(false, function(string, encoding) {
    file.ws.write(string, encoding);
  });

  file.xw.startDocument('1.0', 'UTF-8');
  file.xw.startElement(function() {return 'urlset';})
    .writeAttribute('xmlns', 'http://download.scorecloud.com/sitemaps/' + folderName);

  return file;
}

function createXmlUrlElement(file, elementObj){
  file.xw.startElement(function() {return 'url';})

    .startElement(function() {return 'loc';})
    .text(elementObj.url).endElement()

    .startElement(function() {return 'lastmod';})
    .text(elementObj.lastmod).endElement()

    .startElement(function() {return 'changefreq';})
    .text(elementObj.changefreq).endElement()

    .startElement(function() {return 'priority';})
    .text(elementObj.priority).endElement();

  file.xw.endElement();
}

function createSongsIndexPages() {
  var currentPage = {limit: 50, page: 0},
  fileName        = 0,
  now             = new Date(),
  file            = createNewXmlFile(1, 'songs');

  function writeXmlFile(songs) {
    if (songs.length > 0) {

      if ((currentPage.limit * currentPage.page) % linksLimit === 0) {
        fileName += 1;
        file  = createNewXmlFile(fileName, 'songs');
      }

      return P.each(songs, function(song) {
        var xmlObj = {
            url       : 'http://my.scorecloud.com/song/' + song.song_id,
            lastmod   : now.toISOString(),
            changefreq: 'daily',
            priority  : 0.5
        };

        createXmlUrlElement(file, xmlObj);

      }).then(function() {
        if ((currentPage.limit * currentPage.page) % linksLimit === linksLimit - currentPage.limit) {
          file.xw.endElement();
          file.ws.end();
        }
        return true;
      });
    } else {
      file.xw.endElement();
      file.ws.end();
      return P.resolve(false);
    }
  }

  function run() {
    return getSongModel()
      .find({
        is_public : true,
        is_deleted: false,
        is_active : true
      })
      .paginate(currentPage)
      .then(function(songs) {
        return writeXmlFile(songs).then(function(nextPage) {
          currentPage.page += 1;
          if (nextPage) {
            return run();
          } else {
            log.debug('createSongsIndexes cron job ended ... We finished all songs xml creation');
          }
        });
      });
  }
  return run();
}

function createProfileIndexPages() {
  var currentPage = {limit: 50, page: 0},
  fileName        = 0,
  now             = new Date(),
  file            = createNewXmlFile(1, 'users');

  function writeXmlFile(authorIds) {
    if (authorIds.length > 0) {

      if ((currentPage.limit * currentPage.page) % linksLimit === 0) {
        fileName += 1;
        file = createNewXmlFile(fileName, 'users');
      }

      return P.each(authorIds, function(authorId) {

            var xmlObj = {
                url       : 'http://my.scorecloud.com/user/' + authorId.author_id,
                lastmod   : now.toISOString(),
                changefreq: 'weekly',
                priority  :0.75
            };
            console.log(xmlObj);

            createXmlUrlElement(file, xmlObj);
      }).then(function() {
        if ((currentPage.limit * currentPage.page) % linksLimit === linksLimit - currentPage.limit) {
          file.xw.endElement();
          file.ws.end();
        }
        return true;
      });

    } else {
      file.xw.endElement();
      file.ws.end();
      return P.resolve(false);
    }
  }

  function run() {
    return getSongModel()
      .find({
        is_public : true,
        is_deleted: false,
        is_active : true},
        {fields   : {author_id : 1}}
      )
      .groupBy('author_id')
      .paginate(currentPage)
      .sum()
      .then(function(authorIds) {
        console.log(authorIds);
        return writeXmlFile(authorIds).then(function(nextPage) {
          currentPage.page += 1;
          if (nextPage) {
            return run();
          } else {
            log.debug('createProfileIndexes cron job ended ... We finished all profiles xml creation');
          }
        });
      });
  }
  return run();
}

function getAllXmlFiles(){
  var pattern = '**/*.xml';
  return new Glob(pattern, {mark: true,sync: true}, function(er, matches) {
      return matches;
    });
}

function createindex() {
  var xmlFiles = getAllXmlFiles();

  for (var i = 0; i < xmlFiles.length; i++) {

    if (xmlFiles[i].indexOf('sitemaps') > -1 && xmlFiles[i].indexOf('index') == -1) {
       var obj = {};
       obj.url = xmlFiles[i].slice(xmlFiles[i].indexOf('sitemaps'));

       if (xmlFiles[i].indexOf('songs') > -1){
         obj.priority = 0.5;
         obj.changefreq = 'daily';

       }else if (xmlFiles[i].indexOf('users') > -1){
         obj.priority = 0.75;
         obj.changefreq = 'weekly';
       }

      xmlFilesObjects.push(obj);
    }
  }

  var staticFiles = ['explore','explore/latest','explore/most-popular'];
  _.each(staticFiles, function(fileName){
    var obj        = {};
    obj.url        = fileName;
    obj.priority   = 0.95;
    obj.changefreq = 'monthly';

    xmlFilesObjects.push(obj);
  });

  ws = fs.createWriteStream(__dirname + '/../sitemaps/index.xml');

  xw = new XMLWriter(false, function(string, encoding) {
    ws.write(string, encoding);
  });
  xw.startDocument('1.0', 'UTF-8');

  xw.startElement(function() {return 'sitemapindex';})
    .writeAttribute('xmlns', 'http://download.scorecloud.com/sitemap/');

  return P.each(xmlFilesObjects, function(item) {
    if (item.url.indexOf('sitemaps')>-1){
      item.url = 'http://download.scorecloud.com/' + item.url;

      xw.startElement(function() {return 'sitemap';})

        .startElement(function() {return 'loc';})
        .text(item.url).endElement()

        .startElement(function() {return 'lastmod';})
        .text(now.toISOString()).endElement();

      xw.endElement();
    }else{
      item.url = 'https://my.scorecloud.com/' + item.url;

      xw.startElement(function() {return 'url';})

        .startElement(function() {return 'loc';})
        .text(item.url).endElement()

        .startElement(function() {return 'changefreq';})
        .text(item.changefreq).endElement()

        .startElement(function() {return 'priority';})
        .text(item.priority).endElement();

      xw.endElement();
    }
  }).then(function(){
    xw.endElement();
    ws.end();
    log.debug('createSitemapsIndexPage cron job ended ... We finished all index xml creation');
  });
}

function uploadSiteMaps(){
  var xmlFiles       = getAllXmlFiles();
  var sitemapsBucket = global.credentials.aws.sitemapsBucket;

  return P.each(xmlFiles,function(file){

    if (file.indexOf('sitemaps') > -1){
      xmlStream = fs.createReadStream(path.normalize(__dirname + '/../' + file.slice(file.indexOf('sitemaps'))));
      return S3Controller.uploadToS3(xmlStream, file.slice(file.indexOf('sitemaps')), sitemapsBucket, 3600);
    }
  })
  .then(function(){
    log.info('uploadSiteMaps cron job ended ... SiteMaps Upload Just Finished!');
  });
}

exports.seoManager = {
  createProfileIndexPages: createProfileIndexPages,
  createSongsIndexPages  : createSongsIndexPages,
  createSitemapsIndexPage: createindex,
  uploadSiteMaps         : uploadSiteMaps
};
