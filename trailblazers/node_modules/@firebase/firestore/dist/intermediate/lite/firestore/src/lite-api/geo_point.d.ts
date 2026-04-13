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
import { Property } from '../util/json_validation';
/**
 * An immutable object representing a geographic location in Firestore. The
 * location is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90].
 * Longitude values are in the range of [-180, 180].
 */
export declare class GeoPoint {
    private _lat;
    private _long;
    /**
     * Creates a new immutable `GeoPoint` object with the provided latitude and
     * longitude values.
     * @param latitude - The latitude as number between -90 and 90.
     * @param longitude - The longitude as number between -180 and 180.
     */
    constructor(latitude: number, longitude: number);
    /**
     * The latitude of this `GeoPoint` instance.
     */
    get latitude(): number;
    /**
     * The longitude of this `GeoPoint` instance.
     */
    get longitude(): number;
    /**
     * Returns true if this `GeoPoint` is equal to the provided one.
     *
     * @param other - The `GeoPoint` to compare against.
     * @returns true if this `GeoPoint` is equal to the provided one.
     */
    isEqual(other: GeoPoint): boolean;
    /**
     * Actually private to JS consumers of our API, so this function is prefixed
     * with an underscore.
     */
    _compareTo(other: GeoPoint): number;
    static _jsonSchemaVersion: string;
    static _jsonSchema: {
        type: Property<"string">;
        latitude: Property<"number">;
        longitude: Property<"number">;
    };
    /**
     * Returns a JSON-serializable representation of this `GeoPoint` instance.
     *
     * @returns a JSON representation of this object.
     */
    toJSON(): {
        latitude: number;
        longitude: number;
        type: string;
    };
    /**
     * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
     *
     * @param json - a JSON object represention of a `GeoPoint` instance
     * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
     * {@link FirestoreError} if an error occurs.
     */
    static fromJSON(json: object): GeoPoint;
}
