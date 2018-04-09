/**
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
'use strict';
var deepAssign = require('deep-assign');
var xo = require('eslint-config-xo');

module.exports = deepAssign(xo, {
  globals: {
    goog: true
  },
  rules: {
    'indent': [2, 2, {
      SwitchCase: 1
    }],
    'space-before-function-paren': [2, 'never'],
    'valid-jsdoc': [2, {
      requireReturn: false,
      prefer: {
        returns: 'return'
      }
    }],
    'require-jsdoc': 1,
    'max-len': [1, 80, 4, {
      ignoreComments: true,
      ignoreUrls: true
    }]
  }
});
