/**
 * The Firebase Analytics Web SDK.
 * This SDK does not work in a Node.js environment.
 *
 * @packageDocumentation
 */
import '@firebase/installations';
declare global {
    interface Window {
        [key: string]: unknown;
    }
}
export * from './api';
export * from './public-types';
