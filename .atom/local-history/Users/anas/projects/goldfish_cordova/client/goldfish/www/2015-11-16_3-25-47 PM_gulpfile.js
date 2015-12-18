var gulp    = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern      : ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
var series  = require('stream-series');

// getting all js files from our folders
gulp.task('scripts', function () {
    gulp.src(plugins.mainBowerFiles().concat('features/**/*').concat('index.js').concat('config.js'))
        .pipe(plugins.filter('**/*.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.notify({ message: 'Scripts task complete' }));
});

// getting all font files from bower components and our folders
gulp.task('fonts', function () {
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.ttf'))
        .pipe(gulp.dest('dist/font'));
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.woff'))
        .pipe(gulp.dest('dist/font'));
    gulp.src(plugins.mainBowerFiles())
        .pipe(plugins.filter('**/*.woff2'))
        .pipe(gulp.dest('dist/font'))
    .pipe(plugins.notify({ message: 'Fonts task complete' }));
});

// getting all css files from our style folder and from bower components
gulp.task('css', function () {
    gulp.src(plugins.mainBowerFiles().concat('style/style.css'))
        .pipe(plugins.filter('*.css'))
        //.pipe(plugins.minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'))
    .pipe(plugins.notify({ message: 'Css task complete' }));

});

// Inserting Views in the dist folder
gulp.task('views', function () {
    gulp.src('features/**/*')
        .pipe(plugins.filter('**/*.html'))
        .pipe(gulp.dest('dist/views'))
    .pipe(plugins.notify({ message: 'Views task complete' }));
});

// Inserting images in the dist folder
gulp.task('images', function () {
    gulp.src(['img/*','!img/*.psd'])
        .pipe(plugins.imagemin({
            optimizationLevel:4,
            progressive: true
        }))
    .pipe(gulp.dest('dist/img'))
    .pipe(plugins.notify({ message: 'Images task complete' }));
});

//inserting css and js in index.html
gulp.task('injectInHtml', function () {
    var jquery     = gulp.src('dist/js/jquery.js');
    var angular    = gulp.src('dist/js/angular.js');
    var jsSources  = gulp.src(['dist/js/**/*','!dist/js/jquery.js','!dist/js/angular.js']);
    var cssSources = gulp.src(['dist/css/*']);
    var target     = gulp.src('index.html');
    target.pipe(plugins.inject(series(jquery, angular, jsSources, cssSources), {
        relative  : true,
        ignorePath: "dist/"
    })).pipe(gulp.dest('./dist'))
    .pipe(plugins.notify({ message: 'injectInHtml task complete' }));
});

// Default task
gulp.task('default', ['scripts', 'css', 'views','images','fonts','pdf','mailService','injectInHtml']);
