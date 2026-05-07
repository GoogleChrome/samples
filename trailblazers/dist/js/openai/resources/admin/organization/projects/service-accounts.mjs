// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../../core/resource.mjs";
import { ConversationCursorPage, } from "../../../../core/pagination.mjs";
import { path } from "../../../../internal/utils/path.mjs";
export class ServiceAccounts extends APIResource {
    /**
     * Creates a new service account in the project. This also returns an unredacted
     * API key for the service account.
     *
     * @example
     * ```ts
     * const serviceAccount =
     *   await client.admin.organization.projects.serviceAccounts.create(
     *     'project_id',
     *     { name: 'name' },
     *   );
     * ```
     */
    create(projectID, body, options) {
        return this._client.post(path `/organization/projects/${projectID}/service_accounts`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Retrieves a service account in the project.
     *
     * @example
     * ```ts
     * const projectServiceAccount =
     *   await client.admin.organization.projects.serviceAccounts.retrieve(
     *     'service_account_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    retrieve(serviceAccountID, params, options) {
        const { project_id } = params;
        return this._client.get(path `/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Returns a list of service accounts in the project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const projectServiceAccount of client.admin.organization.projects.serviceAccounts.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID, query = {}, options) {
        return this._client.getAPIList(path `/organization/projects/${projectID}/service_accounts`, (ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Deletes a service account from the project.
     *
     * Returns confirmation of service account deletion, or an error if the project is
     * archived (archived projects have no service accounts).
     *
     * @example
     * ```ts
     * const serviceAccount =
     *   await client.admin.organization.projects.serviceAccounts.delete(
     *     'service_account_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(serviceAccountID, params, options) {
        const { project_id } = params;
        return this._client.delete(path `/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, { ...options, __security: { adminAPIKeyAuth: true } });
    }
}
//# sourceMappingURL=service-accounts.mjs.map