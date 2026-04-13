/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

// Based on
// https://github.com/firebase/firebase-js-sdk/blob/ce88e71e738ac7bb2cd5d63e4e314e2de82f72ef/packages/webchannel-wrapper/src/index.d.ts.
// WARNING: This is not a complete set of types and functions that exist in the
// Closure WebChannel code - it is merely meant to support the usage patterns of
// the Firestore SDK.

export var EventType: {COMPLETE: string;};

export namespace WebChannel {
  export var EventType:
      {OPEN: string; CLOSE: string; ERROR: string; MESSAGE: string;};
}

export var Event: {STAT_EVENT: string;};

export var Stat: {PROXY: number; NOPROXY: number;};

export var ErrorCode: {NO_ERROR: number; HTTP_ERROR: number; TIMEOUT: number;};

export interface Headers {
  [name: string]: string|number;
}

export interface WebChannelError {
  error?: {status: string; message: string};
}

export class XhrIo {
  send(
      url: string, method?: string, body?: string, headers?: Headers,
      timeoutInterval?: number): void;
  getLastErrorCode(): number;
  getLastError(): string;
  getStatus(): number;
  getResponseText(): string;
  getResponseJson(): WebChannelError|object;
  listenOnce(type: string, cb: (param: unknown) => void): void;
  setWithCredentials(withCredentials: boolean): void;
}

export interface WebChannelOptions {
  messageHeaders?: {
    // To ensure compatibility with property minifcation tools, keys need to
    // be listed explicitly.
    [k: string]: never;
  };
  initMessageHeaders?: {
    // To ensure compatibility with property minifcation tools, keys need to
    // be listed explicitly.
    [k: string]: never;
  };
  messageContentType?: string;
  messageUrlParams?: {database?: string;};
  clientProtocolHeaderRequired?: boolean;
  concurrentRequestLimit?: number;
  supportsCrossDomainXhr?: boolean;
  sendRawJson?: boolean;
  httpSessionIdParam?: string;
  encodeInitMessageHeaders?: boolean;
  forceLongPolling?: boolean;
  detectBufferingProxy?: boolean;
  longPollingTimeout?: number;
  fastHandshake?: boolean;
  disableRedac?: boolean;
  clientProfile?: string;
  internalChannelParams?: {forwardChannelRequestTimeoutMs?: number;};
  useFetchStreams?: boolean;
  xmlHttpFactory?: unknown;
  requestRefreshThresholds?: {[key: string]: number};
}

export interface EventTarget {
  listen(type: string|number, cb: (param: unknown) => void): void;
}

export interface WebChannel extends EventTarget {
  open(): void;
  close(): void;
  send(msg: unknown): void;
}

export interface StatEvent {
  stat: number;
}

export interface WebChannelTransport {
  createWebChannel(url: string, options: WebChannelOptions): WebChannel;
}

export function createWebChannelTransport(): WebChannelTransport;

export function getStatEventTarget(): EventTarget;

export class FetchXmlHttpFactory {
  constructor(options: {});
}
