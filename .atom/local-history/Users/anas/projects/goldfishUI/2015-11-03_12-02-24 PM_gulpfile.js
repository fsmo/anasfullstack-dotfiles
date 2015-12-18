// include gulp
var gulp = require('gulp');
// Include plugins
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

// getting all js files from our folders
gulp.task('scripts', function () {
    gulp.src(plugins.mainBowerFiles().concat('./features/**/*').concat('config.js').concat('vendor/*'))
        .pipe(plugins.filter('**/*.js'))
        //.pipe(plugins.rename({ suffix: '.min' }))
        //.pipe(plugins.stripDebug())
        //.pipe(plugins.uglify({
        //    mangle: false,
        //    compress: true
        //}))
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.notify({ message: 'Scripts task complete' }));
});

// getting all css files from our style folder and from bower components
gulp.task('css', function () {
    gulp.src(plugins.mainBowerFiles().concat('styles/style.css'))
        .pipe(plugins.filter('*.css'))
        //.pipe(plugins.minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'))
    .pipe(plugins.notify({ message: 'Css task complete' }));

});

gulp.task('less', function () {
  return gulp.src('./styles/**/*.less')
    .pipe(plugins.less({
      paths: [ path.join(__dirname, 'styles', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Inserting Views in the dist folder
gulp.task('views', function () {
    gulp.src('./features/**/*')
        .pipe(plugins.filter('*.html'))
        //.pipe(plugins.htmlMinifier({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/views'))
    .pipe(plugins.notify({ message: 'Views task complete' }));
});

gulp.task('injectInHtml', function () {
    // var jquery = gulp.src('dist/js/jquery.js');
    // var angular = gulp.src('dist/js/angular.js');
    var jsSources = gulp.src(['dist/js/**/*',
        // '!dist/js/jquery.js',
        // '!dist/js/angular.js'
    ]);
    var cssSources = gulp.src(['dist/css/*']);
    var target = gulp.src('index.html');
    target.pipe(plugins.inject(series(jquery, angular, jsSources, cssSources), {
        relative: true,
        ignorePath: "dist/"
    })).pipe(gulp.dest('./dist'))
    .pipe(plugins.notify({ message: 'injectInHtml task complete' }));

});
gulp.task('default', ['scripts', 'css', 'views','less', 'injectInHtml']);
