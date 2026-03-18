/**
 * Converts a string to a base64-encoded string.
 * @param {string} str - The string to encode.
 * @return {string} The base64-encoded string.
 */
export function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Decodes a base64-encoded string.
 * @param {string} base64 - The base64-encoded string.
 * @return {string} The decoded string.
 */
export function fromBase64(base64) {
  return decodeURIComponent(escape(atob(base64.replace(/\s/g, ''))));
}

/**
 * Converts a buffer to a base64-encoded string.
 * @param {ArrayBuffer} buffer - The buffer to encode.
 * @return {Promise<string>} A promise that resolves to the base64 string.
 */
export async function bufferToBase64(buffer) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(new Blob([buffer]));
  });
}

/**
 * Converts a base64-encoded string to an ArrayBuffer.
 * @param {string} base64 - The base64-encoded string.
 * @return {ArrayBuffer} The decoded buffer.
 */
export function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
