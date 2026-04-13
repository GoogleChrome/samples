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
import { Document } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { firestoreV1ApiClientInterfaces } from '../protos/firestore_proto_api';
import { Firestore } from './database';
import { FieldPath } from './field_path';
import { DocumentData, DocumentReference, PartialWithFieldValue, Query, SetOptions, WithFieldValue } from './reference';
import { UntypedFirestoreDataConverter } from './user_data_reader';
import { AbstractUserDataWriter } from './user_data_writer';
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
export interface FirestoreDataConverter<AppModelType, DbModelType extends DocumentData = DocumentData> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link @firebase/firestore/lite#(setDoc:1)},
     * {@link @firebase/firestore/lite#(WriteBatch.set:1)} and
     * {@link @firebase/firestore/lite#(Transaction.set:1)}.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<AppModelType>): WithFieldValue<DbModelType>;
    /**
     * Called by the Firestore SDK to convert a custom model object of type
     * `AppModelType` into a plain JavaScript object (suitable for writing
     * directly to the Firestore database) of type `DbModelType`. Used with
     * {@link @firebase/firestore/lite#(setDoc:1)},
     * {@link @firebase/firestore/lite#(WriteBatch.set:1)} and
     * {@link @firebase/firestore/lite#(Transaction.set:1)} with `merge:true`
     * or `mergeFields`.
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
     * `snapshot.data()`.
     *
     *
     * Generally, the data returned from `snapshot.data()` can be cast to
     * `DbModelType`; however, this is not guaranteed because Firestore does not
     * enforce a schema on the database. For example, writes from a previous
     * version of the application or writes from another client that did not use a
     * type converter could have written data with different properties and/or
     * property types. The implementation will need to choose whether to
     * gracefully recover from non-conforming data or throw an error.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and
     * metadata.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): AppModelType;
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
export declare class DocumentSnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    _firestore: Firestore;
    _userDataWriter: AbstractUserDataWriter;
    _key: DocumentKey;
    _document: Document | null;
    _converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null;
    /** @hideconstructor protected */
    constructor(_firestore: Firestore, _userDataWriter: AbstractUserDataWriter, _key: DocumentKey, _document: Document | null, _converter: UntypedFirestoreDataConverter<AppModelType, DbModelType> | null);
    /** Property of the `DocumentSnapshot` that provides the document's ID. */
    get id(): string;
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref(): DocumentReference<AppModelType, DbModelType>;
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    exists(): this is QueryDocumentSnapshot<AppModelType, DbModelType>;
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    data(): AppModelType | undefined;
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the document as a proto Value. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    _fieldsProto(): {
        [key: string]: firestoreV1ApiClientInterfaces.Value;
    } | undefined;
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    get(fieldPath: string | FieldPath): any;
}
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
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data(): AppModelType;
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
export declare class QuerySnapshot<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData> {
    readonly _docs: Array<QueryDocumentSnapshot<AppModelType, DbModelType>>;
    /**
     * The query on which you called {@link getDocs} in order to get this
     * `QuerySnapshot`.
     */
    readonly query: Query<AppModelType, DbModelType>;
    /** @hideconstructor */
    constructor(_query: Query<AppModelType, DbModelType>, _docs: Array<QueryDocumentSnapshot<AppModelType, DbModelType>>);
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
}
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export declare function snapshotEqual<AppModelType, DbModelType extends DocumentData>(left: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>, right: DocumentSnapshot<AppModelType, DbModelType> | QuerySnapshot<AppModelType, DbModelType>): boolean;
