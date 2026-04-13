/**
 * @typedef {keyof typeof DEVICE_TYPES} DeviceType
 */
/**
 * Resolves a device configuration value to a concrete device string.
 * Handles string, per-file object, or undefined config, with a default fallback.
 * @param {string|Record<string, string>|null|undefined} deviceConfig The device config value.
 * @param {string} fileName The model file name to look up if deviceConfig is an object.
 * @param {Object} [options]
 * @param {(message: string) => void} [options.warn] Optional callback invoked when deviceConfig is a per-file object but fileName is not found.
 * @returns {string} The resolved device string.
 */
export function selectDevice(deviceConfig: string | Record<string, string> | null | undefined, fileName: string, { warn }?: {
    warn?: (message: string) => void;
}): string;
/**
 * The list of devices supported by Transformers.js
 */
export const DEVICE_TYPES: Readonly<{
    auto: "auto";
    gpu: "gpu";
    cpu: "cpu";
    wasm: "wasm";
    webgpu: "webgpu";
    cuda: "cuda";
    dml: "dml";
    coreml: "coreml";
    webnn: "webnn";
    'webnn-npu': "webnn-npu";
    'webnn-gpu': "webnn-gpu";
    'webnn-cpu': "webnn-cpu";
}>;
export type DeviceType = keyof typeof DEVICE_TYPES;
//# sourceMappingURL=devices.d.ts.map