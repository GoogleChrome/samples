"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const tslib_1 = require("../../../../../internal/tslib.js");
const resource_1 = require("../../../../../core/resource.js");
const RolesAPI = tslib_1.__importStar(require("./roles.js"));
const roles_1 = require("./roles.js");
const pagination_1 = require("../../../../../core/pagination.js");
const path_1 = require("../../../../../internal/utils/path.js");
class Users extends resource_1.APIResource {
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
        return this._client.post((0, path_1.path) `/organization/projects/${projectID}/users`, {
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
        return this._client.get((0, path_1.path) `/organization/projects/${project_id}/users/${userID}`, {
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
        return this._client.post((0, path_1.path) `/organization/projects/${project_id}/users/${userID}`, {
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
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/users`, (pagination_1.ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.delete((0, path_1.path) `/organization/projects/${project_id}/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Users = Users;
Users.Roles = roles_1.Roles;
//# sourceMappingURL=users.js.map