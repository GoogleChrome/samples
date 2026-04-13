/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

// Based on
// https://github.com/firebase/firebase-js-sdk/blob/ce88e71e738ac7bb2cd5d63e4e314e2de82f72ef/packages/webchannel-wrapper/src/index.d.ts.
// WARNING: This is not a complete set of types exported by the bloom blob.
// It is merely meant to support the usage patterns of the Firestore SDK.

// See https://google.github.io/closure-library/api/goog.crypt.Md5.html
export class Md5 {
  reset(): void;
  digest(): number[];
  update(bytes: number[]|Uint8Array|string, opt_length?: number): void;
}

// See https://google.github.io/closure-library/api/goog.math.Integer.html
export class Integer {
  constructor(bits: number[], sign: number);
  add(other: Integer): Integer;
  multiply(other: Integer): Integer;
  modulo(other: Integer): Integer;
  compare(other: Integer): number;
  toNumber(): number;
  toString(opt_radix?: number): string;
  getBits(index: number): number;
  static fromNumber(value: number): Integer;
  static fromString(str: string, opt_radix?: number): Integer;
}
