/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var isProd = false;
var gulp = require('gulp'),
    fs = require('fs'),
    del = require('del'),
    watch = require('gulp-watch'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    babelify = require('babelify'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    streamify = require('gulp-streamify'),
    runSequence = require('run-sequence'),
    license = require('gulp-license'),
    minifyInline = require('gulp-minify-inline'),
    path = require('path');

var version = null;

function createBundle(url) {
  return browserify({
    entries: [url],
    debug: !isProd
  }).transform(babelify.configure({
    optional: ['es7.decorators']
  }));
}

function watchBundles() {
  var bundleKeys = Object.keys(bundles);
  var watch = null;
  var key = null;
  for (var b = 0; b < bundleKeys.length; b++) {
    key = bundleKeys[b];
    buildBundle(key);
    watch = watchify(bundles[key].bundle);
    watch.on('update', buildBundle.bind(this, key));
  }
}

function buildBundle(bundleName) {

  var job = bundles[bundleName];
  var bundle = job.bundle;
  var name = job.name;
  var dest = job.dest || './dist/scripts';

  var b = bundle.bundle()
      .on('log', gutil.log.bind(gutil, 'Browserify Log'))
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(name));

  if (isProd) {
    b = b.pipe(streamify(uglify()));
  }

  return b.pipe(license('Apache', {
      organization: 'Google Inc. All rights reserved.'
    }))
    .pipe(gulp.dest(dest));
}

var bundles = {
  'core': {
    url: './src/scripts/app-core.js',
    name: 'app-core.js',
    bundle: null
  }
};

/** Clean */
gulp.task('clean', function(done) {
  del(['dist'], done);
});

/** Styles */
gulp.task('styles', function() {
  return gulp.src('./src/styles/*.scss')
      .pipe(sass())
      .pipe(minifycss())
      .pipe(license('Apache', {
        organization: 'Google Inc. All rights reserved.'
      }))
      .pipe(gulp.dest('./dist/styles'));
});

/** Scripts */
gulp.task('scripts', function() {
  var bundleKeys = Object.keys(bundles);
  for (var b = 0; b < bundleKeys.length; b++) {
    buildBundle(bundleKeys[b]);
  }
});

/** Root */
gulp.task('root', function() {
  gulp.src('./src/*.*')
    .pipe(gulp.dest('./dist/'));

  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest('./dist/'));
});

/** HTML */
gulp.task('html', function() {

  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'));
});


/** Watches */
gulp.task('watch', function() {
  gulp.watch('./src/**/*.scss', ['styles']);
  gulp.watch('./src/*.*', ['root']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/images/**/*.*', ['images']);
  gulp.watch('./src/third_party/**/*.*', ['third_party']);
  gulp.watch('./src/scripts/sw.js', ['serviceworker']);

  watchBundles();
});

/** Main tasks */

(function () {
  var bundleKeys = Object.keys(bundles);
  var key = null;
  for (var b = 0; b < bundleKeys.length; b++) {
    key = bundleKeys[b];
    bundles[key].bundle = createBundle(bundles[key].url);
  }
})();

gulp.task('bump', function() {
  return gulp.src('./package.json')
    .pipe(bump({type:'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
  return runSequence('clean', ['styles', 'scripts', 'root', 'html'], 'watch');
});
