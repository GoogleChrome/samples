"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogs = void 0;
const resource_1 = require("../../../core/resource.js");
const pagination_1 = require("../../../core/pagination.js");
/**
 * List user actions and configuration changes within this organization.
 */
class AuditLogs extends resource_1.APIResource {
    /**
     * List user actions and configuration changes within this organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const auditLogListResponse of client.admin.organization.auditLogs.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/audit_logs', (pagination_1.ConversationCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.AuditLogs = AuditLogs;
//# sourceMappingURL=audit-logs.js.map