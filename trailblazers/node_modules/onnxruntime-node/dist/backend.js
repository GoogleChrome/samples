"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _OnnxruntimeSessionHandler_inferenceSession;
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSupportedBackends = exports.onnxruntimeBackend = void 0;
const binding_1 = require("./binding");
const dataTypeStrings = [
    undefined,
    'float32',
    'uint8',
    'int8',
    'uint16',
    'int16',
    'int32',
    'int64',
    'string',
    'bool',
    'float16',
    'float64',
    'uint32',
    'uint64',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    'uint4',
    'int4',
];
class OnnxruntimeSessionHandler {
    constructor(pathOrBuffer, options) {
        _OnnxruntimeSessionHandler_inferenceSession.set(this, void 0);
        (0, binding_1.initOrt)();
        __classPrivateFieldSet(this, _OnnxruntimeSessionHandler_inferenceSession, new binding_1.binding.InferenceSession(), "f");
        if (typeof pathOrBuffer === 'string') {
            __classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").loadModel(pathOrBuffer, options);
        }
        else {
            __classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").loadModel(pathOrBuffer.buffer, pathOrBuffer.byteOffset, pathOrBuffer.byteLength, options);
        }
        // prepare input/output names and metadata
        this.inputNames = [];
        this.outputNames = [];
        this.inputMetadata = [];
        this.outputMetadata = [];
        // this function takes raw metadata from binding and returns a tuple of the following 2 items:
        // - an array of string representing names
        // - an array of converted InferenceSession.ValueMetadata
        const fillNamesAndMetadata = (rawMetadata) => {
            const names = [];
            const metadata = [];
            for (const m of rawMetadata) {
                names.push(m.name);
                if (!m.isTensor) {
                    metadata.push({ name: m.name, isTensor: false });
                }
                else {
                    const type = dataTypeStrings[m.type];
                    if (type === undefined) {
                        throw new Error(`Unsupported data type: ${m.type}`);
                    }
                    const shape = [];
                    for (let i = 0; i < m.shape.length; ++i) {
                        const dim = m.shape[i];
                        if (dim === -1) {
                            shape.push(m.symbolicDimensions[i]);
                        }
                        else if (dim >= 0) {
                            shape.push(dim);
                        }
                        else {
                            throw new Error(`Invalid dimension: ${dim}`);
                        }
                    }
                    metadata.push({
                        name: m.name,
                        isTensor: m.isTensor,
                        type,
                        shape,
                    });
                }
            }
            return [names, metadata];
        };
        [this.inputNames, this.inputMetadata] = fillNamesAndMetadata(__classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").inputMetadata);
        [this.outputNames, this.outputMetadata] = fillNamesAndMetadata(__classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").outputMetadata);
    }
    async dispose() {
        __classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").dispose();
    }
    startProfiling() {
        // startProfiling is a no-op.
        //
        // if sessionOptions.enableProfiling is true, profiling will be enabled when the model is loaded.
    }
    endProfiling() {
        __classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").endProfiling();
    }
    async run(feeds, fetches, options) {
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                try {
                    resolve(__classPrivateFieldGet(this, _OnnxruntimeSessionHandler_inferenceSession, "f").run(feeds, fetches, options));
                }
                catch (e) {
                    // reject if any error is thrown
                    reject(e);
                }
            });
        });
    }
}
_OnnxruntimeSessionHandler_inferenceSession = new WeakMap();
class OnnxruntimeBackend {
    async init() {
        return Promise.resolve();
    }
    async createInferenceSessionHandler(pathOrBuffer, options) {
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                try {
                    resolve(new OnnxruntimeSessionHandler(pathOrBuffer, options || {}));
                }
                catch (e) {
                    // reject if any error is thrown
                    reject(e);
                }
            });
        });
    }
}
exports.onnxruntimeBackend = new OnnxruntimeBackend();
exports.listSupportedBackends = binding_1.binding.listSupportedBackends;
//# sourceMappingURL=backend.js.map