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
 * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
 * NameServiceMapping[T] is an alias for the type of the instance
 */
declare class Provider<T extends Name> {
    private readonly name;
    private readonly container;
    private component;
    private readonly instances;
    private readonly instancesDeferred;
    private readonly instancesOptions;
    private onInitCallbacks;
    constructor(name: T, container: ComponentContainer);
    /**
     * @param identifier A provider can provide multiple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier?: string): Promise<NameServiceMapping[T]>;
    /**
     *
     * @param options.identifier A provider can provide multiple instances of a service
     * if this.component.multipleInstances is true.
     * @param options.optional If optional is false or not provided, the method throws an error when
     * the service is not immediately available.
     * If optional is true, the method returns null if the service is not immediately available.
     */
    getImmediate(options: {
        identifier?: string;
        optional: true;
    }): NameServiceMapping[T] | null;
    getImmediate(options?: {
        identifier?: string;
        optional?: false;
    }): NameServiceMapping[T];
    getComponent(): Component<T> | null;
    setComponent(component: Component<T>): void;
    clearInstance(identifier?: string): void;
    delete(): Promise<void>;
    isComponentSet(): boolean;
    isInitialized(identifier?: string): boolean;
    getOptions(identifier?: string): Record<string, unknown>;
    initialize(opts?: InitializeOptions): NameServiceMapping[T];
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback: OnInitCallBack<T>, identifier?: string): () => void;
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    private invokeOnInitCallbacks;
    private getOrInitializeService;
    private normalizeInstanceIdentifier;
    private shouldAutoInitialize;
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
 * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
 */
declare class ComponentContainer {
    private readonly name;
    private readonly providers;
    constructor(name: string);
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent<T extends Name>(component: Component<T>): void;
    addOrOverwriteComponent<T extends Name>(component: Component<T>): void;
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider<T extends Name>(name: T): Provider<T>;
    getProviders(): Array<Provider<Name>>;
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

declare const enum InstantiationMode {
    LAZY = "LAZY",// Currently most components are LAZY in JS SDK
    EAGER = "EAGER",// EAGER components are initialized immediately upon registration
    EXPLICIT = "EXPLICIT"
}
/**
 * PUBLIC: A public component provides a set of public APIs to customers. A service namespace will be patched
 * onto `firebase` namespace. Assume the component name is `test`, customers will be able
 * to get the service by calling `firebase.test()` or `app.test()` where `app` is a `FirebaseApp` instance.
 *
 * PRIVATE: A private component provides a set of private APIs that are used internally by other
 * Firebase SDKs. No service namespace is created in `firebase` namespace and customers have no way to get them.
 */
declare const enum ComponentType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    VERSION = "VERSION"
}
interface InstanceFactoryOptions {
    instanceIdentifier?: string;
    options?: {};
}
type InitializeOptions = InstanceFactoryOptions;
/**
 * Factory to create an instance of type T, given a ComponentContainer.
 * ComponentContainer is the IOC container that provides {@link Provider}
 * for dependencies.
 *
 * NOTE: The container only provides {@link Provider} rather than the actual instances of dependencies.
 * It is useful for lazily loaded dependencies and optional dependencies.
 */
type InstanceFactory<T extends Name> = (container: ComponentContainer, options: InstanceFactoryOptions) => NameServiceMapping[T];
type onInstanceCreatedCallback<T extends Name> = (container: ComponentContainer, instanceIdentifier: string, instance: NameServiceMapping[T]) => void;
interface Dictionary {
    [key: string]: unknown;
}
/**
 * This interface will be extended by Firebase SDKs to provide service name and service type mapping.
 * It is used as a generic constraint to ensure type safety.
 */
interface NameServiceMapping {
}
type Name = keyof NameServiceMapping;
type OnInitCallBack<T extends Name> = (instance: NameServiceMapping[T], identifier: string) => void;

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
 * Component for service name T, e.g. `auth`, `auth-internal`
 */
declare class Component<T extends Name = Name> {
    readonly name: T;
    readonly instanceFactory: InstanceFactory<T>;
    readonly type: ComponentType;
    multipleInstances: boolean;
    /**
     * Properties to be added to the service namespace
     */
    serviceProps: Dictionary;
    instantiationMode: InstantiationMode;
    onInstanceCreated: onInstanceCreatedCallback<T> | null;
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name: T, instanceFactory: InstanceFactory<T>, type: ComponentType);
    setInstantiationMode(mode: InstantiationMode): this;
    setMultipleInstances(multipleInstances: boolean): this;
    setServiceProps(props: Dictionary): this;
    setInstanceCreatedCallback(callback: onInstanceCreatedCallback<T>): this;
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
 * A {@link @firebase/app#FirebaseServerApp} holds the initialization information
 * for a collection of services running in server environments.
 *
 * Do not call this constructor directly. Instead, use
 * {@link (initializeServerApp:1) | initializeServerApp()} to create
 * an app.
 *
 * @public
 */
interface FirebaseServerApp extends FirebaseApp {
    /**
     * There is no `getApp()` operation for `FirebaseServerApp`, so the name is not relevant for
     * applications. However, it may be used internally, and is declared here so that
     * `FirebaseServerApp` conforms to the `FirebaseApp` interface.
     */
    name: string;
    /**
     * The (read-only) configuration settings for this server app. These are the original
     * parameters given in {@link (initializeServerApp:1) | initializeServerApp()}.
     *
     * @example
     * ```javascript
     * const app = initializeServerApp(settings);
     * console.log(app.settings.authIdToken === options.authIdToken);  // true
     * ```
     */
    readonly settings: FirebaseServerAppSettings;
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
 * @public
 *
 * Configuration options given to {@link (initializeApp:1) | initializeApp()}
 */
interface FirebaseAppSettings {
    /**
     * custom name for the Firebase App.
     * The default value is `"[DEFAULT]"`.
     */
    name?: string;
    /**
     * The settable config flag for GDPR opt-in/opt-out. Defaults to true.
     */
    automaticDataCollectionEnabled?: boolean;
}
/**
 * @public
 *
 * Configuration options given to {@link (initializeServerApp:1) | initializeServerApp()}
 */
interface FirebaseServerAppSettings extends Omit<FirebaseAppSettings, 'name'> {
    /**
     * An optional Auth ID token used to resume a signed in user session from a client
     * runtime environment.
     *
     * Invoking `getAuth` with a `FirebaseServerApp` configured with a validated `authIdToken`
     * causes an automatic attempt to sign in the user that the `authIdToken` represents. The token
     * needs to have been recently minted for this operation to succeed.
     *
     * If the token fails local verification due to expiration or parsing errors, then a console error
     * is logged at the time of initialization of the `FirebaseServerApp` instance.
     *
     * If the Auth service has failed to validate the token when the Auth SDK is initialized, then an
     * warning is logged to the console and the Auth SDK will not sign in a user on initialization.
     *
     * If a user is successfully signed in, then the Auth instance's `onAuthStateChanged` callback
     * is invoked with the `User` object as per standard Auth flows. However, `User` objects
     * created via an `authIdToken` do not have a refresh token. Attempted `refreshToken`
     * operations fail.
     */
    authIdToken?: string;
    /**
     * An optional App Check token. If provided, the Firebase SDKs that use App Check will utilize
     * this App Check token in place of requiring an instance of App Check to be initialized.
     *
     * If the token fails local verification due to expiration or parsing errors, then a console error
     * is logged at the time of initialization of the `FirebaseServerApp` instance.
     */
    appCheckToken?: string;
    /**
     * An optional object. If provided, the Firebase SDK uses a `FinalizationRegistry`
     * object to monitor the garbage collection status of the provided object. The
     * Firebase SDK releases its reference on the `FirebaseServerApp` instance when the
     * provided `releaseOnDeref` object is garbage collected.
     *
     * You can use this field to reduce memory management overhead for your application.
     * If provided, an app running in a SSR pass does not need to perform
     * `FirebaseServerApp` cleanup, so long as the reference object is deleted (by falling out of
     * SSR scope, for instance.)
     *
     * If an object is not provided then the application must clean up the `FirebaseServerApp`
     * instance by invoking `deleteApp`.
     *
     * If the application provides an object in this parameter, but the application is
     * executed in a JavaScript engine that predates the support of `FinalizationRegistry`
     * (introduced in node v14.6.0, for instance), then an error is thrown at `FirebaseServerApp`
     * initialization.
     */
    releaseOnDeref?: object;
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
/**
 * @internal
 */
interface _FirebaseAppInternal extends FirebaseApp {
    container: ComponentContainer;
    isDeleted: boolean;
    checkDestroyed(): void;
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
type LogLevelString = 'debug' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';
interface LogOptions {
    level: LogLevelString;
}
type LogCallback = (callbackParams: LogCallbackParams) => void;
interface LogCallbackParams {
    level: LogLevelString;
    message: string;
    args: unknown[];
    type: string;
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

declare class FirebaseError extends Error {
    /** The error code for this error. */
    readonly code: string;
    /** Custom data for this error. */
    customData?: Record<string, unknown> | undefined;
    /** The custom name for all FirebaseErrors. */
    readonly name: string;
    constructor(
    /** The error code for this error. */
    code: string, message: string, 
    /** Custom data for this error. */
    customData?: Record<string, unknown> | undefined);
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
 * The current SDK version.
 *
 * @public
 */
declare const SDK_VERSION: string;
/**
 * Creates and initializes a {@link @firebase/app#FirebaseApp} instance.
 *
 * See
 * {@link
 *   https://firebase.google.com/docs/web/setup#add_firebase_to_your_app
 *   | Add Firebase to your app} and
 * {@link
 *   https://firebase.google.com/docs/web/setup#multiple-projects
 *   | Initialize multiple projects} for detailed documentation.
 *
 * @example
 * ```javascript
 *
 * // Initialize default app
 * // Retrieve your own options values by adding a web app on
 * // https://console.firebase.google.com
 * initializeApp({
 *   apiKey: "AIza....",                             // Auth / General Use
 *   authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
 *   databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
 *   storageBucket: "YOUR_APP.appspot.com",          // Storage
 *   messagingSenderId: "123456789"                  // Cloud Messaging
 * });
 * ```
 *
 * @example
 * ```javascript
 *
 * // Initialize another app
 * const otherApp = initializeApp({
 *   databaseURL: "https://<OTHER_DATABASE_NAME>.firebaseio.com",
 *   storageBucket: "<OTHER_STORAGE_BUCKET>.appspot.com"
 * }, "otherApp");
 * ```
 *
 * @param options - Options to configure the app's services.
 * @param name - Optional name of the app to initialize. If no name
 *   is provided, the default is `"[DEFAULT]"`.
 *
 * @returns The initialized app.
 *
 * @throws If the optional `name` parameter is malformed or empty.
 *
 * @throws If a `FirebaseApp` already exists with the same name but with a different configuration.
 *
 * @public
 */
declare function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
/**
 * Creates and initializes a FirebaseApp instance.
 *
 * @param options - Options to configure the app's services.
 * @param config - FirebaseApp Configuration
 *
 * @throws If {@link FirebaseAppSettings.name} is defined but the value is malformed or empty.
 *
 * @throws If a `FirebaseApp` already exists with the same name but with a different configuration.
 * @public
 */
declare function initializeApp(options: FirebaseOptions, config?: FirebaseAppSettings): FirebaseApp;
/**
 * Creates and initializes a FirebaseApp instance.
 *
 * @public
 */
declare function initializeApp(): FirebaseApp;
/**
 * Creates and initializes a {@link @firebase/app#FirebaseServerApp} instance.
 *
 * The `FirebaseServerApp` is similar to `FirebaseApp`, but is intended for execution in
 * server side rendering environments only. Initialization will fail if invoked from a
 * browser environment.
 *
 * See
 * {@link
 *   https://firebase.google.com/docs/web/setup#add_firebase_to_your_app
 *   | Add Firebase to your app} and
 * {@link
 *   https://firebase.google.com/docs/web/setup#multiple-projects
 *   | Initialize multiple projects} for detailed documentation.
 *
 * @example
 * ```javascript
 *
 * // Initialize an instance of `FirebaseServerApp`.
 * // Retrieve your own options values by adding a web app on
 * // https://console.firebase.google.com
 * initializeServerApp({
 *     apiKey: "AIza....",                             // Auth / General Use
 *     authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
 *     databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
 *     storageBucket: "YOUR_APP.appspot.com",          // Storage
 *     messagingSenderId: "123456789"                  // Cloud Messaging
 *   },
 *   {
 *    authIdToken: "Your Auth ID Token"
 *   });
 * ```
 *
 * @param options - `Firebase.AppOptions` to configure the app's services, or a
 *   a `FirebaseApp` instance which contains the `AppOptions` within.
 * @param config - Optional `FirebaseServerApp` settings.
 *
 * @returns The initialized `FirebaseServerApp`.
 *
 * @throws If invoked in an unsupported non-server environment such as a browser.
 *
 * @throws If {@link FirebaseServerAppSettings.releaseOnDeref} is defined but the runtime doesn't
 *   provide Finalization Registry support.
 *
 * @public
 */
declare function initializeServerApp(options: FirebaseOptions | FirebaseApp, config?: FirebaseServerAppSettings): FirebaseServerApp;
/**
 * Creates and initializes a {@link @firebase/app#FirebaseServerApp} instance.
 *
 * @param config - Optional `FirebaseServerApp` settings.
 *
 * @returns The initialized `FirebaseServerApp`.
 *
 * @throws If invoked in an unsupported non-server environment such as a browser.
 * @throws If {@link FirebaseServerAppSettings.releaseOnDeref} is defined but the runtime doesn't
 *   provide Finalization Registry support.
 * @throws If the `FIREBASE_OPTIONS` environment variable does not contain a valid project
 *   configuration required for auto-initialization.
 *
 * @public
 */
declare function initializeServerApp(config?: FirebaseServerAppSettings): FirebaseServerApp;
/**
 * Retrieves a {@link @firebase/app#FirebaseApp} instance.
 *
 * When called with no arguments, the default app is returned. When an app name
 * is provided, the app corresponding to that name is returned.
 *
 * An exception is thrown if the app being retrieved has not yet been
 * initialized.
 *
 * @example
 * ```javascript
 * // Return the default app
 * const app = getApp();
 * ```
 *
 * @example
 * ```javascript
 * // Return a named app
 * const otherApp = getApp("otherApp");
 * ```
 *
 * @param name - Optional name of the app to return. If no name is
 *   provided, the default is `"[DEFAULT]"`.
 *
 * @returns The app corresponding to the provided app name.
 *   If no app name is provided, the default app is returned.
 *
 * @public
 */
declare function getApp(name?: string): FirebaseApp;
/**
 * A (read-only) array of all initialized apps.
 * @public
 */
declare function getApps(): FirebaseApp[];
/**
 * Renders this app unusable and frees the resources of all associated
 * services.
 *
 * @example
 * ```javascript
 * deleteApp(app)
 *   .then(function() {
 *     console.log("App deleted successfully");
 *   })
 *   .catch(function(error) {
 *     console.log("Error deleting app:", error);
 *   });
 * ```
 *
 * @public
 */
declare function deleteApp(app: FirebaseApp): Promise<void>;
/**
 * Registers a library's name and version for platform logging purposes.
 * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
 * @param version - Current version of that library.
 * @param variant - Bundle variant, e.g., node, rn, etc.
 *
 * @public
 */
declare function registerVersion(libraryKeyOrName: string, version: string, variant?: string): void;
/**
 * Sets log handler for all Firebase SDKs.
 * @param logCallback - An optional custom log handler that executes user code whenever
 * the Firebase SDK makes a logging call.
 *
 * @public
 */
declare function onLog(logCallback: LogCallback | null, options?: LogOptions): void;
/**
 * Sets log level for all Firebase SDKs.
 *
 * All of the log types above the current log level are captured (i.e. if
 * you set the log level to `info`, errors are logged, but `debug` and
 * `verbose` logs are not).
 *
 * @public
 */
declare function setLogLevel(logLevel: LogLevelString): void;

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
 * The default app name
 *
 * @internal
 */
declare const DEFAULT_ENTRY_NAME = "[DEFAULT]";

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
 * @internal
 */
declare const _apps: Map<string, FirebaseApp>;
/**
 * @internal
 */
declare const _serverApps: Map<string, FirebaseServerApp>;
/**
 * Registered components.
 *
 * @internal
 */
declare const _components: Map<string, Component<any>>;
/**
 * @param component - the component being added to this app's container
 *
 * @internal
 */
declare function _addComponent<T extends Name>(app: FirebaseApp, component: Component<T>): void;
/**
 *
 * @internal
 */
declare function _addOrOverwriteComponent(app: FirebaseApp, component: Component): void;
/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */
declare function _registerComponent<T extends Name>(component: Component<T>): boolean;
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */
declare function _getProvider<T extends Name>(app: FirebaseApp, name: T): Provider<T>;
/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
 *
 * @internal
 */
declare function _removeServiceInstance<T extends Name>(app: FirebaseApp, name: T, instanceIdentifier?: string): void;
/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provide object is of type FirebaseApp.
 *
 * @internal
 */
declare function _isFirebaseApp(obj: FirebaseApp | FirebaseOptions | FirebaseAppSettings): obj is FirebaseApp;
/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
declare function _isFirebaseServerAppSettings(obj: FirebaseApp | FirebaseOptions | FirebaseAppSettings): obj is FirebaseServerAppSettings;
/**
 *
 * @param obj - an object of type FirebaseApp.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
declare function _isFirebaseServerApp(obj: FirebaseApp | FirebaseServerApp | null | undefined): obj is FirebaseServerApp;
/**
 * Test only
 *
 * @internal
 */
declare function _clearComponents(): void;

export { FirebaseApp, FirebaseAppSettings, FirebaseError, FirebaseOptions, FirebaseServerApp, FirebaseServerAppSettings, SDK_VERSION, DEFAULT_ENTRY_NAME as _DEFAULT_ENTRY_NAME, _FirebaseAppInternal, _FirebaseService, _addComponent, _addOrOverwriteComponent, _apps, _clearComponents, _components, _getProvider, _isFirebaseApp, _isFirebaseServerApp, _isFirebaseServerAppSettings, _registerComponent, _removeServiceInstance, _serverApps, deleteApp, getApp, getApps, initializeApp, initializeServerApp, onLog, registerVersion, setLogLevel };
