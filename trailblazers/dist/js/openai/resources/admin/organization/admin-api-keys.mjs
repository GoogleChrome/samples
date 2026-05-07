// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import { CursorPage } from "../../../core/pagination.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class AdminAPIKeys extends APIResource {
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
        return this._client.get(path `/organization/admin_api_keys/${keyID}`, {
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
        return this._client.getAPIList('/organization/admin_api_keys', (CursorPage), {
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
        return this._client.delete(path `/organization/admin_api_keys/${keyID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=admin-api-keys.mjs.map