"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Users extends resource_1.APIResource {
    /**
     * Adds a user to a group.
     *
     * @example
     * ```ts
     * const user =
     *   await client.admin.organization.groups.users.create(
     *     'group_id',
     *     { user_id: 'user_id' },
     *   );
     * ```
     */
    create(groupID, body, options) {
        return this._client.post((0, path_1.path) `/organization/groups/${groupID}/users`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the users assigned to a group.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const organizationGroupUser of client.admin.organization.groups.users.list(
     *   'group_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(groupID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/organization/groups/${groupID}/users`, (pagination_1.NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Removes a user from a group.
     *
     * @example
     * ```ts
     * const user =
     *   await client.admin.organization.groups.users.delete(
     *     'user_id',
     *     { group_id: 'group_id' },
     *   );
     * ```
     */
    delete(userID, params, options) {
        const { group_id } = params;
        return this._client.delete((0, path_1.path) `/organization/groups/${group_id}/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Users = Users;
//# sourceMappingURL=users.js.map