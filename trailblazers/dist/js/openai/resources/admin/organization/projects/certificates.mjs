// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { ConversationCursorPage, Page, } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class Certificates extends APIResource {
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
        return this._client.getAPIList(path `/organization/projects/${projectID}/certificates`, (ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.getAPIList(path `/organization/projects/${projectID}/certificates/activate`, (Page), { body, method: 'post', ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.getAPIList(path `/organization/projects/${projectID}/certificates/deactivate`, (Page), { body, method: 'post', ...options, __security: { adminAPIKeyAuth: true } });
    }
}
//# sourceMappingURL=certificates.mjs.map