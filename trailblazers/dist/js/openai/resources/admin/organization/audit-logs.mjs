// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import { ConversationCursorPage, } from "../../../core/pagination.mjs";
/**
 * List user actions and configuration changes within this organization.
 */
export class AuditLogs extends APIResource {
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
        return this._client.getAPIList('/organization/audit_logs', (ConversationCursorPage), {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=audit-logs.mjs.map