'use strict';

var firebase = require('@firebase/app-compat');
var component = require('@firebase/component');
var performance = require('@firebase/performance');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PerformanceCompatImpl {
    constructor(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
    }
    get instrumentationEnabled() {
        return this._delegate.instrumentationEnabled;
    }
    set instrumentationEnabled(val) {
        this._delegate.instrumentationEnabled = val;
    }
    get dataCollectionEnabled() {
        return this._delegate.dataCollectionEnabled;
    }
    set dataCollectionEnabled(val) {
        this._delegate.dataCollectionEnabled = val;
    }
    trace(traceName) {
        return performance.trace(this._delegate, traceName);
    }
}

const name = "@firebase/performance-compat";
const version = "0.2.24";

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function registerPerformanceCompat(firebaseInstance) {
    firebaseInstance.INTERNAL.registerComponent(new component.Component('performance-compat', performanceFactory, "PUBLIC" /* ComponentType.PUBLIC */));
    firebaseInstance.registerVersion(name, version);
}
function performanceFactory(container) {
    const app = container.getProvider('app-compat').getImmediate();
    // The following call will always succeed.
    const performance = container.getProvider('performance').getImmediate();
    return new PerformanceCompatImpl(app, performance);
}
registerPerformanceCompat(firebase__default["default"]);
//# sourceMappingURL=index.cjs.js.map
