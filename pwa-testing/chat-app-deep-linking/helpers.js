/**
 * @fileoverview Description of this file.
 */

export function getCssColorFromHex(clientId) {
  const h = parseInt(clientId.substring(0, 2), 16) / 255;
  const s = parseInt(clientId.substring(2, 4), 16) / 255;
  let l = parseInt(clientId.substring(4, 6), 16) / 255;
  l = Math.max(l, 0.75);
  return `hsl(${h * 360} ${s * 100} ${l * 100})`;
}

export function removeOrigin(url) {
  const origin = window.location.origin;
  return url.href.replace(origin, '');
}