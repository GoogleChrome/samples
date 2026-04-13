import { ai as _performApiRequest, aj as _addTidIfNecessary, ak as Delay, al as _window, am as _assert, an as isV2, ao as _createError, ap as _recaptchaV2ScriptUrl, aq as _loadJS, ar as MockReCaptcha, as as _generateCallbackName, at as _castAuth, au as _isHttpOrHttps, av as _isWorker, aw as getRecaptchaParams, ax as _serverAppCurrentUserOperationNotSupportedError, M as signInWithCredential, ay as _assertLinkedStatus, N as linkWithCredential, Q as reauthenticateWithCredential, az as _initializeRecaptchaConfig, aA as FAKE_TOKEN, aB as startEnrollPhoneMfa, aC as handleRecaptchaFlow, aD as sendPhoneVerificationCode, aE as _link, B as PhoneAuthCredential, aF as _assertInstanceOf, aG as _withDefaultResolver, aH as AbstractPopupRedirectOperation, aI as debugAssert, aJ as _generateEventId, aK as FederatedAuthProvider, aL as _getProjectConfig, aM as _fail, aN as _getCurrentUrl, aO as _gapiScriptUrl, aP as _emulatorUrl, aQ as _isChromeIOS, aR as _isFirefox, aS as _isIOSStandalone, f as browserSessionPersistence, aT as _getRedirectResult, aU as _overrideRedirectResult, aV as _getRedirectUrl, aW as _setWindowLocation, aX as _isMobileBrowser, aY as _isSafari, aZ as _isIOS, a_ as AuthEventManager, a$ as debugFail, b0 as finalizeEnrollPhoneMfa, b1 as startEnrollTotpMfa, b2 as finalizeEnrollTotpMfa, r as registerAuth, i as initializeAuth, c as indexedDBLocalPersistence, e as browserLocalPersistence, j as beforeAuthStateChanged, o as onIdTokenChanged, x as connectAuthEmulator, b3 as _setExternalJSProvider } from './popup_redirect-5ec7b405.js';
export { A as ActionCodeOperation, a6 as ActionCodeURL, y as AuthCredential, w as AuthErrorCodes, b7 as AuthImpl, E as EmailAuthCredential, D as EmailAuthProvider, G as FacebookAuthProvider, F as FactorId, b9 as FetchProvider, I as GithubAuthProvider, H as GoogleAuthProvider, z as OAuthCredential, J as OAuthProvider, O as OperationType, B as PhoneAuthCredential, P as ProviderId, ba as SAMLAuthCredential, K as SAMLAuthProvider, S as SignInMethod, T as TwitterAuthProvider, b5 as UserImpl, am as _assert, at as _castAuth, aM as _fail, aJ as _generateEventId, b8 as _getClientVersion, b6 as _getInstance, aT as _getRedirectResult, aU as _overrideRedirectResult, b4 as _persistenceKeyName, W as applyActionCode, j as beforeAuthStateChanged, e as browserLocalPersistence, f as browserSessionPersistence, X as checkActionCode, V as confirmPasswordReset, x as connectAuthEmulator, d as cordovaPopupRedirectResolver, Z as createUserWithEmailAndPassword, q as debugErrorMap, p as deleteUser, a3 as fetchSignInMethodsForEmail, ae as getAdditionalUserInfo, ab as getIdToken, ac as getIdTokenResult, ag as getMultiFactorResolver, g as getRedirectResult, C as inMemoryPersistence, c as indexedDBLocalPersistence, i as initializeAuth, h as initializeRecaptchaConfig, a1 as isSignInWithEmailLink, N as linkWithCredential, bc as linkWithRedirect, ah as multiFactor, k as onAuthStateChanged, o as onIdTokenChanged, a7 as parseActionCodeURL, t as prodErrorMap, Q as reauthenticateWithCredential, bd as reauthenticateWithRedirect, af as reload, n as revokeAccessToken, a4 as sendEmailVerification, U as sendPasswordResetEmail, a0 as sendSignInLinkToEmail, s as setPersistence, L as signInAnonymously, M as signInWithCredential, R as signInWithCustomToken, $ as signInWithEmailAndPassword, a2 as signInWithEmailLink, bb as signInWithRedirect, m as signOut, ad as unlink, l as updateCurrentUser, a9 as updateEmail, aa as updatePassword, a8 as updateProfile, u as useDeviceLanguage, v as validatePassword, a5 as verifyBeforeUpdateEmail, Y as verifyPasswordResetCode } from './popup_redirect-5ec7b405.js';
import { querystring, getModularInstance, getUA, getExperimentalSetting, getDefaultEmulatorHost } from '@firebase/util';
import { _isFirebaseServerApp, SDK_VERSION, _getProvider, getApp } from '@firebase/app';
import '@firebase/component';
import '@firebase/logger';

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
function startSignInPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaSignIn:start" /* Endpoint.START_MFA_SIGN_IN */, _addTidIfNecessary(auth, request));
}
function finalizeSignInPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaSignIn:finalize" /* Endpoint.FINALIZE_MFA_SIGN_IN */, _addTidIfNecessary(auth, request));
}
function finalizeSignInTotpMfa(auth, request) {
    return _performApiRequest(auth, "POST" /* HttpMethod.POST */, "/v2/accounts/mfaSignIn:finalize" /* Endpoint.FINALIZE_MFA_SIGN_IN */, _addTidIfNecessary(auth, request));
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
// ReCaptcha will load using the same callback, so the callback function needs
// to be kept around
const _JSLOAD_CALLBACK = _generateCallbackName('rcb');
const NETWORK_TIMEOUT_DELAY = new Delay(30000, 60000);
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
        this.librarySeparatelyLoaded = !!_window().grecaptcha?.render;
    }
    load(auth, hl = '') {
        _assert(isHostLanguageValid(hl), auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        if (this.shouldResolveImmediately(hl) && isV2(_window().grecaptcha)) {
            return Promise.resolve(_window().grecaptcha);
        }
        return new Promise((resolve, reject) => {
            const networkTimeout = _window().setTimeout(() => {
                reject(_createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
            }, NETWORK_TIMEOUT_DELAY.get());
            _window()[_JSLOAD_CALLBACK] = () => {
                _window().clearTimeout(networkTimeout);
                delete _window()[_JSLOAD_CALLBACK];
                const recaptcha = _window().grecaptcha;
                if (!recaptcha || !isV2(recaptcha)) {
                    reject(_createError(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */));
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
            const url = `${_recaptchaV2ScriptUrl()}?${querystring({
                onload: _JSLOAD_CALLBACK,
                render: 'explicit',
                hl
            })}`;
            _loadJS(url).catch(() => {
                clearTimeout(networkTimeout);
                reject(_createError(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */));
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
        return (!!_window().grecaptcha?.render &&
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
        return new MockReCaptcha(auth);
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
        this.auth = _castAuth(authExtern);
        this.isInvisible = this.parameters.size === 'invisible';
        _assert(typeof document !== 'undefined', this.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
        const container = typeof containerOrId === 'string'
            ? document.getElementById(containerOrId)
            : containerOrId;
        _assert(container, this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
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
        _assert(!this.parameters.sitekey, this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        _assert(this.isInvisible || !this.container.hasChildNodes(), this.auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        _assert(typeof document !== 'undefined', this.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */);
    }
    makeTokenCallback(existing) {
        return token => {
            this.tokenChangeListeners.forEach(listener => listener(token));
            if (typeof existing === 'function') {
                existing(token);
            }
            else if (typeof existing === 'string') {
                const globalFunc = _window()[existing];
                if (typeof globalFunc === 'function') {
                    globalFunc(token);
                }
            }
        };
    }
    assertNotDestroyed() {
        _assert(!this.destroyed, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
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
        _assert(_isHttpOrHttps() && !_isWorker(), this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        await domReady();
        this.recaptcha = await this._recaptchaLoader.load(this.auth, this.auth.languageCode || undefined);
        const siteKey = await getRecaptchaParams(this.auth);
        _assert(siteKey, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        this.parameters.sitekey = siteKey;
    }
    getAssertedRecaptcha() {
        _assert(this.recaptcha, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
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
        const authCredential = PhoneAuthCredential._fromVerification(this.verificationId, verificationCode);
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
    if (_isFirebaseServerApp(auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth));
    }
    const authInternal = _castAuth(auth);
    const verificationId = await _verifyPhoneNumber(authInternal, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, cred => signInWithCredential(authInternal, cred));
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
    const userInternal = getModularInstance(user);
    await _assertLinkedStatus(false, userInternal, "phone" /* ProviderId.PHONE */);
    const verificationId = await _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, cred => linkWithCredential(userInternal, cred));
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
    const userInternal = getModularInstance(user);
    if (_isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(userInternal.auth));
    }
    const verificationId = await _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, cred => reauthenticateWithCredential(userInternal, cred));
}
/**
 * Returns a verification ID to be used in conjunction with the SMS code that is sent.
 *
 */
async function _verifyPhoneNumber(auth, options, verifier) {
    if (!auth._getRecaptchaConfig()) {
        try {
            await _initializeRecaptchaConfig(auth);
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
                _assert(session.type === "enroll" /* MultiFactorSessionType.ENROLL */, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                const startPhoneMfaEnrollmentRequest = {
                    idToken: session.credential,
                    phoneEnrollmentInfo: {
                        phoneNumber: phoneInfoOptions.phoneNumber,
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    }
                };
                const startEnrollPhoneMfaActionCallback = async (authInstance, request) => {
                    // If reCAPTCHA Enterprise token is FAKE_TOKEN, fetch reCAPTCHA v2 token and inject into request.
                    if (request.phoneEnrollmentInfo.captchaResponse === FAKE_TOKEN) {
                        _assert(verifier?.type === RECAPTCHA_VERIFIER_TYPE, authInstance, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                        const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
                        return startEnrollPhoneMfa(authInstance, requestWithRecaptchaV2);
                    }
                    return startEnrollPhoneMfa(authInstance, request);
                };
                const startPhoneMfaEnrollmentResponse = handleRecaptchaFlow(auth, startPhoneMfaEnrollmentRequest, "mfaSmsEnrollment" /* RecaptchaActionName.MFA_SMS_ENROLLMENT */, startEnrollPhoneMfaActionCallback, "PHONE_PROVIDER" /* RecaptchaAuthProvider.PHONE_PROVIDER */);
                const response = await startPhoneMfaEnrollmentResponse.catch(error => {
                    return Promise.reject(error);
                });
                return response.phoneSessionInfo.sessionInfo;
            }
            else {
                _assert(session.type === "signin" /* MultiFactorSessionType.SIGN_IN */, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
                const mfaEnrollmentId = phoneInfoOptions.multiFactorHint?.uid ||
                    phoneInfoOptions.multiFactorUid;
                _assert(mfaEnrollmentId, auth, "missing-multi-factor-info" /* AuthErrorCode.MISSING_MFA_INFO */);
                const startPhoneMfaSignInRequest = {
                    mfaPendingCredential: session.credential,
                    mfaEnrollmentId,
                    phoneSignInInfo: {
                        clientType: "CLIENT_TYPE_WEB" /* RecaptchaClientType.WEB */
                    }
                };
                const startSignInPhoneMfaActionCallback = async (authInstance, request) => {
                    // If reCAPTCHA Enterprise token is FAKE_TOKEN, fetch reCAPTCHA v2 token and inject into request.
                    if (request.phoneSignInInfo.captchaResponse === FAKE_TOKEN) {
                        _assert(verifier?.type === RECAPTCHA_VERIFIER_TYPE, authInstance, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                        const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
                        return startSignInPhoneMfa(authInstance, requestWithRecaptchaV2);
                    }
                    return startSignInPhoneMfa(authInstance, request);
                };
                const startPhoneMfaSignInResponse = handleRecaptchaFlow(auth, startPhoneMfaSignInRequest, "mfaSmsSignIn" /* RecaptchaActionName.MFA_SMS_SIGNIN */, startSignInPhoneMfaActionCallback, "PHONE_PROVIDER" /* RecaptchaAuthProvider.PHONE_PROVIDER */);
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
                if (request.captchaResponse === FAKE_TOKEN) {
                    _assert(verifier?.type === RECAPTCHA_VERIFIER_TYPE, authInstance, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
                    const requestWithRecaptchaV2 = await injectRecaptchaV2Token(authInstance, request, verifier);
                    return sendPhoneVerificationCode(authInstance, requestWithRecaptchaV2);
                }
                return sendPhoneVerificationCode(authInstance, request);
            };
            const sendPhoneVerificationCodeResponse = handleRecaptchaFlow(auth, sendPhoneVerificationCodeRequest, "sendVerificationCode" /* RecaptchaActionName.SEND_VERIFICATION_CODE */, sendPhoneVerificationCodeActionCallback, "PHONE_PROVIDER" /* RecaptchaAuthProvider.PHONE_PROVIDER */);
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
    const userInternal = getModularInstance(user);
    if (_isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(userInternal.auth));
    }
    await _link(userInternal, credential);
}
// Helper function that fetches and injects a reCAPTCHA v2 token into the request.
async function injectRecaptchaV2Token(auth, request, recaptchaV2Verifier) {
    _assert(recaptchaV2Verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
    const recaptchaV2Token = await recaptchaV2Verifier.verify();
    _assert(typeof recaptchaV2Token === 'string', auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
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
        this.auth = _castAuth(auth);
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
        return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
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
        return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
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
            return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
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
const _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2000, 10000);
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
    if (_isFirebaseServerApp(auth.app)) {
        return Promise.reject(_createError(auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */));
    }
    const authInternal = _castAuth(auth);
    _assertInstanceOf(auth, provider, FederatedAuthProvider);
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
    const userInternal = getModularInstance(user);
    if (_isFirebaseServerApp(userInternal.auth.app)) {
        return Promise.reject(_createError(userInternal.auth, "operation-not-supported-in-this-environment" /* AuthErrorCode.OPERATION_NOT_SUPPORTED */));
    }
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
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
    const userInternal = getModularInstance(user);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
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
        _assert(result, this.auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        return result;
    }
    async onExecution() {
        debugAssert(this.filter.length === 1, 'Popup operations only handle one event');
        const eventId = _generateEventId();
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
                this.reject(_createError(this.auth, "web-storage-unsupported" /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */));
            }
        });
        // Handle user closure. Notice this does *not* use await
        this.pollUserCancellation();
    }
    get eventId() {
        return this.authWindow?.associatedEvent || null;
    }
    cancel() {
        this.reject(_createError(this.auth, "cancelled-popup-request" /* AuthErrorCode.EXPIRED_POPUP_REQUEST */));
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
                    this.reject(_createError(this.auth, "popup-closed-by-user" /* AuthErrorCode.POPUP_CLOSED_BY_USER */));
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
const IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const HTTP_REGEX = /^https?/;
async function _validateOrigin(auth) {
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
    _fail(auth, "unauthorized-domain" /* AuthErrorCode.INVALID_ORIGIN */);
}
function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
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
const NETWORK_TIMEOUT = new Delay(30000, 60000);
/**
 * Reset unloaded GApi modules. If gapi.load fails due to a network error,
 * it will stop working after a retrial. This is a hack to fix this issue.
 */
function resetUnloadedGapiModules() {
    // Clear last failed gapi.load state to force next gapi.load to first
    // load the failed gapi.iframes module.
    // Get gapix.beacon context.
    const beacon = _window().___jsl;
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
                    reject(_createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                },
                timeout: NETWORK_TIMEOUT.get()
            });
        }
        if (_window().gapi?.iframes?.Iframe) {
            // If gapi.iframes.Iframe available, resolve.
            resolve(gapi.iframes.getContext());
        }
        else if (!!_window().gapi?.load) {
            // Gapi loader ready, load gapi.iframes.
            loadGapiIframe();
        }
        else {
            // Create a new iframe callback when this is called so as not to overwrite
            // any previous defined callback. This happens if this method is called
            // multiple times in parallel and could result in the later callback
            // overwriting the previous one. This would end up with a iframe
            // timeout.
            const cbName = _generateCallbackName('iframefcb');
            // GApi loader not available, dynamically load platform.js.
            _window()[cbName] = () => {
                // GApi loader should be ready.
                if (!!gapi.load) {
                    loadGapiIframe();
                }
                else {
                    // Gapi loader failed, throw error.
                    reject(_createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */));
                }
            };
            // Load GApi loader.
            return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`)
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
const PING_TIMEOUT = new Delay(5000, 15000);
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
    _assert(config.authDomain, auth, "auth-domain-config-required" /* AuthErrorCode.MISSING_AUTH_DOMAIN */);
    const url = config.emulator
        ? _emulatorUrl(config, EMULATED_IFRAME_PATH)
        : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
    const params = {
        apiKey: config.apiKey,
        appName: auth.name,
        v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
    if (eid) {
        params.eid = eid;
    }
    const frameworks = auth._getFrameworks();
    if (frameworks.length) {
        params.fw = frameworks.join(',');
    }
    return `${url}?${querystring(params).slice(1)}`;
}
async function _openIframe(auth) {
    const context = await _loadGapi(auth);
    const gapi = _window().gapi;
    _assert(gapi, auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
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
        const networkError = _createError(auth, "network-request-failed" /* AuthErrorCode.NETWORK_REQUEST_FAILED */);
        // Confirm iframe is correctly loaded.
        // To fallback on failure, set a timeout.
        const networkErrorTimer = _window().setTimeout(() => {
            reject(networkError);
        }, PING_TIMEOUT.get());
        // Clear timer and resolve pending iframe ready promise.
        function clearTimerAndResolve() {
            _window().clearTimeout(networkErrorTimer);
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
    const ua = getUA().toLowerCase();
    if (name) {
        target = _isChromeIOS(ua) ? TARGET_BLANK : name;
    }
    if (_isFirefox(ua)) {
        // Firefox complains when invalid URLs are popped out. Hacky way to bypass.
        url = url || FIREFOX_EMPTY_URL;
        // Firefox disables by default scrolling on popup windows, which can create
        // issues when the user has many Google accounts, for instance.
        options.scrollbars = 'yes';
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, '');
    if (_isIOSStandalone(ua) && target !== '_self') {
        openAsNewWindowIOS(url || '', target);
        return new AuthPopup(null);
    }
    // about:blank getting sanitized causing browsers like IE/Edge to display
    // brief error message before redirecting to handler.
    const newWin = window.open(url || '', target, optionsString);
    _assert(newWin, auth, "popup-blocked" /* AuthErrorCode.POPUP_BLOCKED */);
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
        debugAssert(this.eventManagers[auth._key()]?.manager, '_initialize() not called before _openPopup()');
        const url = await _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
        return _open(auth, url, _generateEventId());
    }
    async _openRedirect(auth, provider, authType, eventId) {
        await this._originValidation(auth);
        const url = await _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
        _setWindowLocation(url);
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
                debugAssert(promise, 'If manager is not set, promise should be');
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
            _assert(iframeEvent?.authEvent, auth, "invalid-auth-event" /* AuthErrorCode.INVALID_AUTH_EVENT */);
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
            _fail(auth, "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth) {
        const key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    }
    get _shouldInitProactively() {
        // Mobile browsers and Safari need to optimistically initialize
        return _isMobileBrowser() || _isSafari() || _isIOS();
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

class MultiFactorAssertionImpl {
    constructor(factorId) {
        this.factorId = factorId;
    }
    _process(auth, session, displayName) {
        switch (session.type) {
            case "enroll" /* MultiFactorSessionType.ENROLL */:
                return this._finalizeEnroll(auth, session.credential, displayName);
            case "signin" /* MultiFactorSessionType.SIGN_IN */:
                return this._finalizeSignIn(auth, session.credential);
            default:
                return debugFail('unexpected MultiFactorSessionType');
        }
    }
}

/**
 * {@inheritdoc PhoneMultiFactorAssertion}
 *
 * @public
 */
class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
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
        return finalizeEnrollPhoneMfa(auth, {
            idToken,
            displayName,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
        });
    }
    /** @internal */
    _finalizeSignIn(auth, mfaPendingCredential) {
        return finalizeSignInPhoneMfa(auth, {
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
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * @public
 */
class TotpMultiFactorGenerator {
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
     * the TOTP (time-based one-time password) second factor.
     * This assertion is used to complete enrollment in TOTP second factor.
     *
     * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorUser.enroll}.
     */
    static assertionForEnrollment(secret, oneTimePassword) {
        return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
    }
    /**
     * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
     * This assertion is used to complete signIn with TOTP as the second factor.
     *
     * @param enrollmentId identifies the enrolled TOTP second factor.
     * @param oneTimePassword One-time password from TOTP App.
     * @returns A {@link TotpMultiFactorAssertion} which can be used with
     * {@link MultiFactorResolver.resolveSignIn}.
     */
    static assertionForSignIn(enrollmentId, oneTimePassword) {
        return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
    }
    /**
     * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
     * Creates a TOTP secret as part of enrolling a TOTP second factor.
     * Used for generating a QR code URL or inputting into a TOTP app.
     * This method uses the auth instance corresponding to the user in the multiFactorSession.
     *
     * @param session The {@link MultiFactorSession} that the user is part of.
     * @returns A promise to {@link TotpSecret}.
     */
    static async generateSecret(session) {
        const mfaSession = session;
        _assert(typeof mfaSession.user?.auth !== 'undefined', "internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
        const response = await startEnrollTotpMfa(mfaSession.user.auth, {
            idToken: mfaSession.credential,
            totpEnrollmentInfo: {}
        });
        return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
    }
}
/**
 * The identifier of the TOTP second factor: `totp`.
 */
TotpMultiFactorGenerator.FACTOR_ID = "totp" /* FactorId.TOTP */;
class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
    constructor(otp, enrollmentId, secret) {
        super("totp" /* FactorId.TOTP */);
        this.otp = otp;
        this.enrollmentId = enrollmentId;
        this.secret = secret;
    }
    /** @internal */
    static _fromSecret(secret, otp) {
        return new TotpMultiFactorAssertionImpl(otp, undefined, secret);
    }
    /** @internal */
    static _fromEnrollmentId(enrollmentId, otp) {
        return new TotpMultiFactorAssertionImpl(otp, enrollmentId);
    }
    /** @internal */
    async _finalizeEnroll(auth, idToken, displayName) {
        _assert(typeof this.secret !== 'undefined', auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        return finalizeEnrollTotpMfa(auth, {
            idToken,
            displayName,
            totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
        });
    }
    /** @internal */
    async _finalizeSignIn(auth, mfaPendingCredential) {
        _assert(this.enrollmentId !== undefined && this.otp !== undefined, auth, "argument-error" /* AuthErrorCode.ARGUMENT_ERROR */);
        const totpVerificationInfo = { verificationCode: this.otp };
        return finalizeSignInTotpMfa(auth, {
            mfaPendingCredential,
            mfaEnrollmentId: this.enrollmentId,
            totpVerificationInfo
        });
    }
}
/**
 * Provider for generating a {@link TotpMultiFactorAssertion}.
 *
 * Stores the shared secret key and other parameters to generate time-based OTPs.
 * Implements methods to retrieve the shared secret key and generate a QR code URL.
 * @public
 */
class TotpSecret {
    // The public members are declared outside the constructor so the docs can be generated.
    constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
        this.sessionInfo = sessionInfo;
        this.auth = auth;
        this.secretKey = secretKey;
        this.hashingAlgorithm = hashingAlgorithm;
        this.codeLength = codeLength;
        this.codeIntervalSeconds = codeIntervalSeconds;
        this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
    }
    /** @internal */
    static _fromStartTotpMfaEnrollmentResponse(response, auth) {
        return new TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
    }
    /** @internal */
    _makeTotpVerificationInfo(otp) {
        return { sessionInfo: this.sessionInfo, verificationCode: otp };
    }
    /**
     * Returns a QR code URL as described in
     * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
     * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
     * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
     *
     * @param accountName the name of the account/app along with a user identifier.
     * @param issuer issuer of the TOTP (likely the app name).
     * @returns A QR code URL string.
     */
    generateQrCodeUrl(accountName, issuer) {
        let useDefaults = false;
        if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
            useDefaults = true;
        }
        if (useDefaults) {
            if (_isEmptyString(accountName)) {
                accountName = this.auth.currentUser?.email || 'unknownuser';
            }
            if (_isEmptyString(issuer)) {
                issuer = this.auth.name;
            }
        }
        return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
    }
}
/** @internal */
function _isEmptyString(input) {
    return typeof input === 'undefined' || input?.length === 0;
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
const DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
const authIdTokenMaxAge = getExperimentalSetting('authIdTokenMaxAge') || DEFAULT_ID_TOKEN_MAX_AGE;
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
function getAuth(app = getApp()) {
    const provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    const auth = initializeAuth(app, {
        popupRedirectResolver: browserPopupRedirectResolver,
        persistence: [
            indexedDBLocalPersistence,
            browserLocalPersistence,
            browserSessionPersistence
        ]
    });
    const authTokenSyncPath = getExperimentalSetting('authTokenSyncURL');
    // Only do the Cookie exchange in a secure context
    if (authTokenSyncPath &&
        typeof isSecureContext === 'boolean' &&
        isSecureContext) {
        // Don't allow urls (XSS possibility), only paths on the same domain
        const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
        if (location.origin === authTokenSyncUrl.origin) {
            const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
            beforeAuthStateChanged(auth, mintCookie, () => mintCookie(auth.currentUser));
            onIdTokenChanged(auth, user => mintCookie(user));
        }
    }
    const authEmulatorHost = getDefaultEmulatorHost('auth');
    if (authEmulatorHost) {
        connectAuthEmulator(auth, `http://${authEmulatorHost}`);
    }
    return auth;
}
function getScriptParentElement() {
    return document.getElementsByTagName('head')?.[0] ?? document;
}
_setExternalJSProvider({
    loadJS(url) {
        // TODO: consider adding timeout support & cancellation
        return new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.setAttribute('src', url);
            el.onload = resolve;
            el.onerror = e => {
                const error = _createError("internal-error" /* AuthErrorCode.INTERNAL_ERROR */);
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
registerAuth("Browser" /* ClientPlatform.BROWSER */);

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

export { AuthPopup, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier, TotpMultiFactorGenerator, TotpSecret, addFrameworkForLogging, browserCookiePersistence, browserPopupRedirectResolver, getAuth, linkWithPhoneNumber, linkWithPopup, reauthenticateWithPhoneNumber, reauthenticateWithPopup, signInWithPhoneNumber, signInWithPopup, updatePhoneNumber };
//# sourceMappingURL=internal.js.map
