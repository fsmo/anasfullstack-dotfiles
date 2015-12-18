// include gulp
var gulp = require('gulp');
var path = require('path');
var series = require('stream-series');

// Include plugins
var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});

// getting all js files from our folders
gulp.task('scripts', function() {
  gulp.src(plugins.mainBowerFiles().concat('./features/**/*').concat('config.js'))
    .pipe(plugins.filter('**/*.js'))
    //.pipe(plugins.rename({ suffix: '.min' }))
    //.pipe(plugins.stripDebug())
    //.pipe(plugins.uglify({
    //    mangle: false,
    //    compress: true
    //}))
    .pipe(gulp.dest('dist/js'))
    .pipe(plugins.notify({
      message: 'Scripts task complete'
    }));
});

gulp.task('less', function() {
  return gulp.src('./styles/**/*.less')
    .pipe(plugins.less({
      paths: [path.join(__dirname, 'styles', 'includes')]
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Inserting Views in the dist folder
gulp.task('views', function() {
  gulp.src('features/**/*')
    // .pipe(plugins.filter('*.ng.html'))
    //.pipe(plugins.htmlMinifier({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/views'))
    .pipe(plugins.notify({
      message: 'Views task complete'
    }));
});

gulp.task('injectInHtml', function() {
  var jquery = gulp.src('dist/js/jquery.js');
  var angular = gulp.src('dist/js/angular.js');
  var jsSources = gulp.src(['dist/js/**/*',
    '!dist/js/jquery.js',
    '!dist/js/angular.js'
  ]);
  var cssSources = gulp.src(['dist/css/*']);
  var target = gulp.src('index.html');
  target.pipe(plugins.inject(series(jquery, angular, jsSources, cssSources), {
      relative: true,
      ignorePath: "dist/"
    })).pipe(gulp.dest('./dist'))
    .pipe(plugins.notify({
      message: 'injectInHtml task complete'
    }));
});

gulp.task('stream', function() {
  return gulp.src('styles/**/*')
    .pipe(plugins.watch('styles/**/*'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('callback', function(cb) {
  plugins.watch('styles/**/*', function() {
    gulp.src('styles/**/*')
      .pipe(plugins.watch('styles/**/*'))
      .on('end', cb);
  });
});

gulp.task('default', ['scripts', 'views', 'less', 'injectInHtml', 'stream', 'callback']);
