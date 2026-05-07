import { APIResource } from "../../core/resource.js";
import * as OrganizationAPI from "./organization/organization.js";
import { Organization } from "./organization/organization.js";
export declare class Admin extends APIResource {
    organization: OrganizationAPI.Organization;
}
export declare namespace Admin {
    export { Organization as Organization };
}
//# sourceMappingURL=admin.d.ts.map