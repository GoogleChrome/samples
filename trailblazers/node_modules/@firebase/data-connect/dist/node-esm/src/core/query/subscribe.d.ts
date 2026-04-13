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
import { QueryRef, QueryResult } from '../../api/query';
import { SerializedRef } from '../../api/Reference';
import { DataConnectError } from '../error';
/**
 * `OnCompleteSubscription`
 */
export type OnCompleteSubscription = () => void;
/**
 * Representation of full observer options in `subscribe`
 */
export interface SubscriptionOptions<Data, Variables> {
    onNext?: OnResultSubscription<Data, Variables>;
    onErr?: OnErrorSubscription;
    onComplete?: OnCompleteSubscription;
}
/**
 * Signature for `OnResultSubscription` for `subscribe`
 */
export type OnResultSubscription<Data, Variables> = (res: QueryResult<Data, Variables>) => void;
/**
 * Signature for `OnErrorSubscription` for `subscribe`
 */
export type OnErrorSubscription = (err?: DataConnectError) => void;
/**
 * Signature for unsubscribe from `subscribe`
 */
export type QueryUnsubscribe = () => void;
/**
 * Representation of user provided subscription options.
 */
export interface DataConnectSubscription<Data, Variables> {
    userCallback: OnResultSubscription<Data, Variables>;
    errCallback?: (e?: DataConnectError) => void;
    unsubscribe: () => void;
}
/**
 * Subscribe to a `QueryRef`
 * @param queryRefOrSerializedResult query ref or serialized result.
 * @param observer observer object to use for subscribing.
 * @returns `SubscriptionOptions`
 */
export declare function subscribe<Data, Variables>(queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables>, observer: SubscriptionOptions<Data, Variables>): QueryUnsubscribe;
/**
 * Subscribe to a `QueryRef`
 * @param queryRefOrSerializedResult query ref or serialized result.
 * @param onNext Callback to call when result comes back.
 * @param onError Callback to call when error gets thrown.
 * @param onComplete Called when subscription completes.
 * @returns `SubscriptionOptions`
 */
export declare function subscribe<Data, Variables>(queryRefOrSerializedResult: QueryRef<Data, Variables> | SerializedRef<Data, Variables>, onNext: OnResultSubscription<Data, Variables>, onError?: OnErrorSubscription, onComplete?: OnCompleteSubscription): QueryUnsubscribe;
