// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { NextCursorPage } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Roles extends APIResource {
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
        return this._client.post(path `/projects/${projectID}/roles`, {
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
        return this._client.post(path `/projects/${project_id}/roles/${roleID}`, {
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
        return this._client.getAPIList(path `/projects/${projectID}/roles`, (NextCursorPage), {
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
        return this._client.delete(path `/projects/${project_id}/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=roles.mjs.map