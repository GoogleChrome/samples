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
import { FieldPath } from '../lite-api/field_path';
import { CollectionReference, DocumentData, DocumentReference, PartialWithFieldValue, Query, SetOptions, UpdateData, WithFieldValue } from '../lite-api/reference';
import { Mutation } from '../model/mutation';
import { FirestoreError } from '../util/error';
import { Firestore } from './database';
import { DocumentSnapshot, FirestoreDataConverter, QuerySnapshot } from './snapshot';
/**
 * An options object that can be passed to {@link (onSnapshot:1)} and {@link
 * QuerySnapshot.docChanges} to control which types of changes to include in the
 * result set.
 */
export interface SnapshotListenOptions {
    /**
     * Include a change even if only the metadata of the query or of a document
     * changed. Default is false.
     */
    readonly includeMetadataChanges?: boolean;
    /**
     * Set the source the query listens to. Default to "default", which
     * listens to both cache and server.
     */
    readonly source?: ListenSource;
}
/**
 * Describe the source a query listens to.
 *
 * Set to `default` to listen to both cache and server changes. Set to `cache`
 * to listen to changes in cache only.
 */
export type ListenSource = 'default' | 'cache';
/**
 * Reads the document referred to by this `DocumentReference`.
 *
 * Note: `getDoc()` attempts to provide up-to-date data when possible by waiting
 * for data from the server, but it may return cached data or fail if you are
 * offline and the server cannot be reached. To specify this behavior, invoke
 * {@link getDocFromCache} or {@link getDocFromServer}.
 *
 * @param reference - The reference of the document to fetch.
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
export declare function getDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
export declare function getDocFromCache<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
export declare function getDocFromServer<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<DocumentSnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 *
 * Note: `getDocs()` attempts to provide up-to-date data when possible by
 * waiting for data from the server, but it may return cached data or fail if
 * you are offline and the server cannot be reached. To specify this behavior,
 * invoke {@link getDocsFromCache} or {@link getDocsFromServer}.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
export declare function getDocs<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
export declare function getDocsFromCache<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
export declare function getDocsFromServer<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
/**
 * Writes to the document referred to by this `DocumentReference`. If the
 * document does not yet exist, it will be created.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
export declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<void>;
/**
 * Writes to the document referred to by the specified `DocumentReference`. If
 * the document does not yet exist, it will be created. If you provide `merge`
 * or `mergeFields`, the provided data can be merged into an existing document.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to write.
 * @param data - A map of the fields and values for the document.
 * @param options - An object to configure the set behavior.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
export declare function setDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: PartialWithFieldValue<AppModelType>, options: SetOptions): Promise<void>;
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference`. The update will fail if applied to a document that does
 * not exist.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to update.
 * @param data - An object containing the fields and values with which to
 * update the document. Fields can contain dots to reference nested fields
 * within the document.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
export declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, data: UpdateData<DbModelType>): Promise<void>;
/**
 * Updates fields in the document referred to by the specified
 * `DocumentReference` The update will fail if applied to a document that does
 * not exist.
 *
 * Nested fields can be updated by providing dot-separated field path
 * strings or by providing `FieldPath` objects.
 *
 * Note that the returned `Promise` does _not_ resolve until the data is
 * successfully written to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error saving the given
 * data. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately saved to the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * written to the remote Firestore server, a feature of Firestore called
 * "latency compensation". The data will _eventually_ be written to the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to update.
 * @param field - The first field to update.
 * @param value - The first value.
 * @param moreFieldsAndValues - Additional key value pairs.
 * @returns A `Promise` that resolves once the data has been successfully
 * written to the backend or rejects once the backend reports an error writing
 * the data.
 */
export declare function updateDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, field: string | FieldPath, value: unknown, ...moreFieldsAndValues: unknown[]): Promise<void>;
/**
 * Deletes the document referred to by the specified `DocumentReference`.
 *
 * Note that the returned `Promise` does _not_ resolve until the document is
 * successfully deleted from the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error deleting the given
 * document. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given data _will_ be immediately deleted from the local cache and will be
 * reflected in future "get" operations as if it had been successfully
 * deleted from the remote Firestore server, a feature of Firestore called
 * "latency compensation". The document will _eventually_ be deleted from the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the document to delete.
 * @returns A `Promise` that resolves once the document has been successfully
 * deleted from the backend or rejects once the backend reports an error
 * deleting the document.
 */
export declare function deleteDoc<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>): Promise<void>;
/**
 * Add a new document to specified `CollectionReference` with the given data,
 * assigning it a document ID automatically.
 *
 * Note that the returned `Promise` does _not_ resolve until the document is
 * successfully created to the remote Firestore backend and, similarly, is not
 * rejected until the remote Firestore backend reports an error creating the given
 * document. So if the client cannot reach the backend (for example, due to being
 * offline) then the returned `Promise` will not resolve for a potentially-long
 * time (for example, until the client has gone back online). That being said,
 * the given document _will_ be immediately created in the local cache and will be
 * incorporated into future "get" operations as if it had been successfully
 * created in the remote Firestore server, a feature of Firestore called
 * "latency compensation". The document will _eventually_ be created in the remote
 * Firestore backend once a connection can be established. Therefore, it is
 * usually undesirable to `await` the `Promise` returned from this function
 * because the indefinite amount of time before which the promise resolves or
 * rejects can block application logic unnecessarily.
 *
 * @param reference - A reference to the collection to add this document to.
 * @param data - An Object containing the data for the new document.
 * @returns A `Promise` that resolves once the docoument has been successfully
 * created in the backend or rejects once the backend reports an error creating
 * the document.
 */
export declare function addDoc<AppModelType, DbModelType extends DocumentData>(reference: CollectionReference<AppModelType, DbModelType>, data: WithFieldValue<AppModelType>): Promise<DocumentReference<AppModelType, DbModelType>>;
/**
 * A function returned by `onSnapshot()` that removes the listener when invoked.
 */
export interface Unsubscribe {
    /** Removes the listener when invoked. */
    (): void;
}
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param reference - A reference to the document to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(reference: DocumentReference<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, observer: {
    next?: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events. You may either pass individual `onNext` and
 * `onError` callbacks or pass a single observer object with `next` and `error` callbacks. The
 * listener can be cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param query - The query to listen to.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshot<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>, options: SnapshotListenOptions, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on data generated by invoking
 * {@link QuerySnapshot.toJSON} You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on data generated by invoking
 * {@link DocumentSnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are
 * never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on data generated by invoking
 * {@link QuerySnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `QuerySnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, onNext: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on data generated by invoking
 * {@link DocumentSnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks
 * or pass a single observer object with `next` and `error` callbacks. The listener can be cancelled
 * by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param onNext - A callback to be called every time a new `DocumentSnapshot` is available.
 * @param onError - A callback to be called if the listen fails or is cancelled. No further
 * callbacks will occur.
 * @param onCompletion - Can be provided, but will not be called since streams are never ending.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, onNext: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void, onError?: (error: FirestoreError) => void, onCompletion?: () => void, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on QuerySnapshot data generated by invoking
 * {@link QuerySnapshot.toJSON}. You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, observer: {
    next: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on data generated by invoking
 * {@link DocumentSnapshot.toJSON} You may either pass individual `onNext` and `onError` callbacks
 * or pass a single observer object with `next` and `error` callbacks. The listener can be cancelled
 * by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, observer: {
    next: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `QuerySnapshot` events based on QuerySnapshot data generated by invoking
 * {@link QuerySnapshot.toJSON} You may either pass individual `onNext` and `onError` callbacks or
 * pass a single observer object with `next` and `error` callbacks. The listener can be cancelled by
 * calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link QuerySnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel
 * the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, observer: {
    next: (snapshot: QuerySnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for `DocumentSnapshot` events based on QuerySnapshot data generated by
 * invoking {@link DocumentSnapshot.toJSON} You may either pass individual `onNext` and `onError`
 * callbacks or pass a single observer object with `next` and `error` callbacks. The listener can be
 * cancelled by calling the function that is returned when `onSnapshot` is called.
 *
 * NOTE: Although an `onCompletion` callback can be provided, it will never be called because the
 * snapshot stream is never-ending.
 *
 * @param firestore - The {@link Firestore} instance to enable the listener for.
 * @param snapshotJson - A JSON object generated by invoking {@link DocumentSnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export declare function onSnapshotResume<AppModelType, DbModelType extends DocumentData>(firestore: Firestore, snapshotJson: object, options: SnapshotListenOptions, observer: {
    next: (snapshot: DocumentSnapshot<AppModelType, DbModelType>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}, converter?: FirestoreDataConverter<DbModelType>): Unsubscribe;
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use SnapshotMetadata in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param firestore - The instance of Firestore for synchronizing snapshots.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 */
export declare function onSnapshotsInSync(firestore: Firestore, observer: {
    next?: (value: void) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
}): Unsubscribe;
/**
 * Attaches a listener for a snapshots-in-sync event. The snapshots-in-sync
 * event indicates that all listeners affected by a given change have fired,
 * even if a single server-generated change affects multiple listeners.
 *
 * NOTE: The snapshots-in-sync event only indicates that listeners are in sync
 * with each other, but does not relate to whether those snapshots are in sync
 * with the server. Use `SnapshotMetadata` in the individual listeners to
 * determine if a snapshot is from the cache or the server.
 *
 * @param firestore - The `Firestore` instance for synchronizing snapshots.
 * @param onSync - A callback to be called every time all snapshot listeners are
 * in sync with each other.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 */
export declare function onSnapshotsInSync(firestore: Firestore, onSync: () => void): Unsubscribe;
/**
 * Locally writes `mutations` on the async queue.
 * @internal
 */
export declare function executeWrite(firestore: Firestore, mutations: Mutation[]): Promise<void>;
