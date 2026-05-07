import { APIResource } from "../../core/resource.mjs";
import * as OrganizationAPI from "./organization/organization.mjs";
import { Organization } from "./organization/organization.mjs";
export declare class Admin extends APIResource {
    organization: OrganizationAPI.Organization;
}
export declare namespace Admin {
    export { Organization as Organization };
}
//# sourceMappingURL=admin.d.mts.map