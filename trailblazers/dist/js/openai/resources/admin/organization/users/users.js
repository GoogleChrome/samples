"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const tslib_1 = require("../../../../internal/tslib.js");
const resource_1 = require("../../../../core/resource.js");
const RolesAPI = tslib_1.__importStar(require("./roles.js"));
const roles_1 = require("./roles.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Users extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.roles = new RolesAPI.Roles(this._client);
    }
    /**
     * Retrieves a user by their identifier.
     *
     * @example
     * ```ts
     * const organizationUser =
     *   await client.admin.organization.users.retrieve('user_id');
     * ```
     */
    retrieve(userID, options) {
        return this._client.get((0, path_1.path) `/organization/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Modifies a user's role in the organization.
     *
     * @example
     * ```ts
     * const organizationUser =
     *   await client.admin.organization.users.update('user_id');
     * ```
     */
    update(userID, body, options) {
        return this._client.post((0, path_1.path) `/organization/users/${userID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists all of the users in the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const organizationUser of client.admin.organization.users.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/users', (pagination_1.ConversationCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Deletes a user from the organization.
     *
     * @example
     * ```ts
     * const user = await client.admin.organization.users.delete(
     *   'user_id',
     * );
     * ```
     */
    delete(userID, options) {
        return this._client.delete((0, path_1.path) `/organization/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Users = Users;
Users.Roles = roles_1.Roles;
//# sourceMappingURL=users.js.map