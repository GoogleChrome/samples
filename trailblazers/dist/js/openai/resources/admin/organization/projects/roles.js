"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Roles extends resource_1.APIResource {
    /**
     * Creates a custom role for a project.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.roles.create(
     *     'project_id',
     *     { permissions: ['string'], role_name: 'role_name' },
     *   );
     * ```
     */
    create(projectID, body, options) {
        return this._client.post((0, path_1.path) `/projects/${projectID}/roles`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Updates an existing project role.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.roles.update(
     *     'role_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    update(roleID, params, options) {
        const { project_id, ...body } = params;
        return this._client.post((0, path_1.path) `/projects/${project_id}/roles/${roleID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the roles configured for a project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const role of client.admin.organization.projects.roles.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/projects/${projectID}/roles`, (pagination_1.NextCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Deletes a custom role from a project.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.roles.delete(
     *     'role_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(roleID, params, options) {
        const { project_id } = params;
        return this._client.delete((0, path_1.path) `/projects/${project_id}/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Roles = Roles;
//# sourceMappingURL=roles.js.map