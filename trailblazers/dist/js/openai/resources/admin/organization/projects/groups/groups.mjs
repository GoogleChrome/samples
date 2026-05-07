// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../../core/resource.mjs";
import * as RolesAPI from "./roles.mjs";
import { Roles, } from "./roles.mjs";
import { NextCursorPage } from "../../../../../core/pagination.mjs";
import { path } from "../../../../../internal/utils/path.mjs";
export class Groups extends APIResource {
    constructor() {
        super(...arguments);
        this.roles = new RolesAPI.Roles(this._client);
    }
    /**
     * Grants a group access to a project.
     *
     * @example
     * ```ts
     * const projectGroup =
     *   await client.admin.organization.projects.groups.create(
     *     'project_id',
     *     { group_id: 'group_id', role: 'role' },
     *   );
     * ```
     */
    create(projectID, body, options) {
        return this._client.post(path `/organization/projects/${projectID}/groups`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the groups that have access to a project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const projectGroup of client.admin.organization.projects.groups.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID, query = {}, options) {
        return this._client.getAPIList(path `/organization/projects/${projectID}/groups`, (NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Revokes a group's access to a project.
     *
     * @example
     * ```ts
     * const group =
     *   await client.admin.organization.projects.groups.delete(
     *     'group_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(groupID, params, options) {
        const { project_id } = params;
        return this._client.delete(path `/organization/projects/${project_id}/groups/${groupID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
Groups.Roles = Roles;
//# sourceMappingURL=groups.mjs.map