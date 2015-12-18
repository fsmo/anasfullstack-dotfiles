// include gulp
var gulp = require('gulp');
// Include plugins
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

// getting all js files from our folders
gulp.task('scripts', function () {
    gulp.src(plugins.mainBowerFiles().concat('js/**/*').concat('config.js').concat('vendor/*'))
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

gulp.task('injectInHtml', function () {
    var jquery = gulp.src('portfolio-template/js/jquery.js');
    var angular = gulp.src('portfolio-template/js/angular.js');
    var jsSources = gulp.src(['portfolio-template/js/**/*',
        '!portfolio-template/js/jquery.js',
        '!portfolio-template/js/angular.js']);
    var cssSources = gulp.src(['portfolio-template/css/*']);
    var target = gulp.src('index.html');
    target.pipe(plugins.inject(series(jquery, angular, jsSources, cssSources), {
        relative: true,
        ignorePath: "portfolio-template/"
    })).pipe(gulp.dest('./portfolio-template'))
    .pipe(plugins.notify({ message: 'injectInHtml task complete' }));

});
gulp.task('default', ['scripts', 'css', 'views','images','fonts','pdf','mailService','injectInHtml']);
