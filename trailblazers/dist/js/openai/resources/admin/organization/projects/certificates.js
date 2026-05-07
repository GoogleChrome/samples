"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificates = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class Certificates extends resource_1.APIResource {
    /**
     * List certificates for this project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const certificateListResponse of client.admin.organization.projects.certificates.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/certificates`, (pagination_1.ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Activate certificates at the project level.
     *
     * You can atomically and idempotently activate up to 10 certificates at a time.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const certificateActivateResponse of client.admin.organization.projects.certificates.activate(
     *   'project_id',
     *   { certificate_ids: ['cert_abc'] },
     * )) {
     *   // ...
     * }
     * ```
     */
    activate(projectID, body, options) {
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/certificates/activate`, (pagination_1.Page), { body, method: 'post', ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Deactivate certificates at the project level. You can atomically and
     * idempotently deactivate up to 10 certificates at a time.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const certificateDeactivateResponse of client.admin.organization.projects.certificates.deactivate(
     *   'project_id',
     *   { certificate_ids: ['cert_abc'] },
     * )) {
     *   // ...
     * }
     * ```
     */
    deactivate(projectID, body, options) {
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/certificates/deactivate`, (pagination_1.Page), { body, method: 'post', ...options, __security: { adminAPIKeyAuth: true } });
    }
}
exports.Certificates = Certificates;
//# sourceMappingURL=certificates.js.map