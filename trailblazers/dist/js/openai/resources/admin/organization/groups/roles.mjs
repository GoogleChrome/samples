// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { NextCursorPage } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Roles extends APIResource {
    /**
     * Assigns an organization role to a group within the organization.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.groups.roles.create(
     *     'group_id',
     *     { role_id: 'role_id' },
     *   );
     * ```
     */
    create(groupID, body, options) {
        return this._client.post(path `/organization/groups/${groupID}/roles`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the organization roles assigned to a group within the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const roleListResponse of client.admin.organization.groups.roles.list(
     *   'group_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(groupID, query = {}, options) {
        return this._client.getAPIList(path `/organization/groups/${groupID}/roles`, (NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Unassigns an organization role from a group within the organization.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.groups.roles.delete(
     *     'role_id',
     *     { group_id: 'group_id' },
     *   );
     * ```
     */
    delete(roleID, params, options) {
        const { group_id } = params;
        return this._client.delete(path `/organization/groups/${group_id}/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=roles.mjs.map