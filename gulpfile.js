/*
 *    Copyright 2018 InfAI (CC SES)
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

var gulp = require('gulp');
var through = require('through2');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var path = require('path');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var gulpNgConfig = require('gulp-ng-config');
var debug = require('gulp-debug');
var fs = require('fs');

var DIST = 'dist';
var BOWER_COMPONENTS = 'bower_components';
var MODULES = 'app/modules';

var dist = function (subpath) {
    return !subpath ? DIST : path.join(DIST, subpath);
};

var bower = function (subpath) {
    return !subpath ? BOWER_COMPONENTS : path.join(BOWER_COMPONENTS, subpath);
};

var modules = function (subpath) {
    return !subpath ? MODULES : path.join(MODULES, subpath);
};

var paths = {
    css: [
        'app/*.css',
        bower('/angular-material/angular-material.css'),
        'sepl-modeler/dist/css/app.css',
        'sepl-modeler/dist/css/diagram-js.css',
        'sepl-modeler/dist/css/bpmn-embedded.css',
        bower('/nvd3/build/nv.d3.css'),
        modules('/**/*.css')
    ],
    modules: [
        'app/app.module.js',
        'app/app.config.js',
        'app/app.run.js',
        modules('/**/*.module.js'),
        modules('/**/*.js'),
        '!' + modules('/**/vision-api-demo.js')
    ],
    images: 'img/**/*'
};


gulp.task('clean', function () {
    return del([
        dist()
    ]);
});

gulp.task('concat-bower-files', function () {
    console.log(mainBowerFiles('**/*.js'));
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist('/js')));
});

gulp.task('concat-modeler-file', ['concat-bower-files'], function () {
    return gulp.src([dist('/js/script.min.js'), 'sepl-modeler/dist/index.js'])
        .pipe(debug({title: 'concat modeler file'}))
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest(dist('/js')));
});

gulp.task('modules', function () {
    return gulp.src(paths.modules)
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(concat('modules.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist('/js')));
});

gulp.task('concat-stylesheets', function () {
    return gulp.src(paths.css)
        .pipe(concat('style.css'))
        .pipe(gulp.dest(dist('/styles')));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(['app/**/*.html', 'app/app.module.js'], ['copy', reload]);
    gulp.watch(['app/i18n/**/*.json'], ['copy', reload]);
    gulp.watch(paths.modules, ['modules', reload]);
    gulp.watch(paths.images, ['images', reload]);
    gulp.watch(paths.css, ['concat-stylesheets', reload]);
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
    return gulp.src([
        'app/**',
        '!app/**/*.js',
        '!app/styles/',
        '!app/styles/**'
    ], {
        dot: true
    }).pipe(gulp.dest(dist()));
});

// Static server
gulp.task('browser-sync', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: dist()
        },
        snippetOptions: {
            rule: {
                match: '<span id="browser-sync-binding"></span>',
                fn: function (snippet) {
                    return snippet;
                }
            }
        }

    });
});

gulp.task('uglify-create-working-folder', function () {
    return gulp.src(dist('/js/*.js'))
        .pipe(gulp.dest(dist('/js/build-copy')))
});

gulp.task('uglify-delete-source-js', function () {
    return gulp.src([dist('/js/*.js')])
        .pipe(vinylPaths(del));
});

gulp.task('uglify-scripts', function () {
    var modulesDist = dist('/js/build-copy/*.js');
    return gulp.src(modulesDist)
        .pipe(uglify())
        .pipe(gulp.dest(dist('/js')))
});

gulp.task('uglify-delete-working-folder', function () {
    return gulp.src(dist('/js/build-copy'))
        .pipe(vinylPaths(del));
});

gulp.task('build',
    function (cb) {
        runSequence(['copy', 'concat-bower-files', 'concat-modeler-file', 'concat-stylesheets', 'modules'], cb)
    }
);

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
    runSequence(
        ['build'],
        ['browser-sync', 'watch'],
        cb)
    ;
});

gulp.task('deploy', ['clean'], function (cb) {
    runSequence(
        ['build'],
        ['uglify'],
        cb)
    ;
});

gulp.task('uglify', function (cb) {
    runSequence(
        ['uglify-create-working-folder'],
        ['uglify-delete-source-js'],
        ['uglify-scripts'],
        ['uglify-delete-working-folder'],
        cb);
});