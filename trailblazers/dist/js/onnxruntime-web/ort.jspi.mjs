/*!
 * ONNX Runtime Web v1.25.0-dev.20260327-722743c0e2
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// common/dist/esm/backend-impl.js
var backends, backendsSortedByPriority, registerBackend, tryResolveAndInitializeBackend, resolveBackendAndExecutionProviders;
var init_backend_impl = __esm({
  "common/dist/esm/backend-impl.js"() {
    "use strict";
    backends = /* @__PURE__ */ new Map();
    backendsSortedByPriority = [];
    registerBackend = (name, backend, priority) => {
      if (backend && typeof backend.init === "function" && typeof backend.createInferenceSessionHandler === "function") {
        const currentBackend = backends.get(name);
        if (currentBackend === void 0) {
          backends.set(name, { backend, priority });
        } else if (currentBackend.priority > priority) {
          return;
        } else if (currentBackend.priority === priority) {
          if (currentBackend.backend !== backend) {
            throw new Error(`cannot register backend "${name}" using priority ${priority}`);
          }
        }
        if (priority >= 0) {
          const i = backendsSortedByPriority.indexOf(name);
          if (i !== -1) {
            backendsSortedByPriority.splice(i, 1);
          }
          for (let i2 = 0; i2 < backendsSortedByPriority.length; i2++) {
            if (backends.get(backendsSortedByPriority[i2]).priority <= priority) {
              backendsSortedByPriority.splice(i2, 0, name);
              return;
            }
          }
          backendsSortedByPriority.push(name);
        }
        return;
      }
      throw new TypeError("not a valid backend");
    };
    tryResolveAndInitializeBackend = async (backendName) => {
      const backendInfo = backends.get(backendName);
      if (!backendInfo) {
        return "backend not found.";
      }
      if (backendInfo.initialized) {
        return backendInfo.backend;
      } else if (backendInfo.aborted) {
        return backendInfo.error;
      } else {
        const isInitializing = !!backendInfo.initPromise;
        try {
          if (!isInitializing) {
            backendInfo.initPromise = backendInfo.backend.init(backendName);
          }
          await backendInfo.initPromise;
          backendInfo.initialized = true;
          return backendInfo.backend;
        } catch (e) {
          if (!isInitializing) {
            backendInfo.error = `${e}`;
            backendInfo.aborted = true;
          }
          return backendInfo.error;
        } finally {
          delete backendInfo.initPromise;
        }
      }
    };
    resolveBackendAndExecutionProviders = async (options) => {
      const eps = options.executionProviders || [];
      const backendHints = eps.map((i) => typeof i === "string" ? i : i.name);
      const backendNames = backendHints.length === 0 ? backendsSortedByPriority : backendHints;
      let backend;
      const errors = [];
      const availableBackendNames = /* @__PURE__ */ new Set();
      for (const backendName of backendNames) {
        const resolveResult = await tryResolveAndInitializeBackend(backendName);
        if (typeof resolveResult === "string") {
          errors.push({ name: backendName, err: resolveResult });
        } else {
          if (!backend) {
            backend = resolveResult;
          }
          if (backend === resolveResult) {
            availableBackendNames.add(backendName);
          }
        }
      }
      if (!backend) {
        throw new Error(`no available backend found. ERR: ${errors.map((e) => `[${e.name}] ${e.err}`).join(", ")}`);
      }
      for (const { name, err } of errors) {
        if (backendHints.includes(name)) {
          console.warn(`removing requested execution provider "${name}" from session options because it is not available: ${err}`);
        }
      }
      const filteredEps = eps.filter((i) => availableBackendNames.has(typeof i === "string" ? i : i.name));
      return [
        backend,
        new Proxy(options, {
          get: (target, prop) => {
            if (prop === "executionProviders") {
              return filteredEps;
            }
            return Reflect.get(target, prop);
          }
        })
      ];
    };
  }
});

// common/dist/esm/backend.js
var init_backend = __esm({
  "common/dist/esm/backend.js"() {
    "use strict";
    init_backend_impl();
  }
});

// common/dist/esm/version.js
var version;
var init_version = __esm({
  "common/dist/esm/version.js"() {
    "use strict";
    version = "1.24.0-dev.20251116-b39e144322";
  }
});

// common/dist/esm/env-impl.js
var logLevelValue, env;
var init_env_impl = __esm({
  "common/dist/esm/env-impl.js"() {
    "use strict";
    init_version();
    logLevelValue = "warning";
    env = {
      wasm: {},
      webgl: {},
      webgpu: {},
      versions: { common: version },
      set logLevel(value) {
        if (value === void 0) {
          return;
        }
        if (typeof value !== "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(value) === -1) {
          throw new Error(`Unsupported logging level: ${value}`);
        }
        logLevelValue = value;
      },
      get logLevel() {
        return logLevelValue;
      }
    };
    Object.defineProperty(env, "logLevel", { enumerable: true });
  }
});

// common/dist/esm/env.js
var env2;
var init_env = __esm({
  "common/dist/esm/env.js"() {
    "use strict";
    init_env_impl();
    env2 = env;
  }
});

// common/dist/esm/tensor-conversion-impl.js
var tensorToDataURL, tensorToImageData;
var init_tensor_conversion_impl = __esm({
  "common/dist/esm/tensor-conversion-impl.js"() {
    "use strict";
    tensorToDataURL = (tensor, options) => {
      const canvas = typeof document !== "undefined" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
      canvas.width = tensor.dims[3];
      canvas.height = tensor.dims[2];
      const pixels2DContext = canvas.getContext("2d");
      if (pixels2DContext != null) {
        let width;
        let height;
        if (options?.tensorLayout !== void 0 && options.tensorLayout === "NHWC") {
          width = tensor.dims[2];
          height = tensor.dims[3];
        } else {
          width = tensor.dims[3];
          height = tensor.dims[2];
        }
        const inputformat = options?.format !== void 0 ? options.format : "RGB";
        const norm = options?.norm;
        let normMean;
        let normBias;
        if (norm === void 0 || norm.mean === void 0) {
          normMean = [255, 255, 255, 255];
        } else {
          if (typeof norm.mean === "number") {
            normMean = [norm.mean, norm.mean, norm.mean, norm.mean];
          } else {
            normMean = [norm.mean[0], norm.mean[1], norm.mean[2], 0];
            if (norm.mean[3] !== void 0) {
              normMean[3] = norm.mean[3];
            }
          }
        }
        if (norm === void 0 || norm.bias === void 0) {
          normBias = [0, 0, 0, 0];
        } else {
          if (typeof norm.bias === "number") {
            normBias = [norm.bias, norm.bias, norm.bias, norm.bias];
          } else {
            normBias = [norm.bias[0], norm.bias[1], norm.bias[2], 0];
            if (norm.bias[3] !== void 0) {
              normBias[3] = norm.bias[3];
            }
          }
        }
        const stride = height * width;
        let rTensorPointer = 0, gTensorPointer = stride, bTensorPointer = stride * 2, aTensorPointer = -1;
        if (inputformat === "RGBA") {
          rTensorPointer = 0;
          gTensorPointer = stride;
          bTensorPointer = stride * 2;
          aTensorPointer = stride * 3;
        } else if (inputformat === "RGB") {
          rTensorPointer = 0;
          gTensorPointer = stride;
          bTensorPointer = stride * 2;
        } else if (inputformat === "RBG") {
          rTensorPointer = 0;
          bTensorPointer = stride;
          gTensorPointer = stride * 2;
        }
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const R = (tensor.data[rTensorPointer++] - normBias[0]) * normMean[0];
            const G = (tensor.data[gTensorPointer++] - normBias[1]) * normMean[1];
            const B = (tensor.data[bTensorPointer++] - normBias[2]) * normMean[2];
            const A = aTensorPointer === -1 ? 255 : (tensor.data[aTensorPointer++] - normBias[3]) * normMean[3];
            pixels2DContext.fillStyle = "rgba(" + R + "," + G + "," + B + "," + A + ")";
            pixels2DContext.fillRect(j, i, 1, 1);
          }
        }
        if ("toDataURL" in canvas) {
          return canvas.toDataURL();
        } else {
          throw new Error("toDataURL is not supported");
        }
      } else {
        throw new Error("Can not access image data");
      }
    };
    tensorToImageData = (tensor, options) => {
      const pixels2DContext = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d");
      let image;
      if (pixels2DContext != null) {
        let width;
        let height;
        let channels;
        if (options?.tensorLayout !== void 0 && options.tensorLayout === "NHWC") {
          width = tensor.dims[2];
          height = tensor.dims[1];
          channels = tensor.dims[3];
        } else {
          width = tensor.dims[3];
          height = tensor.dims[2];
          channels = tensor.dims[1];
        }
        const inputformat = options !== void 0 ? options.format !== void 0 ? options.format : "RGB" : "RGB";
        const norm = options?.norm;
        let normMean;
        let normBias;
        if (norm === void 0 || norm.mean === void 0) {
          normMean = [255, 255, 255, 255];
        } else {
          if (typeof norm.mean === "number") {
            normMean = [norm.mean, norm.mean, norm.mean, norm.mean];
          } else {
            normMean = [norm.mean[0], norm.mean[1], norm.mean[2], 255];
            if (norm.mean[3] !== void 0) {
              normMean[3] = norm.mean[3];
            }
          }
        }
        if (norm === void 0 || norm.bias === void 0) {
          normBias = [0, 0, 0, 0];
        } else {
          if (typeof norm.bias === "number") {
            normBias = [norm.bias, norm.bias, norm.bias, norm.bias];
          } else {
            normBias = [norm.bias[0], norm.bias[1], norm.bias[2], 0];
            if (norm.bias[3] !== void 0) {
              normBias[3] = norm.bias[3];
            }
          }
        }
        const stride = height * width;
        if (options !== void 0) {
          if (options.format !== void 0 && channels === 4 && options.format !== "RGBA" || channels === 3 && options.format !== "RGB" && options.format !== "BGR") {
            throw new Error("Tensor format doesn't match input tensor dims");
          }
        }
        const step = 4;
        let rImagePointer = 0, gImagePointer = 1, bImagePointer = 2, aImagePointer = 3;
        let rTensorPointer = 0, gTensorPointer = stride, bTensorPointer = stride * 2, aTensorPointer = -1;
        if (inputformat === "RGBA") {
          rTensorPointer = 0;
          gTensorPointer = stride;
          bTensorPointer = stride * 2;
          aTensorPointer = stride * 3;
        } else if (inputformat === "RGB") {
          rTensorPointer = 0;
          gTensorPointer = stride;
          bTensorPointer = stride * 2;
        } else if (inputformat === "RBG") {
          rTensorPointer = 0;
          bTensorPointer = stride;
          gTensorPointer = stride * 2;
        }
        image = pixels2DContext.createImageData(width, height);
        for (let i = 0; i < height * width; rImagePointer += step, gImagePointer += step, bImagePointer += step, aImagePointer += step, i++) {
          image.data[rImagePointer] = (tensor.data[rTensorPointer++] - normBias[0]) * normMean[0];
          image.data[gImagePointer] = (tensor.data[gTensorPointer++] - normBias[1]) * normMean[1];
          image.data[bImagePointer] = (tensor.data[bTensorPointer++] - normBias[2]) * normMean[2];
          image.data[aImagePointer] = aTensorPointer === -1 ? 255 : (tensor.data[aTensorPointer++] - normBias[3]) * normMean[3];
        }
      } else {
        throw new Error("Can not access image data");
      }
      return image;
    };
  }
});

// common/dist/esm/tensor-factory-impl.js
var bufferToTensor, tensorFromImage, tensorFromTexture, tensorFromGpuBuffer, tensorFromMLTensor, tensorFromPinnedBuffer;
var init_tensor_factory_impl = __esm({
  "common/dist/esm/tensor-factory-impl.js"() {
    "use strict";
    init_tensor_impl();
    bufferToTensor = (buffer, options) => {
      if (buffer === void 0) {
        throw new Error("Image buffer must be defined");
      }
      if (options.height === void 0 || options.width === void 0) {
        throw new Error("Image height and width must be defined");
      }
      if (options.tensorLayout === "NHWC") {
        throw new Error("NHWC Tensor layout is not supported yet");
      }
      const { height, width } = options;
      const norm = options.norm ?? { mean: 255, bias: 0 };
      let normMean;
      let normBias;
      if (typeof norm.mean === "number") {
        normMean = [norm.mean, norm.mean, norm.mean, norm.mean];
      } else {
        normMean = [norm.mean[0], norm.mean[1], norm.mean[2], norm.mean[3] ?? 255];
      }
      if (typeof norm.bias === "number") {
        normBias = [norm.bias, norm.bias, norm.bias, norm.bias];
      } else {
        normBias = [norm.bias[0], norm.bias[1], norm.bias[2], norm.bias[3] ?? 0];
      }
      const inputformat = options.format !== void 0 ? options.format : "RGBA";
      const outputformat = options.tensorFormat !== void 0 ? options.tensorFormat !== void 0 ? options.tensorFormat : "RGB" : "RGB";
      const stride = height * width;
      const float32Data = outputformat === "RGBA" ? new Float32Array(stride * 4) : new Float32Array(stride * 3);
      let step = 4, rImagePointer = 0, gImagePointer = 1, bImagePointer = 2, aImagePointer = 3;
      let rTensorPointer = 0, gTensorPointer = stride, bTensorPointer = stride * 2, aTensorPointer = -1;
      if (inputformat === "RGB") {
        step = 3;
        rImagePointer = 0;
        gImagePointer = 1;
        bImagePointer = 2;
        aImagePointer = -1;
      }
      if (outputformat === "RGBA") {
        aTensorPointer = stride * 3;
      } else if (outputformat === "RBG") {
        rTensorPointer = 0;
        bTensorPointer = stride;
        gTensorPointer = stride * 2;
      } else if (outputformat === "BGR") {
        bTensorPointer = 0;
        gTensorPointer = stride;
        rTensorPointer = stride * 2;
      }
      for (let i = 0; i < stride; i++, rImagePointer += step, bImagePointer += step, gImagePointer += step, aImagePointer += step) {
        float32Data[rTensorPointer++] = (buffer[rImagePointer] + normBias[0]) / normMean[0];
        float32Data[gTensorPointer++] = (buffer[gImagePointer] + normBias[1]) / normMean[1];
        float32Data[bTensorPointer++] = (buffer[bImagePointer] + normBias[2]) / normMean[2];
        if (aTensorPointer !== -1 && aImagePointer !== -1) {
          float32Data[aTensorPointer++] = (buffer[aImagePointer] + normBias[3]) / normMean[3];
        }
      }
      const outputTensor = outputformat === "RGBA" ? new Tensor("float32", float32Data, [1, 4, height, width]) : new Tensor("float32", float32Data, [1, 3, height, width]);
      return outputTensor;
    };
    tensorFromImage = async (image, options) => {
      const isHTMLImageEle = typeof HTMLImageElement !== "undefined" && image instanceof HTMLImageElement;
      const isImageDataEle = typeof ImageData !== "undefined" && image instanceof ImageData;
      const isImageBitmap = typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap;
      const isString = typeof image === "string";
      let data;
      let bufferToTensorOptions = options ?? {};
      const createCanvas = () => {
        if (typeof document !== "undefined") {
          return document.createElement("canvas");
        } else if (typeof OffscreenCanvas !== "undefined") {
          return new OffscreenCanvas(1, 1);
        } else {
          throw new Error("Canvas is not supported");
        }
      };
      const createCanvasContext = (canvas) => {
        if (typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement) {
          return canvas.getContext("2d");
        } else if (canvas instanceof OffscreenCanvas) {
          return canvas.getContext("2d");
        } else {
          return null;
        }
      };
      if (isHTMLImageEle) {
        const canvas = createCanvas();
        canvas.width = image.width;
        canvas.height = image.height;
        const pixels2DContext = createCanvasContext(canvas);
        if (pixels2DContext != null) {
          let height = image.height;
          let width = image.width;
          if (options !== void 0 && options.resizedHeight !== void 0 && options.resizedWidth !== void 0) {
            height = options.resizedHeight;
            width = options.resizedWidth;
          }
          if (options !== void 0) {
            bufferToTensorOptions = options;
            if (options.tensorFormat !== void 0) {
              throw new Error("Image input config format must be RGBA for HTMLImageElement");
            } else {
              bufferToTensorOptions.tensorFormat = "RGBA";
            }
            bufferToTensorOptions.height = height;
            bufferToTensorOptions.width = width;
          } else {
            bufferToTensorOptions.tensorFormat = "RGBA";
            bufferToTensorOptions.height = height;
            bufferToTensorOptions.width = width;
          }
          pixels2DContext.drawImage(image, 0, 0);
          data = pixels2DContext.getImageData(0, 0, width, height).data;
        } else {
          throw new Error("Can not access image data");
        }
      } else if (isImageDataEle) {
        let height;
        let width;
        if (options !== void 0 && options.resizedWidth !== void 0 && options.resizedHeight !== void 0) {
          height = options.resizedHeight;
          width = options.resizedWidth;
        } else {
          height = image.height;
          width = image.width;
        }
        if (options !== void 0) {
          bufferToTensorOptions = options;
        }
        bufferToTensorOptions.format = "RGBA";
        bufferToTensorOptions.height = height;
        bufferToTensorOptions.width = width;
        if (options !== void 0) {
          const tempCanvas = createCanvas();
          tempCanvas.width = width;
          tempCanvas.height = height;
          const pixels2DContext = createCanvasContext(tempCanvas);
          if (pixels2DContext != null) {
            pixels2DContext.putImageData(image, 0, 0);
            data = pixels2DContext.getImageData(0, 0, width, height).data;
          } else {
            throw new Error("Can not access image data");
          }
        } else {
          data = image.data;
        }
      } else if (isImageBitmap) {
        if (options === void 0) {
          throw new Error("Please provide image config with format for Imagebitmap");
        }
        const canvas = createCanvas();
        canvas.width = image.width;
        canvas.height = image.height;
        const pixels2DContext = createCanvasContext(canvas);
        if (pixels2DContext != null) {
          const height = image.height;
          const width = image.width;
          pixels2DContext.drawImage(image, 0, 0, width, height);
          data = pixels2DContext.getImageData(0, 0, width, height).data;
          bufferToTensorOptions.height = height;
          bufferToTensorOptions.width = width;
          return bufferToTensor(data, bufferToTensorOptions);
        } else {
          throw new Error("Can not access image data");
        }
      } else if (isString) {
        return new Promise((resolve, reject) => {
          const canvas = createCanvas();
          const context = createCanvasContext(canvas);
          if (!image || !context) {
            return reject();
          }
          const newImage = new Image();
          newImage.crossOrigin = "Anonymous";
          newImage.src = image;
          newImage.onload = () => {
            canvas.width = newImage.width;
            canvas.height = newImage.height;
            context.drawImage(newImage, 0, 0, canvas.width, canvas.height);
            const img = context.getImageData(0, 0, canvas.width, canvas.height);
            bufferToTensorOptions.height = canvas.height;
            bufferToTensorOptions.width = canvas.width;
            resolve(bufferToTensor(img.data, bufferToTensorOptions));
          };
        });
      } else {
        throw new Error("Input data provided is not supported - aborted tensor creation");
      }
      if (data !== void 0) {
        return bufferToTensor(data, bufferToTensorOptions);
      } else {
        throw new Error("Input data provided is not supported - aborted tensor creation");
      }
    };
    tensorFromTexture = (texture, options) => {
      const { width, height, download, dispose } = options;
      const dims = [1, height, width, 4];
      return new Tensor({ location: "texture", type: "float32", texture, dims, download, dispose });
    };
    tensorFromGpuBuffer = (gpuBuffer, options) => {
      const { dataType, dims, download, dispose } = options;
      return new Tensor({ location: "gpu-buffer", type: dataType ?? "float32", gpuBuffer, dims, download, dispose });
    };
    tensorFromMLTensor = (mlTensor, options) => {
      const { dataType, dims, download, dispose } = options;
      return new Tensor({ location: "ml-tensor", type: dataType ?? "float32", mlTensor, dims, download, dispose });
    };
    tensorFromPinnedBuffer = (type, buffer, dims) => new Tensor({ location: "cpu-pinned", type, data: buffer, dims: dims ?? [buffer.length] });
  }
});

// common/dist/esm/tensor-impl-type-mapping.js
var NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP, NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP, isTypedArrayChecked, checkTypedArray;
var init_tensor_impl_type_mapping = __esm({
  "common/dist/esm/tensor-impl-type-mapping.js"() {
    "use strict";
    NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP = /* @__PURE__ */ new Map([
      ["float32", Float32Array],
      ["uint8", Uint8Array],
      ["int8", Int8Array],
      ["uint16", Uint16Array],
      ["int16", Int16Array],
      ["int32", Int32Array],
      ["bool", Uint8Array],
      ["float64", Float64Array],
      ["uint32", Uint32Array],
      ["int4", Uint8Array],
      ["uint4", Uint8Array]
    ]);
    NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP = /* @__PURE__ */ new Map([
      [Float32Array, "float32"],
      [Uint8Array, "uint8"],
      [Int8Array, "int8"],
      [Uint16Array, "uint16"],
      [Int16Array, "int16"],
      [Int32Array, "int32"],
      [Float64Array, "float64"],
      [Uint32Array, "uint32"]
    ]);
    isTypedArrayChecked = false;
    checkTypedArray = () => {
      if (!isTypedArrayChecked) {
        isTypedArrayChecked = true;
        const isBigInt64ArrayAvailable = typeof BigInt64Array !== "undefined" && BigInt64Array.from;
        const isBigUint64ArrayAvailable = typeof BigUint64Array !== "undefined" && BigUint64Array.from;
        const Float16Array2 = globalThis.Float16Array;
        const isFloat16ArrayAvailable = typeof Float16Array2 !== "undefined" && Float16Array2.from;
        if (isBigInt64ArrayAvailable) {
          NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("int64", BigInt64Array);
          NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigInt64Array, "int64");
        }
        if (isBigUint64ArrayAvailable) {
          NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("uint64", BigUint64Array);
          NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(BigUint64Array, "uint64");
        }
        if (isFloat16ArrayAvailable) {
          NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("float16", Float16Array2);
          NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.set(Float16Array2, "float16");
        } else {
          NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.set("float16", Uint16Array);
        }
      }
    };
  }
});

// common/dist/esm/tensor-utils-impl.js
var calculateSize, tensorReshape;
var init_tensor_utils_impl = __esm({
  "common/dist/esm/tensor-utils-impl.js"() {
    "use strict";
    init_tensor_impl();
    calculateSize = (dims) => {
      let size = 1;
      for (let i = 0; i < dims.length; i++) {
        const dim = dims[i];
        if (typeof dim !== "number" || !Number.isSafeInteger(dim)) {
          throw new TypeError(`dims[${i}] must be an integer, got: ${dim}`);
        }
        if (dim < 0) {
          throw new RangeError(`dims[${i}] must be a non-negative integer, got: ${dim}`);
        }
        size *= dim;
      }
      return size;
    };
    tensorReshape = (tensor, dims) => {
      switch (tensor.location) {
        case "cpu":
          return new Tensor(tensor.type, tensor.data, dims);
        case "cpu-pinned":
          return new Tensor({
            location: "cpu-pinned",
            data: tensor.data,
            type: tensor.type,
            dims
          });
        case "texture":
          return new Tensor({
            location: "texture",
            texture: tensor.texture,
            type: tensor.type,
            dims
          });
        case "gpu-buffer":
          return new Tensor({
            location: "gpu-buffer",
            gpuBuffer: tensor.gpuBuffer,
            type: tensor.type,
            dims
          });
        case "ml-tensor":
          return new Tensor({
            location: "ml-tensor",
            mlTensor: tensor.mlTensor,
            type: tensor.type,
            dims
          });
        default:
          throw new Error(`tensorReshape: tensor location ${tensor.location} is not supported`);
      }
    };
  }
});

// common/dist/esm/tensor-impl.js
var Tensor;
var init_tensor_impl = __esm({
  "common/dist/esm/tensor-impl.js"() {
    "use strict";
    init_tensor_conversion_impl();
    init_tensor_factory_impl();
    init_tensor_impl_type_mapping();
    init_tensor_utils_impl();
    Tensor = class {
      /**
       * implementation.
       */
      constructor(arg0, arg1, arg2) {
        checkTypedArray();
        let type;
        let dims;
        if (typeof arg0 === "object" && "location" in arg0) {
          this.dataLocation = arg0.location;
          type = arg0.type;
          dims = arg0.dims;
          switch (arg0.location) {
            case "cpu-pinned": {
              const expectedTypedArrayConstructor = NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.get(type);
              if (!expectedTypedArrayConstructor) {
                throw new TypeError(`unsupported type "${type}" to create tensor from pinned buffer`);
              }
              if (!(arg0.data instanceof expectedTypedArrayConstructor)) {
                throw new TypeError(`buffer should be of type ${expectedTypedArrayConstructor.name}`);
              }
              this.cpuData = arg0.data;
              break;
            }
            case "texture": {
              if (type !== "float32") {
                throw new TypeError(`unsupported type "${type}" to create tensor from texture`);
              }
              this.gpuTextureData = arg0.texture;
              this.downloader = arg0.download;
              this.disposer = arg0.dispose;
              break;
            }
            case "gpu-buffer": {
              if (type !== "float32" && type !== "float16" && type !== "int32" && type !== "int64" && type !== "uint32" && type !== "uint8" && type !== "bool" && type !== "uint4" && type !== "int4") {
                throw new TypeError(`unsupported type "${type}" to create tensor from gpu buffer`);
              }
              this.gpuBufferData = arg0.gpuBuffer;
              this.downloader = arg0.download;
              this.disposer = arg0.dispose;
              break;
            }
            case "ml-tensor": {
              if (type !== "float32" && type !== "float16" && type !== "int32" && type !== "int64" && type !== "uint32" && type !== "uint64" && type !== "int8" && type !== "uint8" && type !== "bool" && type !== "uint4" && type !== "int4") {
                throw new TypeError(`unsupported type "${type}" to create tensor from MLTensor`);
              }
              this.mlTensorData = arg0.mlTensor;
              this.downloader = arg0.download;
              this.disposer = arg0.dispose;
              break;
            }
            default:
              throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
          }
        } else {
          let data;
          let maybeDims;
          if (typeof arg0 === "string") {
            type = arg0;
            maybeDims = arg2;
            if (arg0 === "string") {
              if (!Array.isArray(arg1)) {
                throw new TypeError("A string tensor's data must be a string array.");
              }
              data = arg1;
            } else {
              const typedArrayConstructor = NUMERIC_TENSOR_TYPE_TO_TYPEDARRAY_MAP.get(arg0);
              if (typedArrayConstructor === void 0) {
                throw new TypeError(`Unsupported tensor type: ${arg0}.`);
              }
              if (Array.isArray(arg1)) {
                if (arg0 === "float16" && typedArrayConstructor === Uint16Array || arg0 === "uint4" || arg0 === "int4") {
                  throw new TypeError(`Creating a ${arg0} tensor from number array is not supported. Please use ${typedArrayConstructor.name} as data.`);
                } else if (arg0 === "uint64" || arg0 === "int64") {
                  data = typedArrayConstructor.from(arg1, BigInt);
                } else {
                  data = typedArrayConstructor.from(arg1);
                }
              } else if (arg1 instanceof typedArrayConstructor) {
                data = arg1;
              } else if (arg1 instanceof Uint8ClampedArray) {
                if (arg0 === "uint8") {
                  data = Uint8Array.from(arg1);
                } else {
                  throw new TypeError(`A Uint8ClampedArray tensor's data must be type of uint8`);
                }
              } else if (arg0 === "float16" && arg1 instanceof Uint16Array && typedArrayConstructor !== Uint16Array) {
                data = new globalThis.Float16Array(arg1.buffer, arg1.byteOffset, arg1.length);
              } else {
                throw new TypeError(`A ${type} tensor's data must be type of ${typedArrayConstructor}`);
              }
            }
          } else {
            maybeDims = arg1;
            if (Array.isArray(arg0)) {
              if (arg0.length === 0) {
                throw new TypeError("Tensor type cannot be inferred from an empty array.");
              }
              const firstElementType = typeof arg0[0];
              if (firstElementType === "string") {
                type = "string";
                data = arg0;
              } else if (firstElementType === "boolean") {
                type = "bool";
                data = Uint8Array.from(arg0);
              } else {
                throw new TypeError(`Invalid element type of data array: ${firstElementType}.`);
              }
            } else if (arg0 instanceof Uint8ClampedArray) {
              type = "uint8";
              data = Uint8Array.from(arg0);
            } else {
              const mappedType = NUMERIC_TENSOR_TYPEDARRAY_TO_TYPE_MAP.get(arg0.constructor);
              if (mappedType === void 0) {
                throw new TypeError(`Unsupported type for tensor data: ${arg0.constructor}.`);
              }
              type = mappedType;
              data = arg0;
            }
          }
          if (maybeDims === void 0) {
            maybeDims = [data.length];
          } else if (!Array.isArray(maybeDims)) {
            throw new TypeError("A tensor's dims must be a number array");
          }
          dims = maybeDims;
          this.cpuData = data;
          this.dataLocation = "cpu";
        }
        const size = calculateSize(dims);
        if (this.cpuData && size !== this.cpuData.length) {
          if ((type === "uint4" || type === "int4") && Math.ceil(size / 2) === this.cpuData.length) {
          } else {
            throw new Error(`Tensor's size(${size}) does not match data length(${this.cpuData.length}).`);
          }
        }
        this.type = type;
        this.dims = dims;
        this.size = size;
      }
      // #endregion
      // #region factory
      static async fromImage(image, options) {
        return tensorFromImage(image, options);
      }
      static fromTexture(texture, options) {
        return tensorFromTexture(texture, options);
      }
      static fromGpuBuffer(gpuBuffer, options) {
        return tensorFromGpuBuffer(gpuBuffer, options);
      }
      static fromMLTensor(mlTensor, options) {
        return tensorFromMLTensor(mlTensor, options);
      }
      static fromPinnedBuffer(type, buffer, dims) {
        return tensorFromPinnedBuffer(type, buffer, dims);
      }
      // #endregion
      // #region conversions
      toDataURL(options) {
        return tensorToDataURL(this, options);
      }
      toImageData(options) {
        return tensorToImageData(this, options);
      }
      // #endregion
      // #region properties
      get data() {
        this.ensureValid();
        if (!this.cpuData) {
          throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
        }
        return this.cpuData;
      }
      get location() {
        return this.dataLocation;
      }
      get texture() {
        this.ensureValid();
        if (!this.gpuTextureData) {
          throw new Error("The data is not stored as a WebGL texture.");
        }
        return this.gpuTextureData;
      }
      get gpuBuffer() {
        this.ensureValid();
        if (!this.gpuBufferData) {
          throw new Error("The data is not stored as a WebGPU buffer.");
        }
        return this.gpuBufferData;
      }
      get mlTensor() {
        this.ensureValid();
        if (!this.mlTensorData) {
          throw new Error("The data is not stored as a WebNN MLTensor.");
        }
        return this.mlTensorData;
      }
      // #endregion
      // #region methods
      async getData(releaseData) {
        this.ensureValid();
        switch (this.dataLocation) {
          case "cpu":
          case "cpu-pinned":
            return this.data;
          case "texture":
          case "gpu-buffer":
          case "ml-tensor": {
            if (!this.downloader) {
              throw new Error("The current tensor is not created with a specified data downloader.");
            }
            if (this.isDownloading) {
              throw new Error("The current tensor is being downloaded.");
            }
            try {
              this.isDownloading = true;
              const data = await this.downloader();
              this.downloader = void 0;
              this.dataLocation = "cpu";
              this.cpuData = data;
              if (releaseData && this.disposer) {
                this.disposer();
                this.disposer = void 0;
              }
              return data;
            } finally {
              this.isDownloading = false;
            }
          }
          default:
            throw new Error(`cannot get data from location: ${this.dataLocation}`);
        }
      }
      dispose() {
        if (this.isDownloading) {
          throw new Error("The current tensor is being downloaded.");
        }
        if (this.disposer) {
          this.disposer();
          this.disposer = void 0;
        }
        this.cpuData = void 0;
        this.gpuTextureData = void 0;
        this.gpuBufferData = void 0;
        this.mlTensorData = void 0;
        this.downloader = void 0;
        this.isDownloading = void 0;
        this.dataLocation = "none";
      }
      // #endregion
      // #region tensor utilities
      ensureValid() {
        if (this.dataLocation === "none") {
          throw new Error("The tensor is disposed.");
        }
      }
      reshape(dims) {
        this.ensureValid();
        if (this.downloader || this.disposer) {
          throw new Error("Cannot reshape a tensor that owns GPU resource.");
        }
        return tensorReshape(this, dims);
      }
    };
  }
});

// common/dist/esm/tensor.js
var Tensor2;
var init_tensor = __esm({
  "common/dist/esm/tensor.js"() {
    "use strict";
    init_tensor_impl();
    Tensor2 = Tensor;
  }
});

// common/dist/esm/trace.js
var TRACE, TRACE_FUNC, TRACE_FUNC_BEGIN, TRACE_FUNC_END, TRACE_EVENT_BEGIN, TRACE_EVENT_END;
var init_trace = __esm({
  "common/dist/esm/trace.js"() {
    "use strict";
    init_env_impl();
    TRACE = (deviceType, label) => {
      if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
        return;
      }
      console.timeStamp(`${deviceType}::ORT::${label}`);
    };
    TRACE_FUNC = (msg, extraMsg) => {
      const stack = new Error().stack?.split(/\r\n|\r|\n/g) || [];
      let hasTraceFunc = false;
      for (let i = 0; i < stack.length; i++) {
        if (hasTraceFunc && !stack[i].includes("TRACE_FUNC")) {
          let label = `FUNC_${msg}::${stack[i].trim().split(" ")[1]}`;
          if (extraMsg) {
            label += `::${extraMsg}`;
          }
          TRACE("CPU", label);
          return;
        }
        if (stack[i].includes("TRACE_FUNC")) {
          hasTraceFunc = true;
        }
      }
    };
    TRACE_FUNC_BEGIN = (extraMsg) => {
      if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
        return;
      }
      TRACE_FUNC("BEGIN", extraMsg);
    };
    TRACE_FUNC_END = (extraMsg) => {
      if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
        return;
      }
      TRACE_FUNC("END", extraMsg);
    };
    TRACE_EVENT_BEGIN = (extraMsg) => {
      if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
        return;
      }
      console.time(`ORT::${extraMsg}`);
    };
    TRACE_EVENT_END = (extraMsg) => {
      if (typeof env.trace === "undefined" ? !env.wasm.trace : !env.trace) {
        return;
      }
      console.timeEnd(`ORT::${extraMsg}`);
    };
  }
});

// common/dist/esm/inference-session-impl.js
var InferenceSession;
var init_inference_session_impl = __esm({
  "common/dist/esm/inference-session-impl.js"() {
    "use strict";
    init_backend_impl();
    init_tensor();
    init_trace();
    InferenceSession = class _InferenceSession {
      constructor(handler) {
        this.handler = handler;
      }
      async run(feeds, arg1, arg2) {
        TRACE_FUNC_BEGIN();
        TRACE_EVENT_BEGIN("InferenceSession.run");
        const fetches = {};
        let options = {};
        if (typeof feeds !== "object" || feeds === null || feeds instanceof Tensor2 || Array.isArray(feeds)) {
          throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
        }
        let isFetchesEmpty = true;
        if (typeof arg1 === "object") {
          if (arg1 === null) {
            throw new TypeError("Unexpected argument[1]: cannot be null.");
          }
          if (arg1 instanceof Tensor2) {
            throw new TypeError("'fetches' cannot be a Tensor");
          }
          if (Array.isArray(arg1)) {
            if (arg1.length === 0) {
              throw new TypeError("'fetches' cannot be an empty array.");
            }
            isFetchesEmpty = false;
            for (const name of arg1) {
              if (typeof name !== "string") {
                throw new TypeError("'fetches' must be a string array or an object.");
              }
              if (this.outputNames.indexOf(name) === -1) {
                throw new RangeError(`'fetches' contains invalid output name: ${name}.`);
              }
              fetches[name] = null;
            }
            if (typeof arg2 === "object" && arg2 !== null) {
              options = arg2;
            } else if (typeof arg2 !== "undefined") {
              throw new TypeError("'options' must be an object.");
            }
          } else {
            let isFetches = false;
            const arg1Keys = Object.getOwnPropertyNames(arg1);
            for (const name of this.outputNames) {
              if (arg1Keys.indexOf(name) !== -1) {
                const v = arg1[name];
                if (v === null || v instanceof Tensor2) {
                  isFetches = true;
                  isFetchesEmpty = false;
                  fetches[name] = v;
                }
              }
            }
            if (isFetches) {
              if (typeof arg2 === "object" && arg2 !== null) {
                options = arg2;
              } else if (typeof arg2 !== "undefined") {
                throw new TypeError("'options' must be an object.");
              }
            } else {
              options = arg1;
            }
          }
        } else if (typeof arg1 !== "undefined") {
          throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
        }
        for (const name of this.inputNames) {
          if (typeof feeds[name] === "undefined") {
            throw new Error(`input '${name}' is missing in 'feeds'.`);
          }
        }
        if (isFetchesEmpty) {
          for (const name of this.outputNames) {
            fetches[name] = null;
          }
        }
        const results = await this.handler.run(feeds, fetches, options);
        const returnValue = {};
        for (const key in results) {
          if (Object.hasOwnProperty.call(results, key)) {
            const result = results[key];
            if (result instanceof Tensor2) {
              returnValue[key] = result;
            } else {
              returnValue[key] = new Tensor2(result.type, result.data, result.dims);
            }
          }
        }
        TRACE_EVENT_END("InferenceSession.run");
        TRACE_FUNC_END();
        return returnValue;
      }
      async release() {
        return this.handler.dispose();
      }
      static async create(arg0, arg1, arg2, arg3) {
        TRACE_FUNC_BEGIN();
        TRACE_EVENT_BEGIN("InferenceSession.create");
        let filePathOrUint8Array;
        let options = {};
        if (typeof arg0 === "string") {
          filePathOrUint8Array = arg0;
          if (typeof arg1 === "object" && arg1 !== null) {
            options = arg1;
          } else if (typeof arg1 !== "undefined") {
            throw new TypeError("'options' must be an object.");
          }
        } else if (arg0 instanceof Uint8Array) {
          filePathOrUint8Array = arg0;
          if (typeof arg1 === "object" && arg1 !== null) {
            options = arg1;
          } else if (typeof arg1 !== "undefined") {
            throw new TypeError("'options' must be an object.");
          }
        } else if (arg0 instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && arg0 instanceof SharedArrayBuffer) {
          const buffer = arg0;
          let byteOffset = 0;
          let byteLength = arg0.byteLength;
          if (typeof arg1 === "object" && arg1 !== null) {
            options = arg1;
          } else if (typeof arg1 === "number") {
            byteOffset = arg1;
            if (!Number.isSafeInteger(byteOffset)) {
              throw new RangeError("'byteOffset' must be an integer.");
            }
            if (byteOffset < 0 || byteOffset >= buffer.byteLength) {
              throw new RangeError(`'byteOffset' is out of range [0, ${buffer.byteLength}).`);
            }
            byteLength = arg0.byteLength - byteOffset;
            if (typeof arg2 === "number") {
              byteLength = arg2;
              if (!Number.isSafeInteger(byteLength)) {
                throw new RangeError("'byteLength' must be an integer.");
              }
              if (byteLength <= 0 || byteOffset + byteLength > buffer.byteLength) {
                throw new RangeError(`'byteLength' is out of range (0, ${buffer.byteLength - byteOffset}].`);
              }
              if (typeof arg3 === "object" && arg3 !== null) {
                options = arg3;
              } else if (typeof arg3 !== "undefined") {
                throw new TypeError("'options' must be an object.");
              }
            } else if (typeof arg2 !== "undefined") {
              throw new TypeError("'byteLength' must be a number.");
            }
          } else if (typeof arg1 !== "undefined") {
            throw new TypeError("'options' must be an object.");
          }
          filePathOrUint8Array = new Uint8Array(buffer, byteOffset, byteLength);
        } else {
          throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
        }
        const [backend, optionsWithValidatedEPs] = await resolveBackendAndExecutionProviders(options);
        const handler = await backend.createInferenceSessionHandler(filePathOrUint8Array, optionsWithValidatedEPs);
        TRACE_EVENT_END("InferenceSession.create");
        TRACE_FUNC_END();
        return new _InferenceSession(handler);
      }
      startProfiling() {
        this.handler.startProfiling();
      }
      endProfiling() {
        this.handler.endProfiling();
      }
      get inputNames() {
        return this.handler.inputNames;
      }
      get outputNames() {
        return this.handler.outputNames;
      }
      get inputMetadata() {
        return this.handler.inputMetadata;
      }
      get outputMetadata() {
        return this.handler.outputMetadata;
      }
    };
  }
});

// common/dist/esm/inference-session.js
var InferenceSession2;
var init_inference_session = __esm({
  "common/dist/esm/inference-session.js"() {
    "use strict";
    init_inference_session_impl();
    InferenceSession2 = InferenceSession;
  }
});

// common/dist/esm/tensor-conversion.js
var init_tensor_conversion = __esm({
  "common/dist/esm/tensor-conversion.js"() {
    "use strict";
  }
});

// common/dist/esm/tensor-factory.js
var init_tensor_factory = __esm({
  "common/dist/esm/tensor-factory.js"() {
    "use strict";
  }
});

// common/dist/esm/onnx-model.js
var init_onnx_model = __esm({
  "common/dist/esm/onnx-model.js"() {
    "use strict";
  }
});

// common/dist/esm/onnx-value.js
var init_onnx_value = __esm({
  "common/dist/esm/onnx-value.js"() {
    "use strict";
  }
});

// common/dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  InferenceSession: () => InferenceSession2,
  TRACE: () => TRACE,
  TRACE_EVENT_BEGIN: () => TRACE_EVENT_BEGIN,
  TRACE_EVENT_END: () => TRACE_EVENT_END,
  TRACE_FUNC_BEGIN: () => TRACE_FUNC_BEGIN,
  TRACE_FUNC_END: () => TRACE_FUNC_END,
  Tensor: () => Tensor2,
  env: () => env2,
  registerBackend: () => registerBackend
});
var init_esm = __esm({
  "common/dist/esm/index.js"() {
    "use strict";
    init_backend();
    init_env();
    init_inference_session();
    init_tensor();
    init_tensor_conversion();
    init_tensor_factory();
    init_trace();
    init_onnx_model();
    init_onnx_value();
  }
});

// web/lib/wasm/wasm-utils-env.ts
var isNode;
var init_wasm_utils_env = __esm({
  "web/lib/wasm/wasm-utils-env.ts"() {
    "use strict";
    isNode = false;
  }
});

// web/lib/wasm/proxy-worker/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
var WORKER_NAME, isProxyWorker, main_default;
var init_main = __esm({
  "web/lib/wasm/proxy-worker/main.ts"() {
    "use strict";
    init_wasm_core_impl();
    init_wasm_factory();
    init_wasm_utils_import();
    WORKER_NAME = "ort-wasm-proxy-worker";
    isProxyWorker = globalThis.self?.name === WORKER_NAME;
    if (isProxyWorker) {
      self.onmessage = (ev) => {
        const { type, in: message } = ev.data;
        try {
          switch (type) {
            case "init-wasm":
              initializeWebAssembly(message.wasm).then(
                () => {
                  initRuntime(message).then(
                    () => {
                      postMessage({ type });
                    },
                    (err) => {
                      postMessage({ type, err });
                    }
                  );
                },
                (err) => {
                  postMessage({ type, err });
                }
              );
              break;
            case "init-ep": {
              const { epName, env: env3 } = message;
              initEp(env3, epName).then(
                () => {
                  postMessage({ type });
                },
                (err) => {
                  postMessage({ type, err });
                }
              );
              break;
            }
            case "copy-from": {
              const { buffer } = message;
              const bufferData = copyFromExternalBuffer(buffer);
              postMessage({ type, out: bufferData });
              break;
            }
            case "create": {
              const { model, options } = message;
              createSession(model, options).then(
                (sessionMetadata) => {
                  postMessage({ type, out: sessionMetadata });
                },
                (err) => {
                  postMessage({ type, err });
                }
              );
              break;
            }
            case "release":
              releaseSession(message);
              postMessage({ type });
              break;
            case "run": {
              const { sessionId, inputIndices, inputs, outputIndices, options } = message;
              run(sessionId, inputIndices, inputs, outputIndices, new Array(outputIndices.length).fill(null), options).then(
                (outputs) => {
                  if (outputs.some((o) => o[3] !== "cpu")) {
                    postMessage({ type, err: "Proxy does not support non-cpu tensor location." });
                  } else {
                    postMessage(
                      { type, out: outputs },
                      extractTransferableBuffers([...inputs, ...outputs])
                    );
                  }
                },
                (err) => {
                  postMessage({ type, err });
                }
              );
              break;
            }
            case "end-profiling":
              endProfiling(message);
              postMessage({ type });
              break;
            default:
          }
        } catch (err) {
          postMessage({ type, err });
        }
      };
    }
    main_default = isProxyWorker ? null : (urlOverride) => new Worker(urlOverride ?? scriptSrc, { type: true ? "module" : "classic", name: WORKER_NAME });
  }
});

// web/lib/wasm/wasm-utils-import.ts
var origin, isEsmImportMetaUrlHardcodedAsFileUri, getScriptSrc, scriptSrc, inferWasmPathPrefixFromScriptSrc, isSameOrigin, normalizeUrl, fallbackUrl, preload, dynamicImportDefault, createProxyWorker, importProxyWorker, embeddedWasmModule, importWasmModule;
var init_wasm_utils_import = __esm({
  "web/lib/wasm/wasm-utils-import.ts"() {
    "use strict";
    init_wasm_utils_env();
    origin = isNode || typeof location === "undefined" ? void 0 : location.origin;
    isEsmImportMetaUrlHardcodedAsFileUri = import.meta.url > "file:" && import.meta.url < "file;";
    getScriptSrc = () => {
      if (isNode) {
        return void 0;
      }
      if (true) {
        if (isEsmImportMetaUrlHardcodedAsFileUri) {
          const URL2 = URL;
          return new URL(new URL2("ort.jspi.mjs", import.meta.url).href, origin).href;
        }
        return import.meta.url;
      }
      return typeof document !== "undefined" ? document.currentScript?.src : (
        // use `self.location.href` if available
        typeof self !== "undefined" ? self.location?.href : void 0
      );
    };
    scriptSrc = getScriptSrc();
    inferWasmPathPrefixFromScriptSrc = () => {
      if (scriptSrc && !scriptSrc.startsWith("blob:")) {
        return scriptSrc.substring(0, scriptSrc.lastIndexOf("/") + 1);
      }
      return void 0;
    };
    isSameOrigin = (filename, prefixOverride) => {
      try {
        const baseUrl = prefixOverride ?? scriptSrc;
        const url = baseUrl ? new URL(filename, baseUrl) : new URL(filename);
        return url.origin === origin;
      } catch {
        return false;
      }
    };
    normalizeUrl = (filename, prefixOverride) => {
      const baseUrl = prefixOverride ?? scriptSrc;
      try {
        const url = baseUrl ? new URL(filename, baseUrl) : new URL(filename);
        return url.href;
      } catch {
        return void 0;
      }
    };
    fallbackUrl = (filename, prefixOverride) => `${prefixOverride ?? "./"}${filename}`;
    preload = async (absoluteUrl) => {
      const response = await fetch(absoluteUrl, { credentials: "same-origin" });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };
    dynamicImportDefault = async (url) => (await import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      url
    )).default;
    createProxyWorker = // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    false ? void 0 : (init_main(), __toCommonJS(main_exports)).default;
    importProxyWorker = async () => {
      if (!scriptSrc) {
        throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
      }
      if (isSameOrigin(scriptSrc)) {
        return [void 0, createProxyWorker()];
      }
      const url = await preload(scriptSrc);
      return [url, createProxyWorker(url)];
    };
    embeddedWasmModule = false ? (
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      (false ? null : true ? null : true ? null : null).default
    ) : void 0;
    importWasmModule = async (urlOverride, prefixOverride, isMultiThreaded, isWasmOverridden) => {
      let useEmbeddedModule = embeddedWasmModule && !(urlOverride || prefixOverride);
      if (useEmbeddedModule) {
        if (!scriptSrc) {
          if (isWasmOverridden && !isMultiThreaded) {
            useEmbeddedModule = true;
          } else {
            throw new Error("cannot determine the script source URL.");
          }
        } else {
          useEmbeddedModule = isSameOrigin(scriptSrc) || isWasmOverridden && !isMultiThreaded;
        }
      }
      if (useEmbeddedModule) {
        return [void 0, embeddedWasmModule];
      } else {
        const wasmModuleFilename = false ? "ort-wasm-simd-threaded.jsep.mjs" : true ? "ort-wasm-simd-threaded.jspi.mjs" : true ? "ort-wasm-simd-threaded.asyncify.mjs" : "ort-wasm-simd-threaded.mjs";
        const wasmModuleUrl = urlOverride ?? normalizeUrl(wasmModuleFilename, prefixOverride);
        const needPreload = !isNode && isMultiThreaded && wasmModuleUrl && !isSameOrigin(wasmModuleUrl, prefixOverride);
        const url = needPreload ? await preload(wasmModuleUrl) : wasmModuleUrl ?? fallbackUrl(wasmModuleFilename, prefixOverride);
        return [needPreload ? url : void 0, await dynamicImportDefault(url)];
      }
    };
  }
});

// web/lib/wasm/wasm-factory.ts
var wasm, initialized, initializing, aborted, isMultiThreadSupported, isSimdSupported, isRelaxedSimdSupported, initializeWebAssembly, getInstance;
var init_wasm_factory = __esm({
  "web/lib/wasm/wasm-factory.ts"() {
    "use strict";
    init_wasm_utils_import();
    initialized = false;
    initializing = false;
    aborted = false;
    isMultiThreadSupported = () => {
      if (typeof SharedArrayBuffer === "undefined") {
        return false;
      }
      try {
        if (typeof MessageChannel !== "undefined") {
          new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
        }
        return WebAssembly.validate(
          new Uint8Array([
            0,
            97,
            115,
            109,
            1,
            0,
            0,
            0,
            1,
            4,
            1,
            96,
            0,
            0,
            3,
            2,
            1,
            0,
            5,
            4,
            1,
            3,
            1,
            1,
            10,
            11,
            1,
            9,
            0,
            65,
            0,
            254,
            16,
            2,
            0,
            26,
            11
          ])
        );
      } catch {
        return false;
      }
    };
    isSimdSupported = () => {
      try {
        return WebAssembly.validate(
          new Uint8Array([
            0,
            97,
            115,
            109,
            1,
            0,
            0,
            0,
            1,
            4,
            1,
            96,
            0,
            0,
            3,
            2,
            1,
            0,
            10,
            30,
            1,
            28,
            0,
            65,
            0,
            253,
            15,
            253,
            12,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            253,
            186,
            1,
            26,
            11
          ])
        );
      } catch {
        return false;
      }
    };
    isRelaxedSimdSupported = () => {
      try {
        return WebAssembly.validate(
          new Uint8Array([
            0,
            97,
            115,
            109,
            1,
            0,
            0,
            0,
            1,
            5,
            1,
            96,
            0,
            1,
            123,
            3,
            2,
            1,
            0,
            10,
            19,
            1,
            17,
            0,
            65,
            1,
            253,
            15,
            65,
            2,
            253,
            15,
            65,
            3,
            253,
            15,
            253,
            147,
            2,
            11
          ])
        );
      } catch {
        return false;
      }
    };
    initializeWebAssembly = async (flags) => {
      if (initialized) {
        return Promise.resolve();
      }
      if (initializing) {
        throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
      }
      if (aborted) {
        throw new Error("previous call to 'initializeWebAssembly()' failed.");
      }
      initializing = true;
      const timeout = flags.initTimeout;
      let numThreads = flags.numThreads;
      if (flags.simd === false) {
      } else if (flags.simd === "relaxed") {
        if (!isRelaxedSimdSupported()) {
          throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
        }
      } else if (!isSimdSupported()) {
        throw new Error("WebAssembly SIMD is not supported in the current environment.");
      }
      if (true) {
        if (!("Suspending" in WebAssembly)) {
          throw new Error("WebAssembly JSPI is not supported in the current environment.");
        }
      }
      const multiThreadSupported = isMultiThreadSupported();
      if (numThreads > 1 && !multiThreadSupported) {
        if (typeof self !== "undefined" && !self.crossOriginIsolated) {
          console.warn(
            "env.wasm.numThreads is set to " + numThreads + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."
          );
        }
        console.warn(
          "WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."
        );
        flags.numThreads = numThreads = 1;
      }
      const wasmPaths = flags.wasmPaths;
      const wasmPrefixOverride = typeof wasmPaths === "string" ? wasmPaths : void 0;
      const mjsPathOverrideFlag = wasmPaths?.mjs;
      const mjsPathOverride = mjsPathOverrideFlag?.href ?? mjsPathOverrideFlag;
      const wasmPathOverrideFlag = wasmPaths?.wasm;
      const wasmPathOverride = wasmPathOverrideFlag?.href ?? wasmPathOverrideFlag;
      const wasmBinaryOverride = flags.wasmBinary;
      const [objectUrl, ortWasmFactory] = await importWasmModule(
        mjsPathOverride,
        wasmPrefixOverride,
        numThreads > 1,
        !!wasmBinaryOverride || !!wasmPathOverride
      );
      let isTimeout = false;
      const tasks = [];
      if (timeout > 0) {
        tasks.push(
          new Promise((resolve) => {
            setTimeout(() => {
              isTimeout = true;
              resolve();
            }, timeout);
          })
        );
      }
      tasks.push(
        new Promise((resolve, reject) => {
          const config = {
            /**
             * The number of threads. WebAssembly will create (Module.numThreads - 1) workers. If it is 1, no worker will be
             * created.
             */
            numThreads
          };
          if (wasmBinaryOverride) {
            config.wasmBinary = wasmBinaryOverride;
            config.locateFile = (fileName) => fileName;
          } else if (wasmPathOverride || wasmPrefixOverride) {
            config.locateFile = (fileName) => wasmPathOverride ?? wasmPrefixOverride + fileName;
          } else if (mjsPathOverride && mjsPathOverride.indexOf("blob:") !== 0) {
            config.locateFile = (fileName) => new URL(fileName, mjsPathOverride).href;
          } else if (objectUrl) {
            const inferredWasmPathPrefix = inferWasmPathPrefixFromScriptSrc();
            if (inferredWasmPathPrefix) {
              config.locateFile = (fileName) => inferredWasmPathPrefix + fileName;
            }
          }
          ortWasmFactory(config).then(
            // wasm module initialized successfully
            (module) => {
              initializing = false;
              initialized = true;
              wasm = module;
              resolve();
              if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
              }
            },
            // wasm module failed to initialize
            (what) => {
              initializing = false;
              aborted = true;
              reject(what);
            }
          );
        })
      );
      await Promise.race(tasks);
      if (isTimeout) {
        throw new Error(`WebAssembly backend initializing failed due to timeout: ${timeout}ms`);
      }
    };
    getInstance = () => {
      if (initialized && wasm) {
        return wasm;
      }
      throw new Error("WebAssembly is not initialized yet.");
    };
  }
});

// web/lib/wasm/wasm-utils.ts
var allocWasmString, iterateExtraOptions, checkLastError;
var init_wasm_utils = __esm({
  "web/lib/wasm/wasm-utils.ts"() {
    "use strict";
    init_wasm_factory();
    allocWasmString = (data, allocs) => {
      const wasm2 = getInstance();
      const dataLength = wasm2.lengthBytesUTF8(data) + 1;
      const dataOffset = wasm2._malloc(dataLength);
      wasm2.stringToUTF8(data, dataOffset, dataLength);
      allocs.push(dataOffset);
      return dataOffset;
    };
    iterateExtraOptions = (options, prefix, seen, handler) => {
      if (typeof options == "object" && options !== null) {
        if (seen.has(options)) {
          throw new Error("Circular reference in options");
        } else {
          seen.add(options);
        }
      }
      Object.entries(options).forEach(([key, value]) => {
        const name = prefix ? prefix + key : key;
        if (typeof value === "object") {
          iterateExtraOptions(value, name + ".", seen, handler);
        } else if (typeof value === "string" || typeof value === "number") {
          handler(name, value.toString());
        } else if (typeof value === "boolean") {
          handler(name, value ? "1" : "0");
        } else {
          throw new Error(`Can't handle extra config type: ${typeof value}`);
        }
      });
    };
    checkLastError = (message) => {
      const wasm2 = getInstance();
      const stack = wasm2.stackSave();
      try {
        const ptrSize = wasm2.PTR_SIZE;
        const paramsOffset = wasm2.stackAlloc(2 * ptrSize);
        wasm2._OrtGetLastError(paramsOffset, paramsOffset + ptrSize);
        const errorCode = Number(wasm2.getValue(paramsOffset, ptrSize === 4 ? "i32" : "i64"));
        const errorMessagePointer = wasm2.getValue(paramsOffset + ptrSize, "*");
        const errorMessage = errorMessagePointer ? wasm2.UTF8ToString(errorMessagePointer) : "";
        throw new Error(`${message} ERROR_CODE: ${errorCode}, ERROR_MESSAGE: ${errorMessage}`);
      } finally {
        wasm2.stackRestore(stack);
      }
    };
  }
});

// web/lib/wasm/run-options.ts
var setRunOptions;
var init_run_options = __esm({
  "web/lib/wasm/run-options.ts"() {
    "use strict";
    init_wasm_factory();
    init_wasm_utils();
    setRunOptions = (options) => {
      const wasm2 = getInstance();
      let runOptionsHandle = 0;
      const allocs = [];
      const runOptions = options || {};
      try {
        if (options?.logSeverityLevel === void 0) {
          runOptions.logSeverityLevel = 2;
        } else if (typeof options.logSeverityLevel !== "number" || !Number.isInteger(options.logSeverityLevel) || options.logSeverityLevel < 0 || options.logSeverityLevel > 4) {
          throw new Error(`log severity level is not valid: ${options.logSeverityLevel}`);
        }
        if (options?.logVerbosityLevel === void 0) {
          runOptions.logVerbosityLevel = 0;
        } else if (typeof options.logVerbosityLevel !== "number" || !Number.isInteger(options.logVerbosityLevel)) {
          throw new Error(`log verbosity level is not valid: ${options.logVerbosityLevel}`);
        }
        if (options?.terminate === void 0) {
          runOptions.terminate = false;
        }
        let tagDataOffset = 0;
        if (options?.tag !== void 0) {
          tagDataOffset = allocWasmString(options.tag, allocs);
        }
        runOptionsHandle = wasm2._OrtCreateRunOptions(
          runOptions.logSeverityLevel,
          runOptions.logVerbosityLevel,
          !!runOptions.terminate,
          tagDataOffset
        );
        if (runOptionsHandle === 0) {
          checkLastError("Can't create run options.");
        }
        if (options?.extra !== void 0) {
          iterateExtraOptions(options.extra, "", /* @__PURE__ */ new WeakSet(), (key, value) => {
            const keyDataOffset = allocWasmString(key, allocs);
            const valueDataOffset = allocWasmString(value, allocs);
            if (wasm2._OrtAddRunConfigEntry(runOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
              checkLastError(`Can't set a run config entry: ${key} - ${value}.`);
            }
          });
        }
        return [runOptionsHandle, allocs];
      } catch (e) {
        if (runOptionsHandle !== 0) {
          wasm2._OrtReleaseRunOptions(runOptionsHandle);
        }
        allocs.forEach((alloc) => wasm2._free(alloc));
        throw e;
      }
    };
  }
});

// web/lib/wasm/session-options.ts
var getGraphOptimzationLevel, getExecutionMode, appendDefaultOptions, appendSessionConfig, appendEpOption, setExecutionProviders, setSessionOptions;
var init_session_options = __esm({
  "web/lib/wasm/session-options.ts"() {
    "use strict";
    init_wasm_factory();
    init_wasm_utils();
    getGraphOptimzationLevel = (graphOptimizationLevel) => {
      switch (graphOptimizationLevel) {
        case "disabled":
          return 0;
        case "basic":
          return 1;
        case "extended":
          return 2;
        case "layout":
          return 3;
        case "all":
          return 99;
        default:
          throw new Error(`unsupported graph optimization level: ${graphOptimizationLevel}`);
      }
    };
    getExecutionMode = (executionMode) => {
      switch (executionMode) {
        case "sequential":
          return 0;
        case "parallel":
          return 1;
        default:
          throw new Error(`unsupported execution mode: ${executionMode}`);
      }
    };
    appendDefaultOptions = (options) => {
      if (!options.extra) {
        options.extra = {};
      }
      if (!options.extra.session) {
        options.extra.session = {};
      }
      const session = options.extra.session;
      if (!session.use_ort_model_bytes_directly) {
        session.use_ort_model_bytes_directly = "1";
      }
      if (options.executionProviders && options.executionProviders.some((ep) => (typeof ep === "string" ? ep : ep.name) === "webgpu")) {
        options.enableMemPattern = false;
      }
    };
    appendSessionConfig = (sessionOptionsHandle, key, value, allocs) => {
      const keyDataOffset = allocWasmString(key, allocs);
      const valueDataOffset = allocWasmString(value, allocs);
      if (getInstance()._OrtAddSessionConfigEntry(sessionOptionsHandle, keyDataOffset, valueDataOffset) !== 0) {
        checkLastError(`Can't set a session config entry: ${key} - ${value}.`);
      }
    };
    appendEpOption = (epOptions, key, value, allocs) => {
      const keyDataOffset = allocWasmString(key, allocs);
      const valueDataOffset = allocWasmString(value, allocs);
      epOptions.push([keyDataOffset, valueDataOffset]);
    };
    setExecutionProviders = async (sessionOptionsHandle, sessionOptions, allocs) => {
      const executionProviders = sessionOptions.executionProviders;
      for (const ep of executionProviders) {
        let epName = typeof ep === "string" ? ep : ep.name;
        const epOptions = [];
        switch (epName) {
          case "webnn":
            epName = "WEBNN";
            if (typeof ep !== "string") {
              const webnnOptions = ep;
              const deviceType = webnnOptions?.deviceType;
              if (deviceType) {
                appendSessionConfig(sessionOptionsHandle, "deviceType", deviceType, allocs);
              }
            }
            break;
          case "webgpu":
            if (true) {
              epName = "WebGPU";
              let customDevice;
              if (typeof ep !== "string") {
                const webgpuOptions = ep;
                if (webgpuOptions.device) {
                  if (typeof GPUDevice !== "undefined" && webgpuOptions.device instanceof GPUDevice) {
                    customDevice = webgpuOptions.device;
                  } else {
                    throw new Error("Invalid GPU device set in WebGPU EP options.");
                  }
                }
                const { enableGraphCapture } = sessionOptions;
                if (typeof enableGraphCapture === "boolean" && enableGraphCapture) {
                  appendEpOption(epOptions, "enableGraphCapture", "1", allocs);
                }
                if (typeof webgpuOptions.preferredLayout === "string") {
                  appendEpOption(epOptions, "preferredLayout", webgpuOptions.preferredLayout, allocs);
                }
                if (webgpuOptions.forceCpuNodeNames) {
                  const names = Array.isArray(webgpuOptions.forceCpuNodeNames) ? webgpuOptions.forceCpuNodeNames : [webgpuOptions.forceCpuNodeNames];
                  appendEpOption(epOptions, "forceCpuNodeNames", names.join("\n"), allocs);
                }
                if (webgpuOptions.validationMode) {
                  appendEpOption(epOptions, "validationMode", webgpuOptions.validationMode, allocs);
                }
              }
              const info = getInstance().webgpuRegisterDevice(customDevice);
              if (info) {
                const [deviceId, instanceHandle, deviceHandle] = info;
                appendEpOption(epOptions, "deviceId", deviceId.toString(), allocs);
                appendEpOption(epOptions, "webgpuInstance", instanceHandle.toString(), allocs);
                appendEpOption(epOptions, "webgpuDevice", deviceHandle.toString(), allocs);
              }
            } else {
              epName = "JS";
              if (typeof ep !== "string") {
                const webgpuOptions = ep;
                if (webgpuOptions?.preferredLayout) {
                  if (webgpuOptions.preferredLayout !== "NCHW" && webgpuOptions.preferredLayout !== "NHWC") {
                    throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${webgpuOptions.preferredLayout}`);
                  }
                  appendSessionConfig(sessionOptionsHandle, "preferredLayout", webgpuOptions.preferredLayout, allocs);
                }
              }
            }
            break;
          case "wasm":
          case "cpu":
            continue;
          default:
            throw new Error(`not supported execution provider: ${epName}`);
        }
        const epNameDataOffset = allocWasmString(epName, allocs);
        const epOptionsCount = epOptions.length;
        let keysOffset = 0;
        let valuesOffset = 0;
        if (epOptionsCount > 0) {
          keysOffset = getInstance()._malloc(epOptionsCount * getInstance().PTR_SIZE);
          allocs.push(keysOffset);
          valuesOffset = getInstance()._malloc(epOptionsCount * getInstance().PTR_SIZE);
          allocs.push(valuesOffset);
          for (let i = 0; i < epOptionsCount; i++) {
            getInstance().setValue(keysOffset + i * getInstance().PTR_SIZE, epOptions[i][0], "*");
            getInstance().setValue(valuesOffset + i * getInstance().PTR_SIZE, epOptions[i][1], "*");
          }
        }
        if (await getInstance()._OrtAppendExecutionProvider(
          sessionOptionsHandle,
          epNameDataOffset,
          keysOffset,
          valuesOffset,
          epOptionsCount
        ) !== 0) {
          checkLastError(`Can't append execution provider: ${epName}.`);
        }
      }
    };
    setSessionOptions = async (options) => {
      const wasm2 = getInstance();
      let sessionOptionsHandle = 0;
      const allocs = [];
      const sessionOptions = options || {};
      appendDefaultOptions(sessionOptions);
      try {
        const graphOptimizationLevel = getGraphOptimzationLevel(sessionOptions.graphOptimizationLevel ?? "all");
        const executionMode = getExecutionMode(sessionOptions.executionMode ?? "sequential");
        const logIdDataOffset = typeof sessionOptions.logId === "string" ? allocWasmString(sessionOptions.logId, allocs) : 0;
        const logSeverityLevel = sessionOptions.logSeverityLevel ?? 2;
        if (!Number.isInteger(logSeverityLevel) || logSeverityLevel < 0 || logSeverityLevel > 4) {
          throw new Error(`log severity level is not valid: ${logSeverityLevel}`);
        }
        const logVerbosityLevel = sessionOptions.logVerbosityLevel ?? 0;
        if (!Number.isInteger(logVerbosityLevel) || logVerbosityLevel < 0 || logVerbosityLevel > 4) {
          throw new Error(`log verbosity level is not valid: ${logVerbosityLevel}`);
        }
        const optimizedModelFilePathOffset = typeof sessionOptions.optimizedModelFilePath === "string" ? allocWasmString(sessionOptions.optimizedModelFilePath, allocs) : 0;
        sessionOptionsHandle = wasm2._OrtCreateSessionOptions(
          graphOptimizationLevel,
          !!sessionOptions.enableCpuMemArena,
          !!sessionOptions.enableMemPattern,
          executionMode,
          !!sessionOptions.enableProfiling,
          0,
          logIdDataOffset,
          logSeverityLevel,
          logVerbosityLevel,
          optimizedModelFilePathOffset
        );
        if (sessionOptionsHandle === 0) {
          checkLastError("Can't create session options.");
        }
        if (sessionOptions.executionProviders) {
          await setExecutionProviders(sessionOptionsHandle, sessionOptions, allocs);
        }
        if (sessionOptions.enableGraphCapture !== void 0) {
          if (typeof sessionOptions.enableGraphCapture !== "boolean") {
            throw new Error(`enableGraphCapture must be a boolean value: ${sessionOptions.enableGraphCapture}`);
          }
          appendSessionConfig(
            sessionOptionsHandle,
            "enableGraphCapture",
            sessionOptions.enableGraphCapture.toString(),
            allocs
          );
        }
        if (sessionOptions.freeDimensionOverrides) {
          for (const [name, value] of Object.entries(sessionOptions.freeDimensionOverrides)) {
            if (typeof name !== "string") {
              throw new Error(`free dimension override name must be a string: ${name}`);
            }
            if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
              throw new Error(`free dimension override value must be a non-negative integer: ${value}`);
            }
            const nameOffset = allocWasmString(name, allocs);
            if (wasm2._OrtAddFreeDimensionOverride(sessionOptionsHandle, nameOffset, value) !== 0) {
              checkLastError(`Can't set a free dimension override: ${name} - ${value}.`);
            }
          }
        }
        if (sessionOptions.extra !== void 0) {
          iterateExtraOptions(sessionOptions.extra, "", /* @__PURE__ */ new WeakSet(), (key, value) => {
            appendSessionConfig(sessionOptionsHandle, key, value, allocs);
          });
        }
        return [sessionOptionsHandle, allocs];
      } catch (e) {
        if (sessionOptionsHandle !== 0) {
          if (wasm2._OrtReleaseSessionOptions(sessionOptionsHandle) !== 0) {
            checkLastError("Can't release session options.");
          }
        }
        allocs.forEach((alloc) => wasm2._free(alloc));
        throw e;
      }
    };
  }
});

// web/lib/wasm/wasm-common.ts
var tensorDataTypeStringToEnum, tensorDataTypeEnumToString, calculateTensorSizeInBytes, tensorTypeToTypedArrayConstructor, logLevelStringToEnum, isGpuBufferSupportedType, isMLTensorSupportedType, dataLocationStringToEnum;
var init_wasm_common = __esm({
  "web/lib/wasm/wasm-common.ts"() {
    "use strict";
    tensorDataTypeStringToEnum = (type) => {
      switch (type) {
        case "int8":
          return 3 /* int8 */;
        case "uint8":
          return 2 /* uint8 */;
        case "bool":
          return 9 /* bool */;
        case "int16":
          return 5 /* int16 */;
        case "uint16":
          return 4 /* uint16 */;
        case "int32":
          return 6 /* int32 */;
        case "uint32":
          return 12 /* uint32 */;
        case "float16":
          return 10 /* float16 */;
        case "float32":
          return 1 /* float */;
        case "float64":
          return 11 /* double */;
        case "string":
          return 8 /* string */;
        case "int64":
          return 7 /* int64 */;
        case "uint64":
          return 13 /* uint64 */;
        case "int4":
          return 22 /* int4 */;
        case "uint4":
          return 21 /* uint4 */;
        default:
          throw new Error(`unsupported data type: ${type}`);
      }
    };
    tensorDataTypeEnumToString = (typeProto) => {
      switch (typeProto) {
        case 3 /* int8 */:
          return "int8";
        case 2 /* uint8 */:
          return "uint8";
        case 9 /* bool */:
          return "bool";
        case 5 /* int16 */:
          return "int16";
        case 4 /* uint16 */:
          return "uint16";
        case 6 /* int32 */:
          return "int32";
        case 12 /* uint32 */:
          return "uint32";
        case 10 /* float16 */:
          return "float16";
        case 1 /* float */:
          return "float32";
        case 11 /* double */:
          return "float64";
        case 8 /* string */:
          return "string";
        case 7 /* int64 */:
          return "int64";
        case 13 /* uint64 */:
          return "uint64";
        case 22 /* int4 */:
          return "int4";
        case 21 /* uint4 */:
          return "uint4";
        default:
          throw new Error(`unsupported data type: ${typeProto}`);
      }
    };
    calculateTensorSizeInBytes = (dateType, dimsOrSize) => {
      const elementSize = [
        -1,
        // undefined = 0
        4,
        // float = 1
        1,
        // uint8 = 2
        1,
        // int8 = 3
        2,
        // uint16 = 4
        2,
        // int16 = 5
        4,
        // int32 = 6
        8,
        // int64 = 7
        -1,
        // string = 8
        1,
        // bool = 9
        2,
        // float16 = 10
        8,
        // double = 11
        4,
        // uint32 = 12
        8,
        // uint64 = 13
        -1,
        // complex64 = 14
        -1,
        // complex128 = 15
        -1,
        // bfloat16 = 16
        -1,
        // FLOAT8E4M3FN = 17
        -1,
        // FLOAT8E4M3FNUZ = 18
        -1,
        // FLOAT8E5M2 = 19
        -1,
        // FLOAT8E5M2FNUZ = 20
        0.5,
        // uint4 = 21
        0.5
        // int4 = 22
      ][dateType];
      const size = typeof dimsOrSize === "number" ? dimsOrSize : dimsOrSize.reduce((a, b) => a * b, 1);
      return elementSize > 0 ? Math.ceil(size * elementSize) : void 0;
    };
    tensorTypeToTypedArrayConstructor = (type) => {
      switch (type) {
        case "float16":
          return typeof Float16Array !== "undefined" && Float16Array.from ? Float16Array : Uint16Array;
        case "float32":
          return Float32Array;
        case "uint8":
          return Uint8Array;
        case "int8":
          return Int8Array;
        case "uint16":
          return Uint16Array;
        case "int16":
          return Int16Array;
        case "int32":
          return Int32Array;
        case "bool":
          return Uint8Array;
        case "float64":
          return Float64Array;
        case "uint32":
          return Uint32Array;
        case "int64":
          return BigInt64Array;
        case "uint64":
          return BigUint64Array;
        default:
          throw new Error(`unsupported type: ${type}`);
      }
    };
    logLevelStringToEnum = (logLevel) => {
      switch (logLevel) {
        case "verbose":
          return 0;
        case "info":
          return 1;
        case "warning":
          return 2;
        case "error":
          return 3;
        case "fatal":
          return 4;
        default:
          throw new Error(`unsupported logging level: ${logLevel}`);
      }
    };
    isGpuBufferSupportedType = (type) => type === "float32" || type === "float16" || type === "int32" || type === "int64" || type === "uint32" || type === "uint8" || type === "bool" || type === "uint4" || type === "int4";
    isMLTensorSupportedType = (type) => type === "float32" || type === "float16" || type === "int32" || type === "int64" || type === "uint32" || type === "uint64" || type === "int8" || type === "uint8" || type === "bool" || type === "uint4" || type === "int4";
    dataLocationStringToEnum = (location2) => {
      switch (location2) {
        case "none":
          return 0;
        case "cpu":
          return 1;
        case "cpu-pinned":
          return 2;
        case "texture":
          return 3;
        case "gpu-buffer":
          return 4;
        case "ml-tensor":
          return 5;
        default:
          throw new Error(`unsupported data location: ${location2}`);
      }
    };
  }
});

// web/lib/wasm/wasm-utils-load-file.ts
var loadFile;
var init_wasm_utils_load_file = __esm({
  "web/lib/wasm/wasm-utils-load-file.ts"() {
    "use strict";
    init_wasm_utils_env();
    loadFile = async (file) => {
      if (typeof file === "string") {
        if (isNode) {
          try {
            const { readFile } = __require("node:fs/promises");
            return new Uint8Array(await readFile(file));
          } catch (e) {
            if (e.code === "ERR_FS_FILE_TOO_LARGE") {
              const { createReadStream } = __require("node:fs");
              const stream = createReadStream(file);
              const chunks = [];
              for await (const chunk of stream) {
                chunks.push(chunk);
              }
              return new Uint8Array(Buffer.concat(chunks));
            }
            throw e;
          }
        } else {
          const response = await fetch(file);
          if (!response.ok) {
            throw new Error(`failed to load external data file: ${file}`);
          }
          const contentLengthHeader = response.headers.get("Content-Length");
          const fileSize = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
          if (fileSize < 1073741824) {
            return new Uint8Array(await response.arrayBuffer());
          } else {
            if (!response.body) {
              throw new Error(`failed to load external data file: ${file}, no response body.`);
            }
            const reader = response.body.getReader();
            let buffer;
            try {
              buffer = new ArrayBuffer(fileSize);
            } catch (e) {
              if (e instanceof RangeError) {
                const pages = Math.ceil(fileSize / 65536);
                buffer = new WebAssembly.Memory({ initial: pages, maximum: pages }).buffer;
              } else {
                throw e;
              }
            }
            let offset = 0;
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              const chunkSize = value.byteLength;
              const chunk = new Uint8Array(buffer, offset, chunkSize);
              chunk.set(value);
              offset += chunkSize;
            }
            return new Uint8Array(buffer, 0, fileSize);
          }
        }
      } else if (file instanceof Blob) {
        return new Uint8Array(await file.arrayBuffer());
      } else if (file instanceof Uint8Array) {
        return file;
      } else {
        return new Uint8Array(file);
      }
    };
  }
});

// web/lib/wasm/jsep/tensor-view.ts
var createView;
var init_tensor_view = __esm({
  "web/lib/wasm/jsep/tensor-view.ts"() {
    "use strict";
    init_wasm_common();
    createView = (dataBuffer, type) => new (tensorTypeToTypedArrayConstructor(type))(dataBuffer);
  }
});

// web/lib/wasm/jsep/log.ts
var logLevelPrefix, doLog, configLogLevel, debug, configureLogger, LOG, LOG_DEBUG;
var init_log = __esm({
  "web/lib/wasm/jsep/log.ts"() {
    "use strict";
    init_wasm_common();
    logLevelPrefix = ["V", "I", "W", "E", "F"];
    doLog = (level, message) => {
      console.log(`[${logLevelPrefix[level]},${(/* @__PURE__ */ new Date()).toISOString()}]${message}`);
    };
    configureLogger = ($configLogLevel, $debug) => {
      configLogLevel = $configLogLevel;
      debug = $debug;
    };
    LOG = (logLevel, msg) => {
      const messageLevel = logLevelStringToEnum(logLevel);
      const configLevel = logLevelStringToEnum(configLogLevel);
      if (messageLevel >= configLevel) {
        doLog(messageLevel, typeof msg === "function" ? msg() : msg);
      }
    };
    LOG_DEBUG = (...args) => {
      if (debug) {
        LOG(...args);
      }
    };
  }
});

// web/lib/wasm/jsep/webnn/tensor-manager.ts
var webnnDataTypeToSize, convertDataToInt32, convertInt32ToData, tensorGuid, createNewTensorId, webnnDataTypeToFallback, calculateByteLength, TensorWrapper, TensorIdTracker, TensorManagerImpl, createTensorManager;
var init_tensor_manager = __esm({
  "web/lib/wasm/jsep/webnn/tensor-manager.ts"() {
    "use strict";
    init_wasm_common();
    init_log();
    webnnDataTypeToSize = /* @__PURE__ */ new Map([
      ["float32", 32],
      ["float16", 16],
      ["int32", 32],
      ["uint32", 32],
      ["int64", 64],
      ["uint64", 64],
      ["int8", 8],
      ["uint8", 8],
      ["int4", 4],
      ["uint4", 4]
    ]);
    convertDataToInt32 = (data, dataType) => {
      if (dataType === "int32") {
        return data;
      }
      const dataTypeSize = webnnDataTypeToSize.get(dataType);
      if (!dataTypeSize) {
        throw new Error(`WebNN backend does not support data type: ${dataType}`);
      }
      const bytesPerElement = dataTypeSize / 8;
      if (data.byteLength % bytesPerElement !== 0) {
        throw new Error(`Invalid Uint8Array length - must be a multiple of ${bytesPerElement}.`);
      }
      const numElements = data.byteLength / bytesPerElement;
      const originalArray = new (tensorTypeToTypedArrayConstructor(dataType))(data.buffer, data.byteOffset, numElements);
      switch (dataType) {
        case "int64":
        case "uint64": {
          const int32Array = new Int32Array(numElements);
          for (let i = 0; i < numElements; i++) {
            const value = originalArray[i];
            if (value > 2147483647n || value < -2147483648n) {
              throw new Error(`Can not convert int64 data to int32 - value out of range.`);
            }
            int32Array[i] = Number(value);
          }
          return new Uint8Array(int32Array.buffer);
        }
        case "int8":
        case "uint8":
        case "uint32": {
          if (dataType === "uint32") {
            if (originalArray.some((value) => value > 2147483647)) {
              throw new Error(`Can not convert uint32 data to int32 - value out of range.`);
            }
          }
          const int32Array = Int32Array.from(originalArray, Number);
          return new Uint8Array(int32Array.buffer);
        }
        default:
          throw new Error(`Unsupported data conversion from ${dataType} to 'int32'`);
      }
    };
    convertInt32ToData = (data, dataType) => {
      if (dataType === "int32") {
        return data;
      }
      if (data.byteLength % 4 !== 0) {
        throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
      }
      const numElements = data.byteLength / 4;
      const int32Array = new Int32Array(data.buffer, data.byteOffset, numElements);
      switch (dataType) {
        case "int64": {
          const bigInt64Array = BigInt64Array.from(int32Array, BigInt);
          return new Uint8Array(bigInt64Array.buffer);
        }
        case "uint64": {
          if (int32Array.some((value) => value < 0)) {
            throw new Error("Can not convert int32 data to uin64 - negative value found.");
          }
          const bigUint64Array = BigUint64Array.from(int32Array, BigInt);
          return new Uint8Array(bigUint64Array.buffer);
        }
        case "int8": {
          if (int32Array.some((value) => value < -128 || value > 127)) {
            throw new Error("Can not convert int32 data to int8 - value out of range.");
          }
          const int8Array = Int8Array.from(int32Array, Number);
          return new Uint8Array(int8Array.buffer);
        }
        case "uint8": {
          if (int32Array.some((value) => value < 0 || value > 255)) {
            throw new Error("Can not convert int32 data to uint8 - value out of range.");
          }
          return Uint8Array.from(int32Array, Number);
        }
        case "uint32": {
          if (int32Array.some((value) => value < 0)) {
            throw new Error("Can not convert int32 data to uint32 - negative value found.");
          }
          const uint32Array = Uint32Array.from(int32Array, Number);
          return new Uint8Array(uint32Array.buffer);
        }
        default:
          throw new Error(`Unsupported data conversion from 'int32' to ${dataType}`);
      }
    };
    tensorGuid = 1;
    createNewTensorId = () => tensorGuid++;
    webnnDataTypeToFallback = /* @__PURE__ */ new Map([
      ["int8", "int32"],
      ["uint8", "int32"],
      ["uint32", "int32"],
      ["int64", "int32"]
    ]);
    calculateByteLength = (dataType, shape) => {
      const dataTypeSize = webnnDataTypeToSize.get(dataType);
      if (!dataTypeSize) {
        throw new Error(`WebNN backend does not support data type: ${dataType}`);
      }
      return shape.length > 0 ? Math.ceil(shape.reduce((a, b) => a * b) * dataTypeSize / 8) : 0;
    };
    TensorWrapper = class {
      constructor(descriptor) {
        // This flag is used to indicate whether the data has been converted to fallback data type.
        this.isDataConverted = false;
        const { sessionId, context, tensor, dataType, shape, fallbackDataType } = descriptor;
        this.sessionId = sessionId;
        this.mlContext = context;
        this.mlTensor = tensor;
        this.dataType = dataType;
        this.tensorShape = shape;
        this.fallbackDataType = fallbackDataType;
      }
      get tensor() {
        return this.mlTensor;
      }
      get type() {
        return this.dataType;
      }
      get fallbackType() {
        return this.fallbackDataType;
      }
      get shape() {
        return this.tensorShape;
      }
      get byteLength() {
        return calculateByteLength(this.dataType, this.tensorShape);
      }
      destroy() {
        LOG_DEBUG("verbose", () => "[WebNN] TensorWrapper.destroy");
        this.mlTensor.destroy();
      }
      write(data) {
        this.mlContext.writeTensor(this.mlTensor, data);
      }
      async read(dstBuffer) {
        if (this.fallbackDataType) {
          const data = await this.mlContext.readTensor(this.mlTensor);
          const originalData = convertInt32ToData(new Uint8Array(data), this.dataType);
          if (dstBuffer) {
            const targetBuffer = dstBuffer instanceof ArrayBuffer ? new Uint8Array(dstBuffer) : new Uint8Array(dstBuffer.buffer, dstBuffer.byteOffset, dstBuffer.byteLength);
            targetBuffer.set(originalData);
            return void 0;
          } else {
            return originalData.buffer;
          }
        } else {
          return dstBuffer ? this.mlContext.readTensor(this.mlTensor, dstBuffer) : this.mlContext.readTensor(this.mlTensor);
        }
      }
      canReuseTensor(context, dataType, shape) {
        return this.mlContext === context && this.dataType === dataType && this.tensorShape.length === shape.length && this.tensorShape.every((v, i) => v === shape[i]);
      }
      setIsDataConverted(isConverted) {
        this.isDataConverted = isConverted;
      }
    };
    TensorIdTracker = class {
      constructor(tensorManager, wrapper) {
        this.tensorManager = tensorManager;
        this.wrapper = wrapper;
      }
      get tensorWrapper() {
        return this.wrapper;
      }
      releaseTensor() {
        if (this.tensorWrapper) {
          this.tensorManager.releaseTensor(this.tensorWrapper);
          this.wrapper = void 0;
        }
      }
      async ensureTensor(sessionId, dataType, shape, copyOld) {
        const context = this.tensorManager.getMLContext(sessionId);
        const opLimits = this.tensorManager.getMLOpSupportLimits(sessionId);
        let fallbackDataType;
        if (!opLimits?.input.dataTypes.includes(dataType)) {
          fallbackDataType = webnnDataTypeToFallback.get(dataType);
          if (!fallbackDataType || opLimits?.input.dataTypes.includes(fallbackDataType)) {
            throw new Error(`WebNN backend does not support data type: ${dataType}`);
          }
          LOG_DEBUG(
            "verbose",
            () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${dataType} to ${fallbackDataType}`
          );
        }
        if (this.wrapper) {
          if (this.wrapper.canReuseTensor(context, dataType, shape)) {
            return this.wrapper.tensor;
          } else {
            if (copyOld) {
              if (this.wrapper.byteLength !== calculateByteLength(dataType, shape)) {
                throw new Error("Unable to copy data to tensor with different size.");
              }
              this.activeUpload = new Uint8Array(await this.wrapper.read());
            }
            this.tensorManager.releaseTensor(this.wrapper);
          }
        }
        const usage = typeof MLTensorUsage == "undefined" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
        this.wrapper = await this.tensorManager.getCachedTensor(
          sessionId,
          dataType,
          shape,
          usage,
          true,
          true,
          fallbackDataType
        );
        if (copyOld && this.activeUpload) {
          this.wrapper.write(this.activeUpload);
          this.activeUpload = void 0;
        }
        return this.wrapper.tensor;
      }
      upload(data) {
        let newData = data;
        if (this.wrapper) {
          if (this.wrapper.fallbackType) {
            if (this.wrapper.fallbackType === "int32") {
              newData = convertDataToInt32(data, this.wrapper.type);
              this.wrapper.setIsDataConverted(true);
            } else {
              throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
            }
          }
          if (data.byteLength === this.wrapper.byteLength) {
            this.wrapper.write(newData);
            return;
          } else {
            LOG_DEBUG("verbose", () => "Data size does not match tensor size. Releasing tensor.");
            this.releaseTensor();
          }
        }
        if (this.activeUpload) {
          this.activeUpload.set(newData);
        } else {
          this.activeUpload = new Uint8Array(newData);
        }
      }
      async download(dstBuffer) {
        if (this.activeUpload) {
          const dstData = this.wrapper?.isDataConverted ? convertInt32ToData(this.activeUpload, this.wrapper?.type) : this.activeUpload;
          if (dstBuffer) {
            if (dstBuffer instanceof ArrayBuffer) {
              new Uint8Array(dstBuffer).set(dstData);
            } else {
              new Uint8Array(dstBuffer.buffer, dstBuffer.byteOffset, dstBuffer.byteLength).set(dstData);
            }
            return;
          } else {
            return dstData.buffer;
          }
        }
        if (!this.wrapper) {
          throw new Error("Tensor has not been created.");
        }
        if (!dstBuffer) {
          return this.wrapper.read();
        }
        return this.wrapper.read(dstBuffer);
      }
    };
    TensorManagerImpl = class {
      constructor(backend) {
        this.backend = backend;
        this.tensorTrackersById = /* @__PURE__ */ new Map();
        this.freeTensors = [];
        this.externalTensors = /* @__PURE__ */ new Set();
      }
      getMLContext(sessionId) {
        const context = this.backend.getMLContext(sessionId);
        if (!context) {
          throw new Error("MLContext not found for session.");
        }
        return context;
      }
      getMLOpSupportLimits(sessionId) {
        return this.backend.getMLOpSupportLimits(sessionId);
      }
      reserveTensorId() {
        const tensorId = createNewTensorId();
        this.tensorTrackersById.set(tensorId, new TensorIdTracker(this));
        return tensorId;
      }
      releaseTensorId(tensorId) {
        const tensorTracker = this.tensorTrackersById.get(tensorId);
        if (!tensorTracker) {
          return;
        }
        this.tensorTrackersById.delete(tensorId);
        if (tensorTracker.tensorWrapper) {
          this.releaseTensor(tensorTracker.tensorWrapper);
        }
      }
      async ensureTensor(sessionId, tensorId, dataType, shape, copyOld) {
        LOG_DEBUG(
          "verbose",
          () => `[WebNN] TensorManager.ensureTensor {tensorId: ${tensorId}, dataType: ${dataType}, shape: ${shape}, copyOld: ${copyOld}}`
        );
        const tensor = this.tensorTrackersById.get(tensorId);
        if (!tensor) {
          throw new Error("Tensor not found.");
        }
        return tensor.ensureTensor(sessionId, dataType, shape, copyOld);
      }
      upload(tensorId, data) {
        const tensor = this.tensorTrackersById.get(tensorId);
        if (!tensor) {
          throw new Error("Tensor not found.");
        }
        tensor.upload(data);
      }
      async download(tensorId, dstBuffer) {
        LOG_DEBUG(
          "verbose",
          () => `[WebNN] TensorManager.download {tensorId: ${tensorId}, dstBuffer: ${dstBuffer?.byteLength}}`
        );
        const tensorTracker = this.tensorTrackersById.get(tensorId);
        if (!tensorTracker) {
          throw new Error("Tensor not found.");
        }
        return tensorTracker.download(dstBuffer);
      }
      releaseTensorsForSession(sessionId) {
        for (const tensor of this.freeTensors) {
          if (tensor.sessionId === sessionId) {
            tensor.destroy();
          }
        }
        this.freeTensors = this.freeTensors.filter((tensor) => tensor.sessionId !== sessionId);
      }
      registerTensor(sessionId, mlTensor, dataType, shape) {
        const context = this.getMLContext(sessionId);
        const tensorId = createNewTensorId();
        const wrapper = new TensorWrapper({
          sessionId,
          context,
          tensor: mlTensor,
          dataType,
          shape
        });
        this.tensorTrackersById.set(tensorId, new TensorIdTracker(this, wrapper));
        this.externalTensors.add(wrapper);
        return tensorId;
      }
      /**
       * Get or create an MLTensor with the given data type and shape.
       */
      async getCachedTensor(sessionId, dataType, shape, usage, writable, readable, fallbackDataType) {
        const context = this.getMLContext(sessionId);
        for (const [index, tensor2] of this.freeTensors.entries()) {
          if (tensor2.canReuseTensor(context, dataType, shape)) {
            LOG_DEBUG(
              "verbose",
              () => `[WebNN] Reusing tensor {dataType: ${dataType}, ${fallbackDataType ? `fallbackDataType: ${fallbackDataType},` : ""} shape: ${shape}`
            );
            const wrapper = this.freeTensors.splice(index, 1)[0];
            wrapper.sessionId = sessionId;
            return wrapper;
          }
        }
        LOG_DEBUG(
          "verbose",
          () => `[WebNN] MLContext.createTensor {dataType: ${dataType}, ${fallbackDataType ? `fallbackDataType: ${fallbackDataType},` : ""} shape: ${shape}}`
        );
        const tensor = await context.createTensor({
          dataType: fallbackDataType ?? dataType,
          // If fallback data type is provided, use it.
          shape,
          dimensions: shape,
          usage,
          writable,
          readable
        });
        return new TensorWrapper({ sessionId, context, tensor, dataType, shape, fallbackDataType });
      }
      /**
       * Release tensor for reuse unless external.
       */
      releaseTensor(tensorWrapper) {
        if (this.externalTensors.has(tensorWrapper)) {
          this.externalTensors.delete(tensorWrapper);
        }
        this.freeTensors.push(tensorWrapper);
      }
    };
    createTensorManager = (...args) => new TensorManagerImpl(...args);
  }
});

// web/lib/wasm/jsep/backend-webnn.ts
var backend_webnn_exports = {};
__export(backend_webnn_exports, {
  WebNNBackend: () => WebNNBackend
});
var onnxDataTypeToWebnnDataType, compareMLContextOptions, WebNNBackend;
var init_backend_webnn = __esm({
  "web/lib/wasm/jsep/backend-webnn.ts"() {
    "use strict";
    init_wasm_common();
    init_wasm_factory();
    init_tensor_view();
    init_tensor_manager();
    init_log();
    onnxDataTypeToWebnnDataType = /* @__PURE__ */ new Map([
      [1 /* float */, "float32"],
      [10 /* float16 */, "float16"],
      [6 /* int32 */, "int32"],
      [12 /* uint32 */, "uint32"],
      [7 /* int64 */, "int64"],
      [13 /* uint64 */, "uint64"],
      [22 /* int4 */, "int4"],
      [21 /* uint4 */, "uint4"],
      [3 /* int8 */, "int8"],
      [2 /* uint8 */, "uint8"],
      [9 /* bool */, "uint8"]
    ]);
    compareMLContextOptions = (a, b) => {
      if (a === b) {
        return true;
      }
      if (a === void 0 || b === void 0) {
        return false;
      }
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      return aKeys.length === bKeys.length && aKeys.every((key, index) => key === bKeys[index] && a[key] === b[key]);
    };
    WebNNBackend = class {
      constructor(env3) {
        /**
         * Tensor managers for each session.
         */
        this.tensorManager = createTensorManager(this);
        /**
         * Maps from session id to MLContexts.
         */
        this.mlContextBySessionId = /* @__PURE__ */ new Map();
        /**
         * Maps from MLContext to session ids.
         */
        this.sessionIdsByMLContext = /* @__PURE__ */ new Map();
        /**
         * Cache of MLContexts.
         */
        this.mlContextCache = [];
        /**
         * Maps from session id to list of graph inputs.
         */
        this.sessionGraphInputs = /* @__PURE__ */ new Map();
        /**
         * Maps from session id to list of graph outputs.
         */
        this.sessionGraphOutputs = /* @__PURE__ */ new Map();
        /**
         * Temporary graph inputs for the current session.
         * These inputs will be registered when the session is created.
         */
        this.temporaryGraphInputs = [];
        /**
         * Temporary graph outputs for the current session.
         * These outputs will be registered when the session is created.
         */
        this.temporaryGraphOutputs = [];
        /**
         * Temporary tensors for the current session.
         */
        this.temporarySessionTensorIds = /* @__PURE__ */ new Map();
        /**
         * Maps from session id to MLOpSupportLimits.
         */
        this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map();
        configureLogger(env3.logLevel, !!env3.debug);
      }
      get currentSessionId() {
        if (this.activeSessionId === void 0) {
          throw new Error("No active session");
        }
        return this.activeSessionId;
      }
      onRunStart(sessionId) {
        LOG_DEBUG("verbose", () => `[WebNN] onRunStart {sessionId: ${sessionId}}`);
        this.activeSessionId = sessionId;
      }
      onRunEnd(sessionId) {
        LOG_DEBUG("verbose", () => `[WebNN] onRunEnd {sessionId: ${sessionId}}`);
        const tensorIds = this.temporarySessionTensorIds.get(sessionId);
        if (!tensorIds) {
          return;
        }
        for (const tensorId of tensorIds) {
          LOG_DEBUG("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${tensorId}}`);
          this.tensorManager.releaseTensorId(tensorId);
        }
        this.temporarySessionTensorIds.delete(sessionId);
        this.activeSessionId = void 0;
      }
      async createMLContext(optionsOrDevice) {
        if (optionsOrDevice instanceof GPUDevice) {
          const mlContextIndex2 = this.mlContextCache.findIndex((entry) => entry.gpuDevice === optionsOrDevice);
          if (mlContextIndex2 !== -1) {
            return this.mlContextCache[mlContextIndex2].mlContext;
          } else {
            const mlContext = await navigator.ml.createContext(optionsOrDevice);
            this.mlContextCache.push({ gpuDevice: optionsOrDevice, mlContext });
            return mlContext;
          }
        } else if (optionsOrDevice === void 0) {
          const mlContextIndex2 = this.mlContextCache.findIndex(
            (entry) => entry.options === void 0 && entry.gpuDevice === void 0
          );
          if (mlContextIndex2 !== -1) {
            return this.mlContextCache[mlContextIndex2].mlContext;
          } else {
            const mlContext = await navigator.ml.createContext();
            this.mlContextCache.push({ mlContext });
            return mlContext;
          }
        }
        const mlContextIndex = this.mlContextCache.findIndex(
          (entry) => compareMLContextOptions(entry.options, optionsOrDevice)
        );
        if (mlContextIndex !== -1) {
          return this.mlContextCache[mlContextIndex].mlContext;
        } else {
          const mlContext = await navigator.ml.createContext(optionsOrDevice);
          this.mlContextCache.push({ options: optionsOrDevice, mlContext });
          return mlContext;
        }
      }
      registerMLContext(sessionId, mlContext) {
        this.mlContextBySessionId.set(sessionId, mlContext);
        let sessionIds = this.sessionIdsByMLContext.get(mlContext);
        if (!sessionIds) {
          sessionIds = /* @__PURE__ */ new Set();
          this.sessionIdsByMLContext.set(mlContext, sessionIds);
        }
        sessionIds.add(sessionId);
        if (!this.mlOpSupportLimitsBySessionId.has(sessionId)) {
          this.mlOpSupportLimitsBySessionId.set(sessionId, mlContext.opSupportLimits());
        }
        if (this.temporaryGraphInputs.length > 0) {
          this.sessionGraphInputs.set(sessionId, this.temporaryGraphInputs);
          this.temporaryGraphInputs = [];
        }
        if (this.temporaryGraphOutputs.length > 0) {
          this.sessionGraphOutputs.set(sessionId, this.temporaryGraphOutputs);
          this.temporaryGraphOutputs = [];
        }
      }
      onReleaseSession(sessionId) {
        this.sessionGraphInputs.delete(sessionId);
        this.sessionGraphOutputs.delete(sessionId);
        const mlContext = this.mlContextBySessionId.get(sessionId);
        if (!mlContext) {
          return;
        }
        this.tensorManager.releaseTensorsForSession(sessionId);
        this.mlContextBySessionId.delete(sessionId);
        this.mlOpSupportLimitsBySessionId.delete(sessionId);
        const sessionIds = this.sessionIdsByMLContext.get(mlContext);
        sessionIds.delete(sessionId);
        if (sessionIds.size === 0) {
          this.sessionIdsByMLContext.delete(mlContext);
          const mlContextIndex = this.mlContextCache.findIndex((entry) => entry.mlContext === mlContext);
          if (mlContextIndex !== -1) {
            this.mlContextCache.splice(mlContextIndex, 1);
          }
        }
      }
      getMLContext(sessionId) {
        return this.mlContextBySessionId.get(sessionId);
      }
      getMLOpSupportLimits(sessionId) {
        return this.mlOpSupportLimitsBySessionId.get(sessionId);
      }
      reserveTensorId() {
        return this.tensorManager.reserveTensorId();
      }
      releaseTensorId(tensorId) {
        LOG_DEBUG("verbose", () => `[WebNN] releaseTensorId {tensorId: ${tensorId}}`);
        this.tensorManager.releaseTensorId(tensorId);
      }
      async ensureTensor(sessionId, tensorId, onnxDataType, dimensions, copyOld) {
        const webnnDataType = onnxDataTypeToWebnnDataType.get(onnxDataType);
        if (!webnnDataType) {
          throw new Error(`Unsupported ONNX data type: ${onnxDataType}`);
        }
        return this.tensorManager.ensureTensor(
          sessionId ?? this.currentSessionId,
          tensorId,
          webnnDataType,
          dimensions,
          copyOld
        );
      }
      async createTemporaryTensor(sessionId, onnxDataType, shape) {
        LOG_DEBUG("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${onnxDataType}, shape: ${shape}}`);
        const dataType = onnxDataTypeToWebnnDataType.get(onnxDataType);
        if (!dataType) {
          throw new Error(`Unsupported ONNX data type: ${onnxDataType}`);
        }
        const tensorId = this.tensorManager.reserveTensorId();
        await this.tensorManager.ensureTensor(sessionId, tensorId, dataType, shape, false);
        const tensorIds = this.temporarySessionTensorIds.get(sessionId);
        if (!tensorIds) {
          this.temporarySessionTensorIds.set(sessionId, [tensorId]);
        } else {
          tensorIds.push(tensorId);
        }
        return tensorId;
      }
      uploadTensor(tensorId, data) {
        const wasm2 = getInstance();
        if (!wasm2.shouldTransferToMLTensor) {
          throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
        }
        LOG_DEBUG("verbose", () => `[WebNN] uploadTensor {tensorId: ${tensorId}, data: ${data.byteLength}}`);
        this.tensorManager.upload(tensorId, data);
      }
      async downloadTensor(tensorId, dstBuffer) {
        return this.tensorManager.download(tensorId, dstBuffer);
      }
      createMLTensorDownloader(tensorId, type) {
        return async () => {
          const data = await this.tensorManager.download(tensorId);
          return createView(data, type);
        };
      }
      registerMLTensor(sessionId, tensor, onnxDataType, dimensions) {
        const webnnDataType = onnxDataTypeToWebnnDataType.get(onnxDataType);
        if (!webnnDataType) {
          throw new Error(`Unsupported ONNX data type: ${onnxDataType}`);
        }
        const id = this.tensorManager.registerTensor(sessionId, tensor, webnnDataType, dimensions);
        LOG_DEBUG(
          "verbose",
          () => `[WebNN] registerMLTensor {tensor: ${tensor}, dataType: ${webnnDataType}, dimensions: ${dimensions}} -> {tensorId: ${id}}`
        );
        return id;
      }
      // Register a WebNN Constant operand from external data.
      registerMLConstant(externalFilePath, dataOffset, dataLength, builder, desc, mountedFiles, shouldConvertInt64ToInt32 = false) {
        if (!mountedFiles) {
          throw new Error("External mounted files are not available.");
        }
        let filePath = externalFilePath;
        if (externalFilePath.startsWith("./")) {
          filePath = externalFilePath.substring(2);
        }
        const fileData = mountedFiles.get(filePath);
        if (!fileData) {
          throw new Error(`File with name ${filePath} not found in preloaded files.`);
        }
        if (dataOffset + dataLength > fileData.byteLength) {
          throw new Error("Out of bounds: data offset and length exceed the external file data size.");
        }
        const buffer = fileData.slice(dataOffset, dataOffset + dataLength).buffer;
        let bufferView;
        switch (desc.dataType) {
          case "float32":
            bufferView = new Float32Array(buffer);
            break;
          case "float16":
            bufferView = typeof Float16Array !== "undefined" && Float16Array.from ? new Float16Array(buffer) : new Uint16Array(buffer);
            break;
          case "int32":
            bufferView = new Int32Array(buffer);
            break;
          case "uint32":
            bufferView = new Uint32Array(buffer);
            break;
          case "int64":
            if (shouldConvertInt64ToInt32) {
              const int32Buffer = convertDataToInt32(new Uint8Array(buffer), "int64");
              bufferView = new Int32Array(int32Buffer.buffer);
              desc.dataType = "int32";
            } else {
              bufferView = new BigInt64Array(buffer);
            }
            break;
          case "uint64":
            bufferView = new BigUint64Array(buffer);
            break;
          case "int8":
            bufferView = new Int8Array(buffer);
            break;
          case "int4":
          case "uint4":
          case "uint8":
            bufferView = new Uint8Array(buffer);
            break;
          default:
            throw new Error(`Unsupported data type: ${desc.dataType} in creating WebNN Constant from external data.`);
        }
        LOG_DEBUG(
          "verbose",
          () => `[WebNN] registerMLConstant {dataType: ${desc.dataType}, shape: ${desc.shape}}} ${shouldConvertInt64ToInt32 ? "(Note: it was int64 data type and registered to int32 as workaround)" : ""}`
        );
        return builder.constant(desc, bufferView);
      }
      registerGraphInput(inputName) {
        this.temporaryGraphInputs.push(inputName);
      }
      registerGraphOutput(outputName) {
        this.temporaryGraphOutputs.push(outputName);
      }
      isGraphInput(sessionId, inputName) {
        const inputNames = this.sessionGraphInputs.get(sessionId);
        if (!inputNames) {
          return false;
        }
        return inputNames.includes(inputName);
      }
      isGraphOutput(sessionId, outputName) {
        const outputNames = this.sessionGraphOutputs.get(sessionId);
        if (!outputNames) {
          return false;
        }
        return outputNames.includes(outputName);
      }
      isGraphInputOutputTypeSupported(sessionId, type, isInput = true) {
        const dataType = onnxDataTypeToWebnnDataType.get(tensorDataTypeStringToEnum(type));
        const opLimits = this.mlOpSupportLimitsBySessionId.get(sessionId);
        if (typeof dataType === "undefined") {
          return false;
        }
        if (isInput) {
          return !!opLimits?.input.dataTypes.includes(dataType);
        } else {
          return !!opLimits?.output.dataTypes.includes(dataType);
        }
      }
      flush() {
      }
    };
  }
});

// web/lib/wasm/wasm-core-impl.ts
var initOrt, initRuntime, initEp, activeSessions, getSessionInputOutputCount, getSessionInputOutputMetadata, copyFromExternalBuffer, createSession, releaseSession, prepareInputOutputTensor, run, endProfiling, extractTransferableBuffers;
var init_wasm_core_impl = __esm({
  "web/lib/wasm/wasm-core-impl.ts"() {
    "use strict";
    init_esm();
    init_run_options();
    init_session_options();
    init_wasm_common();
    init_wasm_factory();
    init_wasm_utils();
    init_wasm_utils_load_file();
    initOrt = (numThreads, loggingLevel) => {
      const errorCode = getInstance()._OrtInit(numThreads, loggingLevel);
      if (errorCode !== 0) {
        checkLastError("Can't initialize onnxruntime.");
      }
    };
    initRuntime = async (env3) => {
      initOrt(env3.wasm.numThreads, logLevelStringToEnum(env3.logLevel));
    };
    initEp = async (env3, epName) => {
      getInstance().asyncInit?.();
      let webgpuAdapter = env3.webgpu.adapter;
      if (epName === "webgpu") {
        if (typeof navigator === "undefined" || !navigator.gpu) {
          throw new Error("WebGPU is not supported in current environment");
        }
        if (!webgpuAdapter) {
          const powerPreference = env3.webgpu.powerPreference;
          if (powerPreference !== void 0 && powerPreference !== "low-power" && powerPreference !== "high-performance") {
            throw new Error(`Invalid powerPreference setting: "${powerPreference}"`);
          }
          const forceFallbackAdapter = env3.webgpu.forceFallbackAdapter;
          if (forceFallbackAdapter !== void 0 && typeof forceFallbackAdapter !== "boolean") {
            throw new Error(`Invalid forceFallbackAdapter setting: "${forceFallbackAdapter}"`);
          }
          webgpuAdapter = await navigator.gpu.requestAdapter({ powerPreference, forceFallbackAdapter });
          if (!webgpuAdapter) {
            throw new Error(
              'Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.'
            );
          }
        } else {
          if (typeof webgpuAdapter.limits !== "object" || typeof webgpuAdapter.features !== "object" || typeof webgpuAdapter.requestDevice !== "function") {
            throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
          }
        }
      }
      if (epName === "webnn") {
        if (typeof navigator === "undefined" || !navigator.ml) {
          throw new Error("WebNN is not supported in current environment");
        }
      }
      if (false) {
        const initJsep = null.init;
        if (epName === "webgpu") {
          await initJsep("webgpu", getInstance(), env3, webgpuAdapter);
        }
        if (epName === "webnn") {
          await initJsep("webnn", getInstance(), env3);
        }
      } else {
        if (epName === "webgpu") {
          getInstance().webgpuInit((device) => {
            env3.webgpu.device = device;
          });
        }
        if (epName === "webnn") {
          const backend = new (init_backend_webnn(), __toCommonJS(backend_webnn_exports)).WebNNBackend(env3);
          getInstance().webnnInit([
            backend,
            // webnnReserveTensorId
            () => backend.reserveTensorId(),
            // webnnReleaseTensorId,
            (tensorId) => backend.releaseTensorId(tensorId),
            // webnnEnsureTensor
            async (sessionId, tensorId, onnxDataType, shape, copyOld) => backend.ensureTensor(sessionId, tensorId, onnxDataType, shape, copyOld),
            // webnnUploadTensor
            (tensorId, data) => {
              backend.uploadTensor(tensorId, data);
            },
            // webnnDownloadTensor
            async (tensorId, dstBuffer) => backend.downloadTensor(tensorId, dstBuffer),
            // webnnRegisterMLContext
            (sessionId, mlContext) => backend.registerMLContext(sessionId, mlContext),
            // webnnEnableTraceEvent
            !!env3.trace
          ]);
        }
      }
    };
    activeSessions = /* @__PURE__ */ new Map();
    getSessionInputOutputCount = (sessionHandle) => {
      const wasm2 = getInstance();
      const stack = wasm2.stackSave();
      try {
        const ptrSize = wasm2.PTR_SIZE;
        const dataOffset = wasm2.stackAlloc(2 * ptrSize);
        const errorCode = wasm2._OrtGetInputOutputCount(sessionHandle, dataOffset, dataOffset + ptrSize);
        if (errorCode !== 0) {
          checkLastError("Can't get session input/output count.");
        }
        const type = ptrSize === 4 ? "i32" : "i64";
        return [Number(wasm2.getValue(dataOffset, type)), Number(wasm2.getValue(dataOffset + ptrSize, type))];
      } finally {
        wasm2.stackRestore(stack);
      }
    };
    getSessionInputOutputMetadata = (sessionHandle, index) => {
      const wasm2 = getInstance();
      const stack = wasm2.stackSave();
      let metadataOffset = 0;
      try {
        const ptrSize = wasm2.PTR_SIZE;
        const dataOffset = wasm2.stackAlloc(2 * ptrSize);
        const errorCode = wasm2._OrtGetInputOutputMetadata(sessionHandle, index, dataOffset, dataOffset + ptrSize);
        if (errorCode !== 0) {
          checkLastError("Can't get session input/output metadata.");
        }
        const nameOffset = Number(wasm2.getValue(dataOffset, "*"));
        metadataOffset = Number(wasm2.getValue(dataOffset + ptrSize, "*"));
        const elementType = wasm2.HEAP32[metadataOffset / 4];
        if (elementType === 0) {
          return [nameOffset, 0];
        }
        const dimsCount = wasm2.HEAPU32[metadataOffset / 4 + 1];
        const dims = [];
        for (let i = 0; i < dimsCount; i++) {
          const symbolicDimNameOffset = Number(wasm2.getValue(metadataOffset + 8 + i * ptrSize, "*"));
          dims.push(
            symbolicDimNameOffset !== 0 ? wasm2.UTF8ToString(symbolicDimNameOffset) : Number(wasm2.getValue(metadataOffset + 8 + (i + dimsCount) * ptrSize, "*"))
          );
        }
        return [nameOffset, elementType, dims];
      } finally {
        wasm2.stackRestore(stack);
        if (metadataOffset !== 0) {
          wasm2._OrtFree(metadataOffset);
        }
      }
    };
    copyFromExternalBuffer = (model) => {
      const wasm2 = getInstance();
      const modelDataOffset = wasm2._malloc(model.byteLength);
      if (modelDataOffset === 0) {
        throw new Error(`Can't create a session. failed to allocate a buffer of size ${model.byteLength}.`);
      }
      wasm2.HEAPU8.set(model, modelDataOffset);
      return [modelDataOffset, model.byteLength];
    };
    createSession = async (modelData, options) => {
      let modelDataOffset, modelDataLength;
      const wasm2 = getInstance();
      if (Array.isArray(modelData)) {
        [modelDataOffset, modelDataLength] = modelData;
      } else if (modelData.buffer === wasm2.HEAPU8.buffer) {
        [modelDataOffset, modelDataLength] = [modelData.byteOffset, modelData.byteLength];
      } else {
        [modelDataOffset, modelDataLength] = copyFromExternalBuffer(modelData);
      }
      let sessionHandle = 0;
      let sessionOptionsHandle = 0;
      let ioBindingHandle = 0;
      let allocs = [];
      const inputNamesUTF8Encoded = [];
      const outputNamesUTF8Encoded = [];
      try {
        [sessionOptionsHandle, allocs] = await setSessionOptions(options);
        if (options?.externalData && wasm2.mountExternalData) {
          const loadingPromises = [];
          for (const file of options.externalData) {
            const path = typeof file === "string" ? file : file.path;
            loadingPromises.push(
              loadFile(typeof file === "string" ? file : file.data).then((data) => {
                wasm2.mountExternalData(path, data);
              })
            );
          }
          await Promise.all(loadingPromises);
        }
        for (const provider of options?.executionProviders ?? []) {
          const providerName = typeof provider === "string" ? provider : provider.name;
          if (providerName === "webnn") {
            wasm2.shouldTransferToMLTensor = false;
            if (typeof provider !== "string") {
              const webnnOptions = provider;
              const context = webnnOptions?.context;
              const gpuDevice = webnnOptions?.gpuDevice;
              const deviceType = webnnOptions?.deviceType;
              const powerPreference = webnnOptions?.powerPreference;
              if (context) {
                wasm2.currentContext = context;
              } else if (gpuDevice) {
                wasm2.currentContext = await wasm2.webnnCreateMLContext(gpuDevice);
              } else {
                wasm2.currentContext = await wasm2.webnnCreateMLContext({ deviceType, powerPreference });
              }
            } else {
              wasm2.currentContext = await wasm2.webnnCreateMLContext();
            }
            break;
          }
        }
        sessionHandle = await wasm2._OrtCreateSession(modelDataOffset, modelDataLength, sessionOptionsHandle);
        wasm2.webgpuOnCreateSession?.(sessionHandle);
        if (sessionHandle === 0) {
          checkLastError("Can't create a session.");
        }
        wasm2.jsepOnCreateSession?.();
        if (wasm2.currentContext) {
          wasm2.webnnRegisterMLContext(sessionHandle, wasm2.currentContext);
          wasm2.currentContext = void 0;
          wasm2.shouldTransferToMLTensor = true;
        }
        const [inputCount, outputCount] = getSessionInputOutputCount(sessionHandle);
        const enableGraphCapture = !!options?.enableGraphCapture;
        const inputNames = [];
        const outputNames = [];
        const inputMetadata = [];
        const outputMetadata = [];
        const outputPreferredLocations = [];
        for (let i = 0; i < inputCount; i++) {
          const [nameOffset, elementType, shape] = getSessionInputOutputMetadata(sessionHandle, i);
          if (nameOffset === 0) {
            checkLastError("Can't get an input name.");
          }
          inputNamesUTF8Encoded.push(nameOffset);
          const name = wasm2.UTF8ToString(nameOffset);
          inputNames.push(name);
          inputMetadata.push(
            elementType === 0 ? { name, isTensor: false } : { name, isTensor: true, type: tensorDataTypeEnumToString(elementType), shape }
          );
        }
        for (let i = 0; i < outputCount; i++) {
          const [nameOffset, elementType, shape] = getSessionInputOutputMetadata(sessionHandle, i + inputCount);
          if (nameOffset === 0) {
            checkLastError("Can't get an output name.");
          }
          outputNamesUTF8Encoded.push(nameOffset);
          const nameString = wasm2.UTF8ToString(nameOffset);
          outputNames.push(nameString);
          outputMetadata.push(
            elementType === 0 ? { name: nameString, isTensor: false } : { name: nameString, isTensor: true, type: tensorDataTypeEnumToString(elementType), shape }
          );
          if (true) {
            if (enableGraphCapture && options?.preferredOutputLocation === void 0) {
              outputPreferredLocations.push("gpu-buffer");
              continue;
            }
            const location2 = typeof options?.preferredOutputLocation === "string" ? options.preferredOutputLocation : options?.preferredOutputLocation?.[nameString] ?? "cpu";
            const isGraphOutput = wasm2.webnnIsGraphOutput;
            if (location2 === "cpu" && isGraphOutput && isGraphOutput(sessionHandle, nameString)) {
              outputPreferredLocations.push("ml-tensor-cpu-output");
              continue;
            }
            if (location2 !== "cpu" && location2 !== "cpu-pinned" && location2 !== "gpu-buffer" && location2 !== "ml-tensor") {
              throw new Error(`Not supported preferred output location: ${location2}.`);
            }
            if (enableGraphCapture && location2 !== "gpu-buffer") {
              throw new Error(
                `Not supported preferred output location: ${location2}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`
              );
            }
            outputPreferredLocations.push(location2);
          }
        }
        let bindingState = null;
        if (outputPreferredLocations.some((l) => l === "gpu-buffer" || l === "ml-tensor" || l === "ml-tensor-cpu-output")) {
          ioBindingHandle = wasm2._OrtCreateBinding(sessionHandle);
          if (ioBindingHandle === 0) {
            checkLastError("Can't create IO binding.");
          }
          bindingState = {
            handle: ioBindingHandle,
            outputPreferredLocations,
            outputPreferredLocationsEncoded: outputPreferredLocations.map((l) => l === "ml-tensor-cpu-output" ? "ml-tensor" : l).map((l) => dataLocationStringToEnum(l))
          };
        }
        activeSessions.set(sessionHandle, [
          sessionHandle,
          inputNamesUTF8Encoded,
          outputNamesUTF8Encoded,
          bindingState,
          enableGraphCapture,
          false
        ]);
        return [sessionHandle, inputNames, outputNames, inputMetadata, outputMetadata];
      } catch (e) {
        inputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
        outputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
        if (ioBindingHandle !== 0) {
          if (wasm2._OrtReleaseBinding(ioBindingHandle) !== 0) {
            checkLastError("Can't release IO binding.");
          }
        }
        if (sessionHandle !== 0) {
          if (wasm2._OrtReleaseSession(sessionHandle) !== 0) {
            checkLastError("Can't release session.");
          }
        }
        throw e;
      } finally {
        wasm2._free(modelDataOffset);
        if (sessionOptionsHandle !== 0) {
          if (wasm2._OrtReleaseSessionOptions(sessionOptionsHandle) !== 0) {
            checkLastError("Can't release session options.");
          }
        }
        allocs.forEach((alloc) => wasm2._free(alloc));
        wasm2.unmountExternalData?.();
      }
    };
    releaseSession = (sessionId) => {
      const wasm2 = getInstance();
      const session = activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`cannot release session. invalid session id: ${sessionId}`);
      }
      const [sessionHandle, inputNamesUTF8Encoded, outputNamesUTF8Encoded, ioBindingState, enableGraphCapture] = session;
      if (ioBindingState) {
        if (enableGraphCapture) {
          if (wasm2._OrtClearBoundOutputs(ioBindingState.handle) !== 0) {
            checkLastError("Can't clear bound outputs.");
          }
        }
        if (wasm2._OrtReleaseBinding(ioBindingState.handle) !== 0) {
          checkLastError("Can't release IO binding.");
        }
      }
      wasm2.jsepOnReleaseSession?.(sessionId);
      wasm2.webnnOnReleaseSession?.(sessionId);
      wasm2.webgpuOnReleaseSession?.(sessionId);
      inputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
      outputNamesUTF8Encoded.forEach((buf) => wasm2._OrtFree(buf));
      if (wasm2._OrtReleaseSession(sessionHandle) !== 0) {
        checkLastError("Can't release session.");
      }
      activeSessions.delete(sessionId);
    };
    prepareInputOutputTensor = async (tensor, tensorHandles, allocs, sessionId, tensorNameUTF8Encoded, index, enableGraphCapture = false) => {
      if (!tensor) {
        tensorHandles.push(0);
        return;
      }
      const wasm2 = getInstance();
      const ptrSize = wasm2.PTR_SIZE;
      const dataType = tensor[0];
      const dims = tensor[1];
      const location2 = tensor[3];
      let actualLocation = location2;
      let rawData;
      let dataByteLength;
      if (dataType === "string" && (location2 === "gpu-buffer" || location2 === "ml-tensor")) {
        throw new Error("String tensor is not supported on GPU.");
      }
      if (enableGraphCapture && location2 !== "gpu-buffer") {
        throw new Error(
          `External buffer must be provided for input/output index ${index} when enableGraphCapture is true.`
        );
      }
      if (location2 === "gpu-buffer") {
        const gpuBuffer = tensor[2].gpuBuffer;
        dataByteLength = calculateTensorSizeInBytes(tensorDataTypeStringToEnum(dataType), dims);
        if (true) {
          const registerBuffer = wasm2.webgpuRegisterBuffer;
          if (!registerBuffer) {
            throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
          }
          rawData = registerBuffer(gpuBuffer, sessionId);
        } else {
          const registerBuffer = wasm2.jsepRegisterBuffer;
          if (!registerBuffer) {
            throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
          }
          rawData = registerBuffer(sessionId, index, gpuBuffer, dataByteLength);
        }
      } else if (location2 === "ml-tensor") {
        const mlTensor = tensor[2].mlTensor;
        dataByteLength = calculateTensorSizeInBytes(tensorDataTypeStringToEnum(dataType), dims);
        const registerMLTensor = wasm2.webnnRegisterMLTensor;
        if (!registerMLTensor) {
          throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
        }
        rawData = registerMLTensor(sessionId, mlTensor, tensorDataTypeStringToEnum(dataType), dims);
      } else {
        const data = tensor[2];
        if (Array.isArray(data)) {
          dataByteLength = ptrSize * data.length;
          rawData = wasm2._malloc(dataByteLength);
          allocs.push(rawData);
          for (let i = 0; i < data.length; i++) {
            if (typeof data[i] !== "string") {
              throw new TypeError(`tensor data at index ${i} is not a string`);
            }
            wasm2.setValue(rawData + i * ptrSize, allocWasmString(data[i], allocs), "*");
          }
        } else {
          const isGraphInput = wasm2.webnnIsGraphInput;
          const isGraphOutput = wasm2.webnnIsGraphOutput;
          if (dataType !== "string" && isGraphInput && isGraphOutput) {
            const tensorName = wasm2.UTF8ToString(tensorNameUTF8Encoded);
            if (isGraphInput(sessionId, tensorName) || isGraphOutput(sessionId, tensorName)) {
              const dataTypeEnum = tensorDataTypeStringToEnum(dataType);
              dataByteLength = calculateTensorSizeInBytes(dataTypeEnum, dims);
              actualLocation = "ml-tensor";
              const createTemporaryTensor = wasm2.webnnCreateTemporaryTensor;
              const uploadTensor = wasm2.webnnUploadTensor;
              if (!createTemporaryTensor || !uploadTensor) {
                throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
              }
              const tensorId = await createTemporaryTensor(sessionId, dataTypeEnum, dims);
              uploadTensor(tensorId, new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
              rawData = tensorId;
            } else {
              dataByteLength = data.byteLength;
              rawData = wasm2._malloc(dataByteLength);
              allocs.push(rawData);
              wasm2.HEAPU8.set(new Uint8Array(data.buffer, data.byteOffset, dataByteLength), rawData);
            }
          } else {
            dataByteLength = data.byteLength;
            rawData = wasm2._malloc(dataByteLength);
            allocs.push(rawData);
            wasm2.HEAPU8.set(new Uint8Array(data.buffer, data.byteOffset, dataByteLength), rawData);
          }
        }
      }
      const stack = wasm2.stackSave();
      const dimsOffset = wasm2.stackAlloc(4 * dims.length);
      try {
        dims.forEach((d, index2) => wasm2.setValue(dimsOffset + index2 * ptrSize, d, ptrSize === 4 ? "i32" : "i64"));
        const tensor2 = wasm2._OrtCreateTensor(
          tensorDataTypeStringToEnum(dataType),
          rawData,
          dataByteLength,
          dimsOffset,
          dims.length,
          dataLocationStringToEnum(actualLocation)
        );
        if (tensor2 === 0) {
          checkLastError(`Can't create tensor for input/output. session=${sessionId}, index=${index}.`);
        }
        tensorHandles.push(tensor2);
      } finally {
        wasm2.stackRestore(stack);
      }
    };
    run = async (sessionId, inputIndices, inputTensors, outputIndices, outputTensors, options) => {
      const wasm2 = getInstance();
      const ptrSize = wasm2.PTR_SIZE;
      const session = activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`cannot run inference. invalid session id: ${sessionId}`);
      }
      const sessionHandle = session[0];
      const inputNamesUTF8Encoded = session[1];
      const outputNamesUTF8Encoded = session[2];
      const ioBindingState = session[3];
      const enableGraphCapture = session[4];
      const inputOutputBound = session[5];
      const inputCount = inputIndices.length;
      const outputCount = outputIndices.length;
      let runOptionsHandle = 0;
      let runOptionsAllocs = [];
      const inputTensorHandles = [];
      const outputTensorHandles = [];
      const inputOutputAllocs = [];
      const preAllocatedOutputs = [];
      const beforeRunStack = wasm2.stackSave();
      const inputValuesOffset = wasm2.stackAlloc(inputCount * ptrSize);
      const inputNamesOffset = wasm2.stackAlloc(inputCount * ptrSize);
      const outputValuesOffset = wasm2.stackAlloc(outputCount * ptrSize);
      const outputNamesOffset = wasm2.stackAlloc(outputCount * ptrSize);
      try {
        [runOptionsHandle, runOptionsAllocs] = setRunOptions(options);
        TRACE_EVENT_BEGIN("wasm prepareInputOutputTensor");
        for (let i = 0; i < inputCount; i++) {
          await prepareInputOutputTensor(
            inputTensors[i],
            inputTensorHandles,
            inputOutputAllocs,
            sessionId,
            inputNamesUTF8Encoded[inputIndices[i]],
            inputIndices[i],
            enableGraphCapture
          );
        }
        for (let i = 0; i < outputCount; i++) {
          await prepareInputOutputTensor(
            outputTensors[i],
            outputTensorHandles,
            inputOutputAllocs,
            sessionId,
            outputNamesUTF8Encoded[outputIndices[i]],
            inputCount + outputIndices[i],
            enableGraphCapture
          );
        }
        TRACE_EVENT_END("wasm prepareInputOutputTensor");
        for (let i = 0; i < inputCount; i++) {
          wasm2.setValue(inputValuesOffset + i * ptrSize, inputTensorHandles[i], "*");
          wasm2.setValue(inputNamesOffset + i * ptrSize, inputNamesUTF8Encoded[inputIndices[i]], "*");
        }
        for (let i = 0; i < outputCount; i++) {
          wasm2.setValue(outputValuesOffset + i * ptrSize, outputTensorHandles[i], "*");
          wasm2.setValue(outputNamesOffset + i * ptrSize, outputNamesUTF8Encoded[outputIndices[i]], "*");
        }
        if (ioBindingState && !inputOutputBound) {
          const { handle, outputPreferredLocations, outputPreferredLocationsEncoded } = ioBindingState;
          if (inputNamesUTF8Encoded.length !== inputCount) {
            throw new Error(
              `input count from feeds (${inputCount}) is expected to be always equal to model's input count (${inputNamesUTF8Encoded.length}).`
            );
          }
          TRACE_EVENT_BEGIN("wasm bindInputsOutputs");
          for (let i = 0; i < inputCount; i++) {
            const index = inputIndices[i];
            const errorCode2 = await wasm2._OrtBindInput(handle, inputNamesUTF8Encoded[index], inputTensorHandles[i]);
            if (errorCode2 !== 0) {
              checkLastError(`Can't bind input[${i}] for session=${sessionId}.`);
            }
          }
          for (let i = 0; i < outputCount; i++) {
            const index = outputIndices[i];
            const location2 = outputTensors[i]?.[3];
            if (location2) {
              preAllocatedOutputs.push(outputTensorHandles[i]);
              const errorCode2 = wasm2._OrtBindOutput(handle, outputNamesUTF8Encoded[index], outputTensorHandles[i], 0);
              if (errorCode2 !== 0) {
                checkLastError(`Can't bind pre-allocated output[${i}] for session=${sessionId}.`);
              }
            } else {
              const errorCode2 = wasm2._OrtBindOutput(
                handle,
                outputNamesUTF8Encoded[index],
                0,
                outputPreferredLocationsEncoded[index]
              );
              if (errorCode2 !== 0) {
                checkLastError(`Can't bind output[${i}] to ${outputPreferredLocations[i]} for session=${sessionId}.`);
              }
            }
          }
          TRACE_EVENT_END("wasm bindInputsOutputs");
          activeSessions.set(sessionId, [
            sessionHandle,
            inputNamesUTF8Encoded,
            outputNamesUTF8Encoded,
            ioBindingState,
            enableGraphCapture,
            true
          ]);
        }
        wasm2.jsepOnRunStart?.(sessionHandle);
        wasm2.webnnOnRunStart?.(sessionHandle);
        let errorCode;
        if (ioBindingState) {
          errorCode = await wasm2._OrtRunWithBinding(
            sessionHandle,
            ioBindingState.handle,
            outputCount,
            outputValuesOffset,
            runOptionsHandle
          );
        } else {
          errorCode = await wasm2._OrtRun(
            sessionHandle,
            inputNamesOffset,
            inputValuesOffset,
            inputCount,
            outputNamesOffset,
            outputCount,
            outputValuesOffset,
            runOptionsHandle
          );
        }
        if (errorCode !== 0) {
          checkLastError("failed to call OrtRun().");
        }
        const output = [];
        const outputPromises = [];
        TRACE_EVENT_BEGIN("wasm ProcessOutputTensor");
        for (let i = 0; i < outputCount; i++) {
          const tensor = Number(wasm2.getValue(outputValuesOffset + i * ptrSize, "*"));
          if (tensor === outputTensorHandles[i] || preAllocatedOutputs.includes(outputTensorHandles[i])) {
            output.push(outputTensors[i]);
            if (tensor !== outputTensorHandles[i]) {
              if (wasm2._OrtReleaseTensor(tensor) !== 0) {
                checkLastError("Can't release tensor.");
              }
            }
            continue;
          }
          const beforeGetTensorDataStack = wasm2.stackSave();
          const tensorDataOffset = wasm2.stackAlloc(4 * ptrSize);
          let keepOutputTensor = false;
          let type, dataOffset = 0;
          try {
            const errorCode2 = wasm2._OrtGetTensorData(
              tensor,
              tensorDataOffset,
              tensorDataOffset + ptrSize,
              tensorDataOffset + 2 * ptrSize,
              tensorDataOffset + 3 * ptrSize
            );
            if (errorCode2 !== 0) {
              checkLastError(`Can't access output tensor data on index ${i}.`);
            }
            const valueType = ptrSize === 4 ? "i32" : "i64";
            const dataType = Number(wasm2.getValue(tensorDataOffset, valueType));
            dataOffset = wasm2.getValue(tensorDataOffset + ptrSize, "*");
            const dimsOffset = wasm2.getValue(tensorDataOffset + ptrSize * 2, "*");
            const dimsLength = Number(wasm2.getValue(tensorDataOffset + ptrSize * 3, valueType));
            const dims = [];
            for (let i2 = 0; i2 < dimsLength; i2++) {
              dims.push(Number(wasm2.getValue(dimsOffset + i2 * ptrSize, valueType)));
            }
            if (wasm2._OrtFree(dimsOffset) !== 0) {
              checkLastError("Can't free memory for tensor dims.");
            }
            const size = dims.reduce((a, b) => a * b, 1);
            type = tensorDataTypeEnumToString(dataType);
            const preferredLocation = ioBindingState?.outputPreferredLocations[outputIndices[i]];
            if (type === "string") {
              if (preferredLocation === "gpu-buffer" || preferredLocation === "ml-tensor") {
                throw new Error("String tensor is not supported on GPU.");
              }
              const stringData = [];
              for (let i2 = 0; i2 < size; i2++) {
                const offset = wasm2.getValue(dataOffset + i2 * ptrSize, "*");
                const nextOffset = wasm2.getValue(dataOffset + (i2 + 1) * ptrSize, "*");
                const maxBytesToRead = i2 === size - 1 ? void 0 : nextOffset - offset;
                stringData.push(wasm2.UTF8ToString(offset, maxBytesToRead));
              }
              output.push([type, dims, stringData, "cpu"]);
            } else {
              if (preferredLocation === "gpu-buffer" && size > 0) {
                const getBuffer = true ? wasm2.webgpuGetBuffer : wasm2.jsepGetBuffer;
                if (!getBuffer) {
                  throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
                }
                const gpuBuffer = getBuffer(dataOffset);
                const bufferSize = calculateTensorSizeInBytes(dataType, size);
                if (bufferSize === void 0 || !isGpuBufferSupportedType(type)) {
                  throw new Error(`Unsupported data type: ${type}`);
                }
                keepOutputTensor = true;
                if (true) {
                  wasm2.webgpuRegisterBuffer(gpuBuffer, sessionId, dataOffset);
                  const downloadDataFunction = wasm2.webgpuCreateDownloader(gpuBuffer, bufferSize, sessionId);
                  output.push([
                    type,
                    dims,
                    {
                      gpuBuffer,
                      download: async () => {
                        const arrayBuffer = await downloadDataFunction();
                        const data = new (tensorTypeToTypedArrayConstructor(type))(arrayBuffer);
                        return data;
                      },
                      dispose: () => {
                        if (wasm2._OrtReleaseTensor(tensor) !== 0) {
                          checkLastError("Can't release tensor.");
                        }
                      }
                    },
                    "gpu-buffer"
                  ]);
                } else {
                  output.push([
                    type,
                    dims,
                    {
                      gpuBuffer,
                      download: wasm2.jsepCreateDownloader(gpuBuffer, bufferSize, type),
                      dispose: () => {
                        if (wasm2._OrtReleaseTensor(tensor) !== 0) {
                          checkLastError("Can't release tensor.");
                        }
                      }
                    },
                    "gpu-buffer"
                  ]);
                }
              } else if (preferredLocation === "ml-tensor" && size > 0) {
                const ensureTensor = wasm2.webnnEnsureTensor;
                const isGraphInputOutputTypeSupported = wasm2.webnnIsGraphInputOutputTypeSupported;
                if (!ensureTensor || !isGraphInputOutputTypeSupported) {
                  throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
                }
                const tensorSize = calculateTensorSizeInBytes(dataType, size);
                if (tensorSize === void 0 || !isMLTensorSupportedType(type)) {
                  throw new Error(`Unsupported data type: ${type}`);
                }
                if (!isGraphInputOutputTypeSupported(sessionId, type, false)) {
                  throw new Error(
                    `preferredLocation "ml-tensor" for ${type} output is not supported by current WebNN Context.`
                  );
                }
                const mlTensor = await ensureTensor(sessionId, dataOffset, dataType, dims, false);
                keepOutputTensor = true;
                output.push([
                  type,
                  dims,
                  {
                    mlTensor,
                    download: wasm2.webnnCreateMLTensorDownloader(dataOffset, type),
                    dispose: () => {
                      wasm2.webnnReleaseTensorId(dataOffset);
                      wasm2._OrtReleaseTensor(tensor);
                    }
                  },
                  "ml-tensor"
                ]);
              } else if (preferredLocation === "ml-tensor-cpu-output" && size > 0) {
                const data = wasm2.webnnCreateMLTensorDownloader(dataOffset, type)();
                const index = output.length;
                keepOutputTensor = true;
                outputPromises.push(
                  (async () => {
                    const result = [index, await data];
                    wasm2.webnnReleaseTensorId(dataOffset);
                    wasm2._OrtReleaseTensor(tensor);
                    return result;
                  })()
                );
                output.push([type, dims, [], "cpu"]);
              } else {
                const typedArrayConstructor = tensorTypeToTypedArrayConstructor(type);
                const data = new typedArrayConstructor(size);
                new Uint8Array(data.buffer, data.byteOffset, data.byteLength).set(
                  wasm2.HEAPU8.subarray(dataOffset, dataOffset + data.byteLength)
                );
                output.push([type, dims, data, "cpu"]);
              }
            }
          } finally {
            wasm2.stackRestore(beforeGetTensorDataStack);
            if (type === "string" && dataOffset) {
              wasm2._free(dataOffset);
            }
            if (!keepOutputTensor) {
              wasm2._OrtReleaseTensor(tensor);
            }
          }
        }
        if (ioBindingState && !enableGraphCapture) {
          if (wasm2._OrtClearBoundOutputs(ioBindingState.handle) !== 0) {
            checkLastError("Can't clear bound outputs.");
          }
          activeSessions.set(sessionId, [
            sessionHandle,
            inputNamesUTF8Encoded,
            outputNamesUTF8Encoded,
            ioBindingState,
            enableGraphCapture,
            false
          ]);
        }
        for (const [index, data] of await Promise.all(outputPromises)) {
          output[index][2] = data;
        }
        TRACE_EVENT_END("wasm ProcessOutputTensor");
        return output;
      } finally {
        wasm2.webnnOnRunEnd?.(sessionHandle);
        wasm2.stackRestore(beforeRunStack);
        if (true) {
          inputTensors.forEach((t) => {
            if (t && t[3] === "gpu-buffer") {
              wasm2.webgpuUnregisterBuffer(t[2].gpuBuffer);
            }
          });
          outputTensors.forEach((t) => {
            if (t && t[3] === "gpu-buffer") {
              wasm2.webgpuUnregisterBuffer(t[2].gpuBuffer);
            }
          });
        }
        inputTensorHandles.forEach((v) => wasm2._OrtReleaseTensor(v));
        outputTensorHandles.forEach((v) => wasm2._OrtReleaseTensor(v));
        inputOutputAllocs.forEach((p) => wasm2._free(p));
        if (runOptionsHandle !== 0) {
          wasm2._OrtReleaseRunOptions(runOptionsHandle);
        }
        runOptionsAllocs.forEach((p) => wasm2._free(p));
      }
    };
    endProfiling = (sessionId) => {
      const wasm2 = getInstance();
      const session = activeSessions.get(sessionId);
      if (!session) {
        throw new Error("invalid session id");
      }
      const sessionHandle = session[0];
      const profileFileName = wasm2._OrtEndProfiling(sessionHandle);
      if (profileFileName === 0) {
        checkLastError("Can't get an profile file name.");
      }
      wasm2._OrtFree(profileFileName);
    };
    extractTransferableBuffers = (tensors) => {
      const buffers = [];
      for (const tensor of tensors) {
        const data = tensor[2];
        if (!Array.isArray(data) && "buffer" in data) {
          buffers.push(data.buffer);
        }
      }
      return buffers;
    };
  }
});

// web/lib/wasm/proxy-wrapper.ts
var isProxy, proxyWorker, initializing2, initialized2, aborted2, temporaryObjectUrl, initWasmCallbacks, queuedCallbacks, enqueueCallbacks, ensureWorker, onProxyWorkerMessage, initializeWebAssemblyAndOrtRuntime, initializeOrtEp, copyFromExternalBuffer2, createSession2, releaseSession2, run2, endProfiling2;
var init_proxy_wrapper = __esm({
  "web/lib/wasm/proxy-wrapper.ts"() {
    "use strict";
    init_esm();
    init_wasm_core_impl();
    init_wasm_factory();
    init_wasm_utils_import();
    isProxy = () => !!env2.wasm.proxy && typeof document !== "undefined";
    initializing2 = false;
    initialized2 = false;
    aborted2 = false;
    queuedCallbacks = /* @__PURE__ */ new Map();
    enqueueCallbacks = (type, callbacks) => {
      const queue = queuedCallbacks.get(type);
      if (queue) {
        queue.push(callbacks);
      } else {
        queuedCallbacks.set(type, [callbacks]);
      }
    };
    ensureWorker = () => {
      if (initializing2 || !initialized2 || aborted2 || !proxyWorker) {
        throw new Error("worker not ready");
      }
    };
    onProxyWorkerMessage = (ev) => {
      switch (ev.data.type) {
        case "init-wasm":
          initializing2 = false;
          if (ev.data.err) {
            aborted2 = true;
            initWasmCallbacks[1](ev.data.err);
          } else {
            initialized2 = true;
            initWasmCallbacks[0]();
          }
          if (temporaryObjectUrl) {
            URL.revokeObjectURL(temporaryObjectUrl);
            temporaryObjectUrl = void 0;
          }
          break;
        case "init-ep":
        case "copy-from":
        case "create":
        case "release":
        case "run":
        case "end-profiling": {
          const callbacks = queuedCallbacks.get(ev.data.type);
          if (ev.data.err) {
            callbacks.shift()[1](ev.data.err);
          } else {
            callbacks.shift()[0](ev.data.out);
          }
          break;
        }
        default:
      }
    };
    initializeWebAssemblyAndOrtRuntime = async () => {
      if (initialized2) {
        return;
      }
      if (initializing2) {
        throw new Error("multiple calls to 'initWasm()' detected.");
      }
      if (aborted2) {
        throw new Error("previous call to 'initWasm()' failed.");
      }
      initializing2 = true;
      if (isProxy()) {
        return new Promise((resolve, reject) => {
          proxyWorker?.terminate();
          void importProxyWorker().then(([objectUrl, worker]) => {
            try {
              proxyWorker = worker;
              proxyWorker.onerror = (ev) => reject(ev);
              proxyWorker.onmessage = onProxyWorkerMessage;
              initWasmCallbacks = [resolve, reject];
              const message = { type: "init-wasm", in: env2 };
              if (!message.in.wasm.wasmPaths && objectUrl) {
                const inferredWasmPathPrefix = inferWasmPathPrefixFromScriptSrc();
                if (inferredWasmPathPrefix) {
                  message.in.wasm.wasmPaths = inferredWasmPathPrefix;
                }
              }
              if (false) {
                message.in.wasm.wasmPaths = {
                  wasm: false ? new URL("ort-wasm-simd-threaded.jsep.wasm", import.meta.url).href : true ? new URL("ort-wasm-simd-threaded.jspi.wasm", import.meta.url).href : true ? new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href : new URL("ort-wasm-simd-threaded.wasm", import.meta.url).href
                };
              }
              proxyWorker.postMessage(message);
              temporaryObjectUrl = objectUrl;
            } catch (e) {
              reject(e);
            }
          }, reject);
        });
      } else {
        try {
          await initializeWebAssembly(env2.wasm);
          await initRuntime(env2);
          initialized2 = true;
        } catch (e) {
          aborted2 = true;
          throw e;
        } finally {
          initializing2 = false;
        }
      }
    };
    initializeOrtEp = async (epName) => {
      if (isProxy()) {
        ensureWorker();
        return new Promise((resolve, reject) => {
          enqueueCallbacks("init-ep", [resolve, reject]);
          const message = { type: "init-ep", in: { epName, env: env2 } };
          proxyWorker.postMessage(message);
        });
      } else {
        await initEp(env2, epName);
      }
    };
    copyFromExternalBuffer2 = async (buffer) => {
      if (isProxy()) {
        ensureWorker();
        return new Promise((resolve, reject) => {
          enqueueCallbacks("copy-from", [resolve, reject]);
          const message = { type: "copy-from", in: { buffer } };
          proxyWorker.postMessage(message, [buffer.buffer]);
        });
      } else {
        return copyFromExternalBuffer(buffer);
      }
    };
    createSession2 = async (model, options) => {
      if (isProxy()) {
        if (options?.preferredOutputLocation) {
          throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
        }
        ensureWorker();
        return new Promise((resolve, reject) => {
          enqueueCallbacks("create", [resolve, reject]);
          const message = { type: "create", in: { model, options: { ...options } } };
          const transferable = [];
          if (model instanceof Uint8Array) {
            transferable.push(model.buffer);
          }
          proxyWorker.postMessage(message, transferable);
        });
      } else {
        return createSession(model, options);
      }
    };
    releaseSession2 = async (sessionId) => {
      if (isProxy()) {
        ensureWorker();
        return new Promise((resolve, reject) => {
          enqueueCallbacks("release", [resolve, reject]);
          const message = { type: "release", in: sessionId };
          proxyWorker.postMessage(message);
        });
      } else {
        releaseSession(sessionId);
      }
    };
    run2 = async (sessionId, inputIndices, inputs, outputIndices, outputs, options) => {
      if (isProxy()) {
        if (inputs.some((t) => t[3] !== "cpu")) {
          throw new Error("input tensor on GPU is not supported for proxy.");
        }
        if (outputs.some((t) => t)) {
          throw new Error("pre-allocated output tensor is not supported for proxy.");
        }
        ensureWorker();
        return new Promise((resolve, reject) => {
          enqueueCallbacks("run", [resolve, reject]);
          const serializableInputs = inputs;
          const message = {
            type: "run",
            in: { sessionId, inputIndices, inputs: serializableInputs, outputIndices, options }
          };
          proxyWorker.postMessage(message, extractTransferableBuffers(serializableInputs));
        });
      } else {
        return run(sessionId, inputIndices, inputs, outputIndices, outputs, options);
      }
    };
    endProfiling2 = async (sessionId) => {
      if (isProxy()) {
        ensureWorker();
        return new Promise((resolve, reject) => {
          enqueueCallbacks("end-profiling", [resolve, reject]);
          const message = { type: "end-profiling", in: sessionId };
          proxyWorker.postMessage(message);
        });
      } else {
        endProfiling(sessionId);
      }
    };
  }
});

// web/lib/wasm/session-handler-inference.ts
var encodeTensorMetadata, decodeTensorMetadata, OnnxruntimeWebAssemblySessionHandler;
var init_session_handler_inference = __esm({
  "web/lib/wasm/session-handler-inference.ts"() {
    "use strict";
    init_esm();
    init_proxy_wrapper();
    init_wasm_common();
    init_wasm_utils_env();
    init_wasm_utils_load_file();
    encodeTensorMetadata = (tensor, getName) => {
      switch (tensor.location) {
        case "cpu":
          return [tensor.type, tensor.dims, tensor.data, "cpu"];
        case "gpu-buffer":
          return [tensor.type, tensor.dims, { gpuBuffer: tensor.gpuBuffer }, "gpu-buffer"];
        case "ml-tensor":
          return [tensor.type, tensor.dims, { mlTensor: tensor.mlTensor }, "ml-tensor"];
        default:
          throw new Error(`invalid data location: ${tensor.location} for ${getName()}`);
      }
    };
    decodeTensorMetadata = (tensor) => {
      switch (tensor[3]) {
        case "cpu":
          return new Tensor2(tensor[0], tensor[2], tensor[1]);
        case "gpu-buffer": {
          const dataType = tensor[0];
          if (!isGpuBufferSupportedType(dataType)) {
            throw new Error(`not supported data type: ${dataType} for deserializing GPU tensor`);
          }
          const { gpuBuffer, download, dispose } = tensor[2];
          return Tensor2.fromGpuBuffer(gpuBuffer, { dataType, dims: tensor[1], download, dispose });
        }
        case "ml-tensor": {
          const dataType = tensor[0];
          if (!isMLTensorSupportedType(dataType)) {
            throw new Error(`not supported data type: ${dataType} for deserializing MLTensor tensor`);
          }
          const { mlTensor, download, dispose } = tensor[2];
          return Tensor2.fromMLTensor(mlTensor, { dataType, dims: tensor[1], download, dispose });
        }
        default:
          throw new Error(`invalid data location: ${tensor[3]}`);
      }
    };
    OnnxruntimeWebAssemblySessionHandler = class {
      async fetchModelAndCopyToWasmMemory(path) {
        return copyFromExternalBuffer2(await loadFile(path));
      }
      async loadModel(pathOrBuffer, options) {
        TRACE_FUNC_BEGIN();
        let model;
        if (typeof pathOrBuffer === "string") {
          if (isNode) {
            model = await loadFile(pathOrBuffer);
          } else {
            model = await this.fetchModelAndCopyToWasmMemory(pathOrBuffer);
          }
        } else {
          model = pathOrBuffer;
        }
        [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await createSession2(
          model,
          options
        );
        TRACE_FUNC_END();
      }
      async dispose() {
        return releaseSession2(this.sessionId);
      }
      async run(feeds, fetches, options) {
        TRACE_FUNC_BEGIN();
        const inputArray = [];
        const inputIndices = [];
        Object.entries(feeds).forEach((kvp) => {
          const name = kvp[0];
          const tensor = kvp[1];
          const index = this.inputNames.indexOf(name);
          if (index === -1) {
            throw new Error(`invalid input '${name}'`);
          }
          inputArray.push(tensor);
          inputIndices.push(index);
        });
        const outputArray = [];
        const outputIndices = [];
        Object.entries(fetches).forEach((kvp) => {
          const name = kvp[0];
          const tensor = kvp[1];
          const index = this.outputNames.indexOf(name);
          if (index === -1) {
            throw new Error(`invalid output '${name}'`);
          }
          outputArray.push(tensor);
          outputIndices.push(index);
        });
        const inputs = inputArray.map(
          (t, i) => encodeTensorMetadata(t, () => `input "${this.inputNames[inputIndices[i]]}"`)
        );
        const outputs = outputArray.map(
          (t, i) => t ? encodeTensorMetadata(t, () => `output "${this.outputNames[outputIndices[i]]}"`) : null
        );
        const results = await run2(this.sessionId, inputIndices, inputs, outputIndices, outputs, options);
        const resultMap = {};
        for (let i = 0; i < results.length; i++) {
          resultMap[this.outputNames[outputIndices[i]]] = outputArray[i] ?? decodeTensorMetadata(results[i]);
        }
        TRACE_FUNC_END();
        return resultMap;
      }
      startProfiling() {
      }
      endProfiling() {
        void endProfiling2(this.sessionId);
      }
    };
  }
});

// web/lib/backend-wasm.ts
var backend_wasm_exports = {};
__export(backend_wasm_exports, {
  OnnxruntimeWebAssemblyBackend: () => OnnxruntimeWebAssemblyBackend,
  initializeFlags: () => initializeFlags,
  wasmBackend: () => wasmBackend
});
var initializeFlags, OnnxruntimeWebAssemblyBackend, wasmBackend;
var init_backend_wasm = __esm({
  "web/lib/backend-wasm.ts"() {
    "use strict";
    init_esm();
    init_proxy_wrapper();
    init_session_handler_inference();
    initializeFlags = () => {
      if (typeof env2.wasm.initTimeout !== "number" || env2.wasm.initTimeout < 0) {
        env2.wasm.initTimeout = 0;
      }
      const simd = env2.wasm.simd;
      if (typeof simd !== "boolean" && simd !== void 0 && simd !== "fixed" && simd !== "relaxed") {
        console.warn(
          `Property "env.wasm.simd" is set to unknown value "${simd}". Reset it to \`false\` and ignore SIMD feature checking.`
        );
        env2.wasm.simd = false;
      }
      if (typeof env2.wasm.proxy !== "boolean") {
        env2.wasm.proxy = false;
      }
      if (typeof env2.wasm.trace !== "boolean") {
        env2.wasm.trace = false;
      }
      if (typeof env2.wasm.numThreads !== "number" || !Number.isInteger(env2.wasm.numThreads) || env2.wasm.numThreads <= 0) {
        if (typeof self !== "undefined" && !self.crossOriginIsolated) {
          env2.wasm.numThreads = 1;
        } else {
          const numCpuLogicalCores = typeof navigator === "undefined" ? __require("node:os").cpus().length : navigator.hardwareConcurrency;
          env2.wasm.numThreads = Math.min(4, Math.ceil((numCpuLogicalCores || 1) / 2));
        }
      }
    };
    OnnxruntimeWebAssemblyBackend = class {
      /**
       * This function initializes the WebAssembly backend.
       *
       * This function will be called only once for each backend name. It will be called the first time when
       * `ort.InferenceSession.create()` is called with a registered backend name.
       *
       * @param backendName - the registered backend name.
       */
      async init(backendName) {
        initializeFlags();
        await initializeWebAssemblyAndOrtRuntime();
        await initializeOrtEp(backendName);
      }
      async createInferenceSessionHandler(pathOrBuffer, options) {
        const handler = new OnnxruntimeWebAssemblySessionHandler();
        await handler.loadModel(pathOrBuffer, options);
        return handler;
      }
    };
    wasmBackend = new OnnxruntimeWebAssemblyBackend();
  }
});

// web/lib/index.ts
init_esm();
init_esm();
init_esm();

// web/lib/version.ts
var version2 = "1.25.0-dev.20260327-722743c0e2";

// web/lib/index.ts
var index_default = esm_exports;
if (false) {
  const onnxjsBackend = null.onnxjsBackend;
  registerBackend("webgl", onnxjsBackend, -10);
}
if (false) {
  throw new Error(
    "The current build is specified to enable both JSEP and WebGPU EP. This is not a valid configuration. JSEP and WebGPU EPs cannot be enabled at the same time."
  );
}
if (false) {
  throw new Error(
    "The current build is specified to enable WebNN EP without JSEP or WebGPU EP. This is not a valid configuration. WebNN EP requires either JSEP or WebGPU EP to be enabled."
  );
}
if (true) {
  const wasmBackend2 = (init_backend_wasm(), __toCommonJS(backend_wasm_exports)).wasmBackend;
  if (true) {
    registerBackend("webgpu", wasmBackend2, 5);
  }
  if (true) {
    registerBackend("webnn", wasmBackend2, 5);
  }
  registerBackend("cpu", wasmBackend2, 10);
  registerBackend("wasm", wasmBackend2, 10);
}
Object.defineProperty(env2.versions, "web", { value: version2, enumerable: true });
export {
  InferenceSession2 as InferenceSession,
  TRACE,
  TRACE_EVENT_BEGIN,
  TRACE_EVENT_END,
  TRACE_FUNC_BEGIN,
  TRACE_FUNC_END,
  Tensor2 as Tensor,
  index_default as default,
  env2 as env,
  registerBackend
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vY29tbW9uL2xpYi9iYWNrZW5kLWltcGwudHMiLCAiLi4vLi4vY29tbW9uL2xpYi9iYWNrZW5kLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdmVyc2lvbi50cyIsICIuLi8uLi9jb21tb24vbGliL2Vudi1pbXBsLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvZW52LnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdGVuc29yLWNvbnZlcnNpb24taW1wbC50cyIsICIuLi8uLi9jb21tb24vbGliL3RlbnNvci1mYWN0b3J5LWltcGwudHMiLCAiLi4vLi4vY29tbW9uL2xpYi90ZW5zb3ItaW1wbC10eXBlLW1hcHBpbmcudHMiLCAiLi4vLi4vY29tbW9uL2xpYi90ZW5zb3ItdXRpbHMtaW1wbC50cyIsICIuLi8uLi9jb21tb24vbGliL3RlbnNvci1pbXBsLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdGVuc29yLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvdHJhY2UudHMiLCAiLi4vLi4vY29tbW9uL2xpYi9pbmZlcmVuY2Utc2Vzc2lvbi1pbXBsLnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvaW5mZXJlbmNlLXNlc3Npb24udHMiLCAiLi4vLi4vY29tbW9uL2xpYi90ZW5zb3ItY29udmVyc2lvbi50cyIsICIuLi8uLi9jb21tb24vbGliL3RlbnNvci1mYWN0b3J5LnRzIiwgIi4uLy4uL2NvbW1vbi9saWIvb25ueC1tb2RlbC50cyIsICIuLi8uLi9jb21tb24vbGliL29ubngtdmFsdWUudHMiLCAiLi4vLi4vY29tbW9uL2xpYi9pbmRleC50cyIsICIuLi9saWIvd2FzbS93YXNtLXV0aWxzLWVudi50cyIsICIuLi9saWIvd2FzbS9wcm94eS13b3JrZXIvbWFpbi50cyIsICIuLi9saWIvd2FzbS93YXNtLXV0aWxzLWltcG9ydC50cyIsICIuLi9saWIvd2FzbS93YXNtLWZhY3RvcnkudHMiLCAiLi4vbGliL3dhc20vd2FzbS11dGlscy50cyIsICIuLi9saWIvd2FzbS9ydW4tb3B0aW9ucy50cyIsICIuLi9saWIvd2FzbS9zZXNzaW9uLW9wdGlvbnMudHMiLCAiLi4vbGliL3dhc20vd2FzbS1jb21tb24udHMiLCAiLi4vbGliL3dhc20vd2FzbS11dGlscy1sb2FkLWZpbGUudHMiLCAiLi4vbGliL3dhc20vanNlcC90ZW5zb3Itdmlldy50cyIsICIuLi9saWIvd2FzbS9qc2VwL2xvZy50cyIsICIuLi9saWIvd2FzbS9qc2VwL3dlYm5uL3RlbnNvci1tYW5hZ2VyLnRzIiwgIi4uL2xpYi93YXNtL2pzZXAvYmFja2VuZC13ZWJubi50cyIsICIuLi9saWIvd2FzbS93YXNtLWNvcmUtaW1wbC50cyIsICIuLi9saWIvd2FzbS9wcm94eS13cmFwcGVyLnRzIiwgIi4uL2xpYi93YXNtL3Nlc3Npb24taGFuZGxlci1pbmZlcmVuY2UudHMiLCAiLi4vbGliL2JhY2tlbmQtd2FzbS50cyIsICIuLi9saWIvaW5kZXgudHMiLCAiLi4vbGliL3ZlcnNpb24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBCYWNrZW5kIH0gZnJvbSAnLi9iYWNrZW5kLmpzJztcbmltcG9ydCB7IEluZmVyZW5jZVNlc3Npb24gfSBmcm9tICcuL2luZmVyZW5jZS1zZXNzaW9uLmpzJztcblxuaW50ZXJmYWNlIEJhY2tlbmRJbmZvIHtcbiAgYmFja2VuZDogQmFja2VuZDtcbiAgcHJpb3JpdHk6IG51bWJlcjtcblxuICBpbml0UHJvbWlzZT86IFByb21pc2U8dm9pZD47XG4gIGluaXRpYWxpemVkPzogYm9vbGVhbjtcbiAgYWJvcnRlZD86IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5jb25zdCBiYWNrZW5kczogTWFwPHN0cmluZywgQmFja2VuZEluZm8+ID0gbmV3IE1hcCgpO1xuY29uc3QgYmFja2VuZHNTb3J0ZWRCeVByaW9yaXR5OiBzdHJpbmdbXSA9IFtdO1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgYmFja2VuZC5cbiAqXG4gKiBAcGFyYW0gbmFtZSAtIHRoZSBuYW1lIGFzIGEga2V5IHRvIGxvb2t1cCBhcyBhbiBleGVjdXRpb24gcHJvdmlkZXIuXG4gKiBAcGFyYW0gYmFja2VuZCAtIHRoZSBiYWNrZW5kIG9iamVjdC5cbiAqIEBwYXJhbSBwcmlvcml0eSAtIGFuIGludGVnZXIgaW5kaWNhdGluZyB0aGUgcHJpb3JpdHkgb2YgdGhlIGJhY2tlbmQuIEhpZ2hlciBudW1iZXIgbWVhbnMgaGlnaGVyIHByaW9yaXR5LiBpZiBwcmlvcml0eVxuICogPCAwLCBpdCB3aWxsIGJlIGNvbnNpZGVyZWQgYXMgYSAnYmV0YScgdmVyc2lvbiBhbmQgd2lsbCBub3QgYmUgdXNlZCBhcyBhIGZhbGxiYWNrIGJhY2tlbmQgYnkgZGVmYXVsdC5cbiAqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBjb25zdCByZWdpc3RlckJhY2tlbmQgPSAobmFtZTogc3RyaW5nLCBiYWNrZW5kOiBCYWNrZW5kLCBwcmlvcml0eTogbnVtYmVyKTogdm9pZCA9PiB7XG4gIGlmIChiYWNrZW5kICYmIHR5cGVvZiBiYWNrZW5kLmluaXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGJhY2tlbmQuY3JlYXRlSW5mZXJlbmNlU2Vzc2lvbkhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBjdXJyZW50QmFja2VuZCA9IGJhY2tlbmRzLmdldChuYW1lKTtcbiAgICBpZiAoY3VycmVudEJhY2tlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYmFja2VuZHMuc2V0KG5hbWUsIHsgYmFja2VuZCwgcHJpb3JpdHkgfSk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50QmFja2VuZC5wcmlvcml0eSA+IHByaW9yaXR5KSB7XG4gICAgICAvLyBzYW1lIG5hbWUgaXMgYWxyZWFkeSByZWdpc3RlcmVkIHdpdGggYSBoaWdoZXIgcHJpb3JpdHkuIHNraXAgcmVnaXN0ZXJhdGlvbi5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRCYWNrZW5kLnByaW9yaXR5ID09PSBwcmlvcml0eSkge1xuICAgICAgaWYgKGN1cnJlbnRCYWNrZW5kLmJhY2tlbmQgIT09IGJhY2tlbmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBjYW5ub3QgcmVnaXN0ZXIgYmFja2VuZCBcIiR7bmFtZX1cIiB1c2luZyBwcmlvcml0eSAke3ByaW9yaXR5fWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcmlvcml0eSA+PSAwKSB7XG4gICAgICBjb25zdCBpID0gYmFja2VuZHNTb3J0ZWRCeVByaW9yaXR5LmluZGV4T2YobmFtZSk7XG4gICAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgICAgYmFja2VuZHNTb3J0ZWRCeVByaW9yaXR5LnNwbGljZShpLCAxKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJhY2tlbmRzLmdldChiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHlbaV0pIS5wcmlvcml0eSA8PSBwcmlvcml0eSkge1xuICAgICAgICAgIGJhY2tlbmRzU29ydGVkQnlQcmlvcml0eS5zcGxpY2UoaSwgMCwgbmFtZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHkucHVzaChuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgdmFsaWQgYmFja2VuZCcpO1xufTtcblxuLyoqXG4gKiBUcnkgdG8gcmVzb2x2ZSBhbmQgaW5pdGlhbGl6ZSBhIGJhY2tlbmQuXG4gKlxuICogQHBhcmFtIGJhY2tlbmROYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGJhY2tlbmQuXG4gKiBAcmV0dXJucyB0aGUgYmFja2VuZCBpbnN0YW5jZSBpZiByZXNvbHZlZCBhbmQgaW5pdGlhbGl6ZWQgc3VjY2Vzc2Z1bGx5LCBvciBhbiBlcnJvciBtZXNzYWdlIGlmIGZhaWxlZC5cbiAqL1xuY29uc3QgdHJ5UmVzb2x2ZUFuZEluaXRpYWxpemVCYWNrZW5kID0gYXN5bmMgKGJhY2tlbmROYW1lOiBzdHJpbmcpOiBQcm9taXNlPEJhY2tlbmQgfCBzdHJpbmc+ID0+IHtcbiAgY29uc3QgYmFja2VuZEluZm8gPSBiYWNrZW5kcy5nZXQoYmFja2VuZE5hbWUpO1xuICBpZiAoIWJhY2tlbmRJbmZvKSB7XG4gICAgcmV0dXJuICdiYWNrZW5kIG5vdCBmb3VuZC4nO1xuICB9XG5cbiAgaWYgKGJhY2tlbmRJbmZvLmluaXRpYWxpemVkKSB7XG4gICAgcmV0dXJuIGJhY2tlbmRJbmZvLmJhY2tlbmQ7XG4gIH0gZWxzZSBpZiAoYmFja2VuZEluZm8uYWJvcnRlZCkge1xuICAgIHJldHVybiBiYWNrZW5kSW5mby5lcnJvciE7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaXNJbml0aWFsaXppbmcgPSAhIWJhY2tlbmRJbmZvLmluaXRQcm9taXNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWlzSW5pdGlhbGl6aW5nKSB7XG4gICAgICAgIGJhY2tlbmRJbmZvLmluaXRQcm9taXNlID0gYmFja2VuZEluZm8uYmFja2VuZC5pbml0KGJhY2tlbmROYW1lKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGJhY2tlbmRJbmZvLmluaXRQcm9taXNlO1xuICAgICAgYmFja2VuZEluZm8uaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGJhY2tlbmRJbmZvLmJhY2tlbmQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCFpc0luaXRpYWxpemluZykge1xuICAgICAgICBiYWNrZW5kSW5mby5lcnJvciA9IGAke2V9YDtcbiAgICAgICAgYmFja2VuZEluZm8uYWJvcnRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFja2VuZEluZm8uZXJyb3IhO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBkZWxldGUgYmFja2VuZEluZm8uaW5pdFByb21pc2U7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFJlc29sdmUgZXhlY3V0aW9uIHByb3ZpZGVycyBmcm9tIHRoZSBzcGVjaWZpYyBzZXNzaW9uIG9wdGlvbnMuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSB0aGUgc2Vzc2lvbiBvcHRpb25zIG9iamVjdC5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdHVwbGUgb2YgYW4gaW5pdGlhbGl6ZWQgYmFja2VuZCBpbnN0YW5jZSBhbmQgYSBzZXNzaW9uIG9wdGlvbnMgb2JqZWN0IHdpdGhcbiAqIGZpbHRlcmVkIEVQIGxpc3QuXG4gKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgY29uc3QgcmVzb2x2ZUJhY2tlbmRBbmRFeGVjdXRpb25Qcm92aWRlcnMgPSBhc3luYyAoXG4gIG9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uU2Vzc2lvbk9wdGlvbnMsXG4pOiBQcm9taXNlPFtiYWNrZW5kOiBCYWNrZW5kLCBvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zXT4gPT4ge1xuICAvLyBleHRyYWN0IGJhY2tlbmQgaGludHMgZnJvbSBzZXNzaW9uIG9wdGlvbnNcbiAgY29uc3QgZXBzID0gb3B0aW9ucy5leGVjdXRpb25Qcm92aWRlcnMgfHwgW107XG4gIGNvbnN0IGJhY2tlbmRIaW50cyA9IGVwcy5tYXAoKGkpID0+ICh0eXBlb2YgaSA9PT0gJ3N0cmluZycgPyBpIDogaS5uYW1lKSk7XG4gIGNvbnN0IGJhY2tlbmROYW1lcyA9IGJhY2tlbmRIaW50cy5sZW5ndGggPT09IDAgPyBiYWNrZW5kc1NvcnRlZEJ5UHJpb3JpdHkgOiBiYWNrZW5kSGludHM7XG5cbiAgLy8gdHJ5IHRvIHJlc29sdmUgYW5kIGluaXRpYWxpemUgYWxsIHJlcXVlc3RlZCBiYWNrZW5kc1xuICBsZXQgYmFja2VuZDogQmFja2VuZCB8IHVuZGVmaW5lZDtcbiAgY29uc3QgZXJyb3JzID0gW107XG4gIGNvbnN0IGF2YWlsYWJsZUJhY2tlbmROYW1lcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBmb3IgKGNvbnN0IGJhY2tlbmROYW1lIG9mIGJhY2tlbmROYW1lcykge1xuICAgIGNvbnN0IHJlc29sdmVSZXN1bHQgPSBhd2FpdCB0cnlSZXNvbHZlQW5kSW5pdGlhbGl6ZUJhY2tlbmQoYmFja2VuZE5hbWUpO1xuICAgIGlmICh0eXBlb2YgcmVzb2x2ZVJlc3VsdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVycm9ycy5wdXNoKHsgbmFtZTogYmFja2VuZE5hbWUsIGVycjogcmVzb2x2ZVJlc3VsdCB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFiYWNrZW5kKSB7XG4gICAgICAgIGJhY2tlbmQgPSByZXNvbHZlUmVzdWx0O1xuICAgICAgfVxuICAgICAgaWYgKGJhY2tlbmQgPT09IHJlc29sdmVSZXN1bHQpIHtcbiAgICAgICAgYXZhaWxhYmxlQmFja2VuZE5hbWVzLmFkZChiYWNrZW5kTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgbm8gYmFja2VuZCBpcyBhdmFpbGFibGUsIHRocm93IGVycm9yLlxuICBpZiAoIWJhY2tlbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYG5vIGF2YWlsYWJsZSBiYWNrZW5kIGZvdW5kLiBFUlI6ICR7ZXJyb3JzLm1hcCgoZSkgPT4gYFske2UubmFtZX1dICR7ZS5lcnJ9YCkuam9pbignLCAnKX1gKTtcbiAgfVxuXG4gIC8vIGZvciBlYWNoIGV4cGxpY2l0bHkgcmVxdWVzdGVkIGJhY2tlbmQsIGlmIGl0J3Mgbm90IGF2YWlsYWJsZSwgb3V0cHV0IHdhcm5pbmcgbWVzc2FnZS5cbiAgZm9yIChjb25zdCB7IG5hbWUsIGVyciB9IG9mIGVycm9ycykge1xuICAgIGlmIChiYWNrZW5kSGludHMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGByZW1vdmluZyByZXF1ZXN0ZWQgZXhlY3V0aW9uIHByb3ZpZGVyIFwiJHtuYW1lfVwiIGZyb20gc2Vzc2lvbiBvcHRpb25zIGJlY2F1c2UgaXQgaXMgbm90IGF2YWlsYWJsZTogJHtlcnJ9YCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZmlsdGVyZWRFcHMgPSBlcHMuZmlsdGVyKChpKSA9PiBhdmFpbGFibGVCYWNrZW5kTmFtZXMuaGFzKHR5cGVvZiBpID09PSAnc3RyaW5nJyA/IGkgOiBpLm5hbWUpKTtcblxuICByZXR1cm4gW1xuICAgIGJhY2tlbmQsXG4gICAgbmV3IFByb3h5KG9wdGlvbnMsIHtcbiAgICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4ge1xuICAgICAgICBpZiAocHJvcCA9PT0gJ2V4ZWN1dGlvblByb3ZpZGVycycpIHtcbiAgICAgICAgICByZXR1cm4gZmlsdGVyZWRFcHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XG4gICAgICB9LFxuICAgIH0pLFxuICBdO1xufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHsgSW5mZXJlbmNlU2Vzc2lvbiB9IGZyb20gJy4vaW5mZXJlbmNlLXNlc3Npb24uanMnO1xuaW1wb3J0IHsgT25ueFZhbHVlIH0gZnJvbSAnLi9vbm54LXZhbHVlLmpzJztcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBTZXNzaW9uSGFuZGxlciB7XG4gIHR5cGUgRmVlZHNUeXBlID0geyBbbmFtZTogc3RyaW5nXTogT25ueFZhbHVlIH07XG4gIHR5cGUgRmV0Y2hlc1R5cGUgPSB7IFtuYW1lOiBzdHJpbmddOiBPbm54VmFsdWUgfCBudWxsIH07XG4gIHR5cGUgUmV0dXJuVHlwZSA9IHsgW25hbWU6IHN0cmluZ106IE9ubnhWYWx1ZSB9O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgc2hhcmVkIFNlc3Npb25IYW5kbGVyIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAaWdub3JlXG4gKi9cbmludGVyZmFjZSBTZXNzaW9uSGFuZGxlciB7XG4gIGRpc3Bvc2UoKTogUHJvbWlzZTx2b2lkPjtcblxuICByZWFkb25seSBpbnB1dE5hbWVzOiByZWFkb25seSBzdHJpbmdbXTtcbiAgcmVhZG9ubHkgb3V0cHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuXG4gIHJlYWRvbmx5IGlucHV0TWV0YWRhdGE6IHJlYWRvbmx5IEluZmVyZW5jZVNlc3Npb24uVmFsdWVNZXRhZGF0YVtdO1xuICByZWFkb25seSBvdXRwdXRNZXRhZGF0YTogcmVhZG9ubHkgSW5mZXJlbmNlU2Vzc2lvbi5WYWx1ZU1ldGFkYXRhW107XG59XG5cbi8qKlxuICogUmVwcmVzZW50IGEgaGFuZGxlciBpbnN0YW5jZSBvZiBhbiBpbmZlcmVuY2Ugc2Vzc2lvbi5cbiAqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5mZXJlbmNlU2Vzc2lvbkhhbmRsZXIgZXh0ZW5kcyBTZXNzaW9uSGFuZGxlciB7XG4gIHN0YXJ0UHJvZmlsaW5nKCk6IHZvaWQ7XG4gIGVuZFByb2ZpbGluZygpOiB2b2lkO1xuXG4gIHJ1bihcbiAgICBmZWVkczogU2Vzc2lvbkhhbmRsZXIuRmVlZHNUeXBlLFxuICAgIGZldGNoZXM6IFNlc3Npb25IYW5kbGVyLkZldGNoZXNUeXBlLFxuICAgIG9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxTZXNzaW9uSGFuZGxlci5SZXR1cm5UeXBlPjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnQgYSBiYWNrZW5kIHRoYXQgcHJvdmlkZXMgaW1wbGVtZW50YXRpb24gb2YgbW9kZWwgaW5mZXJlbmNpbmcuXG4gKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhY2tlbmQge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYmFja2VuZCBhc3luY2hyb25vdXNseS4gU2hvdWxkIHRocm93IHdoZW4gZmFpbGVkLlxuICAgKi9cbiAgaW5pdChiYWNrZW5kTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcblxuICBjcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcihcbiAgICB1cmlPckJ1ZmZlcjogc3RyaW5nIHwgVWludDhBcnJheSxcbiAgICBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcj47XG59XG5cbmV4cG9ydCB7IHJlZ2lzdGVyQmFja2VuZCB9IGZyb20gJy4vYmFja2VuZC1pbXBsLmpzJztcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSAvanMvc2NyaXB0cy91cGRhdGUtdmVyc2lvbi50c1xuLy8gRG8gbm90IG1vZGlmeSBmaWxlIGNvbnRlbnQgbWFudWFsbHkuXG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJzEuMjQuMC1kZXYuMjAyNTExMTYtYjM5ZTE0NDMyMic7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IEVudiB9IGZyb20gJy4vZW52LmpzJztcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tICcuL3ZlcnNpb24uanMnO1xuXG50eXBlIExvZ0xldmVsVHlwZSA9IEVudlsnbG9nTGV2ZWwnXTtcblxubGV0IGxvZ0xldmVsVmFsdWU6IFJlcXVpcmVkPExvZ0xldmVsVHlwZT4gPSAnd2FybmluZyc7XG5cbmV4cG9ydCBjb25zdCBlbnY6IEVudiA9IHtcbiAgd2FzbToge30gYXMgRW52LldlYkFzc2VtYmx5RmxhZ3MsXG4gIHdlYmdsOiB7fSBhcyBFbnYuV2ViR0xGbGFncyxcbiAgd2ViZ3B1OiB7fSBhcyBFbnYuV2ViR3B1RmxhZ3MsXG4gIHZlcnNpb25zOiB7IGNvbW1vbjogdmVyc2lvbiB9LFxuXG4gIHNldCBsb2dMZXZlbCh2YWx1ZTogTG9nTGV2ZWxUeXBlKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgfHwgWyd2ZXJib3NlJywgJ2luZm8nLCAnd2FybmluZycsICdlcnJvcicsICdmYXRhbCddLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBsb2dnaW5nIGxldmVsOiAke3ZhbHVlfWApO1xuICAgIH1cbiAgICBsb2dMZXZlbFZhbHVlID0gdmFsdWU7XG4gIH0sXG4gIGdldCBsb2dMZXZlbCgpOiBSZXF1aXJlZDxMb2dMZXZlbFR5cGU+IHtcbiAgICByZXR1cm4gbG9nTGV2ZWxWYWx1ZTtcbiAgfSxcbn07XG5cbi8vIHNldCBwcm9wZXJ0eSAnbG9nTGV2ZWwnIHNvIHRoYXQgdGhleSBjYW4gYmUgY29ycmVjdGx5IHRyYW5zZmVycmVkIHRvIHdvcmtlciBieSBgcG9zdE1lc3NhZ2UoKWAuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZW52LCAnbG9nTGV2ZWwnLCB7IGVudW1lcmFibGU6IHRydWUgfSk7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IGVudiBhcyBlbnZJbXBsIH0gZnJvbSAnLi9lbnYtaW1wbC5qcyc7XG5pbXBvcnQgeyBUcnlHZXRHbG9iYWxUeXBlIH0gZnJvbSAnLi90eXBlLWhlbHBlci5qcyc7XG5cbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBFbnYge1xuICBleHBvcnQgdHlwZSBXYXNtUGF0aFByZWZpeCA9IHN0cmluZztcbiAgZXhwb3J0IGludGVyZmFjZSBXYXNtRmlsZVBhdGhzIHtcbiAgICAvKipcbiAgICAgKiBTcGVjaWZ5IHRoZSBvdmVycmlkZSBwYXRoIGZvciB0aGUgbWFpbiAud2FzbSBmaWxlLlxuICAgICAqXG4gICAgICogVGhpcyBwYXRoIHNob3VsZCBiZSBhbiBhYnNvbHV0ZSBwYXRoLlxuICAgICAqXG4gICAgICogSWYgbm90IG1vZGlmaWVkLCB0aGUgZmlsZW5hbWUgb2YgdGhlIC53YXNtIGZpbGUgaXM6XG4gICAgICogLSBgb3J0LXdhc20tc2ltZC10aHJlYWRlZC53YXNtYCBmb3IgZGVmYXVsdCBidWlsZFxuICAgICAqIC0gYG9ydC13YXNtLXNpbWQtdGhyZWFkZWQuanNlcC53YXNtYCBmb3IgSlNFUCBidWlsZCAod2l0aCBXZWJHUFUgYW5kIFdlYk5OKVxuICAgICAqIC0gYG9ydC13YXNtLXNpbWQtdGhyZWFkZWQuYXN5bmNpZnkud2FzbWAgZm9yIFdlYkdQVSBidWlsZCB3aXRoIEFzeW5jaWZ5ICh3aXRoIFdlYk5OKVxuICAgICAqIC0gYG9ydC13YXNtLXNpbWQtdGhyZWFkZWQuanNwaS53YXNtYCBmb3IgV2ViR1BVIGJ1aWxkIHdpdGggSlNQSSBzdXBwb3J0ICh3aXRoIFdlYk5OKVxuICAgICAqL1xuICAgIHdhc20/OiBVUkwgfCBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB0aGUgb3ZlcnJpZGUgcGF0aCBmb3IgdGhlIG1haW4gLm1qcyBmaWxlLlxuICAgICAqXG4gICAgICogVGhpcyBwYXRoIHNob3VsZCBiZSBhbiBhYnNvbHV0ZSBwYXRoLlxuICAgICAqXG4gICAgICogSWYgbm90IG1vZGlmaWVkLCB0aGUgZmlsZW5hbWUgb2YgdGhlIC5tanMgZmlsZSBpczpcbiAgICAgKiAtIGBvcnQtd2FzbS1zaW1kLXRocmVhZGVkLm1qc2AgZm9yIGRlZmF1bHQgYnVpbGRcbiAgICAgKiAtIGBvcnQtd2FzbS1zaW1kLXRocmVhZGVkLmpzZXAubWpzYCBmb3IgSlNFUCBidWlsZCAod2l0aCBXZWJHUFUgYW5kIFdlYk5OKVxuICAgICAqIC0gYG9ydC13YXNtLXNpbWQtdGhyZWFkZWQuYXN5bmNpZnkubWpzYCBmb3IgV2ViR1BVIGJ1aWxkIHdpdGggQXN5bmNpZnkgKHdpdGggV2ViTk4pXG4gICAgICogLSBgb3J0LXdhc20tc2ltZC10aHJlYWRlZC5qc3BpLm1qc2AgZm9yIFdlYkdQVSBidWlsZCB3aXRoIEpTUEkgc3VwcG9ydCAod2l0aCBXZWJOTilcbiAgICAgKi9cbiAgICBtanM/OiBVUkwgfCBzdHJpbmc7XG4gIH1cbiAgZXhwb3J0IHR5cGUgV2FzbVByZWZpeE9yRmlsZVBhdGhzID0gV2FzbVBhdGhQcmVmaXggfCBXYXNtRmlsZVBhdGhzO1xuICBleHBvcnQgaW50ZXJmYWNlIFdlYkFzc2VtYmx5RmxhZ3Mge1xuICAgIC8qKlxuICAgICAqIHNldCBvciBnZXQgbnVtYmVyIG9mIHRocmVhZChzKS4gSWYgb21pdHRlZCBvciBzZXQgdG8gMCwgbnVtYmVyIG9mIHRocmVhZChzKSB3aWxsIGJlIGRldGVybWluZWQgYnkgc3lzdGVtLiBJZiBzZXRcbiAgICAgKiB0byAxLCBubyB3b3JrZXIgdGhyZWFkIHdpbGwgYmUgc3Bhd25lZC5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSB3aGVuIFdlYkFzc2VtYmx5IG11bHRpdGhyZWFkIGZlYXR1cmUgaXMgYXZhaWxhYmxlIGluIGN1cnJlbnQgY29udGV4dC5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYDBgXG4gICAgICovXG4gICAgbnVtVGhyZWFkcz86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIHNldCBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0byBlbmFibGUgU0lNRC5cbiAgICAgKlxuICAgICAqIE9OTlggUnVudGltZSB3aWxsIHBlcmZvcm0gZmVhdHVyZSBkZXRlY3Rpb24gYmFzZWQgb24gdGhlIHZhbHVlIG9mIHRoaXMgcHJvcGVydHkuIFNwZWNpZmljYWxseSwgd2hlbiB0aGUgdmFsdWUgaXNcbiAgICAgKiBzZXQgdG86XG4gICAgICogLSBgdW5kZWZpbmVkYCwgYHRydWVgIG9yIGBcImZpeGVkXCJgOiB3aWxsIGNoZWNrIGF2YWlsYWJpbGl0eSBvZiBGaXhlZC13aWR0aCBTSU1ELlxuICAgICAqIC0gYFwicmVsYXhlZFwiYDogd2lsbCBjaGVjayBhdmFpbGFiaWxpdHkgb2YgUmVsYXhlZCBTSU1ELlxuICAgICAqIC0gYGZhbHNlYDogd2lsbCBub3QgcGVyZm9ybSBTSU1EIGZlYXR1cmUgY2hlY2tpbmcuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgZG9lcyBub3QgbWFrZSBPTk5YIFJ1bnRpbWUgdG8gc3dpdGNoIHRvIHRoZSBjb3JyZXNwb25kaW5nIHJ1bnRpbWUgYXV0b21hdGljYWxseS4gVXNlciBuZWVkXG4gICAgICogdG8gc2V0IGB3YXNtUGF0aHNgIG9yIGB3YXNtQmluYXJ5YCBwcm9wZXJ0eSB0byBsb2FkIHRoZSBjb3JyZXNwb25kaW5nIHJ1bnRpbWUuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgd2hlbiBXZWJBc3NlbWJseSBTSU1EIGZlYXR1cmUgaXMgYXZhaWxhYmxlIGluIGN1cnJlbnQgY29udGV4dC5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYHRydWVgXG4gICAgICovXG4gICAgc2ltZD86IGJvb2xlYW4gfCAnZml4ZWQnIHwgJ3JlbGF4ZWQnO1xuXG4gICAgLyoqXG4gICAgICogc2V0IG9yIGdldCBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRvIGVuYWJsZSB0cmFjZS5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYGZhbHNlYFxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGBlbnYudHJhY2VgIGluc3RlYWQuIElmIGBlbnYudHJhY2VgIGlzIHNldCwgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICovXG4gICAgdHJhY2U/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogU2V0IG9yIGdldCBhIG51bWJlciBzcGVjaWZ5aW5nIHRoZSB0aW1lb3V0IGZvciBpbml0aWFsaXphdGlvbiBvZiBXZWJBc3NlbWJseSBiYWNrZW5kLCBpbiBtaWxsaXNlY29uZHMuIEEgemVyb1xuICAgICAqIHZhbHVlIGluZGljYXRlcyBubyB0aW1lb3V0IGlzIHNldC5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYDBgXG4gICAgICovXG4gICAgaW5pdFRpbWVvdXQ/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBjdXN0b20gVVJMIHByZWZpeCB0byB0aGUgLndhc20vLm1qcyBmaWxlcywgb3IgYW4gb2JqZWN0IG9mIG92ZXJyaWRlcyBmb3IgYm90aCAud2FzbS8ubWpzIGZpbGUuIFRoZSBvdmVycmlkZVxuICAgICAqIHBhdGggc2hvdWxkIGJlIGFuIGFic29sdXRlIHBhdGguXG4gICAgICovXG4gICAgd2FzbVBhdGhzPzogV2FzbVByZWZpeE9yRmlsZVBhdGhzO1xuXG4gICAgLyoqXG4gICAgICogU2V0IGEgY3VzdG9tIGJ1ZmZlciB3aGljaCBjb250YWlucyB0aGUgV2ViQXNzZW1ibHkgYmluYXJ5LiBJZiB0aGlzIHByb3BlcnR5IGlzIHNldCwgdGhlIGB3YXNtUGF0aHNgIHByb3BlcnR5IHdpbGxcbiAgICAgKiBiZSBpZ25vcmVkLlxuICAgICAqL1xuICAgIHdhc21CaW5hcnk/OiBBcnJheUJ1ZmZlckxpa2UgfCBVaW50OEFycmF5O1xuXG4gICAgLyoqXG4gICAgICogU2V0IG9yIGdldCBhIGJvb2xlYW4gdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRvIHByb3h5IHRoZSBleGVjdXRpb24gb2YgbWFpbiB0aHJlYWQgdG8gYSB3b3JrZXIgdGhyZWFkLlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgZmFsc2VgXG4gICAgICovXG4gICAgcHJveHk/OiBib29sZWFuO1xuICB9XG5cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJHTEZsYWdzIHtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBXZWJHTCBDb250ZXh0IElEICh3ZWJnbCBvciB3ZWJnbDIpLlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgJ3dlYmdsMidgXG4gICAgICovXG4gICAgY29udGV4dElkPzogJ3dlYmdsJyB8ICd3ZWJnbDInO1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgV2ViR0wgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAgICovXG4gICAgcmVhZG9ubHkgY29udGV4dDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIG1heGltdW0gYmF0Y2ggc2l6ZSBmb3IgbWF0bXVsLiAwIG1lYW5zIHRvIGRpc2FibGUgYmF0Y2hpbmcuXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIG1hdG11bE1heEJhdGNoU2l6ZT86IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSB0ZXh0dXJlIGNhY2hlIG1vZGUuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGAnZnVsbCdgXG4gICAgICovXG4gICAgdGV4dHVyZUNhY2hlTW9kZT86ICdpbml0aWFsaXplck9ubHknIHwgJ2Z1bGwnO1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIHBhY2tlZCB0ZXh0dXJlIG1vZGVcbiAgICAgKlxuICAgICAqIEBkZWZhdWx0VmFsdWUgYGZhbHNlYFxuICAgICAqL1xuICAgIHBhY2s/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgd2hldGhlciBlbmFibGUgYXN5bmMgZG93bmxvYWQuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGBmYWxzZWBcbiAgICAgKi9cbiAgICBhc3luYz86IGJvb2xlYW47XG4gIH1cblxuICBleHBvcnQgaW50ZXJmYWNlIFdlYkdwdVByb2ZpbGluZ0RhdGFWMVRlbnNvck1ldGFkYXRhIHtcbiAgICBkaW1zOiByZWFkb25seSBudW1iZXJbXTtcbiAgICBkYXRhVHlwZTogc3RyaW5nO1xuICB9XG4gIGV4cG9ydCBpbnRlcmZhY2UgV2ViR3B1UHJvZmlsaW5nRGF0YVYxIHtcbiAgICB2ZXJzaW9uOiAxO1xuICAgIGlucHV0c01ldGFkYXRhOiByZWFkb25seSBXZWJHcHVQcm9maWxpbmdEYXRhVjFUZW5zb3JNZXRhZGF0YVtdO1xuICAgIG91dHB1dHNNZXRhZGF0YTogcmVhZG9ubHkgV2ViR3B1UHJvZmlsaW5nRGF0YVYxVGVuc29yTWV0YWRhdGFbXTtcbiAgICBrZXJuZWxJZDogbnVtYmVyO1xuICAgIGtlcm5lbFR5cGU6IHN0cmluZztcbiAgICBrZXJuZWxOYW1lOiBzdHJpbmc7XG4gICAgcHJvZ3JhbU5hbWU6IHN0cmluZztcbiAgICBzdGFydFRpbWU6IG51bWJlcjtcbiAgICBlbmRUaW1lOiBudW1iZXI7XG4gIH1cblxuICBleHBvcnQgdHlwZSBXZWJHcHVQcm9maWxpbmdEYXRhID0gV2ViR3B1UHJvZmlsaW5nRGF0YVYxO1xuXG4gIGV4cG9ydCBpbnRlcmZhY2UgV2ViR3B1RmxhZ3Mge1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIHByb2ZpbGluZyBtb2RlLlxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGBlbnYud2ViZ3B1LnByb2ZpbGluZy5tb2RlYCBpbnN0ZWFkLiBJZiBgZW52LndlYmdwdS5wcm9maWxpbmcubW9kZWAgaXMgc2V0LCB0aGlzIHByb3BlcnR5IHdpbGwgYmVcbiAgICAgKiBpZ25vcmVkLlxuICAgICAqL1xuICAgIHByb2ZpbGluZ01vZGU/OiAnb2ZmJyB8ICdkZWZhdWx0JztcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBwcm9maWxpbmcgY29uZmlndXJhdGlvbi5cbiAgICAgKi9cbiAgICBwcm9maWxpbmc6IHtcbiAgICAgIC8qKlxuICAgICAgICogU2V0IG9yIGdldCB0aGUgcHJvZmlsaW5nIG1vZGUuXG4gICAgICAgKlxuICAgICAgICogQGRlZmF1bHRWYWx1ZSBgJ29mZidgXG4gICAgICAgKi9cbiAgICAgIG1vZGU/OiAnb2ZmJyB8ICdkZWZhdWx0JztcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgb3IgZ2V0IGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBhIHByb2ZpbGluZyBkYXRhIGlzIHJlY2VpdmVkLiBJZiBub3Qgc2V0LCB0aGUgcHJvZmlsaW5nIGRhdGEgd2lsbCBiZVxuICAgICAgICogcHJpbnRlZCB0byBjb25zb2xlLlxuICAgICAgICovXG4gICAgICBvbmRhdGE/OiAoZGF0YTogV2ViR3B1UHJvZmlsaW5nRGF0YSkgPT4gdm9pZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIHBvd2VyIHByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgb25seSBoYXMgZWZmZWN0IGJlZm9yZSB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZSB2YWx1ZSB3aWxsIGJlXG4gICAgICogdXNlZCBhcyBvcHRpb25zIGZvciBgbmF2aWdhdG9yLmdwdS5yZXF1ZXN0QWRhcHRlcigpYC5cbiAgICAgKlxuICAgICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9ncHV3ZWIuZ2l0aHViLmlvL2dwdXdlYi8jZGljdGRlZi1ncHVyZXF1ZXN0YWRhcHRlcm9wdGlvbnN9IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGB1bmRlZmluZWRgXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBDcmVhdGUgeW91ciBvd24gR1BVQWRhcHRlciwgdXNlIGl0IHRvIGNyZWF0ZSBhIEdQVURldmljZSBpbnN0YW5jZSBhbmQgc2V0IHtAbGluayBkZXZpY2V9IHByb3BlcnR5IGlmXG4gICAgICogeW91IHdhbnQgdG8gdXNlIGEgc3BlY2lmaWMgcG93ZXIgcHJlZmVyZW5jZS5cbiAgICAgKi9cbiAgICBwb3dlclByZWZlcmVuY2U/OiAnbG93LXBvd2VyJyB8ICdoaWdoLXBlcmZvcm1hbmNlJztcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBmb3JjZSBmYWxsYmFjayBhZGFwdGVyIGZsYWcuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgb25seSBoYXMgZWZmZWN0IGJlZm9yZSB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZSB2YWx1ZSB3aWxsIGJlXG4gICAgICogdXNlZCBhcyBvcHRpb25zIGZvciBgbmF2aWdhdG9yLmdwdS5yZXF1ZXN0QWRhcHRlcigpYC5cbiAgICAgKlxuICAgICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9ncHV3ZWIuZ2l0aHViLmlvL2dwdXdlYi8jZGljdGRlZi1ncHVyZXF1ZXN0YWRhcHRlcm9wdGlvbnN9IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICpcbiAgICAgKiBAZGVmYXVsdFZhbHVlIGB1bmRlZmluZWRgXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBDcmVhdGUgeW91ciBvd24gR1BVQWRhcHRlciwgdXNlIGl0IHRvIGNyZWF0ZSBhIEdQVURldmljZSBpbnN0YW5jZSBhbmQgc2V0IHtAbGluayBkZXZpY2V9IHByb3BlcnR5IGlmXG4gICAgICogeW91IHdhbnQgdG8gdXNlIGEgc3BlY2lmaWMgZmFsbGJhY2sgb3B0aW9uLlxuICAgICAqL1xuICAgIGZvcmNlRmFsbGJhY2tBZGFwdGVyPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICAgKiBTZXQgb3IgZ2V0IHRoZSBhZGFwdGVyIGZvciBXZWJHUFUuXG4gICAgICpcbiAgICAgKiBTZXR0aW5nIHRoaXMgcHJvcGVydHkgb25seSBoYXMgZWZmZWN0IGJlZm9yZSB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZSB2YWx1ZSB3aWxsIGJlXG4gICAgICogdXNlZCBhcyB0aGUgR1BVIGFkYXB0ZXIgZm9yIHRoZSB1bmRlcmx5aW5nIFdlYkdQVSBiYWNrZW5kIHRvIGNyZWF0ZSBHUFUgZGV2aWNlLlxuICAgICAqXG4gICAgICogSWYgdGhpcyBwcm9wZXJ0eSBpcyBub3Qgc2V0LCBpdCB3aWxsIGJlIGF2YWlsYWJsZSB0byBnZXQgYWZ0ZXIgdGhlIGZpcnN0IFdlYkdQVSBpbmZlcmVuY2Ugc2Vzc2lvbiBpcyBjcmVhdGVkLiBUaGVcbiAgICAgKiB2YWx1ZSB3aWxsIGJlIHRoZSBHUFUgYWRhcHRlciB0aGF0IGNyZWF0ZWQgYnkgdGhlIHVuZGVybHlpbmcgV2ViR1BVIGJhY2tlbmQuXG4gICAgICpcbiAgICAgKiBXaGVuIHVzZSB3aXRoIFR5cGVTY3JpcHQsIHRoZSB0eXBlIG9mIHRoaXMgcHJvcGVydHkgaXMgYEdQVUFkYXB0ZXJgIGRlZmluZWQgaW4gXCJAd2ViZ3B1L3R5cGVzXCIuXG4gICAgICpcbiAgICAgKiBAZGVwcmVjYXRlZCBJdCBpcyBubyBsb25nZXIgcmVjb21tZW5kZWQgdG8gdXNlIHRoaXMgcHJvcGVydHkuIFRoZSBsYXRlc3QgV2ViR1BVIHNwZWMgYWRkcyBgR1BVRGV2aWNlLmFkYXB0ZXJJbmZvYFxuICAgICAqIChodHRwczovL3d3dy53My5vcmcvVFIvd2ViZ3B1LyNkb20tZ3B1ZGV2aWNlLWFkYXB0ZXJpbmZvKSwgd2hpY2ggYWxsb3dzIHRvIGdldCB0aGUgYWRhcHRlciBpbmZvcm1hdGlvbiBmcm9tIHRoZVxuICAgICAqIGRldmljZS4gV2hlbiBpdCdzIGF2YWlsYWJsZSwgdGhlcmUgaXMgbm8gbmVlZCB0byBzZXQvZ2V0IHRoZSB7QGxpbmsgYWRhcHRlcn0gcHJvcGVydHkuXG4gICAgICovXG4gICAgYWRhcHRlcjogVHJ5R2V0R2xvYmFsVHlwZTwnR1BVQWRhcHRlcic+O1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgdGhlIEdQVSBkZXZpY2UgZm9yIFdlYkdQVS5cbiAgICAgKlxuICAgICAqIFRoZXJlIGFyZSAzIHZhbGlkIHNjZW5hcmlvcyBvZiBhY2Nlc3NpbmcgdGhpcyBwcm9wZXJ0eTpcbiAgICAgKiAtIFNldCBhIHZhbHVlIGJlZm9yZSB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFRoZSB2YWx1ZSB3aWxsIGJlIHVzZWQgYnkgdGhlIFdlYkdQVSBiYWNrZW5kXG4gICAgICogdG8gcGVyZm9ybSBjYWxjdWxhdGlvbnMuIElmIHRoZSB2YWx1ZSBpcyBub3QgYSBgR1BVRGV2aWNlYCBvYmplY3QsIGFuIGVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgICAqIC0gR2V0IHRoZSB2YWx1ZSBiZWZvcmUgdGhlIGZpcnN0IFdlYkdQVSBpbmZlcmVuY2Ugc2Vzc2lvbiBpcyBjcmVhdGVkLiBUaGlzIHdpbGwgdHJ5IHRvIGNyZWF0ZSBhIG5ldyBHUFVEZXZpY2VcbiAgICAgKiBpbnN0YW5jZS4gUmV0dXJucyBhIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHRvIGEgYEdQVURldmljZWAgb2JqZWN0LlxuICAgICAqIC0gR2V0IHRoZSB2YWx1ZSBhZnRlciB0aGUgZmlyc3QgV2ViR1BVIGluZmVyZW5jZSBzZXNzaW9uIGlzIGNyZWF0ZWQuIFJldHVybnMgYSByZXNvbHZlZCBgUHJvbWlzZWAgdG8gdGhlXG4gICAgICogYEdQVURldmljZWAgb2JqZWN0IHVzZWQgYnkgdGhlIFdlYkdQVSBiYWNrZW5kLlxuICAgICAqL1xuICAgIGdldCBkZXZpY2UoKTogUHJvbWlzZTxUcnlHZXRHbG9iYWxUeXBlPCdHUFVEZXZpY2UnPj47XG4gICAgc2V0IGRldmljZSh2YWx1ZTogVHJ5R2V0R2xvYmFsVHlwZTwnR1BVRGV2aWNlJz4pO1xuICAgIC8qKlxuICAgICAqIFNldCBvciBnZXQgd2hldGhlciB2YWxpZGF0ZSBpbnB1dCBjb250ZW50LlxuICAgICAqXG4gICAgICogQGRlZmF1bHRWYWx1ZSBgZmFsc2VgXG4gICAgICovXG4gICAgdmFsaWRhdGVJbnB1dENvbnRlbnQ/OiBib29sZWFuO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52IHtcbiAgLyoqXG4gICAqIHNldCB0aGUgc2V2ZXJpdHkgbGV2ZWwgZm9yIGxvZ2dpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0VmFsdWUgYCd3YXJuaW5nJ2BcbiAgICovXG4gIGxvZ0xldmVsPzogJ3ZlcmJvc2UnIHwgJ2luZm8nIHwgJ3dhcm5pbmcnIHwgJ2Vycm9yJyB8ICdmYXRhbCc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlIHdoZXRoZXIgcnVuIGluIGRlYnVnIG1vZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0VmFsdWUgYGZhbHNlYFxuICAgKi9cbiAgZGVidWc/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBzZXQgb3IgZ2V0IGEgYm9vbGVhbiB2YWx1ZSBpbmRpY2F0aW5nIHdoZXRoZXIgdG8gZW5hYmxlIHRyYWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdFZhbHVlIGBmYWxzZWBcbiAgICovXG4gIHRyYWNlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogR2V0IHZlcnNpb24gb2YgdGhlIGN1cnJlbnQgcGFja2FnZS5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25zOiB7XG4gICAgcmVhZG9ubHkgY29tbW9uOiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgd2ViPzogc3RyaW5nO1xuICAgIHJlYWRvbmx5IG5vZGU/OiBzdHJpbmc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvblxuICAgIHJlYWRvbmx5ICdyZWFjdC1uYXRpdmUnPzogc3RyaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYSBzZXQgb2YgZmxhZ3MgZm9yIFdlYkFzc2VtYmx5XG4gICAqL1xuICByZWFkb25seSB3YXNtOiBFbnYuV2ViQXNzZW1ibHlGbGFncztcblxuICAvKipcbiAgICogUmVwcmVzZW50IGEgc2V0IG9mIGZsYWdzIGZvciBXZWJHTFxuICAgKi9cbiAgcmVhZG9ubHkgd2ViZ2w6IEVudi5XZWJHTEZsYWdzO1xuXG4gIC8qKlxuICAgKiBSZXByZXNlbnQgYSBzZXQgb2YgZmxhZ3MgZm9yIFdlYkdQVVxuICAgKi9cbiAgcmVhZG9ubHkgd2ViZ3B1OiBFbnYuV2ViR3B1RmxhZ3M7XG5cbiAgW25hbWU6IHN0cmluZ106IHVua25vd247XG59XG5cbi8qKlxuICogUmVwcmVzZW50IGEgc2V0IG9mIGZsYWdzIGFzIGEgZ2xvYmFsIHNpbmdsZXRvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IGVudjogRW52ID0gZW52SW1wbDtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHsgVGVuc29yVG9EYXRhVXJsT3B0aW9ucywgVGVuc29yVG9JbWFnZURhdGFPcHRpb25zIH0gZnJvbSAnLi90ZW5zb3ItY29udmVyc2lvbi5qcyc7XG5pbXBvcnQgeyBUZW5zb3IgfSBmcm9tICcuL3RlbnNvci5qcyc7XG5cbi8qKlxuICogaW1wbGVtZW50YXRpb24gb2YgVGVuc29yLnRvRGF0YVVSTCgpXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JUb0RhdGFVUkwgPSAodGVuc29yOiBUZW5zb3IsIG9wdGlvbnM/OiBUZW5zb3JUb0RhdGFVcmxPcHRpb25zKTogc3RyaW5nID0+IHtcbiAgY29uc3QgY2FudmFzID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpIDogbmV3IE9mZnNjcmVlbkNhbnZhcygxLCAxKTtcbiAgY2FudmFzLndpZHRoID0gdGVuc29yLmRpbXNbM107XG4gIGNhbnZhcy5oZWlnaHQgPSB0ZW5zb3IuZGltc1syXTtcbiAgY29uc3QgcGl4ZWxzMkRDb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXNcbiAgICB8IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRFxuICAgIHwgT2Zmc2NyZWVuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXG4gICAgfCBudWxsO1xuXG4gIGlmIChwaXhlbHMyRENvbnRleHQgIT0gbnVsbCkge1xuICAgIC8vIERlZmF1bHQgdmFsdWVzIGZvciBoZWlnaHQgYW5kIHdpZHRoICYgZm9ybWF0XG4gICAgbGV0IHdpZHRoOiBudW1iZXI7XG4gICAgbGV0IGhlaWdodDogbnVtYmVyO1xuICAgIGlmIChvcHRpb25zPy50ZW5zb3JMYXlvdXQgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnRlbnNvckxheW91dCA9PT0gJ05IV0MnKSB7XG4gICAgICB3aWR0aCA9IHRlbnNvci5kaW1zWzJdO1xuICAgICAgaGVpZ2h0ID0gdGVuc29yLmRpbXNbM107XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZmF1bHQgbGF5b3V0IGlzIE5DV0hcbiAgICAgIHdpZHRoID0gdGVuc29yLmRpbXNbM107XG4gICAgICBoZWlnaHQgPSB0ZW5zb3IuZGltc1syXTtcbiAgICB9XG5cbiAgICBjb25zdCBpbnB1dGZvcm1hdCA9IG9wdGlvbnM/LmZvcm1hdCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5mb3JtYXQgOiAnUkdCJztcblxuICAgIGNvbnN0IG5vcm0gPSBvcHRpb25zPy5ub3JtO1xuICAgIGxldCBub3JtTWVhbjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgbGV0IG5vcm1CaWFzOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgICBpZiAobm9ybSA9PT0gdW5kZWZpbmVkIHx8IG5vcm0ubWVhbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub3JtTWVhbiA9IFsyNTUsIDI1NSwgMjU1LCAyNTVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG5vcm0ubWVhbiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbm9ybU1lYW4gPSBbbm9ybS5tZWFuLCBub3JtLm1lYW4sIG5vcm0ubWVhbiwgbm9ybS5tZWFuXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcm1NZWFuID0gW25vcm0ubWVhblswXSwgbm9ybS5tZWFuWzFdLCBub3JtLm1lYW5bMl0sIDBdO1xuICAgICAgICBpZiAobm9ybS5tZWFuWzNdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBub3JtTWVhblszXSA9IG5vcm0ubWVhblszXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9ybSA9PT0gdW5kZWZpbmVkIHx8IG5vcm0uYmlhcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub3JtQmlhcyA9IFswLCAwLCAwLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBub3JtLmJpYXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG5vcm1CaWFzID0gW25vcm0uYmlhcywgbm9ybS5iaWFzLCBub3JtLmJpYXMsIG5vcm0uYmlhc107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3JtQmlhcyA9IFtub3JtLmJpYXNbMF0sIG5vcm0uYmlhc1sxXSwgbm9ybS5iaWFzWzJdLCAwXTtcbiAgICAgICAgaWYgKG5vcm0uYmlhc1szXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9ybUJpYXNbM10gPSBub3JtLmJpYXNbM107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdHJpZGUgPSBoZWlnaHQgKiB3aWR0aDtcbiAgICAvLyBEZWZhdWx0IHBvaW50ZXIgYXNzaWdubWVudHNcbiAgICBsZXQgclRlbnNvclBvaW50ZXIgPSAwLFxuICAgICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGUsXG4gICAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDIsXG4gICAgICBhVGVuc29yUG9pbnRlciA9IC0xO1xuXG4gICAgLy8gVXBkYXRpbmcgdGhlIHBvaW50ZXIgYXNzaWdubWVudHMgYmFzZWQgb24gdGhlIGlucHV0IGltYWdlIGZvcm1hdFxuICAgIGlmIChpbnB1dGZvcm1hdCA9PT0gJ1JHQkEnKSB7XG4gICAgICByVGVuc29yUG9pbnRlciA9IDA7XG4gICAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZTtcbiAgICAgIGJUZW5zb3JQb2ludGVyID0gc3RyaWRlICogMjtcbiAgICAgIGFUZW5zb3JQb2ludGVyID0gc3RyaWRlICogMztcbiAgICB9IGVsc2UgaWYgKGlucHV0Zm9ybWF0ID09PSAnUkdCJykge1xuICAgICAgclRlbnNvclBvaW50ZXIgPSAwO1xuICAgICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGU7XG4gICAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDI7XG4gICAgfSBlbHNlIGlmIChpbnB1dGZvcm1hdCA9PT0gJ1JCRycpIHtcbiAgICAgIHJUZW5zb3JQb2ludGVyID0gMDtcbiAgICAgIGJUZW5zb3JQb2ludGVyID0gc3RyaWRlO1xuICAgICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgd2lkdGg7IGorKykge1xuICAgICAgICBjb25zdCBSID0gKCh0ZW5zb3IuZGF0YVtyVGVuc29yUG9pbnRlcisrXSBhcyBudW1iZXIpIC0gbm9ybUJpYXNbMF0pICogbm9ybU1lYW5bMF07IC8vIFIgdmFsdWVcbiAgICAgICAgY29uc3QgRyA9ICgodGVuc29yLmRhdGFbZ1RlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzFdKSAqIG5vcm1NZWFuWzFdOyAvLyBHIHZhbHVlXG4gICAgICAgIGNvbnN0IEIgPSAoKHRlbnNvci5kYXRhW2JUZW5zb3JQb2ludGVyKytdIGFzIG51bWJlcikgLSBub3JtQmlhc1syXSkgKiBub3JtTWVhblsyXTsgLy8gQiB2YWx1ZVxuICAgICAgICBjb25zdCBBID0gYVRlbnNvclBvaW50ZXIgPT09IC0xID8gMjU1IDogKCh0ZW5zb3IuZGF0YVthVGVuc29yUG9pbnRlcisrXSBhcyBudW1iZXIpIC0gbm9ybUJpYXNbM10pICogbm9ybU1lYW5bM107IC8vIEEgdmFsdWVcblxuICAgICAgICBwaXhlbHMyRENvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoJyArIFIgKyAnLCcgKyBHICsgJywnICsgQiArICcsJyArIEEgKyAnKSc7XG4gICAgICAgIHBpeGVsczJEQ29udGV4dC5maWxsUmVjdChqLCBpLCAxLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCd0b0RhdGFVUkwnIGluIGNhbnZhcykge1xuICAgICAgcmV0dXJuIGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd0b0RhdGFVUkwgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgYWNjZXNzIGltYWdlIGRhdGEnKTtcbiAgfVxufTtcblxuLyoqXG4gKiBpbXBsZW1lbnRhdGlvbiBvZiBUZW5zb3IudG9JbWFnZURhdGEoKVxuICovXG5leHBvcnQgY29uc3QgdGVuc29yVG9JbWFnZURhdGEgPSAodGVuc29yOiBUZW5zb3IsIG9wdGlvbnM/OiBUZW5zb3JUb0ltYWdlRGF0YU9wdGlvbnMpOiBJbWFnZURhdGEgPT4ge1xuICBjb25zdCBwaXhlbHMyRENvbnRleHQgPVxuICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJykuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgOiAobmV3IE9mZnNjcmVlbkNhbnZhcygxLCAxKS5nZXRDb250ZXh0KCcyZCcpIGFzIE9mZnNjcmVlbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gIGxldCBpbWFnZTogSW1hZ2VEYXRhO1xuICBpZiAocGl4ZWxzMkRDb250ZXh0ICE9IG51bGwpIHtcbiAgICAvLyBEZWZhdWx0IHZhbHVlcyBmb3IgaGVpZ2h0IGFuZCB3aWR0aCAmIGZvcm1hdFxuICAgIGxldCB3aWR0aDogbnVtYmVyO1xuICAgIGxldCBoZWlnaHQ6IG51bWJlcjtcbiAgICBsZXQgY2hhbm5lbHM6IG51bWJlcjtcbiAgICBpZiAob3B0aW9ucz8udGVuc29yTGF5b3V0ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy50ZW5zb3JMYXlvdXQgPT09ICdOSFdDJykge1xuICAgICAgd2lkdGggPSB0ZW5zb3IuZGltc1syXTtcbiAgICAgIGhlaWdodCA9IHRlbnNvci5kaW1zWzFdO1xuICAgICAgY2hhbm5lbHMgPSB0ZW5zb3IuZGltc1szXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVmYXVsdCBsYXlvdXQgaXMgTkNXSFxuICAgICAgd2lkdGggPSB0ZW5zb3IuZGltc1szXTtcbiAgICAgIGhlaWdodCA9IHRlbnNvci5kaW1zWzJdO1xuICAgICAgY2hhbm5lbHMgPSB0ZW5zb3IuZGltc1sxXTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRmb3JtYXQgPSBvcHRpb25zICE9PSB1bmRlZmluZWQgPyAob3B0aW9ucy5mb3JtYXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuZm9ybWF0IDogJ1JHQicpIDogJ1JHQic7XG5cbiAgICBjb25zdCBub3JtID0gb3B0aW9ucz8ubm9ybTtcbiAgICBsZXQgbm9ybU1lYW46IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICAgIGxldCBub3JtQmlhczogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gICAgaWYgKG5vcm0gPT09IHVuZGVmaW5lZCB8fCBub3JtLm1lYW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbm9ybU1lYW4gPSBbMjU1LCAyNTUsIDI1NSwgMjU1XTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBub3JtLm1lYW4gPT09ICdudW1iZXInKSB7XG4gICAgICAgIG5vcm1NZWFuID0gW25vcm0ubWVhbiwgbm9ybS5tZWFuLCBub3JtLm1lYW4sIG5vcm0ubWVhbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3JtTWVhbiA9IFtub3JtLm1lYW5bMF0sIG5vcm0ubWVhblsxXSwgbm9ybS5tZWFuWzJdLCAyNTVdO1xuICAgICAgICBpZiAobm9ybS5tZWFuWzNdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBub3JtTWVhblszXSA9IG5vcm0ubWVhblszXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobm9ybSA9PT0gdW5kZWZpbmVkIHx8IG5vcm0uYmlhcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub3JtQmlhcyA9IFswLCAwLCAwLCAwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBub3JtLmJpYXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIG5vcm1CaWFzID0gW25vcm0uYmlhcywgbm9ybS5iaWFzLCBub3JtLmJpYXMsIG5vcm0uYmlhc107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3JtQmlhcyA9IFtub3JtLmJpYXNbMF0sIG5vcm0uYmlhc1sxXSwgbm9ybS5iaWFzWzJdLCAwXTtcbiAgICAgICAgaWYgKG5vcm0uYmlhc1szXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9ybUJpYXNbM10gPSBub3JtLmJpYXNbM107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdHJpZGUgPSBoZWlnaHQgKiB3aWR0aDtcbiAgICBpZiAob3B0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoXG4gICAgICAgIChvcHRpb25zLmZvcm1hdCAhPT0gdW5kZWZpbmVkICYmIGNoYW5uZWxzID09PSA0ICYmIG9wdGlvbnMuZm9ybWF0ICE9PSAnUkdCQScpIHx8XG4gICAgICAgIChjaGFubmVscyA9PT0gMyAmJiBvcHRpb25zLmZvcm1hdCAhPT0gJ1JHQicgJiYgb3B0aW9ucy5mb3JtYXQgIT09ICdCR1InKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRlbnNvciBmb3JtYXQgZG9lc24ndCBtYXRjaCBpbnB1dCB0ZW5zb3IgZGltc1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IHBvaW50ZXIgYXNzaWdubWVudHNcbiAgICBjb25zdCBzdGVwID0gNDtcbiAgICBsZXQgckltYWdlUG9pbnRlciA9IDAsXG4gICAgICBnSW1hZ2VQb2ludGVyID0gMSxcbiAgICAgIGJJbWFnZVBvaW50ZXIgPSAyLFxuICAgICAgYUltYWdlUG9pbnRlciA9IDM7XG4gICAgbGV0IHJUZW5zb3JQb2ludGVyID0gMCxcbiAgICAgIGdUZW5zb3JQb2ludGVyID0gc3RyaWRlLFxuICAgICAgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyLFxuICAgICAgYVRlbnNvclBvaW50ZXIgPSAtMTtcblxuICAgIC8vIFVwZGF0aW5nIHRoZSBwb2ludGVyIGFzc2lnbm1lbnRzIGJhc2VkIG9uIHRoZSBpbnB1dCBpbWFnZSBmb3JtYXRcbiAgICBpZiAoaW5wdXRmb3JtYXQgPT09ICdSR0JBJykge1xuICAgICAgclRlbnNvclBvaW50ZXIgPSAwO1xuICAgICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGU7XG4gICAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDI7XG4gICAgICBhVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDM7XG4gICAgfSBlbHNlIGlmIChpbnB1dGZvcm1hdCA9PT0gJ1JHQicpIHtcbiAgICAgIHJUZW5zb3JQb2ludGVyID0gMDtcbiAgICAgIGdUZW5zb3JQb2ludGVyID0gc3RyaWRlO1xuICAgICAgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRmb3JtYXQgPT09ICdSQkcnKSB7XG4gICAgICByVGVuc29yUG9pbnRlciA9IDA7XG4gICAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZTtcbiAgICAgIGdUZW5zb3JQb2ludGVyID0gc3RyaWRlICogMjtcbiAgICB9XG5cbiAgICBpbWFnZSA9IHBpeGVsczJEQ29udGV4dC5jcmVhdGVJbWFnZURhdGEod2lkdGgsIGhlaWdodCk7XG5cbiAgICBmb3IgKFxuICAgICAgbGV0IGkgPSAwO1xuICAgICAgaSA8IGhlaWdodCAqIHdpZHRoO1xuICAgICAgckltYWdlUG9pbnRlciArPSBzdGVwLCBnSW1hZ2VQb2ludGVyICs9IHN0ZXAsIGJJbWFnZVBvaW50ZXIgKz0gc3RlcCwgYUltYWdlUG9pbnRlciArPSBzdGVwLCBpKytcbiAgICApIHtcbiAgICAgIGltYWdlLmRhdGFbckltYWdlUG9pbnRlcl0gPSAoKHRlbnNvci5kYXRhW3JUZW5zb3JQb2ludGVyKytdIGFzIG51bWJlcikgLSBub3JtQmlhc1swXSkgKiBub3JtTWVhblswXTsgLy8gUiB2YWx1ZVxuICAgICAgaW1hZ2UuZGF0YVtnSW1hZ2VQb2ludGVyXSA9ICgodGVuc29yLmRhdGFbZ1RlbnNvclBvaW50ZXIrK10gYXMgbnVtYmVyKSAtIG5vcm1CaWFzWzFdKSAqIG5vcm1NZWFuWzFdOyAvLyBHIHZhbHVlXG4gICAgICBpbWFnZS5kYXRhW2JJbWFnZVBvaW50ZXJdID0gKCh0ZW5zb3IuZGF0YVtiVGVuc29yUG9pbnRlcisrXSBhcyBudW1iZXIpIC0gbm9ybUJpYXNbMl0pICogbm9ybU1lYW5bMl07IC8vIEIgdmFsdWVcbiAgICAgIGltYWdlLmRhdGFbYUltYWdlUG9pbnRlcl0gPVxuICAgICAgICBhVGVuc29yUG9pbnRlciA9PT0gLTEgPyAyNTUgOiAoKHRlbnNvci5kYXRhW2FUZW5zb3JQb2ludGVyKytdIGFzIG51bWJlcikgLSBub3JtQmlhc1szXSkgKiBub3JtTWVhblszXTsgLy8gQSB2YWx1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgYWNjZXNzIGltYWdlIGRhdGEnKTtcbiAgfVxuICByZXR1cm4gaW1hZ2U7XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge1xuICBPcHRpb25zRGltZW5zaW9ucyxcbiAgT3B0aW9uc0Zvcm1hdCxcbiAgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzLFxuICBPcHRpb25zVGVuc29yRm9ybWF0LFxuICBPcHRpb25zVGVuc29yTGF5b3V0LFxuICBUZW5zb3JGcm9tR3B1QnVmZmVyT3B0aW9ucyxcbiAgVGVuc29yRnJvbUltYWdlQml0bWFwT3B0aW9ucyxcbiAgVGVuc29yRnJvbUltYWdlRGF0YU9wdGlvbnMsXG4gIFRlbnNvckZyb21JbWFnZUVsZW1lbnRPcHRpb25zLFxuICBUZW5zb3JGcm9tTUxUZW5zb3JPcHRpb25zLFxuICBUZW5zb3JGcm9tVGV4dHVyZU9wdGlvbnMsXG4gIFRlbnNvckZyb21VcmxPcHRpb25zLFxufSBmcm9tICcuL3RlbnNvci1mYWN0b3J5LmpzJztcbmltcG9ydCB7IFRlbnNvciB9IGZyb20gJy4vdGVuc29yLWltcGwuanMnO1xuaW1wb3J0IHsgVGVuc29yIGFzIFRlbnNvckludGVyZmFjZSB9IGZyb20gJy4vdGVuc29yLmpzJztcblxuaW50ZXJmYWNlIEJ1ZmZlclRvVGVuc29yT3B0aW9uc1xuICBleHRlbmRzIE9wdGlvbnNEaW1lbnNpb25zLFxuICAgIE9wdGlvbnNUZW5zb3JMYXlvdXQsXG4gICAgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzLFxuICAgIE9wdGlvbnNGb3JtYXQsXG4gICAgT3B0aW9uc1RlbnNvckZvcm1hdCB7fVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyB0ZW5zb3Igb2JqZWN0IGZyb20gaW1hZ2Ugb2JqZWN0XG4gKlxuICogQHBhcmFtIGJ1ZmZlciAtIEV4dHJhY3RlZCBpbWFnZSBidWZmZXIgZGF0YSAtIGFzc3VtaW5nIFJHQkEgZm9ybWF0XG4gKiBAcGFyYW0gaW1hZ2VGb3JtYXQgLSBpbnB1dCBpbWFnZSBjb25maWd1cmF0aW9uIC0gcmVxdWlyZWQgY29uZmlndXJhdGlvbnMgaGVpZ2h0LCB3aWR0aCwgZm9ybWF0XG4gKiBAcGFyYW0gdGVuc29yRm9ybWF0IC0gb3V0cHV0IHRlbnNvciBjb25maWd1cmF0aW9uIC0gRGVmYXVsdCBpcyBSR0IgZm9ybWF0XG4gKi9cbmV4cG9ydCBjb25zdCBidWZmZXJUb1RlbnNvciA9IChidWZmZXI6IFVpbnQ4Q2xhbXBlZEFycmF5IHwgdW5kZWZpbmVkLCBvcHRpb25zOiBCdWZmZXJUb1RlbnNvck9wdGlvbnMpOiBUZW5zb3IgPT4ge1xuICBpZiAoYnVmZmVyID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ltYWdlIGJ1ZmZlciBtdXN0IGJlIGRlZmluZWQnKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oZWlnaHQgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLndpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ltYWdlIGhlaWdodCBhbmQgd2lkdGggbXVzdCBiZSBkZWZpbmVkJyk7XG4gIH1cbiAgaWYgKG9wdGlvbnMudGVuc29yTGF5b3V0ID09PSAnTkhXQycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05IV0MgVGVuc29yIGxheW91dCBpcyBub3Qgc3VwcG9ydGVkIHlldCcpO1xuICB9XG5cbiAgY29uc3QgeyBoZWlnaHQsIHdpZHRoIH0gPSBvcHRpb25zO1xuXG4gIGNvbnN0IG5vcm0gPSBvcHRpb25zLm5vcm0gPz8geyBtZWFuOiAyNTUsIGJpYXM6IDAgfTtcbiAgbGV0IG5vcm1NZWFuOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgbGV0IG5vcm1CaWFzOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcblxuICBpZiAodHlwZW9mIG5vcm0ubWVhbiA9PT0gJ251bWJlcicpIHtcbiAgICBub3JtTWVhbiA9IFtub3JtLm1lYW4sIG5vcm0ubWVhbiwgbm9ybS5tZWFuLCBub3JtLm1lYW5dO1xuICB9IGVsc2Uge1xuICAgIG5vcm1NZWFuID0gW25vcm0ubWVhbiFbMF0sIG5vcm0ubWVhbiFbMV0sIG5vcm0ubWVhbiFbMl0sIG5vcm0ubWVhbiFbM10gPz8gMjU1XTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygbm9ybS5iaWFzID09PSAnbnVtYmVyJykge1xuICAgIG5vcm1CaWFzID0gW25vcm0uYmlhcywgbm9ybS5iaWFzLCBub3JtLmJpYXMsIG5vcm0uYmlhc107XG4gIH0gZWxzZSB7XG4gICAgbm9ybUJpYXMgPSBbbm9ybS5iaWFzIVswXSwgbm9ybS5iaWFzIVsxXSwgbm9ybS5iaWFzIVsyXSwgbm9ybS5iaWFzIVszXSA/PyAwXTtcbiAgfVxuXG4gIGNvbnN0IGlucHV0Zm9ybWF0ID0gb3B0aW9ucy5mb3JtYXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuZm9ybWF0IDogJ1JHQkEnO1xuICAvLyBkZWZhdWx0IHZhbHVlIGlzIFJHQkEgc2luY2UgaW1hZ2VkYXRhIGFuZCBIVE1MSW1hZ2VFbGVtZW50IHVzZXMgaXRcblxuICBjb25zdCBvdXRwdXRmb3JtYXQgPVxuICAgIG9wdGlvbnMudGVuc29yRm9ybWF0ICE9PSB1bmRlZmluZWQgPyAob3B0aW9ucy50ZW5zb3JGb3JtYXQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMudGVuc29yRm9ybWF0IDogJ1JHQicpIDogJ1JHQic7XG4gIGNvbnN0IHN0cmlkZSA9IGhlaWdodCAqIHdpZHRoO1xuICBjb25zdCBmbG9hdDMyRGF0YSA9IG91dHB1dGZvcm1hdCA9PT0gJ1JHQkEnID8gbmV3IEZsb2F0MzJBcnJheShzdHJpZGUgKiA0KSA6IG5ldyBGbG9hdDMyQXJyYXkoc3RyaWRlICogMyk7XG5cbiAgLy8gRGVmYXVsdCBwb2ludGVyIGFzc2lnbm1lbnRzXG4gIGxldCBzdGVwID0gNCxcbiAgICBySW1hZ2VQb2ludGVyID0gMCxcbiAgICBnSW1hZ2VQb2ludGVyID0gMSxcbiAgICBiSW1hZ2VQb2ludGVyID0gMixcbiAgICBhSW1hZ2VQb2ludGVyID0gMztcbiAgbGV0IHJUZW5zb3JQb2ludGVyID0gMCxcbiAgICBnVGVuc29yUG9pbnRlciA9IHN0cmlkZSxcbiAgICBiVGVuc29yUG9pbnRlciA9IHN0cmlkZSAqIDIsXG4gICAgYVRlbnNvclBvaW50ZXIgPSAtMTtcblxuICAvLyBVcGRhdGluZyB0aGUgcG9pbnRlciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGUgaW5wdXQgaW1hZ2UgZm9ybWF0XG4gIGlmIChpbnB1dGZvcm1hdCA9PT0gJ1JHQicpIHtcbiAgICBzdGVwID0gMztcbiAgICBySW1hZ2VQb2ludGVyID0gMDtcbiAgICBnSW1hZ2VQb2ludGVyID0gMTtcbiAgICBiSW1hZ2VQb2ludGVyID0gMjtcbiAgICBhSW1hZ2VQb2ludGVyID0gLTE7XG4gIH1cblxuICAvLyBVcGRhdGluZyB0aGUgcG9pbnRlciBhc3NpZ25tZW50cyBiYXNlZCBvbiB0aGUgb3V0cHV0IHRlbnNvciBmb3JtYXRcbiAgaWYgKG91dHB1dGZvcm1hdCA9PT0gJ1JHQkEnKSB7XG4gICAgYVRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAzO1xuICB9IGVsc2UgaWYgKG91dHB1dGZvcm1hdCA9PT0gJ1JCRycpIHtcbiAgICByVGVuc29yUG9pbnRlciA9IDA7XG4gICAgYlRlbnNvclBvaW50ZXIgPSBzdHJpZGU7XG4gICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyO1xuICB9IGVsc2UgaWYgKG91dHB1dGZvcm1hdCA9PT0gJ0JHUicpIHtcbiAgICBiVGVuc29yUG9pbnRlciA9IDA7XG4gICAgZ1RlbnNvclBvaW50ZXIgPSBzdHJpZGU7XG4gICAgclRlbnNvclBvaW50ZXIgPSBzdHJpZGUgKiAyO1xuICB9XG5cbiAgZm9yIChcbiAgICBsZXQgaSA9IDA7XG4gICAgaSA8IHN0cmlkZTtcbiAgICBpKyssIHJJbWFnZVBvaW50ZXIgKz0gc3RlcCwgYkltYWdlUG9pbnRlciArPSBzdGVwLCBnSW1hZ2VQb2ludGVyICs9IHN0ZXAsIGFJbWFnZVBvaW50ZXIgKz0gc3RlcFxuICApIHtcbiAgICBmbG9hdDMyRGF0YVtyVGVuc29yUG9pbnRlcisrXSA9IChidWZmZXJbckltYWdlUG9pbnRlcl0gKyBub3JtQmlhc1swXSkgLyBub3JtTWVhblswXTtcbiAgICBmbG9hdDMyRGF0YVtnVGVuc29yUG9pbnRlcisrXSA9IChidWZmZXJbZ0ltYWdlUG9pbnRlcl0gKyBub3JtQmlhc1sxXSkgLyBub3JtTWVhblsxXTtcbiAgICBmbG9hdDMyRGF0YVtiVGVuc29yUG9pbnRlcisrXSA9IChidWZmZXJbYkltYWdlUG9pbnRlcl0gKyBub3JtQmlhc1syXSkgLyBub3JtTWVhblsyXTtcbiAgICBpZiAoYVRlbnNvclBvaW50ZXIgIT09IC0xICYmIGFJbWFnZVBvaW50ZXIgIT09IC0xKSB7XG4gICAgICBmbG9hdDMyRGF0YVthVGVuc29yUG9pbnRlcisrXSA9IChidWZmZXJbYUltYWdlUG9pbnRlcl0gKyBub3JtQmlhc1szXSkgLyBub3JtTWVhblszXTtcbiAgICB9XG4gIH1cblxuICAvLyBGbG9hdDMyQXJyYXkgLT4gb3J0LlRlbnNvclxuICBjb25zdCBvdXRwdXRUZW5zb3IgPVxuICAgIG91dHB1dGZvcm1hdCA9PT0gJ1JHQkEnXG4gICAgICA/IG5ldyBUZW5zb3IoJ2Zsb2F0MzInLCBmbG9hdDMyRGF0YSwgWzEsIDQsIGhlaWdodCwgd2lkdGhdKVxuICAgICAgOiBuZXcgVGVuc29yKCdmbG9hdDMyJywgZmxvYXQzMkRhdGEsIFsxLCAzLCBoZWlnaHQsIHdpZHRoXSk7XG4gIHJldHVybiBvdXRwdXRUZW5zb3I7XG59O1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci5mcm9tSW1hZ2UoKS5cbiAqL1xuZXhwb3J0IGNvbnN0IHRlbnNvckZyb21JbWFnZSA9IGFzeW5jIChcbiAgaW1hZ2U6IEltYWdlRGF0YSB8IEhUTUxJbWFnZUVsZW1lbnQgfCBJbWFnZUJpdG1hcCB8IHN0cmluZyxcbiAgb3B0aW9ucz86XG4gICAgfCBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9uc1xuICAgIHwgVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnNcbiAgICB8IFRlbnNvckZyb21JbWFnZUJpdG1hcE9wdGlvbnNcbiAgICB8IFRlbnNvckZyb21VcmxPcHRpb25zLFxuKTogUHJvbWlzZTxUZW5zb3I+ID0+IHtcbiAgLy8gY2hlY2tpbmcgdGhlIHR5cGUgb2YgaW1hZ2Ugb2JqZWN0XG4gIGNvbnN0IGlzSFRNTEltYWdlRWxlID0gdHlwZW9mIEhUTUxJbWFnZUVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGltYWdlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudDtcbiAgY29uc3QgaXNJbWFnZURhdGFFbGUgPSB0eXBlb2YgSW1hZ2VEYXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbWFnZSBpbnN0YW5jZW9mIEltYWdlRGF0YTtcbiAgY29uc3QgaXNJbWFnZUJpdG1hcCA9IHR5cGVvZiBJbWFnZUJpdG1hcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1hZ2UgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcDtcbiAgY29uc3QgaXNTdHJpbmcgPSB0eXBlb2YgaW1hZ2UgPT09ICdzdHJpbmcnO1xuXG4gIGxldCBkYXRhOiBVaW50OENsYW1wZWRBcnJheSB8IHVuZGVmaW5lZDtcbiAgbGV0IGJ1ZmZlclRvVGVuc29yT3B0aW9uczogQnVmZmVyVG9UZW5zb3JPcHRpb25zID0gb3B0aW9ucyA/PyB7fTtcblxuICBjb25zdCBjcmVhdGVDYW52YXMgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBPZmZzY3JlZW5DYW52YXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE9mZnNjcmVlbkNhbnZhcygxLCAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgaXMgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgY3JlYXRlQ2FudmFzQ29udGV4dCA9IChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50IHwgT2Zmc2NyZWVuQ2FudmFzKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBIVE1MQ2FudmFzRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgY2FudmFzIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgIHJldHVybiBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9IGVsc2UgaWYgKGNhbnZhcyBpbnN0YW5jZW9mIE9mZnNjcmVlbkNhbnZhcykge1xuICAgICAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIE9mZnNjcmVlbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuICAvLyBmaWxsaW5nIGFuZCBjaGVja2luZyBpbWFnZSBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgaWYgKGlzSFRNTEltYWdlRWxlKSB7XG4gICAgLy8gSFRNTEltYWdlRWxlbWVudCAtIGltYWdlIG9iamVjdCAtIGZvcm1hdCBpcyBSR0JBIGJ5IGRlZmF1bHRcbiAgICBjb25zdCBjYW52YXMgPSBjcmVhdGVDYW52YXMoKTtcbiAgICBjYW52YXMud2lkdGggPSBpbWFnZS53aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xuICAgIGNvbnN0IHBpeGVsczJEQ29udGV4dCA9IGNyZWF0ZUNhbnZhc0NvbnRleHQoY2FudmFzKTtcblxuICAgIGlmIChwaXhlbHMyRENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgbGV0IGhlaWdodCA9IGltYWdlLmhlaWdodDtcbiAgICAgIGxldCB3aWR0aCA9IGltYWdlLndpZHRoO1xuICAgICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnJlc2l6ZWRIZWlnaHQgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnJlc2l6ZWRXaWR0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlaWdodCA9IG9wdGlvbnMucmVzaXplZEhlaWdodDtcbiAgICAgICAgd2lkdGggPSBvcHRpb25zLnJlc2l6ZWRXaWR0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICBpZiAob3B0aW9ucy50ZW5zb3JGb3JtYXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW1hZ2UgaW5wdXQgY29uZmlnIGZvcm1hdCBtdXN0IGJlIFJHQkEgZm9yIEhUTUxJbWFnZUVsZW1lbnQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMudGVuc29yRm9ybWF0ID0gJ1JHQkEnO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy53aWR0aCA9IHdpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLnRlbnNvckZvcm1hdCA9ICdSR0JBJztcbiAgICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLndpZHRoID0gd2lkdGg7XG4gICAgICB9XG5cbiAgICAgIHBpeGVsczJEQ29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xuICAgICAgZGF0YSA9IHBpeGVsczJEQ29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCkuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGFjY2VzcyBpbWFnZSBkYXRhJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzSW1hZ2VEYXRhRWxlKSB7XG4gICAgbGV0IGhlaWdodDogbnVtYmVyO1xuICAgIGxldCB3aWR0aDogbnVtYmVyO1xuXG4gICAgaWYgKG9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnJlc2l6ZWRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMucmVzaXplZEhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBoZWlnaHQgPSBvcHRpb25zLnJlc2l6ZWRIZWlnaHQ7XG4gICAgICB3aWR0aCA9IG9wdGlvbnMucmVzaXplZFdpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICB3aWR0aCA9IGltYWdlLndpZHRoO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy5mb3JtYXQgPSAnUkdCQSc7XG4gICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLmhlaWdodCA9IGhlaWdodDtcbiAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMud2lkdGggPSB3aWR0aDtcblxuICAgIGlmIChvcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHRlbXBDYW52YXMgPSBjcmVhdGVDYW52YXMoKTtcblxuICAgICAgdGVtcENhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgdGVtcENhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgIGNvbnN0IHBpeGVsczJEQ29udGV4dCA9IGNyZWF0ZUNhbnZhc0NvbnRleHQodGVtcENhbnZhcyk7XG5cbiAgICAgIGlmIChwaXhlbHMyRENvbnRleHQgIT0gbnVsbCkge1xuICAgICAgICBwaXhlbHMyRENvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcbiAgICAgICAgZGF0YSA9IHBpeGVsczJEQ29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCkuZGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBhY2Nlc3MgaW1hZ2UgZGF0YScpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gaW1hZ2UuZGF0YTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNJbWFnZUJpdG1hcCkge1xuICAgIC8vIEltYWdlQml0bWFwIC0gaW1hZ2Ugb2JqZWN0IC0gZm9ybWF0IG11c3QgYmUgcHJvdmlkZWQgYnkgdXNlclxuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgaW1hZ2UgY29uZmlnIHdpdGggZm9ybWF0IGZvciBJbWFnZWJpdG1hcCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbnZhcyA9IGNyZWF0ZUNhbnZhcygpO1xuICAgIGNhbnZhcy53aWR0aCA9IGltYWdlLndpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgY29uc3QgcGl4ZWxzMkRDb250ZXh0ID0gY3JlYXRlQ2FudmFzQ29udGV4dChjYW52YXMpO1xuXG4gICAgaWYgKHBpeGVsczJEQ29udGV4dCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBoZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgICBjb25zdCB3aWR0aCA9IGltYWdlLndpZHRoO1xuICAgICAgcGl4ZWxzMkRDb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICBkYXRhID0gcGl4ZWxzMkRDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KS5kYXRhO1xuICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLmhlaWdodCA9IGhlaWdodDtcbiAgICAgIGJ1ZmZlclRvVGVuc29yT3B0aW9ucy53aWR0aCA9IHdpZHRoO1xuICAgICAgcmV0dXJuIGJ1ZmZlclRvVGVuc29yKGRhdGEsIGJ1ZmZlclRvVGVuc29yT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBhY2Nlc3MgaW1hZ2UgZGF0YScpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc1N0cmluZykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjYW52YXMgPSBjcmVhdGVDYW52YXMoKTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBjcmVhdGVDYW52YXNDb250ZXh0KGNhbnZhcyk7XG4gICAgICBpZiAoIWltYWdlIHx8ICFjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5ld0ltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICBuZXdJbWFnZS5jcm9zc09yaWdpbiA9ICdBbm9ueW1vdXMnO1xuICAgICAgbmV3SW1hZ2Uuc3JjID0gaW1hZ2U7XG4gICAgICBuZXdJbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IG5ld0ltYWdlLndpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gbmV3SW1hZ2UuaGVpZ2h0O1xuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZShuZXdJbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgaW1nID0gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICBidWZmZXJUb1RlbnNvck9wdGlvbnMuaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcbiAgICAgICAgYnVmZmVyVG9UZW5zb3JPcHRpb25zLndpZHRoID0gY2FudmFzLndpZHRoO1xuICAgICAgICByZXNvbHZlKGJ1ZmZlclRvVGVuc29yKGltZy5kYXRhLCBidWZmZXJUb1RlbnNvck9wdGlvbnMpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBkYXRhIHByb3ZpZGVkIGlzIG5vdCBzdXBwb3J0ZWQgLSBhYm9ydGVkIHRlbnNvciBjcmVhdGlvbicpO1xuICB9XG5cbiAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBidWZmZXJUb1RlbnNvcihkYXRhLCBidWZmZXJUb1RlbnNvck9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgZGF0YSBwcm92aWRlZCBpcyBub3Qgc3VwcG9ydGVkIC0gYWJvcnRlZCB0ZW5zb3IgY3JlYXRpb24nKTtcbiAgfVxufTtcblxuLyoqXG4gKiBpbXBsZW1lbnRhdGlvbiBvZiBUZW5zb3IuZnJvbVRleHR1cmUoKS5cbiAqL1xuZXhwb3J0IGNvbnN0IHRlbnNvckZyb21UZXh0dXJlID0gPFQgZXh0ZW5kcyBUZW5zb3JJbnRlcmZhY2UuVGV4dHVyZURhdGFUeXBlcz4oXG4gIHRleHR1cmU6IFRlbnNvckludGVyZmFjZS5UZXh0dXJlVHlwZSxcbiAgb3B0aW9uczogVGVuc29yRnJvbVRleHR1cmVPcHRpb25zPFQ+LFxuKTogVGVuc29yID0+IHtcbiAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBkb3dubG9hZCwgZGlzcG9zZSB9ID0gb3B0aW9ucztcbiAgLy8gQWx3YXlzIGFzc3VtZSBSR0JBRjMyLiBUT0RPOiBzdXBwb3J0IGRpZmZlcmVudCB0ZXh0dXJlIGZvcm1hdFxuICBjb25zdCBkaW1zID0gWzEsIGhlaWdodCwgd2lkdGgsIDRdO1xuICByZXR1cm4gbmV3IFRlbnNvcih7IGxvY2F0aW9uOiAndGV4dHVyZScsIHR5cGU6ICdmbG9hdDMyJywgdGV4dHVyZSwgZGltcywgZG93bmxvYWQsIGRpc3Bvc2UgfSk7XG59O1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci5mcm9tR3B1QnVmZmVyKCkuXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JGcm9tR3B1QnVmZmVyID0gPFQgZXh0ZW5kcyBUZW5zb3JJbnRlcmZhY2UuR3B1QnVmZmVyRGF0YVR5cGVzPihcbiAgZ3B1QnVmZmVyOiBUZW5zb3JJbnRlcmZhY2UuR3B1QnVmZmVyVHlwZSxcbiAgb3B0aW9uczogVGVuc29yRnJvbUdwdUJ1ZmZlck9wdGlvbnM8VD4sXG4pOiBUZW5zb3IgPT4ge1xuICBjb25zdCB7IGRhdGFUeXBlLCBkaW1zLCBkb3dubG9hZCwgZGlzcG9zZSB9ID0gb3B0aW9ucztcbiAgcmV0dXJuIG5ldyBUZW5zb3IoeyBsb2NhdGlvbjogJ2dwdS1idWZmZXInLCB0eXBlOiBkYXRhVHlwZSA/PyAnZmxvYXQzMicsIGdwdUJ1ZmZlciwgZGltcywgZG93bmxvYWQsIGRpc3Bvc2UgfSk7XG59O1xuXG4vKipcbiAqIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvci5mcm9tTUxUZW5zb3IoKS5cbiAqL1xuZXhwb3J0IGNvbnN0IHRlbnNvckZyb21NTFRlbnNvciA9IDxUIGV4dGVuZHMgVGVuc29ySW50ZXJmYWNlLk1MVGVuc29yRGF0YVR5cGVzPihcbiAgbWxUZW5zb3I6IFRlbnNvckludGVyZmFjZS5NTFRlbnNvclR5cGUsXG4gIG9wdGlvbnM6IFRlbnNvckZyb21NTFRlbnNvck9wdGlvbnM8VD4sXG4pOiBUZW5zb3IgPT4ge1xuICBjb25zdCB7IGRhdGFUeXBlLCBkaW1zLCBkb3dubG9hZCwgZGlzcG9zZSB9ID0gb3B0aW9ucztcbiAgcmV0dXJuIG5ldyBUZW5zb3IoeyBsb2NhdGlvbjogJ21sLXRlbnNvcicsIHR5cGU6IGRhdGFUeXBlID8/ICdmbG9hdDMyJywgbWxUZW5zb3IsIGRpbXMsIGRvd25sb2FkLCBkaXNwb3NlIH0pO1xufTtcblxuLyoqXG4gKiBpbXBsZW1lbnRhdGlvbiBvZiBUZW5zb3IuZnJvbVBpbm5lZEJ1ZmZlcigpLlxuICovXG5leHBvcnQgY29uc3QgdGVuc29yRnJvbVBpbm5lZEJ1ZmZlciA9IDxUIGV4dGVuZHMgVGVuc29ySW50ZXJmYWNlLkNwdVBpbm5lZERhdGFUeXBlcz4oXG4gIHR5cGU6IFQsXG4gIGJ1ZmZlcjogVGVuc29ySW50ZXJmYWNlLkRhdGFUeXBlTWFwW1RdLFxuICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10sXG4pOiBUZW5zb3IgPT4gbmV3IFRlbnNvcih7IGxvY2F0aW9uOiAnY3B1LXBpbm5lZCcsIHR5cGUsIGRhdGE6IGJ1ZmZlciwgZGltczogZGltcyA/PyBbYnVmZmVyLmxlbmd0aF0gfSk7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IFRlbnNvciB9IGZyb20gJy4vdGVuc29yLmpzJztcblxuZXhwb3J0IHR5cGUgU3VwcG9ydGVkVHlwZWRBcnJheUNvbnN0cnVjdG9ycyA9XG4gIHwgRmxvYXQzMkFycmF5Q29uc3RydWN0b3JcbiAgfCBVaW50OEFycmF5Q29uc3RydWN0b3JcbiAgfCBJbnQ4QXJyYXlDb25zdHJ1Y3RvclxuICB8IFVpbnQxNkFycmF5Q29uc3RydWN0b3JcbiAgfCBJbnQxNkFycmF5Q29uc3RydWN0b3JcbiAgfCBJbnQzMkFycmF5Q29uc3RydWN0b3JcbiAgfCBCaWdJbnQ2NEFycmF5Q29uc3RydWN0b3JcbiAgfCBVaW50OEFycmF5Q29uc3RydWN0b3JcbiAgfCBGbG9hdDY0QXJyYXlDb25zdHJ1Y3RvclxuICB8IFVpbnQzMkFycmF5Q29uc3RydWN0b3JcbiAgfCBCaWdVaW50NjRBcnJheUNvbnN0cnVjdG9yO1xuZXhwb3J0IHR5cGUgU3VwcG9ydGVkVHlwZWRBcnJheSA9IEluc3RhbmNlVHlwZTxTdXBwb3J0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3JzPjtcblxuLy8gYSBydW50aW1lIG1hcCB0aGF0IG1hcHMgdHlwZSBzdHJpbmcgdG8gVHlwZWRBcnJheSBjb25zdHJ1Y3Rvci4gU2hvdWxkIG1hdGNoIFRlbnNvci5EYXRhVHlwZU1hcC5cbmV4cG9ydCBjb25zdCBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQID0gbmV3IE1hcDxzdHJpbmcsIFN1cHBvcnRlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnM+KFtcbiAgWydmbG9hdDMyJywgRmxvYXQzMkFycmF5XSxcbiAgWyd1aW50OCcsIFVpbnQ4QXJyYXldLFxuICBbJ2ludDgnLCBJbnQ4QXJyYXldLFxuICBbJ3VpbnQxNicsIFVpbnQxNkFycmF5XSxcbiAgWydpbnQxNicsIEludDE2QXJyYXldLFxuICBbJ2ludDMyJywgSW50MzJBcnJheV0sXG4gIFsnYm9vbCcsIFVpbnQ4QXJyYXldLFxuICBbJ2Zsb2F0NjQnLCBGbG9hdDY0QXJyYXldLFxuICBbJ3VpbnQzMicsIFVpbnQzMkFycmF5XSxcbiAgWydpbnQ0JywgVWludDhBcnJheV0sXG4gIFsndWludDQnLCBVaW50OEFycmF5XSxcbl0pO1xuXG4vLyBhIHJ1bnRpbWUgbWFwIHRoYXQgbWFwcyB0eXBlIHN0cmluZyB0byBUeXBlZEFycmF5IGNvbnN0cnVjdG9yLiBTaG91bGQgbWF0Y2ggVGVuc29yLkRhdGFUeXBlTWFwLlxuZXhwb3J0IGNvbnN0IE5VTUVSSUNfVEVOU09SX1RZUEVEQVJSQVlfVE9fVFlQRV9NQVAgPSBuZXcgTWFwPFN1cHBvcnRlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnMsIFRlbnNvci5UeXBlPihbXG4gIFtGbG9hdDMyQXJyYXksICdmbG9hdDMyJ10sXG4gIFtVaW50OEFycmF5LCAndWludDgnXSxcbiAgW0ludDhBcnJheSwgJ2ludDgnXSxcbiAgW1VpbnQxNkFycmF5LCAndWludDE2J10sXG4gIFtJbnQxNkFycmF5LCAnaW50MTYnXSxcbiAgW0ludDMyQXJyYXksICdpbnQzMiddLFxuICBbRmxvYXQ2NEFycmF5LCAnZmxvYXQ2NCddLFxuICBbVWludDMyQXJyYXksICd1aW50MzInXSxcbl0pO1xuXG4vLyB0aGUgZm9sbG93aW5nIGNvZGUgYWxsb3dzIGRlbGF5aW5nIGV4ZWN1dGlvbiBvZiBCaWdJbnQvRmxvYXQxNkFycmF5IGNoZWNraW5nLiBUaGlzIGFsbG93cyBsYXp5IGluaXRpYWxpemF0aW9uIGZvclxuLy8gTlVNRVJJQ19URU5TT1JfVFlQRV9UT19UWVBFREFSUkFZX01BUCBhbmQgTlVNRVJJQ19URU5TT1JfVFlQRURBUlJBWV9UT19UWVBFX01BUCwgd2hpY2ggYWxsb3dzIEJpZ0ludC9GbG9hdDE2QXJyYXlcbi8vIHBvbHlmaWxsIGlmIGF2YWlsYWJsZS5cbmxldCBpc1R5cGVkQXJyYXlDaGVja2VkID0gZmFsc2U7XG5leHBvcnQgY29uc3QgY2hlY2tUeXBlZEFycmF5ID0gKCkgPT4ge1xuICBpZiAoIWlzVHlwZWRBcnJheUNoZWNrZWQpIHtcbiAgICBpc1R5cGVkQXJyYXlDaGVja2VkID0gdHJ1ZTtcbiAgICBjb25zdCBpc0JpZ0ludDY0QXJyYXlBdmFpbGFibGUgPSB0eXBlb2YgQmlnSW50NjRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgQmlnSW50NjRBcnJheS5mcm9tO1xuICAgIGNvbnN0IGlzQmlnVWludDY0QXJyYXlBdmFpbGFibGUgPSB0eXBlb2YgQmlnVWludDY0QXJyYXkgIT09ICd1bmRlZmluZWQnICYmIEJpZ1VpbnQ2NEFycmF5LmZyb207XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgY29uc3QgRmxvYXQxNkFycmF5ID0gKGdsb2JhbFRoaXMgYXMgYW55KS5GbG9hdDE2QXJyYXk7XG4gICAgY29uc3QgaXNGbG9hdDE2QXJyYXlBdmFpbGFibGUgPSB0eXBlb2YgRmxvYXQxNkFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiBGbG9hdDE2QXJyYXkuZnJvbTtcblxuICAgIGlmIChpc0JpZ0ludDY0QXJyYXlBdmFpbGFibGUpIHtcbiAgICAgIE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAuc2V0KCdpbnQ2NCcsIEJpZ0ludDY0QXJyYXkpO1xuICAgICAgTlVNRVJJQ19URU5TT1JfVFlQRURBUlJBWV9UT19UWVBFX01BUC5zZXQoQmlnSW50NjRBcnJheSwgJ2ludDY0Jyk7XG4gICAgfVxuICAgIGlmIChpc0JpZ1VpbnQ2NEFycmF5QXZhaWxhYmxlKSB7XG4gICAgICBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLnNldCgndWludDY0JywgQmlnVWludDY0QXJyYXkpO1xuICAgICAgTlVNRVJJQ19URU5TT1JfVFlQRURBUlJBWV9UT19UWVBFX01BUC5zZXQoQmlnVWludDY0QXJyYXksICd1aW50NjQnKTtcbiAgICB9XG4gICAgaWYgKGlzRmxvYXQxNkFycmF5QXZhaWxhYmxlKSB7XG4gICAgICBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLnNldCgnZmxvYXQxNicsIEZsb2F0MTZBcnJheSk7XG4gICAgICBOVU1FUklDX1RFTlNPUl9UWVBFREFSUkFZX1RPX1RZUEVfTUFQLnNldChGbG9hdDE2QXJyYXksICdmbG9hdDE2Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIEZsb2F0MTZBcnJheSBpcyBub3QgYXZhaWxhYmxlLCB1c2UgJ1VpbnQxNkFycmF5JyB0byBzdG9yZSB0aGUgZGF0YS5cbiAgICAgIE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAuc2V0KCdmbG9hdDE2JywgVWludDE2QXJyYXkpO1xuICAgIH1cbiAgfVxufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHtcbiAgQ3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzLFxuICBHcHVCdWZmZXJDb25zdHJ1Y3RvclBhcmFtZXRlcnMsXG4gIE1MVGVuc29yQ29uc3RydWN0b3JQYXJhbWV0ZXJzLFxuICBUZXh0dXJlQ29uc3RydWN0b3JQYXJhbWV0ZXJzLFxufSBmcm9tICcuL3RlbnNvci1mYWN0b3J5LmpzJztcbmltcG9ydCB7IFRlbnNvciB9IGZyb20gJy4vdGVuc29yLWltcGwuanMnO1xuXG4vKipcbiAqIGNhbGN1bGF0ZSBzaXplIGZyb20gZGltcy5cbiAqXG4gKiBAcGFyYW0gZGltcyB0aGUgZGltcyBhcnJheS4gTWF5IGJlIGFuIGlsbGVnYWwgaW5wdXQuXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxjdWxhdGVTaXplID0gKGRpbXM6IHJlYWRvbmx5IHVua25vd25bXSk6IG51bWJlciA9PiB7XG4gIGxldCBzaXplID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZGltID0gZGltc1tpXTtcbiAgICBpZiAodHlwZW9mIGRpbSAhPT0gJ251bWJlcicgfHwgIU51bWJlci5pc1NhZmVJbnRlZ2VyKGRpbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGRpbXNbJHtpfV0gbXVzdCBiZSBhbiBpbnRlZ2VyLCBnb3Q6ICR7ZGltfWApO1xuICAgIH1cbiAgICBpZiAoZGltIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYGRpbXNbJHtpfV0gbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLCBnb3Q6ICR7ZGltfWApO1xuICAgIH1cbiAgICBzaXplICo9IGRpbTtcbiAgfVxuICByZXR1cm4gc2l6ZTtcbn07XG5cbi8qKlxuICogaW1wbGVtZW50YXRpb24gb2YgVGVuc29yLnJlc2hhcGUoKVxuICovXG5leHBvcnQgY29uc3QgdGVuc29yUmVzaGFwZSA9ICh0ZW5zb3I6IFRlbnNvciwgZGltczogcmVhZG9ubHkgbnVtYmVyW10pOiBUZW5zb3IgPT4ge1xuICBzd2l0Y2ggKHRlbnNvci5sb2NhdGlvbikge1xuICAgIGNhc2UgJ2NwdSc6XG4gICAgICByZXR1cm4gbmV3IFRlbnNvcih0ZW5zb3IudHlwZSwgdGVuc29yLmRhdGEsIGRpbXMpO1xuICAgIGNhc2UgJ2NwdS1waW5uZWQnOlxuICAgICAgcmV0dXJuIG5ldyBUZW5zb3Ioe1xuICAgICAgICBsb2NhdGlvbjogJ2NwdS1waW5uZWQnLFxuICAgICAgICBkYXRhOiB0ZW5zb3IuZGF0YSBhcyBDcHVQaW5uZWRDb25zdHJ1Y3RvclBhcmFtZXRlcnNbJ2RhdGEnXSxcbiAgICAgICAgdHlwZTogdGVuc29yLnR5cGUgYXMgQ3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzWyd0eXBlJ10sXG4gICAgICAgIGRpbXMsXG4gICAgICB9KTtcbiAgICBjYXNlICd0ZXh0dXJlJzpcbiAgICAgIHJldHVybiBuZXcgVGVuc29yKHtcbiAgICAgICAgbG9jYXRpb246ICd0ZXh0dXJlJyxcbiAgICAgICAgdGV4dHVyZTogdGVuc29yLnRleHR1cmUsXG4gICAgICAgIHR5cGU6IHRlbnNvci50eXBlIGFzIFRleHR1cmVDb25zdHJ1Y3RvclBhcmFtZXRlcnNbJ3R5cGUnXSxcbiAgICAgICAgZGltcyxcbiAgICAgIH0pO1xuICAgIGNhc2UgJ2dwdS1idWZmZXInOlxuICAgICAgcmV0dXJuIG5ldyBUZW5zb3Ioe1xuICAgICAgICBsb2NhdGlvbjogJ2dwdS1idWZmZXInLFxuICAgICAgICBncHVCdWZmZXI6IHRlbnNvci5ncHVCdWZmZXIsXG4gICAgICAgIHR5cGU6IHRlbnNvci50eXBlIGFzIEdwdUJ1ZmZlckNvbnN0cnVjdG9yUGFyYW1ldGVyc1sndHlwZSddLFxuICAgICAgICBkaW1zLFxuICAgICAgfSk7XG4gICAgY2FzZSAnbWwtdGVuc29yJzpcbiAgICAgIHJldHVybiBuZXcgVGVuc29yKHtcbiAgICAgICAgbG9jYXRpb246ICdtbC10ZW5zb3InLFxuICAgICAgICBtbFRlbnNvcjogdGVuc29yLm1sVGVuc29yLFxuICAgICAgICB0eXBlOiB0ZW5zb3IudHlwZSBhcyBNTFRlbnNvckNvbnN0cnVjdG9yUGFyYW1ldGVyc1sndHlwZSddLFxuICAgICAgICBkaW1zLFxuICAgICAgfSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdGVuc29yUmVzaGFwZTogdGVuc29yIGxvY2F0aW9uICR7dGVuc29yLmxvY2F0aW9ufSBpcyBub3Qgc3VwcG9ydGVkYCk7XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IHRlbnNvclRvRGF0YVVSTCwgdGVuc29yVG9JbWFnZURhdGEgfSBmcm9tICcuL3RlbnNvci1jb252ZXJzaW9uLWltcGwuanMnO1xuaW1wb3J0IHsgVGVuc29yVG9EYXRhVXJsT3B0aW9ucywgVGVuc29yVG9JbWFnZURhdGFPcHRpb25zIH0gZnJvbSAnLi90ZW5zb3ItY29udmVyc2lvbi5qcyc7XG5pbXBvcnQge1xuICB0ZW5zb3JGcm9tR3B1QnVmZmVyLFxuICB0ZW5zb3JGcm9tSW1hZ2UsXG4gIHRlbnNvckZyb21NTFRlbnNvcixcbiAgdGVuc29yRnJvbVBpbm5lZEJ1ZmZlcixcbiAgdGVuc29yRnJvbVRleHR1cmUsXG59IGZyb20gJy4vdGVuc29yLWZhY3RvcnktaW1wbC5qcyc7XG5pbXBvcnQge1xuICBDcHVQaW5uZWRDb25zdHJ1Y3RvclBhcmFtZXRlcnMsXG4gIEdwdUJ1ZmZlckNvbnN0cnVjdG9yUGFyYW1ldGVycyxcbiAgTUxUZW5zb3JDb25zdHJ1Y3RvclBhcmFtZXRlcnMsXG4gIFRlbnNvckZyb21HcHVCdWZmZXJPcHRpb25zLFxuICBUZW5zb3JGcm9tSW1hZ2VCaXRtYXBPcHRpb25zLFxuICBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9ucyxcbiAgVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnMsXG4gIFRlbnNvckZyb21NTFRlbnNvck9wdGlvbnMsXG4gIFRlbnNvckZyb21UZXh0dXJlT3B0aW9ucyxcbiAgVGVuc29yRnJvbVVybE9wdGlvbnMsXG4gIFRleHR1cmVDb25zdHJ1Y3RvclBhcmFtZXRlcnMsXG59IGZyb20gJy4vdGVuc29yLWZhY3RvcnkuanMnO1xuaW1wb3J0IHtcbiAgY2hlY2tUeXBlZEFycmF5LFxuICBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLFxuICBOVU1FUklDX1RFTlNPUl9UWVBFREFSUkFZX1RPX1RZUEVfTUFQLFxuICBTdXBwb3J0ZWRUeXBlZEFycmF5LFxuICBTdXBwb3J0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3JzLFxufSBmcm9tICcuL3RlbnNvci1pbXBsLXR5cGUtbWFwcGluZy5qcyc7XG5pbXBvcnQgeyBjYWxjdWxhdGVTaXplLCB0ZW5zb3JSZXNoYXBlIH0gZnJvbSAnLi90ZW5zb3ItdXRpbHMtaW1wbC5qcyc7XG5pbXBvcnQgeyBUZW5zb3IgYXMgVGVuc29ySW50ZXJmYWNlIH0gZnJvbSAnLi90ZW5zb3IuanMnO1xuXG4vLyB0eXBlIGFsaWFzZXMgZm9yIHRob3NlIGV4cG9ydGVkIGZyb20gVGVuc29yIGludGVyZmFjZVxuXG50eXBlIFRlbnNvclR5cGUgPSBUZW5zb3JJbnRlcmZhY2UuVHlwZTtcbnR5cGUgVGVuc29yRGF0YVR5cGUgPSBUZW5zb3JJbnRlcmZhY2UuRGF0YVR5cGU7XG50eXBlIFRlbnNvckRhdGFMb2NhdGlvbiA9IFRlbnNvckludGVyZmFjZS5EYXRhTG9jYXRpb247XG50eXBlIFRlbnNvclRleHR1cmVUeXBlID0gVGVuc29ySW50ZXJmYWNlLlRleHR1cmVUeXBlO1xudHlwZSBUZW5zb3JHcHVCdWZmZXJUeXBlID0gVGVuc29ySW50ZXJmYWNlLkdwdUJ1ZmZlclR5cGU7XG50eXBlIFRlbnNvck1MVGVuc29yVHlwZSA9IFRlbnNvckludGVyZmFjZS5NTFRlbnNvclR5cGU7XG5cbi8qKlxuICogdGhlIGltcGxlbWVudGF0aW9uIG9mIFRlbnNvciBpbnRlcmZhY2UuXG4gKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgY2xhc3MgVGVuc29yIGltcGxlbWVudHMgVGVuc29ySW50ZXJmYWNlIHtcbiAgLy8gI3JlZ2lvbiBjb25zdHJ1Y3RvcnNcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IENQVSB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIHR5cGUsIGRhdGEgYW5kIGRpbXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICB0eXBlOiBUZW5zb3JUeXBlLFxuICAgIGRhdGE6IFRlbnNvckRhdGFUeXBlIHwgVWludDhDbGFtcGVkQXJyYXkgfCByZWFkb25seSBzdHJpbmdbXSB8IHJlYWRvbmx5IG51bWJlcltdIHwgcmVhZG9ubHkgYm9vbGVhbltdLFxuICAgIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSxcbiAgKTtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBDUFUgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLiBUeXBlIGlzIGluZmVycmVkIGZyb20gZGF0YS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGRhdGE6IFRlbnNvckRhdGFUeXBlIHwgVWludDhDbGFtcGVkQXJyYXkgfCByZWFkb25seSBzdHJpbmdbXSB8IHJlYWRvbmx5IGJvb2xlYW5bXSxcbiAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10sXG4gICk7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBwaW5uZWQgQ1BVIGRhdGEgd2l0aCB0aGUgZ2l2ZW4gdHlwZSBhbmQgZGltcy5cbiAgICpcbiAgICogVGVuc29yJ3MgbG9jYXRpb24gd2lsbCBiZSBzZXQgdG8gJ2NwdS1waW5uZWQnLlxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zIC0gU3BlY2lmeSB0aGUgcGFyYW1ldGVycyB0byBjb25zdHJ1Y3QgdGhlIHRlbnNvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogQ3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzKTtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIFdlYkdMIHRleHR1cmUgd2l0aCB0aGUgZ2l2ZW4gdHlwZSBhbmQgZGltcy5cbiAgICpcbiAgICogVGVuc29yJ3MgbG9jYXRpb24gd2lsbCBiZSBzZXQgdG8gJ3RleHR1cmUnLlxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zIC0gU3BlY2lmeSB0aGUgcGFyYW1ldGVycyB0byBjb25zdHJ1Y3QgdGhlIHRlbnNvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogVGV4dHVyZUNvbnN0cnVjdG9yUGFyYW1ldGVycyk7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBXZWJHUFUgYnVmZmVyIHdpdGggdGhlIGdpdmVuIHR5cGUgYW5kIGRpbXMuXG4gICAqXG4gICAqIFRlbnNvcidzIGxvY2F0aW9uIHdpbGwgYmUgc2V0IHRvICdncHUtYnVmZmVyJy5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtcyAtIFNwZWNpZnkgdGhlIHBhcmFtZXRlcnMgdG8gY29uc3RydWN0IHRoZSB0ZW5zb3IuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXM6IEdwdUJ1ZmZlckNvbnN0cnVjdG9yUGFyYW1ldGVycyk7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIFdlYk5OIE1MVGVuc29yIHdpdGggdGhlIGdpdmVuIHR5cGUgYW5kIGRpbXMuXG4gICAqXG4gICAqIFRlbnNvcidzIGxvY2F0aW9uIHdpbGwgYmUgc2V0IHRvICdtbC10ZW5zb3InLlxuICAgKlxuICAgKiBAcGFyYW0gcGFyYW1zIC0gU3BlY2lmeSB0aGUgcGFyYW1ldGVycyB0byBjb25zdHJ1Y3QgdGhlIHRlbnNvci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogTUxUZW5zb3JDb25zdHJ1Y3RvclBhcmFtZXRlcnMpO1xuXG4gIC8qKlxuICAgKiBpbXBsZW1lbnRhdGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGFyZzA6XG4gICAgICB8IFRlbnNvclR5cGVcbiAgICAgIHwgVGVuc29yRGF0YVR5cGVcbiAgICAgIHwgVWludDhDbGFtcGVkQXJyYXlcbiAgICAgIHwgcmVhZG9ubHkgc3RyaW5nW11cbiAgICAgIHwgcmVhZG9ubHkgYm9vbGVhbltdXG4gICAgICB8IENwdVBpbm5lZENvbnN0cnVjdG9yUGFyYW1ldGVyc1xuICAgICAgfCBUZXh0dXJlQ29uc3RydWN0b3JQYXJhbWV0ZXJzXG4gICAgICB8IEdwdUJ1ZmZlckNvbnN0cnVjdG9yUGFyYW1ldGVyc1xuICAgICAgfCBNTFRlbnNvckNvbnN0cnVjdG9yUGFyYW1ldGVycyxcbiAgICBhcmcxPzogVGVuc29yRGF0YVR5cGUgfCBVaW50OENsYW1wZWRBcnJheSB8IHJlYWRvbmx5IG51bWJlcltdIHwgcmVhZG9ubHkgc3RyaW5nW10gfCByZWFkb25seSBib29sZWFuW10sXG4gICAgYXJnMj86IHJlYWRvbmx5IG51bWJlcltdLFxuICApIHtcbiAgICAvLyBwZXJmb3JtIG9uZS10aW1lIGNoZWNrIGZvciBCaWdJbnQvRmxvYXQxNkFycmF5IHN1cHBvcnRcbiAgICBjaGVja1R5cGVkQXJyYXkoKTtcblxuICAgIGxldCB0eXBlOiBUZW5zb3JUeXBlO1xuICAgIGxldCBkaW1zOiByZWFkb25seSBudW1iZXJbXTtcblxuICAgIGlmICh0eXBlb2YgYXJnMCA9PT0gJ29iamVjdCcgJiYgJ2xvY2F0aW9uJyBpbiBhcmcwKSB7XG4gICAgICAvL1xuICAgICAgLy8gY29uc3RydWN0aW5nIHRlbnNvciBmcm9tIHNwZWNpZmljIGxvY2F0aW9uXG4gICAgICAvL1xuICAgICAgdGhpcy5kYXRhTG9jYXRpb24gPSBhcmcwLmxvY2F0aW9uO1xuICAgICAgdHlwZSA9IGFyZzAudHlwZTtcbiAgICAgIGRpbXMgPSBhcmcwLmRpbXM7XG4gICAgICBzd2l0Y2ggKGFyZzAubG9jYXRpb24pIHtcbiAgICAgICAgY2FzZSAnY3B1LXBpbm5lZCc6IHtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvciA9IE5VTUVSSUNfVEVOU09SX1RZUEVfVE9fVFlQRURBUlJBWV9NQVAuZ2V0KHR5cGUpO1xuICAgICAgICAgIGlmICghZXhwZWN0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYHVuc3VwcG9ydGVkIHR5cGUgXCIke3R5cGV9XCIgdG8gY3JlYXRlIHRlbnNvciBmcm9tIHBpbm5lZCBidWZmZXJgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCEoYXJnMC5kYXRhIGluc3RhbmNlb2YgZXhwZWN0ZWRUeXBlZEFycmF5Q29uc3RydWN0b3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBidWZmZXIgc2hvdWxkIGJlIG9mIHR5cGUgJHtleHBlY3RlZFR5cGVkQXJyYXlDb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNwdURhdGEgPSBhcmcwLmRhdGE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAndGV4dHVyZSc6IHtcbiAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Zsb2F0MzInKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGB1bnN1cHBvcnRlZCB0eXBlIFwiJHt0eXBlfVwiIHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbSB0ZXh0dXJlYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZ3B1VGV4dHVyZURhdGEgPSBhcmcwLnRleHR1cmU7XG4gICAgICAgICAgdGhpcy5kb3dubG9hZGVyID0gYXJnMC5kb3dubG9hZDtcbiAgICAgICAgICB0aGlzLmRpc3Bvc2VyID0gYXJnMC5kaXNwb3NlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2dwdS1idWZmZXInOiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHlwZSAhPT0gJ2Zsb2F0MzInICYmXG4gICAgICAgICAgICB0eXBlICE9PSAnZmxvYXQxNicgJiZcbiAgICAgICAgICAgIHR5cGUgIT09ICdpbnQzMicgJiZcbiAgICAgICAgICAgIHR5cGUgIT09ICdpbnQ2NCcgJiZcbiAgICAgICAgICAgIHR5cGUgIT09ICd1aW50MzInICYmXG4gICAgICAgICAgICB0eXBlICE9PSAndWludDgnICYmXG4gICAgICAgICAgICB0eXBlICE9PSAnYm9vbCcgJiZcbiAgICAgICAgICAgIHR5cGUgIT09ICd1aW50NCcgJiZcbiAgICAgICAgICAgIHR5cGUgIT09ICdpbnQ0J1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgdW5zdXBwb3J0ZWQgdHlwZSBcIiR7dHlwZX1cIiB0byBjcmVhdGUgdGVuc29yIGZyb20gZ3B1IGJ1ZmZlcmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmdwdUJ1ZmZlckRhdGEgPSBhcmcwLmdwdUJ1ZmZlcjtcbiAgICAgICAgICB0aGlzLmRvd25sb2FkZXIgPSBhcmcwLmRvd25sb2FkO1xuICAgICAgICAgIHRoaXMuZGlzcG9zZXIgPSBhcmcwLmRpc3Bvc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnbWwtdGVuc29yJzoge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHR5cGUgIT09ICdmbG9hdDMyJyAmJlxuICAgICAgICAgICAgdHlwZSAhPT0gJ2Zsb2F0MTYnICYmXG4gICAgICAgICAgICB0eXBlICE9PSAnaW50MzInICYmXG4gICAgICAgICAgICB0eXBlICE9PSAnaW50NjQnICYmXG4gICAgICAgICAgICB0eXBlICE9PSAndWludDMyJyAmJlxuICAgICAgICAgICAgdHlwZSAhPT0gJ3VpbnQ2NCcgJiZcbiAgICAgICAgICAgIHR5cGUgIT09ICdpbnQ4JyAmJlxuICAgICAgICAgICAgdHlwZSAhPT0gJ3VpbnQ4JyAmJlxuICAgICAgICAgICAgdHlwZSAhPT0gJ2Jvb2wnICYmXG4gICAgICAgICAgICB0eXBlICE9PSAndWludDQnICYmXG4gICAgICAgICAgICB0eXBlICE9PSAnaW50NCdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYHVuc3VwcG9ydGVkIHR5cGUgXCIke3R5cGV9XCIgdG8gY3JlYXRlIHRlbnNvciBmcm9tIE1MVGVuc29yYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubWxUZW5zb3JEYXRhID0gYXJnMC5tbFRlbnNvcjtcbiAgICAgICAgICB0aGlzLmRvd25sb2FkZXIgPSBhcmcwLmRvd25sb2FkO1xuICAgICAgICAgIHRoaXMuZGlzcG9zZXIgPSBhcmcwLmRpc3Bvc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRlbnNvciBjb25zdHJ1Y3RvcjogdW5zdXBwb3J0ZWQgbG9jYXRpb24gJyR7dGhpcy5kYXRhTG9jYXRpb259J2ApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvL1xuICAgICAgLy8gY29uc3RydWN0aW5nIHRlbnNvciBvZiBsb2NhdGlvbiAnY3B1J1xuICAgICAgLy9cbiAgICAgIGxldCBkYXRhOiBUZW5zb3JEYXRhVHlwZTtcbiAgICAgIGxldCBtYXliZURpbXM6IHR5cGVvZiBhcmcxIHwgdHlwZW9mIGFyZzI7XG4gICAgICAvLyBjaGVjayB3aGV0aGVyIGFyZzAgaXMgdHlwZSBvciBkYXRhXG4gICAgICBpZiAodHlwZW9mIGFyZzAgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIE92ZXJyaWRlOiBjb25zdHJ1Y3Rvcih0eXBlLCBkYXRhLCAuLi4pXG4gICAgICAgIC8vXG4gICAgICAgIHR5cGUgPSBhcmcwO1xuICAgICAgICBtYXliZURpbXMgPSBhcmcyO1xuICAgICAgICBpZiAoYXJnMCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBzdHJpbmcgdGVuc29yXG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFyZzEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQSBzdHJpbmcgdGVuc29yJ3MgZGF0YSBtdXN0IGJlIGEgc3RyaW5nIGFycmF5LlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gd2UgZG9uJ3QgY2hlY2sgd2hldGhlciBldmVyeSBlbGVtZW50IGluIHRoZSBhcnJheSBpcyBzdHJpbmc7IHRoaXMgaXMgdG9vIHNsb3cuIHdlIGFzc3VtZSBpdCdzIGNvcnJlY3QgYW5kXG4gICAgICAgICAgLy8gZXJyb3Igd2lsbCBiZSBwb3B1bGF0ZWQgYXQgaW5mZXJlbmNlXG4gICAgICAgICAgZGF0YSA9IGFyZzE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbnVtZXJpYyB0ZW5zb3JcbiAgICAgICAgICBjb25zdCB0eXBlZEFycmF5Q29uc3RydWN0b3IgPSBOVU1FUklDX1RFTlNPUl9UWVBFX1RPX1RZUEVEQVJSQVlfTUFQLmdldChhcmcwKTtcbiAgICAgICAgICBpZiAodHlwZWRBcnJheUNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVuc3VwcG9ydGVkIHRlbnNvciB0eXBlOiAke2FyZzB9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcxKSkge1xuICAgICAgICAgICAgaWYgKChhcmcwID09PSAnZmxvYXQxNicgJiYgdHlwZWRBcnJheUNvbnN0cnVjdG9yID09PSBVaW50MTZBcnJheSkgfHwgYXJnMCA9PT0gJ3VpbnQ0JyB8fCBhcmcwID09PSAnaW50NCcpIHtcbiAgICAgICAgICAgICAgLy8gLSAnZmxvYXQxNic6XG4gICAgICAgICAgICAgIC8vICAgV2hlbiBubyBGbG9hdDE2QXJyYXkgcG9seWZpbGwgaXMgdXNlZCwgd2UgY2Fubm90IGNyZWF0ZSAnZmxvYXQxNicgdGVuc29yIGZyb20gbnVtYmVyIGFycmF5LlxuICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAvLyAgIFRocm93IGVycm9yIGhlcmUgYmVjYXVzZSB3aGVuIHVzZXIgdHJ5IHRvIHVzZSBudW1iZXIgYXJyYXkgYXMgZGF0YSxcbiAgICAgICAgICAgICAgLy8gICBlLmcuIG5ldyBUZW5zb3IoJ2Zsb2F0MTYnLCBbMSwgMiwgMywgNF0sIGRpbXMpKSwgaXQgd2lsbCBhY3R1YWxseSBjYWxsXG4gICAgICAgICAgICAgIC8vICAgVWludDE2QXJyYXkuZnJvbShhcmcxKSB3aGljaCBnZW5lcmF0ZXMgd3JvbmcgZGF0YS5cbiAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgLy8gLSAndWludDQnIGFuZCAnaW50NCc6XG4gICAgICAgICAgICAgIC8vICAgVWludDhBcnJheS5mcm9tKGFyZzEpIHdpbGwgZ2VuZXJhdGUgd3JvbmcgZGF0YSBmb3IgJ3VpbnQ0JyBhbmQgJ2ludDQnIHRlbnNvci5cbiAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICBgQ3JlYXRpbmcgYSAke2FyZzB9IHRlbnNvciBmcm9tIG51bWJlciBhcnJheSBpcyBub3Qgc3VwcG9ydGVkLiBQbGVhc2UgdXNlICR7dHlwZWRBcnJheUNvbnN0cnVjdG9yLm5hbWV9IGFzIGRhdGEuYCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnMCA9PT0gJ3VpbnQ2NCcgfHwgYXJnMCA9PT0gJ2ludDY0Jykge1xuICAgICAgICAgICAgICAvLyB1c2UgJ2FzIGFueScgaGVyZSBiZWNhdXNlOlxuICAgICAgICAgICAgICAvLyAxLiBUeXBlU2NyaXB0J3MgY2hlY2sgb24gdHlwZSBvZiAnQXJyYXkuaXNBcnJheSgpJyBkb2VzIG5vdCB3b3JrIHdpdGggcmVhZG9ubHkgYXJyYXlzLlxuICAgICAgICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8xNzAwMlxuICAgICAgICAgICAgICAvLyAyLiBUeXBlU2NyaXB0J3MgY2hlY2sgb24gdW5pb24gdHlwZSBvZiAnKEJpZ0ludDY0QXJyYXlDb25zdHJ1Y3RvcnxCaWdVaW50NjRBcnJheUNvbnN0cnVjdG9yKS5mcm9tKCknXG4gICAgICAgICAgICAgIC8vIGRvZXMgbm90IGFjY2VwdCBwYXJhbWV0ZXIgbWFwRm4uXG4gICAgICAgICAgICAgIC8vIDMuIHBhcmFtZXRlcnMgb2YgJ1N1cHBvcnRlZFR5cGVkQXJyYXlDb25zdHJ1Y3RvcnMuZnJvbSgpJyBkb2VzIG5vdCBtYXRjaCB0aGUgcmVxdWlyZW1lbnQgb2YgdGhlIHVuaW9uXG4gICAgICAgICAgICAgIC8vIHR5cGUuXG5cbiAgICAgICAgICAgICAgLy8gYXNzdW1lICdhcmcxJyBpcyBvZiB0eXBlIFwicmVhZG9ubHkgbnVtYmVyW118cmVhZG9ubHkgYmlnaW50W11cIiBoZXJlLlxuXG4gICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICAgIGRhdGEgPSAodHlwZWRBcnJheUNvbnN0cnVjdG9yIGFzIGFueSkuZnJvbShhcmcxLCBCaWdJbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gYXNzdW1lICdhcmcxJyBpcyBvZiB0eXBlIFwicmVhZG9ubHkgbnVtYmVyW11cIiBoZXJlLlxuICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAgICAgICBkYXRhID0gKHR5cGVkQXJyYXlDb25zdHJ1Y3RvciBhcyBhbnkpLmZyb20oYXJnMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChhcmcxIGluc3RhbmNlb2YgdHlwZWRBcnJheUNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBkYXRhID0gYXJnMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFyZzEgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheSkge1xuICAgICAgICAgICAgaWYgKGFyZzAgPT09ICd1aW50OCcpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IFVpbnQ4QXJyYXkuZnJvbShhcmcxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEEgVWludDhDbGFtcGVkQXJyYXkgdGVuc29yJ3MgZGF0YSBtdXN0IGJlIHR5cGUgb2YgdWludDhgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGFyZzAgPT09ICdmbG9hdDE2JyAmJiBhcmcxIGluc3RhbmNlb2YgVWludDE2QXJyYXkgJiYgdHlwZWRBcnJheUNvbnN0cnVjdG9yICE9PSBVaW50MTZBcnJheSkge1xuICAgICAgICAgICAgLy8gd2hlbiBGbG9hdDE2QXJyYXkgaXMgYXZhaWxhYmxlIGFuZCBkYXRhIGlzIG9mIHR5cGUgVWludDE2QXJyYXkuXG4gICAgICAgICAgICAvLyBXZSBhbGxvdyBVaW50MTZBcnJheSB0byBiZSBwYXNzZWQgaW4gYXMgZGF0YSBmb3IgJ2Zsb2F0MTYnIHRlbnNvciB1bnRpbCBGbG9hdDE2QXJyYXkgaXMgZ2VuZXJhbGx5XG4gICAgICAgICAgICAvLyBzdXBwb3J0ZWQgaW4gSmF2YVNjcmlwdCBlbnZpcm9ubWVudC5cblxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIGRhdGEgPSBuZXcgKGdsb2JhbFRoaXMgYXMgYW55KS5GbG9hdDE2QXJyYXkoYXJnMS5idWZmZXIsIGFyZzEuYnl0ZU9mZnNldCwgYXJnMS5sZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBBICR7dHlwZX0gdGVuc29yJ3MgZGF0YSBtdXN0IGJlIHR5cGUgb2YgJHt0eXBlZEFycmF5Q29uc3RydWN0b3J9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL1xuICAgICAgICAvLyBPdmVycmlkZTogY29uc3RydWN0b3IoZGF0YSwgLi4uKVxuICAgICAgICAvL1xuICAgICAgICBtYXliZURpbXMgPSBhcmcxO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcwKSkge1xuICAgICAgICAgIC8vIG9ubHkgYm9vbGVhbltdIGFuZCBzdHJpbmdbXSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICBpZiAoYXJnMC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RlbnNvciB0eXBlIGNhbm5vdCBiZSBpbmZlcnJlZCBmcm9tIGFuIGVtcHR5IGFycmF5LicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBmaXJzdEVsZW1lbnRUeXBlID0gdHlwZW9mIGFyZzBbMF07XG4gICAgICAgICAgaWYgKGZpcnN0RWxlbWVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0eXBlID0gJ3N0cmluZyc7XG4gICAgICAgICAgICBkYXRhID0gYXJnMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpcnN0RWxlbWVudFR5cGUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdHlwZSA9ICdib29sJztcbiAgICAgICAgICAgIC8vICdhcmcwJyBpcyBvZiB0eXBlICdib29sZWFuW10nLiBVaW50OEFycmF5LmZyb20oYm9vbGVhbltdKSBhY3R1YWxseSB3b3JrcywgYnV0IHR5cGVzY3JpcHQgdGhpbmtzIHRoaXMgaXNcbiAgICAgICAgICAgIC8vIHdyb25nIHR5cGUuIFdlIHVzZSAnYXMgYW55JyB0byBtYWtlIGl0IGhhcHB5LlxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIGRhdGEgPSBVaW50OEFycmF5LmZyb20oYXJnMCBhcyBhbnlbXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgZWxlbWVudCB0eXBlIG9mIGRhdGEgYXJyYXk6ICR7Zmlyc3RFbGVtZW50VHlwZX0uYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFyZzAgaW5zdGFuY2VvZiBVaW50OENsYW1wZWRBcnJheSkge1xuICAgICAgICAgIHR5cGUgPSAndWludDgnO1xuICAgICAgICAgIGRhdGEgPSBVaW50OEFycmF5LmZyb20oYXJnMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ2V0IHRlbnNvciB0eXBlIGZyb20gVHlwZWRBcnJheVxuICAgICAgICAgIGNvbnN0IG1hcHBlZFR5cGUgPSBOVU1FUklDX1RFTlNPUl9UWVBFREFSUkFZX1RPX1RZUEVfTUFQLmdldChcbiAgICAgICAgICAgIGFyZzAuY29uc3RydWN0b3IgYXMgU3VwcG9ydGVkVHlwZWRBcnJheUNvbnN0cnVjdG9ycyxcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChtYXBwZWRUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVuc3VwcG9ydGVkIHR5cGUgZm9yIHRlbnNvciBkYXRhOiAke2FyZzAuY29uc3RydWN0b3J9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0eXBlID0gbWFwcGVkVHlwZTtcbiAgICAgICAgICBkYXRhID0gYXJnMCBhcyBTdXBwb3J0ZWRUeXBlZEFycmF5O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHR5cGUgYW5kIGRhdGEgaXMgcHJvY2Vzc2VkLCBub3cgcHJvY2Vzc2luZyBkaW1zXG4gICAgICBpZiAobWF5YmVEaW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gYXNzdW1lIDEtRCB0ZW5zb3IgaWYgZGltcyBvbWl0dGVkXG4gICAgICAgIG1heWJlRGltcyA9IFtkYXRhLmxlbmd0aF07XG4gICAgICB9IGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KG1heWJlRGltcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkEgdGVuc29yJ3MgZGltcyBtdXN0IGJlIGEgbnVtYmVyIGFycmF5XCIpO1xuICAgICAgfVxuICAgICAgZGltcyA9IG1heWJlRGltcyBhcyByZWFkb25seSBudW1iZXJbXTtcblxuICAgICAgdGhpcy5jcHVEYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuZGF0YUxvY2F0aW9uID0gJ2NwdSc7XG4gICAgfVxuXG4gICAgLy8gcGVyZm9ybSBjaGVjayBvbiBkaW1zXG4gICAgY29uc3Qgc2l6ZSA9IGNhbGN1bGF0ZVNpemUoZGltcyk7XG4gICAgLy8gaWYgZGF0YSBpcyBvbiBDUFUsIGNoZWNrIHdoZXRoZXIgZGF0YSBsZW5ndGggbWF0Y2hlcyB0ZW5zb3Igc2l6ZVxuICAgIGlmICh0aGlzLmNwdURhdGEgJiYgc2l6ZSAhPT0gdGhpcy5jcHVEYXRhLmxlbmd0aCkge1xuICAgICAgaWYgKCh0eXBlID09PSAndWludDQnIHx8IHR5cGUgPT09ICdpbnQ0JykgJiYgTWF0aC5jZWlsKHNpemUgLyAyKSA9PT0gdGhpcy5jcHVEYXRhLmxlbmd0aCkge1xuICAgICAgICAvLyBmb3IgKHUpaW50NCwgdGhlIGRhdGEgbGVuZ3RoIGlzIGhhbGYgb2YgdGhlIHRlbnNvciBzaXplLiBTbyB3ZSBjaGVjayB0aGlzIHNwZWNpYWwgY2FzZSB3aGVuIHNpemUgaXMgb2RkLlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUZW5zb3IncyBzaXplKCR7c2l6ZX0pIGRvZXMgbm90IG1hdGNoIGRhdGEgbGVuZ3RoKCR7dGhpcy5jcHVEYXRhLmxlbmd0aH0pLmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kaW1zID0gZGltcztcbiAgICB0aGlzLnNpemUgPSBzaXplO1xuICB9XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIGZhY3RvcnlcbiAgc3RhdGljIGFzeW5jIGZyb21JbWFnZShcbiAgICBpbWFnZTogSW1hZ2VEYXRhIHwgSFRNTEltYWdlRWxlbWVudCB8IEltYWdlQml0bWFwIHwgc3RyaW5nLFxuICAgIG9wdGlvbnM/OlxuICAgICAgfCBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9uc1xuICAgICAgfCBUZW5zb3JGcm9tSW1hZ2VFbGVtZW50T3B0aW9uc1xuICAgICAgfCBUZW5zb3JGcm9tSW1hZ2VCaXRtYXBPcHRpb25zXG4gICAgICB8IFRlbnNvckZyb21VcmxPcHRpb25zLFxuICApOiBQcm9taXNlPFRlbnNvckludGVyZmFjZT4ge1xuICAgIHJldHVybiB0ZW5zb3JGcm9tSW1hZ2UoaW1hZ2UsIG9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21UZXh0dXJlPFQgZXh0ZW5kcyBUZW5zb3JJbnRlcmZhY2UuVGV4dHVyZURhdGFUeXBlcz4oXG4gICAgdGV4dHVyZTogVGVuc29yVGV4dHVyZVR5cGUsXG4gICAgb3B0aW9uczogVGVuc29yRnJvbVRleHR1cmVPcHRpb25zPFQ+LFxuICApOiBUZW5zb3JJbnRlcmZhY2Uge1xuICAgIHJldHVybiB0ZW5zb3JGcm9tVGV4dHVyZSh0ZXh0dXJlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tR3B1QnVmZmVyPFQgZXh0ZW5kcyBUZW5zb3JJbnRlcmZhY2UuR3B1QnVmZmVyRGF0YVR5cGVzPihcbiAgICBncHVCdWZmZXI6IFRlbnNvckdwdUJ1ZmZlclR5cGUsXG4gICAgb3B0aW9uczogVGVuc29yRnJvbUdwdUJ1ZmZlck9wdGlvbnM8VD4sXG4gICk6IFRlbnNvckludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRlbnNvckZyb21HcHVCdWZmZXIoZ3B1QnVmZmVyLCBvcHRpb25zKTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tTUxUZW5zb3I8VCBleHRlbmRzIFRlbnNvckludGVyZmFjZS5NTFRlbnNvckRhdGFUeXBlcz4oXG4gICAgbWxUZW5zb3I6IFRlbnNvck1MVGVuc29yVHlwZSxcbiAgICBvcHRpb25zOiBUZW5zb3JGcm9tTUxUZW5zb3JPcHRpb25zPFQ+LFxuICApOiBUZW5zb3JJbnRlcmZhY2Uge1xuICAgIHJldHVybiB0ZW5zb3JGcm9tTUxUZW5zb3IobWxUZW5zb3IsIG9wdGlvbnMpO1xuICB9XG5cbiAgc3RhdGljIGZyb21QaW5uZWRCdWZmZXI8VCBleHRlbmRzIFRlbnNvckludGVyZmFjZS5DcHVQaW5uZWREYXRhVHlwZXM+KFxuICAgIHR5cGU6IFQsXG4gICAgYnVmZmVyOiBUZW5zb3JJbnRlcmZhY2UuRGF0YVR5cGVNYXBbVF0sXG4gICAgZGltcz86IHJlYWRvbmx5IG51bWJlcltdLFxuICApOiBUZW5zb3Ige1xuICAgIHJldHVybiB0ZW5zb3JGcm9tUGlubmVkQnVmZmVyKHR5cGUsIGJ1ZmZlciwgZGltcyk7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBjb252ZXJzaW9uc1xuICB0b0RhdGFVUkwob3B0aW9ucz86IFRlbnNvclRvRGF0YVVybE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIHJldHVybiB0ZW5zb3JUb0RhdGFVUkwodGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICB0b0ltYWdlRGF0YShvcHRpb25zPzogVGVuc29yVG9JbWFnZURhdGFPcHRpb25zKTogSW1hZ2VEYXRhIHtcbiAgICByZXR1cm4gdGVuc29yVG9JbWFnZURhdGEodGhpcywgb3B0aW9ucyk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gcHVibGljIGZpZWxkc1xuICByZWFkb25seSBkaW1zOiByZWFkb25seSBudW1iZXJbXTtcbiAgcmVhZG9ubHkgdHlwZTogVGVuc29yVHlwZTtcbiAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBwcml2YXRlIGZpZWxkc1xuXG4gIC8qKlxuICAgKiBzdG9yZXMgdGhlIGxvY2F0aW9uIG9mIHRoZSBkYXRhLlxuICAgKi9cbiAgcHJpdmF0ZSBkYXRhTG9jYXRpb246IFRlbnNvckRhdGFMb2NhdGlvbjtcblxuICAvKipcbiAgICogc3RvcmVzIHRoZSBkYXRhIG9uIENQVSwgaWYgbG9jYXRpb24gaXMgJ2NwdScgb3IgJ2NwdS1waW5uZWQnLiBvdGhlcndpc2UgZW1wdHkuXG4gICAqL1xuICBwcml2YXRlIGNwdURhdGE/OiBUZW5zb3JEYXRhVHlwZTtcblxuICAvKipcbiAgICogc3RvcmVzIHRoZSB1bmRlcmx5aW5nIHRleHR1cmUgd2hlbiBsb2NhdGlvbiBpcyAndGV4dHVyZScuIG90aGVyd2lzZSBlbXB0eS5cbiAgICovXG4gIHByaXZhdGUgZ3B1VGV4dHVyZURhdGE/OiBUZW5zb3JUZXh0dXJlVHlwZTtcblxuICAvKipcbiAgICogc3RvcmVzIHRoZSB1bmRlcmx5aW5nIEdQVSBidWZmZXIgd2hlbiBsb2NhdGlvbiBpcyAnZ3B1LWJ1ZmZlcicuIG90aGVyd2lzZSBlbXB0eS5cbiAgICovXG4gIHByaXZhdGUgZ3B1QnVmZmVyRGF0YT86IFRlbnNvckdwdUJ1ZmZlclR5cGU7XG5cbiAgLyoqXG4gICAqIHN0b3JlcyB0aGUgdW5kZXJseWluZyBXZWJOTiBNTFRlbnNvciB3aGVuIGxvY2F0aW9uIGlzICdtbC10ZW5zb3InLiBvdGhlcndpc2UgZW1wdHkuXG4gICAqL1xuICBwcml2YXRlIG1sVGVuc29yRGF0YT86IFRlbnNvck1MVGVuc29yVHlwZTtcblxuICAvKipcbiAgICogc3RvcmVzIGFuIG9wdGlvbmFsIGRvd25sb2FkZXIgZnVuY3Rpb24gdG8gZG93bmxvYWQgZGF0YSBmcm9tIEdQVSB0byBDUFUuXG4gICAqL1xuICBwcml2YXRlIGRvd25sb2FkZXI/KCk6IFByb21pc2U8VGVuc29yRGF0YVR5cGU+O1xuXG4gIC8qKlxuICAgKiBhIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBkYXRhIGlzIGJlaW5nIGRvd25sb2FkZWQgZnJvbSBHUFUgdG8gQ1BVLlxuICAgKi9cbiAgcHJpdmF0ZSBpc0Rvd25sb2FkaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogc3RvcmVzIGFuIG9wdGlvbmFsIGRpc3Bvc2VyIGZ1bmN0aW9uIHRvIGRpc3Bvc2UgdGhlIHVuZGVybHlpbmcgZGF0YS5cbiAgICovXG4gIHByaXZhdGUgZGlzcG9zZXI/KCk6IHZvaWQ7XG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIHByb3BlcnRpZXNcbiAgZ2V0IGRhdGEoKTogVGVuc29yRGF0YVR5cGUge1xuICAgIHRoaXMuZW5zdXJlVmFsaWQoKTtcbiAgICBpZiAoIXRoaXMuY3B1RGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIGRhdGEgaXMgbm90IG9uIENQVS4gVXNlIGBnZXREYXRhKClgIHRvIGRvd25sb2FkIEdQVSBkYXRhIHRvIENQVSwgJyArXG4gICAgICAgICAgJ29yIHVzZSBgdGV4dHVyZWAgb3IgYGdwdUJ1ZmZlcmAgcHJvcGVydHkgdG8gYWNjZXNzIHRoZSBHUFUgZGF0YSBkaXJlY3RseS4nLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3B1RGF0YTtcbiAgfVxuXG4gIGdldCBsb2NhdGlvbigpOiBUZW5zb3JEYXRhTG9jYXRpb24ge1xuICAgIHJldHVybiB0aGlzLmRhdGFMb2NhdGlvbjtcbiAgfVxuXG4gIGdldCB0ZXh0dXJlKCk6IFRlbnNvclRleHR1cmVUeXBlIHtcbiAgICB0aGlzLmVuc3VyZVZhbGlkKCk7XG4gICAgaWYgKCF0aGlzLmdwdVRleHR1cmVEYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBkYXRhIGlzIG5vdCBzdG9yZWQgYXMgYSBXZWJHTCB0ZXh0dXJlLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ncHVUZXh0dXJlRGF0YTtcbiAgfVxuXG4gIGdldCBncHVCdWZmZXIoKTogVGVuc29yR3B1QnVmZmVyVHlwZSB7XG4gICAgdGhpcy5lbnN1cmVWYWxpZCgpO1xuICAgIGlmICghdGhpcy5ncHVCdWZmZXJEYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBkYXRhIGlzIG5vdCBzdG9yZWQgYXMgYSBXZWJHUFUgYnVmZmVyLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ncHVCdWZmZXJEYXRhO1xuICB9XG5cbiAgZ2V0IG1sVGVuc29yKCk6IFRlbnNvck1MVGVuc29yVHlwZSB7XG4gICAgdGhpcy5lbnN1cmVWYWxpZCgpO1xuICAgIGlmICghdGhpcy5tbFRlbnNvckRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGRhdGEgaXMgbm90IHN0b3JlZCBhcyBhIFdlYk5OIE1MVGVuc29yLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tbFRlbnNvckRhdGE7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gbWV0aG9kc1xuXG4gIGFzeW5jIGdldERhdGEocmVsZWFzZURhdGE/OiBib29sZWFuKTogUHJvbWlzZTxUZW5zb3JEYXRhVHlwZT4ge1xuICAgIHRoaXMuZW5zdXJlVmFsaWQoKTtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YUxvY2F0aW9uKSB7XG4gICAgICBjYXNlICdjcHUnOlxuICAgICAgY2FzZSAnY3B1LXBpbm5lZCc6XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICBjYXNlICd0ZXh0dXJlJzpcbiAgICAgIGNhc2UgJ2dwdS1idWZmZXInOlxuICAgICAgY2FzZSAnbWwtdGVuc29yJzoge1xuICAgICAgICBpZiAoIXRoaXMuZG93bmxvYWRlcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGN1cnJlbnQgdGVuc29yIGlzIG5vdCBjcmVhdGVkIHdpdGggYSBzcGVjaWZpZWQgZGF0YSBkb3dubG9hZGVyLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRG93bmxvYWRpbmcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjdXJyZW50IHRlbnNvciBpcyBiZWluZyBkb3dubG9hZGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5pc0Rvd25sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5kb3dubG9hZGVyKCk7XG4gICAgICAgICAgdGhpcy5kb3dubG9hZGVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMuZGF0YUxvY2F0aW9uID0gJ2NwdSc7XG4gICAgICAgICAgdGhpcy5jcHVEYXRhID0gZGF0YTtcblxuICAgICAgICAgIGlmIChyZWxlYXNlRGF0YSAmJiB0aGlzLmRpc3Bvc2VyKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3Bvc2VyKCk7XG4gICAgICAgICAgICB0aGlzLmRpc3Bvc2VyID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRoaXMuaXNEb3dubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGNhbm5vdCBnZXQgZGF0YSBmcm9tIGxvY2F0aW9uOiAke3RoaXMuZGF0YUxvY2F0aW9ufWApO1xuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNEb3dubG9hZGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgY3VycmVudCB0ZW5zb3IgaXMgYmVpbmcgZG93bmxvYWRlZC4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kaXNwb3Nlcikge1xuICAgICAgdGhpcy5kaXNwb3NlcigpO1xuICAgICAgdGhpcy5kaXNwb3NlciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5jcHVEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZ3B1VGV4dHVyZURhdGEgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5ncHVCdWZmZXJEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWxUZW5zb3JEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZG93bmxvYWRlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmlzRG93bmxvYWRpbmcgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmRhdGFMb2NhdGlvbiA9ICdub25lJztcbiAgfVxuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIHRlbnNvciB1dGlsaXRpZXNcbiAgcHJpdmF0ZSBlbnN1cmVWYWxpZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kYXRhTG9jYXRpb24gPT09ICdub25lJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdGVuc29yIGlzIGRpc3Bvc2VkLicpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2hhcGUoZGltczogcmVhZG9ubHkgbnVtYmVyW10pOiBUZW5zb3JJbnRlcmZhY2Uge1xuICAgIHRoaXMuZW5zdXJlVmFsaWQoKTtcbiAgICBpZiAodGhpcy5kb3dubG9hZGVyIHx8IHRoaXMuZGlzcG9zZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlc2hhcGUgYSB0ZW5zb3IgdGhhdCBvd25zIEdQVSByZXNvdXJjZS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbnNvclJlc2hhcGUodGhpcywgZGltcyk7XG4gIH1cbiAgLy8gI2VuZHJlZ2lvblxufVxuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBUZW5zb3JGYWN0b3J5IH0gZnJvbSAnLi90ZW5zb3ItZmFjdG9yeS5qcyc7XG5pbXBvcnQgeyBUZW5zb3IgYXMgVGVuc29ySW1wbCB9IGZyb20gJy4vdGVuc29yLWltcGwuanMnO1xuaW1wb3J0IHsgVHlwZWRUZW5zb3JVdGlscyB9IGZyb20gJy4vdGVuc29yLXV0aWxzLmpzJztcbmltcG9ydCB7IFRyeUdldEdsb2JhbFR5cGUgfSBmcm9tICcuL3R5cGUtaGVscGVyLmpzJztcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlZGVjbGFyZSAqL1xuXG4vKipcbiAqIHJlcHJlc2VudCBhIGJhc2ljIHRlbnNvciB3aXRoIHNwZWNpZmllZCBkaW1lbnNpb25zIGFuZCBkYXRhIHR5cGUuXG4gKi9cbmludGVyZmFjZSBUeXBlZFRlbnNvckJhc2U8VCBleHRlbmRzIFRlbnNvci5UeXBlPiB7XG4gIC8qKlxuICAgKiBHZXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHRlbnNvci5cbiAgICovXG4gIHJlYWRvbmx5IGRpbXM6IHJlYWRvbmx5IG51bWJlcltdO1xuICAvKipcbiAgICogR2V0IHRoZSBkYXRhIHR5cGUgb2YgdGhlIHRlbnNvci5cbiAgICovXG4gIHJlYWRvbmx5IHR5cGU6IFQ7XG4gIC8qKlxuICAgKiBHZXQgdGhlIGJ1ZmZlciBkYXRhIG9mIHRoZSB0ZW5zb3IuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIG5vdCBvbiBDUFUgKGVnLiBpdCdzIGluIHRoZSBmb3JtIG9mIFdlYkdMIHRleHR1cmUgb3IgV2ViR1BVIGJ1ZmZlciksIHRocm93IGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgZGF0YTogVGVuc29yLkRhdGFUeXBlTWFwW1RdO1xuICAvKipcbiAgICogR2V0IHRoZSBsb2NhdGlvbiBvZiB0aGUgZGF0YS5cbiAgICovXG4gIHJlYWRvbmx5IGxvY2F0aW9uOiBUZW5zb3IuRGF0YUxvY2F0aW9uO1xuICAvKipcbiAgICogR2V0IHRoZSBXZWJHTCB0ZXh0dXJlIHRoYXQgaG9sZHMgdGhlIHRlbnNvciBkYXRhLlxuICAgKlxuICAgKiBJZiB0aGUgZGF0YSBpcyBub3Qgb24gR1BVIGFzIFdlYkdMIHRleHR1cmUsIHRocm93IGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgdGV4dHVyZTogVGVuc29yLlRleHR1cmVUeXBlO1xuICAvKipcbiAgICogR2V0IHRoZSBXZWJHUFUgYnVmZmVyIHRoYXQgaG9sZHMgdGhlIHRlbnNvciBkYXRhLlxuICAgKlxuICAgKiBJZiB0aGUgZGF0YSBpcyBub3Qgb24gR1BVIGFzIFdlYkdQVSBidWZmZXIsIHRocm93IGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3B1QnVmZmVyOiBUZW5zb3IuR3B1QnVmZmVyVHlwZTtcblxuICAvKipcbiAgICogR2V0IHRoZSBXZWJOTiBNTFRlbnNvciB0aGF0IGhvbGRzIHRoZSB0ZW5zb3IgZGF0YS5cbiAgICpcbiAgICogSWYgdGhlIGRhdGEgaXMgbm90IGluIGEgV2ViTk4gTUxUZW5zb3IsIHRocm93IGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgbWxUZW5zb3I6IFRlbnNvci5NTFRlbnNvclR5cGU7XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYnVmZmVyIGRhdGEgb2YgdGhlIHRlbnNvci5cbiAgICpcbiAgICogSWYgdGhlIGRhdGEgaXMgb24gQ1BVLCByZXR1cm5zIHRoZSBkYXRhIGltbWVkaWF0ZWx5LlxuICAgKiBJZiB0aGUgZGF0YSBpcyBvbiBHUFUsIGRvd25sb2FkcyB0aGUgZGF0YSBhbmQgcmV0dXJucyB0aGUgcHJvbWlzZS5cbiAgICpcbiAgICogQHBhcmFtIHJlbGVhc2VEYXRhIC0gd2hldGhlciByZWxlYXNlIHRoZSBkYXRhIG9uIEdQVS4gSWdub3JlIGlmIGRhdGEgaXMgYWxyZWFkeSBvbiBDUFUuXG4gICAqL1xuICBnZXREYXRhKHJlbGVhc2VEYXRhPzogYm9vbGVhbik6IFByb21pc2U8VGVuc29yLkRhdGFUeXBlTWFwW1RdPjtcblxuICAvKipcbiAgICogRGlzcG9zZSB0aGUgdGVuc29yIGRhdGEuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIG9uIENQVSwgcmVtb3ZlIGl0cyBpbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIHVuZGVybHlpbmcgZGF0YS5cbiAgICogSWYgdGhlIGRhdGEgaXMgb24gR1BVLCByZWxlYXNlIHRoZSBkYXRhIG9uIEdQVS5cbiAgICpcbiAgICogQWZ0ZXIgY2FsbGluZyB0aGlzIGZ1bmN0aW9uLCB0aGUgdGVuc29yIGlzIGNvbnNpZGVyZWQgbm8gbG9uZ2VyIHZhbGlkLiBJdHMgbG9jYXRpb24gd2lsbCBiZSBzZXQgdG8gJ25vbmUnLlxuICAgKi9cbiAgZGlzcG9zZSgpOiB2b2lkO1xufVxuXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgVGVuc29yIHtcbiAgaW50ZXJmYWNlIERhdGFUeXBlTWFwIHtcbiAgICBmbG9hdDMyOiBGbG9hdDMyQXJyYXk7XG4gICAgdWludDg6IFVpbnQ4QXJyYXk7XG4gICAgaW50ODogSW50OEFycmF5O1xuICAgIHVpbnQxNjogVWludDE2QXJyYXk7XG4gICAgaW50MTY6IEludDE2QXJyYXk7XG4gICAgaW50MzI6IEludDMyQXJyYXk7XG4gICAgaW50NjQ6IEJpZ0ludDY0QXJyYXk7XG4gICAgc3RyaW5nOiBzdHJpbmdbXTtcbiAgICBib29sOiBVaW50OEFycmF5O1xuICAgIGZsb2F0MTY6IFVpbnQxNkFycmF5OyAvLyBLZWVwIHVzaW5nIFVpbnQxNkFycmF5IHVudGlsIHdlIGhhdmUgYSBjb25jcmV0ZSBzb2x1dGlvbiBmb3IgZmxvYXQgMTYuXG4gICAgZmxvYXQ2NDogRmxvYXQ2NEFycmF5O1xuICAgIHVpbnQzMjogVWludDMyQXJyYXk7XG4gICAgdWludDY0OiBCaWdVaW50NjRBcnJheTtcbiAgICAvLyBjb21wbGV4NjQ6IG5ldmVyO1xuICAgIC8vIGNvbXBsZXgxMjg6IG5ldmVyO1xuICAgIC8vIGJmbG9hdDE2OiBuZXZlcjtcbiAgICB1aW50NDogVWludDhBcnJheTtcbiAgICBpbnQ0OiBJbnQ4QXJyYXk7XG4gIH1cblxuICBpbnRlcmZhY2UgRWxlbWVudFR5cGVNYXAge1xuICAgIGZsb2F0MzI6IG51bWJlcjtcbiAgICB1aW50ODogbnVtYmVyO1xuICAgIGludDg6IG51bWJlcjtcbiAgICB1aW50MTY6IG51bWJlcjtcbiAgICBpbnQxNjogbnVtYmVyO1xuICAgIGludDMyOiBudW1iZXI7XG4gICAgaW50NjQ6IGJpZ2ludDtcbiAgICBzdHJpbmc6IHN0cmluZztcbiAgICBib29sOiBib29sZWFuO1xuICAgIGZsb2F0MTY6IG51bWJlcjsgLy8gS2VlcCB1c2luZyBVaW50MTZBcnJheSB1bnRpbCB3ZSBoYXZlIGEgY29uY3JldGUgc29sdXRpb24gZm9yIGZsb2F0IDE2LlxuICAgIGZsb2F0NjQ6IG51bWJlcjtcbiAgICB1aW50MzI6IG51bWJlcjtcbiAgICB1aW50NjQ6IGJpZ2ludDtcbiAgICAvLyBjb21wbGV4NjQ6IG5ldmVyO1xuICAgIC8vIGNvbXBsZXgxMjg6IG5ldmVyO1xuICAgIC8vIGJmbG9hdDE2OiBuZXZlcjtcbiAgICB1aW50NDogbnVtYmVyO1xuICAgIGludDQ6IG51bWJlcjtcbiAgfVxuXG4gIHR5cGUgRGF0YVR5cGUgPSBEYXRhVHlwZU1hcFtUeXBlXTtcbiAgdHlwZSBFbGVtZW50VHlwZSA9IEVsZW1lbnRUeXBlTWFwW1R5cGVdO1xuXG4gIC8qKlxuICAgKiBzdXBwb3J0ZWQgZGF0YSB0eXBlcyBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBwaW5uZWQgQ1BVIGJ1ZmZlclxuICAgKi9cbiAgZXhwb3J0IHR5cGUgQ3B1UGlubmVkRGF0YVR5cGVzID0gRXhjbHVkZTxUZW5zb3IuVHlwZSwgJ3N0cmluZyc+O1xuXG4gIC8qKlxuICAgKiB0eXBlIGFsaWFzIGZvciBXZWJHTCB0ZXh0dXJlXG4gICAqL1xuICBleHBvcnQgdHlwZSBUZXh0dXJlVHlwZSA9IFdlYkdMVGV4dHVyZTtcblxuICAvKipcbiAgICogc3VwcG9ydGVkIGRhdGEgdHlwZXMgZm9yIGNvbnN0cnVjdGluZyBhIHRlbnNvciBmcm9tIGEgV2ViR0wgdGV4dHVyZVxuICAgKi9cbiAgZXhwb3J0IHR5cGUgVGV4dHVyZURhdGFUeXBlcyA9ICdmbG9hdDMyJztcblxuICB0eXBlIEdwdUJ1ZmZlclR5cGVGYWxsYmFjayA9IHsgc2l6ZTogbnVtYmVyOyBtYXBTdGF0ZTogJ3VubWFwcGVkJyB8ICdwZW5kaW5nJyB8ICdtYXBwZWQnIH07XG4gIC8qKlxuICAgKiB0eXBlIGFsaWFzIGZvciBXZWJHUFUgYnVmZmVyXG4gICAqL1xuICBleHBvcnQgdHlwZSBHcHVCdWZmZXJUeXBlID0gVHJ5R2V0R2xvYmFsVHlwZTwnR1BVQnVmZmVyJywgR3B1QnVmZmVyVHlwZUZhbGxiYWNrPjtcblxuICB0eXBlIE1MVGVuc29yVHlwZUZhbGxiYWNrID0geyBkZXN0cm95KCk6IHZvaWQgfTtcbiAgLyoqXG4gICAqIHR5cGUgYWxpYXMgZm9yIFdlYk5OIE1MVGVuc29yXG4gICAqXG4gICAqIFRoZSBzcGVjaWZpY2F0aW9uIGZvciBXZWJOTidzIE1MVGVuc29yIGlzIGN1cnJlbnRseSBpbiBmbHV4LlxuICAgKi9cbiAgZXhwb3J0IHR5cGUgTUxUZW5zb3JUeXBlID0gVHJ5R2V0R2xvYmFsVHlwZTwnTUxUZW5zb3InLCBNTFRlbnNvclR5cGVGYWxsYmFjaz47XG5cbiAgLyoqXG4gICAqIHN1cHBvcnRlZCBkYXRhIHR5cGVzIGZvciBjb25zdHJ1Y3RpbmcgYSB0ZW5zb3IgZnJvbSBhIFdlYkdQVSBidWZmZXJcbiAgICovXG4gIGV4cG9ydCB0eXBlIEdwdUJ1ZmZlckRhdGFUeXBlcyA9ICdmbG9hdDMyJyB8ICdmbG9hdDE2JyB8ICdpbnQzMicgfCAnaW50NjQnIHwgJ3VpbnQzMicgfCAndWludDgnIHwgJ2Jvb2wnO1xuXG4gIC8qKlxuICAgKiBzdXBwb3J0ZWQgZGF0YSB0eXBlcyBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBXZWJOTiBNTFRlbnNvclxuICAgKi9cbiAgZXhwb3J0IHR5cGUgTUxUZW5zb3JEYXRhVHlwZXMgPVxuICAgIHwgJ2Zsb2F0MzInXG4gICAgfCAnZmxvYXQxNidcbiAgICB8ICdpbnQ4J1xuICAgIHwgJ3VpbnQ4J1xuICAgIHwgJ2ludDMyJ1xuICAgIHwgJ3VpbnQzMidcbiAgICB8ICdpbnQ2NCdcbiAgICB8ICd1aW50NjQnXG4gICAgfCAnYm9vbCdcbiAgICB8ICd1aW50NCdcbiAgICB8ICdpbnQ0JztcblxuICAvKipcbiAgICogcmVwcmVzZW50IHdoZXJlIHRoZSB0ZW5zb3IgZGF0YSBpcyBzdG9yZWRcbiAgICovXG4gIGV4cG9ydCB0eXBlIERhdGFMb2NhdGlvbiA9ICdub25lJyB8ICdjcHUnIHwgJ2NwdS1waW5uZWQnIHwgJ3RleHR1cmUnIHwgJ2dwdS1idWZmZXInIHwgJ21sLXRlbnNvcic7XG5cbiAgLyoqXG4gICAqIHJlcHJlc2VudCB0aGUgZGF0YSB0eXBlIG9mIGEgdGVuc29yXG4gICAqL1xuICBleHBvcnQgdHlwZSBUeXBlID0ga2V5b2YgRGF0YVR5cGVNYXA7XG59XG5cbi8qKlxuICogUmVwcmVzZW50IG11bHRpLWRpbWVuc2lvbmFsIGFycmF5cyB0byBmZWVkIHRvIG9yIGZldGNoIGZyb20gbW9kZWwgaW5mZXJlbmNpbmcuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRUZW5zb3I8VCBleHRlbmRzIFRlbnNvci5UeXBlPiBleHRlbmRzIFR5cGVkVGVuc29yQmFzZTxUPiwgVHlwZWRUZW5zb3JVdGlsczxUPiB7fVxuLyoqXG4gKiBSZXByZXNlbnQgbXVsdGktZGltZW5zaW9uYWwgYXJyYXlzIHRvIGZlZWQgdG8gb3IgZmV0Y2ggZnJvbSBtb2RlbCBpbmZlcmVuY2luZy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW5zb3IgZXh0ZW5kcyBUeXBlZFRlbnNvckJhc2U8VGVuc29yLlR5cGU+LCBUeXBlZFRlbnNvclV0aWxzPFRlbnNvci5UeXBlPiB7fVxuXG4vKipcbiAqIHR5cGUgVGVuc29yQ29uc3RydWN0b3IgZGVmaW5lcyB0aGUgY29uc3RydWN0b3JzIG9mICdUZW5zb3InIHRvIGNyZWF0ZSBDUFUgdGVuc29yIGluc3RhbmNlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JDb25zdHJ1Y3RvciBleHRlbmRzIFRlbnNvckZhY3Rvcnkge1xuICAvLyAjcmVnaW9uIENQVSB0ZW5zb3IgLSBzcGVjaWZ5IGVsZW1lbnQgdHlwZVxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHN0cmluZyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIHR5cGUsIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0gU3BlY2lmeSB0aGUgZWxlbWVudCB0eXBlLlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRhdGE6IFRlbnNvci5EYXRhVHlwZU1hcFsnc3RyaW5nJ10gfCByZWFkb25seSBzdHJpbmdbXSxcbiAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10sXG4gICk6IFR5cGVkVGVuc29yPCdzdHJpbmcnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGJvb2wgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiB0eXBlLCBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZSAtIFNwZWNpZnkgdGhlIGVsZW1lbnQgdHlwZS5cbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3IChcbiAgICB0eXBlOiAnYm9vbCcsXG4gICAgZGF0YTogVGVuc29yLkRhdGFUeXBlTWFwWydib29sJ10gfCByZWFkb25seSBib29sZWFuW10sXG4gICAgZGltcz86IHJlYWRvbmx5IG51bWJlcltdLFxuICApOiBUeXBlZFRlbnNvcjwnYm9vbCc+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdWludDggdGVuc29yIG9iamVjdCBmcm9tIGEgVWludDhDbGFtcGVkQXJyYXksIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0gU3BlY2lmeSB0aGUgZWxlbWVudCB0eXBlLlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKHR5cGU6ICd1aW50OCcsIGRhdGE6IFVpbnQ4Q2xhbXBlZEFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwndWludDgnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IDY0LWJpdCBpbnRlZ2VyIHR5cGVkIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gdHlwZSwgZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSBTcGVjaWZ5IHRoZSBlbGVtZW50IHR5cGUuXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyA8VCBleHRlbmRzICd1aW50NjQnIHwgJ2ludDY0Jz4oXG4gICAgdHlwZTogVCxcbiAgICBkYXRhOiBUZW5zb3IuRGF0YVR5cGVNYXBbVF0gfCByZWFkb25seSBiaWdpbnRbXSB8IHJlYWRvbmx5IG51bWJlcltdLFxuICAgIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSxcbiAgKTogVHlwZWRUZW5zb3I8VD47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyBudW1lcmljIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gdHlwZSwgZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIHR5cGUgLSBTcGVjaWZ5IHRoZSBlbGVtZW50IHR5cGUuXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyA8VCBleHRlbmRzIEV4Y2x1ZGU8VGVuc29yLlR5cGUsICdzdHJpbmcnIHwgJ2Jvb2wnIHwgJ3VpbnQ2NCcgfCAnaW50NjQnPj4oXG4gICAgdHlwZTogVCxcbiAgICBkYXRhOiBUZW5zb3IuRGF0YVR5cGVNYXBbVF0gfCByZWFkb25seSBudW1iZXJbXSxcbiAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10sXG4gICk6IFR5cGVkVGVuc29yPFQ+O1xuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBDUFUgdGVuc29yIC0gaW5mZXIgZWxlbWVudCB0eXBlc1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgZmxvYXQzMiB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyAoZGF0YTogRmxvYXQzMkFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnZmxvYXQzMic+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgaW50OCB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyAoZGF0YTogSW50OEFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnaW50OCc+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdWludDggdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKGRhdGE6IFVpbnQ4QXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCd1aW50OCc+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgdWludDggdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKGRhdGE6IFVpbnQ4Q2xhbXBlZEFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwndWludDgnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHVpbnQxNiB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyAoZGF0YTogVWludDE2QXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCd1aW50MTYnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGludDE2IHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3IChkYXRhOiBJbnQxNkFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnaW50MTYnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGludDMyIHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3IChkYXRhOiBJbnQzMkFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnaW50MzInPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGludDY0IHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3IChkYXRhOiBCaWdJbnQ2NEFycmF5LCBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10pOiBUeXBlZFRlbnNvcjwnaW50NjQnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHN0cmluZyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyAoZGF0YTogcmVhZG9ubHkgc3RyaW5nW10sIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCdzdHJpbmcnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGJvb2wgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKGRhdGE6IHJlYWRvbmx5IGJvb2xlYW5bXSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8J2Jvb2wnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IGZsb2F0NjQgdGVuc29yIG9iamVjdCBmcm9tIHRoZSBnaXZlbiBkYXRhIGFuZCBkaW1zLlxuICAgKlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKGRhdGE6IEZsb2F0NjRBcnJheSwgZGltcz86IHJlYWRvbmx5IG51bWJlcltdKTogVHlwZWRUZW5zb3I8J2Zsb2F0NjQnPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHVpbnQzMiB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyAoZGF0YTogVWludDMyQXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCd1aW50MzInPjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHVpbnQ2NCB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSBkYXRhIC0gU3BlY2lmeSB0aGUgQ1BVIHRlbnNvciBkYXRhLlxuICAgKiBAcGFyYW0gZGltcyAtIFNwZWNpZnkgdGhlIGRpbWVuc2lvbiBvZiB0aGUgdGVuc29yLiBJZiBvbWl0dGVkLCBhIDEtRCB0ZW5zb3IgaXMgYXNzdW1lZC5cbiAgICovXG4gIG5ldyAoZGF0YTogQmlnVWludDY0QXJyYXksIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFR5cGVkVGVuc29yPCd1aW50NjQnPjtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBDUFUgdGVuc29yIC0gZmFsbCBiYWNrIHRvIG5vbi1nZW5lcmljIHRlbnNvciB0eXBlIGRlY2xhcmF0aW9uXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhIG5ldyB0ZW5zb3Igb2JqZWN0IGZyb20gdGhlIGdpdmVuIHR5cGUsIGRhdGEgYW5kIGRpbXMuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0gU3BlY2lmeSB0aGUgZWxlbWVudCB0eXBlLlxuICAgKiBAcGFyYW0gZGF0YSAtIFNwZWNpZnkgdGhlIENQVSB0ZW5zb3IgZGF0YS5cbiAgICogQHBhcmFtIGRpbXMgLSBTcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqL1xuICBuZXcgKFxuICAgIHR5cGU6IFRlbnNvci5UeXBlLFxuICAgIGRhdGE6IFRlbnNvci5EYXRhVHlwZSB8IHJlYWRvbmx5IG51bWJlcltdIHwgcmVhZG9ubHkgc3RyaW5nW10gfCByZWFkb25seSBiaWdpbnRbXSB8IHJlYWRvbmx5IGJvb2xlYW5bXSxcbiAgICBkaW1zPzogcmVhZG9ubHkgbnVtYmVyW10sXG4gICk6IFRlbnNvcjtcblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgbmV3IHRlbnNvciBvYmplY3QgZnJvbSB0aGUgZ2l2ZW4gZGF0YSBhbmQgZGltcy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGEgLSBTcGVjaWZ5IHRoZSBDUFUgdGVuc29yIGRhdGEuXG4gICAqIEBwYXJhbSBkaW1zIC0gU3BlY2lmeSB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGEgMS1EIHRlbnNvciBpcyBhc3N1bWVkLlxuICAgKi9cbiAgbmV3IChkYXRhOiBUZW5zb3IuRGF0YVR5cGUsIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSk6IFRlbnNvcjtcbiAgLy8gI2VuZHJlZ2lvblxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uXG5leHBvcnQgY29uc3QgVGVuc29yID0gVGVuc29ySW1wbCBhcyBUZW5zb3JDb25zdHJ1Y3RvcjtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHsgZW52IH0gZnJvbSAnLi9lbnYtaW1wbC5qcyc7XG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgY29uc3QgVFJBQ0UgPSAoZGV2aWNlVHlwZTogc3RyaW5nLCBsYWJlbDogc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2YgZW52LnRyYWNlID09PSAndW5kZWZpbmVkJyA/ICFlbnYud2FzbS50cmFjZSA6ICFlbnYudHJhY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS50aW1lU3RhbXAoYCR7ZGV2aWNlVHlwZX06Ok9SVDo6JHtsYWJlbH1gKTtcbn07XG5cbmNvbnN0IFRSQUNFX0ZVTkMgPSAobXNnOiBzdHJpbmcsIGV4dHJhTXNnPzogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s/LnNwbGl0KC9cXHJcXG58XFxyfFxcbi9nKSB8fCBbXTtcbiAgbGV0IGhhc1RyYWNlRnVuYyA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGhhc1RyYWNlRnVuYyAmJiAhc3RhY2tbaV0uaW5jbHVkZXMoJ1RSQUNFX0ZVTkMnKSkge1xuICAgICAgbGV0IGxhYmVsID0gYEZVTkNfJHttc2d9Ojoke3N0YWNrW2ldLnRyaW0oKS5zcGxpdCgnICcpWzFdfWA7XG4gICAgICBpZiAoZXh0cmFNc2cpIHtcbiAgICAgICAgbGFiZWwgKz0gYDo6JHtleHRyYU1zZ31gO1xuICAgICAgfVxuICAgICAgVFJBQ0UoJ0NQVScsIGxhYmVsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHN0YWNrW2ldLmluY2x1ZGVzKCdUUkFDRV9GVU5DJykpIHtcbiAgICAgIGhhc1RyYWNlRnVuYyA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQUNFX0ZVTkNfQkVHSU4gPSAoZXh0cmFNc2c/OiBzdHJpbmcpID0+IHtcbiAgaWYgKHR5cGVvZiBlbnYudHJhY2UgPT09ICd1bmRlZmluZWQnID8gIWVudi53YXNtLnRyYWNlIDogIWVudi50cmFjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBUUkFDRV9GVU5DKCdCRUdJTicsIGV4dHJhTXNnKTtcbn07XG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgY29uc3QgVFJBQ0VfRlVOQ19FTkQgPSAoZXh0cmFNc2c/OiBzdHJpbmcpID0+IHtcbiAgaWYgKHR5cGVvZiBlbnYudHJhY2UgPT09ICd1bmRlZmluZWQnID8gIWVudi53YXNtLnRyYWNlIDogIWVudi50cmFjZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBUUkFDRV9GVU5DKCdFTkQnLCBleHRyYU1zZyk7XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQUNFX0VWRU5UX0JFR0lOID0gKGV4dHJhTXNnPzogc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2YgZW52LnRyYWNlID09PSAndW5kZWZpbmVkJyA/ICFlbnYud2FzbS50cmFjZSA6ICFlbnYudHJhY2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS50aW1lKGBPUlQ6OiR7ZXh0cmFNc2d9YCk7XG59O1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGNvbnN0IFRSQUNFX0VWRU5UX0VORCA9IChleHRyYU1zZz86IHN0cmluZykgPT4ge1xuICBpZiAodHlwZW9mIGVudi50cmFjZSA9PT0gJ3VuZGVmaW5lZCcgPyAhZW52Lndhc20udHJhY2UgOiAhZW52LnRyYWNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUudGltZUVuZChgT1JUOjoke2V4dHJhTXNnfWApO1xufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHsgcmVzb2x2ZUJhY2tlbmRBbmRFeGVjdXRpb25Qcm92aWRlcnMgfSBmcm9tICcuL2JhY2tlbmQtaW1wbC5qcyc7XG5pbXBvcnQgeyBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlciB9IGZyb20gJy4vYmFja2VuZC5qcyc7XG5pbXBvcnQgeyBJbmZlcmVuY2VTZXNzaW9uIGFzIEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2UgfSBmcm9tICcuL2luZmVyZW5jZS1zZXNzaW9uLmpzJztcbmltcG9ydCB7IE9ubnhWYWx1ZSB9IGZyb20gJy4vb25ueC12YWx1ZS5qcyc7XG5pbXBvcnQgeyBUZW5zb3IgfSBmcm9tICcuL3RlbnNvci5qcyc7XG5pbXBvcnQgeyBUUkFDRV9GVU5DX0JFR0lOLCBUUkFDRV9GVU5DX0VORCwgVFJBQ0VfRVZFTlRfQkVHSU4sIFRSQUNFX0VWRU5UX0VORCB9IGZyb20gJy4vdHJhY2UuanMnO1xuXG50eXBlIFNlc3Npb25PcHRpb25zID0gSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5TZXNzaW9uT3B0aW9ucztcbnR5cGUgUnVuT3B0aW9ucyA9IEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2UuUnVuT3B0aW9ucztcbnR5cGUgRmVlZHNUeXBlID0gSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5GZWVkc1R5cGU7XG50eXBlIEZldGNoZXNUeXBlID0gSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5GZXRjaGVzVHlwZTtcbnR5cGUgUmV0dXJuVHlwZSA9IEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2UuUmV0dXJuVHlwZTtcblxuZXhwb3J0IGNsYXNzIEluZmVyZW5jZVNlc3Npb24gaW1wbGVtZW50cyBJbmZlcmVuY2VTZXNzaW9uSW50ZXJmYWNlIHtcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihoYW5kbGVyOiBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcikge1xuICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gIH1cbiAgcnVuKGZlZWRzOiBGZWVkc1R5cGUsIG9wdGlvbnM/OiBSdW5PcHRpb25zKTogUHJvbWlzZTxSZXR1cm5UeXBlPjtcbiAgcnVuKGZlZWRzOiBGZWVkc1R5cGUsIGZldGNoZXM6IEZldGNoZXNUeXBlLCBvcHRpb25zPzogUnVuT3B0aW9ucyk6IFByb21pc2U8UmV0dXJuVHlwZT47XG4gIGFzeW5jIHJ1bihmZWVkczogRmVlZHNUeXBlLCBhcmcxPzogRmV0Y2hlc1R5cGUgfCBSdW5PcHRpb25zLCBhcmcyPzogUnVuT3B0aW9ucyk6IFByb21pc2U8UmV0dXJuVHlwZT4ge1xuICAgIFRSQUNFX0ZVTkNfQkVHSU4oKTtcbiAgICBUUkFDRV9FVkVOVF9CRUdJTignSW5mZXJlbmNlU2Vzc2lvbi5ydW4nKTtcbiAgICBjb25zdCBmZXRjaGVzOiB7IFtuYW1lOiBzdHJpbmddOiBPbm54VmFsdWUgfCBudWxsIH0gPSB7fTtcbiAgICBsZXQgb3B0aW9uczogUnVuT3B0aW9ucyA9IHt9O1xuICAgIC8vIGNoZWNrIGlucHV0c1xuICAgIGlmICh0eXBlb2YgZmVlZHMgIT09ICdvYmplY3QnIHx8IGZlZWRzID09PSBudWxsIHx8IGZlZWRzIGluc3RhbmNlb2YgVGVuc29yIHx8IEFycmF5LmlzQXJyYXkoZmVlZHMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICBcIidmZWVkcycgbXVzdCBiZSBhbiBvYmplY3QgdGhhdCB1c2UgaW5wdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlwiLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBsZXQgaXNGZXRjaGVzRW1wdHkgPSB0cnVlO1xuICAgIC8vIGRldGVybWluZSB3aGljaCBvdmVycmlkZSBpcyBiZWluZyB1c2VkXG4gICAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGFyZzEgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBhcmd1bWVudFsxXTogY2Fubm90IGJlIG51bGwuJyk7XG4gICAgICB9XG4gICAgICBpZiAoYXJnMSBpbnN0YW5jZW9mIFRlbnNvcikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiJ2ZldGNoZXMnIGNhbm5vdCBiZSBhIFRlbnNvclwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnMSkpIHtcbiAgICAgICAgaWYgKGFyZzEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidmZXRjaGVzJyBjYW5ub3QgYmUgYW4gZW1wdHkgYXJyYXkuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlzRmV0Y2hlc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgIC8vIG91dHB1dCBuYW1lc1xuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgYXJnMSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCInZmV0Y2hlcycgbXVzdCBiZSBhIHN0cmluZyBhcnJheSBvciBhbiBvYmplY3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5vdXRwdXROYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYCdmZXRjaGVzJyBjb250YWlucyBpbnZhbGlkIG91dHB1dCBuYW1lOiAke25hbWV9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmZXRjaGVzW25hbWVdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgYXJnMiA9PT0gJ29iamVjdCcgJiYgYXJnMiAhPT0gbnVsbCkge1xuICAgICAgICAgIG9wdGlvbnMgPSBhcmcyO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCInb3B0aW9ucycgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciBhcmcxIGlzIGZldGNoZXMgb3Igb3B0aW9uc1xuICAgICAgICAvLyBpZiBhbnkgb3V0cHV0IG5hbWUgaXMgcHJlc2VudCBhbmQgaXRzIHZhbHVlIGlzIHZhbGlkIE9ubnhWYWx1ZSwgd2UgY29uc2lkZXIgaXQgZmV0Y2hlc1xuICAgICAgICBsZXQgaXNGZXRjaGVzID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGFyZzFLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYXJnMSk7XG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLm91dHB1dE5hbWVzKSB7XG4gICAgICAgICAgaWYgKGFyZzFLZXlzLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gKGFyZzEgYXMgSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5OdWxsYWJsZU9ubnhWYWx1ZU1hcFR5cGUpW25hbWVdO1xuICAgICAgICAgICAgaWYgKHYgPT09IG51bGwgfHwgdiBpbnN0YW5jZW9mIFRlbnNvcikge1xuICAgICAgICAgICAgICBpc0ZldGNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICBpc0ZldGNoZXNFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICBmZXRjaGVzW25hbWVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNGZXRjaGVzKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBhcmcyID09PSAnb2JqZWN0JyAmJiBhcmcyICE9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gYXJnMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidvcHRpb25zJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wdGlvbnMgPSBhcmcxIGFzIFJ1bk9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcxICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgYXJndW1lbnRbMV06IG11c3QgYmUgJ2ZldGNoZXMnIG9yICdvcHRpb25zJy5cIik7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgYWxsIGlucHV0cyBhcmUgaW4gZmVlZFxuICAgIGZvciAoY29uc3QgbmFtZSBvZiB0aGlzLmlucHV0TmFtZXMpIHtcbiAgICAgIGlmICh0eXBlb2YgZmVlZHNbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW5wdXQgJyR7bmFtZX0nIGlzIG1pc3NpbmcgaW4gJ2ZlZWRzJy5gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiBubyBmZXRjaGVzIGlzIHNwZWNpZmllZCwgd2UgdXNlIHRoZSBmdWxsIG91dHB1dCBuYW1lcyBsaXN0XG4gICAgaWYgKGlzRmV0Y2hlc0VtcHR5KSB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgdGhpcy5vdXRwdXROYW1lcykge1xuICAgICAgICBmZXRjaGVzW25hbWVdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmZWVkcywgZmV0Y2hlcyBhbmQgb3B0aW9ucyBhcmUgcHJlcGFyZWRcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmhhbmRsZXIucnVuKGZlZWRzLCBmZXRjaGVzLCBvcHRpb25zKTtcbiAgICBjb25zdCByZXR1cm5WYWx1ZTogeyBbbmFtZTogc3RyaW5nXTogT25ueFZhbHVlIH0gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByZXN1bHRzKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0cywga2V5KSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXN1bHRzW2tleV07XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBUZW5zb3IpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZVtrZXldID0gcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblZhbHVlW2tleV0gPSBuZXcgVGVuc29yKHJlc3VsdC50eXBlLCByZXN1bHQuZGF0YSwgcmVzdWx0LmRpbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFRSQUNFX0VWRU5UX0VORCgnSW5mZXJlbmNlU2Vzc2lvbi5ydW4nKTtcbiAgICBUUkFDRV9GVU5DX0VORCgpO1xuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIGFzeW5jIHJlbGVhc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5kaXNwb3NlKCk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKHBhdGg6IHN0cmluZywgb3B0aW9ucz86IFNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSW50ZXJmYWNlPjtcbiAgc3RhdGljIGNyZWF0ZShidWZmZXI6IEFycmF5QnVmZmVyTGlrZSwgb3B0aW9ucz86IFNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSW50ZXJmYWNlPjtcbiAgc3RhdGljIGNyZWF0ZShcbiAgICBidWZmZXI6IEFycmF5QnVmZmVyTGlrZSxcbiAgICBieXRlT2Zmc2V0OiBudW1iZXIsXG4gICAgYnl0ZUxlbmd0aD86IG51bWJlcixcbiAgICBvcHRpb25zPzogU2Vzc2lvbk9wdGlvbnMsXG4gICk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZT47XG4gIHN0YXRpYyBjcmVhdGUoYnVmZmVyOiBVaW50OEFycmF5LCBvcHRpb25zPzogU2Vzc2lvbk9wdGlvbnMpOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2U+O1xuICBzdGF0aWMgYXN5bmMgY3JlYXRlKFxuICAgIGFyZzA6IHN0cmluZyB8IEFycmF5QnVmZmVyTGlrZSB8IFVpbnQ4QXJyYXksXG4gICAgYXJnMT86IFNlc3Npb25PcHRpb25zIHwgbnVtYmVyLFxuICAgIGFyZzI/OiBudW1iZXIsXG4gICAgYXJnMz86IFNlc3Npb25PcHRpb25zLFxuICApOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2U+IHtcbiAgICBUUkFDRV9GVU5DX0JFR0lOKCk7XG4gICAgVFJBQ0VfRVZFTlRfQkVHSU4oJ0luZmVyZW5jZVNlc3Npb24uY3JlYXRlJyk7XG4gICAgLy8gZWl0aGVyIGxvYWQgZnJvbSBhIGZpbGUgb3IgYnVmZmVyXG4gICAgbGV0IGZpbGVQYXRoT3JVaW50OEFycmF5OiBzdHJpbmcgfCBVaW50OEFycmF5O1xuICAgIGxldCBvcHRpb25zOiBTZXNzaW9uT3B0aW9ucyA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBhcmcwID09PSAnc3RyaW5nJykge1xuICAgICAgZmlsZVBhdGhPclVpbnQ4QXJyYXkgPSBhcmcwO1xuICAgICAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JyAmJiBhcmcxICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcxO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidvcHRpb25zJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhcmcwIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgZmlsZVBhdGhPclVpbnQ4QXJyYXkgPSBhcmcwO1xuICAgICAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JyAmJiBhcmcxICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcxO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIidvcHRpb25zJyBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGFyZzAgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fFxuICAgICAgKHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnMCBpbnN0YW5jZW9mIFNoYXJlZEFycmF5QnVmZmVyKVxuICAgICkge1xuICAgICAgY29uc3QgYnVmZmVyID0gYXJnMDtcbiAgICAgIGxldCBieXRlT2Zmc2V0ID0gMDtcbiAgICAgIGxldCBieXRlTGVuZ3RoID0gYXJnMC5ieXRlTGVuZ3RoO1xuICAgICAgaWYgKHR5cGVvZiBhcmcxID09PSAnb2JqZWN0JyAmJiBhcmcxICE9PSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMgPSBhcmcxO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYnl0ZU9mZnNldCA9IGFyZzE7XG4gICAgICAgIGlmICghTnVtYmVyLmlzU2FmZUludGVnZXIoYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIidieXRlT2Zmc2V0JyBtdXN0IGJlIGFuIGludGVnZXIuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBieXRlT2Zmc2V0ID49IGJ1ZmZlci5ieXRlTGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYCdieXRlT2Zmc2V0JyBpcyBvdXQgb2YgcmFuZ2UgWzAsICR7YnVmZmVyLmJ5dGVMZW5ndGh9KS5gKTtcbiAgICAgICAgfVxuICAgICAgICBieXRlTGVuZ3RoID0gYXJnMC5ieXRlTGVuZ3RoIC0gYnl0ZU9mZnNldDtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcyID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGJ5dGVMZW5ndGggPSBhcmcyO1xuICAgICAgICAgIGlmICghTnVtYmVyLmlzU2FmZUludGVnZXIoYnl0ZUxlbmd0aCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiJ2J5dGVMZW5ndGgnIG11c3QgYmUgYW4gaW50ZWdlci5cIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChieXRlTGVuZ3RoIDw9IDAgfHwgYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGggPiBidWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYCdieXRlTGVuZ3RoJyBpcyBvdXQgb2YgcmFuZ2UgKDAsICR7YnVmZmVyLmJ5dGVMZW5ndGggLSBieXRlT2Zmc2V0fV0uYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgYXJnMyA9PT0gJ29iamVjdCcgJiYgYXJnMyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IGFyZzM7XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCInb3B0aW9ucycgbXVzdCBiZSBhbiBvYmplY3QuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJnMiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiJ2J5dGVMZW5ndGgnIG11c3QgYmUgYSBudW1iZXIuXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcmcxICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiJ29wdGlvbnMnIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICAgIH1cbiAgICAgIGZpbGVQYXRoT3JVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyLCBieXRlT2Zmc2V0LCBieXRlTGVuZ3RoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlVuZXhwZWN0ZWQgYXJndW1lbnRbMF06IG11c3QgYmUgJ3BhdGgnIG9yICdidWZmZXInLlwiKTtcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIGJhY2tlbmQsIHVwZGF0ZSBzZXNzaW9uIG9wdGlvbnMgd2l0aCB2YWxpZGF0ZWQgRVBzLCBhbmQgY3JlYXRlIHNlc3Npb24gaGFuZGxlclxuICAgIGNvbnN0IFtiYWNrZW5kLCBvcHRpb25zV2l0aFZhbGlkYXRlZEVQc10gPSBhd2FpdCByZXNvbHZlQmFja2VuZEFuZEV4ZWN1dGlvblByb3ZpZGVycyhvcHRpb25zKTtcbiAgICBjb25zdCBoYW5kbGVyID0gYXdhaXQgYmFja2VuZC5jcmVhdGVJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcihmaWxlUGF0aE9yVWludDhBcnJheSwgb3B0aW9uc1dpdGhWYWxpZGF0ZWRFUHMpO1xuICAgIFRSQUNFX0VWRU5UX0VORCgnSW5mZXJlbmNlU2Vzc2lvbi5jcmVhdGUnKTtcbiAgICBUUkFDRV9GVU5DX0VORCgpO1xuICAgIHJldHVybiBuZXcgSW5mZXJlbmNlU2Vzc2lvbihoYW5kbGVyKTtcbiAgfVxuXG4gIHN0YXJ0UHJvZmlsaW5nKCk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlci5zdGFydFByb2ZpbGluZygpO1xuICB9XG4gIGVuZFByb2ZpbGluZygpOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZXIuZW5kUHJvZmlsaW5nKCk7XG4gIH1cblxuICBnZXQgaW5wdXROYW1lcygpOiByZWFkb25seSBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5pbnB1dE5hbWVzO1xuICB9XG4gIGdldCBvdXRwdXROYW1lcygpOiByZWFkb25seSBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlci5vdXRwdXROYW1lcztcbiAgfVxuXG4gIGdldCBpbnB1dE1ldGFkYXRhKCk6IHJlYWRvbmx5IEluZmVyZW5jZVNlc3Npb25JbnRlcmZhY2UuVmFsdWVNZXRhZGF0YVtdIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVyLmlucHV0TWV0YWRhdGE7XG4gIH1cblxuICBnZXQgb3V0cHV0TWV0YWRhdGEoKTogcmVhZG9ubHkgSW5mZXJlbmNlU2Vzc2lvbkludGVyZmFjZS5WYWx1ZU1ldGFkYXRhW10ge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZXIub3V0cHV0TWV0YWRhdGE7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZXI6IEluZmVyZW5jZVNlc3Npb25IYW5kbGVyO1xufVxuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBJbmZlcmVuY2VTZXNzaW9uIGFzIEluZmVyZW5jZVNlc3Npb25JbXBsIH0gZnJvbSAnLi9pbmZlcmVuY2Utc2Vzc2lvbi1pbXBsLmpzJztcbmltcG9ydCB7IE9ubnhNb2RlbE9wdGlvbnMgfSBmcm9tICcuL29ubngtbW9kZWwuanMnO1xuaW1wb3J0IHsgT25ueFZhbHVlLCBPbm54VmFsdWVEYXRhTG9jYXRpb24gfSBmcm9tICcuL29ubngtdmFsdWUuanMnO1xuaW1wb3J0IHR5cGUgeyBUZW5zb3IgfSBmcm9tICcuL3RlbnNvci5qcyc7XG5pbXBvcnQgeyBUcnlHZXRHbG9iYWxUeXBlIH0gZnJvbSAnLi90eXBlLWhlbHBlci5qcyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZWRlY2xhcmUgKi9cblxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIEluZmVyZW5jZVNlc3Npb24ge1xuICAvLyAjcmVnaW9uIGlucHV0L291dHB1dCB0eXBlc1xuXG4gIHR5cGUgT25ueFZhbHVlTWFwVHlwZSA9IHsgcmVhZG9ubHkgW25hbWU6IHN0cmluZ106IE9ubnhWYWx1ZSB9O1xuICB0eXBlIE51bGxhYmxlT25ueFZhbHVlTWFwVHlwZSA9IHsgcmVhZG9ubHkgW25hbWU6IHN0cmluZ106IE9ubnhWYWx1ZSB8IG51bGwgfTtcblxuICAvKipcbiAgICogQSBmZWVkcyAobW9kZWwgaW5wdXRzKSBpcyBhbiBvYmplY3QgdGhhdCB1c2VzIGlucHV0IG5hbWVzIGFzIGtleXMgYW5kIE9ubnhWYWx1ZSBhcyBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICovXG4gIHR5cGUgRmVlZHNUeXBlID0gT25ueFZhbHVlTWFwVHlwZTtcblxuICAvKipcbiAgICogQSBmZXRjaGVzIChtb2RlbCBvdXRwdXRzKSBjb3VsZCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzpcbiAgICpcbiAgICogLSBPbWl0dGVkLiBVc2UgbW9kZWwncyBvdXRwdXQgbmFtZXMgZGVmaW5pdGlvbi5cbiAgICogLSBBbiBhcnJheSBvZiBzdHJpbmcgaW5kaWNhdGluZyB0aGUgb3V0cHV0IG5hbWVzLlxuICAgKiAtIEFuIG9iamVjdCB0aGF0IHVzZSBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIG9yIG51bGwgYXMgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEByZW1hcmtcbiAgICogZGlmZmVyZW50IGZyb20gaW5wdXQgYXJndW1lbnQsIGluIG91dHB1dCwgT25ueFZhbHVlIGlzIG9wdGlvbmFsLiBJZiBhbiBPbm54VmFsdWUgaXMgcHJlc2VudCBpdCB3aWxsIGJlXG4gICAqIHVzZWQgYXMgYSBwcmUtYWxsb2NhdGVkIHZhbHVlIGJ5IHRoZSBpbmZlcmVuY2UgZW5naW5lOyBpZiBvbWl0dGVkLCBpbmZlcmVuY2UgZW5naW5lIHdpbGwgYWxsb2NhdGUgYnVmZmVyXG4gICAqIGludGVybmFsbHkuXG4gICAqL1xuICB0eXBlIEZldGNoZXNUeXBlID0gcmVhZG9ubHkgc3RyaW5nW10gfCBOdWxsYWJsZU9ubnhWYWx1ZU1hcFR5cGU7XG5cbiAgLyoqXG4gICAqIEEgaW5mZXJlbmNpbmcgcmV0dXJuIHR5cGUgaXMgYW4gb2JqZWN0IHRoYXQgdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgKi9cbiAgdHlwZSBSZXR1cm5UeXBlID0gT25ueFZhbHVlTWFwVHlwZTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBzZXNzaW9uIG9wdGlvbnNcblxuICAvKipcbiAgICogQSBzZXQgb2YgY29uZmlndXJhdGlvbnMgZm9yIHNlc3Npb24gYmVoYXZpb3IuXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIFNlc3Npb25PcHRpb25zIGV4dGVuZHMgT25ueE1vZGVsT3B0aW9ucyB7XG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgZXhlY3V0aW9uIHByb3ZpZGVyIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBBbiBleGVjdXRpb24gcHJvdmlkZXIgb3B0aW9uIGNhbiBiZSBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBuYW1lIG9mIHRoZSBleGVjdXRpb24gcHJvdmlkZXIsXG4gICAgICogb3IgYW4gb2JqZWN0IG9mIGNvcnJlc3BvbmRpbmcgdHlwZS5cbiAgICAgKi9cbiAgICBleGVjdXRpb25Qcm92aWRlcnM/OiByZWFkb25seSBFeGVjdXRpb25Qcm92aWRlckNvbmZpZ1tdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGludHJhIE9QIHRocmVhZHMgbnVtYmVyLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkuXG4gICAgICovXG4gICAgaW50cmFPcE51bVRocmVhZHM/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXIgT1AgdGhyZWFkcyBudW1iZXIuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKS5cbiAgICAgKi9cbiAgICBpbnRlck9wTnVtVGhyZWFkcz86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBmcmVlIGRpbWVuc2lvbiBvdmVycmlkZS5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICBmcmVlRGltZW5zaW9uT3ZlcnJpZGVzPzogeyByZWFkb25seSBbZGltZW5zaW9uTmFtZTogc3RyaW5nXTogbnVtYmVyIH07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3B0aW1pemF0aW9uIGxldmVsLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkgb3IgV2ViQXNzZW1ibHkgYmFja2VuZFxuICAgICAqL1xuICAgIGdyYXBoT3B0aW1pemF0aW9uTGV2ZWw/OiAnZGlzYWJsZWQnIHwgJ2Jhc2ljJyB8ICdleHRlbmRlZCcgfCAnbGF5b3V0JyB8ICdhbGwnO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBlbmFibGUgQ1BVIG1lbW9yeSBhcmVuYS5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICBlbmFibGVDcHVNZW1BcmVuYT86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIGVuYWJsZSBtZW1vcnkgcGF0dGVybi5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICBlbmFibGVNZW1QYXR0ZXJuPzogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGlvbiBtb2RlLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkgb3IgV2ViQXNzZW1ibHkgYmFja2VuZFxuICAgICAqL1xuICAgIGV4ZWN1dGlvbk1vZGU/OiAnc2VxdWVudGlhbCcgfCAncGFyYWxsZWwnO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIG1vZGVsIGZpbGUgcGF0aC5cbiAgICAgKlxuICAgICAqIElmIHRoaXMgc2V0dGluZyBpcyBzcGVjaWZpZWQsIHRoZSBvcHRpbWl6ZWQgbW9kZWwgd2lsbCBiZSBkdW1wZWQuIEluIGJyb3dzZXIsIGEgYmxvYiB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiB3aXRoIGEgcG9wLXVwIHdpbmRvdy5cbiAgICAgKi9cbiAgICBvcHRpbWl6ZWRNb2RlbEZpbGVQYXRoPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBlbmFibGUgcHJvZmlsaW5nLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGEgcGxhY2Vob2xkZXIgZm9yIGEgZnV0dXJlIHVzZS5cbiAgICAgKi9cbiAgICBlbmFibGVQcm9maWxpbmc/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogRmlsZSBwcmVmaXggZm9yIHByb2ZpbGluZy5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhIHBsYWNlaG9sZGVyIGZvciBhIGZ1dHVyZSB1c2UuXG4gICAgICovXG4gICAgcHJvZmlsZUZpbGVQcmVmaXg/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBMb2cgSUQuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKSBvciBXZWJBc3NlbWJseSBiYWNrZW5kXG4gICAgICovXG4gICAgbG9nSWQ/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBMb2cgc2V2ZXJpdHkgbGV2ZWwuIFNlZVxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvb25ueHJ1bnRpbWUvYmxvYi9tYWluL2luY2x1ZGUvb25ueHJ1bnRpbWUvY29yZS9jb21tb24vbG9nZ2luZy9zZXZlcml0eS5oXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlKSBvciBXZWJBc3NlbWJseSBiYWNrZW5kXG4gICAgICovXG4gICAgbG9nU2V2ZXJpdHlMZXZlbD86IDAgfCAxIHwgMiB8IDMgfCA0O1xuXG4gICAgLyoqXG4gICAgICogTG9nIHZlcmJvc2l0eSBsZXZlbC5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBXZWJBc3NlbWJseSBiYWNrZW5kLiBXaWxsIHN1cHBvcnQgTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUgbGF0ZXJcbiAgICAgKi9cbiAgICBsb2dWZXJib3NpdHlMZXZlbD86IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgc3RyaW5nIGFzIGEgcHJlZmVycmVkIGRhdGEgbG9jYXRpb24gZm9yIGFsbCBvdXRwdXRzLCBvciBhbiBvYmplY3QgdGhhdCB1c2Ugb3V0cHV0IG5hbWVzIGFzIGtleXMgYW5kIGFcbiAgICAgKiBwcmVmZXJyZWQgZGF0YSBsb2NhdGlvbiBhcyBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSBXZWIgZm9yIFdlYkdMIGFuZCBXZWJHUFUgRVAuXG4gICAgICovXG4gICAgcHJlZmVycmVkT3V0cHV0TG9jYXRpb24/OiBPbm54VmFsdWVEYXRhTG9jYXRpb24gfCB7IHJlYWRvbmx5IFtvdXRwdXROYW1lOiBzdHJpbmddOiBPbm54VmFsdWVEYXRhTG9jYXRpb24gfTtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgZW5hYmxlIGdyYXBoIGNhcHR1cmUuXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIFdlYiBmb3IgV2ViR1BVIEVQLlxuICAgICAqL1xuICAgIGVuYWJsZUdyYXBoQ2FwdHVyZT86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSBjb25maWd1cmF0aW9ucyBmb3IgYSBzZXNzaW9uLiBTZWVcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L29ubnhydW50aW1lL2Jsb2IvbWFpbi9pbmNsdWRlL29ubnhydW50aW1lL2NvcmUvc2Vzc2lvbi9cbiAgICAgKiBvbm54cnVudGltZV9zZXNzaW9uX29wdGlvbnNfY29uZmlnX2tleXMuaFxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIFdlYkFzc2VtYmx5IGJhY2tlbmQuIFdpbGwgc3VwcG9ydCBOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSBsYXRlclxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBgYGBqc1xuICAgICAqIGV4dHJhOiB7XG4gICAgICogICBzZXNzaW9uOiB7XG4gICAgICogICAgIHNldF9kZW5vcm1hbF9hc196ZXJvOiBcIjFcIixcbiAgICAgKiAgICAgZGlzYWJsZV9wcmVwYWNraW5nOiBcIjFcIlxuICAgICAqICAgfSxcbiAgICAgKiAgIG9wdGltaXphdGlvbjoge1xuICAgICAqICAgICBlbmFibGVfZ2VsdV9hcHByb3hpbWF0aW9uOiBcIjFcIlxuICAgICAqICAgfVxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBleHRyYT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBleGVjdXRpb24gcHJvdmlkZXJzXG5cbiAgLy8gQ3VycmVudGx5LCB3ZSBoYXZlIHRoZSBmb2xsb3dpbmcgYmFja2VuZHMgdG8gc3VwcG9ydCBleGVjdXRpb24gcHJvdmlkZXJzOlxuICAvLyBCYWNrZW5kIE5vZGUuanMgYmluZGluZzogc3VwcG9ydHMgJ2NwdScsICdkbWwnICh3aW4zMiksICdjb3JlbWwnIChtYWNPUykgYW5kICdjdWRhJyAobGludXgpLlxuICAvLyBCYWNrZW5kIFdlYkFzc2VtYmx5OiBzdXBwb3J0cyAnY3B1JywgJ3dhc20nLCAnd2ViZ3B1JyBhbmQgJ3dlYm5uJy5cbiAgLy8gQmFja2VuZCBPTk5YLmpzOiBzdXBwb3J0cyAnd2ViZ2wnLlxuICAvLyBCYWNrZW5kIFJlYWN0IE5hdGl2ZTogc3VwcG9ydHMgJ2NwdScsICd4bm5wYWNrJywgJ2NvcmVtbCcgKGlPUyksICdubmFwaScgKEFuZHJvaWQpLlxuICBpbnRlcmZhY2UgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb25NYXAge1xuICAgIGNvcmVtbDogQ29yZU1MRXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgY3B1OiBDcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICBjdWRhOiBDdWRhRXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgZG1sOiBEbWxFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICBubmFwaTogTm5hcGlFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICB0ZW5zb3JydDogVGVuc29yUnRFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICB3YXNtOiBXZWJBc3NlbWJseUV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgIHdlYmdsOiBXZWJHTEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgIHdlYmdwdTogV2ViR3B1RXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgd2Vibm46IFdlYk5ORXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgcW5uOiBRbm5FeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcbiAgICB4bm5wYWNrOiBYbm5wYWNrRXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gIH1cblxuICB0eXBlIEV4ZWN1dGlvblByb3ZpZGVyTmFtZSA9IGtleW9mIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uTWFwO1xuICB0eXBlIEV4ZWN1dGlvblByb3ZpZGVyQ29uZmlnID1cbiAgICB8IEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uTWFwW0V4ZWN1dGlvblByb3ZpZGVyTmFtZV1cbiAgICB8IEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uXG4gICAgfCBFeGVjdXRpb25Qcm92aWRlck5hbWVcbiAgICB8IHN0cmluZztcblxuICBleHBvcnQgaW50ZXJmYWNlIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBDcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnY3B1JztcbiAgICB1c2VBcmVuYT86IGJvb2xlYW47XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBDdWRhRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ2N1ZGEnO1xuICAgIGRldmljZUlkPzogbnVtYmVyO1xuICB9XG4gIGV4cG9ydCBpbnRlcmZhY2UgRG1sRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ2RtbCc7XG4gICAgZGV2aWNlSWQ/OiBudW1iZXI7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBUZW5zb3JSdEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIGV4dGVuZHMgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24ge1xuICAgIHJlYWRvbmx5IG5hbWU6ICd0ZW5zb3JydCc7XG4gICAgZGV2aWNlSWQ/OiBudW1iZXI7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJBc3NlbWJseUV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIGV4dGVuZHMgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24ge1xuICAgIHJlYWRvbmx5IG5hbWU6ICd3YXNtJztcbiAgfVxuICBleHBvcnQgaW50ZXJmYWNlIFdlYkdMRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ3dlYmdsJztcbiAgICAvLyBUT0RPOiBhZGQgZmxhZ3NcbiAgfVxuICBleHBvcnQgaW50ZXJmYWNlIFhubnBhY2tFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAneG5ucGFjayc7XG4gIH1cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJHcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnd2ViZ3B1JztcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgdGhlIHByZWZlcnJlZCBsYXlvdXQgd2hlbiBydW5uaW5nIGxheW91dCBzZW5zaXRpdmUgb3BlcmF0b3JzLlxuICAgICAqXG4gICAgICogQGRlZmF1bHQgJ05DSFcnXG4gICAgICovXG4gICAgcHJlZmVycmVkTGF5b3V0PzogJ05DSFcnIHwgJ05IV0MnO1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmeSBhIGxpc3Qgb2Ygbm9kZSBuYW1lcyB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCBvbiBDUFUgZXZlbiB3aGVuIFdlYkdQVSBFUCBpcyB1c2VkLlxuICAgICAqL1xuICAgIGZvcmNlQ3B1Tm9kZU5hbWVzPzogcmVhZG9ubHkgc3RyaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBTcGVjaWZ5IHRoZSB2YWxpZGF0aW9uIG1vZGUgZm9yIFdlYkdQVSBleGVjdXRpb24gcHJvdmlkZXIuXG4gICAgICogLSAnZGlzYWJsZWQnOiBEaXNhYmxlIGFsbCB2YWxpZGF0aW9uLlxuICAgICAqIFdoZW4gdXNlZCBpbiBOb2RlLmpzLCBkaXNhYmxlIHZhbGlkYXRpb24gbWF5IGNhdXNlIHByb2Nlc3MgY3Jhc2ggaWYgV2ViR1BVIGVycm9ycyBvY2N1ci4gQmUgY2F1dGlvdXMgd2hlbiB1c2luZ1xuICAgICAqIHRoaXMgbW9kZS5cbiAgICAgKiBXaGVuIHVzZWQgaW4gd2ViLCB0aGlzIG1vZGUgaXMgZXF1aXZhbGVudCB0byAnd2dwdU9ubHknLlxuICAgICAqIC0gJ3dncHVPbmx5JzogUGVyZm9ybSBXZWJHUFUgaW50ZXJuYWwgdmFsaWRhdGlvbiBvbmx5LlxuICAgICAqIC0gJ2Jhc2ljJzogUGVyZm9ybSBiYXNpYyB2YWxpZGF0aW9uIGluY2x1ZGluZyBXZWJHUFUgaW50ZXJuYWwgdmFsaWRhdGlvbi4gVGhpcyBpcyB0aGUgZGVmYXVsdCBtb2RlLlxuICAgICAqIC0gJ2Z1bGwnOiBQZXJmb3JtIGZ1bGwgdmFsaWRhdGlvbi4gVGhpcyBtb2RlIG1heSBoYXZlIHBlcmZvcm1hbmNlIGltcGFjdC4gVXNlIGl0IGZvciBkZWJ1Z2dpbmcgcHVycG9zZS5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0ICdiYXNpYydcbiAgICAgKi9cbiAgICB2YWxpZGF0aW9uTW9kZT86ICdkaXNhYmxlZCcgfCAnd2dwdU9ubHknIHwgJ2Jhc2ljJyB8ICdmdWxsJztcblxuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgYW4gb3B0aW9uYWwgV2ViR1BVIGRldmljZSB0byBiZSB1c2VkIGJ5IHRoZSBXZWJHUFUgZXhlY3V0aW9uIHByb3ZpZGVyLlxuICAgICAqL1xuICAgIGRldmljZT86IFRyeUdldEdsb2JhbFR5cGU8J0dQVURldmljZSc+O1xuICB9XG5cbiAgLy8gI3JlZ2lvbiBXZWJOTiBvcHRpb25zXG5cbiAgaW50ZXJmYWNlIFdlYk5ORXhlY3V0aW9uUHJvdmlkZXJOYW1lIGV4dGVuZHMgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24ge1xuICAgIHJlYWRvbmx5IG5hbWU6ICd3ZWJubic7XG4gIH1cblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIHNldCBvZiBvcHRpb25zIGZvciBjcmVhdGluZyBhIFdlYk5OIE1MQ29udGV4dC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvd2Vibm4vI2RpY3RkZWYtbWxjb250ZXh0b3B0aW9uc1xuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJOTkNvbnRleHRPcHRpb25zIHtcbiAgICBkZXZpY2VUeXBlPzogJ2NwdScgfCAnZ3B1JyB8ICducHUnO1xuICAgIG51bVRocmVhZHM/OiBudW1iZXI7XG4gICAgcG93ZXJQcmVmZXJlbmNlPzogJ2RlZmF1bHQnIHwgJ2xvdy1wb3dlcicgfCAnaGlnaC1wZXJmb3JtYW5jZSc7XG4gIH1cblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIHNldCBvZiBvcHRpb25zIGZvciBXZWJOTiBleGVjdXRpb24gcHJvdmlkZXIgd2l0aG91dCBNTENvbnRleHQuXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIFdlYk5OT3B0aW9uc1dpdGhvdXRNTENvbnRleHQgZXh0ZW5kcyBXZWJOTkV4ZWN1dGlvblByb3ZpZGVyTmFtZSwgV2ViTk5Db250ZXh0T3B0aW9ucyB7XG4gICAgY29udGV4dD86IG5ldmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSBzZXQgb2Ygb3B0aW9ucyBmb3IgV2ViTk4gZXhlY3V0aW9uIHByb3ZpZGVyIHdpdGggTUxDb250ZXh0LlxuICAgKlxuICAgKiBXaGVuIE1MQ29udGV4dCBpcyBwcm92aWRlZCwgdGhlIGRldmljZVR5cGUgaXMgYWxzbyByZXF1aXJlZCBzbyB0aGF0IHRoZSBXZWJOTiBFUCBjYW4gZGV0ZXJtaW5lIHRoZSBwcmVmZXJyZWRcbiAgICogY2hhbm5lbCBsYXlvdXQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYm5uLyNkb20tbWwtY3JlYXRlY29udGV4dFxuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBXZWJOTk9wdGlvbnNXaXRoTUxDb250ZXh0XG4gICAgZXh0ZW5kcyBXZWJOTkV4ZWN1dGlvblByb3ZpZGVyTmFtZSxcbiAgICAgIE9taXQ8V2ViTk5Db250ZXh0T3B0aW9ucywgJ2RldmljZVR5cGUnPixcbiAgICAgIFJlcXVpcmVkPFBpY2s8V2ViTk5Db250ZXh0T3B0aW9ucywgJ2RldmljZVR5cGUnPj4ge1xuICAgIGNvbnRleHQ6IFRyeUdldEdsb2JhbFR5cGU8J01MQ29udGV4dCc+O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSBzZXQgb2Ygb3B0aW9ucyBmb3IgV2ViTk4gZXhlY3V0aW9uIHByb3ZpZGVyIHdpdGggTUxDb250ZXh0IHdoaWNoIGlzIGNyZWF0ZWQgZnJvbSBHUFVEZXZpY2UuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYm5uLyNkb20tbWwtY3JlYXRlY29udGV4dC1ncHVkZXZpY2VcbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgV2ViTk5PcHRpb25zV2ViR3B1IGV4dGVuZHMgV2ViTk5FeGVjdXRpb25Qcm92aWRlck5hbWUge1xuICAgIGNvbnRleHQ6IFRyeUdldEdsb2JhbFR5cGU8J01MQ29udGV4dCc+O1xuICAgIGdwdURldmljZTogVHJ5R2V0R2xvYmFsVHlwZTwnR1BVRGV2aWNlJz47XG4gIH1cblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgV2ViTk4gZXhlY3V0aW9uIHByb3ZpZGVyLlxuICAgKi9cbiAgZXhwb3J0IHR5cGUgV2ViTk5FeGVjdXRpb25Qcm92aWRlck9wdGlvbiA9XG4gICAgfCBXZWJOTk9wdGlvbnNXaXRob3V0TUxDb250ZXh0XG4gICAgfCBXZWJOTk9wdGlvbnNXaXRoTUxDb250ZXh0XG4gICAgfCBXZWJOTk9wdGlvbnNXZWJHcHU7XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgUW5uRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24gZXh0ZW5kcyBFeGVjdXRpb25Qcm92aWRlck9wdGlvbiB7XG4gICAgcmVhZG9ubHkgbmFtZTogJ3Fubic7XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB0aGUgUU5OIGJhY2tlbmQgdHlwZS4gRS5nLiwgJ2NwdScgb3IgJ2h0cCcuXG4gICAgICogTXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggYGJhY2tlbmRQYXRoYC5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0ICdodHAnXG4gICAgICovXG4gICAgYmFja2VuZFR5cGU/OiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSBhIHBhdGggdG8gdGhlIFFOTiBiYWNrZW5kIGxpYnJhcnkuXG4gICAgICogTXV0dWFsbHkgZXhjbHVzaXZlIHdpdGggYGJhY2tlbmRUeXBlYC5cbiAgICAgKi9cbiAgICBiYWNrZW5kUGF0aD86IHN0cmluZztcbiAgICAvKipcbiAgICAgKiBTcGVjaWZ5IHdoZXRoZXIgdG8gZW5hYmxlIEhUUCBGUDE2IHByZWNpc2lvbi5cbiAgICAgKlxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBlbmFibGVGcDE2UHJlY2lzaW9uPzogYm9vbGVhbjtcbiAgfVxuICBleHBvcnQgaW50ZXJmYWNlIENvcmVNTEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIGV4dGVuZHMgRXhlY3V0aW9uUHJvdmlkZXJPcHRpb24ge1xuICAgIHJlYWRvbmx5IG5hbWU6ICdjb3JlbWwnO1xuICAgIC8qKlxuICAgICAqIFRoZSBiaXQgZmxhZ3MgZm9yIENvcmVNTCBleGVjdXRpb24gcHJvdmlkZXIuXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiBDT1JFTUxfRkxBR19VU0VfQ1BVX09OTFkgPSAweDAwMVxuICAgICAqIENPUkVNTF9GTEFHX0VOQUJMRV9PTl9TVUJHUkFQSCA9IDB4MDAyXG4gICAgICogQ09SRU1MX0ZMQUdfT05MWV9FTkFCTEVfREVWSUNFX1dJVEhfQU5FID0gMHgwMDRcbiAgICAgKiBDT1JFTUxfRkxBR19PTkxZX0FMTE9XX1NUQVRJQ19JTlBVVF9TSEFQRVMgPSAweDAwOFxuICAgICAqIENPUkVNTF9GTEFHX0NSRUFURV9NTFBST0dSQU0gPSAweDAxMFxuICAgICAqIENPUkVNTF9GTEFHX1VTRV9DUFVfQU5EX0dQVSA9IDB4MDIwXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBTZWUgaW5jbHVkZS9vbm54cnVudGltZS9jb3JlL3Byb3ZpZGVycy9jb3JlbWwvY29yZW1sX3Byb3ZpZGVyX2ZhY3RvcnkuaCBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAqXG4gICAgICogVGhpcyBmbGFnIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcpLlxuICAgICAqL1xuICAgIGNvcmVNbEZsYWdzPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFNwZWNpZnkgd2hldGhlciB0byB1c2UgQ1BVIG9ubHkgaW4gQ29yZU1MIEVQLlxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChyZWFjdC1uYXRpdmUpLlxuICAgICAqL1xuICAgIHVzZUNQVU9ubHk/OiBib29sZWFuO1xuICAgIHVzZUNQVUFuZEdQVT86IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB3aGV0aGVyIHRvIGVuYWJsZSBDb3JlTUwgRVAgb24gc3ViZ3JhcGguXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKHJlYWN0LW5hdGl2ZSkuXG4gICAgICovXG4gICAgZW5hYmxlT25TdWJncmFwaD86IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB3aGV0aGVyIHRvIG9ubHkgZW5hYmxlIENvcmVNTCBFUCBmb3IgQXBwbGUgZGV2aWNlcyB3aXRoIEFORSAoQXBwbGUgTmV1cmFsIEVuZ2luZSkuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gT05OWFJ1bnRpbWUgKHJlYWN0LW5hdGl2ZSkuXG4gICAgICovXG4gICAgb25seUVuYWJsZURldmljZVdpdGhBTkU/OiBib29sZWFuO1xuICB9XG4gIGV4cG9ydCBpbnRlcmZhY2UgTm5hcGlFeGVjdXRpb25Qcm92aWRlck9wdGlvbiBleHRlbmRzIEV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uIHtcbiAgICByZWFkb25seSBuYW1lOiAnbm5hcGknO1xuICAgIHVzZUZQMTY/OiBib29sZWFuO1xuICAgIHVzZU5DSFc/OiBib29sZWFuO1xuICAgIGNwdURpc2FibGVkPzogYm9vbGVhbjtcbiAgICBjcHVPbmx5PzogYm9vbGVhbjtcbiAgfVxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gcnVuIG9wdGlvbnNcblxuICAvKipcbiAgICogQSBzZXQgb2YgY29uZmlndXJhdGlvbnMgZm9yIGluZmVyZW5jZSBydW4gYmVoYXZpb3JcbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgUnVuT3B0aW9ucyB7XG4gICAgLyoqXG4gICAgICogTG9nIHNldmVyaXR5IGxldmVsLiBTZWVcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L29ubnhydW50aW1lL2Jsb2IvbWFpbi9pbmNsdWRlL29ubnhydW50aW1lL2NvcmUvY29tbW9uL2xvZ2dpbmcvc2V2ZXJpdHkuaFxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIE9OTlhSdW50aW1lIChOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSkgb3IgV2ViQXNzZW1ibHkgYmFja2VuZFxuICAgICAqL1xuICAgIGxvZ1NldmVyaXR5TGV2ZWw/OiAwIHwgMSB8IDIgfCAzIHwgNDtcblxuICAgIC8qKlxuICAgICAqIExvZyB2ZXJib3NpdHkgbGV2ZWwuXG4gICAgICpcbiAgICAgKiBUaGlzIHNldHRpbmcgaXMgYXZhaWxhYmxlIG9ubHkgaW4gV2ViQXNzZW1ibHkgYmFja2VuZC4gV2lsbCBzdXBwb3J0IE5vZGUuanMgYmluZGluZyBhbmQgcmVhY3QtbmF0aXZlIGxhdGVyXG4gICAgICovXG4gICAgbG9nVmVyYm9zaXR5TGV2ZWw/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUZXJtaW5hdGUgYWxsIGluY29tcGxldGUgT3J0UnVuIGNhbGxzIGFzIHNvb24gYXMgcG9zc2libGUgaWYgdHJ1ZVxuICAgICAqXG4gICAgICogVGhpcyBzZXR0aW5nIGlzIGF2YWlsYWJsZSBvbmx5IGluIFdlYkFzc2VtYmx5IGJhY2tlbmQuIFdpbGwgc3VwcG9ydCBOb2RlLmpzIGJpbmRpbmcgYW5kIHJlYWN0LW5hdGl2ZSBsYXRlclxuICAgICAqL1xuICAgIHRlcm1pbmF0ZT86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBIHRhZyBmb3IgdGhlIFJ1bigpIGNhbGxzIHVzaW5nIHRoaXNcbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBPTk5YUnVudGltZSAoTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUpIG9yIFdlYkFzc2VtYmx5IGJhY2tlbmRcbiAgICAgKi9cbiAgICB0YWc/OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBzaW5nbGUgcnVuIGNvbmZpZ3VyYXRpb24gZW50cnkuIFNlZVxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvb25ueHJ1bnRpbWUvYmxvYi9tYWluL2luY2x1ZGUvb25ueHJ1bnRpbWUvY29yZS9zZXNzaW9uL1xuICAgICAqIG9ubnhydW50aW1lX3J1bl9vcHRpb25zX2NvbmZpZ19rZXlzLmhcbiAgICAgKlxuICAgICAqIFRoaXMgc2V0dGluZyBpcyBhdmFpbGFibGUgb25seSBpbiBXZWJBc3NlbWJseSBiYWNrZW5kLiBXaWxsIHN1cHBvcnQgTm9kZS5qcyBiaW5kaW5nIGFuZCByZWFjdC1uYXRpdmUgbGF0ZXJcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBgYGBqc1xuICAgICAqIGV4dHJhOiB7XG4gICAgICogICBtZW1vcnk6IHtcbiAgICAgKiAgICAgZW5hYmxlX21lbW9yeV9hcmVuYV9zaHJpbmthZ2U6IFwiMVwiLFxuICAgICAqICAgfVxuICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBleHRyYT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIC8vICNyZWdpb24gdmFsdWUgbWV0YWRhdGFcblxuICAvKipcbiAgICogVGhlIGNvbW1vbiBwYXJ0IG9mIHRoZSB2YWx1ZSBtZXRhZGF0YSB0eXBlIGZvciBib3RoIHRlbnNvciBhbmQgbm9uLXRlbnNvciB2YWx1ZXMuXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIFZhbHVlTWV0YWRhdGFCYXNlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgc3BlY2lmaWVkIGlucHV0IG9yIG91dHB1dC5cbiAgICAgKi9cbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogUmVwcmVzZW50cyB0aGUgbWV0YWRhdGEgb2YgYSBub24tdGVuc29yIHZhbHVlLlxuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBOb25UZW5zb3JWYWx1ZU1ldGFkYXRhIGV4dGVuZHMgVmFsdWVNZXRhZGF0YUJhc2Uge1xuICAgIC8qKlxuICAgICAqIEdldCBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgdmFsdWUgaXMgYSB0ZW5zb3IuXG4gICAgICovXG4gICAgcmVhZG9ubHkgaXNUZW5zb3I6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgdGhlIG1ldGFkYXRhIG9mIGEgdGVuc29yIHZhbHVlLlxuICAgKi9cbiAgZXhwb3J0IGludGVyZmFjZSBUZW5zb3JWYWx1ZU1ldGFkYXRhIGV4dGVuZHMgVmFsdWVNZXRhZGF0YUJhc2Uge1xuICAgIC8qKlxuICAgICAqIEdldCBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgdmFsdWUgaXMgYSB0ZW5zb3IuXG4gICAgICovXG4gICAgcmVhZG9ubHkgaXNUZW5zb3I6IHRydWU7XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkYXRhIHR5cGUgb2YgdGhlIHRlbnNvci5cbiAgICAgKi9cbiAgICByZWFkb25seSB0eXBlOiBUZW5zb3IuVHlwZTtcbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHNoYXBlIG9mIHRoZSB0ZW5zb3IuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgc2hhcGUgaXMgbm90IGRlZmluZWQsIHRoZSB2YWx1ZSB3aWxsIGFuIGVtcHR5IGFycmF5LiBPdGhlcndpc2UsIGl0IHdpbGwgYmUgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBzaGFwZVxuICAgICAqIG9mIHRoZSB0ZW5zb3IuIEVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXkgY2FuIGJlIGEgbnVtYmVyIG9yIGEgc3RyaW5nLiBJZiB0aGUgZWxlbWVudCBpcyBhIG51bWJlciwgaXQgcmVwcmVzZW50c1xuICAgICAqIHRoZSBjb3JyZXNwb25kaW5nIGRpbWVuc2lvbiBzaXplLiBJZiB0aGUgZWxlbWVudCBpcyBhIHN0cmluZywgaXQgcmVwcmVzZW50cyBhIHN5bWJvbGljIGRpbWVuc2lvbi5cbiAgICAgKi9cbiAgICByZWFkb25seSBzaGFwZTogUmVhZG9ubHlBcnJheTxudW1iZXIgfCBzdHJpbmc+O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgdGhlIG1ldGFkYXRhIG9mIGEgdmFsdWUuXG4gICAqL1xuICBleHBvcnQgdHlwZSBWYWx1ZU1ldGFkYXRhID0gTm9uVGVuc29yVmFsdWVNZXRhZGF0YSB8IFRlbnNvclZhbHVlTWV0YWRhdGE7XG5cbiAgLy8gI2VuZHJlZ2lvblxufVxuXG4vKipcbiAqIFJlcHJlc2VudCBhIHJ1bnRpbWUgaW5zdGFuY2Ugb2YgYW4gT05OWCBtb2RlbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmZlcmVuY2VTZXNzaW9uIHtcbiAgLy8gI3JlZ2lvbiBydW4oKVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHRoZSBtb2RlbCBhc3luY2hyb25vdXNseSB3aXRoIHRoZSBnaXZlbiBmZWVkcyBhbmQgb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGZlZWRzIC0gUmVwcmVzZW50YXRpb24gb2YgdGhlIG1vZGVsIGlucHV0LiBTZWUgdHlwZSBkZXNjcmlwdGlvbiBvZiBgSW5mZXJlbmNlU2Vzc2lvbi5JbnB1dFR5cGVgIGZvciBkZXRhaWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9uYWwuIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgbW9kZWwgaW5mZXJlbmNlLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIG1hcCwgd2hpY2ggdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgKi9cbiAgcnVuKGZlZWRzOiBJbmZlcmVuY2VTZXNzaW9uLkZlZWRzVHlwZSwgb3B0aW9ucz86IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbi5SZXR1cm5UeXBlPjtcblxuICAvKipcbiAgICogRXhlY3V0ZSB0aGUgbW9kZWwgYXN5bmNocm9ub3VzbHkgd2l0aCB0aGUgZ2l2ZW4gZmVlZHMsIGZldGNoZXMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBmZWVkcyAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBpbnB1dC4gU2VlIHR5cGUgZGVzY3JpcHRpb24gb2YgYEluZmVyZW5jZVNlc3Npb24uSW5wdXRUeXBlYCBmb3IgZGV0YWlsLlxuICAgKiBAcGFyYW0gZmV0Y2hlcyAtIFJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbCBvdXRwdXQuIFNlZSB0eXBlIGRlc2NyaXB0aW9uIG9mIGBJbmZlcmVuY2VTZXNzaW9uLk91dHB1dFR5cGVgIGZvclxuICAgKiBkZXRhaWwuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9uYWwuIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjb250cm9scyB0aGUgYmVoYXZpb3Igb2YgbW9kZWwgaW5mZXJlbmNlLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIG1hcCwgd2hpY2ggdXNlcyBvdXRwdXQgbmFtZXMgYXMga2V5cyBhbmQgT25ueFZhbHVlIGFzIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgKi9cbiAgcnVuKFxuICAgIGZlZWRzOiBJbmZlcmVuY2VTZXNzaW9uLkZlZWRzVHlwZSxcbiAgICBmZXRjaGVzOiBJbmZlcmVuY2VTZXNzaW9uLkZldGNoZXNUeXBlLFxuICAgIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlJ1bk9wdGlvbnMsXG4gICk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbi5SZXR1cm5UeXBlPjtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiByZWxlYXNlKClcblxuICAvKipcbiAgICogUmVsZWFzZSB0aGUgaW5mZXJlbmNlIHNlc3Npb24gYW5kIHRoZSB1bmRlcmx5aW5nIHJlc291cmNlcy5cbiAgICovXG4gIHJlbGVhc2UoKTogUHJvbWlzZTx2b2lkPjtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBwcm9maWxpbmdcblxuICAvKipcbiAgICogU3RhcnQgcHJvZmlsaW5nLlxuICAgKi9cbiAgc3RhcnRQcm9maWxpbmcoKTogdm9pZDtcblxuICAvKipcbiAgICogRW5kIHByb2ZpbGluZy5cbiAgICovXG4gIGVuZFByb2ZpbGluZygpOiB2b2lkO1xuXG4gIC8vICNlbmRyZWdpb25cblxuICAvLyAjcmVnaW9uIG1ldGFkYXRhXG5cbiAgLyoqXG4gICAqIEdldCBpbnB1dCBuYW1lcyBvZiB0aGUgbG9hZGVkIG1vZGVsLlxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXROYW1lczogcmVhZG9ubHkgc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEdldCBvdXRwdXQgbmFtZXMgb2YgdGhlIGxvYWRlZCBtb2RlbC5cbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dE5hbWVzOiByZWFkb25seSBzdHJpbmdbXTtcblxuICAvKipcbiAgICogR2V0IGlucHV0IG1ldGFkYXRhIG9mIHRoZSBsb2FkZWQgbW9kZWwuXG4gICAqL1xuICByZWFkb25seSBpbnB1dE1ldGFkYXRhOiByZWFkb25seSBJbmZlcmVuY2VTZXNzaW9uLlZhbHVlTWV0YWRhdGFbXTtcblxuICAvKipcbiAgICogR2V0IG91dHB1dCBtZXRhZGF0YSBvZiB0aGUgbG9hZGVkIG1vZGVsLlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0TWV0YWRhdGE6IHJlYWRvbmx5IEluZmVyZW5jZVNlc3Npb24uVmFsdWVNZXRhZGF0YVtdO1xuXG4gIC8vICNlbmRyZWdpb25cbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmZlcmVuY2VTZXNzaW9uRmFjdG9yeSB7XG4gIC8vICNyZWdpb24gY3JlYXRlKClcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluZmVyZW5jZSBzZXNzaW9uIGFuZCBsb2FkIG1vZGVsIGFzeW5jaHJvbm91c2x5IGZyb20gYW4gT05OWCBtb2RlbCBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gdXJpIC0gVGhlIFVSSSBvciBmaWxlIHBhdGggb2YgdGhlIG1vZGVsIHRvIGxvYWQuXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gc3BlY2lmeSBjb25maWd1cmF0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBpbmZlcmVuY2Ugc2Vzc2lvbi5cbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gSW5mZXJlbmNlU2Vzc2lvbiBvYmplY3QuXG4gICAqL1xuICBjcmVhdGUodXJpOiBzdHJpbmcsIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uPjtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluZmVyZW5jZSBzZXNzaW9uIGFuZCBsb2FkIG1vZGVsIGFzeW5jaHJvbm91c2x5IGZyb20gYW4gYXJyYXkgYnVmZXIuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXIgLSBBbiBBcnJheUJ1ZmZlciByZXByZXNlbnRhdGlvbiBvZiBhbiBPTk5YIG1vZGVsLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHNwZWNpZnkgY29uZmlndXJhdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgaW5mZXJlbmNlIHNlc3Npb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIEluZmVyZW5jZVNlc3Npb24gb2JqZWN0LlxuICAgKi9cbiAgY3JlYXRlKGJ1ZmZlcjogQXJyYXlCdWZmZXJMaWtlLCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IFByb21pc2U8SW5mZXJlbmNlU2Vzc2lvbj47XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbmZlcmVuY2Ugc2Vzc2lvbiBhbmQgbG9hZCBtb2RlbCBhc3luY2hyb25vdXNseSBmcm9tIHNlZ21lbnQgb2YgYW4gYXJyYXkgYnVmZXIuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXIgLSBBbiBBcnJheUJ1ZmZlciByZXByZXNlbnRhdGlvbiBvZiBhbiBPTk5YIG1vZGVsLlxuICAgKiBAcGFyYW0gYnl0ZU9mZnNldCAtIFRoZSBiZWdpbm5pbmcgb2YgdGhlIHNwZWNpZmllZCBwb3J0aW9uIG9mIHRoZSBhcnJheSBidWZmZXIuXG4gICAqIEBwYXJhbSBieXRlTGVuZ3RoIC0gVGhlIGxlbmd0aCBpbiBieXRlcyBvZiB0aGUgYXJyYXkgYnVmZmVyLlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHNwZWNpZnkgY29uZmlndXJhdGlvbiBmb3IgY3JlYXRpbmcgYSBuZXcgaW5mZXJlbmNlIHNlc3Npb24uXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGFuIEluZmVyZW5jZVNlc3Npb24gb2JqZWN0LlxuICAgKi9cbiAgY3JlYXRlKFxuICAgIGJ1ZmZlcjogQXJyYXlCdWZmZXJMaWtlLFxuICAgIGJ5dGVPZmZzZXQ6IG51bWJlcixcbiAgICBieXRlTGVuZ3RoPzogbnVtYmVyLFxuICAgIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zLFxuICApOiBQcm9taXNlPEluZmVyZW5jZVNlc3Npb24+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5mZXJlbmNlIHNlc3Npb24gYW5kIGxvYWQgbW9kZWwgYXN5bmNocm9ub3VzbHkgZnJvbSBhIFVpbnQ4QXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBidWZmZXIgLSBBIFVpbnQ4QXJyYXkgcmVwcmVzZW50YXRpb24gb2YgYW4gT05OWCBtb2RlbC5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBzcGVjaWZ5IGNvbmZpZ3VyYXRpb24gZm9yIGNyZWF0aW5nIGEgbmV3IGluZmVyZW5jZSBzZXNzaW9uLlxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhbiBJbmZlcmVuY2VTZXNzaW9uIG9iamVjdC5cbiAgICovXG4gIGNyZWF0ZShidWZmZXI6IFVpbnQ4QXJyYXksIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uPjtcblxuICAvLyAjZW5kcmVnaW9uXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb25cbmV4cG9ydCBjb25zdCBJbmZlcmVuY2VTZXNzaW9uOiBJbmZlcmVuY2VTZXNzaW9uRmFjdG9yeSA9IEluZmVyZW5jZVNlc3Npb25JbXBsO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBPcHRpb25zRm9ybWF0LCBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMsIE9wdGlvbnNUZW5zb3JMYXlvdXQgfSBmcm9tICcuL3RlbnNvci1mYWN0b3J5LmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JUb0RhdGFVcmxPcHRpb25zIGV4dGVuZHMgT3B0aW9uc1RlbnNvckxheW91dCwgT3B0aW9uc0Zvcm1hdCwgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yVG9JbWFnZURhdGFPcHRpb25zIGV4dGVuZHMgT3B0aW9uc1RlbnNvckxheW91dCwgT3B0aW9uc0Zvcm1hdCwgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udmVyc2lvblV0aWxzIHtcbiAgLyoqXG4gICAqIGNyZWF0ZXMgYSBEYXRhVVJMIGluc3RhbmNlIGZyb20gdGVuc29yXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIC0gQW4gb3B0aW9uYWwgb2JqZWN0IHJlcHJlc2VudGluZyBvcHRpb25zIGZvciBjcmVhdGluZyBhIERhdGFVUkwgaW5zdGFuY2UgZnJvbSB0aGUgdGVuc29yLlxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGRlZmF1bHQgc2V0dGluZ3Mgd2lsbCBiZSBhcHBsaWVkOlxuICAgKiAtIGBmb3JtYXRgOiBgJ1JHQidgXG4gICAqIC0gYHRlbnNvckxheW91dGA6IGAnTkNIVydgXG4gICAqIEByZXR1cm5zIGEgRGF0YVVSTCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBpbWFnZSBjb252ZXJ0ZWQgZnJvbSB0ZW5zb3IgZGF0YVxuICAgKi9cbiAgdG9EYXRhVVJMKG9wdGlvbnM/OiBUZW5zb3JUb0RhdGFVcmxPcHRpb25zKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBjcmVhdGVzIGFuIEltYWdlRGF0YSBpbnN0YW5jZSBmcm9tIHRlbnNvclxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgYW4gSW1hZ2VEYXRhIGluc3RhbmNlIGZyb20gdGhlIHRlbnNvci5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBkZWZhdWx0IHNldHRpbmdzIHdpbGwgYmUgYXBwbGllZDpcbiAgICogLSBgZm9ybWF0YDogYCdSR0InYFxuICAgKiAtIGB0ZW5zb3JMYXlvdXRgOiBgJ05DSFcnYFxuICAgKiBAcmV0dXJucyBhbiBJbWFnZURhdGEgaW5zdGFuY2UgcmVwcmVzZW50aW5nIHRoZSBpbWFnZSBjb252ZXJ0ZWQgZnJvbSB0ZW5zb3IgZGF0YVxuICAgKi9cbiAgdG9JbWFnZURhdGEob3B0aW9ucz86IFRlbnNvclRvSW1hZ2VEYXRhT3B0aW9ucyk6IEltYWdlRGF0YTtcbn1cbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHsgVGVuc29yLCBUeXBlZFRlbnNvciB9IGZyb20gJy4vdGVuc29yLmpzJztcblxuZXhwb3J0IHR5cGUgSW1hZ2VGb3JtYXQgPSAnUkdCJyB8ICdSR0JBJyB8ICdCR1InIHwgJ1JCRyc7XG5leHBvcnQgdHlwZSBJbWFnZVRlbnNvckxheW91dCA9ICdOSFdDJyB8ICdOQ0hXJztcblxuLy8gdGhlIGZvbGxvd2luZyByZWdpb24gY29udGFpbnMgdHlwZSBkZWZpbml0aW9ucyBmb3IgY29uc3RydWN0aW5nIHRlbnNvciBmcm9tIGEgc3BlY2lmaWMgbG9jYXRpb24uXG5cbi8vICNyZWdpb24gdHlwZXMgZm9yIGNvbnN0cnVjdGluZyBhIHRlbnNvciBmcm9tIGEgc3BlY2lmaWMgbG9jYXRpb25cblxuLyoqXG4gKiByZXByZXNlbnQgY29tbW9uIHByb3BlcnRpZXMgb2YgdGhlIHBhcmFtZXRlciBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBzcGVjaWZpYyBsb2NhdGlvbi5cbiAqL1xuaW50ZXJmYWNlIENvbW1vbkNvbnN0cnVjdG9yUGFyYW1ldGVyczxUPiBleHRlbmRzIFBpY2s8VGVuc29yLCAnZGltcyc+IHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIGRhdGEgdHlwZSBvZiB0aGUgdGVuc29yLlxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogVDtcbn1cblxuLyoqXG4gKiByZXByZXNlbnQgdGhlIHBhcmFtZXRlciBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBHUFUgcmVzb3VyY2UuXG4gKi9cbmludGVyZmFjZSBHcHVSZXNvdXJjZUNvbnN0cnVjdG9yUGFyYW1ldGVyczxUIGV4dGVuZHMgVGVuc29yLlR5cGU+IHtcbiAgLyoqXG4gICAqIGFuIG9wdGlvbmFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGRvd25sb2FkIGRhdGEgZnJvbSBHUFUgdG8gQ1BVLlxuICAgKlxuICAgKiBJZiBub3QgcHJvdmlkZWQsIHRoZSB0ZW5zb3IgdHJlYXQgdGhlIEdQVSBkYXRhIGFzIGV4dGVybmFsIHJlc291cmNlLlxuICAgKi9cbiAgZG93bmxvYWQ/KCk6IFByb21pc2U8VGVuc29yLkRhdGFUeXBlTWFwW1RdPjtcblxuICAvKipcbiAgICogYW4gb3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB0ZW5zb3IgaXMgZGlzcG9zZWQuXG4gICAqXG4gICAqIElmIG5vdCBwcm92aWRlZCwgdGhlIHRlbnNvciB0cmVhdCB0aGUgR1BVIGRhdGEgYXMgZXh0ZXJuYWwgcmVzb3VyY2UuXG4gICAqL1xuICBkaXNwb3NlPygpOiB2b2lkO1xufVxuXG4vKipcbiAqIHJlcHJlc2VudCB0aGUgcGFyYW1ldGVyIGZvciBjb25zdHJ1Y3RpbmcgYSB0ZW5zb3IgZnJvbSBhIHBpbm5lZCBDUFUgYnVmZmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3B1UGlubmVkQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQgZXh0ZW5kcyBUZW5zb3IuQ3B1UGlubmVkRGF0YVR5cGVzID0gVGVuc29yLkNwdVBpbm5lZERhdGFUeXBlcz5cbiAgZXh0ZW5kcyBDb21tb25Db25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4ge1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgbG9jYXRpb24gb2YgdGhlIGRhdGEgdG8gYmUgJ2NwdS1waW5uZWQnLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb246ICdjcHUtcGlubmVkJztcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIENQVSBwaW5uZWQgYnVmZmVyIHRoYXQgaG9sZHMgdGhlIHRlbnNvciBkYXRhLlxuICAgKi9cbiAgcmVhZG9ubHkgZGF0YTogVGVuc29yLkRhdGFUeXBlTWFwW1RdO1xufVxuXG4vKipcbiAqIHJlcHJlc2VudCB0aGUgcGFyYW1ldGVyIGZvciBjb25zdHJ1Y3RpbmcgYSB0ZW5zb3IgZnJvbSBhIFdlYkdMIHRleHR1cmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXh0dXJlQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQgZXh0ZW5kcyBUZW5zb3IuVGV4dHVyZURhdGFUeXBlcyA9IFRlbnNvci5UZXh0dXJlRGF0YVR5cGVzPlxuICBleHRlbmRzIENvbW1vbkNvbnN0cnVjdG9yUGFyYW1ldGVyczxUPixcbiAgICBHcHVSZXNvdXJjZUNvbnN0cnVjdG9yUGFyYW1ldGVyczxUPiB7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBsb2NhdGlvbiBvZiB0aGUgZGF0YSB0byBiZSAndGV4dHVyZScuXG4gICAqL1xuICByZWFkb25seSBsb2NhdGlvbjogJ3RleHR1cmUnO1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgV2ViR0wgdGV4dHVyZSB0aGF0IGhvbGRzIHRoZSB0ZW5zb3IgZGF0YS5cbiAgICovXG4gIHJlYWRvbmx5IHRleHR1cmU6IFRlbnNvci5UZXh0dXJlVHlwZTtcbn1cblxuLyoqXG4gKiByZXByZXNlbnQgdGhlIHBhcmFtZXRlciBmb3IgY29uc3RydWN0aW5nIGEgdGVuc29yIGZyb20gYSBXZWJHUFUgYnVmZmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3B1QnVmZmVyQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQgZXh0ZW5kcyBUZW5zb3IuR3B1QnVmZmVyRGF0YVR5cGVzID0gVGVuc29yLkdwdUJ1ZmZlckRhdGFUeXBlcz5cbiAgZXh0ZW5kcyBDb21tb25Db25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4sXG4gICAgR3B1UmVzb3VyY2VDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4ge1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgbG9jYXRpb24gb2YgdGhlIGRhdGEgdG8gYmUgJ2dwdS1idWZmZXInLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb246ICdncHUtYnVmZmVyJztcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIFdlYkdQVSBidWZmZXIgdGhhdCBob2xkcyB0aGUgdGVuc29yIGRhdGEuXG4gICAqL1xuICByZWFkb25seSBncHVCdWZmZXI6IFRlbnNvci5HcHVCdWZmZXJUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1MVGVuc29yQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQgZXh0ZW5kcyBUZW5zb3IuTUxUZW5zb3JEYXRhVHlwZXMgPSBUZW5zb3IuTUxUZW5zb3JEYXRhVHlwZXM+XG4gIGV4dGVuZHMgQ29tbW9uQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+LFxuICAgIEdwdVJlc291cmNlQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+IHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIGxvY2F0aW9uIG9mIHRoZSBkYXRhIHRvIGJlICdtbC10ZW5zb3InLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYXRpb246ICdtbC10ZW5zb3InO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBXZWJOTiBNTFRlbnNvciB0aGF0IGhvbGRzIHRoZSB0ZW5zb3IgZGF0YS5cbiAgICovXG4gIHJlYWRvbmx5IG1sVGVuc29yOiBUZW5zb3IuTUxUZW5zb3JUeXBlO1xufVxuXG4vLyAjZW5kcmVnaW9uXG5cbi8vIHRoZSBmb2xsb3dpbmcgcmVnaW9uIGNvbnRhaW5zIHR5cGUgZGVmaW5pdGlvbnMgb2YgZWFjaCBpbmRpdmlkdWFsIG9wdGlvbnMuXG4vLyB0aGUgdGVuc29yIGZhY3RvcnkgZnVuY3Rpb25zIHVzZSBhIGNvbXBvc2l0aW9uIG9mIHRob3NlIG9wdGlvbnMgYXMgdGhlIHBhcmFtZXRlciB0eXBlLlxuXG4vLyAjcmVnaW9uIE9wdGlvbnMgZmllbGRzXG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uc0Zvcm1hdCB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGltYWdlIGZvcm1hdCByZXByZXNlbnRlZCBpbiBSR0JBIGNvbG9yIHNwYWNlLlxuICAgKi9cbiAgZm9ybWF0PzogSW1hZ2VGb3JtYXQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uc1RlbnNvckZvcm1hdCB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGltYWdlIGZvcm1hdCBvZiB0aGUgdGVuc29yLlxuICAgKlxuICAgKiBOT1RFOiB0aGlzIGlzIGRpZmZlcmVudCBmcm9tIG9wdGlvbiAnZm9ybWF0Jy4gV2hpbGUgb3B0aW9uICdmb3JtYXQnIHJlcHJlc2VudHMgdGhlIG9yaWdpbmFsIGltYWdlLCAndGVuc29yRm9ybWF0J1xuICAgKiByZXByZXNlbnRzIHRoZSB0YXJnZXQgZm9ybWF0IG9mIHRoZSB0ZW5zb3IuIEEgdHJhbnNwb3NlIHdpbGwgYmUgcGVyZm9ybWVkIGlmIHRoZXkgYXJlIGRpZmZlcmVudC5cbiAgICovXG4gIHRlbnNvckZvcm1hdD86IEltYWdlRm9ybWF0O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnNUZW5zb3JEYXRhVHlwZSB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGRhdGEgdHlwZSBvZiB0aGUgdGVuc29yLlxuICAgKi9cbiAgZGF0YVR5cGU/OiAnZmxvYXQzMicgfCAndWludDgnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnNUZW5zb3JMYXlvdXQge1xuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSB0ZW5zb3IgbGF5b3V0IHdoZW4gcmVwcmVzZW50aW5nIGRhdGEgb2Ygb25lIG9yIG1vcmUgaW1hZ2UocykuXG4gICAqL1xuICB0ZW5zb3JMYXlvdXQ/OiBJbWFnZVRlbnNvckxheW91dDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zRGltZW5zaW9ucyB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgdGhlIGltYWdlIGhlaWdodCBpbiBwaXhlbFxuICAgKi9cbiAgaGVpZ2h0PzogbnVtYmVyO1xuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSBpbWFnZSB3aWR0aCBpbiBwaXhlbFxuICAgKi9cbiAgd2lkdGg/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uUmVzaXplZERpbWVuc2lvbnMge1xuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSByZXNpemVkIGhlaWdodC4gSWYgb21pdHRlZCwgb3JpZ2luYWwgaGVpZ2h0IHdpbGwgYmUgdXNlZC5cbiAgICovXG4gIHJlc2l6ZWRIZWlnaHQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgcmVzaXplZCB3aWR0aCAtIGNhbiBiZSBhY2Nlc3NlZCB2aWEgdGVuc29yIGRpbWVuc2lvbnMgYXMgd2VsbFxuICAgKi9cbiAgcmVzaXplZFdpZHRoPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9wdGlvbnNOb3JtYWxpemF0aW9uUGFyYW1ldGVycyB7XG4gIC8qKlxuICAgKiBEZXNjcmliZXMgbm9ybWFsaXphdGlvbiBwYXJhbWV0ZXJzIHdoZW4gcHJlcHJvY2Vzc2luZyB0aGUgaW1hZ2UgYXMgbW9kZWwgaW5wdXQuXG4gICAqXG4gICAqIERhdGEgZWxlbWVudCBhcmUgcmFuZ2VkIGZyb20gMCB0byAyNTUuXG4gICAqL1xuICBub3JtPzoge1xuICAgIC8qKlxuICAgICAqIFRoZSAnYmlhcycgdmFsdWUgZm9yIGltYWdlIG5vcm1hbGl6YXRpb24uXG4gICAgICogLSBJZiBvbWl0dGVkLCB1c2UgZGVmYXVsdCB2YWx1ZSAwLlxuICAgICAqIC0gSWYgaXQncyBhIHNpbmdsZSBudW1iZXIsIGFwcGx5IHRvIGVhY2ggY2hhbm5lbFxuICAgICAqIC0gSWYgaXQncyBhbiBhcnJheSBvZiAzIG9yIDQgbnVtYmVycywgYXBwbHkgZWxlbWVudC13aXNlLiBOdW1iZXIgb2YgZWxlbWVudHMgbmVlZCB0byBtYXRjaCB0aGUgbnVtYmVyIG9mIGNoYW5uZWxzXG4gICAgICogZm9yIHRoZSBjb3JyZXNwb25kaW5nIGltYWdlIGZvcm1hdFxuICAgICAqL1xuICAgIGJpYXM/OiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgICAvKipcbiAgICAgKiBUaGUgJ21lYW4nIHZhbHVlIGZvciBpbWFnZSBub3JtYWxpemF0aW9uLlxuICAgICAqIC0gSWYgb21pdHRlZCwgdXNlIGRlZmF1bHQgdmFsdWUgMjU1LlxuICAgICAqIC0gSWYgaXQncyBhIHNpbmdsZSBudW1iZXIsIGFwcGx5IHRvIGVhY2ggY2hhbm5lbFxuICAgICAqIC0gSWYgaXQncyBhbiBhcnJheSBvZiAzIG9yIDQgbnVtYmVycywgYXBwbHkgZWxlbWVudC13aXNlLiBOdW1iZXIgb2YgZWxlbWVudHMgbmVlZCB0byBtYXRjaCB0aGUgbnVtYmVyIG9mIGNoYW5uZWxzXG4gICAgICogZm9yIHRoZSBjb3JyZXNwb25kaW5nIGltYWdlIGZvcm1hdFxuICAgICAqL1xuICAgIG1lYW4/OiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgfTtcbn1cblxuLy8gI2VuZHJlZ2lvblxuXG4vLyAjcmVnaW9uIE9wdGlvbnMgY29tcG9zaXRpb25cblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JGcm9tSW1hZ2VEYXRhT3B0aW9uc1xuICBleHRlbmRzIE9wdGlvblJlc2l6ZWREaW1lbnNpb25zLFxuICAgIE9wdGlvbnNUZW5zb3JGb3JtYXQsXG4gICAgT3B0aW9uc1RlbnNvckxheW91dCxcbiAgICBPcHRpb25zVGVuc29yRGF0YVR5cGUsXG4gICAgT3B0aW9uc05vcm1hbGl6YXRpb25QYXJhbWV0ZXJzIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnNcbiAgZXh0ZW5kcyBPcHRpb25SZXNpemVkRGltZW5zaW9ucyxcbiAgICBPcHRpb25zVGVuc29yRm9ybWF0LFxuICAgIE9wdGlvbnNUZW5zb3JMYXlvdXQsXG4gICAgT3B0aW9uc1RlbnNvckRhdGFUeXBlLFxuICAgIE9wdGlvbnNOb3JtYWxpemF0aW9uUGFyYW1ldGVycyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlbnNvckZyb21VcmxPcHRpb25zXG4gIGV4dGVuZHMgT3B0aW9uc0RpbWVuc2lvbnMsXG4gICAgT3B0aW9uUmVzaXplZERpbWVuc2lvbnMsXG4gICAgT3B0aW9uc1RlbnNvckZvcm1hdCxcbiAgICBPcHRpb25zVGVuc29yTGF5b3V0LFxuICAgIE9wdGlvbnNUZW5zb3JEYXRhVHlwZSxcbiAgICBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMge31cblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JGcm9tSW1hZ2VCaXRtYXBPcHRpb25zXG4gIGV4dGVuZHMgT3B0aW9uUmVzaXplZERpbWVuc2lvbnMsXG4gICAgT3B0aW9uc1RlbnNvckZvcm1hdCxcbiAgICBPcHRpb25zVGVuc29yTGF5b3V0LFxuICAgIE9wdGlvbnNUZW5zb3JEYXRhVHlwZSxcbiAgICBPcHRpb25zTm9ybWFsaXphdGlvblBhcmFtZXRlcnMge31cblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JGcm9tVGV4dHVyZU9wdGlvbnM8VCBleHRlbmRzIFRlbnNvci5UZXh0dXJlRGF0YVR5cGVzPlxuICBleHRlbmRzIFJlcXVpcmVkPE9wdGlvbnNEaW1lbnNpb25zPixcbiAgICBPcHRpb25zRm9ybWF0LFxuICAgIEdwdVJlc291cmNlQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+IC8qIFRPRE86IGFkZCBtb3JlICovIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yRnJvbUdwdUJ1ZmZlck9wdGlvbnM8VCBleHRlbmRzIFRlbnNvci5HcHVCdWZmZXJEYXRhVHlwZXM+XG4gIGV4dGVuZHMgUGljazxUZW5zb3IsICdkaW1zJz4sXG4gICAgR3B1UmVzb3VyY2VDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4ge1xuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSBkYXRhIHR5cGUgb2YgdGhlIHRlbnNvci5cbiAgICovXG4gIGRhdGFUeXBlPzogVDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JGcm9tTUxUZW5zb3JPcHRpb25zPFQgZXh0ZW5kcyBUZW5zb3IuTUxUZW5zb3JEYXRhVHlwZXM+XG4gIGV4dGVuZHMgUGljazxUZW5zb3IsICdkaW1zJz4sXG4gICAgR3B1UmVzb3VyY2VDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD4ge1xuICAvKipcbiAgICogRGVzY3JpYmVzIHRoZSBkYXRhIHR5cGUgb2YgdGhlIHRlbnNvci5cbiAgICovXG4gIGRhdGFUeXBlPzogVDtcbn1cblxuLy8gI2VuZHJlZ2lvblxuXG4vKipcbiAqIHR5cGUgVGVuc29yRmFjdG9yeSBkZWZpbmVzIHRoZSBmYWN0b3J5IGZ1bmN0aW9ucyBvZiAnVGVuc29yJyB0byBjcmVhdGUgdGVuc29yIGluc3RhbmNlcyBmcm9tIGV4aXN0aW5nIGRhdGEgb3JcbiAqIHJlc291cmNlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZW5zb3JGYWN0b3J5IHtcbiAgLyoqXG4gICAqIGNyZWF0ZSBhIHRlbnNvciBmcm9tIGFuIEltYWdlRGF0YSBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtIGltYWdlRGF0YSAtIHRoZSBJbWFnZURhdGEgb2JqZWN0IHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGVuc29yIGZyb20gSW1hZ2VEYXRhLlxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGRlZmF1bHQgc2V0dGluZ3Mgd2lsbCBiZSBhcHBsaWVkOlxuICAgKiAtIGB0ZW5zb3JGb3JtYXRgOiBgJ1JHQidgXG4gICAqIC0gYHRlbnNvckxheW91dGA6IGAnTkNIVydgXG4gICAqIC0gYGRhdGFUeXBlYDogYCdmbG9hdDMyJ2BcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSB0ZW5zb3Igb2JqZWN0XG4gICAqL1xuICBmcm9tSW1hZ2UoXG4gICAgaW1hZ2VEYXRhOiBJbWFnZURhdGEsXG4gICAgb3B0aW9ucz86IFRlbnNvckZyb21JbWFnZURhdGFPcHRpb25zLFxuICApOiBQcm9taXNlPFR5cGVkVGVuc29yPCdmbG9hdDMyJz4gfCBUeXBlZFRlbnNvcjwndWludDgnPj47XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIHRlbnNvciBmcm9tIGEgSFRNTEltYWdlRWxlbWVudCBvYmplY3RcbiAgICpcbiAgICogQHBhcmFtIGltYWdlRWxlbWVudCAtIHRoZSBIVE1MSW1hZ2VFbGVtZW50IG9iamVjdCB0byBjcmVhdGUgdGVuc29yIGZyb21cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRlbnNvciBmcm9tIEhUTUxJbWFnZUVsZW1lbnQuXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZGVmYXVsdCBzZXR0aW5ncyB3aWxsIGJlIGFwcGxpZWQ6XG4gICAqIC0gYHRlbnNvckZvcm1hdGA6IGAnUkdCJ2BcbiAgICogLSBgdGVuc29yTGF5b3V0YDogYCdOQ0hXJ2BcbiAgICogLSBgZGF0YVR5cGVgOiBgJ2Zsb2F0MzInYFxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHRlbnNvciBvYmplY3RcbiAgICovXG4gIGZyb21JbWFnZShcbiAgICBpbWFnZUVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgb3B0aW9ucz86IFRlbnNvckZyb21JbWFnZUVsZW1lbnRPcHRpb25zLFxuICApOiBQcm9taXNlPFR5cGVkVGVuc29yPCdmbG9hdDMyJz4gfCBUeXBlZFRlbnNvcjwndWludDgnPj47XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIHRlbnNvciBmcm9tIFVSTFxuICAgKlxuICAgKiBAcGFyYW0gdXJsU291cmNlIC0gYSBzdHJpbmcgYXMgYSBVUkwgdG8gdGhlIGltYWdlIG9yIGEgZGF0YSBVUkwgY29udGFpbmluZyB0aGUgaW1hZ2UgZGF0YS5cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRlbnNvciBmcm9tIFVSTC5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBkZWZhdWx0IHNldHRpbmdzIHdpbGwgYmUgYXBwbGllZDpcbiAgICogLSBgdGVuc29yRm9ybWF0YDogYCdSR0InYFxuICAgKiAtIGB0ZW5zb3JMYXlvdXRgOiBgJ05DSFcnYFxuICAgKiAtIGBkYXRhVHlwZWA6IGAnZmxvYXQzMidgXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbUltYWdlKHVybFNvdXJjZTogc3RyaW5nLCBvcHRpb25zPzogVGVuc29yRnJvbVVybE9wdGlvbnMpOiBQcm9taXNlPFR5cGVkVGVuc29yPCdmbG9hdDMyJz4gfCBUeXBlZFRlbnNvcjwndWludDgnPj47XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIHRlbnNvciBmcm9tIGFuIEltYWdlQml0bWFwIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gYml0bWFwIC0gdGhlIEltYWdlQml0bWFwIG9iamVjdCB0byBjcmVhdGUgdGVuc29yIGZyb21cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRlbnNvciBmcm9tIFVSTC5cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBkZWZhdWx0IHNldHRpbmdzIHdpbGwgYmUgYXBwbGllZDpcbiAgICogLSBgdGVuc29yRm9ybWF0YDogYCdSR0InYFxuICAgKiAtIGB0ZW5zb3JMYXlvdXRgOiBgJ05DSFcnYFxuICAgKiAtIGBkYXRhVHlwZWA6IGAnZmxvYXQzMidgXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbUltYWdlKFxuICAgIGJpdG1hcDogSW1hZ2VCaXRtYXAsXG4gICAgb3B0aW9uczogVGVuc29yRnJvbUltYWdlQml0bWFwT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxUeXBlZFRlbnNvcjwnZmxvYXQzMic+IHwgVHlwZWRUZW5zb3I8J3VpbnQ4Jz4+O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhIFdlYkdMIHRleHR1cmVcbiAgICpcbiAgICogQHBhcmFtIHRleHR1cmUgLSB0aGUgV2ViR0xUZXh0dXJlIG9iamVjdCB0byBjcmVhdGUgdGVuc29yIGZyb21cbiAgICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25hbCBvYmplY3QgcmVwcmVzZW50aW5nIG9wdGlvbnMgZm9yIGNyZWF0aW5nIHRlbnNvciBmcm9tIFdlYkdMIHRleHR1cmUuXG4gICAqXG4gICAqIFRoZSBvcHRpb25zIGluY2x1ZGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gYHdpZHRoYDogdGhlIHdpZHRoIG9mIHRoZSB0ZXh0dXJlLiBSZXF1aXJlZC5cbiAgICogLSBgaGVpZ2h0YDogdGhlIGhlaWdodCBvZiB0aGUgdGV4dHVyZS4gUmVxdWlyZWQuXG4gICAqIC0gYGZvcm1hdGA6IHRoZSBmb3JtYXQgb2YgdGhlIHRleHR1cmUuIElmIG9taXR0ZWQsIGFzc3VtZSAnUkdCQScuXG4gICAqIC0gYGRvd25sb2FkYDogYW4gb3B0aW9uYWwgZnVuY3Rpb24gdG8gZG93bmxvYWQgdGhlIHRlbnNvciBkYXRhIGZyb20gR1BVIHRvIENQVS4gSWYgb21pdHRlZCwgdGhlIEdQVSBkYXRhXG4gICAqIHdpbGwgbm90IGJlIGFibGUgdG8gZG93bmxvYWQuIFVzdWFsbHksIHRoaXMgaXMgcHJvdmlkZWQgYnkgYSBHUFUgYmFja2VuZCBmb3IgdGhlIGluZmVyZW5jZSBvdXRwdXRzLiBVc2VycyBkb24ndFxuICAgKiBuZWVkIHRvIHByb3ZpZGUgdGhpcyBmdW5jdGlvbi5cbiAgICogLSBgZGlzcG9zZWA6IGFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGRpc3Bvc2UgdGhlIHRlbnNvciBkYXRhIG9uIEdQVS4gSWYgb21pdHRlZCwgdGhlIEdQVSBkYXRhIHdpbGwgbm90IGJlIGRpc3Bvc2VkLlxuICAgKiBVc3VhbGx5LCB0aGlzIGlzIHByb3ZpZGVkIGJ5IGEgR1BVIGJhY2tlbmQgZm9yIHRoZSBpbmZlcmVuY2Ugb3V0cHV0cy4gVXNlcnMgZG9uJ3QgbmVlZCB0byBwcm92aWRlIHRoaXMgZnVuY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbVRleHR1cmU8VCBleHRlbmRzIFRlbnNvci5UZXh0dXJlRGF0YVR5cGVzID0gJ2Zsb2F0MzInPihcbiAgICB0ZXh0dXJlOiBUZW5zb3IuVGV4dHVyZVR5cGUsXG4gICAgb3B0aW9uczogVGVuc29yRnJvbVRleHR1cmVPcHRpb25zPFQ+LFxuICApOiBUeXBlZFRlbnNvcjwnZmxvYXQzMic+O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhIFdlYkdQVSBidWZmZXJcbiAgICpcbiAgICogQHBhcmFtIGJ1ZmZlciAtIHRoZSBHUFVCdWZmZXIgb2JqZWN0IHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGVuc29yIGZyb20gV2ViR1BVIGJ1ZmZlci5cbiAgICpcbiAgICogVGhlIG9wdGlvbnMgaW5jbHVkZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgZGF0YVR5cGVgOiB0aGUgZGF0YSB0eXBlIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGFzc3VtZSAnZmxvYXQzMicuXG4gICAqIC0gYGRpbXNgOiB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIFJlcXVpcmVkLlxuICAgKiAtIGBkb3dubG9hZGA6IGFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGRvd25sb2FkIHRoZSB0ZW5zb3IgZGF0YSBmcm9tIEdQVSB0byBDUFUuIElmIG9taXR0ZWQsIHRoZSBHUFUgZGF0YVxuICAgKiB3aWxsIG5vdCBiZSBhYmxlIHRvIGRvd25sb2FkLiBVc3VhbGx5LCB0aGlzIGlzIHByb3ZpZGVkIGJ5IGEgR1BVIGJhY2tlbmQgZm9yIHRoZSBpbmZlcmVuY2Ugb3V0cHV0cy4gVXNlcnMgZG9uJ3RcbiAgICogbmVlZCB0byBwcm92aWRlIHRoaXMgZnVuY3Rpb24uXG4gICAqIC0gYGRpc3Bvc2VgOiBhbiBvcHRpb25hbCBmdW5jdGlvbiB0byBkaXNwb3NlIHRoZSB0ZW5zb3IgZGF0YSBvbiBHUFUuIElmIG9taXR0ZWQsIHRoZSBHUFUgZGF0YSB3aWxsIG5vdCBiZSBkaXNwb3NlZC5cbiAgICogVXN1YWxseSwgdGhpcyBpcyBwcm92aWRlZCBieSBhIEdQVSBiYWNrZW5kIGZvciB0aGUgaW5mZXJlbmNlIG91dHB1dHMuIFVzZXJzIGRvbid0IG5lZWQgdG8gcHJvdmlkZSB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIHRlbnNvciBvYmplY3RcbiAgICovXG4gIGZyb21HcHVCdWZmZXI8VCBleHRlbmRzIFRlbnNvci5HcHVCdWZmZXJEYXRhVHlwZXM+KFxuICAgIGJ1ZmZlcjogVGVuc29yLkdwdUJ1ZmZlclR5cGUsXG4gICAgb3B0aW9uczogVGVuc29yRnJvbUdwdUJ1ZmZlck9wdGlvbnM8VD4sXG4gICk6IFR5cGVkVGVuc29yPFQ+O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhIFdlYk5OIE1MVGVuc29yXG4gICAqXG4gICAqIEBwYXJhbSB0ZW5zb3IgLSB0aGUgTUxUZW5zb3Igb2JqZWN0IHRvIGNyZWF0ZSB0ZW5zb3IgZnJvbVxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIEFuIG9wdGlvbmFsIG9iamVjdCByZXByZXNlbnRpbmcgb3B0aW9ucyBmb3IgY3JlYXRpbmcgdGVuc29yIGZyb20gYSBXZWJOTiBNTFRlbnNvci5cbiAgICpcbiAgICogVGhlIG9wdGlvbnMgaW5jbHVkZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBgZGF0YVR5cGVgOiB0aGUgZGF0YSB0eXBlIG9mIHRoZSB0ZW5zb3IuIElmIG9taXR0ZWQsIGFzc3VtZSAnZmxvYXQzMicuXG4gICAqIC0gYGRpbXNgOiB0aGUgZGltZW5zaW9uIG9mIHRoZSB0ZW5zb3IuIFJlcXVpcmVkLlxuICAgKiAtIGBkb3dubG9hZGA6IGFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGRvd25sb2FkIHRoZSB0ZW5zb3IgZGF0YSBmcm9tIHRoZSBNTFRlbnNvciB0byBDUFUuIElmIG9taXR0ZWQsIHRoZSBNTFRlbnNvclxuICAgKiBkYXRhIHdpbGwgbm90IGJlIGFibGUgdG8gZG93bmxvYWQuIFVzdWFsbHksIHRoaXMgaXMgcHJvdmlkZWQgYnkgdGhlIFdlYk5OIGJhY2tlbmQgZm9yIHRoZSBpbmZlcmVuY2Ugb3V0cHV0cy5cbiAgICogVXNlcnMgZG9uJ3QgbmVlZCB0byBwcm92aWRlIHRoaXMgZnVuY3Rpb24uXG4gICAqIC0gYGRpc3Bvc2VgOiBhbiBvcHRpb25hbCBmdW5jdGlvbiB0byBkaXNwb3NlIHRoZSB0ZW5zb3IgZGF0YSBvbiB0aGUgV2ViTk4gTUxUZW5zb3IuIElmIG9taXR0ZWQsIHRoZSBNTFRlbnNvciB3aWxsXG4gICAqIG5vdCBiZSBkaXNwb3NlZC4gVXN1YWxseSwgdGhpcyBpcyBwcm92aWRlZCBieSB0aGUgV2ViTk4gYmFja2VuZCBmb3IgdGhlIGluZmVyZW5jZSBvdXRwdXRzLiBVc2VycyBkb24ndCBuZWVkIHRvXG4gICAqIHByb3ZpZGUgdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgYSB0ZW5zb3Igb2JqZWN0XG4gICAqL1xuICBmcm9tTUxUZW5zb3I8VCBleHRlbmRzIFRlbnNvci5NTFRlbnNvckRhdGFUeXBlcz4oXG4gICAgdGVuc29yOiBUZW5zb3IuTUxUZW5zb3JUeXBlLFxuICAgIG9wdGlvbnM6IFRlbnNvckZyb21NTFRlbnNvck9wdGlvbnM8VD4sXG4gICk6IFR5cGVkVGVuc29yPFQ+O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSB0ZW5zb3IgZnJvbSBhIHByZS1hbGxvY2F0ZWQgYnVmZmVyLiBUaGUgYnVmZmVyIHdpbGwgYmUgdXNlZCBhcyBhIHBpbm5lZCBidWZmZXIuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlIC0gdGhlIHRlbnNvciBlbGVtZW50IHR5cGUuXG4gICAqIEBwYXJhbSBidWZmZXIgLSBhIFR5cGVkQXJyYXkgY29ycmVzcG9uZGluZyB0byB0aGUgdHlwZS5cbiAgICogQHBhcmFtIGRpbXMgLSBzcGVjaWZ5IHRoZSBkaW1lbnNpb24gb2YgdGhlIHRlbnNvci4gSWYgb21pdHRlZCwgYSAxLUQgdGVuc29yIGlzIGFzc3VtZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgdGVuc29yIG9iamVjdFxuICAgKi9cbiAgZnJvbVBpbm5lZEJ1ZmZlcjxUIGV4dGVuZHMgRXhjbHVkZTxUZW5zb3IuVHlwZSwgJ3N0cmluZyc+PihcbiAgICB0eXBlOiBULFxuICAgIGJ1ZmZlcjogVGVuc29yLkRhdGFUeXBlTWFwW1RdLFxuICAgIGRpbXM/OiByZWFkb25seSBudW1iZXJbXSxcbiAgKTogVHlwZWRUZW5zb3I8VD47XG59XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbi8qKlxuICogQSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIGEgZmlsZSdzIFVSTCBvciBwYXRoLlxuICpcbiAqIFBhdGggaXMgdmFpbGFibGUgb25seSBpbiBvbm54cnVudGltZS1ub2RlIG9yIG9ubnhydW50aW1lLXdlYiBydW5uaW5nIGluIE5vZGUuanMuXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVVcmxPclBhdGggPSBzdHJpbmc7XG5cbi8qKlxuICogQSBCbG9iIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgYSBmaWxlLlxuICovXG5leHBvcnQgdHlwZSBGaWxlQmxvYiA9IEJsb2I7XG5cbi8qKlxuICogQSBVaW50OEFycmF5LCBBcnJheUJ1ZmZlciBvciBTaGFyZWRBcnJheUJ1ZmZlciBvYmplY3QgdGhhdCByZXByZXNlbnRzIGEgZmlsZSBjb250ZW50LlxuICpcbiAqIFdoZW4gaXQgaXMgYW4gQXJyYXlCdWZmZXIgb3IgU2hhcmVkQXJyYXlCdWZmZXIsIHRoZSB3aG9sZSBidWZmZXIgaXMgYXNzdW1lZCB0byBiZSB0aGUgZmlsZSBjb250ZW50LlxuICovXG5leHBvcnQgdHlwZSBGaWxlRGF0YSA9IFVpbnQ4QXJyYXkgfCBBcnJheUJ1ZmZlckxpa2U7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGZpbGUgdGhhdCBjYW4gYmUgbG9hZGVkIGJ5IHRoZSBPTk5YIFJ1bnRpbWUgSmF2YVNjcmlwdCBBUEkuXG4gKi9cbmV4cG9ydCB0eXBlIEZpbGVUeXBlID0gRmlsZVVybE9yUGF0aCB8IEZpbGVCbG9iIHwgRmlsZURhdGE7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBleHRlcm5hbCBkYXRhIGZpbGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZXJuYWxEYXRhRmlsZURlc2NyaXB0aW9uIHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIGV4dGVybmFsIGRhdGEgZmlsZS5cbiAgICovXG4gIGRhdGE6IEZpbGVUeXBlO1xuICAvKipcbiAgICogU3BlY2lmeSB0aGUgZmlsZSBwYXRoLlxuICAgKi9cbiAgcGF0aDogc3RyaW5nO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gZXh0ZXJuYWwgZGF0YSBmaWxlLlxuICpcbiAqIFdoZW4gdXNpbmcgYSBzdHJpbmcsIGl0IHNob3VsZCBiZSBhIGZpbGUgVVJMIG9yIHBhdGggdGhhdCBpbiB0aGUgc2FtZSBkaXJlY3RvcnkgYXMgdGhlIG1vZGVsIGZpbGUuXG4gKi9cbmV4cG9ydCB0eXBlIEV4dGVybmFsRGF0YUZpbGVUeXBlID0gRXh0ZXJuYWxEYXRhRmlsZURlc2NyaXB0aW9uIHwgRmlsZVVybE9yUGF0aDtcblxuLyoqXG4gKiBPcHRpb25zIGZvciBtb2RlbCBsb2FkaW5nLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9ubnhNb2RlbE9wdGlvbnMge1xuICAvKipcbiAgICogU3BlY2lmeWluZyBhIGxpc3Qgb2YgZmlsZXMgdGhhdCByZXByZXNlbnRzIHRoZSBleHRlcm5hbCBkYXRhLlxuICAgKi9cbiAgZXh0ZXJuYWxEYXRhPzogcmVhZG9ubHkgRXh0ZXJuYWxEYXRhRmlsZVR5cGVbXTtcbn1cbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHsgVGVuc29yIH0gZnJvbSAnLi90ZW5zb3IuanMnO1xuXG5leHBvcnQgdHlwZSBOb25UZW5zb3JUeXBlID0gbmV2ZXI7XG5cbi8qKlxuICogVHlwZSBPbm54VmFsdWUgUmVwcmVzZW50cyBib3RoIHRlbnNvcnMgYW5kIG5vbi10ZW5zb3JzIHZhbHVlIGZvciBtb2RlbCdzIGlucHV0cy9vdXRwdXRzLlxuICpcbiAqIE5PVEU6IGN1cnJlbnRseSBub3Qgc3VwcG9ydCBub24tdGVuc29yXG4gKi9cbmV4cG9ydCB0eXBlIE9ubnhWYWx1ZSA9IFRlbnNvciB8IE5vblRlbnNvclR5cGU7XG5cbi8qKlxuICogVHlwZSBPbm54VmFsdWVEYXRhTG9jYXRpb24gcmVwcmVzZW50cyB0aGUgbG9jYXRpb24gb2YgdGhlIGRhdGEgb2YgYW4gT25ueFZhbHVlLlxuICovXG5leHBvcnQgdHlwZSBPbm54VmFsdWVEYXRhTG9jYXRpb24gPSBUZW5zb3IuRGF0YUxvY2F0aW9uO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG4vKipcbiAqICMgT05OWCBSdW50aW1lIEphdmFTY3JpcHQgQVBJXG4gKlxuICogT05OWCBSdW50aW1lIEphdmFTY3JpcHQgQVBJIGlzIGEgdW5pZmllZCBBUEkgZm9yIGFsbCBKYXZhU2NyaXB0IHVzYWdlcywgaW5jbHVkaW5nIHRoZSBmb2xsb3dpbmcgTlBNIHBhY2thZ2VzOlxuICpcbiAqIC0gW29ubnhydW50aW1lLW5vZGVdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL29ubnhydW50aW1lLW5vZGUpXG4gKiAtIFtvbm54cnVudGltZS13ZWJdKGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL29ubnhydW50aW1lLXdlYilcbiAqIC0gW29ubnhydW50aW1lLXJlYWN0LW5hdGl2ZV0oaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvb25ueHJ1bnRpbWUtcmVhY3QtbmF0aXZlKVxuICpcbiAqIFNlZSBhbHNvOlxuICogLSBbR2V0IFN0YXJ0ZWRdKGh0dHBzOi8vb25ueHJ1bnRpbWUuYWkvZG9jcy9nZXQtc3RhcnRlZC93aXRoLWphdmFzY3JpcHQvKVxuICogLSBbSW5mZXJlbmNlIGV4YW1wbGVzXShodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L29ubnhydW50aW1lLWluZmVyZW5jZS1leGFtcGxlcy90cmVlL21haW4vanMpXG4gKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9iYWNrZW5kLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZW52LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vaW5mZXJlbmNlLXNlc3Npb24uanMnO1xuZXhwb3J0ICogZnJvbSAnLi90ZW5zb3IuanMnO1xuZXhwb3J0ICogZnJvbSAnLi90ZW5zb3ItY29udmVyc2lvbi5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3RlbnNvci1mYWN0b3J5LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vdHJhY2UuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9vbm54LW1vZGVsLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vb25ueC12YWx1ZS5qcyc7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmV4cG9ydCBjb25zdCBpc05vZGUgPSAhISh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUpO1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBsaWI9XCJ3ZWJ3b3JrZXJcIiAvPlxuXG4vL1xuLy8gKiB0eXBlIGhhY2sgZm9yIFwiSFRNTEltYWdlRWxlbWVudFwiXG4vL1xuLy8gaW4gdHlwZXNjcmlwdCwgdGhlIHR5cGUgb2YgXCJIVE1MSW1hZ2VFbGVtZW50XCIgaXMgZGVmaW5lZCBpbiBsaWIuZG9tLmQudHMsIHdoaWNoIGlzIGNvbmZsaWN0IHdpdGggbGliLndlYndvcmtlci5kLnRzLlxuLy8gd2hlbiB3ZSB1c2Ugd2Vid29ya2VyLCB0aGUgbGliLndlYndvcmtlci5kLnRzIHdpbGwgYmUgdXNlZCwgd2hpY2ggZG9lcyBub3QgaGF2ZSBIVE1MSW1hZ2VFbGVtZW50IGRlZmluZWQuXG4vL1xuLy8gd2Ugd2lsbCBnZXQgdGhlIGZvbGxvd2luZyBlcnJvcnMgY29tcGxhaW5pbmcgdGhhdCBIVE1MSW1hZ2VFbGVtZW50IGlzIG5vdCBkZWZpbmVkOlxuLy9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gLi4vY29tbW9uL2Rpc3QvY2pzL3RlbnNvci1mYWN0b3J5LmQudHM6MTg3OjI5IC0gZXJyb3IgVFMyNTUyOiBDYW5ub3QgZmluZCBuYW1lICdIVE1MSW1hZ2VFbGVtZW50Jy4gRGlkIHlvdSBtZWFuXG4vLyAnSFRNTExJRWxlbWVudCc/XG4vL1xuLy8gMTg3ICAgICBmcm9tSW1hZ2UoaW1hZ2VFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50LCBvcHRpb25zPzogVGVuc29yRnJvbUltYWdlRWxlbWVudE9wdGlvbnMpOlxuLy8gUHJvbWlzZTxUeXBlZFRlbnNvcjwnZmxvYXQzMic+IHwgVHlwZWRUZW5zb3I8J3VpbnQ4Jz4+O1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB+fn5+fn5+fn5+fn5+fn5+XG4vL1xuLy8gbm9kZV9tb2R1bGVzL0B3ZWJncHUvdHlwZXMvZGlzdC9pbmRleC5kLnRzOjgzOjcgLSBlcnJvciBUUzI1NTI6IENhbm5vdCBmaW5kIG5hbWUgJ0hUTUxJbWFnZUVsZW1lbnQnLiBEaWQgeW91IG1lYW5cbi8vICdIVE1MTElFbGVtZW50Jz9cbi8vXG4vLyA4MyAgICAgfCBIVE1MSW1hZ2VFbGVtZW50XG4vLyAgICAgICAgICB+fn5+fn5+fn5+fn5+fn5+XG4vL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBgSFRNTEltYWdlRWxlbWVudGAgaXMgb25seSB1c2VkIGluIHR5cGUgZGVjbGFyYXRpb24gYW5kIG5vdCBpbiByZWFsIGNvZGUuIFNvIHdlIGRlZmluZSBpdCBhcyBgdW5rbm93bmAgaGVyZSB0b1xuLy8gYnlwYXNzIHRoZSB0eXBlIGNoZWNrLlxuXG4vL1xuLy8gKiB0eXBlIGhhY2sgZm9yIFwiZG9jdW1lbnRcIlxuLy9cbi8vIGluIHR5cGVzY3JpcHQsIHRoZSB0eXBlIG9mIFwiZG9jdW1lbnRcIiBpcyBkZWZpbmVkIGluIGxpYi5kb20uZC50cywgc28gaXQncyBub3QgYXZhaWxhYmxlIGluIHdlYndvcmtlci5cbi8vXG4vLyB3ZSB3aWxsIGdldCB0aGUgZm9sbG93aW5nIGVycm9ycyBjb21wbGFpbmluZyB0aGF0IGRvY3VtZW50IGlzIG5vdCBkZWZpbmVkOlxuLy9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL1xuLy8gbGliL3dhc20vd2FzbS11dGlscy1pbXBvcnQudHM6NzozMyAtIGVycm9yIFRTMjU4NDogQ2Fubm90IGZpbmQgbmFtZSAnZG9jdW1lbnQnLiBEbyB5b3UgbmVlZCB0byBjaGFuZ2UgeW91ciB0YXJnZXRcbi8vIGxpYnJhcnk/IFRyeSBjaGFuZ2luZyB0aGUgJ2xpYicgY29tcGlsZXIgb3B0aW9uIHRvIGluY2x1ZGUgJ2RvbScuXG4vL1xuLy8gNyBleHBvcnQgY29uc3Qgc2NyaXB0U3JjID0gdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IChkb2N1bWVudD8uY3VycmVudFNjcmlwdCBhcyBIVE1MU2NyaXB0RWxlbWVudCk/LnNyYyA6XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfn5+fn5+fn5cbi8vXG4vLyBsaWIvd2FzbS93YXNtLXV0aWxzLWltcG9ydC50czo3OjYxIC0gZXJyb3IgVFMyNTg0OiBDYW5ub3QgZmluZCBuYW1lICdkb2N1bWVudCcuIERvIHlvdSBuZWVkIHRvIGNoYW5nZSB5b3VyIHRhcmdldFxuLy8gbGlicmFyeT8gVHJ5IGNoYW5naW5nIHRoZSAnbGliJyBjb21waWxlciBvcHRpb24gdG8gaW5jbHVkZSAnZG9tJy5cbi8vXG4vLyA3IGV4cG9ydCBjb25zdCBzY3JpcHRTcmMgPSB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gKGRvY3VtZW50Py5jdXJyZW50U2NyaXB0IGFzIEhUTUxTY3JpcHRFbGVtZW50KT8uc3JjIDpcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfn5+fn5+fn5cbi8vXG4vLyBsaWIvd2FzbS93YXNtLXV0aWxzLWltcG9ydC50czo3Ojg4IC0gZXJyb3IgVFMyNTUyOiBDYW5ub3QgZmluZCBuYW1lICdIVE1MU2NyaXB0RWxlbWVudCcuIERpZCB5b3UgbWVhblxuLy8gJ0hUTUxMSUVsZW1lbnQnP1xuLy9cbi8vIDcgZXhwb3J0IGNvbnN0IHNjcmlwdFNyYyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyAoZG9jdW1lbnQ/LmN1cnJlbnRTY3JpcHQgYXMgSFRNTFNjcmlwdEVsZW1lbnQpPy5zcmMgOlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB+fn5+fn5+fn5+fn5+fn5+flxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vXG4vLyBgZG9jdW1lbnRgIGlzIHVzZWQgdG8gZ2V0IHRoZSBjdXJyZW50IHNjcmlwdCBVUkwsIHdoaWNoIGlzIG5vdCBhdmFpbGFibGUgaW4gd2Vid29ya2VyLiBUaGlzIGZpbGUgaXMgc2VydmVkIGFzIGFcbi8vIFwiZHVhbFwiIGZpbGUgZm9yIGVudHJpZXMgb2YgYm90aCB3ZWJ3b3JrZXIgYW5kIHRoZSBlc20gbW9kdWxlLlxuLy9cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgdHlwZSBIVE1MSW1hZ2VFbGVtZW50ID0gdW5rbm93bjtcbiAgdHlwZSBIVE1MU2NyaXB0RWxlbWVudCA9IHsgc3JjPzogc3RyaW5nIH07XG4gIGNvbnN0IGRvY3VtZW50OiB1bmRlZmluZWQgfCB7IGN1cnJlbnRTY3JpcHQ/OiBIVE1MU2NyaXB0RWxlbWVudCB9O1xufVxuXG4vKipcbiAqIEBzdW1tYXJ5XG4gKlxuICogVGhpcyBmaWxlIGlzIHNlcnZlZCBhcyBhIFwiZHVhbFwiIGZpbGUgZm9yIGJvdGggZW50cmllcyBvZiB0aGUgZm9sbG93aW5nOlxuICogLSBUaGUgcHJveHkgd29ya2VyIGl0c2VsZi5cbiAqICAgLSBXaGVuIHVzZWQgYXMgYSB3b3JrZXIsIGl0IGxpc3RlbnMgdG8gdGhlIG1lc3NhZ2VzIGZyb20gdGhlIG1haW4gdGhyZWFkIGFuZCBwZXJmb3JtcyB0aGUgY29ycmVzcG9uZGluZyBvcGVyYXRpb25zLlxuICogICAtIFNob3VsZCBiZSBpbXBvcnRlZCBkaXJlY3RseSB1c2luZyBgbmV3IFdvcmtlcigpYCBpbiB0aGUgbWFpbiB0aHJlYWQuXG4gKlxuICogLSBUaGUgRVNNIG1vZHVsZSB0aGF0IGNyZWF0ZXMgdGhlIHByb3h5IHdvcmtlciAoYXMgYSB3b3JrZXIgbGF1bmNoZXIpLlxuICogICAtIFdoZW4gdXNlZCBhcyBhIHdvcmtlciBsYXVuY2hlciwgaXQgY3JlYXRlcyB0aGUgcHJveHkgd29ya2VyIGFuZCByZXR1cm5zIGl0LlxuICogICAtIFNob3VsZCBiZSBpbXBvcnRlZCB1c2luZyBgaW1wb3J0KClgIGluIHRoZSBtYWluIHRocmVhZCwgd2l0aCB0aGUgcXVlcnkgcGFyYW1ldGVyIGBpbXBvcnQ9MWAuXG4gKlxuICogVGhpcyBmaWxlIHdpbGwgYmUgYWx3YXlzIGNvbXBpbGluZyBpbnRvIEVTTSBmb3JtYXQuXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBPcnRXYXNtTWVzc2FnZSwgU2VyaWFsaXphYmxlVGVuc29yTWV0YWRhdGEgfSBmcm9tICcuLi9wcm94eS1tZXNzYWdlcy5qcyc7XG5pbXBvcnQge1xuICBjcmVhdGVTZXNzaW9uLFxuICBjb3B5RnJvbUV4dGVybmFsQnVmZmVyLFxuICBlbmRQcm9maWxpbmcsXG4gIGV4dHJhY3RUcmFuc2ZlcmFibGVCdWZmZXJzLFxuICBpbml0RXAsXG4gIGluaXRSdW50aW1lLFxuICByZWxlYXNlU2Vzc2lvbixcbiAgcnVuLFxufSBmcm9tICcuLi93YXNtLWNvcmUtaW1wbC5qcyc7XG5pbXBvcnQgeyBpbml0aWFsaXplV2ViQXNzZW1ibHkgfSBmcm9tICcuLi93YXNtLWZhY3RvcnkuanMnO1xuaW1wb3J0IHsgc2NyaXB0U3JjIH0gZnJvbSAnLi4vd2FzbS11dGlscy1pbXBvcnQuanMnO1xuXG5jb25zdCBXT1JLRVJfTkFNRSA9ICdvcnQtd2FzbS1wcm94eS13b3JrZXInO1xuY29uc3QgaXNQcm94eVdvcmtlciA9IGdsb2JhbFRoaXMuc2VsZj8ubmFtZSA9PT0gV09SS0VSX05BTUU7XG5cbmlmIChpc1Byb3h5V29ya2VyKSB7XG4gIC8vIFdvcmtlciB0aHJlYWRcbiAgc2VsZi5vbm1lc3NhZ2UgPSAoZXY6IE1lc3NhZ2VFdmVudDxPcnRXYXNtTWVzc2FnZT4pOiB2b2lkID0+IHtcbiAgICBjb25zdCB7IHR5cGUsIGluOiBtZXNzYWdlIH0gPSBldi5kYXRhO1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnaW5pdC13YXNtJzpcbiAgICAgICAgICBpbml0aWFsaXplV2ViQXNzZW1ibHkobWVzc2FnZSEud2FzbSkudGhlbihcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgaW5pdFJ1bnRpbWUobWVzc2FnZSEpLnRoZW4oXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlLCBlcnIgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsgdHlwZSwgZXJyIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbml0LWVwJzoge1xuICAgICAgICAgIGNvbnN0IHsgZXBOYW1lLCBlbnYgfSA9IG1lc3NhZ2UhO1xuICAgICAgICAgIGluaXRFcChlbnYsIGVwTmFtZSkudGhlbihcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlLCBlcnIgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnY29weS1mcm9tJzoge1xuICAgICAgICAgIGNvbnN0IHsgYnVmZmVyIH0gPSBtZXNzYWdlITtcbiAgICAgICAgICBjb25zdCBidWZmZXJEYXRhID0gY29weUZyb21FeHRlcm5hbEJ1ZmZlcihidWZmZXIpO1xuICAgICAgICAgIHBvc3RNZXNzYWdlKHsgdHlwZSwgb3V0OiBidWZmZXJEYXRhIH0gYXMgT3J0V2FzbU1lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2NyZWF0ZSc6IHtcbiAgICAgICAgICBjb25zdCB7IG1vZGVsLCBvcHRpb25zIH0gPSBtZXNzYWdlITtcbiAgICAgICAgICBjcmVhdGVTZXNzaW9uKG1vZGVsLCBvcHRpb25zKS50aGVuKFxuICAgICAgICAgICAgKHNlc3Npb25NZXRhZGF0YSkgPT4ge1xuICAgICAgICAgICAgICBwb3N0TWVzc2FnZSh7IHR5cGUsIG91dDogc2Vzc2lvbk1ldGFkYXRhIH0gYXMgT3J0V2FzbU1lc3NhZ2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlLCBlcnIgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAncmVsZWFzZSc6XG4gICAgICAgICAgcmVsZWFzZVNlc3Npb24obWVzc2FnZSEpO1xuICAgICAgICAgIHBvc3RNZXNzYWdlKHsgdHlwZSB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncnVuJzoge1xuICAgICAgICAgIGNvbnN0IHsgc2Vzc2lvbklkLCBpbnB1dEluZGljZXMsIGlucHV0cywgb3V0cHV0SW5kaWNlcywgb3B0aW9ucyB9ID0gbWVzc2FnZSE7XG4gICAgICAgICAgcnVuKHNlc3Npb25JZCwgaW5wdXRJbmRpY2VzLCBpbnB1dHMsIG91dHB1dEluZGljZXMsIG5ldyBBcnJheShvdXRwdXRJbmRpY2VzLmxlbmd0aCkuZmlsbChudWxsKSwgb3B0aW9ucykudGhlbihcbiAgICAgICAgICAgIChvdXRwdXRzKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChvdXRwdXRzLnNvbWUoKG8pID0+IG9bM10gIT09ICdjcHUnKSkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsgdHlwZSwgZXJyOiAnUHJveHkgZG9lcyBub3Qgc3VwcG9ydCBub24tY3B1IHRlbnNvciBsb2NhdGlvbi4nIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlKFxuICAgICAgICAgICAgICAgICAgeyB0eXBlLCBvdXQ6IG91dHB1dHMgfSBhcyBPcnRXYXNtTWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgIGV4dHJhY3RUcmFuc2ZlcmFibGVCdWZmZXJzKFsuLi5pbnB1dHMsIC4uLm91dHB1dHNdIGFzIFNlcmlhbGl6YWJsZVRlbnNvck1ldGFkYXRhW10pLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHBvc3RNZXNzYWdlKHsgdHlwZSwgZXJyIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VuZC1wcm9maWxpbmcnOlxuICAgICAgICAgIGVuZFByb2ZpbGluZyhtZXNzYWdlISk7XG4gICAgICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcG9zdE1lc3NhZ2UoeyB0eXBlLCBlcnIgfSBhcyBPcnRXYXNtTWVzc2FnZSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc1Byb3h5V29ya2VyXG4gID8gbnVsbFxuICA6ICh1cmxPdmVycmlkZT86IHN0cmluZykgPT5cbiAgICAgIG5ldyBXb3JrZXIodXJsT3ZlcnJpZGUgPz8gc2NyaXB0U3JjISwgeyB0eXBlOiBCVUlMRF9ERUZTLklTX0VTTSA/ICdtb2R1bGUnIDogJ2NsYXNzaWMnLCBuYW1lOiBXT1JLRVJfTkFNRSB9KTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHR5cGUgeyBPcnRXYXNtTW9kdWxlIH0gZnJvbSAnLi93YXNtLXR5cGVzJztcbmltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4vd2FzbS11dGlscy1lbnYnO1xuXG4vKipcbiAqIFRoZSBvcmlnaW4gb2YgdGhlIGN1cnJlbnQgbG9jYXRpb24uXG4gKlxuICogSW4gTm9kZS5qcywgdGhpcyBpcyB1bmRlZmluZWQuXG4gKi9cbmNvbnN0IG9yaWdpbiA9IGlzTm9kZSB8fCB0eXBlb2YgbG9jYXRpb24gPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogbG9jYXRpb24ub3JpZ2luO1xuXG4vKipcbiAqIFNvbWUgYnVuZGxlcnMgKGVnLiBXZWJwYWNrKSB3aWxsIHJld3JpdGUgYGltcG9ydC5tZXRhLnVybGAgdG8gYSBmaWxlIFVSTCBhdCBjb21waWxlIHRpbWUuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBjaGVja3MgaWYgYGltcG9ydC5tZXRhLnVybGAgc3RhcnRzIHdpdGggYGZpbGU6YCwgYnV0IHVzaW5nIHRoZSBgPmAgYW5kIGA8YCBvcGVyYXRvcnMgaW5zdGVhZCBvZlxuICogYHN0YXJ0c1dpdGhgIGZ1bmN0aW9uIHNvIHRoYXQgY29kZSBtaW5pbWl6ZXJzIGNhbiByZW1vdmUgdGhlIGRlYWQgY29kZSBjb3JyZWN0bHkuXG4gKlxuICogRm9yIGV4YW1wbGUsIGlmIHdlIHVzZSB0ZXJzZXIgdG8gbWluaWZ5IHRoZSBmb2xsb3dpbmcgY29kZTpcbiAqIGBgYGpzXG4gKiBpZiAoXCJmaWxlOi8vaGFyZC1jb2RlZC1maWxlbmFtZVwiLnN0YXJ0c1dpdGgoXCJmaWxlOlwiKSkge1xuICogICBjb25zb2xlLmxvZygxKVxuICogfSBlbHNlIHtcbiAqICAgY29uc29sZS5sb2coMilcbiAqIH1cbiAqXG4gKiBpZiAoXCJmaWxlOi8vaGFyZC1jb2RlZC1maWxlbmFtZVwiID4gXCJmaWxlOlwiICYmIFwiZmlsZTovL2hhcmQtY29kZWQtZmlsZW5hbWVcIiA8IFwiZmlsZTtcIikge1xuICogICBjb25zb2xlLmxvZygzKVxuICogfSBlbHNlIHtcbiAqICAgY29uc29sZS5sb2coNClcbiAqIH1cbiAqIGBgYFxuICpcbiAqIFRoZSBtaW5pZmllZCBjb2RlIHdpbGwgYmU6XG4gKiBgYGBqc1xuICogXCJmaWxlOi8vaGFyZC1jb2RlZC1maWxlbmFtZVwiLnN0YXJ0c1dpdGgoXCJmaWxlOlwiKT9jb25zb2xlLmxvZygxKTpjb25zb2xlLmxvZygyKSxjb25zb2xlLmxvZygzKTtcbiAqIGBgYFxuICpcbiAqICh1c2UgVGVyc2VyIDUuMzkuMCB3aXRoIGRlZmF1bHQgb3B0aW9ucywgaHR0cHM6Ly90cnkudGVyc2VyLm9yZy8pXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgaW1wb3J0Lm1ldGEudXJsIGlzIGhhcmRjb2RlZCBhcyBhIGZpbGUgVVJJLlxuICovXG5leHBvcnQgY29uc3QgaXNFc21JbXBvcnRNZXRhVXJsSGFyZGNvZGVkQXNGaWxlVXJpID1cbiAgQlVJTERfREVGUy5JU19FU00gJiYgQlVJTERfREVGUy5FU01fSU1QT1JUX01FVEFfVVJMISA+ICdmaWxlOicgJiYgQlVJTERfREVGUy5FU01fSU1QT1JUX01FVEFfVVJMISA8ICdmaWxlOyc7XG5cbmNvbnN0IGdldFNjcmlwdFNyYyA9ICgpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICAvLyBpZiBOb2RlanMsIHJldHVybiB1bmRlZmluZWRcbiAgaWYgKGlzTm9kZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgLy8gaWYgSXQncyBFU00sIHVzZSBpbXBvcnQubWV0YS51cmxcbiAgaWYgKEJVSUxEX0RFRlMuSVNfRVNNKSB7XG4gICAgLy8gRm9yIEVTTSwgaWYgdGhlIGltcG9ydC5tZXRhLnVybCBpcyBhIGZpbGUgVVJMLCB0aGlzIHVzdWFsbHkgbWVhbnMgdGhlIGJ1bmRsZXIgcmV3cml0ZXMgYGltcG9ydC5tZXRhLnVybGAgdG9cbiAgICAvLyB0aGUgZmlsZSBwYXRoIGF0IGNvbXBpbGUgdGltZS4gSW4gdGhpcyBjYXNlLCB0aGlzIGZpbGUgcGF0aCBjYW5ub3QgYmUgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHJ1bnRpbWUgVVJMLlxuICAgIC8vXG4gICAgLy8gV2UgbmVlZCB0byB1c2UgdGhlIFVSTCBjb25zdHJ1Y3RvciBsaWtlIHRoaXM6XG4gICAgLy8gYGBganNcbiAgICAvLyBuZXcgVVJMKCdhY3R1YWwtYnVuZGxlLW5hbWUuanMnLCBpbXBvcnQubWV0YS51cmwpLmhyZWZcbiAgICAvLyBgYGBcbiAgICAvLyBTbyB0aGF0IGJ1bmRsZXIgY2FuIHByZXByb2Nlc3MgdGhlIFVSTCBjb3JyZWN0bHkuXG4gICAgaWYgKGlzRXNtSW1wb3J0TWV0YVVybEhhcmRjb2RlZEFzRmlsZVVyaSkge1xuICAgICAgLy8gaWYgdGhlIHJld3JpdHRlbiBVUkwgaXMgYSByZWxhdGl2ZSBwYXRoLCB3ZSBuZWVkIHRvIHVzZSB0aGUgb3JpZ2luIHRvIHJlc29sdmUgdGhlIFVSTC5cblxuICAgICAgLy8gVGhlIGZvbGxvd2luZyBpcyBhIHdvcmthcm91bmQgZm9yIFZpdGUuXG4gICAgICAvL1xuICAgICAgLy8gVml0ZSB1c2VzIGEgYnVuZGxlcihyb2xsdXAvcm9sbGRvd24pIHRoYXQgZG9lcyBub3QgcmV3cml0ZSBgaW1wb3J0Lm1ldGEudXJsYCB0byBhIGZpbGUgVVJMLiBTbyBpbiB0aGVvcnksIHRoaXNcbiAgICAgIC8vIGNvZGUgcGF0aCBzaG91bGQgbm90IGJlIGV4ZWN1dGVkIGluIFZpdGUuIEhvd2V2ZXIsIHRoZSBidW5kbGVyIGRvZXMgbm90IGtub3cgaXQgYW5kIGl0IHN0aWxsIHRyeSB0byBsb2FkIHRoZVxuICAgICAgLy8gZm9sbG93aW5nIHBhdHRlcm46XG4gICAgICAvLyAtIGByZXR1cm4gbmV3IFVSTCgnZmlsZW5hbWUnLCBpbXBvcnQubWV0YS51cmwpLmhyZWZgXG4gICAgICAvL1xuICAgICAgLy8gQnkgcmVwbGFjaW5nIHRoZSBwYXR0ZXJuIGFib3ZlIHdpdGggdGhlIGZvbGxvd2luZyBjb2RlLCB3ZSBjYW4gc2tpcCB0aGUgcmVzb3VyY2UgbG9hZGluZyBiZWhhdmlvcjpcbiAgICAgIC8vIC0gYGNvbnN0IFVSTDIgPSBVUkw7IHJldHVybiBuZXcgVVJMMignZmlsZW5hbWUnLCBpbXBvcnQubWV0YS51cmwpLmhyZWY7YFxuICAgICAgLy9cbiAgICAgIC8vIEFuZCBpdCBzdGlsbCB3b3JrcyBpbiBXZWJwYWNrLlxuICAgICAgY29uc3QgVVJMMiA9IFVSTDtcbiAgICAgIHJldHVybiBuZXcgVVJMKG5ldyBVUkwyKEJVSUxEX0RFRlMuQlVORExFX0ZJTEVOQU1FLCBCVUlMRF9ERUZTLkVTTV9JTVBPUlRfTUVUQV9VUkwpLmhyZWYsIG9yaWdpbikuaHJlZjtcbiAgICB9XG5cbiAgICByZXR1cm4gQlVJTERfREVGUy5FU01fSU1QT1JUX01FVEFfVVJMO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IChkb2N1bWVudC5jdXJyZW50U2NyaXB0IGFzIEhUTUxTY3JpcHRFbGVtZW50KT8uc3JjXG4gICAgOiAvLyB1c2UgYHNlbGYubG9jYXRpb24uaHJlZmAgaWYgYXZhaWxhYmxlXG4gICAgICB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gc2VsZi5sb2NhdGlvbj8uaHJlZlxuICAgICAgOiB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIFRoZSBjbGFzc2ljIHNjcmlwdCBzb3VyY2UgVVJMLiBUaGlzIGlzIG5vdCBhbHdheXMgYXZhaWxhYmxlIGluIG5vbiBFU01vZHVsZSBlbnZpcm9ubWVudHMuXG4gKlxuICogSW4gTm9kZS5qcywgdGhpcyBpcyB1bmRlZmluZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBzY3JpcHRTcmMgPSBnZXRTY3JpcHRTcmMoKTtcblxuLyoqXG4gKiBJbmZlciB0aGUgd2FzbSBwYXRoIHByZWZpeCBmcm9tIHRoZSBzY3JpcHQgc291cmNlIFVSTC5cbiAqXG4gKiBAcmV0dXJucyBUaGUgaW5mZXJyZWQgd2FzbSBwYXRoIHByZWZpeCwgb3IgdW5kZWZpbmVkIGlmIHRoZSBzY3JpcHQgc291cmNlIFVSTCBpcyBub3QgYXZhaWxhYmxlIG9yIGlzIGEgYmxvYiBVUkwuXG4gKi9cbmV4cG9ydCBjb25zdCBpbmZlcldhc21QYXRoUHJlZml4RnJvbVNjcmlwdFNyYyA9ICgpOiBzdHJpbmcgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoc2NyaXB0U3JjICYmICFzY3JpcHRTcmMuc3RhcnRzV2l0aCgnYmxvYjonKSkge1xuICAgIHJldHVybiBzY3JpcHRTcmMuc3Vic3RyaW5nKDAsIHNjcmlwdFNyYy5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIGZpbGVuYW1lIHdpdGggcHJlZml4IGlzIGZyb20gdGhlIHNhbWUgb3JpZ2luLlxuICovXG5jb25zdCBpc1NhbWVPcmlnaW4gPSAoZmlsZW5hbWU6IHN0cmluZywgcHJlZml4T3ZlcnJpZGU/OiBzdHJpbmcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBiYXNlVXJsID0gcHJlZml4T3ZlcnJpZGUgPz8gc2NyaXB0U3JjO1xuICAgIGNvbnN0IHVybCA9IGJhc2VVcmwgPyBuZXcgVVJMKGZpbGVuYW1lLCBiYXNlVXJsKSA6IG5ldyBVUkwoZmlsZW5hbWUpO1xuICAgIHJldHVybiB1cmwub3JpZ2luID09PSBvcmlnaW47XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgdGhlIGlucHV0cyB0byBhbiBhYnNvbHV0ZSBVUkwgd2l0aCB0aGUgZ2l2ZW4gcHJlZml4IG92ZXJyaWRlLiBJZiBmYWlsZWQsIHJldHVybiB1bmRlZmluZWQuXG4gKi9cbmNvbnN0IG5vcm1hbGl6ZVVybCA9IChmaWxlbmFtZTogc3RyaW5nLCBwcmVmaXhPdmVycmlkZT86IHN0cmluZykgPT4ge1xuICBjb25zdCBiYXNlVXJsID0gcHJlZml4T3ZlcnJpZGUgPz8gc2NyaXB0U3JjO1xuICB0cnkge1xuICAgIGNvbnN0IHVybCA9IGJhc2VVcmwgPyBuZXcgVVJMKGZpbGVuYW1lLCBiYXNlVXJsKSA6IG5ldyBVUkwoZmlsZW5hbWUpO1xuICAgIHJldHVybiB1cmwuaHJlZjtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBmYWxsYmFjayBVUkwgaWYgYW4gYWJzb2x1dGUgVVJMIGNhbm5vdCBiZSBjcmVhdGVkIGJ5IHRoZSBub3JtYWxpemVVcmwgZnVuY3Rpb24uXG4gKi9cbmNvbnN0IGZhbGxiYWNrVXJsID0gKGZpbGVuYW1lOiBzdHJpbmcsIHByZWZpeE92ZXJyaWRlPzogc3RyaW5nKSA9PiBgJHtwcmVmaXhPdmVycmlkZSA/PyAnLi8nfSR7ZmlsZW5hbWV9YDtcblxuLyoqXG4gKiBUaGlzIGhlbHBlciBmdW5jdGlvbiBpcyB1c2VkIHRvIHByZWxvYWQgYSBtb2R1bGUgZnJvbSBhIFVSTC5cbiAqXG4gKiBJZiB0aGUgb3JpZ2luIG9mIHRoZSB3b3JrZXIgVVJMIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IG9yaWdpbiwgdGhlIHdvcmtlciBjYW5ub3QgYmUgbG9hZGVkIGRpcmVjdGx5LlxuICogU2VlIGRpc2N1c3Npb25zIGluIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvd29ya2VyLWxvYWRlci9pc3N1ZXMvMTU0XG4gKlxuICogSW4gdGhpcyBjYXNlLCB3ZSB3aWxsIGZldGNoIHRoZSB3b3JrZXIgVVJMIGFuZCBjcmVhdGUgYSBuZXcgQmxvYiBVUkwgd2l0aCB0aGUgc2FtZSBvcmlnaW4gYXMgYSB3b3JrYXJvdW5kLlxuICpcbiAqIEBwYXJhbSBhYnNvbHV0ZVVybCAtIFRoZSBhYnNvbHV0ZSBVUkwgdG8gcHJlbG9hZC5cbiAqXG4gKiBAcmV0dXJucyAtIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIGEgbmV3IEJsb2IgVVJMXG4gKi9cbmNvbnN0IHByZWxvYWQgPSBhc3luYyAoYWJzb2x1dGVVcmw6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYWJzb2x1dGVVcmwsIHsgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicgfSk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XG4gIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xufTtcblxuLyoqXG4gKiBUaGlzIGhlbHBlciBmdW5jdGlvbiBpcyB1c2VkIHRvIGR5bmFtaWNhbGx5IGltcG9ydCBhIG1vZHVsZSBmcm9tIGEgVVJMLlxuICpcbiAqIFRoZSBidWlsZCBzY3JpcHQgaGFzIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoaXMgZnVuY3Rpb24gdG8gZW5zdXJlIHRoYXQgdGhlIFVSTCBpcyBub3QgYnVuZGxlZCBpbnRvIHRoZSBmaW5hbCBvdXRwdXQuXG4gKlxuICogQHBhcmFtIHVybCAtIFRoZSBVUkwgdG8gaW1wb3J0LlxuICpcbiAqIEByZXR1cm5zIC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGRlZmF1bHQgZXhwb3J0IG9mIHRoZSBtb2R1bGUuXG4gKi9cbmNvbnN0IGR5bmFtaWNJbXBvcnREZWZhdWx0ID0gYXN5bmMgPFQ+KHVybDogc3RyaW5nKTogUHJvbWlzZTxUPiA9PlxuICAoYXdhaXQgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gLyogQHZpdGUtaWdub3JlICovIHVybCkpLmRlZmF1bHQ7XG5cbi8qKlxuICogVGhlIHByb3h5IHdvcmtlciBmYWN0b3J5IGltcG9ydGVkIGZyb20gdGhlIHByb3h5IHdvcmtlciBtb2R1bGUuXG4gKlxuICogVGhpcyBpcyBvbmx5IGF2YWlsYWJsZSB3aGVuIHRoZSBXZWJBc3NlbWJseSBwcm94eSBpcyBub3QgZGlzYWJsZWQuXG4gKi9cbmNvbnN0IGNyZWF0ZVByb3h5V29ya2VyOiAoKHVybE92ZXJyaWRlPzogc3RyaW5nKSA9PiBXb3JrZXIpIHwgdW5kZWZpbmVkID1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMsIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbiAgQlVJTERfREVGUy5ESVNBQkxFX1dBU01fUFJPWFkgPyB1bmRlZmluZWQgOiByZXF1aXJlKCcuL3Byb3h5LXdvcmtlci9tYWluJykuZGVmYXVsdDtcblxuLyoqXG4gKiBJbXBvcnQgdGhlIHByb3h5IHdvcmtlci5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgcGVyZm9ybSB0aGUgZm9sbG93aW5nIHN0ZXBzOlxuICogMS4gSWYgYSBwcmVsb2FkIGlzIG5lZWRlZCwgaXQgd2lsbCBwcmVsb2FkIHRoZSBtb2R1bGUgYW5kIHJldHVybiB0aGUgb2JqZWN0IFVSTC5cbiAqIDIuIFVzZSB0aGUgcHJveHkgd29ya2VyIGZhY3RvcnkgdG8gY3JlYXRlIHRoZSBwcm94eSB3b3JrZXIuXG4gKlxuICogQHJldHVybnMgLSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBhIHR1cGxlIG9mIDIgZWxlbWVudHM6XG4gKiAgICAgICAgICAgIC0gVGhlIG9iamVjdCBVUkwgb2YgdGhlIHByZWxvYWRlZCBtb2R1bGUsIG9yIHVuZGVmaW5lZCBpZiBubyBwcmVsb2FkIGlzIG5lZWRlZC5cbiAqICAgICAgICAgICAgLSBUaGUgcHJveHkgd29ya2VyLlxuICovXG5leHBvcnQgY29uc3QgaW1wb3J0UHJveHlXb3JrZXIgPSBhc3luYyAoKTogUHJvbWlzZTxbdW5kZWZpbmVkIHwgc3RyaW5nLCBXb3JrZXJdPiA9PiB7XG4gIGlmICghc2NyaXB0U3JjKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCBwcm94eSB3b3JrZXI6IGNhbm5vdCBkZXRlcm1pbmUgdGhlIHNjcmlwdCBzb3VyY2UgVVJMLicpO1xuICB9XG5cbiAgLy8gSWYgdGhlIHNjcmlwdCBzb3VyY2UgaXMgZnJvbSB0aGUgc2FtZSBvcmlnaW4sIHdlIGNhbiB1c2UgdGhlIGVtYmVkZGVkIHByb3h5IG1vZHVsZSBkaXJlY3RseS5cbiAgaWYgKGlzU2FtZU9yaWdpbihzY3JpcHRTcmMpKSB7XG4gICAgcmV0dXJuIFt1bmRlZmluZWQsIGNyZWF0ZVByb3h5V29ya2VyISgpXTtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgbmVlZCB0byBwcmVsb2FkXG4gIGNvbnN0IHVybCA9IGF3YWl0IHByZWxvYWQoc2NyaXB0U3JjKTtcbiAgcmV0dXJuIFt1cmwsIGNyZWF0ZVByb3h5V29ya2VyISh1cmwpXTtcbn07XG5cbi8qKlxuICogVGhlIGVtYmVkZGVkIFdlYkFzc2VtYmx5IG1vZHVsZS5cbiAqXG4gKiBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIGluIEVTTSBhbmQgd2hlbiBlbWJlZGRpbmcgaXMgbm90IGRpc2FibGVkLlxuICovXG5jb25zdCBlbWJlZGRlZFdhc21Nb2R1bGU6IEVtc2NyaXB0ZW5Nb2R1bGVGYWN0b3J5PE9ydFdhc21Nb2R1bGU+IHwgdW5kZWZpbmVkID1cbiAgQlVJTERfREVGUy5JU19FU00gJiYgQlVJTERfREVGUy5FTkFCTEVfQlVORExFX1dBU01fSlNcbiAgICA/IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICByZXF1aXJlKFxuICAgICAgICAhQlVJTERfREVGUy5ESVNBQkxFX0pTRVBcbiAgICAgICAgICA/ICcuLi8uLi9kaXN0L29ydC13YXNtLXNpbWQtdGhyZWFkZWQuanNlcC5tanMnXG4gICAgICAgICAgOiBCVUlMRF9ERUZTLkVOQUJMRV9KU1BJXG4gICAgICAgICAgICA/ICcuLi8uLi9kaXN0L29ydC13YXNtLXNpbWQtdGhyZWFkZWQuanNwaS5tanMnXG4gICAgICAgICAgICA6ICFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCR1BVXG4gICAgICAgICAgICAgID8gJy4uLy4uL2Rpc3Qvb3J0LXdhc20tc2ltZC10aHJlYWRlZC5hc3luY2lmeS5tanMnXG4gICAgICAgICAgICAgIDogJy4uLy4uL2Rpc3Qvb3J0LXdhc20tc2ltZC10aHJlYWRlZC5tanMnLFxuICAgICAgKS5kZWZhdWx0XG4gICAgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogSW1wb3J0IHRoZSBXZWJBc3NlbWJseSBtb2R1bGUuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIHBlcmZvcm0gdGhlIGZvbGxvd2luZyBzdGVwczpcbiAqIDEuIElmIHRoZSBlbWJlZGRlZCBtb2R1bGUgZXhpc3RzIGFuZCBubyBjdXN0b20gVVJMIGlzIHNwZWNpZmllZCwgdXNlIHRoZSBlbWJlZGRlZCBtb2R1bGUuXG4gKiAyLiBJZiBhIHByZWxvYWQgaXMgbmVlZGVkLCBpdCB3aWxsIHByZWxvYWQgdGhlIG1vZHVsZSBhbmQgcmV0dXJuIHRoZSBvYmplY3QgVVJMLlxuICogMy4gT3RoZXJ3aXNlLCBpdCB3aWxsIHBlcmZvcm0gYSBkeW5hbWljIGltcG9ydCBvZiB0aGUgbW9kdWxlLlxuICpcbiAqIEByZXR1cm5zIC0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYSB0dXBsZSBvZiAyIGVsZW1lbnRzOlxuICogICAgICAgICAgICAtIFRoZSBvYmplY3QgVVJMIG9mIHRoZSBwcmVsb2FkZWQgbW9kdWxlLCBvciB1bmRlZmluZWQgaWYgbm8gcHJlbG9hZCBpcyBuZWVkZWQuXG4gKiAgICAgICAgICAgIC0gVGhlIGRlZmF1bHQgZXhwb3J0IG9mIHRoZSBtb2R1bGUsIHdoaWNoIGlzIGEgZmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIFdlYkFzc2VtYmx5IG1vZHVsZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGltcG9ydFdhc21Nb2R1bGUgPSBhc3luYyAoXG4gIHVybE92ZXJyaWRlOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIHByZWZpeE92ZXJyaWRlOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIGlzTXVsdGlUaHJlYWRlZDogYm9vbGVhbixcbiAgaXNXYXNtT3ZlcnJpZGRlbjogYm9vbGVhbixcbik6IFByb21pc2U8W3VuZGVmaW5lZCB8IHN0cmluZywgRW1zY3JpcHRlbk1vZHVsZUZhY3Rvcnk8T3J0V2FzbU1vZHVsZT5dPiA9PiB7XG4gIC8vXG4gIC8vIENoZWNrIGlmIHdlIHNob3VsZCB1c2UgdGhlIGVtYmVkZGVkIG1vZHVsZS5cbiAgLy9cblxuICAvLyBUbyB1c2UgdGhlIGVtYmVkZGVkIG1vZHVsZSwgaXQgc2hvdWxkIGJlIGF2YWlsYWJsZSwgYW5kIG5vIFVSTCBvdmVycmlkZSBvciBwcmVmaXggb3ZlcnJpZGUgc2hvdWxkIGJlIHNwZWNpZmllZC5cbiAgbGV0IHVzZUVtYmVkZGVkTW9kdWxlID0gZW1iZWRkZWRXYXNtTW9kdWxlICYmICEodXJsT3ZlcnJpZGUgfHwgcHJlZml4T3ZlcnJpZGUpO1xuICBpZiAodXNlRW1iZWRkZWRNb2R1bGUpIHtcbiAgICBpZiAoIXNjcmlwdFNyYykge1xuICAgICAgLy8gbm8gVVJMIGluZm8gYXZhaWxhYmxlLlxuICAgICAgLy9cbiAgICAgIC8vIE5vdGU6IHdoZW4gdGhlIGVtYmVkZGVkIG1vZHVsZSBpcyBhdmFpbGFibGUsIGl0IG1lYW5zIHRoZSBjdXJyZW50IHNjcmlwdCBpcyBFU00uIFVzdWFsbHksIGluIEVTTSwgdGhlXG4gICAgICAvLyBgaW1wb3J0Lm1ldGEudXJsYCBpcyBhdmFpbGFibGUuIEJ1dCBpbiBzb21lIGNhc2VzIChlZy4gQ2xvdWRmbGFyZSBXb3JrZXJzKSwgdGhlIHZhbHVlIG9mIGBpbXBvcnQubWV0YS51cmxgXG4gICAgICAvLyBjYW4gYmUgYG51bGxgIG9yIGB1bmRlZmluZWRgLiBJbiB0aGlzIGNhc2UsIHdlIGNhbiBvbmx5IGxvYWQgdGhlIGVtYmVkZGVkIG1vZHVsZSB3aGVuOlxuICAgICAgLy9cbiAgICAgIC8vIDEuIFRoZSBXZWJBc3NlbWJseSBtb2R1bGUgYmluYXJ5IGlzIG92ZXJyaWRkZW46XG4gICAgICAvLyAgICBgYGBqc1xuICAgICAgLy8gICAgZW52Lndhc20ud2FzbVBhdGhzID0gdW5kZWZpbmVkOyAgLy8gb3Igbm90IHNwZWNpZmllZFxuICAgICAgLy8gICAgZW52Lndhc20ud2FzbUJpbmFyeSA9IC8qIGEgVWludDhBcnJheSBjb250YWluaW5nIHRoZSBXZWJBc3NlbWJseSBiaW5hcnkgKi87XG4gICAgICAvLyAgICBgYGBcbiAgICAgIC8vXG4gICAgICAvLyAyLiBUaGUgXCIud2FzbVwiIG9ubHkgaXMgb3ZlcnJpZGRlbi5cbiAgICAgIC8vICAgIGBgYGpzXG4gICAgICAvLyAgICBlbnYud2FzbS53YXNtUGF0aHMgPSB7IHdhc206IC8qIFVSTCBvZiB0aGUgLndhc20gZmlsZSAqLyB9O1xuICAgICAgLy8gICAgYGBgXG4gICAgICAvL1xuICAgICAgaWYgKGlzV2FzbU92ZXJyaWRkZW4gJiYgIWlzTXVsdGlUaHJlYWRlZCkge1xuICAgICAgICB1c2VFbWJlZGRlZE1vZHVsZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBkZXRlcm1pbmUgdGhlIHNjcmlwdCBzb3VyY2UgVVJMLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiB0aGUgc2NyaXB0IHNvdXJjZSBpcyBhdmFpbGFibGUsIHdlIGNhbiBjaGVjayBpZiBpdCBpcyBmcm9tIHRoZSBzYW1lIG9yaWdpbi5cbiAgICAgIC8vIEFsc28gdXNlIHRoZSBlbWJlZGRlZCBtb2R1bGUgd2hlbiB3YXNtQmluYXJ5IGlzIHByb3ZpZGVkIGFuZCBzaW5nbGUtdGhyZWFkZWQgKGVnLiBCbG9iIFVSTCB3b3JrZXJzXG4gICAgICAvLyB3aGVyZSBpc1NhbWVPcmlnaW4gZmFpbHMgYnV0IG5vIGZpbGUgcmVzb2x1dGlvbiBvciB3b3JrZXIgc3Bhd25pbmcgaXMgbmVlZGVkKS5cbiAgICAgIHVzZUVtYmVkZGVkTW9kdWxlID0gaXNTYW1lT3JpZ2luKHNjcmlwdFNyYykgfHwgKGlzV2FzbU92ZXJyaWRkZW4gJiYgIWlzTXVsdGlUaHJlYWRlZCk7XG4gICAgfVxuICB9XG4gIGlmICh1c2VFbWJlZGRlZE1vZHVsZSkge1xuICAgIHJldHVybiBbdW5kZWZpbmVkLCBlbWJlZGRlZFdhc21Nb2R1bGUhXTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB3YXNtTW9kdWxlRmlsZW5hbWUgPSAhQlVJTERfREVGUy5ESVNBQkxFX0pTRVBcbiAgICAgID8gJ29ydC13YXNtLXNpbWQtdGhyZWFkZWQuanNlcC5tanMnXG4gICAgICA6IEJVSUxEX0RFRlMuRU5BQkxFX0pTUElcbiAgICAgICAgPyAnb3J0LXdhc20tc2ltZC10aHJlYWRlZC5qc3BpLm1qcydcbiAgICAgICAgOiAhQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVVxuICAgICAgICAgID8gJ29ydC13YXNtLXNpbWQtdGhyZWFkZWQuYXN5bmNpZnkubWpzJ1xuICAgICAgICAgIDogJ29ydC13YXNtLXNpbWQtdGhyZWFkZWQubWpzJztcbiAgICBjb25zdCB3YXNtTW9kdWxlVXJsID0gdXJsT3ZlcnJpZGUgPz8gbm9ybWFsaXplVXJsKHdhc21Nb2R1bGVGaWxlbmFtZSwgcHJlZml4T3ZlcnJpZGUpO1xuICAgIC8vIG5lZWQgdG8gcHJlbG9hZCBpZiBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gICAgLy8gMS4gbm90IGluIE5vZGUuanMuXG4gICAgLy8gICAgLSBOb2RlLmpzIGRvZXMgbm90IGhhdmUgdGhlIHNhbWUgb3JpZ2luIHBvbGljeSBmb3IgY3JlYXRpbmcgd29ya2Vycy5cbiAgICAvLyAyLiBtdWx0aS10aHJlYWRlZCBpcyBlbmFibGVkLlxuICAgIC8vICAgIC0gSWYgbXVsdGktdGhyZWFkZWQgaXMgZGlzYWJsZWQsIG5vIHdvcmtlciB3aWxsIGJlIGNyZWF0ZWQuIFNvIHdlIGRvbid0IG5lZWQgdG8gcHJlbG9hZCB0aGUgbW9kdWxlLlxuICAgIC8vIDMuIHRoZSBhYnNvbHV0ZSBVUkwgaXMgYXZhaWxhYmxlLlxuICAgIC8vICAgIC0gSWYgdGhlIGFic29sdXRlIFVSTCBpcyBmYWlsZWQgdG8gYmUgY3JlYXRlZCwgdGhlIG9yaWdpbiBjYW5ub3QgYmUgZGV0ZXJtaW5lZC4gSW4gdGhpcyBjYXNlLCB3ZSB3aWxsIG5vdFxuICAgIC8vICAgIHByZWxvYWQgdGhlIG1vZHVsZS5cbiAgICAvLyA0LiB0aGUgd29ya2VyIFVSTCBpcyBub3QgZnJvbSB0aGUgc2FtZSBvcmlnaW4uXG4gICAgLy8gICAgLSBJZiB0aGUgd29ya2VyIFVSTCBpcyBmcm9tIHRoZSBzYW1lIG9yaWdpbiwgd2UgY2FuIGNyZWF0ZSB0aGUgd29ya2VyIGRpcmVjdGx5LlxuICAgIGNvbnN0IG5lZWRQcmVsb2FkID0gIWlzTm9kZSAmJiBpc011bHRpVGhyZWFkZWQgJiYgd2FzbU1vZHVsZVVybCAmJiAhaXNTYW1lT3JpZ2luKHdhc21Nb2R1bGVVcmwsIHByZWZpeE92ZXJyaWRlKTtcbiAgICBjb25zdCB1cmwgPSBuZWVkUHJlbG9hZFxuICAgICAgPyBhd2FpdCBwcmVsb2FkKHdhc21Nb2R1bGVVcmwpXG4gICAgICA6ICh3YXNtTW9kdWxlVXJsID8/IGZhbGxiYWNrVXJsKHdhc21Nb2R1bGVGaWxlbmFtZSwgcHJlZml4T3ZlcnJpZGUpKTtcbiAgICByZXR1cm4gW25lZWRQcmVsb2FkID8gdXJsIDogdW5kZWZpbmVkLCBhd2FpdCBkeW5hbWljSW1wb3J0RGVmYXVsdDxFbXNjcmlwdGVuTW9kdWxlRmFjdG9yeTxPcnRXYXNtTW9kdWxlPj4odXJsKV07XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IEVudiB9IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5cbmltcG9ydCB0eXBlIHsgT3J0V2FzbU1vZHVsZSB9IGZyb20gJy4vd2FzbS10eXBlcyc7XG5pbXBvcnQgeyBpbXBvcnRXYXNtTW9kdWxlLCBpbmZlcldhc21QYXRoUHJlZml4RnJvbVNjcmlwdFNyYyB9IGZyb20gJy4vd2FzbS11dGlscy1pbXBvcnQnO1xuXG5sZXQgd2FzbTogT3J0V2FzbU1vZHVsZSB8IHVuZGVmaW5lZDtcbmxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xubGV0IGluaXRpYWxpemluZyA9IGZhbHNlO1xubGV0IGFib3J0ZWQgPSBmYWxzZTtcblxuY29uc3QgaXNNdWx0aVRocmVhZFN1cHBvcnRlZCA9ICgpOiBib29sZWFuID0+IHtcbiAgLy8gSWYgJ1NoYXJlZEFycmF5QnVmZmVyJyBpcyBub3QgYXZhaWxhYmxlLCBXZWJBc3NlbWJseSB0aHJlYWRzIHdpbGwgbm90IHdvcmsuXG4gIGlmICh0eXBlb2YgU2hhcmVkQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBUZXN0IGZvciB0cmFuc2ZlcmFiaWxpdHkgb2YgU0FCcyAoZm9yIGJyb3dzZXJzLiBuZWVkZWQgZm9yIEZpcmVmb3gpXG4gICAgLy8gaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIW1zZy9tb3ppbGxhLmRldi5wbGF0Zm9ybS9JSGtCWmxIRVRwQS9kd3NNTmNoV0VRQUpcbiAgICBpZiAodHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbmV3IE1lc3NhZ2VDaGFubmVsKCkucG9ydDEucG9zdE1lc3NhZ2UobmV3IFNoYXJlZEFycmF5QnVmZmVyKDEpKTtcbiAgICB9XG5cbiAgICAvLyBUZXN0IGZvciBXZWJBc3NlbWJseSB0aHJlYWRzIGNhcGFiaWxpdHkgKGZvciBib3RoIGJyb3dzZXJzIGFuZCBOb2RlLmpzKVxuICAgIC8vIFRoaXMgdHlwZWQgYXJyYXkgaXMgYSBXZWJBc3NlbWJseSBwcm9ncmFtIGNvbnRhaW5pbmcgdGhyZWFkZWQgaW5zdHJ1Y3Rpb25zLlxuICAgIHJldHVybiBXZWJBc3NlbWJseS52YWxpZGF0ZShcbiAgICAgIG5ldyBVaW50OEFycmF5KFtcbiAgICAgICAgMCwgOTcsIDExNSwgMTA5LCAxLCAwLCAwLCAwLCAxLCA0LCAxLCA5NiwgMCwgMCwgMywgMiwgMSwgMCwgNSwgNCwgMSwgMywgMSwgMSwgMTAsIDExLCAxLCA5LCAwLCA2NSwgMCwgMjU0LCAxNixcbiAgICAgICAgMiwgMCwgMjYsIDExLFxuICAgICAgXSksXG4gICAgKTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5jb25zdCBpc1NpbWRTdXBwb3J0ZWQgPSAoKTogYm9vbGVhbiA9PiB7XG4gIHRyeSB7XG4gICAgLy8gVGVzdCBmb3IgV2ViQXNzZW1ibHkgU0lNRCBjYXBhYmlsaXR5IChmb3IgYm90aCBicm93c2VycyBhbmQgTm9kZS5qcylcbiAgICAvLyBUaGlzIHR5cGVkIGFycmF5IGlzIGEgV2ViQXNzZW1ibHkgcHJvZ3JhbSBjb250YWluaW5nIFNJTUQgaW5zdHJ1Y3Rpb25zLlxuXG4gICAgLy8gVGhlIGJpbmFyeSBkYXRhIGlzIGdlbmVyYXRlZCBmcm9tIHRoZSBmb2xsb3dpbmcgY29kZSBieSB3YXQyd2FzbTpcbiAgICAvL1xuICAgIC8vIChtb2R1bGVcbiAgICAvLyAgICh0eXBlICR0MCAoZnVuYykpXG4gICAgLy8gICAoZnVuYyAkZjAgKHR5cGUgJHQwKVxuICAgIC8vICAgICAoZHJvcFxuICAgIC8vICAgICAgIChpMzJ4NC5kb3RfaTE2eDhfc1xuICAgIC8vICAgICAgICAgKGk4eDE2LnNwbGF0XG4gICAgLy8gICAgICAgICAgIChpMzIuY29uc3QgMCkpXG4gICAgLy8gICAgICAgICAodjEyOC5jb25zdCBpMzJ4NCAweDAwMDAwMDAwIDB4MDAwMDAwMDAgMHgwMDAwMDAwMCAweDAwMDAwMDAwKSkpKSlcblxuICAgIHJldHVybiBXZWJBc3NlbWJseS52YWxpZGF0ZShcbiAgICAgIG5ldyBVaW50OEFycmF5KFtcbiAgICAgICAgMCwgOTcsIDExNSwgMTA5LCAxLCAwLCAwLCAwLCAxLCA0LCAxLCA5NiwgMCwgMCwgMywgMiwgMSwgMCwgMTAsIDMwLCAxLCAyOCwgMCwgNjUsIDAsIDI1MywgMTUsIDI1MywgMTIsIDAsIDAsIDAsXG4gICAgICAgIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDI1MywgMTg2LCAxLCAyNiwgMTEsXG4gICAgICBdKSxcbiAgICApO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmNvbnN0IGlzUmVsYXhlZFNpbWRTdXBwb3J0ZWQgPSAoKTogYm9vbGVhbiA9PiB7XG4gIHRyeSB7XG4gICAgLy8gVGVzdCBmb3IgV2ViQXNzZW1ibHkgUmVsYXhlZCBTSU1EIGNhcGFiaWxpdHkgKGZvciBib3RoIGJyb3dzZXJzIGFuZCBOb2RlLmpzKVxuICAgIC8vIFRoaXMgdHlwZWQgYXJyYXkgaXMgYSBXZWJBc3NlbWJseSBwcm9ncmFtIGNvbnRhaW5pbmcgUmVsYXhlZCBTSU1EIGluc3RydWN0aW9ucy5cblxuICAgIC8vIFRoZSBiaW5hcnkgZGF0YSBpcyBnZW5lcmF0ZWQgZnJvbSB0aGUgZm9sbG93aW5nIGNvZGUgYnkgd2F0Mndhc206XG4gICAgLy8gKG1vZHVsZVxuICAgIC8vICAgKGZ1bmMgKHJlc3VsdCB2MTI4KVxuICAgIC8vICAgICAgaTMyLmNvbnN0IDFcbiAgICAvLyAgICAgIGk4eDE2LnNwbGF0XG4gICAgLy8gICAgICBpMzIuY29uc3QgMlxuICAgIC8vICAgICAgaTh4MTYuc3BsYXRcbiAgICAvLyAgICAgIGkzMi5jb25zdCAzXG4gICAgLy8gICAgICBpOHgxNi5zcGxhdFxuICAgIC8vICAgICAgaTMyeDQucmVsYXhlZF9kb3RfaTh4MTZfaTd4MTZfYWRkX3NcbiAgICAvLyAgIClcbiAgICAvLyAgKVxuICAgIHJldHVybiBXZWJBc3NlbWJseS52YWxpZGF0ZShcbiAgICAgIG5ldyBVaW50OEFycmF5KFtcbiAgICAgICAgMCwgOTcsIDExNSwgMTA5LCAxLCAwLCAwLCAwLCAxLCA1LCAxLCA5NiwgMCwgMSwgMTIzLCAzLCAyLCAxLCAwLCAxMCwgMTksIDEsIDE3LCAwLCA2NSwgMSwgMjUzLCAxNSwgNjUsIDIsIDI1MyxcbiAgICAgICAgMTUsIDY1LCAzLCAyNTMsIDE1LCAyNTMsIDE0NywgMiwgMTEsXG4gICAgICBdKSxcbiAgICApO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplV2ViQXNzZW1ibHkgPSBhc3luYyAoZmxhZ3M6IEVudi5XZWJBc3NlbWJseUZsYWdzKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGlmIChpbml0aWFsaXplZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBpZiAoaW5pdGlhbGl6aW5nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwibXVsdGlwbGUgY2FsbHMgdG8gJ2luaXRpYWxpemVXZWJBc3NlbWJseSgpJyBkZXRlY3RlZC5cIik7XG4gIH1cbiAgaWYgKGFib3J0ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwcmV2aW91cyBjYWxsIHRvICdpbml0aWFsaXplV2ViQXNzZW1ibHkoKScgZmFpbGVkLlwiKTtcbiAgfVxuXG4gIGluaXRpYWxpemluZyA9IHRydWU7XG5cbiAgLy8gd2FzbSBmbGFncyBhcmUgYWxyZWFkeSBpbml0aWFsaXplZFxuICBjb25zdCB0aW1lb3V0ID0gZmxhZ3MuaW5pdFRpbWVvdXQhO1xuICBsZXQgbnVtVGhyZWFkcyA9IGZsYWdzLm51bVRocmVhZHMhO1xuXG4gIC8vIGVuc3VyZSBTSU1EIGlzIHN1cHBvcnRlZFxuICBpZiAoZmxhZ3Muc2ltZCA9PT0gZmFsc2UpIHtcbiAgICAvLyBza2lwIFNJTUQgZmVhdHVyZSBjaGVja2luZyBhcyBpdCBpcyBkaXNhYmxlZCBleHBsaWNpdGx5IGJ5IHVzZXJcbiAgfSBlbHNlIGlmIChmbGFncy5zaW1kID09PSAncmVsYXhlZCcpIHtcbiAgICAvLyBjaGVjayBpZiByZWxheGVkIFNJTUQgaXMgc3VwcG9ydGVkXG4gICAgaWYgKCFpc1JlbGF4ZWRTaW1kU3VwcG9ydGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVsYXhlZCBXZWJBc3NlbWJseSBTSU1EIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCFpc1NpbWRTdXBwb3J0ZWQoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignV2ViQXNzZW1ibHkgU0lNRCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoZSBjdXJyZW50IGVudmlyb25tZW50LicpO1xuICB9XG5cbiAgaWYgKEJVSUxEX0RFRlMuRU5BQkxFX0pTUEkpIHtcbiAgICBpZiAoISgnU3VzcGVuZGluZycgaW4gV2ViQXNzZW1ibHkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFzc2VtYmx5IEpTUEkgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGUgY3VycmVudCBlbnZpcm9ubWVudC4nKTtcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayBpZiBtdWx0aS10aHJlYWRpbmcgaXMgc3VwcG9ydGVkXG4gIGNvbnN0IG11bHRpVGhyZWFkU3VwcG9ydGVkID0gaXNNdWx0aVRocmVhZFN1cHBvcnRlZCgpO1xuICBpZiAobnVtVGhyZWFkcyA+IDEgJiYgIW11bHRpVGhyZWFkU3VwcG9ydGVkKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiAhc2VsZi5jcm9zc09yaWdpbklzb2xhdGVkKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnZW52Lndhc20ubnVtVGhyZWFkcyBpcyBzZXQgdG8gJyArXG4gICAgICAgICAgbnVtVGhyZWFkcyArXG4gICAgICAgICAgJywgYnV0IHRoaXMgd2lsbCBub3Qgd29yayB1bmxlc3MgeW91IGVuYWJsZSBjcm9zc09yaWdpbklzb2xhdGVkIG1vZGUuICcgK1xuICAgICAgICAgICdTZWUgaHR0cHM6Ly93ZWIuZGV2L2Nyb3NzLW9yaWdpbi1pc29sYXRpb24tZ3VpZGUvIGZvciBtb3JlIGluZm8uJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLndhcm4oXG4gICAgICAnV2ViQXNzZW1ibHkgbXVsdGktdGhyZWFkaW5nIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuICcgKyAnRmFsbGluZyBiYWNrIHRvIHNpbmdsZS10aHJlYWRpbmcuJyxcbiAgICApO1xuXG4gICAgLy8gc2V0IGZsYWdzLm51bVRocmVhZHMgdG8gMSBzbyB0aGF0IE9ydEluaXQoKSB3aWxsIG5vdCBjcmVhdGUgYSBnbG9iYWwgdGhyZWFkIHBvb2wuXG4gICAgZmxhZ3MubnVtVGhyZWFkcyA9IG51bVRocmVhZHMgPSAxO1xuICB9XG5cbiAgY29uc3Qgd2FzbVBhdGhzID0gZmxhZ3Mud2FzbVBhdGhzO1xuICBjb25zdCB3YXNtUHJlZml4T3ZlcnJpZGUgPSB0eXBlb2Ygd2FzbVBhdGhzID09PSAnc3RyaW5nJyA/IHdhc21QYXRocyA6IHVuZGVmaW5lZDtcbiAgY29uc3QgbWpzUGF0aE92ZXJyaWRlRmxhZyA9ICh3YXNtUGF0aHMgYXMgRW52Lldhc21GaWxlUGF0aHMpPy5tanM7XG4gIGNvbnN0IG1qc1BhdGhPdmVycmlkZSA9IChtanNQYXRoT3ZlcnJpZGVGbGFnIGFzIFVSTCk/LmhyZWYgPz8gbWpzUGF0aE92ZXJyaWRlRmxhZztcbiAgY29uc3Qgd2FzbVBhdGhPdmVycmlkZUZsYWcgPSAod2FzbVBhdGhzIGFzIEVudi5XYXNtRmlsZVBhdGhzKT8ud2FzbTtcbiAgY29uc3Qgd2FzbVBhdGhPdmVycmlkZSA9ICh3YXNtUGF0aE92ZXJyaWRlRmxhZyBhcyBVUkwpPy5ocmVmID8/IHdhc21QYXRoT3ZlcnJpZGVGbGFnO1xuICBjb25zdCB3YXNtQmluYXJ5T3ZlcnJpZGUgPSBmbGFncy53YXNtQmluYXJ5O1xuXG4gIGNvbnN0IFtvYmplY3RVcmwsIG9ydFdhc21GYWN0b3J5XSA9IGF3YWl0IGltcG9ydFdhc21Nb2R1bGUoXG4gICAgbWpzUGF0aE92ZXJyaWRlLFxuICAgIHdhc21QcmVmaXhPdmVycmlkZSxcbiAgICBudW1UaHJlYWRzID4gMSxcbiAgICAhIXdhc21CaW5hcnlPdmVycmlkZSB8fCAhIXdhc21QYXRoT3ZlcnJpZGUsXG4gICk7XG5cbiAgbGV0IGlzVGltZW91dCA9IGZhbHNlO1xuXG4gIGNvbnN0IHRhc2tzOiBBcnJheTxQcm9taXNlPHZvaWQ+PiA9IFtdO1xuXG4gIC8vIHByb21pc2UgZm9yIHRpbWVvdXRcbiAgaWYgKHRpbWVvdXQgPiAwKSB7XG4gICAgdGFza3MucHVzaChcbiAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlzVGltZW91dCA9IHRydWU7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICAvLyBwcm9taXNlIGZvciBtb2R1bGUgaW5pdGlhbGl6YXRpb25cbiAgdGFza3MucHVzaChcbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjb25maWc6IFBhcnRpYWw8T3J0V2FzbU1vZHVsZT4gPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbnVtYmVyIG9mIHRocmVhZHMuIFdlYkFzc2VtYmx5IHdpbGwgY3JlYXRlIChNb2R1bGUubnVtVGhyZWFkcyAtIDEpIHdvcmtlcnMuIElmIGl0IGlzIDEsIG5vIHdvcmtlciB3aWxsIGJlXG4gICAgICAgICAqIGNyZWF0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBudW1UaHJlYWRzLFxuICAgICAgfTtcblxuICAgICAgaWYgKHdhc21CaW5hcnlPdmVycmlkZSkge1xuICAgICAgICAvLyBTZXQgYSBjdXN0b20gYnVmZmVyIHdoaWNoIGNvbnRhaW5zIHRoZSBXZWJBc3NlbWJseSBiaW5hcnkuIFRoaXMgd2lsbCBza2lwIHRoZSB3YXNtIGZpbGUgZmV0Y2hpbmcuXG4gICAgICAgIGNvbmZpZy53YXNtQmluYXJ5ID0gd2FzbUJpbmFyeU92ZXJyaWRlO1xuXG4gICAgICAgIC8vIE9mZmVyIGFuIGltcGxlbWVudGF0aW9uIG9mIGxvY2F0ZUZpbGUoKSB0aGF0IHJldHVybnMgdGhlIGZpbGUgbmFtZSBkaXJlY3RseS4gVGhpcyBoZWxwcyB0byBhdm9pZCBhbiBlcnJvclxuICAgICAgICAvLyB0aHJvd24gbGF0ZXIgZnJvbSB0aGUgZm9sbG93aW5nIGNvZGUgd2hlbiBgaW1wb3J0Lm1ldGEudXJsYCBpcyBhIGJsb2IgVVJMOlxuICAgICAgICAvLyBgYGBcbiAgICAgICAgLy8gICByZXR1cm4gbmV3IFVSTChcIm9ydC13YXNtLXNpbWQtdGhyZWFkZWQuanNlcC53YXNtXCIsIGltcG9ydC5tZXRhLnVybCkuaHJlZjtcbiAgICAgICAgLy8gYGBgXG4gICAgICAgIGNvbmZpZy5sb2NhdGVGaWxlID0gKGZpbGVOYW1lKSA9PiBmaWxlTmFtZTtcbiAgICAgIH0gZWxzZSBpZiAod2FzbVBhdGhPdmVycmlkZSB8fCB3YXNtUHJlZml4T3ZlcnJpZGUpIHtcbiAgICAgICAgLy8gQSBjYWxsYmFjayBmdW5jdGlvbiB0byBsb2NhdGUgdGhlIFdlYkFzc2VtYmx5IGZpbGUuIFRoZSBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIHRoZSBmdWxsIHBhdGggb2YgdGhlIGZpbGUuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFNpbmNlIEVtc2NyaXB0ZW4gMy4xLjU4LCB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIGZvciB0aGUgLndhc20gZmlsZS5cbiAgICAgICAgY29uZmlnLmxvY2F0ZUZpbGUgPSAoZmlsZU5hbWUpID0+IHdhc21QYXRoT3ZlcnJpZGUgPz8gd2FzbVByZWZpeE92ZXJyaWRlICsgZmlsZU5hbWU7XG4gICAgICB9IGVsc2UgaWYgKG1qc1BhdGhPdmVycmlkZSAmJiBtanNQYXRoT3ZlcnJpZGUuaW5kZXhPZignYmxvYjonKSAhPT0gMCkge1xuICAgICAgICAvLyBpZiBtanMgcGF0aCBpcyBzcGVjaWZpZWQsIHVzZSBpdCBhcyB0aGUgYmFzZSBwYXRoIGZvciB0aGUgLndhc20gZmlsZS5cbiAgICAgICAgY29uZmlnLmxvY2F0ZUZpbGUgPSAoZmlsZU5hbWUpID0+IG5ldyBVUkwoZmlsZU5hbWUsIG1qc1BhdGhPdmVycmlkZSkuaHJlZjtcbiAgICAgIH0gZWxzZSBpZiAob2JqZWN0VXJsKSB7XG4gICAgICAgIGNvbnN0IGluZmVycmVkV2FzbVBhdGhQcmVmaXggPSBpbmZlcldhc21QYXRoUHJlZml4RnJvbVNjcmlwdFNyYygpO1xuICAgICAgICBpZiAoaW5mZXJyZWRXYXNtUGF0aFByZWZpeCkge1xuICAgICAgICAgIC8vIGlmIHRoZSB3YXNtIG1vZHVsZSBpcyBwcmVsb2FkZWQsIHVzZSB0aGUgaW5mZXJyZWQgd2FzbSBwYXRoIGFzIHRoZSBiYXNlIHBhdGggZm9yIHRoZSAud2FzbSBmaWxlLlxuICAgICAgICAgIGNvbmZpZy5sb2NhdGVGaWxlID0gKGZpbGVOYW1lKSA9PiBpbmZlcnJlZFdhc21QYXRoUHJlZml4ICsgZmlsZU5hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb3J0V2FzbUZhY3RvcnkoY29uZmlnKS50aGVuKFxuICAgICAgICAvLyB3YXNtIG1vZHVsZSBpbml0aWFsaXplZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgKG1vZHVsZSkgPT4ge1xuICAgICAgICAgIGluaXRpYWxpemluZyA9IGZhbHNlO1xuICAgICAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICB3YXNtID0gbW9kdWxlO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICBpZiAob2JqZWN0VXJsKSB7XG4gICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKG9iamVjdFVybCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvLyB3YXNtIG1vZHVsZSBmYWlsZWQgdG8gaW5pdGlhbGl6ZVxuICAgICAgICAod2hhdCkgPT4ge1xuICAgICAgICAgIGluaXRpYWxpemluZyA9IGZhbHNlO1xuICAgICAgICAgIGFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgIHJlamVjdCh3aGF0KTtcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSksXG4gICk7XG5cbiAgYXdhaXQgUHJvbWlzZS5yYWNlKHRhc2tzKTtcblxuICBpZiAoaXNUaW1lb3V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBXZWJBc3NlbWJseSBiYWNrZW5kIGluaXRpYWxpemluZyBmYWlsZWQgZHVlIHRvIHRpbWVvdXQ6ICR7dGltZW91dH1tc2ApO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0SW5zdGFuY2UgPSAoKTogT3J0V2FzbU1vZHVsZSA9PiB7XG4gIGlmIChpbml0aWFsaXplZCAmJiB3YXNtKSB7XG4gICAgcmV0dXJuIHdhc207XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1dlYkFzc2VtYmx5IGlzIG5vdCBpbml0aWFsaXplZCB5ZXQuJyk7XG59O1xuXG5leHBvcnQgY29uc3QgZGlzcG9zZSA9ICgpOiB2b2lkID0+IHtcbiAgaWYgKGluaXRpYWxpemVkICYmICFpbml0aWFsaXppbmcgJiYgIWFib3J0ZWQpIHtcbiAgICAvLyBUT0RPOiBjdXJyZW50bHkgXCJQVGhyZWFkLnRlcm1pbmF0ZUFsbFRocmVhZHMoKVwiIGlzIG5vdCBleHBvc2VkIGluIHRoZSB3YXNtIG1vZHVsZS5cbiAgICAvLyAgICAgICBBbmQgdGhpcyBmdW5jdGlvbiBpcyBub3QgeWV0IGNhbGxlZCBieSBhbnkgY29kZS5cbiAgICAvLyAgICAgICBJZiBpdCBpcyBuZWVkZWQgaW4gdGhlIGZ1dHVyZSwgd2Ugc2hvdWxkIGV4cG9zZSBpdCBpbiB0aGUgd2FzbSBtb2R1bGUgYW5kIHVuY29tbWVudCB0aGUgZm9sbG93aW5nIGxpbmUuXG5cbiAgICAvLyB3YXNtPy5QVGhyZWFkPy50ZXJtaW5hdGVBbGxUaHJlYWRzKCk7XG4gICAgd2FzbSA9IHVuZGVmaW5lZDtcblxuICAgIGluaXRpYWxpemluZyA9IGZhbHNlO1xuICAgIGluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgYWJvcnRlZCA9IHRydWU7XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IGdldEluc3RhbmNlIH0gZnJvbSAnLi93YXNtLWZhY3RvcnknO1xuXG5leHBvcnQgY29uc3QgYWxsb2NXYXNtU3RyaW5nID0gKGRhdGE6IHN0cmluZywgYWxsb2NzOiBudW1iZXJbXSk6IG51bWJlciA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuXG4gIGNvbnN0IGRhdGFMZW5ndGggPSB3YXNtLmxlbmd0aEJ5dGVzVVRGOChkYXRhKSArIDE7XG4gIGNvbnN0IGRhdGFPZmZzZXQgPSB3YXNtLl9tYWxsb2MoZGF0YUxlbmd0aCk7XG4gIHdhc20uc3RyaW5nVG9VVEY4KGRhdGEsIGRhdGFPZmZzZXQsIGRhdGFMZW5ndGgpO1xuICBhbGxvY3MucHVzaChkYXRhT2Zmc2V0KTtcblxuICByZXR1cm4gZGF0YU9mZnNldDtcbn07XG5cbmludGVyZmFjZSBFeHRyYU9wdGlvbnNIYW5kbGVyIHtcbiAgKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjb25zdCBpdGVyYXRlRXh0cmFPcHRpb25zID0gKFxuICBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgcHJlZml4OiBzdHJpbmcsXG4gIHNlZW46IFdlYWtTZXQ8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+LFxuICBoYW5kbGVyOiBFeHRyYU9wdGlvbnNIYW5kbGVyLFxuKTogdm9pZCA9PiB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnb2JqZWN0JyAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgaWYgKHNlZW4uaGFzKG9wdGlvbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NpcmN1bGFyIHJlZmVyZW5jZSBpbiBvcHRpb25zJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlZW4uYWRkKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIE9iamVjdC5lbnRyaWVzKG9wdGlvbnMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IG5hbWUgPSBwcmVmaXggPyBwcmVmaXggKyBrZXkgOiBrZXk7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGl0ZXJhdGVFeHRyYU9wdGlvbnModmFsdWUgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIG5hbWUgKyAnLicsIHNlZW4sIGhhbmRsZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBoYW5kbGVyKG5hbWUsIHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIGhhbmRsZXIobmFtZSwgdmFsdWUgPyAnMScgOiAnMCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbid0IGhhbmRsZSBleHRyYSBjb25maWcgdHlwZTogJHt0eXBlb2YgdmFsdWV9YCk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogY2hlY2sgd2ViIGFzc2VtYmx5IEFQSSdzIGxhc3QgZXJyb3IgYW5kIHRocm93IGVycm9yIGlmIGFueSBlcnJvciBvY2N1cnJlZC5cbiAqIEBwYXJhbSBtZXNzYWdlIGEgbWVzc2FnZSB1c2VkIHdoZW4gYW4gZXJyb3Igb2NjdXJyZWQuXG4gKi9cbmV4cG9ydCBjb25zdCBjaGVja0xhc3RFcnJvciA9IChtZXNzYWdlOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG5cbiAgY29uc3Qgc3RhY2sgPSB3YXNtLnN0YWNrU2F2ZSgpO1xuICB0cnkge1xuICAgIGNvbnN0IHB0clNpemUgPSB3YXNtLlBUUl9TSVpFO1xuICAgIGNvbnN0IHBhcmFtc09mZnNldCA9IHdhc20uc3RhY2tBbGxvYygyICogcHRyU2l6ZSk7XG4gICAgd2FzbS5fT3J0R2V0TGFzdEVycm9yKHBhcmFtc09mZnNldCwgcGFyYW1zT2Zmc2V0ICsgcHRyU2l6ZSk7XG4gICAgY29uc3QgZXJyb3JDb2RlID0gTnVtYmVyKHdhc20uZ2V0VmFsdWUocGFyYW1zT2Zmc2V0LCBwdHJTaXplID09PSA0ID8gJ2kzMicgOiAnaTY0JykpO1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZVBvaW50ZXIgPSB3YXNtLmdldFZhbHVlKHBhcmFtc09mZnNldCArIHB0clNpemUsICcqJyk7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlUG9pbnRlciA/IHdhc20uVVRGOFRvU3RyaW5nKGVycm9yTWVzc2FnZVBvaW50ZXIpIDogJyc7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke21lc3NhZ2V9IEVSUk9SX0NPREU6ICR7ZXJyb3JDb2RlfSwgRVJST1JfTUVTU0FHRTogJHtlcnJvck1lc3NhZ2V9YCk7XG4gIH0gZmluYWxseSB7XG4gICAgd2FzbS5zdGFja1Jlc3RvcmUoc3RhY2spO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBJbmZlcmVuY2VTZXNzaW9uIH0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHsgZ2V0SW5zdGFuY2UgfSBmcm9tICcuL3dhc20tZmFjdG9yeSc7XG5pbXBvcnQgeyBhbGxvY1dhc21TdHJpbmcsIGNoZWNrTGFzdEVycm9yLCBpdGVyYXRlRXh0cmFPcHRpb25zIH0gZnJvbSAnLi93YXNtLXV0aWxzJztcblxuZXhwb3J0IGNvbnN0IHNldFJ1bk9wdGlvbnMgPSAob3B0aW9uczogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zKTogW251bWJlciwgbnVtYmVyW11dID0+IHtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG4gIGxldCBydW5PcHRpb25zSGFuZGxlID0gMDtcbiAgY29uc3QgYWxsb2NzOiBudW1iZXJbXSA9IFtdO1xuXG4gIGNvbnN0IHJ1bk9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdHJ5IHtcbiAgICBpZiAob3B0aW9ucz8ubG9nU2V2ZXJpdHlMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBydW5PcHRpb25zLmxvZ1NldmVyaXR5TGV2ZWwgPSAyOyAvLyBEZWZhdWx0IHRvIHdhcm5pbmdcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdHlwZW9mIG9wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbCAhPT0gJ251bWJlcicgfHxcbiAgICAgICFOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbCkgfHxcbiAgICAgIG9wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbCA8IDAgfHxcbiAgICAgIG9wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbCA+IDRcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbG9nIHNldmVyaXR5IGxldmVsIGlzIG5vdCB2YWxpZDogJHtvcHRpb25zLmxvZ1NldmVyaXR5TGV2ZWx9YCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnM/LmxvZ1ZlcmJvc2l0eUxldmVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJ1bk9wdGlvbnMubG9nVmVyYm9zaXR5TGV2ZWwgPSAwOyAvLyBEZWZhdWx0IHRvIDBcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBsb2cgdmVyYm9zaXR5IGxldmVsIGlzIG5vdCB2YWxpZDogJHtvcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsfWApO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zPy50ZXJtaW5hdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcnVuT3B0aW9ucy50ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgdGFnRGF0YU9mZnNldCA9IDA7XG4gICAgaWYgKG9wdGlvbnM/LnRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YWdEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKG9wdGlvbnMudGFnLCBhbGxvY3MpO1xuICAgIH1cblxuICAgIHJ1bk9wdGlvbnNIYW5kbGUgPSB3YXNtLl9PcnRDcmVhdGVSdW5PcHRpb25zKFxuICAgICAgcnVuT3B0aW9ucy5sb2dTZXZlcml0eUxldmVsISxcbiAgICAgIHJ1bk9wdGlvbnMubG9nVmVyYm9zaXR5TGV2ZWwhLFxuICAgICAgISFydW5PcHRpb25zLnRlcm1pbmF0ZSEsXG4gICAgICB0YWdEYXRhT2Zmc2V0LFxuICAgICk7XG4gICAgaWYgKHJ1bk9wdGlvbnNIYW5kbGUgPT09IDApIHtcbiAgICAgIGNoZWNrTGFzdEVycm9yKFwiQ2FuJ3QgY3JlYXRlIHJ1biBvcHRpb25zLlwiKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucz8uZXh0cmEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaXRlcmF0ZUV4dHJhT3B0aW9ucyhvcHRpb25zLmV4dHJhLCAnJywgbmV3IFdlYWtTZXQ8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCksIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcoa2V5LCBhbGxvY3MpO1xuICAgICAgICBjb25zdCB2YWx1ZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcodmFsdWUsIGFsbG9jcyk7XG5cbiAgICAgICAgaWYgKHdhc20uX09ydEFkZFJ1bkNvbmZpZ0VudHJ5KHJ1bk9wdGlvbnNIYW5kbGUsIGtleURhdGFPZmZzZXQsIHZhbHVlRGF0YU9mZnNldCkgIT09IDApIHtcbiAgICAgICAgICBjaGVja0xhc3RFcnJvcihgQ2FuJ3Qgc2V0IGEgcnVuIGNvbmZpZyBlbnRyeTogJHtrZXl9IC0gJHt2YWx1ZX0uYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBbcnVuT3B0aW9uc0hhbmRsZSwgYWxsb2NzXTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChydW5PcHRpb25zSGFuZGxlICE9PSAwKSB7XG4gICAgICB3YXNtLl9PcnRSZWxlYXNlUnVuT3B0aW9ucyhydW5PcHRpb25zSGFuZGxlKTtcbiAgICB9XG4gICAgYWxsb2NzLmZvckVhY2goKGFsbG9jKSA9PiB3YXNtLl9mcmVlKGFsbG9jKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuaW1wb3J0IHR5cGUgeyBJbmZlcmVuY2VTZXNzaW9uIH0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHsgZ2V0SW5zdGFuY2UgfSBmcm9tICcuL3dhc20tZmFjdG9yeSc7XG5pbXBvcnQgeyBhbGxvY1dhc21TdHJpbmcsIGNoZWNrTGFzdEVycm9yLCBpdGVyYXRlRXh0cmFPcHRpb25zIH0gZnJvbSAnLi93YXNtLXV0aWxzJztcblxuY29uc3QgZ2V0R3JhcGhPcHRpbXphdGlvbkxldmVsID0gKGdyYXBoT3B0aW1pemF0aW9uTGV2ZWw6IHN0cmluZyB8IHVua25vd24pOiBudW1iZXIgPT4ge1xuICBzd2l0Y2ggKGdyYXBoT3B0aW1pemF0aW9uTGV2ZWwpIHtcbiAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICByZXR1cm4gMDtcbiAgICBjYXNlICdiYXNpYyc6XG4gICAgICByZXR1cm4gMTtcbiAgICBjYXNlICdleHRlbmRlZCc6XG4gICAgICByZXR1cm4gMjtcbiAgICBjYXNlICdsYXlvdXQnOlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSAnYWxsJzpcbiAgICAgIHJldHVybiA5OTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBncmFwaCBvcHRpbWl6YXRpb24gbGV2ZWw6ICR7Z3JhcGhPcHRpbWl6YXRpb25MZXZlbH1gKTtcbiAgfVxufTtcblxuY29uc3QgZ2V0RXhlY3V0aW9uTW9kZSA9IChleGVjdXRpb25Nb2RlOiAnc2VxdWVudGlhbCcgfCAncGFyYWxsZWwnKTogbnVtYmVyID0+IHtcbiAgc3dpdGNoIChleGVjdXRpb25Nb2RlKSB7XG4gICAgY2FzZSAnc2VxdWVudGlhbCc6XG4gICAgICByZXR1cm4gMDtcbiAgICBjYXNlICdwYXJhbGxlbCc6XG4gICAgICByZXR1cm4gMTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBleGVjdXRpb24gbW9kZTogJHtleGVjdXRpb25Nb2RlfWApO1xuICB9XG59O1xuXG5jb25zdCBhcHBlbmREZWZhdWx0T3B0aW9ucyA9IChvcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zKTogdm9pZCA9PiB7XG4gIGlmICghb3B0aW9ucy5leHRyYSkge1xuICAgIG9wdGlvbnMuZXh0cmEgPSB7fTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuZXh0cmEuc2Vzc2lvbikge1xuICAgIG9wdGlvbnMuZXh0cmEuc2Vzc2lvbiA9IHt9O1xuICB9XG4gIGNvbnN0IHNlc3Npb24gPSBvcHRpb25zLmV4dHJhLnNlc3Npb24gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgaWYgKCFzZXNzaW9uLnVzZV9vcnRfbW9kZWxfYnl0ZXNfZGlyZWN0bHkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gICAgc2Vzc2lvbi51c2Vfb3J0X21vZGVsX2J5dGVzX2RpcmVjdGx5ID0gJzEnO1xuICB9XG5cbiAgLy8gaWYgdXNpbmcgSlNFUCB3aXRoIFdlYkdQVSwgYWx3YXlzIGRpc2FibGUgbWVtb3J5IHBhdHRlcm5cbiAgaWYgKFxuICAgIG9wdGlvbnMuZXhlY3V0aW9uUHJvdmlkZXJzICYmXG4gICAgb3B0aW9ucy5leGVjdXRpb25Qcm92aWRlcnMuc29tZSgoZXApID0+ICh0eXBlb2YgZXAgPT09ICdzdHJpbmcnID8gZXAgOiBlcC5uYW1lKSA9PT0gJ3dlYmdwdScpXG4gICkge1xuICAgIG9wdGlvbnMuZW5hYmxlTWVtUGF0dGVybiA9IGZhbHNlO1xuICB9XG59O1xuXG5jb25zdCBhcHBlbmRTZXNzaW9uQ29uZmlnID0gKHNlc3Npb25PcHRpb25zSGFuZGxlOiBudW1iZXIsIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBhbGxvY3M6IG51bWJlcltdKTogdm9pZCA9PiB7XG4gIGNvbnN0IGtleURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcoa2V5LCBhbGxvY3MpO1xuICBjb25zdCB2YWx1ZURhdGFPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcodmFsdWUsIGFsbG9jcyk7XG4gIGlmIChnZXRJbnN0YW5jZSgpLl9PcnRBZGRTZXNzaW9uQ29uZmlnRW50cnkoc2Vzc2lvbk9wdGlvbnNIYW5kbGUsIGtleURhdGFPZmZzZXQsIHZhbHVlRGF0YU9mZnNldCkgIT09IDApIHtcbiAgICBjaGVja0xhc3RFcnJvcihgQ2FuJ3Qgc2V0IGEgc2Vzc2lvbiBjb25maWcgZW50cnk6ICR7a2V5fSAtICR7dmFsdWV9LmApO1xuICB9XG59O1xuXG5jb25zdCBhcHBlbmRFcE9wdGlvbiA9IChlcE9wdGlvbnM6IEFycmF5PFtudW1iZXIsIG51bWJlcl0+LCBrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgYWxsb2NzOiBudW1iZXJbXSk6IHZvaWQgPT4ge1xuICBjb25zdCBrZXlEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKGtleSwgYWxsb2NzKTtcbiAgY29uc3QgdmFsdWVEYXRhT2Zmc2V0ID0gYWxsb2NXYXNtU3RyaW5nKHZhbHVlLCBhbGxvY3MpO1xuICBlcE9wdGlvbnMucHVzaChba2V5RGF0YU9mZnNldCwgdmFsdWVEYXRhT2Zmc2V0XSk7XG59O1xuXG5jb25zdCBzZXRFeGVjdXRpb25Qcm92aWRlcnMgPSBhc3luYyAoXG4gIHNlc3Npb25PcHRpb25zSGFuZGxlOiBudW1iZXIsXG4gIHNlc3Npb25PcHRpb25zOiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zLFxuICBhbGxvY3M6IG51bWJlcltdLFxuKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IGV4ZWN1dGlvblByb3ZpZGVycyA9IHNlc3Npb25PcHRpb25zLmV4ZWN1dGlvblByb3ZpZGVycyE7XG4gIGZvciAoY29uc3QgZXAgb2YgZXhlY3V0aW9uUHJvdmlkZXJzKSB7XG4gICAgbGV0IGVwTmFtZSA9IHR5cGVvZiBlcCA9PT0gJ3N0cmluZycgPyBlcCA6IGVwLm5hbWU7XG4gICAgY29uc3QgZXBPcHRpb25zOiBBcnJheTxbbnVtYmVyLCBudW1iZXJdPiA9IFtdO1xuXG4gICAgLy8gY2hlY2sgRVAgbmFtZVxuICAgIHN3aXRjaCAoZXBOYW1lKSB7XG4gICAgICBjYXNlICd3ZWJubic6XG4gICAgICAgIGVwTmFtZSA9ICdXRUJOTic7XG4gICAgICAgIGlmICh0eXBlb2YgZXAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uc3Qgd2Vibm5PcHRpb25zID0gZXAgYXMgSW5mZXJlbmNlU2Vzc2lvbi5XZWJOTkV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgICAgICAgIC8vIGNvbnN0IGNvbnRleHQgPSAod2Vibm5PcHRpb25zIGFzIEluZmVyZW5jZVNlc3Npb24uV2ViTk5PcHRpb25zV2l0aE1MQ29udGV4dCk/LmNvbnRleHQ7XG4gICAgICAgICAgY29uc3QgZGV2aWNlVHlwZSA9ICh3ZWJubk9wdGlvbnMgYXMgSW5mZXJlbmNlU2Vzc2lvbi5XZWJOTkNvbnRleHRPcHRpb25zKT8uZGV2aWNlVHlwZTtcbiAgICAgICAgICBpZiAoZGV2aWNlVHlwZSkge1xuICAgICAgICAgICAgYXBwZW5kU2Vzc2lvbkNvbmZpZyhzZXNzaW9uT3B0aW9uc0hhbmRsZSwgJ2RldmljZVR5cGUnLCBkZXZpY2VUeXBlLCBhbGxvY3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlYmdwdSc6XG4gICAgICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkge1xuICAgICAgICAgIGVwTmFtZSA9ICdXZWJHUFUnO1xuICAgICAgICAgIGxldCBjdXN0b21EZXZpY2U6IEdQVURldmljZSB8IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGlmICh0eXBlb2YgZXAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdCB3ZWJncHVPcHRpb25zID0gZXAgYXMgSW5mZXJlbmNlU2Vzc2lvbi5XZWJHcHVFeGVjdXRpb25Qcm92aWRlck9wdGlvbjtcblxuICAgICAgICAgICAgLy8gc2V0IGN1c3RvbSBHUFUgZGV2aWNlXG4gICAgICAgICAgICBpZiAod2ViZ3B1T3B0aW9ucy5kZXZpY2UpIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBHUFVEZXZpY2UgIT09ICd1bmRlZmluZWQnICYmIHdlYmdwdU9wdGlvbnMuZGV2aWNlIGluc3RhbmNlb2YgR1BVRGV2aWNlKSB7XG4gICAgICAgICAgICAgICAgY3VzdG9tRGV2aWNlID0gd2ViZ3B1T3B0aW9ucy5kZXZpY2U7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEdQVSBkZXZpY2Ugc2V0IGluIFdlYkdQVSBFUCBvcHRpb25zLicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCBncmFwaCBjYXB0dXJlIG9wdGlvbiBmcm9tIHNlc3Npb24gb3B0aW9uc1xuICAgICAgICAgICAgY29uc3QgeyBlbmFibGVHcmFwaENhcHR1cmUgfSA9IHNlc3Npb25PcHRpb25zO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbmFibGVHcmFwaENhcHR1cmUgPT09ICdib29sZWFuJyAmJiBlbmFibGVHcmFwaENhcHR1cmUpIHtcbiAgICAgICAgICAgICAgYXBwZW5kRXBPcHRpb24oZXBPcHRpb25zLCAnZW5hYmxlR3JhcGhDYXB0dXJlJywgJzEnLCBhbGxvY3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZXQgbGF5b3V0IG9wdGlvblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3ZWJncHVPcHRpb25zLnByZWZlcnJlZExheW91dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgYXBwZW5kRXBPcHRpb24oZXBPcHRpb25zLCAncHJlZmVycmVkTGF5b3V0Jywgd2ViZ3B1T3B0aW9ucy5wcmVmZXJyZWRMYXlvdXQsIGFsbG9jcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCBmb3JjZSBDUFUgZmFsbGJhY2sgbm9kZXNcbiAgICAgICAgICAgIGlmICh3ZWJncHVPcHRpb25zLmZvcmNlQ3B1Tm9kZU5hbWVzKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5hbWVzID0gQXJyYXkuaXNBcnJheSh3ZWJncHVPcHRpb25zLmZvcmNlQ3B1Tm9kZU5hbWVzKVxuICAgICAgICAgICAgICAgID8gd2ViZ3B1T3B0aW9ucy5mb3JjZUNwdU5vZGVOYW1lc1xuICAgICAgICAgICAgICAgIDogW3dlYmdwdU9wdGlvbnMuZm9yY2VDcHVOb2RlTmFtZXNdO1xuXG4gICAgICAgICAgICAgIGFwcGVuZEVwT3B0aW9uKGVwT3B0aW9ucywgJ2ZvcmNlQ3B1Tm9kZU5hbWVzJywgbmFtZXMuam9pbignXFxuJyksIGFsbG9jcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCB2YWxpZGF0aW9uIG1vZGVcbiAgICAgICAgICAgIGlmICh3ZWJncHVPcHRpb25zLnZhbGlkYXRpb25Nb2RlKSB7XG4gICAgICAgICAgICAgIGFwcGVuZEVwT3B0aW9uKGVwT3B0aW9ucywgJ3ZhbGlkYXRpb25Nb2RlJywgd2ViZ3B1T3B0aW9ucy52YWxpZGF0aW9uTW9kZSwgYWxsb2NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBpbmZvID0gZ2V0SW5zdGFuY2UoKS53ZWJncHVSZWdpc3RlckRldmljZSEoY3VzdG9tRGV2aWNlKTtcbiAgICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgY29uc3QgW2RldmljZUlkLCBpbnN0YW5jZUhhbmRsZSwgZGV2aWNlSGFuZGxlXSA9IGluZm87XG4gICAgICAgICAgICBhcHBlbmRFcE9wdGlvbihlcE9wdGlvbnMsICdkZXZpY2VJZCcsIGRldmljZUlkLnRvU3RyaW5nKCksIGFsbG9jcyk7XG4gICAgICAgICAgICBhcHBlbmRFcE9wdGlvbihlcE9wdGlvbnMsICd3ZWJncHVJbnN0YW5jZScsIGluc3RhbmNlSGFuZGxlLnRvU3RyaW5nKCksIGFsbG9jcyk7XG4gICAgICAgICAgICBhcHBlbmRFcE9wdGlvbihlcE9wdGlvbnMsICd3ZWJncHVEZXZpY2UnLCBkZXZpY2VIYW5kbGUudG9TdHJpbmcoKSwgYWxsb2NzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXBOYW1lID0gJ0pTJztcbiAgICAgICAgICBpZiAodHlwZW9mIGVwICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3Qgd2ViZ3B1T3B0aW9ucyA9IGVwIGFzIEluZmVyZW5jZVNlc3Npb24uV2ViR3B1RXhlY3V0aW9uUHJvdmlkZXJPcHRpb247XG4gICAgICAgICAgICBpZiAod2ViZ3B1T3B0aW9ucz8ucHJlZmVycmVkTGF5b3V0KSB7XG4gICAgICAgICAgICAgIGlmICh3ZWJncHVPcHRpb25zLnByZWZlcnJlZExheW91dCAhPT0gJ05DSFcnICYmIHdlYmdwdU9wdGlvbnMucHJlZmVycmVkTGF5b3V0ICE9PSAnTkhXQycpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHByZWZlcnJlZExheW91dCBtdXN0IGJlIGVpdGhlciAnTkNIVycgb3IgJ05IV0MnOiAke3dlYmdwdU9wdGlvbnMucHJlZmVycmVkTGF5b3V0fWApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFwcGVuZFNlc3Npb25Db25maWcoc2Vzc2lvbk9wdGlvbnNIYW5kbGUsICdwcmVmZXJyZWRMYXlvdXQnLCB3ZWJncHVPcHRpb25zLnByZWZlcnJlZExheW91dCwgYWxsb2NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3YXNtJzpcbiAgICAgIGNhc2UgJ2NwdSc6XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBub3Qgc3VwcG9ydGVkIGV4ZWN1dGlvbiBwcm92aWRlcjogJHtlcE5hbWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgZXBOYW1lRGF0YU9mZnNldCA9IGFsbG9jV2FzbVN0cmluZyhlcE5hbWUsIGFsbG9jcyk7XG4gICAgY29uc3QgZXBPcHRpb25zQ291bnQgPSBlcE9wdGlvbnMubGVuZ3RoO1xuICAgIGxldCBrZXlzT2Zmc2V0ID0gMDtcbiAgICBsZXQgdmFsdWVzT2Zmc2V0ID0gMDtcbiAgICBpZiAoZXBPcHRpb25zQ291bnQgPiAwKSB7XG4gICAgICBrZXlzT2Zmc2V0ID0gZ2V0SW5zdGFuY2UoKS5fbWFsbG9jKGVwT3B0aW9uc0NvdW50ICogZ2V0SW5zdGFuY2UoKS5QVFJfU0laRSk7XG4gICAgICBhbGxvY3MucHVzaChrZXlzT2Zmc2V0KTtcbiAgICAgIHZhbHVlc09mZnNldCA9IGdldEluc3RhbmNlKCkuX21hbGxvYyhlcE9wdGlvbnNDb3VudCAqIGdldEluc3RhbmNlKCkuUFRSX1NJWkUpO1xuICAgICAgYWxsb2NzLnB1c2godmFsdWVzT2Zmc2V0KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXBPcHRpb25zQ291bnQ7IGkrKykge1xuICAgICAgICBnZXRJbnN0YW5jZSgpLnNldFZhbHVlKGtleXNPZmZzZXQgKyBpICogZ2V0SW5zdGFuY2UoKS5QVFJfU0laRSwgZXBPcHRpb25zW2ldWzBdLCAnKicpO1xuICAgICAgICBnZXRJbnN0YW5jZSgpLnNldFZhbHVlKHZhbHVlc09mZnNldCArIGkgKiBnZXRJbnN0YW5jZSgpLlBUUl9TSVpFLCBlcE9wdGlvbnNbaV1bMV0sICcqJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChcbiAgICAgIChhd2FpdCBnZXRJbnN0YW5jZSgpLl9PcnRBcHBlbmRFeGVjdXRpb25Qcm92aWRlcihcbiAgICAgICAgc2Vzc2lvbk9wdGlvbnNIYW5kbGUsXG4gICAgICAgIGVwTmFtZURhdGFPZmZzZXQsXG4gICAgICAgIGtleXNPZmZzZXQsXG4gICAgICAgIHZhbHVlc09mZnNldCxcbiAgICAgICAgZXBPcHRpb25zQ291bnQsXG4gICAgICApKSAhPT0gMFxuICAgICkge1xuICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IGFwcGVuZCBleGVjdXRpb24gcHJvdmlkZXI6ICR7ZXBOYW1lfS5gKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzZXRTZXNzaW9uT3B0aW9ucyA9IGFzeW5jIChvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IFByb21pc2U8W251bWJlciwgbnVtYmVyW11dPiA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBsZXQgc2Vzc2lvbk9wdGlvbnNIYW5kbGUgPSAwO1xuICBjb25zdCBhbGxvY3M6IG51bWJlcltdID0gW107XG5cbiAgY29uc3Qgc2Vzc2lvbk9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uU2Vzc2lvbk9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBhcHBlbmREZWZhdWx0T3B0aW9ucyhzZXNzaW9uT3B0aW9ucyk7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBncmFwaE9wdGltaXphdGlvbkxldmVsID0gZ2V0R3JhcGhPcHRpbXphdGlvbkxldmVsKHNlc3Npb25PcHRpb25zLmdyYXBoT3B0aW1pemF0aW9uTGV2ZWwgPz8gJ2FsbCcpO1xuICAgIGNvbnN0IGV4ZWN1dGlvbk1vZGUgPSBnZXRFeGVjdXRpb25Nb2RlKHNlc3Npb25PcHRpb25zLmV4ZWN1dGlvbk1vZGUgPz8gJ3NlcXVlbnRpYWwnKTtcbiAgICBjb25zdCBsb2dJZERhdGFPZmZzZXQgPVxuICAgICAgdHlwZW9mIHNlc3Npb25PcHRpb25zLmxvZ0lkID09PSAnc3RyaW5nJyA/IGFsbG9jV2FzbVN0cmluZyhzZXNzaW9uT3B0aW9ucy5sb2dJZCwgYWxsb2NzKSA6IDA7XG5cbiAgICBjb25zdCBsb2dTZXZlcml0eUxldmVsID0gc2Vzc2lvbk9wdGlvbnMubG9nU2V2ZXJpdHlMZXZlbCA/PyAyOyAvLyBEZWZhdWx0IHRvIDIgLSB3YXJuaW5nXG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxvZ1NldmVyaXR5TGV2ZWwpIHx8IGxvZ1NldmVyaXR5TGV2ZWwgPCAwIHx8IGxvZ1NldmVyaXR5TGV2ZWwgPiA0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGxvZyBzZXZlcml0eSBsZXZlbCBpcyBub3QgdmFsaWQ6ICR7bG9nU2V2ZXJpdHlMZXZlbH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb2dWZXJib3NpdHlMZXZlbCA9IHNlc3Npb25PcHRpb25zLmxvZ1ZlcmJvc2l0eUxldmVsID8/IDA7IC8vIERlZmF1bHQgdG8gMCAtIHZlcmJvc2VcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobG9nVmVyYm9zaXR5TGV2ZWwpIHx8IGxvZ1ZlcmJvc2l0eUxldmVsIDwgMCB8fCBsb2dWZXJib3NpdHlMZXZlbCA+IDQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbG9nIHZlcmJvc2l0eSBsZXZlbCBpcyBub3QgdmFsaWQ6ICR7bG9nVmVyYm9zaXR5TGV2ZWx9YCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW1pemVkTW9kZWxGaWxlUGF0aE9mZnNldCA9XG4gICAgICB0eXBlb2Ygc2Vzc2lvbk9wdGlvbnMub3B0aW1pemVkTW9kZWxGaWxlUGF0aCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBhbGxvY1dhc21TdHJpbmcoc2Vzc2lvbk9wdGlvbnMub3B0aW1pemVkTW9kZWxGaWxlUGF0aCwgYWxsb2NzKVxuICAgICAgICA6IDA7XG5cbiAgICBzZXNzaW9uT3B0aW9uc0hhbmRsZSA9IHdhc20uX09ydENyZWF0ZVNlc3Npb25PcHRpb25zKFxuICAgICAgZ3JhcGhPcHRpbWl6YXRpb25MZXZlbCxcbiAgICAgICEhc2Vzc2lvbk9wdGlvbnMuZW5hYmxlQ3B1TWVtQXJlbmEsXG4gICAgICAhIXNlc3Npb25PcHRpb25zLmVuYWJsZU1lbVBhdHRlcm4sXG4gICAgICBleGVjdXRpb25Nb2RlLFxuICAgICAgISFzZXNzaW9uT3B0aW9ucy5lbmFibGVQcm9maWxpbmcsXG4gICAgICAwLFxuICAgICAgbG9nSWREYXRhT2Zmc2V0LFxuICAgICAgbG9nU2V2ZXJpdHlMZXZlbCxcbiAgICAgIGxvZ1ZlcmJvc2l0eUxldmVsLFxuICAgICAgb3B0aW1pemVkTW9kZWxGaWxlUGF0aE9mZnNldCxcbiAgICApO1xuICAgIGlmIChzZXNzaW9uT3B0aW9uc0hhbmRsZSA9PT0gMCkge1xuICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCBjcmVhdGUgc2Vzc2lvbiBvcHRpb25zLlwiKTtcbiAgICB9XG5cbiAgICBpZiAoc2Vzc2lvbk9wdGlvbnMuZXhlY3V0aW9uUHJvdmlkZXJzKSB7XG4gICAgICBhd2FpdCBzZXRFeGVjdXRpb25Qcm92aWRlcnMoc2Vzc2lvbk9wdGlvbnNIYW5kbGUsIHNlc3Npb25PcHRpb25zLCBhbGxvY3MpO1xuICAgIH1cblxuICAgIGlmIChzZXNzaW9uT3B0aW9ucy5lbmFibGVHcmFwaENhcHR1cmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzZXNzaW9uT3B0aW9ucy5lbmFibGVHcmFwaENhcHR1cmUgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGVuYWJsZUdyYXBoQ2FwdHVyZSBtdXN0IGJlIGEgYm9vbGVhbiB2YWx1ZTogJHtzZXNzaW9uT3B0aW9ucy5lbmFibGVHcmFwaENhcHR1cmV9YCk7XG4gICAgICB9XG4gICAgICBhcHBlbmRTZXNzaW9uQ29uZmlnKFxuICAgICAgICBzZXNzaW9uT3B0aW9uc0hhbmRsZSxcbiAgICAgICAgJ2VuYWJsZUdyYXBoQ2FwdHVyZScsXG4gICAgICAgIHNlc3Npb25PcHRpb25zLmVuYWJsZUdyYXBoQ2FwdHVyZS50b1N0cmluZygpLFxuICAgICAgICBhbGxvY3MsXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzZXNzaW9uT3B0aW9ucy5mcmVlRGltZW5zaW9uT3ZlcnJpZGVzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoc2Vzc2lvbk9wdGlvbnMuZnJlZURpbWVuc2lvbk92ZXJyaWRlcykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZnJlZSBkaW1lbnNpb24gb3ZlcnJpZGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nOiAke25hbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicgfHwgIU51bWJlci5pc0ludGVnZXIodmFsdWUpIHx8IHZhbHVlIDwgMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZnJlZSBkaW1lbnNpb24gb3ZlcnJpZGUgdmFsdWUgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyOiAke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWVPZmZzZXQgPSBhbGxvY1dhc21TdHJpbmcobmFtZSwgYWxsb2NzKTtcbiAgICAgICAgaWYgKHdhc20uX09ydEFkZEZyZWVEaW1lbnNpb25PdmVycmlkZShzZXNzaW9uT3B0aW9uc0hhbmRsZSwgbmFtZU9mZnNldCwgdmFsdWUpICE9PSAwKSB7XG4gICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IHNldCBhIGZyZWUgZGltZW5zaW9uIG92ZXJyaWRlOiAke25hbWV9IC0gJHt2YWx1ZX0uYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2Vzc2lvbk9wdGlvbnMuZXh0cmEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaXRlcmF0ZUV4dHJhT3B0aW9ucyhzZXNzaW9uT3B0aW9ucy5leHRyYSwgJycsIG5ldyBXZWFrU2V0PFJlY29yZDxzdHJpbmcsIHVua25vd24+PigpLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICBhcHBlbmRTZXNzaW9uQ29uZmlnKHNlc3Npb25PcHRpb25zSGFuZGxlLCBrZXksIHZhbHVlLCBhbGxvY3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtzZXNzaW9uT3B0aW9uc0hhbmRsZSwgYWxsb2NzXTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChzZXNzaW9uT3B0aW9uc0hhbmRsZSAhPT0gMCkge1xuICAgICAgaWYgKHdhc20uX09ydFJlbGVhc2VTZXNzaW9uT3B0aW9ucyhzZXNzaW9uT3B0aW9uc0hhbmRsZSkgIT09IDApIHtcbiAgICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCByZWxlYXNlIHNlc3Npb24gb3B0aW9ucy5cIik7XG4gICAgICB9XG4gICAgfVxuICAgIGFsbG9jcy5mb3JFYWNoKChhbGxvYykgPT4gd2FzbS5fZnJlZShhbGxvYykpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IFRlbnNvciB9IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5cbi8vIGEgZHVtbXkgdHlwZSBkZWNsYXJhdGlvbiBmb3IgRmxvYXQxNkFycmF5IGluIGNhc2UgYW55IHBvbHlmaWxsIGlzIGF2YWlsYWJsZS5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uYW1pbmctY29udmVudGlvbiwgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBjb25zdCBGbG9hdDE2QXJyYXk6IGFueTtcbn1cblxuLy8gVGhpcyBmaWxlIGluY2x1ZGVzIGNvbW1vbiBkZWZpbml0aW9ucy4gVGhleSBkbyBOT1QgaGF2ZSBkZXBlbmRlbmN5IG9uIHRoZSBXZWJBc3NlbWJseSBpbnN0YW5jZS5cblxuLyoqXG4gKiBDb3BpZWQgZnJvbSBPTk5YIGRlZmluaXRpb24uIFVzZSB0aGlzIHRvIGRyb3AgZGVwZW5kZW5jeSAnb25ueF9wcm90bycgdG8gZGVjcmVhc2UgY29tcGlsZWQgLmpzIGZpbGUgc2l6ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gRGF0YVR5cGUge1xuICB1bmRlZmluZWQgPSAwLFxuICBmbG9hdCA9IDEsXG4gIHVpbnQ4ID0gMixcbiAgaW50OCA9IDMsXG4gIHVpbnQxNiA9IDQsXG4gIGludDE2ID0gNSxcbiAgaW50MzIgPSA2LFxuICBpbnQ2NCA9IDcsXG4gIHN0cmluZyA9IDgsXG4gIGJvb2wgPSA5LFxuICBmbG9hdDE2ID0gMTAsXG4gIGRvdWJsZSA9IDExLFxuICB1aW50MzIgPSAxMixcbiAgdWludDY0ID0gMTMsXG4gIGNvbXBsZXg2NCA9IDE0LFxuICBjb21wbGV4MTI4ID0gMTUsXG4gIGJmbG9hdDE2ID0gMTYsXG5cbiAgLy8gNC1iaXQgZGF0YS10eXBlc1xuICB1aW50NCA9IDIxLFxuICBpbnQ0ID0gMjIsXG59XG5cbi8qKlxuICogTWFwIHN0cmluZyB0ZW5zb3IgZGF0YSB0byBlbnVtIHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JEYXRhVHlwZVN0cmluZ1RvRW51bSA9ICh0eXBlOiBzdHJpbmcpOiBEYXRhVHlwZSA9PiB7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLmludDg7XG4gICAgY2FzZSAndWludDgnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLnVpbnQ4O1xuICAgIGNhc2UgJ2Jvb2wnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLmJvb2w7XG4gICAgY2FzZSAnaW50MTYnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLmludDE2O1xuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gRGF0YVR5cGUudWludDE2O1xuICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5pbnQzMjtcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLnVpbnQzMjtcbiAgICBjYXNlICdmbG9hdDE2JzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS5mbG9hdDE2O1xuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLmZsb2F0O1xuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLmRvdWJsZTtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIERhdGFUeXBlLnN0cmluZztcbiAgICBjYXNlICdpbnQ2NCc6XG4gICAgICByZXR1cm4gRGF0YVR5cGUuaW50NjQ7XG4gICAgY2FzZSAndWludDY0JzpcbiAgICAgIHJldHVybiBEYXRhVHlwZS51aW50NjQ7XG4gICAgY2FzZSAnaW50NCc6XG4gICAgICByZXR1cm4gRGF0YVR5cGUuaW50NDtcbiAgICBjYXNlICd1aW50NCc6XG4gICAgICByZXR1cm4gRGF0YVR5cGUudWludDQ7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bnN1cHBvcnRlZCBkYXRhIHR5cGU6ICR7dHlwZX1gKTtcbiAgfVxufTtcblxuLyoqXG4gKiBNYXAgZW51bSB2YWx1ZSB0byBzdHJpbmcgdGVuc29yIGRhdGFcbiAqL1xuZXhwb3J0IGNvbnN0IHRlbnNvckRhdGFUeXBlRW51bVRvU3RyaW5nID0gKHR5cGVQcm90bzogRGF0YVR5cGUpOiBUZW5zb3IuVHlwZSA9PiB7XG4gIHN3aXRjaCAodHlwZVByb3RvKSB7XG4gICAgY2FzZSBEYXRhVHlwZS5pbnQ4OlxuICAgICAgcmV0dXJuICdpbnQ4JztcbiAgICBjYXNlIERhdGFUeXBlLnVpbnQ4OlxuICAgICAgcmV0dXJuICd1aW50OCc7XG4gICAgY2FzZSBEYXRhVHlwZS5ib29sOlxuICAgICAgcmV0dXJuICdib29sJztcbiAgICBjYXNlIERhdGFUeXBlLmludDE2OlxuICAgICAgcmV0dXJuICdpbnQxNic7XG4gICAgY2FzZSBEYXRhVHlwZS51aW50MTY6XG4gICAgICByZXR1cm4gJ3VpbnQxNic7XG4gICAgY2FzZSBEYXRhVHlwZS5pbnQzMjpcbiAgICAgIHJldHVybiAnaW50MzInO1xuICAgIGNhc2UgRGF0YVR5cGUudWludDMyOlxuICAgICAgcmV0dXJuICd1aW50MzInO1xuICAgIGNhc2UgRGF0YVR5cGUuZmxvYXQxNjpcbiAgICAgIHJldHVybiAnZmxvYXQxNic7XG4gICAgY2FzZSBEYXRhVHlwZS5mbG9hdDpcbiAgICAgIHJldHVybiAnZmxvYXQzMic7XG4gICAgY2FzZSBEYXRhVHlwZS5kb3VibGU6XG4gICAgICByZXR1cm4gJ2Zsb2F0NjQnO1xuICAgIGNhc2UgRGF0YVR5cGUuc3RyaW5nOlxuICAgICAgcmV0dXJuICdzdHJpbmcnO1xuICAgIGNhc2UgRGF0YVR5cGUuaW50NjQ6XG4gICAgICByZXR1cm4gJ2ludDY0JztcbiAgICBjYXNlIERhdGFUeXBlLnVpbnQ2NDpcbiAgICAgIHJldHVybiAndWludDY0JztcbiAgICBjYXNlIERhdGFUeXBlLmludDQ6XG4gICAgICByZXR1cm4gJ2ludDQnO1xuICAgIGNhc2UgRGF0YVR5cGUudWludDQ6XG4gICAgICByZXR1cm4gJ3VpbnQ0JztcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuc3VwcG9ydGVkIGRhdGEgdHlwZTogJHt0eXBlUHJvdG99YCk7XG4gIH1cbn07XG5cbi8qKlxuICogZ2V0IHRlbnNvciBzaXplIGluIGJ5dGVzIGJ5IHRoZSBnaXZlbiBkYXRhIHR5cGUgYW5kIGRpbWVuc2lvbnNcbiAqIEByZXR1cm5zIHNpemUgaW4gaW50ZWdlciBvciB1bmRlZmluZWQgaWYgdGhlIGRhdGEgdHlwZSBpcyBub3Qgc3VwcG9ydGVkXG4gKi9cbmV4cG9ydCBjb25zdCBjYWxjdWxhdGVUZW5zb3JTaXplSW5CeXRlcyA9IChcbiAgZGF0ZVR5cGU6IG51bWJlcixcbiAgZGltc09yU2l6ZTogcmVhZG9ubHkgbnVtYmVyW10gfCBudW1iZXIsXG4pOiBudW1iZXIgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBlbGVtZW50U2l6ZSA9IFtcbiAgICAtMSwgLy8gdW5kZWZpbmVkID0gMFxuICAgIDQsIC8vIGZsb2F0ID0gMVxuICAgIDEsIC8vIHVpbnQ4ID0gMlxuICAgIDEsIC8vIGludDggPSAzXG4gICAgMiwgLy8gdWludDE2ID0gNFxuICAgIDIsIC8vIGludDE2ID0gNVxuICAgIDQsIC8vIGludDMyID0gNlxuICAgIDgsIC8vIGludDY0ID0gN1xuICAgIC0xLCAvLyBzdHJpbmcgPSA4XG4gICAgMSwgLy8gYm9vbCA9IDlcbiAgICAyLCAvLyBmbG9hdDE2ID0gMTBcbiAgICA4LCAvLyBkb3VibGUgPSAxMVxuICAgIDQsIC8vIHVpbnQzMiA9IDEyXG4gICAgOCwgLy8gdWludDY0ID0gMTNcbiAgICAtMSwgLy8gY29tcGxleDY0ID0gMTRcbiAgICAtMSwgLy8gY29tcGxleDEyOCA9IDE1XG4gICAgLTEsIC8vIGJmbG9hdDE2ID0gMTZcbiAgICAtMSwgLy8gRkxPQVQ4RTRNM0ZOID0gMTdcbiAgICAtMSwgLy8gRkxPQVQ4RTRNM0ZOVVogPSAxOFxuICAgIC0xLCAvLyBGTE9BVDhFNU0yID0gMTlcbiAgICAtMSwgLy8gRkxPQVQ4RTVNMkZOVVogPSAyMFxuICAgIDAuNSwgLy8gdWludDQgPSAyMVxuICAgIDAuNSwgLy8gaW50NCA9IDIyXG4gIF1bZGF0ZVR5cGVdO1xuXG4gIGNvbnN0IHNpemUgPSB0eXBlb2YgZGltc09yU2l6ZSA9PT0gJ251bWJlcicgPyBkaW1zT3JTaXplIDogZGltc09yU2l6ZS5yZWR1Y2UoKGEsIGIpID0+IGEgKiBiLCAxKTtcbiAgcmV0dXJuIGVsZW1lbnRTaXplID4gMCA/IE1hdGguY2VpbChzaXplICogZWxlbWVudFNpemUpIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBnZXQgdHlwZWQgYXJyYXkgY29uc3RydWN0b3IgYnkgdGhlIGdpdmVuIHRlbnNvciB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCB0ZW5zb3JUeXBlVG9UeXBlZEFycmF5Q29uc3RydWN0b3IgPSAoXG4gIHR5cGU6IFRlbnNvci5UeXBlLFxuKTpcbiAgfCBGbG9hdDMyQXJyYXlDb25zdHJ1Y3RvclxuICB8IFVpbnQ4QXJyYXlDb25zdHJ1Y3RvclxuICB8IEludDhBcnJheUNvbnN0cnVjdG9yXG4gIHwgVWludDE2QXJyYXlDb25zdHJ1Y3RvclxuICB8IEludDE2QXJyYXlDb25zdHJ1Y3RvclxuICB8IEludDMyQXJyYXlDb25zdHJ1Y3RvclxuICB8IEJpZ0ludDY0QXJyYXlDb25zdHJ1Y3RvclxuICB8IFVpbnQ4QXJyYXlDb25zdHJ1Y3RvclxuICB8IEZsb2F0NjRBcnJheUNvbnN0cnVjdG9yXG4gIHwgVWludDMyQXJyYXlDb25zdHJ1Y3RvclxuICB8IEJpZ1VpbnQ2NEFycmF5Q29uc3RydWN0b3IgPT4ge1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdmbG9hdDE2JzpcbiAgICAgIC8vIGFsbG93IEZsb2F0MTZBcnJheSBwb2x5ZmlsbC5cbiAgICAgIHJldHVybiB0eXBlb2YgRmxvYXQxNkFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiBGbG9hdDE2QXJyYXkuZnJvbSA/IEZsb2F0MTZBcnJheSA6IFVpbnQxNkFycmF5O1xuICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheTtcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheTtcbiAgICBjYXNlICdpbnQ4JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXk7XG4gICAgY2FzZSAndWludDE2JzpcbiAgICAgIHJldHVybiBVaW50MTZBcnJheTtcbiAgICBjYXNlICdpbnQxNic6XG4gICAgICByZXR1cm4gSW50MTZBcnJheTtcbiAgICBjYXNlICdpbnQzMic6XG4gICAgICByZXR1cm4gSW50MzJBcnJheTtcbiAgICBjYXNlICdib29sJzpcbiAgICAgIHJldHVybiBVaW50OEFycmF5O1xuICAgIGNhc2UgJ2Zsb2F0NjQnOlxuICAgICAgcmV0dXJuIEZsb2F0NjRBcnJheTtcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5O1xuICAgIGNhc2UgJ2ludDY0JzpcbiAgICAgIHJldHVybiBCaWdJbnQ2NEFycmF5O1xuICAgIGNhc2UgJ3VpbnQ2NCc6XG4gICAgICByZXR1cm4gQmlnVWludDY0QXJyYXk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgdHlwZTogJHt0eXBlfWApO1xuICB9XG59O1xuXG4vKipcbiAqIE1hcCBzdHJpbmcgbG9nIGxldmVsIHRvIGludGVnZXIgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGxvZ0xldmVsU3RyaW5nVG9FbnVtID0gKGxvZ0xldmVsPzogJ3ZlcmJvc2UnIHwgJ2luZm8nIHwgJ3dhcm5pbmcnIHwgJ2Vycm9yJyB8ICdmYXRhbCcpOiBudW1iZXIgPT4ge1xuICBzd2l0Y2ggKGxvZ0xldmVsKSB7XG4gICAgY2FzZSAndmVyYm9zZSc6XG4gICAgICByZXR1cm4gMDtcbiAgICBjYXNlICdpbmZvJzpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgcmV0dXJuIDI7XG4gICAgY2FzZSAnZXJyb3InOlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSAnZmF0YWwnOlxuICAgICAgcmV0dXJuIDQ7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgbG9nZ2luZyBsZXZlbDogJHtsb2dMZXZlbH1gKTtcbiAgfVxufTtcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0ZW5zb3IgdHlwZSBpcyBzdXBwb3J0ZWQgYnkgR1BVIGJ1ZmZlclxuICovXG5leHBvcnQgY29uc3QgaXNHcHVCdWZmZXJTdXBwb3J0ZWRUeXBlID0gKHR5cGU6IFRlbnNvci5UeXBlKTogdHlwZSBpcyBUZW5zb3IuR3B1QnVmZmVyRGF0YVR5cGVzID0+XG4gIHR5cGUgPT09ICdmbG9hdDMyJyB8fFxuICB0eXBlID09PSAnZmxvYXQxNicgfHxcbiAgdHlwZSA9PT0gJ2ludDMyJyB8fFxuICB0eXBlID09PSAnaW50NjQnIHx8XG4gIHR5cGUgPT09ICd1aW50MzInIHx8XG4gIHR5cGUgPT09ICd1aW50OCcgfHxcbiAgdHlwZSA9PT0gJ2Jvb2wnIHx8XG4gIHR5cGUgPT09ICd1aW50NCcgfHxcbiAgdHlwZSA9PT0gJ2ludDQnO1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHRlbnNvciB0eXBlIGlzIHN1cHBvcnRlZCBieSBXZWJOTiBNTFRlbnNvclxuICovXG5leHBvcnQgY29uc3QgaXNNTFRlbnNvclN1cHBvcnRlZFR5cGUgPSAodHlwZTogVGVuc29yLlR5cGUpOiB0eXBlIGlzIFRlbnNvci5NTFRlbnNvckRhdGFUeXBlcyA9PlxuICB0eXBlID09PSAnZmxvYXQzMicgfHxcbiAgdHlwZSA9PT0gJ2Zsb2F0MTYnIHx8XG4gIHR5cGUgPT09ICdpbnQzMicgfHxcbiAgdHlwZSA9PT0gJ2ludDY0JyB8fFxuICB0eXBlID09PSAndWludDMyJyB8fFxuICB0eXBlID09PSAndWludDY0JyB8fFxuICB0eXBlID09PSAnaW50OCcgfHxcbiAgdHlwZSA9PT0gJ3VpbnQ4JyB8fFxuICB0eXBlID09PSAnYm9vbCcgfHxcbiAgdHlwZSA9PT0gJ3VpbnQ0JyB8fFxuICB0eXBlID09PSAnaW50NCc7XG5cbi8qKlxuICogTWFwIHN0cmluZyBkYXRhIGxvY2F0aW9uIHRvIGludGVnZXIgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGRhdGFMb2NhdGlvblN0cmluZ1RvRW51bSA9IChsb2NhdGlvbjogVGVuc29yLkRhdGFMb2NhdGlvbik6IG51bWJlciA9PiB7XG4gIHN3aXRjaCAobG9jYXRpb24pIHtcbiAgICBjYXNlICdub25lJzpcbiAgICAgIHJldHVybiAwO1xuICAgIGNhc2UgJ2NwdSc6XG4gICAgICByZXR1cm4gMTtcbiAgICBjYXNlICdjcHUtcGlubmVkJzpcbiAgICAgIHJldHVybiAyO1xuICAgIGNhc2UgJ3RleHR1cmUnOlxuICAgICAgcmV0dXJuIDM7XG4gICAgY2FzZSAnZ3B1LWJ1ZmZlcic6XG4gICAgICByZXR1cm4gNDtcbiAgICBjYXNlICdtbC10ZW5zb3InOlxuICAgICAgcmV0dXJuIDU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5zdXBwb3J0ZWQgZGF0YSBsb2NhdGlvbjogJHtsb2NhdGlvbn1gKTtcbiAgfVxufTtcblxuLyoqXG4gKiBNYXAgaW50ZWdlciBkYXRhIGxvY2F0aW9uIHRvIHN0cmluZyB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgZGF0YUxvY2F0aW9uRW51bVRvU3RyaW5nID0gKGxvY2F0aW9uOiBudW1iZXIpOiBUZW5zb3IuRGF0YUxvY2F0aW9uIHwgdW5kZWZpbmVkID0+XG4gIChbJ25vbmUnLCAnY3B1JywgJ2NwdS1waW5uZWQnLCAndGV4dHVyZScsICdncHUtYnVmZmVyJywgJ21sLXRlbnNvciddIGFzIGNvbnN0KVtsb2NhdGlvbl07XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbmltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4vd2FzbS11dGlscy1lbnYnO1xuXG4vKipcbiAqIExvYWQgYSBmaWxlIGludG8gYSBVaW50OEFycmF5LlxuICpcbiAqIEBwYXJhbSBmaWxlIC0gdGhlIGZpbGUgdG8gbG9hZC4gQ2FuIGJlIGEgVVJML3BhdGgsIGEgQmxvYiwgYW4gQXJyYXlCdWZmZXIsIG9yIGEgVWludDhBcnJheS5cbiAqIEByZXR1cm5zIGEgVWludDhBcnJheSBjb250YWluaW5nIHRoZSBmaWxlIGRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkRmlsZSA9IGFzeW5jIChmaWxlOiBzdHJpbmcgfCBCbG9iIHwgQXJyYXlCdWZmZXJMaWtlIHwgVWludDhBcnJheSk6IFByb21pc2U8VWludDhBcnJheT4gPT4ge1xuICBpZiAodHlwZW9mIGZpbGUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGlzTm9kZSkge1xuICAgICAgLy8gbG9hZCBmaWxlIGludG8gQXJyYXlCdWZmZXIgaW4gTm9kZS5qc1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyByZWFkRmlsZSB9ID0gcmVxdWlyZSgnbm9kZTpmcy9wcm9taXNlcycpO1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgcmVhZEZpbGUoZmlsZSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZS5jb2RlID09PSAnRVJSX0ZTX0ZJTEVfVE9PX0xBUkdFJykge1xuICAgICAgICAgIC8vIGZpbGUgaXMgdG9vIGxhcmdlLCB1c2UgZnMuY3JlYXRlUmVhZFN0cmVhbSBpbnN0ZWFkXG4gICAgICAgICAgY29uc3QgeyBjcmVhdGVSZWFkU3RyZWFtIH0gPSByZXF1aXJlKCdub2RlOmZzJyk7XG4gICAgICAgICAgY29uc3Qgc3RyZWFtID0gY3JlYXRlUmVhZFN0cmVhbShmaWxlKTtcbiAgICAgICAgICBjb25zdCBjaHVua3M6IFVpbnQ4QXJyYXlbXSA9IFtdO1xuICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2Ygc3RyZWFtKSB7XG4gICAgICAgICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShCdWZmZXIuY29uY2F0KGNodW5rcykpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxvYWQgZmlsZSBpbnRvIEFycmF5QnVmZmVyIGluIGJyb3dzZXJzXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZpbGUpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBsb2FkIGV4dGVybmFsIGRhdGEgZmlsZTogJHtmaWxlfWApO1xuICAgICAgfVxuICAgICAgY29uc3QgY29udGVudExlbmd0aEhlYWRlciA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LUxlbmd0aCcpO1xuICAgICAgY29uc3QgZmlsZVNpemUgPSBjb250ZW50TGVuZ3RoSGVhZGVyID8gcGFyc2VJbnQoY29udGVudExlbmd0aEhlYWRlciwgMTApIDogMDtcbiAgICAgIGlmIChmaWxlU2l6ZSA8IDEwNzM3NDE4MjQgLyogMUdCICovKSB7XG4gICAgICAgIC8vIHdoZW4gQ29udGVudC1MZW5ndGggaGVhZGVyIGlzIG5vdCBzZXQsIHdlIGNhbm5vdCBkZXRlcm1pbmUgdGhlIGZpbGUgc2l6ZS4gV2UgYXNzdW1lIGl0IGlzIHNtYWxsIGVub3VnaCB0b1xuICAgICAgICAvLyBsb2FkIGludG8gbWVtb3J5LlxuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmaWxlIGlzIHRvbyBsYXJnZSwgdXNlIHN0cmVhbSBpbnN0ZWFkXG4gICAgICAgIGlmICghcmVzcG9uc2UuYm9keSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZmFpbGVkIHRvIGxvYWQgZXh0ZXJuYWwgZGF0YSBmaWxlOiAke2ZpbGV9LCBubyByZXNwb25zZSBib2R5LmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IHJlc3BvbnNlLmJvZHkuZ2V0UmVhZGVyKCk7XG5cbiAgICAgICAgbGV0IGJ1ZmZlcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0cnkgdG8gY3JlYXRlIEFycmF5QnVmZmVyIGRpcmVjdGx5XG4gICAgICAgICAgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGZpbGVTaXplKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgUmFuZ2VFcnJvcikge1xuICAgICAgICAgICAgLy8gdXNlIFdlYkFzc2VtYmx5IE1lbW9yeSB0byBhbGxvY2F0ZSBsYXJnZXIgQXJyYXlCdWZmZXJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VzID0gTWF0aC5jZWlsKGZpbGVTaXplIC8gNjU1MzYpO1xuICAgICAgICAgICAgYnVmZmVyID0gbmV3IFdlYkFzc2VtYmx5Lk1lbW9yeSh7IGluaXRpYWw6IHBhZ2VzLCBtYXhpbXVtOiBwYWdlcyB9KS5idWZmZXI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgY29uc3QgeyBkb25lLCB2YWx1ZSB9ID0gYXdhaXQgcmVhZGVyLnJlYWQoKTtcbiAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGNodW5rU2l6ZSA9IHZhbHVlLmJ5dGVMZW5ndGg7XG4gICAgICAgICAgY29uc3QgY2h1bmsgPSBuZXcgVWludDhBcnJheShidWZmZXIsIG9mZnNldCwgY2h1bmtTaXplKTtcbiAgICAgICAgICBjaHVuay5zZXQodmFsdWUpO1xuICAgICAgICAgIG9mZnNldCArPSBjaHVua1NpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJ1ZmZlciwgMCwgZmlsZVNpemUpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChmaWxlIGluc3RhbmNlb2YgQmxvYikge1xuICAgIHJldHVybiBuZXcgVWludDhBcnJheShhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCkpO1xuICB9IGVsc2UgaWYgKGZpbGUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgcmV0dXJuIGZpbGU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGZpbGUpO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBUZW5zb3IgfSBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuXG5pbXBvcnQgeyB0ZW5zb3JUeXBlVG9UeXBlZEFycmF5Q29uc3RydWN0b3IgfSBmcm9tICcuLi93YXNtLWNvbW1vbic7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVWaWV3ID0gKFxuICBkYXRhQnVmZmVyOiBBcnJheUJ1ZmZlcixcbiAgdHlwZTogVGVuc29yLlR5cGUsXG4pOlxuICB8IEludDMyQXJyYXlcbiAgfCBVaW50MzJBcnJheVxuICB8IEJpZ0ludDY0QXJyYXlcbiAgfCBCaWdVaW50NjRBcnJheVxuICB8IFVpbnQ4QXJyYXlcbiAgfCBGbG9hdDMyQXJyYXlcbiAgfCBGbG9hdDY0QXJyYXlcbiAgfCBJbnQ4QXJyYXlcbiAgfCBJbnQxNkFycmF5XG4gIHwgVWludDE2QXJyYXkgPT4gbmV3ICh0ZW5zb3JUeXBlVG9UeXBlZEFycmF5Q29uc3RydWN0b3IodHlwZSkpKGRhdGFCdWZmZXIpO1xuXG4vKipcbiAqIGEgVGVuc29yVmlldyBkb2VzIG5vdCBvd24gdGhlIGRhdGEuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yVmlldyB7XG4gIHJlYWRvbmx5IGRhdGE6IG51bWJlcjtcbiAgcmVhZG9ubHkgZGF0YVR5cGU6IG51bWJlcjtcbiAgcmVhZG9ubHkgZGltczogcmVhZG9ubHkgbnVtYmVyW107XG5cbiAgLyoqXG4gICAqIGdldCBhIEZsb2F0MTZBcnJheSBkYXRhIHZpZXcgb2YgdGhlIHRlbnNvciBkYXRhLiB0ZW5zb3IgZGF0YSBtdXN0IGJlIG9uIENQVS5cbiAgICovXG4gIGdldFVpbnQxNkFycmF5KCk6IFVpbnQxNkFycmF5O1xuXG4gIC8qKlxuICAgKiBnZXQgYSBGbG9hdDMyQXJyYXkgZGF0YSB2aWV3IG9mIHRoZSB0ZW5zb3IgZGF0YS4gdGVuc29yIGRhdGEgbXVzdCBiZSBvbiBDUFUuXG4gICAqL1xuICBnZXRGbG9hdDMyQXJyYXkoKTogRmxvYXQzMkFycmF5O1xuXG4gIC8qKlxuICAgKiBnZXQgYSBCaWdJbnQ2NEFycmF5IGRhdGEgdmlldyBvZiB0aGUgdGVuc29yIGRhdGEuIHRlbnNvciBkYXRhIG11c3QgYmUgb24gQ1BVLlxuICAgKi9cbiAgZ2V0QmlnSW50NjRBcnJheSgpOiBCaWdJbnQ2NEFycmF5O1xuXG4gIC8qKlxuICAgKiBnZXQgYSBJbnQzMkFycmF5IGRhdGEgdmlldyBvZiB0aGUgdGVuc29yIGRhdGEuIHRlbnNvciBkYXRhIG11c3QgYmUgb24gQ1BVLlxuICAgKi9cbiAgZ2V0SW50MzJBcnJheSgpOiBJbnQzMkFycmF5O1xuXG4gIC8qKlxuICAgKiBnZXQgYSBVaW50MTZBcnJheSBkYXRhIHZpZXcgb2YgdGhlIHRlbnNvciBkYXRhLiB0ZW5zb3IgZGF0YSBtdXN0IGJlIG9uIENQVS5cbiAgICovXG4gIGdldFVpbnQxNkFycmF5KCk6IFVpbnQxNkFycmF5O1xuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBuZXcgdGVuc29yIHZpZXcgd2l0aCB0aGUgc2FtZSBkYXRhIGJ1dCBkaWZmZXJlbnQgZGltZW5zaW9ucy5cbiAgICovXG4gIHJlc2hhcGUobmV3RGltczogcmVhZG9ubHkgbnVtYmVyW10pOiBUZW5zb3JWaWV3O1xufVxuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBFbnYgfSBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuXG5pbXBvcnQgeyBsb2dMZXZlbFN0cmluZ1RvRW51bSB9IGZyb20gJy4uL3dhc20tY29tbW9uJztcblxudHlwZSBMb2dMZXZlbCA9IE5vbk51bGxhYmxlPEVudlsnbG9nTGV2ZWwnXT47XG50eXBlIE1lc3NhZ2VTdHJpbmcgPSBzdHJpbmc7XG50eXBlIE1lc3NhZ2VGdW5jdGlvbiA9ICgpID0+IHN0cmluZztcbnR5cGUgTWVzc2FnZSA9IE1lc3NhZ2VTdHJpbmcgfCBNZXNzYWdlRnVuY3Rpb247XG5cbmNvbnN0IGxvZ0xldmVsUHJlZml4ID0gWydWJywgJ0knLCAnVycsICdFJywgJ0YnXTtcblxuY29uc3QgZG9Mb2cgPSAobGV2ZWw6IG51bWJlciwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUubG9nKGBbJHtsb2dMZXZlbFByZWZpeFtsZXZlbF19LCR7bmV3IERhdGUoKS50b0lTT1N0cmluZygpfV0ke21lc3NhZ2V9YCk7XG59O1xuXG5sZXQgY29uZmlnTG9nTGV2ZWw6IExvZ0xldmVsIHwgdW5kZWZpbmVkO1xubGV0IGRlYnVnOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgY29uc3QgY29uZmlndXJlTG9nZ2VyID0gKCRjb25maWdMb2dMZXZlbDogTG9nTGV2ZWwsICRkZWJ1ZzogYm9vbGVhbik6IHZvaWQgPT4ge1xuICBjb25maWdMb2dMZXZlbCA9ICRjb25maWdMb2dMZXZlbDtcbiAgZGVidWcgPSAkZGVidWc7XG59O1xuXG4vKipcbiAqIEEgc2ltcGxlIGxvZ2dpbmcgdXRpbGl0eSB0byBsb2cgbWVzc2FnZXMgdG8gdGhlIGNvbnNvbGUuXG4gKi9cbmV4cG9ydCBjb25zdCBMT0cgPSAobG9nTGV2ZWw6IExvZ0xldmVsLCBtc2c6IE1lc3NhZ2UpOiB2b2lkID0+IHtcbiAgY29uc3QgbWVzc2FnZUxldmVsID0gbG9nTGV2ZWxTdHJpbmdUb0VudW0obG9nTGV2ZWwpO1xuICBjb25zdCBjb25maWdMZXZlbCA9IGxvZ0xldmVsU3RyaW5nVG9FbnVtKGNvbmZpZ0xvZ0xldmVsKTtcbiAgaWYgKG1lc3NhZ2VMZXZlbCA+PSBjb25maWdMZXZlbCkge1xuICAgIGRvTG9nKG1lc3NhZ2VMZXZlbCwgdHlwZW9mIG1zZyA9PT0gJ2Z1bmN0aW9uJyA/IG1zZygpIDogbXNnKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBIHNpbXBsZSBsb2dnaW5nIHV0aWxpdHkgdG8gbG9nIG1lc3NhZ2VzIHRvIHRoZSBjb25zb2xlLiBPbmx5IGxvZ3Mgd2hlbiBkZWJ1ZyBpcyBlbmFibGVkLlxuICovXG5leHBvcnQgY29uc3QgTE9HX0RFQlVHOiB0eXBlb2YgTE9HID0gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8dHlwZW9mIExPRz4pID0+IHtcbiAgaWYgKGRlYnVnKSB7XG4gICAgTE9HKC4uLmFyZ3MpO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBXZWJOTkJhY2tlbmQgfSBmcm9tICcuLi9iYWNrZW5kLXdlYm5uJztcbmltcG9ydCB7IHRlbnNvclR5cGVUb1R5cGVkQXJyYXlDb25zdHJ1Y3RvciB9IGZyb20gJy4uLy4uL3dhc20tY29tbW9uJztcbmltcG9ydCB7IExPR19ERUJVRyB9IGZyb20gJy4uL2xvZyc7XG5cbi8vIFdlYk5OIEFQSSBjdXJyZW50bHkgZG9lcyBub3QgaGF2ZSBhIFR5cGVTY3JpcHQgZGVmaW5pdGlvbiBmaWxlLiBUaGlzIGZpbGUgaXMgYSB3b3JrYXJvdW5kIHdpdGggdHlwZXMgZ2VuZXJhdGVkIGZyb21cbi8vIFdlYk5OIEFQSSBzcGVjaWZpY2F0aW9uLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYm1hY2hpbmVsZWFybmluZy93ZWJubi9pc3N1ZXMvNjc3XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwid2Vibm4uZC50c1wiIC8+XG5cbi8qKlxuICogTWFwIGZyb20gTUxPcGVyYW5kRGF0YVR5cGUgdG8gc2l6ZSBpbiBiaXRzLiBVc2luZyBiaXRzIGluc3RlYWQgb2YgYnl0ZXMgdG8gYXZvaWQgcG9zc2libGUgcHJlY2lzaW9uIGxvc3Mgb24gaW50NCBhbmQgdWludDQuXG4gKi9cbmNvbnN0IHdlYm5uRGF0YVR5cGVUb1NpemUgPSBuZXcgTWFwPE1MT3BlcmFuZERhdGFUeXBlLCBudW1iZXI+KFtcbiAgWydmbG9hdDMyJywgMzJdLFxuICBbJ2Zsb2F0MTYnLCAxNl0sXG4gIFsnaW50MzInLCAzMl0sXG4gIFsndWludDMyJywgMzJdLFxuICBbJ2ludDY0JywgNjRdLFxuICBbJ3VpbnQ2NCcsIDY0XSxcbiAgWydpbnQ4JywgOF0sXG4gIFsndWludDgnLCA4XSxcbiAgWydpbnQ0JywgNF0sXG4gIFsndWludDQnLCA0XSxcbl0pO1xuXG4vLyBDb252ZXJ0IGludGVnZXIgZGF0YSB0byBhbiBJbnQzMkFycmF5IGJ1ZmZlci5cbi8vIFN1cHBvcnRzIGNvbnZlcnNpb24gZnJvbSBpbnQ2NCwgdWludDY0LCB1aW50MzIsIGludDggYW5kIHVpbnQ4IHRvIGludDMyLlxuZXhwb3J0IGNvbnN0IGNvbnZlcnREYXRhVG9JbnQzMiA9IChkYXRhOiBVaW50OEFycmF5LCBkYXRhVHlwZTogTUxPcGVyYW5kRGF0YVR5cGUpOiBVaW50OEFycmF5ID0+IHtcbiAgaWYgKGRhdGFUeXBlID09PSAnaW50MzInKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBkYXRhVHlwZVNpemUgPSB3ZWJubkRhdGFUeXBlVG9TaXplLmdldChkYXRhVHlwZSk7XG4gIGlmICghZGF0YVR5cGVTaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBXZWJOTiBiYWNrZW5kIGRvZXMgbm90IHN1cHBvcnQgZGF0YSB0eXBlOiAke2RhdGFUeXBlfWApO1xuICB9XG4gIGNvbnN0IGJ5dGVzUGVyRWxlbWVudCA9IGRhdGFUeXBlU2l6ZSAvIDg7XG4gIC8vIE1ha2Ugc3VyZSB0aGUgZGF0YSBsZW5ndGggaXMgYSBtdWx0aXBsZSBvZiB0aGUgZGF0YSB0eXBlIHNpemUuXG4gIGlmIChkYXRhLmJ5dGVMZW5ndGggJSBieXRlc1BlckVsZW1lbnQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgVWludDhBcnJheSBsZW5ndGggLSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgJHtieXRlc1BlckVsZW1lbnR9LmApO1xuICB9XG5cbiAgLy8gQ29udmVydCBVaW50OEFycmF5IHRvIG9yaWdpbmFsIHR5cGVkIGFycmF5LlxuICBjb25zdCBudW1FbGVtZW50cyA9IGRhdGEuYnl0ZUxlbmd0aCAvIGJ5dGVzUGVyRWxlbWVudDtcbiAgY29uc3Qgb3JpZ2luYWxBcnJheSA9IG5ldyAodGVuc29yVHlwZVRvVHlwZWRBcnJheUNvbnN0cnVjdG9yKGRhdGFUeXBlKSkoZGF0YS5idWZmZXIsIGRhdGEuYnl0ZU9mZnNldCwgbnVtRWxlbWVudHMpO1xuXG4gIHN3aXRjaCAoZGF0YVR5cGUpIHtcbiAgICBjYXNlICdpbnQ2NCc6XG4gICAgY2FzZSAndWludDY0Jzoge1xuICAgICAgLy8gQ29udmVydCBvcmlnaW5hbCB0eXBlZCBhcnJheSB0byBJbnQzMkFycmF5LlxuICAgICAgY29uc3QgaW50MzJBcnJheSA9IG5ldyBJbnQzMkFycmF5KG51bUVsZW1lbnRzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRWxlbWVudHM7IGkrKykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IG9yaWdpbmFsQXJyYXlbaV07XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIG92ZXJmbG93LlxuICAgICAgICBpZiAodmFsdWUgPiAyMTQ3NDgzNjQ3biB8fCB2YWx1ZSA8IC0yMTQ3NDgzNjQ4bikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuIG5vdCBjb252ZXJ0IGludDY0IGRhdGEgdG8gaW50MzIgLSB2YWx1ZSBvdXQgb2YgcmFuZ2UuYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnQzMkFycmF5W2ldID0gTnVtYmVyKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGludDMyQXJyYXkuYnVmZmVyKTtcbiAgICB9XG4gICAgY2FzZSAnaW50OCc6XG4gICAgY2FzZSAndWludDgnOlxuICAgIGNhc2UgJ3VpbnQzMic6IHtcbiAgICAgIC8vIENoZWNrIGZvciBvdmVyZmxvdy5cbiAgICAgIGlmIChkYXRhVHlwZSA9PT0gJ3VpbnQzMicpIHtcbiAgICAgICAgaWYgKG9yaWdpbmFsQXJyYXkuc29tZSgodmFsdWUpID0+IHZhbHVlID4gMjE0NzQ4MzY0NykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbiBub3QgY29udmVydCB1aW50MzIgZGF0YSB0byBpbnQzMiAtIHZhbHVlIG91dCBvZiByYW5nZS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ29udmVydCBvcmlnaW5hbCB0eXBlZCBhcnJheSB0byBJbnQzMkFycmF5LlxuICAgICAgY29uc3QgaW50MzJBcnJheSA9IEludDMyQXJyYXkuZnJvbShvcmlnaW5hbEFycmF5LCBOdW1iZXIpO1xuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGludDMyQXJyYXkuYnVmZmVyKTtcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGF0YSBjb252ZXJzaW9uIGZyb20gJHtkYXRhVHlwZX0gdG8gJ2ludDMyJ2ApO1xuICB9XG59O1xuXG4vLyBDb252ZXJ0IEludDMyQXJyYXkgZGF0YSB0byBvcmlnaW5hbCBpbnRlZ2VyIGRhdGEgYnVmZmVyLlxuLy8gU3VwcG9ydHMgY29udmVyc2lvbiBmcm9tIGludDMyIHRvIGludDY0LCB1aW50NjQsIHVpbnQzMiwgaW50OCBhbmQgdWludDguXG5leHBvcnQgY29uc3QgY29udmVydEludDMyVG9EYXRhID0gKGRhdGE6IFVpbnQ4QXJyYXksIGRhdGFUeXBlOiBNTE9wZXJhbmREYXRhVHlwZSk6IFVpbnQ4QXJyYXkgPT4ge1xuICBpZiAoZGF0YVR5cGUgPT09ICdpbnQzMicpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8vIE1ha2Ugc3VyZSB0aGUgZGF0YSBsZW5ndGggaXMgYSBtdWx0aXBsZSBvZiA0IGJ5dGVzIChJbnQzMkFycmF5KS5cbiAgaWYgKGRhdGEuYnl0ZUxlbmd0aCAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVWludDhBcnJheSBsZW5ndGggLSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCAoaW50MzIpLicpO1xuICB9XG5cbiAgLy8gQ29udmVydCBVaW50OEFycmF5IHRvIEludDMyQXJyYXkuXG4gIGNvbnN0IG51bUVsZW1lbnRzID0gZGF0YS5ieXRlTGVuZ3RoIC8gNDtcbiAgY29uc3QgaW50MzJBcnJheSA9IG5ldyBJbnQzMkFycmF5KGRhdGEuYnVmZmVyLCBkYXRhLmJ5dGVPZmZzZXQsIG51bUVsZW1lbnRzKTtcblxuICBzd2l0Y2ggKGRhdGFUeXBlKSB7XG4gICAgY2FzZSAnaW50NjQnOiB7XG4gICAgICBjb25zdCBiaWdJbnQ2NEFycmF5ID0gQmlnSW50NjRBcnJheS5mcm9tKGludDMyQXJyYXksIEJpZ0ludCk7XG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYmlnSW50NjRBcnJheS5idWZmZXIpO1xuICAgIH1cbiAgICBjYXNlICd1aW50NjQnOiB7XG4gICAgICBpZiAoaW50MzJBcnJheS5zb21lKCh2YWx1ZSkgPT4gdmFsdWUgPCAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY29udmVydCBpbnQzMiBkYXRhIHRvIHVpbjY0IC0gbmVnYXRpdmUgdmFsdWUgZm91bmQuJyk7XG4gICAgICB9XG4gICAgICBjb25zdCBiaWdVaW50NjRBcnJheSA9IEJpZ1VpbnQ2NEFycmF5LmZyb20oaW50MzJBcnJheSwgQmlnSW50KTtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShiaWdVaW50NjRBcnJheS5idWZmZXIpO1xuICAgIH1cbiAgICBjYXNlICdpbnQ4Jzoge1xuICAgICAgaWYgKGludDMyQXJyYXkuc29tZSgodmFsdWUpID0+IHZhbHVlIDwgLTEyOCB8fCB2YWx1ZSA+IDEyNykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGNvbnZlcnQgaW50MzIgZGF0YSB0byBpbnQ4IC0gdmFsdWUgb3V0IG9mIHJhbmdlLicpO1xuICAgICAgfVxuICAgICAgY29uc3QgaW50OEFycmF5ID0gSW50OEFycmF5LmZyb20oaW50MzJBcnJheSwgTnVtYmVyKTtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShpbnQ4QXJyYXkuYnVmZmVyKTtcbiAgICB9XG4gICAgY2FzZSAndWludDgnOiB7XG4gICAgICBpZiAoaW50MzJBcnJheS5zb21lKCh2YWx1ZSkgPT4gdmFsdWUgPCAwIHx8IHZhbHVlID4gMjU1KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY29udmVydCBpbnQzMiBkYXRhIHRvIHVpbnQ4IC0gdmFsdWUgb3V0IG9mIHJhbmdlLicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkuZnJvbShpbnQzMkFycmF5LCBOdW1iZXIpO1xuICAgIH1cbiAgICBjYXNlICd1aW50MzInOiB7XG4gICAgICBpZiAoaW50MzJBcnJheS5zb21lKCh2YWx1ZSkgPT4gdmFsdWUgPCAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY29udmVydCBpbnQzMiBkYXRhIHRvIHVpbnQzMiAtIG5lZ2F0aXZlIHZhbHVlIGZvdW5kLicpO1xuICAgICAgfVxuICAgICAgY29uc3QgdWludDMyQXJyYXkgPSBVaW50MzJBcnJheS5mcm9tKGludDMyQXJyYXksIE51bWJlcik7XG4gICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodWludDMyQXJyYXkuYnVmZmVyKTtcbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGF0YSBjb252ZXJzaW9uIGZyb20gJ2ludDMyJyB0byAke2RhdGFUeXBlfWApO1xuICB9XG59O1xuXG5leHBvcnQgdHlwZSBUZW5zb3JJZCA9IG51bWJlcjtcblxuLyoqXG4gKiBNYW5hZ2VzIFRlbnNvcklkIHRvIE1MVGVuc29yIG1hcHBpbmcuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGVuc29yTWFuYWdlciB7XG4gIC8qKlxuICAgKiBSZXNlcnZlIGEgbmV3IFRlbnNvcklkLlxuICAgKi9cbiAgcmVzZXJ2ZVRlbnNvcklkKCk6IFRlbnNvcklkO1xuICAvKipcbiAgICogUmVsZWFzZSBhIFRlbnNvcklkLlxuICAgKi9cbiAgcmVsZWFzZVRlbnNvcklkKHRlbnNvcklkOiBUZW5zb3JJZCk6IHZvaWQ7XG4gIC8qKlxuICAgKiBFbnN1cmUgYSBNTFRlbnNvciBpcyBjcmVhdGVkIGZvciB0aGUgVGVuc29ySWQuXG4gICAqL1xuICBlbnN1cmVUZW5zb3IoXG4gICAgc2Vzc2lvbklkOiBudW1iZXIsXG4gICAgdGVuc29ySWQ6IFRlbnNvcklkLFxuICAgIGRhdGFUeXBlOiBNTE9wZXJhbmREYXRhVHlwZSxcbiAgICBzaGFwZTogcmVhZG9ubHkgbnVtYmVyW10sXG4gICAgY29weU9sZDogYm9vbGVhbixcbiAgKTogUHJvbWlzZTxNTFRlbnNvcj47XG4gIC8qKlxuICAgKiBVcGxvYWQgZGF0YSB0byBhIE1MVGVuc29yLlxuICAgKi9cbiAgdXBsb2FkKHRlbnNvcklkOiBUZW5zb3JJZCwgZGF0YTogVWludDhBcnJheSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBEb3dubG9hZCBkYXRhIGZyb20gYSBNTFRlbnNvci5cbiAgICovXG4gIGRvd25sb2FkKHRlbnNvcklkOiBUZW5zb3JJZCk6IFByb21pc2U8QXJyYXlCdWZmZXI+O1xuICBkb3dubG9hZCh0ZW5zb3JJZDogVGVuc29ySWQsIGRzdFRlbnNvcjogQXJyYXlCdWZmZXJWaWV3IHwgQXJyYXlCdWZmZXIpOiBQcm9taXNlPHVuZGVmaW5lZD47XG4gIC8qKlxuICAgKiBSZWxlYXNlIGFsbCB0ZW5zb3JzIGZvciBhIGdpdmVuIHNlc3Npb24uXG4gICAqL1xuICByZWxlYXNlVGVuc29yc0ZvclNlc3Npb24oc2Vzc2lvbjogbnVtYmVyKTogdm9pZDtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGV4dGVybmFsbHkgY3JlYXRlZCBNTFRlbnNvciB3aXRoIGEgZ2l2ZW4gc2Vzc2lvbiBpZCBhbmQgcmV0dXJuIGEgVGVuc29ySWQuXG4gICAqL1xuICByZWdpc3RlclRlbnNvcihzZXNzaW9uSWQ6IG51bWJlciwgbWxUZW5zb3I6IE1MVGVuc29yLCBkYXRhVHlwZTogTUxPcGVyYW5kRGF0YVR5cGUsIHNoYXBlOiBudW1iZXJbXSk6IFRlbnNvcklkO1xufVxuXG5sZXQgdGVuc29yR3VpZCA9IDE7XG5jb25zdCBjcmVhdGVOZXdUZW5zb3JJZCA9ICgpOiBUZW5zb3JJZCA9PiB0ZW5zb3JHdWlkKys7XG5cbi8qKlxuICogTWFwIGZyb20gZGF0YSB0eXBlIHRvIGZhbGxiYWNrIGRhdGEgdHlwZS5cbiAqIFdoZW4gdGhlIGNvbnRleHQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgb3JpZ2luYWwgZGF0YSB0eXBlLCB1c2UgZmFsbGJhY2sgZGF0YSB0eXBlIGFzIHdvcmthcm91bmQuXG4gKiBOb3RlOiBDdXJyZW50bHksIHdlIG9ubHkgc3VwcG9ydCBmYWxsYmFjayB0byBpbnQzMiBmb3IgY2VydGFpbiBpbnRlZ2VyIGRhdGEgdHlwZXMuXG4gKi9cbmNvbnN0IHdlYm5uRGF0YVR5cGVUb0ZhbGxiYWNrID0gbmV3IE1hcDxNTE9wZXJhbmREYXRhVHlwZSwgTUxPcGVyYW5kRGF0YVR5cGU+KFtcbiAgWydpbnQ4JywgJ2ludDMyJ10sXG4gIFsndWludDgnLCAnaW50MzInXSxcbiAgWyd1aW50MzInLCAnaW50MzInXSxcbiAgWydpbnQ2NCcsICdpbnQzMiddLFxuXSk7XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBieXRlIGxlbmd0aCBvZiBhIHRlbnNvciB3aXRoIHRoZSBnaXZlbiBkYXRhIHR5cGUgYW5kIHNoYXBlLlxuICovXG5jb25zdCBjYWxjdWxhdGVCeXRlTGVuZ3RoID0gKGRhdGFUeXBlOiBNTE9wZXJhbmREYXRhVHlwZSwgc2hhcGU6IHJlYWRvbmx5IG51bWJlcltdKTogbnVtYmVyID0+IHtcbiAgY29uc3QgZGF0YVR5cGVTaXplID0gd2Vibm5EYXRhVHlwZVRvU2l6ZS5nZXQoZGF0YVR5cGUpO1xuICBpZiAoIWRhdGFUeXBlU2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgV2ViTk4gYmFja2VuZCBkb2VzIG5vdCBzdXBwb3J0IGRhdGEgdHlwZTogJHtkYXRhVHlwZX1gKTtcbiAgfVxuICByZXR1cm4gc2hhcGUubGVuZ3RoID4gMCA/IE1hdGguY2VpbCgoc2hhcGUucmVkdWNlKChhLCBiKSA9PiBhICogYikgKiBkYXRhVHlwZVNpemUpIC8gOCkgOiAwO1xufTtcblxuLyoqXG4gKiBUZW5zb3JXcmFwcGVyIHdyYXBzIGFuIE1MVGVuc29yIGFuZCBwcm92aWRlcyBhIHdheSB0byB0cmFjayB0aGUgbGFzdCBzZXNzaW9uIHRoYXQgdXNlZCBpdC5cbiAqL1xuY2xhc3MgVGVuc29yV3JhcHBlciB7XG4gIC8vIFRoZSBpZCBvZiB0aGUgbGFzdCBzZXNzaW9uIHRoYXQgdXNlZCB0aGlzIHRlbnNvci5cbiAgcHVibGljIHNlc3Npb25JZDogbnVtYmVyO1xuICAvLyBUaGlzIGZsYWcgaXMgdXNlZCB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoZSBkYXRhIGhhcyBiZWVuIGNvbnZlcnRlZCB0byBmYWxsYmFjayBkYXRhIHR5cGUuXG4gIHB1YmxpYyBpc0RhdGFDb252ZXJ0ZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIG1sQ29udGV4dDogTUxDb250ZXh0O1xuICBwcml2YXRlIG1sVGVuc29yOiBNTFRlbnNvcjtcbiAgcHJpdmF0ZSBkYXRhVHlwZTogTUxPcGVyYW5kRGF0YVR5cGU7XG4gIC8vIEZhbGxiYWNrIGRhdGEgdHlwZSB0byB1c2Ugd2hlbiB0aGUgY29udGV4dCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBvcmlnaW5hbCBkYXRhIHR5cGUuXG4gIHByaXZhdGUgZmFsbGJhY2tEYXRhVHlwZTogTUxPcGVyYW5kRGF0YVR5cGUgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgdGVuc29yU2hhcGU6IHJlYWRvbmx5IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc2NyaXB0b3I6IHtcbiAgICBzZXNzaW9uSWQ6IG51bWJlcjtcbiAgICBjb250ZXh0OiBNTENvbnRleHQ7XG4gICAgdGVuc29yOiBNTFRlbnNvcjtcbiAgICBkYXRhVHlwZTogTUxPcGVyYW5kRGF0YVR5cGU7XG4gICAgc2hhcGU6IHJlYWRvbmx5IG51bWJlcltdO1xuICAgIGZhbGxiYWNrRGF0YVR5cGU/OiBNTE9wZXJhbmREYXRhVHlwZTtcbiAgfSkge1xuICAgIGNvbnN0IHsgc2Vzc2lvbklkLCBjb250ZXh0LCB0ZW5zb3IsIGRhdGFUeXBlLCBzaGFwZSwgZmFsbGJhY2tEYXRhVHlwZSB9ID0gZGVzY3JpcHRvcjtcbiAgICB0aGlzLnNlc3Npb25JZCA9IHNlc3Npb25JZDtcbiAgICB0aGlzLm1sQ29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5tbFRlbnNvciA9IHRlbnNvcjtcbiAgICB0aGlzLmRhdGFUeXBlID0gZGF0YVR5cGU7XG4gICAgdGhpcy50ZW5zb3JTaGFwZSA9IHNoYXBlO1xuICAgIHRoaXMuZmFsbGJhY2tEYXRhVHlwZSA9IGZhbGxiYWNrRGF0YVR5cGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHRlbnNvcigpOiBNTFRlbnNvciB7XG4gICAgcmV0dXJuIHRoaXMubWxUZW5zb3I7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHR5cGUoKTogTUxPcGVyYW5kRGF0YVR5cGUge1xuICAgIHJldHVybiB0aGlzLmRhdGFUeXBlO1xuICB9XG5cbiAgcHVibGljIGdldCBmYWxsYmFja1R5cGUoKTogTUxPcGVyYW5kRGF0YVR5cGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmZhbGxiYWNrRGF0YVR5cGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHNoYXBlKCk6IHJlYWRvbmx5IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy50ZW5zb3JTaGFwZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYnl0ZUxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiBjYWxjdWxhdGVCeXRlTGVuZ3RoKHRoaXMuZGF0YVR5cGUsIHRoaXMudGVuc29yU2hhcGUpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgTE9HX0RFQlVHKCd2ZXJib3NlJywgKCkgPT4gJ1tXZWJOTl0gVGVuc29yV3JhcHBlci5kZXN0cm95Jyk7XG4gICAgdGhpcy5tbFRlbnNvci5kZXN0cm95KCk7XG4gIH1cblxuICBwdWJsaWMgd3JpdGUoZGF0YTogVWludDhBcnJheSk6IHZvaWQge1xuICAgIHRoaXMubWxDb250ZXh0LndyaXRlVGVuc29yKHRoaXMubWxUZW5zb3IsIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlYWQoKTogUHJvbWlzZTxBcnJheUJ1ZmZlcj47XG4gIHB1YmxpYyBhc3luYyByZWFkKGRzdEJ1ZmZlcj86IEFycmF5QnVmZmVyVmlldyB8IEFycmF5QnVmZmVyKTogUHJvbWlzZTxBcnJheUJ1ZmZlciB8IHVuZGVmaW5lZD47XG4gIHB1YmxpYyBhc3luYyByZWFkKGRzdEJ1ZmZlcj86IEFycmF5QnVmZmVyVmlldyB8IEFycmF5QnVmZmVyKTogUHJvbWlzZTxBcnJheUJ1ZmZlciB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICh0aGlzLmZhbGxiYWNrRGF0YVR5cGUpIHtcbiAgICAgIC8vIFRoaXMgdGVuc29yIGhhcyBiZWVuIGZhbGxiYWNrIHRvIGludDMyIGFzIHdvcmthcm91bmQsIHdlIG5lZWQgdG8gcmVhZCBpdCBhcyBpdHMgb3JpZ2luYWwgaW50ZWdlciBkYXRhIHR5cGUuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5tbENvbnRleHQucmVhZFRlbnNvcih0aGlzLm1sVGVuc29yKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsRGF0YSA9IGNvbnZlcnRJbnQzMlRvRGF0YShuZXcgVWludDhBcnJheShkYXRhKSwgdGhpcy5kYXRhVHlwZSk7XG5cbiAgICAgIGlmIChkc3RCdWZmZXIpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0QnVmZmVyID1cbiAgICAgICAgICBkc3RCdWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlclxuICAgICAgICAgICAgPyBuZXcgVWludDhBcnJheShkc3RCdWZmZXIpXG4gICAgICAgICAgICA6IG5ldyBVaW50OEFycmF5KGRzdEJ1ZmZlci5idWZmZXIsIGRzdEJ1ZmZlci5ieXRlT2Zmc2V0LCBkc3RCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHRhcmdldEJ1ZmZlci5zZXQob3JpZ2luYWxEYXRhKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbERhdGEuYnVmZmVyO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZHN0QnVmZmVyID8gdGhpcy5tbENvbnRleHQucmVhZFRlbnNvcih0aGlzLm1sVGVuc29yLCBkc3RCdWZmZXIpIDogdGhpcy5tbENvbnRleHQucmVhZFRlbnNvcih0aGlzLm1sVGVuc29yKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2FuUmV1c2VUZW5zb3IoY29udGV4dDogTUxDb250ZXh0LCBkYXRhVHlwZTogTUxPcGVyYW5kRGF0YVR5cGUsIHNoYXBlOiByZWFkb25seSBudW1iZXJbXSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLm1sQ29udGV4dCA9PT0gY29udGV4dCAmJlxuICAgICAgdGhpcy5kYXRhVHlwZSA9PT0gZGF0YVR5cGUgJiZcbiAgICAgIHRoaXMudGVuc29yU2hhcGUubGVuZ3RoID09PSBzaGFwZS5sZW5ndGggJiZcbiAgICAgIHRoaXMudGVuc29yU2hhcGUuZXZlcnkoKHYsIGkpID0+IHYgPT09IHNoYXBlW2ldKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgc2V0SXNEYXRhQ29udmVydGVkKGlzQ29udmVydGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5pc0RhdGFDb252ZXJ0ZWQgPSBpc0NvbnZlcnRlZDtcbiAgfVxufVxuXG4vKipcbiAqIFRlbnNvclRyYWNrZXIgdHJhY2tzIHRoZSBNTFRlbnNvciBhbmQgcGVuZGluZyB1cGxvYWQgZGF0YS5cbiAqXG4gKiBXZSBuZWVkIHRvIHRyYWNrIHRoZSBNTFRlbnNvciBhbmQgcGVuZGluZyB1cGxvYWQgZGF0YSBiZWNhdXNlIHdlIGRlbGF5IHRoZSBjcmVhdGlvbiBvZiBNTFRlbnNvciB1bnRpbFxuICogd2Uga25vdyB0aGUgZGF0YSB0eXBlIGFuZCBzaGFwZS4gVGhpcyBpcyBiZWNhdXNlIFdlYk5OIG9ubHkgc3VwcG9ydCBjcmVhdGluZyBNTFRlbnNvcnMgd2l0aCBkYXRhVHlwZXMgYW5kIHNoYXBlLlxuICovXG5jbGFzcyBUZW5zb3JJZFRyYWNrZXIge1xuICBwcml2YXRlIGFjdGl2ZVVwbG9hZD86IFVpbnQ4QXJyYXk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSB0ZW5zb3JNYW5hZ2VyOiBUZW5zb3JNYW5hZ2VySW1wbCxcbiAgICBwcml2YXRlIHdyYXBwZXI/OiBUZW5zb3JXcmFwcGVyLFxuICApIHt9XG5cbiAgcHVibGljIGdldCB0ZW5zb3JXcmFwcGVyKCk6IFRlbnNvcldyYXBwZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLndyYXBwZXI7XG4gIH1cblxuICBwdWJsaWMgcmVsZWFzZVRlbnNvcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50ZW5zb3JXcmFwcGVyKSB7XG4gICAgICB0aGlzLnRlbnNvck1hbmFnZXIucmVsZWFzZVRlbnNvcih0aGlzLnRlbnNvcldyYXBwZXIpO1xuICAgICAgdGhpcy53cmFwcGVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBlbnN1cmVUZW5zb3IoXG4gICAgc2Vzc2lvbklkOiBudW1iZXIsXG4gICAgZGF0YVR5cGU6IE1MT3BlcmFuZERhdGFUeXBlLFxuICAgIHNoYXBlOiByZWFkb25seSBudW1iZXJbXSxcbiAgICBjb3B5T2xkOiBib29sZWFuLFxuICApOiBQcm9taXNlPE1MVGVuc29yPiB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMudGVuc29yTWFuYWdlci5nZXRNTENvbnRleHQoc2Vzc2lvbklkKTtcbiAgICBjb25zdCBvcExpbWl0cyA9IHRoaXMudGVuc29yTWFuYWdlci5nZXRNTE9wU3VwcG9ydExpbWl0cyhzZXNzaW9uSWQpO1xuICAgIGxldCBmYWxsYmFja0RhdGFUeXBlOiBNTE9wZXJhbmREYXRhVHlwZSB8IHVuZGVmaW5lZDtcbiAgICAvLyBDaGVjayBpZiB0aGUgY29udGV4dCBzdXBwb3J0cyB0aGUgZGF0YSB0eXBlLiBJZiBub3QsIHRyeSB0byB1c2UgdGhlIGZhbGxiYWNrIGRhdGEgdHlwZS5cbiAgICBpZiAoIW9wTGltaXRzPy5pbnB1dC5kYXRhVHlwZXMuaW5jbHVkZXMoZGF0YVR5cGUpKSB7XG4gICAgICBmYWxsYmFja0RhdGFUeXBlID0gd2Vibm5EYXRhVHlwZVRvRmFsbGJhY2suZ2V0KGRhdGFUeXBlKTtcbiAgICAgIGlmICghZmFsbGJhY2tEYXRhVHlwZSB8fCBvcExpbWl0cz8uaW5wdXQuZGF0YVR5cGVzLmluY2x1ZGVzKGZhbGxiYWNrRGF0YVR5cGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgV2ViTk4gYmFja2VuZCBkb2VzIG5vdCBzdXBwb3J0IGRhdGEgdHlwZTogJHtkYXRhVHlwZX1gKTtcbiAgICAgIH1cbiAgICAgIExPR19ERUJVRyhcbiAgICAgICAgJ3ZlcmJvc2UnLFxuICAgICAgICAoKSA9PiBgW1dlYk5OXSBUZW5zb3JJZFRyYWNrZXIuZW5zdXJlVGVuc29yOiBmYWxsYmFjayBkYXRhVHlwZSBmcm9tICR7ZGF0YVR5cGV9IHRvICR7ZmFsbGJhY2tEYXRhVHlwZX1gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XG4gICAgICBpZiAodGhpcy53cmFwcGVyLmNhblJldXNlVGVuc29yKGNvbnRleHQsIGRhdGFUeXBlLCBzaGFwZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JhcHBlci50ZW5zb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29weU9sZCkge1xuICAgICAgICAgIGlmICh0aGlzLndyYXBwZXIuYnl0ZUxlbmd0aCAhPT0gY2FsY3VsYXRlQnl0ZUxlbmd0aChkYXRhVHlwZSwgc2hhcGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjb3B5IGRhdGEgdG8gdGVuc29yIHdpdGggZGlmZmVyZW50IHNpemUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYWN0aXZlVXBsb2FkID0gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgdGhpcy53cmFwcGVyLnJlYWQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZW5zb3JNYW5hZ2VyLnJlbGVhc2VUZW5zb3IodGhpcy53cmFwcGVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZVxuICAgIGNvbnN0IHVzYWdlID0gdHlwZW9mIE1MVGVuc29yVXNhZ2UgPT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBNTFRlbnNvclVzYWdlLlJFQUQgfCBNTFRlbnNvclVzYWdlLldSSVRFO1xuICAgIHRoaXMud3JhcHBlciA9IGF3YWl0IHRoaXMudGVuc29yTWFuYWdlci5nZXRDYWNoZWRUZW5zb3IoXG4gICAgICBzZXNzaW9uSWQsXG4gICAgICBkYXRhVHlwZSxcbiAgICAgIHNoYXBlLFxuICAgICAgdXNhZ2UsXG4gICAgICB0cnVlLFxuICAgICAgdHJ1ZSxcbiAgICAgIGZhbGxiYWNrRGF0YVR5cGUsXG4gICAgKTtcblxuICAgIGlmIChjb3B5T2xkICYmIHRoaXMuYWN0aXZlVXBsb2FkKSB7XG4gICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGNvbnZlcnQgdGhlIG9yaWdpbmFsIGludGVnZXIgZGF0YSB0byBpbnQzMixcbiAgICAgIC8vIGJlY2F1c2UgaXQgaGFzIGJlZW4gY29udmVydGVkIHdoZW4gaXQgd2FzIHVwbG9hZGVkLlxuICAgICAgdGhpcy53cmFwcGVyLndyaXRlKHRoaXMuYWN0aXZlVXBsb2FkKTtcbiAgICAgIHRoaXMuYWN0aXZlVXBsb2FkID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLndyYXBwZXIudGVuc29yO1xuICB9XG5cbiAgcHVibGljIHVwbG9hZChkYXRhOiBVaW50OEFycmF5KTogdm9pZCB7XG4gICAgbGV0IG5ld0RhdGEgPSBkYXRhO1xuICAgIGlmICh0aGlzLndyYXBwZXIpIHtcbiAgICAgIGlmICh0aGlzLndyYXBwZXIuZmFsbGJhY2tUeXBlKSB7XG4gICAgICAgIGlmICh0aGlzLndyYXBwZXIuZmFsbGJhY2tUeXBlID09PSAnaW50MzInKSB7XG4gICAgICAgICAgLy8gQ29udmVydCBvcmlnaW5hbCBpbnRlZ2VyIGRhdGEgdG8gaW50MzIuXG4gICAgICAgICAgbmV3RGF0YSA9IGNvbnZlcnREYXRhVG9JbnQzMihkYXRhLCB0aGlzLndyYXBwZXIudHlwZSk7XG4gICAgICAgICAgdGhpcy53cmFwcGVyLnNldElzRGF0YUNvbnZlcnRlZCh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZhbGxiYWNrIGRhdGEgdHlwZTogJHt0aGlzLndyYXBwZXIuZmFsbGJhY2tUeXBlfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBkYXRhIHNpemUgbWF0Y2hlcyB0aGUgdGVuc29yIHNpemUuXG4gICAgICBpZiAoZGF0YS5ieXRlTGVuZ3RoID09PSB0aGlzLndyYXBwZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgICAvLyBXcml0ZSB0aGUgbmV3RGF0YSB0byB0aGUgdGVuc29yLlxuICAgICAgICB0aGlzLndyYXBwZXIud3JpdGUobmV3RGF0YSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIExPR19ERUJVRygndmVyYm9zZScsICgpID0+ICdEYXRhIHNpemUgZG9lcyBub3QgbWF0Y2ggdGVuc29yIHNpemUuIFJlbGVhc2luZyB0ZW5zb3IuJyk7XG4gICAgICAgIHRoaXMucmVsZWFzZVRlbnNvcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZVVwbG9hZCkge1xuICAgICAgdGhpcy5hY3RpdmVVcGxvYWQuc2V0KG5ld0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZVVwbG9hZCA9IG5ldyBVaW50OEFycmF5KG5ld0RhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkb3dubG9hZChkc3RCdWZmZXI/OiBBcnJheUJ1ZmZlclZpZXcgfCBBcnJheUJ1ZmZlcik6IFByb21pc2U8QXJyYXlCdWZmZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBpZiAodGhpcy5hY3RpdmVVcGxvYWQpIHtcbiAgICAgIC8vIElmIHRoaXMuYWN0aXZlVXBsb2FkIGhhcyBiZWVuIGNvbnZlcnRlZCB0byBpbnQzMiwgd2UgbmVlZCB0byBjb252ZXJ0IGl0IGJhY2sgdG8gb3JpZ2luYWwgaW50ZWdlciBkYXRhIHR5cGUuXG4gICAgICBjb25zdCBkc3REYXRhID0gdGhpcy53cmFwcGVyPy5pc0RhdGFDb252ZXJ0ZWRcbiAgICAgICAgPyBjb252ZXJ0SW50MzJUb0RhdGEodGhpcy5hY3RpdmVVcGxvYWQsIHRoaXMud3JhcHBlcj8udHlwZSlcbiAgICAgICAgOiB0aGlzLmFjdGl2ZVVwbG9hZDtcblxuICAgICAgaWYgKGRzdEJ1ZmZlcikge1xuICAgICAgICBpZiAoZHN0QnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICBuZXcgVWludDhBcnJheShkc3RCdWZmZXIpLnNldChkc3REYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXcgVWludDhBcnJheShkc3RCdWZmZXIuYnVmZmVyLCBkc3RCdWZmZXIuYnl0ZU9mZnNldCwgZHN0QnVmZmVyLmJ5dGVMZW5ndGgpLnNldChkc3REYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZHN0RGF0YS5idWZmZXI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy53cmFwcGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RlbnNvciBoYXMgbm90IGJlZW4gY3JlYXRlZC4nKTtcbiAgICB9XG5cbiAgICBpZiAoIWRzdEJ1ZmZlcikge1xuICAgICAgcmV0dXJuIHRoaXMud3JhcHBlci5yZWFkKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLndyYXBwZXIucmVhZChkc3RCdWZmZXIpO1xuICB9XG59XG5cbmNsYXNzIFRlbnNvck1hbmFnZXJJbXBsIGltcGxlbWVudHMgVGVuc29yTWFuYWdlciB7XG4gIHByaXZhdGUgdGVuc29yVHJhY2tlcnNCeUlkOiBNYXA8VGVuc29ySWQsIFRlbnNvcklkVHJhY2tlcj4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgZnJlZVRlbnNvcnM6IFRlbnNvcldyYXBwZXJbXSA9IFtdO1xuICBwcml2YXRlIGV4dGVybmFsVGVuc29yczogU2V0PFRlbnNvcldyYXBwZXI+ID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYmFja2VuZDogV2ViTk5CYWNrZW5kKSB7fVxuXG4gIHB1YmxpYyBnZXRNTENvbnRleHQoc2Vzc2lvbklkOiBudW1iZXIpOiBNTENvbnRleHQge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmJhY2tlbmQuZ2V0TUxDb250ZXh0KHNlc3Npb25JZCk7XG4gICAgaWYgKCFjb250ZXh0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01MQ29udGV4dCBub3QgZm91bmQgZm9yIHNlc3Npb24uJyk7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgcHVibGljIGdldE1MT3BTdXBwb3J0TGltaXRzKHNlc3Npb25JZDogbnVtYmVyKTogTUxPcFN1cHBvcnRMaW1pdHMgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmJhY2tlbmQuZ2V0TUxPcFN1cHBvcnRMaW1pdHMoc2Vzc2lvbklkKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNlcnZlVGVuc29ySWQoKTogVGVuc29ySWQge1xuICAgIGNvbnN0IHRlbnNvcklkID0gY3JlYXRlTmV3VGVuc29ySWQoKTtcbiAgICB0aGlzLnRlbnNvclRyYWNrZXJzQnlJZC5zZXQodGVuc29ySWQsIG5ldyBUZW5zb3JJZFRyYWNrZXIodGhpcykpO1xuICAgIHJldHVybiB0ZW5zb3JJZDtcbiAgfVxuXG4gIHB1YmxpYyByZWxlYXNlVGVuc29ySWQodGVuc29ySWQ6IFRlbnNvcklkKTogdm9pZCB7XG4gICAgY29uc3QgdGVuc29yVHJhY2tlciA9IHRoaXMudGVuc29yVHJhY2tlcnNCeUlkLmdldCh0ZW5zb3JJZCk7XG4gICAgaWYgKCF0ZW5zb3JUcmFja2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudGVuc29yVHJhY2tlcnNCeUlkLmRlbGV0ZSh0ZW5zb3JJZCk7XG4gICAgaWYgKHRlbnNvclRyYWNrZXIudGVuc29yV3JhcHBlcikge1xuICAgICAgdGhpcy5yZWxlYXNlVGVuc29yKHRlbnNvclRyYWNrZXIudGVuc29yV3JhcHBlcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGVuc3VyZVRlbnNvcihcbiAgICBzZXNzaW9uSWQ6IG51bWJlcixcbiAgICB0ZW5zb3JJZDogVGVuc29ySWQsXG4gICAgZGF0YVR5cGU6IE1MT3BlcmFuZERhdGFUeXBlLFxuICAgIHNoYXBlOiBudW1iZXJbXSxcbiAgICBjb3B5T2xkOiBib29sZWFuLFxuICApOiBQcm9taXNlPE1MVGVuc29yPiB7XG4gICAgTE9HX0RFQlVHKFxuICAgICAgJ3ZlcmJvc2UnLFxuICAgICAgKCkgPT5cbiAgICAgICAgYFtXZWJOTl0gVGVuc29yTWFuYWdlci5lbnN1cmVUZW5zb3Ige3RlbnNvcklkOiAke3RlbnNvcklkfSwgZGF0YVR5cGU6ICR7XG4gICAgICAgICAgZGF0YVR5cGVcbiAgICAgICAgfSwgc2hhcGU6ICR7c2hhcGV9LCBjb3B5T2xkOiAke2NvcHlPbGR9fWAsXG4gICAgKTtcbiAgICBjb25zdCB0ZW5zb3IgPSB0aGlzLnRlbnNvclRyYWNrZXJzQnlJZC5nZXQodGVuc29ySWQpO1xuICAgIGlmICghdGVuc29yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RlbnNvciBub3QgZm91bmQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0ZW5zb3IuZW5zdXJlVGVuc29yKHNlc3Npb25JZCwgZGF0YVR5cGUsIHNoYXBlLCBjb3B5T2xkKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGxvYWQodGVuc29ySWQ6IFRlbnNvcklkLCBkYXRhOiBVaW50OEFycmF5KTogdm9pZCB7XG4gICAgY29uc3QgdGVuc29yID0gdGhpcy50ZW5zb3JUcmFja2Vyc0J5SWQuZ2V0KHRlbnNvcklkKTtcbiAgICBpZiAoIXRlbnNvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZW5zb3Igbm90IGZvdW5kLicpO1xuICAgIH1cbiAgICB0ZW5zb3IudXBsb2FkKGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRvd25sb2FkKHRlbnNvcklkOiBUZW5zb3JJZCk6IFByb21pc2U8QXJyYXlCdWZmZXI+O1xuICBwdWJsaWMgYXN5bmMgZG93bmxvYWQodGVuc29ySWQ6IFRlbnNvcklkLCBkc3RCdWZmZXI6IEFycmF5QnVmZmVyVmlldyB8IEFycmF5QnVmZmVyKTogUHJvbWlzZTx1bmRlZmluZWQ+O1xuICBhc3luYyBkb3dubG9hZCh0ZW5zb3JJZDogVGVuc29ySWQsIGRzdEJ1ZmZlcj86IEFycmF5QnVmZmVyVmlldyB8IEFycmF5QnVmZmVyKTogUHJvbWlzZTxBcnJheUJ1ZmZlciB8IHVuZGVmaW5lZD4ge1xuICAgIExPR19ERUJVRyhcbiAgICAgICd2ZXJib3NlJyxcbiAgICAgICgpID0+IGBbV2ViTk5dIFRlbnNvck1hbmFnZXIuZG93bmxvYWQge3RlbnNvcklkOiAke3RlbnNvcklkfSwgZHN0QnVmZmVyOiAke2RzdEJ1ZmZlcj8uYnl0ZUxlbmd0aH19YCxcbiAgICApO1xuICAgIGNvbnN0IHRlbnNvclRyYWNrZXIgPSB0aGlzLnRlbnNvclRyYWNrZXJzQnlJZC5nZXQodGVuc29ySWQpO1xuICAgIGlmICghdGVuc29yVHJhY2tlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZW5zb3Igbm90IGZvdW5kLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGVuc29yVHJhY2tlci5kb3dubG9hZChkc3RCdWZmZXIpO1xuICB9XG5cbiAgcHVibGljIHJlbGVhc2VUZW5zb3JzRm9yU2Vzc2lvbihzZXNzaW9uSWQ6IG51bWJlcik6IHZvaWQge1xuICAgIGZvciAoY29uc3QgdGVuc29yIG9mIHRoaXMuZnJlZVRlbnNvcnMpIHtcbiAgICAgIGlmICh0ZW5zb3Iuc2Vzc2lvbklkID09PSBzZXNzaW9uSWQpIHtcbiAgICAgICAgdGVuc29yLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5mcmVlVGVuc29ycyA9IHRoaXMuZnJlZVRlbnNvcnMuZmlsdGVyKCh0ZW5zb3IpID0+IHRlbnNvci5zZXNzaW9uSWQgIT09IHNlc3Npb25JZCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJUZW5zb3IoXG4gICAgc2Vzc2lvbklkOiBudW1iZXIsXG4gICAgbWxUZW5zb3I6IE1MVGVuc29yLFxuICAgIGRhdGFUeXBlOiBNTE9wZXJhbmREYXRhVHlwZSxcbiAgICBzaGFwZTogcmVhZG9ubHkgbnVtYmVyW10sXG4gICk6IFRlbnNvcklkIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5nZXRNTENvbnRleHQoc2Vzc2lvbklkKTtcbiAgICBjb25zdCB0ZW5zb3JJZCA9IGNyZWF0ZU5ld1RlbnNvcklkKCk7XG4gICAgLy8gRGVmYXVsdGluZyB0byBSRUFEIHwgV1JJVEUgaWYgdXNhZ2UgaXMgbm90IHByb3ZpZGVkLlxuICAgIGNvbnN0IHdyYXBwZXIgPSBuZXcgVGVuc29yV3JhcHBlcih7XG4gICAgICBzZXNzaW9uSWQsXG4gICAgICBjb250ZXh0LFxuICAgICAgdGVuc29yOiBtbFRlbnNvcixcbiAgICAgIGRhdGFUeXBlLFxuICAgICAgc2hhcGUsXG4gICAgfSk7XG4gICAgdGhpcy50ZW5zb3JUcmFja2Vyc0J5SWQuc2V0KHRlbnNvcklkLCBuZXcgVGVuc29ySWRUcmFja2VyKHRoaXMsIHdyYXBwZXIpKTtcbiAgICB0aGlzLmV4dGVybmFsVGVuc29ycy5hZGQod3JhcHBlcik7XG4gICAgcmV0dXJuIHRlbnNvcklkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvciBjcmVhdGUgYW4gTUxUZW5zb3Igd2l0aCB0aGUgZ2l2ZW4gZGF0YSB0eXBlIGFuZCBzaGFwZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBnZXRDYWNoZWRUZW5zb3IoXG4gICAgc2Vzc2lvbklkOiBudW1iZXIsXG4gICAgZGF0YVR5cGU6IE1MT3BlcmFuZERhdGFUeXBlLFxuICAgIHNoYXBlOiByZWFkb25seSBudW1iZXJbXSxcbiAgICB1c2FnZTogTUxUZW5zb3JVc2FnZUZsYWdzIHwgdW5kZWZpbmVkLFxuICAgIHdyaXRhYmxlOiBib29sZWFuLFxuICAgIHJlYWRhYmxlOiBib29sZWFuLFxuICAgIGZhbGxiYWNrRGF0YVR5cGU/OiBNTE9wZXJhbmREYXRhVHlwZSxcbiAgKTogUHJvbWlzZTxUZW5zb3JXcmFwcGVyPiB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuZ2V0TUxDb250ZXh0KHNlc3Npb25JZCk7XG4gICAgZm9yIChjb25zdCBbaW5kZXgsIHRlbnNvcl0gb2YgdGhpcy5mcmVlVGVuc29ycy5lbnRyaWVzKCkpIHtcbiAgICAgIGlmICh0ZW5zb3IuY2FuUmV1c2VUZW5zb3IoY29udGV4dCwgZGF0YVR5cGUsIHNoYXBlKSkge1xuICAgICAgICBMT0dfREVCVUcoXG4gICAgICAgICAgJ3ZlcmJvc2UnLFxuICAgICAgICAgICgpID0+XG4gICAgICAgICAgICBgW1dlYk5OXSBSZXVzaW5nIHRlbnNvciB7ZGF0YVR5cGU6ICR7ZGF0YVR5cGV9LCAke1xuICAgICAgICAgICAgICBmYWxsYmFja0RhdGFUeXBlID8gYGZhbGxiYWNrRGF0YVR5cGU6ICR7ZmFsbGJhY2tEYXRhVHlwZX0sYCA6ICcnXG4gICAgICAgICAgICB9IHNoYXBlOiAke3NoYXBlfWAsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLmZyZWVUZW5zb3JzLnNwbGljZShpbmRleCwgMSlbMF07XG4gICAgICAgIHdyYXBwZXIuc2Vzc2lvbklkID0gc2Vzc2lvbklkO1xuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgTE9HX0RFQlVHKFxuICAgICAgJ3ZlcmJvc2UnLFxuICAgICAgKCkgPT5cbiAgICAgICAgYFtXZWJOTl0gTUxDb250ZXh0LmNyZWF0ZVRlbnNvciB7ZGF0YVR5cGU6ICR7ZGF0YVR5cGV9LCAke1xuICAgICAgICAgIGZhbGxiYWNrRGF0YVR5cGUgPyBgZmFsbGJhY2tEYXRhVHlwZTogJHtmYWxsYmFja0RhdGFUeXBlfSxgIDogJydcbiAgICAgICAgfSBzaGFwZTogJHtzaGFwZX19YCxcbiAgICApO1xuICAgIGNvbnN0IHRlbnNvciA9IGF3YWl0IGNvbnRleHQuY3JlYXRlVGVuc29yKHtcbiAgICAgIGRhdGFUeXBlOiBmYWxsYmFja0RhdGFUeXBlID8/IGRhdGFUeXBlLCAvLyBJZiBmYWxsYmFjayBkYXRhIHR5cGUgaXMgcHJvdmlkZWQsIHVzZSBpdC5cbiAgICAgIHNoYXBlLFxuICAgICAgZGltZW5zaW9uczogc2hhcGUsXG4gICAgICB1c2FnZSxcbiAgICAgIHdyaXRhYmxlLFxuICAgICAgcmVhZGFibGUsXG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBUZW5zb3JXcmFwcGVyKHsgc2Vzc2lvbklkLCBjb250ZXh0LCB0ZW5zb3IsIGRhdGFUeXBlLCBzaGFwZSwgZmFsbGJhY2tEYXRhVHlwZSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxlYXNlIHRlbnNvciBmb3IgcmV1c2UgdW5sZXNzIGV4dGVybmFsLlxuICAgKi9cbiAgcHVibGljIHJlbGVhc2VUZW5zb3IodGVuc29yV3JhcHBlcjogVGVuc29yV3JhcHBlcikge1xuICAgIGlmICh0aGlzLmV4dGVybmFsVGVuc29ycy5oYXModGVuc29yV3JhcHBlcikpIHtcbiAgICAgIHRoaXMuZXh0ZXJuYWxUZW5zb3JzLmRlbGV0ZSh0ZW5zb3JXcmFwcGVyKTtcbiAgICB9XG4gICAgdGhpcy5mcmVlVGVuc29ycy5wdXNoKHRlbnNvcldyYXBwZXIpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVUZW5zb3JNYW5hZ2VyID0gKC4uLmFyZ3M6IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgVGVuc29yTWFuYWdlckltcGw+KTogVGVuc29yTWFuYWdlciA9PlxuICBuZXcgVGVuc29yTWFuYWdlckltcGwoLi4uYXJncyk7XG4iLCAiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG5cbi8vIFdlYk5OIEFQSSBjdXJyZW50bHkgZG9lcyBub3QgaGF2ZSBhIFR5cGVTY3JpcHQgZGVmaW5pdGlvbiBmaWxlLiBUaGlzIGZpbGUgaXMgYSB3b3JrYXJvdW5kIHdpdGggdHlwZXMgZ2VuZXJhdGVkIGZyb21cbi8vIFdlYk5OIEFQSSBzcGVjaWZpY2F0aW9uLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYm1hY2hpbmVsZWFybmluZy93ZWJubi9pc3N1ZXMvNjc3XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwid2Vibm4vd2Vibm4uZC50c1wiIC8+XG5cbmltcG9ydCB7IEVudiwgVGVuc29yIH0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHsgRGF0YVR5cGUsIHRlbnNvckRhdGFUeXBlU3RyaW5nVG9FbnVtIH0gZnJvbSAnLi4vd2FzbS1jb21tb24nO1xuaW1wb3J0IHsgZ2V0SW5zdGFuY2UgfSBmcm9tICcuLi93YXNtLWZhY3RvcnknO1xuXG5pbXBvcnQgeyBjcmVhdGVWaWV3IH0gZnJvbSAnLi90ZW5zb3Itdmlldyc7XG5pbXBvcnQgeyBUZW5zb3JJZCwgY3JlYXRlVGVuc29yTWFuYWdlciwgY29udmVydERhdGFUb0ludDMyIH0gZnJvbSAnLi93ZWJubi90ZW5zb3ItbWFuYWdlcic7XG5pbXBvcnQgeyBjb25maWd1cmVMb2dnZXIsIExPR19ERUJVRyB9IGZyb20gJy4vbG9nJztcblxuLypcbiAqIFRlbnNvclByb3RvOjpkYXRhX3R5cGUgdG8gV2ViTk4gT3BlcmFuZFR5cGUgbWFwcGluZy5cbiAqL1xuY29uc3Qgb25ueERhdGFUeXBlVG9XZWJubkRhdGFUeXBlID0gbmV3IE1hcDxEYXRhVHlwZSwgTUxPcGVyYW5kRGF0YVR5cGU+KFtcbiAgW0RhdGFUeXBlLmZsb2F0LCAnZmxvYXQzMiddLFxuICBbRGF0YVR5cGUuZmxvYXQxNiwgJ2Zsb2F0MTYnXSxcbiAgW0RhdGFUeXBlLmludDMyLCAnaW50MzInXSxcbiAgW0RhdGFUeXBlLnVpbnQzMiwgJ3VpbnQzMiddLFxuICBbRGF0YVR5cGUuaW50NjQsICdpbnQ2NCddLFxuICBbRGF0YVR5cGUudWludDY0LCAndWludDY0J10sXG4gIFtEYXRhVHlwZS5pbnQ0LCAnaW50NCddLFxuICBbRGF0YVR5cGUudWludDQsICd1aW50NCddLFxuICBbRGF0YVR5cGUuaW50OCwgJ2ludDgnXSxcbiAgW0RhdGFUeXBlLnVpbnQ4LCAndWludDgnXSxcbiAgW0RhdGFUeXBlLmJvb2wsICd1aW50OCddLFxuXSk7XG5cbnR5cGUgTUxDb250ZXh0RW50cnkgPSB7XG4gIGdwdURldmljZT86IEdQVURldmljZTtcbiAgb3B0aW9ucz86IE1MQ29udGV4dE9wdGlvbnM7XG4gIG1sQ29udGV4dDogTUxDb250ZXh0O1xufTtcblxuY29uc3QgY29tcGFyZU1MQ29udGV4dE9wdGlvbnMgPSAoYT86IE1MQ29udGV4dE9wdGlvbnMsIGI/OiBNTENvbnRleHRPcHRpb25zKTogYm9vbGVhbiA9PiB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgYUtleXMgPSBPYmplY3Qua2V5cyhhKS5zb3J0KCkgYXMgQXJyYXk8a2V5b2YgdHlwZW9mIGE+O1xuICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpLnNvcnQoKSBhcyBBcnJheTxrZXlvZiB0eXBlb2YgYj47XG4gIHJldHVybiBhS2V5cy5sZW5ndGggPT09IGJLZXlzLmxlbmd0aCAmJiBhS2V5cy5ldmVyeSgoa2V5LCBpbmRleCkgPT4ga2V5ID09PSBiS2V5c1tpbmRleF0gJiYgYVtrZXldID09PSBiW2tleV0pO1xufTtcblxuLyoqXG4gKiBXZWJOTiBiYWNrZW5kIGltcGxlbWVudGF0aW9uLiBUaGlzIGNsYXNzIGlzIHVzZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgTUxUZW5zb3JzIGNyZWF0ZWQgYnkgdGhlIGJhY2tlbmQgYW5kIGtlZXAgdHJhY2tcbiAqIG9mIHRoZSBjdXJyZW50IE1MQ29udGV4dCBiZWluZyB1c2VkIGJ5IHRoZSBzZXNzaW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFdlYk5OQmFja2VuZCB7XG4gIC8qKlxuICAgKiBUZW5zb3IgbWFuYWdlcnMgZm9yIGVhY2ggc2Vzc2lvbi5cbiAgICovXG4gIHByaXZhdGUgdGVuc29yTWFuYWdlciA9IGNyZWF0ZVRlbnNvck1hbmFnZXIodGhpcyk7XG4gIC8qKlxuICAgKiBNYXBzIGZyb20gc2Vzc2lvbiBpZCB0byBNTENvbnRleHRzLlxuICAgKi9cbiAgcHJpdmF0ZSBtbENvbnRleHRCeVNlc3Npb25JZCA9IG5ldyBNYXA8bnVtYmVyLCBNTENvbnRleHQ+KCk7XG4gIC8qKlxuICAgKiBNYXBzIGZyb20gTUxDb250ZXh0IHRvIHNlc3Npb24gaWRzLlxuICAgKi9cbiAgcHJpdmF0ZSBzZXNzaW9uSWRzQnlNTENvbnRleHQgPSBuZXcgTWFwPE1MQ29udGV4dCwgU2V0PG51bWJlcj4+KCk7XG4gIC8qKlxuICAgKiBDYWNoZSBvZiBNTENvbnRleHRzLlxuICAgKi9cbiAgcHJpdmF0ZSBtbENvbnRleHRDYWNoZTogTUxDb250ZXh0RW50cnlbXSA9IFtdO1xuICAvKipcbiAgICogQ3VycmVudCBzZXNzaW9uIGlkLlxuICAgKi9cbiAgcHJpdmF0ZSBhY3RpdmVTZXNzaW9uSWQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBNYXBzIGZyb20gc2Vzc2lvbiBpZCB0byBsaXN0IG9mIGdyYXBoIGlucHV0cy5cbiAgICovXG4gIHByaXZhdGUgc2Vzc2lvbkdyYXBoSW5wdXRzOiBNYXA8bnVtYmVyLCBzdHJpbmdbXT4gPSBuZXcgTWFwKCk7XG4gIC8qKlxuICAgKiBNYXBzIGZyb20gc2Vzc2lvbiBpZCB0byBsaXN0IG9mIGdyYXBoIG91dHB1dHMuXG4gICAqL1xuICBwcml2YXRlIHNlc3Npb25HcmFwaE91dHB1dHM6IE1hcDxudW1iZXIsIHN0cmluZ1tdPiA9IG5ldyBNYXAoKTtcbiAgLyoqXG4gICAqIFRlbXBvcmFyeSBncmFwaCBpbnB1dHMgZm9yIHRoZSBjdXJyZW50IHNlc3Npb24uXG4gICAqIFRoZXNlIGlucHV0cyB3aWxsIGJlIHJlZ2lzdGVyZWQgd2hlbiB0aGUgc2Vzc2lvbiBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSB0ZW1wb3JhcnlHcmFwaElucHV0czogc3RyaW5nW10gPSBbXTtcbiAgLyoqXG4gICAqIFRlbXBvcmFyeSBncmFwaCBvdXRwdXRzIGZvciB0aGUgY3VycmVudCBzZXNzaW9uLlxuICAgKiBUaGVzZSBvdXRwdXRzIHdpbGwgYmUgcmVnaXN0ZXJlZCB3aGVuIHRoZSBzZXNzaW9uIGlzIGNyZWF0ZWQuXG4gICAqL1xuICBwcml2YXRlIHRlbXBvcmFyeUdyYXBoT3V0cHV0czogc3RyaW5nW10gPSBbXTtcbiAgLyoqXG4gICAqIFRlbXBvcmFyeSB0ZW5zb3JzIGZvciB0aGUgY3VycmVudCBzZXNzaW9uLlxuICAgKi9cbiAgcHJpdmF0ZSB0ZW1wb3JhcnlTZXNzaW9uVGVuc29ySWRzOiBNYXA8bnVtYmVyLCBUZW5zb3JJZFtdPiA9IG5ldyBNYXAoKTtcbiAgLyoqXG4gICAqIE1hcHMgZnJvbSBzZXNzaW9uIGlkIHRvIE1MT3BTdXBwb3J0TGltaXRzLlxuICAgKi9cbiAgcHJpdmF0ZSBtbE9wU3VwcG9ydExpbWl0c0J5U2Vzc2lvbklkID0gbmV3IE1hcDxudW1iZXIsIE1MT3BTdXBwb3J0TGltaXRzPigpO1xuXG4gIGNvbnN0cnVjdG9yKGVudjogRW52KSB7XG4gICAgY29uZmlndXJlTG9nZ2VyKGVudi5sb2dMZXZlbCEsICEhZW52LmRlYnVnKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgY3VycmVudFNlc3Npb25JZCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLmFjdGl2ZVNlc3Npb25JZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGFjdGl2ZSBzZXNzaW9uJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVNlc3Npb25JZDtcbiAgfVxuXG4gIHB1YmxpYyBvblJ1blN0YXJ0KHNlc3Npb25JZDogbnVtYmVyKTogdm9pZCB7XG4gICAgTE9HX0RFQlVHKCd2ZXJib3NlJywgKCkgPT4gYFtXZWJOTl0gb25SdW5TdGFydCB7c2Vzc2lvbklkOiAke3Nlc3Npb25JZH19YCk7XG4gICAgdGhpcy5hY3RpdmVTZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gIH1cblxuICBwdWJsaWMgb25SdW5FbmQoc2Vzc2lvbklkOiBudW1iZXIpOiB2b2lkIHtcbiAgICBMT0dfREVCVUcoJ3ZlcmJvc2UnLCAoKSA9PiBgW1dlYk5OXSBvblJ1bkVuZCB7c2Vzc2lvbklkOiAke3Nlc3Npb25JZH19YCk7XG4gICAgY29uc3QgdGVuc29ySWRzID0gdGhpcy50ZW1wb3JhcnlTZXNzaW9uVGVuc29ySWRzLmdldChzZXNzaW9uSWQpO1xuICAgIGlmICghdGVuc29ySWRzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgdGVuc29ySWQgb2YgdGVuc29ySWRzKSB7XG4gICAgICBMT0dfREVCVUcoJ3ZlcmJvc2UnLCAoKSA9PiBgW1dlYk5OXSByZWxlYXNpbmcgdGVtcG9yYXJ5IHRlbnNvciB7dGVuc29ySWQ6ICR7dGVuc29ySWR9fWApO1xuICAgICAgdGhpcy50ZW5zb3JNYW5hZ2VyLnJlbGVhc2VUZW5zb3JJZCh0ZW5zb3JJZCk7XG4gICAgfVxuICAgIHRoaXMudGVtcG9yYXJ5U2Vzc2lvblRlbnNvcklkcy5kZWxldGUoc2Vzc2lvbklkKTtcbiAgICB0aGlzLmFjdGl2ZVNlc3Npb25JZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjcmVhdGVNTENvbnRleHQob3B0aW9uc09yRGV2aWNlPzogTUxDb250ZXh0T3B0aW9ucyB8IEdQVURldmljZSk6IFByb21pc2U8TUxDb250ZXh0PiB7XG4gICAgaWYgKG9wdGlvbnNPckRldmljZSBpbnN0YW5jZW9mIEdQVURldmljZSkge1xuICAgICAgY29uc3QgbWxDb250ZXh0SW5kZXggPSB0aGlzLm1sQ29udGV4dENhY2hlLmZpbmRJbmRleCgoZW50cnkpID0+IGVudHJ5LmdwdURldmljZSA9PT0gb3B0aW9uc09yRGV2aWNlKTtcbiAgICAgIGlmIChtbENvbnRleHRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWxDb250ZXh0Q2FjaGVbbWxDb250ZXh0SW5kZXhdLm1sQ29udGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1sQ29udGV4dCA9IGF3YWl0IG5hdmlnYXRvci5tbC5jcmVhdGVDb250ZXh0KG9wdGlvbnNPckRldmljZSk7XG4gICAgICAgIHRoaXMubWxDb250ZXh0Q2FjaGUucHVzaCh7IGdwdURldmljZTogb3B0aW9uc09yRGV2aWNlLCBtbENvbnRleHQgfSk7XG4gICAgICAgIHJldHVybiBtbENvbnRleHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zT3JEZXZpY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgbWxDb250ZXh0SW5kZXggPSB0aGlzLm1sQ29udGV4dENhY2hlLmZpbmRJbmRleChcbiAgICAgICAgKGVudHJ5KSA9PiBlbnRyeS5vcHRpb25zID09PSB1bmRlZmluZWQgJiYgZW50cnkuZ3B1RGV2aWNlID09PSB1bmRlZmluZWQsXG4gICAgICApO1xuICAgICAgaWYgKG1sQ29udGV4dEluZGV4ICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tbENvbnRleHRDYWNoZVttbENvbnRleHRJbmRleF0ubWxDb250ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWxDb250ZXh0ID0gYXdhaXQgbmF2aWdhdG9yLm1sLmNyZWF0ZUNvbnRleHQoKTtcbiAgICAgICAgdGhpcy5tbENvbnRleHRDYWNoZS5wdXNoKHsgbWxDb250ZXh0IH0pO1xuICAgICAgICByZXR1cm4gbWxDb250ZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1sQ29udGV4dEluZGV4ID0gdGhpcy5tbENvbnRleHRDYWNoZS5maW5kSW5kZXgoKGVudHJ5KSA9PlxuICAgICAgY29tcGFyZU1MQ29udGV4dE9wdGlvbnMoZW50cnkub3B0aW9ucywgb3B0aW9uc09yRGV2aWNlKSxcbiAgICApO1xuICAgIGlmIChtbENvbnRleHRJbmRleCAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB0aGlzLm1sQ29udGV4dENhY2hlW21sQ29udGV4dEluZGV4XS5tbENvbnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1sQ29udGV4dCA9IGF3YWl0IG5hdmlnYXRvci5tbC5jcmVhdGVDb250ZXh0KG9wdGlvbnNPckRldmljZSk7XG4gICAgICB0aGlzLm1sQ29udGV4dENhY2hlLnB1c2goeyBvcHRpb25zOiBvcHRpb25zT3JEZXZpY2UsIG1sQ29udGV4dCB9KTtcbiAgICAgIHJldHVybiBtbENvbnRleHQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTUxDb250ZXh0KHNlc3Npb25JZDogbnVtYmVyLCBtbENvbnRleHQ6IE1MQ29udGV4dCk6IHZvaWQge1xuICAgIHRoaXMubWxDb250ZXh0QnlTZXNzaW9uSWQuc2V0KHNlc3Npb25JZCwgbWxDb250ZXh0KTtcbiAgICBsZXQgc2Vzc2lvbklkcyA9IHRoaXMuc2Vzc2lvbklkc0J5TUxDb250ZXh0LmdldChtbENvbnRleHQpO1xuICAgIGlmICghc2Vzc2lvbklkcykge1xuICAgICAgc2Vzc2lvbklkcyA9IG5ldyBTZXQoKTtcbiAgICAgIHRoaXMuc2Vzc2lvbklkc0J5TUxDb250ZXh0LnNldChtbENvbnRleHQsIHNlc3Npb25JZHMpO1xuICAgIH1cbiAgICBzZXNzaW9uSWRzLmFkZChzZXNzaW9uSWQpO1xuXG4gICAgaWYgKCF0aGlzLm1sT3BTdXBwb3J0TGltaXRzQnlTZXNzaW9uSWQuaGFzKHNlc3Npb25JZCkpIHtcbiAgICAgIHRoaXMubWxPcFN1cHBvcnRMaW1pdHNCeVNlc3Npb25JZC5zZXQoc2Vzc2lvbklkLCBtbENvbnRleHQub3BTdXBwb3J0TGltaXRzKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRlbXBvcmFyeUdyYXBoSW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc2Vzc2lvbkdyYXBoSW5wdXRzLnNldChzZXNzaW9uSWQsIHRoaXMudGVtcG9yYXJ5R3JhcGhJbnB1dHMpO1xuICAgICAgdGhpcy50ZW1wb3JhcnlHcmFwaElucHV0cyA9IFtdO1xuICAgIH1cbiAgICBpZiAodGhpcy50ZW1wb3JhcnlHcmFwaE91dHB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZXNzaW9uR3JhcGhPdXRwdXRzLnNldChzZXNzaW9uSWQsIHRoaXMudGVtcG9yYXJ5R3JhcGhPdXRwdXRzKTtcbiAgICAgIHRoaXMudGVtcG9yYXJ5R3JhcGhPdXRwdXRzID0gW107XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uUmVsZWFzZVNlc3Npb24oc2Vzc2lvbklkOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNlc3Npb25HcmFwaElucHV0cy5kZWxldGUoc2Vzc2lvbklkKTtcbiAgICB0aGlzLnNlc3Npb25HcmFwaE91dHB1dHMuZGVsZXRlKHNlc3Npb25JZCk7XG4gICAgY29uc3QgbWxDb250ZXh0ID0gdGhpcy5tbENvbnRleHRCeVNlc3Npb25JZC5nZXQoc2Vzc2lvbklkKSE7XG4gICAgaWYgKCFtbENvbnRleHQpIHtcbiAgICAgIC8vIEN1cnJlbnQgc2Vzc2lvbiBpcyBub3QgYSBXZWJOTiBzZXNzaW9uLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnRlbnNvck1hbmFnZXIucmVsZWFzZVRlbnNvcnNGb3JTZXNzaW9uKHNlc3Npb25JZCk7XG4gICAgdGhpcy5tbENvbnRleHRCeVNlc3Npb25JZC5kZWxldGUoc2Vzc2lvbklkKTtcbiAgICB0aGlzLm1sT3BTdXBwb3J0TGltaXRzQnlTZXNzaW9uSWQuZGVsZXRlKHNlc3Npb25JZCk7XG4gICAgY29uc3Qgc2Vzc2lvbklkcyA9IHRoaXMuc2Vzc2lvbklkc0J5TUxDb250ZXh0LmdldChtbENvbnRleHQpITtcbiAgICBzZXNzaW9uSWRzLmRlbGV0ZShzZXNzaW9uSWQpO1xuICAgIGlmIChzZXNzaW9uSWRzLnNpemUgPT09IDApIHtcbiAgICAgIHRoaXMuc2Vzc2lvbklkc0J5TUxDb250ZXh0LmRlbGV0ZShtbENvbnRleHQpO1xuICAgICAgY29uc3QgbWxDb250ZXh0SW5kZXggPSB0aGlzLm1sQ29udGV4dENhY2hlLmZpbmRJbmRleCgoZW50cnkpID0+IGVudHJ5Lm1sQ29udGV4dCA9PT0gbWxDb250ZXh0KTtcbiAgICAgIGlmIChtbENvbnRleHRJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5tbENvbnRleHRDYWNoZS5zcGxpY2UobWxDb250ZXh0SW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRNTENvbnRleHQoc2Vzc2lvbklkOiBudW1iZXIpOiBNTENvbnRleHQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm1sQ29udGV4dEJ5U2Vzc2lvbklkLmdldChzZXNzaW9uSWQpO1xuICB9XG5cbiAgcHVibGljIGdldE1MT3BTdXBwb3J0TGltaXRzKHNlc3Npb25JZDogbnVtYmVyKTogTUxPcFN1cHBvcnRMaW1pdHMgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm1sT3BTdXBwb3J0TGltaXRzQnlTZXNzaW9uSWQuZ2V0KHNlc3Npb25JZCk7XG4gIH1cblxuICBwdWJsaWMgcmVzZXJ2ZVRlbnNvcklkKCk6IFRlbnNvcklkIHtcbiAgICByZXR1cm4gdGhpcy50ZW5zb3JNYW5hZ2VyLnJlc2VydmVUZW5zb3JJZCgpO1xuICB9XG5cbiAgcHVibGljIHJlbGVhc2VUZW5zb3JJZCh0ZW5zb3JJZDogVGVuc29ySWQpOiB2b2lkIHtcbiAgICBMT0dfREVCVUcoJ3ZlcmJvc2UnLCAoKSA9PiBgW1dlYk5OXSByZWxlYXNlVGVuc29ySWQge3RlbnNvcklkOiAke3RlbnNvcklkfX1gKTtcbiAgICB0aGlzLnRlbnNvck1hbmFnZXIucmVsZWFzZVRlbnNvcklkKHRlbnNvcklkKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBlbnN1cmVUZW5zb3IoXG4gICAgc2Vzc2lvbklkOiBudW1iZXIgfCB1bmRlZmluZWQsXG4gICAgdGVuc29ySWQ6IFRlbnNvcklkLFxuICAgIG9ubnhEYXRhVHlwZTogRGF0YVR5cGUsXG4gICAgZGltZW5zaW9uczogbnVtYmVyW10sXG4gICAgY29weU9sZDogYm9vbGVhbixcbiAgKTogUHJvbWlzZTxNTFRlbnNvcj4ge1xuICAgIGNvbnN0IHdlYm5uRGF0YVR5cGUgPSBvbm54RGF0YVR5cGVUb1dlYm5uRGF0YVR5cGUuZ2V0KG9ubnhEYXRhVHlwZSk7XG4gICAgaWYgKCF3ZWJubkRhdGFUeXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIE9OTlggZGF0YSB0eXBlOiAke29ubnhEYXRhVHlwZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudGVuc29yTWFuYWdlci5lbnN1cmVUZW5zb3IoXG4gICAgICBzZXNzaW9uSWQgPz8gdGhpcy5jdXJyZW50U2Vzc2lvbklkLFxuICAgICAgdGVuc29ySWQsXG4gICAgICB3ZWJubkRhdGFUeXBlLFxuICAgICAgZGltZW5zaW9ucyxcbiAgICAgIGNvcHlPbGQsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjcmVhdGVUZW1wb3JhcnlUZW5zb3IoXG4gICAgc2Vzc2lvbklkOiBudW1iZXIsXG4gICAgb25ueERhdGFUeXBlOiBEYXRhVHlwZSxcbiAgICBzaGFwZTogcmVhZG9ubHkgbnVtYmVyW10sXG4gICk6IFByb21pc2U8VGVuc29ySWQ+IHtcbiAgICBMT0dfREVCVUcoJ3ZlcmJvc2UnLCAoKSA9PiBgW1dlYk5OXSBjcmVhdGVUZW1wb3JhcnlUZW5zb3Ige29ubnhEYXRhVHlwZTogJHtvbm54RGF0YVR5cGV9LCBzaGFwZTogJHtzaGFwZX19YCk7XG4gICAgY29uc3QgZGF0YVR5cGUgPSBvbm54RGF0YVR5cGVUb1dlYm5uRGF0YVR5cGUuZ2V0KG9ubnhEYXRhVHlwZSk7XG4gICAgaWYgKCFkYXRhVHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBPTk5YIGRhdGEgdHlwZTogJHtvbm54RGF0YVR5cGV9YCk7XG4gICAgfVxuICAgIGNvbnN0IHRlbnNvcklkID0gdGhpcy50ZW5zb3JNYW5hZ2VyLnJlc2VydmVUZW5zb3JJZCgpO1xuICAgIGF3YWl0IHRoaXMudGVuc29yTWFuYWdlci5lbnN1cmVUZW5zb3Ioc2Vzc2lvbklkLCB0ZW5zb3JJZCwgZGF0YVR5cGUsIHNoYXBlLCBmYWxzZSk7XG4gICAgY29uc3QgdGVuc29ySWRzID0gdGhpcy50ZW1wb3JhcnlTZXNzaW9uVGVuc29ySWRzLmdldChzZXNzaW9uSWQpO1xuICAgIGlmICghdGVuc29ySWRzKSB7XG4gICAgICB0aGlzLnRlbXBvcmFyeVNlc3Npb25UZW5zb3JJZHMuc2V0KHNlc3Npb25JZCwgW3RlbnNvcklkXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbnNvcklkcy5wdXNoKHRlbnNvcklkKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbnNvcklkO1xuICB9XG5cbiAgcHVibGljIHVwbG9hZFRlbnNvcih0ZW5zb3JJZDogVGVuc29ySWQsIGRhdGE6IFVpbnQ4QXJyYXkpOiB2b2lkIHtcbiAgICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcbiAgICBpZiAoIXdhc20uc2hvdWxkVHJhbnNmZXJUb01MVGVuc29yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byB1cGxvYWQgdG8gYSBNTFRlbnNvciB3aGlsZSBzaG91bGRUcmFuc2ZlclRvTUxUZW5zb3IgaXMgZmFsc2UnKTtcbiAgICB9XG4gICAgTE9HX0RFQlVHKCd2ZXJib3NlJywgKCkgPT4gYFtXZWJOTl0gdXBsb2FkVGVuc29yIHt0ZW5zb3JJZDogJHt0ZW5zb3JJZH0sIGRhdGE6ICR7ZGF0YS5ieXRlTGVuZ3RofX1gKTtcbiAgICB0aGlzLnRlbnNvck1hbmFnZXIudXBsb2FkKHRlbnNvcklkLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkb3dubG9hZFRlbnNvcih0ZW5zb3JJZDogVGVuc29ySWQsIGRzdEJ1ZmZlcjogQXJyYXlCdWZmZXJWaWV3IHwgQXJyYXlCdWZmZXIpOiBQcm9taXNlPHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiB0aGlzLnRlbnNvck1hbmFnZXIuZG93bmxvYWQodGVuc29ySWQsIGRzdEJ1ZmZlcik7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTUxUZW5zb3JEb3dubG9hZGVyKHRlbnNvcklkOiBUZW5zb3JJZCwgdHlwZTogVGVuc29yLk1MVGVuc29yRGF0YVR5cGVzKTogKCkgPT4gUHJvbWlzZTxUZW5zb3IuRGF0YVR5cGU+IHtcbiAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMudGVuc29yTWFuYWdlci5kb3dubG9hZCh0ZW5zb3JJZCk7XG4gICAgICByZXR1cm4gY3JlYXRlVmlldyhkYXRhLCB0eXBlKTtcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTUxUZW5zb3Ioc2Vzc2lvbklkOiBudW1iZXIsIHRlbnNvcjogTUxUZW5zb3IsIG9ubnhEYXRhVHlwZTogRGF0YVR5cGUsIGRpbWVuc2lvbnM6IG51bWJlcltdKTogVGVuc29ySWQge1xuICAgIGNvbnN0IHdlYm5uRGF0YVR5cGUgPSBvbm54RGF0YVR5cGVUb1dlYm5uRGF0YVR5cGUuZ2V0KG9ubnhEYXRhVHlwZSk7XG4gICAgaWYgKCF3ZWJubkRhdGFUeXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIE9OTlggZGF0YSB0eXBlOiAke29ubnhEYXRhVHlwZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IHRoaXMudGVuc29yTWFuYWdlci5yZWdpc3RlclRlbnNvcihzZXNzaW9uSWQsIHRlbnNvciwgd2Vibm5EYXRhVHlwZSwgZGltZW5zaW9ucyk7XG4gICAgTE9HX0RFQlVHKFxuICAgICAgJ3ZlcmJvc2UnLFxuICAgICAgKCkgPT5cbiAgICAgICAgYFtXZWJOTl0gcmVnaXN0ZXJNTFRlbnNvciB7dGVuc29yOiAke3RlbnNvcn0sIGRhdGFUeXBlOiAke3dlYm5uRGF0YVR5cGV9LCBkaW1lbnNpb25zOiAke1xuICAgICAgICAgIGRpbWVuc2lvbnNcbiAgICAgICAgfX0gLT4ge3RlbnNvcklkOiAke2lkfX1gLFxuICAgICk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLy8gUmVnaXN0ZXIgYSBXZWJOTiBDb25zdGFudCBvcGVyYW5kIGZyb20gZXh0ZXJuYWwgZGF0YS5cbiAgcHVibGljIHJlZ2lzdGVyTUxDb25zdGFudChcbiAgICBleHRlcm5hbEZpbGVQYXRoOiBzdHJpbmcsXG4gICAgZGF0YU9mZnNldDogbnVtYmVyLFxuICAgIGRhdGFMZW5ndGg6IG51bWJlcixcbiAgICBidWlsZGVyOiBNTEdyYXBoQnVpbGRlcixcbiAgICBkZXNjOiBNTE9wZXJhbmREZXNjcmlwdG9yLFxuICAgIG1vdW50ZWRGaWxlczogTWFwPHN0cmluZywgVWludDhBcnJheT4gfCB1bmRlZmluZWQsXG4gICAgc2hvdWxkQ29udmVydEludDY0VG9JbnQzMiA9IGZhbHNlLFxuICApOiBNTE9wZXJhbmQge1xuICAgIC8vIElmIGF2YWlsYWJsZSwgXCJNb2R1bGUuTW91bnRlZEZpbGVzXCIgaXMgYSBNYXAgZm9yIGFsbCBwcmVsb2FkZWQgZmlsZXMuXG4gICAgaWYgKCFtb3VudGVkRmlsZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXh0ZXJuYWwgbW91bnRlZCBmaWxlcyBhcmUgbm90IGF2YWlsYWJsZS4nKTtcbiAgICB9XG5cbiAgICBsZXQgZmlsZVBhdGggPSBleHRlcm5hbEZpbGVQYXRoO1xuICAgIGlmIChleHRlcm5hbEZpbGVQYXRoLnN0YXJ0c1dpdGgoJy4vJykpIHtcbiAgICAgIGZpbGVQYXRoID0gZXh0ZXJuYWxGaWxlUGF0aC5zdWJzdHJpbmcoMik7XG4gICAgfVxuICAgIGNvbnN0IGZpbGVEYXRhID0gbW91bnRlZEZpbGVzLmdldChmaWxlUGF0aCk7XG4gICAgaWYgKCFmaWxlRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGaWxlIHdpdGggbmFtZSAke2ZpbGVQYXRofSBub3QgZm91bmQgaW4gcHJlbG9hZGVkIGZpbGVzLmApO1xuICAgIH1cblxuICAgIGlmIChkYXRhT2Zmc2V0ICsgZGF0YUxlbmd0aCA+IGZpbGVEYXRhLmJ5dGVMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT3V0IG9mIGJvdW5kczogZGF0YSBvZmZzZXQgYW5kIGxlbmd0aCBleGNlZWQgdGhlIGV4dGVybmFsIGZpbGUgZGF0YSBzaXplLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IGZpbGVEYXRhLnNsaWNlKGRhdGFPZmZzZXQsIGRhdGFPZmZzZXQgKyBkYXRhTGVuZ3RoKS5idWZmZXI7XG4gICAgbGV0IGJ1ZmZlclZpZXc6IEFycmF5QnVmZmVyVmlldztcbiAgICBzd2l0Y2ggKGRlc2MuZGF0YVR5cGUpIHtcbiAgICAgIGNhc2UgJ2Zsb2F0MzInOlxuICAgICAgICBidWZmZXJWaWV3ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Zsb2F0MTYnOlxuICAgICAgICBidWZmZXJWaWV3ID1cbiAgICAgICAgICB0eXBlb2YgRmxvYXQxNkFycmF5ICE9PSAndW5kZWZpbmVkJyAmJiBGbG9hdDE2QXJyYXkuZnJvbSA/IG5ldyBGbG9hdDE2QXJyYXkoYnVmZmVyKSA6IG5ldyBVaW50MTZBcnJheShidWZmZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ludDMyJzpcbiAgICAgICAgYnVmZmVyVmlldyA9IG5ldyBJbnQzMkFycmF5KGJ1ZmZlcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndWludDMyJzpcbiAgICAgICAgYnVmZmVyVmlldyA9IG5ldyBVaW50MzJBcnJheShidWZmZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ludDY0JzpcbiAgICAgICAgaWYgKHNob3VsZENvbnZlcnRJbnQ2NFRvSW50MzIpIHtcbiAgICAgICAgICAvLyBJbnQ2NCBpcyBub3Qgc3VwcG9ydGVkIGJ5IGN1cnJlbnQgY29udGV4dCwgdXNlIGludDMyIGluc3RlYWQuXG4gICAgICAgICAgY29uc3QgaW50MzJCdWZmZXIgPSBjb252ZXJ0RGF0YVRvSW50MzIobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSwgJ2ludDY0Jyk7XG4gICAgICAgICAgYnVmZmVyVmlldyA9IG5ldyBJbnQzMkFycmF5KGludDMyQnVmZmVyLmJ1ZmZlcik7XG4gICAgICAgICAgZGVzYy5kYXRhVHlwZSA9ICdpbnQzMic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVmZmVyVmlldyA9IG5ldyBCaWdJbnQ2NEFycmF5KGJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1aW50NjQnOlxuICAgICAgICBidWZmZXJWaWV3ID0gbmV3IEJpZ1VpbnQ2NEFycmF5KGJ1ZmZlcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW50OCc6XG4gICAgICAgIGJ1ZmZlclZpZXcgPSBuZXcgSW50OEFycmF5KGJ1ZmZlcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW50NCc6XG4gICAgICBjYXNlICd1aW50NCc6XG4gICAgICBjYXNlICd1aW50OCc6XG4gICAgICAgIGJ1ZmZlclZpZXcgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGF0YSB0eXBlOiAke2Rlc2MuZGF0YVR5cGV9IGluIGNyZWF0aW5nIFdlYk5OIENvbnN0YW50IGZyb20gZXh0ZXJuYWwgZGF0YS5gKTtcbiAgICB9XG5cbiAgICBMT0dfREVCVUcoXG4gICAgICAndmVyYm9zZScsXG4gICAgICAoKSA9PlxuICAgICAgICBgW1dlYk5OXSByZWdpc3Rlck1MQ29uc3RhbnQge2RhdGFUeXBlOiAke2Rlc2MuZGF0YVR5cGV9LCBzaGFwZTogJHtkZXNjLnNoYXBlfX19ICR7XG4gICAgICAgICAgc2hvdWxkQ29udmVydEludDY0VG9JbnQzMiA/ICcoTm90ZTogaXQgd2FzIGludDY0IGRhdGEgdHlwZSBhbmQgcmVnaXN0ZXJlZCB0byBpbnQzMiBhcyB3b3JrYXJvdW5kKScgOiAnJ1xuICAgICAgICB9YCxcbiAgICApO1xuXG4gICAgcmV0dXJuIGJ1aWxkZXIuY29uc3RhbnQoZGVzYywgYnVmZmVyVmlldyk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJHcmFwaElucHV0KGlucHV0TmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy50ZW1wb3JhcnlHcmFwaElucHV0cy5wdXNoKGlucHV0TmFtZSk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJHcmFwaE91dHB1dChvdXRwdXROYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnRlbXBvcmFyeUdyYXBoT3V0cHV0cy5wdXNoKG91dHB1dE5hbWUpO1xuICB9XG5cbiAgcHVibGljIGlzR3JhcGhJbnB1dChzZXNzaW9uSWQ6IG51bWJlciwgaW5wdXROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBpbnB1dE5hbWVzID0gdGhpcy5zZXNzaW9uR3JhcGhJbnB1dHMuZ2V0KHNlc3Npb25JZCk7XG4gICAgaWYgKCFpbnB1dE5hbWVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBpbnB1dE5hbWVzLmluY2x1ZGVzKGlucHV0TmFtZSk7XG4gIH1cblxuICBwdWJsaWMgaXNHcmFwaE91dHB1dChzZXNzaW9uSWQ6IG51bWJlciwgb3V0cHV0TmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgb3V0cHV0TmFtZXMgPSB0aGlzLnNlc3Npb25HcmFwaE91dHB1dHMuZ2V0KHNlc3Npb25JZCk7XG4gICAgaWYgKCFvdXRwdXROYW1lcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0TmFtZXMuaW5jbHVkZXMob3V0cHV0TmFtZSk7XG4gIH1cblxuICBwdWJsaWMgaXNHcmFwaElucHV0T3V0cHV0VHlwZVN1cHBvcnRlZChzZXNzaW9uSWQ6IG51bWJlciwgdHlwZTogVGVuc29yLlR5cGUsIGlzSW5wdXQgPSB0cnVlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0YVR5cGUgPSBvbm54RGF0YVR5cGVUb1dlYm5uRGF0YVR5cGUuZ2V0KHRlbnNvckRhdGFUeXBlU3RyaW5nVG9FbnVtKHR5cGUpKTtcbiAgICBjb25zdCBvcExpbWl0cyA9IHRoaXMubWxPcFN1cHBvcnRMaW1pdHNCeVNlc3Npb25JZC5nZXQoc2Vzc2lvbklkKTtcblxuICAgIGlmICh0eXBlb2YgZGF0YVR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzSW5wdXQpIHtcbiAgICAgIHJldHVybiAhIW9wTGltaXRzPy5pbnB1dC5kYXRhVHlwZXMuaW5jbHVkZXMoZGF0YVR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gISFvcExpbWl0cz8ub3V0cHV0LmRhdGFUeXBlcy5pbmNsdWRlcyhkYXRhVHlwZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGZsdXNoKCk6IHZvaWQge1xuICAgIC8vIFVubGlrZSB0aGUgV2ViR1BVIGJhY2tlbmQsIHRoZSBXZWJOTiBiYWNrZW5kIGRvZXMgbm90IG5lZWQgdG8gZmx1c2ggYW55IHBlbmRpbmcgb3BlcmF0aW9ucy5cbiAgfVxufVxuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG4vLyBXZWJOTiBBUEkgY3VycmVudGx5IGRvZXMgbm90IGhhdmUgYSBUeXBlU2NyaXB0IGRlZmluaXRpb24gZmlsZS4gVGhpcyBmaWxlIGlzIGEgd29ya2Fyb3VuZCB3aXRoIHR5cGVzIGdlbmVyYXRlZCBmcm9tXG4vLyBXZWJOTiBBUEkgc3BlY2lmaWNhdGlvbi5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJtYWNoaW5lbGVhcm5pbmcvd2Vibm4vaXNzdWVzLzY3N1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzZXAvd2Vibm4vd2Vibm4uZC50c1wiIC8+XG5cbmltcG9ydCB7IEVudiwgSW5mZXJlbmNlU2Vzc2lvbiwgVGVuc29yLCBUUkFDRV9FVkVOVF9CRUdJTiwgVFJBQ0VfRVZFTlRfRU5EIH0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHtcbiAgU2VyaWFsaXphYmxlSW50ZXJuYWxCdWZmZXIsXG4gIFNlcmlhbGl6YWJsZVNlc3Npb25NZXRhZGF0YSxcbiAgU2VyaWFsaXphYmxlVGVuc29yTWV0YWRhdGEsXG4gIFRlbnNvck1ldGFkYXRhLFxufSBmcm9tICcuL3Byb3h5LW1lc3NhZ2VzJztcbmltcG9ydCB7IHNldFJ1bk9wdGlvbnMgfSBmcm9tICcuL3J1bi1vcHRpb25zJztcbmltcG9ydCB7IHNldFNlc3Npb25PcHRpb25zIH0gZnJvbSAnLi9zZXNzaW9uLW9wdGlvbnMnO1xuaW1wb3J0IHtcbiAgY2FsY3VsYXRlVGVuc29yU2l6ZUluQnl0ZXMsXG4gIGRhdGFMb2NhdGlvblN0cmluZ1RvRW51bSxcbiAgaXNHcHVCdWZmZXJTdXBwb3J0ZWRUeXBlLFxuICBpc01MVGVuc29yU3VwcG9ydGVkVHlwZSxcbiAgbG9nTGV2ZWxTdHJpbmdUb0VudW0sXG4gIHRlbnNvckRhdGFUeXBlRW51bVRvU3RyaW5nLFxuICB0ZW5zb3JEYXRhVHlwZVN0cmluZ1RvRW51bSxcbiAgdGVuc29yVHlwZVRvVHlwZWRBcnJheUNvbnN0cnVjdG9yLFxufSBmcm9tICcuL3dhc20tY29tbW9uJztcbmltcG9ydCB7IGdldEluc3RhbmNlIH0gZnJvbSAnLi93YXNtLWZhY3RvcnknO1xuaW1wb3J0IHsgYWxsb2NXYXNtU3RyaW5nLCBjaGVja0xhc3RFcnJvciB9IGZyb20gJy4vd2FzbS11dGlscyc7XG5pbXBvcnQgeyBsb2FkRmlsZSB9IGZyb20gJy4vd2FzbS11dGlscy1sb2FkLWZpbGUnO1xuXG4vLyAjcmVnaW9uIEluaXRpYWxpemF0aW9uc1xuXG4vKipcbiAqIFRoZXJlIGFyZSA0IGRpZmZlcmVudCBcImluaXRpYWxpemF0aW9uXCIgc3RlcHMgZm9yIE9SVC4gVGhleSBoYXBwZW4gaW4gZGlmZmVyZW50IHBsYWNlcyBhbmQgZGlmZmVyZW50IHRpbWUuXG4gKlxuICogMS4gSmF2YVNjcmlwdCBpbml0aWFsaXphdGlvbiBmb3Igb25ueHJ1bnRpbWUtY29tbW9uIGFuZCBvbm54cnVudGltZS13ZWIuXG4gKiAgICBUaGlzIGlzIHRoZSBmaXJzdCBpbml0aWFsaXphdGlvbiBzdGVwLiBJbiB0aGlzIHN0ZXAsIG9ubnhydW50aW1lLXdlYiBjYWxscyBvbm54cnVudGltZS1jb21tb24ncyByZWdpc3RlckJhY2tlbmQoKVxuICogZnVuY3Rpb24gbXVsdGlwbGUgdGltZXMgdG8gcmVnaXN0ZXIgYWxsIHRoZSBhdmFpbGFibGUgYmFja2VuZHMuIFRoZSBiYWNrZW5kIHJlZ2lzdHJhdGlvbiBpcyB2ZXJ5IGZhc3QuIEl0IG9ubHlcbiAqIHJlZ2lzdGVycyB0aGUgYmFja2VuZCBuYW1lIHdpdGggdGhlIHVuaW5pdGlhbGl6ZWQgYmFja2VuZCBvYmplY3QuIE5vIGhlYXZ5IGluaXRpYWxpemF0aW9uIGlzIGRvbmUgaW4gdGhpcyBzdGVwLlxuICogICAgUmVmZXIgdG8gd2ViL2xpYi9pbmRleC50cyBmb3IgdGhlIGJhY2tlbmQgcmVnaXN0cmF0aW9uLlxuICpcbiAqIDIuIFdlYkFzc2VtYmx5IGFydGlmYWN0IGluaXRpYWxpemF0aW9uLlxuICogICAgVGhpcyBoYXBwZW5zIHdoZW4gYW55IHJlZ2lzdGVyZWQgd2FzbSBiYWNrZW5kIGlzIHVzZWQgZm9yIHRoZSBmaXJzdCB0aW1lIChpZS4gYG9ydC5JbmZlcmVuY2VTZXNzaW9uLmNyZWF0ZSgpYCBpc1xuICogY2FsbGVkKS4gSW4gdGhpcyBzdGVwLCBvbm54cnVudGltZS13ZWIgZG9lcyB0aGUgZm9sbG93aW5nczpcbiAqICAgICAtIGNyZWF0ZSBhIHByb3h5IHdvcmtlciBhbmQgbWFrZSBzdXJlIHRoZSBwcm94eSB3b3JrZXIgaXMgcmVhZHkgdG8gcmVjZWl2ZSBtZXNzYWdlcywgaWYgcHJveHkgaXMgZW5hYmxlZC5cbiAqICAgICAtIHBlcmZvcm0gZmVhdHVyZSBkZXRlY3Rpb24sIGxvY2F0ZSBjb3JyZWN0IFdlYkFzc2VtYmx5IGFydGlmYWN0IHBhdGggYW5kIGNhbGwgdGhlIEVtc2NyaXB0ZW4gZ2VuZXJhdGVkXG4gKiBKYXZhU2NyaXB0IGNvZGUgdG8gaW5pdGlhbGl6ZSB0aGUgV2ViQXNzZW1ibHkgcnVudGltZS5cbiAqICAgICAgICAgLSBpZiBwcm94eSBpcyBlbmFibGVkLCB0aGlzIHN0ZXAgaGFwcGVucyBpbiB0aGUgcHJveHkgd29ya2VyIHVzaW5nIG1lc3NhZ2UgJ2luaXQtd2FzbScuXG4gKiAgICAgICAgIC0gZG93bmxvYWRpbmcgdGhlICdvcnQtd2FzbXsuLi59Lndhc20nIGZpbGUgaXMgZG9uZSBpbiB0aGlzIHN0ZXAuXG4gKiAgICAgICAgIC0gaWYgbXVsdGktdGhyZWFkIGlzIGVuYWJsZWQsIG9uZSBvciBtb3JlIHdlYndvcmtlciB3aWxsIGJlIGNyZWF0ZWQgdG8gaW5pdGlhbGl6ZSB0aGUgUFRocmVhZCB0aHJlYWRwb29sLlxuICpcbiAqIDMuIE9SVCBlbnZpcm9ubWVudCBpbml0aWFsaXphdGlvbi5cbiAqICAgIFRoaXMgaGFwcGVucyBhZnRlciBzdGVwIDIuIEluIHRoaXMgc3RlcCwgb25ueHJ1bnRpbWUtd2ViIHBlcmZvcm1zIE9OTlggUnVudGltZSBlbnZpcm9ubWVudCBpbml0aWFsaXphdGlvbi5cbiAqIEZ1bmN0aW9uIGBfT3J0SW5pdCgpYCBpcyBjYWxsZWQgaW4gdGhpcyBzdGVwLlxuICogICAgIC0gaWYgcHJveHkgaXMgZW5hYmxlZCwgdGhpcyBzdGVwIGhhcHBlbnMgaW4gdGhlIHByb3h5IHdvcmtlciB1c2luZyBtZXNzYWdlICdpbml0LW9ydCcuXG4gKiAgICAgLSBsb2dnaW5nIGxldmVsIChvcnQuZW52LmxvZ0xldmVsKSBhbmQgdGhyZWFkIG51bWJlciAob3J0LmVudi53YXNtLm51bVRocmVhZHMpIGFyZSBzZXQgaW4gdGhpcyBzdGVwLlxuICpcbiAqIDQuIFNlc3Npb24gaW5pdGlhbGl6YXRpb24uXG4gKiAgICBUaGlzIGhhcHBlbnMgd2hlbiBgb3J0LkluZmVyZW5jZVNlc3Npb24uY3JlYXRlKClgIGlzIGNhbGxlZC4gVW5saWtlIHRoZSBmaXJzdCAzIHN0ZXBzICh0aGV5IG9ubHkgY2FsbGVkIG9uY2UpLFxuICogdGhpcyBzdGVwIHdpbGwgYmUgZG9uZSBmb3IgZWFjaCBzZXNzaW9uLiBJbiB0aGlzIHN0ZXAsIG9ubnhydW50aW1lLXdlYiBkb2VzIHRoZSBmb2xsb3dpbmdzOlxuICogICAgSWYgdGhlIHBhcmFtZXRlciBpcyBhIFVSTDpcbiAqICAgIC0gZG93bmxvYWQgdGhlIG1vZGVsIGRhdGEgZnJvbSB0aGUgVVJMLlxuICogICAgLSBjb3B5IHRoZSBtb2RlbCBkYXRhIHRvIHRoZSBXQVNNIGhlYXAuIChwcm94eTogJ2NvcHktZnJvbScpXG4gKiAgICAtIGRlcmVmZXJlbmNlIHRoZSBtb2RlbCBidWZmZXIuIFRoaXMgc3RlcCBhbGxvd3MgdGhlIG9yaWdpbmFsIEFycmF5QnVmZmVyIHRvIGJlIGdhcmJhZ2UgY29sbGVjdGVkLlxuICogICAgLSBjYWxsIGBfT3J0Q3JlYXRlU2Vzc2lvbigpYCB0byBjcmVhdGUgdGhlIHNlc3Npb24uIChwcm94eTogJ2NyZWF0ZScpXG4gKlxuICogICAgSWYgdGhlIHBhcmFtZXRlciBpcyBhIFVpbnQ4QXJyYXkgb2JqZWN0OlxuICogICAgLSBjb3B5IHRoZSBtb2RlbCBkYXRhIHRvIHRoZSBXQVNNIGhlYXAuIChwcm94eTogJ2NvcHktZnJvbScpXG4gKiAgICAtIGNhbGwgYF9PcnRDcmVhdGVTZXNzaW9uKClgIHRvIGNyZWF0ZSB0aGUgc2Vzc2lvbi4gKHByb3h5OiAnY3JlYXRlJylcbiAqXG4gKlxuICovXG5cbi8qKlxuICogaW5pdGlhbGl6ZSBPUlQgZW52aXJvbm1lbnQuXG4gKlxuICogQHBhcmFtIG51bVRocmVhZHMgU2V0R2xvYmFsSW50cmFPcE51bVRocmVhZHMobnVtVGhyZWFkcylcbiAqIEBwYXJhbSBsb2dnaW5nTGV2ZWwgQ3JlYXRlRW52KHN0YXRpY19jYXN0PE9ydExvZ2dpbmdMZXZlbD4obG9nZ2luZ19sZXZlbCkpXG4gKi9cbmNvbnN0IGluaXRPcnQgPSAobnVtVGhyZWFkczogbnVtYmVyLCBsb2dnaW5nTGV2ZWw6IG51bWJlcik6IHZvaWQgPT4ge1xuICBjb25zdCBlcnJvckNvZGUgPSBnZXRJbnN0YW5jZSgpLl9PcnRJbml0KG51bVRocmVhZHMsIGxvZ2dpbmdMZXZlbCk7XG4gIGlmIChlcnJvckNvZGUgIT09IDApIHtcbiAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IGluaXRpYWxpemUgb25ueHJ1bnRpbWUuXCIpO1xuICB9XG59O1xuXG4vKipcbiAqIGluaXRpYWxpemUgcnVudGltZSBlbnZpcm9ubWVudC5cbiAqIEBwYXJhbSBlbnYgcGFzc2VkIGluIHRoZSBlbnZpcm9ubWVudCBjb25maWcgb2JqZWN0LlxuICovXG5leHBvcnQgY29uc3QgaW5pdFJ1bnRpbWUgPSBhc3luYyAoZW52OiBFbnYpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgLy8gaW5pdCBPUlRcbiAgaW5pdE9ydChlbnYud2FzbS5udW1UaHJlYWRzISwgbG9nTGV2ZWxTdHJpbmdUb0VudW0oZW52LmxvZ0xldmVsKSk7XG59O1xuXG4vKipcbiAqIHBlcmZvcm0gRVAgc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24uXG4gKlxuICogQHBhcmFtIGVudlxuICogQHBhcmFtIGVwTmFtZVxuICovXG5leHBvcnQgY29uc3QgaW5pdEVwID0gYXN5bmMgKGVudjogRW52LCBlcE5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAvLyBpbml0aWFsaXplIEFTWU5DSUZZIHN1cHBvcnRcbiAgZ2V0SW5zdGFuY2UoKS5hc3luY0luaXQ/LigpO1xuXG4gIC8vIHBlcmZvcm0gV2ViR1BVIGF2YWlsYWJpbGl0eSBjaGVjayAoIGVpdGhlciBKU0VQIG9yIFdlYkdQVSBFUCApXG4gIGxldCB3ZWJncHVBZGFwdGVyID0gZW52LndlYmdwdS5hZGFwdGVyIGFzIEdQVUFkYXB0ZXIgfCBudWxsO1xuICBpZiAoZXBOYW1lID09PSAnd2ViZ3B1Jykge1xuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhbmF2aWdhdG9yLmdwdSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdXZWJHUFUgaXMgbm90IHN1cHBvcnRlZCBpbiBjdXJyZW50IGVudmlyb25tZW50Jyk7XG4gICAgfVxuICAgIGlmICghd2ViZ3B1QWRhcHRlcikge1xuICAgICAgLy8gaWYgYWRhcHRlciBpcyBub3Qgc2V0LCByZXF1ZXN0IGEgbmV3IGFkYXB0ZXIuXG4gICAgICBjb25zdCBwb3dlclByZWZlcmVuY2UgPSBlbnYud2ViZ3B1LnBvd2VyUHJlZmVyZW5jZTtcbiAgICAgIGlmIChwb3dlclByZWZlcmVuY2UgIT09IHVuZGVmaW5lZCAmJiBwb3dlclByZWZlcmVuY2UgIT09ICdsb3ctcG93ZXInICYmIHBvd2VyUHJlZmVyZW5jZSAhPT0gJ2hpZ2gtcGVyZm9ybWFuY2UnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBwb3dlclByZWZlcmVuY2Ugc2V0dGluZzogXCIke3Bvd2VyUHJlZmVyZW5jZX1cImApO1xuICAgICAgfVxuICAgICAgY29uc3QgZm9yY2VGYWxsYmFja0FkYXB0ZXIgPSBlbnYud2ViZ3B1LmZvcmNlRmFsbGJhY2tBZGFwdGVyO1xuICAgICAgaWYgKGZvcmNlRmFsbGJhY2tBZGFwdGVyICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGZvcmNlRmFsbGJhY2tBZGFwdGVyICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGZvcmNlRmFsbGJhY2tBZGFwdGVyIHNldHRpbmc6IFwiJHtmb3JjZUZhbGxiYWNrQWRhcHRlcn1cImApO1xuICAgICAgfVxuICAgICAgd2ViZ3B1QWRhcHRlciA9IGF3YWl0IG5hdmlnYXRvci5ncHUucmVxdWVzdEFkYXB0ZXIoeyBwb3dlclByZWZlcmVuY2UsIGZvcmNlRmFsbGJhY2tBZGFwdGVyIH0pO1xuICAgICAgaWYgKCF3ZWJncHVBZGFwdGVyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnRmFpbGVkIHRvIGdldCBHUFUgYWRhcHRlci4gJyArXG4gICAgICAgICAgICAnWW91IG1heSBuZWVkIHRvIGVuYWJsZSBmbGFnIFwiLS1lbmFibGUtdW5zYWZlLXdlYmdwdVwiIGlmIHlvdSBhcmUgdXNpbmcgQ2hyb21lLicsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlmIGFkYXB0ZXIgaXMgc2V0LCB2YWxpZGF0ZSBpdC5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHdlYmdwdUFkYXB0ZXIubGltaXRzICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICB0eXBlb2Ygd2ViZ3B1QWRhcHRlci5mZWF0dXJlcyAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgdHlwZW9mIHdlYmdwdUFkYXB0ZXIucmVxdWVzdERldmljZSAhPT0gJ2Z1bmN0aW9uJ1xuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBHUFUgYWRhcHRlciBzZXQgaW4gYGVudi53ZWJncHUuYWRhcHRlcmAuIEl0IG11c3QgYmUgYSBHUFVBZGFwdGVyIG9iamVjdC4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBwZXJmb3JtIFdlYk5OIGF2YWlsYWJpbGl0eSBjaGVjayAoIGVpdGhlciBKU0VQIG9yIFdlYk5OIEVQIClcbiAgaWYgKGVwTmFtZSA9PT0gJ3dlYm5uJykge1xuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhKG5hdmlnYXRvciBhcyB1bmtub3duIGFzIHsgbWw6IHVua25vd24gfSkubWwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2ViTk4gaXMgbm90IHN1cHBvcnRlZCBpbiBjdXJyZW50IGVudmlyb25tZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfSlNFUCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgY29uc3QgaW5pdEpzZXAgPSByZXF1aXJlKCcuL2pzZXAvaW5pdCcpLmluaXQ7XG5cbiAgICBpZiAoZXBOYW1lID09PSAnd2ViZ3B1Jykge1xuICAgICAgYXdhaXQgaW5pdEpzZXAoJ3dlYmdwdScsIGdldEluc3RhbmNlKCksIGVudiwgd2ViZ3B1QWRhcHRlcik7XG4gICAgfVxuICAgIGlmIChlcE5hbWUgPT09ICd3ZWJubicpIHtcbiAgICAgIGF3YWl0IGluaXRKc2VwKCd3ZWJubicsIGdldEluc3RhbmNlKCksIGVudik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSAmJiBlcE5hbWUgPT09ICd3ZWJncHUnKSB7XG4gICAgICBnZXRJbnN0YW5jZSgpLndlYmdwdUluaXQhKChkZXZpY2UpID0+IHtcbiAgICAgICAgZW52LndlYmdwdS5kZXZpY2UgPSBkZXZpY2U7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCTk4gJiYgZXBOYW1lID09PSAnd2Vibm4nKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cywgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xuICAgICAgY29uc3QgYmFja2VuZCA9IG5ldyAocmVxdWlyZSgnLi9qc2VwL2JhY2tlbmQtd2Vibm4nKS5XZWJOTkJhY2tlbmQpKGVudik7XG4gICAgICBnZXRJbnN0YW5jZSgpLndlYm5uSW5pdCEoW1xuICAgICAgICBiYWNrZW5kLFxuICAgICAgICAvLyB3ZWJublJlc2VydmVUZW5zb3JJZFxuICAgICAgICAoKSA9PiBiYWNrZW5kLnJlc2VydmVUZW5zb3JJZCgpLFxuICAgICAgICAvLyB3ZWJublJlbGVhc2VUZW5zb3JJZCxcbiAgICAgICAgKHRlbnNvcklkOiBudW1iZXIpID0+IGJhY2tlbmQucmVsZWFzZVRlbnNvcklkKHRlbnNvcklkKSxcbiAgICAgICAgLy8gd2Vibm5FbnN1cmVUZW5zb3JcbiAgICAgICAgYXN5bmMgKHNlc3Npb25JZDogbnVtYmVyIHwgdW5kZWZpbmVkLCB0ZW5zb3JJZDogbnVtYmVyLCBvbm54RGF0YVR5cGU6IG51bWJlciwgc2hhcGU6IG51bWJlcltdLCBjb3B5T2xkKSA9PlxuICAgICAgICAgIGJhY2tlbmQuZW5zdXJlVGVuc29yKHNlc3Npb25JZCwgdGVuc29ySWQsIG9ubnhEYXRhVHlwZSwgc2hhcGUsIGNvcHlPbGQpLFxuICAgICAgICAvLyB3ZWJublVwbG9hZFRlbnNvclxuICAgICAgICAodGVuc29ySWQ6IG51bWJlciwgZGF0YTogVWludDhBcnJheSkgPT4ge1xuICAgICAgICAgIGJhY2tlbmQudXBsb2FkVGVuc29yKHRlbnNvcklkLCBkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gd2Vibm5Eb3dubG9hZFRlbnNvclxuICAgICAgICBhc3luYyAodGVuc29ySWQ6IG51bWJlciwgZHN0QnVmZmVyOiBBcnJheUJ1ZmZlclZpZXcgfCBBcnJheUJ1ZmZlcikgPT5cbiAgICAgICAgICBiYWNrZW5kLmRvd25sb2FkVGVuc29yKHRlbnNvcklkLCBkc3RCdWZmZXIpLFxuICAgICAgICAvLyB3ZWJublJlZ2lzdGVyTUxDb250ZXh0XG4gICAgICAgIChzZXNzaW9uSWQ6IG51bWJlciwgbWxDb250ZXh0OiBNTENvbnRleHQpID0+IGJhY2tlbmQucmVnaXN0ZXJNTENvbnRleHQoc2Vzc2lvbklkLCBtbENvbnRleHQpLFxuICAgICAgICAvLyB3ZWJubkVuYWJsZVRyYWNlRXZlbnRcbiAgICAgICAgISFlbnYudHJhY2UsXG4gICAgICBdKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vICNlbmRyZWdpb24gSW5pdGlhbGl6YXRpb25zXG5cbi8qKlxuICogdmFsaWQgZGF0YSBsb2NhdGlvbnMgZm9yIGlucHV0L291dHB1dCB0ZW5zb3JzLlxuICovXG50eXBlIFN1cHBvcnRlZFRlbnNvckRhdGFMb2NhdGlvbkZvcklucHV0T3V0cHV0ID1cbiAgfCAnY3B1J1xuICB8ICdjcHUtcGlubmVkJ1xuICB8ICdncHUtYnVmZmVyJ1xuICB8ICdtbC10ZW5zb3InXG4gIC8vIFVzZSAnbWwtdGVuc29yJyBkdXJpbmcgaW5mZXJlbmNlLCBidXQgb3V0cHV0IGEgdGVuc29yIGxvY2F0ZWQgb24gdGhlIENQVS5cbiAgfCAnbWwtdGVuc29yLWNwdS1vdXRwdXQnO1xuXG50eXBlIElPQmluZGluZ1N0YXRlID0ge1xuICAvKipcbiAgICogdGhlIGhhbmRsZSBvZiBJTyBiaW5kaW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgaGFuZGxlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIHRoZSBwcmVmZXJyZWQgbG9jYXRpb24gZm9yIGVhY2ggb3V0cHV0IHRlbnNvci5cbiAgICpcbiAgICogdmFsdWUgaXMgb25lIG9mICdjcHUnLCAnY3B1LXBpbm5lZCcsICdncHUtYnVmZmVyJywgJ21sLXRlbnNvcicuXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnM6IHJlYWRvbmx5IFN1cHBvcnRlZFRlbnNvckRhdGFMb2NhdGlvbkZvcklucHV0T3V0cHV0W107XG5cbiAgLyoqXG4gICAqIGVudW0gdmFsdWUgb2YgdGhlIHByZWZlcnJlZCBsb2NhdGlvbiBmb3IgZWFjaCBvdXRwdXQgdGVuc29yLlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zRW5jb2RlZDogcmVhZG9ubHkgbnVtYmVyW107XG59O1xuXG4vKipcbiAqICB0dXBsZSBlbGVtZW50cyBhcmU6IEluZmVyZW5jZVNlc3Npb24gSUQ7IGlucHV0TmFtZXNVVEY4RW5jb2RlZDsgb3V0cHV0TmFtZXNVVEY4RW5jb2RlZDsgYmluZGluZ1N0YXRlXG4gKi9cbnR5cGUgU2Vzc2lvbk1ldGFkYXRhID0gW1xuICBpbmZlcmVuY2VTZXNzaW9uSWQ6IG51bWJlcixcbiAgaW5wdXROYW1lc1VURjhFbmNvZGVkOiBudW1iZXJbXSxcbiAgb3V0cHV0TmFtZXNVVEY4RW5jb2RlZDogbnVtYmVyW10sXG4gIGJpbmRpbmdTdGF0ZTogSU9CaW5kaW5nU3RhdGUgfCBudWxsLFxuICBlbmFibGVHcmFwaENhcHR1cmU6IGJvb2xlYW4sXG4gIGlucHV0T3V0cHV0Qm91bmQ6IGJvb2xlYW4sXG5dO1xuXG5jb25zdCBhY3RpdmVTZXNzaW9ucyA9IG5ldyBNYXA8bnVtYmVyLCBTZXNzaW9uTWV0YWRhdGE+KCk7XG5cbi8qKlxuICogZ2V0IHRoZSBpbnB1dC9vdXRwdXQgY291bnQgb2YgdGhlIHNlc3Npb24uXG4gKiBAcGFyYW0gc2Vzc2lvbkhhbmRsZSB0aGUgaGFuZGxlIHJlcHJlc2VudGluZyB0aGUgc2Vzc2lvbi4gc2hvdWxkIGJlIG5vbi16ZXJvLlxuICogQHJldHVybnMgYSB0dXBsZSBpbmNsdWRpbmcgMiBudW1iZXJzLCByZXByZXNlbnRpbmcgdGhlIGlucHV0IGNvdW50IGFuZCBvdXRwdXQgY291bnQuXG4gKi9cbmNvbnN0IGdldFNlc3Npb25JbnB1dE91dHB1dENvdW50ID0gKHNlc3Npb25IYW5kbGU6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0gPT4ge1xuICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgc3RhY2sgPSB3YXNtLnN0YWNrU2F2ZSgpO1xuICB0cnkge1xuICAgIGNvbnN0IHB0clNpemUgPSB3YXNtLlBUUl9TSVpFO1xuICAgIGNvbnN0IGRhdGFPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2MoMiAqIHB0clNpemUpO1xuICAgIGNvbnN0IGVycm9yQ29kZSA9IHdhc20uX09ydEdldElucHV0T3V0cHV0Q291bnQoc2Vzc2lvbkhhbmRsZSwgZGF0YU9mZnNldCwgZGF0YU9mZnNldCArIHB0clNpemUpO1xuICAgIGlmIChlcnJvckNvZGUgIT09IDApIHtcbiAgICAgIGNoZWNrTGFzdEVycm9yKFwiQ2FuJ3QgZ2V0IHNlc3Npb24gaW5wdXQvb3V0cHV0IGNvdW50LlwiKTtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IHB0clNpemUgPT09IDQgPyAnaTMyJyA6ICdpNjQnO1xuICAgIHJldHVybiBbTnVtYmVyKHdhc20uZ2V0VmFsdWUoZGF0YU9mZnNldCwgdHlwZSkpLCBOdW1iZXIod2FzbS5nZXRWYWx1ZShkYXRhT2Zmc2V0ICsgcHRyU2l6ZSwgdHlwZSkpXTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3YXNtLnN0YWNrUmVzdG9yZShzdGFjayk7XG4gIH1cbn07XG5cbmNvbnN0IGdldFNlc3Npb25JbnB1dE91dHB1dE1ldGFkYXRhID0gKFxuICBzZXNzaW9uSGFuZGxlOiBudW1iZXIsXG4gIGluZGV4OiBudW1iZXIsXG4pOiBbbmFtZU9mZnNldDogbnVtYmVyLCBlbGVtZW50VHlwZTogbnVtYmVyLCBkaW1zPzogQXJyYXk8bnVtYmVyIHwgc3RyaW5nPl0gPT4ge1xuICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcbiAgY29uc3Qgc3RhY2sgPSB3YXNtLnN0YWNrU2F2ZSgpO1xuICBsZXQgbWV0YWRhdGFPZmZzZXQgPSAwO1xuICB0cnkge1xuICAgIGNvbnN0IHB0clNpemUgPSB3YXNtLlBUUl9TSVpFO1xuICAgIGNvbnN0IGRhdGFPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2MoMiAqIHB0clNpemUpO1xuICAgIGNvbnN0IGVycm9yQ29kZSA9IHdhc20uX09ydEdldElucHV0T3V0cHV0TWV0YWRhdGEoc2Vzc2lvbkhhbmRsZSwgaW5kZXgsIGRhdGFPZmZzZXQsIGRhdGFPZmZzZXQgKyBwdHJTaXplKTtcbiAgICBpZiAoZXJyb3JDb2RlICE9PSAwKSB7XG4gICAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IGdldCBzZXNzaW9uIGlucHV0L291dHB1dCBtZXRhZGF0YS5cIik7XG4gICAgfVxuICAgIGNvbnN0IG5hbWVPZmZzZXQgPSBOdW1iZXIod2FzbS5nZXRWYWx1ZShkYXRhT2Zmc2V0LCAnKicpKTtcbiAgICBtZXRhZGF0YU9mZnNldCA9IE51bWJlcih3YXNtLmdldFZhbHVlKGRhdGFPZmZzZXQgKyBwdHJTaXplLCAnKicpKTtcbiAgICAvLyBnZXQgZWxlbWVudCB0eXBlXG4gICAgY29uc3QgZWxlbWVudFR5cGUgPSB3YXNtLkhFQVAzMlttZXRhZGF0YU9mZnNldCAvIDRdO1xuICAgIGlmIChlbGVtZW50VHlwZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtuYW1lT2Zmc2V0LCAwXTsgLy8gbm9uLXRlbnNvclxuICAgIH1cblxuICAgIC8vIGdldCBkaW1zIGNvdW50XG4gICAgY29uc3QgZGltc0NvdW50ID0gd2FzbS5IRUFQVTMyW21ldGFkYXRhT2Zmc2V0IC8gNCArIDFdO1xuICAgIC8vIGdldCBkaW1zXG4gICAgY29uc3QgZGltczogQXJyYXk8bnVtYmVyIHwgc3RyaW5nPiA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGltc0NvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IHN5bWJvbGljRGltTmFtZU9mZnNldCA9IE51bWJlcih3YXNtLmdldFZhbHVlKG1ldGFkYXRhT2Zmc2V0ICsgOCArIGkgKiBwdHJTaXplLCAnKicpKTtcbiAgICAgIGRpbXMucHVzaChcbiAgICAgICAgc3ltYm9saWNEaW1OYW1lT2Zmc2V0ICE9PSAwXG4gICAgICAgICAgPyB3YXNtLlVURjhUb1N0cmluZyhzeW1ib2xpY0RpbU5hbWVPZmZzZXQpXG4gICAgICAgICAgOiBOdW1iZXIod2FzbS5nZXRWYWx1ZShtZXRhZGF0YU9mZnNldCArIDggKyAoaSArIGRpbXNDb3VudCkgKiBwdHJTaXplLCAnKicpKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBbbmFtZU9mZnNldCwgZWxlbWVudFR5cGUsIGRpbXNdO1xuICB9IGZpbmFsbHkge1xuICAgIHdhc20uc3RhY2tSZXN0b3JlKHN0YWNrKTtcbiAgICBpZiAobWV0YWRhdGFPZmZzZXQgIT09IDApIHtcbiAgICAgIHdhc20uX09ydEZyZWUobWV0YWRhdGFPZmZzZXQpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBhbGxvY2F0ZSB0aGUgbWVtb3J5IGFuZCBtZW1jcHkgdGhlIGV4dGVybmFsIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0gbW9kZWwgLSB0aGUgZXh0ZXJuYWwgYnVmZmVyIGNvbnRhaW5pbmcgdGhlIG1vZGVsIGRhdGEuIE11c3Qgbm90IGJlIHRoZSBzYW1lIGJ1ZmZlciBhcyB0aGUgV0FTTSBoZWFwLlxuICogQHJldHVybnMgYSAyLWVsZW1lbnRzIHR1cGxlIC0gdGhlIHBvaW50ZXIgYW5kIHNpemUgb2YgdGhlIGFsbG9jYXRlZCBidWZmZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGNvcHlGcm9tRXh0ZXJuYWxCdWZmZXIgPSAobW9kZWw6IFVpbnQ4QXJyYXkpOiBbbnVtYmVyLCBudW1iZXJdID0+IHtcbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IG1vZGVsRGF0YU9mZnNldCA9IHdhc20uX21hbGxvYyhtb2RlbC5ieXRlTGVuZ3RoKTtcbiAgaWYgKG1vZGVsRGF0YU9mZnNldCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgY3JlYXRlIGEgc2Vzc2lvbi4gZmFpbGVkIHRvIGFsbG9jYXRlIGEgYnVmZmVyIG9mIHNpemUgJHttb2RlbC5ieXRlTGVuZ3RofS5gKTtcbiAgfVxuICB3YXNtLkhFQVBVOC5zZXQobW9kZWwsIG1vZGVsRGF0YU9mZnNldCk7XG4gIHJldHVybiBbbW9kZWxEYXRhT2Zmc2V0LCBtb2RlbC5ieXRlTGVuZ3RoXTtcbn07XG5cbi8qKlxuICogY3JlYXRlIGFuIGluZmVyZW5jZSBzZXNzaW9uIGZyb20gYSBtb2RlbCBkYXRhIGJ1ZmZlci5cbiAqXG4gKiBAcGFyYW0gbW9kZWxEYXRhIC0gZWl0aGVyIGEgVWludDhBcnJheSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBtb2RlbCBkYXRhLCBvciBhIDItZWxlbWVudHMgdHVwbGUgY29udGFpbmluZyB0aGVcbiAqICAgICBwb2ludGVyIGFuZCBzaXplIG9mIHRoZSBtb2RlbCBkYXRhIGJ1ZmZlci5cbiAqIEBwYXJhbSBvcHRpb25zIGFuIG9wdGlvbmFsIHNlc3Npb24gb3B0aW9ucyBvYmplY3QuXG4gKiBAcmV0dXJucyBhIDMtZWxlbWVudHMgdHVwbGUgY29udGFpbmluZyBbc2Vzc2lvbiBoYW5kbGUsIGlucHV0IG5hbWVzLCBvdXRwdXQgbmFtZXNdXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVTZXNzaW9uID0gYXN5bmMgKFxuICBtb2RlbERhdGE6IFVpbnQ4QXJyYXkgfCBTZXJpYWxpemFibGVJbnRlcm5hbEJ1ZmZlcixcbiAgb3B0aW9ucz86IEluZmVyZW5jZVNlc3Npb24uU2Vzc2lvbk9wdGlvbnMsXG4pOiBQcm9taXNlPFNlcmlhbGl6YWJsZVNlc3Npb25NZXRhZGF0YT4gPT4ge1xuICBsZXQgbW9kZWxEYXRhT2Zmc2V0OiBudW1iZXIsIG1vZGVsRGF0YUxlbmd0aDogbnVtYmVyO1xuICBjb25zdCB3YXNtID0gZ2V0SW5zdGFuY2UoKTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XG4gICAgLy8gaWYgbW9kZWwgZGF0YSBpcyBhbiBhcnJheSwgaXQgbXVzdCBiZSBhIDItZWxlbWVudHMgdHVwbGUgY29udGFpbmluZyB0aGUgcG9pbnRlciBhbmQgc2l6ZSBvZiB0aGUgbW9kZWwgZGF0YVxuICAgIFttb2RlbERhdGFPZmZzZXQsIG1vZGVsRGF0YUxlbmd0aF0gPSBtb2RlbERhdGE7XG4gIH0gZWxzZSBpZiAobW9kZWxEYXRhLmJ1ZmZlciA9PT0gd2FzbS5IRUFQVTguYnVmZmVyKSB7XG4gICAgLy8gaWYgbW9kZWwgZGF0YSB1c2VzIHRoZSBzYW1lIGJ1ZmZlciBhcyB0aGUgV0FTTSBoZWFwLCB3ZSBkb24ndCBuZWVkIHRvIGNvcHkgaXQuXG4gICAgW21vZGVsRGF0YU9mZnNldCwgbW9kZWxEYXRhTGVuZ3RoXSA9IFttb2RlbERhdGEuYnl0ZU9mZnNldCwgbW9kZWxEYXRhLmJ5dGVMZW5ndGhdO1xuICB9IGVsc2Uge1xuICAgIC8vIG90aGVyd2lzZSwgY29weSB0aGUgbW9kZWwgZGF0YSB0byB0aGUgV0FTTSBoZWFwLlxuICAgIFttb2RlbERhdGFPZmZzZXQsIG1vZGVsRGF0YUxlbmd0aF0gPSBjb3B5RnJvbUV4dGVybmFsQnVmZmVyKG1vZGVsRGF0YSk7XG4gIH1cblxuICBsZXQgc2Vzc2lvbkhhbmRsZSA9IDA7XG4gIGxldCBzZXNzaW9uT3B0aW9uc0hhbmRsZSA9IDA7XG4gIGxldCBpb0JpbmRpbmdIYW5kbGUgPSAwO1xuICBsZXQgYWxsb2NzOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBpbnB1dE5hbWVzVVRGOEVuY29kZWQgPSBbXTtcbiAgY29uc3Qgb3V0cHV0TmFtZXNVVEY4RW5jb2RlZCA9IFtdO1xuXG4gIHRyeSB7XG4gICAgW3Nlc3Npb25PcHRpb25zSGFuZGxlLCBhbGxvY3NdID0gYXdhaXQgc2V0U2Vzc2lvbk9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucz8uZXh0ZXJuYWxEYXRhICYmIHdhc20ubW91bnRFeHRlcm5hbERhdGEpIHtcbiAgICAgIGNvbnN0IGxvYWRpbmdQcm9taXNlcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIG9wdGlvbnMuZXh0ZXJuYWxEYXRhKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0eXBlb2YgZmlsZSA9PT0gJ3N0cmluZycgPyBmaWxlIDogZmlsZS5wYXRoO1xuICAgICAgICBsb2FkaW5nUHJvbWlzZXMucHVzaChcbiAgICAgICAgICBsb2FkRmlsZSh0eXBlb2YgZmlsZSA9PT0gJ3N0cmluZycgPyBmaWxlIDogZmlsZS5kYXRhKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB3YXNtLm1vdW50RXh0ZXJuYWxEYXRhKHBhdGgsIGRhdGEpO1xuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyB3YWl0IGZvciBhbGwgZXh0ZXJuYWwgZGF0YSBmaWxlcyB0byBiZSBsb2FkZWRcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKGxvYWRpbmdQcm9taXNlcyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm92aWRlciBvZiBvcHRpb25zPy5leGVjdXRpb25Qcm92aWRlcnMgPz8gW10pIHtcbiAgICAgIGNvbnN0IHByb3ZpZGVyTmFtZSA9IHR5cGVvZiBwcm92aWRlciA9PT0gJ3N0cmluZycgPyBwcm92aWRlciA6IHByb3ZpZGVyLm5hbWU7XG4gICAgICBpZiAocHJvdmlkZXJOYW1lID09PSAnd2Vibm4nKSB7XG4gICAgICAgIHdhc20uc2hvdWxkVHJhbnNmZXJUb01MVGVuc29yID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvdmlkZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uc3Qgd2Vibm5PcHRpb25zID0gcHJvdmlkZXIgYXMgSW5mZXJlbmNlU2Vzc2lvbi5XZWJOTkV4ZWN1dGlvblByb3ZpZGVyT3B0aW9uO1xuICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSAod2Vibm5PcHRpb25zIGFzIEluZmVyZW5jZVNlc3Npb24uV2ViTk5PcHRpb25zV2l0aE1MQ29udGV4dCk/LmNvbnRleHQ7XG4gICAgICAgICAgY29uc3QgZ3B1RGV2aWNlID0gKHdlYm5uT3B0aW9ucyBhcyBJbmZlcmVuY2VTZXNzaW9uLldlYk5OT3B0aW9uc1dlYkdwdSk/LmdwdURldmljZTtcbiAgICAgICAgICBjb25zdCBkZXZpY2VUeXBlID0gKHdlYm5uT3B0aW9ucyBhcyBJbmZlcmVuY2VTZXNzaW9uLldlYk5OQ29udGV4dE9wdGlvbnMpPy5kZXZpY2VUeXBlO1xuICAgICAgICAgIGNvbnN0IHBvd2VyUHJlZmVyZW5jZSA9ICh3ZWJubk9wdGlvbnMgYXMgSW5mZXJlbmNlU2Vzc2lvbi5XZWJOTkNvbnRleHRPcHRpb25zKT8ucG93ZXJQcmVmZXJlbmNlO1xuICAgICAgICAgIGlmIChjb250ZXh0KSB7XG4gICAgICAgICAgICB3YXNtLmN1cnJlbnRDb250ZXh0ID0gY29udGV4dCBhcyBNTENvbnRleHQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChncHVEZXZpY2UpIHtcbiAgICAgICAgICAgIHdhc20uY3VycmVudENvbnRleHQgPSBhd2FpdCB3YXNtLndlYm5uQ3JlYXRlTUxDb250ZXh0IShncHVEZXZpY2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3YXNtLmN1cnJlbnRDb250ZXh0ID0gYXdhaXQgd2FzbS53ZWJubkNyZWF0ZU1MQ29udGV4dCEoeyBkZXZpY2VUeXBlLCBwb3dlclByZWZlcmVuY2UgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdhc20uY3VycmVudENvbnRleHQgPSBhd2FpdCB3YXNtLndlYm5uQ3JlYXRlTUxDb250ZXh0ISgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNlc3Npb25IYW5kbGUgPSBhd2FpdCB3YXNtLl9PcnRDcmVhdGVTZXNzaW9uKG1vZGVsRGF0YU9mZnNldCwgbW9kZWxEYXRhTGVuZ3RoLCBzZXNzaW9uT3B0aW9uc0hhbmRsZSk7XG4gICAgd2FzbS53ZWJncHVPbkNyZWF0ZVNlc3Npb24/LihzZXNzaW9uSGFuZGxlKTtcbiAgICBpZiAoc2Vzc2lvbkhhbmRsZSA9PT0gMCkge1xuICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCBjcmVhdGUgYSBzZXNzaW9uLlwiKTtcbiAgICB9XG5cbiAgICB3YXNtLmpzZXBPbkNyZWF0ZVNlc3Npb24/LigpO1xuXG4gICAgLy8gY2xlYXIgY3VycmVudCBNTENvbnRleHQgYWZ0ZXIgc2Vzc2lvbiBjcmVhdGlvblxuICAgIGlmICh3YXNtLmN1cnJlbnRDb250ZXh0KSB7XG4gICAgICB3YXNtLndlYm5uUmVnaXN0ZXJNTENvbnRleHQhKHNlc3Npb25IYW5kbGUsIHdhc20uY3VycmVudENvbnRleHQpO1xuICAgICAgd2FzbS5jdXJyZW50Q29udGV4dCA9IHVuZGVmaW5lZDtcbiAgICAgIHdhc20uc2hvdWxkVHJhbnNmZXJUb01MVGVuc29yID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBbaW5wdXRDb3VudCwgb3V0cHV0Q291bnRdID0gZ2V0U2Vzc2lvbklucHV0T3V0cHV0Q291bnQoc2Vzc2lvbkhhbmRsZSk7XG5cbiAgICBjb25zdCBlbmFibGVHcmFwaENhcHR1cmUgPSAhIW9wdGlvbnM/LmVuYWJsZUdyYXBoQ2FwdHVyZTtcblxuICAgIGNvbnN0IGlucHV0TmFtZXMgPSBbXTtcbiAgICBjb25zdCBvdXRwdXROYW1lcyA9IFtdO1xuICAgIGNvbnN0IGlucHV0TWV0YWRhdGE6IEluZmVyZW5jZVNlc3Npb24uVmFsdWVNZXRhZGF0YVtdID0gW107XG4gICAgY29uc3Qgb3V0cHV0TWV0YWRhdGE6IEluZmVyZW5jZVNlc3Npb24uVmFsdWVNZXRhZGF0YVtdID0gW107XG4gICAgY29uc3Qgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zOiBTdXBwb3J0ZWRUZW5zb3JEYXRhTG9jYXRpb25Gb3JJbnB1dE91dHB1dFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dENvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IFtuYW1lT2Zmc2V0LCBlbGVtZW50VHlwZSwgc2hhcGVdID0gZ2V0U2Vzc2lvbklucHV0T3V0cHV0TWV0YWRhdGEoc2Vzc2lvbkhhbmRsZSwgaSk7XG4gICAgICBpZiAobmFtZU9mZnNldCA9PT0gMCkge1xuICAgICAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IGdldCBhbiBpbnB1dCBuYW1lLlwiKTtcbiAgICAgIH1cbiAgICAgIGlucHV0TmFtZXNVVEY4RW5jb2RlZC5wdXNoKG5hbWVPZmZzZXQpO1xuICAgICAgY29uc3QgbmFtZSA9IHdhc20uVVRGOFRvU3RyaW5nKG5hbWVPZmZzZXQpO1xuICAgICAgaW5wdXROYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgaW5wdXRNZXRhZGF0YS5wdXNoKFxuICAgICAgICBlbGVtZW50VHlwZSA9PT0gMFxuICAgICAgICAgID8geyBuYW1lLCBpc1RlbnNvcjogZmFsc2UgfVxuICAgICAgICAgIDogeyBuYW1lLCBpc1RlbnNvcjogdHJ1ZSwgdHlwZTogdGVuc29yRGF0YVR5cGVFbnVtVG9TdHJpbmcoZWxlbWVudFR5cGUpLCBzaGFwZTogc2hhcGUhIH0sXG4gICAgICApO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dENvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IFtuYW1lT2Zmc2V0LCBlbGVtZW50VHlwZSwgc2hhcGVdID0gZ2V0U2Vzc2lvbklucHV0T3V0cHV0TWV0YWRhdGEoc2Vzc2lvbkhhbmRsZSwgaSArIGlucHV0Q291bnQpO1xuICAgICAgaWYgKG5hbWVPZmZzZXQgPT09IDApIHtcbiAgICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCBnZXQgYW4gb3V0cHV0IG5hbWUuXCIpO1xuICAgICAgfVxuICAgICAgb3V0cHV0TmFtZXNVVEY4RW5jb2RlZC5wdXNoKG5hbWVPZmZzZXQpO1xuICAgICAgY29uc3QgbmFtZVN0cmluZyA9IHdhc20uVVRGOFRvU3RyaW5nKG5hbWVPZmZzZXQpO1xuICAgICAgb3V0cHV0TmFtZXMucHVzaChuYW1lU3RyaW5nKTtcbiAgICAgIG91dHB1dE1ldGFkYXRhLnB1c2goXG4gICAgICAgIGVsZW1lbnRUeXBlID09PSAwXG4gICAgICAgICAgPyB7IG5hbWU6IG5hbWVTdHJpbmcsIGlzVGVuc29yOiBmYWxzZSB9XG4gICAgICAgICAgOiB7IG5hbWU6IG5hbWVTdHJpbmcsIGlzVGVuc29yOiB0cnVlLCB0eXBlOiB0ZW5zb3JEYXRhVHlwZUVudW1Ub1N0cmluZyhlbGVtZW50VHlwZSksIHNoYXBlOiBzaGFwZSEgfSxcbiAgICAgICk7XG5cbiAgICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX0pTRVAgfHwgIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUpIHtcbiAgICAgICAgaWYgKGVuYWJsZUdyYXBoQ2FwdHVyZSAmJiBvcHRpb25zPy5wcmVmZXJyZWRPdXRwdXRMb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zLnB1c2goJ2dwdS1idWZmZXInKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb2NhdGlvbiA9XG4gICAgICAgICAgdHlwZW9mIG9wdGlvbnM/LnByZWZlcnJlZE91dHB1dExvY2F0aW9uID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgPyBvcHRpb25zLnByZWZlcnJlZE91dHB1dExvY2F0aW9uXG4gICAgICAgICAgICA6IChvcHRpb25zPy5wcmVmZXJyZWRPdXRwdXRMb2NhdGlvbj8uW25hbWVTdHJpbmddID8/ICdjcHUnKTtcbiAgICAgICAgY29uc3QgaXNHcmFwaE91dHB1dCA9IHdhc20ud2Vibm5Jc0dyYXBoT3V0cHV0O1xuICAgICAgICBpZiAobG9jYXRpb24gPT09ICdjcHUnICYmIGlzR3JhcGhPdXRwdXQgJiYgaXNHcmFwaE91dHB1dChzZXNzaW9uSGFuZGxlLCBuYW1lU3RyaW5nKSkge1xuICAgICAgICAgIG91dHB1dFByZWZlcnJlZExvY2F0aW9ucy5wdXNoKCdtbC10ZW5zb3ItY3B1LW91dHB1dCcpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhdGlvbiAhPT0gJ2NwdScgJiYgbG9jYXRpb24gIT09ICdjcHUtcGlubmVkJyAmJiBsb2NhdGlvbiAhPT0gJ2dwdS1idWZmZXInICYmIGxvY2F0aW9uICE9PSAnbWwtdGVuc29yJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IHN1cHBvcnRlZCBwcmVmZXJyZWQgb3V0cHV0IGxvY2F0aW9uOiAke2xvY2F0aW9ufS5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5hYmxlR3JhcGhDYXB0dXJlICYmIGxvY2F0aW9uICE9PSAnZ3B1LWJ1ZmZlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgTm90IHN1cHBvcnRlZCBwcmVmZXJyZWQgb3V0cHV0IGxvY2F0aW9uOiAke2xvY2F0aW9ufS4gT25seSAnZ3B1LWJ1ZmZlcicgbG9jYXRpb24gaXMgc3VwcG9ydGVkIHdoZW4gZW5hYmxlR3JhcGhDYXB0dXJlIGlzIHRydWUuYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dFByZWZlcnJlZExvY2F0aW9ucy5wdXNoKGxvY2F0aW9uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1c2UgSU8gYmluZGluZyBvbmx5IHdoZW4gYXQgbGVhc3Qgb25lIG91dHB1dCBpcyBwcmVmZXJyZWQgdG8gYmUgb24gR1BVLlxuICAgIGxldCBiaW5kaW5nU3RhdGU6IElPQmluZGluZ1N0YXRlIHwgbnVsbCA9IG51bGw7XG4gICAgaWYgKFxuICAgICAgKCFCVUlMRF9ERUZTLkRJU0FCTEVfSlNFUCB8fCAhQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkgJiZcbiAgICAgIG91dHB1dFByZWZlcnJlZExvY2F0aW9ucy5zb21lKChsKSA9PiBsID09PSAnZ3B1LWJ1ZmZlcicgfHwgbCA9PT0gJ21sLXRlbnNvcicgfHwgbCA9PT0gJ21sLXRlbnNvci1jcHUtb3V0cHV0JylcbiAgICApIHtcbiAgICAgIGlvQmluZGluZ0hhbmRsZSA9IHdhc20uX09ydENyZWF0ZUJpbmRpbmcoc2Vzc2lvbkhhbmRsZSk7XG4gICAgICBpZiAoaW9CaW5kaW5nSGFuZGxlID09PSAwKSB7XG4gICAgICAgIGNoZWNrTGFzdEVycm9yKFwiQ2FuJ3QgY3JlYXRlIElPIGJpbmRpbmcuXCIpO1xuICAgICAgfVxuXG4gICAgICBiaW5kaW5nU3RhdGUgPSB7XG4gICAgICAgIGhhbmRsZTogaW9CaW5kaW5nSGFuZGxlLFxuICAgICAgICBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnMsXG4gICAgICAgIG91dHB1dFByZWZlcnJlZExvY2F0aW9uc0VuY29kZWQ6IG91dHB1dFByZWZlcnJlZExvY2F0aW9uc1xuICAgICAgICAgIC8vICdtbC10ZW5zb3ItY3B1LW91dHB1dCcgaXMgdHJlYXRlZCBhcyAnbWwtdGVuc29yJyBmb3IgdGhlIHB1cnBvc2Ugb2YgSU8gYmluZGluZy5cbiAgICAgICAgICAubWFwKChsKSA9PiAobCA9PT0gJ21sLXRlbnNvci1jcHUtb3V0cHV0JyA/ICdtbC10ZW5zb3InIDogbCkpXG4gICAgICAgICAgLm1hcCgobCkgPT4gZGF0YUxvY2F0aW9uU3RyaW5nVG9FbnVtKGwpKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgYWN0aXZlU2Vzc2lvbnMuc2V0KHNlc3Npb25IYW5kbGUsIFtcbiAgICAgIHNlc3Npb25IYW5kbGUsXG4gICAgICBpbnB1dE5hbWVzVVRGOEVuY29kZWQsXG4gICAgICBvdXRwdXROYW1lc1VURjhFbmNvZGVkLFxuICAgICAgYmluZGluZ1N0YXRlLFxuICAgICAgZW5hYmxlR3JhcGhDYXB0dXJlLFxuICAgICAgZmFsc2UsXG4gICAgXSk7XG4gICAgcmV0dXJuIFtzZXNzaW9uSGFuZGxlLCBpbnB1dE5hbWVzLCBvdXRwdXROYW1lcywgaW5wdXRNZXRhZGF0YSwgb3V0cHV0TWV0YWRhdGFdO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaW5wdXROYW1lc1VURjhFbmNvZGVkLmZvckVhY2goKGJ1ZikgPT4gd2FzbS5fT3J0RnJlZShidWYpKTtcbiAgICBvdXRwdXROYW1lc1VURjhFbmNvZGVkLmZvckVhY2goKGJ1ZikgPT4gd2FzbS5fT3J0RnJlZShidWYpKTtcblxuICAgIGlmIChpb0JpbmRpbmdIYW5kbGUgIT09IDApIHtcbiAgICAgIGlmICh3YXNtLl9PcnRSZWxlYXNlQmluZGluZyhpb0JpbmRpbmdIYW5kbGUpICE9PSAwKSB7XG4gICAgICAgIGNoZWNrTGFzdEVycm9yKFwiQ2FuJ3QgcmVsZWFzZSBJTyBiaW5kaW5nLlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2Vzc2lvbkhhbmRsZSAhPT0gMCkge1xuICAgICAgaWYgKHdhc20uX09ydFJlbGVhc2VTZXNzaW9uKHNlc3Npb25IYW5kbGUpICE9PSAwKSB7XG4gICAgICAgIGNoZWNrTGFzdEVycm9yKFwiQ2FuJ3QgcmVsZWFzZSBzZXNzaW9uLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3YXNtLl9mcmVlKG1vZGVsRGF0YU9mZnNldCk7XG4gICAgaWYgKHNlc3Npb25PcHRpb25zSGFuZGxlICE9PSAwKSB7XG4gICAgICBpZiAod2FzbS5fT3J0UmVsZWFzZVNlc3Npb25PcHRpb25zKHNlc3Npb25PcHRpb25zSGFuZGxlKSAhPT0gMCkge1xuICAgICAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IHJlbGVhc2Ugc2Vzc2lvbiBvcHRpb25zLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYWxsb2NzLmZvckVhY2goKGFsbG9jKSA9PiB3YXNtLl9mcmVlKGFsbG9jKSk7XG5cbiAgICAvLyB1bm1vdW50IGV4dGVybmFsIGRhdGEgaWYgbmVjZXNzYXJ5XG4gICAgd2FzbS51bm1vdW50RXh0ZXJuYWxEYXRhPy4oKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbGVhc2VTZXNzaW9uID0gKHNlc3Npb25JZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBzZXNzaW9uID0gYWN0aXZlU2Vzc2lvbnMuZ2V0KHNlc3Npb25JZCk7XG4gIGlmICghc2Vzc2lvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgY2Fubm90IHJlbGVhc2Ugc2Vzc2lvbi4gaW52YWxpZCBzZXNzaW9uIGlkOiAke3Nlc3Npb25JZH1gKTtcbiAgfVxuICBjb25zdCBbc2Vzc2lvbkhhbmRsZSwgaW5wdXROYW1lc1VURjhFbmNvZGVkLCBvdXRwdXROYW1lc1VURjhFbmNvZGVkLCBpb0JpbmRpbmdTdGF0ZSwgZW5hYmxlR3JhcGhDYXB0dXJlXSA9IHNlc3Npb247XG5cbiAgaWYgKGlvQmluZGluZ1N0YXRlKSB7XG4gICAgaWYgKGVuYWJsZUdyYXBoQ2FwdHVyZSkge1xuICAgICAgaWYgKHdhc20uX09ydENsZWFyQm91bmRPdXRwdXRzKGlvQmluZGluZ1N0YXRlLmhhbmRsZSkgIT09IDApIHtcbiAgICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCBjbGVhciBib3VuZCBvdXRwdXRzLlwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdhc20uX09ydFJlbGVhc2VCaW5kaW5nKGlvQmluZGluZ1N0YXRlLmhhbmRsZSkgIT09IDApIHtcbiAgICAgIGNoZWNrTGFzdEVycm9yKFwiQ2FuJ3QgcmVsZWFzZSBJTyBiaW5kaW5nLlwiKTtcbiAgICB9XG4gIH1cblxuICB3YXNtLmpzZXBPblJlbGVhc2VTZXNzaW9uPy4oc2Vzc2lvbklkKTtcbiAgd2FzbS53ZWJubk9uUmVsZWFzZVNlc3Npb24/LihzZXNzaW9uSWQpO1xuICB3YXNtLndlYmdwdU9uUmVsZWFzZVNlc3Npb24/LihzZXNzaW9uSWQpO1xuXG4gIGlucHV0TmFtZXNVVEY4RW5jb2RlZC5mb3JFYWNoKChidWYpID0+IHdhc20uX09ydEZyZWUoYnVmKSk7XG4gIG91dHB1dE5hbWVzVVRGOEVuY29kZWQuZm9yRWFjaCgoYnVmKSA9PiB3YXNtLl9PcnRGcmVlKGJ1ZikpO1xuICBpZiAod2FzbS5fT3J0UmVsZWFzZVNlc3Npb24oc2Vzc2lvbkhhbmRsZSkgIT09IDApIHtcbiAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IHJlbGVhc2Ugc2Vzc2lvbi5cIik7XG4gIH1cbiAgYWN0aXZlU2Vzc2lvbnMuZGVsZXRlKHNlc3Npb25JZCk7XG59O1xuXG5leHBvcnQgY29uc3QgcHJlcGFyZUlucHV0T3V0cHV0VGVuc29yID0gYXN5bmMgKFxuICB0ZW5zb3I6IFRlbnNvck1ldGFkYXRhIHwgbnVsbCxcbiAgdGVuc29ySGFuZGxlczogbnVtYmVyW10sXG4gIGFsbG9jczogbnVtYmVyW10sXG4gIHNlc3Npb25JZDogbnVtYmVyLFxuICB0ZW5zb3JOYW1lVVRGOEVuY29kZWQ6IG51bWJlcixcbiAgaW5kZXg6IG51bWJlcixcbiAgZW5hYmxlR3JhcGhDYXB0dXJlID0gZmFsc2UsXG4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKCF0ZW5zb3IpIHtcbiAgICB0ZW5zb3JIYW5kbGVzLnB1c2goMCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgd2FzbSA9IGdldEluc3RhbmNlKCk7XG4gIGNvbnN0IHB0clNpemUgPSB3YXNtLlBUUl9TSVpFO1xuXG4gIGNvbnN0IGRhdGFUeXBlID0gdGVuc29yWzBdO1xuICBjb25zdCBkaW1zID0gdGVuc29yWzFdO1xuICBjb25zdCBsb2NhdGlvbiA9IHRlbnNvclszXTtcbiAgbGV0IGFjdHVhbExvY2F0aW9uID0gbG9jYXRpb247XG5cbiAgbGV0IHJhd0RhdGE6IG51bWJlcjtcbiAgbGV0IGRhdGFCeXRlTGVuZ3RoOiBudW1iZXI7XG5cbiAgaWYgKGRhdGFUeXBlID09PSAnc3RyaW5nJyAmJiAobG9jYXRpb24gPT09ICdncHUtYnVmZmVyJyB8fCBsb2NhdGlvbiA9PT0gJ21sLXRlbnNvcicpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTdHJpbmcgdGVuc29yIGlzIG5vdCBzdXBwb3J0ZWQgb24gR1BVLicpO1xuICB9XG5cbiAgaWYgKGVuYWJsZUdyYXBoQ2FwdHVyZSAmJiBsb2NhdGlvbiAhPT0gJ2dwdS1idWZmZXInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEV4dGVybmFsIGJ1ZmZlciBtdXN0IGJlIHByb3ZpZGVkIGZvciBpbnB1dC9vdXRwdXQgaW5kZXggJHtpbmRleH0gd2hlbiBlbmFibGVHcmFwaENhcHR1cmUgaXMgdHJ1ZS5gLFxuICAgICk7XG4gIH1cblxuICBpZiAobG9jYXRpb24gPT09ICdncHUtYnVmZmVyJykge1xuICAgIGNvbnN0IGdwdUJ1ZmZlciA9IHRlbnNvclsyXS5ncHVCdWZmZXI7XG4gICAgZGF0YUJ5dGVMZW5ndGggPSBjYWxjdWxhdGVUZW5zb3JTaXplSW5CeXRlcyh0ZW5zb3JEYXRhVHlwZVN0cmluZ1RvRW51bShkYXRhVHlwZSksIGRpbXMpITtcblxuICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkge1xuICAgICAgY29uc3QgcmVnaXN0ZXJCdWZmZXIgPSB3YXNtLndlYmdwdVJlZ2lzdGVyQnVmZmVyO1xuICAgICAgaWYgKCFyZWdpc3RlckJ1ZmZlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RlbnNvciBsb2NhdGlvbiBcImdwdS1idWZmZXJcIiBpcyBub3Qgc3VwcG9ydGVkIHdpdGhvdXQgdXNpbmcgV2ViR1BVLicpO1xuICAgICAgfVxuXG4gICAgICByYXdEYXRhID0gcmVnaXN0ZXJCdWZmZXIoZ3B1QnVmZmVyLCBzZXNzaW9uSWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWdpc3RlckJ1ZmZlciA9IHdhc20uanNlcFJlZ2lzdGVyQnVmZmVyO1xuICAgICAgaWYgKCFyZWdpc3RlckJ1ZmZlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RlbnNvciBsb2NhdGlvbiBcImdwdS1idWZmZXJcIiBpcyBub3Qgc3VwcG9ydGVkIHdpdGhvdXQgdXNpbmcgV2ViR1BVLicpO1xuICAgICAgfVxuICAgICAgcmF3RGF0YSA9IHJlZ2lzdGVyQnVmZmVyKHNlc3Npb25JZCwgaW5kZXgsIGdwdUJ1ZmZlciwgZGF0YUJ5dGVMZW5ndGgpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsb2NhdGlvbiA9PT0gJ21sLXRlbnNvcicpIHtcbiAgICBjb25zdCBtbFRlbnNvciA9IHRlbnNvclsyXS5tbFRlbnNvciBhcyBNTFRlbnNvcjtcbiAgICBkYXRhQnl0ZUxlbmd0aCA9IGNhbGN1bGF0ZVRlbnNvclNpemVJbkJ5dGVzKHRlbnNvckRhdGFUeXBlU3RyaW5nVG9FbnVtKGRhdGFUeXBlKSwgZGltcykhO1xuXG4gICAgY29uc3QgcmVnaXN0ZXJNTFRlbnNvciA9IHdhc20ud2Vibm5SZWdpc3Rlck1MVGVuc29yO1xuICAgIGlmICghcmVnaXN0ZXJNTFRlbnNvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUZW5zb3IgbG9jYXRpb24gXCJtbC10ZW5zb3JcIiBpcyBub3Qgc3VwcG9ydGVkIHdpdGhvdXQgdXNpbmcgV2ViTk4uJyk7XG4gICAgfVxuICAgIHJhd0RhdGEgPSByZWdpc3Rlck1MVGVuc29yKHNlc3Npb25JZCwgbWxUZW5zb3IsIHRlbnNvckRhdGFUeXBlU3RyaW5nVG9FbnVtKGRhdGFUeXBlKSwgZGltcyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZGF0YSA9IHRlbnNvclsyXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAvLyBzdHJpbmcgdGVuc29yXG4gICAgICBkYXRhQnl0ZUxlbmd0aCA9IHB0clNpemUgKiBkYXRhLmxlbmd0aDtcbiAgICAgIHJhd0RhdGEgPSB3YXNtLl9tYWxsb2MoZGF0YUJ5dGVMZW5ndGgpO1xuICAgICAgYWxsb2NzLnB1c2gocmF3RGF0YSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhW2ldICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYHRlbnNvciBkYXRhIGF0IGluZGV4ICR7aX0gaXMgbm90IGEgc3RyaW5nYCk7XG4gICAgICAgIH1cbiAgICAgICAgd2FzbS5zZXRWYWx1ZShyYXdEYXRhICsgaSAqIHB0clNpemUsIGFsbG9jV2FzbVN0cmluZyhkYXRhW2ldLCBhbGxvY3MpLCAnKicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0dyYXBoSW5wdXQgPSB3YXNtLndlYm5uSXNHcmFwaElucHV0O1xuICAgICAgY29uc3QgaXNHcmFwaE91dHB1dCA9IHdhc20ud2Vibm5Jc0dyYXBoT3V0cHV0O1xuICAgICAgaWYgKGRhdGFUeXBlICE9PSAnc3RyaW5nJyAmJiBpc0dyYXBoSW5wdXQgJiYgaXNHcmFwaE91dHB1dCkge1xuICAgICAgICBjb25zdCB0ZW5zb3JOYW1lID0gd2FzbS5VVEY4VG9TdHJpbmcodGVuc29yTmFtZVVURjhFbmNvZGVkKTtcbiAgICAgICAgLy8gUHJvbW90ZSB0aGUgdGVuc29yIHRvICdtbC10ZW5zb3InIGlmIGl0IGlzIGEgZ3JhcGggaW5wdXQuXG4gICAgICAgIGlmIChpc0dyYXBoSW5wdXQoc2Vzc2lvbklkLCB0ZW5zb3JOYW1lKSB8fCBpc0dyYXBoT3V0cHV0KHNlc3Npb25JZCwgdGVuc29yTmFtZSkpIHtcbiAgICAgICAgICBjb25zdCBkYXRhVHlwZUVudW0gPSB0ZW5zb3JEYXRhVHlwZVN0cmluZ1RvRW51bShkYXRhVHlwZSk7XG4gICAgICAgICAgZGF0YUJ5dGVMZW5ndGggPSBjYWxjdWxhdGVUZW5zb3JTaXplSW5CeXRlcyhkYXRhVHlwZUVudW0sIGRpbXMpITtcbiAgICAgICAgICBhY3R1YWxMb2NhdGlvbiA9ICdtbC10ZW5zb3InO1xuICAgICAgICAgIGNvbnN0IGNyZWF0ZVRlbXBvcmFyeVRlbnNvciA9IHdhc20ud2Vibm5DcmVhdGVUZW1wb3JhcnlUZW5zb3I7XG4gICAgICAgICAgY29uc3QgdXBsb2FkVGVuc29yID0gd2FzbS53ZWJublVwbG9hZFRlbnNvcjtcbiAgICAgICAgICBpZiAoIWNyZWF0ZVRlbXBvcmFyeVRlbnNvciB8fCAhdXBsb2FkVGVuc29yKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RlbnNvciBsb2NhdGlvbiBcIm1sLXRlbnNvclwiIGlzIG5vdCBzdXBwb3J0ZWQgd2l0aG91dCB1c2luZyBXZWJOTi4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdGVuc29ySWQgPSBhd2FpdCBjcmVhdGVUZW1wb3JhcnlUZW5zb3Ioc2Vzc2lvbklkLCBkYXRhVHlwZUVudW0sIGRpbXMgYXMgbnVtYmVyW10pO1xuICAgICAgICAgIHVwbG9hZFRlbnNvcih0ZW5zb3JJZCwgbmV3IFVpbnQ4QXJyYXkoZGF0YS5idWZmZXIsIGRhdGEuYnl0ZU9mZnNldCwgZGF0YS5ieXRlTGVuZ3RoKSk7XG4gICAgICAgICAgcmF3RGF0YSA9IHRlbnNvcklkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFCeXRlTGVuZ3RoID0gZGF0YS5ieXRlTGVuZ3RoO1xuICAgICAgICAgIHJhd0RhdGEgPSB3YXNtLl9tYWxsb2MoZGF0YUJ5dGVMZW5ndGgpO1xuICAgICAgICAgIGFsbG9jcy5wdXNoKHJhd0RhdGEpO1xuICAgICAgICAgIHdhc20uSEVBUFU4LnNldChuZXcgVWludDhBcnJheShkYXRhLmJ1ZmZlciwgZGF0YS5ieXRlT2Zmc2V0LCBkYXRhQnl0ZUxlbmd0aCksIHJhd0RhdGEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhQnl0ZUxlbmd0aCA9IGRhdGEuYnl0ZUxlbmd0aDtcbiAgICAgICAgcmF3RGF0YSA9IHdhc20uX21hbGxvYyhkYXRhQnl0ZUxlbmd0aCk7XG4gICAgICAgIGFsbG9jcy5wdXNoKHJhd0RhdGEpO1xuICAgICAgICB3YXNtLkhFQVBVOC5zZXQobmV3IFVpbnQ4QXJyYXkoZGF0YS5idWZmZXIsIGRhdGEuYnl0ZU9mZnNldCwgZGF0YUJ5dGVMZW5ndGgpLCByYXdEYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGFjayA9IHdhc20uc3RhY2tTYXZlKCk7XG4gIGNvbnN0IGRpbXNPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2MoNCAqIGRpbXMubGVuZ3RoKTtcbiAgdHJ5IHtcbiAgICBkaW1zLmZvckVhY2goKGQsIGluZGV4KSA9PiB3YXNtLnNldFZhbHVlKGRpbXNPZmZzZXQgKyBpbmRleCAqIHB0clNpemUsIGQsIHB0clNpemUgPT09IDQgPyAnaTMyJyA6ICdpNjQnKSk7XG4gICAgY29uc3QgdGVuc29yID0gd2FzbS5fT3J0Q3JlYXRlVGVuc29yKFxuICAgICAgdGVuc29yRGF0YVR5cGVTdHJpbmdUb0VudW0oZGF0YVR5cGUpLFxuICAgICAgcmF3RGF0YSxcbiAgICAgIGRhdGFCeXRlTGVuZ3RoLFxuICAgICAgZGltc09mZnNldCxcbiAgICAgIGRpbXMubGVuZ3RoLFxuICAgICAgZGF0YUxvY2F0aW9uU3RyaW5nVG9FbnVtKGFjdHVhbExvY2F0aW9uKSxcbiAgICApO1xuICAgIGlmICh0ZW5zb3IgPT09IDApIHtcbiAgICAgIGNoZWNrTGFzdEVycm9yKGBDYW4ndCBjcmVhdGUgdGVuc29yIGZvciBpbnB1dC9vdXRwdXQuIHNlc3Npb249JHtzZXNzaW9uSWR9LCBpbmRleD0ke2luZGV4fS5gKTtcbiAgICB9XG4gICAgdGVuc29ySGFuZGxlcy5wdXNoKHRlbnNvcik7XG4gIH0gZmluYWxseSB7XG4gICAgd2FzbS5zdGFja1Jlc3RvcmUoc3RhY2spO1xuICB9XG59O1xuXG4vKipcbiAqIHBlcmZvcm0gaW5mZXJlbmNlIHJ1blxuICovXG5leHBvcnQgY29uc3QgcnVuID0gYXN5bmMgKFxuICBzZXNzaW9uSWQ6IG51bWJlcixcbiAgaW5wdXRJbmRpY2VzOiBudW1iZXJbXSxcbiAgaW5wdXRUZW5zb3JzOiBUZW5zb3JNZXRhZGF0YVtdLFxuICBvdXRwdXRJbmRpY2VzOiBudW1iZXJbXSxcbiAgb3V0cHV0VGVuc29yczogQXJyYXk8VGVuc29yTWV0YWRhdGEgfCBudWxsPixcbiAgb3B0aW9uczogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zLFxuKTogUHJvbWlzZTxUZW5zb3JNZXRhZGF0YVtdPiA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBwdHJTaXplID0gd2FzbS5QVFJfU0laRTtcbiAgY29uc3Qgc2Vzc2lvbiA9IGFjdGl2ZVNlc3Npb25zLmdldChzZXNzaW9uSWQpO1xuICBpZiAoIXNlc3Npb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGNhbm5vdCBydW4gaW5mZXJlbmNlLiBpbnZhbGlkIHNlc3Npb24gaWQ6ICR7c2Vzc2lvbklkfWApO1xuICB9XG4gIGNvbnN0IHNlc3Npb25IYW5kbGUgPSBzZXNzaW9uWzBdO1xuICBjb25zdCBpbnB1dE5hbWVzVVRGOEVuY29kZWQgPSBzZXNzaW9uWzFdO1xuICBjb25zdCBvdXRwdXROYW1lc1VURjhFbmNvZGVkID0gc2Vzc2lvblsyXTtcbiAgY29uc3QgaW9CaW5kaW5nU3RhdGUgPSBzZXNzaW9uWzNdO1xuICBjb25zdCBlbmFibGVHcmFwaENhcHR1cmUgPSBzZXNzaW9uWzRdO1xuICBjb25zdCBpbnB1dE91dHB1dEJvdW5kID0gc2Vzc2lvbls1XTtcblxuICBjb25zdCBpbnB1dENvdW50ID0gaW5wdXRJbmRpY2VzLmxlbmd0aDtcbiAgY29uc3Qgb3V0cHV0Q291bnQgPSBvdXRwdXRJbmRpY2VzLmxlbmd0aDtcblxuICBsZXQgcnVuT3B0aW9uc0hhbmRsZSA9IDA7XG4gIGxldCBydW5PcHRpb25zQWxsb2NzOiBudW1iZXJbXSA9IFtdO1xuXG4gIGNvbnN0IGlucHV0VGVuc29ySGFuZGxlczogbnVtYmVyW10gPSBbXTtcbiAgY29uc3Qgb3V0cHV0VGVuc29ySGFuZGxlczogbnVtYmVyW10gPSBbXTtcbiAgY29uc3QgaW5wdXRPdXRwdXRBbGxvY3M6IG51bWJlcltdID0gW107XG4gIGNvbnN0IHByZUFsbG9jYXRlZE91dHB1dHM6IG51bWJlcltdID0gW107XG5cbiAgY29uc3QgYmVmb3JlUnVuU3RhY2sgPSB3YXNtLnN0YWNrU2F2ZSgpO1xuICBjb25zdCBpbnB1dFZhbHVlc09mZnNldCA9IHdhc20uc3RhY2tBbGxvYyhpbnB1dENvdW50ICogcHRyU2l6ZSk7XG4gIGNvbnN0IGlucHV0TmFtZXNPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2MoaW5wdXRDb3VudCAqIHB0clNpemUpO1xuICBjb25zdCBvdXRwdXRWYWx1ZXNPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2Mob3V0cHV0Q291bnQgKiBwdHJTaXplKTtcbiAgY29uc3Qgb3V0cHV0TmFtZXNPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2Mob3V0cHV0Q291bnQgKiBwdHJTaXplKTtcblxuICB0cnkge1xuICAgIFtydW5PcHRpb25zSGFuZGxlLCBydW5PcHRpb25zQWxsb2NzXSA9IHNldFJ1bk9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBUUkFDRV9FVkVOVF9CRUdJTignd2FzbSBwcmVwYXJlSW5wdXRPdXRwdXRUZW5zb3InKTtcbiAgICAvLyBjcmVhdGUgaW5wdXQgdGVuc29yc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRDb3VudDsgaSsrKSB7XG4gICAgICBhd2FpdCBwcmVwYXJlSW5wdXRPdXRwdXRUZW5zb3IoXG4gICAgICAgIGlucHV0VGVuc29yc1tpXSxcbiAgICAgICAgaW5wdXRUZW5zb3JIYW5kbGVzLFxuICAgICAgICBpbnB1dE91dHB1dEFsbG9jcyxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgICBpbnB1dE5hbWVzVVRGOEVuY29kZWRbaW5wdXRJbmRpY2VzW2ldXSxcbiAgICAgICAgaW5wdXRJbmRpY2VzW2ldLFxuICAgICAgICBlbmFibGVHcmFwaENhcHR1cmUsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBvdXRwdXQgdGVuc29yc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0Q291bnQ7IGkrKykge1xuICAgICAgYXdhaXQgcHJlcGFyZUlucHV0T3V0cHV0VGVuc29yKFxuICAgICAgICBvdXRwdXRUZW5zb3JzW2ldLFxuICAgICAgICBvdXRwdXRUZW5zb3JIYW5kbGVzLFxuICAgICAgICBpbnB1dE91dHB1dEFsbG9jcyxcbiAgICAgICAgc2Vzc2lvbklkLFxuICAgICAgICBvdXRwdXROYW1lc1VURjhFbmNvZGVkW291dHB1dEluZGljZXNbaV1dLFxuICAgICAgICBpbnB1dENvdW50ICsgb3V0cHV0SW5kaWNlc1tpXSxcbiAgICAgICAgZW5hYmxlR3JhcGhDYXB0dXJlLFxuICAgICAgKTtcbiAgICB9XG4gICAgVFJBQ0VfRVZFTlRfRU5EKCd3YXNtIHByZXBhcmVJbnB1dE91dHB1dFRlbnNvcicpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dENvdW50OyBpKyspIHtcbiAgICAgIHdhc20uc2V0VmFsdWUoaW5wdXRWYWx1ZXNPZmZzZXQgKyBpICogcHRyU2l6ZSwgaW5wdXRUZW5zb3JIYW5kbGVzW2ldLCAnKicpO1xuICAgICAgd2FzbS5zZXRWYWx1ZShpbnB1dE5hbWVzT2Zmc2V0ICsgaSAqIHB0clNpemUsIGlucHV0TmFtZXNVVEY4RW5jb2RlZFtpbnB1dEluZGljZXNbaV1dLCAnKicpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dENvdW50OyBpKyspIHtcbiAgICAgIHdhc20uc2V0VmFsdWUob3V0cHV0VmFsdWVzT2Zmc2V0ICsgaSAqIHB0clNpemUsIG91dHB1dFRlbnNvckhhbmRsZXNbaV0sICcqJyk7XG4gICAgICB3YXNtLnNldFZhbHVlKG91dHB1dE5hbWVzT2Zmc2V0ICsgaSAqIHB0clNpemUsIG91dHB1dE5hbWVzVVRGOEVuY29kZWRbb3V0cHV0SW5kaWNlc1tpXV0sICcqJyk7XG4gICAgfVxuXG4gICAgaWYgKCghQlVJTERfREVGUy5ESVNBQkxFX0pTRVAgfHwgIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUpICYmIGlvQmluZGluZ1N0YXRlICYmICFpbnB1dE91dHB1dEJvdW5kKSB7XG4gICAgICBjb25zdCB7IGhhbmRsZSwgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zLCBvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnNFbmNvZGVkIH0gPSBpb0JpbmRpbmdTdGF0ZTtcblxuICAgICAgaWYgKGlucHV0TmFtZXNVVEY4RW5jb2RlZC5sZW5ndGggIT09IGlucHV0Q291bnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBpbnB1dCBjb3VudCBmcm9tIGZlZWRzICgke2lucHV0Q291bnR9KSBpcyBleHBlY3RlZCB0byBiZSBhbHdheXMgZXF1YWwgdG8gbW9kZWwncyBpbnB1dCBjb3VudCAoJHtpbnB1dE5hbWVzVVRGOEVuY29kZWQubGVuZ3RofSkuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgVFJBQ0VfRVZFTlRfQkVHSU4oJ3dhc20gYmluZElucHV0c091dHB1dHMnKTtcbiAgICAgIC8vIHByb2Nlc3MgaW5wdXRzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Q291bnQ7IGkrKykge1xuICAgICAgICBjb25zdCBpbmRleCA9IGlucHV0SW5kaWNlc1tpXTtcbiAgICAgICAgY29uc3QgZXJyb3JDb2RlID0gYXdhaXQgd2FzbS5fT3J0QmluZElucHV0KGhhbmRsZSwgaW5wdXROYW1lc1VURjhFbmNvZGVkW2luZGV4XSwgaW5wdXRUZW5zb3JIYW5kbGVzW2ldKTtcbiAgICAgICAgaWYgKGVycm9yQ29kZSAhPT0gMCkge1xuICAgICAgICAgIGNoZWNrTGFzdEVycm9yKGBDYW4ndCBiaW5kIGlucHV0WyR7aX1dIGZvciBzZXNzaW9uPSR7c2Vzc2lvbklkfS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBwcm9jZXNzIHByZS1hbGxvY2F0ZWQgb3V0cHV0c1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gb3V0cHV0SW5kaWNlc1tpXTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBvdXRwdXRUZW5zb3JzW2ldPy5bM107IC8vIHVuZGVmaW5lZCBtZWFucyBvdXRwdXQgaXMgbm90IHByZS1hbGxvY2F0ZWQuXG5cbiAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgLy8gb3V0cHV0IGlzIHByZS1hbGxvY2F0ZWQsIHN0b3JlIGFuZCBiaW5kIHRoZSB0ZW5zb3IuXG4gICAgICAgICAgcHJlQWxsb2NhdGVkT3V0cHV0cy5wdXNoKG91dHB1dFRlbnNvckhhbmRsZXNbaV0pO1xuICAgICAgICAgIGNvbnN0IGVycm9yQ29kZSA9IHdhc20uX09ydEJpbmRPdXRwdXQoaGFuZGxlLCBvdXRwdXROYW1lc1VURjhFbmNvZGVkW2luZGV4XSwgb3V0cHV0VGVuc29ySGFuZGxlc1tpXSwgMCk7XG4gICAgICAgICAgaWYgKGVycm9yQ29kZSAhPT0gMCkge1xuICAgICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IGJpbmQgcHJlLWFsbG9jYXRlZCBvdXRwdXRbJHtpfV0gZm9yIHNlc3Npb249JHtzZXNzaW9uSWR9LmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBvdXRwdXQgaXMgbm90IHByZS1hbGxvY2F0ZWQuIHJlc2V0IHByZWZlcnJlZCBsb2NhdGlvbi5cbiAgICAgICAgICBjb25zdCBlcnJvckNvZGUgPSB3YXNtLl9PcnRCaW5kT3V0cHV0KFxuICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgb3V0cHV0TmFtZXNVVEY4RW5jb2RlZFtpbmRleF0sXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgb3V0cHV0UHJlZmVycmVkTG9jYXRpb25zRW5jb2RlZFtpbmRleF0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoZXJyb3JDb2RlICE9PSAwKSB7XG4gICAgICAgICAgICBjaGVja0xhc3RFcnJvcihgQ2FuJ3QgYmluZCBvdXRwdXRbJHtpfV0gdG8gJHtvdXRwdXRQcmVmZXJyZWRMb2NhdGlvbnNbaV19IGZvciBzZXNzaW9uPSR7c2Vzc2lvbklkfS5gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFRSQUNFX0VWRU5UX0VORCgnd2FzbSBiaW5kSW5wdXRzT3V0cHV0cycpO1xuICAgICAgYWN0aXZlU2Vzc2lvbnMuc2V0KHNlc3Npb25JZCwgW1xuICAgICAgICBzZXNzaW9uSGFuZGxlLFxuICAgICAgICBpbnB1dE5hbWVzVVRGOEVuY29kZWQsXG4gICAgICAgIG91dHB1dE5hbWVzVVRGOEVuY29kZWQsXG4gICAgICAgIGlvQmluZGluZ1N0YXRlLFxuICAgICAgICBlbmFibGVHcmFwaENhcHR1cmUsXG4gICAgICAgIHRydWUsXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICB3YXNtLmpzZXBPblJ1blN0YXJ0Py4oc2Vzc2lvbkhhbmRsZSk7XG4gICAgd2FzbS53ZWJubk9uUnVuU3RhcnQ/LihzZXNzaW9uSGFuZGxlKTtcblxuICAgIGxldCBlcnJvckNvZGU6IG51bWJlcjtcbiAgICBpZiAoKCFCVUlMRF9ERUZTLkRJU0FCTEVfSlNFUCB8fCAhQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkgJiYgaW9CaW5kaW5nU3RhdGUpIHtcbiAgICAgIGVycm9yQ29kZSA9IGF3YWl0IHdhc20uX09ydFJ1bldpdGhCaW5kaW5nKFxuICAgICAgICBzZXNzaW9uSGFuZGxlLFxuICAgICAgICBpb0JpbmRpbmdTdGF0ZS5oYW5kbGUsXG4gICAgICAgIG91dHB1dENvdW50LFxuICAgICAgICBvdXRwdXRWYWx1ZXNPZmZzZXQsXG4gICAgICAgIHJ1bk9wdGlvbnNIYW5kbGUsXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvckNvZGUgPSBhd2FpdCB3YXNtLl9PcnRSdW4oXG4gICAgICAgIHNlc3Npb25IYW5kbGUsXG4gICAgICAgIGlucHV0TmFtZXNPZmZzZXQsXG4gICAgICAgIGlucHV0VmFsdWVzT2Zmc2V0LFxuICAgICAgICBpbnB1dENvdW50LFxuICAgICAgICBvdXRwdXROYW1lc09mZnNldCxcbiAgICAgICAgb3V0cHV0Q291bnQsXG4gICAgICAgIG91dHB1dFZhbHVlc09mZnNldCxcbiAgICAgICAgcnVuT3B0aW9uc0hhbmRsZSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yQ29kZSAhPT0gMCkge1xuICAgICAgY2hlY2tMYXN0RXJyb3IoJ2ZhaWxlZCB0byBjYWxsIE9ydFJ1bigpLicpO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dDogVGVuc29yTWV0YWRhdGFbXSA9IFtdO1xuICAgIGNvbnN0IG91dHB1dFByb21pc2VzOiBBcnJheTxQcm9taXNlPFtudW1iZXIsIFRlbnNvci5EYXRhVHlwZV0+PiA9IFtdO1xuXG4gICAgVFJBQ0VfRVZFTlRfQkVHSU4oJ3dhc20gUHJvY2Vzc091dHB1dFRlbnNvcicpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0cHV0Q291bnQ7IGkrKykge1xuICAgICAgY29uc3QgdGVuc29yID0gTnVtYmVyKHdhc20uZ2V0VmFsdWUob3V0cHV0VmFsdWVzT2Zmc2V0ICsgaSAqIHB0clNpemUsICcqJykpO1xuICAgICAgLy8gVE9ETzogcmV2aXNpdCB0aGlzIHBhcnQgdG8gZW5zdXJlIGl0IHdvcmtzIGZvciBXZWJHUFUgd2hlbiBib3RoIHByZS1hbGxvY2F0ZWQgb3V0cHV0cyBhbmRcbiAgICAgIC8vIHByZWZlcnJlZCBsb2NhdGlvbiBhcmUgc3BlY2lmaWVkLlxuICAgICAgLy8gQ2VydGFpbiBwcmUtYWxsb2NhdGVkIHRlbnNvcnMgbWF5IGFscmVhZHkgYmUgYm91bmQgaW4gdGhlIElPIGJpbmRpbmcuIGUuZy4gdGhlIFdlYk5OIGJhY2tlbmRcbiAgICAgIC8vIGFsd2F5cyBiaW5kcyBpdHMgdGVuc29yIHRvICdtbC10ZW5zb3InLiBJbiBzdWNoIGNhc2VzLCB0aGUgdGVuc29yIElEIG1pZ2h0IGNoYW5nZSBhZnRlciBiaW5kaW5nLFxuICAgICAgLy8gYnV0IGNvcHlpbmcgZGF0YSBmb3IgdGhlc2UgdGVuc29ycyBzaG91bGQgc3RpbGwgYmUgYXZvaWRlZC5cbiAgICAgIGlmICh0ZW5zb3IgPT09IG91dHB1dFRlbnNvckhhbmRsZXNbaV0gfHwgcHJlQWxsb2NhdGVkT3V0cHV0cy5pbmNsdWRlcyhvdXRwdXRUZW5zb3JIYW5kbGVzW2ldKSkge1xuICAgICAgICAvLyBvdXRwdXQgdGVuc29yIGlzIHByZS1hbGxvY2F0ZWQuIG5vIG5lZWQgdG8gY29weSBkYXRhLlxuICAgICAgICBvdXRwdXQucHVzaChvdXRwdXRUZW5zb3JzW2ldISk7XG4gICAgICAgIGlmICh0ZW5zb3IgIT09IG91dHB1dFRlbnNvckhhbmRsZXNbaV0pIHtcbiAgICAgICAgICAvLyByZWxlYXNlIHJlZHVuZGFudCB0ZW5zb3IgZWFybGllci5cbiAgICAgICAgICBpZiAod2FzbS5fT3J0UmVsZWFzZVRlbnNvcih0ZW5zb3IpICE9PSAwKSB7XG4gICAgICAgICAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IHJlbGVhc2UgdGVuc29yLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGJlZm9yZUdldFRlbnNvckRhdGFTdGFjayA9IHdhc20uc3RhY2tTYXZlKCk7XG4gICAgICAvLyBzdGFjayBhbGxvY2F0ZSA0IHBvaW50ZXIgdmFsdWVcbiAgICAgIGNvbnN0IHRlbnNvckRhdGFPZmZzZXQgPSB3YXNtLnN0YWNrQWxsb2MoNCAqIHB0clNpemUpO1xuXG4gICAgICBsZXQga2VlcE91dHB1dFRlbnNvciA9IGZhbHNlO1xuICAgICAgbGV0IHR5cGU6IFRlbnNvci5UeXBlIHwgdW5kZWZpbmVkLFxuICAgICAgICBkYXRhT2Zmc2V0ID0gMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGVycm9yQ29kZSA9IHdhc20uX09ydEdldFRlbnNvckRhdGEoXG4gICAgICAgICAgdGVuc29yLFxuICAgICAgICAgIHRlbnNvckRhdGFPZmZzZXQsXG4gICAgICAgICAgdGVuc29yRGF0YU9mZnNldCArIHB0clNpemUsXG4gICAgICAgICAgdGVuc29yRGF0YU9mZnNldCArIDIgKiBwdHJTaXplLFxuXG4gICAgICAgICAgdGVuc29yRGF0YU9mZnNldCArIDMgKiBwdHJTaXplLFxuICAgICAgICApO1xuICAgICAgICBpZiAoZXJyb3JDb2RlICE9PSAwKSB7XG4gICAgICAgICAgY2hlY2tMYXN0RXJyb3IoYENhbid0IGFjY2VzcyBvdXRwdXQgdGVuc29yIGRhdGEgb24gaW5kZXggJHtpfS5gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZVR5cGUgPSBwdHJTaXplID09PSA0ID8gJ2kzMicgOiAnaTY0JztcbiAgICAgICAgY29uc3QgZGF0YVR5cGUgPSBOdW1iZXIod2FzbS5nZXRWYWx1ZSh0ZW5zb3JEYXRhT2Zmc2V0LCB2YWx1ZVR5cGUpKTtcbiAgICAgICAgZGF0YU9mZnNldCA9IHdhc20uZ2V0VmFsdWUodGVuc29yRGF0YU9mZnNldCArIHB0clNpemUsICcqJyk7XG4gICAgICAgIGNvbnN0IGRpbXNPZmZzZXQgPSB3YXNtLmdldFZhbHVlKHRlbnNvckRhdGFPZmZzZXQgKyBwdHJTaXplICogMiwgJyonKTtcbiAgICAgICAgY29uc3QgZGltc0xlbmd0aCA9IE51bWJlcih3YXNtLmdldFZhbHVlKHRlbnNvckRhdGFPZmZzZXQgKyBwdHJTaXplICogMywgdmFsdWVUeXBlKSk7XG4gICAgICAgIGNvbnN0IGRpbXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1zTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBkaW1zLnB1c2goTnVtYmVyKHdhc20uZ2V0VmFsdWUoZGltc09mZnNldCArIGkgKiBwdHJTaXplLCB2YWx1ZVR5cGUpKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdhc20uX09ydEZyZWUoZGltc09mZnNldCkgIT09IDApIHtcbiAgICAgICAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IGZyZWUgbWVtb3J5IGZvciB0ZW5zb3IgZGltcy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2l6ZSA9IGRpbXMucmVkdWNlKChhLCBiKSA9PiBhICogYiwgMSk7XG4gICAgICAgIHR5cGUgPSB0ZW5zb3JEYXRhVHlwZUVudW1Ub1N0cmluZyhkYXRhVHlwZSk7XG5cbiAgICAgICAgY29uc3QgcHJlZmVycmVkTG9jYXRpb24gPSBpb0JpbmRpbmdTdGF0ZT8ub3V0cHV0UHJlZmVycmVkTG9jYXRpb25zW291dHB1dEluZGljZXNbaV1dO1xuXG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlmIChwcmVmZXJyZWRMb2NhdGlvbiA9PT0gJ2dwdS1idWZmZXInIHx8IHByZWZlcnJlZExvY2F0aW9uID09PSAnbWwtdGVuc29yJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHJpbmcgdGVuc29yIGlzIG5vdCBzdXBwb3J0ZWQgb24gR1BVLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBzdHJpbmdEYXRhOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB3YXNtLmdldFZhbHVlKGRhdGFPZmZzZXQgKyBpICogcHRyU2l6ZSwgJyonKTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRPZmZzZXQgPSB3YXNtLmdldFZhbHVlKGRhdGFPZmZzZXQgKyAoaSArIDEpICogcHRyU2l6ZSwgJyonKTtcbiAgICAgICAgICAgIGNvbnN0IG1heEJ5dGVzVG9SZWFkID0gaSA9PT0gc2l6ZSAtIDEgPyB1bmRlZmluZWQgOiBuZXh0T2Zmc2V0IC0gb2Zmc2V0O1xuICAgICAgICAgICAgc3RyaW5nRGF0YS5wdXNoKHdhc20uVVRGOFRvU3RyaW5nKG9mZnNldCwgbWF4Qnl0ZXNUb1JlYWQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0cHV0LnB1c2goW3R5cGUsIGRpbXMsIHN0cmluZ0RhdGEsICdjcHUnXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgYSBjZXJ0YWluIG91dHB1dCdzIHByZWZlcnJlZCBsb2NhdGlvbiBpcyBHUFUgYnV0IHRoZSB0ZW5zb3IgaXMgZW1wdHksIHdlIHN0aWxsIG5lZWQgdG8gY3JlYXRlIGEgQ1BVXG4gICAgICAgICAgLy8gdGVuc29yIGZvciBpdC4gVGhlcmUgaXMgbm8gbWFwcGluZyBHUFUgYnVmZmVyIGZvciBhbiBlbXB0eSB0ZW5zb3IuXG4gICAgICAgICAgaWYgKHByZWZlcnJlZExvY2F0aW9uID09PSAnZ3B1LWJ1ZmZlcicgJiYgc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGdldEJ1ZmZlciA9ICFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCR1BVID8gd2FzbS53ZWJncHVHZXRCdWZmZXIgOiB3YXNtLmpzZXBHZXRCdWZmZXI7XG4gICAgICAgICAgICBpZiAoIWdldEJ1ZmZlcikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ByZWZlcnJlZExvY2F0aW9uIFwiZ3B1LWJ1ZmZlclwiIGlzIG5vdCBzdXBwb3J0ZWQgd2l0aG91dCB1c2luZyBXZWJHUFUuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBncHVCdWZmZXIgPSBnZXRCdWZmZXIoZGF0YU9mZnNldCk7XG4gICAgICAgICAgICBjb25zdCBidWZmZXJTaXplID0gY2FsY3VsYXRlVGVuc29yU2l6ZUluQnl0ZXMoZGF0YVR5cGUsIHNpemUpO1xuICAgICAgICAgICAgaWYgKGJ1ZmZlclNpemUgPT09IHVuZGVmaW5lZCB8fCAhaXNHcHVCdWZmZXJTdXBwb3J0ZWRUeXBlKHR5cGUpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZGF0YSB0eXBlOiAke3R5cGV9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGRvIG5vdCByZWxlYXNlIHRoZSB0ZW5zb3IgcmlnaHQgbm93LiBpdCB3aWxsIGJlIHJlbGVhc2VkIHdoZW4gdXNlciBjYWxscyB0ZW5zb3IuZGlzcG9zZSgpLlxuICAgICAgICAgICAga2VlcE91dHB1dFRlbnNvciA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkge1xuICAgICAgICAgICAgICB3YXNtLndlYmdwdVJlZ2lzdGVyQnVmZmVyIShncHVCdWZmZXIsIHNlc3Npb25JZCwgZGF0YU9mZnNldCk7XG4gICAgICAgICAgICAgIGNvbnN0IGRvd25sb2FkRGF0YUZ1bmN0aW9uID0gd2FzbS53ZWJncHVDcmVhdGVEb3dubG9hZGVyIShncHVCdWZmZXIsIGJ1ZmZlclNpemUsIHNlc3Npb25JZCk7XG4gICAgICAgICAgICAgIG91dHB1dC5wdXNoKFtcbiAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgIGRpbXMsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZ3B1QnVmZmVyLFxuICAgICAgICAgICAgICAgICAgZG93bmxvYWQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBkb3dubG9hZERhdGFGdW5jdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3ICh0ZW5zb3JUeXBlVG9UeXBlZEFycmF5Q29uc3RydWN0b3IodHlwZSEpKShhcnJheUJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhIGFzIFRlbnNvci5EYXRhVHlwZU1hcFtUZW5zb3IuR3B1QnVmZmVyRGF0YVR5cGVzXTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBkaXNwb3NlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3YXNtLl9PcnRSZWxlYXNlVGVuc29yKHRlbnNvcikgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICBjaGVja0xhc3RFcnJvcihcIkNhbid0IHJlbGVhc2UgdGVuc29yLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdncHUtYnVmZmVyJyxcbiAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvdXRwdXQucHVzaChbXG4gICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICBkaW1zLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGdwdUJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgIGRvd25sb2FkOiB3YXNtLmpzZXBDcmVhdGVEb3dubG9hZGVyIShncHVCdWZmZXIsIGJ1ZmZlclNpemUsIHR5cGUpLFxuICAgICAgICAgICAgICAgICAgZGlzcG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAod2FzbS5fT3J0UmVsZWFzZVRlbnNvcih0ZW5zb3IpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCByZWxlYXNlIHRlbnNvci5cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnZ3B1LWJ1ZmZlcicsXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAocHJlZmVycmVkTG9jYXRpb24gPT09ICdtbC10ZW5zb3InICYmIHNpemUgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBlbnN1cmVUZW5zb3IgPSB3YXNtLndlYm5uRW5zdXJlVGVuc29yO1xuICAgICAgICAgICAgY29uc3QgaXNHcmFwaElucHV0T3V0cHV0VHlwZVN1cHBvcnRlZCA9IHdhc20ud2Vibm5Jc0dyYXBoSW5wdXRPdXRwdXRUeXBlU3VwcG9ydGVkO1xuICAgICAgICAgICAgaWYgKCFlbnN1cmVUZW5zb3IgfHwgIWlzR3JhcGhJbnB1dE91dHB1dFR5cGVTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcmVmZXJyZWRMb2NhdGlvbiBcIm1sLXRlbnNvclwiIGlzIG5vdCBzdXBwb3J0ZWQgd2l0aG91dCB1c2luZyBXZWJOTi4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRlbnNvclNpemUgPSBjYWxjdWxhdGVUZW5zb3JTaXplSW5CeXRlcyhkYXRhVHlwZSwgc2l6ZSk7XG4gICAgICAgICAgICBpZiAodGVuc29yU2l6ZSA9PT0gdW5kZWZpbmVkIHx8ICFpc01MVGVuc29yU3VwcG9ydGVkVHlwZSh0eXBlKSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGRhdGEgdHlwZTogJHt0eXBlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0dyYXBoSW5wdXRPdXRwdXRUeXBlU3VwcG9ydGVkKHNlc3Npb25JZCwgdHlwZSwgZmFsc2UpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgcHJlZmVycmVkTG9jYXRpb24gXCJtbC10ZW5zb3JcIiBmb3IgJHt0eXBlfSBvdXRwdXQgaXMgbm90IHN1cHBvcnRlZCBieSBjdXJyZW50IFdlYk5OIENvbnRleHQuYCxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhlIGdyYXBoIGhhcyBiZWVuIHBhcnRpdGlvbmVkLCB0aGUgb3V0cHV0IHRlbnNvciBtYXkgaGF2ZSBub3QgYmVlbiBjcmVhdGVkLiBGb3IgdGhpcyByZWFzb24sIHdlIHVzZVxuICAgICAgICAgICAgLy8gZW5zdXJlVGVuc29yIHRvIGdldC9jcmVhdGUgdGhlIE1MVGVuc29yLiBJbiB3aGljaCBjYXNlLCB3ZSBkb24ndCBuZWVkIHRvIGNvcHkgdGhlIGRhdGEgaWYgYSBuZXcgdGVuc29yXG4gICAgICAgICAgICAvLyBoYXMgYmVlbiBjcmVhdGVkLlxuICAgICAgICAgICAgY29uc3QgbWxUZW5zb3IgPSBhd2FpdCBlbnN1cmVUZW5zb3Ioc2Vzc2lvbklkLCBkYXRhT2Zmc2V0LCBkYXRhVHlwZSwgZGltcywgZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBkbyBub3QgcmVsZWFzZSB0aGUgdGVuc29yIHJpZ2h0IG5vdy4gaXQgd2lsbCBiZSByZWxlYXNlZCB3aGVuIHVzZXIgY2FsbHMgdGVuc29yLmRpc3Bvc2UoKS5cbiAgICAgICAgICAgIGtlZXBPdXRwdXRUZW5zb3IgPSB0cnVlO1xuXG4gICAgICAgICAgICBvdXRwdXQucHVzaChbXG4gICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgIGRpbXMsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtbFRlbnNvcixcbiAgICAgICAgICAgICAgICBkb3dubG9hZDogd2FzbS53ZWJubkNyZWF0ZU1MVGVuc29yRG93bmxvYWRlciEoZGF0YU9mZnNldCwgdHlwZSksXG4gICAgICAgICAgICAgICAgZGlzcG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgd2FzbS53ZWJublJlbGVhc2VUZW5zb3JJZCEoZGF0YU9mZnNldCk7XG4gICAgICAgICAgICAgICAgICB3YXNtLl9PcnRSZWxlYXNlVGVuc29yKHRlbnNvcik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ21sLXRlbnNvcicsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHByZWZlcnJlZExvY2F0aW9uID09PSAnbWwtdGVuc29yLWNwdS1vdXRwdXQnICYmIHNpemUgPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gd2FzbS53ZWJubkNyZWF0ZU1MVGVuc29yRG93bmxvYWRlciEoZGF0YU9mZnNldCwgdHlwZSBhcyBUZW5zb3IuTUxUZW5zb3JEYXRhVHlwZXMpKCk7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG91dHB1dC5sZW5ndGg7XG4gICAgICAgICAgICAvLyBEZWxheSB0aGUgZGF0YSBkb3dubG9hZCBhbmQgcmVsZWFzaW5nIHRoZSB0ZW5zb3IgdW50aWwgd2UgY2FuIHdhaXQgZm9yIGFsbCBvdXRwdXQgdGVuc29ycyB0byBiZSBkb3dubG9hZGVkLlxuICAgICAgICAgICAga2VlcE91dHB1dFRlbnNvciA9IHRydWU7XG4gICAgICAgICAgICBvdXRwdXRQcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogW251bWJlciwgVGVuc29yLkRhdGFUeXBlXSA9IFtpbmRleCwgYXdhaXQgZGF0YV07XG4gICAgICAgICAgICAgICAgd2FzbS53ZWJublJlbGVhc2VUZW5zb3JJZCEoZGF0YU9mZnNldCk7XG4gICAgICAgICAgICAgICAgd2FzbS5fT3J0UmVsZWFzZVRlbnNvcih0ZW5zb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgIH0pKCksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgb3V0cHV0LnB1c2goW3R5cGUsIGRpbXMsIFtdLCAnY3B1J10pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlZEFycmF5Q29uc3RydWN0b3IgPSB0ZW5zb3JUeXBlVG9UeXBlZEFycmF5Q29uc3RydWN0b3IodHlwZSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IHR5cGVkQXJyYXlDb25zdHJ1Y3RvcihzaXplKTtcbiAgICAgICAgICAgIG5ldyBVaW50OEFycmF5KGRhdGEuYnVmZmVyLCBkYXRhLmJ5dGVPZmZzZXQsIGRhdGEuYnl0ZUxlbmd0aCkuc2V0KFxuICAgICAgICAgICAgICB3YXNtLkhFQVBVOC5zdWJhcnJheShkYXRhT2Zmc2V0LCBkYXRhT2Zmc2V0ICsgZGF0YS5ieXRlTGVuZ3RoKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChbdHlwZSwgZGltcywgZGF0YSwgJ2NwdSddKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHdhc20uc3RhY2tSZXN0b3JlKGJlZm9yZUdldFRlbnNvckRhdGFTdGFjayk7XG4gICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBkYXRhT2Zmc2V0KSB7XG4gICAgICAgICAgd2FzbS5fZnJlZShkYXRhT2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWtlZXBPdXRwdXRUZW5zb3IpIHtcbiAgICAgICAgICB3YXNtLl9PcnRSZWxlYXNlVGVuc29yKHRlbnNvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW9CaW5kaW5nU3RhdGUgJiYgIWVuYWJsZUdyYXBoQ2FwdHVyZSkge1xuICAgICAgaWYgKHdhc20uX09ydENsZWFyQm91bmRPdXRwdXRzKGlvQmluZGluZ1N0YXRlLmhhbmRsZSkgIT09IDApIHtcbiAgICAgICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCBjbGVhciBib3VuZCBvdXRwdXRzLlwiKTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZVNlc3Npb25zLnNldChzZXNzaW9uSWQsIFtcbiAgICAgICAgc2Vzc2lvbkhhbmRsZSxcbiAgICAgICAgaW5wdXROYW1lc1VURjhFbmNvZGVkLFxuICAgICAgICBvdXRwdXROYW1lc1VURjhFbmNvZGVkLFxuICAgICAgICBpb0JpbmRpbmdTdGF0ZSxcbiAgICAgICAgZW5hYmxlR3JhcGhDYXB0dXJlLFxuICAgICAgICBmYWxzZSxcbiAgICAgIF0pO1xuICAgIH1cbiAgICAvLyBXYWl0IGZvciBhbGwgb3V0cHV0IHRlbnNvciBkYXRhIHRvIGJlIGRvd25sb2FkZWQuXG4gICAgZm9yIChjb25zdCBbaW5kZXgsIGRhdGFdIG9mIGF3YWl0IFByb21pc2UuYWxsKG91dHB1dFByb21pc2VzKSkge1xuICAgICAgb3V0cHV0W2luZGV4XVsyXSA9IGRhdGE7XG4gICAgfVxuICAgIFRSQUNFX0VWRU5UX0VORCgnd2FzbSBQcm9jZXNzT3V0cHV0VGVuc29yJyk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfSBmaW5hbGx5IHtcbiAgICB3YXNtLndlYm5uT25SdW5FbmQ/LihzZXNzaW9uSGFuZGxlKTtcblxuICAgIHdhc20uc3RhY2tSZXN0b3JlKGJlZm9yZVJ1blN0YWNrKTtcblxuICAgIGlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkge1xuICAgICAgaW5wdXRUZW5zb3JzLmZvckVhY2goKHQpID0+IHtcbiAgICAgICAgaWYgKHQgJiYgdFszXSA9PT0gJ2dwdS1idWZmZXInKSB7XG4gICAgICAgICAgd2FzbS53ZWJncHVVbnJlZ2lzdGVyQnVmZmVyISh0WzJdLmdwdUJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb3V0cHV0VGVuc29ycy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgIGlmICh0ICYmIHRbM10gPT09ICdncHUtYnVmZmVyJykge1xuICAgICAgICAgIHdhc20ud2ViZ3B1VW5yZWdpc3RlckJ1ZmZlciEodFsyXS5ncHVCdWZmZXIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaW5wdXRUZW5zb3JIYW5kbGVzLmZvckVhY2goKHYpID0+IHdhc20uX09ydFJlbGVhc2VUZW5zb3IodikpO1xuICAgIG91dHB1dFRlbnNvckhhbmRsZXMuZm9yRWFjaCgodikgPT4gd2FzbS5fT3J0UmVsZWFzZVRlbnNvcih2KSk7XG4gICAgaW5wdXRPdXRwdXRBbGxvY3MuZm9yRWFjaCgocCkgPT4gd2FzbS5fZnJlZShwKSk7XG5cbiAgICBpZiAocnVuT3B0aW9uc0hhbmRsZSAhPT0gMCkge1xuICAgICAgd2FzbS5fT3J0UmVsZWFzZVJ1bk9wdGlvbnMocnVuT3B0aW9uc0hhbmRsZSk7XG4gICAgfVxuICAgIHJ1bk9wdGlvbnNBbGxvY3MuZm9yRWFjaCgocCkgPT4gd2FzbS5fZnJlZShwKSk7XG4gIH1cbn07XG5cbi8qKlxuICogZW5kIHByb2ZpbGluZ1xuICovXG5leHBvcnQgY29uc3QgZW5kUHJvZmlsaW5nID0gKHNlc3Npb25JZDogbnVtYmVyKTogdm9pZCA9PiB7XG4gIGNvbnN0IHdhc20gPSBnZXRJbnN0YW5jZSgpO1xuICBjb25zdCBzZXNzaW9uID0gYWN0aXZlU2Vzc2lvbnMuZ2V0KHNlc3Npb25JZCk7XG4gIGlmICghc2Vzc2lvbikge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzZXNzaW9uIGlkJyk7XG4gIH1cbiAgY29uc3Qgc2Vzc2lvbkhhbmRsZSA9IHNlc3Npb25bMF07XG5cbiAgLy8gcHJvZmlsZSBmaWxlIG5hbWUgaXMgbm90IHVzZWQgeWV0LCBidXQgaXQgbXVzdCBiZSBmcmVlZC5cbiAgY29uc3QgcHJvZmlsZUZpbGVOYW1lID0gd2FzbS5fT3J0RW5kUHJvZmlsaW5nKHNlc3Npb25IYW5kbGUpO1xuICBpZiAocHJvZmlsZUZpbGVOYW1lID09PSAwKSB7XG4gICAgY2hlY2tMYXN0RXJyb3IoXCJDYW4ndCBnZXQgYW4gcHJvZmlsZSBmaWxlIG5hbWUuXCIpO1xuICB9XG4gIHdhc20uX09ydEZyZWUocHJvZmlsZUZpbGVOYW1lKTtcbn07XG5cbmV4cG9ydCBjb25zdCBleHRyYWN0VHJhbnNmZXJhYmxlQnVmZmVycyA9ICh0ZW5zb3JzOiByZWFkb25seSBTZXJpYWxpemFibGVUZW5zb3JNZXRhZGF0YVtdKTogQXJyYXlCdWZmZXJMaWtlW10gPT4ge1xuICBjb25zdCBidWZmZXJzOiBBcnJheUJ1ZmZlckxpa2VbXSA9IFtdO1xuICBmb3IgKGNvbnN0IHRlbnNvciBvZiB0ZW5zb3JzKSB7XG4gICAgY29uc3QgZGF0YSA9IHRlbnNvclsyXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YSkgJiYgJ2J1ZmZlcicgaW4gZGF0YSkge1xuICAgICAgYnVmZmVycy5wdXNoKGRhdGEuYnVmZmVyKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ1ZmZlcnM7XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBlbnYsIEluZmVyZW5jZVNlc3Npb24gfSBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuXG5pbXBvcnQge1xuICBPcnRXYXNtTWVzc2FnZSxcbiAgU2VyaWFsaXphYmxlSW50ZXJuYWxCdWZmZXIsXG4gIFNlcmlhbGl6YWJsZVNlc3Npb25NZXRhZGF0YSxcbiAgU2VyaWFsaXphYmxlVGVuc29yTWV0YWRhdGEsXG4gIFRlbnNvck1ldGFkYXRhLFxufSBmcm9tICcuL3Byb3h5LW1lc3NhZ2VzJztcbmltcG9ydCAqIGFzIGNvcmUgZnJvbSAnLi93YXNtLWNvcmUtaW1wbCc7XG5pbXBvcnQgeyBpbml0aWFsaXplV2ViQXNzZW1ibHkgfSBmcm9tICcuL3dhc20tZmFjdG9yeSc7XG5pbXBvcnQge1xuICBpbXBvcnRQcm94eVdvcmtlcixcbiAgaW5mZXJXYXNtUGF0aFByZWZpeEZyb21TY3JpcHRTcmMsXG4gIGlzRXNtSW1wb3J0TWV0YVVybEhhcmRjb2RlZEFzRmlsZVVyaSxcbn0gZnJvbSAnLi93YXNtLXV0aWxzLWltcG9ydCc7XG5cbmNvbnN0IGlzUHJveHkgPSAoKTogYm9vbGVhbiA9PiAhIWVudi53YXNtLnByb3h5ICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XG5sZXQgcHJveHlXb3JrZXI6IFdvcmtlciB8IHVuZGVmaW5lZDtcbmxldCBpbml0aWFsaXppbmcgPSBmYWxzZTtcbmxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xubGV0IGFib3J0ZWQgPSBmYWxzZTtcbmxldCB0ZW1wb3JhcnlPYmplY3RVcmw6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxudHlwZSBQcm9taXNlQ2FsbGJhY2tzPFQgPSB2b2lkPiA9IFtyZXNvbHZlOiAocmVzdWx0OiBUKSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb246IHVua25vd24pID0+IHZvaWRdO1xubGV0IGluaXRXYXNtQ2FsbGJhY2tzOiBQcm9taXNlQ2FsbGJhY2tzO1xuY29uc3QgcXVldWVkQ2FsbGJhY2tzOiBNYXA8T3J0V2FzbU1lc3NhZ2VbJ3R5cGUnXSwgQXJyYXk8UHJvbWlzZUNhbGxiYWNrczx1bmtub3duPj4+ID0gbmV3IE1hcCgpO1xuXG5jb25zdCBlbnF1ZXVlQ2FsbGJhY2tzID0gKHR5cGU6IE9ydFdhc21NZXNzYWdlWyd0eXBlJ10sIGNhbGxiYWNrczogUHJvbWlzZUNhbGxiYWNrczx1bmtub3duPik6IHZvaWQgPT4ge1xuICBjb25zdCBxdWV1ZSA9IHF1ZXVlZENhbGxiYWNrcy5nZXQodHlwZSk7XG4gIGlmIChxdWV1ZSkge1xuICAgIHF1ZXVlLnB1c2goY2FsbGJhY2tzKTtcbiAgfSBlbHNlIHtcbiAgICBxdWV1ZWRDYWxsYmFja3Muc2V0KHR5cGUsIFtjYWxsYmFja3NdKTtcbiAgfVxufTtcblxuY29uc3QgZW5zdXJlV29ya2VyID0gKCk6IHZvaWQgPT4ge1xuICBpZiAoaW5pdGlhbGl6aW5nIHx8ICFpbml0aWFsaXplZCB8fCBhYm9ydGVkIHx8ICFwcm94eVdvcmtlcikge1xuICAgIHRocm93IG5ldyBFcnJvcignd29ya2VyIG5vdCByZWFkeScpO1xuICB9XG59O1xuXG5jb25zdCBvblByb3h5V29ya2VyTWVzc2FnZSA9IChldjogTWVzc2FnZUV2ZW50PE9ydFdhc21NZXNzYWdlPik6IHZvaWQgPT4ge1xuICBzd2l0Y2ggKGV2LmRhdGEudHlwZSkge1xuICAgIGNhc2UgJ2luaXQtd2FzbSc6XG4gICAgICBpbml0aWFsaXppbmcgPSBmYWxzZTtcbiAgICAgIGlmIChldi5kYXRhLmVycikge1xuICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgaW5pdFdhc21DYWxsYmFja3NbMV0oZXYuZGF0YS5lcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBpbml0V2FzbUNhbGxiYWNrc1swXSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRlbXBvcmFyeU9iamVjdFVybCkge1xuICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHRlbXBvcmFyeU9iamVjdFVybCk7XG4gICAgICAgIHRlbXBvcmFyeU9iamVjdFVybCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2luaXQtZXAnOlxuICAgIGNhc2UgJ2NvcHktZnJvbSc6XG4gICAgY2FzZSAnY3JlYXRlJzpcbiAgICBjYXNlICdyZWxlYXNlJzpcbiAgICBjYXNlICdydW4nOlxuICAgIGNhc2UgJ2VuZC1wcm9maWxpbmcnOiB7XG4gICAgICBjb25zdCBjYWxsYmFja3MgPSBxdWV1ZWRDYWxsYmFja3MuZ2V0KGV2LmRhdGEudHlwZSkhO1xuICAgICAgaWYgKGV2LmRhdGEuZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrcy5zaGlmdCgpIVsxXShldi5kYXRhLmVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFja3Muc2hpZnQoKSFbMF0oZXYuZGF0YS5vdXQhKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OlxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZVdlYkFzc2VtYmx5QW5kT3J0UnVudGltZSA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChpbml0aWFsaXppbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJtdWx0aXBsZSBjYWxscyB0byAnaW5pdFdhc20oKScgZGV0ZWN0ZWQuXCIpO1xuICB9XG4gIGlmIChhYm9ydGVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwicHJldmlvdXMgY2FsbCB0byAnaW5pdFdhc20oKScgZmFpbGVkLlwiKTtcbiAgfVxuXG4gIGluaXRpYWxpemluZyA9IHRydWU7XG5cbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9QUk9YWSAmJiBpc1Byb3h5KCkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcHJveHlXb3JrZXI/LnRlcm1pbmF0ZSgpO1xuXG4gICAgICB2b2lkIGltcG9ydFByb3h5V29ya2VyKCkudGhlbigoW29iamVjdFVybCwgd29ya2VyXSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHByb3h5V29ya2VyID0gd29ya2VyO1xuICAgICAgICAgIHByb3h5V29ya2VyLm9uZXJyb3IgPSAoZXY6IEVycm9yRXZlbnQpID0+IHJlamVjdChldik7XG4gICAgICAgICAgcHJveHlXb3JrZXIub25tZXNzYWdlID0gb25Qcm94eVdvcmtlck1lc3NhZ2U7XG4gICAgICAgICAgaW5pdFdhc21DYWxsYmFja3MgPSBbcmVzb2x2ZSwgcmVqZWN0XTtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlOiBPcnRXYXNtTWVzc2FnZSA9IHsgdHlwZTogJ2luaXQtd2FzbScsIGluOiBlbnYgfTtcblxuICAgICAgICAgIC8vIGlmIHRoZSBwcm94eSB3b3JrZXIgaXMgbG9hZGVkIGZyb20gYSBibG9iIFVSTCwgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhlIHBhdGggaW5mb3JtYXRpb24gaXMgbm90IGxvc3QuXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyB3aGVuIGBlbnYud2FzbS53YXNtUGF0aHNgIGlzIG5vdCBzZXQsIHdlIG5lZWQgdG8gcGFzcyB0aGUgcGF0aCBpbmZvcm1hdGlvbiB0byB0aGUgd29ya2VyLlxuICAgICAgICAgIC8vXG4gICAgICAgICAgaWYgKCFCVUlMRF9ERUZTLkVOQUJMRV9CVU5ETEVfV0FTTV9KUyAmJiAhbWVzc2FnZS5pbiEud2FzbS53YXNtUGF0aHMgJiYgb2JqZWN0VXJsKSB7XG4gICAgICAgICAgICAvLyBmb3IgYSBidWlsZCBub3QgYnVuZGxlZCB0aGUgd2FzbSBKUywgd2UgbmVlZCB0byBwYXNzIHRoZSBwYXRoIHByZWZpeCB0byB0aGUgd29ya2VyLlxuICAgICAgICAgICAgLy8gdGhlIHBhdGggcHJlZml4IHdpbGwgYmUgdXNlZCB0byByZXNvbHZlIHRoZSBwYXRoIHRvIGJvdGggdGhlIHdhc20gSlMgYW5kIHRoZSB3YXNtIGZpbGUuXG4gICAgICAgICAgICBjb25zdCBpbmZlcnJlZFdhc21QYXRoUHJlZml4ID0gaW5mZXJXYXNtUGF0aFByZWZpeEZyb21TY3JpcHRTcmMoKTtcbiAgICAgICAgICAgIGlmIChpbmZlcnJlZFdhc21QYXRoUHJlZml4KSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2UuaW4hLndhc20ud2FzbVBhdGhzID0gaW5mZXJyZWRXYXNtUGF0aFByZWZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBCVUlMRF9ERUZTLklTX0VTTSAmJlxuICAgICAgICAgICAgQlVJTERfREVGUy5FTkFCTEVfQlVORExFX1dBU01fSlMgJiZcbiAgICAgICAgICAgICFtZXNzYWdlLmluIS53YXNtLndhc21QYXRocyAmJlxuICAgICAgICAgICAgKG9iamVjdFVybCB8fCBpc0VzbUltcG9ydE1ldGFVcmxIYXJkY29kZWRBc0ZpbGVVcmkpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBmb3IgYSBidWlsZCBidW5kbGVkIHRoZSB3YXNtIEpTLCBpZiBlaXRoZXIgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGlzIG1ldDpcbiAgICAgICAgICAgIC8vIC0gdGhlIHByb3h5IHdvcmtlciBpcyBsb2FkZWQgZnJvbSBhIGJsb2IgVVJMXG4gICAgICAgICAgICAvLyAtIGBpbXBvcnQubWV0YS51cmxgIGlzIGEgZmlsZSBVUkwsIGl0IG1lYW5zIGl0IGlzIG92ZXJ3cml0dGVuIGJ5IHRoZSBidW5kbGVyLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGluIGVpdGhlciBjYXNlLCB0aGUgcGF0aCBpbmZvcm1hdGlvbiBpcyBsb3N0LCB3ZSBuZWVkIHRvIHBhc3MgdGhlIHBhdGggb2YgdGhlIC53YXNtIGZpbGUgdG8gdGhlIHdvcmtlci5cbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gdXNlIHRoZSBidW5kbGVyIHByZWZlcnJlZCBVUkwgZm9ybWF0OlxuICAgICAgICAgICAgLy8gbmV3IFVSTCgnZmlsZW5hbWUnLCBpbXBvcnQubWV0YS51cmwpXG4gICAgICAgICAgICAvLyBzbyB0aGF0IHRoZSBidW5kbGVyIGNhbiBoYW5kbGUgdGhlIGZpbGUgdXNpbmcgY29ycmVzcG9uZGluZyBsb2FkZXJzLlxuICAgICAgICAgICAgbWVzc2FnZS5pbiEud2FzbS53YXNtUGF0aHMgPSB7XG4gICAgICAgICAgICAgIHdhc206ICFCVUlMRF9ERUZTLkRJU0FCTEVfSlNFUFxuICAgICAgICAgICAgICAgID8gbmV3IFVSTCgnb3J0LXdhc20tc2ltZC10aHJlYWRlZC5qc2VwLndhc20nLCBCVUlMRF9ERUZTLkVTTV9JTVBPUlRfTUVUQV9VUkwpLmhyZWZcbiAgICAgICAgICAgICAgICA6IEJVSUxEX0RFRlMuRU5BQkxFX0pTUElcbiAgICAgICAgICAgICAgICAgID8gbmV3IFVSTCgnb3J0LXdhc20tc2ltZC10aHJlYWRlZC5qc3BpLndhc20nLCBCVUlMRF9ERUZTLkVTTV9JTVBPUlRfTUVUQV9VUkwpLmhyZWZcbiAgICAgICAgICAgICAgICAgIDogIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFVcbiAgICAgICAgICAgICAgICAgICAgPyBuZXcgVVJMKCdvcnQtd2FzbS1zaW1kLXRocmVhZGVkLmFzeW5jaWZ5Lndhc20nLCBCVUlMRF9ERUZTLkVTTV9JTVBPUlRfTUVUQV9VUkwpLmhyZWZcbiAgICAgICAgICAgICAgICAgICAgOiBuZXcgVVJMKCdvcnQtd2FzbS1zaW1kLXRocmVhZGVkLndhc20nLCBCVUlMRF9ERUZTLkVTTV9JTVBPUlRfTUVUQV9VUkwpLmhyZWYsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcm94eVdvcmtlci5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICB0ZW1wb3JhcnlPYmplY3RVcmwgPSBvYmplY3RVcmw7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHJlamVjdCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGluaXRpYWxpemVXZWJBc3NlbWJseShlbnYud2FzbSk7XG4gICAgICBhd2FpdCBjb3JlLmluaXRSdW50aW1lKGVudik7XG4gICAgICBpbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpbml0aWFsaXppbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplT3J0RXAgPSBhc3luYyAoZXBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9QUk9YWSAmJiBpc1Byb3h5KCkpIHtcbiAgICBlbnN1cmVXb3JrZXIoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW5xdWV1ZUNhbGxiYWNrcygnaW5pdC1lcCcsIFtyZXNvbHZlLCByZWplY3RdKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE9ydFdhc21NZXNzYWdlID0geyB0eXBlOiAnaW5pdC1lcCcsIGluOiB7IGVwTmFtZSwgZW52IH0gfTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhd2FpdCBjb3JlLmluaXRFcChlbnYsIGVwTmFtZSk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBjb3B5RnJvbUV4dGVybmFsQnVmZmVyID0gYXN5bmMgKGJ1ZmZlcjogVWludDhBcnJheSk6IFByb21pc2U8U2VyaWFsaXphYmxlSW50ZXJuYWxCdWZmZXI+ID0+IHtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9QUk9YWSAmJiBpc1Byb3h5KCkpIHtcbiAgICBlbnN1cmVXb3JrZXIoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8U2VyaWFsaXphYmxlSW50ZXJuYWxCdWZmZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGVucXVldWVDYWxsYmFja3MoJ2NvcHktZnJvbScsIFtyZXNvbHZlLCByZWplY3RdKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE9ydFdhc21NZXNzYWdlID0geyB0eXBlOiAnY29weS1mcm9tJywgaW46IHsgYnVmZmVyIH0gfTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlLCBbYnVmZmVyLmJ1ZmZlcl0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb3JlLmNvcHlGcm9tRXh0ZXJuYWxCdWZmZXIoYnVmZmVyKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVNlc3Npb24gPSBhc3luYyAoXG4gIG1vZGVsOiBTZXJpYWxpemFibGVJbnRlcm5hbEJ1ZmZlciB8IFVpbnQ4QXJyYXksXG4gIG9wdGlvbnM/OiBJbmZlcmVuY2VTZXNzaW9uLlNlc3Npb25PcHRpb25zLFxuKTogUHJvbWlzZTxTZXJpYWxpemFibGVTZXNzaW9uTWV0YWRhdGE+ID0+IHtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9QUk9YWSAmJiBpc1Byb3h5KCkpIHtcbiAgICAvLyBjaGVjayB1bnN1cHBvcnRlZCBvcHRpb25zXG4gICAgaWYgKG9wdGlvbnM/LnByZWZlcnJlZE91dHB1dExvY2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Nlc3Npb24gb3B0aW9uIFwicHJlZmVycmVkT3V0cHV0TG9jYXRpb25cIiBpcyBub3Qgc3VwcG9ydGVkIGZvciBwcm94eS4nKTtcbiAgICB9XG4gICAgZW5zdXJlV29ya2VyKCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFNlcmlhbGl6YWJsZVNlc3Npb25NZXRhZGF0YT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW5xdWV1ZUNhbGxiYWNrcygnY3JlYXRlJywgW3Jlc29sdmUsIHJlamVjdF0pO1xuICAgICAgY29uc3QgbWVzc2FnZTogT3J0V2FzbU1lc3NhZ2UgPSB7IHR5cGU6ICdjcmVhdGUnLCBpbjogeyBtb2RlbCwgb3B0aW9uczogeyAuLi5vcHRpb25zIH0gfSB9O1xuICAgICAgY29uc3QgdHJhbnNmZXJhYmxlOiBUcmFuc2ZlcmFibGVbXSA9IFtdO1xuICAgICAgaWYgKG1vZGVsIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICB0cmFuc2ZlcmFibGUucHVzaChtb2RlbC5idWZmZXIpO1xuICAgICAgfVxuICAgICAgcHJveHlXb3JrZXIhLnBvc3RNZXNzYWdlKG1lc3NhZ2UsIHRyYW5zZmVyYWJsZSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvcmUuY3JlYXRlU2Vzc2lvbihtb2RlbCwgb3B0aW9ucyk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCByZWxlYXNlU2Vzc2lvbiA9IGFzeW5jIChzZXNzaW9uSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4ge1xuICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XQVNNX1BST1hZICYmIGlzUHJveHkoKSkge1xuICAgIGVuc3VyZVdvcmtlcigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBlbnF1ZXVlQ2FsbGJhY2tzKCdyZWxlYXNlJywgW3Jlc29sdmUsIHJlamVjdF0pO1xuICAgICAgY29uc3QgbWVzc2FnZTogT3J0V2FzbU1lc3NhZ2UgPSB7IHR5cGU6ICdyZWxlYXNlJywgaW46IHNlc3Npb25JZCB9O1xuICAgICAgcHJveHlXb3JrZXIhLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvcmUucmVsZWFzZVNlc3Npb24oc2Vzc2lvbklkKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHJ1biA9IGFzeW5jIChcbiAgc2Vzc2lvbklkOiBudW1iZXIsXG4gIGlucHV0SW5kaWNlczogbnVtYmVyW10sXG4gIGlucHV0czogVGVuc29yTWV0YWRhdGFbXSxcbiAgb3V0cHV0SW5kaWNlczogbnVtYmVyW10sXG4gIG91dHB1dHM6IEFycmF5PFRlbnNvck1ldGFkYXRhIHwgbnVsbD4sXG4gIG9wdGlvbnM6IEluZmVyZW5jZVNlc3Npb24uUnVuT3B0aW9ucyxcbik6IFByb21pc2U8VGVuc29yTWV0YWRhdGFbXT4gPT4ge1xuICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XQVNNX1BST1hZICYmIGlzUHJveHkoKSkge1xuICAgIC8vIGNoZWNrIGlucHV0cyBsb2NhdGlvblxuICAgIGlmIChpbnB1dHMuc29tZSgodCkgPT4gdFszXSAhPT0gJ2NwdScpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2lucHV0IHRlbnNvciBvbiBHUFUgaXMgbm90IHN1cHBvcnRlZCBmb3IgcHJveHkuJyk7XG4gICAgfVxuICAgIC8vIGNoZWNrIG91dHB1dHMgbG9jYXRpb25cbiAgICBpZiAob3V0cHV0cy5zb21lKCh0KSA9PiB0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcmUtYWxsb2NhdGVkIG91dHB1dCB0ZW5zb3IgaXMgbm90IHN1cHBvcnRlZCBmb3IgcHJveHkuJyk7XG4gICAgfVxuICAgIGVuc3VyZVdvcmtlcigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxTZXJpYWxpemFibGVUZW5zb3JNZXRhZGF0YVtdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBlbnF1ZXVlQ2FsbGJhY2tzKCdydW4nLCBbcmVzb2x2ZSwgcmVqZWN0XSk7XG4gICAgICBjb25zdCBzZXJpYWxpemFibGVJbnB1dHMgPSBpbnB1dHMgYXMgU2VyaWFsaXphYmxlVGVuc29yTWV0YWRhdGFbXTsgLy8gZXZlcnkgaW5wdXQgaXMgb24gQ1BVLlxuICAgICAgY29uc3QgbWVzc2FnZTogT3J0V2FzbU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdydW4nLFxuICAgICAgICBpbjogeyBzZXNzaW9uSWQsIGlucHV0SW5kaWNlcywgaW5wdXRzOiBzZXJpYWxpemFibGVJbnB1dHMsIG91dHB1dEluZGljZXMsIG9wdGlvbnMgfSxcbiAgICAgIH07XG4gICAgICBwcm94eVdvcmtlciEucG9zdE1lc3NhZ2UobWVzc2FnZSwgY29yZS5leHRyYWN0VHJhbnNmZXJhYmxlQnVmZmVycyhzZXJpYWxpemFibGVJbnB1dHMpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29yZS5ydW4oc2Vzc2lvbklkLCBpbnB1dEluZGljZXMsIGlucHV0cywgb3V0cHV0SW5kaWNlcywgb3V0cHV0cywgb3B0aW9ucyk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBlbmRQcm9maWxpbmcgPSBhc3luYyAoc2Vzc2lvbklkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTV9QUk9YWSAmJiBpc1Byb3h5KCkpIHtcbiAgICBlbnN1cmVXb3JrZXIoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZW5xdWV1ZUNhbGxiYWNrcygnZW5kLXByb2ZpbGluZycsIFtyZXNvbHZlLCByZWplY3RdKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE9ydFdhc21NZXNzYWdlID0geyB0eXBlOiAnZW5kLXByb2ZpbGluZycsIGluOiBzZXNzaW9uSWQgfTtcbiAgICAgIHByb3h5V29ya2VyIS5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb3JlLmVuZFByb2ZpbGluZyhzZXNzaW9uSWQpO1xuICB9XG59O1xuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQge1xuICBJbmZlcmVuY2VTZXNzaW9uLFxuICBJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcixcbiAgU2Vzc2lvbkhhbmRsZXIsXG4gIFRlbnNvcixcbiAgVFJBQ0VfRlVOQ19CRUdJTixcbiAgVFJBQ0VfRlVOQ19FTkQsXG59IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5cbmltcG9ydCB7IFNlcmlhbGl6YWJsZUludGVybmFsQnVmZmVyLCBUZW5zb3JNZXRhZGF0YSB9IGZyb20gJy4vcHJveHktbWVzc2FnZXMnO1xuaW1wb3J0IHsgY29weUZyb21FeHRlcm5hbEJ1ZmZlciwgY3JlYXRlU2Vzc2lvbiwgZW5kUHJvZmlsaW5nLCByZWxlYXNlU2Vzc2lvbiwgcnVuIH0gZnJvbSAnLi9wcm94eS13cmFwcGVyJztcbmltcG9ydCB7IGlzR3B1QnVmZmVyU3VwcG9ydGVkVHlwZSwgaXNNTFRlbnNvclN1cHBvcnRlZFR5cGUgfSBmcm9tICcuL3dhc20tY29tbW9uJztcbmltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4vd2FzbS11dGlscy1lbnYnO1xuaW1wb3J0IHsgbG9hZEZpbGUgfSBmcm9tICcuL3dhc20tdXRpbHMtbG9hZC1maWxlJztcblxuZXhwb3J0IGNvbnN0IGVuY29kZVRlbnNvck1ldGFkYXRhID0gKHRlbnNvcjogVGVuc29yLCBnZXROYW1lOiAoKSA9PiBzdHJpbmcpOiBUZW5zb3JNZXRhZGF0YSA9PiB7XG4gIHN3aXRjaCAodGVuc29yLmxvY2F0aW9uKSB7XG4gICAgY2FzZSAnY3B1JzpcbiAgICAgIHJldHVybiBbdGVuc29yLnR5cGUsIHRlbnNvci5kaW1zLCB0ZW5zb3IuZGF0YSwgJ2NwdSddO1xuICAgIGNhc2UgJ2dwdS1idWZmZXInOlxuICAgICAgcmV0dXJuIFt0ZW5zb3IudHlwZSwgdGVuc29yLmRpbXMsIHsgZ3B1QnVmZmVyOiB0ZW5zb3IuZ3B1QnVmZmVyIH0sICdncHUtYnVmZmVyJ107XG4gICAgY2FzZSAnbWwtdGVuc29yJzpcbiAgICAgIHJldHVybiBbdGVuc29yLnR5cGUsIHRlbnNvci5kaW1zLCB7IG1sVGVuc29yOiB0ZW5zb3IubWxUZW5zb3IgfSwgJ21sLXRlbnNvciddO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgZGF0YSBsb2NhdGlvbjogJHt0ZW5zb3IubG9jYXRpb259IGZvciAke2dldE5hbWUoKX1gKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlY29kZVRlbnNvck1ldGFkYXRhID0gKHRlbnNvcjogVGVuc29yTWV0YWRhdGEpOiBUZW5zb3IgPT4ge1xuICBzd2l0Y2ggKHRlbnNvclszXSkge1xuICAgIGNhc2UgJ2NwdSc6XG4gICAgICByZXR1cm4gbmV3IFRlbnNvcih0ZW5zb3JbMF0sIHRlbnNvclsyXSwgdGVuc29yWzFdKTtcbiAgICBjYXNlICdncHUtYnVmZmVyJzoge1xuICAgICAgY29uc3QgZGF0YVR5cGUgPSB0ZW5zb3JbMF07XG4gICAgICBpZiAoIWlzR3B1QnVmZmVyU3VwcG9ydGVkVHlwZShkYXRhVHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBub3Qgc3VwcG9ydGVkIGRhdGEgdHlwZTogJHtkYXRhVHlwZX0gZm9yIGRlc2VyaWFsaXppbmcgR1BVIHRlbnNvcmApO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBncHVCdWZmZXIsIGRvd25sb2FkLCBkaXNwb3NlIH0gPSB0ZW5zb3JbMl07XG4gICAgICByZXR1cm4gVGVuc29yLmZyb21HcHVCdWZmZXIoZ3B1QnVmZmVyLCB7IGRhdGFUeXBlLCBkaW1zOiB0ZW5zb3JbMV0sIGRvd25sb2FkLCBkaXNwb3NlIH0pO1xuICAgIH1cbiAgICBjYXNlICdtbC10ZW5zb3InOiB7XG4gICAgICBjb25zdCBkYXRhVHlwZSA9IHRlbnNvclswXTtcbiAgICAgIGlmICghaXNNTFRlbnNvclN1cHBvcnRlZFR5cGUoZGF0YVR5cGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbm90IHN1cHBvcnRlZCBkYXRhIHR5cGU6ICR7ZGF0YVR5cGV9IGZvciBkZXNlcmlhbGl6aW5nIE1MVGVuc29yIHRlbnNvcmApO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBtbFRlbnNvciwgZG93bmxvYWQsIGRpc3Bvc2UgfSA9IHRlbnNvclsyXTtcbiAgICAgIHJldHVybiBUZW5zb3IuZnJvbU1MVGVuc29yKG1sVGVuc29yLCB7IGRhdGFUeXBlLCBkaW1zOiB0ZW5zb3JbMV0sIGRvd25sb2FkLCBkaXNwb3NlIH0pO1xuICAgIH1cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIGRhdGEgbG9jYXRpb246ICR7dGVuc29yWzNdfWApO1xuICB9XG59O1xuXG5leHBvcnQgY2xhc3MgT25ueHJ1bnRpbWVXZWJBc3NlbWJseVNlc3Npb25IYW5kbGVyIGltcGxlbWVudHMgSW5mZXJlbmNlU2Vzc2lvbkhhbmRsZXIge1xuICBwcml2YXRlIHNlc3Npb25JZDogbnVtYmVyO1xuXG4gIGlucHV0TmFtZXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuICBvdXRwdXROYW1lczogcmVhZG9ubHkgc3RyaW5nW107XG4gIGlucHV0TWV0YWRhdGE6IHJlYWRvbmx5IEluZmVyZW5jZVNlc3Npb24uVmFsdWVNZXRhZGF0YVtdO1xuICBvdXRwdXRNZXRhZGF0YTogcmVhZG9ubHkgSW5mZXJlbmNlU2Vzc2lvbi5WYWx1ZU1ldGFkYXRhW107XG5cbiAgYXN5bmMgZmV0Y2hNb2RlbEFuZENvcHlUb1dhc21NZW1vcnkocGF0aDogc3RyaW5nKTogUHJvbWlzZTxTZXJpYWxpemFibGVJbnRlcm5hbEJ1ZmZlcj4ge1xuICAgIC8vIGZldGNoIG1vZGVsIGZyb20gdXJsIGFuZCBtb3ZlIHRvIHdhc20gaGVhcC5cbiAgICByZXR1cm4gY29weUZyb21FeHRlcm5hbEJ1ZmZlcihhd2FpdCBsb2FkRmlsZShwYXRoKSk7XG4gIH1cblxuICBhc3luYyBsb2FkTW9kZWwocGF0aE9yQnVmZmVyOiBzdHJpbmcgfCBVaW50OEFycmF5LCBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIFRSQUNFX0ZVTkNfQkVHSU4oKTtcbiAgICBsZXQgbW9kZWw6IFBhcmFtZXRlcnM8dHlwZW9mIGNyZWF0ZVNlc3Npb24+WzBdO1xuXG4gICAgaWYgKHR5cGVvZiBwYXRoT3JCdWZmZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgIC8vIG5vZGVcbiAgICAgICAgbW9kZWwgPSBhd2FpdCBsb2FkRmlsZShwYXRoT3JCdWZmZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYnJvd3NlclxuICAgICAgICAvLyBmZXRjaCBtb2RlbCBhbmQgY29weSB0byB3YXNtIGhlYXAuXG4gICAgICAgIG1vZGVsID0gYXdhaXQgdGhpcy5mZXRjaE1vZGVsQW5kQ29weVRvV2FzbU1lbW9yeShwYXRoT3JCdWZmZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtb2RlbCA9IHBhdGhPckJ1ZmZlcjtcbiAgICB9XG5cbiAgICBbdGhpcy5zZXNzaW9uSWQsIHRoaXMuaW5wdXROYW1lcywgdGhpcy5vdXRwdXROYW1lcywgdGhpcy5pbnB1dE1ldGFkYXRhLCB0aGlzLm91dHB1dE1ldGFkYXRhXSA9IGF3YWl0IGNyZWF0ZVNlc3Npb24oXG4gICAgICBtb2RlbCxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgICBUUkFDRV9GVU5DX0VORCgpO1xuICB9XG5cbiAgYXN5bmMgZGlzcG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gcmVsZWFzZVNlc3Npb24odGhpcy5zZXNzaW9uSWQpO1xuICB9XG5cbiAgYXN5bmMgcnVuKFxuICAgIGZlZWRzOiBTZXNzaW9uSGFuZGxlci5GZWVkc1R5cGUsXG4gICAgZmV0Y2hlczogU2Vzc2lvbkhhbmRsZXIuRmV0Y2hlc1R5cGUsXG4gICAgb3B0aW9uczogSW5mZXJlbmNlU2Vzc2lvbi5SdW5PcHRpb25zLFxuICApOiBQcm9taXNlPFNlc3Npb25IYW5kbGVyLlJldHVyblR5cGU+IHtcbiAgICBUUkFDRV9GVU5DX0JFR0lOKCk7XG4gICAgY29uc3QgaW5wdXRBcnJheTogVGVuc29yW10gPSBbXTtcbiAgICBjb25zdCBpbnB1dEluZGljZXM6IG51bWJlcltdID0gW107XG4gICAgT2JqZWN0LmVudHJpZXMoZmVlZHMpLmZvckVhY2goKGt2cCkgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGt2cFswXTtcbiAgICAgIGNvbnN0IHRlbnNvciA9IGt2cFsxXTtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbnB1dE5hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBpbnB1dCAnJHtuYW1lfSdgKTtcbiAgICAgIH1cbiAgICAgIGlucHV0QXJyYXkucHVzaCh0ZW5zb3IpO1xuICAgICAgaW5wdXRJbmRpY2VzLnB1c2goaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb3V0cHV0QXJyYXk6IEFycmF5PFRlbnNvciB8IG51bGw+ID0gW107XG4gICAgY29uc3Qgb3V0cHV0SW5kaWNlczogbnVtYmVyW10gPSBbXTtcbiAgICBPYmplY3QuZW50cmllcyhmZXRjaGVzKS5mb3JFYWNoKChrdnApID0+IHtcbiAgICAgIGNvbnN0IG5hbWUgPSBrdnBbMF07XG4gICAgICBjb25zdCB0ZW5zb3IgPSBrdnBbMV07XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMub3V0cHV0TmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIG91dHB1dCAnJHtuYW1lfSdgKTtcbiAgICAgIH1cbiAgICAgIG91dHB1dEFycmF5LnB1c2godGVuc29yKTtcbiAgICAgIG91dHB1dEluZGljZXMucHVzaChpbmRleCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dEFycmF5Lm1hcCgodCwgaSkgPT5cbiAgICAgIGVuY29kZVRlbnNvck1ldGFkYXRhKHQsICgpID0+IGBpbnB1dCBcIiR7dGhpcy5pbnB1dE5hbWVzW2lucHV0SW5kaWNlc1tpXV19XCJgKSxcbiAgICApO1xuICAgIGNvbnN0IG91dHB1dHMgPSBvdXRwdXRBcnJheS5tYXAoKHQsIGkpID0+XG4gICAgICB0ID8gZW5jb2RlVGVuc29yTWV0YWRhdGEodCwgKCkgPT4gYG91dHB1dCBcIiR7dGhpcy5vdXRwdXROYW1lc1tvdXRwdXRJbmRpY2VzW2ldXX1cImApIDogbnVsbCxcbiAgICApO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHJ1bih0aGlzLnNlc3Npb25JZCwgaW5wdXRJbmRpY2VzLCBpbnB1dHMsIG91dHB1dEluZGljZXMsIG91dHB1dHMsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcmVzdWx0TWFwOiBTZXNzaW9uSGFuZGxlci5SZXR1cm5UeXBlID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRNYXBbdGhpcy5vdXRwdXROYW1lc1tvdXRwdXRJbmRpY2VzW2ldXV0gPSBvdXRwdXRBcnJheVtpXSA/PyBkZWNvZGVUZW5zb3JNZXRhZGF0YShyZXN1bHRzW2ldKTtcbiAgICB9XG4gICAgVFJBQ0VfRlVOQ19FTkQoKTtcbiAgICByZXR1cm4gcmVzdWx0TWFwO1xuICB9XG5cbiAgc3RhcnRQcm9maWxpbmcoKTogdm9pZCB7XG4gICAgLy8gVE9ETzogaW1wbGVtZW50IHByb2ZpbGluZ1xuICB9XG5cbiAgZW5kUHJvZmlsaW5nKCk6IHZvaWQge1xuICAgIHZvaWQgZW5kUHJvZmlsaW5nKHRoaXMuc2Vzc2lvbklkKTtcbiAgfVxufVxuIiwgIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuXG5pbXBvcnQgeyBCYWNrZW5kLCBlbnYsIEluZmVyZW5jZVNlc3Npb24sIEluZmVyZW5jZVNlc3Npb25IYW5kbGVyIH0gZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcblxuaW1wb3J0IHsgaW5pdGlhbGl6ZU9ydEVwLCBpbml0aWFsaXplV2ViQXNzZW1ibHlBbmRPcnRSdW50aW1lIH0gZnJvbSAnLi93YXNtL3Byb3h5LXdyYXBwZXInO1xuaW1wb3J0IHsgT25ueHJ1bnRpbWVXZWJBc3NlbWJseVNlc3Npb25IYW5kbGVyIH0gZnJvbSAnLi93YXNtL3Nlc3Npb24taGFuZGxlci1pbmZlcmVuY2UnO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaW5pdGlhbGl6ZXMgYWxsIGZsYWdzIGZvciBXZWJBc3NlbWJseS5cbiAqXG4gKiBUaG9zZSBmbGFncyBhcmUgYWNjZXNzaWJsZSBmcm9tIGBvcnQuZW52Lndhc21gLiBVc2VycyBhcmUgYWxsb3cgdG8gc2V0IHRob3NlIGZsYWdzIGJlZm9yZSB0aGUgZmlyc3QgaW5mZXJlbmNlIHNlc3Npb25cbiAqIGJlaW5nIGNyZWF0ZWQsIHRvIG92ZXJyaWRlIGRlZmF1bHQgdmFsdWUuXG4gKi9cbmV4cG9ydCBjb25zdCBpbml0aWFsaXplRmxhZ3MgPSAoKTogdm9pZCA9PiB7XG4gIGlmICh0eXBlb2YgZW52Lndhc20uaW5pdFRpbWVvdXQgIT09ICdudW1iZXInIHx8IGVudi53YXNtLmluaXRUaW1lb3V0IDwgMCkge1xuICAgIGVudi53YXNtLmluaXRUaW1lb3V0ID0gMDtcbiAgfVxuXG4gIGNvbnN0IHNpbWQgPSBlbnYud2FzbS5zaW1kO1xuICBpZiAodHlwZW9mIHNpbWQgIT09ICdib29sZWFuJyAmJiBzaW1kICE9PSB1bmRlZmluZWQgJiYgc2ltZCAhPT0gJ2ZpeGVkJyAmJiBzaW1kICE9PSAncmVsYXhlZCcpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybihcbiAgICAgIGBQcm9wZXJ0eSBcImVudi53YXNtLnNpbWRcIiBpcyBzZXQgdG8gdW5rbm93biB2YWx1ZSBcIiR7c2ltZH1cIi4gUmVzZXQgaXQgdG8gXFxgZmFsc2VcXGAgYW5kIGlnbm9yZSBTSU1EIGZlYXR1cmUgY2hlY2tpbmcuYCxcbiAgICApO1xuICAgIGVudi53YXNtLnNpbWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZW52Lndhc20ucHJveHkgIT09ICdib29sZWFuJykge1xuICAgIGVudi53YXNtLnByb3h5ID0gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGVudi53YXNtLnRyYWNlICE9PSAnYm9vbGVhbicpIHtcbiAgICBlbnYud2FzbS50cmFjZSA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBlbnYud2FzbS5udW1UaHJlYWRzICE9PSAnbnVtYmVyJyB8fCAhTnVtYmVyLmlzSW50ZWdlcihlbnYud2FzbS5udW1UaHJlYWRzKSB8fCBlbnYud2FzbS5udW1UaHJlYWRzIDw9IDApIHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGxvZ2ljIG9ubHkgYXBwbGllcyB3aGVuIGBvcnQuZW52Lndhc20ubnVtVGhyZWFkc2AgaXMgbm90IHNldCBieSB1c2VyLiBXZSB3aWxsIGFsd2F5cyBob25vciB1c2VyJ3NcbiAgICAvLyBzZXR0aW5nIGlmIGl0IGlzIHByb3ZpZGVkLlxuXG4gICAgLy8gQnJvd3Nlcjogd2hlbiBjcm9zc09yaWdpbklzb2xhdGVkIGlzIGZhbHNlLCBTaGFyZWRBcnJheUJ1ZmZlciBpcyBub3QgYXZhaWxhYmxlIHNvIFdlYkFzc2VtYmx5IHRocmVhZHMgd2lsbCBub3RcbiAgICAvLyB3b3JrLiBJbiB0aGlzIGNhc2UsIHdlIHdpbGwgc2V0IG51bVRocmVhZHMgdG8gMS5cbiAgICAvL1xuICAgIC8vIFRoZXJlIGlzIGFuIGV4Y2VwdGlvbjogd2hlbiB0aGUgYnJvd3NlciBpcyBjb25maWd1cmVkIHRvIGZvcmNlLWVuYWJsZSBTaGFyZWRBcnJheUJ1ZmZlciAoZS5nLiBDaHJvbXVpbSB3aXRoXG4gICAgLy8gLS1lbmFibGUtZmVhdHVyZXM9U2hhcmVkQXJyYXlCdWZmZXIpLCBpdCBpcyBwb3NzaWJsZSB0aGF0IGBzZWxmLmNyb3NzT3JpZ2luSXNvbGF0ZWRgIGlzIGZhbHNlIGFuZFxuICAgIC8vIFNoYXJlZEFycmF5QnVmZmVyIGlzIGF2YWlsYWJsZSBhdCB0aGUgc2FtZSB0aW1lLiBUaGlzIGlzIHVzdWFsbHkgZm9yIHRlc3RpbmcuIEluIHRoaXMgY2FzZSwgIHdlIHdpbGwgc3RpbGwgc2V0XG4gICAgLy8gbnVtVGhyZWFkcyB0byAxIGhlcmUuIElmIHdlIHdhbnQgdG8gZW5hYmxlIG11bHRpLXRocmVhZGluZyBpbiB0ZXN0LCB3ZSBzaG91bGQgc2V0IGBvcnQuZW52Lndhc20ubnVtVGhyZWFkc2AgdG8gYVxuICAgIC8vIHZhbHVlIGdyZWF0ZXIgdGhhbiAxLlxuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgIXNlbGYuY3Jvc3NPcmlnaW5Jc29sYXRlZCkge1xuICAgICAgZW52Lndhc20ubnVtVGhyZWFkcyA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG51bUNwdUxvZ2ljYWxDb3JlcyA9XG4gICAgICAgIHR5cGVvZiBuYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnID8gcmVxdWlyZSgnbm9kZTpvcycpLmNwdXMoKS5sZW5ndGggOiBuYXZpZ2F0b3IuaGFyZHdhcmVDb25jdXJyZW5jeTtcbiAgICAgIGVudi53YXNtLm51bVRocmVhZHMgPSBNYXRoLm1pbig0LCBNYXRoLmNlaWwoKG51bUNwdUxvZ2ljYWxDb3JlcyB8fCAxKSAvIDIpKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBPbm54cnVudGltZVdlYkFzc2VtYmx5QmFja2VuZCBpbXBsZW1lbnRzIEJhY2tlbmQge1xuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpbml0aWFsaXplcyB0aGUgV2ViQXNzZW1ibHkgYmFja2VuZC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbmx5IG9uY2UgZm9yIGVhY2ggYmFja2VuZCBuYW1lLiBJdCB3aWxsIGJlIGNhbGxlZCB0aGUgZmlyc3QgdGltZSB3aGVuXG4gICAqIGBvcnQuSW5mZXJlbmNlU2Vzc2lvbi5jcmVhdGUoKWAgaXMgY2FsbGVkIHdpdGggYSByZWdpc3RlcmVkIGJhY2tlbmQgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIGJhY2tlbmROYW1lIC0gdGhlIHJlZ2lzdGVyZWQgYmFja2VuZCBuYW1lLlxuICAgKi9cbiAgYXN5bmMgaW5pdChiYWNrZW5kTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gcG9wdWxhdGUgd2FzbSBmbGFnc1xuICAgIGluaXRpYWxpemVGbGFncygpO1xuXG4gICAgLy8gaW5pdCB3YXNtXG4gICAgYXdhaXQgaW5pdGlhbGl6ZVdlYkFzc2VtYmx5QW5kT3J0UnVudGltZSgpO1xuXG4gICAgLy8gcGVyZm9ybWUgRVAgc3BlY2lmaWMgaW5pdGlhbGl6YXRpb25cbiAgICBhd2FpdCBpbml0aWFsaXplT3J0RXAoYmFja2VuZE5hbWUpO1xuICB9XG4gIGNyZWF0ZUluZmVyZW5jZVNlc3Npb25IYW5kbGVyKFxuICAgIHBhdGg6IHN0cmluZyxcbiAgICBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcj47XG4gIGNyZWF0ZUluZmVyZW5jZVNlc3Npb25IYW5kbGVyKFxuICAgIGJ1ZmZlcjogVWludDhBcnJheSxcbiAgICBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcj47XG4gIGFzeW5jIGNyZWF0ZUluZmVyZW5jZVNlc3Npb25IYW5kbGVyKFxuICAgIHBhdGhPckJ1ZmZlcjogc3RyaW5nIHwgVWludDhBcnJheSxcbiAgICBvcHRpb25zPzogSW5mZXJlbmNlU2Vzc2lvbi5TZXNzaW9uT3B0aW9ucyxcbiAgKTogUHJvbWlzZTxJbmZlcmVuY2VTZXNzaW9uSGFuZGxlcj4ge1xuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgT25ueHJ1bnRpbWVXZWJBc3NlbWJseVNlc3Npb25IYW5kbGVyKCk7XG4gICAgYXdhaXQgaGFuZGxlci5sb2FkTW9kZWwocGF0aE9yQnVmZmVyLCBvcHRpb25zKTtcbiAgICByZXR1cm4gaGFuZGxlcjtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgd2FzbUJhY2tlbmQgPSBuZXcgT25ueHJ1bnRpbWVXZWJBc3NlbWJseUJhY2tlbmQoKTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlcywgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cyAqL1xuXG4vLyBXZSB1c2UgXCJyZXF1aXJlXCIgaW5zdGVhZCBvZiBcImltcG9ydFwiIGhlcmUgYmVjYXVzZSBpbXBvcnQgc3RhdGVtZW50IG11c3QgYmUgcHV0IGluIHRvcCBsZXZlbC4gT3VyIGN1cnJlbnQgY29kZSBkb2VzXG4vLyBub3QgYWxsb3cgYnVuZGxlciB0byB0cmVlLXNoYWtpbmcgY29kZSBhcyBleHBlY3RlZCBiZWNhdXNlIHNvbWUgY29kZXMgYXJlIHRyZWF0ZWQgYXMgaGF2aW5nIHNpZGUgZWZmZWN0cy5cbi8vIFNvIHdlIGltcG9ydCBjb2RlIGluc2lkZSB0aGUgaWYtY2xhdXNlIHRvIGFsbG93IGJ1bmRsZXIgcmVtb3ZlIHRoZSBjb2RlIHNhZmVseS5cblxuZXhwb3J0ICogZnJvbSAnb25ueHJ1bnRpbWUtY29tbW9uJztcbmltcG9ydCAqIGFzIG9ydCBmcm9tICdvbm54cnVudGltZS1jb21tb24nO1xuZXhwb3J0IGRlZmF1bHQgb3J0O1xuXG5pbXBvcnQgeyByZWdpc3RlckJhY2tlbmQsIGVudiB9IGZyb20gJ29ubnhydW50aW1lLWNvbW1vbic7XG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi92ZXJzaW9uJztcblxuaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0VCR0wpIHtcbiAgY29uc3Qgb25ueGpzQmFja2VuZCA9IHJlcXVpcmUoJy4vYmFja2VuZC1vbm54anMnKS5vbm54anNCYWNrZW5kO1xuICByZWdpc3RlckJhY2tlbmQoJ3dlYmdsJywgb25ueGpzQmFja2VuZCwgLTEwKTtcbn1cblxuaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfSlNFUCAmJiAhQlVJTERfREVGUy5ESVNBQkxFX1dFQkdQVSkge1xuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ1RoZSBjdXJyZW50IGJ1aWxkIGlzIHNwZWNpZmllZCB0byBlbmFibGUgYm90aCBKU0VQIGFuZCBXZWJHUFUgRVAuIFRoaXMgaXMgbm90IGEgdmFsaWQgY29uZmlndXJhdGlvbi4gJyArXG4gICAgICAnSlNFUCBhbmQgV2ViR1BVIEVQcyBjYW5ub3QgYmUgZW5hYmxlZCBhdCB0aGUgc2FtZSB0aW1lLicsXG4gICk7XG59XG5cbmlmICghQlVJTERfREVGUy5ESVNBQkxFX1dFQk5OICYmIEJVSUxEX0RFRlMuRElTQUJMRV9KU0VQICYmIEJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdUaGUgY3VycmVudCBidWlsZCBpcyBzcGVjaWZpZWQgdG8gZW5hYmxlIFdlYk5OIEVQIHdpdGhvdXQgSlNFUCBvciBXZWJHUFUgRVAuIFRoaXMgaXMgbm90IGEgdmFsaWQgY29uZmlndXJhdGlvbi4gJyArXG4gICAgICAnV2ViTk4gRVAgcmVxdWlyZXMgZWl0aGVyIEpTRVAgb3IgV2ViR1BVIEVQIHRvIGJlIGVuYWJsZWQuJyxcbiAgKTtcbn1cblxuaWYgKCFCVUlMRF9ERUZTLkRJU0FCTEVfV0FTTSkge1xuICBjb25zdCB3YXNtQmFja2VuZCA9IHJlcXVpcmUoJy4vYmFja2VuZC13YXNtJykud2FzbUJhY2tlbmQ7XG4gIGlmICghQlVJTERfREVGUy5ESVNBQkxFX0pTRVAgfHwgIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJHUFUpIHtcbiAgICByZWdpc3RlckJhY2tlbmQoJ3dlYmdwdScsIHdhc21CYWNrZW5kLCA1KTtcbiAgfVxuICBpZiAoIUJVSUxEX0RFRlMuRElTQUJMRV9XRUJOTikge1xuICAgIHJlZ2lzdGVyQmFja2VuZCgnd2Vibm4nLCB3YXNtQmFja2VuZCwgNSk7XG4gIH1cbiAgcmVnaXN0ZXJCYWNrZW5kKCdjcHUnLCB3YXNtQmFja2VuZCwgMTApO1xuICByZWdpc3RlckJhY2tlbmQoJ3dhc20nLCB3YXNtQmFja2VuZCwgMTApO1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZW52LnZlcnNpb25zLCAnd2ViJywgeyB2YWx1ZTogdmVyc2lvbiwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbiIsICIvLyBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cblxuLy8gVGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBieSAvanMvc2NyaXB0cy91cGRhdGUtdmVyc2lvbi50c1xuLy8gRG8gbm90IG1vZGlmeSBmaWxlIGNvbnRlbnQgbWFudWFsbHkuXG5cbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJzEuMjUuMC1kZXYuMjAyNjAzMjctNzIyNzQzYzBlMic7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQWdCTSxVQUNBLDBCQVlPLGlCQXdDUCxnQ0F3Q087QUE3R2I7OztBQWdCQSxJQUFNLFdBQXFDLG9CQUFJLElBQUc7QUFDbEQsSUFBTSwyQkFBcUMsQ0FBQTtBQVlwQyxJQUFNLGtCQUFrQixDQUFDLE1BQWMsU0FBa0IsYUFBMEI7QUFDeEYsVUFBSSxXQUFXLE9BQU8sUUFBUSxTQUFTLGNBQWMsT0FBTyxRQUFRLGtDQUFrQyxZQUFZO0FBQ2hILGNBQU0saUJBQWlCLFNBQVMsSUFBSSxJQUFJO0FBQ3hDLFlBQUksbUJBQW1CLFFBQVc7QUFDaEMsbUJBQVMsSUFBSSxNQUFNLEVBQUUsU0FBUyxTQUFRLENBQUU7bUJBQy9CLGVBQWUsV0FBVyxVQUFVO0FBRTdDO21CQUNTLGVBQWUsYUFBYSxVQUFVO0FBQy9DLGNBQUksZUFBZSxZQUFZLFNBQVM7QUFDdEMsa0JBQU0sSUFBSSxNQUFNLDRCQUE0QixJQUFJLG9CQUFvQixRQUFRLEVBQUU7OztBQUlsRixZQUFJLFlBQVksR0FBRztBQUNqQixnQkFBTSxJQUFJLHlCQUF5QixRQUFRLElBQUk7QUFDL0MsY0FBSSxNQUFNLElBQUk7QUFDWixxQ0FBeUIsT0FBTyxHQUFHLENBQUM7O0FBR3RDLG1CQUFTQSxLQUFJLEdBQUdBLEtBQUkseUJBQXlCLFFBQVFBLE1BQUs7QUFDeEQsZ0JBQUksU0FBUyxJQUFJLHlCQUF5QkEsRUFBQyxDQUFDLEVBQUcsWUFBWSxVQUFVO0FBQ25FLHVDQUF5QixPQUFPQSxJQUFHLEdBQUcs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bmZlcmVuY2VTZXNzaW9uIiwgIkluZmVyZW5jZVNlc3Npb24iLCAiVGVuc29yIiwgImVudiIsICJlbnYiLCAid2FzbSIsICJ3YXNtIiwgIndhc20iLCAibG9jYXRpb24iLCAidGVuc29yIiwgImVudiIsICJtbENvbnRleHRJbmRleCIsICJ3YXNtIiwgImVudiIsICJ3YXNtIiwgImxvY2F0aW9uIiwgImluZGV4IiwgInRlbnNvciIsICJlcnJvckNvZGUiLCAiaSIsICJpbml0aWFsaXppbmciLCAiaW5pdGlhbGl6ZWQiLCAiYWJvcnRlZCIsICJjb3B5RnJvbUV4dGVybmFsQnVmZmVyIiwgImNyZWF0ZVNlc3Npb24iLCAicmVsZWFzZVNlc3Npb24iLCAicnVuIiwgImVuZFByb2ZpbGluZyIsICJlbnYiLCAiVGVuc29yIiwgImNvcHlGcm9tRXh0ZXJuYWxCdWZmZXIiLCAiY3JlYXRlU2Vzc2lvbiIsICJyZWxlYXNlU2Vzc2lvbiIsICJydW4iLCAiZW5kUHJvZmlsaW5nIiwgImVudiIsICJ2ZXJzaW9uIiwgIndhc21CYWNrZW5kIiwgImVudiIsICJ2ZXJzaW9uIl0KfQo=
