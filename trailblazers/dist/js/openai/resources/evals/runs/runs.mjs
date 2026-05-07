// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../core/resource.mjs";
import * as OutputItemsAPI from "./output-items.mjs";
import { OutputItems, } from "./output-items.mjs";
import { CursorPage } from "../../../core/pagination.mjs";
import { path } from "../../../internal/utils/path.mjs";
/**
 * Manage and run evals in the OpenAI platform.
 */
export class Runs extends APIResource {
    constructor() {
        super(...arguments);
        this.outputItems = new OutputItemsAPI.OutputItems(this._client);
    }
    /**
     * Kicks off a new run for a given evaluation, specifying the data source, and what
     * model configuration to use to test. The datasource will be validated against the
     * schema specified in the config of the evaluation.
     */
    create(evalID, body, options) {
        return this._client.post(path `/evals/${evalID}/runs`, {
            body,
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * Get an evaluation run by ID.
     */
    retrieve(runID, params, options) {
        const { eval_id } = params;
        return this._client.get(path `/evals/${eval_id}/runs/${runID}`, {
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * Get a list of runs for an evaluation.
     */
    list(evalID, query = {}, options) {
        return this._client.getAPIList(path `/evals/${evalID}/runs`, (CursorPage), {
            query,
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * Delete an eval run.
     */
    delete(runID, params, options) {
        const { eval_id } = params;
        return this._client.delete(path `/evals/${eval_id}/runs/${runID}`, {
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * Cancel an ongoing evaluation run.
     */
    cancel(runID, params, options) {
        const { eval_id } = params;
        return this._client.post(path `/evals/${eval_id}/runs/${runID}`, {
            ...options,
            __security: { bearerAuth: true },
        });
    }
}
Runs.OutputItems = OutputItems;
//# sourceMappingURL=runs.mjs.map