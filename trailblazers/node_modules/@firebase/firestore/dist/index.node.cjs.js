'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var app = require('@firebase/app');
var component = require('@firebase/component');
var commonE122c13e_node = require('./common-882bbb15.node.cjs.js');
var util = require('@firebase/util');
require('@firebase/webchannel-wrapper/bloom-blob');
require('@firebase/logger');
require('util');
require('crypto');
require('@grpc/grpc-js');
require('@grpc/proto-loader');

const name$1 = "@firebase/firestore";
const version = "4.13.0";

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
function registerFirestore(variant, useFetchStreams = true) {
    commonE122c13e_node.setSDKVersion(app.SDK_VERSION);
    app._registerComponent(new component.Component('firestore', (container, { instanceIdentifier: databaseId, options: settings }) => {
        const app = container.getProvider('app').getImmediate();
        const firestoreInstance = new commonE122c13e_node.Firestore(new commonE122c13e_node.FirebaseAuthCredentialsProvider(container.getProvider('auth-internal')), new commonE122c13e_node.FirebaseAppCheckTokenProvider(app, container.getProvider('app-check-internal')), commonE122c13e_node.databaseIdFromApp(app, databaseId), app);
        settings = { useFetchStreams, ...settings };
        firestoreInstance._setSettings(settings);
        return firestoreInstance;
    }, 'PUBLIC').setMultipleInstances(true));
    app.registerVersion(name$1, version, variant);
    // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
    app.registerVersion(name$1, version, 'cjs2020');
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
        const dataClone = new commonE122c13e_node.ObjectValue({
            mapValue: { fields: this._data }
        }).clone();
        // Return the cloned value to prevent manipulation of the Snapshot's data
        return dataClone.value.mapValue.fields;
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
/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists()` method to
 * explicitly verify a document's existence.
 */
class DocumentSnapshot$1 {
    // Note: This class is stripped down version of the DocumentSnapshot in
    // the legacy SDK. The changes are:
    // - No support for SnapshotMetadata.
    // - No support for SnapshotOptions.
    /** @hideconstructor protected */
    constructor(_firestore, _userDataWriter, _key, _document, _converter) {
        this._firestore = _firestore;
        this._userDataWriter = _userDataWriter;
        this._key = _key;
        this._document = _document;
        this._converter = _converter;
    }
    /** Property of the `DocumentSnapshot` that provides the document's ID. */
    get id() {
        return this._key.path.lastSegment();
    }
    /**
     * The `DocumentReference` for the document included in the `DocumentSnapshot`.
     */
    get ref() {
        return new commonE122c13e_node.DocumentReference(this._firestore, this._converter, this._key);
    }
    /**
     * Signals whether or not the document at the snapshot's location exists.
     *
     * @returns true if the document exists.
     */
    exists() {
        return this._document !== null;
    }
    /**
     * Retrieves all fields in the document as an `Object`. Returns `undefined` if
     * the document doesn't exist.
     *
     * @returns An `Object` containing all fields in the document or `undefined`
     * if the document doesn't exist.
     */
    data() {
        if (!this._document) {
            return undefined;
        }
        else if (this._converter) {
            // We only want to use the converter and create a new DocumentSnapshot
            // if a converter has been provided.
            const snapshot = new QueryDocumentSnapshot$1(this._firestore, this._userDataWriter, this._key, this._document, 
            /* converter= */ null);
            return this._converter.fromFirestore(snapshot);
        }
        else {
            return this._userDataWriter.convertValue(this._document.data.value);
        }
    }
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
    _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._document?.data.clone().value.mapValue.fields ?? undefined;
    }
    /**
     * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
     * document or field doesn't exist.
     *
     * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
     * field.
     * @returns The data at the specified field location or undefined if no such
     * field exists in the document.
     */
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(fieldPath) {
        if (this._document) {
            const value = this._document.data.field(commonE122c13e_node.fieldPathFromArgument('DocumentSnapshot.get', fieldPath));
            if (value !== null) {
                return this._userDataWriter.convertValue(value);
            }
        }
        return undefined;
    }
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
class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
    /**
     * Retrieves all fields in the document as an `Object`.
     *
     * @override
     * @returns An `Object` containing all fields in the document.
     */
    data() {
        return super.data();
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
function validateHasExplicitOrderByForLimitToLast(query) {
    if (query.limitType === "L" /* LimitType.Last */ &&
        query.explicitOrderBy.length === 0) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.UNIMPLEMENTED, 'limitToLast() queries require specifying at least one orderBy() clause');
    }
}
/**
 * An `AppliableConstraint` is an abstraction of a constraint that can be applied
 * to a Firestore query.
 */
class AppliableConstraint {
}
/**
 * A `QueryConstraint` is used to narrow the set of documents returned by a
 * Firestore query. `QueryConstraint`s are created by invoking {@link where},
 * {@link orderBy}, {@link (startAt:1)}, {@link (startAfter:1)}, {@link
 * (endBefore:1)}, {@link (endAt:1)}, {@link limit}, {@link limitToLast} and
 * can then be passed to {@link (query:1)} to create a new query instance that
 * also contains this `QueryConstraint`.
 */
class QueryConstraint extends AppliableConstraint {
}
function query(query, queryConstraint, ...additionalQueryConstraints) {
    let queryConstraints = [];
    if (queryConstraint instanceof AppliableConstraint) {
        queryConstraints.push(queryConstraint);
    }
    queryConstraints = queryConstraints.concat(additionalQueryConstraints);
    validateQueryConstraintArray(queryConstraints);
    for (const constraint of queryConstraints) {
        query = constraint._apply(query);
    }
    return query;
}
/**
 * A `QueryFieldFilterConstraint` is used to narrow the set of documents returned by
 * a Firestore query by filtering on one or more document fields.
 * `QueryFieldFilterConstraint`s are created by invoking {@link where} and can then
 * be passed to {@link (query:1)} to create a new query instance that also contains
 * this `QueryFieldFilterConstraint`.
 */
class QueryFieldFilterConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(_field, _op, _value) {
        super();
        this._field = _field;
        this._op = _op;
        this._value = _value;
        /** The type of this query constraint */
        this.type = 'where';
    }
    static _create(_field, _op, _value) {
        return new QueryFieldFilterConstraint(_field, _op, _value);
    }
    _apply(query) {
        const filter = this._parse(query);
        validateNewFieldFilter(query._query, filter);
        return new commonE122c13e_node.Query(query.firestore, query.converter, commonE122c13e_node.queryWithAddedFilter(query._query, filter));
    }
    _parse(query) {
        const reader = commonE122c13e_node.newUserDataReader(query.firestore);
        const filter = newQueryFilter(query._query, 'where', reader, query.firestore._databaseId, this._field, this._op, this._value);
        return filter;
    }
}
/**
 * Creates a {@link QueryFieldFilterConstraint} that enforces that documents
 * must contain the specified field and that the value should satisfy the
 * relation constraint provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created {@link QueryFieldFilterConstraint}.
 */
function where(fieldPath, opStr, value) {
    const op = opStr;
    const field = commonE122c13e_node.fieldPathFromArgument('where', fieldPath);
    return QueryFieldFilterConstraint._create(field, op, value);
}
/**
 * A `QueryCompositeFilterConstraint` is used to narrow the set of documents
 * returned by a Firestore query by performing the logical OR or AND of multiple
 * {@link QueryFieldFilterConstraint}s or {@link QueryCompositeFilterConstraint}s.
 * `QueryCompositeFilterConstraint`s are created by invoking {@link or} or
 * {@link and} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains the `QueryCompositeFilterConstraint`.
 */
class QueryCompositeFilterConstraint extends AppliableConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _queryConstraints) {
        super();
        this.type = type;
        this._queryConstraints = _queryConstraints;
    }
    static _create(type, _queryConstraints) {
        return new QueryCompositeFilterConstraint(type, _queryConstraints);
    }
    _parse(query) {
        const parsedFilters = this._queryConstraints
            .map(queryConstraint => {
            return queryConstraint._parse(query);
        })
            .filter(parsedFilter => parsedFilter.getFilters().length > 0);
        if (parsedFilters.length === 1) {
            return parsedFilters[0];
        }
        return commonE122c13e_node.CompositeFilter.create(parsedFilters, this._getOperator());
    }
    _apply(query) {
        const parsedFilter = this._parse(query);
        if (parsedFilter.getFilters().length === 0) {
            // Return the existing query if not adding any more filters (e.g. an empty
            // composite filter).
            return query;
        }
        validateNewFilter(query._query, parsedFilter);
        return new commonE122c13e_node.Query(query.firestore, query.converter, commonE122c13e_node.queryWithAddedFilter(query._query, parsedFilter));
    }
    _getQueryConstraints() {
        return this._queryConstraints;
    }
    _getOperator() {
        return this.type === 'and' ? "and" /* CompositeOperator.AND */ : "or" /* CompositeOperator.OR */;
    }
}
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a disjunction of
 * the given filter constraints. A disjunction filter includes a document if it
 * satisfies any of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a disjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
function or(...queryConstraints) {
    // Only support QueryFilterConstraints
    queryConstraints.forEach(queryConstraint => validateQueryFilterConstraint('or', queryConstraint));
    return QueryCompositeFilterConstraint._create("or" /* CompositeOperator.OR */, queryConstraints);
}
/**
 * Creates a new {@link QueryCompositeFilterConstraint} that is a conjunction of
 * the given filter constraints. A conjunction filter includes a document if it
 * satisfies all of the given filters.
 *
 * @param queryConstraints - Optional. The list of
 * {@link QueryFilterConstraint}s to perform a conjunction for. These must be
 * created with calls to {@link where}, {@link or}, or {@link and}.
 * @returns The newly created {@link QueryCompositeFilterConstraint}.
 */
function and(...queryConstraints) {
    // Only support QueryFilterConstraints
    queryConstraints.forEach(queryConstraint => validateQueryFilterConstraint('and', queryConstraint));
    return QueryCompositeFilterConstraint._create("and" /* CompositeOperator.AND */, queryConstraints);
}
/**
 * A `QueryOrderByConstraint` is used to sort the set of documents returned by a
 * Firestore query. `QueryOrderByConstraint`s are created by invoking
 * {@link orderBy} and can then be passed to {@link (query:1)} to create a new query
 * instance that also contains this `QueryOrderByConstraint`.
 *
 * Note: Documents that do not contain the orderBy field will not be present in
 * the query result.
 */
class QueryOrderByConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(_field, _direction) {
        super();
        this._field = _field;
        this._direction = _direction;
        /** The type of this query constraint */
        this.type = 'orderBy';
    }
    static _create(_field, _direction) {
        return new QueryOrderByConstraint(_field, _direction);
    }
    _apply(query) {
        const orderBy = newQueryOrderBy(query._query, this._field, this._direction);
        return new commonE122c13e_node.Query(query.firestore, query.converter, commonE122c13e_node.queryWithAddedOrderBy(query._query, orderBy));
    }
}
/**
 * Creates a {@link QueryOrderByConstraint} that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * Note: Documents that do not contain the specified field will not be present
 * in the query result.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created {@link QueryOrderByConstraint}.
 */
function orderBy(fieldPath, directionStr = 'asc') {
    const direction = directionStr;
    const path = commonE122c13e_node.fieldPathFromArgument('orderBy', fieldPath);
    return QueryOrderByConstraint._create(path, direction);
}
/**
 * A `QueryLimitConstraint` is used to limit the number of documents returned by
 * a Firestore query.
 * `QueryLimitConstraint`s are created by invoking {@link limit} or
 * {@link limitToLast} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryLimitConstraint`.
 */
class QueryLimitConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _limit, _limitType) {
        super();
        this.type = type;
        this._limit = _limit;
        this._limitType = _limitType;
    }
    static _create(type, _limit, _limitType) {
        return new QueryLimitConstraint(type, _limit, _limitType);
    }
    _apply(query) {
        return new commonE122c13e_node.Query(query.firestore, query.converter, commonE122c13e_node.queryWithLimit(query._query, this._limit, this._limitType));
    }
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the first matching
 * documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
function limit(limit) {
    commonE122c13e_node.validatePositiveNumber('limit', limit);
    return QueryLimitConstraint._create('limit', limit, "F" /* LimitType.First */);
}
/**
 * Creates a {@link QueryLimitConstraint} that only returns the last matching
 * documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link QueryLimitConstraint}.
 */
function limitToLast(limit) {
    commonE122c13e_node.validatePositiveNumber('limitToLast', limit);
    return QueryLimitConstraint._create('limitToLast', limit, "L" /* LimitType.Last */);
}
/**
 * A `QueryStartAtConstraint` is used to exclude documents from the start of a
 * result set returned by a Firestore query.
 * `QueryStartAtConstraint`s are created by invoking {@link (startAt:1)} or
 * {@link (startAfter:1)} and can then be passed to {@link (query:1)} to create a
 * new query instance that also contains this `QueryStartAtConstraint`.
 */
class QueryStartAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _docOrFields, _inclusive) {
        super();
        this.type = type;
        this._docOrFields = _docOrFields;
        this._inclusive = _inclusive;
    }
    static _create(type, _docOrFields, _inclusive) {
        return new QueryStartAtConstraint(type, _docOrFields, _inclusive);
    }
    _apply(query) {
        const bound = newQueryBoundFromDocOrFields(query, this.type, this._docOrFields, this._inclusive);
        return new commonE122c13e_node.Query(query.firestore, query.converter, commonE122c13e_node.queryWithStartAt(query._query, bound));
    }
}
function startAt(...docOrFields) {
    return QueryStartAtConstraint._create('startAt', docOrFields, 
    /*inclusive=*/ true);
}
function startAfter(...docOrFields) {
    return QueryStartAtConstraint._create('startAfter', docOrFields, 
    /*inclusive=*/ false);
}
/**
 * A `QueryEndAtConstraint` is used to exclude documents from the end of a
 * result set returned by a Firestore query.
 * `QueryEndAtConstraint`s are created by invoking {@link (endAt:1)} or
 * {@link (endBefore:1)} and can then be passed to {@link (query:1)} to create a new
 * query instance that also contains this `QueryEndAtConstraint`.
 */
class QueryEndAtConstraint extends QueryConstraint {
    /**
     * @internal
     */
    constructor(
    /** The type of this query constraint */
    type, _docOrFields, _inclusive) {
        super();
        this.type = type;
        this._docOrFields = _docOrFields;
        this._inclusive = _inclusive;
    }
    static _create(type, _docOrFields, _inclusive) {
        return new QueryEndAtConstraint(type, _docOrFields, _inclusive);
    }
    _apply(query) {
        const bound = newQueryBoundFromDocOrFields(query, this.type, this._docOrFields, this._inclusive);
        return new commonE122c13e_node.Query(query.firestore, query.converter, commonE122c13e_node.queryWithEndAt(query._query, bound));
    }
}
function endBefore(...docOrFields) {
    return QueryEndAtConstraint._create('endBefore', docOrFields, 
    /*inclusive=*/ false);
}
function endAt(...docOrFields) {
    return QueryEndAtConstraint._create('endAt', docOrFields, 
    /*inclusive=*/ true);
}
/** Helper function to create a bound from a document or fields */
function newQueryBoundFromDocOrFields(query, methodName, docOrFields, inclusive) {
    docOrFields[0] = util.getModularInstance(docOrFields[0]);
    if (docOrFields[0] instanceof DocumentSnapshot$1) {
        return newQueryBoundFromDocument(query._query, query.firestore._databaseId, methodName, docOrFields[0]._document, inclusive);
    }
    else {
        const reader = commonE122c13e_node.newUserDataReader(query.firestore);
        return newQueryBoundFromFields(query._query, query.firestore._databaseId, reader, methodName, docOrFields, inclusive);
    }
}
function newQueryFilter(query, methodName, dataReader, databaseId, fieldPath, op, value) {
    let fieldValue;
    if (fieldPath.isKeyField()) {
        if (op === "array-contains" /* Operator.ARRAY_CONTAINS */ || op === "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid Query. You can't perform '${op}' queries on documentId().`);
        }
        else if (op === "in" /* Operator.IN */ || op === "not-in" /* Operator.NOT_IN */) {
            validateDisjunctiveFilterElements(value, op);
            const referenceList = [];
            for (const arrayValue of value) {
                referenceList.push(parseDocumentIdValue(databaseId, query, arrayValue));
            }
            fieldValue = { arrayValue: { values: referenceList } };
        }
        else {
            fieldValue = parseDocumentIdValue(databaseId, query, value);
        }
    }
    else {
        if (op === "in" /* Operator.IN */ ||
            op === "not-in" /* Operator.NOT_IN */ ||
            op === "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */) {
            validateDisjunctiveFilterElements(value, op);
        }
        fieldValue = commonE122c13e_node.parseQueryValue(dataReader, methodName, value, 
        /* allowArrays= */ op === "in" /* Operator.IN */ || op === "not-in" /* Operator.NOT_IN */);
    }
    const filter = commonE122c13e_node.FieldFilter.create(fieldPath, op, fieldValue);
    return filter;
}
function newQueryOrderBy(query, fieldPath, direction) {
    if (query.startAt !== null) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Invalid query. You must not call startAt() or startAfter() before ' +
            'calling orderBy().');
    }
    if (query.endAt !== null) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Invalid query. You must not call endAt() or endBefore() before ' +
            'calling orderBy().');
    }
    const orderBy = new commonE122c13e_node.OrderBy(fieldPath, direction);
    return orderBy;
}
/**
 * Create a `Bound` from a query and a document.
 *
 * Note that the `Bound` will always include the key of the document
 * and so only the provided document will compare equal to the returned
 * position.
 *
 * Will throw if the document does not contain all fields of the order by
 * of the query or if any of the fields in the order by are an uncommitted
 * server timestamp.
 */
function newQueryBoundFromDocument(query, databaseId, methodName, doc, inclusive) {
    if (!doc) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ` +
            `${methodName}().`);
    }
    const components = [];
    // Because people expect to continue/end a query at the exact document
    // provided, we need to use the implicit sort order rather than the explicit
    // sort order, because it's guaranteed to contain the document key. That way
    // the position becomes unambiguous and the query continues/ends exactly at
    // the provided document. Without the key (by using the explicit sort
    // orders), multiple documents could match the position, yielding duplicate
    // results.
    for (const orderBy of commonE122c13e_node.queryNormalizedOrderBy(query)) {
        if (orderBy.field.isKeyField()) {
            components.push(commonE122c13e_node.refValue(databaseId, doc.key));
        }
        else {
            const value = doc.data.field(orderBy.field);
            if (commonE122c13e_node.isServerTimestamp(value)) {
                throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a ' +
                    'document for which the field "' +
                    orderBy.field +
                    '" is an uncommitted server timestamp. (Since the value of ' +
                    'this field is unknown, you cannot start/end a query with it.)');
            }
            else if (value !== null) {
                components.push(value);
            }
            else {
                const field = orderBy.field.canonicalString();
                throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a ` +
                    `document for which the field '${field}' (used as the ` +
                    `orderBy) does not exist.`);
            }
        }
    }
    return new commonE122c13e_node.Bound(components, inclusive);
}
/**
 * Converts a list of field values to a `Bound` for the given query.
 */
function newQueryBoundFromFields(query, databaseId, dataReader, methodName, values, inclusive) {
    // Use explicit order by's because it has to match the query the user made
    const orderBy = query.explicitOrderBy;
    if (values.length > orderBy.length) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Too many arguments provided to ${methodName}(). ` +
            `The number of arguments must be less than or equal to the ` +
            `number of orderBy() clauses`);
    }
    const components = [];
    for (let i = 0; i < values.length; i++) {
        const rawValue = values[i];
        const orderByComponent = orderBy[i];
        if (orderByComponent.field.isKeyField()) {
            if (typeof rawValue !== 'string') {
                throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ` +
                    `${methodName}(), but got a ${typeof rawValue}`);
            }
            if (!commonE122c13e_node.isCollectionGroupQuery(query) && rawValue.indexOf('/') !== -1) {
                throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), ` +
                    `the value passed to ${methodName}() must be a plain document ID, but ` +
                    `'${rawValue}' contains a slash.`);
            }
            const path = query.path.child(commonE122c13e_node.ResourcePath.fromString(rawValue));
            if (!commonE122c13e_node.DocumentKey.isDocumentKey(path)) {
                throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by ` +
                    `documentId(), the value passed to ${methodName}() must result in a ` +
                    `valid document path, but '${path}' is not because it contains an odd number ` +
                    `of segments.`);
            }
            const key = new commonE122c13e_node.DocumentKey(path);
            components.push(commonE122c13e_node.refValue(databaseId, key));
        }
        else {
            const wrapped = commonE122c13e_node.parseQueryValue(dataReader, methodName, rawValue);
            components.push(wrapped);
        }
    }
    return new commonE122c13e_node.Bound(components, inclusive);
}
/**
 * Parses the given `documentIdValue` into a `ReferenceValue`, throwing
 * appropriate errors if the value is anything other than a `DocumentReference`
 * or `string`, or if the string is malformed.
 */
function parseDocumentIdValue(databaseId, query, documentIdValue) {
    documentIdValue = util.getModularInstance(documentIdValue);
    if (typeof documentIdValue === 'string') {
        if (documentIdValue === '') {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Invalid query. When querying with documentId(), you ' +
                'must provide a valid document ID, but it was an empty string.');
        }
        if (!commonE122c13e_node.isCollectionGroupQuery(query) && documentIdValue.indexOf('/') !== -1) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. When querying a collection by ` +
                `documentId(), you must provide a plain document ID, but ` +
                `'${documentIdValue}' contains a '/' character.`);
        }
        const path = query.path.child(commonE122c13e_node.ResourcePath.fromString(documentIdValue));
        if (!commonE122c13e_node.DocumentKey.isDocumentKey(path)) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. When querying a collection group by ` +
                `documentId(), the value provided must result in a valid document path, ` +
                `but '${path}' is not because it has an odd number of segments (${path.length}).`);
        }
        return commonE122c13e_node.refValue(databaseId, new commonE122c13e_node.DocumentKey(path));
    }
    else if (documentIdValue instanceof commonE122c13e_node.DocumentReference) {
        return commonE122c13e_node.refValue(databaseId, documentIdValue._key);
    }
    else {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid ` +
            `string or a DocumentReference, but it was: ` +
            `${commonE122c13e_node.valueDescription(documentIdValue)}.`);
    }
}
/**
 * Validates that the value passed into a disjunctive filter satisfies all
 * array requirements.
 */
function validateDisjunctiveFilterElements(value, operator) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Invalid Query. A non-empty array is required for ' +
            `'${operator.toString()}' filters.`);
    }
}
/**
 * Given an operator, returns the set of operators that cannot be used with it.
 *
 * This is not a comprehensive check, and this function should be removed in the
 * long term. Validations should occur in the Firestore backend.
 *
 * Operators in a query must adhere to the following set of rules:
 * 1. Only one inequality per query.
 * 2. `NOT_IN` cannot be used with array, disjunctive, or `NOT_EQUAL` operators.
 */
function conflictingOps(op) {
    switch (op) {
        case "!=" /* Operator.NOT_EQUAL */:
            return ["!=" /* Operator.NOT_EQUAL */, "not-in" /* Operator.NOT_IN */];
        case "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */:
        case "in" /* Operator.IN */:
            return ["not-in" /* Operator.NOT_IN */];
        case "not-in" /* Operator.NOT_IN */:
            return [
                "array-contains-any" /* Operator.ARRAY_CONTAINS_ANY */,
                "in" /* Operator.IN */,
                "not-in" /* Operator.NOT_IN */,
                "!=" /* Operator.NOT_EQUAL */
            ];
        default:
            return [];
    }
}
function validateNewFieldFilter(query, fieldFilter) {
    const conflictingOp = findOpInsideFilters(query.filters, conflictingOps(fieldFilter.op));
    if (conflictingOp !== null) {
        // Special case when it's a duplicate op to give a slightly clearer error message.
        if (conflictingOp === fieldFilter.op) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Invalid query. You cannot use more than one ' +
                `'${fieldFilter.op.toString()}' filter.`);
        }
        else {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Invalid query. You cannot use '${fieldFilter.op.toString()}' filters ` +
                `with '${conflictingOp.toString()}' filters.`);
        }
    }
}
function validateNewFilter(query, filter) {
    let testQuery = query;
    const subFilters = filter.getFlattenedFilters();
    for (const subFilter of subFilters) {
        validateNewFieldFilter(testQuery, subFilter);
        testQuery = commonE122c13e_node.queryWithAddedFilter(testQuery, subFilter);
    }
}
// Checks if any of the provided filter operators are included in the given list of filters and
// returns the first one that is, or null if none are.
function findOpInsideFilters(filters, operators) {
    for (const filter of filters) {
        for (const fieldFilter of filter.getFlattenedFilters()) {
            if (operators.indexOf(fieldFilter.op) >= 0) {
                return fieldFilter.op;
            }
        }
    }
    return null;
}
function validateQueryFilterConstraint(functionName, queryConstraint) {
    if (!(queryConstraint instanceof QueryFieldFilterConstraint) &&
        !(queryConstraint instanceof QueryCompositeFilterConstraint)) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Function ${functionName}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
    }
}
function validateQueryConstraintArray(queryConstraint) {
    const compositeFilterCount = queryConstraint.filter(filter => filter instanceof QueryCompositeFilterConstraint).length;
    const fieldFilterCount = queryConstraint.filter(filter => filter instanceof QueryFieldFilterConstraint).length;
    if (compositeFilterCount > 1 ||
        (compositeFilterCount > 0 && fieldFilterCount > 0)) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'InvalidQuery. When using composite filters, you cannot use ' +
            'more than one filter at the top level. Consider nesting the multiple ' +
            'filters within an `and(...)` statement. For example: ' +
            'change `query(query, where(...), or(...))` to ' +
            '`query(query, and(where(...), or(...)))`.');
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
/**
 * Converts custom model object of type T into `DocumentData` by applying the
 * converter if it exists.
 *
 * This function is used when converting user objects to `DocumentData`
 * because we want to provide the user with a more specific error message if
 * their `set()` or fails due to invalid data originating from a `toFirestore()`
 * call.
 */
function applyFirestoreDataConverter(converter, value, options) {
    let convertedValue;
    if (converter) {
        if (options && (options.merge || options.mergeFields)) {
            // Cast to `any` in order to satisfy the union type constraint on
            // toFirestore().
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            convertedValue = converter.toFirestore(value, options);
        }
        else {
            convertedValue = converter.toFirestore(value);
        }
    }
    else {
        convertedValue = value;
    }
    return convertedValue;
}
class LiteUserDataWriter extends commonE122c13e_node.AbstractUserDataWriter {
    constructor(firestore) {
        super();
        this.firestore = firestore;
    }
    convertBytes(bytes) {
        return new commonE122c13e_node.Bytes(bytes);
    }
    convertReference(name) {
        const key = this.convertDocumentKey(name, this.firestore._databaseId);
        return new commonE122c13e_node.DocumentReference(this.firestore, /* converter= */ null, key);
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
 * Create an AggregateField object that can be used to compute the sum of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to sum across the result set.
 */
function sum(field) {
    return new AggregateField('sum', commonE122c13e_node.fieldPathFromArgument('sum', field));
}
/**
 * Create an AggregateField object that can be used to compute the average of
 * a specified field over a range of documents in the result set of a query.
 * @param field - Specifies the field to average across the result set.
 */
function average(field) {
    return new AggregateField('avg', commonE122c13e_node.fieldPathFromArgument('average', field));
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
    return (commonE122c13e_node.queryEqual(left.query, right.query) && util.deepEqual(left.data(), right.data()));
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
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used. Every invocation of this function necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set size is calculated.
 * @returns A Promise that will be resolved with the count; the count can be
 * retrieved from `snapshot.data().count`, where `snapshot` is the
 * `AggregateQuerySnapshot` to which the returned Promise resolves.
 */
function getCountFromServer(query) {
    const countQuerySpec = {
        count: count()
    };
    return getAggregateFromServer(query, countQuerySpec);
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
 * The result received from the server is presented, unaltered, without
 * considering any local state. That is, documents in the local cache are not
 * taken into consideration, neither are local modifications not yet
 * synchronized with the server. Previously-downloaded results, if any, are not
 * used. Every invocation of this function necessarily involves a round trip to
 * the server.
 *
 * @param query - The query whose result set is aggregated over.
 * @param aggregateSpec - An `AggregateSpec` object that specifies the aggregates
 * to perform over the result set. The AggregateSpec specifies aliases for each
 * aggregate, which can be used to retrieve the aggregate result.
 * @example
 * ```typescript
 * const aggregateSnapshot = await getAggregateFromServer(query, {
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
function getAggregateFromServer(query, aggregateSpec) {
    const firestore = commonE122c13e_node.cast(query.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    const internalAggregates = commonE122c13e_node.mapToArray(aggregateSpec, (aggregate, alias) => {
        return new commonE122c13e_node.AggregateImpl(alias, aggregate.aggregateType, aggregate._internalFieldPath);
    });
    // Run the aggregation and convert the results
    return commonE122c13e_node.firestoreClientRunAggregateQuery(client, query._query, internalAggregates).then(aggregateResult => convertToAggregateQuerySnapshot(firestore, query, aggregateResult));
}
/**
 * Converts the core aggregation result to an `AggregateQuerySnapshot`
 * that can be returned to the consumer.
 * @param query
 * @param aggregateResult - Core aggregation result
 * @internal
 */
function convertToAggregateQuerySnapshot(firestore, query, aggregateResult) {
    const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
    const querySnapshot = new AggregateQuerySnapshot(query, userDataWriter, aggregateResult);
    return querySnapshot;
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
class MemoryLocalCacheImpl {
    constructor(settings) {
        this.kind = 'memory';
        this._onlineComponentProvider = commonE122c13e_node.OnlineComponentProvider.provider;
        if (settings?.garbageCollector) {
            this._offlineComponentProvider =
                settings.garbageCollector._offlineComponentProvider;
        }
        else {
            this._offlineComponentProvider = {
                build: () => new commonE122c13e_node.LruGcMemoryOfflineComponentProvider(undefined)
            };
        }
    }
    toJSON() {
        return { kind: this.kind };
    }
}
class PersistentLocalCacheImpl {
    constructor(settings) {
        this.kind = 'persistent';
        let tabManager;
        if (settings?.tabManager) {
            settings.tabManager._initialize(settings);
            tabManager = settings.tabManager;
        }
        else {
            tabManager = persistentSingleTabManager(undefined);
            tabManager._initialize(settings);
        }
        this._onlineComponentProvider = tabManager._onlineComponentProvider;
        this._offlineComponentProvider = tabManager._offlineComponentProvider;
    }
    toJSON() {
        return { kind: this.kind };
    }
}
class MemoryEagerGarbageCollectorImpl {
    constructor() {
        this.kind = 'memoryEager';
        this._offlineComponentProvider = commonE122c13e_node.MemoryOfflineComponentProvider.provider;
    }
    toJSON() {
        return { kind: this.kind };
    }
}
class MemoryLruGarbageCollectorImpl {
    constructor(cacheSize) {
        this.kind = 'memoryLru';
        this._offlineComponentProvider = {
            build: () => new commonE122c13e_node.LruGcMemoryOfflineComponentProvider(cacheSize)
        };
    }
    toJSON() {
        return { kind: this.kind };
    }
}
/**
 * Creates an instance of `MemoryEagerGarbageCollector`. This is also the
 * default garbage collector unless it is explicitly specified otherwise.
 */
function memoryEagerGarbageCollector() {
    return new MemoryEagerGarbageCollectorImpl();
}
/**
 * Creates an instance of `MemoryLruGarbageCollector`.
 *
 * A target size can be specified as part of the setting parameter. The
 * collector will start deleting documents once the cache size exceeds
 * the given size. The default cache size is 40MB (40 * 1024 * 1024 bytes).
 */
function memoryLruGarbageCollector(settings) {
    return new MemoryLruGarbageCollectorImpl(settings?.cacheSizeBytes);
}
/**
 * Creates an instance of `MemoryLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 */
function memoryLocalCache(settings) {
    return new MemoryLocalCacheImpl(settings);
}
/**
 * Creates an instance of `PersistentLocalCache`. The instance can be set to
 * `FirestoreSettings.cache` to tell the SDK which cache layer to use.
 *
 * Persistent cache cannot be used in a Node.js environment.
 */
function persistentLocalCache(settings) {
    return new PersistentLocalCacheImpl(settings);
}
class SingleTabManagerImpl {
    constructor(forceOwnership) {
        this.forceOwnership = forceOwnership;
        this.kind = 'persistentSingleTab';
    }
    toJSON() {
        return { kind: this.kind };
    }
    /**
     * @internal
     */
    _initialize(settings) {
        this._onlineComponentProvider = commonE122c13e_node.OnlineComponentProvider.provider;
        this._offlineComponentProvider = {
            build: (onlineComponents) => new commonE122c13e_node.IndexedDbOfflineComponentProvider(onlineComponents, settings?.cacheSizeBytes, this.forceOwnership)
        };
    }
}
class MultiTabManagerImpl {
    constructor() {
        this.kind = 'PersistentMultipleTab';
    }
    toJSON() {
        return { kind: this.kind };
    }
    /**
     * @internal
     */
    _initialize(settings) {
        this._onlineComponentProvider = commonE122c13e_node.OnlineComponentProvider.provider;
        this._offlineComponentProvider = {
            build: (onlineComponents) => new commonE122c13e_node.MultiTabOfflineComponentProvider(onlineComponents, settings?.cacheSizeBytes)
        };
    }
}
/**
 * Creates an instance of `PersistentSingleTabManager`.
 *
 * @param settings - Configures the created tab manager.
 */
function persistentSingleTabManager(settings) {
    return new SingleTabManagerImpl(settings?.forceOwnership);
}
/**
 * Creates an instance of `PersistentMultipleTabManager`.
 */
function persistentMultipleTabManager() {
    return new MultiTabManagerImpl();
}

const encoder = commonE122c13e_node.newTextEncoder();
function lengthPrefixedString(o) {
    const str = JSON.stringify(o);
    const l = encoder.encode(str).byteLength;
    return `${l}${str}`;
}
// TODO(wuandy): Ideally, these should use `TestBundleBuilder` above.
const meta = {
    metadata: {
        id: 'test-bundle',
        createTime: { seconds: 1577836805, nanos: 6 },
        version: 1,
        totalDocuments: 1,
        totalBytes: 416
    }
};
lengthPrefixedString(meta);
const doc1Meta = {
    documentMetadata: {
        name: 'projects/test-project/databases/(default)/documents/collectionId/doc1',
        readTime: { seconds: 5, nanos: 6 },
        exists: true
    }
};
lengthPrefixedString(doc1Meta);
const doc1 = {
    document: {
        name: 'projects/test-project/databases/(default)/documents/collectionId/doc1',
        createTime: { seconds: 1, nanos: 2000000 },
        updateTime: { seconds: 3, nanos: 4000 },
        fields: { foo: { stringValue: 'value' }, bar: { integerValue: -42 } }
    }
};
lengthPrefixedString(doc1);
const doc2Meta = {
    documentMetadata: {
        name: 'projects/test-project/databases/(default)/documents/collectionId/doc2',
        readTime: { seconds: 5, nanos: 6 },
        exists: true
    }
};
lengthPrefixedString(doc2Meta);
const doc2 = {
    document: {
        name: 'projects/test-project/databases/(default)/documents/collectionId/doc2',
        createTime: { seconds: 1, nanos: 2000000 },
        updateTime: { seconds: 3, nanos: 4000 },
        fields: {
            foo: { stringValue: 'value1' },
            bar: { integerValue: 42 },
            emptyArray: { arrayValue: {} },
            emptyMap: { mapValue: {} }
        }
    }
};
lengthPrefixedString(doc2);
const noDocMeta = {
    documentMetadata: {
        name: 'projects/test-project/databases/(default)/documents/collectionId/nodoc',
        readTime: { seconds: 5, nanos: 6 },
        exists: false
    }
};
lengthPrefixedString(noDocMeta);
const limitQuery = {
    namedQuery: {
        name: 'limitQuery',
        bundledQuery: {
            parent: 'projects/fireeats-97d5e/databases/(default)/documents',
            structuredQuery: {
                from: [{ collectionId: 'node_3.7.5_7Li7XoCjutvNxwD0tpo9' }],
                orderBy: [{ field: { fieldPath: 'sort' }, direction: 'DESCENDING' }],
                limit: { 'value': 1 }
            },
            limitType: 'FIRST'
        },
        readTime: { 'seconds': 1590011379, 'nanos': 191164000 }
    }
};
lengthPrefixedString(limitQuery);
const limitToLastQuery = {
    namedQuery: {
        name: 'limitToLastQuery',
        bundledQuery: {
            parent: 'projects/fireeats-97d5e/databases/(default)/documents',
            structuredQuery: {
                from: [{ collectionId: 'node_3.7.5_7Li7XoCjutvNxwD0tpo9' }],
                orderBy: [{ field: { fieldPath: 'sort' }, direction: 'ASCENDING' }],
                limit: { 'value': 1 }
            },
            limitType: 'LAST'
        },
        readTime: { 'seconds': 1590011379, 'nanos': 543063000 }
    }
};
lengthPrefixedString(limitToLastQuery);

/**
 * @license
 * Copyright 2025 Google LLC
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
const BUNDLE_VERSION = 1;
/**
 * Builds a Firestore data bundle with results from the given document and query snapshots.
 */
class BundleBuilder {
    constructor(firestore, bundleId) {
        this.firestore = firestore;
        this.bundleId = bundleId;
        // Resulting documents for the bundle, keyed by full document path.
        this.documents = new Map();
        // Named queries saved in the bundle, keyed by query name.
        this.namedQueries = new Map();
        // The latest read time among all bundled documents and queries.
        this.latestReadTime = new commonE122c13e_node.Timestamp(0, 0);
        this.databaseId = firestore._databaseId;
        // useProto3Json is true because the objects will be serialized to JSON string
        // before being written to the bundle buffer.
        this.serializer = new commonE122c13e_node.JsonProtoSerializer(this.databaseId, 
        /*useProto3Json=*/ true);
        this.userDataReader = new commonE122c13e_node.UserDataReader(this.databaseId, true, this.serializer);
    }
    /**
     * Adds data from a DocumentSnapshot to the bundle.
     * @internal
     * @param docBundleData - A DocumentSnapshotBundleData containing information from the
     * DocumentSnapshot. Note we cannot accept a DocumentSnapshot directly due to a circular
     * dependency error.
     * @param queryName - The name of the QuerySnapshot if this document is part of a Query.
     */
    addBundleDocument(docBundleData, queryName) {
        const originalDocument = this.documents.get(docBundleData.documentPath);
        const originalQueries = originalDocument?.metadata.queries;
        const docReadTime = docBundleData.readTime;
        const origDocReadTime = !!originalDocument?.metadata
            .readTime
            ? commonE122c13e_node.fromTimestamp(originalDocument.metadata.readTime)
            : null;
        const neitherHasReadTime = !docReadTime && origDocReadTime == null;
        const docIsNewer = docReadTime !== undefined &&
            (origDocReadTime == null || origDocReadTime < docReadTime);
        if (neitherHasReadTime || docIsNewer) {
            // Store document.
            this.documents.set(docBundleData.documentPath, {
                document: this.toBundleDocument(docBundleData),
                metadata: {
                    name: commonE122c13e_node.toName(this.serializer, docBundleData.documentKey),
                    readTime: !!docReadTime
                        ? commonE122c13e_node.toTimestamp(this.serializer, docReadTime) // Convert Timestamp to proto format.
                        : undefined,
                    exists: docBundleData.documentExists
                }
            });
        }
        if (docReadTime && docReadTime > this.latestReadTime) {
            this.latestReadTime = docReadTime;
        }
        // Update `queries` to include both original and `queryName`.
        if (queryName) {
            const newDocument = this.documents.get(docBundleData.documentPath);
            newDocument.metadata.queries = originalQueries || [];
            newDocument.metadata.queries.push(queryName);
        }
    }
    /**
     * Adds data from a QuerySnapshot to the bundle.
     * @internal
     * @param docBundleData - A QuerySnapshotBundleData containing information from the
     * QuerySnapshot. Note we cannot accept a QuerySnapshot directly due to a circular
     * dependency error.
     */
    addBundleQuery(queryBundleData) {
        if (this.namedQueries.has(queryBundleData.name)) {
            throw new Error(`Query name conflict: ${name} has already been added.`);
        }
        let latestReadTime = new commonE122c13e_node.Timestamp(0, 0);
        for (const docBundleData of queryBundleData.docBundleDataArray) {
            this.addBundleDocument(docBundleData, queryBundleData.name);
            if (docBundleData.readTime && docBundleData.readTime > latestReadTime) {
                latestReadTime = docBundleData.readTime;
            }
        }
        const queryTarget = commonE122c13e_node.toQueryTarget(this.serializer, commonE122c13e_node.queryToTarget(queryBundleData.query));
        const bundledQuery = {
            parent: queryBundleData.parent,
            structuredQuery: queryTarget.queryTarget.structuredQuery
        };
        this.namedQueries.set(queryBundleData.name, {
            name: queryBundleData.name,
            bundledQuery,
            readTime: commonE122c13e_node.toTimestamp(this.serializer, latestReadTime)
        });
    }
    /**
     * Convert data from a DocumentSnapshot into the serialized form within a bundle.
     * @private
     * @internal
     * @param docBundleData - a DocumentSnapshotBundleData containing the data required to
     * serialize a document.
     */
    toBundleDocument(docBundleData) {
        // a parse context is typically used for validating and parsing user data, but in this
        // case we are using it internally to convert DocumentData to Proto3 JSON
        const context = this.userDataReader.createContext(4 /* UserDataSource.ArrayArgument */, 'internal toBundledDocument');
        const proto3Fields = commonE122c13e_node.parseObject(docBundleData.documentData, context);
        return {
            name: commonE122c13e_node.toName(this.serializer, docBundleData.documentKey),
            fields: proto3Fields.mapValue.fields,
            updateTime: commonE122c13e_node.toTimestamp(this.serializer, docBundleData.versionTime),
            createTime: commonE122c13e_node.toTimestamp(this.serializer, docBundleData.createdTime)
        };
    }
    /**
     * Converts a IBundleElement to a Buffer whose content is the length prefixed JSON representation
     * of the element.
     * @private
     * @internal
     * @param bundleElement - A ProtoBundleElement that is expected to be Proto3 JSON compatible.
     */
    lengthPrefixedString(bundleElement) {
        const str = JSON.stringify(bundleElement);
        // TODO: it's not ideal to have to re-encode all of these strings multiple times
        //       It may be more performant to return a UInt8Array that is concatenated to other
        //       UInt8Arrays instead of returning and concatenating strings and then
        //       converting the full string to UInt8Array.
        const l = encoder.encode(str).byteLength;
        return `${l}${str}`;
    }
    /**
     * Construct a serialized string containing document and query information that has previously
     * been added to the BundleBuilder through the addBundleDocument and addBundleQuery methods.
     * @internal
     */
    build() {
        let bundleString = '';
        for (const namedQuery of this.namedQueries.values()) {
            bundleString += this.lengthPrefixedString({ namedQuery });
        }
        for (const bundledDocument of this.documents.values()) {
            const documentMetadata = bundledDocument.metadata;
            bundleString += this.lengthPrefixedString({ documentMetadata });
            // Write to the bundle if document exists.
            const document = bundledDocument.document;
            if (document) {
                bundleString += this.lengthPrefixedString({ document });
            }
        }
        const metadata = {
            id: this.bundleId,
            createTime: commonE122c13e_node.toTimestamp(this.serializer, this.latestReadTime),
            version: BUNDLE_VERSION,
            totalDocuments: this.documents.size,
            // TODO: it's not ideal to have to re-encode all of these strings multiple times
            totalBytes: encoder.encode(bundleString).length
        };
        // Prepends the metadata element to the bundleBuffer: `bundleBuffer` is the second argument to `Buffer.concat`.
        bundleString = this.lengthPrefixedString({ metadata }) + bundleString;
        return bundleString;
    }
}

/**
 * @license
 * Copyright 2025 Google LLC
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
function buildDocumentSnapshotJsonBundle(db, document, docData, path) {
    const builder = new BundleBuilder(db, commonE122c13e_node.AutoId.newId());
    builder.addBundleDocument(documentToDocumentSnapshotBundleData(path, docData, document));
    return builder.build();
}
function buildQuerySnapshotJsonBundle(db, query, bundleName, parent, paths, docs, documentData) {
    const docBundleDataArray = [];
    for (let i = 0; i < docs.length; i++) {
        docBundleDataArray.push(documentToDocumentSnapshotBundleData(paths[i], documentData[i], docs[i]));
    }
    const bundleData = {
        name: bundleName,
        query,
        parent,
        docBundleDataArray
    };
    const builder = new BundleBuilder(db, bundleName);
    builder.addBundleQuery(bundleData);
    return builder.build();
}
// Formats Document data for bundling a DocumentSnapshot.
function documentToDocumentSnapshotBundleData(path, documentData, document) {
    return {
        documentData,
        documentKey: document.mutableCopy().key,
        documentPath: path,
        documentExists: true,
        createdTime: document.createTime.toTimestamp(),
        readTime: document.readTime.toTimestamp(),
        versionTime: document.version.toTimestamp()
    };
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
const NOT_SUPPORTED = 'NOT SUPPORTED';
/**
 * Metadata about a snapshot, describing the state of the snapshot.
 */
class SnapshotMetadata {
    /** @hideconstructor */
    constructor(hasPendingWrites, fromCache) {
        this.hasPendingWrites = hasPendingWrites;
        this.fromCache = fromCache;
    }
    /**
     * Returns true if this `SnapshotMetadata` is equal to the provided one.
     *
     * @param other - The `SnapshotMetadata` to compare against.
     * @returns true if this `SnapshotMetadata` is equal to the provided one.
     */
    isEqual(other) {
        return (this.hasPendingWrites === other.hasPendingWrites &&
            this.fromCache === other.fromCache);
    }
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
class DocumentSnapshot extends DocumentSnapshot$1 {
    /** @hideconstructor protected */
    constructor(_firestore, userDataWriter, key, document, metadata, converter) {
        super(_firestore, userDataWriter, key, document, converter);
        this._firestore = _firestore;
        this._firestoreImpl = _firestore;
        this.metadata = metadata;
    }
    /**
     * Returns whether or not the data exists. True if the document exists.
     */
    exists() {
        return super.exists();
    }
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
    data(options = {}) {
        if (!this._document) {
            return undefined;
        }
        else if (this._converter) {
            // We only want to use the converter and create a new DocumentSnapshot
            // if a converter has been provided.
            const snapshot = new QueryDocumentSnapshot(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, 
            /* converter= */ null);
            return this._converter.fromFirestore(snapshot, options);
        }
        else {
            return this._userDataWriter.convertValue(this._document.data.value, options.serverTimestamps);
        }
    }
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
    // We are using `any` here to avoid an explicit cast by our users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(fieldPath, options = {}) {
        if (this._document) {
            const value = this._document.data.field(commonE122c13e_node.fieldPathFromArgument('DocumentSnapshot.get', fieldPath));
            if (value !== null) {
                return this._userDataWriter.convertValue(value, options.serverTimestamps);
            }
        }
        return undefined;
    }
    /**
     * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
     *
     * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
     * `DocumentSnapshot` has pending writes.
     */
    toJSON() {
        if (this.metadata.hasPendingWrites) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.FAILED_PRECONDITION, 'DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. ' +
                'Await waitForPendingWrites() before invoking toJSON().');
        }
        const document = this._document;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = {};
        result['type'] = DocumentSnapshot._jsonSchemaVersion;
        result['bundle'] = '';
        result['bundleSource'] = 'DocumentSnapshot';
        result['bundleName'] = this._key.toString();
        if (!document ||
            !document.isValidDocument() ||
            !document.isFoundDocument()) {
            return result;
        }
        const documentData = this._userDataWriter.convertObjectMap(document.data.value.mapValue.fields, 'previous');
        result['bundle'] = buildDocumentSnapshotJsonBundle(this._firestore, document, documentData, this.ref.path);
        return result;
    }
}
DocumentSnapshot._jsonSchemaVersion = 'firestore/documentSnapshot/1.0';
DocumentSnapshot._jsonSchema = {
    type: commonE122c13e_node.property('string', DocumentSnapshot._jsonSchemaVersion),
    bundleSource: commonE122c13e_node.property('string', 'DocumentSnapshot'),
    bundleName: commonE122c13e_node.property('string'),
    bundle: commonE122c13e_node.property('string')
};
function documentSnapshotFromJSON(db, json, converter) {
    if (commonE122c13e_node.validateJSON(json, DocumentSnapshot._jsonSchema)) {
        if (json.bundle === NOT_SUPPORTED) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'The provided JSON object was created in a client environment, which is not supported.');
        }
        // Parse the bundle data.
        const serializer = commonE122c13e_node.newSerializer(db._databaseId);
        const bundleReader = commonE122c13e_node.createBundleReaderSync(json.bundle, serializer);
        const elements = bundleReader.getElements();
        const bundleLoader = new commonE122c13e_node.BundleLoader(bundleReader.getMetadata(), serializer);
        for (const element of elements) {
            bundleLoader.addSizedElement(element);
        }
        // Ensure that we have the correct number of documents in the bundle.
        const bundledDocuments = bundleLoader.documents;
        if (bundledDocuments.length !== 1) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Expected bundle data to contain 1 document, but it contains ${bundledDocuments.length} documents.`);
        }
        // Build out the internal document data.
        const document = commonE122c13e_node.fromDocument(serializer, bundledDocuments[0].document);
        const documentKey = new commonE122c13e_node.DocumentKey(commonE122c13e_node.ResourcePath.fromString(json.bundleName));
        // Return the external facing DocumentSnapshot.
        return new DocumentSnapshot(db, new LiteUserDataWriter(db), documentKey, document, new SnapshotMetadata(
        /* hasPendingWrites= */ false, 
        /* fromCache= */ false), converter ? converter : null);
    }
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
class QueryDocumentSnapshot extends DocumentSnapshot {
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
    data(options = {}) {
        return super.data(options);
    }
}
/**
 * A `QuerySnapshot` contains zero or more `DocumentSnapshot` objects
 * representing the results of a query. The documents can be accessed as an
 * array via the `docs` property or enumerated using the `forEach` method. The
 * number of documents can be determined via the `empty` and `size`
 * properties.
 */
class QuerySnapshot {
    /** @hideconstructor */
    constructor(_firestore, _userDataWriter, query, _snapshot) {
        this._firestore = _firestore;
        this._userDataWriter = _userDataWriter;
        this._snapshot = _snapshot;
        this.metadata = new SnapshotMetadata(_snapshot.hasPendingWrites, _snapshot.fromCache);
        this.query = query;
    }
    /** An array of all the documents in the `QuerySnapshot`. */
    get docs() {
        const result = [];
        this.forEach(doc => result.push(doc));
        return result;
    }
    /** The number of documents in the `QuerySnapshot`. */
    get size() {
        return this._snapshot.docs.size;
    }
    /** True if there are no documents in the `QuerySnapshot`. */
    get empty() {
        return this.size === 0;
    }
    /**
     * Enumerates all of the documents in the `QuerySnapshot`.
     *
     * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
     * each document in the snapshot.
     * @param thisArg - The `this` binding for the callback.
     */
    forEach(callback, thisArg) {
        this._snapshot.docs.forEach(doc => {
            callback.call(thisArg, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, doc.key, doc, new SnapshotMetadata(this._snapshot.mutatedKeys.has(doc.key), this._snapshot.fromCache), this.query.converter));
        });
    }
    /**
     * Returns an array of the documents changes since the last snapshot. If this
     * is the first snapshot, all documents will be in the list as 'added'
     * changes.
     *
     * @param options - `SnapshotListenOptions` that control whether metadata-only
     * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
     * snapshot events.
     */
    docChanges(options = {}) {
        const includeMetadataChanges = !!options.includeMetadataChanges;
        if (includeMetadataChanges && this._snapshot.excludesMetadataChanges) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'To include metadata changes with your document changes, you must ' +
                'also pass { includeMetadataChanges:true } to onSnapshot().');
        }
        if (!this._cachedChanges ||
            this._cachedChangesIncludeMetadataChanges !== includeMetadataChanges) {
            this._cachedChanges = changesFromSnapshot(this, includeMetadataChanges);
            this._cachedChangesIncludeMetadataChanges = includeMetadataChanges;
        }
        return this._cachedChanges;
    }
    /**
     * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
     *
     * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
     * `QuerySnapshot` has pending writes.
     */
    toJSON() {
        if (this.metadata.hasPendingWrites) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.FAILED_PRECONDITION, 'QuerySnapshot.toJSON() attempted to serialize a document with pending writes. ' +
                'Await waitForPendingWrites() before invoking toJSON().');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = {};
        result['type'] = QuerySnapshot._jsonSchemaVersion;
        result['bundleSource'] = 'QuerySnapshot';
        result['bundleName'] = commonE122c13e_node.AutoId.newId();
        const databaseId = this._firestore._databaseId.database;
        const projectId = this._firestore._databaseId.projectId;
        const parent = `projects/${projectId}/databases/${databaseId}/documents`;
        const documents = [];
        const documentData = [];
        const paths = [];
        this.docs.forEach(doc => {
            if (doc._document === null) {
                return;
            }
            documents.push(doc._document);
            documentData.push(this._userDataWriter.convertObjectMap(doc._document.data.value.mapValue.fields, 'previous'));
            paths.push(doc.ref.path);
        });
        result['bundle'] = buildQuerySnapshotJsonBundle(this._firestore, this.query._query, result['bundleName'], parent, paths, documents, documentData);
        return result;
    }
}
QuerySnapshot._jsonSchemaVersion = 'firestore/querySnapshot/1.0';
QuerySnapshot._jsonSchema = {
    type: commonE122c13e_node.property('string', QuerySnapshot._jsonSchemaVersion),
    bundleSource: commonE122c13e_node.property('string', 'QuerySnapshot'),
    bundleName: commonE122c13e_node.property('string'),
    bundle: commonE122c13e_node.property('string')
};
function querySnapshotFromJSON(db, json, converter) {
    if (commonE122c13e_node.validateJSON(json, QuerySnapshot._jsonSchema)) {
        if (json.bundle === NOT_SUPPORTED) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'The provided JSON object was created in a client environment, which is not supported.');
        }
        // Parse the bundle data.
        const serializer = commonE122c13e_node.newSerializer(db._databaseId);
        const bundleReader = commonE122c13e_node.createBundleReaderSync(json.bundle, serializer);
        const elements = bundleReader.getElements();
        const bundleLoader = new commonE122c13e_node.BundleLoader(bundleReader.getMetadata(), serializer);
        for (const element of elements) {
            bundleLoader.addSizedElement(element);
        }
        if (bundleLoader.queries.length !== 1) {
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `Snapshot data expected 1 query but found ${bundleLoader.queries.length} queries.`);
        }
        // Create an internal Query object from the named query in the bundle.
        const query = commonE122c13e_node.fromBundledQuery(bundleLoader.queries[0].bundledQuery);
        // Construct the arrays of document data for the query.
        const bundledDocuments = bundleLoader.documents;
        let documentSet = new commonE122c13e_node.DocumentSet();
        bundledDocuments.map(bundledDocument => {
            const document = commonE122c13e_node.fromDocument(serializer, bundledDocument.document);
            documentSet = documentSet.add(document);
        });
        // Create a view snapshot of the query and documents.
        const viewSnapshot = commonE122c13e_node.ViewSnapshot.fromInitialDocuments(query, documentSet, commonE122c13e_node.documentKeySet() /* Zero mutated keys signifies no pending writes. */, 
        /* fromCache= */ false, 
        /* hasCachedResults= */ false);
        // Create an external Query object, required to construct the QuerySnapshot.
        const externalQuery = new commonE122c13e_node.Query(db, converter ? converter : null, query);
        // Return a new QuerySnapshot with all of the collected data.
        return new QuerySnapshot(db, new LiteUserDataWriter(db), externalQuery, viewSnapshot);
    }
}
/** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
function changesFromSnapshot(querySnapshot, includeMetadataChanges) {
    if (querySnapshot._snapshot.oldDocs.isEmpty()) {
        let index = 0;
        return querySnapshot._snapshot.docChanges.map(change => {
            const doc = new QueryDocumentSnapshot(querySnapshot._firestore, querySnapshot._userDataWriter, change.doc.key, change.doc, new SnapshotMetadata(querySnapshot._snapshot.mutatedKeys.has(change.doc.key), querySnapshot._snapshot.fromCache), querySnapshot.query.converter);
            change.doc;
            return {
                type: 'added',
                doc,
                oldIndex: -1,
                newIndex: index++
            };
        });
    }
    else {
        // A `DocumentSet` that is updated incrementally as changes are applied to use
        // to lookup the index of a document.
        let indexTracker = querySnapshot._snapshot.oldDocs;
        return querySnapshot._snapshot.docChanges
            .filter(change => includeMetadataChanges || change.type !== 3 /* ChangeType.Metadata */)
            .map(change => {
            const doc = new QueryDocumentSnapshot(querySnapshot._firestore, querySnapshot._userDataWriter, change.doc.key, change.doc, new SnapshotMetadata(querySnapshot._snapshot.mutatedKeys.has(change.doc.key), querySnapshot._snapshot.fromCache), querySnapshot.query.converter);
            let oldIndex = -1;
            let newIndex = -1;
            if (change.type !== 0 /* ChangeType.Added */) {
                oldIndex = indexTracker.indexOf(change.doc.key);
                indexTracker = indexTracker.delete(change.doc.key);
            }
            if (change.type !== 1 /* ChangeType.Removed */) {
                indexTracker = indexTracker.add(change.doc);
                newIndex = indexTracker.indexOf(change.doc.key);
            }
            return {
                type: resultChangeType(change.type),
                doc,
                oldIndex,
                newIndex
            };
        });
    }
}
function resultChangeType(type) {
    switch (type) {
        case 0 /* ChangeType.Added */:
            return 'added';
        case 2 /* ChangeType.Modified */:
        case 3 /* ChangeType.Metadata */:
            return 'modified';
        case 1 /* ChangeType.Removed */:
            return 'removed';
        default:
            return commonE122c13e_node.fail(0xf03d, { type });
    }
}
// TODO(firestoreexp): Add tests for snapshotEqual with different snapshot
// metadata
/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
function snapshotEqual(left, right) {
    if (left instanceof DocumentSnapshot && right instanceof DocumentSnapshot) {
        return (left._firestore === right._firestore &&
            left._key.isEqual(right._key) &&
            (left._document === null
                ? right._document === null
                : left._document.isEqual(right._document)) &&
            left._converter === right._converter);
    }
    else if (left instanceof QuerySnapshot && right instanceof QuerySnapshot) {
        return (left._firestore === right._firestore &&
            commonE122c13e_node.queryEqual(left.query, right.query) &&
            left.metadata.isEqual(right.metadata) &&
            left._snapshot.isEqual(right._snapshot));
    }
    return false;
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
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Max attempts must be at least 1');
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
        this._dataReader = commonE122c13e_node.newUserDataReader(_firestore);
    }
    set(documentRef, data, options) {
        this._verifyNotCommitted();
        const ref = validateReference(documentRef, this._firestore);
        const convertedValue = applyFirestoreDataConverter(ref.converter, data, options);
        const parsed = commonE122c13e_node.parseSetData(this._dataReader, 'WriteBatch.set', ref._key, convertedValue, ref.converter !== null, options);
        this._mutations.push(parsed.toMutation(ref._key, commonE122c13e_node.Precondition.none()));
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
            fieldOrUpdateData instanceof commonE122c13e_node.FieldPath) {
            parsed = commonE122c13e_node.parseUpdateVarargs(this._dataReader, 'WriteBatch.update', ref._key, fieldOrUpdateData, value, moreFieldsAndValues);
        }
        else {
            parsed = commonE122c13e_node.parseUpdateData(this._dataReader, 'WriteBatch.update', ref._key, fieldOrUpdateData);
        }
        this._mutations.push(parsed.toMutation(ref._key, commonE122c13e_node.Precondition.exists(true)));
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
        this._mutations = this._mutations.concat(new commonE122c13e_node.DeleteMutation(ref._key, commonE122c13e_node.Precondition.none()));
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
            throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.FAILED_PRECONDITION, 'A write batch can no longer be used after commit() ' +
                'has been called.');
        }
    }
}
function validateReference(documentRef, firestore) {
    documentRef = util.getModularInstance(documentRef);
    if (documentRef.firestore !== firestore) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Provided document reference is from a different Firestore instance.');
    }
    else {
        return documentRef;
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
// TODO(mrschmidt) Consider using `BaseTransaction` as the base class in the
// legacy SDK.
/**
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
class Transaction$1 {
    /** @hideconstructor */
    constructor(_firestore, _transaction) {
        this._firestore = _firestore;
        this._transaction = _transaction;
        this._dataReader = commonE122c13e_node.newUserDataReader(_firestore);
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get(documentRef) {
        const ref = validateReference(documentRef, this._firestore);
        const userDataWriter = new LiteUserDataWriter(this._firestore);
        return this._transaction.lookup([ref._key]).then(docs => {
            if (!docs || docs.length !== 1) {
                return commonE122c13e_node.fail(0x5de9);
            }
            const doc = docs[0];
            if (doc.isFoundDocument()) {
                return new DocumentSnapshot$1(this._firestore, userDataWriter, doc.key, doc, ref.converter);
            }
            else if (doc.isNoDocument()) {
                return new DocumentSnapshot$1(this._firestore, userDataWriter, ref._key, null, ref.converter);
            }
            else {
                throw commonE122c13e_node.fail(0x4801, {
                    doc
                });
            }
        });
    }
    set(documentRef, value, options) {
        const ref = validateReference(documentRef, this._firestore);
        const convertedValue = applyFirestoreDataConverter(ref.converter, value, options);
        const parsed = commonE122c13e_node.parseSetData(this._dataReader, 'Transaction.set', ref._key, convertedValue, ref.converter !== null, options);
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
            fieldOrUpdateData instanceof commonE122c13e_node.FieldPath) {
            parsed = commonE122c13e_node.parseUpdateVarargs(this._dataReader, 'Transaction.update', ref._key, fieldOrUpdateData, value, moreFieldsAndValues);
        }
        else {
            parsed = commonE122c13e_node.parseUpdateData(this._dataReader, 'Transaction.update', ref._key, fieldOrUpdateData);
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
 * A reference to a transaction.
 *
 * The `Transaction` object passed to a transaction's `updateFunction` provides
 * the methods to read and write data within the transaction context. See
 * {@link runTransaction}.
 */
class Transaction extends Transaction$1 {
    // This class implements the same logic as the Transaction API in the Lite SDK
    // but is subclassed in order to return its own DocumentSnapshot types.
    /** @hideconstructor */
    constructor(_firestore, _transaction) {
        super(_firestore, _transaction);
        this._firestore = _firestore;
    }
    /**
     * Reads the document referenced by the provided {@link DocumentReference}.
     *
     * @param documentRef - A reference to the document to be read.
     * @returns A `DocumentSnapshot` with the read data.
     */
    get(documentRef) {
        const ref = validateReference(documentRef, this._firestore);
        const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(this._firestore);
        return super
            .get(documentRef)
            .then(liteDocumentSnapshot => new DocumentSnapshot(this._firestore, userDataWriter, ref._key, liteDocumentSnapshot._document, new SnapshotMetadata(
        /* hasPendingWrites= */ false, 
        /* fromCache= */ false), ref.converter));
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
    firestore = commonE122c13e_node.cast(firestore, commonE122c13e_node.Firestore);
    const optionsWithDefaults = {
        ...DEFAULT_TRANSACTION_OPTIONS,
        ...options
    };
    validateTransactionOptions(optionsWithDefaults);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    return commonE122c13e_node.firestoreClientTransaction(client, internalTransaction => updateFunction(new Transaction(firestore, internalTransaction)), optionsWithDefaults);
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
function isPartialObserver(obj) {
    return implementsAnyMethods(obj, ['next', 'error', 'complete']);
}
/**
 * Returns true if obj is an object and contains at least one of the specified
 * methods.
 */
function implementsAnyMethods(obj, methods) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    const object = obj;
    for (const method of methods) {
        if (method in object && typeof object[method] === 'function') {
            return true;
        }
    }
    return false;
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
function getDoc(reference) {
    reference = commonE122c13e_node.cast(reference, commonE122c13e_node.DocumentReference);
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    return commonE122c13e_node.firestoreClientGetDocumentViaSnapshotListener(client, reference._key).then(snapshot => convertToDocSnapshot(firestore, reference, snapshot));
}
/**
 * Reads the document referred to by this `DocumentReference` from cache.
 * Returns an error if the document is not currently cached.
 *
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
function getDocFromCache(reference) {
    reference = commonE122c13e_node.cast(reference, commonE122c13e_node.DocumentReference);
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
    return commonE122c13e_node.firestoreClientGetDocumentFromLocalCache(client, reference._key).then(doc => new DocumentSnapshot(firestore, userDataWriter, reference._key, doc, new SnapshotMetadata(doc !== null && doc.hasLocalMutations, 
    /* fromCache= */ true), reference.converter));
}
/**
 * Reads the document referred to by this `DocumentReference` from the server.
 * Returns an error if the network is not available.
 *
 * @returns A `Promise` that resolves with a `DocumentSnapshot` containing the
 * document contents.
 */
function getDocFromServer(reference) {
    reference = commonE122c13e_node.cast(reference, commonE122c13e_node.DocumentReference);
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    return commonE122c13e_node.firestoreClientGetDocumentViaSnapshotListener(client, reference._key, {
        source: 'server'
    }).then(snapshot => convertToDocSnapshot(firestore, reference, snapshot));
}
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
function getDocs(query) {
    query = commonE122c13e_node.cast(query, commonE122c13e_node.Query);
    const firestore = commonE122c13e_node.cast(query.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
    validateHasExplicitOrderByForLimitToLast(query._query);
    return commonE122c13e_node.firestoreClientGetDocumentsViaSnapshotListener(client, query._query).then(snapshot => new QuerySnapshot(firestore, userDataWriter, query, snapshot));
}
/**
 * Executes the query and returns the results as a `QuerySnapshot` from cache.
 * Returns an empty result set if no documents matching the query are currently
 * cached.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
function getDocsFromCache(query) {
    query = commonE122c13e_node.cast(query, commonE122c13e_node.Query);
    const firestore = commonE122c13e_node.cast(query.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
    return commonE122c13e_node.firestoreClientGetDocumentsFromLocalCache(client, query._query).then(snapshot => new QuerySnapshot(firestore, userDataWriter, query, snapshot));
}
/**
 * Executes the query and returns the results as a `QuerySnapshot` from the
 * server. Returns an error if the network is not available.
 *
 * @returns A `Promise` that resolves with the results of the query.
 */
function getDocsFromServer(query) {
    query = commonE122c13e_node.cast(query, commonE122c13e_node.Query);
    const firestore = commonE122c13e_node.cast(query.firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
    return commonE122c13e_node.firestoreClientGetDocumentsViaSnapshotListener(client, query._query, {
        source: 'server'
    }).then(snapshot => new QuerySnapshot(firestore, userDataWriter, query, snapshot));
}
function setDoc(reference, data, options) {
    reference = commonE122c13e_node.cast(reference, commonE122c13e_node.DocumentReference);
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const convertedValue = applyFirestoreDataConverter(reference.converter, data, options);
    const dataReader = commonE122c13e_node.newUserDataReader(firestore);
    const parsed = commonE122c13e_node.parseSetData(dataReader, 'setDoc', reference._key, convertedValue, reference.converter !== null, options);
    const mutation = parsed.toMutation(reference._key, commonE122c13e_node.Precondition.none());
    return executeWrite(firestore, [mutation]);
}
function updateDoc(reference, fieldOrUpdateData, value, ...moreFieldsAndValues) {
    reference = commonE122c13e_node.cast(reference, commonE122c13e_node.DocumentReference);
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const dataReader = commonE122c13e_node.newUserDataReader(firestore);
    // For Compat types, we have to "extract" the underlying types before
    // performing validation.
    fieldOrUpdateData = util.getModularInstance(fieldOrUpdateData);
    let parsed;
    if (typeof fieldOrUpdateData === 'string' ||
        fieldOrUpdateData instanceof commonE122c13e_node.FieldPath) {
        parsed = commonE122c13e_node.parseUpdateVarargs(dataReader, 'updateDoc', reference._key, fieldOrUpdateData, value, moreFieldsAndValues);
    }
    else {
        parsed = commonE122c13e_node.parseUpdateData(dataReader, 'updateDoc', reference._key, fieldOrUpdateData);
    }
    const mutation = parsed.toMutation(reference._key, commonE122c13e_node.Precondition.exists(true));
    return executeWrite(firestore, [mutation]);
}
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
function deleteDoc(reference) {
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const mutations = [new commonE122c13e_node.DeleteMutation(reference._key, commonE122c13e_node.Precondition.none())];
    return executeWrite(firestore, mutations);
}
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
function addDoc(reference, data) {
    const firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
    const docRef = commonE122c13e_node.doc(reference);
    const convertedValue = applyFirestoreDataConverter(reference.converter, data);
    const dataReader = commonE122c13e_node.newUserDataReader(reference.firestore);
    const parsed = commonE122c13e_node.parseSetData(dataReader, 'addDoc', docRef._key, convertedValue, reference.converter !== null, {});
    const mutation = parsed.toMutation(docRef._key, commonE122c13e_node.Precondition.exists(false));
    return executeWrite(firestore, [mutation]).then(() => docRef);
}
function onSnapshot(reference, ...args) {
    // onSnapshot for Query or Document.
    reference = util.getModularInstance(reference);
    let options = {
        includeMetadataChanges: false,
        source: 'default'
    };
    let currArg = 0;
    if (typeof args[currArg] === 'object' && !isPartialObserver(args[currArg])) {
        options = args[currArg++];
    }
    const internalOptions = {
        includeMetadataChanges: options.includeMetadataChanges,
        source: options.source
    };
    if (isPartialObserver(args[currArg])) {
        const userObserver = args[currArg];
        args[currArg] = userObserver.next?.bind(userObserver);
        args[currArg + 1] = userObserver.error?.bind(userObserver);
        args[currArg + 2] = userObserver.complete?.bind(userObserver);
    }
    let observer;
    let firestore;
    let internalQuery;
    if (reference instanceof commonE122c13e_node.DocumentReference) {
        firestore = commonE122c13e_node.cast(reference.firestore, commonE122c13e_node.Firestore);
        internalQuery = commonE122c13e_node.newQueryForPath(reference._key.path);
        observer = {
            next: snapshot => {
                if (args[currArg]) {
                    args[currArg](convertToDocSnapshot(firestore, reference, snapshot));
                }
            },
            error: args[currArg + 1],
            complete: args[currArg + 2]
        };
    }
    else {
        const query = commonE122c13e_node.cast(reference, commonE122c13e_node.Query);
        firestore = commonE122c13e_node.cast(query.firestore, commonE122c13e_node.Firestore);
        internalQuery = query._query;
        const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
        observer = {
            next: snapshot => {
                if (args[currArg]) {
                    args[currArg](new QuerySnapshot(firestore, userDataWriter, query, snapshot));
                }
            },
            error: args[currArg + 1],
            complete: args[currArg + 2]
        };
        validateHasExplicitOrderByForLimitToLast(reference._query);
    }
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    return commonE122c13e_node.firestoreClientListen(client, internalQuery, internalOptions, observer);
}
function onSnapshotResume(reference, snapshotJson, ...args) {
    const db = util.getModularInstance(reference);
    const json = normalizeSnapshotJsonFields(snapshotJson);
    if (json.error) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, json.error);
    }
    let curArg = 0;
    let options = undefined;
    if (typeof args[curArg] === 'object' && !isPartialObserver(args[curArg])) {
        options = args[curArg++];
    }
    if (json.bundleSource === 'QuerySnapshot') {
        let observer = null;
        if (typeof args[curArg] === 'object' && isPartialObserver(args[curArg])) {
            const userObserver = args[curArg++];
            observer = {
                next: userObserver.next,
                error: userObserver.error,
                complete: userObserver.complete
            };
        }
        else {
            observer = {
                next: args[curArg++],
                error: args[curArg++],
                complete: args[curArg++]
            };
        }
        return onSnapshotQuerySnapshotBundle(db, json, options, observer, args[curArg]);
    }
    else if (json.bundleSource === 'DocumentSnapshot') {
        let observer = null;
        if (typeof args[curArg] === 'object' && isPartialObserver(args[curArg])) {
            const userObserver = args[curArg++];
            observer = {
                next: userObserver.next,
                error: userObserver.error,
                complete: userObserver.complete
            };
        }
        else {
            observer = {
                next: args[curArg++],
                error: args[curArg++],
                complete: args[curArg++]
            };
        }
        return onSnapshotDocumentSnapshotBundle(db, json, options, observer, args[curArg]);
    }
    else {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, `unsupported bundle source: ${json.bundleSource}`);
    }
}
function onSnapshotsInSync(firestore, arg) {
    firestore = commonE122c13e_node.cast(firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    const observer = isPartialObserver(arg)
        ? arg
        : {
            next: arg
        };
    return commonE122c13e_node.firestoreClientAddSnapshotsInSyncListener(client, observer);
}
/**
 * Locally writes `mutations` on the async queue.
 * @internal
 */
function executeWrite(firestore, mutations) {
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    return commonE122c13e_node.firestoreClientWrite(client, mutations);
}
/**
 * Converts a {@link ViewSnapshot} that contains the single document specified by `ref`
 * to a {@link DocumentSnapshot}.
 */
function convertToDocSnapshot(firestore, ref, snapshot) {
    const doc = snapshot.docs.get(ref._key);
    const userDataWriter = new commonE122c13e_node.ExpUserDataWriter(firestore);
    return new DocumentSnapshot(firestore, userDataWriter, ref._key, doc, new SnapshotMetadata(snapshot.hasPendingWrites, snapshot.fromCache), ref.converter);
}
/**
 * Ensures the data required to construct an {@link onSnapshot} listener exist in a `snapshotJson`
 * object that originates from {@link DocumentSnapshot.toJSON} or {@link Querysnapshot.toJSON}. The
 * data is normalized into a typed object.
 *
 * @param snapshotJson - The JSON object that the app provided to {@link onSnapshot}.
 * @returns A normalized object that contains all of the required bundle JSON fields. If
 * {@link snapshotJson} doesn't contain the required fields, or if the fields exist as empty
 * strings, then the {@link snapshotJson.error} field will be a non empty string.
 *
 * @internal
 */
function normalizeSnapshotJsonFields(snapshotJson) {
    const result = {
        bundle: '',
        bundleName: '',
        bundleSource: ''
    };
    const requiredKeys = ['bundle', 'bundleName', 'bundleSource'];
    for (const key of requiredKeys) {
        if (!(key in snapshotJson)) {
            result.error = `snapshotJson missing required field: ${key}`;
            break;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = snapshotJson[key];
        if (typeof value !== 'string') {
            result.error = `snapshotJson field '${key}' must be a string.`;
            break;
        }
        if (value.length === 0) {
            result.error = `snapshotJson field '${key}' cannot be an empty string.`;
            break;
        }
        if (key === 'bundle') {
            result.bundle = value;
        }
        else if (key === 'bundleName') {
            result.bundleName = value;
        }
        else if (key === 'bundleSource') {
            result.bundleSource = value;
        }
    }
    return result;
}
/**
 * Loads the bundle in a separate task and then invokes {@link onSnapshot} with a
 * {@link DocumentReference} for the document in the bundle.
 *
 * @param firestore - The {@link Firestore} instance for the {@link onSnapshot} operation request.
 * @param json - The JSON bundle to load, produced by {@link DocumentSnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 *
 * @internal
 */
function onSnapshotDocumentSnapshotBundle(db, json, options, observer, converter) {
    let unsubscribed = false;
    let internalUnsubscribe;
    const loadTask = commonE122c13e_node.loadBundle(db, json.bundle);
    loadTask
        .then(() => {
        if (!unsubscribed) {
            const docReference = new commonE122c13e_node.DocumentReference(db, converter ? converter : null, commonE122c13e_node.DocumentKey.fromPath(json.bundleName));
            internalUnsubscribe = onSnapshot(docReference, options ? options : {}, observer);
        }
    })
        .catch(e => {
        if (observer.error) {
            observer.error(e);
        }
        return () => { };
    });
    return () => {
        if (unsubscribed) {
            return;
        }
        unsubscribed = true;
        if (internalUnsubscribe) {
            internalUnsubscribe();
        }
    };
}
/**
 * Loads the bundle in a separate task and then invokes {@link onSnapshot} with a
 * {@link Query} that represents the Query in the bundle.
 *
 * @param firestore - The {@link Firestore} instance for the {@link onSnapshot} operation request.
 * @param json - The JSON bundle to load, produced by {@link QuerySnapshot.toJSON}.
 * @param options - Options controlling the listen behavior.
 * @param observer - A single object containing `next` and `error` callbacks.
 * @param converter - An optional object that converts objects from Firestore before the onNext
 * listener is invoked.
 * @returns An unsubscribe function that can be called to cancel the snapshot
 * listener.
 *
 * @internal
 */
function onSnapshotQuerySnapshotBundle(db, json, options, observer, converter) {
    let unsubscribed = false;
    let internalUnsubscribe;
    const loadTask = commonE122c13e_node.loadBundle(db, json.bundle);
    loadTask
        .then(() => commonE122c13e_node.namedQuery(db, json.bundleName))
        .then(query => {
        if (query && !unsubscribed) {
            const realQuery = query;
            if (converter) {
                realQuery.withConverter(converter);
            }
            internalUnsubscribe = onSnapshot(query, options ? options : {}, observer);
        }
    })
        .catch(e => {
        if (observer.error) {
            observer.error(e);
        }
        return () => { };
    });
    return () => {
        if (unsubscribed) {
            return;
        }
        unsubscribed = true;
        if (internalUnsubscribe) {
            internalUnsubscribe();
        }
    };
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
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation. The maximum number of writes allowed in a single {@link WriteBatch}
 * is 500.
 *
 * Unlike transactions, write batches are persisted offline and therefore are
 * preferable when you don't need to condition your writes on read data.
 *
 * @returns A {@link WriteBatch} that can be used to atomically execute multiple
 * writes.
 */
function writeBatch(firestore) {
    firestore = commonE122c13e_node.cast(firestore, commonE122c13e_node.Firestore);
    commonE122c13e_node.ensureFirestoreConfigured(firestore);
    return new WriteBatch(firestore, mutations => executeWrite(firestore, mutations));
}

/**
 * @license
 * Copyright 2021 Google LLC
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
function setIndexConfiguration(firestore, jsonOrConfiguration) {
    firestore = commonE122c13e_node.cast(firestore, commonE122c13e_node.Firestore);
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    if (!client._uninitializedComponentsProvider ||
        client._uninitializedComponentsProvider._offline.kind === 'memory') {
        // PORTING NOTE: We don't return an error if the user has not enabled
        // persistence since `enableIndexeddbPersistence()` can fail on the Web.
        commonE122c13e_node.logWarn('Cannot enable indexes when persistence is disabled');
        return Promise.resolve();
    }
    const parsedIndexes = parseIndexes(jsonOrConfiguration);
    return commonE122c13e_node.firestoreClientSetIndexConfiguration(client, parsedIndexes);
}
function parseIndexes(jsonOrConfiguration) {
    const indexConfiguration = typeof jsonOrConfiguration === 'string'
        ? tryParseJson(jsonOrConfiguration)
        : jsonOrConfiguration;
    const parsedIndexes = [];
    if (Array.isArray(indexConfiguration.indexes)) {
        for (const index of indexConfiguration.indexes) {
            const collectionGroup = tryGetString(index, 'collectionGroup');
            const segments = [];
            if (Array.isArray(index.fields)) {
                for (const field of index.fields) {
                    const fieldPathString = tryGetString(field, 'fieldPath');
                    const fieldPath = commonE122c13e_node.fieldPathFromDotSeparatedString('setIndexConfiguration', fieldPathString);
                    if (field.arrayConfig === 'CONTAINS') {
                        segments.push(new commonE122c13e_node.IndexSegment(fieldPath, 2 /* IndexKind.CONTAINS */));
                    }
                    else if (field.order === 'ASCENDING') {
                        segments.push(new commonE122c13e_node.IndexSegment(fieldPath, 0 /* IndexKind.ASCENDING */));
                    }
                    else if (field.order === 'DESCENDING') {
                        segments.push(new commonE122c13e_node.IndexSegment(fieldPath, 1 /* IndexKind.DESCENDING */));
                    }
                }
            }
            parsedIndexes.push(new commonE122c13e_node.FieldIndex(commonE122c13e_node.FieldIndex.UNKNOWN_ID, collectionGroup, segments, commonE122c13e_node.IndexState.empty()));
        }
    }
    return parsedIndexes;
}
function tryParseJson(json) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Failed to parse JSON: ' + e?.message);
    }
}
function tryGetString(data, property) {
    if (typeof data[property] !== 'string') {
        throw new commonE122c13e_node.FirestoreError(commonE122c13e_node.Code.INVALID_ARGUMENT, 'Missing string value for: ' + property);
    }
    return data[property];
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
 * A `PersistentCacheIndexManager` for configuring persistent cache indexes used
 * for local query execution.
 *
 * To use, call `getPersistentCacheIndexManager()` to get an instance.
 */
class PersistentCacheIndexManager {
    /** @hideconstructor */
    constructor(_firestore) {
        this._firestore = _firestore;
        /** A type string to uniquely identify instances of this class. */
        this.type = 'PersistentCacheIndexManager';
    }
}
/**
 * Returns the PersistentCache Index Manager used by the given `Firestore`
 * object.
 *
 * @returns The `PersistentCacheIndexManager` instance, or `null` if local
 * persistent storage is not in use.
 */
function getPersistentCacheIndexManager(firestore) {
    firestore = commonE122c13e_node.cast(firestore, commonE122c13e_node.Firestore);
    const cachedInstance = persistentCacheIndexManagerByFirestore.get(firestore);
    if (cachedInstance) {
        return cachedInstance;
    }
    const client = commonE122c13e_node.ensureFirestoreConfigured(firestore);
    if (client._uninitializedComponentsProvider?._offline.kind !== 'persistent') {
        return null;
    }
    const instance = new PersistentCacheIndexManager(firestore);
    persistentCacheIndexManagerByFirestore.set(firestore, instance);
    return instance;
}
/**
 * Enables the SDK to create persistent cache indexes automatically for local
 * query execution when the SDK believes cache indexes can help improve
 * performance.
 *
 * This feature is disabled by default.
 */
function enablePersistentCacheIndexAutoCreation(indexManager) {
    setPersistentCacheIndexAutoCreationEnabled(indexManager, true);
}
/**
 * Stops creating persistent cache indexes automatically for local query
 * execution. The indexes which have been created by calling
 * `enablePersistentCacheIndexAutoCreation()` still take effect.
 */
function disablePersistentCacheIndexAutoCreation(indexManager) {
    setPersistentCacheIndexAutoCreationEnabled(indexManager, false);
}
/**
 * Removes all persistent cache indexes.
 *
 * Please note this function will also deletes indexes generated by
 * `setIndexConfiguration()`, which is deprecated.
 */
function deleteAllPersistentCacheIndexes(indexManager) {
    const client = commonE122c13e_node.ensureFirestoreConfigured(indexManager._firestore);
    const promise = commonE122c13e_node.firestoreClientDeleteAllFieldIndexes(client);
    promise
        .then(_ => commonE122c13e_node.logDebug('deleting all persistent cache indexes succeeded'))
        .catch(error => commonE122c13e_node.logWarn('deleting all persistent cache indexes failed', error));
}
function setPersistentCacheIndexAutoCreationEnabled(indexManager, isEnabled) {
    const client = commonE122c13e_node.ensureFirestoreConfigured(indexManager._firestore);
    const promise = commonE122c13e_node.firestoreClientSetPersistentCacheIndexAutoCreationEnabled(client, isEnabled);
    promise
        .then(_ => commonE122c13e_node.logDebug(`setting persistent cache index auto creation ` +
        `isEnabled=${isEnabled} succeeded`))
        .catch(error => commonE122c13e_node.logWarn(`setting persistent cache index auto creation ` +
        `isEnabled=${isEnabled} failed`, error));
}
/**
 * Maps `Firestore` instances to their corresponding
 * `PersistentCacheIndexManager` instances.
 *
 * Use a `WeakMap` so that the mapping will be automatically dropped when the
 * `Firestore` instance is garbage collected. This emulates a private member
 * as described in https://goo.gle/454yvug.
 */
const persistentCacheIndexManagerByFirestore = new WeakMap();

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
 * Testing hooks for use by Firestore's integration test suite to reach into the
 * SDK internals to validate logic and behavior that is not visible from the
 * public API surface.
 *
 * @internal
 */
class TestingHooks {
    constructor() {
        throw new Error('instances of this class should not be created');
    }
    /**
     * Registers a callback to be notified when an existence filter mismatch
     * occurs in the Watch listen stream.
     *
     * The relative order in which callbacks are notified is unspecified; do not
     * rely on any particular ordering. If a given callback is registered multiple
     * times then it will be notified multiple times, once per registration.
     *
     * @param callback - the callback to invoke upon existence filter mismatch.
     *
     * @returns a function that, when called, unregisters the given callback; only
     * the first invocation of the returned function does anything; all subsequent
     * invocations do nothing.
     */
    static onExistenceFilterMismatch(callback) {
        return TestingHooksSpiImpl.instance.onExistenceFilterMismatch(callback);
    }
}
/**
 * The implementation of `TestingHooksSpi`.
 */
class TestingHooksSpiImpl {
    constructor() {
        this.existenceFilterMismatchCallbacksById = new Map();
    }
    static get instance() {
        if (!testingHooksSpiImplInstance) {
            testingHooksSpiImplInstance = new TestingHooksSpiImpl();
            commonE122c13e_node.setTestingHooksSpi(testingHooksSpiImplInstance);
        }
        return testingHooksSpiImplInstance;
    }
    notifyOnExistenceFilterMismatch(info) {
        this.existenceFilterMismatchCallbacksById.forEach(callback => callback(info));
    }
    onExistenceFilterMismatch(callback) {
        const id = Symbol();
        const callbacks = this.existenceFilterMismatchCallbacksById;
        callbacks.set(id, callback);
        return () => callbacks.delete(id);
    }
}
let testingHooksSpiImplInstance = null;

/**
 * @license
 * Copyright 2021 Google LLC
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
registerFirestore('node');

exports.AbstractUserDataWriter = commonE122c13e_node.AbstractUserDataWriter;
exports.Bytes = commonE122c13e_node.Bytes;
exports.CACHE_SIZE_UNLIMITED = commonE122c13e_node.CACHE_SIZE_UNLIMITED;
exports.CollectionReference = commonE122c13e_node.CollectionReference;
exports.DocumentReference = commonE122c13e_node.DocumentReference;
exports.FieldPath = commonE122c13e_node.FieldPath;
exports.FieldValue = commonE122c13e_node.FieldValue;
exports.Firestore = commonE122c13e_node.Firestore;
exports.FirestoreError = commonE122c13e_node.FirestoreError;
exports.GeoPoint = commonE122c13e_node.GeoPoint;
exports.LoadBundleTask = commonE122c13e_node.LoadBundleTask;
exports.Query = commonE122c13e_node.Query;
exports.Timestamp = commonE122c13e_node.Timestamp;
exports.VectorValue = commonE122c13e_node.VectorValue;
exports._AutoId = commonE122c13e_node.AutoId;
exports._ByteString = commonE122c13e_node.ByteString;
exports._DatabaseId = commonE122c13e_node.DatabaseId;
exports._DocumentKey = commonE122c13e_node.DocumentKey;
exports._EmptyAppCheckTokenProvider = commonE122c13e_node.EmptyAppCheckTokenProvider;
exports._EmptyAuthCredentialsProvider = commonE122c13e_node.EmptyAuthCredentialsProvider;
exports._FieldPath = commonE122c13e_node.FieldPath$1;
exports._cast = commonE122c13e_node.cast;
exports._debugAssert = commonE122c13e_node.debugAssert;
exports._internalAggregationQueryToProtoRunAggregationQueryRequest = commonE122c13e_node._internalAggregationQueryToProtoRunAggregationQueryRequest;
exports._internalQueryToProtoQueryTarget = commonE122c13e_node._internalQueryToProtoQueryTarget;
exports._isBase64Available = commonE122c13e_node.isBase64Available;
exports._logWarn = commonE122c13e_node.logWarn;
exports._validateIsNotUsedTogether = commonE122c13e_node.validateIsNotUsedTogether;
exports.arrayRemove = commonE122c13e_node.arrayRemove;
exports.arrayUnion = commonE122c13e_node.arrayUnion;
exports.clearIndexedDbPersistence = commonE122c13e_node.clearIndexedDbPersistence;
exports.collection = commonE122c13e_node.collection;
exports.collectionGroup = commonE122c13e_node.collectionGroup;
exports.connectFirestoreEmulator = commonE122c13e_node.connectFirestoreEmulator;
exports.deleteField = commonE122c13e_node.deleteField;
exports.disableNetwork = commonE122c13e_node.disableNetwork;
exports.doc = commonE122c13e_node.doc;
exports.documentId = commonE122c13e_node.documentId;
exports.enableIndexedDbPersistence = commonE122c13e_node.enableIndexedDbPersistence;
exports.enableMultiTabIndexedDbPersistence = commonE122c13e_node.enableMultiTabIndexedDbPersistence;
exports.enableNetwork = commonE122c13e_node.enableNetwork;
exports.ensureFirestoreConfigured = commonE122c13e_node.ensureFirestoreConfigured;
exports.getFirestore = commonE122c13e_node.getFirestore;
exports.increment = commonE122c13e_node.increment;
exports.initializeFirestore = commonE122c13e_node.initializeFirestore;
exports.loadBundle = commonE122c13e_node.loadBundle;
exports.namedQuery = commonE122c13e_node.namedQuery;
exports.queryEqual = commonE122c13e_node.queryEqual;
exports.refEqual = commonE122c13e_node.refEqual;
exports.serverTimestamp = commonE122c13e_node.serverTimestamp;
exports.setLogLevel = commonE122c13e_node.setLogLevel;
exports.terminate = commonE122c13e_node.terminate;
exports.vector = commonE122c13e_node.vector;
exports.waitForPendingWrites = commonE122c13e_node.waitForPendingWrites;
exports.AggregateField = AggregateField;
exports.AggregateQuerySnapshot = AggregateQuerySnapshot;
exports.DocumentSnapshot = DocumentSnapshot;
exports.PersistentCacheIndexManager = PersistentCacheIndexManager;
exports.QueryCompositeFilterConstraint = QueryCompositeFilterConstraint;
exports.QueryConstraint = QueryConstraint;
exports.QueryDocumentSnapshot = QueryDocumentSnapshot;
exports.QueryEndAtConstraint = QueryEndAtConstraint;
exports.QueryFieldFilterConstraint = QueryFieldFilterConstraint;
exports.QueryLimitConstraint = QueryLimitConstraint;
exports.QueryOrderByConstraint = QueryOrderByConstraint;
exports.QuerySnapshot = QuerySnapshot;
exports.QueryStartAtConstraint = QueryStartAtConstraint;
exports.SnapshotMetadata = SnapshotMetadata;
exports.Transaction = Transaction;
exports.WriteBatch = WriteBatch;
exports._TestingHooks = TestingHooks;
exports.addDoc = addDoc;
exports.aggregateFieldEqual = aggregateFieldEqual;
exports.aggregateQuerySnapshotEqual = aggregateQuerySnapshotEqual;
exports.and = and;
exports.average = average;
exports.count = count;
exports.deleteAllPersistentCacheIndexes = deleteAllPersistentCacheIndexes;
exports.deleteDoc = deleteDoc;
exports.disablePersistentCacheIndexAutoCreation = disablePersistentCacheIndexAutoCreation;
exports.documentSnapshotFromJSON = documentSnapshotFromJSON;
exports.enablePersistentCacheIndexAutoCreation = enablePersistentCacheIndexAutoCreation;
exports.endAt = endAt;
exports.endBefore = endBefore;
exports.executeWrite = executeWrite;
exports.getAggregateFromServer = getAggregateFromServer;
exports.getCountFromServer = getCountFromServer;
exports.getDoc = getDoc;
exports.getDocFromCache = getDocFromCache;
exports.getDocFromServer = getDocFromServer;
exports.getDocs = getDocs;
exports.getDocsFromCache = getDocsFromCache;
exports.getDocsFromServer = getDocsFromServer;
exports.getPersistentCacheIndexManager = getPersistentCacheIndexManager;
exports.limit = limit;
exports.limitToLast = limitToLast;
exports.memoryEagerGarbageCollector = memoryEagerGarbageCollector;
exports.memoryLocalCache = memoryLocalCache;
exports.memoryLruGarbageCollector = memoryLruGarbageCollector;
exports.onSnapshot = onSnapshot;
exports.onSnapshotResume = onSnapshotResume;
exports.onSnapshotsInSync = onSnapshotsInSync;
exports.or = or;
exports.orderBy = orderBy;
exports.persistentLocalCache = persistentLocalCache;
exports.persistentMultipleTabManager = persistentMultipleTabManager;
exports.persistentSingleTabManager = persistentSingleTabManager;
exports.query = query;
exports.querySnapshotFromJSON = querySnapshotFromJSON;
exports.runTransaction = runTransaction;
exports.setDoc = setDoc;
exports.setIndexConfiguration = setIndexConfiguration;
exports.snapshotEqual = snapshotEqual;
exports.startAfter = startAfter;
exports.startAt = startAt;
exports.sum = sum;
exports.updateDoc = updateDoc;
exports.where = where;
exports.writeBatch = writeBatch;
//# sourceMappingURL=index.node.cjs.js.map
