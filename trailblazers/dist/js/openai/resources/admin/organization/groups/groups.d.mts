import { APIResource } from "../../../../core/resource.mjs";
import * as RolesAPI from "./roles.mjs";
import { RoleCreateParams, RoleCreateResponse, RoleDeleteParams, RoleDeleteResponse, RoleListParams, RoleListResponse, RoleListResponsesPage, Roles } from "./roles.mjs";
import * as UsersAPI from "./users.mjs";
import { OrganizationGroupUser, OrganizationGroupUsersPage, UserCreateParams, UserCreateResponse, UserDeleteParams, UserDeleteResponse, UserListParams, Users } from "./users.mjs";
import { APIPromise } from "../../../../core/api-promise.mjs";
import { NextCursorPage, type NextCursorPageParams, PagePromise } from "../../../../core/pagination.mjs";
import { RequestOptions } from "../../../../internal/request-options.mjs";
export declare class Groups extends APIResource {
    users: UsersAPI.Users;
    roles: RolesAPI.Roles;
    /**
     * Creates a new group in the organization.
     *
     * @example
     * ```ts
     * const group = await client.admin.organization.groups.create(
     *   { name: 'x' },
     * );
     * ```
     */
    create(body: GroupCreateParams, options?: RequestOptions): APIPromise<Group>;
    /**
     * Updates a group's information.
     *
     * @example
     * ```ts
     * const group = await client.admin.organization.groups.update(
     *   'group_id',
     *   { name: 'x' },
     * );
     * ```
     */
    update(groupID: string, body: GroupUpdateParams, options?: RequestOptions): APIPromise<GroupUpdateResponse>;
    /**
     * Lists all groups in the organization.
     *
     * @example
     * ```ts
     * // Automatically fetches more pages as needed.
     * for await (const group of client.admin.organization.groups.list()) {
     *   // ...
     * }
     * ```
     */
    list(query?: GroupListParams | null | undefined, options?: RequestOptions): PagePromise<GroupsPage, Group>;
    /**
     * Deletes a group from the organization.
     *
     * @example
     * ```ts
     * const group = await client.admin.organization.groups.delete(
     *   'group_id',
     * );
     * ```
     */
    delete(groupID: string, options?: RequestOptions): APIPromise<GroupDeleteResponse>;
}
export type GroupsPage = NextCursorPage<Group>;
/**
 * Details about an organization group.
 */
export interface Group {
    /**
     * Identifier for the group.
     */
    id: string;
    /**
     * Unix timestamp (in seconds) when the group was created.
     */
    created_at: number;
    /**
     * The type of the group.
     */
    group_type: string;
    /**
     * Whether the group is managed through SCIM and controlled by your identity
     * provider.
     */
    is_scim_managed: boolean;
    /**
     * Display name of the group.
     */
    name: string;
}
/**
 * Response returned after updating a group.
 */
export interface GroupUpdateResponse {
    /**
     * Identifier for the group.
     */
    id: string;
    /**
     * Unix timestamp (in seconds) when the group was created.
     */
    created_at: number;
    /**
     * Whether the group is managed through SCIM and controlled by your identity
     * provider.
     */
    is_scim_managed: boolean;
    /**
     * Updated display name for the group.
     */
    name: string;
}
/**
 * Confirmation payload returned after deleting a group.
 */
export interface GroupDeleteResponse {
    /**
     * Identifier of the deleted group.
     */
    id: string;
    /**
     * Whether the group was deleted.
     */
    deleted: boolean;
    /**
     * Always `group.deleted`.
     */
    object: 'group.deleted';
}
export interface GroupCreateParams {
    /**
     * Human readable name for the group.
     */
    name: string;
}
export interface GroupUpdateParams {
    /**
     * New display name for the group.
     */
    name: string;
}
export interface GroupListParams extends NextCursorPageParams {
    /**
     * Specifies the sort order of the returned groups.
     */
    order?: 'asc' | 'desc';
}
export declare namespace Groups {
    export { type Group as Group, type GroupUpdateResponse as GroupUpdateResponse, type GroupDeleteResponse as GroupDeleteResponse, type GroupsPage as GroupsPage, type GroupCreateParams as GroupCreateParams, type GroupUpdateParams as GroupUpdateParams, type GroupListParams as GroupListParams, };
    export { Users as Users, type OrganizationGroupUser as OrganizationGroupUser, type UserCreateResponse as UserCreateResponse, type UserDeleteResponse as UserDeleteResponse, type OrganizationGroupUsersPage as OrganizationGroupUsersPage, type UserCreateParams as UserCreateParams, type UserListParams as UserListParams, type UserDeleteParams as UserDeleteParams, };
    export { Roles as Roles, type RoleCreateResponse as RoleCreateResponse, type RoleListResponse as RoleListResponse, type RoleDeleteResponse as RoleDeleteResponse, type RoleListResponsesPage as RoleListResponsesPage, type RoleCreateParams as RoleCreateParams, type RoleListParams as RoleListParams, type RoleDeleteParams as RoleDeleteParams, };
}
//# sourceMappingURL=groups.d.mts.map