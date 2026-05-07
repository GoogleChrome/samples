"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groups = void 0;
const tslib_1 = require("../../../../../internal/tslib.js");
const resource_1 = require("../../../../../core/resource.js");
const RolesAPI = tslib_1.__importStar(require("./roles.js"));
const roles_1 = require("./roles.js");
const pagination_1 = require("../../../../../core/pagination.js");
const path_1 = require("../../../../../internal/utils/path.js");
class Groups extends resource_1.APIResource {
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
        return this._client.post((0, path_1.path) `/organization/projects/${projectID}/groups`, {
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
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/groups`, (pagination_1.NextCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.delete((0, path_1.path) `/organization/projects/${project_id}/groups/${groupID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Groups = Groups;
Groups.Roles = roles_1.Roles;
//# sourceMappingURL=groups.js.map