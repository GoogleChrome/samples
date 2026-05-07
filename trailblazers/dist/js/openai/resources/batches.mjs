// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../core/resource.mjs";
import { CursorPage } from "../core/pagination.mjs";
import { path } from "../internal/utils/path.mjs";
/**
 * Create large batches of API requests to run asynchronously.
 */
export class Batches extends APIResource {
    /**
     * Creates and executes a batch from an uploaded file of requests
     */
    create(body, options) {
        return this._client.post('/batches', { body, ...options, __security: { bearerAuth: true } });
    }
    /**
     * Retrieves a batch.
     */
    retrieve(batchID, options) {
        return this._client.get(path `/batches/${batchID}`, { ...options, __security: { bearerAuth: true } });
    }
    /**
     * List your organization's batches.
     */
    list(query = {}, options) {
        return this._client.getAPIList('/batches', (CursorPage), {
            query,
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
     * 10 minutes, before changing to `cancelled`, where it will have partial results
     * (if any) available in the output file.
     */
    cancel(batchID, options) {
        return this._client.post(path `/batches/${batchID}/cancel`, {
            ...options,
            __security: { bearerAuth: true },
        });
    }
}
//# sourceMappingURL=batches.mjs.map