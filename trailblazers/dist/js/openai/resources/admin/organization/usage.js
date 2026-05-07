"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usage = void 0;
const resource_1 = require("../../../core/resource.js");
class Usage extends resource_1.APIResource {
    /**
     * Get audio speeches usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.audioSpeeches({
     *     start_time: 0,
     *   });
     * ```
     */
    audioSpeeches(query, options) {
        return this._client.get('/organization/usage/audio_speeches', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get audio transcriptions usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.audioTranscriptions(
     *     { start_time: 0 },
     *   );
     * ```
     */
    audioTranscriptions(query, options) {
        return this._client.get('/organization/usage/audio_transcriptions', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get code interpreter sessions usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.codeInterpreterSessions(
     *     { start_time: 0 },
     *   );
     * ```
     */
    codeInterpreterSessions(query, options) {
        return this._client.get('/organization/usage/code_interpreter_sessions', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get completions usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.completions({
     *     start_time: 0,
     *   });
     * ```
     */
    completions(query, options) {
        return this._client.get('/organization/usage/completions', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get costs details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.costs({
     *     start_time: 0,
     *   });
     * ```
     */
    costs(query, options) {
        return this._client.get('/organization/costs', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get embeddings usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.embeddings({
     *     start_time: 0,
     *   });
     * ```
     */
    embeddings(query, options) {
        return this._client.get('/organization/usage/embeddings', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get images usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.images({
     *     start_time: 0,
     *   });
     * ```
     */
    images(query, options) {
        return this._client.get('/organization/usage/images', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get moderations usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.moderations({
     *     start_time: 0,
     *   });
     * ```
     */
    moderations(query, options) {
        return this._client.get('/organization/usage/moderations', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get vector stores usage details for the organization.
     *
     * @example
     * ```ts
     * const response =
     *   await client.admin.organization.usage.vectorStores({
     *     start_time: 0,
     *   });
     * ```
     */
    vectorStores(query, options) {
        return this._client.get('/organization/usage/vector_stores', {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Usage = Usage;
//# sourceMappingURL=usage.js.map