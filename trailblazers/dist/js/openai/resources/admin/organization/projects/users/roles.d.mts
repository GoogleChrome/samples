import { APIResource } from "../../../../../core/resource.mjs";
import * as RolesAPI from "../../roles.mjs";
import * as UsersAPI from "../../users/users.mjs";
import { APIPromise } from "../../../../../core/api-promise.mjs";
import { NextCursorPage, type NextCursorPageParams, PagePromise } from "../../../../../core/pagination.mjs";
import { RequestOptions } from "../../../../../internal/request-options.mjs";
export declare class Roles extends APIResource {
    /**
     * Assigns a project role to a user within a project.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.users.roles.create(
     *     'user_id',
     *     { project_id: 'project_id', role_id: 'role_id' },
     *   );
     * ```
     */
    create(userID: string, params: RoleCreateParams, options?: RequestOptions): APIPromise<RoleCreateResponse>;
    /**
     * Lists the project roles assigned to a user within a project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const roleListResponse of client.admin.organization.projects.users.roles.list(
     *   'user_id',
     *   { project_id: 'project_id' },
     * )) {
     *   // ...
     * }
     * ```
     */
    list(userID: string, params: RoleListParams, options?: RequestOptions): PagePromise<RoleListResponsesPage, RoleListResponse>;
    /**
     * Unassigns a project role from a user within a project.
     *
     * @example
     * ```ts
     * const role =
     *   await client.admin.organization.projects.users.roles.delete(
     *     'role_id',
     *     { project_id: 'project_id', user_id: 'user_id' },
     *   );
     * ```
     */
    delete(roleID: string, params: RoleDeleteParams, options?: RequestOptions): APIPromise<RoleDeleteResponse>;
}
export type RoleListResponsesPage = NextCursorPage<RoleListResponse>;
/**
 * Role assignment linking a user to a role.
 */
export interface RoleCreateResponse {
    /**
     * Always `user.role`.
     */
    object: 'user.role';
    /**
     * Details about a role that can be assigned through the public Roles API.
     */
    role: RolesAPI.Role;
    /**
     * Represents an individual `user` within an organization.
     */
    user: UsersAPI.OrganizationUser;
}
/**
 * Detailed information about a role assignment entry returned when listing
 * assignments.
 */
export interface RoleListResponse {
    /**
     * Identifier for the role.
     */
    id: string;
    /**
     * When the role was created.
     */
    created_at: number | null;
    /**
     * Identifier of the actor who created the role.
     */
    created_by: string | null;
    /**
     * User details for the actor that created the role, when available.
     */
    created_by_user_obj: {
        [key: string]: unknown;
    } | null;
    /**
     * Description of the role.
     */
    description: string | null;
    /**
     * Arbitrary metadata stored on the role.
     */
    metadata: {
        [key: string]: unknown;
    } | null;
    /**
     * Name of the role.
     */
    name: string;
    /**
     * Permissions associated with the role.
     */
    permissions: Array<string>;
    /**
     * Whether the role is predefined by OpenAI.
     */
    predefined_role: boolean;
    /**
     * Resource type the role applies to.
     */
    resource_type: string;
    /**
     * When the role was last updated.
     */
    updated_at: number | null;
}
/**
 * Confirmation payload returned after unassigning a role.
 */
export interface RoleDeleteResponse {
    /**
     * Whether the assignment was removed.
     */
    deleted: boolean;
    /**
     * Identifier for the deleted assignment, such as `group.role.deleted` or
     * `user.role.deleted`.
     */
    object: string;
}
export interface RoleCreateParams {
    /**
     * Path param: The ID of the project to update.
     */
    project_id: string;
    /**
     * Body param: Identifier of the role to assign.
     */
    role_id: string;
}
export interface RoleListParams extends NextCursorPageParams {
    /**
     * Path param: The ID of the project to inspect.
     */
    project_id: string;
    /**
     * Query param: Sort order for the returned project roles.
     */
    order?: 'asc' | 'desc';
}
export interface RoleDeleteParams {
    /**
     * The ID of the project to modify.
     */
    project_id: string;
    /**
     * The ID of the user whose project role assignment should be removed.
     */
    user_id: string;
}
export declare namespace Roles {
    export { type RoleCreateResponse as RoleCreateResponse, type RoleListResponse as RoleListResponse, type RoleDeleteResponse as RoleDeleteResponse, type RoleListResponsesPage as RoleListResponsesPage, type RoleCreateParams as RoleCreateParams, type RoleListParams as RoleListParams, type RoleDeleteParams as RoleDeleteParams, };
}
//# sourceMappingURL=roles.d.mts.map