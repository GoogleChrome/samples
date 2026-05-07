// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { ConversationCursorPage, } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class RateLimits extends APIResource {
    /**
     * Returns the rate limits per model for a project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const projectRateLimit of client.admin.organization.projects.rateLimits.listRateLimits(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    listRateLimits(projectID, query = {}, options) {
        return this._client.getAPIList(path `/organization/projects/${projectID}/rate_limits`, (ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Updates a project rate limit.
     *
     * @example
     * ```ts
     * const projectRateLimit =
     *   await client.admin.organization.projects.rateLimits.updateRateLimit(
     *     'rate_limit_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    updateRateLimit(rateLimitID, params, options) {
        const { project_id, ...body } = params;
        return this._client.post(path `/organization/projects/${project_id}/rate_limits/${rateLimitID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
//# sourceMappingURL=rate-limits.mjs.map