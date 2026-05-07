"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const tslib_1 = require("../../../internal/tslib.js");
const resource_1 = require("../../../core/resource.js");
const AdminAPIKeysAPI = tslib_1.__importStar(require("./admin-api-keys.js"));
const admin_api_keys_1 = require("./admin-api-keys.js");
const AuditLogsAPI = tslib_1.__importStar(require("./audit-logs.js"));
const audit_logs_1 = require("./audit-logs.js");
const CertificatesAPI = tslib_1.__importStar(require("./certificates.js"));
const certificates_1 = require("./certificates.js");
const InvitesAPI = tslib_1.__importStar(require("./invites.js"));
const invites_1 = require("./invites.js");
const RolesAPI = tslib_1.__importStar(require("./roles.js"));
const roles_1 = require("./roles.js");
const UsageAPI = tslib_1.__importStar(require("./usage.js"));
const usage_1 = require("./usage.js");
const GroupsAPI = tslib_1.__importStar(require("./groups/groups.js"));
const groups_1 = require("./groups/groups.js");
const ProjectsAPI = tslib_1.__importStar(require("./projects/projects.js"));
const projects_1 = require("./projects/projects.js");
const UsersAPI = tslib_1.__importStar(require("./users/users.js"));
const users_1 = require("./users/users.js");
class Organization extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.auditLogs = new AuditLogsAPI.AuditLogs(this._client);
        this.adminAPIKeys = new AdminAPIKeysAPI.AdminAPIKeys(this._client);
        this.usage = new UsageAPI.Usage(this._client);
        this.invites = new InvitesAPI.Invites(this._client);
        this.users = new UsersAPI.Users(this._client);
        this.groups = new GroupsAPI.Groups(this._client);
        this.roles = new RolesAPI.Roles(this._client);
        this.certificates = new CertificatesAPI.Certificates(this._client);
        this.projects = new ProjectsAPI.Projects(this._client);
    }
}
exports.Organization = Organization;
Organization.AuditLogs = audit_logs_1.AuditLogs;
Organization.AdminAPIKeys = admin_api_keys_1.AdminAPIKeys;
Organization.Usage = usage_1.Usage;
Organization.Invites = invites_1.Invites;
Organization.Users = users_1.Users;
Organization.Groups = groups_1.Groups;
Organization.Roles = roles_1.Roles;
Organization.Certificates = certificates_1.Certificates;
Organization.Projects = projects_1.Projects;
//# sourceMappingURL=organization.js.map