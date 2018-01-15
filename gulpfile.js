'use strict';

//  Common plugins
var gulp = require('gulp'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    rigger = require('gulp-rigger'), rimraf = require('rimraf'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');

//  CSS plugins
var sass = require('gulp-sass'),
    //cssmin = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');

//  JS plugins
//var uglify = require('gulp-uglify');

//  Bower plugins
var bower = require('main-bower-files'),
    wiredep = require('wiredep').stream;

//  Image plugins
//imagemin = require('gulp-imagemin'),
//pngquant = require('imagemin-pngquant'),

const DIR = './';
var paths = {
    build: {
        //  output
        base: 'dist/',
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        bower: 'dist/bower_components/'
    },
    src: {
        //  sources
        base: 'app/',
        html: 'app/*.html',
        //js: 'app/js/index.js',
        js: 'app/js/**/*.js',
        style: 'app/sass/style.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*',
        bower: 'app/bower_components/'
    },
    watch: {
        //  files watch to
        base: 'app/',
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/sass/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: DIR + 'dist/*'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Gulp"
};


//  Development tasks

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('watch', function () {
    gulp.watch(paths.watch.html, gulp.parallel('html:build'));
    gulp.watch(paths.watch.style, gulp.parallel('style:build'));
    gulp.watch(paths.watch.js, gulp.parallel('js:build'));
});

gulp.task('html:build', function () {
    return gulp.src(paths.src.html)
        .pipe(rigger())
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here'
        }))
        .pipe(gulp.dest(paths.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(paths.src.js)
    // .pipe(rigger())
    // .pipe(sourcemaps.init())
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(paths.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.build.fonts))
});

gulp.task('img:build', function () {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.build.img))
});

gulp.task('bower', function () {
    return gulp.src(bower(), {base: paths.src.bower})
        .pipe(gulp.dest(paths.build.bower));
});

gulp.task('clean', function (cb) {
    rimraf(paths.clean, cb);
});

gulp.task('build', gulp.series('clean', gulp.parallel(
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build',
    'bower'
)));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'webserver')));


//  Init tasks

gulp.task('init', gulp.series('build'));