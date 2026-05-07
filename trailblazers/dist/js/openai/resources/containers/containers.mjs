// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../core/resource.mjs";
import * as FilesAPI from "./files/files.mjs";
import { Files, } from "./files/files.mjs";
import { CursorPage } from "../../core/pagination.mjs";
import { buildHeaders } from "../../internal/headers.mjs";
import { path } from "../../internal/utils/path.mjs";
export class Containers extends APIResource {
    constructor() {
        super(...arguments);
        this.files = new FilesAPI.Files(this._client);
    }
    /**
     * Create Container
     */
    create(body, options) {
        return this._client.post('/containers', { body, ...options, __security: { bearerAuth: true } });
    }
    /**
     * Retrieve Container
     */
    retrieve(containerID, options) {
        return this._client.get(path `/containers/${containerID}`, {
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * List Containers
     */
    list(query = {}, options) {
        return this._client.getAPIList('/containers', (CursorPage), {
            query,
            ...options,
            __security: { bearerAuth: true },
        });
    }
    /**
     * Delete Container
     */
    delete(containerID, options) {
        return this._client.delete(path `/containers/${containerID}`, {
            ...options,
            headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
            __security: { bearerAuth: true },
        });
    }
}
Containers.Files = Files;
//# sourceMappingURL=containers.mjs.map