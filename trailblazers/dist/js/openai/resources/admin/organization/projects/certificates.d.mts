import { APIResource } from "../../../../core/resource.mjs";
import { ConversationCursorPage, type ConversationCursorPageParams, Page, PagePromise } from "../../../../core/pagination.mjs";
import { RequestOptions } from "../../../../internal/request-options.mjs";
export declare class Certificates extends APIResource {
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
    list(projectID: string, query?: CertificateListParams | null | undefined, options?: RequestOptions): PagePromise<CertificateListResponsesPage, CertificateListResponse>;
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
    activate(projectID: string, body: CertificateActivateParams, options?: RequestOptions): PagePromise<CertificateActivateResponsesPage, CertificateActivateResponse>;
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
    deactivate(projectID: string, body: CertificateDeactivateParams, options?: RequestOptions): PagePromise<CertificateDeactivateResponsesPage, CertificateDeactivateResponse>;
}
export type CertificateListResponsesPage = ConversationCursorPage<CertificateListResponse>;
export type CertificateActivateResponsesPage = Page<CertificateActivateResponse>;
export type CertificateDeactivateResponsesPage = Page<CertificateDeactivateResponse>;
/**
 * Represents an individual certificate configured at the project level.
 */
export interface CertificateListResponse {
    /**
     * The identifier, which can be referenced in API endpoints
     */
    id: string;
    /**
     * Whether the certificate is currently active at the project level.
     */
    active: boolean;
    certificate_details: CertificateListResponse.CertificateDetails;
    /**
     * The Unix timestamp (in seconds) of when the certificate was uploaded.
     */
    created_at: number;
    /**
     * The name of the certificate.
     */
    name: string | null;
    /**
     * The object type, which is always `organization.project.certificate`.
     */
    object: 'organization.project.certificate';
}
export declare namespace CertificateListResponse {
    interface CertificateDetails {
        /**
         * The Unix timestamp (in seconds) of when the certificate expires.
         */
        expires_at?: number;
        /**
         * The Unix timestamp (in seconds) of when the certificate becomes valid.
         */
        valid_at?: number;
    }
}
/**
 * Represents an individual certificate configured at the project level.
 */
export interface CertificateActivateResponse {
    /**
     * The identifier, which can be referenced in API endpoints
     */
    id: string;
    /**
     * Whether the certificate is currently active at the project level.
     */
    active: boolean;
    certificate_details: CertificateActivateResponse.CertificateDetails;
    /**
     * The Unix timestamp (in seconds) of when the certificate was uploaded.
     */
    created_at: number;
    /**
     * The name of the certificate.
     */
    name: string | null;
    /**
     * The object type, which is always `organization.project.certificate`.
     */
    object: 'organization.project.certificate';
}
export declare namespace CertificateActivateResponse {
    interface CertificateDetails {
        /**
         * The Unix timestamp (in seconds) of when the certificate expires.
         */
        expires_at?: number;
        /**
         * The Unix timestamp (in seconds) of when the certificate becomes valid.
         */
        valid_at?: number;
    }
}
/**
 * Represents an individual certificate configured at the project level.
 */
export interface CertificateDeactivateResponse {
    /**
     * The identifier, which can be referenced in API endpoints
     */
    id: string;
    /**
     * Whether the certificate is currently active at the project level.
     */
    active: boolean;
    certificate_details: CertificateDeactivateResponse.CertificateDetails;
    /**
     * The Unix timestamp (in seconds) of when the certificate was uploaded.
     */
    created_at: number;
    /**
     * The name of the certificate.
     */
    name: string | null;
    /**
     * The object type, which is always `organization.project.certificate`.
     */
    object: 'organization.project.certificate';
}
export declare namespace CertificateDeactivateResponse {
    interface CertificateDetails {
        /**
         * The Unix timestamp (in seconds) of when the certificate expires.
         */
        expires_at?: number;
        /**
         * The Unix timestamp (in seconds) of when the certificate becomes valid.
         */
        valid_at?: number;
    }
}
export interface CertificateListParams extends ConversationCursorPageParams {
    /**
     * Sort order by the `created_at` timestamp of the objects. `asc` for ascending
     * order and `desc` for descending order.
     */
    order?: 'asc' | 'desc';
}
export interface CertificateActivateParams {
    certificate_ids: Array<string>;
}
export interface CertificateDeactivateParams {
    certificate_ids: Array<string>;
}
export declare namespace Certificates {
    export { type CertificateListResponse as CertificateListResponse, type CertificateActivateResponse as CertificateActivateResponse, type CertificateDeactivateResponse as CertificateDeactivateResponse, type CertificateListResponsesPage as CertificateListResponsesPage, type CertificateActivateResponsesPage as CertificateActivateResponsesPage, type CertificateDeactivateResponsesPage as CertificateDeactivateResponsesPage, type CertificateListParams as CertificateListParams, type CertificateActivateParams as CertificateActivateParams, type CertificateDeactivateParams as CertificateDeactivateParams, };
}
//# sourceMappingURL=certificates.d.mts.map