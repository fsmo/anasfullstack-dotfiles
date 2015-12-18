var gulp       = require('gulp');
var series     = require('stream-series');
var del        = require('del');
var vinylPaths = require('vinyl-paths');
var lr         = require('tiny-lr');
var server     = lr();
var plugins    = require('gulp-load-plugins')({
  pattern      : ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});

// Cleaning the old build
gulp.task('clean', function () {
  return del('../www/*',{force: true});
});

// livereload Server
gulp.task('lr-server', function() {
    server.listen(35729, function(err) {
        if(err) {return console.log(err);}
    });
});

// getting all js files from our folders
gulp.task('scripts', function() {
  gulp.src(plugins.mainBowerFiles().concat('features/**/*').concat('index.js').concat('config.js'))
    .pipe(plugins.filter('**/*.js'))
    .pipe(gulp.dest('../www/js'))
    .pipe(plugins.notify({message: 'Scripts task completed'}))
    .pipe(plugins.livereload(server));
});

// Inserting Views in the ../www folder
gulp.task('views', function() {
  gulp.src('features/**/*')
    .pipe(plugins.filter('**/*.html'))
    .pipe(gulp.dest('../www/views'))
    .pipe(plugins.embedlr())
    .pipe(plugins.notify({message: 'Views task completed'}))
    .pipe(plugins.livereload(server));
});

// getting all css files from our style folder and from bower components
gulp.task('less', function() {
  gulp.src('styles/*.less')
    .pipe(plugins.less())
    .pipe(gulp.dest('../www/css'))
    .pipe(plugins.notify({message: 'less task completed'}))
    .pipe(plugins.livereload(server));
});

// getting all css files from our style folder and from bower components
gulp.task('css', function() {
  gulp.src(plugins.mainBowerFiles().concat('features/**/**/*.css'))
  .pipe(plugins.filter('**/*.css'))
    .pipe(gulp.dest('../www/css'))
    .pipe(plugins.notify({message: 'Css task completed'}))
    .pipe(plugins.livereload(server));
});

// getting all font files from bower components and our folders
gulp.task('fonts', function() {
  gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('**/*.ttf'))
    .pipe(gulp.dest('../www/font'));
  gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('**/*.woff'))
    .pipe(gulp.dest('../www/font'));
  gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('**/*.woff2'))
    .pipe(gulp.dest('../www/font'))
    .pipe(plugins.notify({message: 'Fonts task completed'}));
});

// Inserting images in the ../www folder
gulp.task('images', function() {
  gulp.src(['img/*', '!img/*.psd'])
    .pipe(gulp.dest('../www/img'))
    .pipe(plugins.notify({message: 'Images task completed'}));
});

//inserting css and js in index.html
gulp.task('injectInHtml', function() {
  var jquery     = gulp.src('../www/js/jquery.js');
  var angular    = gulp.src('../www/js/angular.js');
  var jsSources  = gulp.src(['../www/js/**/*', '!../www/js/jquery.js', '!../www/js/angular.js']);
  var cssSources = gulp.src(['../www/css/*']);
  var target     = gulp.src('index.html');

  target.pipe(plugins.inject(series(jquery, angular, jsSources, cssSources), {relative: true,ignorePath: "../www/"}))
    .pipe(gulp.dest('./../www'))
    .pipe(plugins.notify({message: 'injectInHtml task completed'}));
});

// Default task
gulp.task('default', function() {
  gulp.run('lr-server', 'scripts', 'less', 'views', 'images', 'fonts', 'injectInHtml');

  gulp.watch('features/src/**/*.js', function(event) {
    gulp.run('scripts');
  });

  gulp.watch('features/styles/**/*.less', function(event) {
    gulp.run('styles');
  });

  gulp.watch('features/**/*.html', function(event) {
    gulp.run('views');
  });
});
