'use strict';

var firebase = require('@firebase/app-compat');
var component = require('@firebase/component');
var messaging = require('@firebase/messaging');
var util = require('@firebase/util');
var sw = require('@firebase/messaging/sw');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

const name = "@firebase/messaging-compat";
const version = "0.2.25";

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
function isSupported() {
    if (self && 'ServiceWorkerGlobalScope' in self) {
        // Running in ServiceWorker context
        return isSwSupported();
    }
    else {
        // Assume we are in the window context.
        return isWindowSupported();
    }
}
/**
 * Checks to see if the required APIs exist.
 * Unlike the modular version, it does not check if IndexedDB.open() is allowed
 * in order to keep isSupported() synchronous and maintain v8 compatibility.
 */
function isWindowSupported() {
    return (typeof window !== 'undefined' &&
        util.isIndexedDBAvailable() &&
        util.areCookiesEnabled() &&
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window &&
        'fetch' in window &&
        ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
        PushSubscription.prototype.hasOwnProperty('getKey'));
}
/**
 * Checks to see if the required APIs exist within SW Context.
 */
function isSwSupported() {
    return (util.isIndexedDBAvailable() &&
        'PushManager' in self &&
        'Notification' in self &&
        ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification') &&
        PushSubscription.prototype.hasOwnProperty('getKey'));
}
class MessagingCompatImpl {
    constructor(app, _delegate) {
        this.app = app;
        this._delegate = _delegate;
        this.app = app;
        this._delegate = _delegate;
    }
    async getToken(options) {
        return messaging.getToken(this._delegate, options);
    }
    async deleteToken() {
        return messaging.deleteToken(this._delegate);
    }
    onMessage(nextOrObserver) {
        return messaging.onMessage(this._delegate, nextOrObserver);
    }
    onBackgroundMessage(nextOrObserver) {
        return sw.onBackgroundMessage(this._delegate, nextOrObserver);
    }
}

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
const messagingCompatFactory = (container) => {
    if (self && 'ServiceWorkerGlobalScope' in self) {
        // in sw
        return new MessagingCompatImpl(container.getProvider('app-compat').getImmediate(), container.getProvider('messaging-sw').getImmediate());
    }
    else {
        // in window
        return new MessagingCompatImpl(container.getProvider('app-compat').getImmediate(), container.getProvider('messaging').getImmediate());
    }
};
const NAMESPACE_EXPORTS = {
    isSupported
};
function registerMessagingCompat() {
    firebase__default["default"].INTERNAL.registerComponent(new component.Component('messaging-compat', messagingCompatFactory, "PUBLIC" /* ComponentType.PUBLIC */).setServiceProps(NAMESPACE_EXPORTS));
}

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
registerMessagingCompat();
firebase__default["default"].registerVersion(name, version);
//# sourceMappingURL=index.cjs.js.map
