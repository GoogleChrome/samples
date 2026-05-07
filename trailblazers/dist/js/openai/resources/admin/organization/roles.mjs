// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import { NextCursorPage } from "../../../core/pagination.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Roles extends APIResource {
    /**
     * Creates a custom role for the organization.
     *
     * @example
     * ```ts
     * const role = await client.admin.organization.roles.create({
     *   permissions: ['string'],
     *   role_name: 'role_name',
     * });
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/roles', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Updates an existing organization role.
     *
     * @example
     * ```ts
     * const role = await client.admin.organization.roles.update(
     *   'role_id',
     * );
     * ```
     */
    update(roleID, body, options) {
        return this._client.post(path `/organization/roles/${roleID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Lists the roles configured for the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const role of client.admin.organization.roles.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/roles', (NextCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Deletes a custom role from the organization.
     *
     * @example
     * ```ts
     * const role = await client.admin.organization.roles.delete(
     *   'role_id',
     * );
     * ```
     */
    delete(roleID, options) {
        return this._client.delete(path `/organization/roles/${roleID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=roles.mjs.map