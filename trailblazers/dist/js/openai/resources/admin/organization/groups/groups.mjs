// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import * as RolesAPI from "./roles.mjs";
import { Roles, } from "./roles.mjs";
import * as UsersAPI from "./users.mjs";
import { Users, } from "./users.mjs";
import { NextCursorPage } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Groups extends APIResource {
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
        return this._client.post(path `/organization/groups/${groupID}`, {
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
        return this._client.getAPIList('/organization/groups', (NextCursorPage), {
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
        return this._client.delete(path `/organization/groups/${groupID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
Groups.Users = Users;
Groups.Roles = Roles;
//# sourceMappingURL=groups.mjs.map