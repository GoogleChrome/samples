function getContentType(headers) {
  if(!headers) {
    return;
  }

  for(let key in headers) {
    if(key.toLowerCase() === "content-type") {
      return headers[key];
    }
  }
}

// Inspired by `resp-modifier` https://github.com/shakyShane/resp-modifier/blob/4a000203c9db630bcfc3b6bb8ea2abc090ae0139/index.js
function wrapResponse(resp, transformHtml) {
  resp._wrappedOriginalWrite = resp.write;
  resp._wrappedOriginalWriteHead = resp.writeHead;
  resp._wrappedOriginalEnd = resp.end;

  resp._wrappedHeaders = [];
  resp._wrappedTransformHtml = transformHtml;
  resp._hasEnded = false;
  resp._shouldForceEnd = false;

  // Compatibility with web standards Response()
  Object.defineProperty(resp, "body", {
    // Returns write cache
    get: function() {
      if(typeof this._writeCache === "string") {
        return this._writeCache;
      }
    },
    // Usage:
    // res.body = ""; // overwrite existing content
    // res.body += ""; // append to existing content, can also res.write("") to append
    set: function(data) {
      if(typeof data === "string") {
        this._writeCache = data;
      }
    }
  });

  // Compatibility with web standards Response()
  Object.defineProperty(resp, "bodyUsed", {
    get: function() {
      return this._hasEnded;
    }
  })

  // Original signature writeHead(statusCode[, statusMessage][, headers])
  resp.writeHead = function(statusCode, ...args) {
    let headers = args[args.length - 1];
    // statusMessage is a string
    if(typeof headers !== "string") {
      this._contentType = getContentType(headers);
    }

    if((this._contentType || "").startsWith("text/html")) {
      this._wrappedHeaders.push([statusCode, ...args]);
    } else {
      return this._wrappedOriginalWriteHead(statusCode, ...args);
    }
    return this;
  }

  // data can be a String or Buffer
  resp.write = function(data, ...args) {
    if(typeof data === "string") {
      if(!this._writeCache) {
        this._writeCache = "";
      }

      // TODO encoding and callback args
      this._writeCache += data;
    } else {
      // Buffers
      return this._wrappedOriginalWrite(data, ...args);
    }
    return this;
  }

  // data can be a String or Buffer
  resp.end = function(data, encoding, callback) {
    resp._hasEnded = true;

    if(typeof this._writeCache === "string" || typeof data === "string") {
      // Strings
      if(!this._writeCache) {
        this._writeCache = "";
      }
      if(typeof data === "string") {
        this._writeCache += data;
      }

      let result = this._writeCache;

      // Only transform HTML
      // Note the “setHeader versus writeHead” note on https://nodejs.org/api/http.html#responsewriteheadstatuscode-statusmessage-headers
      let contentType = this._contentType || getContentType(this.getHeaders());
      if(contentType?.startsWith("text/html")) {
        if(this._wrappedTransformHtml && typeof this._wrappedTransformHtml === "function") {
          result = this._wrappedTransformHtml(result);
          // uncompressed size: https://github.com/w3c/ServiceWorker/issues/339
          this.setHeader("Content-Length", Buffer.byteLength(result));
        }
      }

      for(let headers of this._wrappedHeaders) {
        this._wrappedOriginalWriteHead(...headers);
      }

      this._writeCache = [];
      this._wrappedOriginalWrite(result, encoding)
      return this._wrappedOriginalEnd(callback);
    } else {
      // Buffer or Uint8Array
      for(let headers of this._wrappedHeaders) {
        this._wrappedOriginalWriteHead(...headers);
      }

      if(data) {
        this._wrappedOriginalWrite(data, encoding);
      }
      return this._wrappedOriginalEnd(callback);
    }
  }

  return resp;
}

module.exports = wrapResponse;