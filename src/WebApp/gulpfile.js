/// <binding BeforeBuild='build' Clean='clean' ProjectOpened='watchdog' />
"use strict";

require("es6-promise").polyfill();

var gulp = require("gulp"),
    del = require('del'),
    concat = require("gulp-concat"),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require("gulp-uglify");

var webroot = "./wwwroot/";

var tsProject = ts.createProject({
    "noImplicitAny": false,
    "removeComments": false,
    "sourceMap": true,
    "target": "es5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "none"
});

var paths = {
    appjs: ['./wwwroot/js/**/*.ts', './wwwroot/js/**/*.d.ts', './typings/**/*.d.ts'],
    libjs: ['./wwwroot/lib/jquery/dist/jquery.js', './node_modules/knockout/build/output/knockout-latest.debug.js', './node_modules/reflect-metadata/Reflect.js'],
    minJs: './wwwroot/build/',
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css"
};

gulp.task('watchdog', function () {
    gulp.watch(paths.appjs, ['app-js']);
    gulp.watch(paths.libjs, ['lib-js']);
});

gulp.task('app-js', function () {
    return gulp.src(paths.appjs)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .pipe(concat('appscripts.js'))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(paths.minJs));
});

gulp.task('lib-js', function () {
    return gulp.src(paths.libjs)
          .pipe(sourcemaps.init({ loadMaps: true }))
          .pipe(concat('libscripts.js'))
          .pipe(sourcemaps.write("./"))
          .pipe(gulp.dest(paths.minJs));
});

gulp.task('build', ['lib-js', 'app-js']);

gulp.task('clean', function () {
    return del(['wwwroot/build/**/*.*']);
});