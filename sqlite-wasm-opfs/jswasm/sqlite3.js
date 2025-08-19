/*
** LICENSE for the sqlite3 WebAssembly/JavaScript APIs.
**
** This bundle (typically released as sqlite3.js or sqlite3-wasmfs.js)
** is an amalgamation of JavaScript source code from two projects:
**
** 1) https://emscripten.org: the Emscripten "glue code" is covered by
**    the terms of the MIT license and University of Illinois/NCSA
**    Open Source License, as described at:
**
**    https://emscripten.org/docs/introducing_emscripten/emscripten_license.html
**
** 2) https://sqlite.org: all code and documentation labeled as being
**    from this source are released under the same terms as the sqlite3
**    C library:
**
** 2022-10-16
**
** The author disclaims copyright to this source code.  In place of a
** legal notice, here is a blessing:
**
** *   May you do good and not evil.
** *   May you find forgiveness for yourself and forgive others.
** *   May you share freely, never taking more than you give.
*/
/*
** This code was built from sqlite3 version...
** 
*/

var sqlite3InitModule = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(sqlite3InitModule) {
  sqlite3InitModule = sqlite3InitModule || {};



"use strict";














var Module = typeof sqlite3InitModule != 'undefined' ? sqlite3InitModule : {};


var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise(function(resolve, reject) {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});






const sqlite3InitModuleState = self.sqlite3InitModuleState || Object.create(null);
delete self.sqlite3InitModuleState;


Module['locateFile'] = function(path, prefix) {
  let theFile;
  const up = this.urlParams;
  if(0){
    console.warn("locateFile(",arguments[0], ',', arguments[1],")",
                 'self.location =',self.location,
                 'sqlite3InitModuleState.scriptDir =',this.scriptDir,
                 'up.entries() =',Array.from(up.entries()));
  }
  if(up.has(path)){
    theFile = up.get(path);
  }else if(this.sqlite3Dir){
    theFile = this.sqlite3Dir + path;
  }else if(this.scriptDir){
    theFile = this.scriptDir + path;
  }else{
    theFile = prefix + path;
  }
  return theFile;
}.bind(sqlite3InitModuleState);


const xInstantiateWasm = 1
      ? 'emscripten-bug-17951'
      : 'instantiateWasm';
Module[xInstantiateWasm] = function callee(imports,onSuccess){
  imports.env.foo = function(){};
  console.warn("instantiateWasm() uri =",callee.uri, self.location.href);
  const wfetch = ()=>fetch(callee.uri, {credentials: 'same-origin'});
  const loadWasm = WebAssembly.instantiateStreaming
        ? async ()=>{
          return WebAssembly.instantiateStreaming(wfetch(), imports)
            .then((arg)=>onSuccess(arg.instance, arg.module));
        }
        : async ()=>{ 
          return wfetch()
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports))
            .then((arg)=>onSuccess(arg.instance, arg.module));
        };
  loadWasm();
  return {};
};

Module[xInstantiateWasm].uri = 'sqlite3.wasm';

Module[xInstantiateWasm].uri = 'sqlite3.wasm';







var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};





var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';


var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;


var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}


var read_,
    readAsync,
    readBinary,
    setWindowTitle;




if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { 
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { 
    scriptDirectory = document.currentScript.src;
  }
  
  
  if (_scriptDir) {
    scriptDirectory = _scriptDir;
  }
  
  
  
  
  
  
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  
  
  {



  read_ = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array((xhr.response));
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { 
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }


  }

  setWindowTitle = (title) => document.title = title;
} else
{
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);


Object.assign(Module, moduleOverrides);


moduleOverrides = null;






if (Module['arguments']) arguments_ = Module['arguments'];

if (Module['thisProgram']) thisProgram = Module['thisProgram'];

if (Module['quit']) quit_ = Module['quit'];






var STACK_ALIGN = 16;
var POINTER_SIZE = 4;

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': case 'u8': return 1;
    case 'i16': case 'u16': return 2;
    case 'i32': case 'u32': return 4;
    case 'i64': case 'u64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length - 1] === '*') {
        return POINTER_SIZE;
      }
      if (type[0] === 'i') {
        const bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      }
      return 0;
    }
  }
}





var tempRet0 = 0;
var setTempRet0 = (value) => { tempRet0 = value; };
var getTempRet0 = () => tempRet0;













var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
var noExitRuntime = Module['noExitRuntime'] || true;

if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}



var wasmMemory;







var ABORT = false;




var EXITSTATUS;


function assert(condition, text) {
  if (!condition) {
    
    
    
    abort(text);
  }
}






var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;




function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  
  
  
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = '';
  
  while (idx < endPtr) {
    
    
    
    
    var u0 = heapOrArray[idx++];
    if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 0xF0) == 0xE0) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }

    if (u0 < 0x10000) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    }
  }
  return str;
}












function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}














function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) 
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; 
  for (var i = 0; i < str.length; ++i) {
    
    
    
    var u = str.charCodeAt(i); 
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  
  heap[outIdx] = 0;
  return outIdx - startIdx;
}






function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}


function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    
    
    var c = str.charCodeAt(i); 
    if (c <= 0x7F) {
      len++;
    } else if (c <= 0x7FF) {
      len += 2;
    } else if (c >= 0xD800 && c <= 0xDFFF) {
      len += 4; ++i;
    } else {
      len += 3;
    }
  }
  return len;
}




var HEAP,

  buffer,

  HEAP8,

  HEAPU8,

  HEAP16,

  HEAPU16,

  HEAP32,

  HEAPU32,

  HEAPF32,

  HEAP64,

  HEAPU64,

  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
  Module['HEAP64'] = HEAP64 = new BigInt64Array(buf);
  Module['HEAPU64'] = HEAPU64 = new BigUint64Array(buf);
}

var TOTAL_STACK = 5242880;

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 13107200;







  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_MEMORY / 65536,
      
      
      
      
      
      'maximum': 2147483648 / 65536
    });
  }

if (wasmMemory) {
  buffer = wasmMemory.buffer;
}



INITIAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);







var wasmTable;










var __ATPRERUN__  = []; 
var __ATINIT__    = []; 
var __ATEXIT__    = []; 
var __ATPOSTRUN__ = []; 

var runtimeInitialized = false;

function keepRuntimeAlive() {
  return noExitRuntime;
}

function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  runtimeInitialized = true;

  
if (!Module["noFSInit"] && !FS.init.initialized)
  FS.init();
FS.ignorePermissions = false;

TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function postRun() {

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}




















var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; 

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); 
    }
  }
}


function abort(what) {
  {
    if (Module['onAbort']) {
      Module['onAbort'](what);
    }
  }

  what = 'Aborted(' + what + ')';
  
  
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  what += '. Build with -sASSERTIONS for more info.';

  
  
  
  
  
  
  
  

  
  
  
  
  
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  
  
  
  throw e;
}











var dataURIPrefix = 'data:application/octet-stream;base64,';


function isDataURI(filename) {
  
  return filename.startsWith(dataURIPrefix);
}


function isFileURI(filename) {
  return filename.startsWith('file://');
}


var wasmBinaryFile;
  wasmBinaryFile = 'sqlite3.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  
  
  
  
  
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
    ) {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
          return getBinary(wasmBinaryFile);
      });
    }
  }

  
  return Promise.resolve().then(function() { return getBinary(wasmBinaryFile); });
}



function createWasm() {
  
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
  };
  
  
  
  
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module['asm'] = exports;

    wasmTable = Module['asm']['__indirect_function_table'];

    addOnInit(Module['asm']['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');

  }
  
  addRunDependency('wasm-instantiate');

  
  function receiveInstantiationResult(result) {
    
    
    
    
    receiveInstance(result['instance']);
  }

  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(function (instance) {
      return instance;
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);

      abort(reason);
    });
  }

  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming == 'function' &&
        !isDataURI(wasmBinaryFile) &&
        typeof fetch == 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        
        
        
        
        
        var result = WebAssembly.instantiateStreaming(response, info);

        return result.then(
          receiveInstantiationResult,
          function(reason) {
            
            
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(receiveInstantiationResult);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiationResult);
    }
  }

  
  
  
  
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  
  instantiateAsync().catch(readyPromiseReject);
  return {}; 
}


var tempDouble;
var tempI64;



var ASM_CONSTS = {
  
};






  
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = 'Program terminated with exit(' + status + ')';
      this.status = status;
    }

  function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        
        callbacks.shift()(Module);
      }
    }

  function withStackSave(f) {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    }
  function demangle(func) {
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  
    
  function getValue(ptr, type = 'i8') {
      if (type.endsWith('*')) type = '*';
      switch (type) {
        case 'i1': return HEAP8[((ptr)>>0)];
        case 'i8': return HEAP8[((ptr)>>0)];
        case 'i16': return HEAP16[((ptr)>>1)];
        case 'i32': return HEAP32[((ptr)>>2)];
        case 'i64': return HEAP64[((ptr)>>3)];
        case 'float': return HEAPF32[((ptr)>>2)];
        case 'double': return HEAPF64[((ptr)>>3)];
        case '*': return HEAPU32[((ptr)>>2)];
        default: abort('invalid type for getValue: ' + type);
      }
      return null;
    }

  function handleException(e) {
      
      
      
      
      
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    }

  function jsStackTrace() {
      var error = new Error();
      if (!error.stack) {
        
        
        try {
          throw new Error();
        } catch(e) {
          error = e;
        }
        if (!error.stack) {
          return '(no stack trace available)';
        }
      }
      return error.stack.toString();
    }

  
    
  function setValue(ptr, value, type = 'i8') {
      if (type.endsWith('*')) type = '*';
      switch (type) {
        case 'i1': HEAP8[((ptr)>>0)] = value; break;
        case 'i8': HEAP8[((ptr)>>0)] = value; break;
        case 'i16': HEAP16[((ptr)>>1)] = value; break;
        case 'i32': HEAP32[((ptr)>>2)] = value; break;
        case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
        case 'float': HEAPF32[((ptr)>>2)] = value; break;
        case 'double': HEAPF64[((ptr)>>3)] = value; break;
        case '*': HEAPU32[((ptr)>>2)] = value; break;
        default: abort('invalid type for setValue: ' + type);
      }
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function writeArrayToMemory(array, buffer) {
      HEAP8.set(array, buffer);
    }

  var PATH = {isAbs:(path) => path.charAt(0) === '/',splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:(parts, allowAboveRoot) => {
        
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === '/';
        
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          
          return '.';
        }
        if (dir) {
          
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:(path) => {
        
        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },join:function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:(l, r) => {
        return PATH.normalize(l + '/' + r);
      }};
  
  function getRandomDevice() {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        
        var randomBuffer = new Uint8Array(1);
        return () => { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
      } else
      
      return () => abort("randomDevice");
    }
  
  var PATH_FS = {resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          
          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; 
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        
        
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:(from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  var TTY = {ttys:[],init:function () {
        
        
        
        
        
        
        
        
      },shutdown:function() {
        
        
        
        
        
        
        
        
        
      },register:function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function(stream) {
          
          stream.tty.ops.flush(stream.tty);
        },flush:function(stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function(stream, buffer, offset, length, pos ) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              
              result = window.prompt('Input: ');  
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); 
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  function zeroMemory(address, size) {
      HEAPU8.fill(0, address, address + size);
    }
  
  function alignMemory(size, alignment) {
      return Math.ceil(size / alignment) * alignment;
    }
  function mmapAlloc(size) {
      abort();
    }
  var MEMFS = {ops_table:null,mount:function(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 , 0);
      },createNode:function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; 
          
          
          
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },getFileDataAsTypedArray:function(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); 
        return new Uint8Array(node.contents);
      },expandFileStorage:function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; 
        
        
        
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); 
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); 
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); 
      },resizeFileStorage:function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; 
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); 
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); 
          }
          node.usedBytes = newSize;
        }
      },node_ops:{getattr:function(node) {
          var attr = {};
          
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          
          
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function(parent, name) {
          throw FS.genericErrors[44];
        },mknod:function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function(old_node, new_dir, new_name) {
          
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now()
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        },unlink:function(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },rmdir:function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },readdir:function(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511  | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }},stream_ops:{read:function(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) { 
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function(stream, buffer, offset, length, position, canOwn) {
          
          
          
          
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { 
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { 
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { 
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; 
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },llseek:function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },allocate:function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          
          if (!(flags & 2) && contents.buffer === buffer) {
            
            
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (mmapFlags & 2) {
            
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          
          return 0;
        }}};
  
  
  function asyncLoad(url, onload, onerror, noRunDep) {
      var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
      readAsync(url, (arrayBuffer) => {
        assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep);
      }, (event) => {
        if (onerror) {
          onerror();
        } else {
          throw 'Loading data file "' + url + '" failed.';
        }
      });
      if (dep) addRunDependency(dep);
    }
  var FS = {root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(path, opts = {}) => {
        path = PATH_FS.resolve(FS.cwd(), path);
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        opts = Object.assign(defaults, opts)
  
        if (opts.recurse_count > 8) {  
          throw new FS.ErrnoError(32);
        }
  
        
        var parts = PATH.normalizeArray(path.split('/').filter((p) => !!p), false);
  
        
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          
          
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;
  
              if (count++ > 40) {  
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:(node) => {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:(parentid, name) => {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:(node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:(node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:(parent, name) => {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        
        return FS.lookup(parent, name);
      },createNode:(parent, name, mode, rdev) => {
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:(node) => {
        FS.hashRemoveNode(node);
      },isRoot:(node) => {
        return node === node.parent;
      },isMountpoint:(node) => {
        return !!node.mounted;
      },isFile:(mode) => {
        return (mode & 61440) === 32768;
      },isDir:(mode) => {
        return (mode & 61440) === 16384;
      },isLink:(mode) => {
        return (mode & 61440) === 40960;
      },isChrdev:(mode) => {
        return (mode & 61440) === 8192;
      },isBlkdev:(mode) => {
        return (mode & 61440) === 24576;
      },isFIFO:(mode) => {
        return (mode & 61440) === 4096;
      },isSocket:(mode) => {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"r+":2,"w":577,"w+":578,"a":1089,"a+":1090},modeStringToFlags:(str) => {
        var flags = FS.flagModes[str];
        if (typeof flags == 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:(flag) => {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:(node, perms) => {
        if (FS.ignorePermissions) {
          return 0;
        }
        
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },mayLookup:(dir) => {
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },mayCreate:(dir, name) => {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:(dir, name, isdir) => {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },mayOpen:(node, flags) => {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || 
              (flags & 512)) { 
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:(fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },getStream:(fd) => FS.streams[fd],createStream:(stream, fd_start, fd_end) => {
        if (!FS.FSStream) {
          FS.FSStream =  function() {
            this.shared = { };
          };
          FS.FSStream.prototype = {};
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              
              get: function() { return this.node; },
              
              set: function(val) { this.node = val; }
            },
            isRead: {
              
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              
              get: function() { return (this.flags & 1024); }
            },
            flags: {
              
              get: function() { return this.shared.flags; },
              
              set: function(val) { this.shared.flags = val; },
            },
            position : {
              
              get: function() { return this.shared.position; },
              
              set: function(val) { this.shared.position = val; },
            },
          });
        }
        
        stream = Object.assign(new FS.FSStream(), stream);
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:(fd) => {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:(stream) => {
          var device = FS.getDevice(stream.node.rdev);
          
          stream.stream_ops = device.stream_ops;
          
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:() => {
          throw new FS.ErrnoError(70);
        }},major:(dev) => ((dev) >> 8),minor:(dev) => ((dev) & 0xff),makedev:(ma, mi) => ((ma) << 8 | (mi)),registerDevice:(dev, ops) => {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:(dev) => FS.devices[dev],getMounts:(mount) => {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:(populate, callback) => {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:(type, opts, mountpoint) => {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          
          node.mounted = mount;
  
          
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:(mountpoint) => {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        
        node.mounted = null;
  
        
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      },lookup:(parent, name) => {
        return parent.node_ops.lookup(parent, name);
      },mknod:(path, mode, dev) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:(path, mode) => {
        mode = mode !== undefined ? mode : 438 ;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:(path, mode) => {
        mode = mode !== undefined ? mode : 511 ;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:(path, mode) => {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },mkdev:(path, mode, dev) => {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438 ;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:(oldpath, newpath) => {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:(old_path, new_path) => {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        
        var lookup, old_dir, new_dir;
  
        
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        
        var old_node = FS.lookupNode(old_dir, old_name);
        
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          
        }
        
        if (old_node === new_node) {
          return;
        }
        
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        
        
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        
        FS.hashRemoveNode(old_node);
        
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          
          
          FS.hashAddNode(old_node);
        }
      },rmdir:(path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:(path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },unlink:(path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          
          
          
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:(path) => {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:(path, dontFollow) => {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },lstat:(path) => {
        return FS.stat(path, true);
      },chmod:(path, mode, dontFollow) => {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:(path, mode) => {
        FS.chmod(path, mode, true);
      },fchmod:(fd, mode) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
      },chown:(path, uid, gid, dontFollow) => {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          
        });
      },lchown:(path, uid, gid) => {
        FS.chown(path, uid, gid, true);
      },fchown:(fd, uid, gid) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:(path, len) => {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:(fd, len) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },utime:(path, atime, mtime) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:(path, flags, mode) => {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode == 'undefined' ? 438  : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            
          }
        }
        
        var created = false;
        if ((flags & 64)) {
          if (node) {
            
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        
        
        
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        
        flags &= ~(128 | 512 | 131072);
  
        
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          
          ungotten: [],
          error: false
        });
        
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },close:(stream) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; 
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },isClosed:(stream) => {
        return stream.fd === null;
      },llseek:(stream, offset, whence) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:(stream, buffer, offset, length, position) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:(stream, buffer, offset, length, position, canOwn) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:(stream, offset, length) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:(stream, length, position, prot, flags) => {
        
        
        
        
        
        
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },msync:(stream, buffer, offset, length, mmapFlags) => {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:(stream) => 0,ioctl:(stream, cmd, arg) => {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:(path, opts = {}) => {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:(path, data, opts = {}) => {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },cwd:() => FS.currentPath,chdir:(path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:() => {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:() => {
        
        FS.mkdir('/dev');
        
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        
        
        
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        
        var random_device = getRandomDevice();
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        
        
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:() => {
        
        
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: () => {
            var node = FS.createNode(proc_self, 'fd', 16384 | 511 , 73);
            node.node_ops = {
              lookup: (parent, name) => {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                };
                ret.parent = ret; 
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:() => {
        
        
        
  
        
        
        
        
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
      },ensureErrnoError:() => {
        if (FS.ErrnoError) return;
        FS.ErrnoError =  function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno =  function(errno) {
            this.errno = errno;
          };
          this.setErrno(errno);
          this.message = 'FS error';
  
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:() => {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },init:(input, output, error) => {
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:() => {
        FS.init.initialized = false;
        
        
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:(canRead, canWrite) => {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },findObject:(path, dontResolveLastLink) => {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },analyzePath:(path, dontResolveLastLink) => {
        
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createPath:(parent, path, canRead, canWrite) => {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            
          }
          parent = current;
        }
        return current;
      },createFile:(parent, name, properties, canRead, canWrite) => {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:(parent, name, data, canRead, canWrite, canOwn) => {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:(parent, name, input, output) => {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        
        
        FS.registerDevice(dev, {
          open: (stream) => {
            stream.seekable = false;
          },
          close: (stream) => {
            
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: (stream, buffer, offset, length, pos ) => {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: (stream, buffer, offset, length, pos) => {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },forceLoadFile:(obj) => {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          
          try {
            
            
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
      },createLazyFile:(parent, name, url, canRead, canWrite) => {
        
        
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; 
        }
        LazyUint8Array.prototype.get =  function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; 
  
          if (!hasByteServing) chunkSize = datalength;
  
          
          var doXHR = (from, to) => {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            
            xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array((xhr.response || []));
            }
            return intArrayFromString(xhr.responseText || '', true);
          };
          var lazyArray = this;
          lazyArray.setDataGetter((chunkNum) => {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; 
            end = Math.min(end, datalength-1); 
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            
            chunkSize = datalength = 1; 
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get:  function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get:  function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        
        
        
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        
        Object.defineProperties(node, {
          usedBytes: {
            get:  function() { return this.contents.length; }
          }
        });
        
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) { 
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { 
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr: ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
        
        
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); 
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
            if (onerror) onerror();
            removeRunDependency(dep);
          })) {
            return;
          }
          finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          asyncLoad(url, (byteArray) => processData(byteArray), onerror);
        } else {
          processData(url);
        }
      },indexedDB:() => {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:() => {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:(paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = () => {
          out('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = () => {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach((path) => {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = () => { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = () => { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:(paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; 
        openRequest.onsuccess = () => {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach((path) => {
            var getRequest = files.get(path);
            getRequest.onsuccess = () => {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = () => { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  var SYSCALLS = {DEFAULT_POLLMASK:5,calculateAt:function(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = FS.getStream(dirfd);
          if (!dirstream) throw new FS.ErrnoError(8);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },doStat:function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            
            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)] = stat.dev;
        HEAP32[(((buf)+(8))>>2)] = stat.ino;
        HEAP32[(((buf)+(12))>>2)] = stat.mode;
        HEAP32[(((buf)+(16))>>2)] = stat.nlink;
        HEAP32[(((buf)+(20))>>2)] = stat.uid;
        HEAP32[(((buf)+(24))>>2)] = stat.gid;
        HEAP32[(((buf)+(28))>>2)] = stat.rdev;
        HEAP64[(((buf)+(40))>>3)] = BigInt(stat.size);
        HEAP32[(((buf)+(48))>>2)] = 4096;
        HEAP32[(((buf)+(52))>>2)] = stat.blocks;
        HEAP64[(((buf)+(56))>>3)] = BigInt(Math.floor(stat.atime.getTime() / 1000));
        HEAP32[(((buf)+(64))>>2)] = 0;
        HEAP64[(((buf)+(72))>>3)] = BigInt(Math.floor(stat.mtime.getTime() / 1000));
        HEAP32[(((buf)+(80))>>2)] = 0;
        HEAP64[(((buf)+(88))>>3)] = BigInt(Math.floor(stat.ctime.getTime() / 1000));
        HEAP32[(((buf)+(96))>>2)] = 0;
        HEAP64[(((buf)+(104))>>3)] = BigInt(stat.ino);
        return 0;
      },doMsync:function(addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },varargs:undefined,get:function() {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },getStreamFromFD:function(fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      }};
  function ___syscall_chmod(path, mode) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.chmod(path, mode);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_faccessat(dirfd, path, amode, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (amode & ~7) {
        
        return -28;
      }
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      if (!node) {
        return -44;
      }
      var perms = '';
      if (amode & 4) perms += 'r';
      if (amode & 2) perms += 'w';
      if (amode & 1) perms += 'x';
      if (perms  && FS.nodePermissions(node, perms)) {
        return -2;
      }
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchmod(fd, mode) {
  try {
  
      FS.fchmod(fd, mode);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fchown32(fd, owner, group) {
  try {
  
      FS.fchown(fd, owner, group);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function setErrNo(value) {
      HEAP32[((___errno_location())>>2)] = value;
      return value;
    }
  function ___syscall_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          var newStream;
          newStream = FS.createStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 5:
         {
          
          var arg = SYSCALLS.get();
          var offset = 0;
          
          HEAP16[(((arg)+(offset))>>1)] = 2;
          return 0;
        }
        case 6:
        case 7:
        
        
          
          
          return 0; 
        case 16:
        case 8:
          return -28; 
        case 9:
          
          setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fstat64(fd, buf) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  var MAX_INT53 = 9007199254740992;
  
  var MIN_INT53 = -9007199254740992;
  function bigintToI53Checked(num) {
      return (num < MIN_INT53 || num > MAX_INT53) ? NaN : Number(num);
    }
  function ___syscall_ftruncate64(fd,  length) {
  try {
  
      length = bigintToI53Checked(length); if (isNaN(length)) return -61;
      FS.ftruncate(fd, length);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_getcwd(buf, size) {
  try {
  
      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
      if (size < cwdLengthInBytes) return -68;
      stringToUTF8(cwd, buf, size);
      return cwdLengthInBytes;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          return 0; 
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; 
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          
          
          if (!stream.tty) return -59;
          return 0;
        }
        case 21524: {
          
          
          
          if (!stream.tty) return -59;
          return 0;
        }
        default: return -28; 
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_lstat64(path, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_mkdirat(dirfd, path, mode) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      
      
      path = PATH.normalize(path);
      if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
      FS.mkdir(path, mode, 0);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_newfstatat(dirfd, path, buf, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      var nofollow = flags & 256;
      var allowEmpty = flags & 4096;
      flags = flags & (~4352);
      path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
      return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? SYSCALLS.get() : 0;
      return FS.open(path, flags, mode).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);
  
      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf+len];
      stringToUTF8(ret, buf, bufsize+1);
      
      
      HEAP8[buf+len] = endChar;
      return len;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_rmdir(path) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_stat64(path, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_unlinkat(dirfd, path, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (flags === 0) {
        FS.unlink(path);
      } else if (flags === 512) {
        FS.rmdir(path);
      } else {
        abort('Invalid flags passed to unlinkat');
      }
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function readI53FromI64(ptr) {
      return HEAPU32[ptr>>2] + HEAP32[ptr+4>>2] * 4294967296;
    }
  function ___syscall_utimensat(dirfd, path, times, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path, true);
      if (!times) {
        var atime = Date.now();
        var mtime = atime;
      } else {
        var seconds = readI53FromI64(times);
        var nanoseconds = HEAP32[(((times)+(8))>>2)];
        atime = (seconds*1000) + (nanoseconds/(1000*1000));
        times += 16;
        seconds = readI53FromI64(times);
        nanoseconds = HEAP32[(((times)+(8))>>2)];
        mtime = (seconds*1000) + (nanoseconds/(1000*1000));
      }
      FS.utime(path, atime, mtime);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function __emscripten_date_now() {
      return Date.now();
    }

  function __localtime_js(time, tmPtr) {
      var date = new Date(readI53FromI64(time)*1000);
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
  
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      HEAP32[(((tmPtr)+(36))>>2)] = -(date.getTimezoneOffset() * 60);
  
      
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)] = dst;
    }

  function allocateUTF8(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }
  function _tzset_impl(timezone, daylight, tzname) {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      
      
      
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      
      
      
      
      
      HEAP32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocateUTF8(winterName);
      var summerNamePtr = allocateUTF8(summerName);
      if (summerOffset < winterOffset) {
        
        HEAPU32[((tzname)>>2)] = winterNamePtr;
        HEAPU32[(((tzname)+(4))>>2)] = summerNamePtr;
      } else {
        HEAPU32[((tzname)>>2)] = summerNamePtr;
        HEAPU32[(((tzname)+(4))>>2)] = winterNamePtr;
      }
    }
  function __tzset_js(timezone, daylight, tzname) {
      
      if (__tzset_js.called) return;
      __tzset_js.called = true;
      _tzset_impl(timezone, daylight, tzname);
    }

  function _emscripten_console_warn(str) {
      console.warn(UTF8ToString(str));
    }

  var _emscripten_get_now;_emscripten_get_now = () => performance.now();
  ;

  function getHeapMax() {
      
      
      
      
      return 2147483648;
    }
  
  function emscripten_realloc_buffer(size) {
      try {
        
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16); 
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1 ;
      } catch(e) {
      }
      
      
    }
  function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      
      
  
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
  
      
      
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
  
      let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
  
      
      
      
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); 
        
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
  
          return true;
        }
      }
      return false;
    }

  var ENV = {};
  
  function getExecutableName() {
      return thisProgram || './this.program';
    }
  function getEnvStrings() {
      if (!getEnvStrings.strings) {
        
        
        var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        
        for (var x in ENV) {
          
          
          
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }
  
  
  function writeAsciiToMemory(str, buffer, dontAddNull) {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
      }
      
      if (!dontAddNull) HEAP8[((buffer)>>0)] = 0;
    }
  function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(i*4))>>2)] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

  function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    }

  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function _fd_fdstat_get(fd, pbuf) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      
      
      var type = stream.tty ? 2 :
                 FS.isDir(stream.mode) ? 3 :
                 FS.isLink(stream.mode) ? 7 :
                 4;
      HEAP8[((pbuf)>>0)] = type;
      
      
      
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  
  function doReadv(stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8,ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; 
      }
      return ret;
    }
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function _fd_seek(fd,  offset, whence, newOffset) {
  try {
  
      offset = bigintToI53Checked(offset); if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      HEAP64[((newOffset)>>3)] = BigInt(stream.position);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; 
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function _fd_sync(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      if (stream.stream_ops && stream.stream_ops.fsync) {
        return -stream.stream_ops.fsync(stream);
      }
      return 0; 
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  
  function doWritev(stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8,ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
      }
      return ret;
    }
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function uleb128Encode(n, target) {
      if (n < 128) {
        target.push(n);
      } else {
        target.push((n % 128) | 128, n >> 7);
      }
    }
  
  function sigToWasmTypes(sig) {
      var typeNames = {
        'i': 'i32',
        'j': 'i64',
        'f': 'f32',
        'd': 'f64',
        'p': 'i32',
      };
      var type = {
        parameters: [],
        results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
      };
      for (var i = 1; i < sig.length; ++i) {
        type.parameters.push(typeNames[sig[i]]);
      }
      return type;
    }
  function convertJsFunctionToWasm(func, sig) {
  
      
      
      
      
      if (typeof WebAssembly.Function == "function") {
        return new WebAssembly.Function(sigToWasmTypes(sig), func);
      }
  
      
      
      var typeSectionBody = [
        0x01, 
        0x60, 
      ];
      var sigRet = sig.slice(0, 1);
      var sigParam = sig.slice(1);
      var typeCodes = {
        'i': 0x7f, 
        'p': 0x7f, 
        'j': 0x7e, 
        'f': 0x7d, 
        'd': 0x7c, 
      };
  
      
      uleb128Encode(sigParam.length, typeSectionBody);
      for (var i = 0; i < sigParam.length; ++i) {
        typeSectionBody.push(typeCodes[sigParam[i]]);
      }
  
      
      
      if (sigRet == 'v') {
        typeSectionBody.push(0x00);
      } else {
        typeSectionBody.push(0x01, typeCodes[sigRet]);
      }
  
      
      var bytes = [
        0x00, 0x61, 0x73, 0x6d, 
        0x01, 0x00, 0x00, 0x00, 
        0x01, 
      ];
      
      uleb128Encode(typeSectionBody.length, bytes);
      bytes.push.apply(bytes, typeSectionBody);
  
      
      bytes.push(
        0x02, 0x07, 
          
          0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
        0x07, 0x05, 
          
          0x01, 0x01, 0x66, 0x00, 0x00,
      );
  
      
      
      var module = new WebAssembly.Module(new Uint8Array(bytes));
      var instance = new WebAssembly.Instance(module, { 'e': { 'f': func } });
      var wrappedFunc = instance.exports['f'];
      return wrappedFunc;
    }
  
  function getWasmTableEntry(funcPtr) {
      
      
      return wasmTable.get(funcPtr);
    }
  function updateTableMap(offset, count) {
      if (functionsInTableMap) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }
    }
  
  var functionsInTableMap = undefined;
  
  var freeTableIndexes = [];
  function getEmptyTableSlot() {
      
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
      }
      
      try {
        wasmTable.grow(1);
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err;
        }
        throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
      }
      return wasmTable.length - 1;
    }
  
  function setWasmTableEntry(idx, func) {
      wasmTable.set(idx, func);
    }
  
  function addFunction(func, sig) {
  
      
      
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        updateTableMap(0, wasmTable.length);
      }
      if (functionsInTableMap.has(func)) {
        return functionsInTableMap.get(func);
      }
  
      
  
      var ret = getEmptyTableSlot();
  
      
      try {
        
        setWasmTableEntry(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }
        var wrapped = convertJsFunctionToWasm(func, sig);
        setWasmTableEntry(ret, wrapped);
      }
  
      functionsInTableMap.set(func, ret);
  
      return ret;
    }

  function removeFunction(index) {
      functionsInTableMap.delete(getWasmTableEntry(index));
      freeTableIndexes.push(index);
    }

  var ALLOC_NORMAL = 0;
  
  var ALLOC_STACK = 1;
  function allocate(slab, allocator) {
      var ret;
  
      if (allocator == ALLOC_STACK) {
        ret = stackAlloc(slab.length);
      } else {
        ret = _malloc(slab.length);
      }
  
      if (!slab.subarray && !slab.slice) {
        slab = new Uint8Array(slab);
      }
      HEAPU8.set(slab, ret);
      return ret;
    }



  function AsciiToString(ptr) {
      var str = '';
      while (1) {
        var ch = HEAPU8[((ptr++)>>0)];
        if (!ch) return str;
        str += String.fromCharCode(ch);
      }
    }

  function stringToAscii(str, outPtr) {
      return writeAsciiToMemory(str, outPtr, false);
    }

  var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;;
  function UTF16ToString(ptr, maxBytesToRead) {
      var endPtr = ptr;
      
      
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      
      
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
  
      if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      } else {
        var str = '';
  
        
        
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
          if (codeUnit == 0) break;
          
          str += String.fromCharCode(codeUnit);
        }
  
        return str;
      }
    }

  function stringToUTF16(str, outPtr, maxBytesToWrite) {
      
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 0x7FFFFFFF;
      }
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2; 
      var startPtr = outPtr;
      var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        
        var codeUnit = str.charCodeAt(i); 
        HEAP16[((outPtr)>>1)] = codeUnit;
        outPtr += 2;
      }
      
      HEAP16[((outPtr)>>1)] = 0;
      return outPtr - startPtr;
    }

  function lengthBytesUTF16(str) {
      return str.length*2;
    }

  function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0;
  
      var str = '';
      
      
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
        if (utf32 == 0) break;
        ++i;
        
        
        if (utf32 >= 0x10000) {
          var ch = utf32 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    }

  function stringToUTF32(str, outPtr, maxBytesToWrite) {
      
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 0x7FFFFFFF;
      }
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        
        
        var codeUnit = str.charCodeAt(i); 
        if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
        }
        HEAP32[((outPtr)>>2)] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      
      HEAP32[((outPtr)>>2)] = 0;
      return outPtr - startPtr;
    }

  function lengthBytesUTF32(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        
        
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; 
        len += 4;
      }
  
      return len;
    }


  function allocateUTF8OnStack(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }

  
  function writeStringToMemory(string, buffer, dontAddNull) {
      warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');
  
      var  lastChar,  end;
      if (dontAddNull) {
        
        
        
        end = buffer + lengthBytesUTF8(string);
        lastChar = HEAP8[end];
      }
      stringToUTF8(string, buffer, Infinity);
      if (dontAddNull) HEAP8[end] = lastChar; 
    }




  function intArrayToString(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      var chr = array[i];
      if (chr > 0xFF) {
        if (ASSERTIONS) {
          assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
        }
        chr &= 0xFF;
      }
      ret.push(String.fromCharCode(chr));
    }
    return ret.join('');
  }

  function warnOnce(text) {
      if (!warnOnce.shown) warnOnce.shown = {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    }

  function getCFunc(ident) {
      var func = Module['_' + ident]; 
      return func;
    }
  
    
  function ccall(ident, returnType, argTypes, args, opts) {
      
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { 
            
            var len = (str.length << 2) + 1;
            ret = stackAlloc(len);
            stringToUTF8(str, ret, len);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    }

  
    
  function cwrap(ident, returnType, argTypes, opts) {
      argTypes = argTypes || [];
      
      
      var numericArgs = argTypes.every((type) => type === 'number' || type === 'boolean');
      var numericRet = returnType !== 'string';
      if (numericRet && numericArgs && !opts) {
        return getCFunc(ident);
      }
      return function() {
        return ccall(ident, returnType, argTypes, arguments, opts);
      }
    }



  var FSNode =  function(parent, name, mode, rdev) {
    if (!parent) {
      parent = this;  
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292 | 73;
  var writeMode = 146;
  Object.defineProperties(FSNode.prototype, {
   read: {
    get: function() {
     return (this.mode & readMode) === readMode;
    },
    set: function(val) {
     val ? this.mode |= readMode : this.mode &= ~readMode;
    }
   },
   write: {
    get: function() {
     return (this.mode & writeMode) === writeMode;
    },
    set: function(val) {
     val ? this.mode |= writeMode : this.mode &= ~writeMode;
    }
   },
   isFolder: {
    get: function() {
     return FS.isDir(this.mode);
    }
   },
   isDevice: {
    get: function() {
     return FS.isChrdev(this.mode);
    }
   }
  });
  FS.FSNode = FSNode;
  FS.staticInit();;
var ASSERTIONS = false;

var asmLibraryArg = {
  "__syscall_chmod": ___syscall_chmod,
  "__syscall_faccessat": ___syscall_faccessat,
  "__syscall_fchmod": ___syscall_fchmod,
  "__syscall_fchown32": ___syscall_fchown32,
  "__syscall_fcntl64": ___syscall_fcntl64,
  "__syscall_fstat64": ___syscall_fstat64,
  "__syscall_ftruncate64": ___syscall_ftruncate64,
  "__syscall_getcwd": ___syscall_getcwd,
  "__syscall_ioctl": ___syscall_ioctl,
  "__syscall_lstat64": ___syscall_lstat64,
  "__syscall_mkdirat": ___syscall_mkdirat,
  "__syscall_newfstatat": ___syscall_newfstatat,
  "__syscall_openat": ___syscall_openat,
  "__syscall_readlinkat": ___syscall_readlinkat,
  "__syscall_rmdir": ___syscall_rmdir,
  "__syscall_stat64": ___syscall_stat64,
  "__syscall_unlinkat": ___syscall_unlinkat,
  "__syscall_utimensat": ___syscall_utimensat,
  "_emscripten_date_now": __emscripten_date_now,
  "_localtime_js": __localtime_js,
  "_tzset_js": __tzset_js,
  "emscripten_console_warn": _emscripten_console_warn,
  "emscripten_get_now": _emscripten_get_now,
  "emscripten_resize_heap": _emscripten_resize_heap,
  "environ_get": _environ_get,
  "environ_sizes_get": _environ_sizes_get,
  "fd_close": _fd_close,
  "fd_fdstat_get": _fd_fdstat_get,
  "fd_read": _fd_read,
  "fd_seek": _fd_seek,
  "fd_sync": _fd_sync,
  "fd_write": _fd_write,
  "memory": wasmMemory
};
var asm = createWasm();

var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
  return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
};


var _sqlite3_msize = Module["_sqlite3_msize"] = function() {
  return (_sqlite3_msize = Module["_sqlite3_msize"] = Module["asm"]["sqlite3_msize"]).apply(null, arguments);
};


var _sqlite3_vfs_find = Module["_sqlite3_vfs_find"] = function() {
  return (_sqlite3_vfs_find = Module["_sqlite3_vfs_find"] = Module["asm"]["sqlite3_vfs_find"]).apply(null, arguments);
};


var _sqlite3_initialize = Module["_sqlite3_initialize"] = function() {
  return (_sqlite3_initialize = Module["_sqlite3_initialize"] = Module["asm"]["sqlite3_initialize"]).apply(null, arguments);
};


var _sqlite3_vfs_register = Module["_sqlite3_vfs_register"] = function() {
  return (_sqlite3_vfs_register = Module["_sqlite3_vfs_register"] = Module["asm"]["sqlite3_vfs_register"]).apply(null, arguments);
};


var _sqlite3_vfs_unregister = Module["_sqlite3_vfs_unregister"] = function() {
  return (_sqlite3_vfs_unregister = Module["_sqlite3_vfs_unregister"] = Module["asm"]["sqlite3_vfs_unregister"]).apply(null, arguments);
};


var _sqlite3_malloc = Module["_sqlite3_malloc"] = function() {
  return (_sqlite3_malloc = Module["_sqlite3_malloc"] = Module["asm"]["sqlite3_malloc"]).apply(null, arguments);
};


var _sqlite3_malloc64 = Module["_sqlite3_malloc64"] = function() {
  return (_sqlite3_malloc64 = Module["_sqlite3_malloc64"] = Module["asm"]["sqlite3_malloc64"]).apply(null, arguments);
};


var _sqlite3_free = Module["_sqlite3_free"] = function() {
  return (_sqlite3_free = Module["_sqlite3_free"] = Module["asm"]["sqlite3_free"]).apply(null, arguments);
};


var _sqlite3_realloc = Module["_sqlite3_realloc"] = function() {
  return (_sqlite3_realloc = Module["_sqlite3_realloc"] = Module["asm"]["sqlite3_realloc"]).apply(null, arguments);
};


var _sqlite3_realloc64 = Module["_sqlite3_realloc64"] = function() {
  return (_sqlite3_realloc64 = Module["_sqlite3_realloc64"] = Module["asm"]["sqlite3_realloc64"]).apply(null, arguments);
};


var _sqlite3_serialize = Module["_sqlite3_serialize"] = function() {
  return (_sqlite3_serialize = Module["_sqlite3_serialize"] = Module["asm"]["sqlite3_serialize"]).apply(null, arguments);
};


var _sqlite3_prepare_v2 = Module["_sqlite3_prepare_v2"] = function() {
  return (_sqlite3_prepare_v2 = Module["_sqlite3_prepare_v2"] = Module["asm"]["sqlite3_prepare_v2"]).apply(null, arguments);
};


var _sqlite3_step = Module["_sqlite3_step"] = function() {
  return (_sqlite3_step = Module["_sqlite3_step"] = Module["asm"]["sqlite3_step"]).apply(null, arguments);
};


var _sqlite3_column_int64 = Module["_sqlite3_column_int64"] = function() {
  return (_sqlite3_column_int64 = Module["_sqlite3_column_int64"] = Module["asm"]["sqlite3_column_int64"]).apply(null, arguments);
};


var _sqlite3_column_int = Module["_sqlite3_column_int"] = function() {
  return (_sqlite3_column_int = Module["_sqlite3_column_int"] = Module["asm"]["sqlite3_column_int"]).apply(null, arguments);
};


var _sqlite3_finalize = Module["_sqlite3_finalize"] = function() {
  return (_sqlite3_finalize = Module["_sqlite3_finalize"] = Module["asm"]["sqlite3_finalize"]).apply(null, arguments);
};


var _sqlite3_deserialize = Module["_sqlite3_deserialize"] = function() {
  return (_sqlite3_deserialize = Module["_sqlite3_deserialize"] = Module["asm"]["sqlite3_deserialize"]).apply(null, arguments);
};


var _sqlite3_reset = Module["_sqlite3_reset"] = function() {
  return (_sqlite3_reset = Module["_sqlite3_reset"] = Module["asm"]["sqlite3_reset"]).apply(null, arguments);
};


var _sqlite3_clear_bindings = Module["_sqlite3_clear_bindings"] = function() {
  return (_sqlite3_clear_bindings = Module["_sqlite3_clear_bindings"] = Module["asm"]["sqlite3_clear_bindings"]).apply(null, arguments);
};


var _sqlite3_value_blob = Module["_sqlite3_value_blob"] = function() {
  return (_sqlite3_value_blob = Module["_sqlite3_value_blob"] = Module["asm"]["sqlite3_value_blob"]).apply(null, arguments);
};


var _sqlite3_value_text = Module["_sqlite3_value_text"] = function() {
  return (_sqlite3_value_text = Module["_sqlite3_value_text"] = Module["asm"]["sqlite3_value_text"]).apply(null, arguments);
};


var _sqlite3_value_bytes = Module["_sqlite3_value_bytes"] = function() {
  return (_sqlite3_value_bytes = Module["_sqlite3_value_bytes"] = Module["asm"]["sqlite3_value_bytes"]).apply(null, arguments);
};


var _sqlite3_value_double = Module["_sqlite3_value_double"] = function() {
  return (_sqlite3_value_double = Module["_sqlite3_value_double"] = Module["asm"]["sqlite3_value_double"]).apply(null, arguments);
};


var _sqlite3_value_int = Module["_sqlite3_value_int"] = function() {
  return (_sqlite3_value_int = Module["_sqlite3_value_int"] = Module["asm"]["sqlite3_value_int"]).apply(null, arguments);
};


var _sqlite3_value_int64 = Module["_sqlite3_value_int64"] = function() {
  return (_sqlite3_value_int64 = Module["_sqlite3_value_int64"] = Module["asm"]["sqlite3_value_int64"]).apply(null, arguments);
};


var _sqlite3_value_type = Module["_sqlite3_value_type"] = function() {
  return (_sqlite3_value_type = Module["_sqlite3_value_type"] = Module["asm"]["sqlite3_value_type"]).apply(null, arguments);
};


var _sqlite3_result_blob = Module["_sqlite3_result_blob"] = function() {
  return (_sqlite3_result_blob = Module["_sqlite3_result_blob"] = Module["asm"]["sqlite3_result_blob"]).apply(null, arguments);
};


var _sqlite3_result_double = Module["_sqlite3_result_double"] = function() {
  return (_sqlite3_result_double = Module["_sqlite3_result_double"] = Module["asm"]["sqlite3_result_double"]).apply(null, arguments);
};


var _sqlite3_result_error = Module["_sqlite3_result_error"] = function() {
  return (_sqlite3_result_error = Module["_sqlite3_result_error"] = Module["asm"]["sqlite3_result_error"]).apply(null, arguments);
};


var _sqlite3_result_int = Module["_sqlite3_result_int"] = function() {
  return (_sqlite3_result_int = Module["_sqlite3_result_int"] = Module["asm"]["sqlite3_result_int"]).apply(null, arguments);
};


var _sqlite3_result_int64 = Module["_sqlite3_result_int64"] = function() {
  return (_sqlite3_result_int64 = Module["_sqlite3_result_int64"] = Module["asm"]["sqlite3_result_int64"]).apply(null, arguments);
};


var _sqlite3_result_null = Module["_sqlite3_result_null"] = function() {
  return (_sqlite3_result_null = Module["_sqlite3_result_null"] = Module["asm"]["sqlite3_result_null"]).apply(null, arguments);
};


var _sqlite3_result_text = Module["_sqlite3_result_text"] = function() {
  return (_sqlite3_result_text = Module["_sqlite3_result_text"] = Module["asm"]["sqlite3_result_text"]).apply(null, arguments);
};


var _sqlite3_result_error_toobig = Module["_sqlite3_result_error_toobig"] = function() {
  return (_sqlite3_result_error_toobig = Module["_sqlite3_result_error_toobig"] = Module["asm"]["sqlite3_result_error_toobig"]).apply(null, arguments);
};


var _sqlite3_result_error_code = Module["_sqlite3_result_error_code"] = function() {
  return (_sqlite3_result_error_code = Module["_sqlite3_result_error_code"] = Module["asm"]["sqlite3_result_error_code"]).apply(null, arguments);
};


var _sqlite3_result_error_nomem = Module["_sqlite3_result_error_nomem"] = function() {
  return (_sqlite3_result_error_nomem = Module["_sqlite3_result_error_nomem"] = Module["asm"]["sqlite3_result_error_nomem"]).apply(null, arguments);
};


var _sqlite3_user_data = Module["_sqlite3_user_data"] = function() {
  return (_sqlite3_user_data = Module["_sqlite3_user_data"] = Module["asm"]["sqlite3_user_data"]).apply(null, arguments);
};


var _sqlite3_aggregate_context = Module["_sqlite3_aggregate_context"] = function() {
  return (_sqlite3_aggregate_context = Module["_sqlite3_aggregate_context"] = Module["asm"]["sqlite3_aggregate_context"]).apply(null, arguments);
};


var _sqlite3_column_count = Module["_sqlite3_column_count"] = function() {
  return (_sqlite3_column_count = Module["_sqlite3_column_count"] = Module["asm"]["sqlite3_column_count"]).apply(null, arguments);
};


var _sqlite3_data_count = Module["_sqlite3_data_count"] = function() {
  return (_sqlite3_data_count = Module["_sqlite3_data_count"] = Module["asm"]["sqlite3_data_count"]).apply(null, arguments);
};


var _sqlite3_column_blob = Module["_sqlite3_column_blob"] = function() {
  return (_sqlite3_column_blob = Module["_sqlite3_column_blob"] = Module["asm"]["sqlite3_column_blob"]).apply(null, arguments);
};


var _sqlite3_column_bytes = Module["_sqlite3_column_bytes"] = function() {
  return (_sqlite3_column_bytes = Module["_sqlite3_column_bytes"] = Module["asm"]["sqlite3_column_bytes"]).apply(null, arguments);
};


var _sqlite3_column_double = Module["_sqlite3_column_double"] = function() {
  return (_sqlite3_column_double = Module["_sqlite3_column_double"] = Module["asm"]["sqlite3_column_double"]).apply(null, arguments);
};


var _sqlite3_column_text = Module["_sqlite3_column_text"] = function() {
  return (_sqlite3_column_text = Module["_sqlite3_column_text"] = Module["asm"]["sqlite3_column_text"]).apply(null, arguments);
};


var _sqlite3_column_type = Module["_sqlite3_column_type"] = function() {
  return (_sqlite3_column_type = Module["_sqlite3_column_type"] = Module["asm"]["sqlite3_column_type"]).apply(null, arguments);
};


var _sqlite3_column_name = Module["_sqlite3_column_name"] = function() {
  return (_sqlite3_column_name = Module["_sqlite3_column_name"] = Module["asm"]["sqlite3_column_name"]).apply(null, arguments);
};


var _sqlite3_bind_blob = Module["_sqlite3_bind_blob"] = function() {
  return (_sqlite3_bind_blob = Module["_sqlite3_bind_blob"] = Module["asm"]["sqlite3_bind_blob"]).apply(null, arguments);
};


var _sqlite3_bind_double = Module["_sqlite3_bind_double"] = function() {
  return (_sqlite3_bind_double = Module["_sqlite3_bind_double"] = Module["asm"]["sqlite3_bind_double"]).apply(null, arguments);
};


var _sqlite3_bind_int = Module["_sqlite3_bind_int"] = function() {
  return (_sqlite3_bind_int = Module["_sqlite3_bind_int"] = Module["asm"]["sqlite3_bind_int"]).apply(null, arguments);
};


var _sqlite3_bind_int64 = Module["_sqlite3_bind_int64"] = function() {
  return (_sqlite3_bind_int64 = Module["_sqlite3_bind_int64"] = Module["asm"]["sqlite3_bind_int64"]).apply(null, arguments);
};


var _sqlite3_bind_null = Module["_sqlite3_bind_null"] = function() {
  return (_sqlite3_bind_null = Module["_sqlite3_bind_null"] = Module["asm"]["sqlite3_bind_null"]).apply(null, arguments);
};


var _sqlite3_bind_text = Module["_sqlite3_bind_text"] = function() {
  return (_sqlite3_bind_text = Module["_sqlite3_bind_text"] = Module["asm"]["sqlite3_bind_text"]).apply(null, arguments);
};


var _sqlite3_bind_parameter_count = Module["_sqlite3_bind_parameter_count"] = function() {
  return (_sqlite3_bind_parameter_count = Module["_sqlite3_bind_parameter_count"] = Module["asm"]["sqlite3_bind_parameter_count"]).apply(null, arguments);
};


var _sqlite3_bind_parameter_index = Module["_sqlite3_bind_parameter_index"] = function() {
  return (_sqlite3_bind_parameter_index = Module["_sqlite3_bind_parameter_index"] = Module["asm"]["sqlite3_bind_parameter_index"]).apply(null, arguments);
};


var _sqlite3_db_handle = Module["_sqlite3_db_handle"] = function() {
  return (_sqlite3_db_handle = Module["_sqlite3_db_handle"] = Module["asm"]["sqlite3_db_handle"]).apply(null, arguments);
};


var _sqlite3_sql = Module["_sqlite3_sql"] = function() {
  return (_sqlite3_sql = Module["_sqlite3_sql"] = Module["asm"]["sqlite3_sql"]).apply(null, arguments);
};


var _sqlite3_expanded_sql = Module["_sqlite3_expanded_sql"] = function() {
  return (_sqlite3_expanded_sql = Module["_sqlite3_expanded_sql"] = Module["asm"]["sqlite3_expanded_sql"]).apply(null, arguments);
};


var _sqlite3_strglob = Module["_sqlite3_strglob"] = function() {
  return (_sqlite3_strglob = Module["_sqlite3_strglob"] = Module["asm"]["sqlite3_strglob"]).apply(null, arguments);
};


var _sqlite3_strlike = Module["_sqlite3_strlike"] = function() {
  return (_sqlite3_strlike = Module["_sqlite3_strlike"] = Module["asm"]["sqlite3_strlike"]).apply(null, arguments);
};


var _sqlite3_exec = Module["_sqlite3_exec"] = function() {
  return (_sqlite3_exec = Module["_sqlite3_exec"] = Module["asm"]["sqlite3_exec"]).apply(null, arguments);
};


var _sqlite3_errmsg = Module["_sqlite3_errmsg"] = function() {
  return (_sqlite3_errmsg = Module["_sqlite3_errmsg"] = Module["asm"]["sqlite3_errmsg"]).apply(null, arguments);
};


var _sqlite3_prepare_v3 = Module["_sqlite3_prepare_v3"] = function() {
  return (_sqlite3_prepare_v3 = Module["_sqlite3_prepare_v3"] = Module["asm"]["sqlite3_prepare_v3"]).apply(null, arguments);
};


var _sqlite3_libversion = Module["_sqlite3_libversion"] = function() {
  return (_sqlite3_libversion = Module["_sqlite3_libversion"] = Module["asm"]["sqlite3_libversion"]).apply(null, arguments);
};


var _sqlite3_libversion_number = Module["_sqlite3_libversion_number"] = function() {
  return (_sqlite3_libversion_number = Module["_sqlite3_libversion_number"] = Module["asm"]["sqlite3_libversion_number"]).apply(null, arguments);
};


var _sqlite3_shutdown = Module["_sqlite3_shutdown"] = function() {
  return (_sqlite3_shutdown = Module["_sqlite3_shutdown"] = Module["asm"]["sqlite3_shutdown"]).apply(null, arguments);
};


var _sqlite3_changes64 = Module["_sqlite3_changes64"] = function() {
  return (_sqlite3_changes64 = Module["_sqlite3_changes64"] = Module["asm"]["sqlite3_changes64"]).apply(null, arguments);
};


var _sqlite3_changes = Module["_sqlite3_changes"] = function() {
  return (_sqlite3_changes = Module["_sqlite3_changes"] = Module["asm"]["sqlite3_changes"]).apply(null, arguments);
};


var _sqlite3_total_changes64 = Module["_sqlite3_total_changes64"] = function() {
  return (_sqlite3_total_changes64 = Module["_sqlite3_total_changes64"] = Module["asm"]["sqlite3_total_changes64"]).apply(null, arguments);
};


var _sqlite3_total_changes = Module["_sqlite3_total_changes"] = function() {
  return (_sqlite3_total_changes = Module["_sqlite3_total_changes"] = Module["asm"]["sqlite3_total_changes"]).apply(null, arguments);
};


var _sqlite3_close_v2 = Module["_sqlite3_close_v2"] = function() {
  return (_sqlite3_close_v2 = Module["_sqlite3_close_v2"] = Module["asm"]["sqlite3_close_v2"]).apply(null, arguments);
};


var _sqlite3_interrupt = Module["_sqlite3_interrupt"] = function() {
  return (_sqlite3_interrupt = Module["_sqlite3_interrupt"] = Module["asm"]["sqlite3_interrupt"]).apply(null, arguments);
};


var _sqlite3_create_function = Module["_sqlite3_create_function"] = function() {
  return (_sqlite3_create_function = Module["_sqlite3_create_function"] = Module["asm"]["sqlite3_create_function"]).apply(null, arguments);
};


var _sqlite3_create_function_v2 = Module["_sqlite3_create_function_v2"] = function() {
  return (_sqlite3_create_function_v2 = Module["_sqlite3_create_function_v2"] = Module["asm"]["sqlite3_create_function_v2"]).apply(null, arguments);
};


var _sqlite3_create_window_function = Module["_sqlite3_create_window_function"] = function() {
  return (_sqlite3_create_window_function = Module["_sqlite3_create_window_function"] = Module["asm"]["sqlite3_create_window_function"]).apply(null, arguments);
};


var _sqlite3_trace_v2 = Module["_sqlite3_trace_v2"] = function() {
  return (_sqlite3_trace_v2 = Module["_sqlite3_trace_v2"] = Module["asm"]["sqlite3_trace_v2"]).apply(null, arguments);
};


var _sqlite3_error_offset = Module["_sqlite3_error_offset"] = function() {
  return (_sqlite3_error_offset = Module["_sqlite3_error_offset"] = Module["asm"]["sqlite3_error_offset"]).apply(null, arguments);
};


var _sqlite3_extended_errcode = Module["_sqlite3_extended_errcode"] = function() {
  return (_sqlite3_extended_errcode = Module["_sqlite3_extended_errcode"] = Module["asm"]["sqlite3_extended_errcode"]).apply(null, arguments);
};


var _sqlite3_errstr = Module["_sqlite3_errstr"] = function() {
  return (_sqlite3_errstr = Module["_sqlite3_errstr"] = Module["asm"]["sqlite3_errstr"]).apply(null, arguments);
};


var _sqlite3_open = Module["_sqlite3_open"] = function() {
  return (_sqlite3_open = Module["_sqlite3_open"] = Module["asm"]["sqlite3_open"]).apply(null, arguments);
};


var _sqlite3_open_v2 = Module["_sqlite3_open_v2"] = function() {
  return (_sqlite3_open_v2 = Module["_sqlite3_open_v2"] = Module["asm"]["sqlite3_open_v2"]).apply(null, arguments);
};


var _sqlite3_extended_result_codes = Module["_sqlite3_extended_result_codes"] = function() {
  return (_sqlite3_extended_result_codes = Module["_sqlite3_extended_result_codes"] = Module["asm"]["sqlite3_extended_result_codes"]).apply(null, arguments);
};


var _sqlite3_file_control = Module["_sqlite3_file_control"] = function() {
  return (_sqlite3_file_control = Module["_sqlite3_file_control"] = Module["asm"]["sqlite3_file_control"]).apply(null, arguments);
};


var _sqlite3_uri_parameter = Module["_sqlite3_uri_parameter"] = function() {
  return (_sqlite3_uri_parameter = Module["_sqlite3_uri_parameter"] = Module["asm"]["sqlite3_uri_parameter"]).apply(null, arguments);
};


var _sqlite3_uri_key = Module["_sqlite3_uri_key"] = function() {
  return (_sqlite3_uri_key = Module["_sqlite3_uri_key"] = Module["asm"]["sqlite3_uri_key"]).apply(null, arguments);
};


var _sqlite3_uri_boolean = Module["_sqlite3_uri_boolean"] = function() {
  return (_sqlite3_uri_boolean = Module["_sqlite3_uri_boolean"] = Module["asm"]["sqlite3_uri_boolean"]).apply(null, arguments);
};


var _sqlite3_uri_int64 = Module["_sqlite3_uri_int64"] = function() {
  return (_sqlite3_uri_int64 = Module["_sqlite3_uri_int64"] = Module["asm"]["sqlite3_uri_int64"]).apply(null, arguments);
};


var _sqlite3_db_name = Module["_sqlite3_db_name"] = function() {
  return (_sqlite3_db_name = Module["_sqlite3_db_name"] = Module["asm"]["sqlite3_db_name"]).apply(null, arguments);
};


var _sqlite3_db_filename = Module["_sqlite3_db_filename"] = function() {
  return (_sqlite3_db_filename = Module["_sqlite3_db_filename"] = Module["asm"]["sqlite3_db_filename"]).apply(null, arguments);
};


var _sqlite3_compileoption_used = Module["_sqlite3_compileoption_used"] = function() {
  return (_sqlite3_compileoption_used = Module["_sqlite3_compileoption_used"] = Module["asm"]["sqlite3_compileoption_used"]).apply(null, arguments);
};


var _sqlite3_compileoption_get = Module["_sqlite3_compileoption_get"] = function() {
  return (_sqlite3_compileoption_get = Module["_sqlite3_compileoption_get"] = Module["asm"]["sqlite3_compileoption_get"]).apply(null, arguments);
};


var _sqlite3_sourceid = Module["_sqlite3_sourceid"] = function() {
  return (_sqlite3_sourceid = Module["_sqlite3_sourceid"] = Module["asm"]["sqlite3_sourceid"]).apply(null, arguments);
};


var _sqlite3_wasm_pstack_ptr = Module["_sqlite3_wasm_pstack_ptr"] = function() {
  return (_sqlite3_wasm_pstack_ptr = Module["_sqlite3_wasm_pstack_ptr"] = Module["asm"]["sqlite3_wasm_pstack_ptr"]).apply(null, arguments);
};


var _sqlite3_wasm_pstack_restore = Module["_sqlite3_wasm_pstack_restore"] = function() {
  return (_sqlite3_wasm_pstack_restore = Module["_sqlite3_wasm_pstack_restore"] = Module["asm"]["sqlite3_wasm_pstack_restore"]).apply(null, arguments);
};


var _sqlite3_wasm_pstack_alloc = Module["_sqlite3_wasm_pstack_alloc"] = function() {
  return (_sqlite3_wasm_pstack_alloc = Module["_sqlite3_wasm_pstack_alloc"] = Module["asm"]["sqlite3_wasm_pstack_alloc"]).apply(null, arguments);
};


var _sqlite3_wasm_pstack_remaining = Module["_sqlite3_wasm_pstack_remaining"] = function() {
  return (_sqlite3_wasm_pstack_remaining = Module["_sqlite3_wasm_pstack_remaining"] = Module["asm"]["sqlite3_wasm_pstack_remaining"]).apply(null, arguments);
};


var _sqlite3_wasm_pstack_quota = Module["_sqlite3_wasm_pstack_quota"] = function() {
  return (_sqlite3_wasm_pstack_quota = Module["_sqlite3_wasm_pstack_quota"] = Module["asm"]["sqlite3_wasm_pstack_quota"]).apply(null, arguments);
};


var _sqlite3_wasm_db_error = Module["_sqlite3_wasm_db_error"] = function() {
  return (_sqlite3_wasm_db_error = Module["_sqlite3_wasm_db_error"] = Module["asm"]["sqlite3_wasm_db_error"]).apply(null, arguments);
};


var _sqlite3_wasm_test_struct = Module["_sqlite3_wasm_test_struct"] = function() {
  return (_sqlite3_wasm_test_struct = Module["_sqlite3_wasm_test_struct"] = Module["asm"]["sqlite3_wasm_test_struct"]).apply(null, arguments);
};


var _sqlite3_wasm_enum_json = Module["_sqlite3_wasm_enum_json"] = function() {
  return (_sqlite3_wasm_enum_json = Module["_sqlite3_wasm_enum_json"] = Module["asm"]["sqlite3_wasm_enum_json"]).apply(null, arguments);
};


var _sqlite3_wasm_vfs_unlink = Module["_sqlite3_wasm_vfs_unlink"] = function() {
  return (_sqlite3_wasm_vfs_unlink = Module["_sqlite3_wasm_vfs_unlink"] = Module["asm"]["sqlite3_wasm_vfs_unlink"]).apply(null, arguments);
};


var _sqlite3_wasm_db_vfs = Module["_sqlite3_wasm_db_vfs"] = function() {
  return (_sqlite3_wasm_db_vfs = Module["_sqlite3_wasm_db_vfs"] = Module["asm"]["sqlite3_wasm_db_vfs"]).apply(null, arguments);
};


var _sqlite3_wasm_db_reset = Module["_sqlite3_wasm_db_reset"] = function() {
  return (_sqlite3_wasm_db_reset = Module["_sqlite3_wasm_db_reset"] = Module["asm"]["sqlite3_wasm_db_reset"]).apply(null, arguments);
};


var _sqlite3_wasm_db_export_chunked = Module["_sqlite3_wasm_db_export_chunked"] = function() {
  return (_sqlite3_wasm_db_export_chunked = Module["_sqlite3_wasm_db_export_chunked"] = Module["asm"]["sqlite3_wasm_db_export_chunked"]).apply(null, arguments);
};


var _sqlite3_wasm_db_serialize = Module["_sqlite3_wasm_db_serialize"] = function() {
  return (_sqlite3_wasm_db_serialize = Module["_sqlite3_wasm_db_serialize"] = Module["asm"]["sqlite3_wasm_db_serialize"]).apply(null, arguments);
};


var _sqlite3_wasm_kvvfsMakeKeyOnPstack = Module["_sqlite3_wasm_kvvfsMakeKeyOnPstack"] = function() {
  return (_sqlite3_wasm_kvvfsMakeKeyOnPstack = Module["_sqlite3_wasm_kvvfsMakeKeyOnPstack"] = Module["asm"]["sqlite3_wasm_kvvfsMakeKeyOnPstack"]).apply(null, arguments);
};


var _sqlite3_wasm_kvvfs_methods = Module["_sqlite3_wasm_kvvfs_methods"] = function() {
  return (_sqlite3_wasm_kvvfs_methods = Module["_sqlite3_wasm_kvvfs_methods"] = Module["asm"]["sqlite3_wasm_kvvfs_methods"]).apply(null, arguments);
};


var _sqlite3_wasm_init_wasmfs = Module["_sqlite3_wasm_init_wasmfs"] = function() {
  return (_sqlite3_wasm_init_wasmfs = Module["_sqlite3_wasm_init_wasmfs"] = Module["asm"]["sqlite3_wasm_init_wasmfs"]).apply(null, arguments);
};


var _sqlite3_wasm_test_intptr = Module["_sqlite3_wasm_test_intptr"] = function() {
  return (_sqlite3_wasm_test_intptr = Module["_sqlite3_wasm_test_intptr"] = Module["asm"]["sqlite3_wasm_test_intptr"]).apply(null, arguments);
};


var _sqlite3_wasm_test_int64_max = Module["_sqlite3_wasm_test_int64_max"] = function() {
  return (_sqlite3_wasm_test_int64_max = Module["_sqlite3_wasm_test_int64_max"] = Module["asm"]["sqlite3_wasm_test_int64_max"]).apply(null, arguments);
};


var _sqlite3_wasm_test_int64_min = Module["_sqlite3_wasm_test_int64_min"] = function() {
  return (_sqlite3_wasm_test_int64_min = Module["_sqlite3_wasm_test_int64_min"] = Module["asm"]["sqlite3_wasm_test_int64_min"]).apply(null, arguments);
};


var _sqlite3_wasm_test_int64_times2 = Module["_sqlite3_wasm_test_int64_times2"] = function() {
  return (_sqlite3_wasm_test_int64_times2 = Module["_sqlite3_wasm_test_int64_times2"] = Module["asm"]["sqlite3_wasm_test_int64_times2"]).apply(null, arguments);
};


var _sqlite3_wasm_test_int64_minmax = Module["_sqlite3_wasm_test_int64_minmax"] = function() {
  return (_sqlite3_wasm_test_int64_minmax = Module["_sqlite3_wasm_test_int64_minmax"] = Module["asm"]["sqlite3_wasm_test_int64_minmax"]).apply(null, arguments);
};


var _sqlite3_wasm_test_int64ptr = Module["_sqlite3_wasm_test_int64ptr"] = function() {
  return (_sqlite3_wasm_test_int64ptr = Module["_sqlite3_wasm_test_int64ptr"] = Module["asm"]["sqlite3_wasm_test_int64ptr"]).apply(null, arguments);
};


var _sqlite3_wasm_test_stack_overflow = Module["_sqlite3_wasm_test_stack_overflow"] = function() {
  return (_sqlite3_wasm_test_stack_overflow = Module["_sqlite3_wasm_test_stack_overflow"] = Module["asm"]["sqlite3_wasm_test_stack_overflow"]).apply(null, arguments);
};


var _sqlite3_wasm_test_str_hello = Module["_sqlite3_wasm_test_str_hello"] = function() {
  return (_sqlite3_wasm_test_str_hello = Module["_sqlite3_wasm_test_str_hello"] = Module["asm"]["sqlite3_wasm_test_str_hello"]).apply(null, arguments);
};


var _malloc = Module["_malloc"] = function() {
  return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(null, arguments);
};


var ___errno_location = Module["___errno_location"] = function() {
  return (___errno_location = Module["___errno_location"] = Module["asm"]["__errno_location"]).apply(null, arguments);
};


var _free = Module["_free"] = function() {
  return (_free = Module["_free"] = Module["asm"]["free"]).apply(null, arguments);
};


var stackSave = Module["stackSave"] = function() {
  return (stackSave = Module["stackSave"] = Module["asm"]["stackSave"]).apply(null, arguments);
};


var stackRestore = Module["stackRestore"] = function() {
  return (stackRestore = Module["stackRestore"] = Module["asm"]["stackRestore"]).apply(null, arguments);
};


var stackAlloc = Module["stackAlloc"] = function() {
  return (stackAlloc = Module["stackAlloc"] = Module["asm"]["stackAlloc"]).apply(null, arguments);
};







Module["wasmMemory"] = wasmMemory;
Module["FS"] = FS;


var calledRun;

dependenciesFulfilled = function runCaller() {
  
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; 
};


function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  preRun();

  
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    
    
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve(Module);
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();







if(!Module.postRun) Module.postRun = [];
Module.postRun.push(function(Module){
  'use strict';
  










'use strict';
self.sqlite3ApiBootstrap = function sqlite3ApiBootstrap(
  apiConfig = (self.sqlite3ApiConfig || sqlite3ApiBootstrap.defaultConfig)
){
  if(sqlite3ApiBootstrap.sqlite3){ 
    console.warn("sqlite3ApiBootstrap() called multiple times.",
                 "Config and external initializers are ignored on calls after the first.");
    return sqlite3ApiBootstrap.sqlite3;
  }
  const config = Object.assign(Object.create(null),{
    exports: undefined,
    memory: undefined,
    bigIntEnabled: (()=>{
      if('undefined'!==typeof Module){
        
        return !!Module.HEAPU64;
      }
      return !!self.BigInt64Array;
    })(),
    allocExportName: 'malloc',
    deallocExportName: 'free',
    wasmfsOpfsDir: '/opfs'
  }, apiConfig || {});

  [
    
    
    'exports', 'memory', 'wasmfsOpfsDir'
  ].forEach((k)=>{
    if('function' === typeof config[k]){
      config[k] = config[k]();
    }
  });

  
  const toss = (...args)=>{throw new Error(args.join(' '))};

  if(config.wasmfsOpfsDir && !/^\/[^/]+$/.test(config.wasmfsOpfsDir)){
    toss("config.wasmfsOpfsDir must be falsy or in the form '/dir-name'.");
  }

  
  const isInt32 = (n)=>{
    return ('bigint'!==typeof n )
      && !!(n===(n|0) && n<=2147483647 && n>=-2147483648);
  };
  
  const bigIntFits64 = function f(b){
    if(!f._max){
      f._max = BigInt("0x7fffffffffffffff");
      f._min = ~f._max;
    }
    return b >= f._min && b <= f._max;
  };

  
  const bigIntFits32 = (b)=>(b >= (-0x7fffffffn - 1n) && b <= 0x7fffffffn);

  
  const bigIntFitsDouble = function f(b){
    if(!f._min){
      f._min = Number.MIN_SAFE_INTEGER;
      f._max = Number.MAX_SAFE_INTEGER;
    }
    return b >= f._min && b <= f._max;
  };

  
  const isTypedArray = (v)=>{
    return (v && v.constructor && isInt32(v.constructor.BYTES_PER_ELEMENT)) ? v : false;
  };

  
  const isBindableTypedArray = (v)=>{
    return v && v.constructor && (1===v.constructor.BYTES_PER_ELEMENT);
  };

  
  const isSQLableTypedArray = (v)=>{
    return v && v.constructor && (1===v.constructor.BYTES_PER_ELEMENT);
  };

  
  const affirmBindableTypedArray = (v)=>{
    return isBindableTypedArray(v)
      || toss("Value is not of a supported TypedArray type.");
  };

  const utf8Decoder = new TextDecoder('utf-8');

  
  const __SAB = ('undefined'===typeof SharedArrayBuffer)
        ? function(){} : SharedArrayBuffer;
  const typedArrayToString = function(arrayBuffer, begin, end){
    return utf8Decoder.decode(
      (arrayBuffer.buffer instanceof __SAB)
        ? arrayBuffer.slice(begin, end)
        : arrayBuffer.subarray(begin, end)
    );
  };

  
  const flexibleString = function(v){
    if(isSQLableTypedArray(v)) return typedArrayToString(v);
    else if(Array.isArray(v)) return v.join('');
    return v;
  };

  
  class WasmAllocError extends Error {
    constructor(...args){
      super(...args);
      this.name = 'WasmAllocError';
    }
  };
  
  WasmAllocError.toss = (...args)=>{
    throw new WasmAllocError(...args);
  };

  
  const capi = {
    
    sqlite3_create_function_v2: function(
      pDb, funcName, nArg, eTextRep, pApp,
      xFunc, xStep, xFinal, xDestroy
    ){},
    
    sqlite3_create_function:function(
      pDb, funcName, nArg, eTextRep, pApp,
      xFunc, xStep, xFinal
    ){},
    
    sqlite3_create_window_function: function(
      pDb, funcName, nArg, eTextRep, pApp,
      xStep, xFinal, xValue, xInverse, xDestroy
    ){},
    
    sqlite3_prepare_v3: (dbPtr, sql, sqlByteLen, prepFlags,
                         stmtPtrPtr, strPtrPtr)=>{},

    
    sqlite3_prepare_v2: (dbPtr, sql, sqlByteLen,
                         stmtPtrPtr,strPtrPtr)=>{},

    
    sqlite3_exec: (pDb, sql, callback, pVoid, pErrMsg)=>{},

    
    util:{
      affirmBindableTypedArray, flexibleString,
      bigIntFits32, bigIntFits64, bigIntFitsDouble,
      isBindableTypedArray,
      isInt32, isSQLableTypedArray, isTypedArray, 
      typedArrayToString,
      isUIThread: ()=>'undefined'===typeof WorkerGlobalScope
    },
    
    
    wasm: {
    
      
      ptrSizeof: config.wasmPtrSizeof || 4,
      
      ptrIR: config.wasmPtrIR || "i32",
      
      bigIntEnabled: !!config.bigIntEnabled,
      
      exports: config.exports
        || toss("Missing API config.exports (WASM module exports)."),

      
      memory: config.memory || config.exports['memory']
        || toss("API config object requires a WebAssembly.Memory object",
                "in either config.exports.memory (exported)",
                "or config.memory (imported)."),

      
      alloc: undefined,
      
      dealloc: undefined

      
    }
  };

  const wasm = capi.wasm;

  
  wasm.allocFromTypedArray = function(srcTypedArray){
    affirmBindableTypedArray(srcTypedArray);
    const pRet = wasm.alloc(srcTypedArray.byteLength || 1);
    wasm.heapForSize(srcTypedArray.constructor).set(srcTypedArray.byteLength ? srcTypedArray : [0], pRet);
    return pRet;
  };

  const keyAlloc = config.allocExportName || 'malloc',
        keyDealloc =  config.deallocExportName || 'free';
  for(const key of [keyAlloc, keyDealloc]){
    const f = wasm.exports[key];
    if(!(f instanceof Function)) toss("Missing required exports[",key,"] function.");
  }

  wasm.alloc = function(n){
    const m = wasm.exports[keyAlloc](n);
    if(!m) throw new WasmAllocError("Failed to allocate "+n+" bytes.");
    return m;
  };

  wasm.dealloc = (m)=>wasm.exports[keyDealloc](m);

  
  wasm.compileOptionUsed = function f(optName){
    if(!arguments.length){
      if(f._result) return f._result;
      else if(!f._opt){
        f._rx = /^([^=]+)=(.+)/;
        f._rxInt = /^-?\d+$/;
        f._opt = function(opt, rv){
          const m = f._rx.exec(opt);
          rv[0] = (m ? m[1] : opt);
          rv[1] = m ? (f._rxInt.test(m[2]) ? +m[2] : m[2]) : true;
        };                    
      }
      const rc = {}, ov = [0,0];
      let i = 0, k;
      while((k = capi.sqlite3_compileoption_get(i++))){
        f._opt(k,ov);
        rc[ov[0]] = ov[1];
      }
      return f._result = rc;
    }else if(Array.isArray(optName)){
      const rc = {};
      optName.forEach((v)=>{
        rc[v] = capi.sqlite3_compileoption_used(v);
      });
      return rc;
    }else if('object' === typeof optName){
      Object.keys(optName).forEach((k)=> {
        optName[k] = capi.sqlite3_compileoption_used(k);
      });
      return optName;
    }
    return (
      'string'===typeof optName
    ) ? !!capi.sqlite3_compileoption_used(optName) : false;
  };

  
  wasm.bindingSignatures = [
    
    ["sqlite3_aggregate_context","void*", "sqlite3_context*", "int"],
    ["sqlite3_bind_blob","int", "sqlite3_stmt*", "int", "*", "int", "*"
     
    ],
    ["sqlite3_bind_double","int", "sqlite3_stmt*", "int", "f64"],
    ["sqlite3_bind_int","int", "sqlite3_stmt*", "int", "int"],
    ["sqlite3_bind_null",undefined, "sqlite3_stmt*", "int"],
    ["sqlite3_bind_parameter_count", "int", "sqlite3_stmt*"],
    ["sqlite3_bind_parameter_index","int", "sqlite3_stmt*", "string"],
    ["sqlite3_bind_text","int", "sqlite3_stmt*", "int", "string", "int", "int"
     
    ],
    ["sqlite3_close_v2", "int", "sqlite3*"],
    ["sqlite3_changes", "int", "sqlite3*"],
    ["sqlite3_clear_bindings","int", "sqlite3_stmt*"],
    ["sqlite3_column_blob","*", "sqlite3_stmt*", "int"],
    ["sqlite3_column_bytes","int", "sqlite3_stmt*", "int"],
    ["sqlite3_column_count", "int", "sqlite3_stmt*"],
    ["sqlite3_column_double","f64", "sqlite3_stmt*", "int"],
    ["sqlite3_column_int","int", "sqlite3_stmt*", "int"],
    ["sqlite3_column_name","string", "sqlite3_stmt*", "int"],
    ["sqlite3_column_text","string", "sqlite3_stmt*", "int"],
    ["sqlite3_column_type","int", "sqlite3_stmt*", "int"],
    ["sqlite3_compileoption_get", "string", "int"],
    ["sqlite3_compileoption_used", "int", "string"],
    
    ["sqlite3_data_count", "int", "sqlite3_stmt*"],
    ["sqlite3_db_filename", "string", "sqlite3*", "string"],
    ["sqlite3_db_handle", "sqlite3*", "sqlite3_stmt*"],
    ["sqlite3_db_name", "string", "sqlite3*", "int"],
    ["sqlite3_deserialize", "int", "sqlite3*", "string", "*", "i64", "i64", "int"]
    ,
    ["sqlite3_errmsg", "string", "sqlite3*"],
    ["sqlite3_error_offset", "int", "sqlite3*"],
    ["sqlite3_errstr", "string", "int"],
    
    ["sqlite3_expanded_sql", "string", "sqlite3_stmt*"],
    ["sqlite3_extended_errcode", "int", "sqlite3*"],
    ["sqlite3_extended_result_codes", "int", "sqlite3*", "int"],
    ["sqlite3_file_control", "int", "sqlite3*", "string", "int", "*"],
    ["sqlite3_finalize", "int", "sqlite3_stmt*"],
    ["sqlite3_free", undefined,"*"],
    ["sqlite3_initialize", undefined],
    ["sqlite3_interrupt", undefined, "sqlite3*"
     ],
    ["sqlite3_libversion", "string"],
    ["sqlite3_libversion_number", "int"],
    ["sqlite3_malloc", "*","int"],
    ["sqlite3_open", "int", "string", "*"],
    ["sqlite3_open_v2", "int", "string", "*", "int", "string"],
    
    ["sqlite3_realloc", "*","*","int"],
    ["sqlite3_reset", "int", "sqlite3_stmt*"],
    ["sqlite3_result_blob",undefined, "*", "*", "int", "*"],
    ["sqlite3_result_double",undefined, "*", "f64"],
    ["sqlite3_result_error",undefined, "*", "string", "int"],
    ["sqlite3_result_error_code", undefined, "*", "int"],
    ["sqlite3_result_error_nomem", undefined, "*"],
    ["sqlite3_result_error_toobig", undefined, "*"],
    ["sqlite3_result_int",undefined, "*", "int"],
    ["sqlite3_result_null",undefined, "*"],
    ["sqlite3_result_text",undefined, "*", "string", "int", "*"],
    ["sqlite3_serialize","*", "sqlite3*", "string", "*", "int"],
    ["sqlite3_shutdown", undefined],
    ["sqlite3_sourceid", "string"],
    ["sqlite3_sql", "string", "sqlite3_stmt*"],
    ["sqlite3_step", "int", "sqlite3_stmt*"],
    ["sqlite3_strglob", "int", "string","string"],
    ["sqlite3_strlike", "int", "string","string","int"],
    ["sqlite3_trace_v2", "int", "sqlite3*", "int", "*", "*"],
    ["sqlite3_total_changes", "int", "sqlite3*"],
    ["sqlite3_uri_boolean", "int", "string", "string", "int"],
    ["sqlite3_uri_key", "string", "string", "int"],
    ["sqlite3_uri_parameter", "string", "string", "string"],
    ["sqlite3_user_data","void*", "sqlite3_context*"],
    ["sqlite3_value_blob", "*", "sqlite3_value*"],
    ["sqlite3_value_bytes","int", "sqlite3_value*"],
    ["sqlite3_value_double","f64", "sqlite3_value*"],
    ["sqlite3_value_int","int", "sqlite3_value*"],
    ["sqlite3_value_text", "string", "sqlite3_value*"],
    ["sqlite3_value_type", "int", "sqlite3_value*"],
    ["sqlite3_vfs_find", "*", "string"],
    ["sqlite3_vfs_register", "int", "sqlite3_vfs*", "int"],
    ["sqlite3_vfs_unregister", "int", "sqlite3_vfs*"]
  ];

  if(false && wasm.compileOptionUsed('SQLITE_ENABLE_NORMALIZE')){
    
    wasm.bindingSignatures.push(["sqlite3_normalized_sql", "string", "sqlite3_stmt*"]);
  }
  
  
  wasm.bindingSignatures.int64 = [
    ["sqlite3_bind_int64","int", ["sqlite3_stmt*", "int", "i64"]],
    ["sqlite3_changes64","i64", ["sqlite3*"]],
    ["sqlite3_column_int64","i64", ["sqlite3_stmt*", "int"]],
    ["sqlite3_malloc64", "*","i64"],
    ["sqlite3_msize", "i64", "*"],
    ["sqlite3_realloc64", "*","*", "i64"],
    ["sqlite3_result_int64",undefined, "*", "i64"],
    ["sqlite3_total_changes64", "i64", ["sqlite3*"]],
    ["sqlite3_uri_int64", "i64", ["string", "string", "i64"]],
    ["sqlite3_value_int64","i64", "sqlite3_value*"],
  ];

  
  wasm.bindingSignatures.wasm = [
    ["sqlite3_wasm_db_reset", "int", "sqlite3*"],
    ["sqlite3_wasm_db_vfs", "sqlite3_vfs*", "sqlite3*","string"],
    ["sqlite3_wasm_vfs_unlink", "int", "sqlite3_vfs*","string"]
  ];


  
  wasm.pstack = Object.assign(Object.create(null),{
    
    restore: wasm.exports.sqlite3_wasm_pstack_restore,
    
    alloc: (n)=>{
      return wasm.exports.sqlite3_wasm_pstack_alloc(n)
        || WasmAllocError.toss("Could not allocate",n,
                               "bytes from the pstack.");
    },
    
    allocChunks: (n,sz)=>{
      const mem = wasm.pstack.alloc(n * sz);
      const rc = [];
      let i = 0, offset = 0;
      for(; i < n; offset = (sz * ++i)){
        rc.push(mem + offset);
      }
      return rc;
    },
    
    allocPtr: (n=1,safePtrSize=true)=>{
      return 1===n
        ? wasm.pstack.alloc(safePtrSize ? 8 : wasm.ptrSizeof)
        : wasm.pstack.allocChunks(n, safePtrSize ? 8 : wasm.ptrSizeof);
    }
  });
  Object.defineProperties(wasm.pstack, {
    
    pointer: {
      configurable: false, iterable: true, writeable: false,
      get: wasm.exports.sqlite3_wasm_pstack_ptr
      
      
      
    },
    
    quota: {
      configurable: false, iterable: true, writeable: false,
      get: wasm.exports.sqlite3_wasm_pstack_quota
    }    
  });

  
  Object.defineProperty(wasm.pstack, 'remaining', {
    configurable: false, iterable: true, writeable: false,
    get: wasm.exports.sqlite3_wasm_pstack_remaining
  });

  
  class SQLite3Error extends Error {
    
    constructor(...args){
      if(1===args.length && 'number'===typeof args[0] && args[0]===(args[0] | 0)){
        super(capi.sqlite3_js_rc_str(args[0]) || ("Unknown result code #"+args[0]));
      }else{
        super(args.join(' '));
      }
      this.name = 'SQLite3Error';
    }
  };
  
  SQLite3Error.toss = (...args)=>{
    throw new SQLite3Error(...args);
  };

  
  let __persistentDir = undefined;
  
  capi.sqlite3_wasmfs_opfs_dir = function(){
    if(undefined !== __persistentDir) return __persistentDir;
    
    const pdir = config.wasmfsOpfsDir;
    if(!pdir
       || !self.FileSystemHandle
       || !self.FileSystemDirectoryHandle
       || !self.FileSystemFileHandle){
      return __persistentDir = "";
    }
    try{
      if(pdir && 0===wasm.xCallWrapped(
        'sqlite3_wasm_init_wasmfs', 'i32', ['string'], pdir
      )){
        return __persistentDir = pdir;
      }else{
        return __persistentDir = "";
      }
    }catch(e){
      
      return __persistentDir = "";
    }
  };

  
  capi.sqlite3_wasmfs_filename_is_persistent = function(name){
    const p = capi.sqlite3_wasmfs_opfs_dir();
    return (p && name) ? name.startsWith(p+'/') : false;
  };

  
  if(false && 0===wasm.exports.sqlite3_vfs_find(0)){
    
    wasm.exports.sqlite3_initialize();
  }

  
  capi.sqlite3_js_db_uses_vfs = function(pDb,vfsName,dbName="main"){
    try{
      const pK = capi.sqlite3_vfs_find(vfsName);
      if(!pK) return false;
      else if(!pDb){
        return pK===capi.sqlite3_vfs_find(0) ? pK : false;
      }else{
        return pK===capi.sqlite3_js_db_vfs(pDb) ? pK : false;
      }
    }catch(e){
      
      return false;
    }
  };

  
  capi.sqlite3_js_vfs_list = function(){
    const rc = [];
    let pVfs = capi.sqlite3_vfs_find(0);
    while(pVfs){
      const oVfs = new capi.sqlite3_vfs(pVfs);
      rc.push(wasm.cstringToJs(oVfs.$zName));
      pVfs = oVfs.$pNext;
      oVfs.dispose();
    }
    return rc;
  };

  
  capi.sqlite3_js_db_export = function(pDb){
    if(!pDb) toss('Invalid sqlite3* argument.');
    if(!wasm.bigIntEnabled) toss('BigInt64 support is not enabled.');
    const stack = wasm.pstack.pointer;
    let pOut;
    try{
      const pSize = wasm.pstack.alloc(8 + wasm.ptrSizeof);
      const ppOut = pSize + 8;
      
      let rc = wasm.exports.sqlite3_wasm_db_serialize(
        pDb, ppOut, pSize, 0
      );
      if(rc){
        toss("Database serialization failed with code",
             sqlite3.capi.sqlite3_js_rc_str(rc));
      }
      pOut = wasm.getPtrValue(ppOut);
      const nOut = wasm.getMemValue(pSize, 'i64');
      rc = nOut
        ? wasm.heap8u().slice(pOut, pOut + Number(nOut))
        : new Uint8Array();
      return rc;
    }finally{
      if(pOut) wasm.exports.sqlite3_free(pOut);
      wasm.pstack.restore(stack);
    }
  };

  
  capi.sqlite3_js_db_vfs =
    (dbPointer, dbName=0)=>wasm.sqlite3_wasm_db_vfs(dbPointer, dbName);

  
  capi.sqlite3_js_aggregate_context = (pCtx, n)=>{
    return capi.sqlite3_aggregate_context(pCtx, n)
      || (n ? WasmAllocError.toss("Cannot allocate",n,
                                  "bytes for sqlite3_aggregate_context()")
          : 0);
  };
  
  if( capi.util.isUIThread() ){
    

    
    const __kvvfsInfo = function(which){
      const rc = Object.create(null);
      rc.prefix = 'kvvfs-'+which;
      rc.stores = [];
      if('session'===which || ''===which) rc.stores.push(self.sessionStorage);
      if('local'===which || ''===which) rc.stores.push(self.localStorage);
      return rc;
    };

    
    capi.sqlite3_js_kvvfs_clear = function(which=''){
      let rc = 0;
      const kvinfo = __kvvfsInfo(which);
      kvinfo.stores.forEach((s)=>{
        const toRm = [] ;
        let i;
        for( i = 0; i < s.length; ++i ){
          const k = s.key(i);
          if(k.startsWith(kvinfo.prefix)) toRm.push(k);
        }
        toRm.forEach((kk)=>s.removeItem(kk));
        rc += toRm.length;
      });
      return rc;
    };

    
    capi.sqlite3_js_kvvfs_size = function(which=''){
      let sz = 0;
      const kvinfo = __kvvfsInfo(which);
      kvinfo.stores.forEach((s)=>{
        let i;
        for(i = 0; i < s.length; ++i){
          const k = s.key(i);
          if(k.startsWith(kvinfo.prefix)){
            sz += k.length;
            sz += s.getItem(k).length;
          }
        }
      });
      return sz * 2 ;
    };

  }


  
  const sqlite3 = {
    WasmAllocError: WasmAllocError,
    SQLite3Error: SQLite3Error,
    capi,
    config,
    
    version: Object.create(null),
    
    asyncPostInit: async function(){
      let lip = sqlite3ApiBootstrap.initializersAsync;
      delete sqlite3ApiBootstrap.initializersAsync;
      if(!lip || !lip.length) return Promise.resolve(sqlite3);
      
      
      
      lip = lip.map((f)=>{
        const p = (f instanceof Promise) ? f : f(sqlite3);
        return p.catch((e)=>{
          console.error("an async sqlite3 initializer failed:",e);
          throw e;
        });
      });
      
      
      
      return Promise.all(lip).then(()=>sqlite3);
    },
    
    scriptInfo: undefined
  };
  try{
    sqlite3ApiBootstrap.initializers.forEach((f)=>{
      f(sqlite3);
    });
  }catch(e){
    
    console.error("sqlite3 bootstrap initializer threw:",e);
    throw e;
  }
  delete sqlite3ApiBootstrap.initializers;
  sqlite3ApiBootstrap.sqlite3 = sqlite3;
  return sqlite3;
};

self.sqlite3ApiBootstrap.initializers = [];

self.sqlite3ApiBootstrap.initializersAsync = [];

self.sqlite3ApiBootstrap.defaultConfig = Object.create(null);

self.sqlite3ApiBootstrap.sqlite3 = undefined;





self.WhWasmUtilInstaller = function(target){
  'use strict';
  if(undefined===target.bigIntEnabled){
    target.bigIntEnabled = !!self['BigInt64Array'];
  }

  
  const toss = (...args)=>{throw new Error(args.join(' '))};

  if(!target.exports){
    Object.defineProperty(target, 'exports', {
      enumerable: true, configurable: true,
      get: ()=>(target.instance && target.instance.exports)
    });
  }

  
  

  
  const ptrIR = target.pointerIR || 'i32';
  const ptrSizeof = target.ptrSizeof =
        ('i32'===ptrIR ? 4
         : ('i64'===ptrIR
            ? 8 : toss("Unhandled ptrSizeof:",ptrIR)));
  
  const cache = Object.create(null);
  
  cache.heapSize = 0;
  
  cache.memory = null;
  
  cache.freeFuncIndexes = [];
  
  cache.scopedAlloc = [];

  cache.utf8Decoder = new TextDecoder();
  cache.utf8Encoder = new TextEncoder('utf-8');

  
  const heapWrappers = function(){
    if(!cache.memory){
      cache.memory = (target.memory instanceof WebAssembly.Memory)
        ? target.memory : target.exports.memory;
    }else if(cache.heapSize === cache.memory.buffer.byteLength){
      return cache;
    }
    
    const b = cache.memory.buffer;
    cache.HEAP8 = new Int8Array(b); cache.HEAP8U = new Uint8Array(b);
    cache.HEAP16 = new Int16Array(b); cache.HEAP16U = new Uint16Array(b);
    cache.HEAP32 = new Int32Array(b); cache.HEAP32U = new Uint32Array(b);
    if(target.bigIntEnabled){
      cache.HEAP64 = new BigInt64Array(b); cache.HEAP64U = new BigUint64Array(b);
    }
    cache.HEAP32F = new Float32Array(b); cache.HEAP64F = new Float64Array(b);
    cache.heapSize = b.byteLength;
    return cache;
  };

  
  target.heap8 = ()=>heapWrappers().HEAP8;

  
  target.heap8u = ()=>heapWrappers().HEAP8U;

  
  target.heap16 = ()=>heapWrappers().HEAP16;

  
  target.heap16u = ()=>heapWrappers().HEAP16U;

  
  target.heap32 = ()=>heapWrappers().HEAP32;

  
  target.heap32u = ()=>heapWrappers().HEAP32U;

  
  target.heapForSize = function(n,unsigned = false){
    let ctor;
    const c = (cache.memory && cache.heapSize === cache.memory.buffer.byteLength)
          ? cache : heapWrappers();
    switch(n){
        case Int8Array: return c.HEAP8; case Uint8Array: return c.HEAP8U;
        case Int16Array: return c.HEAP16; case Uint16Array: return c.HEAP16U;
        case Int32Array: return c.HEAP32; case Uint32Array: return c.HEAP32U;
        case 8:  return unsigned ? c.HEAP8U : c.HEAP8;
        case 16: return unsigned ? c.HEAP16U : c.HEAP16;
        case 32: return unsigned ? c.HEAP32U : c.HEAP32;
        case 64:
          if(c.HEAP64) return unsigned ? c.HEAP64U : c.HEAP64;
          break;
        default:
          if(target.bigIntEnabled){
            if(n===self['BigUint64Array']) return c.HEAP64U;
            else if(n===self['BigInt64Array']) return c.HEAP64;
            break;
          }
    }
    toss("Invalid heapForSize() size: expecting 8, 16, 32,",
         "or (if BigInt is enabled) 64.");
  };

  
  target.functionTable = function(){
    return target.exports.__indirect_function_table;
    
  };

  
  target.functionEntry = function(fptr){
    const ft = target.functionTable();
    return fptr < ft.length ? ft.get(fptr) : undefined;
  };

  
  target.jsFuncToWasm = function f(func, sig){
    
    if(!f._){
      f._ = {
        
        sigTypes: Object.assign(Object.create(null),{
          i: 'i32', p: 'i32', P: 'i32', s: 'i32',
          j: 'i64', f: 'f32', d: 'f64'
        }),
        
        typeCodes: Object.assign(Object.create(null),{
          f64: 0x7c, f32: 0x7d, i64: 0x7e, i32: 0x7f
        }),
        
        uleb128Encode: function(tgt, method, n){
          if(n<128) tgt[method](n);
          else tgt[method]( (n % 128) | 128, n>>7);
        },
        
        rxJSig: /^(\w)\((\w*)\)$/,
        
        sigParams: function(sig){
          const m = f._.rxJSig.exec(sig);
          return m ? m[2] : sig.substr(1);
        },
        
        letterType: (x)=>f._.sigTypes[x] || toss("Invalid signature letter:",x),
        
        
        
        pushSigType: (dest, letter)=>dest.push(f._.typeCodes[f._.letterType(letter)])
      };
    }
    if('string'===typeof func){
      const x = sig;
      sig = func;
      func = x;
    }
    const sigParams = f._.sigParams(sig);
    const wasmCode = [0x01, 0x60];
    f._.uleb128Encode(wasmCode, 'push', sigParams.length);
    for(const x of sigParams) f._.pushSigType(wasmCode, x);
    if('v'===sig[0]) wasmCode.push(0);
    else{
      wasmCode.push(1);
      f._.pushSigType(wasmCode, sig[0]);
    }
    f._.uleb128Encode(wasmCode, 'unshift', wasmCode.length);
    wasmCode.unshift(
      0x00, 0x61, 0x73, 0x6d, 
      0x01, 0x00, 0x00, 0x00, 
      0x01 
    );
    wasmCode.push(
       0x02, 0x07,
      
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
       0x07, 0x05,
      
      0x01, 0x01, 0x66, 0x00, 0x00
    );
    return (new WebAssembly.Instance(
      new WebAssembly.Module(new Uint8Array(wasmCode)), {
        e: { f: func }
      })).exports['f'];
  };
  
  
  target.installFunction = function f(func, sig){
    if(2!==arguments.length){
      toss("installFunction() requires exactly 2 arguments");
    }
    if('string'===typeof func){
      const x = sig;
      sig = func;
      func = x;
    }
    const ft = target.functionTable();
    const oldLen = ft.length;
    let ptr;
    while(cache.freeFuncIndexes.length){
      ptr = cache.freeFuncIndexes.pop();
      if(ft.get(ptr)){ 
        ptr = null;
        continue;
      }else{
        break;
      }
    }
    if(!ptr){
      ptr = oldLen;
      ft.grow(1);
    }
    try{
      
      ft.set(ptr, func);
      return ptr;
    }catch(e){
      if(!(e instanceof TypeError)){
        if(ptr===oldLen) cache.freeFuncIndexes.push(oldLen);
        throw e;
      }
    }
    
    try {
      ft.set(ptr, target.jsFuncToWasm(func, sig));
    }catch(e){
      if(ptr===oldLen) cache.freeFuncIndexes.push(oldLen);
      throw e;
    }
    return ptr;      
  };

  
  target.uninstallFunction = function(ptr){
    const fi = cache.freeFuncIndexes;
    const ft = target.functionTable();
    fi.push(ptr);
    const rc = ft.get(ptr);
    ft.set(ptr, null);
    return rc;
  };

  
  target.getMemValue = function(ptr, type='i8'){
    if(type.endsWith('*')) type = ptrIR;
    const c = (cache.memory && cache.heapSize === cache.memory.buffer.byteLength)
          ? cache : heapWrappers();
    switch(type){
        case 'i1':
        case 'i8': return c.HEAP8[ptr>>0];
        case 'i16': return c.HEAP16[ptr>>1];
        case 'i32': return c.HEAP32[ptr>>2];
        case 'i64':
          if(target.bigIntEnabled) return BigInt(c.HEAP64[ptr>>3]);
          break;
        case 'float': case 'f32': return c.HEAP32F[ptr>>2];
        case 'double': case 'f64': return Number(c.HEAP64F[ptr>>3]);
        default: break;
    }
    toss('Invalid type for getMemValue():',type);
  };

  
  target.setMemValue = function f(ptr, value, type='i8'){
    if (type.endsWith('*')) type = ptrIR;
    const c = (cache.memory && cache.heapSize === cache.memory.buffer.byteLength)
          ? cache : heapWrappers();
    switch (type) {
        case 'i1': 
        case 'i8': c.HEAP8[ptr>>0] = value; return f;
        case 'i16': c.HEAP16[ptr>>1] = value; return f;
        case 'i32': c.HEAP32[ptr>>2] = value; return f;
        case 'i64':
          if(c.HEAP64){
            c.HEAP64[ptr>>3] = BigInt(value);
            return f;
          }
          break;
        case 'float': case 'f32': c.HEAP32F[ptr>>2] = value; return f;
        case 'double': case 'f64': c.HEAP64F[ptr>>3] = value; return f;
    }
    toss('Invalid type for setMemValue(): ' + type);
  };


  
  target.getPtrValue = (ptr)=>target.getMemValue(ptr, ptrIR);

  
  target.setPtrValue = (ptr, value)=>target.setMemValue(ptr, value, ptrIR);

  
  target.cstrlen = function(ptr){
    if(!ptr) return null;
    const h = heapWrappers().HEAP8U;
    let pos = ptr;
    for( ; h[pos] !== 0; ++pos ){}
    return pos - ptr;
  };

  
  const __SAB = ('undefined'===typeof SharedArrayBuffer)
        ? function(){} : SharedArrayBuffer;
  const __utf8Decode = function(arrayBuffer, begin, end){
    return cache.utf8Decoder.decode(
      (arrayBuffer.buffer instanceof __SAB)
        ? arrayBuffer.slice(begin, end)
        : arrayBuffer.subarray(begin, end)
    );
  };

  
  target.cstringToJs = function(ptr){
    const n = target.cstrlen(ptr);
    return n ? __utf8Decode(heapWrappers().HEAP8U, ptr, ptr+n) : (null===n ? n : "");
  };

  
  target.jstrlen = function(str){
    
    if('string'!==typeof str) return null;
    const n = str.length;
    let len = 0;
    for(let i = 0; i < n; ++i){
      let u = str.charCodeAt(i);
      if(u>=0xd800 && u<=0xdfff){
        u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
      }
      if(u<=0x7f) ++len;
      else if(u<=0x7ff) len += 2;
      else if(u<=0xffff) len += 3;
      else len += 4;
    }
    return len;
  };

  
  target.jstrcpy = function(jstr, tgt, offset = 0, maxBytes = -1, addNul = true){
    
    if(!tgt || (!(tgt instanceof Int8Array) && !(tgt instanceof Uint8Array))){
      toss("jstrcpy() target must be an Int8Array or Uint8Array.");
    }
    if(maxBytes<0) maxBytes = tgt.length - offset;
    if(!(maxBytes>0) || !(offset>=0)) return 0;
    let i = 0, max = jstr.length;
    const begin = offset, end = offset + maxBytes - (addNul ? 1 : 0);
    for(; i < max && offset < end; ++i){
      let u = jstr.charCodeAt(i);
      if(u>=0xd800 && u<=0xdfff){
        u = 0x10000 + ((u & 0x3FF) << 10) | (jstr.charCodeAt(++i) & 0x3FF);
      }
      if(u<=0x7f){
        if(offset >= end) break;
        tgt[offset++] = u;
      }else if(u<=0x7ff){
        if(offset + 1 >= end) break;
        tgt[offset++] = 0xC0 | (u >> 6);
        tgt[offset++] = 0x80 | (u & 0x3f);
      }else if(u<=0xffff){
        if(offset + 2 >= end) break;
        tgt[offset++] = 0xe0 | (u >> 12);
        tgt[offset++] = 0x80 | ((u >> 6) & 0x3f);
        tgt[offset++] = 0x80 | (u & 0x3f);
      }else{
        if(offset + 3 >= end) break;
        tgt[offset++] = 0xf0 | (u >> 18);
        tgt[offset++] = 0x80 | ((u >> 12) & 0x3f);
        tgt[offset++] = 0x80 | ((u >> 6) & 0x3f);
        tgt[offset++] = 0x80 | (u & 0x3f);
      }
    }
    if(addNul) tgt[offset++] = 0;
    return offset - begin;
  };

  
  target.cstrncpy = function(tgtPtr, srcPtr, n){
    if(!tgtPtr || !srcPtr) toss("cstrncpy() does not accept NULL strings.");
    if(n<0) n = target.cstrlen(strPtr)+1;
    else if(!(n>0)) return 0;
    const heap = target.heap8u();
    let i = 0, ch;
    for(; i < n && (ch = heap[srcPtr+i]); ++i){
      heap[tgtPtr+i] = ch;
    }
    if(i<n) heap[tgtPtr + i++] = 0;
    return i;
  };

  
  target.jstrToUintArray = (str, addNul=false)=>{
    return cache.utf8Encoder.encode(addNul ? (str+"\0") : str);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  };

  const __affirmAlloc = (obj,funcName)=>{
    if(!(obj.alloc instanceof Function) ||
       !(obj.dealloc instanceof Function)){
      toss("Object is missing alloc() and/or dealloc() function(s)",
           "required by",funcName+"().");
    }
  };

  const __allocCStr = function(jstr, returnWithLength, allocator, funcName){
    __affirmAlloc(target, funcName);
    if('string'!==typeof jstr) return null;
    const n = target.jstrlen(jstr),
          ptr = allocator(n+1);
    target.jstrcpy(jstr, target.heap8u(), ptr, n+1, true);
    return returnWithLength ? [ptr, n] : ptr;
  };

  
  target.allocCString =
    (jstr, returnWithLength=false)=>__allocCStr(jstr, returnWithLength,
                                                target.alloc, 'allocCString()');

  
  target.scopedAllocPush = function(){
    __affirmAlloc(target, 'scopedAllocPush');
    const a = [];
    cache.scopedAlloc.push(a);
    return a;
  };

  
  target.scopedAllocPop = function(state){
    __affirmAlloc(target, 'scopedAllocPop');
    const n = arguments.length
          ? cache.scopedAlloc.indexOf(state)
          : cache.scopedAlloc.length-1;
    if(n<0) toss("Invalid state object for scopedAllocPop().");
    if(0===arguments.length) state = cache.scopedAlloc[n];
    cache.scopedAlloc.splice(n,1);
    for(let p; (p = state.pop()); ) target.dealloc(p);
  };

  
  target.scopedAlloc = function(n){
    if(!cache.scopedAlloc.length){
      toss("No scopedAllocPush() scope is active.");
    }
    const p = target.alloc(n);
    cache.scopedAlloc[cache.scopedAlloc.length-1].push(p);
    return p;
  };

  Object.defineProperty(target.scopedAlloc, 'level', {
    configurable: false, enumerable: false,
    get: ()=>cache.scopedAlloc.length,
    set: ()=>toss("The 'active' property is read-only.")
  });

  
  target.scopedAllocCString =
    (jstr, returnWithLength=false)=>__allocCStr(jstr, returnWithLength,
                                                target.scopedAlloc, 'scopedAllocCString()');

  
  const __allocMainArgv = function(isScoped, list){
    if(!list.length) toss("Cannot allocate empty array.");
    const pList = target[
      isScoped ? 'scopedAlloc' : 'alloc'
    ](list.length * target.ptrSizeof);
    let i = 0;
    list.forEach((e)=>{
      target.setPtrValue(pList + (target.ptrSizeof * i++),
                         target[
                           isScoped ? 'scopedAllocCString' : 'allocCString'
                         ](""+e));
    });
    return pList;
  };

  
  target.scopedAllocMainArgv = (list)=>__allocMainArgv(true, list);

  
  target.allocMainArgv = (list)=>__allocMainArgv(false, list);

  
  target.scopedAllocCall = function(func){
    target.scopedAllocPush();
    try{ return func() } finally{ target.scopedAllocPop() }
  };

  
  const __allocPtr = function(howMany, safePtrSize, method){
    __affirmAlloc(target, method);
    const pIr = safePtrSize ? 'i64' : ptrIR;
    let m = target[method](howMany * (safePtrSize ? 8 : ptrSizeof));
    target.setMemValue(m, 0, pIr)
    if(1===howMany){
      return m;
    }
    const a = [m];
    for(let i = 1; i < howMany; ++i){
      m += (safePtrSize ? 8 : ptrSizeof);
      a[i] = m;
      target.setMemValue(m, 0, pIr);
    }
    return a;
  };

  
  target.allocPtr =
    (howMany=1, safePtrSize=true)=>__allocPtr(howMany, safePtrSize, 'alloc');

  
  target.scopedAllocPtr =
    (howMany=1, safePtrSize=true)=>__allocPtr(howMany, safePtrSize, 'scopedAlloc');

  
  target.xGet = function(name){
    return target.exports[name] || toss("Cannot find exported symbol:",name);
  };

  const __argcMismatch =
        (f,n)=>toss(f+"() requires",n,"argument(s).");
  
  
  target.xCall = function(fname, ...args){
    const f = target.xGet(fname);
    if(!(f instanceof Function)) toss("Exported symbol",fname,"is not a function.");
    if(f.length!==args.length) __argcMismatch(fname,f.length)
    ;
    return (2===arguments.length && Array.isArray(arguments[1]))
      ? f.apply(null, arguments[1])
      : f.apply(null, args);
  };

  
  cache.xWrap = Object.create(null);
  const xcv = cache.xWrap.convert = Object.create(null);
  
  cache.xWrap.convert.arg = Object.create(null);
  
  cache.xWrap.convert.result = Object.create(null);

  if(target.bigIntEnabled){
    xcv.arg.i64 = (i)=>BigInt(i);
  }
  xcv.arg.i32 = (i)=>(i | 0);
  xcv.arg.i16 = (i)=>((i | 0) & 0xFFFF);
  xcv.arg.i8  = (i)=>((i | 0) & 0xFF);
  xcv.arg.f32 = xcv.arg.float = (i)=>Number(i).valueOf();
  xcv.arg.f64 = xcv.arg.double = xcv.arg.f32;
  xcv.arg.int = xcv.arg.i32;
  xcv.result['*'] = xcv.result['pointer'] = xcv.arg['**'] = xcv.arg[ptrIR];
  xcv.result['number'] = (v)=>Number(v);

  {
    const copyToResult = ['i8', 'i16', 'i32', 'int',
                          'f32', 'float', 'f64', 'double'];
    if(target.bigIntEnabled) copyToResult.push('i64');
    for(const t of copyToResult){
      xcv.arg[t+'*'] = xcv.result[t+'*'] = xcv.arg[ptrIR];
      xcv.result[t] = xcv.arg[t] || toss("Missing arg converter:",t);
    }
  }

  
  xcv.arg.string = xcv.arg.utf8 = xcv.arg['pointer'] = xcv.arg['*']
    = function(v){
      if('string'===typeof v) return target.scopedAllocCString(v);
      return v ? xcv.arg[ptrIR](v) : null;
    };
  xcv.result.string = xcv.result.utf8 = (i)=>target.cstringToJs(i);
  xcv.result['string:free'] = xcv.result['utf8:free'] = (i)=>{
    try { return i ? target.cstringToJs(i) : null }
    finally{ target.dealloc(i) }
  };
  xcv.result.json = (i)=>JSON.parse(target.cstringToJs(i));
  xcv.result['json:free'] = (i)=>{
    try{ return i ? JSON.parse(target.cstringToJs(i)) : null }
    finally{ target.dealloc(i) }
  }
  xcv.result['void'] = (v)=>undefined;
  xcv.result['null'] = (v)=>v;

  if(0){
    
    xcv.arg['func-ptr'] = function(v){
      if(!(v instanceof Function)) return xcv.arg[ptrIR];
      const f = target.jsFuncToWasm(v, WHAT_SIGNATURE);
    };
  }

  const __xArgAdapterCheck =
        (t)=>xcv.arg[t] || toss("Argument adapter not found:",t);

  const __xResultAdapterCheck =
        (t)=>xcv.result[t] || toss("Result adapter not found:",t);
  
  cache.xWrap.convertArg = (t,v)=>__xArgAdapterCheck(t)(v);
  cache.xWrap.convertResult =
    (t,v)=>(null===t ? v : (t ? __xResultAdapterCheck(t)(v) : undefined));

  
  target.xWrap = function(fname, resultType, ...argTypes){
    if(3===arguments.length && Array.isArray(arguments[2])){
      argTypes = arguments[2];
    }
    const xf = target.xGet(fname);
    if(argTypes.length!==xf.length) __argcMismatch(fname, xf.length);
    if((null===resultType) && 0===xf.length){
      
      return xf;
    }
    ;
    if(undefined!==resultType && null!==resultType) __xResultAdapterCheck(resultType);
    argTypes.forEach(__xArgAdapterCheck);
    if(0===xf.length){
      
      return (...args)=>(args.length
                         ? __argcMismatch(fname, xf.length)
                         : cache.xWrap.convertResult(resultType, xf.call(null)));
    }
    return function(...args){
      if(args.length!==xf.length) __argcMismatch(fname, xf.length);
      const scope = target.scopedAllocPush();
      try{
        const rc = xf.apply(null,args.map((v,i)=>cache.xWrap.convertArg(argTypes[i], v)));
        return cache.xWrap.convertResult(resultType, rc);
      }finally{
        target.scopedAllocPop(scope);
      }
    };
  };

  
  const __xAdapter = function(func, argc, typeName, adapter, modeName, xcvPart){
    if('string'===typeof typeName){
      if(1===argc) return xcvPart[typeName];
      else if(2===argc){
        if(!adapter){
          delete xcvPart[typeName];
          return func;
        }else if(!(adapter instanceof Function)){
          toss(modeName,"requires a function argument.");
        }
        xcvPart[typeName] = adapter;
        return func;
      }
    }
    toss("Invalid arguments to",modeName);
  };

  
  target.xWrap.resultAdapter = function f(typeName, adapter){
    return __xAdapter(f, arguments.length, typeName, adapter,
                      'resultAdaptor()', xcv.result);
  };

  
  target.xWrap.argAdapter = function f(typeName, adapter){
    return __xAdapter(f, arguments.length, typeName, adapter,
                      'argAdaptor()', xcv.arg);
  };

  
  target.xCallWrapped = function(fname, resultType, argTypes, ...args){
    if(Array.isArray(arguments[3])) args = arguments[3];
    return target.xWrap(fname, resultType, argTypes||[]).apply(null, args||[]);
  };

  return target;
};


self.WhWasmUtilInstaller.yawl = function(config){
  const wfetch = ()=>fetch(config.uri, {credentials: 'same-origin'});
  const wui = this;
  const finalThen = function(arg){
    
    if(config.wasmUtilTarget){
      const toss = (...args)=>{throw new Error(args.join(' '))};
      const tgt = config.wasmUtilTarget;
      tgt.module = arg.module;
      tgt.instance = arg.instance;
      
      if(!tgt.instance.exports.memory){
        
        tgt.memory = (config.imports && config.imports.env
                      && config.imports.env.memory)
          || toss("Missing 'memory' object!");
      }
      if(!tgt.alloc && arg.instance.exports.malloc){
        const exports = arg.instance.exports;
        tgt.alloc = function(n){
          return exports.malloc(n) || toss("Allocation of",n,"bytes failed.");
        };
        tgt.dealloc = function(m){exports.free(m)};
      }
      wui(tgt);
    }
    if(config.onload) config.onload(arg,config);
    return arg ;
  };
  const loadWasm = WebAssembly.instantiateStreaming
        ? function loadWasmStreaming(){
          return WebAssembly.instantiateStreaming(wfetch(), config.imports||{})
            .then(finalThen);
        }
        : function loadWasmOldSchool(){ 
          return wfetch()
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, config.imports||{}))
            .then(finalThen);
        };
  return loadWasm;
}.bind(self.WhWasmUtilInstaller);



'use strict';
self.Jaccwabyt = function StructBinderFactory(config){


  
  const toss = (...args)=>{throw new Error(args.join(' '))};

  
  if(!(config.heap instanceof WebAssembly.Memory)
     && !(config.heap instanceof Function)){
    toss("config.heap must be WebAssembly.Memory instance or a function.");
  }
  ['alloc','dealloc'].forEach(function(k){
    (config[k] instanceof Function) ||
      toss("Config option '"+k+"' must be a function.");
  });
  const SBF = StructBinderFactory;
  const heap = (config.heap instanceof Function)
        ? config.heap : (()=>new Uint8Array(config.heap.buffer)),
        alloc = config.alloc,
        dealloc = config.dealloc,
        log = config.log || console.log.bind(console),
        memberPrefix = (config.memberPrefix || ""),
        memberSuffix = (config.memberSuffix || ""),
        bigIntEnabled = (undefined===config.bigIntEnabled
                         ? !!self['BigInt64Array'] : !!config.bigIntEnabled),
        BigInt = self['BigInt'],
        BigInt64Array = self['BigInt64Array'],
        
        functionTable = config.functionTable,
        ptrSizeof = config.ptrSizeof || 4,
        ptrIR = config.ptrIR || 'i32'
  ;

  if(!SBF.debugFlags){
    SBF.__makeDebugFlags = function(deriveFrom=null){
      
      if(deriveFrom && deriveFrom.__flags) deriveFrom = deriveFrom.__flags;
      const f = function f(flags){
        if(0===arguments.length){
          return f.__flags;
        }
        if(flags<0){
          delete f.__flags.getter; delete f.__flags.setter;
          delete f.__flags.alloc; delete f.__flags.dealloc;
        }else{
          f.__flags.getter  = 0!==(0x01 & flags);
          f.__flags.setter  = 0!==(0x02 & flags);
          f.__flags.alloc   = 0!==(0x04 & flags);
          f.__flags.dealloc = 0!==(0x08 & flags);
        }
        return f._flags;
      };
      Object.defineProperty(f,'__flags', {
        iterable: false, writable: false,
        value: Object.create(deriveFrom)
      });
      if(!deriveFrom) f(0);
      return f;
    };
    SBF.debugFlags = SBF.__makeDebugFlags();
  }

  const isLittleEndian = (function() {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true );
    
    return new Int16Array(buffer)[0] === 256;
  })();
  

  
  const isFuncSig = (s)=>'('===s[1];
  
  const isPtrSig = (s)=>'p'===s || 'P'===s;
  const isAutoPtrSig = (s)=>'P'===s ;
  const sigLetter = (s)=>isFuncSig(s) ? 'p' : s[0];
  
  const sigIR = function(s){
    switch(sigLetter(s)){
        case 'i': return 'i32';
        case 'p': case 'P': case 's': return ptrIR;
        case 'j': return 'i64';
        case 'f': return 'float';
        case 'd': return 'double';
    }
    toss("Unhandled signature IR:",s);
  };
  
  const sigSizeof = function(s){
    switch(sigLetter(s)){
        case 'i': return 4;
        case 'p': case 'P': case 's': return ptrSizeof;
        case 'j': return 8;
        case 'f': return 4 ;
        case 'd': return 8;
    }
    toss("Unhandled signature sizeof:",s);
  };
  const affirmBigIntArray = BigInt64Array
        ? ()=>true : ()=>toss('BigInt64Array is not available.');
  
  
  
  const sigDVGetter = function(s){
    switch(sigLetter(s)) {
        case 'p': case 'P': case 's': {
          switch(ptrSizeof){
              case 4: return 'getInt32';
              case 8: return affirmBigIntArray() && 'getBigInt64';
          }
          break;
        }
        case 'i': return 'getInt32';
        case 'j': return affirmBigIntArray() && 'getBigInt64';
        case 'f': return 'getFloat32';
        case 'd': return 'getFloat64';
    }
    toss("Unhandled DataView getter for signature:",s);
  };
  
  const sigDVSetter = function(s){
    switch(sigLetter(s)){
        case 'p': case 'P': case 's': {
          switch(ptrSizeof){
              case 4: return 'setInt32';
              case 8: return affirmBigIntArray() && 'setBigInt64';
          }
          break;
        }
        case 'i': return 'setInt32';
        case 'j': return affirmBigIntArray() && 'setBigInt64';
        case 'f': return 'setFloat32';
        case 'd': return 'setFloat64';
    }
    toss("Unhandled DataView setter for signature:",s);
  };
  
  const sigDVSetWrapper = function(s){
    switch(sigLetter(s)) {
        case 'i': case 'f': case 'd': return Number;
        case 'j': return affirmBigIntArray() && BigInt;
        case 'p': case 'P': case 's':
          switch(ptrSizeof){
              case 4: return Number;
              case 8: return affirmBigIntArray() && BigInt;
          }
          break;
    }
    toss("Unhandled DataView set wrapper for signature:",s);
  };

  const sPropName = (s,k)=>s+'::'+k;

  const __propThrowOnSet = function(structName,propName){
    return ()=>toss(sPropName(structName,propName),"is read-only.");
  };

  
  const __ptrBacklinks = new WeakMap();
  
  const __ptrBacklinksGlobal = Object.create(null);

  
  const __instancePointerMap = new WeakMap();

  
  const xPtrPropName = '(pointer-is-external)';

  
  const __freeStruct = function(ctor, obj, m){
    if(!m) m = __instancePointerMap.get(obj);
    if(m) {
      if(obj.ondispose instanceof Function){
        try{obj.ondispose()}
        catch(e){
          
          console.warn("ondispose() for",ctor.structName,'@',
                       m,'threw. NOT propagating it.',e);
        }
      }else if(Array.isArray(obj.ondispose)){
        obj.ondispose.forEach(function(x){
          try{
            if(x instanceof Function) x.call(obj);
            else if('number' === typeof x) dealloc(x);
            
            
          }catch(e){
            console.warn("ondispose() for",ctor.structName,'@',
                         m,'threw. NOT propagating it.',e);
          }
        });
      }
      delete obj.ondispose;
      delete __ptrBacklinks.get(ctor)[m];
      delete __ptrBacklinksGlobal[m];
      __instancePointerMap.delete(obj);
      if(ctor.debugFlags.__flags.dealloc){
        log("debug.dealloc:",(obj[xPtrPropName]?"EXTERNAL":""),
            ctor.structName,"instance:",
            ctor.structInfo.sizeof,"bytes @"+m);
      }
      if(!obj[xPtrPropName]) dealloc(m);
    }
  };

  
  const rop = (v)=>{return {configurable: false, writable: false,
                            iterable: false, value: v}};

  
  const __allocStruct = function(ctor, obj, m){
    let fill = !m;
    if(m) Object.defineProperty(obj, xPtrPropName, rop(m));
    else{
      m = alloc(ctor.structInfo.sizeof);
      if(!m) toss("Allocation of",ctor.structName,"structure failed.");
    }
    try {
      if(ctor.debugFlags.__flags.alloc){
        log("debug.alloc:",(fill?"":"EXTERNAL"),
            ctor.structName,"instance:",
            ctor.structInfo.sizeof,"bytes @"+m);
      }
      if(fill) heap().fill(0, m, m + ctor.structInfo.sizeof);
      __instancePointerMap.set(obj, m);
      __ptrBacklinks.get(ctor)[m] = obj;
      __ptrBacklinksGlobal[m] = obj;
    }catch(e){
      __freeStruct(ctor, obj, m);
      throw e;
    }
  };
  
  const __memoryDump = function(){
    const p = this.pointer;
    return p
      ? new Uint8Array(heap().slice(p, p+this.structInfo.sizeof))
      : null;
  };

  const __memberKey = (k)=>memberPrefix + k + memberSuffix;
  const __memberKeyProp = rop(__memberKey);

  
  const __lookupMember = function(structInfo, memberName, tossIfNotFound=true){
    let m = structInfo.members[memberName];
    if(!m && (memberPrefix || memberSuffix)){
      
      for(const v of Object.values(structInfo.members)){
        if(v.key===memberName){ m = v; break; }
      }
      if(!m && tossIfNotFound){
        toss(sPropName(structInfo.name,memberName),'is not a mapped struct member.');
      }
    }
    return m;
  };

  
  const __memberSignature = function f(obj,memberName,emscriptenFormat=false){
    if(!f._) f._ = (x)=>x.replace(/[^vipPsjrd]/g,'').replace(/[pPs]/g,'i');
    const m = __lookupMember(obj.structInfo, memberName, true);
    return emscriptenFormat ? f._(m.signature) : m.signature;
  };

  
  const __instanceBacklinkFactory = function(ctor){
    const b = Object.create(null);
    __ptrBacklinks.set(ctor, b);
    return (ptr)=>b[ptr];
  };

  const __ptrPropDescriptor = {
    configurable: false, enumerable: false,
    get: function(){return __instancePointerMap.get(this)},
    set: ()=>toss("Cannot assign the 'pointer' property of a struct.")
    
    
    
  };

  
  const __structMemberKeys = rop(function(){
    const a = [];
    Object.keys(this.structInfo.members).forEach((k)=>a.push(this.memberKey(k)));
    return a;
  });

  const __utf8Decoder = new TextDecoder('utf-8');
  const __utf8Encoder = new TextEncoder();
  
  const __SAB = ('undefined'===typeof SharedArrayBuffer)
        ? function(){} : SharedArrayBuffer;
  const __utf8Decode = function(arrayBuffer, begin, end){
    return __utf8Decoder.decode(
      (arrayBuffer.buffer instanceof __SAB)
        ? arrayBuffer.slice(begin, end)
        : arrayBuffer.subarray(begin, end)
    );
  };
  
  const __memberIsString = function(obj,memberName, tossIfNotFound=false){
    const m = __lookupMember(obj.structInfo, memberName, tossIfNotFound);
    return (m && 1===m.signature.length && 's'===m.signature[0]) ? m : false;
  };

  
  const __affirmCStringSignature = function(member){
    if('s'===member.signature) return;
    toss("Invalid member type signature for C-string value:",
         JSON.stringify(member));
  };

  
  const __memberToJsString = function f(obj,memberName){
    const m = __lookupMember(obj.structInfo, memberName, true);
    __affirmCStringSignature(m);
    const addr = obj[m.key];
    
    if(!addr) return null;
    let pos = addr;
    const mem = heap();
    for( ; mem[pos]!==0; ++pos ) {
      
    };
    
    return (addr===pos) ? "" : __utf8Decode(mem, addr, pos);
  };

  
  const __addOnDispose = function(obj, v){
    if(obj.ondispose){
      if(obj.ondispose instanceof Function){
        obj.ondispose = [obj.ondispose];
      }
    }else{
      obj.ondispose = [];
    }
    obj.ondispose.push(v);
  };

  
  const __allocCString = function(str){
    const u = __utf8Encoder.encode(str);
    const mem = alloc(u.length+1);
    if(!mem) toss("Allocation error while duplicating string:",str);
    const h = heap();
    let i = 0;
    for( ; i < u.length; ++i ) h[mem + i] = u[i];
    h[mem + u.length] = 0;
    
    return mem;
  };

  
  const __setMemberCString = function(obj, memberName, str){
    const m = __lookupMember(obj.structInfo, memberName, true);
    __affirmCStringSignature(m);
    
    const mem = __allocCString(str);
    obj[m.key] = mem;
    __addOnDispose(obj, mem);
    return obj;
  };

  
  const StructType = function ctor(structName, structInfo){
    if(arguments[2]!==rop){
      toss("Do not call the StructType constructor",
           "from client-level code.");
    }
    Object.defineProperties(this,{
      
      structName: rop(structName),
      structInfo: rop(structInfo)
    });
  };

  
  StructType.prototype = Object.create(null, {
    dispose: rop(function(){__freeStruct(this.constructor, this)}),
    lookupMember: rop(function(memberName, tossIfNotFound=true){
      return __lookupMember(this.structInfo, memberName, tossIfNotFound);
    }),
    memberToJsString: rop(function(memberName){
      return __memberToJsString(this, memberName);
    }),
    memberIsString: rop(function(memberName, tossIfNotFound=true){
      return __memberIsString(this, memberName, tossIfNotFound);
    }),
    memberKey: __memberKeyProp,
    memberKeys: __structMemberKeys,
    memberSignature: rop(function(memberName, emscriptenFormat=false){
      return __memberSignature(this, memberName, emscriptenFormat);
    }),
    memoryDump: rop(__memoryDump),
    pointer: __ptrPropDescriptor,
    setMemberCString: rop(function(memberName, str){
      return __setMemberCString(this, memberName, str);
    })
  });

  
  Object.defineProperties(StructType, {
    allocCString: rop(__allocCString),
    instanceForPointer: rop((ptr)=>__ptrBacklinksGlobal[ptr]),
    isA: rop((v)=>v instanceof StructType),
    hasExternalPointer: rop((v)=>(v instanceof StructType) && !!v[xPtrPropName]),
    memberKey: __memberKeyProp
  });

  const isNumericValue = (v)=>Number.isFinite(v) || (v instanceof (BigInt || Number));

  
  const makeMemberWrapper = function f(ctor,name, descr){
    if(!f._){
      
      f._ = {getters: {}, setters: {}, sw:{}};
      const a = ['i','p','P','s','f','d','v()'];
      if(bigIntEnabled) a.push('j');
      a.forEach(function(v){
        
        f._.getters[v] = sigDVGetter(v) ;
        f._.setters[v] = sigDVSetter(v) ;
        f._.sw[v] = sigDVSetWrapper(v)  ;
      });
      const rxSig1 = /^[ipPsjfd]$/,
            rxSig2 = /^[vipPsjfd]\([ipPsjfd]*\)$/;
      f.sigCheck = function(obj, name, key,sig){
        if(Object.prototype.hasOwnProperty.call(obj, key)){
          toss(obj.structName,'already has a property named',key+'.');
        }
        rxSig1.test(sig) || rxSig2.test(sig)
          || toss("Malformed signature for",
                  sPropName(obj.structName,name)+":",sig);
      };
    }
    const key = ctor.memberKey(name);
    f.sigCheck(ctor.prototype, name, key, descr.signature);
    descr.key = key;
    descr.name = name;
    const sizeOf = sigSizeof(descr.signature);
    const sigGlyph = sigLetter(descr.signature);
    const xPropName = sPropName(ctor.prototype.structName,key);
    const dbg = ctor.prototype.debugFlags.__flags;
    
    const prop = Object.create(null);
    prop.configurable = false;
    prop.enumerable = false;
    prop.get = function(){
      if(dbg.getter){
        log("debug.getter:",f._.getters[sigGlyph],"for", sigIR(sigGlyph),
            xPropName,'@', this.pointer,'+',descr.offset,'sz',sizeOf);
      }
      let rc = (
        new DataView(heap().buffer, this.pointer + descr.offset, sizeOf)
      )[f._.getters[sigGlyph]](0, isLittleEndian);
      if(dbg.getter) log("debug.getter:",xPropName,"result =",rc);
      if(rc && isAutoPtrSig(descr.signature)){
        rc = StructType.instanceForPointer(rc) || rc;
        if(dbg.getter) log("debug.getter:",xPropName,"resolved =",rc);
      }                
      return rc;
    };
    if(descr.readOnly){
      prop.set = __propThrowOnSet(ctor.prototype.structName,key);
    }else{
      prop.set = function(v){
        if(dbg.setter){
          log("debug.setter:",f._.setters[sigGlyph],"for", sigIR(sigGlyph),
              xPropName,'@', this.pointer,'+',descr.offset,'sz',sizeOf, v);
        }
        if(!this.pointer){
          toss("Cannot set struct property on disposed instance.");
        }
        if(null===v) v = 0;
        else while(!isNumericValue(v)){
          if(isAutoPtrSig(descr.signature) && (v instanceof StructType)){
            
            v = v.pointer || 0;
            if(dbg.setter) log("debug.setter:",xPropName,"resolved to",v);
            break;
          }
          toss("Invalid value for pointer-type",xPropName+'.');
        }
        (
          new DataView(heap().buffer, this.pointer + descr.offset, sizeOf)
        )[f._.setters[sigGlyph]](0, f._.sw[sigGlyph](v), isLittleEndian);
      };
    }
    Object.defineProperty(ctor.prototype, key, prop);
  };
  
  
  const StructBinder = function StructBinder(structName, structInfo){
    if(1===arguments.length){
      structInfo = structName;
      structName = structInfo.name;
    }else if(!structInfo.name){
      structInfo.name = structName;
    }
    if(!structName) toss("Struct name is required.");
    let lastMember = false;
    Object.keys(structInfo.members).forEach((k)=>{
      const m = structInfo.members[k];
      if(!m.sizeof) toss(structName,"member",k,"is missing sizeof.");
      else if(0!==(m.sizeof%4)){
        toss(structName,"member",k,"sizeof is not aligned.");
      }
      else if(0!==(m.offset%4)){
        toss(structName,"member",k,"offset is not aligned.");
      }
      if(!lastMember || lastMember.offset < m.offset) lastMember = m;
    });
    if(!lastMember) toss("No member property descriptions found.");
    else if(structInfo.sizeof < lastMember.offset+lastMember.sizeof){
      toss("Invalid struct config:",structName,
           "max member offset ("+lastMember.offset+") ",
           "extends past end of struct (sizeof="+structInfo.sizeof+").");
    }
    const debugFlags = rop(SBF.__makeDebugFlags(StructBinder.debugFlags));
    
    const StructCtor = function StructCtor(externalMemory){
      if(!(this instanceof StructCtor)){
        toss("The",structName,"constructor may only be called via 'new'.");
      }else if(arguments.length){
        if(externalMemory!==(externalMemory|0) || externalMemory<=0){
          toss("Invalid pointer value for",structName,"constructor.");
        }
        __allocStruct(StructCtor, this, externalMemory);
      }else{
        __allocStruct(StructCtor, this);
      }
    };
    Object.defineProperties(StructCtor,{
      debugFlags: debugFlags,
      disposeAll: rop(function(){
        const map = __ptrBacklinks.get(StructCtor);
        Object.keys(map).forEach(function(ptr){
          const b = map[ptr];
          if(b) __freeStruct(StructCtor, b, ptr);
        });
        __ptrBacklinks.set(StructCtor, Object.create(null));
        return StructCtor;
      }),
      instanceForPointer: rop(__instanceBacklinkFactory(StructCtor)),
      isA: rop((v)=>v instanceof StructCtor),
      memberKey: __memberKeyProp,
      memberKeys: __structMemberKeys,
      resolveToInstance: rop(function(v, throwIfNot=false){
        if(!(v instanceof StructCtor)){
          v = Number.isSafeInteger(v)
            ? StructCtor.instanceForPointer(v) : undefined;
        }
        if(!v && throwIfNot) toss("Value is-not-a",StructCtor.structName);
        return v;
      }),
      methodInfoForKey: rop(function(mKey){
      }),
      structInfo: rop(structInfo),
      structName: rop(structName)
    });
    StructCtor.prototype = new StructType(structName, structInfo, rop);
    Object.defineProperties(StructCtor.prototype,{
      debugFlags: debugFlags,
      constructor: rop(StructCtor)
      
    });
    Object.keys(structInfo.members).forEach(
      (name)=>makeMemberWrapper(StructCtor, name, structInfo.members[name])
    );
    return StructCtor;
  };
  StructBinder.instanceForPointer = StructType.instanceForPointer;
  StructBinder.StructType = StructType;
  StructBinder.config = config;
  StructBinder.allocCString = __allocCString;
  if(!StructBinder.debugFlags){
    StructBinder.debugFlags = SBF.__makeDebugFlags(SBF.debugFlags);
  }
  return StructBinder;
};



self.sqlite3ApiBootstrap.initializers.push(function(sqlite3){
  'use strict';
  const toss = (...args)=>{throw new Error(args.join(' '))};
  const toss3 = sqlite3.SQLite3Error.toss;
  const capi = sqlite3.capi, wasm = capi.wasm, util = capi.util;
  self.WhWasmUtilInstaller(capi.wasm);
  delete self.WhWasmUtilInstaller;

  
  sqlite3.StructBinder = self.Jaccwabyt({
    heap: 0 ? wasm.memory : wasm.heap8u,
    alloc: wasm.alloc,
    dealloc: wasm.dealloc,
    functionTable: wasm.functionTable,
    bigIntEnabled: wasm.bigIntEnabled,
    memberPrefix: '$'
  });
  delete self.Jaccwabyt;

  if(0){
    
    const argPointer = wasm.xWrap.argAdapter('*');
    wasm.xWrap.argAdapter('StructType', (v)=>{
      if(v && v.constructor && v instanceof StructBinder.StructType){
        v = v.pointer;
      }
      return (v === (v | 0) )
        ? argPointer(v)
        : toss("Invalid (object) type for StructType-type argument.");
    });
  }

  if(1){
    const xString = wasm.xWrap.argAdapter('string');
    wasm.xWrap.argAdapter(
      'flexible-string', (v)=>xString(util.flexibleString(v))
    );
  }
  
  if(1){
    
    const aPtr = wasm.xWrap.argAdapter('*');
    wasm.xWrap.argAdapter('sqlite3*', aPtr)
    ('sqlite3_stmt*', aPtr)
    ('sqlite3_context*', aPtr)
    ('sqlite3_value*', aPtr)
    ('sqlite3_vfs*', aPtr)
    ('void*', aPtr);
    wasm.xWrap.resultAdapter('sqlite3*', aPtr)
    ('sqlite3_context*', aPtr)
    ('sqlite3_stmt*', aPtr)
    ('sqlite3_vfs*', aPtr)
    ('void*', aPtr);

    
    for(const e of wasm.bindingSignatures){
      capi[e[0]] = wasm.xWrap.apply(null, e);
    }
    for(const e of wasm.bindingSignatures.wasm){
      capi.wasm[e[0]] = wasm.xWrap.apply(null, e);
    }

    
    const fI64Disabled = function(fname){
      return ()=>toss(fname+"() disabled due to lack",
                      "of BigInt support in this build.");
    };
    for(const e of wasm.bindingSignatures.int64){
      capi[e[0]] = wasm.bigIntEnabled
        ? wasm.xWrap.apply(null, e)
        : fI64Disabled(e[0]);
    }

    if(wasm.exports.sqlite3_wasm_db_error){
      util.sqlite3_wasm_db_error = capi.wasm.xWrap(
        'sqlite3_wasm_db_error', 'int', 'sqlite3*', 'int', 'string'
      );
    }else{
      util.sqlite3_wasm_db_error = function(pDb,errCode,msg){
        console.warn("sqlite3_wasm_db_error() is not exported.",arguments);
        return errCode;
      };
    }

    
    capi.sqlite3_vfs_register.addReference = function f(...args){
      if(!f._) f._ = [];
      f._.push(...args);
    };

  };

  
  const __dbArgcMismatch = (pDb,f,n)=>{
    return sqlite3.util.sqlite3_wasm_db_error(pDb, capi.SQLITE_MISUSE,
                                              f+"() requires "+n+" argument"+
                                              (1===n?'':'s')+".");
  };

  
  const __flexiString = function(v,n){
    if('string'===typeof v){
      n = -1;
    }else if(util.isSQLableTypedArray(v)){
      n = v.byteLength;
      v = util.typedArrayToString(v);
    }else if(Array.isArray(v)){
      v = v.join('');
      n = -1;
    }
    return [v, n];
  };

  if(1){
    const __exec = wasm.xWrap("sqlite3_exec", "int",
                              ["sqlite3*", "flexible-string", "*", "*", "**"]);
    
    capi.sqlite3_exec = function f(pDb, sql, callback, pVoid, pErrMsg){
      if(f.length!==arguments.length){
        return __dbArgcMismatch(pDb,"sqlite3_exec",f.length);
      }else if('function' !== typeof callback){
        return __exec(pDb, sql, callback, pVoid, pErrMsg);
      }
      
      const wasm = capi.wasm;
      const cbwrap = function(pVoid, nCols, pColVals, pColNames){
        let rc = capi.SQLITE_ERROR;
        try {
          let aVals = [], aNames = [], i = 0, offset = 0;
          for( ; i < nCols; offset += (wasm.ptrSizeof * ++i) ){
            aVals.push( wasm.cstringToJs(wasm.getPtrValue(pColVals + offset)) );
            aNames.push( wasm.cstringToJs(wasm.getPtrValue(pColNames + offset)) );
          }
          rc = callback(pVoid, nCols, aVals, aNames) | 0;
          
        }catch(e){
          
        }
        return rc;
      };
      let pFunc, rc;
      try{
        pFunc = wasm.installFunction("ipipp", cbwrap);
        rc = __exec(pDb, sql, pFunc, pVoid, pErrMsg);
      }catch(e){
        rc = util.sqlite3_wasm_db_error(pDb, capi.SQLITE_ERROR,
                                        "Error running exec(): "+e.message);
      }finally{
        if(pFunc) wasm.uninstallFunction(pFunc);
      }
      return rc;
    };
  };

  if(1){
    const sqlite3CreateFunction = wasm.xWrap(
      "sqlite3_create_function_v2", "int",
      ["sqlite3*", "string", "int",
       "int", "*",
       "*","*", "*", "*"]
    );
    const sqlite3CreateWindowFunction = wasm.xWrap(
      "sqlite3_create_window_function", "int",
      ["sqlite3*", "string", "int",
       "int", "*",
       "*","*", "*",
       "*", "*"]
    );

    const __udfSetResult = function(pCtx, val){
      
      switch(typeof val) {
          case 'undefined':
            
            break;
          case 'boolean':
            capi.sqlite3_result_int(pCtx, val ? 1 : 0);
            break;
          case 'bigint':
            if(wasm.bigIntEnabled){
              if(util.bigIntFits64(val)) capi.sqlite3_result_int64(pCtx, val);
              else toss3("BigInt value",val.toString(),"is too BigInt for int64.");
            }else if(util.bigIntFits32(val)){
              capi.sqlite3_result_int(pCtx, Number(val));
            }else if(util.bigIntFitsDouble(val)){
              capi.sqlite3_result_double(pCtx, Number(val));
            }else{
              toss3("BigInt value",val.toString(),"is too BigInt.");
            }
            break;
          case 'number': {
            (util.isInt32(val)
             ? capi.sqlite3_result_int
             : capi.sqlite3_result_double)(pCtx, val);
            break;
          }
          case 'string':
            capi.sqlite3_result_text(pCtx, val, -1, capi.SQLITE_TRANSIENT);
            break;
          case 'object':
            if(null===val) {
              capi.sqlite3_result_null(pCtx);
              break;
            }else if(util.isBindableTypedArray(val)){
              const pBlob = wasm.allocFromTypedArray(val);
              capi.sqlite3_result_blob(
                pCtx, pBlob, val.byteLength,
                wasm.exports[sqlite3.config.deallocExportName]
              );
              break;
            }
            
          default:
          toss3("Don't not how to handle this UDF result value:",(typeof val), val);
      };
    };

    const __udfConvertArgs = function(argc, pArgv){
      let i, pVal, valType, arg;
      const tgt = [];
      for(i = 0; i < argc; ++i){
        pVal = wasm.getPtrValue(pArgv + (wasm.ptrSizeof * i));
                    
        valType = capi.sqlite3_value_type(pVal);
        switch(valType){
            case capi.SQLITE_INTEGER:
              if(wasm.bigIntEnabled){
                arg = capi.sqlite3_value_int64(pVal);
                if(util.bigIntFitsDouble(arg)) arg = Number(arg);
              }
              else arg = capi.sqlite3_value_double(pVal);
              break;
            case capi.SQLITE_FLOAT:
              arg = capi.sqlite3_value_double(pVal);
              break;
            case capi.SQLITE_TEXT:
              arg = capi.sqlite3_value_text(pVal);
              break;
            case capi.SQLITE_BLOB:{
              const n = capi.sqlite3_value_bytes(pVal);
              const pBlob = capi.sqlite3_value_blob(pVal);
              if(n && !pBlob) sqlite3.WasmAllocError.toss(
                "Cannot allocate memory for blob argument of",n,"byte(s)"
              );
              arg = n ? wasm.heap8u().slice(pBlob, pBlob + Number(n)) : null;
              break;
            }
            case capi.SQLITE_NULL:
              arg = null; break;
            default:
              toss3("Unhandled sqlite3_value_type()",valType,
                    "is possibly indicative of incorrect",
                    "pointer size assumption.");
        }
        tgt.push(arg);
      }
      return tgt;
    };

    const __udfSetError = (pCtx, e)=>{
      if(e instanceof sqlite3.WasmAllocError){
        capi.sqlite3_result_error_nomem(pCtx);
      }else{
        const msg = ('string'===typeof e) ? e : e.message;
        capi.sqlite3_result_error(pCtx, msg, -1);
      }
    };

    const __xFunc = function(callback){
      return function(pCtx, argc, pArgv){
        try{ __udfSetResult(pCtx, callback(pCtx, ...__udfConvertArgs(argc, pArgv))) }
        catch(e){
          
          __udfSetError(pCtx, e);
        }
      };
    };

    const __xInverseAndStep = function(callback){
      return function(pCtx, argc, pArgv){
        try{ callback(pCtx, ...__udfConvertArgs(argc, pArgv)) }
        catch(e){ __udfSetError(pCtx, e) }
      };
    };

    const __xFinalAndValue = function(callback){
      return function(pCtx){
        try{ __udfSetResult(pCtx, callback(pCtx)) }
        catch(e){ __udfSetError(pCtx, e) }
      };
    };

    const __xDestroy = function(callback){
      return function(pVoid){
        try{ callback(pVoid) }
        catch(e){ console.error("UDF xDestroy method threw:",e) }
      };
    };

    const __xMap = Object.assign(Object.create(null), {
      xFunc:    {sig:'v(pip)', f:__xFunc},
      xStep:    {sig:'v(pip)', f:__xInverseAndStep},
      xInverse: {sig:'v(pip)', f:__xInverseAndStep},
      xFinal:   {sig:'v(p)',   f:__xFinalAndValue},
      xValue:   {sig:'v(p)',   f:__xFinalAndValue},
      xDestroy: {sig:'v(p)',   f:__xDestroy}
    });

    const __xWrapFuncs = function(theFuncs, tgtUninst){
      const rc = []
      let k;
      for(k in theFuncs){
        let fArg = theFuncs[k];
        if('function'===typeof fArg){
          const w = __xMap[k];
          fArg = wasm.installFunction(w.sig, w.f(fArg));
          tgtUninst.push(fArg);
        }
        rc.push(fArg);
      }
      return rc;
    };

    
    capi.sqlite3_create_function_v2 = function f(
      pDb, funcName, nArg, eTextRep, pApp,
      xFunc,   
      xStep,   
      xFinal,  
      xDestroy 
    ){
      if(f.length!==arguments.length){
        return __dbArgcMismatch(pDb,"sqlite3_create_function_v2",f.length);
      }
      
      const wasm = capi.wasm;
      const uninstall = [];
      let rc;
      try{
        const funcArgs =  __xWrapFuncs({xFunc, xStep, xFinal, xDestroy},
                                       uninstall);
        rc = sqlite3CreateFunction(pDb, funcName, nArg, eTextRep,
                                   pApp, ...funcArgs);
      }catch(e){
        console.error("sqlite3_create_function_v2() setup threw:",e);
        for(let v of uninstall){
          wasm.uninstallFunction(v);
        }
        rc = util.sqlite3_wasm_db_error(pDb, capi.SQLITE_ERROR,
                                        "Creation of UDF threw: "+e.message);
      }
      return rc;
    };

    capi.sqlite3_create_function = function f(
      pDb, funcName, nArg, eTextRep, pApp,
      xFunc, xStep, xFinal
    ){
      return (f.length===arguments.length)
        ? capi.sqlite3_create_function_v2(pDb, funcName, nArg, eTextRep,
                                          pApp, xFunc, xStep, xFinal, 0)
        : __dbArgcMismatch(pDb,"sqlite3_create_function",f.length);
    };

    
    capi.sqlite3_create_window_function = function f(
      pDb, funcName, nArg, eTextRep, pApp,
      xStep,   
      xFinal,  
      xValue,  
      xInverse,
      xDestroy 
    ){
      if(f.length!==arguments.length){
        return __dbArgcMismatch(pDb,"sqlite3_create_window_function",f.length);
      }
      
      const wasm = capi.wasm;
      const uninstall = [];
      let rc;
      try{
        const funcArgs = __xWrapFuncs({xStep, xFinal, xValue, xInverse, xDestroy},
                                      uninstall);
        rc = sqlite3CreateWindowFunction(pDb, funcName, nArg, eTextRep,
                                         pApp, ...funcArgs);
      }catch(e){
        console.error("sqlite3_create_window_function() setup threw:",e);
        for(let v of uninstall){
          wasm.uninstallFunction(v);
        }
        rc = util.sqlite3_wasm_db_error(pDb, capi.SQLITE_ERROR,
                                        "Creation of UDF threw: "+e.message);
      }
      return rc;
    };
    
    capi.sqlite3_create_function_v2.udfSetResult =
      capi.sqlite3_create_function.udfSetResult =
      capi.sqlite3_create_window_function.udfSetResult = __udfSetResult;

    
    capi.sqlite3_create_function_v2.udfConvertArgs =
      capi.sqlite3_create_function.udfConvertArgs =
      capi.sqlite3_create_window_function.udfConvertArgs = __udfConvertArgs;

    
    capi.sqlite3_create_function_v2.udfSetError =
      capi.sqlite3_create_function.udfSetError =
      capi.sqlite3_create_window_function.udfSetError = __udfSetError;

  };

  if(1){
    
    const __prepare = Object.create(null);
    
    __prepare.basic = wasm.xWrap('sqlite3_prepare_v3',
                                 "int", ["sqlite3*", "string",
                                         "int",
                                         "int", "**",
                                         "**"]);
    
    __prepare.full = wasm.xWrap('sqlite3_prepare_v3',
                                "int", ["sqlite3*", "*", "int", "int",
                                        "**", "**"]);

    
    capi.sqlite3_prepare_v3 = function f(pDb, sql, sqlLen, prepFlags, ppStmt, pzTail){
      if(f.length!==arguments.length){
        return __dbArgcMismatch(pDb,"sqlite3_prepare_v3",f.length);
      }
      const [xSql, xSqlLen] = __flexiString(sql, sqlLen);
      switch(typeof xSql){
          case 'string': return __prepare.basic(pDb, xSql, xSqlLen, prepFlags, ppStmt, null);
          case 'number': return __prepare.full(pDb, xSql, xSqlLen, prepFlags, ppStmt, pzTail);
          default:
            return util.sqlite3_wasm_db_error(
              pDb, capi.SQLITE_MISUSE,
              "Invalid SQL argument type for sqlite3_prepare_v2/v3()."
            );
      }
    };

    
    capi.sqlite3_prepare_v2 = function f(pDb, sql, sqlLen, ppStmt, pzTail){
      return (f.length===arguments.length)
        ? capi.sqlite3_prepare_v3(pDb, sql, sqlLen, 0, ppStmt, pzTail)
        : __dbArgcMismatch(pDb,"sqlite3_prepare_v2",f.length);
    };
  };

  {
    const cJson = wasm.xCall('sqlite3_wasm_enum_json');
    if(!cJson){
      toss("Maintenance required: increase sqlite3_wasm_enum_json()'s",
           "static buffer size!");
    }
    wasm.ctype = JSON.parse(wasm.cstringToJs(cJson));
    
    for(const t of ['access', 'blobFinalizers', 'dataTypes',
                    'encodings', 'fcntl', 'flock', 'ioCap',
                    'openFlags', 'prepareFlags', 'resultCodes',
                    'serialize', 'syncFlags', 'trace', 'udfFlags',
                    'version'
                   ]){
      for(const e of Object.entries(wasm.ctype[t])){
        
        
        capi[e[0]] = e[1];
      }
    }
    const __rcMap = Object.create(null);
    for(const t of ['resultCodes']){
      for(const e of Object.entries(wasm.ctype[t])){
        __rcMap[e[1]] = e[0];
      }
    }
    
    capi.sqlite3_js_rc_str = (rc)=>__rcMap[rc];
    
    const notThese = Object.assign(Object.create(null),{
      
      WasmTestStruct: true
    });
    if(!util.isUIThread()){
      
      notThese.sqlite3_kvvfs_methods = true;
    }
    for(const s of wasm.ctype.structs){
      if(!notThese[s.name]){
        capi[s.name] = sqlite3.StructBinder(s);
      }
    }
  }

  const pKvvfs = capi.sqlite3_vfs_find("kvvfs");
  if( pKvvfs ){
    if(util.isUIThread()){
      const kvvfsMethods = new capi.sqlite3_kvvfs_methods(
        wasm.exports.sqlite3_wasm_kvvfs_methods()
      );
      delete capi.sqlite3_kvvfs_methods;

      const kvvfsMakeKey = wasm.exports.sqlite3_wasm_kvvfsMakeKeyOnPstack,
            pstack = wasm.pstack,
            pAllocRaw = wasm.exports.sqlite3_wasm_pstack_alloc;

      const kvvfsStorage = (zClass)=>
            ((115===wasm.getMemValue(zClass))
             ? sessionStorage : localStorage);
      
      const kvvfsImpls = {
        xRead: (zClass, zKey, zBuf, nBuf)=>{
          const stack = pstack.pointer,
                astack = wasm.scopedAllocPush();
          try {
            const zXKey = kvvfsMakeKey(zClass,zKey);
            if(!zXKey) return -3;
            const jKey = wasm.cstringToJs(zXKey);
            const jV = kvvfsStorage(zClass).getItem(jKey);
            if(!jV) return -1;
            const nV = jV.length ;
            if(nBuf<=0) return nV;
            else if(1===nBuf){
              wasm.setMemValue(zBuf, 0);
              return nV;
            }
            const zV = wasm.scopedAllocCString(jV);
            if(nBuf > nV + 1) nBuf = nV + 1;
            wasm.heap8u().copyWithin(zBuf, zV, zV + nBuf - 1);
            wasm.setMemValue(zBuf + nBuf - 1, 0);
            return nBuf - 1;
          }catch(e){
            console.error("kvstorageRead()",e);
            return -2;
          }finally{
            pstack.restore(stack);
            wasm.scopedAllocPop(astack);
          }
        },
        xWrite: (zClass, zKey, zData)=>{
          const stack = pstack.pointer;
          try {
            const zXKey = kvvfsMakeKey(zClass,zKey);
            if(!zXKey) return 1;
            const jKey = wasm.cstringToJs(zXKey);
            kvvfsStorage(zClass).setItem(jKey, wasm.cstringToJs(zData));
            return 0;
          }catch(e){
            console.error("kvstorageWrite()",e);
            return capi.SQLITE_IOERR;
          }finally{
            pstack.restore(stack);
          }
        },
        xDelete: (zClass, zKey)=>{
          const stack = pstack.pointer;
          try {
            const zXKey = kvvfsMakeKey(zClass,zKey);
            if(!zXKey) return 1;
            kvvfsStorage(zClass).removeItem(wasm.cstringToJs(zXKey));
            return 0;
          }catch(e){
            console.error("kvstorageDelete()",e);
            return capi.SQLITE_IOERR;
          }finally{
            pstack.restore(stack);
          }
        }
      };
      for(let k of Object.keys(kvvfsImpls)){
        kvvfsMethods[kvvfsMethods.memberKey(k)] =
          wasm.installFunction(
            kvvfsMethods.memberSignature(k),
            kvvfsImpls[k]
          );
      }
    }else{
      
      capi.sqlite3_vfs_unregister(pKvvfs);
    }
  }

});


self.sqlite3ApiBootstrap.initializers.push(function(sqlite3){
  sqlite3.version = {"libVersion": "3.40.0", "libVersionNumber": 3040000, "sourceId": "2022-10-25 16:04:44 ff4fc29c38b78dfd471e25942304cba352469d6018f1c09158172795dbdd438c","downloadVersion": 3400000};
});



self.sqlite3ApiBootstrap.initializers.push(function(sqlite3){
  const toss = (...args)=>{throw new Error(args.join(' '))};
  const toss3 = (...args)=>{throw new sqlite3.SQLite3Error(...args)};

  const capi = sqlite3.capi, wasm = capi.wasm, util = capi.util;
  

  
  const __ptrMap = new WeakMap();
  
  const __stmtMap = new WeakMap();

  
  const getOwnOption = (opts, p, dflt)=>{
    const d = Object.getOwnPropertyDescriptor(opts,p);
    return d ? d.value : dflt;
  };

  
  const checkSqlite3Rc = function(dbPtr, sqliteResultCode){
    if(sqliteResultCode){
      if(dbPtr instanceof DB) dbPtr = dbPtr.pointer;
      toss3(
        "sqlite result code",sqliteResultCode+":",
        (dbPtr
         ? capi.sqlite3_errmsg(dbPtr)
         : capi.sqlite3_errstr(sqliteResultCode))
      );
    }
  };

  
  const __dbTraceToConsole =
        wasm.installFunction('i(ippp)', function(t,c,p,x){
          if(capi.SQLITE_TRACE_STMT===t){
            
            console.log("SQL TRACE #"+(++this.counter),
                        wasm.cstringToJs(x));
          }
        }.bind({counter: 0}));

  
  const __vfsPostOpenSql = Object.create(null);

  
  const dbCtorHelper = function ctor(...args){
    if(!ctor._name2vfs){
      
      ctor._name2vfs = Object.create(null);
      const isWorkerThread = ('function'===typeof importScripts)
            ? (n)=>toss3("The VFS for",n,"is only available in the main window thread.")
            : false;
      ctor._name2vfs[':localStorage:'] = {
        vfs: 'kvvfs', filename: isWorkerThread || (()=>'local')
      };
      ctor._name2vfs[':sessionStorage:'] = {
        vfs: 'kvvfs', filename: isWorkerThread || (()=>'session')
      };
    }
    const opt = ctor.normalizeArgs(...args);
    let fn = opt.filename, vfsName = opt.vfs, flagsStr = opt.flags;
    if(('string'!==typeof fn && 'number'!==typeof fn)
       || 'string'!==typeof flagsStr
       || (vfsName && ('string'!==typeof vfsName && 'number'!==typeof vfsName))){
      console.error("Invalid DB ctor args",opt,arguments);
      toss3("Invalid arguments for DB constructor.");
    }
    let fnJs = ('number'===typeof fn) ? wasm.cstringToJs(fn) : fn;
    const vfsCheck = ctor._name2vfs[fnJs];
    if(vfsCheck){
      vfsName = vfsCheck.vfs;
      fn = fnJs = vfsCheck.filename(fnJs);
    }
    let pDb, oflags = 0;
    if( flagsStr.indexOf('c')>=0 ){
      oflags |= capi.SQLITE_OPEN_CREATE | capi.SQLITE_OPEN_READWRITE;
    }
    if( flagsStr.indexOf('w')>=0 ) oflags |= capi.SQLITE_OPEN_READWRITE;
    if( 0===oflags ) oflags |= capi.SQLITE_OPEN_READONLY;
    oflags |= capi.SQLITE_OPEN_EXRESCODE;
    const stack = wasm.pstack.pointer;
    try {
      const pPtr = wasm.pstack.allocPtr() ;
      let rc = capi.sqlite3_open_v2(fn, pPtr, oflags, vfsName || 0);
      pDb = wasm.getPtrValue(pPtr);
      checkSqlite3Rc(pDb, rc);
      if(flagsStr.indexOf('t')>=0){
        capi.sqlite3_trace_v2(pDb, capi.SQLITE_TRACE_STMT,
                              __dbTraceToConsole, 0);
      }
      
      const pVfs = capi.sqlite3_js_db_vfs(pDb);
      
      if(!pVfs) toss3("Internal error: cannot get VFS for new db handle.");
      const postInitSql = __vfsPostOpenSql[pVfs];
      if(postInitSql){
        rc = capi.sqlite3_exec(pDb, postInitSql, 0, 0, 0);
        checkSqlite3Rc(pDb, rc);
      }      
    }catch( e ){
      if( pDb ) capi.sqlite3_close_v2(pDb);
      throw e;
    }finally{
      wasm.pstack.restore(stack);
    }
    this.filename = fnJs;
    __ptrMap.set(this, pDb);
    __stmtMap.set(this, Object.create(null));
  };

  
  dbCtorHelper.setVfsPostOpenSql = function(pVfs, sql){
    __vfsPostOpenSql[pVfs] = sql;
  };

  
  dbCtorHelper.normalizeArgs = function(filename=':memory:',flags = 'c',vfs = null){
    const arg = {};
    if(1===arguments.length && 'object'===typeof arguments[0]){
      const x = arguments[0];
      Object.keys(x).forEach((k)=>arg[k] = x[k]);
      if(undefined===arg.flags) arg.flags = 'c';
      if(undefined===arg.vfs) arg.vfs = null;
      if(undefined===arg.filename) arg.filename = ':memory:';
    }else{
      arg.filename = filename;
      arg.flags = flags;
      arg.vfs = vfs;
    }
    return arg;
  };
  
  const DB = function(...args){
    dbCtorHelper.apply(this, args);
  };

  
  const BindTypes = {
    null: 1,
    number: 2,
    string: 3,
    boolean: 4,
    blob: 5
  };
  BindTypes['undefined'] == BindTypes.null;
  if(wasm.bigIntEnabled){
    BindTypes.bigint = BindTypes.number;
  }

  
  const Stmt = function(){
    if(BindTypes!==arguments[2]){
      toss3("Do not call the Stmt constructor directly. Use DB.prepare().");
    }
    this.db = arguments[0];
    __ptrMap.set(this, arguments[1]);
    this.columnCount = capi.sqlite3_column_count(this.pointer);
    this.parameterCount = capi.sqlite3_bind_parameter_count(this.pointer);
  };

  
  const affirmDbOpen = function(db){
    if(!db.pointer) toss3("DB has been closed.");
    return db;
  };

  
  const affirmColIndex = function(stmt,ndx){
    if((ndx !== (ndx|0)) || ndx<0 || ndx>=stmt.columnCount){
      toss3("Column index",ndx,"is out of range.");
    }
    return stmt;
  };

  
  const parseExecArgs = function(args){
    const out = Object.create(null);
    out.opt = Object.create(null);
    switch(args.length){
        case 1:
          if('string'===typeof args[0] || util.isSQLableTypedArray(args[0])){
            out.sql = args[0];
          }else if(Array.isArray(args[0])){
            out.sql = args[0];
          }else if(args[0] && 'object'===typeof args[0]){
            out.opt = args[0];
            out.sql = out.opt.sql;
          }
          break;
        case 2:
          out.sql = args[0];
          out.opt = args[1];
          break;
        default: toss3("Invalid argument count for exec().");
    };
    if(util.isSQLableTypedArray(out.sql)){
      out.sql = util.typedArrayToString(out.sql);
    }else if(Array.isArray(out.sql)){
      out.sql = out.sql.join('');
    }else if('string'!==typeof out.sql){
      toss3("Missing SQL argument or unsupported SQL value type.");
    }
    if(out.opt.callback || out.opt.resultRows){
      switch((undefined===out.opt.rowMode)
             ? 'array' : out.opt.rowMode) {
          case 'object': out.cbArg = (stmt)=>stmt.get(Object.create(null)); break;
          case 'array': out.cbArg = (stmt)=>stmt.get([]); break;
          case 'stmt':
            if(Array.isArray(out.opt.resultRows)){
              toss3("exec(): invalid rowMode for a resultRows array: must",
                    "be one of 'array', 'object',",
                    "a result column number, or column name reference.");
            }
            out.cbArg = (stmt)=>stmt;
            break;
          default:
            if(util.isInt32(out.opt.rowMode)){
              out.cbArg = (stmt)=>stmt.get(out.opt.rowMode);
              break;
            }else if('string'===typeof out.opt.rowMode && out.opt.rowMode.length>1){
              
              const prefix = out.opt.rowMode[0];
              if(':'===prefix || '@'===prefix || '$'===prefix){
                out.cbArg = function(stmt){
                  const rc = stmt.get(this.obj)[this.colName];
                  return (undefined===rc) ? toss3("exec(): unknown result column:",this.colName) : rc;
                }.bind({
                  obj:Object.create(null),
                  colName: out.opt.rowMode.substr(1)
                });
                break;
              }
            }
            toss3("Invalid rowMode:",out.opt.rowMode);
      }
    }
    return out;
  };

  
  DB.checkRc = checkSqlite3Rc;

  DB.prototype = {
    
    isOpen: function(){
      return !!this.pointer;
    },
    
    affirmOpen: function(){
      return affirmDbOpen(this);
    },
    
    close: function(){
      if(this.pointer){
        if(this.onclose && (this.onclose.before instanceof Function)){
          try{this.onclose.before(this)}
          catch(e){}
        }
        const pDb = this.pointer;
        Object.keys(__stmtMap.get(this)).forEach((k,s)=>{
          if(s && s.pointer) s.finalize();
        });
        __ptrMap.delete(this);
        __stmtMap.delete(this);
        capi.sqlite3_close_v2(pDb);
        if(this.onclose && (this.onclose.after instanceof Function)){
          try{this.onclose.after(this)}
          catch(e){}
        }
        delete this.filename;
      }
    },
    
    changes: function(total=false,sixtyFour=false){
      const p = affirmDbOpen(this).pointer;
      if(total){
        return sixtyFour
          ? capi.sqlite3_total_changes64(p)
          : capi.sqlite3_total_changes(p);
      }else{
        return sixtyFour
          ? capi.sqlite3_changes64(p)
          : capi.sqlite3_changes(p);
      }
    },
    
    getFilename: function(dbName='main'){
      return capi.sqlite3_db_filename(affirmDbOpen(this).pointer, dbName);
    },
    
    hasFilename: function(){
      return this.filename && ':'!==this.filename[0];
    },
    
    dbName: function(dbNumber=0){
      return capi.sqlite3_db_name(affirmDbOpen(this).pointer, dbNumber);
    },
    
    prepare: function(sql){
      affirmDbOpen(this);
      const stack = wasm.pstack.pointer;
      let ppStmt, pStmt;
      try{
        ppStmt = wasm.pstack.alloc(8);
        DB.checkRc(this, capi.sqlite3_prepare_v2(this.pointer, sql, -1, ppStmt, null));
        pStmt = wasm.getPtrValue(ppStmt);
      }
      finally {
        wasm.pstack.restore(stack);
      }
      if(!pStmt) toss3("Cannot prepare empty SQL.");
      const stmt = new Stmt(this, pStmt, BindTypes);
      __stmtMap.get(this)[pStmt] = stmt;
      return stmt;
    },
    
    exec: function(){
      affirmDbOpen(this);
      const wasm = capi.wasm;
      const arg = parseExecArgs(arguments);
      if(!arg.sql){
        return (''===arg.sql) ? this : toss3("exec() requires an SQL string.");
      }
      const opt = arg.opt;
      const callback = opt.callback;
      let resultRows = (Array.isArray(opt.resultRows)
                          ? opt.resultRows : undefined);
      let stmt;
      let bind = opt.bind;
      let evalFirstResult = !!(arg.cbArg || opt.columnNames) ;
      const stack = wasm.scopedAllocPush();
      try{
        const isTA = util.isSQLableTypedArray(arg.sql)
        ;
        
        let sqlByteLen = isTA ? arg.sql.byteLength : wasm.jstrlen(arg.sql);
        const ppStmt  = wasm.scopedAlloc(
          (2 * wasm.ptrSizeof)
          + (sqlByteLen + 1));
        const pzTail = ppStmt + wasm.ptrSizeof ;
        let pSql = pzTail + wasm.ptrSizeof;
        const pSqlEnd = pSql + sqlByteLen;
        if(isTA) wasm.heap8().set(arg.sql, pSql);
        else wasm.jstrcpy(arg.sql, wasm.heap8(), pSql, sqlByteLen, false);
        wasm.setMemValue(pSql + sqlByteLen, 0);
        while(pSql && wasm.getMemValue(pSql, 'i8')
               ){
          wasm.setPtrValue(ppStmt, 0);
          wasm.setPtrValue(pzTail, 0);
          DB.checkRc(this, capi.sqlite3_prepare_v3(
            this.pointer, pSql, sqlByteLen, 0, ppStmt, pzTail
          ));
          const pStmt = wasm.getPtrValue(ppStmt);
          pSql = wasm.getPtrValue(pzTail);
          sqlByteLen = pSqlEnd - pSql;
          if(!pStmt) continue;
          if(Array.isArray(opt.saveSql)){
            opt.saveSql.push(capi.sqlite3_sql(pStmt).trim());
          }
          stmt = new Stmt(this, pStmt, BindTypes);
          if(bind && stmt.parameterCount){
            stmt.bind(bind);
            bind = null;
          }
          if(evalFirstResult && stmt.columnCount){
            
            evalFirstResult = false;
            if(Array.isArray(opt.columnNames)){
              stmt.getColumnNames(opt.columnNames);
            }
            while(!!arg.cbArg && stmt.step()){
              stmt._isLocked = true;
              const row = arg.cbArg(stmt);
              if(resultRows) resultRows.push(row);
              if(callback) callback.apply(opt,[row,stmt]);
              stmt._isLocked = false;
            }
          }else{
            stmt.step();
          }
          stmt.finalize();
          stmt = null;
        }
      }finally{
        if(stmt){
          delete stmt._isLocked;
          stmt.finalize();
        }
        wasm.scopedAllocPop(stack);
      }
      return this;
    },
    
    createFunction: function f(name, xFunc, opt){
      const isFunc = (f)=>(f instanceof Function);
      switch(arguments.length){
          case 1: 
            opt = name;
            name = opt.name;
            xFunc = opt.xFunc || 0;
            break;
          case 2: 
            if(!isFunc(xFunc)){
              opt = xFunc;
              xFunc = opt.xFunc || 0;
            }
            break;
          case 3: 
            break;
          default: break;
      }
      if(!opt) opt = {};
      if('string' !== typeof name){
        toss3("Invalid arguments: missing function name.");
      }
      let xStep = opt.xStep || 0;
      let xFinal = opt.xFinal || 0;
      const xValue = opt.xValue || 0;
      const xInverse = opt.xInverse || 0;
      let isWindow = undefined;
      if(isFunc(xFunc)){
        isWindow = false;
        if(isFunc(xStep) || isFunc(xFinal)){
          toss3("Ambiguous arguments: scalar or aggregate?");
        }
        xStep = xFinal = null;
      }else if(isFunc(xStep)){
        if(!isFunc(xFinal)){
          toss3("Missing xFinal() callback for aggregate or window UDF.");
        }
        xFunc = null;
      }else if(isFunc(xFinal)){
        toss3("Missing xStep() callback for aggregate or window UDF.");
      }else{
        toss3("Missing function-type properties.");
      }
      if(false === isWindow){
        if(isFunc(xValue) || isFunc(xInverse)){
          toss3("xValue and xInverse are not permitted for non-window UDFs.");
        }
      }else if(isFunc(xValue)){
        if(!isFunc(xInverse)){
          toss3("xInverse must be provided if xValue is.");
        }
        isWindow = true;
      }else if(isFunc(xInverse)){
        toss3("xValue must be provided if xInverse is.");
      }
      const pApp = opt.pApp;
      if(undefined!==pApp &&
         null!==pApp &&
         (('number'!==typeof pApp) || !capi.util.isInt32(pApp))){
        toss3("Invalid value for pApp property. Must be a legal WASM pointer value.");
      }
      const xDestroy = opt.xDestroy || 0;
      if(xDestroy && !isFunc(xDestroy)){
        toss3("xDestroy property must be a function.");
      }
      let fFlags = 0 ;
      if(getOwnOption(opt, 'deterministic')) fFlags |= capi.SQLITE_DETERMINISTIC;
      if(getOwnOption(opt, 'directOnly')) fFlags |= capi.SQLITE_DIRECTONLY;
      if(getOwnOption(opt, 'innocuous')) fFlags |= capi.SQLITE_INNOCUOUS;
      name = name.toLowerCase();
      const xArity = xFunc || xStep;
      const arity = getOwnOption(opt, 'arity');
      const arityArg = ('number'===typeof arity
                        ? arity
                        : (xArity.length ? xArity.length-1 : 0));
      let rc;
      if( isWindow ){
        rc = capi.sqlite3_create_window_function(
          this.pointer, name, arityArg,
          capi.SQLITE_UTF8 | fFlags, pApp || 0,
          xStep, xFinal, xValue, xInverse, xDestroy);
      }else{
        rc = capi.sqlite3_create_function_v2(
          this.pointer, name, arityArg,
          capi.SQLITE_UTF8 | fFlags, pApp || 0,
          xFunc, xStep, xFinal, xDestroy);
      }
      DB.checkRc(this, rc);
      return this;
    },
    
    selectValue: function(sql,bind,asType){
      let stmt, rc;
      try {
        stmt = this.prepare(sql).bind(bind);
        if(stmt.step()) rc = stmt.get(0,asType);
      }finally{
        if(stmt) stmt.finalize();
      }
      return rc;
    },

    
    openStatementCount: function(){
      return this.pointer ? Object.keys(__stmtMap.get(this)).length : 0;
    },

    
    transaction: function(callback){
      affirmDbOpen(this).exec("BEGIN");
      try {
        const rc = callback(this);
        this.exec("COMMIT");
        return rc;
      }catch(e){
        this.exec("ROLLBACK");
        throw e;
      }
    },

    
    savepoint: function(callback){
      affirmDbOpen(this).exec("SAVEPOINT oo1");
      try {
        const rc = callback(this);
        this.exec("RELEASE oo1");
        return rc;
      }catch(e){
        this.exec("ROLLBACK to SAVEPOINT oo1; RELEASE SAVEPOINT oo1");
        throw e;
      }
    }
  };


  
  const affirmStmtOpen = function(stmt){
    if(!stmt.pointer) toss3("Stmt has been closed.");
    return stmt;
  };

  
  const isSupportedBindType = function(v){
    let t = BindTypes[(null===v||undefined===v) ? 'null' : typeof v];
    switch(t){
        case BindTypes.boolean:
        case BindTypes.null:
        case BindTypes.number:
        case BindTypes.string:
          return t;
        case BindTypes.bigint:
          if(wasm.bigIntEnabled) return t;
          
        default:
          
          return util.isBindableTypedArray(v) ? BindTypes.blob : undefined;
    }
  };

  
  const affirmSupportedBindType = function(v){
    
    return isSupportedBindType(v) || toss3("Unsupported bind() argument type:",typeof v);
  };

  
  const affirmParamIndex = function(stmt,key){
    const n = ('number'===typeof key)
          ? key : capi.sqlite3_bind_parameter_index(stmt.pointer, key);
    if(0===n || !util.isInt32(n)){
      toss3("Invalid bind() parameter name: "+key);
    }
    else if(n<1 || n>stmt.parameterCount) toss3("Bind index",key,"is out of range.");
    return n;
  };

  
  const affirmUnlocked = function(stmt,currentOpName){
    if(stmt._isLocked){
      toss3("Operation is illegal when statement is locked:",currentOpName);
    }
    return stmt;
  };

  
  const bindOne = function f(stmt,ndx,bindType,val){
    affirmUnlocked(stmt, 'bind()');
    if(!f._){
      f._tooBigInt = (v)=>toss3(
        "BigInt value is too big to store without precision loss:", v
      );
      
      f._ = {
        string: function(stmt, ndx, val, asBlob){
          if(1){
            
            const stack = wasm.scopedAllocPush();
            try{
              const n = wasm.jstrlen(val);
              const pStr = wasm.scopedAlloc(n);
              wasm.jstrcpy(val, wasm.heap8u(), pStr, n, false);
              const f = asBlob ? capi.sqlite3_bind_blob : capi.sqlite3_bind_text;
              return f(stmt.pointer, ndx, pStr, n, capi.SQLITE_TRANSIENT);
            }finally{
              wasm.scopedAllocPop(stack);
            }
          }else{
            const bytes = wasm.jstrToUintArray(val,false);
            const pStr = wasm.alloc(bytes.length || 1);
            wasm.heap8u().set(bytes.length ? bytes : [0], pStr);
            try{
              const f = asBlob ? capi.sqlite3_bind_blob : capi.sqlite3_bind_text;
              return f(stmt.pointer, ndx, pStr, bytes.length, capi.SQLITE_TRANSIENT);
            }finally{
              wasm.dealloc(pStr);
            }
          }
        }
      };
    }
    affirmSupportedBindType(val);
    ndx = affirmParamIndex(stmt,ndx);
    let rc = 0;
    switch((null===val || undefined===val) ? BindTypes.null : bindType){
        case BindTypes.null:
          rc = capi.sqlite3_bind_null(stmt.pointer, ndx);
          break;
        case BindTypes.string:
          rc = f._.string(stmt, ndx, val, false);
          break;
        case BindTypes.number: {
          let m;
          if(util.isInt32(val)) m = capi.sqlite3_bind_int;
          else if('bigint'===typeof val){
            if(!util.bigIntFits64(val)){
              f._tooBigInt(val);
            }else if(wasm.bigIntEnabled){
              m = capi.sqlite3_bind_int64;
            }else if(util.bigIntFitsDouble(val)){
              val = Number(val);
              m = capi.sqlite3_bind_double;
            }else{
              f._tooBigInt(val);
            }
          }else{ 
            val = Number(val);
            if(wasm.bigIntEnabled && Number.isInteger(val)){
              m = capi.sqlite3_bind_int64;
            }else{
              m = capi.sqlite3_bind_double;
            }
          }
          rc = m(stmt.pointer, ndx, val);
          break;
        }
        case BindTypes.boolean:
          rc = capi.sqlite3_bind_int(stmt.pointer, ndx, val ? 1 : 0);
          break;
        case BindTypes.blob: {
          if('string'===typeof val){
            rc = f._.string(stmt, ndx, val, true);
          }else if(!util.isBindableTypedArray(val)){
            toss3("Binding a value as a blob requires",
                  "that it be a string, Uint8Array, or Int8Array.");
          }else if(1){
            
            const stack = wasm.scopedAllocPush();
            try{
              const pBlob = wasm.scopedAlloc(val.byteLength || 1);
              wasm.heap8().set(val.byteLength ? val : [0], pBlob)
              rc = capi.sqlite3_bind_blob(stmt.pointer, ndx, pBlob, val.byteLength,
                                         capi.SQLITE_TRANSIENT);
            }finally{
              wasm.scopedAllocPop(stack);
            }
          }else{
            const pBlob = wasm.allocFromTypedArray(val);
            try{
              rc = capi.sqlite3_bind_blob(stmt.pointer, ndx, pBlob, val.byteLength,
                                         capi.SQLITE_TRANSIENT);
            }finally{
              wasm.dealloc(pBlob);
            }
          }
          break;
        }
        default:
          console.warn("Unsupported bind() argument type:",val);
          toss3("Unsupported bind() argument type: "+(typeof val));
    }
    if(rc) DB.checkRc(stmt.db.pointer, rc);
    return stmt;
  };

  Stmt.prototype = {
    
    finalize: function(){
      if(this.pointer){
        affirmUnlocked(this,'finalize()');
        delete __stmtMap.get(this.db)[this.pointer];
        capi.sqlite3_finalize(this.pointer);
        __ptrMap.delete(this);
        delete this._mayGet;
        delete this.columnCount;
        delete this.parameterCount;
        delete this.db;
        delete this._isLocked;
      }
    },
    
    clearBindings: function(){
      affirmUnlocked(affirmStmtOpen(this), 'clearBindings()')
      capi.sqlite3_clear_bindings(this.pointer);
      this._mayGet = false;
      return this;
    },
    
    reset: function(alsoClearBinds){
      affirmUnlocked(this,'reset()');
      if(alsoClearBinds) this.clearBindings();
      capi.sqlite3_reset(affirmStmtOpen(this).pointer);
      this._mayGet = false;
      return this;
    },
    
    bind: function(){
      affirmStmtOpen(this);
      let ndx, arg;
      switch(arguments.length){
          case 1: ndx = 1; arg = arguments[0]; break;
          case 2: ndx = arguments[0]; arg = arguments[1]; break;
          default: toss3("Invalid bind() arguments.");
      }
      if(undefined===arg){
        
        return this;
      }else if(!this.parameterCount){
        toss3("This statement has no bindable parameters.");
      }
      this._mayGet = false;
      if(null===arg){
        
        return bindOne(this, ndx, BindTypes.null, arg);
      }
      else if(Array.isArray(arg)){
        
        if(1!==arguments.length){
          toss3("When binding an array, an index argument is not permitted.");
        }
        arg.forEach((v,i)=>bindOne(this, i+1, affirmSupportedBindType(v), v));
        return this;
      }
      else if('object'===typeof arg
              && !util.isBindableTypedArray(arg)){
        
        if(1!==arguments.length){
          toss3("When binding an object, an index argument is not permitted.");
        }
        Object.keys(arg)
          .forEach(k=>bindOne(this, k,
                              affirmSupportedBindType(arg[k]),
                              arg[k]));
        return this;
      }else{
        return bindOne(this, ndx, affirmSupportedBindType(arg), arg);
      }
      toss3("Should not reach this point.");
    },
    
    bindAsBlob: function(ndx,arg){
      affirmStmtOpen(this);
      if(1===arguments.length){
        arg = ndx;
        ndx = 1;
      }
      const t = affirmSupportedBindType(arg);
      if(BindTypes.string !== t && BindTypes.blob !== t
         && BindTypes.null !== t){
        toss3("Invalid value type for bindAsBlob()");
      }
      bindOne(this, ndx, BindTypes.blob, arg);
      this._mayGet = false;
      return this;
    },
    
    step: function(){
      affirmUnlocked(this, 'step()');
      const rc = capi.sqlite3_step(affirmStmtOpen(this).pointer);
      switch(rc){
          case capi.SQLITE_DONE: return this._mayGet = false;
          case capi.SQLITE_ROW: return this._mayGet = true;
          default:
            this._mayGet = false;
            console.warn("sqlite3_step() rc=",rc,
                         capi.sqlite3_js_rc_str(rc),
                         "SQL =", capi.sqlite3_sql(this.pointer));
            DB.checkRc(this.db.pointer, rc);
      }
    },
    
    stepReset: function(){
      this.step();
      return this.reset();
    },
    
    stepFinalize: function(){
      const rc = this.step();
      this.finalize();
      return rc;
    },
    
    get: function(ndx,asType){
      if(!affirmStmtOpen(this)._mayGet){
        toss3("Stmt.step() has not (recently) returned true.");
      }
      if(Array.isArray(ndx)){
        let i = 0;
        while(i<this.columnCount){
          ndx[i] = this.get(i++);
        }
        return ndx;
      }else if(ndx && 'object'===typeof ndx){
        let i = 0;
        while(i<this.columnCount){
          ndx[capi.sqlite3_column_name(this.pointer,i)] = this.get(i++);
        }
        return ndx;
      }
      affirmColIndex(this, ndx);
      switch(undefined===asType
             ? capi.sqlite3_column_type(this.pointer, ndx)
             : asType){
          case capi.SQLITE_NULL: return null;
          case capi.SQLITE_INTEGER:{
            if(wasm.bigIntEnabled){
              const rc = capi.sqlite3_column_int64(this.pointer, ndx);
              if(rc>=Number.MIN_SAFE_INTEGER && rc<=Number.MAX_SAFE_INTEGER){
                
                return Number(rc).valueOf();
              }
              return rc;
            }else{
              const rc = capi.sqlite3_column_double(this.pointer, ndx);
              if(rc>Number.MAX_SAFE_INTEGER || rc<Number.MIN_SAFE_INTEGER){
                
                toss3("Integer is out of range for JS integer range: "+rc);
              }
              
              return util.isInt32(rc) ? (rc | 0) : rc;
            }
          }
          case capi.SQLITE_FLOAT:
            return capi.sqlite3_column_double(this.pointer, ndx);
          case capi.SQLITE_TEXT:
            return capi.sqlite3_column_text(this.pointer, ndx);
          case capi.SQLITE_BLOB: {
            const n = capi.sqlite3_column_bytes(this.pointer, ndx),
                  ptr = capi.sqlite3_column_blob(this.pointer, ndx),
                  rc = new Uint8Array(n);
            
            if(n) rc.set(wasm.heap8u().slice(ptr, ptr+n), 0);
            
            if(n && this.db._blobXfer instanceof Array){
              
              this.db._blobXfer.push(rc.buffer);
            }
            return rc;
          }
          default: toss3("Don't know how to translate",
                         "type of result column #"+ndx+".");
      }
      toss3("Not reached.");
    },
    
    getInt: function(ndx){return this.get(ndx,capi.SQLITE_INTEGER)},
    
    getFloat: function(ndx){return this.get(ndx,capi.SQLITE_FLOAT)},
    
    getString: function(ndx){return this.get(ndx,capi.SQLITE_TEXT)},
    
    getBlob: function(ndx){return this.get(ndx,capi.SQLITE_BLOB)},
    
    getJSON: function(ndx){
      const s = this.get(ndx, capi.SQLITE_STRING);
      return null===s ? s : JSON.parse(s);
    },
    
    
    
    
    
    getColumnName: function(ndx){
      return capi.sqlite3_column_name(
        affirmColIndex(affirmStmtOpen(this),ndx).pointer, ndx
      );
    },
    
    getColumnNames: function(tgt=[]){
      affirmColIndex(affirmStmtOpen(this),0);
      for(let i = 0; i < this.columnCount; ++i){
        tgt.push(capi.sqlite3_column_name(this.pointer, i));
      }
      return tgt;
    },
    
    getParamIndex: function(name){
      return (affirmStmtOpen(this).parameterCount
              ? capi.sqlite3_bind_parameter_index(this.pointer, name)
              : undefined);
    }
  };

  {
    const prop = {
      enumerable: true,
      get: function(){return __ptrMap.get(this)},
      set: ()=>toss3("The pointer property is read-only.")
    }
    Object.defineProperty(Stmt.prototype, 'pointer', prop);
    Object.defineProperty(DB.prototype, 'pointer', prop);
  }

  
  sqlite3.oo1 = {
    version: {
      lib: capi.sqlite3_libversion(),
      ooApi: "0.1"
    },
    DB,
    Stmt,
    dbCtorHelper
  };

  if(util.isUIThread()){
    
    sqlite3.oo1.JsStorageDb = function(storageName='session'){
      if('session'!==storageName && 'local'!==storageName){
        toss3("JsStorageDb db name must be one of 'session' or 'local'.");
      }
      dbCtorHelper.call(this, {
        filename: storageName,
        flags: 'c',
        vfs: "kvvfs"
      });
    };
    const jdb = sqlite3.oo1.JsStorageDb;
    jdb.prototype = Object.create(DB.prototype);
    
    jdb.clearStorage = capi.sqlite3_js_kvvfs_clear;
    
    jdb.prototype.clearStorage = function(){
      return jdb.clearStorage(affirmDbOpen(this).filename);
    };
    
    jdb.storageSize = capi.sqlite3_js_kvvfs_size;
    
    jdb.prototype.storageSize = function(){
      return jdb.storageSize(affirmDbOpen(this).filename);
    };
  }

});






self.sqlite3ApiBootstrap.initializers.push(function(sqlite3){
sqlite3.initWorker1API = function(){
  'use strict';
  const toss = (...args)=>{throw new Error(args.join(' '))};
  if('function' !== typeof importScripts){
    toss("initWorker1API() must be run from a Worker thread.");
  }
  const self = this.self;
  const sqlite3 = this.sqlite3 || toss("Missing this.sqlite3 object.");
  const DB = sqlite3.oo1.DB;

  
  const getDbId = function(db){
    let id = wState.idMap.get(db);
    if(id) return id;
    id = 'db#'+(++wState.idSeq)+'@'+db.pointer;
    
    wState.idMap.set(db, id);
    return id;
  };

  
  const wState = {
    
    defaultDb: undefined,
    
    idSeq: 0,
    
    idMap: new WeakMap,
    
    xfer: [],
    open: function(opt){
      const db = new DB(opt.filename);
      this.dbs[getDbId(db)] = db;
      if(!this.defaultDb) this.defaultDb = db;
      return db;
    },
    close: function(db,alsoUnlink){
      if(db){
        delete this.dbs[getDbId(db)];
        const filename = db.getFilename();
        const pVfs = sqlite3.capi.wasm.sqlite3_wasm_db_vfs(db.pointer, 0);
        db.close();
        if(db===this.defaultDb) this.defaultDb = undefined;
        if(alsoUnlink && filename && pVfs){
          sqlite3.capi.wasm.sqlite3_wasm_vfs_unlink(pVfs, filename);
        }
      }
    },
    
    post: function(msg,xferList){
      if(xferList && xferList.length){
        self.postMessage( msg, Array.from(xferList) );
        xferList.length = 0;
      }else{
        self.postMessage(msg);
      }
    },
    
    dbs: Object.create(null),
    
    getDb: function(id,require=true){
      return this.dbs[id]
        || (require ? toss("Unknown (or closed) DB ID:",id) : undefined);
    }
  };

  
  const affirmDbOpen = function(db = wState.defaultDb){
    return (db && db.pointer) ? db : toss("DB is not opened.");
  };

  
  const getMsgDb = function(msgData,affirmExists=true){
    const db = wState.getDb(msgData.dbId,false) || wState.defaultDb;
    return affirmExists ? affirmDbOpen(db) : db;
  };

  const getDefaultDbId = function(){
    return wState.defaultDb && getDbId(wState.defaultDb);
  };

  
  const wMsgHandler = {
    open: function(ev){
      const oargs = Object.create(null), args = (ev.args || Object.create(null));
      if(args.simulateError){ 
        toss("Throwing because of simulateError flag.");
      }
      const rc = Object.create(null);
      const pDir = sqlite3.capi.sqlite3_wasmfs_opfs_dir();
      if(!args.filename || ':memory:'===args.filename){
        oargs.filename = args.filename || '';
      }else{
        oargs.filename = args.filename;
      }
      const db = wState.open(oargs);
      rc.filename = db.filename;
      rc.persistent = (!!pDir && db.filename.startsWith(pDir+'/'))
        || sqlite3.capi.sqlite3_js_db_uses_vfs(db.pointer, "opfs");
      rc.dbId = getDbId(db);
      return rc;
    },

    close: function(ev){
      const db = getMsgDb(ev,false);
      const response = {
        filename: db && db.filename
      };
      if(db){
        
        
        wState.close(db, ((ev.args && 'object'===typeof ev.args)
                          ? !!ev.args.unlink : false));
      }
      return response;
    },

    exec: function(ev){
      const rc = (
        'string'===typeof ev.args
      ) ? {sql: ev.args} : (ev.args || Object.create(null));
      if('stmt'===rc.rowMode){
        toss("Invalid rowMode for 'exec': stmt mode",
             "does not work in the Worker API.");
      }else if(!rc.sql){
        toss("'exec' requires input SQL.");
      }
      const db = getMsgDb(ev);
      if(rc.callback || Array.isArray(rc.resultRows)){
        
        db._blobXfer = wState.xfer;
      }
      const theCallback = rc.callback;
      let rowNumber = 0;
      const hadColNames = !!rc.columnNames;
      if('string' === typeof theCallback){
        if(!hadColNames) rc.columnNames = [];
        
        rc.callback = function(row,stmt){
          wState.post({
            type: theCallback,
            columnNames: rc.columnNames,
            rowNumber: ++rowNumber,
            row: row
          }, wState.xfer);
        }
      }
      try {
        db.exec(rc);
        if(rc.callback instanceof Function){
          rc.callback = theCallback;
          
          wState.post({
            type: theCallback,
            columnNames: rc.columnNames,
            rowNumber: null ,
            row: undefined 
          });
        }
      }finally{
        delete db._blobXfer;
        if(rc.callback) rc.callback = theCallback;
      }
      return rc;
    },

    'config-get': function(){
      const rc = Object.create(null), src = sqlite3.config;
      [
        'wasmfsOpfsDir', 'bigIntEnabled'
      ].forEach(function(k){
        if(Object.getOwnPropertyDescriptor(src, k)) rc[k] = src[k];
      });
      rc.wasmfsOpfsEnabled = !!sqlite3.capi.sqlite3_wasmfs_opfs_dir();
      rc.version = sqlite3.version;
      rc.vfsList = sqlite3.capi.sqlite3_js_vfs_list();
      return rc;
    },

    
    export: function(ev){
      toss("export() requires reimplementing for portability reasons.");
      
      
    },

    toss: function(ev){
      toss("Testing worker exception");
    }
  };

  self.onmessage = function(ev){
    ev = ev.data;
    let result, dbId = ev.dbId, evType = ev.type;
    const arrivalTime = performance.now();
    try {
      if(wMsgHandler.hasOwnProperty(evType) &&
         wMsgHandler[evType] instanceof Function){
        result = wMsgHandler[evType](ev);
      }else{
        toss("Unknown db worker message type:",ev.type);
      }
    }catch(err){
      evType = 'error';
      result = {
        operation: ev.type,
        message: err.message,
        errorClass: err.name,
        input: ev
      };
      if(err.stack){
        result.stack = ('string'===typeof err.stack)
          ? err.stack.split(/\n\s*/) : err.stack;
      }
      if(0) console.warn("Worker is propagating an exception to main thread.",
                         "Reporting it _here_ for the stack trace:",err,result);
    }
    if(!dbId){
      dbId = result.dbId
        || getDefaultDbId();
    }
    
    
    wState.post({
      type: evType,
      dbId: dbId,
      messageId: ev.messageId,
      workerReceivedTime: arrivalTime,
      workerRespondTime: performance.now(),
      departureTime: ev.departureTime,
      
      
      
      
      
      
      result: result
    }, wState.xfer);
  };
  self.postMessage({type:'sqlite3-api',result:'worker1-ready'});
}.bind({self, sqlite3});
});



'use strict';
self.sqlite3ApiBootstrap.initializers.push(function(sqlite3){

const installOpfsVfs = function callee(options){
  if(!self.SharedArrayBuffer ||
     !self.Atomics ||
     !self.FileSystemHandle ||
     !self.FileSystemDirectoryHandle ||
     !self.FileSystemFileHandle ||
     !self.FileSystemFileHandle.prototype.createSyncAccessHandle ||
     !navigator.storage.getDirectory){
    return Promise.reject(
      new Error("This environment does not have OPFS support.")
    );
  }
  if(!options || 'object'!==typeof options){
    options = Object.create(null);
  }
  const urlParams = new URL(self.location.href).searchParams;
  if(undefined===options.verbose){
    options.verbose = urlParams.has('opfs-verbose') ? 3 : 2;
  }
  if(undefined===options.sanityChecks){
    options.sanityChecks = urlParams.has('opfs-sanity-check');
  }
  if(undefined===options.proxyUri){
    options.proxyUri = callee.defaultProxyUri;
  }

  if('function' === typeof options.proxyUri){
    options.proxyUri = options.proxyUri();
  }
  const thePromise = new Promise(function(promiseResolve, promiseReject_){
    const loggers = {
      0:console.error.bind(console),
      1:console.warn.bind(console),
      2:console.log.bind(console)
    };
    const logImpl = (level,...args)=>{
      if(options.verbose>level) loggers[level]("OPFS syncer:",...args);
    };
    const log =    (...args)=>logImpl(2, ...args);
    const warn =   (...args)=>logImpl(1, ...args);
    const error =  (...args)=>logImpl(0, ...args);
    const toss = function(...args){throw new Error(args.join(' '))};
    const capi = sqlite3.capi;
    const wasm = capi.wasm;
    const sqlite3_vfs = capi.sqlite3_vfs;
    const sqlite3_file = capi.sqlite3_file;
    const sqlite3_io_methods = capi.sqlite3_io_methods;
    
    const opfsUtil = Object.create(null);
    
    opfsUtil.metrics = {
      dump: function(){
        let k, n = 0, t = 0, w = 0;
        for(k in state.opIds){
          const m = metrics[k];
          n += m.count;
          t += m.time;
          w += m.wait;
          m.avgTime = (m.count && m.time) ? (m.time / m.count) : 0;
          m.avgWait = (m.count && m.wait) ? (m.wait / m.count) : 0;
        }
        console.log(self.location.href,
                    "metrics for",self.location.href,":",metrics,
                    "\nTotal of",n,"op(s) for",t,
                    "ms (incl. "+w+" ms of waiting on the async side)");
        console.log("Serialization metrics:",metrics.s11n);
        W.postMessage({type:'opfs-async-metrics'});
      },
      reset: function(){
        let k;
        const r = (m)=>(m.count = m.time = m.wait = 0);
        for(k in state.opIds){
          r(metrics[k] = Object.create(null));
        }
        let s = metrics.s11n = Object.create(null);
        s = s.serialize = Object.create(null);
        s.count = s.time = 0;
        s = metrics.s11n.deserialize = Object.create(null);
        s.count = s.time = 0;
      }
    };      
    const promiseReject = function(err){
      opfsVfs.dispose();
      return promiseReject_(err);
    };
    const W = new Worker(options.proxyUri);
    W._originalOnError = W.onerror ;
    W.onerror = function(err){
      
      
      error("Error initializing OPFS asyncer:",err);
      promiseReject(new Error("Loading OPFS async Worker failed for unknown reasons."));
    };
    const pDVfs = capi.sqlite3_vfs_find(null);
    const dVfs = pDVfs
          ? new sqlite3_vfs(pDVfs)
          : null ;
    const opfsVfs = new sqlite3_vfs();
    const opfsIoMethods = new sqlite3_io_methods();
    opfsVfs.$iVersion = 2;
    opfsVfs.$szOsFile = capi.sqlite3_file.structInfo.sizeof;
    opfsVfs.$mxPathname = 1024;
    opfsVfs.$zName = wasm.allocCString("opfs");
    
    opfsVfs.$xDlOpen = opfsVfs.$xDlError = opfsVfs.$xDlSym = opfsVfs.$xDlClose = null;
    opfsVfs.ondispose = [
      '$zName', opfsVfs.$zName,
      'cleanup default VFS wrapper', ()=>(dVfs ? dVfs.dispose() : null),
      'cleanup opfsIoMethods', ()=>opfsIoMethods.dispose()
    ];
    
    
    const state = Object.create(null);
    state.verbose = options.verbose;
    state.littleEndian = (()=>{
      const buffer = new ArrayBuffer(2);
      new DataView(buffer).setInt16(0, 256, true );
      
      return new Int16Array(buffer)[0] === 256;
    })();
    
    state.asyncS11nExceptions = 1;
    
    state.fileBufferSize = 1024 * 64;
    state.sabS11nOffset = state.fileBufferSize;
    
    state.sabS11nSize = opfsVfs.$mxPathname * 2;
    
    state.sabIO = new SharedArrayBuffer(
      state.fileBufferSize
      + state.sabS11nSize
    );
    state.opIds = Object.create(null);
    const metrics = Object.create(null);
    {
      
      let i = 0;
      
      state.opIds.whichOp = i++;
      
      state.opIds.rc = i++;
      
      state.opIds.xAccess = i++;
      state.opIds.xClose = i++;
      state.opIds.xDelete = i++;
      state.opIds.xDeleteNoWait = i++;
      state.opIds.xFileControl = i++;
      state.opIds.xFileSize = i++;
      state.opIds.xLock = i++;
      state.opIds.xOpen = i++;
      state.opIds.xRead = i++;
      state.opIds.xSleep = i++;
      state.opIds.xSync = i++;
      state.opIds.xTruncate = i++;
      state.opIds.xUnlock = i++;
      state.opIds.xWrite = i++;
      state.opIds.mkdir = i++;
      state.opIds['opfs-async-metrics'] = i++;
      state.opIds['opfs-async-shutdown'] = i++;
      
      state.opIds.retry = i++;
      state.sabOP = new SharedArrayBuffer(
        i * 4);
      opfsUtil.metrics.reset();
    }
    
    state.sq3Codes = Object.create(null);
    [
      'SQLITE_ERROR', 'SQLITE_IOERR',
      'SQLITE_NOTFOUND', 'SQLITE_MISUSE',
      'SQLITE_IOERR_READ', 'SQLITE_IOERR_SHORT_READ',
      'SQLITE_IOERR_WRITE', 'SQLITE_IOERR_FSYNC',
      'SQLITE_IOERR_TRUNCATE', 'SQLITE_IOERR_DELETE',
      'SQLITE_IOERR_ACCESS', 'SQLITE_IOERR_CLOSE',
      'SQLITE_IOERR_DELETE',
      'SQLITE_LOCK_NONE',
      'SQLITE_LOCK_SHARED',
      'SQLITE_LOCK_RESERVED',
      'SQLITE_LOCK_PENDING',
      'SQLITE_LOCK_EXCLUSIVE',
      'SQLITE_OPEN_CREATE', 'SQLITE_OPEN_DELETEONCLOSE',
      'SQLITE_OPEN_READONLY'
    ].forEach((k)=>{
      if(undefined === (state.sq3Codes[k] = capi[k])){
        toss("Maintenance required: not found:",k);
      }
    });

    
    const opRun = (op,...args)=>{
      const opNdx = state.opIds[op] || toss("Invalid op ID:",op);
      state.s11n.serialize(...args);
      Atomics.store(state.sabOPView, state.opIds.rc, -1);
      Atomics.store(state.sabOPView, state.opIds.whichOp, opNdx);
      Atomics.notify(state.sabOPView, state.opIds.whichOp)
      ;
      const t = performance.now();
      Atomics.wait(state.sabOPView, state.opIds.rc, -1)
      ;
      const rc = Atomics.load(state.sabOPView, state.opIds.rc);
      metrics[op].wait += performance.now() - t;
      if(rc && state.asyncS11nExceptions){
        const err = state.s11n.deserialize();
        if(err) error(op+"() async error:",...err);
      }
      return rc;
    };

    const initS11n = ()=>{
      
      if(state.s11n) return state.s11n;
      const textDecoder = new TextDecoder(),
            textEncoder = new TextEncoder('utf-8'),
            viewU8 = new Uint8Array(state.sabIO, state.sabS11nOffset, state.sabS11nSize),
            viewDV = new DataView(state.sabIO, state.sabS11nOffset, state.sabS11nSize);
      state.s11n = Object.create(null);
      
      const TypeIds = Object.create(null);
      TypeIds.number  = { id: 1, size: 8, getter: 'getFloat64', setter: 'setFloat64' };
      TypeIds.bigint  = { id: 2, size: 8, getter: 'getBigInt64', setter: 'setBigInt64' };
      TypeIds.boolean = { id: 3, size: 4, getter: 'getInt32', setter: 'setInt32' };
      TypeIds.string =  { id: 4 };

      const getTypeId = (v)=>(
        TypeIds[typeof v]
          || toss("Maintenance required: this value type cannot be serialized.",v)
      );
      const getTypeIdById = (tid)=>{
        switch(tid){
            case TypeIds.number.id: return TypeIds.number;
            case TypeIds.bigint.id: return TypeIds.bigint;
            case TypeIds.boolean.id: return TypeIds.boolean;
            case TypeIds.string.id: return TypeIds.string;
            default: toss("Invalid type ID:",tid);
        }
      };

      
      state.s11n.deserialize = function(){
        ++metrics.s11n.deserialize.count;
        const t = performance.now();
        const argc = viewU8[0];
        const rc = argc ? [] : null;
        if(argc){
          const typeIds = [];
          let offset = 1, i, n, v;
          for(i = 0; i < argc; ++i, ++offset){
            typeIds.push(getTypeIdById(viewU8[offset]));
          }
          for(i = 0; i < argc; ++i){
            const t = typeIds[i];
            if(t.getter){
              v = viewDV[t.getter](offset, state.littleEndian);
              offset += t.size;
            }else{
              n = viewDV.getInt32(offset, state.littleEndian);
              offset += 4;
              v = textDecoder.decode(viewU8.slice(offset, offset+n));
              offset += n;
            }
            rc.push(v);
          }
        }
        
        metrics.s11n.deserialize.time += performance.now() - t;
        return rc;
      };

      
      state.s11n.serialize = function(...args){
        const t = performance.now();
        ++metrics.s11n.serialize.count;
        if(args.length){
          
          const typeIds = [];
          let i = 0, offset = 1;
          viewU8[0] = args.length & 0xff ;
          for(; i < args.length; ++i, ++offset){
            
            typeIds.push(getTypeId(args[i]));
            viewU8[offset] = typeIds[i].id;
          }
          for(i = 0; i < args.length; ++i) {
            
            const t = typeIds[i];
            if(t.setter){
              viewDV[t.setter](offset, args[i], state.littleEndian);
              offset += t.size;
            }else{
              const s = textEncoder.encode(args[i]);
              viewDV.setInt32(offset, s.byteLength, state.littleEndian);
              offset += 4;
              viewU8.set(s, offset);
              offset += s.byteLength;
            }
          }
          
        }else{
          viewU8[0] = 0;
        }
        metrics.s11n.serialize.time += performance.now() - t;
      };
      return state.s11n;
    };

    
    const randomFilename = function f(len=16){
      if(!f._chars){
        f._chars = "abcdefghijklmnopqrstuvwxyz"+
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
          "012346789";
        f._n = f._chars.length;
      }
      const a = [];
      let i = 0;
      for( ; i < len; ++i){
        const ndx = Math.random() * (f._n * 64) % f._n | 0;
        a[i] = f._chars[ndx];
      }
      return a.join('');
    };

    
    const __openFiles = Object.create(null);

    
    const installMethod = function callee(tgt, name, func){
      if(!(tgt instanceof sqlite3.StructBinder.StructType)){
        toss("Usage error: target object is-not-a StructType.");
      }
      if(1===arguments.length){
        return (n,f)=>callee(tgt,n,f);
      }
      if(!callee.argcProxy){
        callee.argcProxy = function(func,sig){
          return function(...args){
            if(func.length!==arguments.length){
              toss("Argument mismatch. Native signature is:",sig);
            }
            return func.apply(this, args);
          }
        };
        callee.removeFuncList = function(){
          if(this.ondispose.__removeFuncList){
            this.ondispose.__removeFuncList.forEach(
              (v,ndx)=>{
                if('number'===typeof v){
                  try{wasm.uninstallFunction(v)}
                  catch(e){}
                }
                
              }
            );
            delete this.ondispose.__removeFuncList;
          }
        };
      }
      const sigN = tgt.memberSignature(name);
      if(sigN.length<2){
        toss("Member",name," is not a function pointer. Signature =",sigN);
      }
      const memKey = tgt.memberKey(name);
      const fProxy = 0
      
            ? callee.argcProxy(func, sigN)
            : func;
      const pFunc = wasm.installFunction(fProxy, tgt.memberSignature(name, true));
      tgt[memKey] = pFunc;
      if(!tgt.ondispose) tgt.ondispose = [];
      if(!tgt.ondispose.__removeFuncList){
        tgt.ondispose.push('ondispose.__removeFuncList handler',
                           callee.removeFuncList);
        tgt.ondispose.__removeFuncList = [];
      }
      tgt.ondispose.__removeFuncList.push(memKey, pFunc);
      return (n,f)=>callee(tgt, n, f);
    };

    const opTimer = Object.create(null);
    opTimer.op = undefined;
    opTimer.start = undefined;
    const mTimeStart = (op)=>{
      opTimer.start = performance.now();
      opTimer.op = op;
      ++metrics[op].count;
    };
    const mTimeEnd = ()=>(
      metrics[opTimer.op].time += performance.now() - opTimer.start
    );

    
    const ioSyncWrappers = {
      xCheckReservedLock: function(pFile,pOut){
        
        const f = __openFiles[pFile];
        wasm.setMemValue(pOut, f.lockMode ? 1 : 0, 'i32');
        return 0;
      },
      xClose: function(pFile){
        mTimeStart('xClose');
        let rc = 0;
        const f = __openFiles[pFile];
        if(f){
          delete __openFiles[pFile];
          rc = opRun('xClose', pFile);
          if(f.sq3File) f.sq3File.dispose();
        }
        mTimeEnd();
        return rc;
      },
      xDeviceCharacteristics: function(pFile){
        
        return capi.SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN;
      },
      xFileControl: function(pFile, opId, pArg){
        mTimeStart('xFileControl');
        const rc = (capi.SQLITE_FCNTL_SYNC===opId)
              ? opRun('xSync', pFile, 0)
              : capi.SQLITE_NOTFOUND;
        mTimeEnd();
        return rc;
      },
      xFileSize: function(pFile,pSz64){
        mTimeStart('xFileSize');
        const rc = opRun('xFileSize', pFile);
        if(0==rc){
          const sz = state.s11n.deserialize()[0];
          wasm.setMemValue(pSz64, sz, 'i64');
        }
        mTimeEnd();
        return rc;
      },
      xLock: function(pFile,lockType){
        mTimeStart('xLock');
        const f = __openFiles[pFile];
        let rc = 0;
        if( capi.SQLITE_LOCK_NONE === f.lockType ) {
          rc = opRun('xLock', pFile, lockType);
          if( 0===rc ) f.lockType = lockType;
        }else{
          f.lockType = lockType;
        }
        mTimeEnd();
        return rc;
      },
      xRead: function(pFile,pDest,n,offset64){
        mTimeStart('xRead');
        const f = __openFiles[pFile];
        let rc;
        try {
          rc = opRun('xRead',pFile, n, Number(offset64));
          if(0===rc || capi.SQLITE_IOERR_SHORT_READ===rc){ 
            
            wasm.heap8u().set(f.sabView.subarray(0, n), pDest);
          }
        }catch(e){
          error("xRead(",arguments,") failed:",e,f);
          rc = capi.SQLITE_IOERR_READ;
        }
        mTimeEnd();
        return rc;
      },
      xSync: function(pFile,flags){
        ++metrics.xSync.count;
        return 0; 
      },
      xTruncate: function(pFile,sz64){
        mTimeStart('xTruncate');
        const rc = opRun('xTruncate', pFile, Number(sz64));
        mTimeEnd();
        return rc;
      },
      xUnlock: function(pFile,lockType){
        mTimeStart('xUnlock');
        const f = __openFiles[pFile];
        let rc = 0;
        if( capi.SQLITE_LOCK_NONE === lockType
          && f.lockType ){
          rc = opRun('xUnlock', pFile, lockType);
        }
        if( 0===rc ) f.lockType = lockType;
        mTimeEnd();
        return rc;
      },
      xWrite: function(pFile,pSrc,n,offset64){
        mTimeStart('xWrite');
        const f = __openFiles[pFile];
        let rc;
        try {
          f.sabView.set(wasm.heap8u().subarray(pSrc, pSrc+n));
          rc = opRun('xWrite', pFile, n, Number(offset64));
        }catch(e){
          error("xWrite(",arguments,") failed:",e,f);
          rc = capi.SQLITE_IOERR_WRITE;
        }
        mTimeEnd();
        return rc;
      }
    };

    
    const vfsSyncWrappers = {
      xAccess: function(pVfs,zName,flags,pOut){
        mTimeStart('xAccess');
        const rc = opRun('xAccess', wasm.cstringToJs(zName));
        wasm.setMemValue( pOut, (rc ? 0 : 1), 'i32' );
        mTimeEnd();
        return 0;
      },
      xCurrentTime: function(pVfs,pOut){
        
        wasm.setMemValue(pOut, 2440587.5 + (new Date().getTime()/86400000),
                         'double');
        return 0;
      },
      xCurrentTimeInt64: function(pVfs,pOut){
        
        wasm.setMemValue(pOut, (2440587.5 * 86400000) + new Date().getTime(),
                         'i64');
        return 0;
      },
      xDelete: function(pVfs, zName, doSyncDir){
        mTimeStart('xDelete');
        opRun('xDelete', wasm.cstringToJs(zName), doSyncDir, false);
        
        mTimeEnd();
        return 0;
      },
      xFullPathname: function(pVfs,zName,nOut,pOut){
        
        const i = wasm.cstrncpy(pOut, zName, nOut);
        return i<nOut ? 0 : capi.SQLITE_CANTOPEN
        ;
      },
      xGetLastError: function(pVfs,nOut,pOut){
        
        warn("OPFS xGetLastError() has nothing sensible to return.");
        return 0;
      },
      
      xOpen: function f(pVfs, zName, pFile, flags, pOutFlags){
        mTimeStart('xOpen');
        if(0===zName){
          zName = randomFilename();
        }else if('number'===typeof zName){
          zName = wasm.cstringToJs(zName);
        }
        const fh = Object.create(null);
        fh.fid = pFile;
        fh.filename = zName;
        fh.sab = new SharedArrayBuffer(state.fileBufferSize);
        fh.flags = flags;
        const rc = opRun('xOpen', pFile, zName, flags);
        if(!rc){
          
          if(fh.readOnly){
            wasm.setMemValue(pOutFlags, capi.SQLITE_OPEN_READONLY, 'i32');
          }
          __openFiles[pFile] = fh;
          fh.sabView = state.sabFileBufView;
          fh.sq3File = new sqlite3_file(pFile);
          fh.sq3File.$pMethods = opfsIoMethods.pointer;
          fh.lockType = capi.SQLITE_LOCK_NONE;
        }
        mTimeEnd();
        return rc;
      }
    };

    if(dVfs){
      opfsVfs.$xRandomness = dVfs.$xRandomness;
      opfsVfs.$xSleep = dVfs.$xSleep;
    }
    if(!opfsVfs.$xRandomness){
      
      vfsSyncWrappers.xRandomness = function(pVfs, nOut, pOut){
        const heap = wasm.heap8u();
        let i = 0;
        for(; i < nOut; ++i) heap[pOut + i] = (Math.random()*255000) & 0xFF;
        return i;
      };
    }
    if(!opfsVfs.$xSleep){
      
      vfsSyncWrappers.xSleep = function(pVfs,ms){
        Atomics.wait(state.sabOPView, state.opIds.xSleep, 0, ms);
        return 0;
      };
    }

    
    for(let k of Object.keys(ioSyncWrappers)){
      installMethod(opfsIoMethods, k, ioSyncWrappers[k]);
    }
    for(let k of Object.keys(vfsSyncWrappers)){
      installMethod(opfsVfs, k, vfsSyncWrappers[k]);
    }

    
    opfsUtil.deleteEntry = function(fsEntryName,recursive=false){
      mTimeStart('xDelete');
      const rc = opRun('xDelete', fsEntryName, 0, recursive);
      mTimeEnd();
      return 0===rc;
    };
    
    opfsUtil.mkdir = function(absDirName){
      mTimeStart('mkdir');
      const rc = opRun('mkdir', absDirName);
      mTimeEnd();
      return 0===rc;
    };
    
    opfsUtil.entryExists = function(fsEntryName){
      return 0===opRun('xAccess', fsEntryName);
    };

    
    opfsUtil.randomFilename = randomFilename;

    
    opfsUtil.registerVfs = (asDefault=false)=>{
      return capi.wasm.exports.sqlite3_vfs_register(
        opfsVfs.pointer, asDefault ? 1 : 0
      );
    };

    
    opfsUtil.debug = {
      asyncShutdown: ()=>{
        warn("Shutting down OPFS async listener. OPFS will no longer work.");
        opRun('opfs-async-shutdown');
      },
      asyncRestart: ()=>{
        warn("Attempting to restart OPFS async listener. Might work, might not.");
        W.postMessage({type: 'opfs-async-restart'});
      }
    };

    
    

    if(sqlite3.oo1){
      opfsUtil.OpfsDb = function(...args){
        const opt = sqlite3.oo1.dbCtorHelper.normalizeArgs(...args);
        opt.vfs = opfsVfs.$zName;
        sqlite3.oo1.dbCtorHelper.call(this, opt);
      };
      opfsUtil.OpfsDb.prototype = Object.create(sqlite3.oo1.DB.prototype);
      sqlite3.oo1.dbCtorHelper.setVfsPostOpenSql(
        opfsVfs.pointer,
        [
          
          "pragma journal_mode=truncate;"
          
          
        ].join('')
      );
    }

    
    const sanityCheck = function(){
      const scope = wasm.scopedAllocPush();
      const sq3File = new sqlite3_file();
      try{
        const fid = sq3File.pointer;
        const openFlags = capi.SQLITE_OPEN_CREATE
              | capi.SQLITE_OPEN_READWRITE
        
              | capi.SQLITE_OPEN_MAIN_DB;
        const pOut = wasm.scopedAlloc(8);
        const dbFile = "/sanity/check/file"+randomFilename(8);
        const zDbFile = wasm.scopedAllocCString(dbFile);
        let rc;
        state.s11n.serialize("This is ä string.");
        rc = state.s11n.deserialize();
        log("deserialize() says:",rc);
        if("This is ä string."!==rc[0]) toss("String d13n error.");
        vfsSyncWrappers.xAccess(opfsVfs.pointer, zDbFile, 0, pOut);
        rc = wasm.getMemValue(pOut,'i32');
        log("xAccess(",dbFile,") exists ?=",rc);
        rc = vfsSyncWrappers.xOpen(opfsVfs.pointer, zDbFile,
                                   fid, openFlags, pOut);
        log("open rc =",rc,"state.sabOPView[xOpen] =",
            state.sabOPView[state.opIds.xOpen]);
        if(0!==rc){
          error("open failed with code",rc);
          return;
        }
        vfsSyncWrappers.xAccess(opfsVfs.pointer, zDbFile, 0, pOut);
        rc = wasm.getMemValue(pOut,'i32');
        if(!rc) toss("xAccess() failed to detect file.");
        rc = ioSyncWrappers.xSync(sq3File.pointer, 0);
        if(rc) toss('sync failed w/ rc',rc);
        rc = ioSyncWrappers.xTruncate(sq3File.pointer, 1024);
        if(rc) toss('truncate failed w/ rc',rc);
        wasm.setMemValue(pOut,0,'i64');
        rc = ioSyncWrappers.xFileSize(sq3File.pointer, pOut);
        if(rc) toss('xFileSize failed w/ rc',rc);
        log("xFileSize says:",wasm.getMemValue(pOut, 'i64'));
        rc = ioSyncWrappers.xWrite(sq3File.pointer, zDbFile, 10, 1);
        if(rc) toss("xWrite() failed!");
        const readBuf = wasm.scopedAlloc(16);
        rc = ioSyncWrappers.xRead(sq3File.pointer, readBuf, 6, 2);
        wasm.setMemValue(readBuf+6,0);
        let jRead = wasm.cstringToJs(readBuf);
        log("xRead() got:",jRead);
        if("sanity"!==jRead) toss("Unexpected xRead() value.");
        if(vfsSyncWrappers.xSleep){
          log("xSleep()ing before close()ing...");
          vfsSyncWrappers.xSleep(opfsVfs.pointer,2000);
          log("waking up from xSleep()");
        }
        rc = ioSyncWrappers.xClose(fid);
        log("xClose rc =",rc,"sabOPView =",state.sabOPView);
        log("Deleting file:",dbFile);
        vfsSyncWrappers.xDelete(opfsVfs.pointer, zDbFile, 0x1234);
        vfsSyncWrappers.xAccess(opfsVfs.pointer, zDbFile, 0, pOut);
        rc = wasm.getMemValue(pOut,'i32');
        if(rc) toss("Expecting 0 from xAccess(",dbFile,") after xDelete().");
        warn("End of OPFS sanity checks.");
      }finally{
        sq3File.dispose();
        wasm.scopedAllocPop(scope);
      }
    };

    W.onmessage = function({data}){
      
      switch(data.type){
          case 'opfs-async-loaded':
            
            W.postMessage({type: 'opfs-async-init',args: state});
            break;
          case 'opfs-async-inited':{
            
            try {
              const rc = capi.sqlite3_vfs_register(opfsVfs.pointer, 0);
              if(rc){
                toss("sqlite3_vfs_register(OPFS) failed with rc",rc);
              }
              if(opfsVfs.pointer !== capi.sqlite3_vfs_find("opfs")){
                toss("BUG: sqlite3_vfs_find() failed for just-installed OPFS VFS");
              }
              capi.sqlite3_vfs_register.addReference(opfsVfs, opfsIoMethods);
              state.sabOPView = new Int32Array(state.sabOP);
              state.sabFileBufView = new Uint8Array(state.sabIO, 0, state.fileBufferSize);
              state.sabS11nView = new Uint8Array(state.sabIO, state.sabS11nOffset, state.sabS11nSize);
              initS11n();
              if(options.sanityChecks){
                warn("Running sanity checks because of opfs-sanity-check URL arg...");
                sanityCheck();
              }
              navigator.storage.getDirectory().then((d)=>{
                W.onerror = W._originalOnError;
                delete W._originalOnError;
                sqlite3.opfs = opfsUtil;
                opfsUtil.rootDirectory = d;
                log("End of OPFS sqlite3_vfs setup.", opfsVfs);
                promiseResolve(sqlite3);
              });
            }catch(e){
              error(e);
              promiseReject(e);
            }
            break;
          }
          default:
            promiseReject(e);
            error("Unexpected message from the async worker:",data);
            break;
      }
    };
  });
  return thePromise;
};
installOpfsVfs.defaultProxyUri =
  "sqlite3-opfs-async-proxy.js";
self.sqlite3ApiBootstrap.initializersAsync.push(async (sqlite3)=>{
  if(sqlite3.scriptInfo && !sqlite3.scriptInfo.isWorker){
    return;
  }
  try{
    let proxyJs = installOpfsVfs.defaultProxyUri;
    if(sqlite3.scriptInfo.sqlite3Dir){
      installOpfsVfs.defaultProxyUri =
        sqlite3.scriptInfo.sqlite3Dir + proxyJs;
      
    }
    return installOpfsVfs().catch((e)=>{
      console.warn("Ignoring inability to install OPFS sqlite3_vfs:",e.message);
    });
  }catch(e){
    console.error("installOpfsVfs() exception:",e);
    throw e;
  }
});
});



'use strict';
if('undefined' !== typeof Module){ 
  
  const SABC = Object.assign(
    Object.create(null), {
      Module: Module ,
      exports: Module['asm'],
      memory: Module.wasmMemory 
    },
    self.sqlite3ApiConfig || Object.create(null)
  );

  
  
  self.sqlite3ApiConfig = SABC;
  let sqlite3;
  try{
    sqlite3 = self.sqlite3ApiBootstrap();
  }catch(e){
    console.error("sqlite3ApiBootstrap() error:",e);
    throw e;
  }finally{
    delete self.sqlite3ApiBootstrap;
    delete self.sqlite3ApiConfig;
  }

  if(self.location && +self.location.port > 1024){
    console.warn("Installing sqlite3 bits as global S for local dev/test purposes.");
    self.S = sqlite3;
  }

  
  delete sqlite3.capi.util ;
  Module.sqlite3 = sqlite3 ;
}else{
  console.warn("This is not running in an Emscripten module context, so",
               "self.sqlite3ApiBootstrap() is _not_ being called due to lack",
               "of config info for the WASM environment.",
               "It must be called manually.");
}




});



  return sqlite3InitModule.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = sqlite3InitModule;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return sqlite3InitModule; });
else if (typeof exports === 'object')
  exports["sqlite3InitModule"] = sqlite3InitModule;

(function(){
  
  const originalInit = self.sqlite3InitModule;
  if(!originalInit){
    throw new Error("Expecting self.sqlite3InitModule to be defined by the Emscripten build.");
  }
  
  const initModuleState = self.sqlite3InitModuleState = Object.assign(Object.create(null),{
    moduleScript: self?.document?.currentScript,
    isWorker: ('undefined' !== typeof WorkerGlobalScope),
    location: self.location,
    urlParams: new URL(self.location.href).searchParams
  });
  if(initModuleState.urlParams.has('sqlite3.dir')){
    initModuleState.sqlite3Dir = initModuleState.urlParams.get('sqlite3.dir') +'/';
  }else if(initModuleState.moduleScript){
    const li = initModuleState.moduleScript.src.split('/');
    li.pop();
    initModuleState.sqlite3Dir = li.join('/') + '/';
  }
  

  self.sqlite3InitModule = (...args)=>{
    
    return originalInit(...args).then((EmscriptenModule)=>{
      if(self.window!==self &&
         (EmscriptenModule['ENVIRONMENT_IS_PTHREAD']
          || EmscriptenModule['_pthread_self']
          || 'function'===typeof threadAlert
          || self.location.pathname.endsWith('.worker.js')
         )){
        
        return EmscriptenModule;
      }
      EmscriptenModule.sqlite3.scriptInfo = initModuleState;
      
      const f = EmscriptenModule.sqlite3.asyncPostInit;
      delete EmscriptenModule.sqlite3.asyncPostInit;
      return f();
    }).catch((e)=>{
      console.error("Exception loading sqlite3 module:",e);
      throw e;
    });
  };
  self.sqlite3InitModule.ready = originalInit.ready;

  if(self.sqlite3InitModuleState.moduleScript){
    const sim = self.sqlite3InitModuleState;
    let src = sim.moduleScript.src.split('/');
    src.pop();
    sim.scriptDir = src.join('/') + '/';
  }
  if(0){
    console.warn("Replaced sqlite3InitModule()");
    console.warn("self.location.href =",self.location.href);
    if('undefined' !== typeof document){
      console.warn("document.currentScript.src =",
                   document?.currentScript?.src);
    }
  }
  
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = sqlite3InitModule;
  else if (typeof exports === 'object')
    exports["sqlite3InitModule"] = sqlite3InitModule;
  
})();
