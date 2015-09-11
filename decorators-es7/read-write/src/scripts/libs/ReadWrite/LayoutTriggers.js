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

// @see http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html
const LayoutTriggers = {

  'HTMLElement': {
    'method': [
      'focus',
      'getBoundingClientRect',
      'getClientRects',
      'focus',
      'scrollByLines',
      'scrollByPages',
      'scrollIntoView',
      'scrollIntoViewIfNeeded'
    ],
    'get': [
      'clientHeight',
      'clientLeft',
      'clientTop',
      'clientWidth',
      'innerText',
      'offsetHeight',
      'offsetLeft',
      'offsetParent',
      'offsetTop',
      'offsetWidth',
      'outerText',
      'scrollHeight',
      'scrollLeft',
      'scrollTop',
      'scrollWidth'
    ]
  }
};

export default LayoutTriggers;
