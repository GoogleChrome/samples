"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEIF = void 0;
const utils_1 = require("./utils");
const brandMap = {
    avif: 'avif',
    mif1: 'heif',
    msf1: 'heif', // heif-sequence
    heic: 'heic',
    heix: 'heic',
    hevc: 'heic', // heic-sequence
    hevx: 'heic', // heic-sequence
};
exports.HEIF = {
    validate(input) {
        const boxType = (0, utils_1.toUTF8String)(input, 4, 8);
        if (boxType !== 'ftyp')
            return false;
        const ftypBox = (0, utils_1.findBox)(input, 'ftyp', 0);
        if (!ftypBox)
            return false;
        const brand = (0, utils_1.toUTF8String)(input, ftypBox.offset + 8, ftypBox.offset + 12);
        return brand in brandMap;
    },
    calculate(input) {
        // Based on https://nokiatech.github.io/heif/technical.html
        const metaBox = (0, utils_1.findBox)(input, 'meta', 0);
        const iprpBox = metaBox && (0, utils_1.findBox)(input, 'iprp', metaBox.offset + 12);
        const ipcoBox = iprpBox && (0, utils_1.findBox)(input, 'ipco', iprpBox.offset + 8);
        const ispeBox = ipcoBox && (0, utils_1.findBox)(input, 'ispe', ipcoBox.offset + 8);
        if (ispeBox) {
            return {
                height: (0, utils_1.readUInt32BE)(input, ispeBox.offset + 16),
                width: (0, utils_1.readUInt32BE)(input, ispeBox.offset + 12),
                type: (0, utils_1.toUTF8String)(input, 8, 12),
            };
        }
        throw new TypeError('Invalid HEIF, no size found');
    },
};
