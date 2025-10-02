/**
 * Copyright 2025 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

async function getBlobHash(blob) {
  const hashAlgorithmIdentifier = 'SHA-256';

  // Get the contents of the blob as binary data contained in an ArrayBuffer.
  const arrayBuffer = await blob.arrayBuffer();

  // Hash the arrayBuffer using SHA-256.
  const hashBuffer = await crypto.subtle.digest(
    hashAlgorithmIdentifier,
    arrayBuffer,
  );

  // Convert the ArrayBuffer to a hex string.
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return {
    algorithm: hashAlgorithmIdentifier,
    value: hashHex,
  };
}

export { getBlobHash };
