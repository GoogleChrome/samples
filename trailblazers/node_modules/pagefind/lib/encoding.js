/**
 *
 * @param {string} b64
 * @returns {Uint8Array}
 */
export const decode = (b64) => {
  let binString;
  if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
    return Buffer.from(b64, "base64");
  } else if (
    typeof window !== "undefined" &&
    typeof window.atob === "function"
  ) {
    binString = window.atob(b64);
  } else if (typeof atob === "function") {
    binString = atob(b64);
  } else {
    throw new Error("Unable to decode base64 data");
  }

  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
};
