// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { NextCursorPage } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Roles extends APIResource {
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
        return this._client.post(path `/organization/users/${userID}/roles`, {
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
        return this._client.getAPIList(path `/organization/users/${userID}/roles`, (NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.delete(path `/organization/users/${user_id}/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=roles.mjs.map