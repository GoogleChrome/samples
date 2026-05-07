// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../../core/resource.mjs";
import * as RolesAPI from "./roles.mjs";
import { Roles, } from "./roles.mjs";
import { ConversationCursorPage, } from "../../../../../core/pagination.mjs";
import { path } from "../../../../../internal/utils/path.mjs";
export class Users extends APIResource {
    constructor() {
        super(...arguments);
        this.roles = new RolesAPI.Roles(this._client);
    }
    /**
     * Adds a user to the project. Users must already be members of the organization to
     * be added to a project.
     *
     * @example
     * ```ts
     * const projectUser =
     *   await client.admin.organization.projects.users.create(
     *     'project_id',
     *     { role: 'role' },
     *   );
     * ```
     */
    create(projectID, body, options) {
        return this._client.post(path `/organization/projects/${projectID}/users`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Retrieves a user in the project.
     *
     * @example
     * ```ts
     * const projectUser =
     *   await client.admin.organization.projects.users.retrieve(
     *     'user_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    retrieve(userID, params, options) {
        const { project_id } = params;
        return this._client.get(path `/organization/projects/${project_id}/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Modifies a user's role in the project.
     *
     * @example
     * ```ts
     * const projectUser =
     *   await client.admin.organization.projects.users.update(
     *     'user_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    update(userID, params, options) {
        const { project_id, ...body } = params;
        return this._client.post(path `/organization/projects/${project_id}/users/${userID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Returns a list of users in the project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const projectUser of client.admin.organization.projects.users.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID, query = {}, options) {
        return this._client.getAPIList(path `/organization/projects/${projectID}/users`, (ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Deletes a user from the project.
     *
     * Returns confirmation of project user deletion, or an error if the project is
     * archived (archived projects have no users).
     *
     * @example
     * ```ts
     * const user =
     *   await client.admin.organization.projects.users.delete(
     *     'user_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(userID, params, options) {
        const { project_id } = params;
        return this._client.delete(path `/organization/projects/${project_id}/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
Users.Roles = Roles;
//# sourceMappingURL=users.mjs.map