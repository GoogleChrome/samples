/**
 * Resolves a dtype configuration value to a concrete dtype string.
 * Handles string, per-file object, and "auto" forms with device-based fallback.
 * @param {DataType|Record<string, DataType>|null|undefined} dtype The dtype config value.
 * @param {string} fileName The model file name to look up if dtype is an object.
 * @param {string} selectedDevice The resolved device string for fallback.
 * @param {Object} [options]
 * @param {DataType|Record<string, DataType>|null} [options.configDtype=null] Config dtype used as fallback when dtype is "auto" (supports device_config overlay in session.js).
 * @param {(message: string) => void} [options.warn] Optional callback invoked when dtype is a per-file object but fileName is not found.
 * @returns {DataType} The resolved dtype string.
 */
export function selectDtype(dtype: DataType | Record<string, DataType> | null | undefined, fileName: string, selectedDevice: string, { configDtype, warn }?: {
    configDtype?: DataType | Record<string, DataType> | null;
    warn?: (message: string) => void;
}): DataType;
export function isWebGpuFp16Supported(): Promise<boolean>;
export const DATA_TYPES: Readonly<{
    auto: "auto";
    fp32: "fp32";
    fp16: "fp16";
    q8: "q8";
    int8: "int8";
    uint8: "uint8";
    q4: "q4";
    bnb4: "bnb4";
    q4f16: "q4f16";
}>;
/** @typedef {keyof typeof DATA_TYPES} DataType */
export const DEFAULT_DEVICE_DTYPE: "fp32";
export const DEFAULT_DEVICE_DTYPE_MAPPING: Readonly<{
    wasm: "q8";
}>;
/** @type {Record<Exclude<DataType, "auto">, string>} */
export const DEFAULT_DTYPE_SUFFIX_MAPPING: Record<Exclude<DataType, "auto">, string>;
export const DataTypeMap: Readonly<{
    float32: Float32ArrayConstructor;
    float16: Uint16ArrayConstructor | Float16ArrayConstructor;
    float64: Float64ArrayConstructor;
    string: ArrayConstructor;
    int8: Int8ArrayConstructor;
    uint8: Uint8ArrayConstructor;
    int16: Int16ArrayConstructor;
    uint16: Uint16ArrayConstructor;
    int32: Int32ArrayConstructor;
    uint32: Uint32ArrayConstructor;
    int64: BigInt64ArrayConstructor;
    uint64: BigUint64ArrayConstructor;
    bool: Uint8ArrayConstructor;
    uint4: Uint8ArrayConstructor;
    int4: Int8ArrayConstructor;
}>;
export type DataType = keyof typeof DATA_TYPES;
//# sourceMappingURL=dtypes.d.ts.map