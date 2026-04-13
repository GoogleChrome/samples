/**
 * The Firebase AI Web SDK.
 *
 * @packageDocumentation
 */
import { LanguageModel } from './types/language-model';
declare global {
    interface Window {
        LanguageModel: LanguageModel;
    }
}
export * from './api';
export * from './public-types';
