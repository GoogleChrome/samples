'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var register = require('./register-a20238ea.js');
var util = require('@firebase/util');
var app = require('@firebase/app');
require('@firebase/component');
require('@firebase/logger');

/**
 * @license
 * Copyright 2021 Google LLC
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
/**
 * An enum of factors that may be used for multifactor authentication.
 *
 * @public
 */
const FactorId = {
    /** Phone as second factor */
    PHONE: 'phone',
    TOTP: 'totp'
};
/**
 * Enumeration of supported providers.
 *
 * @public
 */
const ProviderId = {
    /** Facebook provider ID */
    FACEBOOK: 'facebook.com',
    /** GitHub provider ID */
    GITHUB: 'github.com',
    /** Google provider ID */
    GOOGLE: 'google.com',
    /** Password provider */
    PASSWORD: 'password',
    /** Phone provider */
    PHONE: 'phone',
    /** Twitter provider ID */
    TWITTER: 'twitter.com'
};
/**
 * Enumeration of supported sign-in methods.
 *
 * @public
 */
const SignInMethod = {
    /** Email link sign in method */
    EMAIL_LINK: 'emailLink',
    /** Email/password sign in method */
    EMAIL_PASSWORD: 'password',
    /** Facebook sign in method */
    FACEBOOK: 'facebook.com',
    /** GitHub sign in method */
    GITHUB: 'github.com',
    /** Google sign in method */
    GOOGLE: 'google.com',
    /** Phone sign in method */
    PHONE: 'phone',
    /** Twitter sign in method */
    TWITTER: 'twitter.com'
};
/**
 * Enumeration of supported operation types.
 *
 * @public
 */
const OperationType = {
    /** Operation involving linking an additional provider to an already signed-in user. */
    LINK: 'link',
    /** Operation involving using a provider to reauthenticate an already signed-in user. */
    REAUTHENTICATE: 'reauthenticate',
    /** Operation involving signing in a user. */
    SIGN_IN: 'signIn'
};
/**
 * An enumeration of the possible email action types.
 *
 * @public
 */
const ActionCodeOperation = {
    /** The email link sign-in action. */
    EMAIL_SIGNIN: 'EMAIL_SIGNIN',
    /** The password reset action. */
    PASSWORD_RESET: 'PASSWORD_RESET',
    /** The email revocation action. */
    RECOVER_EMAIL: 'RECOVER_EMAIL',
    /** The revert second factor addition email action. */
    REVERT_SECOND_FACTOR_ADDITION: 'REVERT_SECOND_FACTOR_ADDITION',
    /** The revert second factor addition email action. */
    VERIFY_AND_CHANGE_EMAIL: 'VERIFY_AND_CHANGE_EMAIL',
    /** The email verification action. */
    VERIFY_EMAIL: 'VERIFY_EMAIL'
};

/**
 * @license
 * Copyright 2019 Google LLC
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
// There are two different browser persistence types: local and session.
// Both have the same implementation but use a different underlying storage
// object.
class BrowserPersistenceClass {
    constructor(storageRetriever, type) {
        this.storageRetriever = storageRetriever;
        this.type = type;
    }
    _isAvailable() {
        try {
            if (!this.storage) {
                return Promise.resolve(false);
            }
            this.storage.setItem(register.STORAGE_AVAILABLE_KEY, '1');
            this.storage.removeItem(register.STORAGE_AVAILABLE_KEY);
            return Promise.resolve(true);
        }
        catch {
            return Promise.resolve(false);
        }
    }
    _set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    }
    _get(key) {
        const json = this.storage.getItem(key);
        return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key) {
        this.storage.removeItem(key);
        return Promise.resolve();
    }
    get storage() {
        return this.storageRetriever();
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
// The polling period in case events are not supported
const _POLLING_INTERVAL_MS = 1000;
// The IE 10 localStorage cross tab synchronization delay in milliseconds
const IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
class BrowserLocalPersistence extends BrowserPersistenceClass {
    constructor() {
        super(() => window.localStorage, "LOCAL" /* PersistenceType.LOCAL */);
        this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
        this.listeners = {};
        this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.pollTimer = null;
        // Whether to use polling instead of depending on window events
        this.fallbackToPolling = register._isMobileBrowser();
        this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb) {
        // Check all keys with listeners on them.
        for (const key of Object.keys(this.listeners)) {
            // Get value from localStorage.
            const newValue = this.storage.getItem(key);
            const oldValue = this.localCache[key];
            // If local map value does not match, trigger listener with storage event.
            // Differentiate this simulated event from the real storage event.
            if (newValue !== oldValue) {
                cb(key, oldValue, newValue);
            }
        }
    }
    onStorageEvent(event, poll = false) {
        // Key would be null in some situations, like when localStorage is cleared
        if (!event.key) {
            this.forAllChangedKeys((key, _oldValue, newValue) => {
                this.notifyListeners(key, newValue);
            });
            return;
        }
        const key = event.key;
        // Check the mechanism how this event was detected.
        // The first event will dictate the mechanism to be used.
        if (poll) {
            // Environment detects storage changes via polling.
            // Remove storage event listener to prevent possible event duplication.
            this.detachListener();
        }
        else {
            // Environment detects storage changes via storage event listener.
            // Remove polling listener to prevent possible event duplication.
            this.stopPolling();
        }
        const triggerListeners = () => {
            // Keep local map up to date in case storage event is triggered before
            // poll.
            const storedValue = this.storage.getItem(key);
            if (!poll && this.localCache[key] === storedValue) {
                // Real storage event which has already been detected, do nothing.
                // This seems to trigger in some IE browsers for some reason.
                return;
            }
            this.notifyListeners(key, storedValue);
        };
        const storedValue = this.storage.getItem(key);
        if (register._isIE10() &&
            storedValue !== event.newValue &&
            event.newValue !== event.oldValue) {
            // IE 10 has this weird bug where a storage event would trigger with the
            // correct key, oldValue and newValue but localStorage.getItem(key) does
            // not yield the updated value until a few milliseconds. This ensures
            // this recovers from that situation.
            setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
        }
        else {
            triggerListeners();
        }
    }
    notifyListeners(key, value) {
        this.localCache[key] = value;
        const listeners = this.listeners[key];
        if (listeners) {
            for (const listener of Array.from(listeners)) {
                listener(value ? JSON.parse(value) : value);
            }
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(() => {
            this.forAllChangedKeys((key, oldValue, newValue) => {
                this.onStorageEvent(new StorageEvent('storage', {
                    key,
                    oldValue,
                    newValue
                }), 
                /* poll */ true);
            });
        }, _POLLING_INTERVAL_MS);
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    attachListener() {
        window.addEventListener('storage', this.boundEventHandler);
    }
    detachListener() {
        window.removeEventListener('storage', this.boundEventHandler);
    }
    _addListener(key, listener) {
        if (Object.keys(this.listeners).length === 0) {
            // Whether browser can detect storage event when it had already been pushed to the background.
            // This may happen in some mobile browsers. A localStorage change in the foreground window
            // will not be detected in the background window via the storage event.
            // This was detected in iOS 7.x mobile browsers
            if (this.fallbackToPolling) {
                this.startPolling();
            }
            else {
                this.attachListener();
            }
        }
        if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            // Populate the cache to avoid spuriously triggering on first poll.
            this.localCache[key] = this.storage.getItem(key);
        }
        this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
        if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
                delete this.listeners[key];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.detachListener();
            this.stopPolling();
        }
    }
    // Update local cache on base operations:
    async _set(key, value) {
        await super._set(key, value);
        this.localCache[key] = JSON.stringify(value);
    }
    async _get(key) {
        const value = await super._get(key);
        this.localCache[key] = JSON.stringify(value);
        return value;
    }
    async _remove(key) {
        await super._remove(key);
        delete this.localCache[key];
    }
}
BrowserLocalPersistence.type = 'LOCAL';
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `localStorage`
 * for the underlying storage.
 *
 * @public
 */
const browserLocalPersistence = BrowserLocalPersistence;

/**
 * @license
 * Copyright 2025 Google LLC
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
const POLLING_INTERVAL_MS = 1000;
// Pull a cookie value from document.cookie
function getDocumentCookie(name) {
    const escapedName = name.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    const matcher = RegExp(`${escapedName}=([^;]+)`);
    return document.cookie.match(matcher)?.[1] ?? null;
}
// Produce a sanitized cookie name from the persistence key
function getCookieName(key) {
    // __HOST- doesn't work in localhost https://issues.chromium.org/issues/40196122 but it has
    // desirable security properties, so lets use a different cookie name while in dev-mode.
    // Already checked isSecureContext in _isAvailable, so if it's http we're hitting local.
    const isDevMode = window.location.protocol === 'http:';
    return `${isDevMode ? '__dev_' : '__HOST-'}FIREBASE_${key.split(':')[3]}`;
}
class CookiePersistence {
    constructor() {
        this.type = "COOKIE" /* PersistenceType.COOKIE */;
        this.listenerUnsubscribes = new Map();
    }
    // used to get the URL to the backend to proxy to
    _getFinalTarget(originalUrl) {
        if (typeof window === undefined) {
            return originalUrl;
        }
        const url = new URL(`${window.location.origin}/__cookies__`);
        url.searchParams.set('finalTarget', originalUrl);
        return url;
    }
    // To be a usable persistence method in a chain browserCookiePersistence ensures that
    // prerequisites have been met, namely that we're in a secureContext, navigator and document are
    // available and cookies are enabled. Not all UAs support these method, so fallback accordingly.
    async _isAvailable() {
        if (typeof isSecureContext === 'boolean' && !isSecureContext) {
            return false;
        }
        if (typeof navigator === 'undefined' || typeof document === 'undefined') {
            return false;
        }
        return navigator.cookieEnabled ?? true;
    }
    // Set should be a noop as we expect middleware to handle this
    async _set(_key, _value) {
        return;
    }
    // Attempt to get the cookie from cookieStore, fallback to document.cookie
    async _get(key) {
        if (!this._isAvailable()) {
            return null;
        }
        const name = getCookieName(key);
        if (window.cookieStore) {
            const cookie = await window.cookieStore.get(name);
            return cookie?.value;
        }
        return getDocumentCookie(name);
    }
    // Log out by overriding the idToken with a sentinel value of ""
    async _remove(key) {
        if (!this._isAvailable()) {
            return;
        }
        // To make sure we don't hit signout over and over again, only do this operation if we need to
        // with the logout sentinel value of "" this can cause race conditions. Unnecessary set-cookie
        // headers will reduce CDN hit rates too.
        const existingValue = await this._get(key);
        if (!existingValue) {
            return;
        }
        const name = getCookieName(key);
        document.cookie = `${name}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`;
        await fetch(`/__cookies__`, { method: 'DELETE' }).catch(() => undefined);
    }
    // Listen for cookie changes, both cookieStore and fallback to polling document.cookie
    _addListener(key, listener) {
        if (!this._isAvailable()) {
            return;
        }
        const name = getCookieName(key);
        if (window.cookieStore) {
            const cb = ((event) => {
                const changedCookie = event.changed.find(change => change.name === name);
                if (changedCookie) {
                    listener(changedCookie.value);
                }
                const deletedCookie = event.deleted.find(change => change.name === name);
                if (deletedCookie) {
                    listener(null);
                }
            });
            const unsubscribe = () => window.cookieStore.removeEventListener('change', cb);
            this.listenerUnsubscribes.set(listener, unsubscribe);
            return window.cookieStore.addEventListener('change', cb);
        }
        let lastValue = getDocumentCookie(name);
        const interval = setInterval(() => {
            const currentValue = getDocumentCookie(name);
            if (currentValue !== lastValue) {
                listener(currentValue);
                lastValue = currentValue;
            }
        }, POLLING_INTERVAL_MS);
        const unsubscribe = () => clearInterval(interval);
        this.listenerUnsubscribes.set(listener, unsubscribe);
    }
    _removeListener(_key, listener) {
        const unsubscribe = this.listenerUnsubscribes.get(listener);
        if (!unsubscribe) {
            return;
        }
        unsubscribe();
        this.listenerUnsubscribes.delete(listener);
    }
}
CookiePersistence.type = 'COOKIE';
/**
 * An implementation of {@link Persistence} of type `COOKIE`, for use on the client side in
 * applications leveraging hybrid rendering and middleware.
 *
 * @remarks This persistence method requires companion middleware to function, such as that provided
 * by {@link https://firebaseopensource.com/projects/firebaseextended/reactfire/ | ReactFire} for
 * NextJS.
 * @beta
 */
const browserCookiePersistence = CookiePersistence;

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
class BrowserSessionPersistence extends BrowserPersistenceClass {
    constructor() {
        super(() => window.sessionStorage, "SESSION" /* PersistenceType.SESSION */);
    }
    _addListener(_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    }
    _removeListener(_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    }
}
BrowserSessionPersistence.type = 'SESSION';
/**
 * An implementation of {@link Persistence} of `SESSION` using `sessionStorage`
 * for the underlying storage.
 *
 * @public
 */
const browserSessionPersistence = BrowserSessionPersistence;

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
// ReCaptcha will load using the same callback, so the callback function needs
// to be kept around
const _JSLOAD_CALLBACK = register._generateCallbackName('rcb');
const NETWORK_TIMEOUT_DELAY = new register.Delay(30000, 60000);
/**
 * Loader for the GReCaptcha library. There should only ever be one of this.
 */
class ReCaptchaLoaderImpl {
    constructor() {
        this.hostLanguage = '';
        this.counter = 0;
        /**
         * Check for `render()` method. `window.grecaptcha` will exist if the Enterprise
         * version of the ReCAPTCHA script was loaded by someone else (e.g. App Check) but
         * `window.grecaptcha.render()` will not. Another load will add it.
         */
        this.librarySeparatelyLoaded = !!register._window().grecaptcha?.render;
    }
    load(auth, hl = '') {
        register._assert(isHostLanguageValid(hl), auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        if (this.shouldResolveImmediately(hl) && register.isV2(register._window().grecaptcha)) {
            return Promise.resolve(register._window().grecaptcha);
        }
        return new Promise((resolve, reject) => {
            const networkTimeout = register._window().setTimeout(() => {
                reject(register._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
            }, NETWORK_TIMEOUT_DELAY.get());
            register._window()[_JSLOAD_CALLBACK] = () => {
                register._window().clearTimeout(networkTimeout);
                delete register._window()[_JSLOAD_CALLBACK];
                const recaptcha = register._window().grecaptcha;
                if (!recaptcha || !register.isV2(recaptcha)) {
                    reject(register._createError(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */));
                    return;
                }
                // Wrap the recaptcha render function so that we know if the developer has
                // called it separately
                const render = recaptcha.render;
                recaptcha.render = (container, params) => {
                    const widgetId = render(container, params);
                    this.counter++;
                    return widgetId;
                };
                this.hostLanguage = hl;
                resolve(recaptcha);
            };
            const url = `${register._recaptchaV2ScriptUrl()}?${util.querystring({
                onload: _JSLOAD_CALLBACK,
                render: 'explicit',
                hl
            })}`;
            register._loadJS(url).catch(() => {
                clearTimeout(networkTimeout);
                reject(register._createError(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */));
            });
        });
    }
    clearedOneInstance() {
        this.counter--;
    }
    shouldResolveImmediately(hl) {
        // We can resolve immediately if:
        //   • grecaptcha is already defined AND (
        //     1. the requested language codes are the same OR
        //     2. there exists already a ReCaptcha on the page
        //     3. the library was already loaded by the app
        // In cases (2) and (3), we _can't_ reload as it would break the recaptchas
        // that are already in the page
        return (!!register._window().grecaptcha?.render &&
            (hl === this.hostLanguage ||
                this.counter > 0 ||
                this.librarySeparatelyLoaded));
    }
}
function isHostLanguageValid(hl) {
    return hl.length <= 6 && /^\s*[a-zA-Z0-9\-]*\s*$/.test(hl);
}
class MockReCaptchaLoaderImpl {
    async load(auth) {
        return new register.MockReCaptcha(auth);
    }
    clearedOneInstance() { }
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
const RECAPTCHA_VERIFIER_TYPE = 'recaptcha';
const DEFAULT_PARAMS = {
    theme: 'light',
    type: 'image'
};
/**
 * An {@link https://www.google.com/recaptcha/ | reCAPTCHA}-based application verifier.
 *
 * @remarks
 * `RecaptchaVerifier` does not work in a Node.js environment.
 *
 * @public
 */
class RecaptchaVerifier {
    /**
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     * @param containerOrId - The reCAPTCHA container parameter.
     *
     * @remarks
     * This has different meaning depending on whether the reCAPTCHA is hidden or visible. For a
     * visible reCAPTCHA the container must be empty. If a string is used, it has to correspond to
     * an element ID. The corresponding element must also must be in the DOM at the time of
     * initialization.
     *
     * @param parameters - The optional reCAPTCHA parameters.
     *
     * @remarks
     * Check the reCAPTCHA docs for a comprehensive list. All parameters are accepted except for
     * the sitekey. Firebase Auth backend provisions a reCAPTCHA for each project and will
     * configure this upon rendering. For an invisible reCAPTCHA, a size key must have the value
     * 'invisible'.
     */
    constructor(authExtern, containerOrId, parameters = {
        ...DEFAULT_PARAMS
    }) {
        this.parameters = parameters;
        /**
         * The application verifier type.
         *
         * @remarks
         * For a reCAPTCHA verifier, this is 'recaptcha'.
         */
        this.type = RECAPTCHA_VERIFIER_TYPE;
        this.destroyed = false;
        this.widgetId = null;
        this.tokenChangeListeners = new Set();
        this.renderPromise = null;
        this.recaptcha = null;
        this.auth = register._castAuth(authExtern);
        this.isInvisible = this.parameters.size === 'invisible';
        register._assert(typeof document !== 'undefined', this.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
        const container = typeof containerOrId === 'string'
            ? document.getElementById(containerOrId)
            : containerOrId;
        register._assert(container, this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        this.container = container;
        this.parameters.callback = this.makeTokenCallback(this.parameters.callback);
        this._recaptchaLoader = this.auth.settings.appVerificationDisabledForTesting
            ? new MockReCaptchaLoaderImpl()
            : new ReCaptchaLoaderImpl();
        this.validateStartingState();
        // TODO: Figure out if sdk version is needed
    }
    /**
     * Waits for the user to solve the reCAPTCHA and resolves with the reCAPTCHA token.
     *
     * @returns A Promise for the reCAPTCHA token.
     */
    async verify() {
        this.assertNotDestroyed();
        const id = await this.render();
        const recaptcha = this.getAssertedRecaptcha();
        const response = recaptcha.getResponse(id);
        if (response) {
            return response;
        }
        return new Promise(resolve => {
            const tokenChange = (token) => {
                if (!token) {
                    return; // Ignore token expirations.
                }
                this.tokenChangeListeners.delete(tokenChange);
                resolve(token);
            };
            this.tokenChangeListeners.add(tokenChange);
            if (this.isInvisible) {
                recaptcha.execute(id);
            }
        });
    }
    /**
     * Renders the reCAPTCHA widget on the page.
     *
     * @returns A Promise that resolves with the reCAPTCHA widget ID.
     */
    render() {
        try {
            this.assertNotDestroyed();
        }
        catch (e) {
            // This method returns a promise. Since it's not async (we want to return the
            // _same_ promise if rendering is still occurring), the API surface should
            // reject with the error rather than just throw
            return Promise.reject(e);
        }
        if (this.renderPromise) {
            return this.renderPromise;
        }
        this.renderPromise = this.makeRenderPromise().catch(e => {
            this.renderPromise = null;
            throw e;
        });
        return this.renderPromise;
    }
    /** @internal */
    _reset() {
        this.assertNotDestroyed();
        if (this.widgetId !== null) {
            this.getAssertedRecaptcha().reset(this.widgetId);
        }
    }
    /**
     * Clears the reCAPTCHA widget from the page and destroys the instance.
     */
    clear() {
        this.assertNotDestroyed();
        this.destroyed = true;
        this._recaptchaLoader.clearedOneInstance();
        if (!this.isInvisible) {
            this.container.childNodes.forEach(node => {
                this.container.removeChild(node);
            });
        }
    }
    validateStartingState() {
        register._assert(!this.parameters.sitekey, this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        register._assert(this.isInvisible || !this.container.hasChildNodes(), this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        register._assert(typeof document !== 'undefined', this.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    makeTokenCallback(existing) {
        return token => {
            this.tokenChangeListeners.forEach(listener => listener(token));
            if (typeof existing === 'function') {
                existing(token);
            }
            else if (typeof existing === 'string') {
                const globalFunc = register._window()[existing];
                if (typeof globalFunc === 'function') {
                    globalFunc(token);
                }
            }
        };
    }
    assertNotDestroyed() {
        register._assert(!this.destroyed, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    }
    async makeRenderPromise() {
        await this.init();
        if (!this.widgetId) {
            let container = this.container;
            if (!this.isInvisible) {
                const guaranteedEmpty = document.createElement('div');
                container.appendChild(guaranteedEmpty);
                container = guaranteedEmpty;
            }
            this.widgetId = this.getAssertedRecaptcha().render(container, this.parameters);
        }
        return this.widgetId;
    }
    async init() {
        register._assert(register._isHttpOrHttps() && !register._isWorker(), this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        await domReady();
        this.recaptcha = await this._recaptchaLoader.load(this.auth, this.auth.languageCode || undefined);
        const siteKey = await register.getRecaptchaParams(this.auth);
        register._assert(siteKey, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        this.parameters.sitekey = siteKey;
    }
    getAssertedRecaptcha() {
        register._assert(this.recaptcha, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        return this.recaptcha;
    }
}
function domReady() {
    let resolver = null;
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
            return;
        }
        // Document not ready, wait for load before resolving.
        // Save resolver, so we can remove listener in case it was externally
        // cancelled.
        resolver = () => resolve();
        window.addEventListener('load', resolver);
    }).catch(e => {
        if (resolver) {
            window.removeEventListener('load', resolver);
        }
        throw e;
    });
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
class ConfirmationResultImpl {
    constructor(verificationId, onConfirmation) {
        this.verificationId = verificationId;
        this.onConfirmation = onConfirmation;
    }
    confirm(verificationCode) {
        const authCredential = register.PhoneAuthCredential._fromVerification(this.verificationId, verificationCode);
        return this.onConfirmation(authCredential);
    }
}
/**
 * Asynchronously signs in using a phone number.
 *
 * @remarks
 * This method sends a code via SMS to the given
 * phone number, and returns a {@link ConfirmationResult}. After the user
 * provides the code sent to their phone, call {@link ConfirmationResult.confirm}
 * with the code to sign the user in.
 *
 * For abuse prevention, this method requires a {@link ApplicationVerifier}.
 * This SDK includes an implementation based on reCAPTCHA v2, {@link RecaptchaVerifier}.
 * This function can work on other platforms that do not support the
 * {@link RecaptchaVerifier} (like React Native), but you need to use a
 * third-party {@link ApplicationVerifier} implementation.
 *
 * If you've enabled project-level reCAPTCHA Enterprise bot protection in
 * Enforce mode, you can omit the {@link ApplicationVerifier}.
 *
 * This method does not work in a Node.js environment or with {@link Auth} instances created with a
 * {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
 * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
 * // Obtain a verificationCode from the user.
 * const credential = await confirmationResult.confirm(verificationCode);
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
async function signInWithPhoneNumber(auth, phoneNumber, appVerifier) {
    if (app._isFirebaseServerApp(auth.app)) {
        return Promise.reject(register._serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = register._castAuth(auth);
    const verificationId = await _verifyPhoneNumber(authInternal, phoneNumber, util.getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, cred => register.signInWithCredential(authInternal, cred));
}
/**
 * Links the user account with the given phone number.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @param user - The user.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
async function linkWithPhoneNumber(user, phoneNumber, appVerifier) {
    const userInternal = util.getModularInstance(user);
    await register._assertLinkedStatus(false, userInternal, "phone" /* ProviderId.PHONE */);
    const verificationId = await _verifyPhoneNumber(userInternal.auth, phoneNumber, util.getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, cred => register.linkWithCredential(userInternal, cred));
}
/**
 * Re-authenticates a user using a fresh phone credential.
 *
 * @remarks
 * Use before operations such as {@link updatePassword} that require tokens from recent sign-in attempts.
 *
 * This method does not work in a Node.js environment or on any {@link User} signed in by
 * {@link Auth} instances created with a {@link @firebase/app#FirebaseServerApp}.
 *
 * @param user - The user.
 * @param phoneNumber - The user's phone number in E.164 format (e.g. +16505550101).
 * @param appVerifier - The {@link ApplicationVerifier}.
 *
 * @public
 */
async function reauthenticateWithPhoneNumber(user, phoneNumber, appVerifier) {
    const userInternal = util.getModularInstance(user);
    if (app._isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(register._serverAppCurrentUserOperationNotSupportedError(userInternal.auth));
    }
    const verificationId = await _verifyPhoneNumber(userInternal.auth, phoneNumber, util.getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, cred => register.reauthenticateWithCredential(userInternal, cred));
}
/**
 * Returns a verification ID to be used in conjunction with the SMS code that is sent.
 *
 */
async function _verifyPhoneNumber(auth, options, verifier) {
    if (!auth._getRecaptchaConfig()) {
        try {
            await register._initializeRecaptchaConfig(auth);
        }
        catch (error) {
            // If an error occurs while fetching the config, there is no way to know the enablement state
            // of Phone provider, so we proceed with recaptcha V2 verification.
            // The error is likely "recaptchaKey undefined", as reCAPTCHA Enterprise is not
            // enabled for any provider.
            console.log('Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.');
        }
    }
    try {
        let phoneInfoOptions;
        if (typeof options === 'string') {
            phoneInfoOptions = {
                phoneNumber: options
            };
        }
        else {
            phoneInfoOptions = options;
        }
        if ('session' in phoneInfoOptions) {
            const session = phoneInfoOptions.session;
            if ('phoneNumber' in phoneInfoOptions) {
                register._assert(session.type === "enroll" /* MultiFactorSessionType.ENROLL */, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                const startPhoneMfaEnrollmentRequest = {
                    idToken: session.credential,
                    phoneEnrollmentInfo: {
                        phoneNumber: phoneInfoOptions.phoneNumber,
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    }
                };
                const startEnrollPhoneMfaActionCallback = async (authInstance, request) => {
                    // If reCAPTCHA Enterprise token is FAKE_TOKEN, fetch reCAPTCHA v2 token and inject into request.
                    if (request.phoneEnrollmentInfo.captchaResponse === register.FAKE_TOKEN) {
                        register._assert(verifier?.type === RECAPTCHA_VERIFIER_TYPE, authInstance, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                        const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
                        return register.startEnrollPhoneMfa(authInstance, requestWithRecaptchaV2);
                    }
                    return register.startEnrollPhoneMfa(authInstance, request);
                };
                const startPhoneMfaEnrollmentResponse = register.handleRecaptchaFlow(auth, startPhoneMfaEnrollmentRequest, "mfaSmsEnrollment" /* RecaptchaActionName.MFA_SMS_ENROLLMENT */, startEnrollPhoneMfaActionCallback, "PHONE_PROVIDER" /* RecaptchaAuthProvider.PHONE_PROVIDER */);
                const response = await startPhoneMfaEnrollmentResponse.catch(error => {
                    return Promise.reject(error);
                });
                return response.phoneSessionInfo.sessionInfo;
            }
            else {
                register._assert(session.type === "signin" /* MultiFactorSessionType.SIGN_IN */, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                const mfaEnrollmentId = phoneInfoOptions.multiFactorHint?.uid ||
                    phoneInfoOptions.multiFactorUid;
                register._assert(mfaEnrollmentId, auth, "missing-multi-factor-info" /* AuthErrorCode.MISSING_MFA_INFO */);
                const startPhoneMfaSignInRequest = {
                    mfaPendingCredential: session.credential,
                    mfaEnrollmentId,
                    phoneSignInInfo: {
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    }
                };
                const startSignInPhoneMfaActionCallback = async (authInstance, request) => {
                    // If reCAPTCHA Enterprise token is FAKE_TOKEN, fetch reCAPTCHA v2 token and inject into request.
                    if (request.phoneSignInInfo.captchaResponse === register.FAKE_TOKEN) {
                        register._assert(verifier?.type === RECAPTCHA_VERIFIER_TYPE, authInstance, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                        const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
                        return register.startSignInPhoneMfa(authInstance, requestWithRecaptchaV2);
                    }
                    return register.startSignInPhoneMfa(authInstance, request);
                };
                const startPhoneMfaSignInResponse = register.handleRecaptchaFlow(auth, startPhoneMfaSignInRequest, "mfaSmsSignIn" /* RecaptchaActionName.MFA_SMS_SIGNIN */, startSignInPhoneMfaActionCallback, "PHONE_PROVIDER" /* RecaptchaAuthProvider.PHONE_PROVIDER */);
                const response = await startPhoneMfaSignInResponse.catch(error => {
                    return Promise.reject(error);
                });
                return response.phoneResponseInfo.sessionInfo;
            }
        }
        else {
            const sendPhoneVerificationCodeRequest = {
                phoneNumber: phoneInfoOptions.phoneNumber,
                clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
            };
            const sendPhoneVerificationCodeActionCallback = async (authInstance, request) => {
                // If reCAPTCHA Enterprise token is FAKE_TOKEN, fetch reCAPTCHA v2 token and inject into request.
                if (request.captchaResponse === register.FAKE_TOKEN) {
                    register._assert(verifier?.type === RECAPTCHA_VERIFIER_TYPE, authInstance, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                    const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
                    return register.sendPhoneVerificationCode(authInstance, requestWithRecaptchaV2);
                }
                return register.sendPhoneVerificationCode(authInstance, request);
            };
            const sendPhoneVerificationCodeResponse = register.handleRecaptchaFlow(auth, sendPhoneVerificationCodeRequest, "sendVerificationCode" /* RecaptchaActionName.SEND_VERIFICATION_CODE */, sendPhoneVerificationCodeActionCallback, "PHONE_PROVIDER" /* RecaptchaAuthProvider.PHONE_PROVIDER */);
            const response = await sendPhoneVerificationCodeResponse.catch(error => {
                return Promise.reject(error);
            });
            return response.sessionInfo;
        }
    }
    finally {
        verifier?._reset();
    }
}
/**
 * Updates the user's phone number.
 *
 * @remarks
 * This method does not work in a Node.js environment or on any {@link User} signed in by
 * {@link Auth} instances created with a {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
 * const provider = new PhoneAuthProvider(auth);
 * const verificationId = await provider.verifyPhoneNumber('+16505550101', applicationVerifier);
 * // Obtain the verificationCode from the user.
 * const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * await updatePhoneNumber(user, phoneCredential);
 * ```
 *
 * @param user - The user.
 * @param credential - A credential authenticating the new phone number.
 *
 * @public
 */
async function updatePhoneNumber(user, credential) {
    const userInternal = util.getModularInstance(user);
    if (app._isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(register._serverAppCurrentUserOperationNotSupportedError(userInternal.auth));
    }
    await register._link(userInternal, credential);
}
// Helper function that fetches and injects a reCAPTCHA v2 token into the request.
async function injectRecaptchaV2Token(auth, request, recaptchaV2Verifier) {
    register._assert(recaptchaV2Verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    const recaptchaV2Token = await recaptchaV2Verifier.verify();
    register._assert(typeof recaptchaV2Token === 'string', auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    const newRequest = { ...request };
    if ('phoneEnrollmentInfo' in newRequest) {
        const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
        const captchaResponse = newRequest.phoneEnrollmentInfo.captchaResponse;
        const clientType = newRequest
            .phoneEnrollmentInfo.clientType;
        const recaptchaVersion = newRequest.phoneEnrollmentInfo.recaptchaVersion;
        Object.assign(newRequest, {
            'phoneEnrollmentInfo': {
                phoneNumber,
                recaptchaToken: recaptchaV2Token,
                captchaResponse,
                clientType,
                recaptchaVersion
            }
        });
        return newRequest;
    }
    else if ('phoneSignInInfo' in newRequest) {
        const captchaResponse = newRequest.phoneSignInInfo.captchaResponse;
        const clientType = newRequest
            .phoneSignInInfo.clientType;
        const recaptchaVersion = newRequest.phoneSignInInfo.recaptchaVersion;
        Object.assign(newRequest, {
            'phoneSignInInfo': {
                recaptchaToken: recaptchaV2Token,
                captchaResponse,
                clientType,
                recaptchaVersion
            }
        });
        return newRequest;
    }
    else {
        Object.assign(newRequest, { 'recaptchaToken': recaptchaV2Token });
        return newRequest;
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
/**
 * Provider for generating an {@link PhoneAuthCredential}.
 *
 * @remarks
 * `PhoneAuthProvider` does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // 'recaptcha-container' is the ID of an element in the DOM.
 * const applicationVerifier = new RecaptchaVerifier('recaptcha-container');
 * const provider = new PhoneAuthProvider(auth);
 * const verificationId = await provider.verifyPhoneNumber('+16505550101', applicationVerifier);
 * // Obtain the verificationCode from the user.
 * const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
 * const userCredential = await signInWithCredential(auth, phoneCredential);
 * ```
 *
 * @public
 */
class PhoneAuthProvider {
    /**
     * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
     *
     */
    constructor(auth) {
        /** Always set to {@link ProviderId}.PHONE. */
        this.providerId = PhoneAuthProvider.PROVIDER_ID;
        this.auth = register._castAuth(auth);
    }
    /**
     *
     * Starts a phone number authentication flow by sending a verification code to the given phone
     * number.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
     * E.164 format (e.g. +16505550101).
     * @param applicationVerifier - An {@link ApplicationVerifier}, which prevents
     * requests from unauthorized clients. This SDK includes an implementation
     * based on reCAPTCHA v2, {@link RecaptchaVerifier}. If you've enabled
     * reCAPTCHA Enterprise bot protection in Enforce mode, this parameter is
     * optional; in all other configurations, the parameter is required.
     *
     * @returns A Promise for a verification ID that can be passed to
     * {@link PhoneAuthProvider.credential} to identify this flow.
     */
    verifyPhoneNumber(phoneOptions, applicationVerifier) {
        return _verifyPhoneNumber(this.auth, phoneOptions, util.getModularInstance(applicationVerifier));
    }
    /**
     * Creates a phone auth credential, given the verification ID from
     * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
     * mobile device.
     *
     * @example
     * ```javascript
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
     * const userCredential = signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * An alternative flow is provided using the `signInWithPhoneNumber` method.
     * ```javascript
     * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
     * // Obtain verificationCode from the user.
     * const userCredential = await confirmationResult.confirm(verificationCode);
     * ```
     *
     * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
     * @param verificationCode - The verification code sent to the user's mobile device.
     *
     * @returns The auth provider credential.
     */
    static credential(verificationId, verificationCode) {
        return register.PhoneAuthCredential._fromVerification(verificationId, verificationCode);
    }
    /**
     * Generates an {@link AuthCredential} from a {@link UserCredential}.
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
        const credential = userCredential;
        return PhoneAuthProvider.credentialFromTaggedObject(credential);
    }
    /**
     * Returns an {@link AuthCredential} when passed an error.
     *
     * @remarks
     *
     * This method works for errors like
     * `auth/account-exists-with-different-credentials`. This is useful for
     * recovering when attempting to set a user's phone number but the number
     * in question is already tied to another account. For example, the following
     * code tries to update the current user's phone number, and if that
     * fails, links the user with the account associated with that number:
     *
     * ```js
     * const provider = new PhoneAuthProvider(auth);
     * const verificationId = await provider.verifyPhoneNumber(number, verifier);
     * try {
     *   const code = ''; // Prompt the user for the verification code
     *   await updatePhoneNumber(
     *       auth.currentUser,
     *       PhoneAuthProvider.credential(verificationId, code));
     * } catch (e) {
     *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
     *     const cred = PhoneAuthProvider.credentialFromError(e);
     *     await linkWithCredential(auth.currentUser, cred);
     *   }
     * }
     *
     * // At this point, auth.currentUser.phoneNumber === number.
     * ```
     *
     * @param error - The error to generate a credential from.
     */
    static credentialFromError(error) {
        return PhoneAuthProvider.credentialFromTaggedObject((error.customData || {}));
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse) {
            return null;
        }
        const { phoneNumber, temporaryProof } = tokenResponse;
        if (phoneNumber && temporaryProof) {
            return register.PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
        }
        return null;
    }
}
/** Always set to {@link ProviderId}.PHONE. */
PhoneAuthProvider.PROVIDER_ID = "phone" /* ProviderId.PHONE */;
/** Always set to {@link SignInMethod}.PHONE. */
PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone" /* SignInMethod.PHONE */;

/**
 * @license
 * Copyright 2021 Google LLC
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
/**
 * Chooses a popup/redirect resolver to use. This prefers the override (which
 * is directly passed in), and falls back to the property set on the auth
 * object. If neither are available, this function errors w/ an argument error.
 */
function _withDefaultResolver(auth, resolverOverride) {
    if (resolverOverride) {
        return register._getInstance(resolverOverride);
    }
    register._assert(auth._popupRedirectResolver, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    return auth._popupRedirectResolver;
}

/**
 * @license
 * Copyright 2019 Google LLC
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
class IdpCredential extends register.AuthCredential {
    constructor(params) {
        super("custom" /* ProviderId.CUSTOM */, "custom" /* ProviderId.CUSTOM */);
        this.params = params;
    }
    _getIdTokenResponse(auth) {
        return register.signInWithIdp(auth, this._buildIdpRequest());
    }
    _linkToIdToken(auth, idToken) {
        return register.signInWithIdp(auth, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth) {
        return register.signInWithIdp(auth, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
        const request = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: true,
            returnIdpCredential: true
        };
        if (idToken) {
            request.idToken = idToken;
        }
        return request;
    }
}
function _signIn(params) {
    return register._signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    const { auth, user } = params;
    register._assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return register._reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
async function _link(params) {
    const { auth, user } = params;
    register._assert(user, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return register._link(user, new IdpCredential(params), params.bypassAuthState);
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
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 */
class AbstractPopupRedirectOperation {
    constructor(auth, filter, resolver, user, bypassAuthState = false) {
        this.auth = auth;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [filter];
    }
    execute() {
        return new Promise(async (resolve, reject) => {
            this.pendingPromise = { resolve, reject };
            try {
                this.eventManager = await this.resolver._initialize(this.auth);
                await this.onExecution();
                this.eventManager.registerConsumer(this);
            }
            catch (e) {
                this.reject(e);
            }
        });
    }
    async onAuthEvent(event) {
        const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
        if (error) {
            this.reject(error);
            return;
        }
        const params = {
            auth: this.auth,
            requestUri: urlResponse,
            sessionId: sessionId,
            tenantId: tenantId || undefined,
            postBody: postBody || undefined,
            user: this.user,
            bypassAuthState: this.bypassAuthState
        };
        try {
            this.resolve(await this.getIdpTask(type)(params));
        }
        catch (e) {
            this.reject(e);
        }
    }
    onError(error) {
        this.reject(error);
    }
    getIdpTask(type) {
        switch (type) {
            case "signInViaPopup" /* AuthEventType.SIGN_IN_VIA_POPUP */:
            case "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */:
                return _signIn;
            case "linkViaPopup" /* AuthEventType.LINK_VIA_POPUP */:
            case "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */:
                return _link;
            case "reauthViaPopup" /* AuthEventType.REAUTH_VIA_POPUP */:
            case "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */:
                return _reauth;
            default:
                register._fail(this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }
    }
    resolve(cred) {
        register.debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    }
    reject(error) {
        register.debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.reject(error);
        this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
        if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
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
const _POLL_WINDOW_CLOSE_TIMEOUT = new register.Delay(2000, 10000);
/**
 * Authenticates a Firebase client using a popup-based OAuth authentication flow.
 *
 * @remarks
 * If succeeds, returns the signed in user along with the provider's credential. If sign in was
 * unsuccessful, returns an error object containing additional information about the error.
 *
 * This method does not work in a Node.js environment or with {@link Auth} instances created with a
 * {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
async function signInWithPopup(auth, provider, resolver) {
    if (app._isFirebaseServerApp(auth.app)) {
        return Promise.reject(register._createError(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */));
    }
    const authInternal = register._castAuth(auth);
    register._assertInstanceOf(auth, provider, register.FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    const action = new PopupOperation(authInternal, "signInViaPopup" /* AuthEventType.SIGN_IN_VIA_POPUP */, provider, resolverInternal);
    return action.executeNotNull();
}
/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a pop-up based
 * OAuth flow.
 *
 * @remarks
 * If the reauthentication is successful, the returned result will contain the user and the
 * provider's credential.
 *
 * This method does not work in a Node.js environment or on any {@link User} signed in by
 * {@link Auth} instances created with a {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 * // Reauthenticate using a popup.
 * await reauthenticateWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
async function reauthenticateWithPopup(user, provider, resolver) {
    const userInternal = util.getModularInstance(user);
    if (app._isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(register._createError(userInternal.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */));
    }
    register._assertInstanceOf(userInternal.auth, provider, register.FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    const action = new PopupOperation(userInternal.auth, "reauthViaPopup" /* AuthEventType.REAUTH_VIA_POPUP */, provider, resolverInternal, userInternal);
    return action.executeNotNull();
}
/**
 * Links the authenticated provider to the user account using a pop-up based OAuth flow.
 *
 * @remarks
 * If the linking is successful, the returned result will contain the user and the provider's credential.
 *
 * This method does not work in a Node.js environment.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a popup.
 * const provider = new FacebookAuthProvider();
 * await linkWithPopup(result.user, provider);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
async function linkWithPopup(user, provider, resolver) {
    const userInternal = util.getModularInstance(user);
    register._assertInstanceOf(userInternal.auth, provider, register.FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    const action = new PopupOperation(userInternal.auth, "linkViaPopup" /* AuthEventType.LINK_VIA_POPUP */, provider, resolverInternal, userInternal);
    return action.executeNotNull();
}
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 *
 */
class PopupOperation extends AbstractPopupRedirectOperation {
    constructor(auth, filter, provider, resolver, user) {
        super(auth, filter, resolver, user);
        this.provider = provider;
        this.authWindow = null;
        this.pollId = null;
        if (PopupOperation.currentPopupAction) {
            PopupOperation.currentPopupAction.cancel();
        }
        PopupOperation.currentPopupAction = this;
    }
    async executeNotNull() {
        const result = await this.execute();
        register._assert(result, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        return result;
    }
    async onExecution() {
        register.debugAssert(this.filter.length === 1, 'Popup operations only handle one event');
        const eventId = register._generateEventId();
        this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], // There's always one, see constructor
        eventId);
        this.authWindow.associatedEvent = eventId;
        // Check for web storage support and origin validation _after_ the popup is
        // loaded. These operations are slow (~1 second or so) Rather than
        // waiting on them before opening the window, optimistically open the popup
        // and check for storage support at the same time. If storage support is
        // not available, this will cause the whole thing to reject properly. It
        // will also close the popup, but since the promise has already rejected,
        // the popup closed by user poll will reject into the void.
        this.resolver._originValidation(this.auth).catch(e => {
            this.reject(e);
        });
        this.resolver._isIframeWebStorageSupported(this.auth, isSupported => {
            if (!isSupported) {
                this.reject(register._createError(this.auth, "web-storage-unsupported" /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */));
            }
        });
        // Handle user closure. Notice this does *not* use await
        this.pollUserCancellation();
    }
    get eventId() {
        return this.authWindow?.associatedEvent || null;
    }
    cancel() {
        this.reject(register._createError(this.auth, "cancelled-popup-request" /* AuthErrorCode.EXPIRED_POPUP_REQUEST */));
    }
    cleanUp() {
        if (this.authWindow) {
            this.authWindow.close();
        }
        if (this.pollId) {
            window.clearTimeout(this.pollId);
        }
        this.authWindow = null;
        this.pollId = null;
        PopupOperation.currentPopupAction = null;
    }
    pollUserCancellation() {
        const poll = () => {
            if (this.authWindow?.window?.closed) {
                // Make sure that there is sufficient time for whatever action to
                // complete. The window could have closed but the sign in network
                // call could still be in flight. This is specifically true for
                // Firefox or if the opener is in an iframe, in which case the oauth
                // helper closes the popup.
                this.pollId = window.setTimeout(() => {
                    this.pollId = null;
                    this.reject(register._createError(this.auth, "popup-closed-by-user" /* AuthErrorCode.POPUP_CLOSED_BY_USER */));
                }, 8000 /* _Timeout.AUTH_EVENT */);
                return;
            }
            this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
        };
        poll();
    }
}
// Only one popup is ever shown at once. The lifecycle of the current popup
// can be managed / cancelled by the constructor.
PopupOperation.currentPopupAction = null;

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
const PENDING_REDIRECT_KEY = 'pendingRedirect';
// We only get one redirect outcome for any one auth, so just store it
// in here.
const redirectOutcomeMap = new Map();
class RedirectAction extends AbstractPopupRedirectOperation {
    constructor(auth, resolver, bypassAuthState = false) {
        super(auth, [
            "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */,
            "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */,
            "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */,
            "unknown" /* AuthEventType.UNKNOWN */
        ], resolver, undefined, bypassAuthState);
        this.eventId = null;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    async execute() {
        let readyOutcome = redirectOutcomeMap.get(this.auth._key());
        if (!readyOutcome) {
            try {
                const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
                const result = hasPendingRedirect ? await super.execute() : null;
                readyOutcome = () => Promise.resolve(result);
            }
            catch (e) {
                readyOutcome = () => Promise.reject(e);
            }
            redirectOutcomeMap.set(this.auth._key(), readyOutcome);
        }
        // If we're not bypassing auth state, the ready outcome should be set to
        // null.
        if (!this.bypassAuthState) {
            redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
        }
        return readyOutcome();
    }
    async onAuthEvent(event) {
        if (event.type === "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */) {
            return super.onAuthEvent(event);
        }
        else if (event.type === "unknown" /* AuthEventType.UNKNOWN */) {
            // This is a sentinel value indicating there's no pending redirect
            this.resolve(null);
            return;
        }
        if (event.eventId) {
            const user = await this.auth._redirectUserForId(event.eventId);
            if (user) {
                this.user = user;
                return super.onAuthEvent(event);
            }
            else {
                this.resolve(null);
            }
        }
    }
    async onExecution() { }
    cleanUp() { }
}
async function _getAndClearPendingRedirectStatus(resolver, auth) {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!(await persistence._isAvailable())) {
        return false;
    }
    const hasPendingRedirect = (await persistence._get(key)) === 'true';
    await persistence._remove(key);
    return hasPendingRedirect;
}
async function _setPendingRedirectStatus(resolver, auth) {
    return resolverPersistence(resolver)._set(pendingRedirectKey(auth), 'true');
}
function _clearRedirectOutcomes() {
    redirectOutcomeMap.clear();
}
function _overrideRedirectResult(auth, result) {
    redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
    return register._getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
    return register._persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
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
/**
 * Authenticates a Firebase client using a full-page redirect flow.
 *
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link signInWithRedirect}.
 *
 * This method does not work in a Node.js environment or with {@link Auth} instances created with a
 * {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // You can add additional scopes to the provider:
 * provider.addScope('user_birthday');
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * // As this API can be used for sign-in, linking and reauthentication,
 * // check the operationType to determine what triggered this redirect
 * // operation.
 * const operationType = result.operationType;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function signInWithRedirect(auth, provider, resolver) {
    return _signInWithRedirect(auth, provider, resolver);
}
async function _signInWithRedirect(auth, provider, resolver) {
    if (app._isFirebaseServerApp(auth.app)) {
        return Promise.reject(register._serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = register._castAuth(auth);
    register._assertInstanceOf(auth, provider, register.FederatedAuthProvider);
    // Wait for auth initialization to complete, this will process pending redirects and clear the
    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
    // redirect and creating a PENDING_REDIRECT_KEY entry.
    await authInternal._initializationPromise;
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    await _setPendingRedirectStatus(resolverInternal, authInternal);
    return resolverInternal._openRedirect(authInternal, provider, "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */);
}
/**
 * Reauthenticates the current user with the specified {@link OAuthProvider} using a full-page redirect flow.
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link reauthenticateWithRedirect}.
 *
 * This method does not work in a Node.js environment or with {@link Auth} instances
 * created with a {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * // Reauthenticate using a redirect.
 * await reauthenticateWithRedirect(result.user, provider);
 * // This will again trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function reauthenticateWithRedirect(user, provider, resolver) {
    return _reauthenticateWithRedirect(user, provider, resolver);
}
async function _reauthenticateWithRedirect(user, provider, resolver) {
    const userInternal = util.getModularInstance(user);
    register._assertInstanceOf(userInternal.auth, provider, register.FederatedAuthProvider);
    if (app._isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(register._serverAppCurrentUserOperationNotSupportedError(userInternal.auth));
    }
    // Wait for auth initialization to complete, this will process pending redirects and clear the
    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
    // redirect and creating a PENDING_REDIRECT_KEY entry.
    await userInternal.auth._initializationPromise;
    // Allow the resolver to error before persisting the redirect user
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    await _setPendingRedirectStatus(resolverInternal, userInternal.auth);
    const eventId = await prepareUserForRedirect(userInternal);
    return resolverInternal._openRedirect(userInternal.auth, provider, "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */, eventId);
}
/**
 * Links the {@link OAuthProvider} to the user account using a full-page redirect flow.
 * @remarks
 * To handle the results and errors for this operation, refer to {@link getRedirectResult}.
 * Follow the {@link https://firebase.google.com/docs/auth/web/redirect-best-practices
 * | best practices} when using {@link linkWithRedirect}.
 *
 * This method does not work in a Node.js environment or with {@link Auth} instances
 * created with a {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // Sign in using some other provider.
 * const result = await signInWithEmailAndPassword(auth, email, password);
 * // Link using a redirect.
 * const provider = new FacebookAuthProvider();
 * await linkWithRedirect(result.user, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * ```
 *
 * @param user - The user.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
function linkWithRedirect(user, provider, resolver) {
    return _linkWithRedirect(user, provider, resolver);
}
async function _linkWithRedirect(user, provider, resolver) {
    const userInternal = util.getModularInstance(user);
    register._assertInstanceOf(userInternal.auth, provider, register.FederatedAuthProvider);
    // Wait for auth initialization to complete, this will process pending redirects and clear the
    // PENDING_REDIRECT_KEY in persistence. This should be completed before starting a new
    // redirect and creating a PENDING_REDIRECT_KEY entry.
    await userInternal.auth._initializationPromise;
    // Allow the resolver to error before persisting the redirect user
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    await register._assertLinkedStatus(false, userInternal, provider.providerId);
    await _setPendingRedirectStatus(resolverInternal, userInternal.auth);
    const eventId = await prepareUserForRedirect(userInternal);
    return resolverInternal._openRedirect(userInternal.auth, provider, "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */, eventId);
}
/**
 * Returns a {@link UserCredential} from the redirect-based sign-in flow.
 *
 * @remarks
 * If sign-in succeeded, returns the signed in user. If sign-in was unsuccessful, fails with an
 * error. If no redirect operation was called, returns `null`.
 *
 * This method does not work in a Node.js environment or with {@link Auth} instances created with a
 * {@link @firebase/app#FirebaseServerApp}.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new FacebookAuthProvider();
 * // You can add additional scopes to the provider:
 * provider.addScope('user_birthday');
 * // Start a sign in process for an unauthenticated user.
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Facebook Access Token.
 *   const credential = provider.credentialFromResult(auth, result);
 *   const token = credential.accessToken;
 * }
 * // As this API can be used for sign-in, linking and reauthentication,
 * // check the operationType to determine what triggered this redirect
 * // operation.
 * const operationType = result.operationType;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 * @public
 */
async function getRedirectResult(auth, resolver) {
    await register._castAuth(auth)._initializationPromise;
    return _getRedirectResult(auth, resolver, false);
}
async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
    if (app._isFirebaseServerApp(auth.app)) {
        return Promise.reject(register._serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = register._castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
        delete result.user._redirectEventId;
        await authInternal._persistUserIfCurrent(result.user);
        await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
}
async function prepareUserForRedirect(user) {
    const eventId = register._generateEventId(`${user.uid}:::`);
    user._redirectEventId = eventId;
    await user.auth._setRedirectUser(user);
    await user.auth._persistUserIfCurrent(user);
    return eventId;
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
// The amount of time to store the UIDs of seen events; this is
// set to 10 min by default
const EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;
class AuthEventManager {
    constructor(auth) {
        this.auth = auth;
        this.cachedEventUids = new Set();
        this.consumers = new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent &&
            this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
        }
    }
    unregisterConsumer(authEventConsumer) {
        this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
        // Check if the event has already been handled
        if (this.hasEventBeenHandled(event)) {
            return false;
        }
        let handled = false;
        this.consumers.forEach(consumer => {
            if (this.isEventForConsumer(event, consumer)) {
                handled = true;
                this.sendToConsumer(event, consumer);
                this.saveEventToCache(event);
            }
        });
        if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
            // If we've already seen a redirect before, or this is a popup event,
            // bail now
            return handled;
        }
        this.hasHandledPotentialRedirect = true;
        // If the redirect wasn't handled, hang on to it
        if (!handled) {
            this.queuedRedirectEvent = event;
            handled = true;
        }
        return handled;
    }
    sendToConsumer(event, consumer) {
        if (event.error && !isNullRedirectEvent(event)) {
            const code = event.error.code?.split('auth/')[1] ||
                "internal-error" /* AuthErrorCode.INTERNAL_ERROR */;
            consumer.onError(register._createError(this.auth, code));
        }
        else {
            consumer.onAuthEvent(event);
        }
    }
    isEventForConsumer(event, consumer) {
        const eventIdMatches = consumer.eventId === null ||
            (!!event.eventId && event.eventId === consumer.eventId);
        return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
        if (Date.now() - this.lastProcessedEventTime >=
            EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
    }
}
function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter(v => v).join('-');
}
function isNullRedirectEvent({ type, error }) {
    return (type === "unknown" /* AuthEventType.UNKNOWN */ &&
        error?.code === `auth/${"no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */}`);
}
function isRedirectEvent(event) {
    switch (event.type) {
        case "signInViaRedirect" /* AuthEventType.SIGN_IN_VIA_REDIRECT */:
        case "linkViaRedirect" /* AuthEventType.LINK_VIA_REDIRECT */:
        case "reauthViaRedirect" /* AuthEventType.REAUTH_VIA_REDIRECT */:
            return true;
        case "unknown" /* AuthEventType.UNKNOWN */:
            return isNullRedirectEvent(event);
        default:
            return false;
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
async function _getProjectConfig(auth, request = {}) {
    return register._performApiRequest(auth, "GET" /* HttpMethod.GET */, "/v1/projects" /* Endpoint.GET_PROJECT_CONFIG */, request);
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
const IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const HTTP_REGEX = /^https?/;
async function _validateOrigin$1(auth) {
    // Skip origin validation if we are in an emulated environment
    if (auth.config.emulator) {
        return;
    }
    const { authorizedDomains } = await _getProjectConfig(auth);
    for (const domain of authorizedDomains) {
        try {
            if (matchDomain(domain)) {
                return;
            }
        }
        catch {
            // Do nothing if there's a URL error; just continue searching
        }
    }
    // In the old SDK, this error also provides helpful messages.
    register._fail(auth, "unauthorized-domain" /* AuthErrorCode.INVALID_ORIGIN */);
}
function matchDomain(expected) {
    const currentUrl = register._getCurrentUrl();
    const { protocol, hostname } = new URL(currentUrl);
    if (expected.startsWith('chrome-extension://')) {
        const ceUrl = new URL(expected);
        if (ceUrl.hostname === '' && hostname === '') {
            // For some reason we're not parsing chrome URLs properly
            return (protocol === 'chrome-extension:' &&
                expected.replace('chrome-extension://', '') ===
                    currentUrl.replace('chrome-extension://', ''));
        }
        return protocol === 'chrome-extension:' && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
        return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
        // The domain has to be exactly equal to the pattern, as an IP domain will
        // only contain the IP, no extra character.
        return hostname === expected;
    }
    // Dots in pattern should be escaped.
    const escapedDomainPattern = expected.replace(/\./g, '\\.');
    // Non ip address domains.
    // domain.com = *.domain.com OR domain.com
    const re = new RegExp('^(.+\\.' + escapedDomainPattern + '|' + escapedDomainPattern + ')$', 'i');
    return re.test(hostname);
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
const NETWORK_TIMEOUT = new register.Delay(30000, 60000);
/**
 * Reset unloaded GApi modules. If gapi.load fails due to a network error,
 * it will stop working after a retrial. This is a hack to fix this issue.
 */
function resetUnloadedGapiModules() {
    // Clear last failed gapi.load state to force next gapi.load to first
    // load the failed gapi.iframes module.
    // Get gapix.beacon context.
    const beacon = register._window().___jsl;
    // Get current hint.
    if (beacon?.H) {
        // Get gapi hint.
        for (const hint of Object.keys(beacon.H)) {
            // Requested modules.
            beacon.H[hint].r = beacon.H[hint].r || [];
            // Loaded modules.
            beacon.H[hint].L = beacon.H[hint].L || [];
            // Set requested modules to a copy of the loaded modules.
            beacon.H[hint].r = [...beacon.H[hint].L];
            // Clear pending callbacks.
            if (beacon.CP) {
                for (let i = 0; i < beacon.CP.length; i++) {
                    // Remove all failed pending callbacks.
                    beacon.CP[i] = null;
                }
            }
        }
    }
}
function loadGapi(auth) {
    return new Promise((resolve, reject) => {
        // Function to run when gapi.load is ready.
        function loadGapiIframe() {
            // The developer may have tried to previously run gapi.load and failed.
            // Run this to fix that.
            resetUnloadedGapiModules();
            gapi.load('gapi.iframes', {
                callback: () => {
                    resolve(gapi.iframes.getContext());
                },
                ontimeout: () => {
                    // The above reset may be sufficient, but having this reset after
                    // failure ensures that if the developer calls gapi.load after the
                    // connection is re-established and before another attempt to embed
                    // the iframe, it would work and would not be broken because of our
                    // failed attempt.
                    // Timeout when gapi.iframes.Iframe not loaded.
                    resetUnloadedGapiModules();
                    reject(register._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                },
                timeout: NETWORK_TIMEOUT.get()
            });
        }
        if (register._window().gapi?.iframes?.Iframe) {
            // If gapi.iframes.Iframe available, resolve.
            resolve(gapi.iframes.getContext());
        }
        else if (!!register._window().gapi?.load) {
            // Gapi loader ready, load gapi.iframes.
            loadGapiIframe();
        }
        else {
            // Create a new iframe callback when this is called so as not to overwrite
            // any previous defined callback. This happens if this method is called
            // multiple times in parallel and could result in the later callback
            // overwriting the previous one. This would end up with a iframe
            // timeout.
            const cbName = register._generateCallbackName('iframefcb');
            // GApi loader not available, dynamically load platform.js.
            register._window()[cbName] = () => {
                // GApi loader should be ready.
                if (!!gapi.load) {
                    loadGapiIframe();
                }
                else {
                    // Gapi loader failed, throw error.
                    reject(register._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                }
            };
            // Load GApi loader.
            return register._loadJS(`${register._gapiScriptUrl()}?onload=${cbName}`)
                .catch(e => reject(e));
        }
    }).catch(error => {
        // Reset cached promise to allow for retrial.
        cachedGApiLoader = null;
        throw error;
    });
}
let cachedGApiLoader = null;
function _loadGapi(auth) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
    return cachedGApiLoader;
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
const PING_TIMEOUT = new register.Delay(5000, 15000);
const IFRAME_PATH = '__/auth/iframe';
const EMULATED_IFRAME_PATH = 'emulator/auth/iframe';
const IFRAME_ATTRIBUTES = {
    style: {
        position: 'absolute',
        top: '-100px',
        width: '1px',
        height: '1px'
    },
    'aria-hidden': 'true',
    tabindex: '-1'
};
// Map from apiHost to endpoint ID for passing into iframe. In current SDK, apiHost can be set to
// anything (not from a list of endpoints with IDs as in legacy), so this is the closest we can get.
const EID_FROM_APIHOST = new Map([
    ["identitytoolkit.googleapis.com" /* DefaultConfig.API_HOST */, 'p'], // production
    ['staging-identitytoolkit.sandbox.googleapis.com', 's'], // staging
    ['test-identitytoolkit.sandbox.googleapis.com', 't'] // test
]);
function getIframeUrl(auth) {
    const config = auth.config;
    register._assert(config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
    const url = config.emulator
        ? register._emulatorUrl(config, EMULATED_IFRAME_PATH)
        : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
    const params = {
        apiKey: config.apiKey,
        appName: auth.name,
        v: app.SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
    if (eid) {
        params.eid = eid;
    }
    const frameworks = auth._getFrameworks();
    if (frameworks.length) {
        params.fw = frameworks.join(',');
    }
    return `${url}?${util.querystring(params).slice(1)}`;
}
async function _openIframe(auth) {
    const context = await _loadGapi(auth);
    const gapi = register._window().gapi;
    register._assert(gapi, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
    return context.open({
        where: document.body,
        url: getIframeUrl(auth),
        messageHandlersFilter: gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: IFRAME_ATTRIBUTES,
        dontclear: true
    }, (iframe) => new Promise(async (resolve, reject) => {
        await iframe.restyle({
            // Prevent iframe from closing on mouse out.
            setHideOnLeave: false
        });
        const networkError = register._createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */);
        // Confirm iframe is correctly loaded.
        // To fallback on failure, set a timeout.
        const networkErrorTimer = register._window().setTimeout(() => {
            reject(networkError);
        }, PING_TIMEOUT.get());
        // Clear timer and resolve pending iframe ready promise.
        function clearTimerAndResolve() {
            register._window().clearTimeout(networkErrorTimer);
            resolve(iframe);
        }
        // This returns an IThenable. However the reject part does not call
        // when the iframe is not loaded.
        iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
            reject(networkError);
        });
    }));
}

/**
 * @license
 * Copyright 2020 Google LLC.
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
const BASE_POPUP_OPTIONS = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no'
};
const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 600;
const TARGET_BLANK = '_blank';
const FIREFOX_EMPTY_URL = 'http://localhost';
class AuthPopup {
    constructor(window) {
        this.window = window;
        this.associatedEvent = null;
    }
    close() {
        if (this.window) {
            try {
                this.window.close();
            }
            catch (e) { }
        }
    }
}
function _open(auth, url, name, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = '';
    const options = {
        ...BASE_POPUP_OPTIONS,
        width: width.toString(),
        height: height.toString(),
        top,
        left
    };
    // Chrome iOS 7 and 8 is returning an undefined popup win when target is
    // specified, even though the popup is not necessarily blocked.
    const ua = util.getUA().toLowerCase();
    if (name) {
        target = register._isChromeIOS(ua) ? TARGET_BLANK : name;
    }
    if (register._isFirefox(ua)) {
        // Firefox complains when invalid URLs are popped out. Hacky way to bypass.
        url = url || FIREFOX_EMPTY_URL;
        // Firefox disables by default scrolling on popup windows, which can create
        // issues when the user has many Google accounts, for instance.
        options.scrollbars = 'yes';
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, '');
    if (register._isIOSStandalone(ua) && target !== '_self') {
        openAsNewWindowIOS(url || '', target);
        return new AuthPopup(null);
    }
    // about:blank getting sanitized causing browsers like IE/Edge to display
    // brief error message before redirecting to handler.
    const newWin = window.open(url || '', target, optionsString);
    register._assert(newWin, auth, "popup-blocked" /* AuthErrorCode.POPUP_BLOCKED */);
    // Flaky on IE edge, encapsulate with a try and catch.
    try {
        newWin.focus();
    }
    catch (e) { }
    return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
    const el = document.createElement('a');
    el.href = url;
    el.target = target;
    const click = document.createEvent('MouseEvent');
    click.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
}

/**
 * @license
 * Copyright 2021 Google LLC
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
/**
 * URL for Authentication widget which will initiate the OAuth handshake
 *
 * @internal
 */
const WIDGET_PATH = '__/auth/handler';
/**
 * URL for emulated environment
 *
 * @internal
 */
const EMULATOR_WIDGET_PATH = 'emulator/auth/handler';
/**
 * Fragment name for the App Check token that gets passed to the widget
 *
 * @internal
 */
const FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent('fac');
async function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
    register._assert(auth.config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
    register._assert(auth.config.apiKey, auth, "invalid-api-key" /* AuthErrorCode.INVALID_API_KEY */);
    const params = {
        apiKey: auth.config.apiKey,
        appName: auth.name,
        authType,
        redirectUrl,
        v: app.SDK_VERSION,
        eventId
    };
    if (provider instanceof register.FederatedAuthProvider) {
        provider.setDefaultLanguage(auth.languageCode);
        params.providerId = provider.providerId || '';
        if (!util.isEmpty(provider.getCustomParameters())) {
            params.customParameters = JSON.stringify(provider.getCustomParameters());
        }
        // TODO set additionalParams from the provider as well?
        for (const [key, value] of Object.entries(additionalParams || {})) {
            params[key] = value;
        }
    }
    if (provider instanceof register.BaseOAuthProvider) {
        const scopes = provider.getScopes().filter(scope => scope !== '');
        if (scopes.length > 0) {
            params.scopes = scopes.join(',');
        }
    }
    if (auth.tenantId) {
        params.tid = auth.tenantId;
    }
    // TODO: maybe set eid as endpointId
    // TODO: maybe set fw as Frameworks.join(",")
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
        if (paramsDict[key] === undefined) {
            delete paramsDict[key];
        }
    }
    // Sets the App Check token to pass to the widget
    const appCheckToken = await auth._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken
        ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}`
        : '';
    // Start at index 1 to skip the leading '&' in the query string
    return `${getHandlerBase(auth)}?${util.querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
}
function getHandlerBase({ config }) {
    if (!config.emulator) {
        return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return register._emulatorUrl(config, EMULATOR_WIDGET_PATH);
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
/**
 * The special web storage event
 *
 */
const WEB_STORAGE_SUPPORT_KEY = 'webStorageSupport';
class BrowserPopupRedirectResolver {
    constructor() {
        this.eventManagers = {};
        this.iframes = {};
        this.originValidationPromises = {};
        this._redirectPersistence = browserSessionPersistence;
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    async _openPopup(auth, provider, authType, eventId) {
        register.debugAssert(this.eventManagers[auth._key()]?.manager, '_initialize() not called before _openPopup()');
        const url = await _getRedirectUrl(auth, provider, authType, register._getCurrentUrl(), eventId);
        return _open(auth, url, register._generateEventId());
    }
    async _openRedirect(auth, provider, authType, eventId) {
        await this._originValidation(auth);
        const url = await _getRedirectUrl(auth, provider, authType, register._getCurrentUrl(), eventId);
        register._setWindowLocation(url);
        return new Promise(() => { });
    }
    _initialize(auth) {
        const key = auth._key();
        if (this.eventManagers[key]) {
            const { manager, promise } = this.eventManagers[key];
            if (manager) {
                return Promise.resolve(manager);
            }
            else {
                register.debugAssert(promise, 'If manager is not set, promise should be');
                return promise;
            }
        }
        const promise = this.initAndGetManager(auth);
        this.eventManagers[key] = { promise };
        // If the promise is rejected, the key should be removed so that the
        // operation can be retried later.
        promise.catch(() => {
            delete this.eventManagers[key];
        });
        return promise;
    }
    async initAndGetManager(auth) {
        const iframe = await _openIframe(auth);
        const manager = new AuthEventManager(auth);
        iframe.register('authEvent', (iframeEvent) => {
            register._assert(iframeEvent?.authEvent, auth, "invalid-auth-event" /* AuthErrorCode.INVALID_AUTH_EVENT */);
            // TODO: Consider splitting redirect and popup events earlier on
            const handled = manager.onEvent(iframeEvent.authEvent);
            return { status: handled ? "ACK" /* GapiOutcome.ACK */ : "ERROR" /* GapiOutcome.ERROR */ };
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
        this.eventManagers[auth._key()] = { manager };
        this.iframes[auth._key()] = iframe;
        return manager;
    }
    _isIframeWebStorageSupported(auth, cb) {
        const iframe = this.iframes[auth._key()];
        iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, result => {
            const isSupported = result?.[0]?.[WEB_STORAGE_SUPPORT_KEY];
            if (isSupported !== undefined) {
                cb(!!isSupported);
            }
            register._fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth) {
        const key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin$1(auth);
        }
        return this.originValidationPromises[key];
    }
    get _shouldInitProactively() {
        // Mobile browsers and Safari need to optimistically initialize
        return register._isMobileBrowser() || register._isSafari() || register._isIOS();
    }
}
/**
 * An implementation of {@link PopupRedirectResolver} suitable for browser
 * based applications.
 *
 * @remarks
 * This method does not work in a Node.js environment.
 *
 * @public
 */
const browserPopupRedirectResolver = BrowserPopupRedirectResolver;

/**
 * {@inheritdoc PhoneMultiFactorAssertion}
 *
 * @public
 */
class PhoneMultiFactorAssertionImpl extends register.MultiFactorAssertionImpl {
    constructor(credential) {
        super("phone" /* FactorId.PHONE */);
        this.credential = credential;
    }
    /** @internal */
    static _fromCredential(credential) {
        return new PhoneMultiFactorAssertionImpl(credential);
    }
    /** @internal */
    _finalizeEnroll(auth, idToken, displayName) {
        return register.finalizeEnrollPhoneMfa(auth, {
            idToken,
            displayName,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    }
    /** @internal */
    _finalizeSignIn(auth, mfaPendingCredential) {
        return register.finalizeSignInPhoneMfa(auth, {
            mfaPendingCredential,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    }
}
/**
 * Provider for generating a {@link PhoneMultiFactorAssertion}.
 *
 * @public
 */
class PhoneMultiFactorGenerator {
    constructor() { }
    /**
     * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
     *
     * @remarks
     * This method does not work in a Node.js environment.
     *
     * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
     * @returns A {@link PhoneMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}
     */
    static assertion(credential) {
        return PhoneMultiFactorAssertionImpl._fromCredential(credential);
    }
}
/**
 * The identifier of the phone second factor: `phone`.
 */
PhoneMultiFactorGenerator.FACTOR_ID = 'phone';

/**
 * @license
 * Copyright 2021 Google LLC
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
const DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
const authIdTokenMaxAge = util.getExperimentalSetting('authIdTokenMaxAge') || DEFAULT_ID_TOKEN_MAX_AGE;
let lastPostedIdToken = null;
const mintCookieFactory = (url) => async (user) => {
    const idTokenResult = user && (await user.getIdTokenResult());
    const idTokenAge = idTokenResult &&
        (new Date().getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1000;
    if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
        return;
    }
    // Specifically trip null => undefined when logged out, to delete any existing cookie
    const idToken = idTokenResult?.token;
    if (lastPostedIdToken === idToken) {
        return;
    }
    lastPostedIdToken = idToken;
    await fetch(url, {
        method: idToken ? 'POST' : 'DELETE',
        headers: idToken
            ? {
                'Authorization': `Bearer ${idToken}`
            }
            : {}
    });
};
/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
function getAuth(app$1 = app.getApp()) {
    const provider = app._getProvider(app$1, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    const auth = register.initializeAuth(app$1, {
        popupRedirectResolver: browserPopupRedirectResolver,
        persistence: [
            register.indexedDBLocalPersistence,
            browserLocalPersistence,
            browserSessionPersistence
        ]
    });
    const authTokenSyncPath = util.getExperimentalSetting('authTokenSyncURL');
    // Only do the Cookie exchange in a secure context
    if (authTokenSyncPath &&
        typeof isSecureContext === 'boolean' &&
        isSecureContext) {
        // Don't allow urls (XSS possibility), only paths on the same domain
        const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
        if (location.origin === authTokenSyncUrl.origin) {
            const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
            register.beforeAuthStateChanged(auth, mintCookie, () => mintCookie(auth.currentUser));
            register.onIdTokenChanged(auth, user => mintCookie(user));
        }
    }
    const authEmulatorHost = util.getDefaultEmulatorHost('auth');
    if (authEmulatorHost) {
        register.connectAuthEmulator(auth, `http://${authEmulatorHost}`);
    }
    return auth;
}
function getScriptParentElement() {
    return document.getElementsByTagName('head')?.[0] ?? document;
}
register._setExternalJSProvider({
    loadJS(url) {
        // TODO: consider adding timeout support & cancellation
        return new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.setAttribute('src', url);
            el.onload = resolve;
            el.onerror = e => {
                const error = register._createError("internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                error.customData = e;
                reject(error);
            };
            el.type = 'text/javascript';
            el.charset = 'UTF-8';
            getScriptParentElement().appendChild(el);
        });
    },
    gapiScript: 'https://apis.google.com/js/api.js',
    recaptchaV2Script: 'https://www.google.com/recaptcha/api.js',
    recaptchaEnterpriseScript: 'https://www.google.com/recaptcha/enterprise.js?render='
});
register.registerAuth("Browser" /* ClientPlatform.BROWSER */);

/**
 * @license
 * Copyright 2021 Google LLC
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
function _cordovaWindow() {
    return window;
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
/**
 * How long to wait after the app comes back into focus before concluding that
 * the user closed the sign in tab.
 */
const REDIRECT_TIMEOUT_MS = 2000;
/**
 * Generates the URL for the OAuth handler.
 */
async function _generateHandlerUrl(auth, event, provider) {
    // Get the cordova plugins
    const { BuildInfo } = _cordovaWindow();
    register.debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
    const sessionDigest = await computeSha256(event.sessionId);
    const additionalParams = {};
    if (register._isIOS()) {
        // iOS app identifier
        additionalParams['ibi'] = BuildInfo.packageName;
    }
    else if (register._isAndroid()) {
        // Android app identifier
        additionalParams['apn'] = BuildInfo.packageName;
    }
    else {
        register._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    // Add the display name if available
    if (BuildInfo.displayName) {
        additionalParams['appDisplayName'] = BuildInfo.displayName;
    }
    // Attached the hashed session ID
    additionalParams['sessionId'] = sessionDigest;
    return _getRedirectUrl(auth, provider, event.type, undefined, event.eventId ?? undefined, additionalParams);
}
/**
 * Validates that this app is valid for this project configuration
 */
async function _validateOrigin(auth) {
    const { BuildInfo } = _cordovaWindow();
    const request = {};
    if (register._isIOS()) {
        request.iosBundleId = BuildInfo.packageName;
    }
    else if (register._isAndroid()) {
        request.androidPackageName = BuildInfo.packageName;
    }
    else {
        register._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    // Will fail automatically if package name is not authorized
    await _getProjectConfig(auth, request);
}
function _performRedirect(handlerUrl) {
    // Get the cordova plugins
    const { cordova } = _cordovaWindow();
    return new Promise(resolve => {
        cordova.plugins.browsertab.isAvailable(browserTabIsAvailable => {
            let iabRef = null;
            if (browserTabIsAvailable) {
                cordova.plugins.browsertab.openUrl(handlerUrl);
            }
            else {
                // TODO: Return the inappbrowser ref that's returned from the open call
                iabRef = cordova.InAppBrowser.open(handlerUrl, register._isIOS7Or8() ? '_blank' : '_system', 'location=yes');
            }
            resolve(iabRef);
        });
    });
}
/**
 * This function waits for app activity to be seen before resolving. It does
 * this by attaching listeners to various dom events. Once the app is determined
 * to be visible, this promise resolves. AFTER that resolution, the listeners
 * are detached and any browser tabs left open will be closed.
 */
async function _waitForAppResume(auth, eventListener, iabRef) {
    // Get the cordova plugins
    const { cordova } = _cordovaWindow();
    let cleanup = () => { };
    try {
        await new Promise((resolve, reject) => {
            let onCloseTimer = null;
            // DEFINE ALL THE CALLBACKS =====
            function authEventSeen() {
                // Auth event was detected. Resolve this promise and close the extra
                // window if it's still open.
                resolve();
                const closeBrowserTab = cordova.plugins.browsertab?.close;
                if (typeof closeBrowserTab === 'function') {
                    closeBrowserTab();
                }
                // Close inappbrowser embedded webview in iOS7 and 8 case if still
                // open.
                if (typeof iabRef?.close === 'function') {
                    iabRef.close();
                }
            }
            function resumed() {
                if (onCloseTimer) {
                    // This code already ran; do not rerun.
                    return;
                }
                onCloseTimer = window.setTimeout(() => {
                    // Wait two seconds after resume then reject.
                    reject(register._createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
                }, REDIRECT_TIMEOUT_MS);
            }
            function visibilityChanged() {
                if (document?.visibilityState === 'visible') {
                    resumed();
                }
            }
            // ATTACH ALL THE LISTENERS =====
            // Listen for the auth event
            eventListener.addPassiveListener(authEventSeen);
            // Listen for resume and visibility events
            document.addEventListener('resume', resumed, false);
            if (register._isAndroid()) {
                document.addEventListener('visibilitychange', visibilityChanged, false);
            }
            // SETUP THE CLEANUP FUNCTION =====
            cleanup = () => {
                eventListener.removePassiveListener(authEventSeen);
                document.removeEventListener('resume', resumed, false);
                document.removeEventListener('visibilitychange', visibilityChanged, false);
                if (onCloseTimer) {
                    window.clearTimeout(onCloseTimer);
                }
            };
        });
    }
    finally {
        cleanup();
    }
}
/**
 * Checks the configuration of the Cordova environment. This has no side effect
 * if the configuration is correct; otherwise it throws an error with the
 * missing plugin.
 */
function _checkCordovaConfiguration(auth) {
    const win = _cordovaWindow();
    // Check all dependencies installed.
    // https://github.com/nordnet/cordova-universal-links-plugin
    // Note that cordova-universal-links-plugin has been abandoned.
    // A fork with latest fixes is available at:
    // https://www.npmjs.com/package/cordova-universal-links-plugin-fix
    register._assert(typeof win?.universalLinks?.subscribe === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    register._assert(typeof win?.BuildInfo?.packageName !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    register._assert(typeof win?.cordova?.plugins?.browsertab?.openUrl === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    register._assert(typeof win?.cordova?.plugins?.browsertab?.isAvailable === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    register._assert(typeof win?.cordova?.InAppBrowser?.open === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-inappbrowser'
    });
}
/**
 * Computes the SHA-256 of a session ID. The SubtleCrypto interface is only
 * available in "secure" contexts, which covers Cordova (which is served on a file
 * protocol).
 */
async function computeSha256(sessionId) {
    const bytes = stringToArrayBuffer(sessionId);
    // TODO: For IE11 crypto has a different name and this operation comes back
    //       as an object, not a promise. This is the old proposed standard that
    //       is used by IE11:
    // https://www.w3.org/TR/2013/WD-WebCryptoAPI-20130108/#cryptooperation-interface
    const buf = await crypto.subtle.digest('SHA-256', bytes);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map(num => num.toString(16).padStart(2, '0')).join('');
}
function stringToArrayBuffer(str) {
    // This function is only meant to deal with an ASCII charset and makes
    // certain simplifying assumptions.
    register.debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }
    const buff = new ArrayBuffer(str.length);
    const view = new Uint8Array(buff);
    for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i);
    }
    return view;
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
const SESSION_ID_LENGTH = 20;
/** Custom AuthEventManager that adds passive listeners to events */
class CordovaAuthEventManager extends AuthEventManager {
    constructor() {
        super(...arguments);
        this.passiveListeners = new Set();
        this.initPromise = new Promise(resolve => {
            this.resolveInitialized = resolve;
        });
    }
    addPassiveListener(cb) {
        this.passiveListeners.add(cb);
    }
    removePassiveListener(cb) {
        this.passiveListeners.delete(cb);
    }
    // In a Cordova environment, this manager can live through multiple redirect
    // operations
    resetRedirect() {
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
    }
    /** Override the onEvent method */
    onEvent(event) {
        this.resolveInitialized();
        this.passiveListeners.forEach(cb => cb(event));
        return super.onEvent(event);
    }
    async initialized() {
        await this.initPromise;
    }
}
/**
 * Generates a (partial) {@link AuthEvent}.
 */
function _generateNewEvent(auth, type, eventId = null) {
    return {
        type,
        eventId,
        urlResponse: null,
        sessionId: generateSessionId(),
        postBody: null,
        tenantId: auth.tenantId,
        error: register._createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}
function _savePartialEvent(auth, event) {
    return storage()._set(persistenceKey(auth), event);
}
async function _getAndRemoveEvent(auth) {
    const event = (await storage()._get(persistenceKey(auth)));
    if (event) {
        await storage()._remove(persistenceKey(auth));
    }
    return event;
}
function _eventFromPartialAndUrl(partialEvent, url) {
    // Parse the deep link within the dynamic link URL.
    const callbackUrl = _getDeepLinkFromCallback(url);
    // Confirm it is actually a callback URL.
    // Currently the universal link will be of this format:
    // https://<AUTH_DOMAIN>/__/auth/callback<OAUTH_RESPONSE>
    // This is a fake URL but is not intended to take the user anywhere
    // and just redirect to the app.
    if (callbackUrl.includes('/__/auth/callback')) {
        // Check if there is an error in the URL.
        // This mechanism is also used to pass errors back to the app:
        // https://<AUTH_DOMAIN>/__/auth/callback?firebaseError=<STRINGIFIED_ERROR>
        const params = searchParamsOrEmpty(callbackUrl);
        // Get the error object corresponding to the stringified error if found.
        const errorObject = params['firebaseError']
            ? parseJsonOrNull(decodeURIComponent(params['firebaseError']))
            : null;
        const code = errorObject?.['code']?.split('auth/')?.[1];
        const error = code ? register._createError(code) : null;
        if (error) {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                error,
                urlResponse: null,
                sessionId: null,
                postBody: null
            };
        }
        else {
            return {
                type: partialEvent.type,
                eventId: partialEvent.eventId,
                tenantId: partialEvent.tenantId,
                sessionId: partialEvent.sessionId,
                urlResponse: callbackUrl,
                postBody: null
            };
        }
    }
    return null;
}
function generateSessionId() {
    const chars = [];
    const allowedChars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < SESSION_ID_LENGTH; i++) {
        const idx = Math.floor(Math.random() * allowedChars.length);
        chars.push(allowedChars.charAt(idx));
    }
    return chars.join('');
}
function storage() {
    return register._getInstance(browserLocalPersistence);
}
function persistenceKey(auth) {
    return register._persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
}
function parseJsonOrNull(json) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return null;
    }
}
// Exported for testing
function _getDeepLinkFromCallback(url) {
    const params = searchParamsOrEmpty(url);
    const link = params['link'] ? decodeURIComponent(params['link']) : undefined;
    // Double link case (automatic redirect)
    const doubleDeepLink = searchParamsOrEmpty(link)['link'];
    // iOS custom scheme links.
    const iOSDeepLink = params['deep_link_id']
        ? decodeURIComponent(params['deep_link_id'])
        : undefined;
    const iOSDoubleDeepLink = searchParamsOrEmpty(iOSDeepLink)['link'];
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
/**
 * Optimistically tries to get search params from a string, or else returns an
 * empty search params object.
 */
function searchParamsOrEmpty(url) {
    if (!url?.includes('?')) {
        return {};
    }
    const [_, ...rest] = url.split('?');
    return util.querystringDecode(rest.join('?'));
}

/**
 * @license
 * Copyright 2021 Google LLC
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
/**
 * How long to wait for the initial auth event before concluding no
 * redirect pending
 */
const INITIAL_EVENT_TIMEOUT_MS = 500;
class CordovaPopupRedirectResolver {
    constructor() {
        this._redirectPersistence = browserSessionPersistence;
        this._shouldInitProactively = true; // This is lightweight for Cordova
        this.eventManagers = new Map();
        this.originValidationPromises = {};
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    async _initialize(auth) {
        const key = auth._key();
        let manager = this.eventManagers.get(key);
        if (!manager) {
            manager = new CordovaAuthEventManager(auth);
            this.eventManagers.set(key, manager);
            this.attachCallbackListeners(auth, manager);
        }
        return manager;
    }
    _openPopup(auth) {
        register._fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    async _openRedirect(auth, provider, authType, eventId) {
        _checkCordovaConfiguration(auth);
        const manager = await this._initialize(auth);
        await manager.initialized();
        // Reset the persisted redirect states. This does not matter on Web where
        // the redirect always blows away application state entirely. On Cordova,
        // the app maintains control flow through the redirect.
        manager.resetRedirect();
        _clearRedirectOutcomes();
        await this._originValidation(auth);
        const event = _generateNewEvent(auth, authType, eventId);
        await _savePartialEvent(auth, event);
        const url = await _generateHandlerUrl(auth, event, provider);
        const iabRef = await _performRedirect(url);
        return _waitForAppResume(auth, manager, iabRef);
    }
    _isIframeWebStorageSupported(_auth, _cb) {
        throw new Error('Method not implemented.');
    }
    _originValidation(auth) {
        const key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    }
    attachCallbackListeners(auth, manager) {
        // Get the global plugins
        const { universalLinks, handleOpenURL, BuildInfo } = _cordovaWindow();
        const noEventTimeout = setTimeout(async () => {
            // We didn't see that initial event. Clear any pending object and
            // dispatch no event
            await _getAndRemoveEvent(auth);
            manager.onEvent(generateNoEvent());
        }, INITIAL_EVENT_TIMEOUT_MS);
        const universalLinksCb = async (eventData) => {
            // We have an event so we can clear the no event timeout
            clearTimeout(noEventTimeout);
            const partialEvent = await _getAndRemoveEvent(auth);
            let finalEvent = null;
            if (partialEvent && eventData?.['url']) {
                finalEvent = _eventFromPartialAndUrl(partialEvent, eventData['url']);
            }
            // If finalEvent is never filled, trigger with no event
            manager.onEvent(finalEvent || generateNoEvent());
        };
        // Universal links subscriber doesn't exist for iOS, so we need to check
        if (typeof universalLinks !== 'undefined' &&
            typeof universalLinks.subscribe === 'function') {
            universalLinks.subscribe(null, universalLinksCb);
        }
        // iOS 7 or 8 custom URL schemes.
        // This is also the current default behavior for iOS 9+.
        // For this to work, cordova-plugin-customurlscheme needs to be installed.
        // https://github.com/EddyVerbruggen/Custom-URL-scheme
        // Do not overwrite the existing developer's URL handler.
        const existingHandleOpenURL = handleOpenURL;
        const packagePrefix = `${BuildInfo.packageName.toLowerCase()}://`;
        _cordovaWindow().handleOpenURL = async (url) => {
            if (url.toLowerCase().startsWith(packagePrefix)) {
                // We want this intentionally to float
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                universalLinksCb({ url });
            }
            // Call the developer's handler if it is present.
            if (typeof existingHandleOpenURL === 'function') {
                try {
                    existingHandleOpenURL(url);
                }
                catch (e) {
                    // This is a developer error. Don't stop the flow of the SDK.
                    console.error(e);
                }
            }
        };
    }
}
/**
 * An implementation of {@link PopupRedirectResolver} suitable for Cordova
 * based applications.
 *
 * @public
 */
const cordovaPopupRedirectResolver = CordovaPopupRedirectResolver;
function generateNoEvent() {
    return {
        type: "unknown" /* AuthEventType.UNKNOWN */,
        eventId: null,
        sessionId: null,
        urlResponse: null,
        postBody: null,
        tenantId: null,
        error: register._createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
    };
}

/**
 * @license
 * Copyright 2017 Google LLC
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
// This function should only be called by frameworks (e.g. FirebaseUI-web) to log their usage.
// It is not intended for direct use by developer apps. NO jsdoc here to intentionally leave it out
// of autogenerated documentation pages to reduce accidental misuse.
function addFrameworkForLogging(auth, framework) {
    register._castAuth(auth)._logFramework(framework);
}

exports.ActionCodeURL = register.ActionCodeURL;
exports.AuthCredential = register.AuthCredential;
exports.AuthErrorCodes = register.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY;
exports.AuthImpl = register.AuthImpl;
exports.EmailAuthCredential = register.EmailAuthCredential;
exports.EmailAuthProvider = register.EmailAuthProvider;
exports.FacebookAuthProvider = register.FacebookAuthProvider;
exports.FetchProvider = register.FetchProvider;
exports.GithubAuthProvider = register.GithubAuthProvider;
exports.GoogleAuthProvider = register.GoogleAuthProvider;
exports.OAuthCredential = register.OAuthCredential;
exports.OAuthProvider = register.OAuthProvider;
exports.PhoneAuthCredential = register.PhoneAuthCredential;
exports.SAMLAuthCredential = register.SAMLAuthCredential;
exports.SAMLAuthProvider = register.SAMLAuthProvider;
exports.TotpMultiFactorGenerator = register.TotpMultiFactorGenerator;
exports.TotpSecret = register.TotpSecret;
exports.TwitterAuthProvider = register.TwitterAuthProvider;
exports.UserImpl = register.UserImpl;
exports._assert = register._assert;
exports._castAuth = register._castAuth;
exports._fail = register._fail;
exports._generateEventId = register._generateEventId;
exports._getClientVersion = register._getClientVersion;
exports._getInstance = register._getInstance;
exports._persistenceKeyName = register._persistenceKeyName;
exports.applyActionCode = register.applyActionCode;
exports.beforeAuthStateChanged = register.beforeAuthStateChanged;
exports.checkActionCode = register.checkActionCode;
exports.confirmPasswordReset = register.confirmPasswordReset;
exports.connectAuthEmulator = register.connectAuthEmulator;
exports.createUserWithEmailAndPassword = register.createUserWithEmailAndPassword;
exports.debugErrorMap = register.debugErrorMap;
exports.deleteUser = register.deleteUser;
exports.fetchSignInMethodsForEmail = register.fetchSignInMethodsForEmail;
exports.getAdditionalUserInfo = register.getAdditionalUserInfo;
exports.getIdToken = register.getIdToken;
exports.getIdTokenResult = register.getIdTokenResult;
exports.getMultiFactorResolver = register.getMultiFactorResolver;
exports.inMemoryPersistence = register.inMemoryPersistence;
exports.indexedDBLocalPersistence = register.indexedDBLocalPersistence;
exports.initializeAuth = register.initializeAuth;
exports.initializeRecaptchaConfig = register.initializeRecaptchaConfig;
exports.isSignInWithEmailLink = register.isSignInWithEmailLink;
exports.linkWithCredential = register.linkWithCredential;
exports.multiFactor = register.multiFactor;
exports.onAuthStateChanged = register.onAuthStateChanged;
exports.onIdTokenChanged = register.onIdTokenChanged;
exports.parseActionCodeURL = register.parseActionCodeURL;
exports.prodErrorMap = register.prodErrorMap;
exports.reauthenticateWithCredential = register.reauthenticateWithCredential;
exports.reload = register.reload;
exports.revokeAccessToken = register.revokeAccessToken;
exports.sendEmailVerification = register.sendEmailVerification;
exports.sendPasswordResetEmail = register.sendPasswordResetEmail;
exports.sendSignInLinkToEmail = register.sendSignInLinkToEmail;
exports.setPersistence = register.setPersistence;
exports.signInAnonymously = register.signInAnonymously;
exports.signInWithCredential = register.signInWithCredential;
exports.signInWithCustomToken = register.signInWithCustomToken;
exports.signInWithEmailAndPassword = register.signInWithEmailAndPassword;
exports.signInWithEmailLink = register.signInWithEmailLink;
exports.signOut = register.signOut;
exports.unlink = register.unlink;
exports.updateCurrentUser = register.updateCurrentUser;
exports.updateEmail = register.updateEmail;
exports.updatePassword = register.updatePassword;
exports.updateProfile = register.updateProfile;
exports.useDeviceLanguage = register.useDeviceLanguage;
exports.validatePassword = register.validatePassword;
exports.verifyBeforeUpdateEmail = register.verifyBeforeUpdateEmail;
exports.verifyPasswordResetCode = register.verifyPasswordResetCode;
exports.ActionCodeOperation = ActionCodeOperation;
exports.AuthPopup = AuthPopup;
exports.FactorId = FactorId;
exports.OperationType = OperationType;
exports.PhoneAuthProvider = PhoneAuthProvider;
exports.PhoneMultiFactorGenerator = PhoneMultiFactorGenerator;
exports.ProviderId = ProviderId;
exports.RecaptchaVerifier = RecaptchaVerifier;
exports.SignInMethod = SignInMethod;
exports._getRedirectResult = _getRedirectResult;
exports._overrideRedirectResult = _overrideRedirectResult;
exports.addFrameworkForLogging = addFrameworkForLogging;
exports.browserCookiePersistence = browserCookiePersistence;
exports.browserLocalPersistence = browserLocalPersistence;
exports.browserPopupRedirectResolver = browserPopupRedirectResolver;
exports.browserSessionPersistence = browserSessionPersistence;
exports.cordovaPopupRedirectResolver = cordovaPopupRedirectResolver;
exports.getAuth = getAuth;
exports.getRedirectResult = getRedirectResult;
exports.linkWithPhoneNumber = linkWithPhoneNumber;
exports.linkWithPopup = linkWithPopup;
exports.linkWithRedirect = linkWithRedirect;
exports.reauthenticateWithPhoneNumber = reauthenticateWithPhoneNumber;
exports.reauthenticateWithPopup = reauthenticateWithPopup;
exports.reauthenticateWithRedirect = reauthenticateWithRedirect;
exports.signInWithPhoneNumber = signInWithPhoneNumber;
exports.signInWithPopup = signInWithPopup;
exports.signInWithRedirect = signInWithRedirect;
exports.updatePhoneNumber = updatePhoneNumber;
//# sourceMappingURL=internal.js.map
