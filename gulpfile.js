'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    //prefixer = require('gulp-autoprefixer'),
    //uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    //mainBowerFiles = require('gulp-main-bower-files'),
    //cssmin = require('gulp-minify-css'),
    //imagemin = require('gulp-imagemin'),
    //pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

const DIR = './';
var path = {
    build: {
        //  output
        base: 'dist/',
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
        //bower: 'dist/bower/'
    },
    src: {
        //  sources
        base: 'app/',
        html: 'app/*.html',
        //js: 'app/js/index.js',
        js: 'app/js/**/*.js',
        style: 'app/sass/style.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
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
    gulp.watch(path.watch.html, gulp.parallel('html:build'));
    gulp.watch(path.watch.style, gulp.parallel('style:build'));
    gulp.watch(path.watch.js, gulp.parallel('js:build'));
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
    // .pipe(rigger())
    // .pipe(sourcemaps.init())
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass()) //Скомпилируем
        //.pipe(prefixer())
        //.pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('img:build', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
});

/*gulp.task('main-bower-files', function () {
 return gulp.src('./bower.json')
 .pipe(mainBowerFiles())
 .pipe(gulp.dest(path.build.bower));
 });*/

gulp.task('build', gulp.parallel(
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build'
    //'main-bower-files'
));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'webserver')));

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


//  Init tasks

// Move font-awesome fonts folder to css compiled folder
gulp.task('font-awesome', function() {
    return gulp.src('./bower_components/components-font-awesome/fonts/**.*')
        .pipe(gulp.dest(path.src.base + 'fonts/font-awesome'));
});

gulp.task('init', gulp.series('font-awesome', 'build'));