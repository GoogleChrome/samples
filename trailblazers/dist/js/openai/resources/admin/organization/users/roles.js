"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Roles extends resource_1.APIResource {
    /**
     * Assigns an organization role to a user within the organization.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.users.roles.create(
     *     'user_id',
     *     { role_id: 'role_id' },
     *   );
     * ```
     */
    create(userID, body, options) {
        return this._client.post((0, path_1.path) `/organization/users/${userID}/roles`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the organization roles assigned to a user within the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const roleListResponse of client.admin.organization.users.roles.list(
     *   'user_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(userID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/organization/users/${userID}/roles`, (pagination_1.NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Unassigns an organization role from a user within the organization.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.users.roles.delete(
     *     'role_id',
     *     { user_id: 'user_id' },
     *   );
     * ```
     */
    delete(roleID, params, options) {
        const { user_id } = params;
        return this._client.delete((0, path_1.path) `/organization/users/${user_id}/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Roles = Roles;
//# sourceMappingURL=roles.js.map