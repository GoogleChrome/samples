"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeys = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class APIKeys extends resource_1.APIResource {
    /**
     * Retrieves an API key in the project.
     *
     * @example
     * ```ts
     * const projectAPIKey =
     *   await client.admin.organization.projects.apiKeys.retrieve(
     *     'api_key_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    retrieve(apiKeyID, params, options) {
        const { project_id } = params;
        return this._client.get((0, path_1.path) `/organization/projects/${project_id}/api_keys/${apiKeyID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Returns a list of API keys in the project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const projectAPIKey of client.admin.organization.projects.apiKeys.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/api_keys`, (pagination_1.ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Deletes an API key from the project.
     *
     * Returns confirmation of the key deletion, or an error if the key belonged to a
     * service account.
     *
     * @example
     * ```ts
     * const apiKey =
     *   await client.admin.organization.projects.apiKeys.delete(
     *     'api_key_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(apiKeyID, params, options) {
        const { project_id } = params;
        return this._client.delete((0, path_1.path) `/organization/projects/${project_id}/api_keys/${apiKeyID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.APIKeys = APIKeys;
//# sourceMappingURL=api-keys.js.map