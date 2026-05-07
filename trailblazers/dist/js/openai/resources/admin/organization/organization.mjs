// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import * as AdminAPIKeysAPI from "./admin-api-keys.mjs";
import { AdminAPIKeys, } from "./admin-api-keys.mjs";
import * as AuditLogsAPI from "./audit-logs.mjs";
import { AuditLogs } from "./audit-logs.mjs";
import * as CertificatesAPI from "./certificates.mjs";
import { Certificates, } from "./certificates.mjs";
import * as InvitesAPI from "./invites.mjs";
import { Invites, } from "./invites.mjs";
import * as RolesAPI from "./roles.mjs";
import { Roles, } from "./roles.mjs";
import * as UsageAPI from "./usage.mjs";
import { Usage, } from "./usage.mjs";
import * as GroupsAPI from "./groups/groups.mjs";
import { Groups, } from "./groups/groups.mjs";
import * as ProjectsAPI from "./projects/projects.mjs";
import { Projects, } from "./projects/projects.mjs";
import * as UsersAPI from "./users/users.mjs";
import { Users, } from "./users/users.mjs";
export class Organization extends APIResource {
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
Organization.AuditLogs = AuditLogs;
Organization.AdminAPIKeys = AdminAPIKeys;
Organization.Usage = Usage;
Organization.Invites = Invites;
Organization.Users = Users;
Organization.Groups = Groups;
Organization.Roles = Roles;
Organization.Certificates = Certificates;
Organization.Projects = Projects;
//# sourceMappingURL=organization.mjs.map