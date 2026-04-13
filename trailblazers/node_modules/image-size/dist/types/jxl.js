"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JXL = void 0;
const utils_1 = require("./utils");
const jxl_stream_1 = require("./jxl-stream");
/** Extracts the codestream from a containerized JPEG XL image */
function extractCodestream(input) {
    const jxlcBox = (0, utils_1.findBox)(input, 'jxlc', 0);
    if (jxlcBox) {
        return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
    }
    const partialStreams = extractPartialStreams(input);
    if (partialStreams.length > 0) {
        return concatenateCodestreams(partialStreams);
    }
    return undefined;
}
/** Extracts partial codestreams from jxlp boxes */
function extractPartialStreams(input) {
    const partialStreams = [];
    let offset = 0;
    while (offset < input.length) {
        const jxlpBox = (0, utils_1.findBox)(input, 'jxlp', offset);
        if (!jxlpBox)
            break;
        partialStreams.push(input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size));
        offset = jxlpBox.offset + jxlpBox.size;
    }
    return partialStreams;
}
/** Concatenates partial codestreams into a single codestream */
function concatenateCodestreams(partialCodestreams) {
    const totalLength = partialCodestreams.reduce((acc, curr) => acc + curr.length, 0);
    const codestream = new Uint8Array(totalLength);
    let position = 0;
    for (const partial of partialCodestreams) {
        codestream.set(partial, position);
        position += partial.length;
    }
    return codestream;
}
exports.JXL = {
    validate: (input) => {
        const boxType = (0, utils_1.toUTF8String)(input, 4, 8);
        if (boxType !== 'JXL ')
            return false;
        const ftypBox = (0, utils_1.findBox)(input, 'ftyp', 0);
        if (!ftypBox)
            return false;
        const brand = (0, utils_1.toUTF8String)(input, ftypBox.offset + 8, ftypBox.offset + 12);
        return brand === 'jxl ';
    },
    calculate(input) {
        const codestream = extractCodestream(input);
        if (codestream)
            return jxl_stream_1.JXLStream.calculate(codestream);
        throw new Error('No codestream found in JXL container');
    },
};
