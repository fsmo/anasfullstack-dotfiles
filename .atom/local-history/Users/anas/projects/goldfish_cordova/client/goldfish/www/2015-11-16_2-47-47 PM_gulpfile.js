"use strict";
// include gulp
var gulp = require('gulp');
// Include plugins
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
var series = require('stream-series');

// getting all js files from our folders
gulp.task('scripts', function () {
    gulp.src(plugins.mainBowerFiles().concat('features/**/*').concat('index.js').concat('vendor/*'))
        .pipe(plugins.filter('**/*.js'))
        //.pipe(plugins.rename({ suffix: '.min' }))
        //.pipe(plugins.stripDebug())
        //.pipe(plugins.uglify({
        //    mangle: false,
        //    compress: true
        //}))
        .pipe(gulp.dest('portfolio-template/js'))
        .pipe(plugins.notify({ message: 'Scripts task complete' }));
});
// getting all font files from bower components and our folders
gulp.task('fonts', function () {
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.ttf'))
        .pipe(gulp.dest('portfolio-template/font'));
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.woff'))
        .pipe(gulp.dest('portfolio-template/font'));
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.woff2'))
        .pipe(gulp.dest('portfolio-template/font'))
    .pipe(plugins.notify({ message: 'Fonts task complete' }));

});
// getting all css files from our style folder and from bower components
gulp.task('css', function () {
    gulp.src(plugins.mainBowerFiles().concat('style/style.css'))
        .pipe(plugins.filter('*.css'))
        //.pipe(plugins.minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('portfolio-template/css'))
    .pipe(plugins.notify({ message: 'Css task complete' }));

});
// Inserting Views in the portfolio-template folder
gulp.task('views', function () {
    gulp.src('./views/**/*')
        //.pipe(plugins.htmlMinifier({collapseWhitespace: true}))
        .pipe(gulp.dest('portfolio-template/views'))
    .pipe(plugins.notify({ message: 'Views task complete' }));
});
// Inserting images in the portfolio-template folder
gulp.task('images', function () {
    gulp.src(['img/*','!img/*.psd'])
        .pipe(plugins.imagemin({
            optimizationLevel:4,
            progressive: true
        }))
    .pipe(gulp.dest('portfolio-template/img'))
    .pipe(plugins.notify({ message: 'Images task complete' }));

});
// inserting cv in portfolio-template file
gulp.task('pdf', function () {
    gulp.src('cv.pdf')
    .pipe(gulp.dest('portfolio-template'));
});
// inserting mailPhpService in portfolio-template file
gulp.task('mailService', function () {
    gulp.src('mailService/*')
    .pipe(gulp.dest('portfolio-template/mailService'))
    .pipe(plugins.notify({ message: 'mailService task complete' }));
});
//inserting css and js in index.html
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
////minify index.html
//gulp.task('minifyIndex', function () {
//    gulp.src('index.html')
//        .pipe(plugins.htmlMinifier({collapseWhitespace: true}))
//        .pipe(gulp.dest('./portfolio-template'))
//    .pipe(plugins.notify({ message: 'minifyIndex task complete' }));
//});
// Default task
gulp.task('default', ['scripts', 'css', 'views','images','fonts','pdf','mailService','injectInHtml']);
