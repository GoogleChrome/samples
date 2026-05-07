"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAPIKeys = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
const path_1 = require("../../../internal/utils/path.js");
class AdminAPIKeys extends resource_1.APIResource {
    /**
     * Create an organization admin API key
     *
     * @example
     * ```ts
     * const adminAPIKey =
     *   await client.admin.organization.adminAPIKeys.create({
     *     name: 'New Admin Key',
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/admin_api_keys', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Retrieve a single organization API key
     *
     * @example
     * ```ts
     * const adminAPIKey =
     *   await client.admin.organization.adminAPIKeys.retrieve(
     *     'key_id',
     *   );
     * ```
     */
    retrieve(keyID, options) {
        return this._client.get((0, path_1.path) `/organization/admin_api_keys/${keyID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * List organization API keys
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const adminAPIKey of client.admin.organization.adminAPIKeys.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/admin_api_keys', (pagination_1.CursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Delete an organization admin API key
     *
     * @example
     * ```ts
     * const adminAPIKey =
     *   await client.admin.organization.adminAPIKeys.delete(
     *     'key_id',
     *   );
     * ```
     */
    delete(keyID, options) {
        return this._client.delete((0, path_1.path) `/organization/admin_api_keys/${keyID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.AdminAPIKeys = AdminAPIKeys;
//# sourceMappingURL=admin-api-keys.js.map