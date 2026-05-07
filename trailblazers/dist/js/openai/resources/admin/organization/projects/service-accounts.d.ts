import { APIResource } from "../../../../core/resource.js";
import { APIPromise } from "../../../../core/api-promise.js";
import { ConversationCursorPage, type ConversationCursorPageParams, PagePromise } from "../../../../core/pagination.js";
import { RequestOptions } from "../../../../internal/request-options.js";
export declare class ServiceAccounts extends APIResource {
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
    create(projectID: string, body: ServiceAccountCreateParams, options?: RequestOptions): APIPromise<ServiceAccountCreateResponse>;
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
    retrieve(serviceAccountID: string, params: ServiceAccountRetrieveParams, options?: RequestOptions): APIPromise<ProjectServiceAccount>;
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
    list(projectID: string, query?: ServiceAccountListParams | null | undefined, options?: RequestOptions): PagePromise<ProjectServiceAccountsPage, ProjectServiceAccount>;
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
    delete(serviceAccountID: string, params: ServiceAccountDeleteParams, options?: RequestOptions): APIPromise<ServiceAccountDeleteResponse>;
}
export type ProjectServiceAccountsPage = ConversationCursorPage<ProjectServiceAccount>;
/**
 * Represents an individual service account in a project.
 */
export interface ProjectServiceAccount {
    /**
     * The identifier, which can be referenced in API endpoints
     */
    id: string;
    /**
     * The Unix timestamp (in seconds) of when the service account was created
     */
    created_at: number;
    /**
     * The name of the service account
     */
    name: string;
    /**
     * The object type, which is always `organization.project.service_account`
     */
    object: 'organization.project.service_account';
    /**
     * `owner` or `member`
     */
    role: 'owner' | 'member';
}
export interface ServiceAccountCreateResponse {
    id: string;
    api_key: ServiceAccountCreateResponse.APIKey | null;
    created_at: number;
    name: string;
    object: 'organization.project.service_account';
    /**
     * Service accounts can only have one role of type `member`
     */
    role: 'member';
}
export declare namespace ServiceAccountCreateResponse {
    interface APIKey {
        id: string;
        created_at: number;
        name: string;
        /**
         * The object type, which is always `organization.project.service_account.api_key`
         */
        object: 'organization.project.service_account.api_key';
        value: string;
    }
}
export interface ServiceAccountDeleteResponse {
    id: string;
    deleted: boolean;
    object: 'organization.project.service_account.deleted';
}
export interface ServiceAccountCreateParams {
    /**
     * The name of the service account being created.
     */
    name: string;
}
export interface ServiceAccountRetrieveParams {
    /**
     * The ID of the project.
     */
    project_id: string;
}
export interface ServiceAccountListParams extends ConversationCursorPageParams {
}
export interface ServiceAccountDeleteParams {
    /**
     * The ID of the project.
     */
    project_id: string;
}
export declare namespace ServiceAccounts {
    export { type ProjectServiceAccount as ProjectServiceAccount, type ServiceAccountCreateResponse as ServiceAccountCreateResponse, type ServiceAccountDeleteResponse as ServiceAccountDeleteResponse, type ProjectServiceAccountsPage as ProjectServiceAccountsPage, type ServiceAccountCreateParams as ServiceAccountCreateParams, type ServiceAccountRetrieveParams as ServiceAccountRetrieveParams, type ServiceAccountListParams as ServiceAccountListParams, type ServiceAccountDeleteParams as ServiceAccountDeleteParams, };
}
//# sourceMappingURL=service-accounts.d.ts.map