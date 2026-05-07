// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import * as APIKeysAPI from "./api-keys.mjs";
import { APIKeys, } from "./api-keys.mjs";
import * as CertificatesAPI from "./certificates.mjs";
import { Certificates, } from "./certificates.mjs";
import * as RateLimitsAPI from "./rate-limits.mjs";
import { RateLimits, } from "./rate-limits.mjs";
import * as RolesAPI from "./roles.mjs";
import { Roles, } from "./roles.mjs";
import * as ServiceAccountsAPI from "./service-accounts.mjs";
import { ServiceAccounts, } from "./service-accounts.mjs";
import * as GroupsAPI from "./groups/groups.mjs";
import { Groups, } from "./groups/groups.mjs";
import * as UsersAPI from "./users/users.mjs";
import { Users, } from "./users/users.mjs";
import { ConversationCursorPage, } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Projects extends APIResource {
    constructor() {
        super(...arguments);
        this.users = new UsersAPI.Users(this._client);
        this.serviceAccounts = new ServiceAccountsAPI.ServiceAccounts(this._client);
        this.apiKeys = new APIKeysAPI.APIKeys(this._client);
        this.rateLimits = new RateLimitsAPI.RateLimits(this._client);
        this.groups = new GroupsAPI.Groups(this._client);
        this.roles = new RolesAPI.Roles(this._client);
        this.certificates = new CertificatesAPI.Certificates(this._client);
    }
    /**
     * Create a new project in the organization. Projects can be created and archived,
     * but cannot be deleted.
     *
     * @example
     * ```ts
     * const project =
     *   await client.admin.organization.projects.create({
     *     name: 'name',
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/projects', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Retrieves a project.
     *
     * @example
     * ```ts
     * const project =
     *   await client.admin.organization.projects.retrieve(
     *     'project_id',
     *   );
     * ```
     */
    retrieve(projectID, options) {
        return this._client.get(path `/organization/projects/${projectID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Modifies a project in the organization.
     *
     * @example
     * ```ts
     * const project =
     *   await client.admin.organization.projects.update(
     *     'project_id',
     *   );
     * ```
     */
    update(projectID, body, options) {
        return this._client.post(path `/organization/projects/${projectID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Returns a list of projects.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const project of client.admin.organization.projects.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/projects', (ConversationCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Archives a project in the organization. Archived projects cannot be used or
     * updated.
     *
     * @example
     * ```ts
     * const project =
     *   await client.admin.organization.projects.archive(
     *     'project_id',
     *   );
     * ```
     */
    archive(projectID, options) {
        return this._client.post(path `/organization/projects/${projectID}/archive`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
Projects.Users = Users;
Projects.ServiceAccounts = ServiceAccounts;
Projects.APIKeys = APIKeys;
Projects.RateLimits = RateLimits;
Projects.Groups = Groups;
Projects.Roles = Roles;
Projects.Certificates = Certificates;
//# sourceMappingURL=projects.mjs.map