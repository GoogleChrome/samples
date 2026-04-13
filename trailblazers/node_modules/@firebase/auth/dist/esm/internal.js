import { av as debugAssert, aw as _isIOS, ax as _isAndroid, ay as _fail, az as _getRedirectUrl, aA as _getProjectConfig, aB as _isIOS7Or8, aC as _createError, aD as _assert, aE as AuthEventManager, aF as _getInstance, b as browserLocalPersistence, aG as _persistenceKeyName, c as browserSessionPersistence, aH as _getRedirectResult, aI as _overrideRedirectResult, aJ as _clearRedirectOutcomes, aK as _castAuth } from './index-dfb5c973.js';
export { A as ActionCodeOperation, aj as ActionCodeURL, M as AuthCredential, J as AuthErrorCodes, aM as AuthImpl, aP as AuthPopup, N as EmailAuthCredential, W as EmailAuthProvider, X as FacebookAuthProvider, F as FactorId, aQ as FetchProvider, Z as GithubAuthProvider, Y as GoogleAuthProvider, Q as OAuthCredential, _ as OAuthProvider, O as OperationType, U as PhoneAuthCredential, P as PhoneAuthProvider, n as PhoneMultiFactorGenerator, q as ProviderId, R as RecaptchaVerifier, aR as SAMLAuthCredential, $ as SAMLAuthProvider, S as SignInMethod, T as TotpMultiFactorGenerator, o as TotpSecret, a0 as TwitterAuthProvider, aL as UserImpl, aD as _assert, aK as _castAuth, ay as _fail, aO as _generateEventId, aN as _getClientVersion, aF as _getInstance, aH as _getRedirectResult, aI as _overrideRedirectResult, aG as _persistenceKeyName, a8 as applyActionCode, y as beforeAuthStateChanged, a as browserCookiePersistence, b as browserLocalPersistence, m as browserPopupRedirectResolver, c as browserSessionPersistence, a9 as checkActionCode, a7 as confirmPasswordReset, L as connectAuthEmulator, ab as createUserWithEmailAndPassword, H as debugErrorMap, G as deleteUser, ag as fetchSignInMethodsForEmail, ar as getAdditionalUserInfo, p as getAuth, ao as getIdToken, ap as getIdTokenResult, at as getMultiFactorResolver, k as getRedirectResult, V as inMemoryPersistence, i as indexedDBLocalPersistence, K as initializeAuth, v as initializeRecaptchaConfig, ae as isSignInWithEmailLink, a3 as linkWithCredential, l as linkWithPhoneNumber, e as linkWithPopup, h as linkWithRedirect, au as multiFactor, z as onAuthStateChanged, x as onIdTokenChanged, ak as parseActionCodeURL, I as prodErrorMap, a4 as reauthenticateWithCredential, r as reauthenticateWithPhoneNumber, f as reauthenticateWithPopup, j as reauthenticateWithRedirect, as as reload, E as revokeAccessToken, ah as sendEmailVerification, a6 as sendPasswordResetEmail, ad as sendSignInLinkToEmail, t as setPersistence, a1 as signInAnonymously, a2 as signInWithCredential, a5 as signInWithCustomToken, ac as signInWithEmailAndPassword, af as signInWithEmailLink, s as signInWithPhoneNumber, d as signInWithPopup, g as signInWithRedirect, D as signOut, aq as unlink, C as updateCurrentUser, am as updateEmail, an as updatePassword, u as updatePhoneNumber, al as updateProfile, B as useDeviceLanguage, w as validatePassword, ai as verifyBeforeUpdateEmail, aa as verifyPasswordResetCode } from './index-dfb5c973.js';
import { querystringDecode } from '@firebase/util';
import '@firebase/app';
import '@firebase/logger';
import '@firebase/component';

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
    debugAssert(event.sessionId, 'AuthEvent did not contain a session ID');
    const sessionDigest = await computeSha256(event.sessionId);
    const additionalParams = {};
    if (_isIOS()) {
        // iOS app identifier
        additionalParams['ibi'] = BuildInfo.packageName;
    }
    else if (_isAndroid()) {
        // Android app identifier
        additionalParams['apn'] = BuildInfo.packageName;
    }
    else {
        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
    if (_isIOS()) {
        request.iosBundleId = BuildInfo.packageName;
    }
    else if (_isAndroid()) {
        request.androidPackageName = BuildInfo.packageName;
    }
    else {
        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
                iabRef = cordova.InAppBrowser.open(handlerUrl, _isIOS7Or8() ? '_blank' : '_system', 'location=yes');
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
                    reject(_createError(auth, "redirect-cancelled-by-user" /* AuthErrorCode.REDIRECT_CANCELLED_BY_USER */));
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
            if (_isAndroid()) {
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
    _assert(typeof win?.universalLinks?.subscribe === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-universal-links-plugin-fix'
    });
    // https://www.npmjs.com/package/cordova-plugin-buildinfo
    _assert(typeof win?.BuildInfo?.packageName !== 'undefined', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-buildInfo'
    });
    // https://github.com/google/cordova-plugin-browsertab
    _assert(typeof win?.cordova?.plugins?.browsertab?.openUrl === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    _assert(typeof win?.cordova?.plugins?.browsertab?.isAvailable === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
        missingPlugin: 'cordova-plugin-browsertab'
    });
    // https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
    _assert(typeof win?.cordova?.InAppBrowser?.open === 'function', auth, "invalid-cordova-configuration" /* AuthErrorCode.INVALID_CORDOVA_CONFIGURATION */, {
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
    debugAssert(/[0-9a-zA-Z]+/.test(str), 'Can only convert alpha-numeric strings');
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
        error: _createError(auth, "no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
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
        const error = code ? _createError(code) : null;
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
    return _getInstance(browserLocalPersistence);
}
function persistenceKey(auth) {
    return _persistenceKeyName("authEvent" /* KeyName.AUTH_EVENT */, auth.config.apiKey, auth.name);
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
    return querystringDecode(rest.join('?'));
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
        _fail(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
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
        error: _createError("no-auth-event" /* AuthErrorCode.NO_AUTH_EVENT */)
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
    _castAuth(auth)._logFramework(framework);
}

export { addFrameworkForLogging, cordovaPopupRedirectResolver };
//# sourceMappingURL=internal.js.map
