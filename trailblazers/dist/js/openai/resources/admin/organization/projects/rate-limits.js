"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimits = void 0;
const resource_1 = require("../../../../core/resource.js");
const pagination_1 = require("../../../../core/pagination.js");
const path_1 = require("../../../../internal/utils/path.js");
class RateLimits extends resource_1.APIResource {
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
        return this._client.getAPIList((0, path_1.path) `/organization/projects/${projectID}/rate_limits`, (pagination_1.ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
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
        return this._client.post((0, path_1.path) `/organization/projects/${project_id}/rate_limits/${rateLimitID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
}
exports.RateLimits = RateLimits;
//# sourceMappingURL=rate-limits.js.map