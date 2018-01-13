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

var path = {
    build: {
        //  output
        html: 'app/',
        js: 'app/js/',
        css: 'app/css/',
        img: 'app/img/',
        fonts: 'app/fonts/'
        //bower: 'app/bower/'
    },
    src: {
        //  sources
        html: 'app/*.html',
        js: 'app/js/index.js',
        style: 'app/sass/style.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch: {
        //  files watch to
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/sass/**/*.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist/*'
};

var config = {
    server: {
        baseDir: "./app"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Gulp"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        // .pipe(rigger())
        // .pipe(sourcemaps.init())
        // .pipe(uglify())
        // .pipe(sourcemaps.write())
        // .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass()) //Скомпилируем
        //.pipe(prefixer())
        //.pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

/*gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});*/

/*gulp.task('main-bower-files', function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(gulp.dest(path.build.bower));
});*/

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build'
    //'fonts:build',
    //'main-bower-files'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    /*watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });*/
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);