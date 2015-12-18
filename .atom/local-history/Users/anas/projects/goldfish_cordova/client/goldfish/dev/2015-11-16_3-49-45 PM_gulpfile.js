var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern      : ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});
var series = require('stream-series');

// Cleaning the old build
gulp.task('clean', function() {
  return gulp.src('../www/**/*', {read: false})
    .pipe(plugins.rimraf({force: true))
    .pipe(plugins.notify({message: 'Clean task complete'}));
});

// getting all js files from our folders
gulp.task('scripts', function() {
  gulp.src(plugins.mainBowerFiles().concat('features/**/*').concat('index.js').concat('config.js'))
    .pipe(plugins.filter('**/*.js'))
    .pipe(gulp.dest('../www/js'))
    .pipe(plugins.notify({message: 'Scripts task complete'}));
});

// Inserting Views in the ../www folder
gulp.task('views', function() {
  gulp.src('features/**/*')
    .pipe(plugins.filter('**/*.html'))
    .pipe(gulp.dest('../www/views'))
    .pipe(plugins.notify({message: 'Views task complete'}));
});

// getting all css files from our style folder and from bower components
gulp.task('css', function() {
  gulp.src(plugins.mainBowerFiles().concat('styles/*.less'))
    .pipe(plugins.less())
    .pipe(gulp.dest('../www/css'))
    .pipe(plugins.notify({
      message: 'Css task complete'
    }));
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
    .pipe(plugins.notify({
      message: 'Fonts task complete'
    }));
});

// Inserting images in the ../www folder
gulp.task('images', function() {
  gulp.src(['img/*', '!img/*.psd'])
    .pipe(plugins.imagemin({
      optimizationLevel: 4,
      progressive: true
    }))
    .pipe(gulp.dest('../www/img'))
    .pipe(plugins.notify({
      message: 'Images task complete'
    }));
});

//inserting css and js in index.html
gulp.task('injectInHtml', function() {
  var jquery = gulp.src('../www/js/jquery.js');
  var angular = gulp.src('../www/js/angular.js');
  var jsSources = gulp.src(['../www/js/**/*', '!../www/js/jquery.js', '!../www/js/angular.js']);
  var cssSources = gulp.src(['../www/css/*']);
  var target = gulp.src('index.html');

  target.pipe(plugins.inject(series(jquery, angular, jsSources, cssSources), {
      relative: true,
      ignorePath: "../www/"
    })).pipe(gulp.dest('./../www'))
    .pipe(plugins.notify({
      message: 'injectInHtml task complete'
    }));
});

// Default task
gulp.task('default', ['clean', 'scripts', 'css', 'views', 'images', 'fonts', 'injectInHtml']);
