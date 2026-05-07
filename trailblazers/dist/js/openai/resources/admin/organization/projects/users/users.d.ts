import { APIResource } from "../../../../../core/resource.js";
import * as RolesAPI from "./roles.js";
import { RoleCreateParams, RoleCreateResponse, RoleDeleteParams, RoleDeleteResponse, RoleListParams, RoleListResponse, RoleListResponsesPage, Roles } from "./roles.js";
import { APIPromise } from "../../../../../core/api-promise.js";
import { ConversationCursorPage, type ConversationCursorPageParams, PagePromise } from "../../../../../core/pagination.js";
import { RequestOptions } from "../../../../../internal/request-options.js";
export declare class Users extends APIResource {
    roles: RolesAPI.Roles;
    /**
     * Adds a user to the project. Users must already be members of the organization to
     * be added to a project.
     *
     * @example
     * ```ts
     * const projectUser =
     *   await client.admin.organization.projects.users.create(
     *     'project_id',
     *     { role: 'role' },
     *   );
     * ```
     */
    create(projectID: string, body: UserCreateParams, options?: RequestOptions): APIPromise<ProjectUser>;
    /**
     * Retrieves a user in the project.
     *
     * @example
     * ```ts
     * const projectUser =
     *   await client.admin.organization.projects.users.retrieve(
     *     'user_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    retrieve(userID: string, params: UserRetrieveParams, options?: RequestOptions): APIPromise<ProjectUser>;
    /**
     * Modifies a user's role in the project.
     *
     * @example
     * ```ts
     * const projectUser =
     *   await client.admin.organization.projects.users.update(
     *     'user_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    update(userID: string, params: UserUpdateParams, options?: RequestOptions): APIPromise<ProjectUser>;
    /**
     * Returns a list of users in the project.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const projectUser of client.admin.organization.projects.users.list(
     *   'project_id',
     * )) {
     *   // ...
     * }
     * ```
     */
    list(projectID: string, query?: UserListParams | null | undefined, options?: RequestOptions): PagePromise<ProjectUsersPage, ProjectUser>;
    /**
     * Deletes a user from the project.
     *
     * Returns confirmation of project user deletion, or an error if the project is
     * archived (archived projects have no users).
     *
     * @example
     * ```ts
     * const user =
     *   await client.admin.organization.projects.users.delete(
     *     'user_id',
     *     { project_id: 'project_id' },
     *   );
     * ```
     */
    delete(userID: string, params: UserDeleteParams, options?: RequestOptions): APIPromise<UserDeleteResponse>;
}
export type ProjectUsersPage = ConversationCursorPage<ProjectUser>;
/**
 * Represents an individual user in a project.
 */
export interface ProjectUser {
    /**
     * The identifier, which can be referenced in API endpoints
     */
    id: string;
    /**
     * The Unix timestamp (in seconds) of when the project was added.
     */
    added_at: number;
    /**
     * The object type, which is always `organization.project.user`
     */
    object: 'organization.project.user';
    /**
     * `owner` or `member`
     */
    role: string;
    /**
     * The email address of the user
     */
    email?: string | null;
    /**
     * The name of the user
     */
    name?: string | null;
}
export interface UserDeleteResponse {
    id: string;
    deleted: boolean;
    object: 'organization.project.user.deleted';
}
export interface UserCreateParams {
    /**
     * `owner` or `member`
     */
    role: string;
    /**
     * Email of the user to add.
     */
    email?: string | null;
    /**
     * The ID of the user.
     */
    user_id?: string | null;
}
export interface UserRetrieveParams {
    /**
     * The ID of the project.
     */
    project_id: string;
}
export interface UserUpdateParams {
    /**
     * Path param: The ID of the project.
     */
    project_id: string;
    /**
     * Body param: `owner` or `member`
     */
    role?: string | null;
}
export interface UserListParams extends ConversationCursorPageParams {
}
export interface UserDeleteParams {
    /**
     * The ID of the project.
     */
    project_id: string;
}
export declare namespace Users {
    export { type ProjectUser as ProjectUser, type UserDeleteResponse as UserDeleteResponse, type ProjectUsersPage as ProjectUsersPage, type UserCreateParams as UserCreateParams, type UserRetrieveParams as UserRetrieveParams, type UserUpdateParams as UserUpdateParams, type UserListParams as UserListParams, type UserDeleteParams as UserDeleteParams, };
    export { Roles as Roles, type RoleCreateResponse as RoleCreateResponse, type RoleListResponse as RoleListResponse, type RoleDeleteResponse as RoleDeleteResponse, type RoleListResponsesPage as RoleListResponsesPage, type RoleCreateParams as RoleCreateParams, type RoleListParams as RoleListParams, type RoleDeleteParams as RoleDeleteParams, };
}
//# sourceMappingURL=users.d.ts.map