// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import { ConversationCursorPage, Page, } from "../../../core/pagination.mjs";
import { path } from "../../../internal/utils/path.mjs";
export class Certificates extends APIResource {
    /**
     * Upload a certificate to the organization. This does **not** automatically
     * activate the certificate.
     *
     * Organizations can upload up to 50 certificates.
     *
     * @example
     * ```ts
     * const certificate =
     *   await client.admin.organization.certificates.create({
     *     certificate: 'certificate',
     *   });
     * ```
     */
    create(body, options) {
        return this._client.post('/organization/certificates', {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Get a certificate that has been uploaded to the organization.
     *
     * You can get a certificate regardless of whether it is active or not.
     *
     * @example
     * ```ts
     * const certificate =
     *   await client.admin.organization.certificates.retrieve(
     *     'certificate_id',
     *   );
     * ```
     */
    retrieve(certificateID, query = {}, options) {
        return this._client.get(path `/organization/certificates/${certificateID}`, {
            query,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Modify a certificate. Note that only the name can be modified.
     *
     * @example
     * ```ts
     * const certificate =
     *   await client.admin.organization.certificates.update(
     *     'certificate_id',
     *   );
     * ```
     */
    update(certificateID, body, options) {
        return this._client.post(path `/organization/certificates/${certificateID}`, {
            body,
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * List uploaded certificates for this organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const certificateListResponse of client.admin.organization.certificates.list()) {
     *   // ...
     * }
     * ```
     */
    list(query = {}, options) {
        return this._client.getAPIList('/organization/certificates', (ConversationCursorPage), { query, ...options, __security: { adminAPIKeyAuth: true } });
    }
    /**
     * Delete a certificate from the organization.
     *
     * The certificate must be inactive for the organization and all projects.
     *
     * @example
     * ```ts
     * const certificate =
     *   await client.admin.organization.certificates.delete(
     *     'certificate_id',
     *   );
     * ```
     */
    delete(certificateID, options) {
        return this._client.delete(path `/organization/certificates/${certificateID}`, {
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Activate certificates at the organization level.
     *
     * You can atomically and idempotently activate up to 10 certificates at a time.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const certificateActivateResponse of client.admin.organization.certificates.activate(
     *   { certificate_ids: ['cert_abc'] },
     * )) {
     *   // ...
     * }
     * ```
     */
    activate(body, options) {
        return this._client.getAPIList('/organization/certificates/activate', (Page), {
            body,
            method: 'post',
            ...options,
            __security: { adminAPIKeyAuth: true },
        });
    }
    /**
     * Deactivate certificates at the organization level.
     *
     * You can atomically and idempotently deactivate up to 10 certificates at a time.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const certificateDeactivateResponse of client.admin.organization.certificates.deactivate(
     *   { certificate_ids: ['cert_abc'] },
     * )) {
     *   // ...
     * }
     * ```
     */
    deactivate(body, options) {
        return this._client.getAPIList('/organization/certificates/deactivate', (Page), { body, method: 'post', ...options, __security: { adminAPIKeyAuth: true } });
    }
}
//# sourceMappingURL=certificates.mjs.map