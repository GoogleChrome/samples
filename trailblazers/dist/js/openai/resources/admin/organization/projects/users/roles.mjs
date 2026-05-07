// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../../core/resource.mjs";
import { NextCursorPage } from "../../../../../core/pagination.mjs";
import { path } from "../../../../../internal/utils/path.mjs";
export class Roles extends APIResource {
    /**
     * Assigns a project role to a user within a project.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.users.roles.create(
     *     'user_id',
     *     { project_id: 'project_id', role_id: 'role_id' },
     *   );
     * ```
     */
    create(userID, params, options) {
        const { project_id, ...body } = params;
        return this._client.post(path `/projects/${project_id}/users/${userID}/roles`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the project roles assigned to a user within a project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const roleListResponse of client.admin.organization.projects.users.roles.list(
     *   'user_id',
     *   { project_id: 'project_id' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(userID, params, options) {
        const { project_id, ...query } = params;
        return this._client.getAPIList(path `/projects/${project_id}/users/${userID}/roles`, (NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Unassigns a project role from a user within a project.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.users.roles.delete(
     *     'role_id',
     *     { project_id: 'project_id', user_id: 'user_id' },
     *   );
     * ```
     */
    delete(roleID, params, options) {
        const { project_id, user_id } = params;
        return this._client.delete(path `/projects/${project_id}/users/${user_id}/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=roles.mjs.map