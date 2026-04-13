"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JXLStream = void 0;
const utils_1 = require("./utils");
const bit_reader_1 = require("../utils/bit-reader");
function calculateImageDimension(reader, isSmallImage) {
    if (isSmallImage) {
        // Small images are multiples of 8 pixels, up to 256 pixels
        return 8 * (1 + reader.getBits(5));
    }
    else {
        // Larger images use a variable bit-length encoding
        const sizeClass = reader.getBits(2);
        const extraBits = [9, 13, 18, 30][sizeClass];
        return 1 + reader.getBits(extraBits);
    }
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
    if (isSmallImage && widthMode === 0) {
        // Small square images
        return 8 * (1 + reader.getBits(5));
    }
    else if (widthMode === 0) {
        // Non-small images with explicitly coded width
        return calculateImageDimension(reader, false);
    }
    else {
        // Images with width derived from height and aspect ratio
        const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
        return Math.floor(height * aspectRatios[widthMode - 1]);
    }
}
exports.JXLStream = {
    validate: (input) => {
        return (0, utils_1.toHexString)(input, 0, 2) === 'ff0a';
    },
    calculate(input) {
        const reader = new bit_reader_1.BitReader(input, 'little-endian');
        const isSmallImage = reader.getBits(1) === 1;
        const height = calculateImageDimension(reader, isSmallImage);
        const widthMode = reader.getBits(3);
        const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
        return { width, height };
    },
};
