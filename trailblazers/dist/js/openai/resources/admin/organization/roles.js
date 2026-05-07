"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
const path_1 = require("../../../internal/utils/path.js");
class Roles extends resource_1.APIResource {
    /**
     * Creates a custom role for the organization.
     *
     * @example
     * ```ts
     * const role = await client.admin.organization.roles.create({
     *   permissions: ['string'],
     *   role_name: 'role_name',
     * });
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/roles', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Updates an existing organization role.
     *
     * @example
     * ```ts
     * const role = await client.admin.organization.roles.update(
     *   'role_id',
     * );
     * ```
     */
    update(roleID, body, options) {
        return this._client.post((0, path_1.path) `/organization/roles/${roleID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the roles configured for the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const role of client.admin.organization.roles.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/roles', (pagination_1.NextCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Deletes a custom role from the organization.
     *
     * @example
     * ```ts
     * const role = await client.admin.organization.roles.delete(
     *   'role_id',
     * );
     * ```
     */
    delete(roleID, options) {
        return this._client.delete((0, path_1.path) `/organization/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Roles = Roles;
//# sourceMappingURL=roles.js.map