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
var runSequence = require('run-sequence');

// vendor/ is added to excluded files since that is the
// directory travis installs ruby dependencies
gulp.task('lint', [], function(cb) {
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
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:watch', function() {
  gulp.watch(['**/**/*.{js,html}', '!node_modules/**/*'], ['lint']);
});
