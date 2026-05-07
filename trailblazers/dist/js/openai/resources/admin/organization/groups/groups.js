"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groups = void 0;
const tslib_1 = require("../../../../internal/tslib.js");
const resource_1 = require("../../../../core/resource.js");
const RolesAPI = tslib_1.__importStar(require("./roles.js"));
const roles_1 = require("./roles.js");
const UsersAPI = tslib_1.__importStar(require("./users.js"));
const users_1 = require("./users.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Groups extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.users = new UsersAPI.Users(this._client);
        this.roles = new RolesAPI.Roles(this._client);
    }
    /**
     * Creates a new group in the organization.
     *
     * @example
     * ```ts
     * const group = await client.admin.organization.groups.create(
     *   { name: 'x' },
     * );
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/groups', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Updates a group's information.
     *
     * @example
     * ```ts
     * const group = await client.admin.organization.groups.update(
     *   'group_id',
     *   { name: 'x' },
     * );
     * ```
     */
    update(groupID, body, options) {
        return this._client.post((0, path_1.path) `/organization/groups/${groupID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists all groups in the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const group of client.admin.organization.groups.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/groups', (pagination_1.NextCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Deletes a group from the organization.
     *
     * @example
     * ```ts
     * const group = await client.admin.organization.groups.delete(
     *   'group_id',
     * );
     * ```
     */
    delete(groupID, options) {
        return this._client.delete((0, path_1.path) `/organization/groups/${groupID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Groups = Groups;
Groups.Users = users_1.Users;
Groups.Roles = roles_1.Roles;
//# sourceMappingURL=groups.js.map