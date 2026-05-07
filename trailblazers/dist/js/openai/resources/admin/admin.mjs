// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as OrganizationAPI from "./organization/organization.mjs";
import { Organization } from "./organization/organization.mjs";
export class Admin extends APIResource {
    constructor() {
        super(...arguments);
        this.organization = new OrganizationAPI.Organization(this._client);
    }
}
Admin.Organization = Organization;
//# sourceMappingURL=admin.mjs.map