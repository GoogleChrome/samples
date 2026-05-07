"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invites = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
const path_1 = require("../../../internal/utils/path.js");
class Invites extends resource_1.APIResource {
    /**
     * Create an invite for a user to the organization. The invite must be accepted by
     * the user before they have access to the organization.
     *
     * @example
     * ```ts
     * const invite =
     *   await client.admin.organization.invites.create({
     *     email: 'email',
     *     role: 'reader',
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/invites', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Retrieves an invite.
     *
     * @example
     * ```ts
     * const invite =
     *   await client.admin.organization.invites.retrieve(
     *     'invite_id',
     *   );
     * ```
     */
    retrieve(inviteID, options) {
        return this._client.get((0, path_1.path) `/organization/invites/${inviteID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Returns a list of invites in the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const invite of client.admin.organization.invites.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/invites', (pagination_1.ConversationCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Delete an invite. If the invite has already been accepted, it cannot be deleted.
     *
     * @example
     * ```ts
     * const invite =
     *   await client.admin.organization.invites.delete(
     *     'invite_id',
     *   );
     * ```
     */
    delete(inviteID, options) {
        return this._client.delete((0, path_1.path) `/organization/invites/${inviteID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Invites = Invites;
//# sourceMappingURL=invites.js.map