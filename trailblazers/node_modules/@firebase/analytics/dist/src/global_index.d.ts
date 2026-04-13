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
interface VersionService {
    library: string;
    version: string;
}
interface PlatformLoggerService {
    getPlatformInfoString(): string;
}
interface HeartbeatService {
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    triggerHeartbeat(): Promise<void>;
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     */
    getHeartbeatsHeader(): Promise<string>;
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
 * A {@link @firebase/app#FirebaseApp} holds the initialization information for a collection of
 * services.
 *
 * Do not call this constructor directly. Instead, use
 * {@link (initializeApp:1) | initializeApp()} to create an app.
 *
 * @public
 */
interface FirebaseApp {
    /**
     * The (read-only) name for this app.
     *
     * The default app's name is `"[DEFAULT]"`.
     *
     * @example
     * ```javascript
     * // The default app's name is "[DEFAULT]"
     * const app = initializeApp(defaultAppConfig);
     * console.log(app.name);  // "[DEFAULT]"
     * ```
     *
     * @example
     * ```javascript
     * // A named app's name is what you provide to initializeApp()
     * const otherApp = initializeApp(otherAppConfig, "other");
     * console.log(otherApp.name);  // "other"
     * ```
     */
    readonly name: string;
    /**
     * The (read-only) configuration options for this app. These are the original
     * parameters given in {@link (initializeApp:1) | initializeApp()}.
     *
     * @example
     * ```javascript
     * const app = initializeApp(config);
     * console.log(app.options.databaseURL === config.databaseURL);  // true
     * ```
     */
    readonly options: FirebaseOptions;
    /**
     * The settable config flag for GDPR opt-in/opt-out
     */
    automaticDataCollectionEnabled: boolean;
}
/**
 * @public
 *
 * Firebase configuration object. Contains a set of parameters required by
 * services in order to successfully communicate with Firebase server APIs
 * and to associate client data with your Firebase project and
 * Firebase application. Typically this object is populated by the Firebase
 * console at project setup. See also:
 * {@link https://firebase.google.com/docs/web/setup#config-object | Learn about the Firebase config object}.
 */
interface FirebaseOptions {
    /**
     * An encrypted string used when calling certain APIs that don't need to
     * access private user data
     * (example value: `AIzaSyDOCAbC123dEf456GhI789jKl012-MnO`).
     */
    apiKey?: string;
    /**
     * Auth domain for the project ID.
     */
    authDomain?: string;
    /**
     * Default Realtime Database URL.
     */
    databaseURL?: string;
    /**
     * The unique identifier for the project across all of Firebase and
     * Google Cloud.
     */
    projectId?: string;
    /**
     * The default Cloud Storage bucket name.
     */
    storageBucket?: string;
    /**
     * Unique numerical value used to identify each sender that can send
     * Firebase Cloud Messaging messages to client apps.
     */
    messagingSenderId?: string;
    /**
     * Unique identifier for the app.
     */
    appId?: string;
    /**
     * An ID automatically created when you enable Analytics in your
     * Firebase project and register a web app. In versions 7.20.0
     * and higher, this parameter is optional.
     */
    measurementId?: string;
}
/**
 * @internal
 */
interface _FirebaseService {
    app: FirebaseApp;
    /**
     * Delete the service and free it's resources - called from
     * {@link @firebase/app#deleteApp | deleteApp()}
     */
    _delete(): Promise<void>;
}
declare module '@firebase/component' {
    interface NameServiceMapping {
        'app': FirebaseApp;
        'app-version': VersionService;
        'heartbeat': HeartbeatService;
        'platform-logger': PlatformLoggerService;
    }
}

/**
 * An object that can be injected into the environment as __FIREBASE_DEFAULTS__,
 * either as a property of globalThis, a shell environment variable, or a
 * cookie.
 *
 * This object can be used to automatically configure and initialize
 * a Firebase app as well as any emulators.
 *
 * @public
 */
interface FirebaseDefaults {
    config?: Record<string, string>;
    emulatorHosts?: Record<string, string>;
    _authTokenSyncURL?: string;
    _authIdTokenMaxAge?: number;
    /**
     * Override Firebase's runtime environment detection and
     * force the SDK to act as if it were in the specified environment.
     */
    forceEnvironment?: 'browser' | 'node';
    [key: string]: unknown;
}
declare global {
    var __FIREBASE_DEFAULTS__: FirebaseDefaults | undefined;
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
 * Public interface of the Firebase Installations SDK.
 *
 * @public
 */
interface Installations {
    /**
     * The {@link @firebase/app#FirebaseApp} this `Installations` instance is associated with.
     */
    app: FirebaseApp;
}
/**
 * An interface for Firebase internal SDKs use only.
 *
 * @internal
 */
interface _FirebaseInstallationsInternal {
    /**
     * Creates a Firebase Installation if there isn't one for the app and
     * returns the Installation ID.
     */
    getId(): Promise<string>;
    /**
     * Returns an Authentication Token for the current Firebase Installation.
     */
    getToken(forceRefresh?: boolean): Promise<string>;
}
declare module '@firebase/component' {
    interface NameServiceMapping {
        'installations': Installations;
        'installations-internal': _FirebaseInstallationsInternal;
    }
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

/**
 * A set of common Google Analytics config settings recognized by
 * `gtag.js`.
 * @public
 */
interface GtagConfigParams {
    /**
     * Whether or not a page view should be sent.
     * If set to true (default), a page view is automatically sent upon initialization
     * of analytics.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/views | Page views }
     */
    'send_page_view'?: boolean;
    /**
     * The title of the page.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/views | Page views }
     */
    'page_title'?: string;
    /**
     * The URL of the page.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/views | Page views }
     */
    'page_location'?: string;
    /**
     * Defaults to `auto`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_domain'?: string;
    /**
     * Defaults to 63072000 (two years, in seconds).
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_expires'?: number;
    /**
     * Defaults to `_ga`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_prefix'?: string;
    /**
     * If set to true, will update cookies on each page load.
     * Defaults to true.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_update'?: boolean;
    /**
     * Appends additional flags to the cookie when set.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id | Cookies and user identification }
     */
    'cookie_flags'?: string;
    /**
     * If set to false, disables all advertising features with `gtag.js`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/display-features | Disable advertising features }
     */
    'allow_google_signals'?: boolean;
    /**
     * If set to false, disables all advertising personalization with `gtag.js`.
     * See {@link https://developers.google.com/analytics/devguides/collection/ga4/display-features | Disable advertising features }
     */
    'allow_ad_personalization_signals'?: boolean;
    [key: string]: unknown;
}
/**
 * {@link Analytics} instance initialization options.
 * @public
 */
interface AnalyticsSettings {
    /**
     * Params to be passed in the initial `gtag` config call during Firebase
     * Analytics initialization.
     */
    config?: GtagConfigParams | EventParams;
}
/**
 * Additional options that can be passed to Analytics method
 * calls such as `logEvent`, etc.
 * @public
 */
interface AnalyticsCallOptions {
    /**
     * If true, this config or event call applies globally to all
     * Google Analytics properties on the page.
     */
    global: boolean;
}
/**
 * An instance of Firebase Analytics.
 * @public
 */
interface Analytics {
    /**
     * The {@link @firebase/app#FirebaseApp} this {@link Analytics} instance is associated with.
     */
    app: FirebaseApp;
}
/**
 * Specifies custom options for your Firebase Analytics instance.
 * You must set these before initializing `firebase.analytics()`.
 * @public
 */
interface SettingsOptions {
    /** Sets custom name for `gtag` function. */
    gtagName?: string;
    /** Sets custom name for `dataLayer` array used by `gtag.js`. */
    dataLayerName?: string;
}
/**
 * Any custom params the user may pass to `gtag`.
 * @public
 */
interface CustomParams {
    [key: string]: unknown;
}
/**
 * Type for standard Google Analytics event names. `logEvent` also accepts any
 * custom string and interprets it as a custom event name.
 * @public
 */
type EventNameString = 'add_payment_info' | 'add_shipping_info' | 'add_to_cart' | 'add_to_wishlist' | 'begin_checkout' | 'checkout_progress' | 'exception' | 'generate_lead' | 'login' | 'page_view' | 'purchase' | 'refund' | 'remove_from_cart' | 'screen_view' | 'search' | 'select_content' | 'select_item' | 'select_promotion' | 'set_checkout_option' | 'share' | 'sign_up' | 'timing_complete' | 'view_cart' | 'view_item' | 'view_item_list' | 'view_promotion' | 'view_search_results';
/**
 * Standard Google Analytics currency type.
 * @public
 */
type Currency = string | number;
/**
 * Standard Google Analytics `Item` type.
 * @public
 */
interface Item {
    item_id?: string;
    item_name?: string;
    item_brand?: string;
    item_category?: string;
    item_category2?: string;
    item_category3?: string;
    item_category4?: string;
    item_category5?: string;
    item_variant?: string;
    price?: Currency;
    quantity?: number;
    index?: number;
    coupon?: string;
    item_list_name?: string;
    item_list_id?: string;
    discount?: Currency;
    affiliation?: string;
    creative_name?: string;
    creative_slot?: string;
    promotion_id?: string;
    promotion_name?: string;
    location_id?: string;
    /** @deprecated Use item_brand instead. */
    brand?: string;
    /** @deprecated Use item_category instead. */
    category?: string;
    /** @deprecated Use item_id instead. */
    id?: string;
    /** @deprecated Use item_name instead. */
    name?: string;
}
/**
 * Field previously used by some Google Analytics events.
 * @deprecated Use `Item` instead.
 * @public
 */
interface Promotion {
    creative_name?: string;
    creative_slot?: string;
    id?: string;
    name?: string;
}
/**
 * Standard `gtag.js` control parameters.
 * For more information, see
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 * @public
 */
interface ControlParams {
    groups?: string | string[];
    send_to?: string | string[];
    event_callback?: () => void;
    event_timeout?: number;
}
/**
 * Standard `gtag.js` event parameters.
 * For more information, see
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 * @public
 */
interface EventParams {
    checkout_option?: string;
    checkout_step?: number;
    item_id?: string;
    content_type?: string;
    coupon?: string;
    currency?: string;
    description?: string;
    fatal?: boolean;
    items?: Item[];
    method?: string;
    number?: string;
    promotions?: Promotion[];
    screen_name?: string;
    /**
     * Firebase-specific. Use to log a `screen_name` to Firebase Analytics.
     */
    firebase_screen?: string;
    /**
     * Firebase-specific. Use to log a `screen_class` to Firebase Analytics.
     */
    firebase_screen_class?: string;
    search_term?: string;
    shipping?: Currency;
    tax?: Currency;
    transaction_id?: string;
    value?: number;
    event_label?: string;
    event_category?: string;
    shipping_tier?: string;
    item_list_id?: string;
    item_list_name?: string;
    promotion_id?: string;
    promotion_name?: string;
    payment_type?: string;
    affiliation?: string;
    page_title?: string;
    page_location?: string;
    page_path?: string;
    [key: string]: unknown;
}
/**
 * Consent status settings for each consent type.
 * For more information, see
 * {@link https://developers.google.com/tag-platform/tag-manager/templates/consent-apis
 * | the GA4 reference documentation for consent state and consent types}.
 * @public
 */
interface ConsentSettings {
    /** Enables storage, such as cookies, related to advertising */
    ad_storage?: ConsentStatusString;
    /** Sets consent for sending user data to Google for advertising purposes. */
    ad_user_data?: ConsentStatusString;
    /** Sets consent for personalized advertising. */
    ad_personalization?: ConsentStatusString;
    /** Enables storage, such as cookies, related to analytics (for example, visit duration) */
    analytics_storage?: ConsentStatusString;
    /**
     * Enables storage that supports the functionality of the website or app such as language settings
     */
    functionality_storage?: ConsentStatusString;
    /** Enables storage related to personalization such as video recommendations */
    personalization_storage?: ConsentStatusString;
    /**
     * Enables storage related to security such as authentication functionality, fraud prevention,
     * and other user protection.
     */
    security_storage?: ConsentStatusString;
    [key: string]: unknown;
}
/**
 * Whether a particular consent type has been granted or denied.
 * @public
 */
type ConsentStatusString = 'granted' | 'denied';

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
/**
 * Type constant for Firebase Analytics.
 */
declare const ANALYTICS_TYPE = "analytics";

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

/**
 * Analytics Service class.
 */
declare class AnalyticsService implements Analytics, _FirebaseService {
    app: FirebaseApp;
    constructor(app: FirebaseApp);
    _delete(): Promise<void>;
}
/**
 * Configures Firebase Analytics to use custom `gtag` or `dataLayer` names.
 * Intended to be used if `gtag.js` script has been installed on
 * this page independently of Firebase Analytics, and is using non-default
 * names for either the `gtag` function or for `dataLayer`.
 * Must be called before calling `getAnalytics()` or it won't
 * have any effect.
 *
 * @public
 *
 * @param options - Custom gtag and dataLayer names.
 */
declare function settings(options: SettingsOptions): void;

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

declare module '@firebase/component' {
    interface NameServiceMapping {
        [ANALYTICS_TYPE]: AnalyticsService;
    }
}
/**
 * Returns an {@link Analytics} instance for the given app.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
declare function getAnalytics(app?: FirebaseApp): Analytics;
/**
 * Returns an {@link Analytics} instance for the given app.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
declare function initializeAnalytics(app: FirebaseApp, options?: AnalyticsSettings): Analytics;
/**
 * This is a public static method provided to users that wraps four different checks:
 *
 * 1. Check if it's not a browser extension environment.
 * 2. Check if cookies are enabled in current browser.
 * 3. Check if IndexedDB is supported by the browser environment.
 * 4. Check if the current browser context is valid for using `IndexedDB.open()`.
 *
 * @public
 *
 */
declare function isSupported(): Promise<boolean>;
/**
 * Use gtag `config` command to set `screen_name`.
 *
 * @public
 *
 * @deprecated Use {@link logEvent} with `eventName` as 'screen_view' and add relevant `eventParams`.
 * See {@link https://firebase.google.com/docs/analytics/screenviews | Track Screenviews}.
 *
 * @param analyticsInstance - The {@link Analytics} instance.
 * @param screenName - Screen name to set.
 */
declare function setCurrentScreen(analyticsInstance: Analytics, screenName: string, options?: AnalyticsCallOptions): void;
/**
 * Retrieves a unique Google Analytics identifier for the web client.
 * See {@link https://developers.google.com/analytics/devguides/collection/ga4/reference/config#client_id | client_id}.
 *
 * @public
 *
 * @param app - The {@link @firebase/app#FirebaseApp} to use.
 */
declare function getGoogleAnalyticsClientId(analyticsInstance: Analytics): Promise<string>;
/**
 * Use gtag `config` command to set `user_id`.
 *
 * @public
 *
 * @param analyticsInstance - The {@link Analytics} instance.
 * @param id - User ID to set.
 */
declare function setUserId(analyticsInstance: Analytics, id: string | null, options?: AnalyticsCallOptions): void;
/**
 * Use gtag `config` command to set all params specified.
 *
 * @public
 */
declare function setUserProperties(analyticsInstance: Analytics, properties: CustomParams, options?: AnalyticsCallOptions): void;
/**
 * Sets whether Google Analytics collection is enabled for this app on this device.
 * Sets global `window['ga-disable-analyticsId'] = true;`
 *
 * @public
 *
 * @param analyticsInstance - The {@link Analytics} instance.
 * @param enabled - If true, enables collection, if false, disables it.
 */
declare function setAnalyticsCollectionEnabled(analyticsInstance: Analytics, enabled: boolean): void;
/**
 * Adds data that will be set on every event logged from the SDK, including automatic ones.
 * With gtag's "set" command, the values passed persist on the current page and are passed with
 * all subsequent events.
 * @public
 * @param customParams - Any custom params the user may pass to gtag.js.
 */
declare function setDefaultEventParameters(customParams: CustomParams): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'add_payment_info', eventParams?: {
    coupon?: EventParams['coupon'];
    currency?: EventParams['currency'];
    items?: EventParams['items'];
    payment_type?: EventParams['payment_type'];
    value?: EventParams['value'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'add_shipping_info', eventParams?: {
    coupon?: EventParams['coupon'];
    currency?: EventParams['currency'];
    items?: EventParams['items'];
    shipping_tier?: EventParams['shipping_tier'];
    value?: EventParams['value'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'add_to_cart' | 'add_to_wishlist' | 'remove_from_cart', eventParams?: {
    currency?: EventParams['currency'];
    value?: EventParams['value'];
    items?: EventParams['items'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'begin_checkout', eventParams?: {
    currency?: EventParams['currency'];
    coupon?: EventParams['coupon'];
    value?: EventParams['value'];
    items?: EventParams['items'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'checkout_progress', eventParams?: {
    currency?: EventParams['currency'];
    coupon?: EventParams['coupon'];
    value?: EventParams['value'];
    items?: EventParams['items'];
    checkout_step?: EventParams['checkout_step'];
    checkout_option?: EventParams['checkout_option'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * See
 * {@link https://developers.google.com/analytics/devguides/collection/ga4/exceptions
 * | Measure exceptions}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'exception', eventParams?: {
    description?: EventParams['description'];
    fatal?: EventParams['fatal'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'generate_lead', eventParams?: {
    value?: EventParams['value'];
    currency?: EventParams['currency'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'login', eventParams?: {
    method?: EventParams['method'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * See
 * {@link https://developers.google.com/analytics/devguides/collection/ga4/views
 * | Page views}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'page_view', eventParams?: {
    page_title?: string;
    page_location?: string;
    page_path?: string;
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'purchase' | 'refund', eventParams?: {
    value?: EventParams['value'];
    currency?: EventParams['currency'];
    transaction_id: EventParams['transaction_id'];
    tax?: EventParams['tax'];
    shipping?: EventParams['shipping'];
    items?: EventParams['items'];
    coupon?: EventParams['coupon'];
    affiliation?: EventParams['affiliation'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * See {@link https://firebase.google.com/docs/analytics/screenviews
 * | Track Screenviews}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'screen_view', eventParams?: {
    firebase_screen: EventParams['firebase_screen'];
    firebase_screen_class: EventParams['firebase_screen_class'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'search' | 'view_search_results', eventParams?: {
    search_term?: EventParams['search_term'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'select_content', eventParams?: {
    content_type?: EventParams['content_type'];
    item_id?: EventParams['item_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'select_item', eventParams?: {
    items?: EventParams['items'];
    item_list_name?: EventParams['item_list_name'];
    item_list_id?: EventParams['item_list_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'select_promotion' | 'view_promotion', eventParams?: {
    items?: EventParams['items'];
    promotion_id?: EventParams['promotion_id'];
    promotion_name?: EventParams['promotion_name'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'set_checkout_option', eventParams?: {
    checkout_step?: EventParams['checkout_step'];
    checkout_option?: EventParams['checkout_option'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'share', eventParams?: {
    method?: EventParams['method'];
    content_type?: EventParams['content_type'];
    item_id?: EventParams['item_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'sign_up', eventParams?: {
    method?: EventParams['method'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'timing_complete', eventParams?: {
    name: string;
    value: number;
    event_category?: string;
    event_label?: string;
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'view_cart' | 'view_item', eventParams?: {
    currency?: EventParams['currency'];
    items?: EventParams['items'];
    value?: EventParams['value'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent(analyticsInstance: Analytics, eventName: 'view_item_list', eventParams?: {
    items?: EventParams['items'];
    item_list_name?: EventParams['item_list_name'];
    item_list_id?: EventParams['item_list_id'];
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Sends a Google Analytics event with given `eventParams`. This method
 * automatically associates this logged event with this Firebase web
 * app instance on this device.
 * @public
 * List of recommended event parameters can be found in
 * {@link https://developers.google.com/gtagjs/reference/ga4-events
 * | the GA4 reference documentation}.
 */
declare function logEvent<T extends string>(analyticsInstance: Analytics, eventName: CustomEventName<T>, eventParams?: {
    [key: string]: any;
}, options?: AnalyticsCallOptions): void;
/**
 * Any custom event name string not in the standard list of recommended
 * event names.
 * @public
 */
type CustomEventName<T> = T extends EventNameString ? never : T;
/**
 * Sets the applicable end user consent state for this web app across all gtag references once
 * Firebase Analytics is initialized.
 *
 * Use the {@link ConsentSettings} to specify individual consent type values. By default consent
 * types are set to "granted".
 * @public
 * @param consentSettings - Maps the applicable end user consent state for gtag.js.
 */
declare function setConsent(consentSettings: ConsentSettings): void;

/**
 * The Firebase Analytics Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */

declare global {
    interface Window {
        [key: string]: unknown;
    }
}

export { Analytics, AnalyticsCallOptions, AnalyticsSettings, ConsentSettings, ConsentStatusString, ControlParams, Currency, CustomEventName, CustomParams, EventNameString, EventParams, GtagConfigParams, Item, Promotion, SettingsOptions, getAnalytics, getGoogleAnalyticsClientId, initializeAnalytics, isSupported, logEvent, setAnalyticsCollectionEnabled, setConsent, setCurrentScreen, setDefaultEventParameters, setUserId, setUserProperties, settings };
