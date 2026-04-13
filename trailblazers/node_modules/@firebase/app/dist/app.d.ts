/**
 * Firebase App
 *
 * @remarks This package coordinates the communication between the different Firebase components
 * @packageDocumentation
 */

import { Component } from '@firebase/component';
import { ComponentContainer } from '@firebase/component';
import { FirebaseError } from '@firebase/util';
import { LogCallback } from '@firebase/logger';
import { LogLevelString } from '@firebase/logger';
import { LogOptions } from '@firebase/logger';
import { Name } from '@firebase/component';
import { Provider } from '@firebase/component';

/**
 * @param component - the component being added to this app's container
 *
 * @internal
 */
export declare function _addComponent<T extends Name>(app: FirebaseApp, component: Component<T>): void;

/**
 *
 * @internal
 */
export declare function _addOrOverwriteComponent(app: FirebaseApp, component: Component): void;

/**
 * @internal
 */
export declare const _apps: Map<string, FirebaseApp>;

/**
 * Test only
 *
 * @internal
 */
export declare function _clearComponents(): void;

/**
 * Registered components.
 *
 * @internal
 */
export declare const _components: Map<string, Component<any>>;

/**
 * The default app name
 *
 * @internal
 */
export declare const _DEFAULT_ENTRY_NAME = "[DEFAULT]";

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
export declare function deleteApp(app: FirebaseApp): Promise<void>;

/**
 * A {@link @firebase/app#FirebaseApp} holds the initialization information for a collection of
 * services.
 *
 * Do not call this constructor directly. Instead, use
 * {@link (initializeApp:1) | initializeApp()} to create an app.
 *
 * @public
 */
export declare interface FirebaseApp {
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
 * @internal
 */
export declare interface _FirebaseAppInternal extends FirebaseApp {
    container: ComponentContainer;
    isDeleted: boolean;
    checkDestroyed(): void;
}

/**
 * @public
 *
 * Configuration options given to {@link (initializeApp:1) | initializeApp()}
 */
export declare interface FirebaseAppSettings {
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
export { FirebaseError }

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
export declare interface FirebaseOptions {
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
 * A {@link @firebase/app#FirebaseServerApp} holds the initialization information
 * for a collection of services running in server environments.
 *
 * Do not call this constructor directly. Instead, use
 * {@link (initializeServerApp:1) | initializeServerApp()} to create
 * an app.
 *
 * @public
 */
export declare interface FirebaseServerApp extends FirebaseApp {
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
 * Configuration options given to {@link (initializeServerApp:1) | initializeServerApp()}
 */
export declare interface FirebaseServerAppSettings extends Omit<FirebaseAppSettings, 'name'> {
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
export declare interface _FirebaseService {
    app: FirebaseApp;
    /**
     * Delete the service and free it's resources - called from
     * {@link @firebase/app#deleteApp | deleteApp()}
     */
    _delete(): Promise<void>;
}

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
export declare function getApp(name?: string): FirebaseApp;

/**
 * A (read-only) array of all initialized apps.
 * @public
 */
export declare function getApps(): FirebaseApp[];

/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 *
 * @returns the provider for the service with the matching name
 *
 * @internal
 */
export declare function _getProvider<T extends Name>(app: FirebaseApp, name: T): Provider<T>;

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
export declare function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;

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
export declare function initializeApp(options: FirebaseOptions, config?: FirebaseAppSettings): FirebaseApp;

/**
 * Creates and initializes a FirebaseApp instance.
 *
 * @public
 */
export declare function initializeApp(): FirebaseApp;

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
export declare function initializeServerApp(options: FirebaseOptions | FirebaseApp, config?: FirebaseServerAppSettings): FirebaseServerApp;

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
export declare function initializeServerApp(config?: FirebaseServerAppSettings): FirebaseServerApp;

/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provide object is of type FirebaseApp.
 *
 * @internal
 */
export declare function _isFirebaseApp(obj: FirebaseApp | FirebaseOptions | FirebaseAppSettings): obj is FirebaseApp;

/**
 *
 * @param obj - an object of type FirebaseApp.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
export declare function _isFirebaseServerApp(obj: FirebaseApp | FirebaseServerApp | null | undefined): obj is FirebaseServerApp;

/**
 *
 * @param obj - an object of type FirebaseApp, FirebaseOptions or FirebaseAppSettings.
 *
 * @returns true if the provided object is of type FirebaseServerAppImpl.
 *
 * @internal
 */
export declare function _isFirebaseServerAppSettings(obj: FirebaseApp | FirebaseOptions | FirebaseAppSettings): obj is FirebaseServerAppSettings;

/**
 * Sets log handler for all Firebase SDKs.
 * @param logCallback - An optional custom log handler that executes user code whenever
 * the Firebase SDK makes a logging call.
 *
 * @public
 */
export declare function onLog(logCallback: LogCallback | null, options?: LogOptions): void;

/**
 *
 * @param component - the component to register
 * @returns whether or not the component is registered successfully
 *
 * @internal
 */
export declare function _registerComponent<T extends Name>(component: Component<T>): boolean;

/**
 * Registers a library's name and version for platform logging purposes.
 * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
 * @param version - Current version of that library.
 * @param variant - Bundle variant, e.g., node, rn, etc.
 *
 * @public
 */
export declare function registerVersion(libraryKeyOrName: string, version: string, variant?: string): void;

/**
 *
 * @param app - FirebaseApp instance
 * @param name - service name
 * @param instanceIdentifier - service instance identifier in case the service supports multiple instances
 *
 * @internal
 */
export declare function _removeServiceInstance<T extends Name>(app: FirebaseApp, name: T, instanceIdentifier?: string): void;

/**
 * The current SDK version.
 *
 * @public
 */
export declare const SDK_VERSION: string;

/**
 * @internal
 */
export declare const _serverApps: Map<string, FirebaseServerApp>;

/**
 * Sets log level for all Firebase SDKs.
 *
 * All of the log types above the current log level are captured (i.e. if
 * you set the log level to `info`, errors are logged, but `debug` and
 * `verbose` logs are not).
 *
 * @public
 */
export declare function setLogLevel(logLevel: LogLevelString): void;

export { }
