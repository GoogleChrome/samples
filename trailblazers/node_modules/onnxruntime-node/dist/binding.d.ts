import { InferenceSession, OnnxValue, TensorConstructor } from 'onnxruntime-common';
type SessionOptions = InferenceSession.SessionOptions;
type FeedsType = {
    [name: string]: OnnxValue;
};
type FetchesType = {
    [name: string]: OnnxValue | null;
};
type ReturnType = {
    [name: string]: OnnxValue;
};
type RunOptions = InferenceSession.RunOptions;
/**
 * Binding exports a simple synchronized inference session object wrap.
 */
export declare namespace Binding {
    interface ValueMetadata {
        name: string;
        isTensor: boolean;
        symbolicDimensions: string[];
        shape: number[];
        type: number;
    }
    interface InferenceSession {
        loadModel(modelPath: string, options: SessionOptions): void;
        loadModel(buffer: ArrayBuffer, byteOffset: number, byteLength: number, options: SessionOptions): void;
        readonly inputMetadata: ValueMetadata[];
        readonly outputMetadata: ValueMetadata[];
        run(feeds: FeedsType, fetches: FetchesType, options: RunOptions): ReturnType;
        endProfiling(): void;
        dispose(): void;
    }
    interface InferenceSessionConstructor {
        new (): InferenceSession;
    }
    interface SupportedBackend {
        name: string;
        bundled: boolean;
    }
}
export declare const binding: {
    InferenceSession: Binding.InferenceSessionConstructor;
    listSupportedBackends: () => Binding.SupportedBackend[];
    initOrtOnce: (logLevel: number, tensorConstructor: TensorConstructor) => void;
};
export declare const initOrt: () => void;
export {};
