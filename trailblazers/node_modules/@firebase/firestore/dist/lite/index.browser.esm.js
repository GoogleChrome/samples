import { _registerComponent, registerVersion, SDK_VERSION } from '@firebase/app';
import { Component } from '@firebase/component';
import { _ as __PRIVATE_setSDKVersion, F as Firestore, a as __PRIVATE_LiteAuthCredentialsProvider, b as __PRIVATE_LiteAppCheckTokenProvider, c as __PRIVATE_databaseIdFromApp, O as ObjectValue, d as __PRIVATE_cast, e as __PRIVATE_getDatastore, f as __PRIVATE_mapToArray, g as __PRIVATE_invokeRunAggregationQueryRpc, h as __PRIVATE_LiteUserDataWriter, i as __PRIVATE_fieldPathFromArgument, q as queryEqual, j as __PRIVATE_newUserDataReader, k as __PRIVATE_applyFirestoreDataConverter, l as __PRIVATE_parseSetData, P as Precondition, m as FieldPath, n as __PRIVATE_parseUpdateVarargs, o as __PRIVATE_parseUpdateData, p as __PRIVATE_DeleteMutation, r as FirestoreError, E, s as __PRIVATE_invokeCommitRpc, t as fail, D as DocumentSnapshot, u as __PRIVATE_isNullOrUndefined, v as __PRIVATE_isPermanentError, w as __PRIVATE_logDebug, x as __PRIVATE_logError, y as __PRIVATE_invokeBatchGetDocumentsRpc, z as DocumentKey, A as __PRIVATE_VerifyMutation, S as SnapshotVersion } from './common-0a3137f7.esm.js';
export { B as Bytes, C as CollectionReference, G as DocumentReference, D as DocumentSnapshot, m as FieldPath, H as FieldValue, F as Firestore, r as FirestoreError, I as GeoPoint, Q as Query, J as QueryCompositeFilterConstraint, K as QueryConstraint, L as QueryDocumentSnapshot, M as QueryEndAtConstraint, N as QueryFieldFilterConstraint, R as QueryLimitConstraint, T as QueryOrderByConstraint, U as QuerySnapshot, V as QueryStartAtConstraint, W as Timestamp, X as VectorValue, Y as addDoc, Z as and, $ as arrayRemove, a0 as arrayUnion, a1 as collection, a2 as collectionGroup, a3 as connectFirestoreEmulator, a4 as deleteDoc, a5 as deleteField, a6 as doc, a7 as documentId, a8 as endAt, a9 as endBefore, aa as getDoc, ab as getDocs, ac as getFirestore, ad as increment, ae as initializeFirestore, af as limit, ag as limitToLast, ah as or, ai as orderBy, aj as query, q as queryEqual, ak as refEqual, al as serverTimestamp, am as setDoc, an as setLogLevel, ao as snapshotEqual, ap as startAfter, aq as startAt, ar as terminate, as as updateDoc, at as vector, au as where } from './common-0a3137f7.esm.js';
import { deepEqual, getModularInstance } from '@firebase/util';
import '@firebase/logger';
import '@firebase/webchannel-wrapper/bloom-blob';

const _t = "4.13.0";

/**
 * @license
 * Copyright 2017 Google LLC
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
 */ class __PRIVATE_Deferred {
    constructor() {
        this.promise = new Promise(((t, e) => {
            this.resolve = t, this.reject = e;
        }));
    }
}

/**
 * @license
 * Copyright 2023 Google LLC
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
/**
 * Concrete implementation of the Aggregate type.
 */ class __PRIVATE_AggregateImpl {
    constructor(t, e, i) {
        this.alias = t, this.aggregateType = e, this.fieldPath = i;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
/**
 * A helper for running delayed tasks following an exponential backoff curve
 * between attempts.
 *
 * Each delay is made up of a "base" delay which follows the exponential
 * backoff curve, and a +/- 50% "jitter" that is calculated and added to the
 * base delay. This prevents clients from accidentally synchronizing their
 * delays causing spikes of load to the backend.
 */
class __PRIVATE_ExponentialBackoff {
    constructor(
    /**
     * The AsyncQueue to run backoff operations on.
     */
    t, 
    /**
     * The ID to use when scheduling backoff operations on the AsyncQueue.
     */
    e, 
    /**
     * The initial delay (used as the base delay on the first retry attempt).
     * Note that jitter will still be applied, so the actual delay could be as
     * little as 0.5*initialDelayMs.
     */
    i = 1e3
    /**
     * The multiplier to use to determine the extended base delay after each
     * attempt.
     */ , r = 1.5
    /**
     * The maximum base delay after which no further backoff is performed.
     * Note that jitter will still be applied, so the actual delay could be as
     * much as 1.5*maxDelayMs.
     */ , a = 6e4) {
        this.t = t, this.timerId = e, this.i = i, this.o = r, this.h = a, this.u = 0, this.l = null, 
        /** The last backoff attempt, as epoch milliseconds. */
        this._ = Date.now(), this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */    reset() {
        this.u = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */    m() {
        this.u = this.h;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */    A(t) {
        // Cancel any pending backoff operation.
        this.cancel();
        // First schedule using the current base (which may be 0 and should be
        // honored as such).
        const e = Math.floor(this.u + this.p()), i = Math.max(0, Date.now() - this._), r = Math.max(0, e - i);
        // Guard against lastAttemptTime being in the future due to a clock change.
                r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.u} ms, delay with jitter: ${e} ms, last attempt: ${i} ms ago)`), 
        this.l = this.t.enqueueAfterDelay(this.timerId, r, (() => (this._ = Date.now(), 
        t()))), 
        // Apply backoff factor to determine next delay and ensure it is within
        // bounds.
        this.u *= this.o, this.u < this.i && (this.u = this.i), this.u > this.h && (this.u = this.h);
    }
    T() {
        null !== this.l && (this.l.skipDelay(), this.l = null);
    }
    cancel() {
        null !== this.l && (this.l.cancel(), this.l = null);
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */    p() {
        return (Math.random() - .5) * this.u;
    }
}

/**
 * @license
 * Copyright 2017 Google LLC
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
/** Verifies whether `e` is an IndexedDbTransactionError. */
/**
 * @license
 * Copyright 2022 Google LLC
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
/**
 * Represents an aggregation that can be performed by Firestore.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AggregateField {
    /**
     * Create a new AggregateField<T>
     * @param aggregateType - Specifies the type of aggregation operation to perform.
     * @param _internalFieldPath - Optionally specifies the field that is aggregated.
     * @internal
     */
    constructor(t = "count", e) {
        this._internalFieldPath = e, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateField", this.aggregateType = t;
    }
}

/**
 * The results of executing an aggregation query.
 */ class AggregateQuerySnapshot {
    /** @hideconstructor */
    constructor(t, e, i) {
        this._userDataWriter = e, this._data = i, 
        /** A type string to uniquely identify instances of this class. */
        this.type = "AggregateQuerySnapshot", this.query = t;
    }
    /**
     * Returns the results of the aggregations performed over the underlying
     * query.
     *
     * The keys of the returned object will be the same as those of the
     * `AggregateSpec` object specified to the aggregation method, and the values
     * will be the corresponding aggregation result.
     *
     * @returns The results of the aggregations performed over the underlying
     * query.
     */    data() {
        return this._userDataWriter.convertObjectMap(this._data);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the snapshot as a proto value.
     *
     * @returns An `Object` containing all fields in the snapshot.
     */    _fieldsProto() {
        // Return the cloned value to prevent manipulation of the Snapshot's data
        return new ObjectValue({
            mapValue: {
                fields: this._data
            }
        }).clone().value.mapValue.fields;
    }
}

/**
 * @license
 * Copyright 2022 Google LLC
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
/**
 * Calculates the number of documents in the result set of the given query
 * without actually downloading the documents.
 *
 * Using this function to count the documents is efficient because only the
 * final count, not the documents' data, is downloaded. This function can
 * count the documents in cases where the result set is prohibitively large to
 * download entirely (thousands of documents).
 *
 * @param query - The query whose result set size is calculated.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */ function getCount(t) {
    return getAggregate(t, {
        count: count()
    });
}

/**
 * Calculates the specified aggregations over the documents in the result
 * set of the given query without actually downloading the documents.
 *
 * Using this function to perform aggregations is efficient because only the
 * final aggregation values, not the documents' data, are downloaded. This
 * function can perform aggregations of the documents in cases where the result
 * set is prohibitively large to download entirely (thousands of documents).
 *
 * @param query - The query whose result set is aggregated over.
 * @param aggregateSpec - An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregate(query, {
 *   countOfDocs: count(),
 *   totalHours: sum('hours'),
 *   averageScore: average('score')
 * });
 *
 * const countOfDocs: number = aggregateSnapshot.data().countOfDocs;
 * const totalHours: number = aggregateSnapshot.data().totalHours;
 * const averageScore: number | null = aggregateSnapshot.data().averageScore;
 * ```
 */ function getAggregate(t, e) {
    const i = __PRIVATE_cast(t.firestore, Firestore), r = __PRIVATE_getDatastore(i), a = __PRIVATE_mapToArray(e, ((t, e) => new __PRIVATE_AggregateImpl(e, t.aggregateType, t._internalFieldPath)));
    // Run the aggregation and convert the results
    return __PRIVATE_invokeRunAggregationQueryRpc(r, t._query, a).then((e => function __PRIVATE_convertToAggregateQuerySnapshot(t, e, i) {
        const r = new __PRIVATE_LiteUserDataWriter(t), a = new AggregateQuerySnapshot(e, r, i);
        return a;
    }
    /**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to sum across the result set.
 */ (i, t, e)));
}

function sum(t) {
    return new AggregateField("sum", __PRIVATE_fieldPathFromArgument("sum", t));
}

/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to average across the result set.
 */ function average(t) {
    return new AggregateField("avg", __PRIVATE_fieldPathFromArgument("average", t));
}

/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */ function count() {
    return new AggregateField("count");
}

/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left - Compare this AggregateField to the `right`.
 * @param right - Compare this AggregateField to the `left`.
 */ function aggregateFieldEqual(t, e) {
    return t instanceof AggregateField && e instanceof AggregateField && t.aggregateType === e.aggregateType && t._internalFieldPath?.canonicalString() === e._internalFieldPath?.canonicalString();
}

/**
 * Compares two `AggregateQuerySnapshot` instances for equality.
 *
 * Two `AggregateQuerySnapshot` instances are considered "equal" if they have
 * underlying queries that compare equal, and the same data.
 *
 * @param left - The first `AggregateQuerySnapshot` to compare.
 * @param right - The second `AggregateQuerySnapshot` to compare.
 *
 * @returns `true` if the objects are "equal", as defined above, or `false`
 * otherwise.
 */ function aggregateQuerySnapshotEqual(t, e) {
    return queryEqual(t.query, e.query) && deepEqual(t.data(), e.data());
}

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
/**
 * A write batch, used to perform multiple writes as a single atomic unit.
 *
 * A `WriteBatch` object can be acquired by calling {@link writeBatch}. It
 * provides methods for adding writes to the write batch. None of the writes
 * will be committed (or visible locally) until {@link WriteBatch.commit} is
 * called.
 */ class WriteBatch {
    /** @hideconstructor */
    constructor(t, e) {
        this._firestore = t, this._commitHandler = e, this._mutations = [], this._committed = !1, 
        this._dataReader = __PRIVATE_newUserDataReader(t);
    }
    set(t, e, i) {
        this._verifyNotCommitted();
        const r = __PRIVATE_validateReference(t, this._firestore), a = __PRIVATE_applyFirestoreDataConverter(r.converter, e, i), o = __PRIVATE_parseSetData(this._dataReader, "WriteBatch.set", r._key, a, null !== r.converter, i);
        return this._mutations.push(o.toMutation(r._key, Precondition.none())), this;
    }
    update(t, e, i, ...r) {
        this._verifyNotCommitted();
        const a = __PRIVATE_validateReference(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let o;
        return o = "string" == typeof (e = getModularInstance(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "WriteBatch.update", a._key, e, i, r) : __PRIVATE_parseUpdateData(this._dataReader, "WriteBatch.update", a._key, e), 
        this._mutations.push(o.toMutation(a._key, Precondition.exists(!0))), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */    delete(t) {
        this._verifyNotCommitted();
        const e = __PRIVATE_validateReference(t, this._firestore);
        return this._mutations = this._mutations.concat(new __PRIVATE_DeleteMutation(e._key, Precondition.none())), this;
    }
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * The result of these writes will only be reflected in document reads that
     * occur after the returned promise resolves. If the client is offline, the
     * write fails. If you would like to see local modifications or buffer writes
     * until the client is online, use the full Firestore SDK.
     *
     * @returns A `Promise` resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit (note that it won't
     * resolve while you're offline).
     */    commit() {
        return this._verifyNotCommitted(), this._committed = !0, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
    }
    _verifyNotCommitted() {
        if (this._committed) throw new FirestoreError(E.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
    }
}

function __PRIVATE_validateReference(t, e) {
    if ((t = getModularInstance(t)).firestore !== e) throw new FirestoreError(E.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
    return t;
}

/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single WriteBatch
 * is 500.
 *
 * The result of these writes will only be reflected in document reads that
 * occur after the returned promise resolves. If the client is offline, the
 * write fails. If you would like to see local modifications or buffer writes
 * until the client is online, use the full Firestore SDK.
 *
 * @returns A `WriteBatch` that can be used to atomically execute multiple
 * writes.
 */ function writeBatch(t) {
    t = __PRIVATE_cast(t, Firestore);
    const e = __PRIVATE_getDatastore(t);
    return new WriteBatch(t, (t => __PRIVATE_invokeCommitRpc(e, t)));
}

/**
 * @license
 * Copyright 2017 Google LLC
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
/**
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */ class Transaction$1 {
    constructor(t) {
        this.datastore = t, 
        // The version of each document that was read during this transaction.
        this.readVersions = new Map, this.mutations = [], this.committed = !1, 
        /**
         * A deferred usage error that occurred previously in this transaction that
         * will cause the transaction to fail once it actually commits.
         */
        this.lastTransactionError = null, 
        /**
         * Set of documents that have been written in the transaction.
         *
         * When there's more than one write to the same key in a transaction, any
         * writes after the first are handled differently.
         */
        this.writtenDocs = new Set;
    }
    async lookup(t) {
        if (this.ensureCommitNotCalled(), this.mutations.length > 0) throw this.lastTransactionError = new FirestoreError(E.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes."), 
        this.lastTransactionError;
        const e = await __PRIVATE_invokeBatchGetDocumentsRpc(this.datastore, t);
        return e.forEach((t => this.recordVersion(t))), e;
    }
    set(t, e) {
        this.write(e.toMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
    update(t, e) {
        try {
            this.write(e.toMutation(t, this.preconditionForUpdate(t)));
        } catch (t) {
            this.lastTransactionError = t;
        }
        this.writtenDocs.add(t.toString());
    }
    delete(t) {
        this.write(new __PRIVATE_DeleteMutation(t, this.precondition(t))), this.writtenDocs.add(t.toString());
    }
    async commit() {
        if (this.ensureCommitNotCalled(), this.lastTransactionError) throw this.lastTransactionError;
        const t = this.readVersions;
        // For each mutation, note that the doc was written.
                this.mutations.forEach((e => {
            t.delete(e.key.toString());
        })), 
        // For each document that was read but not written to, we want to perform
        // a `verify` operation.
        t.forEach(((t, e) => {
            const i = DocumentKey.fromPath(e);
            this.mutations.push(new __PRIVATE_VerifyMutation(i, this.precondition(i)));
        })), await __PRIVATE_invokeCommitRpc(this.datastore, this.mutations), this.committed = !0;
    }
    recordVersion(t) {
        let e;
        if (t.isFoundDocument()) e = t.version; else {
            if (!t.isNoDocument()) throw fail(50498, {
                R: t.constructor.name
            });
            // Represent a deleted doc using SnapshotVersion.min().
            e = SnapshotVersion.min();
        }
        const i = this.readVersions.get(t.key.toString());
        if (i) {
            if (!e.isEqual(i)) 
            // This transaction will fail no matter what.
            throw new FirestoreError(E.ABORTED, "Document version changed between two reads.");
        } else this.readVersions.set(t.key.toString(), e);
    }
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */    precondition(t) {
        const e = this.readVersions.get(t.toString());
        return !this.writtenDocs.has(t.toString()) && e ? e.isEqual(SnapshotVersion.min()) ? Precondition.exists(!1) : Precondition.updateTime(e) : Precondition.none();
    }
    /**
     * Returns the precondition for a document if the operation is an update.
     */    preconditionForUpdate(t) {
        const e = this.readVersions.get(t.toString());
        // The first time a document is written, we want to take into account the
        // read time and existence
                if (!this.writtenDocs.has(t.toString()) && e) {
            if (e.isEqual(SnapshotVersion.min())) 
            // The document doesn't exist, so fail the transaction.
            // This has to be validated locally because you can't send a
            // precondition that a document does not exist without changing the
            // semantics of the backend write to be an insert. This is the reverse
            // of what we want, since we want to assert that the document doesn't
            // exist but then send the update and have it fail. Since we can't
            // express that to the backend, we have to validate locally.
            // Note: this can change once we can send separate verify writes in the
            // transaction.
            throw new FirestoreError(E.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
            // Document exists, base precondition on document update time.
                        return Precondition.updateTime(e);
        }
        // Document was not read, so we just use the preconditions for a blind
        // update.
        return Precondition.exists(!0);
    }
    write(t) {
        this.ensureCommitNotCalled(), this.mutations.push(t);
    }
    ensureCommitNotCalled() {}
}

/**
 * @license
 * Copyright 2022 Google LLC
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
 */ const ft = {
    maxAttempts: 5
};

/**
 * @license
 * Copyright 2019 Google LLC
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
/**
 * TransactionRunner encapsulates the logic needed to run and retry transactions
 * with backoff.
 */
class __PRIVATE_TransactionRunner {
    constructor(t, e, i, r, a) {
        this.asyncQueue = t, this.datastore = e, this.options = i, this.updateFunction = r, 
        this.deferred = a, this.I = i.maxAttempts, this.P = new __PRIVATE_ExponentialBackoff(this.asyncQueue, "transaction_retry" /* TimerId.TransactionRetry */);
    }
    /** Runs the transaction and sets the result on deferred. */    V() {
        this.I -= 1, this.D();
    }
    D() {
        this.P.A((async () => {
            const t = new Transaction$1(this.datastore), e = this.F(t);
            e && e.then((e => {
                this.asyncQueue.enqueueAndForget((() => t.commit().then((() => {
                    this.deferred.resolve(e);
                })).catch((t => {
                    this.v(t);
                }))));
            })).catch((t => {
                this.v(t);
            }));
        }));
    }
    F(t) {
        try {
            const e = this.updateFunction(t);
            return !__PRIVATE_isNullOrUndefined(e) && e.catch && e.then ? e : (this.deferred.reject(Error("Transaction callback must return a Promise")), 
            null);
        } catch (t) {
            // Do not retry errors thrown by user provided updateFunction.
            return this.deferred.reject(t), null;
        }
    }
    v(t) {
        this.I > 0 && this.B(t) ? (this.I -= 1, this.asyncQueue.enqueueAndForget((() => (this.D(), 
        Promise.resolve())))) : this.deferred.reject(t);
    }
    B(t) {
        if ("FirebaseError" === t?.name) {
            // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
            // non-matching document versions with ABORTED. These errors should be retried.
            const e = t.code;
            return "aborted" === e || "failed-precondition" === e || "already-exists" === e || !__PRIVATE_isPermanentError(e);
        }
        return !1;
    }
}

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
/** The Platform's 'document' implementation or null if not available. */ function getDocument() {
    // `document` is not always available, e.g. in ReactNative and WebWorkers.
    // eslint-disable-next-line no-restricted-globals
    return "undefined" != typeof document ? document : null;
}

/**
 * @license
 * Copyright 2017 Google LLC
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
/**
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */ class DelayedOperation {
    constructor(t, e, i, r, a) {
        this.asyncQueue = t, this.timerId = e, this.targetTimeMs = i, this.op = r, this.removalCallback = a, 
        this.deferred = new __PRIVATE_Deferred, this.then = this.deferred.promise.then.bind(this.deferred.promise), 
        // It's normal for the deferred promise to be canceled (due to cancellation)
        // and so we attach a dummy catch callback to avoid
        // 'UnhandledPromiseRejectionWarning' log spam.
        this.deferred.promise.catch((t => {}));
    }
    get promise() {
        return this.deferred.promise;
    }
    /**
     * Creates and returns a DelayedOperation that has been scheduled to be
     * executed on the provided asyncQueue after the provided delayMs.
     *
     * @param asyncQueue - The queue to schedule the operation on.
     * @param id - A Timer ID identifying the type of operation this is.
     * @param delayMs - The delay (ms) before the operation should be scheduled.
     * @param op - The operation to run.
     * @param removalCallback - A callback to be called synchronously once the
     *   operation is executed or canceled, notifying the AsyncQueue to remove it
     *   from its delayedOperations list.
     *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
     *   the DelayedOperation class public.
     */    static createAndSchedule(t, e, i, r, a) {
        const o = Date.now() + i, h = new DelayedOperation(t, e, o, r, a);
        return h.start(i), h;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */    start(t) {
        this.timerHandle = setTimeout((() => this.handleDelayElapsed()), t);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */    skipDelay() {
        return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */    cancel(t) {
        null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(E.CANCELLED, "Operation cancelled" + (t ? ": " + t : ""))));
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), 
        this.op().then((t => this.deferred.resolve(t)))) : Promise.resolve()));
    }
    clearTimeout() {
        null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), 
        this.timerHandle = null);
    }
}

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
 */ const dt = "AsyncQueue";

class __PRIVATE_AsyncQueueImpl {
    constructor(t = Promise.resolve()) {
        // A list of retryable operations. Retryable operations are run in order and
        // retried with backoff.
        this.k = [], 
        // Is this AsyncQueue being shut down? Once it is set to true, it will not
        // be changed again.
        this.q = !1, 
        // Operations scheduled to be queued in the future. Operations are
        // automatically removed after they are run or canceled.
        this.O = [], 
        // visible for testing
        this.S = null, 
        // Flag set while there's an outstanding AsyncQueue operation, used for
        // assertion sanity-checks.
        this.C = !1, 
        // Enabled during shutdown on Safari to prevent future access to IndexedDB.
        this.M = !1, 
        // List of TimerIds to fast-forward delays for.
        this.N = [], 
        // Backoff timer used to schedule retries for retryable operations
        this.P = new __PRIVATE_ExponentialBackoff(this, "async_queue_retry" /* TimerId.AsyncQueueRetry */), 
        // Visibility handler that triggers an immediate retry of all retryable
        // operations. Meant to speed up recovery when we regain file system access
        // after page comes into foreground.
        this.L = () => {
            const t = getDocument();
            t && __PRIVATE_logDebug(dt, "Visibility state changed to " + t.visibilityState), this.P.T();
        }, this.W = t;
        const e = getDocument();
        e && "function" == typeof e.addEventListener && e.addEventListener("visibilitychange", this.L);
    }
    get isShuttingDown() {
        return this.q;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */    enqueueAndForget(t) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueue(t);
    }
    enqueueAndForgetEvenWhileRestricted(t) {
        this.U(), 
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.$(t);
    }
    enterRestrictedMode(t) {
        if (!this.q) {
            this.q = !0, this.M = t || !1;
            const e = getDocument();
            e && "function" == typeof e.removeEventListener && e.removeEventListener("visibilitychange", this.L);
        }
    }
    enqueue(t) {
        if (this.U(), this.q) 
        // Return a Promise which never resolves.
        return new Promise((() => {}));
        // Create a deferred Promise that we can return to the callee. This
        // allows us to return a "hanging Promise" only to the callee and still
        // advance the queue even when the operation is not run.
                const e = new __PRIVATE_Deferred;
        return this.$((() => this.q && this.M ? Promise.resolve() : (t().then(e.resolve, e.reject), 
        e.promise))).then((() => e.promise));
    }
    enqueueRetryable(t) {
        this.enqueueAndForget((() => (this.k.push(t), this.j())));
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */    async j() {
        if (0 !== this.k.length) {
            try {
                await this.k[0](), this.k.shift(), this.P.reset();
            } catch (t) {
                if (!function __PRIVATE_isIndexedDbTransactionError(t) {
                    // Use name equality, as instanceof checks on errors don't work with errors
                    // that wrap other errors.
                    return "IndexedDbTransactionError" === t.name;
                }
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
 */ (t)) throw t;
 // Failure will be handled by AsyncQueue
                                __PRIVATE_logDebug(dt, "Operation failed with retryable error: " + t);
            }
            this.k.length > 0 && 
            // If there are additional operations, we re-schedule `retryNextOp()`.
            // This is necessary to run retryable operations that failed during
            // their initial attempt since we don't know whether they are already
            // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
            // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
            // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
            // call scheduled here.
            // Since `backoffAndRun()` cancels an existing backoff and schedules a
            // new backoff on every call, there is only ever a single additional
            // operation in the queue.
            this.P.A((() => this.j()));
        }
    }
    $(t) {
        const e = this.W.then((() => (this.C = !0, t().catch((t => {
            this.S = t, this.C = !1;
            const e = __PRIVATE_getMessageOrStack(t);
            // Re-throw the error so that this.tail becomes a rejected Promise and
            // all further attempts to chain (via .then) will just short-circuit
            // and return the rejected Promise.
            throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", e), t;
        })).then((t => (this.C = !1, t))))));
        return this.W = e, e;
    }
    enqueueAfterDelay(t, e, i) {
        this.U(), 
        // Fast-forward delays for timerIds that have been overridden.
        this.N.indexOf(t) > -1 && (e = 0);
        const r = DelayedOperation.createAndSchedule(this, t, e, i, (t => this.G(t)));
        return this.O.push(r), r;
    }
    U() {
        this.S && fail(47125, {
            H: __PRIVATE_getMessageOrStack(this.S)
        });
    }
    verifyOperationInProgress() {}
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */    async J() {
        // Operations in the queue prior to draining may have enqueued additional
        // operations. Keep draining the queue until the tail is no longer advanced,
        // which indicates that no more new operations were enqueued and that all
        // operations were executed.
        let t;
        do {
            t = this.W, await t;
        } while (t !== this.W);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */    K(t) {
        for (const e of this.O) if (e.timerId === t) return !0;
        return !1;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */    X(t) {
        // Note that draining may generate more delayed ops, so we do that first.
        return this.J().then((() => {
            // Run ops in the same order they'd run if they ran naturally.
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            this.O.sort(((t, e) => t.targetTimeMs - e.targetTimeMs));
            for (const e of this.O) if (e.skipDelay(), "all" /* TimerId.All */ !== t && e.timerId === t) break;
            return this.J();
        }));
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */    Y(t) {
        this.N.push(t);
    }
    /** Called once a DelayedOperation is run or canceled. */    G(t) {
        // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
        const e = this.O.indexOf(t);
        /* eslint-disable-next-line @typescript-eslint/no-floating-promises */        this.O.splice(e, 1);
    }
}

/**
 * Chrome includes Error.message in Error.stack. Other browsers do not.
 * This returns expected output of message + stack when available.
 * @param error - Error or FirestoreError
 */
function __PRIVATE_getMessageOrStack(t) {
    let e = t.message || "";
    return t.stack && (e = t.stack.includes(t.message) ? t.stack : t.message + "\n" + t.stack), 
    e;
}

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
// TODO(mrschmidt) Consider using `BaseTransaction` as the base class in the
// legacy SDK.
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */ class Transaction {
    /** @hideconstructor */
    constructor(t, e) {
        this._firestore = t, this._transaction = e, this._dataReader = __PRIVATE_newUserDataReader(t);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */    get(t) {
        const e = __PRIVATE_validateReference(t, this._firestore), i = new __PRIVATE_LiteUserDataWriter(this._firestore);
        return this._transaction.lookup([ e._key ]).then((t => {
            if (!t || 1 !== t.length) return fail(24041);
            const r = t[0];
            if (r.isFoundDocument()) return new DocumentSnapshot(this._firestore, i, r.key, r, e.converter);
            if (r.isNoDocument()) return new DocumentSnapshot(this._firestore, i, e._key, null, e.converter);
            throw fail(18433, {
                doc: r
            });
        }));
    }
    set(t, e, i) {
        const r = __PRIVATE_validateReference(t, this._firestore), a = __PRIVATE_applyFirestoreDataConverter(r.converter, e, i), o = __PRIVATE_parseSetData(this._dataReader, "Transaction.set", r._key, a, null !== r.converter, i);
        return this._transaction.set(r._key, o), this;
    }
    update(t, e, i, ...r) {
        const a = __PRIVATE_validateReference(t, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
                let o;
        return o = "string" == typeof (e = getModularInstance(e)) || e instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "Transaction.update", a._key, e, i, r) : __PRIVATE_parseUpdateData(this._dataReader, "Transaction.update", a._key, e), 
        this._transaction.update(a._key, o), this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */    delete(t) {
        const e = __PRIVATE_validateReference(t, this._firestore);
        return this._transaction.delete(e._key), this;
    }
}

/**
 * Executes the given `updateFunction` and then attempts to commit the changes
 * applied within the transaction. If any document read within the transaction
 * has changed, Cloud Firestore retries the `updateFunction`. If it fails to
 * commit after 5 attempts, the transaction fails.
 *
 * The maximum number of writes allowed in a single transaction is 500.
 *
 * @param firestore - A reference to the Firestore database to run this
 * transaction against.
 * @param updateFunction - The function to execute within the transaction
 * context.
 * @param options - An options object to configure maximum number of attempts to
 * commit.
 * @returns If the transaction completed successfully or was explicitly aborted
 * (the `updateFunction` returned a failed promise), the promise returned by the
 * `updateFunction `is returned here. Otherwise, if the transaction failed, a
 * rejected promise with the corresponding failure error is returned.
 */ function runTransaction(t, e, i) {
    t = __PRIVATE_cast(t, Firestore);
    const r = __PRIVATE_getDatastore(t), a = {
        ...ft,
        ...i
    };
    !function __PRIVATE_validateTransactionOptions(t) {
        if (t.maxAttempts < 1) throw new FirestoreError(E.INVALID_ARGUMENT, "Max attempts must be at least 1");
    }(a);
    const o = new __PRIVATE_Deferred;
    return new __PRIVATE_TransactionRunner(function __PRIVATE_newAsyncQueue() {
        return new __PRIVATE_AsyncQueueImpl;
    }(), r, a, (i => e(new Transaction(t, i))), o).V(), o.promise;
}

/**
 * Firestore Lite
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */ !function __PRIVATE_registerFirestore() {
    __PRIVATE_setSDKVersion(`${SDK_VERSION}_lite`), _registerComponent(new Component("firestore/lite", ((t, {instanceIdentifier: e, options: i}) => {
        const r = t.getProvider("app").getImmediate(), a = new Firestore(new __PRIVATE_LiteAuthCredentialsProvider(t.getProvider("auth-internal")), new __PRIVATE_LiteAppCheckTokenProvider(r, t.getProvider("app-check-internal")), __PRIVATE_databaseIdFromApp(r, e), r);
        return i && a._setSettings(i), a;
    }), "PUBLIC").setMultipleInstances(!0)), 
    // RUNTIME_ENV and BUILD_TARGET are replaced by real values during the compilation
    registerVersion("firestore-lite", _t, ""), registerVersion("firestore-lite", _t, "esm2020");
}();

export { AggregateField, AggregateQuerySnapshot, Transaction, WriteBatch, aggregateFieldEqual, aggregateQuerySnapshotEqual, average, count, getAggregate, getCount, runTransaction, sum, writeBatch };
//# sourceMappingURL=index.browser.esm.js.map
