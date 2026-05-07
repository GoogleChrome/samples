// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import * as RolesAPI from "./roles.mjs";
import { Roles, } from "./roles.mjs";
import { ConversationCursorPage, } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Users extends APIResource {
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
        return this._client.get(path `/organization/users/${userID}`, {
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
        return this._client.post(path `/organization/users/${userID}`, {
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
        return this._client.getAPIList('/organization/users', (ConversationCursorPage), {
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
        return this._client.delete(path `/organization/users/${userID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
Users.Roles = Roles;
//# sourceMappingURL=users.mjs.map