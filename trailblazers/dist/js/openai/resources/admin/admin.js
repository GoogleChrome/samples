"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const tslib_1 = require("../../internal/tslib.js");
const resource_1 = require("../../core/resource.js");
const OrganizationAPI = tslib_1.__importStar(require("./organization/organization.js"));
const organization_1 = require("./organization/organization.js");
class Admin extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.organization = new OrganizationAPI.Organization(this._client);
    }
}
exports.Admin = Admin;
Admin.Organization = organization_1.Organization;
//# sourceMappingURL=admin.js.map