/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Include Gulp & tools we'll use
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var spawn = require('child_process').spawn;

gulp.task('jekyll:build', function(cb) {
  // Handle OS differences in executable name
  var jekyllCommand = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
  var params = ['exec', jekyllCommand, 'build', '--trace', '--safe'];

  var jekyllProcess = spawn('bundle', params, {
      env: process.env,
      stdio: 'inherit'
    });
  jekyllProcess.on('close', cb);
});

// vendor/ is added to excluded files since that is the
// directory travis installs ruby dependencies
gulp.task('lint', ['jekyll:build'], function() {
  return gulp.src([
    '**/*.js',
    '_site/**/*.html',
    '!_site/**/*.js',
    '!node_modules/**/*',
    '!_{layouts,includes}/**/*',
    '!**/third_party/*',
    '!perf/dom-react-vs-vanilla/build/**/*',
    '!vendor/**/*.*'
  ])
    .pipe(jshint.extract('auto'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
