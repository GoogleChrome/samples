"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projects = void 0;
const tslib_1 = require("../../../../internal/tslib.js");
const resource_1 = require("../../../../core/resource.js");
const APIKeysAPI = tslib_1.__importStar(require("./api-keys.js"));
const api_keys_1 = require("./api-keys.js");
const CertificatesAPI = tslib_1.__importStar(require("./certificates.js"));
const certificates_1 = require("./certificates.js");
const RateLimitsAPI = tslib_1.__importStar(require("./rate-limits.js"));
const rate_limits_1 = require("./rate-limits.js");
const RolesAPI = tslib_1.__importStar(require("./roles.js"));
const roles_1 = require("./roles.js");
const ServiceAccountsAPI = tslib_1.__importStar(require("./service-accounts.js"));
const service_accounts_1 = require("./service-accounts.js");
const GroupsAPI = tslib_1.__importStar(require("./groups/groups.js"));
const groups_1 = require("./groups/groups.js");
const UsersAPI = tslib_1.__importStar(require("./users/users.js"));
const users_1 = require("./users/users.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Projects extends resource_1.APIResource {
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
        return this._client.get((0, path_1.path) `/organization/projects/${projectID}`, {
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
        return this._client.post((0, path_1.path) `/organization/projects/${projectID}`, {
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
        return this._client.getAPIList('/organization/projects', (pagination_1.ConversationCursorPage), {
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
        return this._client.post((0, path_1.path) `/organization/projects/${projectID}/archive`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.Projects = Projects;
Projects.Users = users_1.Users;
Projects.ServiceAccounts = service_accounts_1.ServiceAccounts;
Projects.APIKeys = api_keys_1.APIKeys;
Projects.RateLimits = rate_limits_1.RateLimits;
Projects.Groups = groups_1.Groups;
Projects.Roles = roles_1.Roles;
Projects.Certificates = certificates_1.Certificates;
//# sourceMappingURL=projects.js.map