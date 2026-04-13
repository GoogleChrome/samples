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
import { AI } from '../public-types';
import { ApiSettings } from '../types/internal';
/**
 * Initializes an {@link ApiSettings} object from an {@link AI} instance.
 *
 * If this is a Server App, the {@link ApiSettings} object's `getAppCheckToken()` will resolve
 * with the `FirebaseServerAppSettings.appCheckToken`, instead of requiring that an App Check
 * instance is initialized.
 */
export declare function initApiSettings(ai: AI): ApiSettings;
