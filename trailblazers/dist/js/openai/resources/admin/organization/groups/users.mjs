// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { NextCursorPage } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Users extends APIResource {
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
        return this._client.post(path `/organization/groups/${groupID}/users`, {
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
        return this._client.getAPIList(path `/organization/groups/${groupID}/users`, (NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.delete(path `/organization/groups/${group_id}/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=users.mjs.map