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
import { ErrorFactory } from '@firebase/util';
export declare const enum ErrorCode {
    ALREADY_INITIALIZED = "already-initialized",
    REGISTRATION_WINDOW = "registration-window",
    REGISTRATION_PROJECT_ID = "registration-project-id",
    REGISTRATION_API_KEY = "registration-api-key",
    REGISTRATION_APP_ID = "registration-app-id",
    STORAGE_OPEN = "storage-open",
    STORAGE_GET = "storage-get",
    STORAGE_SET = "storage-set",
    STORAGE_DELETE = "storage-delete",
    FETCH_NETWORK = "fetch-client-network",
    FETCH_TIMEOUT = "fetch-timeout",
    FETCH_THROTTLE = "fetch-throttle",
    FETCH_PARSE = "fetch-client-parse",
    FETCH_STATUS = "fetch-status",
    INDEXED_DB_UNAVAILABLE = "indexed-db-unavailable",
    CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS = "custom-signal-max-allowed-signals",
    CONFIG_UPDATE_STREAM_ERROR = "stream-error",
    CONFIG_UPDATE_UNAVAILABLE = "realtime-unavailable",
    CONFIG_UPDATE_MESSAGE_INVALID = "update-message-invalid",
    CONFIG_UPDATE_NOT_FETCHED = "update-not-fetched",
    ANALYTICS_UNAVAILABLE = "analytics-unavailable"
}
interface ErrorParams {
    [ErrorCode.STORAGE_OPEN]: {
        originalErrorMessage: string | undefined;
    };
    [ErrorCode.STORAGE_GET]: {
        originalErrorMessage: string | undefined;
    };
    [ErrorCode.STORAGE_SET]: {
        originalErrorMessage: string | undefined;
    };
    [ErrorCode.STORAGE_DELETE]: {
        originalErrorMessage: string | undefined;
    };
    [ErrorCode.FETCH_NETWORK]: {
        originalErrorMessage: string;
    };
    [ErrorCode.FETCH_THROTTLE]: {
        throttleEndTimeMillis: number;
    };
    [ErrorCode.FETCH_PARSE]: {
        originalErrorMessage: string;
    };
    [ErrorCode.FETCH_STATUS]: {
        httpStatus: number;
    };
    [ErrorCode.CUSTOM_SIGNAL_MAX_ALLOWED_SIGNALS]: {
        maxSignals: number;
    };
    [ErrorCode.CONFIG_UPDATE_STREAM_ERROR]: {
        originalErrorMessage: string;
    };
    [ErrorCode.CONFIG_UPDATE_UNAVAILABLE]: {
        originalErrorMessage: string;
    };
    [ErrorCode.CONFIG_UPDATE_MESSAGE_INVALID]: {
        originalErrorMessage: string;
    };
    [ErrorCode.CONFIG_UPDATE_NOT_FETCHED]: {
        originalErrorMessage: string;
    };
    [ErrorCode.ANALYTICS_UNAVAILABLE]: {
        originalErrorMessage: string;
    };
}
export declare const ERROR_FACTORY: ErrorFactory<ErrorCode, ErrorParams>;
export declare function hasErrorCode(e: Error, errorCode: ErrorCode): boolean;
export {};
