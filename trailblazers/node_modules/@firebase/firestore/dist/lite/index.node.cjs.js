'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var app = require('@firebase/app');
var component = require('@firebase/component');
var common6d85b8e5_node = require('./common-29bfb23b.node.cjs.js');
var util = require('@firebase/util');
require('crypto');
require('@firebase/logger');
require('util');
require('@firebase/webchannel-wrapper/bloom-blob');

const version = "4.13.0";

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
class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
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
const LOG_TAG$1 = 'ExponentialBackoff';
/**
 * Initial backoff time in milliseconds after an error.
 * Set to 1s according to https://cloud.google.com/apis/design/errors.
 */
const DEFAULT_BACKOFF_INITIAL_DELAY_MS = 1000;
const DEFAULT_BACKOFF_FACTOR = 1.5;
/** Maximum backoff time in milliseconds */
const DEFAULT_BACKOFF_MAX_DELAY_MS = 60 * 1000;
/**
 * A helper for running delayed tasks following an exponential backoff curve
 * between attempts.
 *
 * Each delay is made up of a "base" delay which follows the exponential
 * backoff curve, and a +/- 50% "jitter" that is calculated and added to the
 * base delay. This prevents clients from accidentally synchronizing their
 * delays causing spikes of load to the backend.
 */
class ExponentialBackoff {
    constructor(
    /**
     * The AsyncQueue to run backoff operations on.
     */
    queue, 
    /**
     * The ID to use when scheduling backoff operations on the AsyncQueue.
     */
    timerId, 
    /**
     * The initial delay (used as the base delay on the first retry attempt).
     * Note that jitter will still be applied, so the actual delay could be as
     * little as 0.5*initialDelayMs.
     */
    initialDelayMs = DEFAULT_BACKOFF_INITIAL_DELAY_MS, 
    /**
     * The multiplier to use to determine the extended base delay after each
     * attempt.
     */
    backoffFactor = DEFAULT_BACKOFF_FACTOR, 
    /**
     * The maximum base delay after which no further backoff is performed.
     * Note that jitter will still be applied, so the actual delay could be as
     * much as 1.5*maxDelayMs.
     */
    maxDelayMs = DEFAULT_BACKOFF_MAX_DELAY_MS) {
        this.queue = queue;
        this.timerId = timerId;
        this.initialDelayMs = initialDelayMs;
        this.backoffFactor = backoffFactor;
        this.maxDelayMs = maxDelayMs;
        this.currentBaseMs = 0;
        this.timerPromise = null;
        /** The last backoff attempt, as epoch milliseconds. */
        this.lastAttemptTime = Date.now();
        this.reset();
    }
    /**
     * Resets the backoff delay.
     *
     * The very next backoffAndWait() will have no delay. If it is called again
     * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
     * subsequent ones will increase according to the backoffFactor.
     */
    reset() {
        this.currentBaseMs = 0;
    }
    /**
     * Resets the backoff delay to the maximum delay (e.g. for use after a
     * RESOURCE_EXHAUSTED error).
     */
    resetToMax() {
        this.currentBaseMs = this.maxDelayMs;
    }
    /**
     * Returns a promise that resolves after currentDelayMs, and increases the
     * delay for any subsequent attempts. If there was a pending backoff operation
     * already, it will be canceled.
     */
    backoffAndRun(op) {
        // Cancel any pending backoff operation.
        this.cancel();
        // First schedule using the current base (which may be 0 and should be
        // honored as such).
        const desiredDelayWithJitterMs = Math.floor(this.currentBaseMs + this.jitterDelayMs());
        // Guard against lastAttemptTime being in the future due to a clock change.
        const delaySoFarMs = Math.max(0, Date.now() - this.lastAttemptTime);
        // Guard against the backoff delay already being past.
        const remainingDelayMs = Math.max(0, desiredDelayWithJitterMs - delaySoFarMs);
        if (remainingDelayMs > 0) {
            common6d85b8e5_node.logDebug(LOG_TAG$1, `Backing off for ${remainingDelayMs} ms ` +
                `(base delay: ${this.currentBaseMs} ms, ` +
                `delay with jitter: ${desiredDelayWithJitterMs} ms, ` +
                `last attempt: ${delaySoFarMs} ms ago)`);
        }
        this.timerPromise = this.queue.enqueueAfterDelay(this.timerId, remainingDelayMs, () => {
            this.lastAttemptTime = Date.now();
            return op();
        });
        // Apply backoff factor to determine next delay and ensure it is within
        // bounds.
        this.currentBaseMs *= this.backoffFactor;
        if (this.currentBaseMs < this.initialDelayMs) {
            this.currentBaseMs = this.initialDelayMs;
        }
        if (this.currentBaseMs > this.maxDelayMs) {
            this.currentBaseMs = this.maxDelayMs;
        }
    }
    skipBackoff() {
        if (this.timerPromise !== null) {
            this.timerPromise.skipDelay();
            this.timerPromise = null;
        }
    }
    cancel() {
        if (this.timerPromise !== null) {
            this.timerPromise.cancel();
            this.timerPromise = null;
        }
    }
    /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
    jitterDelayMs() {
        return (Math.random() - 0.5) * this.currentBaseMs;
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
function isIndexedDbTransactionError(e) {
    // Use name equality, as instanceof checks on errors don't work with errors
    // that wrap other errors.
    return e.name === 'IndexedDbTransactionError';
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
function registerFirestore() {
    common6d85b8e5_node.setSDKVersion(`${app.SDK_VERSION}_lite`);
    app._registerComponent(new component.Component('firestore/lite', (container, { instanceIdentifier: databaseId, options: settings }) => {
        const app = container.getProvider('app').getImmediate();
        const firestoreInstance = new common6d85b8e5_node.Firestore(new common6d85b8e5_node.LiteAuthCredentialsProvider(container.getProvider('auth-internal')), new common6d85b8e5_node.LiteAppCheckTokenProvider(app, container.getProvider('app-check-internal')), common6d85b8e5_node.databaseIdFromApp(app, databaseId), app);
        if (settings) {
            firestoreInstance._setSettings(settings);
        }
        return firestoreInstance;
    }, 'PUBLIC').setMultipleInstances(true));
    // RUNTIME_ENV and BUILD_TARGET are replaced by real values during the compilation
    app.registerVersion('firestore-lite', version, 'node');
    app.registerVersion('firestore-lite', version, 'cjs2020');
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
 */
class AggregateImpl {
    constructor(alias, aggregateType, fieldPath) {
        this.alias = alias;
        this.aggregateType = aggregateType;
        this.fieldPath = fieldPath;
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
    constructor(aggregateType = 'count', _internalFieldPath) {
        this._internalFieldPath = _internalFieldPath;
        /** A type string to uniquely identify instances of this class. */
        this.type = 'AggregateField';
        this.aggregateType = aggregateType;
    }
}
/**
 * The results of executing an aggregation query.
 */
class AggregateQuerySnapshot {
    /** @hideconstructor */
    constructor(query, _userDataWriter, _data) {
        this._userDataWriter = _userDataWriter;
        this._data = _data;
        /** A type string to uniquely identify instances of this class. */
        this.type = 'AggregateQuerySnapshot';
        this.query = query;
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
     */
    data() {
        return this._userDataWriter.convertObjectMap(this._data);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the snapshot as a proto value.
     *
     * @returns An `Object` containing all fields in the snapshot.
     */
    _fieldsProto() {
        // Wrap data in an ObjectValue to clone it.
        const dataClone = new common6d85b8e5_node.ObjectValue({
            mapValue: { fields: this._data }
        }).clone();
        // Return the cloned value to prevent manipulation of the Snapshot's data
        return dataClone.value.mapValue.fields;
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
 */
function getCount(query) {
    const countQuerySpec = {
        count: count()
    };
    return getAggregate(query, countQuerySpec);
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
 */
function getAggregate(query, aggregateSpec) {
    const firestore = common6d85b8e5_node.cast(query.firestore, common6d85b8e5_node.Firestore);
    const datastore = common6d85b8e5_node.getDatastore(firestore);
    const internalAggregates = common6d85b8e5_node.mapToArray(aggregateSpec, (aggregate, alias) => {
        return new AggregateImpl(alias, aggregate.aggregateType, aggregate._internalFieldPath);
    });
    // Run the aggregation and convert the results
    return common6d85b8e5_node.invokeRunAggregationQueryRpc(datastore, query._query, internalAggregates).then(aggregateResult => convertToAggregateQuerySnapshot(firestore, query, aggregateResult));
}
function convertToAggregateQuerySnapshot(firestore, query, aggregateResult) {
    const userDataWriter = new common6d85b8e5_node.LiteUserDataWriter(firestore);
    const querySnapshot = new AggregateQuerySnapshot(query, userDataWriter, aggregateResult);
    return querySnapshot;
}
/**
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to sum across the result set.
 */
function sum(field) {
    return new AggregateField('sum', common6d85b8e5_node.fieldPathFromArgument('sum', field));
}
/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to average across the result set.
 */
function average(field) {
    return new AggregateField('avg', common6d85b8e5_node.fieldPathFromArgument('average', field));
}
/**
 * Create an AggregateField object that can be used to compute the count of
 * documents in the result set of a query.
 */
function count() {
    return new AggregateField('count');
}
/**
 * Compares two 'AggregateField` instances for equality.
 *
 * @param left - Compare this AggregateField to the `right`.
 * @param right - Compare this AggregateField to the `left`.
 */
function aggregateFieldEqual(left, right) {
    return (left instanceof AggregateField &&
        right instanceof AggregateField &&
        left.aggregateType === right.aggregateType &&
        left._internalFieldPath?.canonicalString() ===
            right._internalFieldPath?.canonicalString());
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
 */
function aggregateQuerySnapshotEqual(left, right) {
    return (common6d85b8e5_node.queryEqual(left.query, right.query) && util.deepEqual(left.data(), right.data()));
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
 */
class WriteBatch {
    /** @hideconstructor */
    constructor(_firestore, _commitHandler) {
        this._firestore = _firestore;
        this._commitHandler = _commitHandler;
        this._mutations = [];
        this._committed = false;
        this._dataReader = common6d85b8e5_node.newUserDataReader(_firestore);
    }
    set(documentRef, data, options) {
        this._verifyNotCommitted();
        const ref = validateReference(documentRef, this._firestore);
        const convertedValue = common6d85b8e5_node.applyFirestoreDataConverter(ref.converter, data, options);
        const parsed = common6d85b8e5_node.parseSetData(this._dataReader, 'WriteBatch.set', ref._key, convertedValue, ref.converter !== null, options);
        this._mutations.push(parsed.toMutation(ref._key, common6d85b8e5_node.Precondition.none()));
        return this;
    }
    update(documentRef, fieldOrUpdateData, value, ...moreFieldsAndValues) {
        this._verifyNotCommitted();
        const ref = validateReference(documentRef, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
        fieldOrUpdateData = util.getModularInstance(fieldOrUpdateData);
        let parsed;
        if (typeof fieldOrUpdateData === 'string' ||
            fieldOrUpdateData instanceof common6d85b8e5_node.FieldPath) {
            parsed = common6d85b8e5_node.parseUpdateVarargs(this._dataReader, 'WriteBatch.update', ref._key, fieldOrUpdateData, value, moreFieldsAndValues);
        }
        else {
            parsed = common6d85b8e5_node.parseUpdateData(this._dataReader, 'WriteBatch.update', ref._key, fieldOrUpdateData);
        }
        this._mutations.push(parsed.toMutation(ref._key, common6d85b8e5_node.Precondition.exists(true)));
        return this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `WriteBatch` instance. Used for chaining method calls.
     */
    delete(documentRef) {
        this._verifyNotCommitted();
        const ref = validateReference(documentRef, this._firestore);
        this._mutations = this._mutations.concat(new common6d85b8e5_node.DeleteMutation(ref._key, common6d85b8e5_node.Precondition.none()));
        return this;
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
     */
    commit() {
        this._verifyNotCommitted();
        this._committed = true;
        if (this._mutations.length > 0) {
            return this._commitHandler(this._mutations);
        }
        return Promise.resolve();
    }
    _verifyNotCommitted() {
        if (this._committed) {
            throw new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.FAILED_PRECONDITION, 'A write batch can no longer be used after commit() ' +
                'has been called.');
        }
    }
}
function validateReference(documentRef, firestore) {
    documentRef = util.getModularInstance(documentRef);
    if (documentRef.firestore !== firestore) {
        throw new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.INVALID_ARGUMENT, 'Provided document reference is from a different Firestore instance.');
    }
    else {
        return documentRef;
    }
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
 */
function writeBatch(firestore) {
    firestore = common6d85b8e5_node.cast(firestore, common6d85b8e5_node.Firestore);
    const datastore = common6d85b8e5_node.getDatastore(firestore);
    return new WriteBatch(firestore, writes => common6d85b8e5_node.invokeCommitRpc(datastore, writes));
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
const DEFAULT_TRANSACTION_OPTIONS = {
    maxAttempts: 5
};
function validateTransactionOptions(options) {
    if (options.maxAttempts < 1) {
        throw new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.INVALID_ARGUMENT, 'Max attempts must be at least 1');
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
 * Internal transaction object responsible for accumulating the mutations to
 * perform and the base versions for any documents read.
 */
class Transaction$1 {
    constructor(datastore) {
        this.datastore = datastore;
        // The version of each document that was read during this transaction.
        this.readVersions = new Map();
        this.mutations = [];
        this.committed = false;
        /**
         * A deferred usage error that occurred previously in this transaction that
         * will cause the transaction to fail once it actually commits.
         */
        this.lastTransactionError = null;
        /**
         * Set of documents that have been written in the transaction.
         *
         * When there's more than one write to the same key in a transaction, any
         * writes after the first are handled differently.
         */
        this.writtenDocs = new Set();
    }
    async lookup(keys) {
        this.ensureCommitNotCalled();
        if (this.mutations.length > 0) {
            this.lastTransactionError = new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.INVALID_ARGUMENT, 'Firestore transactions require all reads to be executed before all writes.');
            throw this.lastTransactionError;
        }
        const docs = await common6d85b8e5_node.invokeBatchGetDocumentsRpc(this.datastore, keys);
        docs.forEach(doc => this.recordVersion(doc));
        return docs;
    }
    set(key, data) {
        this.write(data.toMutation(key, this.precondition(key)));
        this.writtenDocs.add(key.toString());
    }
    update(key, data) {
        try {
            this.write(data.toMutation(key, this.preconditionForUpdate(key)));
        }
        catch (e) {
            this.lastTransactionError = e;
        }
        this.writtenDocs.add(key.toString());
    }
    delete(key) {
        this.write(new common6d85b8e5_node.DeleteMutation(key, this.precondition(key)));
        this.writtenDocs.add(key.toString());
    }
    async commit() {
        this.ensureCommitNotCalled();
        if (this.lastTransactionError) {
            throw this.lastTransactionError;
        }
        const unwritten = this.readVersions;
        // For each mutation, note that the doc was written.
        this.mutations.forEach(mutation => {
            unwritten.delete(mutation.key.toString());
        });
        // For each document that was read but not written to, we want to perform
        // a `verify` operation.
        unwritten.forEach((_, path) => {
            const key = common6d85b8e5_node.DocumentKey.fromPath(path);
            this.mutations.push(new common6d85b8e5_node.VerifyMutation(key, this.precondition(key)));
        });
        await common6d85b8e5_node.invokeCommitRpc(this.datastore, this.mutations);
        this.committed = true;
    }
    recordVersion(doc) {
        let docVersion;
        if (doc.isFoundDocument()) {
            docVersion = doc.version;
        }
        else if (doc.isNoDocument()) {
            // Represent a deleted doc using SnapshotVersion.min().
            docVersion = common6d85b8e5_node.SnapshotVersion.min();
        }
        else {
            throw common6d85b8e5_node.fail(0xc542, {
                documentName: doc.constructor.name
            });
        }
        const existingVersion = this.readVersions.get(doc.key.toString());
        if (existingVersion) {
            if (!docVersion.isEqual(existingVersion)) {
                // This transaction will fail no matter what.
                throw new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.ABORTED, 'Document version changed between two reads.');
            }
        }
        else {
            this.readVersions.set(doc.key.toString(), docVersion);
        }
    }
    /**
     * Returns the version of this document when it was read in this transaction,
     * as a precondition, or no precondition if it was not read.
     */
    precondition(key) {
        const version = this.readVersions.get(key.toString());
        if (!this.writtenDocs.has(key.toString()) && version) {
            if (version.isEqual(common6d85b8e5_node.SnapshotVersion.min())) {
                return common6d85b8e5_node.Precondition.exists(false);
            }
            else {
                return common6d85b8e5_node.Precondition.updateTime(version);
            }
        }
        else {
            return common6d85b8e5_node.Precondition.none();
        }
    }
    /**
     * Returns the precondition for a document if the operation is an update.
     */
    preconditionForUpdate(key) {
        const version = this.readVersions.get(key.toString());
        // The first time a document is written, we want to take into account the
        // read time and existence
        if (!this.writtenDocs.has(key.toString()) && version) {
            if (version.isEqual(common6d85b8e5_node.SnapshotVersion.min())) {
                // The document doesn't exist, so fail the transaction.
                // This has to be validated locally because you can't send a
                // precondition that a document does not exist without changing the
                // semantics of the backend write to be an insert. This is the reverse
                // of what we want, since we want to assert that the document doesn't
                // exist but then send the update and have it fail. Since we can't
                // express that to the backend, we have to validate locally.
                // Note: this can change once we can send separate verify writes in the
                // transaction.
                throw new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
            }
            // Document exists, base precondition on document update time.
            return common6d85b8e5_node.Precondition.updateTime(version);
        }
        else {
            // Document was not read, so we just use the preconditions for a blind
            // update.
            return common6d85b8e5_node.Precondition.exists(true);
        }
    }
    write(mutation) {
        this.ensureCommitNotCalled();
        this.mutations.push(mutation);
    }
    ensureCommitNotCalled() {
    }
}

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
class TransactionRunner {
    constructor(asyncQueue, datastore, options, updateFunction, deferred) {
        this.asyncQueue = asyncQueue;
        this.datastore = datastore;
        this.options = options;
        this.updateFunction = updateFunction;
        this.deferred = deferred;
        this.attemptsRemaining = options.maxAttempts;
        this.backoff = new ExponentialBackoff(this.asyncQueue, "transaction_retry" /* TimerId.TransactionRetry */);
    }
    /** Runs the transaction and sets the result on deferred. */
    run() {
        this.attemptsRemaining -= 1;
        this.runWithBackOff();
    }
    runWithBackOff() {
        this.backoff.backoffAndRun(async () => {
            const transaction = new Transaction$1(this.datastore);
            const userPromise = this.tryRunUpdateFunction(transaction);
            if (userPromise) {
                userPromise
                    .then(result => {
                    this.asyncQueue.enqueueAndForget(() => {
                        return transaction
                            .commit()
                            .then(() => {
                            this.deferred.resolve(result);
                        })
                            .catch(commitError => {
                            this.handleTransactionError(commitError);
                        });
                    });
                })
                    .catch(userPromiseError => {
                    this.handleTransactionError(userPromiseError);
                });
            }
        });
    }
    tryRunUpdateFunction(transaction) {
        try {
            const userPromise = this.updateFunction(transaction);
            if (common6d85b8e5_node.isNullOrUndefined(userPromise) ||
                !userPromise.catch ||
                !userPromise.then) {
                this.deferred.reject(Error('Transaction callback must return a Promise'));
                return null;
            }
            return userPromise;
        }
        catch (error) {
            // Do not retry errors thrown by user provided updateFunction.
            this.deferred.reject(error);
            return null;
        }
    }
    handleTransactionError(error) {
        if (this.attemptsRemaining > 0 && this.isRetryableTransactionError(error)) {
            this.attemptsRemaining -= 1;
            this.asyncQueue.enqueueAndForget(() => {
                this.runWithBackOff();
                return Promise.resolve();
            });
        }
        else {
            this.deferred.reject(error);
        }
    }
    isRetryableTransactionError(error) {
        if (error?.name === 'FirebaseError') {
            // In transactions, the backend will fail outdated reads with FAILED_PRECONDITION and
            // non-matching document versions with ABORTED. These errors should be retried.
            const code = error.code;
            return (code === 'aborted' ||
                code === 'failed-precondition' ||
                code === 'already-exists' ||
                !common6d85b8e5_node.isPermanentError(code));
        }
        return false;
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
 * Represents an operation scheduled to be run in the future on an AsyncQueue.
 *
 * It is created via DelayedOperation.createAndSchedule().
 *
 * Supports cancellation (via cancel()) and early execution (via skipDelay()).
 *
 * Note: We implement `PromiseLike` instead of `Promise`, as the `Promise` type
 * in newer versions of TypeScript defines `finally`, which is not available in
 * IE.
 */
class DelayedOperation {
    constructor(asyncQueue, timerId, targetTimeMs, op, removalCallback) {
        this.asyncQueue = asyncQueue;
        this.timerId = timerId;
        this.targetTimeMs = targetTimeMs;
        this.op = op;
        this.removalCallback = removalCallback;
        this.deferred = new Deferred();
        this.then = this.deferred.promise.then.bind(this.deferred.promise);
        // It's normal for the deferred promise to be canceled (due to cancellation)
        // and so we attach a dummy catch callback to avoid
        // 'UnhandledPromiseRejectionWarning' log spam.
        this.deferred.promise.catch(err => { });
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
     */
    static createAndSchedule(asyncQueue, timerId, delayMs, op, removalCallback) {
        const targetTime = Date.now() + delayMs;
        const delayedOp = new DelayedOperation(asyncQueue, timerId, targetTime, op, removalCallback);
        delayedOp.start(delayMs);
        return delayedOp;
    }
    /**
     * Starts the timer. This is called immediately after construction by
     * createAndSchedule().
     */
    start(delayMs) {
        this.timerHandle = setTimeout(() => this.handleDelayElapsed(), delayMs);
    }
    /**
     * Queues the operation to run immediately (if it hasn't already been run or
     * canceled).
     */
    skipDelay() {
        return this.handleDelayElapsed();
    }
    /**
     * Cancels the operation if it hasn't already been executed or canceled. The
     * promise will be rejected.
     *
     * As long as the operation has not yet been run, calling cancel() provides a
     * guarantee that the operation will not be run.
     */
    cancel(reason) {
        if (this.timerHandle !== null) {
            this.clearTimeout();
            this.deferred.reject(new common6d85b8e5_node.FirestoreError(common6d85b8e5_node.Code.CANCELLED, 'Operation cancelled' + (reason ? ': ' + reason : '')));
        }
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget(() => {
            if (this.timerHandle !== null) {
                this.clearTimeout();
                return this.op().then(result => {
                    return this.deferred.resolve(result);
                });
            }
            else {
                return Promise.resolve();
            }
        });
    }
    clearTimeout() {
        if (this.timerHandle !== null) {
            this.removalCallback(this);
            clearTimeout(this.timerHandle);
            this.timerHandle = null;
        }
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
const LOG_TAG = 'AsyncQueue';
class AsyncQueueImpl {
    constructor(tail = Promise.resolve()) {
        // A list of retryable operations. Retryable operations are run in order and
        // retried with backoff.
        this.retryableOps = [];
        // Is this AsyncQueue being shut down? Once it is set to true, it will not
        // be changed again.
        this._isShuttingDown = false;
        // Operations scheduled to be queued in the future. Operations are
        // automatically removed after they are run or canceled.
        this.delayedOperations = [];
        // visible for testing
        this.failure = null;
        // Flag set while there's an outstanding AsyncQueue operation, used for
        // assertion sanity-checks.
        this.operationInProgress = false;
        // Enabled during shutdown on Safari to prevent future access to IndexedDB.
        this.skipNonRestrictedTasks = false;
        // List of TimerIds to fast-forward delays for.
        this.timerIdsToSkip = [];
        // Backoff timer used to schedule retries for retryable operations
        this.backoff = new ExponentialBackoff(this, "async_queue_retry" /* TimerId.AsyncQueueRetry */);
        // Visibility handler that triggers an immediate retry of all retryable
        // operations. Meant to speed up recovery when we regain file system access
        // after page comes into foreground.
        this.visibilityHandler = () => {
            this.backoff.skipBackoff();
        };
        this.tail = tail;
    }
    get isShuttingDown() {
        return this._isShuttingDown;
    }
    /**
     * Adds a new operation to the queue without waiting for it to complete (i.e.
     * we ignore the Promise result).
     */
    enqueueAndForget(op) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueue(op);
    }
    enqueueAndForgetEvenWhileRestricted(op) {
        this.verifyNotFailed();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.enqueueInternal(op);
    }
    enterRestrictedMode(purgeExistingTasks) {
        if (!this._isShuttingDown) {
            this._isShuttingDown = true;
            this.skipNonRestrictedTasks = purgeExistingTasks || false;
        }
    }
    enqueue(op) {
        this.verifyNotFailed();
        if (this._isShuttingDown) {
            // Return a Promise which never resolves.
            return new Promise(() => { });
        }
        // Create a deferred Promise that we can return to the callee. This
        // allows us to return a "hanging Promise" only to the callee and still
        // advance the queue even when the operation is not run.
        const task = new Deferred();
        return this.enqueueInternal(() => {
            if (this._isShuttingDown && this.skipNonRestrictedTasks) {
                // We do not resolve 'task'
                return Promise.resolve();
            }
            op().then(task.resolve, task.reject);
            return task.promise;
        }).then(() => task.promise);
    }
    enqueueRetryable(op) {
        this.enqueueAndForget(() => {
            this.retryableOps.push(op);
            return this.retryNextOp();
        });
    }
    /**
     * Runs the next operation from the retryable queue. If the operation fails,
     * reschedules with backoff.
     */
    async retryNextOp() {
        if (this.retryableOps.length === 0) {
            return;
        }
        try {
            await this.retryableOps[0]();
            this.retryableOps.shift();
            this.backoff.reset();
        }
        catch (e) {
            if (isIndexedDbTransactionError(e)) {
                common6d85b8e5_node.logDebug(LOG_TAG, 'Operation failed with retryable error: ' + e);
            }
            else {
                throw e; // Failure will be handled by AsyncQueue
            }
        }
        if (this.retryableOps.length > 0) {
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
            this.backoff.backoffAndRun(() => this.retryNextOp());
        }
    }
    enqueueInternal(op) {
        const newTail = this.tail.then(() => {
            this.operationInProgress = true;
            return op()
                .catch((error) => {
                this.failure = error;
                this.operationInProgress = false;
                const message = getMessageOrStack(error);
                common6d85b8e5_node.logError('INTERNAL UNHANDLED ERROR: ', message);
                // Re-throw the error so that this.tail becomes a rejected Promise and
                // all further attempts to chain (via .then) will just short-circuit
                // and return the rejected Promise.
                throw error;
            })
                .then(result => {
                this.operationInProgress = false;
                return result;
            });
        });
        this.tail = newTail;
        return newTail;
    }
    enqueueAfterDelay(timerId, delayMs, op) {
        this.verifyNotFailed();
        // Fast-forward delays for timerIds that have been overridden.
        if (this.timerIdsToSkip.indexOf(timerId) > -1) {
            delayMs = 0;
        }
        const delayedOp = DelayedOperation.createAndSchedule(this, timerId, delayMs, op, removedOp => this.removeDelayedOperation(removedOp));
        this.delayedOperations.push(delayedOp);
        return delayedOp;
    }
    verifyNotFailed() {
        if (this.failure) {
            common6d85b8e5_node.fail(0xb815, {
                messageOrStack: getMessageOrStack(this.failure)
            });
        }
    }
    verifyOperationInProgress() {
    }
    /**
     * Waits until all currently queued tasks are finished executing. Delayed
     * operations are not run.
     */
    async drain() {
        // Operations in the queue prior to draining may have enqueued additional
        // operations. Keep draining the queue until the tail is no longer advanced,
        // which indicates that no more new operations were enqueued and that all
        // operations were executed.
        let currentTail;
        do {
            currentTail = this.tail;
            await currentTail;
        } while (currentTail !== this.tail);
    }
    /**
     * For Tests: Determine if a delayed operation with a particular TimerId
     * exists.
     */
    containsDelayedOperation(timerId) {
        for (const op of this.delayedOperations) {
            if (op.timerId === timerId) {
                return true;
            }
        }
        return false;
    }
    /**
     * For Tests: Runs some or all delayed operations early.
     *
     * @param lastTimerId - Delayed operations up to and including this TimerId
     * will be drained. Pass TimerId.All to run all delayed operations.
     * @returns a Promise that resolves once all operations have been run.
     */
    runAllDelayedOperationsUntil(lastTimerId) {
        // Note that draining may generate more delayed ops, so we do that first.
        return this.drain().then(() => {
            // Run ops in the same order they'd run if they ran naturally.
            /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
            this.delayedOperations.sort((a, b) => a.targetTimeMs - b.targetTimeMs);
            for (const op of this.delayedOperations) {
                op.skipDelay();
                if (lastTimerId !== "all" /* TimerId.All */ && op.timerId === lastTimerId) {
                    break;
                }
            }
            return this.drain();
        });
    }
    /**
     * For Tests: Skip all subsequent delays for a timer id.
     */
    skipDelaysForTimerId(timerId) {
        this.timerIdsToSkip.push(timerId);
    }
    /** Called once a DelayedOperation is run or canceled. */
    removeDelayedOperation(op) {
        // NOTE: indexOf / slice are O(n), but delayedOperations is expected to be small.
        const index = this.delayedOperations.indexOf(op);
        /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
        this.delayedOperations.splice(index, 1);
    }
}
function newAsyncQueue() {
    return new AsyncQueueImpl();
}
/**
 * Chrome includes Error.message in Error.stack. Other browsers do not.
 * This returns expected output of message + stack when available.
 * @param error - Error or FirestoreError
 */
function getMessageOrStack(error) {
    let message = error.message || '';
    if (error.stack) {
        if (error.stack.includes(error.message)) {
            message = error.stack;
        }
        else {
            message = error.message + '\n' + error.stack;
        }
    }
    return message;
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
 */
class Transaction {
    /** @hideconstructor */
    constructor(_firestore, _transaction) {
        this._firestore = _firestore;
        this._transaction = _transaction;
        this._dataReader = common6d85b8e5_node.newUserDataReader(_firestore);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get(documentRef) {
        const ref = validateReference(documentRef, this._firestore);
        const userDataWriter = new common6d85b8e5_node.LiteUserDataWriter(this._firestore);
        return this._transaction.lookup([ref._key]).then(docs => {
            if (!docs || docs.length !== 1) {
                return common6d85b8e5_node.fail(0x5de9);
            }
            const doc = docs[0];
            if (doc.isFoundDocument()) {
                return new common6d85b8e5_node.DocumentSnapshot(this._firestore, userDataWriter, doc.key, doc, ref.converter);
            }
            else if (doc.isNoDocument()) {
                return new common6d85b8e5_node.DocumentSnapshot(this._firestore, userDataWriter, ref._key, null, ref.converter);
            }
            else {
                throw common6d85b8e5_node.fail(0x4801, {
                    doc
                });
            }
        });
    }
    set(documentRef, value, options) {
        const ref = validateReference(documentRef, this._firestore);
        const convertedValue = common6d85b8e5_node.applyFirestoreDataConverter(ref.converter, value, options);
        const parsed = common6d85b8e5_node.parseSetData(this._dataReader, 'Transaction.set', ref._key, convertedValue, ref.converter !== null, options);
        this._transaction.set(ref._key, parsed);
        return this;
    }
    update(documentRef, fieldOrUpdateData, value, ...moreFieldsAndValues) {
        const ref = validateReference(documentRef, this._firestore);
        // For Compat types, we have to "extract" the underlying types before
        // performing validation.
        fieldOrUpdateData = util.getModularInstance(fieldOrUpdateData);
        let parsed;
        if (typeof fieldOrUpdateData === 'string' ||
            fieldOrUpdateData instanceof common6d85b8e5_node.FieldPath) {
            parsed = common6d85b8e5_node.parseUpdateVarargs(this._dataReader, 'Transaction.update', ref._key, fieldOrUpdateData, value, moreFieldsAndValues);
        }
        else {
            parsed = common6d85b8e5_node.parseUpdateData(this._dataReader, 'Transaction.update', ref._key, fieldOrUpdateData);
        }
        this._transaction.update(ref._key, parsed);
        return this;
    }
    /**
     * Deletes the document referred to by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be deleted.
     * @returns This `Transaction` instance. Used for chaining method calls.
     */
    delete(documentRef) {
        const ref = validateReference(documentRef, this._firestore);
        this._transaction.delete(ref._key);
        return this;
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
 */
function runTransaction(firestore, updateFunction, options) {
    firestore = common6d85b8e5_node.cast(firestore, common6d85b8e5_node.Firestore);
    const datastore = common6d85b8e5_node.getDatastore(firestore);
    const optionsWithDefaults = {
        ...DEFAULT_TRANSACTION_OPTIONS,
        ...options
    };
    validateTransactionOptions(optionsWithDefaults);
    const deferred = new Deferred();
    new TransactionRunner(newAsyncQueue(), datastore, optionsWithDefaults, internalTransaction => updateFunction(new Transaction(firestore, internalTransaction)), deferred).run();
    return deferred.promise;
}

/**
 * Firestore Lite
 *
 * @remarks Firestore Lite is a small online-only SDK that allows read
 * and write access to your Firestore database. All operations connect
 * directly to the backend, and `onSnapshot()` APIs are not supported.
 * @packageDocumentation
 */
registerFirestore();

exports.Bytes = common6d85b8e5_node.Bytes;
exports.CollectionReference = common6d85b8e5_node.CollectionReference;
exports.DocumentReference = common6d85b8e5_node.DocumentReference;
exports.DocumentSnapshot = common6d85b8e5_node.DocumentSnapshot;
exports.FieldPath = common6d85b8e5_node.FieldPath;
exports.FieldValue = common6d85b8e5_node.FieldValue;
exports.Firestore = common6d85b8e5_node.Firestore;
exports.FirestoreError = common6d85b8e5_node.FirestoreError;
exports.GeoPoint = common6d85b8e5_node.GeoPoint;
exports.Query = common6d85b8e5_node.Query;
exports.QueryCompositeFilterConstraint = common6d85b8e5_node.QueryCompositeFilterConstraint;
exports.QueryConstraint = common6d85b8e5_node.QueryConstraint;
exports.QueryDocumentSnapshot = common6d85b8e5_node.QueryDocumentSnapshot;
exports.QueryEndAtConstraint = common6d85b8e5_node.QueryEndAtConstraint;
exports.QueryFieldFilterConstraint = common6d85b8e5_node.QueryFieldFilterConstraint;
exports.QueryLimitConstraint = common6d85b8e5_node.QueryLimitConstraint;
exports.QueryOrderByConstraint = common6d85b8e5_node.QueryOrderByConstraint;
exports.QuerySnapshot = common6d85b8e5_node.QuerySnapshot;
exports.QueryStartAtConstraint = common6d85b8e5_node.QueryStartAtConstraint;
exports.Timestamp = common6d85b8e5_node.Timestamp;
exports.VectorValue = common6d85b8e5_node.VectorValue;
exports.addDoc = common6d85b8e5_node.addDoc;
exports.and = common6d85b8e5_node.and;
exports.arrayRemove = common6d85b8e5_node.arrayRemove;
exports.arrayUnion = common6d85b8e5_node.arrayUnion;
exports.collection = common6d85b8e5_node.collection;
exports.collectionGroup = common6d85b8e5_node.collectionGroup;
exports.connectFirestoreEmulator = common6d85b8e5_node.connectFirestoreEmulator;
exports.deleteDoc = common6d85b8e5_node.deleteDoc;
exports.deleteField = common6d85b8e5_node.deleteField;
exports.doc = common6d85b8e5_node.doc;
exports.documentId = common6d85b8e5_node.documentId;
exports.endAt = common6d85b8e5_node.endAt;
exports.endBefore = common6d85b8e5_node.endBefore;
exports.getDoc = common6d85b8e5_node.getDoc;
exports.getDocs = common6d85b8e5_node.getDocs;
exports.getFirestore = common6d85b8e5_node.getFirestore;
exports.increment = common6d85b8e5_node.increment;
exports.initializeFirestore = common6d85b8e5_node.initializeFirestore;
exports.limit = common6d85b8e5_node.limit;
exports.limitToLast = common6d85b8e5_node.limitToLast;
exports.or = common6d85b8e5_node.or;
exports.orderBy = common6d85b8e5_node.orderBy;
exports.query = common6d85b8e5_node.query;
exports.queryEqual = common6d85b8e5_node.queryEqual;
exports.refEqual = common6d85b8e5_node.refEqual;
exports.serverTimestamp = common6d85b8e5_node.serverTimestamp;
exports.setDoc = common6d85b8e5_node.setDoc;
exports.setLogLevel = common6d85b8e5_node.setLogLevel;
exports.snapshotEqual = common6d85b8e5_node.snapshotEqual;
exports.startAfter = common6d85b8e5_node.startAfter;
exports.startAt = common6d85b8e5_node.startAt;
exports.terminate = common6d85b8e5_node.terminate;
exports.updateDoc = common6d85b8e5_node.updateDoc;
exports.vector = common6d85b8e5_node.vector;
exports.where = common6d85b8e5_node.where;
exports.AggregateField = AggregateField;
exports.AggregateQuerySnapshot = AggregateQuerySnapshot;
exports.Transaction = Transaction;
exports.WriteBatch = WriteBatch;
exports.aggregateFieldEqual = aggregateFieldEqual;
exports.aggregateQuerySnapshotEqual = aggregateQuerySnapshotEqual;
exports.average = average;
exports.count = count;
exports.getAggregate = getAggregate;
exports.getCount = getCount;
exports.runTransaction = runTransaction;
exports.sum = sum;
exports.writeBatch = writeBatch;
//# sourceMappingURL=index.node.cjs.js.map
