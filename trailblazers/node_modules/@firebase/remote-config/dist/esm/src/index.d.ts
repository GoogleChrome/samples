/**
 * The Firebase Remote Config Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
declare global {
    interface Window {
        FIREBASE_REMOTE_CONFIG_URL_BASE: string;
    }
}
export * from './api';
export * from './api2';
export * from './public_types';
