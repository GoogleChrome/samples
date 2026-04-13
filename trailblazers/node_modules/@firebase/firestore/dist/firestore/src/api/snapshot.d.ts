/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ChangeType, ViewSnapshot } from '../core/view_snapshot';
import { FieldPath } from '../lite-api/field_path';
import { DocumentData, PartialWithFieldValue, Query, SetOptions, WithFieldValue } from '../lite-api/reference';
import { DocumentSnapshot as LiteDocumentSnapshot, FirestoreDataConverter as LiteFirestoreDataConverter } from '../lite-api/snapshot';
import { UntypedFirestoreDataConverter } from '../lite-api/user_data_reader';
import { AbstractUserDataWriter } from '../lite-api/user_data_writer';
import { Document } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { Property } from '../util/json_validation';
import { Firestore } from './database';
import { SnapshotListenOptions } from './reference_impl';
/**
 * Converter used by `withConverter()` to transform user objects of type
 * `AppModelType` into Firestore data of type `DbModelType`.
 *
 * Using the converter allows you to specify generic type arguments when
 * storing and retrieving objects from Firestore.
 *
 * In this context, an "AppModel" is a class that is used in an application to
 * package together related information and functionality. Such a class could,
 * for example, have properties with complex, nested data types, properties used
 * for memoization, properties of types not supported by Firestore (such as
 * `symbol` and `bigint`), and helper functions that perform compound
 * operations. Such classes are not suitable and/or possible to store into a
 * Firestore database. Instead, instances of such classes need to be converted
 * to "plain old JavaScript objects" (POJOs) with exclusively primitive
 * properties, potentially nested inside other POJOs or arrays of POJOs. In this
 * context, this type is referred to as the "DbModel" and would be an object
 * suitable for persisting into Firestore. For convenience, applications can
 * implement `FirestoreDataConverter` and register the converter with Firestore
 * objects, such as `DocumentReference` or `Query`, to automatically convert
 * `AppModel` to `DbModel` when storing into Firestore, and convert `DbModel`
 * to `AppModel` when retrieving from Firestore.
 *
 * @example
 *
 * Simple Example
 *
 * ```typescript
 * const numberConverter = {
 *     toFirestore(value: WithFieldValue<number>) {
 *         return { value };
 *     },
 *     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
 *         return snapshot.data(options).value as number;
 *     }
 * };
 *
 * async function simpleDemo(db: Firestore): Promise<void> {
 *     const documentRef = doc(db, 'values/value123').withConverter(numberConverter);
 *
 *     // converters are used with `setDoc`, `addDoc`, and `getDoc`
 *     await setDoc(documentRef, 42);
 *     const snapshot1 = await getDoc(documentRef);
 *     assertEqual(snapshot1.data(), 42);
 *
 *     // converters are not used when writing data with `updateDoc`
 *     await updateDoc(documentRef, { value: 999 });
 *     const snapshot2 = await getDoc(documentRef);
 *     assertEqual(snapshot2.data(), 999);
 * }
 * ```
 *
 * Advanced Example
 *
 * ```typescript
 * // The Post class is a model that is used by our application.
 * // This class may have properties and methods that are specific
 * // to our application execution, which do not need to be persisted
 * // to Firestore.
 * class Post {
 *     constructor(
 *         readonly title: string,
 *         readonly author: string,
 *         readonly lastUpdatedMillis: number
 *     ) {}
 *     toString(): string {
 *         return `${this.title} by ${this.author}`;
 *     }
 * }
 *
 * // The PostDbModel represents how we want our posts to be stored
 * // in Firestore. This DbModel has different properties (`ttl`,
 * // `aut`, and `lut`) from the Post class we use in our application.
 * interface PostDbModel {
 *     ttl: string;
 *     aut: { firstName: string; lastName: string };
 *     lut: Timestamp;
 * }
 *
 * // The `PostConverter` implements `FirestoreDataConverter` and specifies
 * // how the Firestore SDK can convert `Post` objects to `PostDbModel`
 * // objects and vice versa.
 * class PostConverter implements FirestoreDataConverter<Post, PostDbModel> {
 *     toFirestore(post: WithFieldValue<Post>): WithFieldValue<PostDbModel> {
 *         return {
 *             ttl: post.title,
 *             aut: this._autFromAuthor(post.author),
 *             lut: this._lutFromLastUpdatedMillis(post.lastUpdatedMillis)
 *         };
 *     }
 *
 *     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Post {
 *         const data = snapshot.data(options) as PostDbModel;
 *         const author = `${data.aut.firstName} ${data.aut.lastName}`;
 *         return new Post(data.ttl, author, data.lut.toMillis());
 *     }
 *
 *     _autFromAuthor(
 *         author: string | FieldValue
 *     ): { firstName: string; lastName: string } | FieldValue {
 *         if (typeof author !== 'string') {
 *             // `author` is a FieldValue, so just return it.
 *             return author;
 *         }
 *         const [firstName, lastName] = author.split(' ');
 *         return {firstName, lastName};
 *     }
 *
 *     _lutFromLastUpdatedMillis(
 *         lastUpdatedMillis: number | FieldValue
 *     ): Timestamp | FieldValue {
 *         if (typeof lastUpdatedMillis !== 'number') {
 *             // `lastUpdatedMillis` must be a FieldValue, so just return it.
 *             return lastUpdatedMillis;
 *         }
 *         return Timestamp.fromMillis(lastUpdatedMillis);
 *     }
 * }
 *
 * async function advancedDemo(db: Firestore): Promise<void> {
 *     // Create a `DocumentReference` with a `FirestoreDataConverter`.
 *     const documentRef = doc(db, 'posts/post123').withConverter(new PostConverter());
 *
 *     // The `data` argument specified to `setDoc()` is type checked by the
 *     // TypeScript compiler to be compatible with `Post`. Since the `data`
 *     // argument is typed as `WithFieldValue<Post>` rather than just `Post`,
 *     // this allows properties of the `data` argument to also be special
 *     // Firestore values that perform server-side mutations, such as
 *     // `arrayRemove()`, `deleteField()`, and `serverTimestamp()`.
 *     await setDoc(documentRef, {
 *         title: 'My Life',
 *         author: 'Foo Bar',
 *         lastUpdatedMillis: serverTimestamp()
 *     });
 *
 *     // The TypeScript compiler will fail to compile if the `data` argument to
 *     // `setDoc()` is _not_ compatible with `WithFieldValue<Post>`. This
 *     // type checking prevents the caller from specifying objects with incorrect
 *     // properties or property values.
 *     // @ts-expect-error "Argument of type { ttl: string; } is not assignable
 *     // to parameter of type WithFieldValue<Post>"
 *     await setDoc(documentRef, { ttl: 'The Title' });
 *
 *     // When retrieving a document with `getDoc()` the `DocumentSnapshot`
 *     // object's `data()` method returns a `Post`, rather than a generic object,
 *     // which would have been returned if the `DocumentReference` did _not_ have a
 *     // `FirestoreDataConverter` attached to it.
 *     const snapshot1: DocumentSnapshot<Post> = await getDoc(documentRef);
 *     const post1: Post = snapshot1.data()!;
 *     if (post1) {
 *         assertEqual(post1.title, 'My Life');
 *         assertEqual(post1.author, 'Foo Bar');
 *     }
 *
 *     // The `data` argument specified to `updateDoc()` is type checked by the
 *     // TypeScript compiler to be compatible with `PostDbModel`. Note that
 *     // unlike `setDoc()`, whose `data` argument must be compatible with `Post`,
 *     // the `data` argument to `updateDoc()` must be compatible with
 *     // `PostDbModel`. Similar to `setDoc()`, since the `data` argument is typed
 *     // as `WithFieldValue<PostDbModel>` rather than just `PostDbModel`, this
 *     // allows properties of the `data` argument to also be those special
 *     // Firestore values, like `arrayRemove()`, `deleteField()`, and
 *     // `serverTimestamp()`.
 *     await updateDoc(documentRef, {
 *         'aut.firstName': 'NewFirstName',
 *         lut: serverTimestamp()
 *     });
 *
 *     // The TypeScript compiler will fail to compile if the `data` argument to
 *     // `updateDoc()` is _not_ compatible with `WithFieldValue<PostDbModel>`.
 *     // This type checking prevents the caller from specifying objects with
 *     // incorrect properties or property values.
 *     // @ts-expect-error "Argument of type { title: string; } is not assignable
 *     // to parameter of type WithFieldValue<PostDbModel>"
 *     await updateDoc(documentRef, { title: 'New Title' });
 *     const snapshot2: DocumentSnapshot<Post> = await getDoc(documentRef);
 *     const post2: Post = snapshot2.data()!;
 *     if (post2) {
 *         assertEqual(post2.title, 'My Life');
 *         assertEqual(post2.author, 'NewFirstName Bar');
 *     }
 * }
 * ```
 */
export interface FirestoreDataConverter<AppModelType, DbModelType extends DocumentData = DocumentData> extends LiteFirestoreDataConverter<AppModelType, DbModelType> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. To use `set()`
     * with `merge` and `mergeFields`, `toFirestore()` must be defined with
     * `PartialWithFieldValue<AppModelType>`.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link (setDoc:1)}, {@link (WriteBatch.set:1)} and
     * {@link (Transaction.set:1)} with `merge:true` or `mergeFields`.
     *
     * The `PartialWithFieldValue<T>` type extends `Partial<T>` to allow
     * FieldValues such as {@link (arrayUnion:1)} to be used as property values.
     * It also supports nested `Partial` by allowing nested fields to be
     * omitted.
     */
    toFirestore(modelObject: PartialWithFieldValue<AppModelType>, options: SetOptions): PartialWithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type `AppModelType`. You can access your data by calling:
     * `snapshot.data(options)`.
     *
     * Generally, the data returned from `snapshot.data()` can be cast to
     * `DbModelType`; however, this is not guaranteed because Firestore does not
     * enforce a schema on the database. For example, writes from a previous
     * version of the application or writes from another client that did not use a
     * type converter could have written data with different properties and/or
     * property types. The implementation will need to choose whether to
     * gracefully recover from non-conforming data or throw an error.
     *
     * To override this method, see {@link (FirestoreDataConverter.fromFirestore:1)}.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and metadata.
     * @param options - The `SnapshotOptions` from the initial call to `data()`.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): AppModelType;
}
/**
 * Options that configure how data is retrieved from a `DocumentSnapshot` (for
 * example the desired behavior for server timestamps that have not yet been set
 * to their final value).
 */
export interface SnapshotOptions {
    /**
     * If set, controls the return value for server timestamps that have not yet
     * been set to their final value.
     *
     * By specifying 'estimate', pending server timestamps return an estimate
     * based on the local clock. This estimate will differ from the final value
     * and cause these values to change once the server result becomes available.
     *
     * By specifying 'previous', pending timestamps will be ignored and return
     * their previous value instead.
     *
     * If omitted or set to 'none', `null` will be returned by default until the
     * server value becomes available.
     */
    readonly serverTimestamps?: 'estimate' | 'previous' | 'none';
}
/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */
export declare class SnapshotMetadata {
    /**
     * True if the snapshot contains the result of local writes (for example
     * `set()` or `update()` calls) that have not yet been committed to the
     * backend. If your listener has opted into metadata updates (via
     * `SnapshotListenOptions`) you will receive another snapshot with
     * `hasPendingWrites` equal to false once the writes have been committed to
     * the backend.
     */
    readonly hasPendingWrites: boolean;
    /**
     * True if the snapshot was created from cached data rather than guaranteed
     * up-to-date server data. If your listener has opted into metadata updates
     * (via `SnapshotListenOptions`) you will receive another snapshot with
     * `fromCache` set to false once the client has received up-to-date data from
     * the backend.
     */
    readonly fromCache: boolean;
    /** @hideconstructor */
    constructor(hasPendingWrites: boolean, fromCache: boolean);
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */
    isEqual(other: SnapshotMetadata): boolean;
}
/**
 * The type of a `DocumentChange` may be 'added', 'removed', or 'modified'.
 */
export type DocumentChangeType = 'added' | 'removed' | 'modified';
/**
 * A `DocumentChange` represents a change to the documents matching a query.
 * It contains the document affected and the type of change that occurred.
 */
export interface DocumentChange<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    /** The type of change ('added', 'modified', or 'removed'). */
    readonly type: DocumentChangeType;
    /** The document affected by this change. */
    readonly doc: QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * The index of the changed document in the result set immediately prior to
     * this `DocumentChange` (i.e. supposing that all prior `DocumentChange` objects
     * have been applied). Is `-1` for 'added' events.
     */
    readonly oldIndex: number;
    /**
     * The index of the changed document in the result set immediately after
     * this `DocumentChange` (i.e. supposing that all prior `DocumentChange`
     * objects and the current `DocumentChange` object have been applied).
     * Is -1 for 'removed' events.
     */
    readonly newIndex: number;
}
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */
export declare class DocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends LiteDocumentSnapshot<AppModelType, DbModelType> {
    readonly _firestore: Firestore;
    private readonly _firestoreImpl;
    /**
     *  Metadata about the `DocumentSnapshot`, including information about its
     *  source and local modifications.
     */
    readonly metadata: SnapshotMetadata;
    /** @hideconstructor protected */
    constructor(_firestore: Firestore, userDataWriter: AbstractUserDataWriter, key: DocumentKey, document: Document | null, metadata: SnapshotMetadata, converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null);
    /**
     * Returns whether or not the data exists. True if the document exists.
     */
    exists(): this is QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document or `undefined` if
     * the document doesn't exist.
     */
    data(options?: SnapshotOptions): AppModelType | undefined;
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * By default, a `serverTimestamp()` that has not yet been set to
     * its final value will be returned as `null`. You can override this by
     * passing an options object.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @param options - An options object to configure how the field is retrieved
     * from the snapshot (for example the desired behavior for server timestamps
     * that have not yet been set to their final value).
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath, options?: SnapshotOptions): any;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        bundleSource: Property<"string">;
        bundleName: Property<"string">;
        bundle: Property<"string">;
    };
    /**
     * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
     *
     * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
     * `DocumentSnapshot` has pending writes.
     */
    toJSON(): object;
}
/**
 * Builds a `DocumentSnapshot` instance from a JSON object created by
 * {@link DocumentSnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `DocumentSnapshot` instance.
 * @returns an instance of {@link DocumentSnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
export declare function documentSnapshotFromJSON(db: Firestore, json: object): DocumentSnapshot;
/**
 * Builds a `DocumentSnapshot` instance from a JSON object created by
 * {@link DocumentSnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `DocumentSnapshot` instance.
 * @param converter - Converts objects to and from Firestore.
 * @returns an instance of {@link DocumentSnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
export declare function documentSnapshotFromJSON<AppModelType, DbModelType extends DocumentData = DocumentData>(db: Firestore, json: object, converter: FirestoreDataConverter<AppModelType, DbModelType>): DocumentSnapshot<AppModelType, DbModelType>;
/**
 * A `QueryDocumentSnapshot` contains data read from a document in your
 * Firestore database as part of a query. The document is guaranteed to exist
 * and its data can be extracted with `.data()` or `.get(<field>)` to get a
 * specific field.
 *
 * A `QueryDocumentSnapshot` offers the same API surface as a
 * `DocumentSnapshot`. Since query results contain only existing documents, the
 * `exists` property will always be true and `data()` will never return
 * 'undefined'.
 */
export declare class QueryDocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> extends DocumentSnapshot<AppModelType, DbModelType> {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * By default, `serverTimestamp()` values that have not yet been
     * set to their final value will be returned as `null`. You can override
     * this by passing an options object.
     *
     * @override
     * @param options - An options object to configure how data is retrieved from
     * the snapshot (for example the desired behavior for server timestamps that
     * have not yet been set to their final value).
     * @returns An `Object` containing all fields in the document.
     */
    data(options?: SnapshotOptions): AppModelType;
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export declare class QuerySnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    readonly _firestore: Firestore;
    readonly _userDataWriter: AbstractUserDataWriter;
    readonly _snapshot: ViewSnapshot;
    /**
     * Metadata about this snapshot, concerning its source and if it has local
     * modifications.
     */
    readonly metadata: SnapshotMetadata;
    /**
     * The query on which you called `get` or `onSnapshot` in order to get this
     * `QuerySnapshot`.
     */
    readonly query: Query<AppModelType, DbModelType>;
    private _cachedChanges?;
    private _cachedChangesIncludeMetadataChanges?;
    /** @hideconstructor */
    constructor(_firestore: Firestore, _userDataWriter: AbstractUserDataWriter, query: Query<AppModelType, DbModelType>, _snapshot: ViewSnapshot);
    /** An array of all the documents in the `QuerySnapshot`. */
    get docs(): Array<QueryDocumentSnapshot<AppModelType, DbModelType>>;
    /** The number of documents in the `QuerySnapshot`. */
    get size(): number;
    /** True if there are no documents in the `QuerySnapshot`. */
    get empty(): boolean;
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    forEach(callback: (result: QueryDocumentSnapshot<AppModelType, DbModelType>) => void, thisArg?: unknown): void;
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */
    docChanges(options?: SnapshotListenOptions): Array<DocumentChange<AppModelType, DbModelType>>;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        bundleSource: Property<"string">;
        bundleName: Property<"string">;
        bundle: Property<"string">;
    };
    /**
     * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
     *
     * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
     * `QuerySnapshot` has pending writes.
     */
    toJSON(): object;
}
/**
 * Builds a `QuerySnapshot` instance from a JSON object created by
 * {@link QuerySnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `QuerySnapshot` instance.
 * @returns an instance of {@link QuerySnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
export declare function querySnapshotFromJSON(db: Firestore, json: object): QuerySnapshot;
/**
 * Builds a `QuerySnapshot` instance from a JSON object created by
 * {@link QuerySnapshot.toJSON}.
 *
 * @param firestore - The {@link Firestore} instance the snapshot should be loaded for.
 * @param json - a JSON object represention of a `QuerySnapshot` instance.
 * @param converter - Converts objects to and from Firestore.
 * @returns an instance of {@link QuerySnapshot} if the JSON object could be
 * parsed. Throws a {@link FirestoreError} if an error occurs.
 */
export declare function querySnapshotFromJSON<AppModelType, DbModelType extends DocumentData = DocumentData>(db: Firestore, json: object, converter: FirestoreDataConverter<AppModelType, DbModelType>): QuerySnapshot<AppModelType, DbModelType>;
/** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
export declare function changesFromSnapshot<AppModelType, DbModelType extends DocumentData>(querySnapshot: QuerySnapshot<AppModelType, DbModelType>, includeMetadataChanges: boolean): Array<DocumentChange<AppModelType, DbModelType>>;
export declare function resultChangeType(type: ChangeType): DocumentChangeType;
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export declare function snapshotEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>, right: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>): boolean;
