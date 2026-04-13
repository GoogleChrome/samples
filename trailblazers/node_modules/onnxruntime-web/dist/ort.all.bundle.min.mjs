/*!
 * ONNX Runtime Web v1.25.0-dev.20260327-722743c0e2
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var tI=Object.create;var ui=Object.defineProperty;var nI=Object.getOwnPropertyDescriptor;var rI=Object.getOwnPropertyNames;var oI=Object.getPrototypeOf,iI=Object.prototype.hasOwnProperty;var Ps=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,n)=>(typeof require<"u"?require:e)[n]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var N=(r,e)=>()=>(r&&(e=r(r=0)),e);var re=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),Sr=(r,e)=>{for(var n in e)ui(r,n,{get:e[n],enumerable:!0})},Fp=(r,e,n,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of rI(e))!iI.call(r,o)&&o!==n&&ui(r,o,{get:()=>e[o],enumerable:!(t=nI(e,o))||t.enumerable});return r};var ye=(r,e,n)=>(n=r!=null?tI(oI(r)):{},Fp(e||!r||!r.__esModule?ui(n,"default",{value:r,enumerable:!0}):n,r)),Xr=r=>Fp(ui({},"__esModule",{value:!0}),r);var li,$r,ar,aI,Vp,Es=N(()=>{"use strict";li=new Map,$r=[],ar=(r,e,n)=>{if(e&&typeof e.init=="function"&&typeof e.createInferenceSessionHandler=="function"){let t=li.get(r);if(t===void 0)li.set(r,{backend:e,priority:n});else{if(t.priority>n)return;if(t.priority===n&&t.backend!==e)throw new Error(`cannot register backend "${r}" using priority ${n}`)}if(n>=0){let o=$r.indexOf(r);o!==-1&&$r.splice(o,1);for(let i=0;i<$r.length;i++)if(li.get($r[i]).priority<=n){$r.splice(i,0,r);return}$r.push(r)}return}throw new TypeError("not a valid backend")},aI=async r=>{let e=li.get(r);if(!e)return"backend not found.";if(e.initialized)return e.backend;if(e.aborted)return e.error;{let n=!!e.initPromise;try{return n||(e.initPromise=e.backend.init(r)),await e.initPromise,e.initialized=!0,e.backend}catch(t){return n||(e.error=`${t}`,e.aborted=!0),e.error}finally{delete e.initPromise}}},Vp=async r=>{let e=r.executionProviders||[],n=e.map(u=>typeof u=="string"?u:u.name),t=n.length===0?$r:n,o,i=[],a=new Set;for(let u of t){let l=await aI(u);typeof l=="string"?i.push({name:u,err:l}):(o||(o=l),o===l&&a.add(u))}if(!o)throw new Error(`no available backend found. ERR: ${i.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:l}of i)n.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${l}`);let s=e.filter(u=>a.has(typeof u=="string"?u:u.name));return[o,new Proxy(r,{get:(u,l)=>l==="executionProviders"?s:Reflect.get(u,l)})]}});var Gp=N(()=>{"use strict";Es()});var Up,Wp=N(()=>{"use strict";Up="1.24.0-dev.20251116-b39e144322"});var Hp,st,Cs=N(()=>{"use strict";Wp();Hp="warning",st={wasm:{},webgl:{},webgpu:{},versions:{common:Up},set logLevel(r){if(r!==void 0){if(typeof r!="string"||["verbose","info","warning","error","fatal"].indexOf(r)===-1)throw new Error(`Unsupported logging level: ${r}`);Hp=r}},get logLevel(){return Hp}};Object.defineProperty(st,"logLevel",{enumerable:!0})});var ce,qp=N(()=>{"use strict";Cs();ce=st});var jp,Kp,Xp=N(()=>{"use strict";jp=(r,e)=>{let n=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);n.width=r.dims[3],n.height=r.dims[2];let t=n.getContext("2d");if(t!=null){let o,i;e?.tensorLayout!==void 0&&e.tensorLayout==="NHWC"?(o=r.dims[2],i=r.dims[3]):(o=r.dims[3],i=r.dims[2]);let a=e?.format!==void 0?e.format:"RGB",s=e?.norm,u,l;s===void 0||s.mean===void 0?u=[255,255,255,255]:typeof s.mean=="number"?u=[s.mean,s.mean,s.mean,s.mean]:(u=[s.mean[0],s.mean[1],s.mean[2],0],s.mean[3]!==void 0&&(u[3]=s.mean[3])),s===void 0||s.bias===void 0?l=[0,0,0,0]:typeof s.bias=="number"?l=[s.bias,s.bias,s.bias,s.bias]:(l=[s.bias[0],s.bias[1],s.bias[2],0],s.bias[3]!==void 0&&(l[3]=s.bias[3]));let d=i*o,p=0,h=d,g=d*2,b=-1;a==="RGBA"?(p=0,h=d,g=d*2,b=d*3):a==="RGB"?(p=0,h=d,g=d*2):a==="RBG"&&(p=0,g=d,h=d*2);for(let _=0;_<i;_++)for(let I=0;I<o;I++){let w=(r.data[p++]-l[0])*u[0],v=(r.data[h++]-l[1])*u[1],$=(r.data[g++]-l[2])*u[2],A=b===-1?255:(r.data[b++]-l[3])*u[3];t.fillStyle="rgba("+w+","+v+","+$+","+A+")",t.fillRect(I,_,1,1)}if("toDataURL"in n)return n.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Kp=(r,e)=>{let n=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),t;if(n!=null){let o,i,a;e?.tensorLayout!==void 0&&e.tensorLayout==="NHWC"?(o=r.dims[2],i=r.dims[1],a=r.dims[3]):(o=r.dims[3],i=r.dims[2],a=r.dims[1]);let s=e!==void 0&&e.format!==void 0?e.format:"RGB",u=e?.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let p=i*o;if(e!==void 0&&(e.format!==void 0&&a===4&&e.format!=="RGBA"||a===3&&e.format!=="RGB"&&e.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,g=0,b=1,_=2,I=3,w=0,v=p,$=p*2,A=-1;s==="RGBA"?(w=0,v=p,$=p*2,A=p*3):s==="RGB"?(w=0,v=p,$=p*2):s==="RBG"&&(w=0,$=p,v=p*2),t=n.createImageData(o,i);for(let P=0;P<i*o;g+=h,b+=h,_+=h,I+=h,P++)t.data[g]=(r.data[w++]-d[0])*l[0],t.data[b]=(r.data[v++]-d[1])*l[1],t.data[_]=(r.data[$++]-d[2])*l[2],t.data[I]=A===-1?255:(r.data[A++]-d[3])*l[3]}else throw new Error("Can not access image data");return t}});var Ds,Zp,Jp,Qp,Yp,ef,tf=N(()=>{"use strict";ci();Ds=(r,e)=>{if(r===void 0)throw new Error("Image buffer must be defined");if(e.height===void 0||e.width===void 0)throw new Error("Image height and width must be defined");if(e.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:n,width:t}=e,o=e.norm??{mean:255,bias:0},i,a;typeof o.mean=="number"?i=[o.mean,o.mean,o.mean,o.mean]:i=[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],typeof o.bias=="number"?a=[o.bias,o.bias,o.bias,o.bias]:a=[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];let s=e.format!==void 0?e.format:"RGBA",u=e.tensorFormat!==void 0&&e.tensorFormat!==void 0?e.tensorFormat:"RGB",l=n*t,d=u==="RGBA"?new Float32Array(l*4):new Float32Array(l*3),p=4,h=0,g=1,b=2,_=3,I=0,w=l,v=l*2,$=-1;s==="RGB"&&(p=3,h=0,g=1,b=2,_=-1),u==="RGBA"?$=l*3:u==="RBG"?(I=0,v=l,w=l*2):u==="BGR"&&(v=0,w=l,I=l*2);for(let P=0;P<l;P++,h+=p,b+=p,g+=p,_+=p)d[I++]=(r[h]+a[0])/i[0],d[w++]=(r[g]+a[1])/i[1],d[v++]=(r[b]+a[2])/i[2],$!==-1&&_!==-1&&(d[$++]=(r[_]+a[3])/i[3]);return u==="RGBA"?new pt("float32",d,[1,4,n,t]):new pt("float32",d,[1,3,n,t])},Zp=async(r,e)=>{let n=typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement,t=typeof ImageData<"u"&&r instanceof ImageData,o=typeof ImageBitmap<"u"&&r instanceof ImageBitmap,i=typeof r=="string",a,s=e??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},l=d=>typeof HTMLCanvasElement<"u"&&d instanceof HTMLCanvasElement||d instanceof OffscreenCanvas?d.getContext("2d"):null;if(n){let d=u();d.width=r.width,d.height=r.height;let p=l(d);if(p!=null){let h=r.height,g=r.width;if(e!==void 0&&e.resizedHeight!==void 0&&e.resizedWidth!==void 0&&(h=e.resizedHeight,g=e.resizedWidth),e!==void 0){if(s=e,e.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");s.tensorFormat="RGBA",s.height=h,s.width=g}else s.tensorFormat="RGBA",s.height=h,s.width=g;p.drawImage(r,0,0),a=p.getImageData(0,0,g,h).data}else throw new Error("Can not access image data")}else if(t){let d,p;if(e!==void 0&&e.resizedWidth!==void 0&&e.resizedHeight!==void 0?(d=e.resizedHeight,p=e.resizedWidth):(d=r.height,p=r.width),e!==void 0&&(s=e),s.format="RGBA",s.height=d,s.width=p,e!==void 0){let h=u();h.width=p,h.height=d;let g=l(h);if(g!=null)g.putImageData(r,0,0),a=g.getImageData(0,0,p,d).data;else throw new Error("Can not access image data")}else a=r.data}else if(o){if(e===void 0)throw new Error("Please provide image config with format for Imagebitmap");let d=u();d.width=r.width,d.height=r.height;let p=l(d);if(p!=null){let h=r.height,g=r.width;return p.drawImage(r,0,0,g,h),a=p.getImageData(0,0,g,h).data,s.height=h,s.width=g,Ds(a,s)}else throw new Error("Can not access image data")}else{if(i)return new Promise((d,p)=>{let h=u(),g=l(h);if(!r||!g)return p();let b=new Image;b.crossOrigin="Anonymous",b.src=r,b.onload=()=>{h.width=b.width,h.height=b.height,g.drawImage(b,0,0,h.width,h.height);let _=g.getImageData(0,0,h.width,h.height);s.height=h.height,s.width=h.width,d(Ds(_.data,s))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(a!==void 0)return Ds(a,s);throw new Error("Input data provided is not supported - aborted tensor creation")},Jp=(r,e)=>{let{width:n,height:t,download:o,dispose:i}=e,a=[1,t,n,4];return new pt({location:"texture",type:"float32",texture:r,dims:a,download:o,dispose:i})},Qp=(r,e)=>{let{dataType:n,dims:t,download:o,dispose:i}=e;return new pt({location:"gpu-buffer",type:n??"float32",gpuBuffer:r,dims:t,download:o,dispose:i})},Yp=(r,e)=>{let{dataType:n,dims:t,download:o,dispose:i}=e;return new pt({location:"ml-tensor",type:n??"float32",mlTensor:r,dims:t,download:o,dispose:i})},ef=(r,e,n)=>new pt({location:"cpu-pinned",type:r,data:e,dims:n??[e.length]})});var Ar,_o,nf,rf,of=N(()=>{"use strict";Ar=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),_o=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),nf=!1,rf=()=>{if(!nf){nf=!0;let r=typeof BigInt64Array<"u"&&BigInt64Array.from,e=typeof BigUint64Array<"u"&&BigUint64Array.from,n=globalThis.Float16Array,t=typeof n<"u"&&n.from;r&&(Ar.set("int64",BigInt64Array),_o.set(BigInt64Array,"int64")),e&&(Ar.set("uint64",BigUint64Array),_o.set(BigUint64Array,"uint64")),t?(Ar.set("float16",n),_o.set(n,"float16")):Ar.set("float16",Uint16Array)}}});var af,sf,uf=N(()=>{"use strict";ci();af=r=>{let e=1;for(let n=0;n<r.length;n++){let t=r[n];if(typeof t!="number"||!Number.isSafeInteger(t))throw new TypeError(`dims[${n}] must be an integer, got: ${t}`);if(t<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${t}`);e*=t}return e},sf=(r,e)=>{switch(r.location){case"cpu":return new pt(r.type,r.data,e);case"cpu-pinned":return new pt({location:"cpu-pinned",data:r.data,type:r.type,dims:e});case"texture":return new pt({location:"texture",texture:r.texture,type:r.type,dims:e});case"gpu-buffer":return new pt({location:"gpu-buffer",gpuBuffer:r.gpuBuffer,type:r.type,dims:e});case"ml-tensor":return new pt({location:"ml-tensor",mlTensor:r.mlTensor,type:r.type,dims:e});default:throw new Error(`tensorReshape: tensor location ${r.location} is not supported`)}}});var pt,ci=N(()=>{"use strict";Xp();tf();of();uf();pt=class{constructor(e,n,t){rf();let o,i;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,o=e.type,i=e.dims,e.location){case"cpu-pinned":{let s=Ar.get(o);if(!s)throw new TypeError(`unsupported type "${o}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(o!=="float32")throw new TypeError(`unsupported type "${o}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(o!=="float32"&&o!=="float16"&&o!=="int32"&&o!=="int64"&&o!=="uint32"&&o!=="uint8"&&o!=="bool"&&o!=="uint4"&&o!=="int4")throw new TypeError(`unsupported type "${o}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(o!=="float32"&&o!=="float16"&&o!=="int32"&&o!=="int64"&&o!=="uint32"&&o!=="uint64"&&o!=="int8"&&o!=="uint8"&&o!=="bool"&&o!=="uint4"&&o!=="int4")throw new TypeError(`unsupported type "${o}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(o=e,u=t,e==="string"){if(!Array.isArray(n))throw new TypeError("A string tensor's data must be a string array.");s=n}else{let l=Ar.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(n)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(n,BigInt):s=l.from(n)}else if(n instanceof l)s=n;else if(n instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(n);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&n instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(n.buffer,n.byteOffset,n.length);else throw new TypeError(`A ${o} tensor's data must be type of ${l}`)}else if(u=n,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")o="string",s=e;else if(l==="boolean")o="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)o="uint8",s=Uint8Array.from(e);else{let l=_o.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);o=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");i=u,this.cpuData=s,this.dataLocation="cpu"}let a=af(i);if(this.cpuData&&a!==this.cpuData.length&&!((o==="uint4"||o==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=o,this.dims=i,this.size=a}static async fromImage(e,n){return Zp(e,n)}static fromTexture(e,n){return Jp(e,n)}static fromGpuBuffer(e,n){return Qp(e,n)}static fromMLTensor(e,n){return Yp(e,n)}static fromPinnedBuffer(e,n,t){return ef(e,n,t)}toDataURL(e){return jp(this,e)}toImageData(e){return Kp(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let n=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=n,e&&this.disposer&&(this.disposer(),this.disposer=void 0),n}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return sf(this,e)}}});var $t,ks=N(()=>{"use strict";ci();$t=pt});var di,lf,At,_t,sr,ur,Ns=N(()=>{"use strict";Cs();di=(r,e)=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||console.timeStamp(`${r}::ORT::${e}`)},lf=(r,e)=>{let n=new Error().stack?.split(/\r\n|\r|\n/g)||[],t=!1;for(let o=0;o<n.length;o++){if(t&&!n[o].includes("TRACE_FUNC")){let i=`FUNC_${r}::${n[o].trim().split(" ")[1]}`;e&&(i+=`::${e}`),di("CPU",i);return}n[o].includes("TRACE_FUNC")&&(t=!0)}},At=r=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||lf("BEGIN",r)},_t=r=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||lf("END",r)},sr=r=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||console.time(`ORT::${r}`)},ur=r=>{(typeof st.trace>"u"?!st.wasm.trace:!st.trace)||console.timeEnd(`ORT::${r}`)}});var pi,cf=N(()=>{"use strict";Es();ks();Ns();pi=class r{constructor(e){this.handler=e}async run(e,n,t){At(),sr("InferenceSession.run");let o={},i={};if(typeof e!="object"||e===null||e instanceof $t||Array.isArray(e))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if(typeof n=="object"){if(n===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(n instanceof $t)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(n)){if(n.length===0)throw new TypeError("'fetches' cannot be an empty array.");a=!1;for(let l of n){if(typeof l!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(l)===-1)throw new RangeError(`'fetches' contains invalid output name: ${l}.`);o[l]=null}if(typeof t=="object"&&t!==null)i=t;else if(typeof t<"u")throw new TypeError("'options' must be an object.")}else{let l=!1,d=Object.getOwnPropertyNames(n);for(let p of this.outputNames)if(d.indexOf(p)!==-1){let h=n[p];(h===null||h instanceof $t)&&(l=!0,a=!1,o[p]=h)}if(l){if(typeof t=="object"&&t!==null)i=t;else if(typeof t<"u")throw new TypeError("'options' must be an object.")}else i=n}}else if(typeof n<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let l of this.inputNames)if(typeof e[l]>"u")throw new Error(`input '${l}' is missing in 'feeds'.`);if(a)for(let l of this.outputNames)o[l]=null;let s=await this.handler.run(e,o,i),u={};for(let l in s)if(Object.hasOwnProperty.call(s,l)){let d=s[l];d instanceof $t?u[l]=d:u[l]=new $t(d.type,d.data,d.dims)}return ur("InferenceSession.run"),_t(),u}async release(){return this.handler.dispose()}static async create(e,n,t,o){At(),sr("InferenceSession.create");let i,a={};if(typeof e=="string"){if(i=e,typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(e instanceof Uint8Array){if(i=e,typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(e instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&e instanceof SharedArrayBuffer){let d=e,p=0,h=e.byteLength;if(typeof n=="object"&&n!==null)a=n;else if(typeof n=="number"){if(p=n,!Number.isSafeInteger(p))throw new RangeError("'byteOffset' must be an integer.");if(p<0||p>=d.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${d.byteLength}).`);if(h=e.byteLength-p,typeof t=="number"){if(h=t,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||p+h>d.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${d.byteLength-p}].`);if(typeof o=="object"&&o!==null)a=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(typeof t<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof n<"u")throw new TypeError("'options' must be an object.");i=new Uint8Array(d,p,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[s,u]=await Vp(a),l=await s.createInferenceSessionHandler(i,u);return ur("InferenceSession.create"),_t(),new r(l)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}});var sI,df=N(()=>{"use strict";cf();sI=pi});var pf=N(()=>{"use strict"});var ff=N(()=>{"use strict"});var hf=N(()=>{"use strict"});var mf=N(()=>{"use strict"});var Ls={};Sr(Ls,{InferenceSession:()=>sI,TRACE:()=>di,TRACE_EVENT_BEGIN:()=>sr,TRACE_EVENT_END:()=>ur,TRACE_FUNC_BEGIN:()=>At,TRACE_FUNC_END:()=>_t,Tensor:()=>$t,env:()=>ce,registerBackend:()=>ar});var ft=N(()=>{"use strict";Gp();qp();df();ks();pf();ff();Ns();hf();mf()});function lr(r,e,n,t){if(e===void 0)return lI(r);if(n===void 0)fi(r,e,1);else if(typeof n=="number"&&t===void 0)fi(r,e,n);else if(typeof n=="string"&&t===void 0)fi(r,n,1,e);else if(typeof n=="string"&&typeof t=="number")fi(r,n,t,e);else throw new TypeError("input is valid")}function lI(r){return{verbose:lr.verbose.bind(null,r),info:lr.info.bind(null,r),warning:lr.warning.bind(null,r),error:lr.error.bind(null,r),fatal:lr.fatal.bind(null,r)}}function fi(r,e,n,t){let o=wo[t||""]||wo[""];bf[r]<bf[o.minimalSeverity]||(o.logDateTime&&(e=`${new Date().toISOString()}|${e}`),o.logSourceLocation,uI[o.provider].log(r,e,t))}var Rs,zs,bf,uI,yf,wo,Be,mi,gi,bi,hi,Dt=N(()=>{"use strict";Rs=class{log(e,n,t){}},zs=class{log(e,n,t){console.log(`${this.color(e)} ${t?"\x1B[35m"+t+"\x1B[0m ":""}${n}`)}color(e){switch(e){case"verbose":return"\x1B[34;40mv\x1B[0m";case"info":return"\x1B[32mi\x1B[0m";case"warning":return"\x1B[30;43mw\x1B[0m";case"error":return"\x1B[31;40me\x1B[0m";case"fatal":return"\x1B[101mf\x1B[0m";default:throw new Error(`unsupported severity: ${e}`)}}},bf={verbose:1e3,info:2e3,warning:4e3,error:5e3,fatal:6e3},uI={none:new Rs,console:new zs},yf={provider:"console",minimalSeverity:"warning",logDateTime:!0,logSourceLocation:!1},wo={"":yf};(u=>{function r(l,d){u("verbose",l,d)}u.verbose=r;function e(l,d){u("info",l,d)}u.info=e;function n(l,d){u("warning",l,d)}u.warning=n;function t(l,d){u("error",l,d)}u.error=t;function o(l,d){u("fatal",l,d)}u.fatal=o;function i(l){wo={},a("",l||{})}u.reset=i;function a(l,d){if(l==="*")i(d);else{let p=wo[l]||yf;wo[l]={provider:d.provider||p.provider,minimalSeverity:d.minimalSeverity||p.minimalSeverity,logDateTime:d.logDateTime===void 0?p.logDateTime:d.logDateTime,logSourceLocation:d.logSourceLocation===void 0?p.logSourceLocation:d.logSourceLocation}}}u.set=a;function s(l){let d={};l.logLevel&&(d.minimalSeverity=l.logLevel),a("",d)}u.setWithEnv=s})(lr||={});Be=lr,mi=class{constructor(e,n,t,o,i,a){this.category=e;this.name=n;this.startTime=t;this.endCallback=o;this.timer=i;this.ctx=a}async end(){return this.endCallback(this)}async checkTimer(){if(this.ctx===void 0||this.timer===void 0)throw new Error("No webgl timer found");return this.ctx.endTimer(),this.ctx.waitForQueryAndGetTime(this.timer)}},gi=class{constructor(e,n,t,o){this.category=e;this.name=n;this.startTime=t;this.endTime=o}},bi=class{constructor(e,n,t){this._started=!1;this._flushPointer=0;this._started=!1,this._maxNumberEvents=e===void 0?1e4:e,this._flushBatchSize=n===void 0?10:n,this._flushIntervalInMilliseconds=t===void 0?5e3:t}static create(e){return e===void 0?new this:new this(e.maxNumberEvents,e.flushBatchSize,e.flushIntervalInMilliseconds)}start(){this._started=!0,this._timingEvents=[],this._flushTime=hi(),this._flushPointer=0}stop(){for(this._started=!1;this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer])}event(e,n,t,o){let i=this._started?this.begin(e,n,o):void 0,a=!1,s=t();if(s&&typeof s.then=="function")return a=!0,new Promise((u,l)=>{s.then(async d=>{i&&await i.end(),u(d)},async d=>{i&&await i.end(),l(d)})});if(!a&&i){let u=i.end();if(u&&typeof u.then=="function")return new Promise((l,d)=>{u.then(()=>{l(s)},p=>{d(p)})})}return s}begin(e,n,t){if(!this._started)throw new Error("profiler is not started yet");if(t===void 0){let o=hi();return this.flush(o),new mi(e,n,o,i=>this.endSync(i))}else{let o=t.beginTimer();return new mi(e,n,0,async i=>this.end(i),o,t)}}async end(e){let n=await e.checkTimer();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new gi(e.category,e.name,e.startTime,n)),this.flush(n))}endSync(e){let n=hi();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new gi(e.category,e.name,e.startTime,n)),this.flush(n))}logOneEvent(e){Be.verbose(`Profiler.${e.category}`,`${(e.endTime-e.startTime).toFixed(2)}ms on event '${e.name}' at ${e.endTime.toFixed(2)}`)}flush(e){if(this._timingEvents.length-this._flushPointer>=this._flushBatchSize||e-this._flushTime>=this._flushIntervalInMilliseconds){for(let n=this._flushPointer;this._flushPointer<n+this._flushBatchSize&&this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer]);this._flushTime=hi()}}get started(){return this._started}},hi=typeof performance<"u"&&performance.now?()=>performance.now():Date.now});function _f(r,e,n){for(let t of n){let o=t[0],i=t[1],a=t[2],s=t[3],u=t[4];if(r.opType===o){for(let l of e)if((l.domain===i||l.domain==="ai.onnx"&&i==="")&&cI(l.version,a))return{opImpl:s,opInit:u}}}throw new TypeError(`cannot resolve operator '${r.opType}' with opsets: ${e.map(t=>`${t.domain||"ai.onnx"} v${t.version}`).join(", ")}`)}function cI(r,e){if(e.endsWith("+")){let n=Number.parseInt(e.substring(0,e.length-1),10);return!isNaN(n)&&n<=r}else if(e.split("-").length===2){let n=e.split("-"),t=Number.parseInt(n[0],10),o=Number.parseInt(n[1],10);return!isNaN(t)&&!isNaN(o)&&t<=r&&r<=o}else return Number.parseInt(e,10)===r}var wf=N(()=>{"use strict"});var vf=re(Ms=>{"use strict";Ms.__esModule=!0;var dI=function(){function r(e){if(!e)throw new TypeError("Invalid argument; `value` has no value.");this.value=r.EMPTY,e&&r.isGuid(e)&&(this.value=e)}return r.isGuid=function(e){var n=e.toString();return e&&(e instanceof r||r.validator.test(n))},r.create=function(){return new r([r.gen(2),r.gen(1),r.gen(1),r.gen(1),r.gen(3)].join("-"))},r.createEmpty=function(){return new r("emptyguid")},r.parse=function(e){return new r(e)},r.raw=function(){return[r.gen(2),r.gen(1),r.gen(1),r.gen(1),r.gen(3)].join("-")},r.gen=function(e){for(var n="",t=0;t<e;t++)n+=((1+Math.random())*65536|0).toString(16).substring(1);return n},r.prototype.equals=function(e){return r.isGuid(e)&&this.value===e.toString()},r.prototype.isEmpty=function(){return this.value===r.EMPTY},r.prototype.toString=function(){return this.value},r.prototype.toJSON=function(){return{value:this.value}},r.validator=new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$","i"),r.EMPTY="00000000-0000-0000-0000-000000000000",r}();Ms.Guid=dI});function je(r,e,n){this.low=r|0,this.high=e|0,this.unsigned=!!n}function gt(r){return(r&&r.__isLong__)===!0}function xf(r){var e=Math.clz32(r&-r);return r?31-e:e}function Or(r,e){var n,t,o;return e?(r>>>=0,(o=0<=r&&r<256)&&(t=If[r],t)?t:(n=Le(r,0,!0),o&&(If[r]=n),n)):(r|=0,(o=-128<=r&&r<128)&&(t=Tf[r],t)?t:(n=Le(r,r<0?-1:0,!1),o&&(Tf[r]=n),n))}function Nt(r,e){if(isNaN(r))return e?Jn:Wt;if(e){if(r<0)return Jn;if(r>=Of)return Cf}else{if(r<=-$f)return wt;if(r+1>=$f)return Ef}return r<0?Nt(-r,e).neg():Le(r%Jr|0,r/Jr|0,e)}function Le(r,e,n){return new je(r,e,n)}function Fs(r,e,n){if(r.length===0)throw Error("empty string");if(typeof e=="number"?(n=e,e=!1):e=!!e,r==="NaN"||r==="Infinity"||r==="+Infinity"||r==="-Infinity")return e?Jn:Wt;if(n=n||10,n<2||36<n)throw RangeError("radix");var t;if((t=r.indexOf("-"))>0)throw Error("interior hyphen");if(t===0)return Fs(r.substring(1),e,n).neg();for(var o=Nt(yi(n,8)),i=Wt,a=0;a<r.length;a+=8){var s=Math.min(8,r.length-a),u=parseInt(r.substring(a,a+s),n);if(s<8){var l=Nt(yi(n,s));i=i.mul(l).add(Nt(u))}else i=i.mul(o),i=i.add(Nt(u))}return i.unsigned=e,i}function Ht(r,e){return typeof r=="number"?Nt(r,e):typeof r=="string"?Fs(r,e):Le(r.low,r.high,typeof e=="boolean"?e:r.unsigned)}var kt,Tf,If,yi,Sf,pI,Jr,Of,$f,Af,Wt,Jn,Zr,Pf,Bs,Ef,Cf,wt,H,cr,Vs=N(()=>{kt=null;try{kt=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}je.prototype.__isLong__;Object.defineProperty(je.prototype,"__isLong__",{value:!0});je.isLong=gt;Tf={},If={};je.fromInt=Or;je.fromNumber=Nt;je.fromBits=Le;yi=Math.pow;je.fromString=Fs;je.fromValue=Ht;Sf=65536,pI=1<<24,Jr=Sf*Sf,Of=Jr*Jr,$f=Of/2,Af=Or(pI),Wt=Or(0);je.ZERO=Wt;Jn=Or(0,!0);je.UZERO=Jn;Zr=Or(1);je.ONE=Zr;Pf=Or(1,!0);je.UONE=Pf;Bs=Or(-1);je.NEG_ONE=Bs;Ef=Le(-1,2147483647,!1);je.MAX_VALUE=Ef;Cf=Le(-1,-1,!0);je.MAX_UNSIGNED_VALUE=Cf;wt=Le(0,-2147483648,!1);je.MIN_VALUE=wt;H=je.prototype;H.toInt=function(){return this.unsigned?this.low>>>0:this.low};H.toNumber=function(){return this.unsigned?(this.high>>>0)*Jr+(this.low>>>0):this.high*Jr+(this.low>>>0)};H.toString=function(e){if(e=e||10,e<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(wt)){var n=Nt(e),t=this.div(n),o=t.mul(n).sub(this);return t.toString(e)+o.toInt().toString(e)}else return"-"+this.neg().toString(e);for(var i=Nt(yi(e,6),this.unsigned),a=this,s="";;){var u=a.div(i),l=a.sub(u.mul(i)).toInt()>>>0,d=l.toString(e);if(a=u,a.isZero())return d+s;for(;d.length<6;)d="0"+d;s=""+d+s}};H.getHighBits=function(){return this.high};H.getHighBitsUnsigned=function(){return this.high>>>0};H.getLowBits=function(){return this.low};H.getLowBitsUnsigned=function(){return this.low>>>0};H.getNumBitsAbs=function(){if(this.isNegative())return this.eq(wt)?64:this.neg().getNumBitsAbs();for(var e=this.high!=0?this.high:this.low,n=31;n>0&&(e&1<<n)==0;n--);return this.high!=0?n+33:n+1};H.isZero=function(){return this.high===0&&this.low===0};H.eqz=H.isZero;H.isNegative=function(){return!this.unsigned&&this.high<0};H.isPositive=function(){return this.unsigned||this.high>=0};H.isOdd=function(){return(this.low&1)===1};H.isEven=function(){return(this.low&1)===0};H.equals=function(e){return gt(e)||(e=Ht(e)),this.unsigned!==e.unsigned&&this.high>>>31===1&&e.high>>>31===1?!1:this.high===e.high&&this.low===e.low};H.eq=H.equals;H.notEquals=function(e){return!this.eq(e)};H.neq=H.notEquals;H.ne=H.notEquals;H.lessThan=function(e){return this.comp(e)<0};H.lt=H.lessThan;H.lessThanOrEqual=function(e){return this.comp(e)<=0};H.lte=H.lessThanOrEqual;H.le=H.lessThanOrEqual;H.greaterThan=function(e){return this.comp(e)>0};H.gt=H.greaterThan;H.greaterThanOrEqual=function(e){return this.comp(e)>=0};H.gte=H.greaterThanOrEqual;H.ge=H.greaterThanOrEqual;H.compare=function(e){if(gt(e)||(e=Ht(e)),this.eq(e))return 0;var n=this.isNegative(),t=e.isNegative();return n&&!t?-1:!n&&t?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1};H.comp=H.compare;H.negate=function(){return!this.unsigned&&this.eq(wt)?wt:this.not().add(Zr)};H.neg=H.negate;H.add=function(e){gt(e)||(e=Ht(e));var n=this.high>>>16,t=this.high&65535,o=this.low>>>16,i=this.low&65535,a=e.high>>>16,s=e.high&65535,u=e.low>>>16,l=e.low&65535,d=0,p=0,h=0,g=0;return g+=i+l,h+=g>>>16,g&=65535,h+=o+u,p+=h>>>16,h&=65535,p+=t+s,d+=p>>>16,p&=65535,d+=n+a,d&=65535,Le(h<<16|g,d<<16|p,this.unsigned)};H.subtract=function(e){return gt(e)||(e=Ht(e)),this.add(e.neg())};H.sub=H.subtract;H.multiply=function(e){if(this.isZero())return this;if(gt(e)||(e=Ht(e)),kt){var n=kt.mul(this.low,this.high,e.low,e.high);return Le(n,kt.get_high(),this.unsigned)}if(e.isZero())return this.unsigned?Jn:Wt;if(this.eq(wt))return e.isOdd()?wt:Wt;if(e.eq(wt))return this.isOdd()?wt:Wt;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Af)&&e.lt(Af))return Nt(this.toNumber()*e.toNumber(),this.unsigned);var t=this.high>>>16,o=this.high&65535,i=this.low>>>16,a=this.low&65535,s=e.high>>>16,u=e.high&65535,l=e.low>>>16,d=e.low&65535,p=0,h=0,g=0,b=0;return b+=a*d,g+=b>>>16,b&=65535,g+=i*d,h+=g>>>16,g&=65535,g+=a*l,h+=g>>>16,g&=65535,h+=o*d,p+=h>>>16,h&=65535,h+=i*l,p+=h>>>16,h&=65535,h+=a*u,p+=h>>>16,h&=65535,p+=t*d+o*l+i*u+a*s,p&=65535,Le(g<<16|b,p<<16|h,this.unsigned)};H.mul=H.multiply;H.divide=function(e){if(gt(e)||(e=Ht(e)),e.isZero())throw Error("division by zero");if(kt){if(!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1)return this;var n=(this.unsigned?kt.div_u:kt.div_s)(this.low,this.high,e.low,e.high);return Le(n,kt.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?Jn:Wt;var t,o,i;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Jn;if(e.gt(this.shru(1)))return Pf;i=Jn}else{if(this.eq(wt)){if(e.eq(Zr)||e.eq(Bs))return wt;if(e.eq(wt))return Zr;var a=this.shr(1);return t=a.div(e).shl(1),t.eq(Wt)?e.isNegative()?Zr:Bs:(o=this.sub(e.mul(t)),i=t.add(o.div(e)),i)}else if(e.eq(wt))return this.unsigned?Jn:Wt;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();i=Wt}for(o=this;o.gte(e);){t=Math.max(1,Math.floor(o.toNumber()/e.toNumber()));for(var s=Math.ceil(Math.log(t)/Math.LN2),u=s<=48?1:yi(2,s-48),l=Nt(t),d=l.mul(e);d.isNegative()||d.gt(o);)t-=u,l=Nt(t,this.unsigned),d=l.mul(e);l.isZero()&&(l=Zr),i=i.add(l),o=o.sub(d)}return i};H.div=H.divide;H.modulo=function(e){if(gt(e)||(e=Ht(e)),kt){var n=(this.unsigned?kt.rem_u:kt.rem_s)(this.low,this.high,e.low,e.high);return Le(n,kt.get_high(),this.unsigned)}return this.sub(this.div(e).mul(e))};H.mod=H.modulo;H.rem=H.modulo;H.not=function(){return Le(~this.low,~this.high,this.unsigned)};H.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32};H.clz=H.countLeadingZeros;H.countTrailingZeros=function(){return this.low?xf(this.low):xf(this.high)+32};H.ctz=H.countTrailingZeros;H.and=function(e){return gt(e)||(e=Ht(e)),Le(this.low&e.low,this.high&e.high,this.unsigned)};H.or=function(e){return gt(e)||(e=Ht(e)),Le(this.low|e.low,this.high|e.high,this.unsigned)};H.xor=function(e){return gt(e)||(e=Ht(e)),Le(this.low^e.low,this.high^e.high,this.unsigned)};H.shiftLeft=function(e){return gt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Le(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):Le(0,this.low<<e-32,this.unsigned)};H.shl=H.shiftLeft;H.shiftRight=function(e){return gt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Le(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):Le(this.high>>e-32,this.high>=0?0:-1,this.unsigned)};H.shr=H.shiftRight;H.shiftRightUnsigned=function(e){return gt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Le(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):e===32?Le(this.high,0,this.unsigned):Le(this.high>>>e-32,0,this.unsigned)};H.shru=H.shiftRightUnsigned;H.shr_u=H.shiftRightUnsigned;H.rotateLeft=function(e){var n;return gt(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?Le(this.high,this.low,this.unsigned):e<32?(n=32-e,Le(this.low<<e|this.high>>>n,this.high<<e|this.low>>>n,this.unsigned)):(e-=32,n=32-e,Le(this.high<<e|this.low>>>n,this.low<<e|this.high>>>n,this.unsigned))};H.rotl=H.rotateLeft;H.rotateRight=function(e){var n;return gt(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?Le(this.high,this.low,this.unsigned):e<32?(n=32-e,Le(this.high<<n|this.low>>>e,this.low<<n|this.high>>>e,this.unsigned)):(e-=32,n=32-e,Le(this.low<<n|this.high>>>e,this.high<<n|this.low>>>e,this.unsigned))};H.rotr=H.rotateRight;H.toSigned=function(){return this.unsigned?Le(this.low,this.high,!1):this};H.toUnsigned=function(){return this.unsigned?this:Le(this.low,this.high,!0)};H.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()};H.toBytesLE=function(){var e=this.high,n=this.low;return[n&255,n>>>8&255,n>>>16&255,n>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]};H.toBytesBE=function(){var e=this.high,n=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,n>>>24,n>>>16&255,n>>>8&255,n&255]};je.fromBytes=function(e,n,t){return t?je.fromBytesLE(e,n):je.fromBytesBE(e,n)};je.fromBytesLE=function(e,n){return new je(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,n)};je.fromBytesBE=function(e,n){return new je(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],n)};cr=je});var Gs=re(_i=>{"use strict";Object.defineProperty(_i,"__esModule",{value:!0});_i.ArgType=void 0;var Df;(function(r){r[r.INPUT=0]="INPUT",r[r.OUTPUT=1]="OUTPUT"})(Df||(_i.ArgType=Df={}))});var Pr=re(rn=>{"use strict";Object.defineProperty(rn,"__esModule",{value:!0});rn.SIZE_PREFIX_LENGTH=rn.FILE_IDENTIFIER_LENGTH=rn.SIZEOF_INT=rn.SIZEOF_SHORT=void 0;rn.SIZEOF_SHORT=2;rn.SIZEOF_INT=4;rn.FILE_IDENTIFIER_LENGTH=4;rn.SIZE_PREFIX_LENGTH=4});var Us=re(Lt=>{"use strict";Object.defineProperty(Lt,"__esModule",{value:!0});Lt.isLittleEndian=Lt.float64=Lt.float32=Lt.int32=void 0;Lt.int32=new Int32Array(2);Lt.float32=new Float32Array(Lt.int32.buffer);Lt.float64=new Float64Array(Lt.int32.buffer);Lt.isLittleEndian=new Uint16Array(new Uint8Array([1,0]).buffer)[0]===1});var Ws=re(wi=>{"use strict";Object.defineProperty(wi,"__esModule",{value:!0});wi.Encoding=void 0;var kf;(function(r){r[r.UTF8_BYTES=1]="UTF8_BYTES",r[r.UTF16_STRING=2]="UTF16_STRING"})(kf||(wi.Encoding=kf={}))});var qs=re(vi=>{"use strict";Object.defineProperty(vi,"__esModule",{value:!0});vi.ByteBuffer=void 0;var on=Pr(),vt=Us(),fI=Ws(),Hs=class r{constructor(e){this.bytes_=e,this.position_=0,this.text_decoder_=new TextDecoder}static allocate(e){return new r(new Uint8Array(e))}clear(){this.position_=0}bytes(){return this.bytes_}position(){return this.position_}setPosition(e){this.position_=e}capacity(){return this.bytes_.length}readInt8(e){return this.readUint8(e)<<24>>24}readUint8(e){return this.bytes_[e]}readInt16(e){return this.readUint16(e)<<16>>16}readUint16(e){return this.bytes_[e]|this.bytes_[e+1]<<8}readInt32(e){return this.bytes_[e]|this.bytes_[e+1]<<8|this.bytes_[e+2]<<16|this.bytes_[e+3]<<24}readUint32(e){return this.readInt32(e)>>>0}readInt64(e){return BigInt.asIntN(64,BigInt(this.readUint32(e))+(BigInt(this.readUint32(e+4))<<BigInt(32)))}readUint64(e){return BigInt.asUintN(64,BigInt(this.readUint32(e))+(BigInt(this.readUint32(e+4))<<BigInt(32)))}readFloat32(e){return vt.int32[0]=this.readInt32(e),vt.float32[0]}readFloat64(e){return vt.int32[vt.isLittleEndian?0:1]=this.readInt32(e),vt.int32[vt.isLittleEndian?1:0]=this.readInt32(e+4),vt.float64[0]}writeInt8(e,n){this.bytes_[e]=n}writeUint8(e,n){this.bytes_[e]=n}writeInt16(e,n){this.bytes_[e]=n,this.bytes_[e+1]=n>>8}writeUint16(e,n){this.bytes_[e]=n,this.bytes_[e+1]=n>>8}writeInt32(e,n){this.bytes_[e]=n,this.bytes_[e+1]=n>>8,this.bytes_[e+2]=n>>16,this.bytes_[e+3]=n>>24}writeUint32(e,n){this.bytes_[e]=n,this.bytes_[e+1]=n>>8,this.bytes_[e+2]=n>>16,this.bytes_[e+3]=n>>24}writeInt64(e,n){this.writeInt32(e,Number(BigInt.asIntN(32,n))),this.writeInt32(e+4,Number(BigInt.asIntN(32,n>>BigInt(32))))}writeUint64(e,n){this.writeUint32(e,Number(BigInt.asUintN(32,n))),this.writeUint32(e+4,Number(BigInt.asUintN(32,n>>BigInt(32))))}writeFloat32(e,n){vt.float32[0]=n,this.writeInt32(e,vt.int32[0])}writeFloat64(e,n){vt.float64[0]=n,this.writeInt32(e,vt.int32[vt.isLittleEndian?0:1]),this.writeInt32(e+4,vt.int32[vt.isLittleEndian?1:0])}getBufferIdentifier(){if(this.bytes_.length<this.position_+on.SIZEOF_INT+on.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");let e="";for(let n=0;n<on.FILE_IDENTIFIER_LENGTH;n++)e+=String.fromCharCode(this.readInt8(this.position_+on.SIZEOF_INT+n));return e}__offset(e,n){let t=e-this.readInt32(e);return n<this.readInt16(t)?this.readInt16(t+n):0}__union(e,n){return e.bb_pos=n+this.readInt32(n),e.bb=this,e}__string(e,n){e+=this.readInt32(e);let t=this.readInt32(e);e+=on.SIZEOF_INT;let o=this.bytes_.subarray(e,e+t);return n===fI.Encoding.UTF8_BYTES?o:this.text_decoder_.decode(o)}__union_with_string(e,n){return typeof e=="string"?this.__string(n):this.__union(e,n)}__indirect(e){return e+this.readInt32(e)}__vector(e){return e+this.readInt32(e)+on.SIZEOF_INT}__vector_len(e){return this.readInt32(e+this.readInt32(e))}__has_identifier(e){if(e.length!=on.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+on.FILE_IDENTIFIER_LENGTH);for(let n=0;n<on.FILE_IDENTIFIER_LENGTH;n++)if(e.charCodeAt(n)!=this.readInt8(this.position()+on.SIZEOF_INT+n))return!1;return!0}createScalarList(e,n){let t=[];for(let o=0;o<n;++o){let i=e(o);i!==null&&t.push(i)}return t}createObjList(e,n){let t=[];for(let o=0;o<n;++o){let i=e(o);i!==null&&t.push(i.unpack())}return t}};vi.ByteBuffer=Hs});var Lf=re(xi=>{"use strict";Object.defineProperty(xi,"__esModule",{value:!0});xi.Builder=void 0;var Nf=qs(),Ot=Pr(),js=class r{constructor(e){this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null,this.text_encoder=new TextEncoder;let n;e?n=e:n=1024,this.bb=Nf.ByteBuffer.allocate(n),this.space=n}clear(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null}forceDefaults(e){this.force_defaults=e}dataBuffer(){return this.bb}asUint8Array(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())}prep(e,n){e>this.minalign&&(this.minalign=e);let t=~(this.bb.capacity()-this.space+n)+1&e-1;for(;this.space<t+e+n;){let o=this.bb.capacity();this.bb=r.growByteBuffer(this.bb),this.space+=this.bb.capacity()-o}this.pad(t)}pad(e){for(let n=0;n<e;n++)this.bb.writeInt8(--this.space,0)}writeInt8(e){this.bb.writeInt8(this.space-=1,e)}writeInt16(e){this.bb.writeInt16(this.space-=2,e)}writeInt32(e){this.bb.writeInt32(this.space-=4,e)}writeInt64(e){this.bb.writeInt64(this.space-=8,e)}writeFloat32(e){this.bb.writeFloat32(this.space-=4,e)}writeFloat64(e){this.bb.writeFloat64(this.space-=8,e)}addInt8(e){this.prep(1,0),this.writeInt8(e)}addInt16(e){this.prep(2,0),this.writeInt16(e)}addInt32(e){this.prep(4,0),this.writeInt32(e)}addInt64(e){this.prep(8,0),this.writeInt64(e)}addFloat32(e){this.prep(4,0),this.writeFloat32(e)}addFloat64(e){this.prep(8,0),this.writeFloat64(e)}addFieldInt8(e,n,t){(this.force_defaults||n!=t)&&(this.addInt8(n),this.slot(e))}addFieldInt16(e,n,t){(this.force_defaults||n!=t)&&(this.addInt16(n),this.slot(e))}addFieldInt32(e,n,t){(this.force_defaults||n!=t)&&(this.addInt32(n),this.slot(e))}addFieldInt64(e,n,t){(this.force_defaults||n!==t)&&(this.addInt64(n),this.slot(e))}addFieldFloat32(e,n,t){(this.force_defaults||n!=t)&&(this.addFloat32(n),this.slot(e))}addFieldFloat64(e,n,t){(this.force_defaults||n!=t)&&(this.addFloat64(n),this.slot(e))}addFieldOffset(e,n,t){(this.force_defaults||n!=t)&&(this.addOffset(n),this.slot(e))}addFieldStruct(e,n,t){n!=t&&(this.nested(n),this.slot(e))}nested(e){if(e!=this.offset())throw new TypeError("FlatBuffers: struct must be serialized inline.")}notNested(){if(this.isNested)throw new TypeError("FlatBuffers: object serialization must not be nested.")}slot(e){this.vtable!==null&&(this.vtable[e]=this.offset())}offset(){return this.bb.capacity()-this.space}static growByteBuffer(e){let n=e.capacity();if(n&3221225472)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");let t=n<<1,o=Nf.ByteBuffer.allocate(t);return o.setPosition(t-n),o.bytes().set(e.bytes(),t-n),o}addOffset(e){this.prep(Ot.SIZEOF_INT,0),this.writeInt32(this.offset()-e+Ot.SIZEOF_INT)}startObject(e){this.notNested(),this.vtable==null&&(this.vtable=[]),this.vtable_in_use=e;for(let n=0;n<e;n++)this.vtable[n]=0;this.isNested=!0,this.object_start=this.offset()}endObject(){if(this.vtable==null||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);let e=this.offset(),n=this.vtable_in_use-1;for(;n>=0&&this.vtable[n]==0;n--);let t=n+1;for(;n>=0;n--)this.addInt16(this.vtable[n]!=0?e-this.vtable[n]:0);let o=2;this.addInt16(e-this.object_start);let i=(t+o)*Ot.SIZEOF_SHORT;this.addInt16(i);let a=0,s=this.space;e:for(n=0;n<this.vtables.length;n++){let u=this.bb.capacity()-this.vtables[n];if(i==this.bb.readInt16(u)){for(let l=Ot.SIZEOF_SHORT;l<i;l+=Ot.SIZEOF_SHORT)if(this.bb.readInt16(s+l)!=this.bb.readInt16(u+l))continue e;a=this.vtables[n];break}}return a?(this.space=this.bb.capacity()-e,this.bb.writeInt32(this.space,a-e)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-e,this.offset()-e)),this.isNested=!1,e}finish(e,n,t){let o=t?Ot.SIZE_PREFIX_LENGTH:0;if(n){let i=n;if(this.prep(this.minalign,Ot.SIZEOF_INT+Ot.FILE_IDENTIFIER_LENGTH+o),i.length!=Ot.FILE_IDENTIFIER_LENGTH)throw new TypeError("FlatBuffers: file identifier must be length "+Ot.FILE_IDENTIFIER_LENGTH);for(let a=Ot.FILE_IDENTIFIER_LENGTH-1;a>=0;a--)this.writeInt8(i.charCodeAt(a))}this.prep(this.minalign,Ot.SIZEOF_INT+o),this.addOffset(e),o&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)}finishSizePrefixed(e,n){this.finish(e,n,!0)}requiredField(e,n){let t=this.bb.capacity()-e,o=t-this.bb.readInt32(t);if(!(n<this.bb.readInt16(o)&&this.bb.readInt16(o+n)!=0))throw new TypeError("FlatBuffers: field "+n+" must be set")}startVector(e,n,t){this.notNested(),this.vector_num_elems=n,this.prep(Ot.SIZEOF_INT,e*n),this.prep(t,e*n)}endVector(){return this.writeInt32(this.vector_num_elems),this.offset()}createSharedString(e){if(!e)return 0;if(this.string_maps||(this.string_maps=new Map),this.string_maps.has(e))return this.string_maps.get(e);let n=this.createString(e);return this.string_maps.set(e,n),n}createString(e){if(e==null)return 0;let n;return e instanceof Uint8Array?n=e:n=this.text_encoder.encode(e),this.addInt8(0),this.startVector(1,n.length,1),this.bb.setPosition(this.space-=n.length),this.bb.bytes().set(n,this.space),this.endVector()}createByteVector(e){return e==null?0:(this.startVector(1,e.length,1),this.bb.setPosition(this.space-=e.length),this.bb.bytes().set(e,this.space),this.endVector())}createObjectOffset(e){return e===null?0:typeof e=="string"?this.createString(e):e.pack(this)}createObjectOffsetList(e){let n=[];for(let t=0;t<e.length;++t){let o=e[t];if(o!==null)n.push(this.createObjectOffset(o));else throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.")}return n}createStructOffsetList(e,n){return n(this,e.length),this.createObjectOffsetList(e.slice().reverse()),this.endVector()}};xi.Builder=js});var Re=re(Ze=>{"use strict";Object.defineProperty(Ze,"__esModule",{value:!0});Ze.ByteBuffer=Ze.Builder=Ze.Encoding=Ze.isLittleEndian=Ze.float64=Ze.float32=Ze.int32=Ze.SIZE_PREFIX_LENGTH=Ze.FILE_IDENTIFIER_LENGTH=Ze.SIZEOF_INT=Ze.SIZEOF_SHORT=void 0;var hI=Pr();Object.defineProperty(Ze,"SIZEOF_SHORT",{enumerable:!0,get:function(){return hI.SIZEOF_SHORT}});var mI=Pr();Object.defineProperty(Ze,"SIZEOF_INT",{enumerable:!0,get:function(){return mI.SIZEOF_INT}});var gI=Pr();Object.defineProperty(Ze,"FILE_IDENTIFIER_LENGTH",{enumerable:!0,get:function(){return gI.FILE_IDENTIFIER_LENGTH}});var bI=Pr();Object.defineProperty(Ze,"SIZE_PREFIX_LENGTH",{enumerable:!0,get:function(){return bI.SIZE_PREFIX_LENGTH}});var Ti=Us();Object.defineProperty(Ze,"int32",{enumerable:!0,get:function(){return Ti.int32}});Object.defineProperty(Ze,"float32",{enumerable:!0,get:function(){return Ti.float32}});Object.defineProperty(Ze,"float64",{enumerable:!0,get:function(){return Ti.float64}});Object.defineProperty(Ze,"isLittleEndian",{enumerable:!0,get:function(){return Ti.isLittleEndian}});var yI=Ws();Object.defineProperty(Ze,"Encoding",{enumerable:!0,get:function(){return yI.Encoding}});var _I=Lf();Object.defineProperty(Ze,"Builder",{enumerable:!0,get:function(){return _I.Builder}});var wI=qs();Object.defineProperty(Ze,"ByteBuffer",{enumerable:!0,get:function(){return wI.ByteBuffer}})});var Xs=re(an=>{"use strict";var vI=an&&an.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),xI=an&&an.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),TI=an&&an.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&vI(e,r,n);return xI(e,r),e};Object.defineProperty(an,"__esModule",{value:!0});an.ArgTypeAndIndex=void 0;var II=TI(Re()),Rf=Gs(),Ks=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsArgTypeAndIndex(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsArgTypeAndIndex(e,n){return e.setPosition(e.position()+II.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}argType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt8(this.bb_pos+e):Rf.ArgType.INPUT}index(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint32(this.bb_pos+e):0}static startArgTypeAndIndex(e){e.startObject(2)}static addArgType(e,n){e.addFieldInt8(0,n,Rf.ArgType.INPUT)}static addIndex(e,n){e.addFieldInt32(1,n,0)}static endArgTypeAndIndex(e){return e.endObject()}static createArgTypeAndIndex(e,n,t){return r.startArgTypeAndIndex(e),r.addArgType(e,n),r.addIndex(e,t),r.endArgTypeAndIndex(e)}};an.ArgTypeAndIndex=Ks});var Zs=re(Ii=>{"use strict";Object.defineProperty(Ii,"__esModule",{value:!0});Ii.AttributeType=void 0;var zf;(function(r){r[r.UNDEFINED=0]="UNDEFINED",r[r.FLOAT=1]="FLOAT",r[r.INT=2]="INT",r[r.STRING=3]="STRING",r[r.TENSOR=4]="TENSOR",r[r.GRAPH=5]="GRAPH",r[r.FLOATS=6]="FLOATS",r[r.INTS=7]="INTS",r[r.STRINGS=8]="STRINGS",r[r.TENSORS=9]="TENSORS",r[r.GRAPHS=10]="GRAPHS",r[r.SPARSE_TENSOR=11]="SPARSE_TENSOR",r[r.SPARSE_TENSORS=12]="SPARSE_TENSORS"})(zf||(Ii.AttributeType=zf={}))});var Js=re(Si=>{"use strict";Object.defineProperty(Si,"__esModule",{value:!0});Si.NodeType=void 0;var Mf;(function(r){r[r.Primitive=0]="Primitive",r[r.Fused=1]="Fused"})(Mf||(Si.NodeType=Mf={}))});var Ys=re(sn=>{"use strict";var SI=sn&&sn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),$I=sn&&sn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),AI=sn&&sn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&SI(e,r,n);return $I(e,r),e};Object.defineProperty(sn,"__esModule",{value:!0});sn.Node=void 0;var OI=AI(Re()),PI=eu(),Bf=Js(),Qs=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsNode(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsNode(e,n){return e.setPosition(e.position()+OI.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}name(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}docString(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.__string(this.bb_pos+n,e):null}domain(e){let n=this.bb.__offset(this.bb_pos,8);return n?this.bb.__string(this.bb_pos+n,e):null}sinceVersion(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt32(this.bb_pos+e):0}index(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.readUint32(this.bb_pos+e):0}opType(e){let n=this.bb.__offset(this.bb_pos,14);return n?this.bb.__string(this.bb_pos+n,e):null}type(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.readInt32(this.bb_pos+e):Bf.NodeType.Primitive}executionProviderType(e){let n=this.bb.__offset(this.bb_pos,18);return n?this.bb.__string(this.bb_pos+n,e):null}inputs(e,n){let t=this.bb.__offset(this.bb_pos,20);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}inputsLength(){let e=this.bb.__offset(this.bb_pos,20);return e?this.bb.__vector_len(this.bb_pos+e):0}outputs(e,n){let t=this.bb.__offset(this.bb_pos,22);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}outputsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}attributes(e,n){let t=this.bb.__offset(this.bb_pos,24);return t?(n||new PI.Attribute).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}attributesLength(){let e=this.bb.__offset(this.bb_pos,24);return e?this.bb.__vector_len(this.bb_pos+e):0}inputArgCounts(e){let n=this.bb.__offset(this.bb_pos,26);return n?this.bb.readInt32(this.bb.__vector(this.bb_pos+n)+e*4):0}inputArgCountsLength(){let e=this.bb.__offset(this.bb_pos,26);return e?this.bb.__vector_len(this.bb_pos+e):0}inputArgCountsArray(){let e=this.bb.__offset(this.bb_pos,26);return e?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}implicitInputs(e,n){let t=this.bb.__offset(this.bb_pos,28);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}implicitInputsLength(){let e=this.bb.__offset(this.bb_pos,28);return e?this.bb.__vector_len(this.bb_pos+e):0}static startNode(e){e.startObject(13)}static addName(e,n){e.addFieldOffset(0,n,0)}static addDocString(e,n){e.addFieldOffset(1,n,0)}static addDomain(e,n){e.addFieldOffset(2,n,0)}static addSinceVersion(e,n){e.addFieldInt32(3,n,0)}static addIndex(e,n){e.addFieldInt32(4,n,0)}static addOpType(e,n){e.addFieldOffset(5,n,0)}static addType(e,n){e.addFieldInt32(6,n,Bf.NodeType.Primitive)}static addExecutionProviderType(e,n){e.addFieldOffset(7,n,0)}static addInputs(e,n){e.addFieldOffset(8,n,0)}static createInputsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startInputsVector(e,n){e.startVector(4,n,4)}static addOutputs(e,n){e.addFieldOffset(9,n,0)}static createOutputsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startOutputsVector(e,n){e.startVector(4,n,4)}static addAttributes(e,n){e.addFieldOffset(10,n,0)}static createAttributesVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startAttributesVector(e,n){e.startVector(4,n,4)}static addInputArgCounts(e,n){e.addFieldOffset(11,n,0)}static createInputArgCountsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addInt32(n[t]);return e.endVector()}static startInputArgCountsVector(e,n){e.startVector(4,n,4)}static addImplicitInputs(e,n){e.addFieldOffset(12,n,0)}static createImplicitInputsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startImplicitInputsVector(e,n){e.startVector(4,n,4)}static endNode(e){return e.endObject()}static createNode(e,n,t,o,i,a,s,u,l,d,p,h,g,b){return r.startNode(e),r.addName(e,n),r.addDocString(e,t),r.addDomain(e,o),r.addSinceVersion(e,i),r.addIndex(e,a),r.addOpType(e,s),r.addType(e,u),r.addExecutionProviderType(e,l),r.addInputs(e,d),r.addOutputs(e,p),r.addAttributes(e,h),r.addInputArgCounts(e,g),r.addImplicitInputs(e,b),r.endNode(e)}};sn.Node=Qs});var nu=re($i=>{"use strict";Object.defineProperty($i,"__esModule",{value:!0});$i.EdgeEnd=void 0;var tu=class{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}nodeIndex(){return this.bb.readUint32(this.bb_pos)}srcArgIndex(){return this.bb.readInt32(this.bb_pos+4)}dstArgIndex(){return this.bb.readInt32(this.bb_pos+8)}static sizeOf(){return 12}static createEdgeEnd(e,n,t,o){return e.prep(4,12),e.writeInt32(o),e.writeInt32(t),e.writeInt32(n),e.offset()}};$i.EdgeEnd=tu});var ou=re(un=>{"use strict";var EI=un&&un.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),CI=un&&un.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),DI=un&&un.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&EI(e,r,n);return CI(e,r),e};Object.defineProperty(un,"__esModule",{value:!0});un.NodeEdge=void 0;var kI=DI(Re()),Ff=nu(),ru=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsNodeEdge(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsNodeEdge(e,n){return e.setPosition(e.position()+kI.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}nodeIndex(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readUint32(this.bb_pos+e):0}inputEdges(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new Ff.EdgeEnd).__init(this.bb.__vector(this.bb_pos+t)+e*12,this.bb):null}inputEdgesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}outputEdges(e,n){let t=this.bb.__offset(this.bb_pos,8);return t?(n||new Ff.EdgeEnd).__init(this.bb.__vector(this.bb_pos+t)+e*12,this.bb):null}outputEdgesLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}static startNodeEdge(e){e.startObject(3)}static addNodeIndex(e,n){e.addFieldInt32(0,n,0)}static addInputEdges(e,n){e.addFieldOffset(1,n,0)}static startInputEdgesVector(e,n){e.startVector(12,n,4)}static addOutputEdges(e,n){e.addFieldOffset(2,n,0)}static startOutputEdgesVector(e,n){e.startVector(12,n,4)}static endNodeEdge(e){return e.endObject()}static createNodeEdge(e,n,t,o){return r.startNodeEdge(e),r.addNodeIndex(e,n),r.addInputEdges(e,t),r.addOutputEdges(e,o),r.endNodeEdge(e)}};un.NodeEdge=ru});var au=re(ln=>{"use strict";var NI=ln&&ln.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),LI=ln&&ln.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),RI=ln&&ln.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&NI(e,r,n);return LI(e,r),e};Object.defineProperty(ln,"__esModule",{value:!0});ln.NodesToOptimizeIndices=void 0;var zI=RI(Re()),iu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsNodesToOptimizeIndices(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsNodesToOptimizeIndices(e,n){return e.setPosition(e.position()+zI.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}nodeIndices(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.readUint32(this.bb.__vector(this.bb_pos+n)+e*4):0}nodeIndicesLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeIndicesArray(){let e=this.bb.__offset(this.bb_pos,4);return e?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}numInputs(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint32(this.bb_pos+e):0}numOutputs(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.readUint32(this.bb_pos+e):0}hasVariadicInput(){let e=this.bb.__offset(this.bb_pos,10);return e?!!this.bb.readInt8(this.bb_pos+e):!1}hasVariadicOutput(){let e=this.bb.__offset(this.bb_pos,12);return e?!!this.bb.readInt8(this.bb_pos+e):!1}numVariadicInputs(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.readUint32(this.bb_pos+e):0}numVariadicOutputs(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.readUint32(this.bb_pos+e):0}static startNodesToOptimizeIndices(e){e.startObject(7)}static addNodeIndices(e,n){e.addFieldOffset(0,n,0)}static createNodeIndicesVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addInt32(n[t]);return e.endVector()}static startNodeIndicesVector(e,n){e.startVector(4,n,4)}static addNumInputs(e,n){e.addFieldInt32(1,n,0)}static addNumOutputs(e,n){e.addFieldInt32(2,n,0)}static addHasVariadicInput(e,n){e.addFieldInt8(3,+n,0)}static addHasVariadicOutput(e,n){e.addFieldInt8(4,+n,0)}static addNumVariadicInputs(e,n){e.addFieldInt32(5,n,0)}static addNumVariadicOutputs(e,n){e.addFieldInt32(6,n,0)}static endNodesToOptimizeIndices(e){return e.endObject()}static createNodesToOptimizeIndices(e,n,t,o,i,a,s,u){return r.startNodesToOptimizeIndices(e),r.addNodeIndices(e,n),r.addNumInputs(e,t),r.addNumOutputs(e,o),r.addHasVariadicInput(e,i),r.addHasVariadicOutput(e,a),r.addNumVariadicInputs(e,s),r.addNumVariadicOutputs(e,u),r.endNodesToOptimizeIndices(e)}};ln.NodesToOptimizeIndices=iu});var uu=re(cn=>{"use strict";var MI=cn&&cn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),BI=cn&&cn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),FI=cn&&cn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&MI(e,r,n);return BI(e,r),e};Object.defineProperty(cn,"__esModule",{value:!0});cn.RuntimeOptimizationRecord=void 0;var VI=FI(Re()),GI=au(),su=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsRuntimeOptimizationRecord(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsRuntimeOptimizationRecord(e,n){return e.setPosition(e.position()+VI.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}actionId(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}nodesToOptimizeIndices(e){let n=this.bb.__offset(this.bb_pos,6);return n?(e||new GI.NodesToOptimizeIndices).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}producedOpIds(e,n){let t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}producedOpIdsLength(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.__vector_len(this.bb_pos+e):0}static startRuntimeOptimizationRecord(e){e.startObject(4)}static addActionId(e,n){e.addFieldOffset(0,n,0)}static addNodesToOptimizeIndices(e,n){e.addFieldOffset(1,n,0)}static addProducedOpIds(e,n){e.addFieldOffset(3,n,0)}static createProducedOpIdsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startProducedOpIdsVector(e,n){e.startVector(4,n,4)}static endRuntimeOptimizationRecord(e){return e.endObject()}};cn.RuntimeOptimizationRecord=su});var cu=re(dn=>{"use strict";var UI=dn&&dn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),WI=dn&&dn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),HI=dn&&dn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&UI(e,r,n);return WI(e,r),e};Object.defineProperty(dn,"__esModule",{value:!0});dn.RuntimeOptimizationRecordContainerEntry=void 0;var qI=HI(Re()),jI=uu(),lu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsRuntimeOptimizationRecordContainerEntry(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsRuntimeOptimizationRecordContainerEntry(e,n){return e.setPosition(e.position()+qI.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}optimizerName(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}runtimeOptimizationRecords(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new jI.RuntimeOptimizationRecord).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}runtimeOptimizationRecordsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startRuntimeOptimizationRecordContainerEntry(e){e.startObject(2)}static addOptimizerName(e,n){e.addFieldOffset(0,n,0)}static addRuntimeOptimizationRecords(e,n){e.addFieldOffset(1,n,0)}static createRuntimeOptimizationRecordsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startRuntimeOptimizationRecordsVector(e,n){e.startVector(4,n,4)}static endRuntimeOptimizationRecordContainerEntry(e){let n=e.endObject();return e.requiredField(n,4),n}static createRuntimeOptimizationRecordContainerEntry(e,n,t){return r.startRuntimeOptimizationRecordContainerEntry(e),r.addOptimizerName(e,n),r.addRuntimeOptimizationRecords(e,t),r.endRuntimeOptimizationRecordContainerEntry(e)}};dn.RuntimeOptimizationRecordContainerEntry=lu});var pu=re(pn=>{"use strict";var KI=pn&&pn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),XI=pn&&pn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),ZI=pn&&pn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&KI(e,r,n);return XI(e,r),e};Object.defineProperty(pn,"__esModule",{value:!0});pn.RuntimeOptimizations=void 0;var JI=ZI(Re()),QI=cu(),du=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsRuntimeOptimizations(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsRuntimeOptimizations(e,n){return e.setPosition(e.position()+JI.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}records(e,n){let t=this.bb.__offset(this.bb_pos,4);return t?(n||new QI.RuntimeOptimizationRecordContainerEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}recordsLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startRuntimeOptimizations(e){e.startObject(1)}static addRecords(e,n){e.addFieldOffset(0,n,0)}static createRecordsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startRecordsVector(e,n){e.startVector(4,n,4)}static endRuntimeOptimizations(e){return e.endObject()}static createRuntimeOptimizations(e,n){return r.startRuntimeOptimizations(e),r.addRecords(e,n),r.endRuntimeOptimizations(e)}};pn.RuntimeOptimizations=du});var vo=re(Ai=>{"use strict";Object.defineProperty(Ai,"__esModule",{value:!0});Ai.TensorDataType=void 0;var Vf;(function(r){r[r.UNDEFINED=0]="UNDEFINED",r[r.FLOAT=1]="FLOAT",r[r.UINT8=2]="UINT8",r[r.INT8=3]="INT8",r[r.UINT16=4]="UINT16",r[r.INT16=5]="INT16",r[r.INT32=6]="INT32",r[r.INT64=7]="INT64",r[r.STRING=8]="STRING",r[r.BOOL=9]="BOOL",r[r.FLOAT16=10]="FLOAT16",r[r.DOUBLE=11]="DOUBLE",r[r.UINT32=12]="UINT32",r[r.UINT64=13]="UINT64",r[r.COMPLEX64=14]="COMPLEX64",r[r.COMPLEX128=15]="COMPLEX128",r[r.BFLOAT16=16]="BFLOAT16",r[r.FLOAT8E4M3FN=17]="FLOAT8E4M3FN",r[r.FLOAT8E4M3FNUZ=18]="FLOAT8E4M3FNUZ",r[r.FLOAT8E5M2=19]="FLOAT8E5M2",r[r.FLOAT8E5M2FNUZ=20]="FLOAT8E5M2FNUZ"})(Vf||(Ai.TensorDataType=Vf={}))});var xo=re(fn=>{"use strict";var YI=fn&&fn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),e1=fn&&fn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),t1=fn&&fn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&YI(e,r,n);return e1(e,r),e};Object.defineProperty(fn,"__esModule",{value:!0});fn.Tensor=void 0;var n1=t1(Re()),Gf=vo(),fu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsTensor(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsTensor(e,n){return e.setPosition(e.position()+n1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}name(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}docString(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.__string(this.bb_pos+n,e):null}dims(e){let n=this.bb.__offset(this.bb_pos,8);return n?this.bb.readInt64(this.bb.__vector(this.bb_pos+n)+e*8):BigInt(0)}dimsLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}dataType(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt32(this.bb_pos+e):Gf.TensorDataType.UNDEFINED}rawData(e){let n=this.bb.__offset(this.bb_pos,12);return n?this.bb.readUint8(this.bb.__vector(this.bb_pos+n)+e):0}rawDataLength(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.__vector_len(this.bb_pos+e):0}rawDataArray(){let e=this.bb.__offset(this.bb_pos,12);return e?new Uint8Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}stringData(e,n){let t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}stringDataLength(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.__vector_len(this.bb_pos+e):0}externalDataOffset(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.readInt64(this.bb_pos+e):BigInt("-1")}static startTensor(e){e.startObject(7)}static addName(e,n){e.addFieldOffset(0,n,0)}static addDocString(e,n){e.addFieldOffset(1,n,0)}static addDims(e,n){e.addFieldOffset(2,n,0)}static createDimsVector(e,n){e.startVector(8,n.length,8);for(let t=n.length-1;t>=0;t--)e.addInt64(n[t]);return e.endVector()}static startDimsVector(e,n){e.startVector(8,n,8)}static addDataType(e,n){e.addFieldInt32(3,n,Gf.TensorDataType.UNDEFINED)}static addRawData(e,n){e.addFieldOffset(4,n,0)}static createRawDataVector(e,n){e.startVector(1,n.length,1);for(let t=n.length-1;t>=0;t--)e.addInt8(n[t]);return e.endVector()}static startRawDataVector(e,n){e.startVector(1,n,1)}static addStringData(e,n){e.addFieldOffset(5,n,0)}static createStringDataVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startStringDataVector(e,n){e.startVector(4,n,4)}static addExternalDataOffset(e,n){e.addFieldInt64(6,n,BigInt("-1"))}static endTensor(e){return e.endObject()}static createTensor(e,n,t,o,i,a,s,u){return r.startTensor(e),r.addName(e,n),r.addDocString(e,t),r.addDims(e,o),r.addDataType(e,i),r.addRawData(e,a),r.addStringData(e,s),r.addExternalDataOffset(e,u),r.endTensor(e)}};fn.Tensor=fu});var mu=re(hn=>{"use strict";var r1=hn&&hn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),o1=hn&&hn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),i1=hn&&hn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&r1(e,r,n);return o1(e,r),e};Object.defineProperty(hn,"__esModule",{value:!0});hn.SparseTensor=void 0;var a1=i1(Re()),Uf=xo(),hu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsSparseTensor(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsSparseTensor(e,n){return e.setPosition(e.position()+a1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}values(e){let n=this.bb.__offset(this.bb_pos,4);return n?(e||new Uf.Tensor).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}indices(e){let n=this.bb.__offset(this.bb_pos,6);return n?(e||new Uf.Tensor).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}dims(e){let n=this.bb.__offset(this.bb_pos,8);return n?this.bb.readInt64(this.bb.__vector(this.bb_pos+n)+e*8):BigInt(0)}dimsLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}static startSparseTensor(e){e.startObject(3)}static addValues(e,n){e.addFieldOffset(0,n,0)}static addIndices(e,n){e.addFieldOffset(1,n,0)}static addDims(e,n){e.addFieldOffset(2,n,0)}static createDimsVector(e,n){e.startVector(8,n.length,8);for(let t=n.length-1;t>=0;t--)e.addInt64(n[t]);return e.endVector()}static startDimsVector(e,n){e.startVector(8,n,8)}static endSparseTensor(e){return e.endObject()}};hn.SparseTensor=hu});var bu=re(mn=>{"use strict";var s1=mn&&mn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),u1=mn&&mn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),l1=mn&&mn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&s1(e,r,n);return u1(e,r),e};Object.defineProperty(mn,"__esModule",{value:!0});mn.MapType=void 0;var c1=l1(Re()),Wf=vo(),d1=To(),gu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsMapType(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsMapType(e,n){return e.setPosition(e.position()+c1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}keyType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt32(this.bb_pos+e):Wf.TensorDataType.UNDEFINED}valueType(e){let n=this.bb.__offset(this.bb_pos,6);return n?(e||new d1.TypeInfo).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startMapType(e){e.startObject(2)}static addKeyType(e,n){e.addFieldInt32(0,n,Wf.TensorDataType.UNDEFINED)}static addValueType(e,n){e.addFieldOffset(1,n,0)}static endMapType(e){return e.endObject()}};mn.MapType=gu});var _u=re(gn=>{"use strict";var p1=gn&&gn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),f1=gn&&gn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),h1=gn&&gn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&p1(e,r,n);return f1(e,r),e};Object.defineProperty(gn,"__esModule",{value:!0});gn.SequenceType=void 0;var m1=h1(Re()),g1=To(),yu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsSequenceType(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsSequenceType(e,n){return e.setPosition(e.position()+m1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}elemType(e){let n=this.bb.__offset(this.bb_pos,4);return n?(e||new g1.TypeInfo).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startSequenceType(e){e.startObject(1)}static addElemType(e,n){e.addFieldOffset(0,n,0)}static endSequenceType(e){return e.endObject()}static createSequenceType(e,n){return r.startSequenceType(e),r.addElemType(e,n),r.endSequenceType(e)}};gn.SequenceType=yu});var wu=re(Oi=>{"use strict";Object.defineProperty(Oi,"__esModule",{value:!0});Oi.DimensionValueType=void 0;var Hf;(function(r){r[r.UNKNOWN=0]="UNKNOWN",r[r.VALUE=1]="VALUE",r[r.PARAM=2]="PARAM"})(Hf||(Oi.DimensionValueType=Hf={}))});var xu=re(bn=>{"use strict";var b1=bn&&bn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),y1=bn&&bn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),_1=bn&&bn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&b1(e,r,n);return y1(e,r),e};Object.defineProperty(bn,"__esModule",{value:!0});bn.DimensionValue=void 0;var w1=_1(Re()),qf=wu(),vu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsDimensionValue(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDimensionValue(e,n){return e.setPosition(e.position()+w1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}dimType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt8(this.bb_pos+e):qf.DimensionValueType.UNKNOWN}dimValue(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}dimParam(e){let n=this.bb.__offset(this.bb_pos,8);return n?this.bb.__string(this.bb_pos+n,e):null}static startDimensionValue(e){e.startObject(3)}static addDimType(e,n){e.addFieldInt8(0,n,qf.DimensionValueType.UNKNOWN)}static addDimValue(e,n){e.addFieldInt64(1,n,BigInt("0"))}static addDimParam(e,n){e.addFieldOffset(2,n,0)}static endDimensionValue(e){return e.endObject()}static createDimensionValue(e,n,t,o){return r.startDimensionValue(e),r.addDimType(e,n),r.addDimValue(e,t),r.addDimParam(e,o),r.endDimensionValue(e)}};bn.DimensionValue=vu});var Iu=re(yn=>{"use strict";var v1=yn&&yn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),x1=yn&&yn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),T1=yn&&yn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&v1(e,r,n);return x1(e,r),e};Object.defineProperty(yn,"__esModule",{value:!0});yn.Dimension=void 0;var I1=T1(Re()),S1=xu(),Tu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsDimension(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDimension(e,n){return e.setPosition(e.position()+I1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}value(e){let n=this.bb.__offset(this.bb_pos,4);return n?(e||new S1.DimensionValue).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}denotation(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.__string(this.bb_pos+n,e):null}static startDimension(e){e.startObject(2)}static addValue(e,n){e.addFieldOffset(0,n,0)}static addDenotation(e,n){e.addFieldOffset(1,n,0)}static endDimension(e){return e.endObject()}static createDimension(e,n,t){return r.startDimension(e),r.addValue(e,n),r.addDenotation(e,t),r.endDimension(e)}};yn.Dimension=Tu});var $u=re(_n=>{"use strict";var $1=_n&&_n.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),A1=_n&&_n.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),O1=_n&&_n.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&$1(e,r,n);return A1(e,r),e};Object.defineProperty(_n,"__esModule",{value:!0});_n.Shape=void 0;var P1=O1(Re()),E1=Iu(),Su=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsShape(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsShape(e,n){return e.setPosition(e.position()+P1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}dim(e,n){let t=this.bb.__offset(this.bb_pos,4);return t?(n||new E1.Dimension).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}dimLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startShape(e){e.startObject(1)}static addDim(e,n){e.addFieldOffset(0,n,0)}static createDimVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startDimVector(e,n){e.startVector(4,n,4)}static endShape(e){return e.endObject()}static createShape(e,n){return r.startShape(e),r.addDim(e,n),r.endShape(e)}};_n.Shape=Su});var Ou=re(wn=>{"use strict";var C1=wn&&wn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),D1=wn&&wn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),k1=wn&&wn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&C1(e,r,n);return D1(e,r),e};Object.defineProperty(wn,"__esModule",{value:!0});wn.TensorTypeAndShape=void 0;var N1=k1(Re()),L1=$u(),jf=vo(),Au=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsTensorTypeAndShape(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsTensorTypeAndShape(e,n){return e.setPosition(e.position()+N1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}elemType(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt32(this.bb_pos+e):jf.TensorDataType.UNDEFINED}shape(e){let n=this.bb.__offset(this.bb_pos,6);return n?(e||new L1.Shape).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startTensorTypeAndShape(e){e.startObject(2)}static addElemType(e,n){e.addFieldInt32(0,n,jf.TensorDataType.UNDEFINED)}static addShape(e,n){e.addFieldOffset(1,n,0)}static endTensorTypeAndShape(e){return e.endObject()}};wn.TensorTypeAndShape=Au});var Pu=re(dr=>{"use strict";Object.defineProperty(dr,"__esModule",{value:!0});dr.unionListToTypeInfoValue=dr.unionToTypeInfoValue=dr.TypeInfoValue=void 0;var Kf=bu(),Xf=_u(),Zf=Ou(),Pi;(function(r){r[r.NONE=0]="NONE",r[r.tensor_type=1]="tensor_type",r[r.sequence_type=2]="sequence_type",r[r.map_type=3]="map_type"})(Pi||(dr.TypeInfoValue=Pi={}));function R1(r,e){switch(Pi[r]){case"NONE":return null;case"tensor_type":return e(new Zf.TensorTypeAndShape);case"sequence_type":return e(new Xf.SequenceType);case"map_type":return e(new Kf.MapType);default:return null}}dr.unionToTypeInfoValue=R1;function z1(r,e,n){switch(Pi[r]){case"NONE":return null;case"tensor_type":return e(n,new Zf.TensorTypeAndShape);case"sequence_type":return e(n,new Xf.SequenceType);case"map_type":return e(n,new Kf.MapType);default:return null}}dr.unionListToTypeInfoValue=z1});var To=re(vn=>{"use strict";var M1=vn&&vn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),B1=vn&&vn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),F1=vn&&vn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&M1(e,r,n);return B1(e,r),e};Object.defineProperty(vn,"__esModule",{value:!0});vn.TypeInfo=void 0;var V1=F1(Re()),Jf=Pu(),Eu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsTypeInfo(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsTypeInfo(e,n){return e.setPosition(e.position()+V1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}denotation(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}valueType(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint8(this.bb_pos+e):Jf.TypeInfoValue.NONE}value(e){let n=this.bb.__offset(this.bb_pos,8);return n?this.bb.__union(e,this.bb_pos+n):null}static startTypeInfo(e){e.startObject(3)}static addDenotation(e,n){e.addFieldOffset(0,n,0)}static addValueType(e,n){e.addFieldInt8(1,n,Jf.TypeInfoValue.NONE)}static addValue(e,n){e.addFieldOffset(2,n,0)}static endTypeInfo(e){return e.endObject()}static createTypeInfo(e,n,t,o){return r.startTypeInfo(e),r.addDenotation(e,n),r.addValueType(e,t),r.addValue(e,o),r.endTypeInfo(e)}};vn.TypeInfo=Eu});var Du=re(xn=>{"use strict";var G1=xn&&xn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),U1=xn&&xn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),W1=xn&&xn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&G1(e,r,n);return U1(e,r),e};Object.defineProperty(xn,"__esModule",{value:!0});xn.ValueInfo=void 0;var H1=W1(Re()),q1=To(),Cu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsValueInfo(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsValueInfo(e,n){return e.setPosition(e.position()+H1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}name(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}docString(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.__string(this.bb_pos+n,e):null}type(e){let n=this.bb.__offset(this.bb_pos,8);return n?(e||new q1.TypeInfo).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startValueInfo(e){e.startObject(3)}static addName(e,n){e.addFieldOffset(0,n,0)}static addDocString(e,n){e.addFieldOffset(1,n,0)}static addType(e,n){e.addFieldOffset(2,n,0)}static endValueInfo(e){return e.endObject()}};xn.ValueInfo=Cu});var Ei=re(Tn=>{"use strict";var j1=Tn&&Tn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),K1=Tn&&Tn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),X1=Tn&&Tn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&j1(e,r,n);return K1(e,r),e};Object.defineProperty(Tn,"__esModule",{value:!0});Tn.Graph=void 0;var Z1=X1(Re()),J1=Ys(),Q1=ou(),Y1=pu(),eS=mu(),tS=xo(),nS=Du(),ku=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsGraph(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsGraph(e,n){return e.setPosition(e.position()+Z1.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}initializers(e,n){let t=this.bb.__offset(this.bb_pos,4);return t?(n||new tS.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}initializersLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeArgs(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new nS.ValueInfo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}nodeArgsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}nodes(e,n){let t=this.bb.__offset(this.bb_pos,8);return t?(n||new J1.Node).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}nodesLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}maxNodeIndex(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readUint32(this.bb_pos+e):0}nodeEdges(e,n){let t=this.bb.__offset(this.bb_pos,12);return t?(n||new Q1.NodeEdge).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}nodeEdgesLength(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.__vector_len(this.bb_pos+e):0}inputs(e,n){let t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}inputsLength(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.__vector_len(this.bb_pos+e):0}outputs(e,n){let t=this.bb.__offset(this.bb_pos,16);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}outputsLength(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.__vector_len(this.bb_pos+e):0}sparseInitializers(e,n){let t=this.bb.__offset(this.bb_pos,18);return t?(n||new eS.SparseTensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}sparseInitializersLength(){let e=this.bb.__offset(this.bb_pos,18);return e?this.bb.__vector_len(this.bb_pos+e):0}runtimeOptimizations(e){let n=this.bb.__offset(this.bb_pos,20);return n?(e||new Y1.RuntimeOptimizations).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startGraph(e){e.startObject(9)}static addInitializers(e,n){e.addFieldOffset(0,n,0)}static createInitializersVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startInitializersVector(e,n){e.startVector(4,n,4)}static addNodeArgs(e,n){e.addFieldOffset(1,n,0)}static createNodeArgsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startNodeArgsVector(e,n){e.startVector(4,n,4)}static addNodes(e,n){e.addFieldOffset(2,n,0)}static createNodesVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startNodesVector(e,n){e.startVector(4,n,4)}static addMaxNodeIndex(e,n){e.addFieldInt32(3,n,0)}static addNodeEdges(e,n){e.addFieldOffset(4,n,0)}static createNodeEdgesVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startNodeEdgesVector(e,n){e.startVector(4,n,4)}static addInputs(e,n){e.addFieldOffset(5,n,0)}static createInputsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startInputsVector(e,n){e.startVector(4,n,4)}static addOutputs(e,n){e.addFieldOffset(6,n,0)}static createOutputsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startOutputsVector(e,n){e.startVector(4,n,4)}static addSparseInitializers(e,n){e.addFieldOffset(7,n,0)}static createSparseInitializersVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startSparseInitializersVector(e,n){e.startVector(4,n,4)}static addRuntimeOptimizations(e,n){e.addFieldOffset(8,n,0)}static endGraph(e){return e.endObject()}};Tn.Graph=ku});var eu=re(In=>{"use strict";var rS=In&&In.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),oS=In&&In.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),iS=In&&In.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&rS(e,r,n);return oS(e,r),e};Object.defineProperty(In,"__esModule",{value:!0});In.Attribute=void 0;var aS=iS(Re()),Qf=Zs(),Yf=Ei(),eh=xo(),Nu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsAttribute(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsAttribute(e,n){return e.setPosition(e.position()+aS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}name(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}docString(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.__string(this.bb_pos+n,e):null}type(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.readInt32(this.bb_pos+e):Qf.AttributeType.UNDEFINED}f(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readFloat32(this.bb_pos+e):0}i(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}s(e){let n=this.bb.__offset(this.bb_pos,14);return n?this.bb.__string(this.bb_pos+n,e):null}t(e){let n=this.bb.__offset(this.bb_pos,16);return n?(e||new eh.Tensor).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}g(e){let n=this.bb.__offset(this.bb_pos,18);return n?(e||new Yf.Graph).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}floats(e){let n=this.bb.__offset(this.bb_pos,20);return n?this.bb.readFloat32(this.bb.__vector(this.bb_pos+n)+e*4):0}floatsLength(){let e=this.bb.__offset(this.bb_pos,20);return e?this.bb.__vector_len(this.bb_pos+e):0}floatsArray(){let e=this.bb.__offset(this.bb_pos,20);return e?new Float32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}ints(e){let n=this.bb.__offset(this.bb_pos,22);return n?this.bb.readInt64(this.bb.__vector(this.bb_pos+n)+e*8):BigInt(0)}intsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}strings(e,n){let t=this.bb.__offset(this.bb_pos,24);return t?this.bb.__string(this.bb.__vector(this.bb_pos+t)+e*4,n):null}stringsLength(){let e=this.bb.__offset(this.bb_pos,24);return e?this.bb.__vector_len(this.bb_pos+e):0}tensors(e,n){let t=this.bb.__offset(this.bb_pos,26);return t?(n||new eh.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}tensorsLength(){let e=this.bb.__offset(this.bb_pos,26);return e?this.bb.__vector_len(this.bb_pos+e):0}graphs(e,n){let t=this.bb.__offset(this.bb_pos,28);return t?(n||new Yf.Graph).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}graphsLength(){let e=this.bb.__offset(this.bb_pos,28);return e?this.bb.__vector_len(this.bb_pos+e):0}static startAttribute(e){e.startObject(13)}static addName(e,n){e.addFieldOffset(0,n,0)}static addDocString(e,n){e.addFieldOffset(1,n,0)}static addType(e,n){e.addFieldInt32(2,n,Qf.AttributeType.UNDEFINED)}static addF(e,n){e.addFieldFloat32(3,n,0)}static addI(e,n){e.addFieldInt64(4,n,BigInt("0"))}static addS(e,n){e.addFieldOffset(5,n,0)}static addT(e,n){e.addFieldOffset(6,n,0)}static addG(e,n){e.addFieldOffset(7,n,0)}static addFloats(e,n){e.addFieldOffset(8,n,0)}static createFloatsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addFloat32(n[t]);return e.endVector()}static startFloatsVector(e,n){e.startVector(4,n,4)}static addInts(e,n){e.addFieldOffset(9,n,0)}static createIntsVector(e,n){e.startVector(8,n.length,8);for(let t=n.length-1;t>=0;t--)e.addInt64(n[t]);return e.endVector()}static startIntsVector(e,n){e.startVector(8,n,8)}static addStrings(e,n){e.addFieldOffset(10,n,0)}static createStringsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startStringsVector(e,n){e.startVector(4,n,4)}static addTensors(e,n){e.addFieldOffset(11,n,0)}static createTensorsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startTensorsVector(e,n){e.startVector(4,n,4)}static addGraphs(e,n){e.addFieldOffset(12,n,0)}static createGraphsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startGraphsVector(e,n){e.startVector(4,n,4)}static endAttribute(e){return e.endObject()}};In.Attribute=Nu});var Ru=re(Sn=>{"use strict";var sS=Sn&&Sn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),uS=Sn&&Sn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),lS=Sn&&Sn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&sS(e,r,n);return uS(e,r),e};Object.defineProperty(Sn,"__esModule",{value:!0});Sn.DeprecatedKernelCreateInfos=void 0;var cS=lS(Re()),Lu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsDeprecatedKernelCreateInfos(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDeprecatedKernelCreateInfos(e,n){return e.setPosition(e.position()+cS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}nodeIndices(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.readUint32(this.bb.__vector(this.bb_pos+n)+e*4):0}nodeIndicesLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeIndicesArray(){let e=this.bb.__offset(this.bb_pos,4);return e?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}kernelDefHashes(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.readUint64(this.bb.__vector(this.bb_pos+n)+e*8):BigInt(0)}kernelDefHashesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startDeprecatedKernelCreateInfos(e){e.startObject(2)}static addNodeIndices(e,n){e.addFieldOffset(0,n,0)}static createNodeIndicesVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addInt32(n[t]);return e.endVector()}static startNodeIndicesVector(e,n){e.startVector(4,n,4)}static addKernelDefHashes(e,n){e.addFieldOffset(1,n,0)}static createKernelDefHashesVector(e,n){e.startVector(8,n.length,8);for(let t=n.length-1;t>=0;t--)e.addInt64(n[t]);return e.endVector()}static startKernelDefHashesVector(e,n){e.startVector(8,n,8)}static endDeprecatedKernelCreateInfos(e){return e.endObject()}static createDeprecatedKernelCreateInfos(e,n,t){return r.startDeprecatedKernelCreateInfos(e),r.addNodeIndices(e,n),r.addKernelDefHashes(e,t),r.endDeprecatedKernelCreateInfos(e)}};Sn.DeprecatedKernelCreateInfos=Lu});var th=re($n=>{"use strict";var dS=$n&&$n.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),pS=$n&&$n.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),fS=$n&&$n.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&dS(e,r,n);return pS(e,r),e};Object.defineProperty($n,"__esModule",{value:!0});$n.DeprecatedNodeIndexAndKernelDefHash=void 0;var hS=fS(Re()),zu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsDeprecatedNodeIndexAndKernelDefHash(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDeprecatedNodeIndexAndKernelDefHash(e,n){return e.setPosition(e.position()+hS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}nodeIndex(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readUint32(this.bb_pos+e):0}kernelDefHash(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readUint64(this.bb_pos+e):BigInt("0")}static startDeprecatedNodeIndexAndKernelDefHash(e){e.startObject(2)}static addNodeIndex(e,n){e.addFieldInt32(0,n,0)}static addKernelDefHash(e,n){e.addFieldInt64(1,n,BigInt("0"))}static endDeprecatedNodeIndexAndKernelDefHash(e){return e.endObject()}static createDeprecatedNodeIndexAndKernelDefHash(e,n,t){return r.startDeprecatedNodeIndexAndKernelDefHash(e),r.addNodeIndex(e,n),r.addKernelDefHash(e,t),r.endDeprecatedNodeIndexAndKernelDefHash(e)}};$n.DeprecatedNodeIndexAndKernelDefHash=zu});var Bu=re(An=>{"use strict";var mS=An&&An.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),gS=An&&An.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),bS=An&&An.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&mS(e,r,n);return gS(e,r),e};Object.defineProperty(An,"__esModule",{value:!0});An.DeprecatedSubGraphSessionState=void 0;var yS=bS(Re()),_S=Fu(),Mu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsDeprecatedSubGraphSessionState(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDeprecatedSubGraphSessionState(e,n){return e.setPosition(e.position()+yS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}graphId(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}sessionState(e){let n=this.bb.__offset(this.bb_pos,6);return n?(e||new _S.DeprecatedSessionState).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startDeprecatedSubGraphSessionState(e){e.startObject(2)}static addGraphId(e,n){e.addFieldOffset(0,n,0)}static addSessionState(e,n){e.addFieldOffset(1,n,0)}static endDeprecatedSubGraphSessionState(e){let n=e.endObject();return e.requiredField(n,4),n}};An.DeprecatedSubGraphSessionState=Mu});var Fu=re(On=>{"use strict";var wS=On&&On.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),vS=On&&On.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),xS=On&&On.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&wS(e,r,n);return vS(e,r),e};Object.defineProperty(On,"__esModule",{value:!0});On.DeprecatedSessionState=void 0;var TS=xS(Re()),IS=Ru(),SS=Bu(),Vu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsDeprecatedSessionState(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDeprecatedSessionState(e,n){return e.setPosition(e.position()+TS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}kernels(e){let n=this.bb.__offset(this.bb_pos,4);return n?(e||new IS.DeprecatedKernelCreateInfos).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}subGraphSessionStates(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new SS.DeprecatedSubGraphSessionState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}subGraphSessionStatesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startDeprecatedSessionState(e){e.startObject(2)}static addKernels(e,n){e.addFieldOffset(0,n,0)}static addSubGraphSessionStates(e,n){e.addFieldOffset(1,n,0)}static createSubGraphSessionStatesVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startSubGraphSessionStatesVector(e,n){e.startVector(4,n,4)}static endDeprecatedSessionState(e){return e.endObject()}static createDeprecatedSessionState(e,n,t){return r.startDeprecatedSessionState(e),r.addKernels(e,n),r.addSubGraphSessionStates(e,t),r.endDeprecatedSessionState(e)}};On.DeprecatedSessionState=Vu});var Uu=re(Pn=>{"use strict";var $S=Pn&&Pn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),AS=Pn&&Pn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),OS=Pn&&Pn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&$S(e,r,n);return AS(e,r),e};Object.defineProperty(Pn,"__esModule",{value:!0});Pn.KernelTypeStrArgsEntry=void 0;var PS=OS(Re()),ES=Xs(),Gu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsKernelTypeStrArgsEntry(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsKernelTypeStrArgsEntry(e,n){return e.setPosition(e.position()+PS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}kernelTypeStr(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}args(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new ES.ArgTypeAndIndex).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}argsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startKernelTypeStrArgsEntry(e){e.startObject(2)}static addKernelTypeStr(e,n){e.addFieldOffset(0,n,0)}static addArgs(e,n){e.addFieldOffset(1,n,0)}static createArgsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startArgsVector(e,n){e.startVector(4,n,4)}static endKernelTypeStrArgsEntry(e){let n=e.endObject();return e.requiredField(n,4),n}static createKernelTypeStrArgsEntry(e,n,t){return r.startKernelTypeStrArgsEntry(e),r.addKernelTypeStr(e,n),r.addArgs(e,t),r.endKernelTypeStrArgsEntry(e)}};Pn.KernelTypeStrArgsEntry=Gu});var Hu=re(En=>{"use strict";var CS=En&&En.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),DS=En&&En.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),kS=En&&En.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&CS(e,r,n);return DS(e,r),e};Object.defineProperty(En,"__esModule",{value:!0});En.OpIdKernelTypeStrArgsEntry=void 0;var NS=kS(Re()),LS=Uu(),Wu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsOpIdKernelTypeStrArgsEntry(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsOpIdKernelTypeStrArgsEntry(e,n){return e.setPosition(e.position()+NS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}opId(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}kernelTypeStrArgs(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new LS.KernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}kernelTypeStrArgsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startOpIdKernelTypeStrArgsEntry(e){e.startObject(2)}static addOpId(e,n){e.addFieldOffset(0,n,0)}static addKernelTypeStrArgs(e,n){e.addFieldOffset(1,n,0)}static createKernelTypeStrArgsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startKernelTypeStrArgsVector(e,n){e.startVector(4,n,4)}static endOpIdKernelTypeStrArgsEntry(e){let n=e.endObject();return e.requiredField(n,4),n}static createOpIdKernelTypeStrArgsEntry(e,n,t){return r.startOpIdKernelTypeStrArgsEntry(e),r.addOpId(e,n),r.addKernelTypeStrArgs(e,t),r.endOpIdKernelTypeStrArgsEntry(e)}};En.OpIdKernelTypeStrArgsEntry=Wu});var ju=re(Cn=>{"use strict";var RS=Cn&&Cn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),zS=Cn&&Cn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),MS=Cn&&Cn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&RS(e,r,n);return zS(e,r),e};Object.defineProperty(Cn,"__esModule",{value:!0});Cn.KernelTypeStrResolver=void 0;var BS=MS(Re()),FS=Hu(),qu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsKernelTypeStrResolver(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsKernelTypeStrResolver(e,n){return e.setPosition(e.position()+BS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}opKernelTypeStrArgs(e,n){let t=this.bb.__offset(this.bb_pos,4);return t?(n||new FS.OpIdKernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}opKernelTypeStrArgsLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startKernelTypeStrResolver(e){e.startObject(1)}static addOpKernelTypeStrArgs(e,n){e.addFieldOffset(0,n,0)}static createOpKernelTypeStrArgsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startOpKernelTypeStrArgsVector(e,n){e.startVector(4,n,4)}static endKernelTypeStrResolver(e){return e.endObject()}static createKernelTypeStrResolver(e,n){return r.startKernelTypeStrResolver(e),r.addOpKernelTypeStrArgs(e,n),r.endKernelTypeStrResolver(e)}};Cn.KernelTypeStrResolver=qu});var Xu=re(Dn=>{"use strict";var VS=Dn&&Dn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),GS=Dn&&Dn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),US=Dn&&Dn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&VS(e,r,n);return GS(e,r),e};Object.defineProperty(Dn,"__esModule",{value:!0});Dn.OperatorSetId=void 0;var WS=US(Re()),Ku=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsOperatorSetId(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsOperatorSetId(e,n){return e.setPosition(e.position()+WS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}domain(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}version(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}static startOperatorSetId(e){e.startObject(2)}static addDomain(e,n){e.addFieldOffset(0,n,0)}static addVersion(e,n){e.addFieldInt64(1,n,BigInt("0"))}static endOperatorSetId(e){return e.endObject()}static createOperatorSetId(e,n,t){return r.startOperatorSetId(e),r.addDomain(e,n),r.addVersion(e,t),r.endOperatorSetId(e)}};Dn.OperatorSetId=Ku});var Ju=re(kn=>{"use strict";var HS=kn&&kn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),qS=kn&&kn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),jS=kn&&kn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&HS(e,r,n);return qS(e,r),e};Object.defineProperty(kn,"__esModule",{value:!0});kn.StringStringEntry=void 0;var KS=jS(Re()),Zu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsStringStringEntry(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsStringStringEntry(e,n){return e.setPosition(e.position()+KS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}key(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}value(e){let n=this.bb.__offset(this.bb_pos,6);return n?this.bb.__string(this.bb_pos+n,e):null}static startStringStringEntry(e){e.startObject(2)}static addKey(e,n){e.addFieldOffset(0,n,0)}static addValue(e,n){e.addFieldOffset(1,n,0)}static endStringStringEntry(e){return e.endObject()}static createStringStringEntry(e,n,t){return r.startStringStringEntry(e),r.addKey(e,n),r.addValue(e,t),r.endStringStringEntry(e)}};kn.StringStringEntry=Zu});var Yu=re(Nn=>{"use strict";var XS=Nn&&Nn.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),ZS=Nn&&Nn.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),JS=Nn&&Nn.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&XS(e,r,n);return ZS(e,r),e};Object.defineProperty(Nn,"__esModule",{value:!0});Nn.Model=void 0;var QS=JS(Re()),YS=Ei(),e$=Xu(),t$=Ju(),Qu=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsModel(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsModel(e,n){return e.setPosition(e.position()+QS.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}irVersion(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}opsetImport(e,n){let t=this.bb.__offset(this.bb_pos,6);return t?(n||new e$.OperatorSetId).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}opsetImportLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}producerName(e){let n=this.bb.__offset(this.bb_pos,8);return n?this.bb.__string(this.bb_pos+n,e):null}producerVersion(e){let n=this.bb.__offset(this.bb_pos,10);return n?this.bb.__string(this.bb_pos+n,e):null}domain(e){let n=this.bb.__offset(this.bb_pos,12);return n?this.bb.__string(this.bb_pos+n,e):null}modelVersion(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.readInt64(this.bb_pos+e):BigInt("0")}docString(e){let n=this.bb.__offset(this.bb_pos,16);return n?this.bb.__string(this.bb_pos+n,e):null}graph(e){let n=this.bb.__offset(this.bb_pos,18);return n?(e||new YS.Graph).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}graphDocString(e){let n=this.bb.__offset(this.bb_pos,20);return n?this.bb.__string(this.bb_pos+n,e):null}metadataProps(e,n){let t=this.bb.__offset(this.bb_pos,22);return t?(n||new t$.StringStringEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+t)+e*4),this.bb):null}metadataPropsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}static startModel(e){e.startObject(10)}static addIrVersion(e,n){e.addFieldInt64(0,n,BigInt("0"))}static addOpsetImport(e,n){e.addFieldOffset(1,n,0)}static createOpsetImportVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startOpsetImportVector(e,n){e.startVector(4,n,4)}static addProducerName(e,n){e.addFieldOffset(2,n,0)}static addProducerVersion(e,n){e.addFieldOffset(3,n,0)}static addDomain(e,n){e.addFieldOffset(4,n,0)}static addModelVersion(e,n){e.addFieldInt64(5,n,BigInt("0"))}static addDocString(e,n){e.addFieldOffset(6,n,0)}static addGraph(e,n){e.addFieldOffset(7,n,0)}static addGraphDocString(e,n){e.addFieldOffset(8,n,0)}static addMetadataProps(e,n){e.addFieldOffset(9,n,0)}static createMetadataPropsVector(e,n){e.startVector(4,n.length,4);for(let t=n.length-1;t>=0;t--)e.addOffset(n[t]);return e.endVector()}static startMetadataPropsVector(e,n){e.startVector(4,n,4)}static endModel(e){return e.endObject()}};Nn.Model=Qu});var nh=re(Ln=>{"use strict";var n$=Ln&&Ln.__createBinding||(Object.create?function(r,e,n,t){t===void 0&&(t=n);var o=Object.getOwnPropertyDescriptor(e,n);(!o||("get"in o?!e.__esModule:o.writable||o.configurable))&&(o={enumerable:!0,get:function(){return e[n]}}),Object.defineProperty(r,t,o)}:function(r,e,n,t){t===void 0&&(t=n),r[t]=e[n]}),r$=Ln&&Ln.__setModuleDefault||(Object.create?function(r,e){Object.defineProperty(r,"default",{enumerable:!0,value:e})}:function(r,e){r.default=e}),o$=Ln&&Ln.__importStar||function(r){if(r&&r.__esModule)return r;var e={};if(r!=null)for(var n in r)n!=="default"&&Object.prototype.hasOwnProperty.call(r,n)&&n$(e,r,n);return r$(e,r),e};Object.defineProperty(Ln,"__esModule",{value:!0});Ln.InferenceSession=void 0;var i$=o$(Re()),a$=ju(),s$=Yu(),el=class r{constructor(){this.bb=null,this.bb_pos=0}__init(e,n){return this.bb_pos=e,this.bb=n,this}static getRootAsInferenceSession(e,n){return(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsInferenceSession(e,n){return e.setPosition(e.position()+i$.SIZE_PREFIX_LENGTH),(n||new r).__init(e.readInt32(e.position())+e.position(),e)}static bufferHasIdentifier(e){return e.__has_identifier("ORTM")}ortVersion(e){let n=this.bb.__offset(this.bb_pos,4);return n?this.bb.__string(this.bb_pos+n,e):null}model(e){let n=this.bb.__offset(this.bb_pos,6);return n?(e||new s$.Model).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}kernelTypeStrResolver(e){let n=this.bb.__offset(this.bb_pos,10);return n?(e||new a$.KernelTypeStrResolver).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startInferenceSession(e){e.startObject(4)}static addOrtVersion(e,n){e.addFieldOffset(0,n,0)}static addModel(e,n){e.addFieldOffset(1,n,0)}static addKernelTypeStrResolver(e,n){e.addFieldOffset(3,n,0)}static endInferenceSession(e){return e.endObject()}static finishInferenceSessionBuffer(e,n){e.finish(n,"ORTM")}static finishSizePrefixedInferenceSessionBuffer(e,n){e.finish(n,"ORTM",!0)}};Ln.InferenceSession=el});var u$,l$,Ci,Rt,c$,d$,p$,f$,h$,m$,g$,b$,tl,nl,y$,_$,w$,v$,rl,x$,T$,I$,S$,$$,A$,O$,P$,E$,C$,D$,k$,N$,Io,ol,L$,il,R$,rh=N(()=>{"use strict";u$=ye(Gs()),l$=ye(Xs()),Ci=ye(eu()),Rt=ye(Zs()),c$=ye(Ru()),d$=ye(th()),p$=ye(Fu()),f$=ye(Bu()),h$=ye(Iu()),m$=ye(xu()),g$=ye(wu()),b$=ye(nu()),tl=ye(Ei()),nl=ye(nh()),y$=ye(Uu()),_$=ye(ju()),w$=ye(bu()),v$=ye(Yu()),rl=ye(Ys()),x$=ye(ou()),T$=ye(Js()),I$=ye(au()),S$=ye(Hu()),$$=ye(Xu()),A$=ye(uu()),O$=ye(cu()),P$=ye(pu()),E$=ye(_u()),C$=ye($u()),D$=ye(mu()),k$=ye(Ju()),N$=ye(xo()),Io=ye(vo()),ol=ye(Ou()),L$=ye(To()),il=ye(Pu()),R$=ye(Du())});var So=N(()=>{"use strict";rh()});var ih=re((p4,oh)=>{"use strict";oh.exports=z$;function z$(r,e){for(var n=new Array(arguments.length-1),t=0,o=2,i=!0;o<arguments.length;)n[t++]=arguments[o++];return new Promise(function(s,u){n[t]=function(d){if(i)if(i=!1,d)u(d);else{for(var p=new Array(arguments.length-1),h=0;h<p.length;)p[h++]=arguments[h];s.apply(null,p)}};try{r.apply(e||null,n)}catch(l){i&&(i=!1,u(l))}})}});var lh=re(uh=>{"use strict";var ki=uh;ki.length=function(e){var n=e.length;if(!n)return 0;for(var t=0;--n%4>1&&e.charAt(n)==="=";)++t;return Math.ceil(e.length*3)/4-t};var Qr=new Array(64),sh=new Array(123);for(qt=0;qt<64;)sh[Qr[qt]=qt<26?qt+65:qt<52?qt+71:qt<62?qt-4:qt-59|43]=qt++;var qt;ki.encode=function(e,n,t){for(var o=null,i=[],a=0,s=0,u;n<t;){var l=e[n++];switch(s){case 0:i[a++]=Qr[l>>2],u=(l&3)<<4,s=1;break;case 1:i[a++]=Qr[u|l>>4],u=(l&15)<<2,s=2;break;case 2:i[a++]=Qr[u|l>>6],i[a++]=Qr[l&63],s=0;break}a>8191&&((o||(o=[])).push(String.fromCharCode.apply(String,i)),a=0)}return s&&(i[a++]=Qr[u],i[a++]=61,s===1&&(i[a++]=61)),o?(a&&o.push(String.fromCharCode.apply(String,i.slice(0,a))),o.join("")):String.fromCharCode.apply(String,i.slice(0,a))};var ah="invalid encoding";ki.decode=function(e,n,t){for(var o=t,i=0,a,s=0;s<e.length;){var u=e.charCodeAt(s++);if(u===61&&i>1)break;if((u=sh[u])===void 0)throw Error(ah);switch(i){case 0:a=u,i=1;break;case 1:n[t++]=a<<2|(u&48)>>4,a=u,i=2;break;case 2:n[t++]=(a&15)<<4|(u&60)>>2,a=u,i=3;break;case 3:n[t++]=(a&3)<<6|u,i=0;break}}if(i===1)throw Error(ah);return t-o};ki.test=function(e){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)}});var dh=re((h4,ch)=>{"use strict";ch.exports=Ni;function Ni(){this._listeners={}}Ni.prototype.on=function(e,n,t){return(this._listeners[e]||(this._listeners[e]=[])).push({fn:n,ctx:t||this}),this};Ni.prototype.off=function(e,n){if(e===void 0)this._listeners={};else if(n===void 0)this._listeners[e]=[];else for(var t=this._listeners[e],o=0;o<t.length;)t[o].fn===n?t.splice(o,1):++o;return this};Ni.prototype.emit=function(e){var n=this._listeners[e];if(n){for(var t=[],o=1;o<arguments.length;)t.push(arguments[o++]);for(o=0;o<n.length;)n[o].fn.apply(n[o++].ctx,t)}return this}});var yh=re((m4,bh)=>{"use strict";bh.exports=ph(ph);function ph(r){return typeof Float32Array<"u"?function(){var e=new Float32Array([-0]),n=new Uint8Array(e.buffer),t=n[3]===128;function o(u,l,d){e[0]=u,l[d]=n[0],l[d+1]=n[1],l[d+2]=n[2],l[d+3]=n[3]}function i(u,l,d){e[0]=u,l[d]=n[3],l[d+1]=n[2],l[d+2]=n[1],l[d+3]=n[0]}r.writeFloatLE=t?o:i,r.writeFloatBE=t?i:o;function a(u,l){return n[0]=u[l],n[1]=u[l+1],n[2]=u[l+2],n[3]=u[l+3],e[0]}function s(u,l){return n[3]=u[l],n[2]=u[l+1],n[1]=u[l+2],n[0]=u[l+3],e[0]}r.readFloatLE=t?a:s,r.readFloatBE=t?s:a}():function(){function e(t,o,i,a){var s=o<0?1:0;if(s&&(o=-o),o===0)t(1/o>0?0:2147483648,i,a);else if(isNaN(o))t(2143289344,i,a);else if(o>34028234663852886e22)t((s<<31|2139095040)>>>0,i,a);else if(o<11754943508222875e-54)t((s<<31|Math.round(o/1401298464324817e-60))>>>0,i,a);else{var u=Math.floor(Math.log(o)/Math.LN2),l=Math.round(o*Math.pow(2,-u)*8388608)&8388607;t((s<<31|u+127<<23|l)>>>0,i,a)}}r.writeFloatLE=e.bind(null,fh),r.writeFloatBE=e.bind(null,hh);function n(t,o,i){var a=t(o,i),s=(a>>31)*2+1,u=a>>>23&255,l=a&8388607;return u===255?l?NaN:s*(1/0):u===0?s*1401298464324817e-60*l:s*Math.pow(2,u-150)*(l+8388608)}r.readFloatLE=n.bind(null,mh),r.readFloatBE=n.bind(null,gh)}(),typeof Float64Array<"u"?function(){var e=new Float64Array([-0]),n=new Uint8Array(e.buffer),t=n[7]===128;function o(u,l,d){e[0]=u,l[d]=n[0],l[d+1]=n[1],l[d+2]=n[2],l[d+3]=n[3],l[d+4]=n[4],l[d+5]=n[5],l[d+6]=n[6],l[d+7]=n[7]}function i(u,l,d){e[0]=u,l[d]=n[7],l[d+1]=n[6],l[d+2]=n[5],l[d+3]=n[4],l[d+4]=n[3],l[d+5]=n[2],l[d+6]=n[1],l[d+7]=n[0]}r.writeDoubleLE=t?o:i,r.writeDoubleBE=t?i:o;function a(u,l){return n[0]=u[l],n[1]=u[l+1],n[2]=u[l+2],n[3]=u[l+3],n[4]=u[l+4],n[5]=u[l+5],n[6]=u[l+6],n[7]=u[l+7],e[0]}function s(u,l){return n[7]=u[l],n[6]=u[l+1],n[5]=u[l+2],n[4]=u[l+3],n[3]=u[l+4],n[2]=u[l+5],n[1]=u[l+6],n[0]=u[l+7],e[0]}r.readDoubleLE=t?a:s,r.readDoubleBE=t?s:a}():function(){function e(t,o,i,a,s,u){var l=a<0?1:0;if(l&&(a=-a),a===0)t(0,s,u+o),t(1/a>0?0:2147483648,s,u+i);else if(isNaN(a))t(0,s,u+o),t(2146959360,s,u+i);else if(a>17976931348623157e292)t(0,s,u+o),t((l<<31|2146435072)>>>0,s,u+i);else{var d;if(a<22250738585072014e-324)d=a/5e-324,t(d>>>0,s,u+o),t((l<<31|d/4294967296)>>>0,s,u+i);else{var p=Math.floor(Math.log(a)/Math.LN2);p===1024&&(p=1023),d=a*Math.pow(2,-p),t(d*4503599627370496>>>0,s,u+o),t((l<<31|p+1023<<20|d*1048576&1048575)>>>0,s,u+i)}}}r.writeDoubleLE=e.bind(null,fh,0,4),r.writeDoubleBE=e.bind(null,hh,4,0);function n(t,o,i,a,s){var u=t(a,s+o),l=t(a,s+i),d=(l>>31)*2+1,p=l>>>20&2047,h=4294967296*(l&1048575)+u;return p===2047?h?NaN:d*(1/0):p===0?d*5e-324*h:d*Math.pow(2,p-1075)*(h+4503599627370496)}r.readDoubleLE=n.bind(null,mh,0,4),r.readDoubleBE=n.bind(null,gh,4,0)}(),r}function fh(r,e,n){e[n]=r&255,e[n+1]=r>>>8&255,e[n+2]=r>>>16&255,e[n+3]=r>>>24}function hh(r,e,n){e[n]=r>>>24,e[n+1]=r>>>16&255,e[n+2]=r>>>8&255,e[n+3]=r&255}function mh(r,e){return(r[e]|r[e+1]<<8|r[e+2]<<16|r[e+3]<<24)>>>0}function gh(r,e){return(r[e]<<24|r[e+1]<<16|r[e+2]<<8|r[e+3])>>>0}});var _h=re((exports,module)=>{"use strict";module.exports=inquire;function inquire(moduleName){try{var mod=eval("quire".replace(/^/,"re"))(moduleName);if(mod&&(mod.length||Object.keys(mod).length))return mod}catch(r){}return null}});var vh=re(wh=>{"use strict";var al=wh;al.length=function(e){for(var n=0,t=0,o=0;o<e.length;++o)t=e.charCodeAt(o),t<128?n+=1:t<2048?n+=2:(t&64512)===55296&&(e.charCodeAt(o+1)&64512)===56320?(++o,n+=4):n+=3;return n};al.read=function(e,n,t){var o=t-n;if(o<1)return"";for(var i=null,a=[],s=0,u;n<t;)u=e[n++],u<128?a[s++]=u:u>191&&u<224?a[s++]=(u&31)<<6|e[n++]&63:u>239&&u<365?(u=((u&7)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,a[s++]=55296+(u>>10),a[s++]=56320+(u&1023)):a[s++]=(u&15)<<12|(e[n++]&63)<<6|e[n++]&63,s>8191&&((i||(i=[])).push(String.fromCharCode.apply(String,a)),s=0);return i?(s&&i.push(String.fromCharCode.apply(String,a.slice(0,s))),i.join("")):String.fromCharCode.apply(String,a.slice(0,s))};al.write=function(e,n,t){for(var o=t,i,a,s=0;s<e.length;++s)i=e.charCodeAt(s),i<128?n[t++]=i:i<2048?(n[t++]=i>>6|192,n[t++]=i&63|128):(i&64512)===55296&&((a=e.charCodeAt(s+1))&64512)===56320?(i=65536+((i&1023)<<10)+(a&1023),++s,n[t++]=i>>18|240,n[t++]=i>>12&63|128,n[t++]=i>>6&63|128,n[t++]=i&63|128):(n[t++]=i>>12|224,n[t++]=i>>6&63|128,n[t++]=i&63|128);return t-o}});var Th=re((b4,xh)=>{"use strict";xh.exports=M$;function M$(r,e,n){var t=n||8192,o=t>>>1,i=null,a=t;return function(u){if(u<1||u>o)return r(u);a+u>t&&(i=r(t),a=0);var l=e.call(i,a,a+=u);return a&7&&(a=(a|7)+1),l}}});var Sh=re((y4,Ih)=>{"use strict";Ih.exports=ct;var $o=fr();function ct(r,e){this.lo=r>>>0,this.hi=e>>>0}var Er=ct.zero=new ct(0,0);Er.toNumber=function(){return 0};Er.zzEncode=Er.zzDecode=function(){return this};Er.length=function(){return 1};var B$=ct.zeroHash="\0\0\0\0\0\0\0\0";ct.fromNumber=function(e){if(e===0)return Er;var n=e<0;n&&(e=-e);var t=e>>>0,o=(e-t)/4294967296>>>0;return n&&(o=~o>>>0,t=~t>>>0,++t>4294967295&&(t=0,++o>4294967295&&(o=0))),new ct(t,o)};ct.from=function(e){if(typeof e=="number")return ct.fromNumber(e);if($o.isString(e))if($o.Long)e=$o.Long.fromString(e);else return ct.fromNumber(parseInt(e,10));return e.low||e.high?new ct(e.low>>>0,e.high>>>0):Er};ct.prototype.toNumber=function(e){if(!e&&this.hi>>>31){var n=~this.lo+1>>>0,t=~this.hi>>>0;return n||(t=t+1>>>0),-(n+t*4294967296)}return this.lo+this.hi*4294967296};ct.prototype.toLong=function(e){return $o.Long?new $o.Long(this.lo|0,this.hi|0,!!e):{low:this.lo|0,high:this.hi|0,unsigned:!!e}};var pr=String.prototype.charCodeAt;ct.fromHash=function(e){return e===B$?Er:new ct((pr.call(e,0)|pr.call(e,1)<<8|pr.call(e,2)<<16|pr.call(e,3)<<24)>>>0,(pr.call(e,4)|pr.call(e,5)<<8|pr.call(e,6)<<16|pr.call(e,7)<<24)>>>0)};ct.prototype.toHash=function(){return String.fromCharCode(this.lo&255,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,this.hi&255,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)};ct.prototype.zzEncode=function(){var e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this};ct.prototype.zzDecode=function(){var e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this};ct.prototype.length=function(){var e=this.lo,n=(this.lo>>>28|this.hi<<4)>>>0,t=this.hi>>>24;return t===0?n===0?e<16384?e<128?1:2:e<2097152?3:4:n<16384?n<128?5:6:n<2097152?7:8:t<128?9:10}});var fr=re(sl=>{"use strict";var ae=sl;ae.asPromise=ih();ae.base64=lh();ae.EventEmitter=dh();ae.float=yh();ae.inquire=_h();ae.utf8=vh();ae.pool=Th();ae.LongBits=Sh();ae.isNode=!!(typeof global<"u"&&global&&global.process&&global.process.versions&&global.process.versions.node);ae.global=ae.isNode&&global||typeof window<"u"&&window||typeof self<"u"&&self||sl;ae.emptyArray=Object.freeze?Object.freeze([]):[];ae.emptyObject=Object.freeze?Object.freeze({}):{};ae.isInteger=Number.isInteger||function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e};ae.isString=function(e){return typeof e=="string"||e instanceof String};ae.isObject=function(e){return e&&typeof e=="object"};ae.isset=ae.isSet=function(e,n){var t=e[n];return t!=null&&e.hasOwnProperty(n)?typeof t!="object"||(Array.isArray(t)?t.length:Object.keys(t).length)>0:!1};ae.Buffer=function(){try{var r=ae.inquire("buffer").Buffer;return r.prototype.utf8Write?r:null}catch{return null}}();ae._Buffer_from=null;ae._Buffer_allocUnsafe=null;ae.newBuffer=function(e){return typeof e=="number"?ae.Buffer?ae._Buffer_allocUnsafe(e):new ae.Array(e):ae.Buffer?ae._Buffer_from(e):typeof Uint8Array>"u"?e:new Uint8Array(e)};ae.Array=typeof Uint8Array<"u"?Uint8Array:Array;ae.Long=ae.global.dcodeIO&&ae.global.dcodeIO.Long||ae.global.Long||ae.inquire("long");ae.key2Re=/^true|false|0|1$/;ae.key32Re=/^-?(?:0|[1-9][0-9]*)$/;ae.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;ae.longToHash=function(e){return e?ae.LongBits.from(e).toHash():ae.LongBits.zeroHash};ae.longFromHash=function(e,n){var t=ae.LongBits.fromHash(e);return ae.Long?ae.Long.fromBits(t.lo,t.hi,n):t.toNumber(!!n)};function $h(r,e,n){for(var t=Object.keys(e),o=0;o<t.length;++o)(r[t[o]]===void 0||!n)&&(r[t[o]]=e[t[o]]);return r}ae.merge=$h;ae.lcFirst=function(e){return e.charAt(0).toLowerCase()+e.substring(1)};function Ah(r){function e(n,t){if(!(this instanceof e))return new e(n,t);Object.defineProperty(this,"message",{get:function(){return n}}),Error.captureStackTrace?Error.captureStackTrace(this,e):Object.defineProperty(this,"stack",{value:new Error().stack||""}),t&&$h(this,t)}return e.prototype=Object.create(Error.prototype,{constructor:{value:e,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return r},set:void 0,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),e}ae.newError=Ah;ae.ProtocolError=Ah("ProtocolError");ae.oneOfGetter=function(e){for(var n={},t=0;t<e.length;++t)n[e[t]]=1;return function(){for(var o=Object.keys(this),i=o.length-1;i>-1;--i)if(n[o[i]]===1&&this[o[i]]!==void 0&&this[o[i]]!==null)return o[i]}};ae.oneOfSetter=function(e){return function(n){for(var t=0;t<e.length;++t)e[t]!==n&&delete this[e[t]]}};ae.toJSONOptions={longs:String,enums:String,bytes:String,json:!0};ae._configure=function(){var r=ae.Buffer;if(!r){ae._Buffer_from=ae._Buffer_allocUnsafe=null;return}ae._Buffer_from=r.from!==Uint8Array.from&&r.from||function(n,t){return new r(n,t)},ae._Buffer_allocUnsafe=r.allocUnsafe||function(n){return new r(n)}}});var hl=re((w4,Ch)=>{"use strict";Ch.exports=Ce;var zt=fr(),ul,Li=zt.LongBits,Oh=zt.base64,Ph=zt.utf8;function Ao(r,e,n){this.fn=r,this.len=e,this.next=void 0,this.val=n}function cl(){}function F$(r){this.head=r.head,this.tail=r.tail,this.len=r.len,this.next=r.states}function Ce(){this.len=0,this.head=new Ao(cl,0,0),this.tail=this.head,this.states=null}var Eh=function(){return zt.Buffer?function(){return(Ce.create=function(){return new ul})()}:function(){return new Ce}};Ce.create=Eh();Ce.alloc=function(e){return new zt.Array(e)};zt.Array!==Array&&(Ce.alloc=zt.pool(Ce.alloc,zt.Array.prototype.subarray));Ce.prototype._push=function(e,n,t){return this.tail=this.tail.next=new Ao(e,n,t),this.len+=n,this};function dl(r,e,n){e[n]=r&255}function V$(r,e,n){for(;r>127;)e[n++]=r&127|128,r>>>=7;e[n]=r}function pl(r,e){this.len=r,this.next=void 0,this.val=e}pl.prototype=Object.create(Ao.prototype);pl.prototype.fn=V$;Ce.prototype.uint32=function(e){return this.len+=(this.tail=this.tail.next=new pl((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this};Ce.prototype.int32=function(e){return e<0?this._push(fl,10,Li.fromNumber(e)):this.uint32(e)};Ce.prototype.sint32=function(e){return this.uint32((e<<1^e>>31)>>>0)};function fl(r,e,n){for(;r.hi;)e[n++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[n++]=r.lo&127|128,r.lo=r.lo>>>7;e[n++]=r.lo}Ce.prototype.uint64=function(e){var n=Li.from(e);return this._push(fl,n.length(),n)};Ce.prototype.int64=Ce.prototype.uint64;Ce.prototype.sint64=function(e){var n=Li.from(e).zzEncode();return this._push(fl,n.length(),n)};Ce.prototype.bool=function(e){return this._push(dl,1,e?1:0)};function ll(r,e,n){e[n]=r&255,e[n+1]=r>>>8&255,e[n+2]=r>>>16&255,e[n+3]=r>>>24}Ce.prototype.fixed32=function(e){return this._push(ll,4,e>>>0)};Ce.prototype.sfixed32=Ce.prototype.fixed32;Ce.prototype.fixed64=function(e){var n=Li.from(e);return this._push(ll,4,n.lo)._push(ll,4,n.hi)};Ce.prototype.sfixed64=Ce.prototype.fixed64;Ce.prototype.float=function(e){return this._push(zt.float.writeFloatLE,4,e)};Ce.prototype.double=function(e){return this._push(zt.float.writeDoubleLE,8,e)};var G$=zt.Array.prototype.set?function(e,n,t){n.set(e,t)}:function(e,n,t){for(var o=0;o<e.length;++o)n[t+o]=e[o]};Ce.prototype.bytes=function(e){var n=e.length>>>0;if(!n)return this._push(dl,1,0);if(zt.isString(e)){var t=Ce.alloc(n=Oh.length(e));Oh.decode(e,t,0),e=t}return this.uint32(n)._push(G$,n,e)};Ce.prototype.string=function(e){var n=Ph.length(e);return n?this.uint32(n)._push(Ph.write,n,e):this._push(dl,1,0)};Ce.prototype.fork=function(){return this.states=new F$(this),this.head=this.tail=new Ao(cl,0,0),this.len=0,this};Ce.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Ao(cl,0,0),this.len=0),this};Ce.prototype.ldelim=function(){var e=this.head,n=this.tail,t=this.len;return this.reset().uint32(t),t&&(this.tail.next=e.next,this.tail=n,this.len+=t),this};Ce.prototype.finish=function(){for(var e=this.head.next,n=this.constructor.alloc(this.len),t=0;e;)e.fn(e.val,n,t),t+=e.len,e=e.next;return n};Ce._configure=function(r){ul=r,Ce.create=Eh(),ul._configure()}});var Nh=re((v4,kh)=>{"use strict";kh.exports=Rn;var Dh=hl();(Rn.prototype=Object.create(Dh.prototype)).constructor=Rn;var hr=fr();function Rn(){Dh.call(this)}Rn._configure=function(){Rn.alloc=hr._Buffer_allocUnsafe,Rn.writeBytesBuffer=hr.Buffer&&hr.Buffer.prototype instanceof Uint8Array&&hr.Buffer.prototype.set.name==="set"?function(e,n,t){n.set(e,t)}:function(e,n,t){if(e.copy)e.copy(n,t,0,e.length);else for(var o=0;o<e.length;)n[t++]=e[o++]}};Rn.prototype.bytes=function(e){hr.isString(e)&&(e=hr._Buffer_from(e,"base64"));var n=e.length>>>0;return this.uint32(n),n&&this._push(Rn.writeBytesBuffer,n,e),this};function U$(r,e,n){r.length<40?hr.utf8.write(r,e,n):e.utf8Write?e.utf8Write(r,n):e.write(r,n)}Rn.prototype.string=function(e){var n=hr.Buffer.byteLength(e);return this.uint32(n),n&&this._push(U$,n,e),this};Rn._configure()});var bl=re((x4,Bh)=>{"use strict";Bh.exports=et;var jt=fr(),gl,zh=jt.LongBits,W$=jt.utf8;function Kt(r,e){return RangeError("index out of range: "+r.pos+" + "+(e||1)+" > "+r.len)}function et(r){this.buf=r,this.pos=0,this.len=r.length}var Lh=typeof Uint8Array<"u"?function(e){if(e instanceof Uint8Array||Array.isArray(e))return new et(e);throw Error("illegal buffer")}:function(e){if(Array.isArray(e))return new et(e);throw Error("illegal buffer")},Mh=function(){return jt.Buffer?function(n){return(et.create=function(o){return jt.Buffer.isBuffer(o)?new gl(o):Lh(o)})(n)}:Lh};et.create=Mh();et.prototype._slice=jt.Array.prototype.subarray||jt.Array.prototype.slice;et.prototype.uint32=function(){var e=4294967295;return function(){if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Kt(this,10);return e}}();et.prototype.int32=function(){return this.uint32()|0};et.prototype.sint32=function(){var e=this.uint32();return e>>>1^-(e&1)|0};function ml(){var r=new zh(0,0),e=0;if(this.len-this.pos>4){for(;e<4;++e)if(r.lo=(r.lo|(this.buf[this.pos]&127)<<e*7)>>>0,this.buf[this.pos++]<128)return r;if(r.lo=(r.lo|(this.buf[this.pos]&127)<<28)>>>0,r.hi=(r.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return r;e=0}else{for(;e<3;++e){if(this.pos>=this.len)throw Kt(this);if(r.lo=(r.lo|(this.buf[this.pos]&127)<<e*7)>>>0,this.buf[this.pos++]<128)return r}return r.lo=(r.lo|(this.buf[this.pos++]&127)<<e*7)>>>0,r}if(this.len-this.pos>4){for(;e<5;++e)if(r.hi=(r.hi|(this.buf[this.pos]&127)<<e*7+3)>>>0,this.buf[this.pos++]<128)return r}else for(;e<5;++e){if(this.pos>=this.len)throw Kt(this);if(r.hi=(r.hi|(this.buf[this.pos]&127)<<e*7+3)>>>0,this.buf[this.pos++]<128)return r}throw Error("invalid varint encoding")}et.prototype.bool=function(){return this.uint32()!==0};function Ri(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}et.prototype.fixed32=function(){if(this.pos+4>this.len)throw Kt(this,4);return Ri(this.buf,this.pos+=4)};et.prototype.sfixed32=function(){if(this.pos+4>this.len)throw Kt(this,4);return Ri(this.buf,this.pos+=4)|0};function Rh(){if(this.pos+8>this.len)throw Kt(this,8);return new zh(Ri(this.buf,this.pos+=4),Ri(this.buf,this.pos+=4))}et.prototype.float=function(){if(this.pos+4>this.len)throw Kt(this,4);var e=jt.float.readFloatLE(this.buf,this.pos);return this.pos+=4,e};et.prototype.double=function(){if(this.pos+8>this.len)throw Kt(this,4);var e=jt.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,e};et.prototype.bytes=function(){var e=this.uint32(),n=this.pos,t=this.pos+e;if(t>this.len)throw Kt(this,e);if(this.pos+=e,Array.isArray(this.buf))return this.buf.slice(n,t);if(n===t){var o=jt.Buffer;return o?o.alloc(0):new this.buf.constructor(0)}return this._slice.call(this.buf,n,t)};et.prototype.string=function(){var e=this.bytes();return W$.read(e,0,e.length)};et.prototype.skip=function(e){if(typeof e=="number"){if(this.pos+e>this.len)throw Kt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Kt(this);while(this.buf[this.pos++]&128);return this};et.prototype.skipType=function(r){switch(r){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(r=this.uint32()&7)!==4;)this.skipType(r);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+r+" at offset "+this.pos)}return this};et._configure=function(r){gl=r,et.create=Mh(),gl._configure();var e=jt.Long?"toLong":"toNumber";jt.merge(et.prototype,{int64:function(){return ml.call(this)[e](!1)},uint64:function(){return ml.call(this)[e](!0)},sint64:function(){return ml.call(this).zzDecode()[e](!1)},fixed64:function(){return Rh.call(this)[e](!0)},sfixed64:function(){return Rh.call(this)[e](!1)}})}});var Uh=re((T4,Gh)=>{"use strict";Gh.exports=Cr;var Vh=bl();(Cr.prototype=Object.create(Vh.prototype)).constructor=Cr;var Fh=fr();function Cr(r){Vh.call(this,r)}Cr._configure=function(){Fh.Buffer&&(Cr.prototype._slice=Fh.Buffer.prototype.slice)};Cr.prototype.string=function(){var e=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+e,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+e,this.len))};Cr._configure()});var Hh=re((I4,Wh)=>{"use strict";Wh.exports=Oo;var yl=fr();(Oo.prototype=Object.create(yl.EventEmitter.prototype)).constructor=Oo;function Oo(r,e,n){if(typeof r!="function")throw TypeError("rpcImpl must be a function");yl.EventEmitter.call(this),this.rpcImpl=r,this.requestDelimited=!!e,this.responseDelimited=!!n}Oo.prototype.rpcCall=function r(e,n,t,o,i){if(!o)throw TypeError("request must be specified");var a=this;if(!i)return yl.asPromise(r,a,e,n,t,o);if(!a.rpcImpl){setTimeout(function(){i(Error("already ended"))},0);return}try{return a.rpcImpl(e,n[a.requestDelimited?"encodeDelimited":"encode"](o).finish(),function(u,l){if(u)return a.emit("error",u,e),i(u);if(l===null){a.end(!0);return}if(!(l instanceof t))try{l=t[a.responseDelimited?"decodeDelimited":"decode"](l)}catch(d){return a.emit("error",d,e),i(d)}return a.emit("data",l,e),i(null,l)})}catch(s){a.emit("error",s,e),setTimeout(function(){i(s)},0);return}};Oo.prototype.end=function(e){return this.rpcImpl&&(e||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}});var jh=re(qh=>{"use strict";var H$=qh;H$.Service=Hh()});var Xh=re(($4,Kh)=>{"use strict";Kh.exports={}});var Qh=re(Jh=>{"use strict";var xt=Jh;xt.build="minimal";xt.Writer=hl();xt.BufferWriter=Nh();xt.Reader=bl();xt.BufferReader=Uh();xt.util=fr();xt.rpc=jh();xt.roots=Xh();xt.configure=Zh;function Zh(){xt.util._configure(),xt.Writer._configure(xt.BufferWriter),xt.Reader._configure(xt.BufferReader)}Zh()});var em=re((O4,Yh)=>{"use strict";Yh.exports=Qh()});var Yr=re((P4,tm)=>{"use strict";var Ke=em(),K=Ke.Reader,tt=Ke.Writer,E=Ke.util,S=Ke.roots.default||(Ke.roots.default={});S.onnx=function(){var r={};return r.Version=function(){var e={},n=Object.create(e);return n[e[0]="_START_VERSION"]=0,n[e[1]="IR_VERSION_2017_10_10"]=1,n[e[2]="IR_VERSION_2017_10_30"]=2,n[e[3]="IR_VERSION_2017_11_3"]=3,n[e[4]="IR_VERSION_2019_1_22"]=4,n[e[5]="IR_VERSION_2019_3_18"]=5,n[e[6]="IR_VERSION_2019_9_19"]=6,n[e[7]="IR_VERSION_2020_5_8"]=7,n[e[8]="IR_VERSION_2021_7_30"]=8,n[e[9]="IR_VERSION"]=9,n}(),r.AttributeProto=function(){function e(n){if(this.floats=[],this.ints=[],this.strings=[],this.tensors=[],this.graphs=[],this.sparseTensors=[],this.typeProtos=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.name="",e.prototype.refAttrName="",e.prototype.docString="",e.prototype.type=0,e.prototype.f=0,e.prototype.i=E.Long?E.Long.fromBits(0,0,!1):0,e.prototype.s=E.newBuffer([]),e.prototype.t=null,e.prototype.g=null,e.prototype.sparseTensor=null,e.prototype.tp=null,e.prototype.floats=E.emptyArray,e.prototype.ints=E.emptyArray,e.prototype.strings=E.emptyArray,e.prototype.tensors=E.emptyArray,e.prototype.graphs=E.emptyArray,e.prototype.sparseTensors=E.emptyArray,e.prototype.typeProtos=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(10).string(t.name),t.f!=null&&Object.hasOwnProperty.call(t,"f")&&o.uint32(21).float(t.f),t.i!=null&&Object.hasOwnProperty.call(t,"i")&&o.uint32(24).int64(t.i),t.s!=null&&Object.hasOwnProperty.call(t,"s")&&o.uint32(34).bytes(t.s),t.t!=null&&Object.hasOwnProperty.call(t,"t")&&S.onnx.TensorProto.encode(t.t,o.uint32(42).fork()).ldelim(),t.g!=null&&Object.hasOwnProperty.call(t,"g")&&S.onnx.GraphProto.encode(t.g,o.uint32(50).fork()).ldelim(),t.floats!=null&&t.floats.length){o.uint32(58).fork();for(var i=0;i<t.floats.length;++i)o.float(t.floats[i]);o.ldelim()}if(t.ints!=null&&t.ints.length){o.uint32(66).fork();for(var i=0;i<t.ints.length;++i)o.int64(t.ints[i]);o.ldelim()}if(t.strings!=null&&t.strings.length)for(var i=0;i<t.strings.length;++i)o.uint32(74).bytes(t.strings[i]);if(t.tensors!=null&&t.tensors.length)for(var i=0;i<t.tensors.length;++i)S.onnx.TensorProto.encode(t.tensors[i],o.uint32(82).fork()).ldelim();if(t.graphs!=null&&t.graphs.length)for(var i=0;i<t.graphs.length;++i)S.onnx.GraphProto.encode(t.graphs[i],o.uint32(90).fork()).ldelim();if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(106).string(t.docString),t.tp!=null&&Object.hasOwnProperty.call(t,"tp")&&S.onnx.TypeProto.encode(t.tp,o.uint32(114).fork()).ldelim(),t.typeProtos!=null&&t.typeProtos.length)for(var i=0;i<t.typeProtos.length;++i)S.onnx.TypeProto.encode(t.typeProtos[i],o.uint32(122).fork()).ldelim();if(t.type!=null&&Object.hasOwnProperty.call(t,"type")&&o.uint32(160).int32(t.type),t.refAttrName!=null&&Object.hasOwnProperty.call(t,"refAttrName")&&o.uint32(170).string(t.refAttrName),t.sparseTensor!=null&&Object.hasOwnProperty.call(t,"sparseTensor")&&S.onnx.SparseTensorProto.encode(t.sparseTensor,o.uint32(178).fork()).ldelim(),t.sparseTensors!=null&&t.sparseTensors.length)for(var i=0;i<t.sparseTensors.length;++i)S.onnx.SparseTensorProto.encode(t.sparseTensors[i],o.uint32(186).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.AttributeProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.name=t.string();break}case 21:{a.refAttrName=t.string();break}case 13:{a.docString=t.string();break}case 20:{a.type=t.int32();break}case 2:{a.f=t.float();break}case 3:{a.i=t.int64();break}case 4:{a.s=t.bytes();break}case 5:{a.t=S.onnx.TensorProto.decode(t,t.uint32());break}case 6:{a.g=S.onnx.GraphProto.decode(t,t.uint32());break}case 22:{a.sparseTensor=S.onnx.SparseTensorProto.decode(t,t.uint32());break}case 14:{a.tp=S.onnx.TypeProto.decode(t,t.uint32());break}case 7:{if(a.floats&&a.floats.length||(a.floats=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.floats.push(t.float());else a.floats.push(t.float());break}case 8:{if(a.ints&&a.ints.length||(a.ints=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.ints.push(t.int64());else a.ints.push(t.int64());break}case 9:{a.strings&&a.strings.length||(a.strings=[]),a.strings.push(t.bytes());break}case 10:{a.tensors&&a.tensors.length||(a.tensors=[]),a.tensors.push(S.onnx.TensorProto.decode(t,t.uint32()));break}case 11:{a.graphs&&a.graphs.length||(a.graphs=[]),a.graphs.push(S.onnx.GraphProto.decode(t,t.uint32()));break}case 23:{a.sparseTensors&&a.sparseTensors.length||(a.sparseTensors=[]),a.sparseTensors.push(S.onnx.SparseTensorProto.decode(t,t.uint32()));break}case 15:{a.typeProtos&&a.typeProtos.length||(a.typeProtos=[]),a.typeProtos.push(S.onnx.TypeProto.decode(t,t.uint32()));break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.name!=null&&t.hasOwnProperty("name")&&!E.isString(t.name))return"name: string expected";if(t.refAttrName!=null&&t.hasOwnProperty("refAttrName")&&!E.isString(t.refAttrName))return"refAttrName: string expected";if(t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString))return"docString: string expected";if(t.type!=null&&t.hasOwnProperty("type"))switch(t.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 11:case 13:case 6:case 7:case 8:case 9:case 10:case 12:case 14:break}if(t.f!=null&&t.hasOwnProperty("f")&&typeof t.f!="number")return"f: number expected";if(t.i!=null&&t.hasOwnProperty("i")&&!E.isInteger(t.i)&&!(t.i&&E.isInteger(t.i.low)&&E.isInteger(t.i.high)))return"i: integer|Long expected";if(t.s!=null&&t.hasOwnProperty("s")&&!(t.s&&typeof t.s.length=="number"||E.isString(t.s)))return"s: buffer expected";if(t.t!=null&&t.hasOwnProperty("t")){var o=S.onnx.TensorProto.verify(t.t);if(o)return"t."+o}if(t.g!=null&&t.hasOwnProperty("g")){var o=S.onnx.GraphProto.verify(t.g);if(o)return"g."+o}if(t.sparseTensor!=null&&t.hasOwnProperty("sparseTensor")){var o=S.onnx.SparseTensorProto.verify(t.sparseTensor);if(o)return"sparseTensor."+o}if(t.tp!=null&&t.hasOwnProperty("tp")){var o=S.onnx.TypeProto.verify(t.tp);if(o)return"tp."+o}if(t.floats!=null&&t.hasOwnProperty("floats")){if(!Array.isArray(t.floats))return"floats: array expected";for(var i=0;i<t.floats.length;++i)if(typeof t.floats[i]!="number")return"floats: number[] expected"}if(t.ints!=null&&t.hasOwnProperty("ints")){if(!Array.isArray(t.ints))return"ints: array expected";for(var i=0;i<t.ints.length;++i)if(!E.isInteger(t.ints[i])&&!(t.ints[i]&&E.isInteger(t.ints[i].low)&&E.isInteger(t.ints[i].high)))return"ints: integer|Long[] expected"}if(t.strings!=null&&t.hasOwnProperty("strings")){if(!Array.isArray(t.strings))return"strings: array expected";for(var i=0;i<t.strings.length;++i)if(!(t.strings[i]&&typeof t.strings[i].length=="number"||E.isString(t.strings[i])))return"strings: buffer[] expected"}if(t.tensors!=null&&t.hasOwnProperty("tensors")){if(!Array.isArray(t.tensors))return"tensors: array expected";for(var i=0;i<t.tensors.length;++i){var o=S.onnx.TensorProto.verify(t.tensors[i]);if(o)return"tensors."+o}}if(t.graphs!=null&&t.hasOwnProperty("graphs")){if(!Array.isArray(t.graphs))return"graphs: array expected";for(var i=0;i<t.graphs.length;++i){var o=S.onnx.GraphProto.verify(t.graphs[i]);if(o)return"graphs."+o}}if(t.sparseTensors!=null&&t.hasOwnProperty("sparseTensors")){if(!Array.isArray(t.sparseTensors))return"sparseTensors: array expected";for(var i=0;i<t.sparseTensors.length;++i){var o=S.onnx.SparseTensorProto.verify(t.sparseTensors[i]);if(o)return"sparseTensors."+o}}if(t.typeProtos!=null&&t.hasOwnProperty("typeProtos")){if(!Array.isArray(t.typeProtos))return"typeProtos: array expected";for(var i=0;i<t.typeProtos.length;++i){var o=S.onnx.TypeProto.verify(t.typeProtos[i]);if(o)return"typeProtos."+o}}return null},e.fromObject=function(t){if(t instanceof S.onnx.AttributeProto)return t;var o=new S.onnx.AttributeProto;switch(t.name!=null&&(o.name=String(t.name)),t.refAttrName!=null&&(o.refAttrName=String(t.refAttrName)),t.docString!=null&&(o.docString=String(t.docString)),t.type){default:if(typeof t.type=="number"){o.type=t.type;break}break;case"UNDEFINED":case 0:o.type=0;break;case"FLOAT":case 1:o.type=1;break;case"INT":case 2:o.type=2;break;case"STRING":case 3:o.type=3;break;case"TENSOR":case 4:o.type=4;break;case"GRAPH":case 5:o.type=5;break;case"SPARSE_TENSOR":case 11:o.type=11;break;case"TYPE_PROTO":case 13:o.type=13;break;case"FLOATS":case 6:o.type=6;break;case"INTS":case 7:o.type=7;break;case"STRINGS":case 8:o.type=8;break;case"TENSORS":case 9:o.type=9;break;case"GRAPHS":case 10:o.type=10;break;case"SPARSE_TENSORS":case 12:o.type=12;break;case"TYPE_PROTOS":case 14:o.type=14;break}if(t.f!=null&&(o.f=Number(t.f)),t.i!=null&&(E.Long?(o.i=E.Long.fromValue(t.i)).unsigned=!1:typeof t.i=="string"?o.i=parseInt(t.i,10):typeof t.i=="number"?o.i=t.i:typeof t.i=="object"&&(o.i=new E.LongBits(t.i.low>>>0,t.i.high>>>0).toNumber())),t.s!=null&&(typeof t.s=="string"?E.base64.decode(t.s,o.s=E.newBuffer(E.base64.length(t.s)),0):t.s.length>=0&&(o.s=t.s)),t.t!=null){if(typeof t.t!="object")throw TypeError(".onnx.AttributeProto.t: object expected");o.t=S.onnx.TensorProto.fromObject(t.t)}if(t.g!=null){if(typeof t.g!="object")throw TypeError(".onnx.AttributeProto.g: object expected");o.g=S.onnx.GraphProto.fromObject(t.g)}if(t.sparseTensor!=null){if(typeof t.sparseTensor!="object")throw TypeError(".onnx.AttributeProto.sparseTensor: object expected");o.sparseTensor=S.onnx.SparseTensorProto.fromObject(t.sparseTensor)}if(t.tp!=null){if(typeof t.tp!="object")throw TypeError(".onnx.AttributeProto.tp: object expected");o.tp=S.onnx.TypeProto.fromObject(t.tp)}if(t.floats){if(!Array.isArray(t.floats))throw TypeError(".onnx.AttributeProto.floats: array expected");o.floats=[];for(var i=0;i<t.floats.length;++i)o.floats[i]=Number(t.floats[i])}if(t.ints){if(!Array.isArray(t.ints))throw TypeError(".onnx.AttributeProto.ints: array expected");o.ints=[];for(var i=0;i<t.ints.length;++i)E.Long?(o.ints[i]=E.Long.fromValue(t.ints[i])).unsigned=!1:typeof t.ints[i]=="string"?o.ints[i]=parseInt(t.ints[i],10):typeof t.ints[i]=="number"?o.ints[i]=t.ints[i]:typeof t.ints[i]=="object"&&(o.ints[i]=new E.LongBits(t.ints[i].low>>>0,t.ints[i].high>>>0).toNumber())}if(t.strings){if(!Array.isArray(t.strings))throw TypeError(".onnx.AttributeProto.strings: array expected");o.strings=[];for(var i=0;i<t.strings.length;++i)typeof t.strings[i]=="string"?E.base64.decode(t.strings[i],o.strings[i]=E.newBuffer(E.base64.length(t.strings[i])),0):t.strings[i].length>=0&&(o.strings[i]=t.strings[i])}if(t.tensors){if(!Array.isArray(t.tensors))throw TypeError(".onnx.AttributeProto.tensors: array expected");o.tensors=[];for(var i=0;i<t.tensors.length;++i){if(typeof t.tensors[i]!="object")throw TypeError(".onnx.AttributeProto.tensors: object expected");o.tensors[i]=S.onnx.TensorProto.fromObject(t.tensors[i])}}if(t.graphs){if(!Array.isArray(t.graphs))throw TypeError(".onnx.AttributeProto.graphs: array expected");o.graphs=[];for(var i=0;i<t.graphs.length;++i){if(typeof t.graphs[i]!="object")throw TypeError(".onnx.AttributeProto.graphs: object expected");o.graphs[i]=S.onnx.GraphProto.fromObject(t.graphs[i])}}if(t.sparseTensors){if(!Array.isArray(t.sparseTensors))throw TypeError(".onnx.AttributeProto.sparseTensors: array expected");o.sparseTensors=[];for(var i=0;i<t.sparseTensors.length;++i){if(typeof t.sparseTensors[i]!="object")throw TypeError(".onnx.AttributeProto.sparseTensors: object expected");o.sparseTensors[i]=S.onnx.SparseTensorProto.fromObject(t.sparseTensors[i])}}if(t.typeProtos){if(!Array.isArray(t.typeProtos))throw TypeError(".onnx.AttributeProto.typeProtos: array expected");o.typeProtos=[];for(var i=0;i<t.typeProtos.length;++i){if(typeof t.typeProtos[i]!="object")throw TypeError(".onnx.AttributeProto.typeProtos: object expected");o.typeProtos[i]=S.onnx.TypeProto.fromObject(t.typeProtos[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.floats=[],i.ints=[],i.strings=[],i.tensors=[],i.graphs=[],i.typeProtos=[],i.sparseTensors=[]),o.defaults){if(i.name="",i.f=0,E.Long){var a=new E.Long(0,0,!1);i.i=o.longs===String?a.toString():o.longs===Number?a.toNumber():a}else i.i=o.longs===String?"0":0;o.bytes===String?i.s="":(i.s=[],o.bytes!==Array&&(i.s=E.newBuffer(i.s))),i.t=null,i.g=null,i.docString="",i.tp=null,i.type=o.enums===String?"UNDEFINED":0,i.refAttrName="",i.sparseTensor=null}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.f!=null&&t.hasOwnProperty("f")&&(i.f=o.json&&!isFinite(t.f)?String(t.f):t.f),t.i!=null&&t.hasOwnProperty("i")&&(typeof t.i=="number"?i.i=o.longs===String?String(t.i):t.i:i.i=o.longs===String?E.Long.prototype.toString.call(t.i):o.longs===Number?new E.LongBits(t.i.low>>>0,t.i.high>>>0).toNumber():t.i),t.s!=null&&t.hasOwnProperty("s")&&(i.s=o.bytes===String?E.base64.encode(t.s,0,t.s.length):o.bytes===Array?Array.prototype.slice.call(t.s):t.s),t.t!=null&&t.hasOwnProperty("t")&&(i.t=S.onnx.TensorProto.toObject(t.t,o)),t.g!=null&&t.hasOwnProperty("g")&&(i.g=S.onnx.GraphProto.toObject(t.g,o)),t.floats&&t.floats.length){i.floats=[];for(var s=0;s<t.floats.length;++s)i.floats[s]=o.json&&!isFinite(t.floats[s])?String(t.floats[s]):t.floats[s]}if(t.ints&&t.ints.length){i.ints=[];for(var s=0;s<t.ints.length;++s)typeof t.ints[s]=="number"?i.ints[s]=o.longs===String?String(t.ints[s]):t.ints[s]:i.ints[s]=o.longs===String?E.Long.prototype.toString.call(t.ints[s]):o.longs===Number?new E.LongBits(t.ints[s].low>>>0,t.ints[s].high>>>0).toNumber():t.ints[s]}if(t.strings&&t.strings.length){i.strings=[];for(var s=0;s<t.strings.length;++s)i.strings[s]=o.bytes===String?E.base64.encode(t.strings[s],0,t.strings[s].length):o.bytes===Array?Array.prototype.slice.call(t.strings[s]):t.strings[s]}if(t.tensors&&t.tensors.length){i.tensors=[];for(var s=0;s<t.tensors.length;++s)i.tensors[s]=S.onnx.TensorProto.toObject(t.tensors[s],o)}if(t.graphs&&t.graphs.length){i.graphs=[];for(var s=0;s<t.graphs.length;++s)i.graphs[s]=S.onnx.GraphProto.toObject(t.graphs[s],o)}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.tp!=null&&t.hasOwnProperty("tp")&&(i.tp=S.onnx.TypeProto.toObject(t.tp,o)),t.typeProtos&&t.typeProtos.length){i.typeProtos=[];for(var s=0;s<t.typeProtos.length;++s)i.typeProtos[s]=S.onnx.TypeProto.toObject(t.typeProtos[s],o)}if(t.type!=null&&t.hasOwnProperty("type")&&(i.type=o.enums===String?S.onnx.AttributeProto.AttributeType[t.type]===void 0?t.type:S.onnx.AttributeProto.AttributeType[t.type]:t.type),t.refAttrName!=null&&t.hasOwnProperty("refAttrName")&&(i.refAttrName=t.refAttrName),t.sparseTensor!=null&&t.hasOwnProperty("sparseTensor")&&(i.sparseTensor=S.onnx.SparseTensorProto.toObject(t.sparseTensor,o)),t.sparseTensors&&t.sparseTensors.length){i.sparseTensors=[];for(var s=0;s<t.sparseTensors.length;++s)i.sparseTensors[s]=S.onnx.SparseTensorProto.toObject(t.sparseTensors[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.AttributeProto"},e.AttributeType=function(){var n={},t=Object.create(n);return t[n[0]="UNDEFINED"]=0,t[n[1]="FLOAT"]=1,t[n[2]="INT"]=2,t[n[3]="STRING"]=3,t[n[4]="TENSOR"]=4,t[n[5]="GRAPH"]=5,t[n[11]="SPARSE_TENSOR"]=11,t[n[13]="TYPE_PROTO"]=13,t[n[6]="FLOATS"]=6,t[n[7]="INTS"]=7,t[n[8]="STRINGS"]=8,t[n[9]="TENSORS"]=9,t[n[10]="GRAPHS"]=10,t[n[12]="SPARSE_TENSORS"]=12,t[n[14]="TYPE_PROTOS"]=14,t}(),e}(),r.ValueInfoProto=function(){function e(n){if(n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.name="",e.prototype.type=null,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(t,o){return o||(o=tt.create()),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(10).string(t.name),t.type!=null&&Object.hasOwnProperty.call(t,"type")&&S.onnx.TypeProto.encode(t.type,o.uint32(18).fork()).ldelim(),t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(26).string(t.docString),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.ValueInfoProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.name=t.string();break}case 2:{a.type=S.onnx.TypeProto.decode(t,t.uint32());break}case 3:{a.docString=t.string();break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.name!=null&&t.hasOwnProperty("name")&&!E.isString(t.name))return"name: string expected";if(t.type!=null&&t.hasOwnProperty("type")){var o=S.onnx.TypeProto.verify(t.type);if(o)return"type."+o}return t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString)?"docString: string expected":null},e.fromObject=function(t){if(t instanceof S.onnx.ValueInfoProto)return t;var o=new S.onnx.ValueInfoProto;if(t.name!=null&&(o.name=String(t.name)),t.type!=null){if(typeof t.type!="object")throw TypeError(".onnx.ValueInfoProto.type: object expected");o.type=S.onnx.TypeProto.fromObject(t.type)}return t.docString!=null&&(o.docString=String(t.docString)),o},e.toObject=function(t,o){o||(o={});var i={};return o.defaults&&(i.name="",i.type=null,i.docString=""),t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.type!=null&&t.hasOwnProperty("type")&&(i.type=S.onnx.TypeProto.toObject(t.type,o)),t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.ValueInfoProto"},e}(),r.NodeProto=function(){function e(n){if(this.input=[],this.output=[],this.attribute=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.input=E.emptyArray,e.prototype.output=E.emptyArray,e.prototype.name="",e.prototype.opType="",e.prototype.domain="",e.prototype.attribute=E.emptyArray,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.input!=null&&t.input.length)for(var i=0;i<t.input.length;++i)o.uint32(10).string(t.input[i]);if(t.output!=null&&t.output.length)for(var i=0;i<t.output.length;++i)o.uint32(18).string(t.output[i]);if(t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(26).string(t.name),t.opType!=null&&Object.hasOwnProperty.call(t,"opType")&&o.uint32(34).string(t.opType),t.attribute!=null&&t.attribute.length)for(var i=0;i<t.attribute.length;++i)S.onnx.AttributeProto.encode(t.attribute[i],o.uint32(42).fork()).ldelim();return t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(50).string(t.docString),t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(58).string(t.domain),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.NodeProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.input&&a.input.length||(a.input=[]),a.input.push(t.string());break}case 2:{a.output&&a.output.length||(a.output=[]),a.output.push(t.string());break}case 3:{a.name=t.string();break}case 4:{a.opType=t.string();break}case 7:{a.domain=t.string();break}case 5:{a.attribute&&a.attribute.length||(a.attribute=[]),a.attribute.push(S.onnx.AttributeProto.decode(t,t.uint32()));break}case 6:{a.docString=t.string();break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.input!=null&&t.hasOwnProperty("input")){if(!Array.isArray(t.input))return"input: array expected";for(var o=0;o<t.input.length;++o)if(!E.isString(t.input[o]))return"input: string[] expected"}if(t.output!=null&&t.hasOwnProperty("output")){if(!Array.isArray(t.output))return"output: array expected";for(var o=0;o<t.output.length;++o)if(!E.isString(t.output[o]))return"output: string[] expected"}if(t.name!=null&&t.hasOwnProperty("name")&&!E.isString(t.name))return"name: string expected";if(t.opType!=null&&t.hasOwnProperty("opType")&&!E.isString(t.opType))return"opType: string expected";if(t.domain!=null&&t.hasOwnProperty("domain")&&!E.isString(t.domain))return"domain: string expected";if(t.attribute!=null&&t.hasOwnProperty("attribute")){if(!Array.isArray(t.attribute))return"attribute: array expected";for(var o=0;o<t.attribute.length;++o){var i=S.onnx.AttributeProto.verify(t.attribute[o]);if(i)return"attribute."+i}}return t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString)?"docString: string expected":null},e.fromObject=function(t){if(t instanceof S.onnx.NodeProto)return t;var o=new S.onnx.NodeProto;if(t.input){if(!Array.isArray(t.input))throw TypeError(".onnx.NodeProto.input: array expected");o.input=[];for(var i=0;i<t.input.length;++i)o.input[i]=String(t.input[i])}if(t.output){if(!Array.isArray(t.output))throw TypeError(".onnx.NodeProto.output: array expected");o.output=[];for(var i=0;i<t.output.length;++i)o.output[i]=String(t.output[i])}if(t.name!=null&&(o.name=String(t.name)),t.opType!=null&&(o.opType=String(t.opType)),t.domain!=null&&(o.domain=String(t.domain)),t.attribute){if(!Array.isArray(t.attribute))throw TypeError(".onnx.NodeProto.attribute: array expected");o.attribute=[];for(var i=0;i<t.attribute.length;++i){if(typeof t.attribute[i]!="object")throw TypeError(".onnx.NodeProto.attribute: object expected");o.attribute[i]=S.onnx.AttributeProto.fromObject(t.attribute[i])}}return t.docString!=null&&(o.docString=String(t.docString)),o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.input=[],i.output=[],i.attribute=[]),o.defaults&&(i.name="",i.opType="",i.docString="",i.domain=""),t.input&&t.input.length){i.input=[];for(var a=0;a<t.input.length;++a)i.input[a]=t.input[a]}if(t.output&&t.output.length){i.output=[];for(var a=0;a<t.output.length;++a)i.output[a]=t.output[a]}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.opType!=null&&t.hasOwnProperty("opType")&&(i.opType=t.opType),t.attribute&&t.attribute.length){i.attribute=[];for(var a=0;a<t.attribute.length;++a)i.attribute[a]=S.onnx.AttributeProto.toObject(t.attribute[a],o)}return t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.NodeProto"},e}(),r.TrainingInfoProto=function(){function e(n){if(this.initializationBinding=[],this.updateBinding=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.initialization=null,e.prototype.algorithm=null,e.prototype.initializationBinding=E.emptyArray,e.prototype.updateBinding=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.initialization!=null&&Object.hasOwnProperty.call(t,"initialization")&&S.onnx.GraphProto.encode(t.initialization,o.uint32(10).fork()).ldelim(),t.algorithm!=null&&Object.hasOwnProperty.call(t,"algorithm")&&S.onnx.GraphProto.encode(t.algorithm,o.uint32(18).fork()).ldelim(),t.initializationBinding!=null&&t.initializationBinding.length)for(var i=0;i<t.initializationBinding.length;++i)S.onnx.StringStringEntryProto.encode(t.initializationBinding[i],o.uint32(26).fork()).ldelim();if(t.updateBinding!=null&&t.updateBinding.length)for(var i=0;i<t.updateBinding.length;++i)S.onnx.StringStringEntryProto.encode(t.updateBinding[i],o.uint32(34).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.TrainingInfoProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.initialization=S.onnx.GraphProto.decode(t,t.uint32());break}case 2:{a.algorithm=S.onnx.GraphProto.decode(t,t.uint32());break}case 3:{a.initializationBinding&&a.initializationBinding.length||(a.initializationBinding=[]),a.initializationBinding.push(S.onnx.StringStringEntryProto.decode(t,t.uint32()));break}case 4:{a.updateBinding&&a.updateBinding.length||(a.updateBinding=[]),a.updateBinding.push(S.onnx.StringStringEntryProto.decode(t,t.uint32()));break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.initialization!=null&&t.hasOwnProperty("initialization")){var o=S.onnx.GraphProto.verify(t.initialization);if(o)return"initialization."+o}if(t.algorithm!=null&&t.hasOwnProperty("algorithm")){var o=S.onnx.GraphProto.verify(t.algorithm);if(o)return"algorithm."+o}if(t.initializationBinding!=null&&t.hasOwnProperty("initializationBinding")){if(!Array.isArray(t.initializationBinding))return"initializationBinding: array expected";for(var i=0;i<t.initializationBinding.length;++i){var o=S.onnx.StringStringEntryProto.verify(t.initializationBinding[i]);if(o)return"initializationBinding."+o}}if(t.updateBinding!=null&&t.hasOwnProperty("updateBinding")){if(!Array.isArray(t.updateBinding))return"updateBinding: array expected";for(var i=0;i<t.updateBinding.length;++i){var o=S.onnx.StringStringEntryProto.verify(t.updateBinding[i]);if(o)return"updateBinding."+o}}return null},e.fromObject=function(t){if(t instanceof S.onnx.TrainingInfoProto)return t;var o=new S.onnx.TrainingInfoProto;if(t.initialization!=null){if(typeof t.initialization!="object")throw TypeError(".onnx.TrainingInfoProto.initialization: object expected");o.initialization=S.onnx.GraphProto.fromObject(t.initialization)}if(t.algorithm!=null){if(typeof t.algorithm!="object")throw TypeError(".onnx.TrainingInfoProto.algorithm: object expected");o.algorithm=S.onnx.GraphProto.fromObject(t.algorithm)}if(t.initializationBinding){if(!Array.isArray(t.initializationBinding))throw TypeError(".onnx.TrainingInfoProto.initializationBinding: array expected");o.initializationBinding=[];for(var i=0;i<t.initializationBinding.length;++i){if(typeof t.initializationBinding[i]!="object")throw TypeError(".onnx.TrainingInfoProto.initializationBinding: object expected");o.initializationBinding[i]=S.onnx.StringStringEntryProto.fromObject(t.initializationBinding[i])}}if(t.updateBinding){if(!Array.isArray(t.updateBinding))throw TypeError(".onnx.TrainingInfoProto.updateBinding: array expected");o.updateBinding=[];for(var i=0;i<t.updateBinding.length;++i){if(typeof t.updateBinding[i]!="object")throw TypeError(".onnx.TrainingInfoProto.updateBinding: object expected");o.updateBinding[i]=S.onnx.StringStringEntryProto.fromObject(t.updateBinding[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.initializationBinding=[],i.updateBinding=[]),o.defaults&&(i.initialization=null,i.algorithm=null),t.initialization!=null&&t.hasOwnProperty("initialization")&&(i.initialization=S.onnx.GraphProto.toObject(t.initialization,o)),t.algorithm!=null&&t.hasOwnProperty("algorithm")&&(i.algorithm=S.onnx.GraphProto.toObject(t.algorithm,o)),t.initializationBinding&&t.initializationBinding.length){i.initializationBinding=[];for(var a=0;a<t.initializationBinding.length;++a)i.initializationBinding[a]=S.onnx.StringStringEntryProto.toObject(t.initializationBinding[a],o)}if(t.updateBinding&&t.updateBinding.length){i.updateBinding=[];for(var a=0;a<t.updateBinding.length;++a)i.updateBinding[a]=S.onnx.StringStringEntryProto.toObject(t.updateBinding[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TrainingInfoProto"},e}(),r.ModelProto=function(){function e(n){if(this.opsetImport=[],this.metadataProps=[],this.trainingInfo=[],this.functions=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.irVersion=E.Long?E.Long.fromBits(0,0,!1):0,e.prototype.opsetImport=E.emptyArray,e.prototype.producerName="",e.prototype.producerVersion="",e.prototype.domain="",e.prototype.modelVersion=E.Long?E.Long.fromBits(0,0,!1):0,e.prototype.docString="",e.prototype.graph=null,e.prototype.metadataProps=E.emptyArray,e.prototype.trainingInfo=E.emptyArray,e.prototype.functions=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.irVersion!=null&&Object.hasOwnProperty.call(t,"irVersion")&&o.uint32(8).int64(t.irVersion),t.producerName!=null&&Object.hasOwnProperty.call(t,"producerName")&&o.uint32(18).string(t.producerName),t.producerVersion!=null&&Object.hasOwnProperty.call(t,"producerVersion")&&o.uint32(26).string(t.producerVersion),t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(34).string(t.domain),t.modelVersion!=null&&Object.hasOwnProperty.call(t,"modelVersion")&&o.uint32(40).int64(t.modelVersion),t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(50).string(t.docString),t.graph!=null&&Object.hasOwnProperty.call(t,"graph")&&S.onnx.GraphProto.encode(t.graph,o.uint32(58).fork()).ldelim(),t.opsetImport!=null&&t.opsetImport.length)for(var i=0;i<t.opsetImport.length;++i)S.onnx.OperatorSetIdProto.encode(t.opsetImport[i],o.uint32(66).fork()).ldelim();if(t.metadataProps!=null&&t.metadataProps.length)for(var i=0;i<t.metadataProps.length;++i)S.onnx.StringStringEntryProto.encode(t.metadataProps[i],o.uint32(114).fork()).ldelim();if(t.trainingInfo!=null&&t.trainingInfo.length)for(var i=0;i<t.trainingInfo.length;++i)S.onnx.TrainingInfoProto.encode(t.trainingInfo[i],o.uint32(162).fork()).ldelim();if(t.functions!=null&&t.functions.length)for(var i=0;i<t.functions.length;++i)S.onnx.FunctionProto.encode(t.functions[i],o.uint32(202).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.ModelProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.irVersion=t.int64();break}case 8:{a.opsetImport&&a.opsetImport.length||(a.opsetImport=[]),a.opsetImport.push(S.onnx.OperatorSetIdProto.decode(t,t.uint32()));break}case 2:{a.producerName=t.string();break}case 3:{a.producerVersion=t.string();break}case 4:{a.domain=t.string();break}case 5:{a.modelVersion=t.int64();break}case 6:{a.docString=t.string();break}case 7:{a.graph=S.onnx.GraphProto.decode(t,t.uint32());break}case 14:{a.metadataProps&&a.metadataProps.length||(a.metadataProps=[]),a.metadataProps.push(S.onnx.StringStringEntryProto.decode(t,t.uint32()));break}case 20:{a.trainingInfo&&a.trainingInfo.length||(a.trainingInfo=[]),a.trainingInfo.push(S.onnx.TrainingInfoProto.decode(t,t.uint32()));break}case 25:{a.functions&&a.functions.length||(a.functions=[]),a.functions.push(S.onnx.FunctionProto.decode(t,t.uint32()));break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.irVersion!=null&&t.hasOwnProperty("irVersion")&&!E.isInteger(t.irVersion)&&!(t.irVersion&&E.isInteger(t.irVersion.low)&&E.isInteger(t.irVersion.high)))return"irVersion: integer|Long expected";if(t.opsetImport!=null&&t.hasOwnProperty("opsetImport")){if(!Array.isArray(t.opsetImport))return"opsetImport: array expected";for(var o=0;o<t.opsetImport.length;++o){var i=S.onnx.OperatorSetIdProto.verify(t.opsetImport[o]);if(i)return"opsetImport."+i}}if(t.producerName!=null&&t.hasOwnProperty("producerName")&&!E.isString(t.producerName))return"producerName: string expected";if(t.producerVersion!=null&&t.hasOwnProperty("producerVersion")&&!E.isString(t.producerVersion))return"producerVersion: string expected";if(t.domain!=null&&t.hasOwnProperty("domain")&&!E.isString(t.domain))return"domain: string expected";if(t.modelVersion!=null&&t.hasOwnProperty("modelVersion")&&!E.isInteger(t.modelVersion)&&!(t.modelVersion&&E.isInteger(t.modelVersion.low)&&E.isInteger(t.modelVersion.high)))return"modelVersion: integer|Long expected";if(t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString))return"docString: string expected";if(t.graph!=null&&t.hasOwnProperty("graph")){var i=S.onnx.GraphProto.verify(t.graph);if(i)return"graph."+i}if(t.metadataProps!=null&&t.hasOwnProperty("metadataProps")){if(!Array.isArray(t.metadataProps))return"metadataProps: array expected";for(var o=0;o<t.metadataProps.length;++o){var i=S.onnx.StringStringEntryProto.verify(t.metadataProps[o]);if(i)return"metadataProps."+i}}if(t.trainingInfo!=null&&t.hasOwnProperty("trainingInfo")){if(!Array.isArray(t.trainingInfo))return"trainingInfo: array expected";for(var o=0;o<t.trainingInfo.length;++o){var i=S.onnx.TrainingInfoProto.verify(t.trainingInfo[o]);if(i)return"trainingInfo."+i}}if(t.functions!=null&&t.hasOwnProperty("functions")){if(!Array.isArray(t.functions))return"functions: array expected";for(var o=0;o<t.functions.length;++o){var i=S.onnx.FunctionProto.verify(t.functions[o]);if(i)return"functions."+i}}return null},e.fromObject=function(t){if(t instanceof S.onnx.ModelProto)return t;var o=new S.onnx.ModelProto;if(t.irVersion!=null&&(E.Long?(o.irVersion=E.Long.fromValue(t.irVersion)).unsigned=!1:typeof t.irVersion=="string"?o.irVersion=parseInt(t.irVersion,10):typeof t.irVersion=="number"?o.irVersion=t.irVersion:typeof t.irVersion=="object"&&(o.irVersion=new E.LongBits(t.irVersion.low>>>0,t.irVersion.high>>>0).toNumber())),t.opsetImport){if(!Array.isArray(t.opsetImport))throw TypeError(".onnx.ModelProto.opsetImport: array expected");o.opsetImport=[];for(var i=0;i<t.opsetImport.length;++i){if(typeof t.opsetImport[i]!="object")throw TypeError(".onnx.ModelProto.opsetImport: object expected");o.opsetImport[i]=S.onnx.OperatorSetIdProto.fromObject(t.opsetImport[i])}}if(t.producerName!=null&&(o.producerName=String(t.producerName)),t.producerVersion!=null&&(o.producerVersion=String(t.producerVersion)),t.domain!=null&&(o.domain=String(t.domain)),t.modelVersion!=null&&(E.Long?(o.modelVersion=E.Long.fromValue(t.modelVersion)).unsigned=!1:typeof t.modelVersion=="string"?o.modelVersion=parseInt(t.modelVersion,10):typeof t.modelVersion=="number"?o.modelVersion=t.modelVersion:typeof t.modelVersion=="object"&&(o.modelVersion=new E.LongBits(t.modelVersion.low>>>0,t.modelVersion.high>>>0).toNumber())),t.docString!=null&&(o.docString=String(t.docString)),t.graph!=null){if(typeof t.graph!="object")throw TypeError(".onnx.ModelProto.graph: object expected");o.graph=S.onnx.GraphProto.fromObject(t.graph)}if(t.metadataProps){if(!Array.isArray(t.metadataProps))throw TypeError(".onnx.ModelProto.metadataProps: array expected");o.metadataProps=[];for(var i=0;i<t.metadataProps.length;++i){if(typeof t.metadataProps[i]!="object")throw TypeError(".onnx.ModelProto.metadataProps: object expected");o.metadataProps[i]=S.onnx.StringStringEntryProto.fromObject(t.metadataProps[i])}}if(t.trainingInfo){if(!Array.isArray(t.trainingInfo))throw TypeError(".onnx.ModelProto.trainingInfo: array expected");o.trainingInfo=[];for(var i=0;i<t.trainingInfo.length;++i){if(typeof t.trainingInfo[i]!="object")throw TypeError(".onnx.ModelProto.trainingInfo: object expected");o.trainingInfo[i]=S.onnx.TrainingInfoProto.fromObject(t.trainingInfo[i])}}if(t.functions){if(!Array.isArray(t.functions))throw TypeError(".onnx.ModelProto.functions: array expected");o.functions=[];for(var i=0;i<t.functions.length;++i){if(typeof t.functions[i]!="object")throw TypeError(".onnx.ModelProto.functions: object expected");o.functions[i]=S.onnx.FunctionProto.fromObject(t.functions[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.opsetImport=[],i.metadataProps=[],i.trainingInfo=[],i.functions=[]),o.defaults){if(E.Long){var a=new E.Long(0,0,!1);i.irVersion=o.longs===String?a.toString():o.longs===Number?a.toNumber():a}else i.irVersion=o.longs===String?"0":0;if(i.producerName="",i.producerVersion="",i.domain="",E.Long){var a=new E.Long(0,0,!1);i.modelVersion=o.longs===String?a.toString():o.longs===Number?a.toNumber():a}else i.modelVersion=o.longs===String?"0":0;i.docString="",i.graph=null}if(t.irVersion!=null&&t.hasOwnProperty("irVersion")&&(typeof t.irVersion=="number"?i.irVersion=o.longs===String?String(t.irVersion):t.irVersion:i.irVersion=o.longs===String?E.Long.prototype.toString.call(t.irVersion):o.longs===Number?new E.LongBits(t.irVersion.low>>>0,t.irVersion.high>>>0).toNumber():t.irVersion),t.producerName!=null&&t.hasOwnProperty("producerName")&&(i.producerName=t.producerName),t.producerVersion!=null&&t.hasOwnProperty("producerVersion")&&(i.producerVersion=t.producerVersion),t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),t.modelVersion!=null&&t.hasOwnProperty("modelVersion")&&(typeof t.modelVersion=="number"?i.modelVersion=o.longs===String?String(t.modelVersion):t.modelVersion:i.modelVersion=o.longs===String?E.Long.prototype.toString.call(t.modelVersion):o.longs===Number?new E.LongBits(t.modelVersion.low>>>0,t.modelVersion.high>>>0).toNumber():t.modelVersion),t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.graph!=null&&t.hasOwnProperty("graph")&&(i.graph=S.onnx.GraphProto.toObject(t.graph,o)),t.opsetImport&&t.opsetImport.length){i.opsetImport=[];for(var s=0;s<t.opsetImport.length;++s)i.opsetImport[s]=S.onnx.OperatorSetIdProto.toObject(t.opsetImport[s],o)}if(t.metadataProps&&t.metadataProps.length){i.metadataProps=[];for(var s=0;s<t.metadataProps.length;++s)i.metadataProps[s]=S.onnx.StringStringEntryProto.toObject(t.metadataProps[s],o)}if(t.trainingInfo&&t.trainingInfo.length){i.trainingInfo=[];for(var s=0;s<t.trainingInfo.length;++s)i.trainingInfo[s]=S.onnx.TrainingInfoProto.toObject(t.trainingInfo[s],o)}if(t.functions&&t.functions.length){i.functions=[];for(var s=0;s<t.functions.length;++s)i.functions[s]=S.onnx.FunctionProto.toObject(t.functions[s],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.ModelProto"},e}(),r.StringStringEntryProto=function(){function e(n){if(n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.key="",e.prototype.value="",e.create=function(t){return new e(t)},e.encode=function(t,o){return o||(o=tt.create()),t.key!=null&&Object.hasOwnProperty.call(t,"key")&&o.uint32(10).string(t.key),t.value!=null&&Object.hasOwnProperty.call(t,"value")&&o.uint32(18).string(t.value),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.StringStringEntryProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.key=t.string();break}case 2:{a.value=t.string();break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){return typeof t!="object"||t===null?"object expected":t.key!=null&&t.hasOwnProperty("key")&&!E.isString(t.key)?"key: string expected":t.value!=null&&t.hasOwnProperty("value")&&!E.isString(t.value)?"value: string expected":null},e.fromObject=function(t){if(t instanceof S.onnx.StringStringEntryProto)return t;var o=new S.onnx.StringStringEntryProto;return t.key!=null&&(o.key=String(t.key)),t.value!=null&&(o.value=String(t.value)),o},e.toObject=function(t,o){o||(o={});var i={};return o.defaults&&(i.key="",i.value=""),t.key!=null&&t.hasOwnProperty("key")&&(i.key=t.key),t.value!=null&&t.hasOwnProperty("value")&&(i.value=t.value),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.StringStringEntryProto"},e}(),r.TensorAnnotation=function(){function e(n){if(this.quantParameterTensorNames=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.tensorName="",e.prototype.quantParameterTensorNames=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.tensorName!=null&&Object.hasOwnProperty.call(t,"tensorName")&&o.uint32(10).string(t.tensorName),t.quantParameterTensorNames!=null&&t.quantParameterTensorNames.length)for(var i=0;i<t.quantParameterTensorNames.length;++i)S.onnx.StringStringEntryProto.encode(t.quantParameterTensorNames[i],o.uint32(18).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.TensorAnnotation;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.tensorName=t.string();break}case 2:{a.quantParameterTensorNames&&a.quantParameterTensorNames.length||(a.quantParameterTensorNames=[]),a.quantParameterTensorNames.push(S.onnx.StringStringEntryProto.decode(t,t.uint32()));break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.tensorName!=null&&t.hasOwnProperty("tensorName")&&!E.isString(t.tensorName))return"tensorName: string expected";if(t.quantParameterTensorNames!=null&&t.hasOwnProperty("quantParameterTensorNames")){if(!Array.isArray(t.quantParameterTensorNames))return"quantParameterTensorNames: array expected";for(var o=0;o<t.quantParameterTensorNames.length;++o){var i=S.onnx.StringStringEntryProto.verify(t.quantParameterTensorNames[o]);if(i)return"quantParameterTensorNames."+i}}return null},e.fromObject=function(t){if(t instanceof S.onnx.TensorAnnotation)return t;var o=new S.onnx.TensorAnnotation;if(t.tensorName!=null&&(o.tensorName=String(t.tensorName)),t.quantParameterTensorNames){if(!Array.isArray(t.quantParameterTensorNames))throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");o.quantParameterTensorNames=[];for(var i=0;i<t.quantParameterTensorNames.length;++i){if(typeof t.quantParameterTensorNames[i]!="object")throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");o.quantParameterTensorNames[i]=S.onnx.StringStringEntryProto.fromObject(t.quantParameterTensorNames[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.quantParameterTensorNames=[]),o.defaults&&(i.tensorName=""),t.tensorName!=null&&t.hasOwnProperty("tensorName")&&(i.tensorName=t.tensorName),t.quantParameterTensorNames&&t.quantParameterTensorNames.length){i.quantParameterTensorNames=[];for(var a=0;a<t.quantParameterTensorNames.length;++a)i.quantParameterTensorNames[a]=S.onnx.StringStringEntryProto.toObject(t.quantParameterTensorNames[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TensorAnnotation"},e}(),r.GraphProto=function(){function e(n){if(this.node=[],this.initializer=[],this.sparseInitializer=[],this.input=[],this.output=[],this.valueInfo=[],this.quantizationAnnotation=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.node=E.emptyArray,e.prototype.name="",e.prototype.initializer=E.emptyArray,e.prototype.sparseInitializer=E.emptyArray,e.prototype.docString="",e.prototype.input=E.emptyArray,e.prototype.output=E.emptyArray,e.prototype.valueInfo=E.emptyArray,e.prototype.quantizationAnnotation=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.node!=null&&t.node.length)for(var i=0;i<t.node.length;++i)S.onnx.NodeProto.encode(t.node[i],o.uint32(10).fork()).ldelim();if(t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(18).string(t.name),t.initializer!=null&&t.initializer.length)for(var i=0;i<t.initializer.length;++i)S.onnx.TensorProto.encode(t.initializer[i],o.uint32(42).fork()).ldelim();if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(82).string(t.docString),t.input!=null&&t.input.length)for(var i=0;i<t.input.length;++i)S.onnx.ValueInfoProto.encode(t.input[i],o.uint32(90).fork()).ldelim();if(t.output!=null&&t.output.length)for(var i=0;i<t.output.length;++i)S.onnx.ValueInfoProto.encode(t.output[i],o.uint32(98).fork()).ldelim();if(t.valueInfo!=null&&t.valueInfo.length)for(var i=0;i<t.valueInfo.length;++i)S.onnx.ValueInfoProto.encode(t.valueInfo[i],o.uint32(106).fork()).ldelim();if(t.quantizationAnnotation!=null&&t.quantizationAnnotation.length)for(var i=0;i<t.quantizationAnnotation.length;++i)S.onnx.TensorAnnotation.encode(t.quantizationAnnotation[i],o.uint32(114).fork()).ldelim();if(t.sparseInitializer!=null&&t.sparseInitializer.length)for(var i=0;i<t.sparseInitializer.length;++i)S.onnx.SparseTensorProto.encode(t.sparseInitializer[i],o.uint32(122).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.GraphProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.node&&a.node.length||(a.node=[]),a.node.push(S.onnx.NodeProto.decode(t,t.uint32()));break}case 2:{a.name=t.string();break}case 5:{a.initializer&&a.initializer.length||(a.initializer=[]),a.initializer.push(S.onnx.TensorProto.decode(t,t.uint32()));break}case 15:{a.sparseInitializer&&a.sparseInitializer.length||(a.sparseInitializer=[]),a.sparseInitializer.push(S.onnx.SparseTensorProto.decode(t,t.uint32()));break}case 10:{a.docString=t.string();break}case 11:{a.input&&a.input.length||(a.input=[]),a.input.push(S.onnx.ValueInfoProto.decode(t,t.uint32()));break}case 12:{a.output&&a.output.length||(a.output=[]),a.output.push(S.onnx.ValueInfoProto.decode(t,t.uint32()));break}case 13:{a.valueInfo&&a.valueInfo.length||(a.valueInfo=[]),a.valueInfo.push(S.onnx.ValueInfoProto.decode(t,t.uint32()));break}case 14:{a.quantizationAnnotation&&a.quantizationAnnotation.length||(a.quantizationAnnotation=[]),a.quantizationAnnotation.push(S.onnx.TensorAnnotation.decode(t,t.uint32()));break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.node!=null&&t.hasOwnProperty("node")){if(!Array.isArray(t.node))return"node: array expected";for(var o=0;o<t.node.length;++o){var i=S.onnx.NodeProto.verify(t.node[o]);if(i)return"node."+i}}if(t.name!=null&&t.hasOwnProperty("name")&&!E.isString(t.name))return"name: string expected";if(t.initializer!=null&&t.hasOwnProperty("initializer")){if(!Array.isArray(t.initializer))return"initializer: array expected";for(var o=0;o<t.initializer.length;++o){var i=S.onnx.TensorProto.verify(t.initializer[o]);if(i)return"initializer."+i}}if(t.sparseInitializer!=null&&t.hasOwnProperty("sparseInitializer")){if(!Array.isArray(t.sparseInitializer))return"sparseInitializer: array expected";for(var o=0;o<t.sparseInitializer.length;++o){var i=S.onnx.SparseTensorProto.verify(t.sparseInitializer[o]);if(i)return"sparseInitializer."+i}}if(t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString))return"docString: string expected";if(t.input!=null&&t.hasOwnProperty("input")){if(!Array.isArray(t.input))return"input: array expected";for(var o=0;o<t.input.length;++o){var i=S.onnx.ValueInfoProto.verify(t.input[o]);if(i)return"input."+i}}if(t.output!=null&&t.hasOwnProperty("output")){if(!Array.isArray(t.output))return"output: array expected";for(var o=0;o<t.output.length;++o){var i=S.onnx.ValueInfoProto.verify(t.output[o]);if(i)return"output."+i}}if(t.valueInfo!=null&&t.hasOwnProperty("valueInfo")){if(!Array.isArray(t.valueInfo))return"valueInfo: array expected";for(var o=0;o<t.valueInfo.length;++o){var i=S.onnx.ValueInfoProto.verify(t.valueInfo[o]);if(i)return"valueInfo."+i}}if(t.quantizationAnnotation!=null&&t.hasOwnProperty("quantizationAnnotation")){if(!Array.isArray(t.quantizationAnnotation))return"quantizationAnnotation: array expected";for(var o=0;o<t.quantizationAnnotation.length;++o){var i=S.onnx.TensorAnnotation.verify(t.quantizationAnnotation[o]);if(i)return"quantizationAnnotation."+i}}return null},e.fromObject=function(t){if(t instanceof S.onnx.GraphProto)return t;var o=new S.onnx.GraphProto;if(t.node){if(!Array.isArray(t.node))throw TypeError(".onnx.GraphProto.node: array expected");o.node=[];for(var i=0;i<t.node.length;++i){if(typeof t.node[i]!="object")throw TypeError(".onnx.GraphProto.node: object expected");o.node[i]=S.onnx.NodeProto.fromObject(t.node[i])}}if(t.name!=null&&(o.name=String(t.name)),t.initializer){if(!Array.isArray(t.initializer))throw TypeError(".onnx.GraphProto.initializer: array expected");o.initializer=[];for(var i=0;i<t.initializer.length;++i){if(typeof t.initializer[i]!="object")throw TypeError(".onnx.GraphProto.initializer: object expected");o.initializer[i]=S.onnx.TensorProto.fromObject(t.initializer[i])}}if(t.sparseInitializer){if(!Array.isArray(t.sparseInitializer))throw TypeError(".onnx.GraphProto.sparseInitializer: array expected");o.sparseInitializer=[];for(var i=0;i<t.sparseInitializer.length;++i){if(typeof t.sparseInitializer[i]!="object")throw TypeError(".onnx.GraphProto.sparseInitializer: object expected");o.sparseInitializer[i]=S.onnx.SparseTensorProto.fromObject(t.sparseInitializer[i])}}if(t.docString!=null&&(o.docString=String(t.docString)),t.input){if(!Array.isArray(t.input))throw TypeError(".onnx.GraphProto.input: array expected");o.input=[];for(var i=0;i<t.input.length;++i){if(typeof t.input[i]!="object")throw TypeError(".onnx.GraphProto.input: object expected");o.input[i]=S.onnx.ValueInfoProto.fromObject(t.input[i])}}if(t.output){if(!Array.isArray(t.output))throw TypeError(".onnx.GraphProto.output: array expected");o.output=[];for(var i=0;i<t.output.length;++i){if(typeof t.output[i]!="object")throw TypeError(".onnx.GraphProto.output: object expected");o.output[i]=S.onnx.ValueInfoProto.fromObject(t.output[i])}}if(t.valueInfo){if(!Array.isArray(t.valueInfo))throw TypeError(".onnx.GraphProto.valueInfo: array expected");o.valueInfo=[];for(var i=0;i<t.valueInfo.length;++i){if(typeof t.valueInfo[i]!="object")throw TypeError(".onnx.GraphProto.valueInfo: object expected");o.valueInfo[i]=S.onnx.ValueInfoProto.fromObject(t.valueInfo[i])}}if(t.quantizationAnnotation){if(!Array.isArray(t.quantizationAnnotation))throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");o.quantizationAnnotation=[];for(var i=0;i<t.quantizationAnnotation.length;++i){if(typeof t.quantizationAnnotation[i]!="object")throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");o.quantizationAnnotation[i]=S.onnx.TensorAnnotation.fromObject(t.quantizationAnnotation[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.node=[],i.initializer=[],i.input=[],i.output=[],i.valueInfo=[],i.quantizationAnnotation=[],i.sparseInitializer=[]),o.defaults&&(i.name="",i.docString=""),t.node&&t.node.length){i.node=[];for(var a=0;a<t.node.length;++a)i.node[a]=S.onnx.NodeProto.toObject(t.node[a],o)}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.initializer&&t.initializer.length){i.initializer=[];for(var a=0;a<t.initializer.length;++a)i.initializer[a]=S.onnx.TensorProto.toObject(t.initializer[a],o)}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.input&&t.input.length){i.input=[];for(var a=0;a<t.input.length;++a)i.input[a]=S.onnx.ValueInfoProto.toObject(t.input[a],o)}if(t.output&&t.output.length){i.output=[];for(var a=0;a<t.output.length;++a)i.output[a]=S.onnx.ValueInfoProto.toObject(t.output[a],o)}if(t.valueInfo&&t.valueInfo.length){i.valueInfo=[];for(var a=0;a<t.valueInfo.length;++a)i.valueInfo[a]=S.onnx.ValueInfoProto.toObject(t.valueInfo[a],o)}if(t.quantizationAnnotation&&t.quantizationAnnotation.length){i.quantizationAnnotation=[];for(var a=0;a<t.quantizationAnnotation.length;++a)i.quantizationAnnotation[a]=S.onnx.TensorAnnotation.toObject(t.quantizationAnnotation[a],o)}if(t.sparseInitializer&&t.sparseInitializer.length){i.sparseInitializer=[];for(var a=0;a<t.sparseInitializer.length;++a)i.sparseInitializer[a]=S.onnx.SparseTensorProto.toObject(t.sparseInitializer[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.GraphProto"},e}(),r.TensorProto=function(){function e(n){if(this.dims=[],this.floatData=[],this.int32Data=[],this.stringData=[],this.int64Data=[],this.externalData=[],this.doubleData=[],this.uint64Data=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.dims=E.emptyArray,e.prototype.dataType=0,e.prototype.segment=null,e.prototype.floatData=E.emptyArray,e.prototype.int32Data=E.emptyArray,e.prototype.stringData=E.emptyArray,e.prototype.int64Data=E.emptyArray,e.prototype.name="",e.prototype.docString="",e.prototype.rawData=E.newBuffer([]),e.prototype.externalData=E.emptyArray,e.prototype.dataLocation=0,e.prototype.doubleData=E.emptyArray,e.prototype.uint64Data=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.dims!=null&&t.dims.length){o.uint32(10).fork();for(var i=0;i<t.dims.length;++i)o.int64(t.dims[i]);o.ldelim()}if(t.dataType!=null&&Object.hasOwnProperty.call(t,"dataType")&&o.uint32(16).int32(t.dataType),t.segment!=null&&Object.hasOwnProperty.call(t,"segment")&&S.onnx.TensorProto.Segment.encode(t.segment,o.uint32(26).fork()).ldelim(),t.floatData!=null&&t.floatData.length){o.uint32(34).fork();for(var i=0;i<t.floatData.length;++i)o.float(t.floatData[i]);o.ldelim()}if(t.int32Data!=null&&t.int32Data.length){o.uint32(42).fork();for(var i=0;i<t.int32Data.length;++i)o.int32(t.int32Data[i]);o.ldelim()}if(t.stringData!=null&&t.stringData.length)for(var i=0;i<t.stringData.length;++i)o.uint32(50).bytes(t.stringData[i]);if(t.int64Data!=null&&t.int64Data.length){o.uint32(58).fork();for(var i=0;i<t.int64Data.length;++i)o.int64(t.int64Data[i]);o.ldelim()}if(t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(66).string(t.name),t.rawData!=null&&Object.hasOwnProperty.call(t,"rawData")&&o.uint32(74).bytes(t.rawData),t.doubleData!=null&&t.doubleData.length){o.uint32(82).fork();for(var i=0;i<t.doubleData.length;++i)o.double(t.doubleData[i]);o.ldelim()}if(t.uint64Data!=null&&t.uint64Data.length){o.uint32(90).fork();for(var i=0;i<t.uint64Data.length;++i)o.uint64(t.uint64Data[i]);o.ldelim()}if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(98).string(t.docString),t.externalData!=null&&t.externalData.length)for(var i=0;i<t.externalData.length;++i)S.onnx.StringStringEntryProto.encode(t.externalData[i],o.uint32(106).fork()).ldelim();return t.dataLocation!=null&&Object.hasOwnProperty.call(t,"dataLocation")&&o.uint32(112).int32(t.dataLocation),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.TensorProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{if(a.dims&&a.dims.length||(a.dims=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.dims.push(t.int64());else a.dims.push(t.int64());break}case 2:{a.dataType=t.int32();break}case 3:{a.segment=S.onnx.TensorProto.Segment.decode(t,t.uint32());break}case 4:{if(a.floatData&&a.floatData.length||(a.floatData=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.floatData.push(t.float());else a.floatData.push(t.float());break}case 5:{if(a.int32Data&&a.int32Data.length||(a.int32Data=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.int32Data.push(t.int32());else a.int32Data.push(t.int32());break}case 6:{a.stringData&&a.stringData.length||(a.stringData=[]),a.stringData.push(t.bytes());break}case 7:{if(a.int64Data&&a.int64Data.length||(a.int64Data=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.int64Data.push(t.int64());else a.int64Data.push(t.int64());break}case 8:{a.name=t.string();break}case 12:{a.docString=t.string();break}case 9:{a.rawData=t.bytes();break}case 13:{a.externalData&&a.externalData.length||(a.externalData=[]),a.externalData.push(S.onnx.StringStringEntryProto.decode(t,t.uint32()));break}case 14:{a.dataLocation=t.int32();break}case 10:{if(a.doubleData&&a.doubleData.length||(a.doubleData=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.doubleData.push(t.double());else a.doubleData.push(t.double());break}case 11:{if(a.uint64Data&&a.uint64Data.length||(a.uint64Data=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.uint64Data.push(t.uint64());else a.uint64Data.push(t.uint64());break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.dims!=null&&t.hasOwnProperty("dims")){if(!Array.isArray(t.dims))return"dims: array expected";for(var o=0;o<t.dims.length;++o)if(!E.isInteger(t.dims[o])&&!(t.dims[o]&&E.isInteger(t.dims[o].low)&&E.isInteger(t.dims[o].high)))return"dims: integer|Long[] expected"}if(t.dataType!=null&&t.hasOwnProperty("dataType")&&!E.isInteger(t.dataType))return"dataType: integer expected";if(t.segment!=null&&t.hasOwnProperty("segment")){var i=S.onnx.TensorProto.Segment.verify(t.segment);if(i)return"segment."+i}if(t.floatData!=null&&t.hasOwnProperty("floatData")){if(!Array.isArray(t.floatData))return"floatData: array expected";for(var o=0;o<t.floatData.length;++o)if(typeof t.floatData[o]!="number")return"floatData: number[] expected"}if(t.int32Data!=null&&t.hasOwnProperty("int32Data")){if(!Array.isArray(t.int32Data))return"int32Data: array expected";for(var o=0;o<t.int32Data.length;++o)if(!E.isInteger(t.int32Data[o]))return"int32Data: integer[] expected"}if(t.stringData!=null&&t.hasOwnProperty("stringData")){if(!Array.isArray(t.stringData))return"stringData: array expected";for(var o=0;o<t.stringData.length;++o)if(!(t.stringData[o]&&typeof t.stringData[o].length=="number"||E.isString(t.stringData[o])))return"stringData: buffer[] expected"}if(t.int64Data!=null&&t.hasOwnProperty("int64Data")){if(!Array.isArray(t.int64Data))return"int64Data: array expected";for(var o=0;o<t.int64Data.length;++o)if(!E.isInteger(t.int64Data[o])&&!(t.int64Data[o]&&E.isInteger(t.int64Data[o].low)&&E.isInteger(t.int64Data[o].high)))return"int64Data: integer|Long[] expected"}if(t.name!=null&&t.hasOwnProperty("name")&&!E.isString(t.name))return"name: string expected";if(t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString))return"docString: string expected";if(t.rawData!=null&&t.hasOwnProperty("rawData")&&!(t.rawData&&typeof t.rawData.length=="number"||E.isString(t.rawData)))return"rawData: buffer expected";if(t.externalData!=null&&t.hasOwnProperty("externalData")){if(!Array.isArray(t.externalData))return"externalData: array expected";for(var o=0;o<t.externalData.length;++o){var i=S.onnx.StringStringEntryProto.verify(t.externalData[o]);if(i)return"externalData."+i}}if(t.dataLocation!=null&&t.hasOwnProperty("dataLocation"))switch(t.dataLocation){default:return"dataLocation: enum value expected";case 0:case 1:break}if(t.doubleData!=null&&t.hasOwnProperty("doubleData")){if(!Array.isArray(t.doubleData))return"doubleData: array expected";for(var o=0;o<t.doubleData.length;++o)if(typeof t.doubleData[o]!="number")return"doubleData: number[] expected"}if(t.uint64Data!=null&&t.hasOwnProperty("uint64Data")){if(!Array.isArray(t.uint64Data))return"uint64Data: array expected";for(var o=0;o<t.uint64Data.length;++o)if(!E.isInteger(t.uint64Data[o])&&!(t.uint64Data[o]&&E.isInteger(t.uint64Data[o].low)&&E.isInteger(t.uint64Data[o].high)))return"uint64Data: integer|Long[] expected"}return null},e.fromObject=function(t){if(t instanceof S.onnx.TensorProto)return t;var o=new S.onnx.TensorProto;if(t.dims){if(!Array.isArray(t.dims))throw TypeError(".onnx.TensorProto.dims: array expected");o.dims=[];for(var i=0;i<t.dims.length;++i)E.Long?(o.dims[i]=E.Long.fromValue(t.dims[i])).unsigned=!1:typeof t.dims[i]=="string"?o.dims[i]=parseInt(t.dims[i],10):typeof t.dims[i]=="number"?o.dims[i]=t.dims[i]:typeof t.dims[i]=="object"&&(o.dims[i]=new E.LongBits(t.dims[i].low>>>0,t.dims[i].high>>>0).toNumber())}if(t.dataType!=null&&(o.dataType=t.dataType|0),t.segment!=null){if(typeof t.segment!="object")throw TypeError(".onnx.TensorProto.segment: object expected");o.segment=S.onnx.TensorProto.Segment.fromObject(t.segment)}if(t.floatData){if(!Array.isArray(t.floatData))throw TypeError(".onnx.TensorProto.floatData: array expected");o.floatData=[];for(var i=0;i<t.floatData.length;++i)o.floatData[i]=Number(t.floatData[i])}if(t.int32Data){if(!Array.isArray(t.int32Data))throw TypeError(".onnx.TensorProto.int32Data: array expected");o.int32Data=[];for(var i=0;i<t.int32Data.length;++i)o.int32Data[i]=t.int32Data[i]|0}if(t.stringData){if(!Array.isArray(t.stringData))throw TypeError(".onnx.TensorProto.stringData: array expected");o.stringData=[];for(var i=0;i<t.stringData.length;++i)typeof t.stringData[i]=="string"?E.base64.decode(t.stringData[i],o.stringData[i]=E.newBuffer(E.base64.length(t.stringData[i])),0):t.stringData[i].length>=0&&(o.stringData[i]=t.stringData[i])}if(t.int64Data){if(!Array.isArray(t.int64Data))throw TypeError(".onnx.TensorProto.int64Data: array expected");o.int64Data=[];for(var i=0;i<t.int64Data.length;++i)E.Long?(o.int64Data[i]=E.Long.fromValue(t.int64Data[i])).unsigned=!1:typeof t.int64Data[i]=="string"?o.int64Data[i]=parseInt(t.int64Data[i],10):typeof t.int64Data[i]=="number"?o.int64Data[i]=t.int64Data[i]:typeof t.int64Data[i]=="object"&&(o.int64Data[i]=new E.LongBits(t.int64Data[i].low>>>0,t.int64Data[i].high>>>0).toNumber())}if(t.name!=null&&(o.name=String(t.name)),t.docString!=null&&(o.docString=String(t.docString)),t.rawData!=null&&(typeof t.rawData=="string"?E.base64.decode(t.rawData,o.rawData=E.newBuffer(E.base64.length(t.rawData)),0):t.rawData.length>=0&&(o.rawData=t.rawData)),t.externalData){if(!Array.isArray(t.externalData))throw TypeError(".onnx.TensorProto.externalData: array expected");o.externalData=[];for(var i=0;i<t.externalData.length;++i){if(typeof t.externalData[i]!="object")throw TypeError(".onnx.TensorProto.externalData: object expected");o.externalData[i]=S.onnx.StringStringEntryProto.fromObject(t.externalData[i])}}switch(t.dataLocation){default:if(typeof t.dataLocation=="number"){o.dataLocation=t.dataLocation;break}break;case"DEFAULT":case 0:o.dataLocation=0;break;case"EXTERNAL":case 1:o.dataLocation=1;break}if(t.doubleData){if(!Array.isArray(t.doubleData))throw TypeError(".onnx.TensorProto.doubleData: array expected");o.doubleData=[];for(var i=0;i<t.doubleData.length;++i)o.doubleData[i]=Number(t.doubleData[i])}if(t.uint64Data){if(!Array.isArray(t.uint64Data))throw TypeError(".onnx.TensorProto.uint64Data: array expected");o.uint64Data=[];for(var i=0;i<t.uint64Data.length;++i)E.Long?(o.uint64Data[i]=E.Long.fromValue(t.uint64Data[i])).unsigned=!0:typeof t.uint64Data[i]=="string"?o.uint64Data[i]=parseInt(t.uint64Data[i],10):typeof t.uint64Data[i]=="number"?o.uint64Data[i]=t.uint64Data[i]:typeof t.uint64Data[i]=="object"&&(o.uint64Data[i]=new E.LongBits(t.uint64Data[i].low>>>0,t.uint64Data[i].high>>>0).toNumber(!0))}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.dims=[],i.floatData=[],i.int32Data=[],i.stringData=[],i.int64Data=[],i.doubleData=[],i.uint64Data=[],i.externalData=[]),o.defaults&&(i.dataType=0,i.segment=null,i.name="",o.bytes===String?i.rawData="":(i.rawData=[],o.bytes!==Array&&(i.rawData=E.newBuffer(i.rawData))),i.docString="",i.dataLocation=o.enums===String?"DEFAULT":0),t.dims&&t.dims.length){i.dims=[];for(var a=0;a<t.dims.length;++a)typeof t.dims[a]=="number"?i.dims[a]=o.longs===String?String(t.dims[a]):t.dims[a]:i.dims[a]=o.longs===String?E.Long.prototype.toString.call(t.dims[a]):o.longs===Number?new E.LongBits(t.dims[a].low>>>0,t.dims[a].high>>>0).toNumber():t.dims[a]}if(t.dataType!=null&&t.hasOwnProperty("dataType")&&(i.dataType=t.dataType),t.segment!=null&&t.hasOwnProperty("segment")&&(i.segment=S.onnx.TensorProto.Segment.toObject(t.segment,o)),t.floatData&&t.floatData.length){i.floatData=[];for(var a=0;a<t.floatData.length;++a)i.floatData[a]=o.json&&!isFinite(t.floatData[a])?String(t.floatData[a]):t.floatData[a]}if(t.int32Data&&t.int32Data.length){i.int32Data=[];for(var a=0;a<t.int32Data.length;++a)i.int32Data[a]=t.int32Data[a]}if(t.stringData&&t.stringData.length){i.stringData=[];for(var a=0;a<t.stringData.length;++a)i.stringData[a]=o.bytes===String?E.base64.encode(t.stringData[a],0,t.stringData[a].length):o.bytes===Array?Array.prototype.slice.call(t.stringData[a]):t.stringData[a]}if(t.int64Data&&t.int64Data.length){i.int64Data=[];for(var a=0;a<t.int64Data.length;++a)typeof t.int64Data[a]=="number"?i.int64Data[a]=o.longs===String?String(t.int64Data[a]):t.int64Data[a]:i.int64Data[a]=o.longs===String?E.Long.prototype.toString.call(t.int64Data[a]):o.longs===Number?new E.LongBits(t.int64Data[a].low>>>0,t.int64Data[a].high>>>0).toNumber():t.int64Data[a]}if(t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.rawData!=null&&t.hasOwnProperty("rawData")&&(i.rawData=o.bytes===String?E.base64.encode(t.rawData,0,t.rawData.length):o.bytes===Array?Array.prototype.slice.call(t.rawData):t.rawData),t.doubleData&&t.doubleData.length){i.doubleData=[];for(var a=0;a<t.doubleData.length;++a)i.doubleData[a]=o.json&&!isFinite(t.doubleData[a])?String(t.doubleData[a]):t.doubleData[a]}if(t.uint64Data&&t.uint64Data.length){i.uint64Data=[];for(var a=0;a<t.uint64Data.length;++a)typeof t.uint64Data[a]=="number"?i.uint64Data[a]=o.longs===String?String(t.uint64Data[a]):t.uint64Data[a]:i.uint64Data[a]=o.longs===String?E.Long.prototype.toString.call(t.uint64Data[a]):o.longs===Number?new E.LongBits(t.uint64Data[a].low>>>0,t.uint64Data[a].high>>>0).toNumber(!0):t.uint64Data[a]}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.externalData&&t.externalData.length){i.externalData=[];for(var a=0;a<t.externalData.length;++a)i.externalData[a]=S.onnx.StringStringEntryProto.toObject(t.externalData[a],o)}return t.dataLocation!=null&&t.hasOwnProperty("dataLocation")&&(i.dataLocation=o.enums===String?S.onnx.TensorProto.DataLocation[t.dataLocation]===void 0?t.dataLocation:S.onnx.TensorProto.DataLocation[t.dataLocation]:t.dataLocation),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TensorProto"},e.DataType=function(){var n={},t=Object.create(n);return t[n[0]="UNDEFINED"]=0,t[n[1]="FLOAT"]=1,t[n[2]="UINT8"]=2,t[n[3]="INT8"]=3,t[n[4]="UINT16"]=4,t[n[5]="INT16"]=5,t[n[6]="INT32"]=6,t[n[7]="INT64"]=7,t[n[8]="STRING"]=8,t[n[9]="BOOL"]=9,t[n[10]="FLOAT16"]=10,t[n[11]="DOUBLE"]=11,t[n[12]="UINT32"]=12,t[n[13]="UINT64"]=13,t[n[14]="COMPLEX64"]=14,t[n[15]="COMPLEX128"]=15,t[n[16]="BFLOAT16"]=16,t[n[17]="FLOAT8E4M3FN"]=17,t[n[18]="FLOAT8E4M3FNUZ"]=18,t[n[19]="FLOAT8E5M2"]=19,t[n[20]="FLOAT8E5M2FNUZ"]=20,t}(),e.Segment=function(){function n(t){if(t)for(var o=Object.keys(t),i=0;i<o.length;++i)t[o[i]]!=null&&(this[o[i]]=t[o[i]])}return n.prototype.begin=E.Long?E.Long.fromBits(0,0,!1):0,n.prototype.end=E.Long?E.Long.fromBits(0,0,!1):0,n.create=function(o){return new n(o)},n.encode=function(o,i){return i||(i=tt.create()),o.begin!=null&&Object.hasOwnProperty.call(o,"begin")&&i.uint32(8).int64(o.begin),o.end!=null&&Object.hasOwnProperty.call(o,"end")&&i.uint32(16).int64(o.end),i},n.encodeDelimited=function(o,i){return this.encode(o,i).ldelim()},n.decode=function(o,i){o instanceof K||(o=K.create(o));for(var a=i===void 0?o.len:o.pos+i,s=new S.onnx.TensorProto.Segment;o.pos<a;){var u=o.uint32();switch(u>>>3){case 1:{s.begin=o.int64();break}case 2:{s.end=o.int64();break}default:o.skipType(u&7);break}}return s},n.decodeDelimited=function(o){return o instanceof K||(o=new K(o)),this.decode(o,o.uint32())},n.verify=function(o){return typeof o!="object"||o===null?"object expected":o.begin!=null&&o.hasOwnProperty("begin")&&!E.isInteger(o.begin)&&!(o.begin&&E.isInteger(o.begin.low)&&E.isInteger(o.begin.high))?"begin: integer|Long expected":o.end!=null&&o.hasOwnProperty("end")&&!E.isInteger(o.end)&&!(o.end&&E.isInteger(o.end.low)&&E.isInteger(o.end.high))?"end: integer|Long expected":null},n.fromObject=function(o){if(o instanceof S.onnx.TensorProto.Segment)return o;var i=new S.onnx.TensorProto.Segment;return o.begin!=null&&(E.Long?(i.begin=E.Long.fromValue(o.begin)).unsigned=!1:typeof o.begin=="string"?i.begin=parseInt(o.begin,10):typeof o.begin=="number"?i.begin=o.begin:typeof o.begin=="object"&&(i.begin=new E.LongBits(o.begin.low>>>0,o.begin.high>>>0).toNumber())),o.end!=null&&(E.Long?(i.end=E.Long.fromValue(o.end)).unsigned=!1:typeof o.end=="string"?i.end=parseInt(o.end,10):typeof o.end=="number"?i.end=o.end:typeof o.end=="object"&&(i.end=new E.LongBits(o.end.low>>>0,o.end.high>>>0).toNumber())),i},n.toObject=function(o,i){i||(i={});var a={};if(i.defaults){if(E.Long){var s=new E.Long(0,0,!1);a.begin=i.longs===String?s.toString():i.longs===Number?s.toNumber():s}else a.begin=i.longs===String?"0":0;if(E.Long){var s=new E.Long(0,0,!1);a.end=i.longs===String?s.toString():i.longs===Number?s.toNumber():s}else a.end=i.longs===String?"0":0}return o.begin!=null&&o.hasOwnProperty("begin")&&(typeof o.begin=="number"?a.begin=i.longs===String?String(o.begin):o.begin:a.begin=i.longs===String?E.Long.prototype.toString.call(o.begin):i.longs===Number?new E.LongBits(o.begin.low>>>0,o.begin.high>>>0).toNumber():o.begin),o.end!=null&&o.hasOwnProperty("end")&&(typeof o.end=="number"?a.end=i.longs===String?String(o.end):o.end:a.end=i.longs===String?E.Long.prototype.toString.call(o.end):i.longs===Number?new E.LongBits(o.end.low>>>0,o.end.high>>>0).toNumber():o.end),a},n.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},n.getTypeUrl=function(o){return o===void 0&&(o="type.googleapis.com"),o+"/onnx.TensorProto.Segment"},n}(),e.DataLocation=function(){var n={},t=Object.create(n);return t[n[0]="DEFAULT"]=0,t[n[1]="EXTERNAL"]=1,t}(),e}(),r.SparseTensorProto=function(){function e(n){if(this.dims=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.values=null,e.prototype.indices=null,e.prototype.dims=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.values!=null&&Object.hasOwnProperty.call(t,"values")&&S.onnx.TensorProto.encode(t.values,o.uint32(10).fork()).ldelim(),t.indices!=null&&Object.hasOwnProperty.call(t,"indices")&&S.onnx.TensorProto.encode(t.indices,o.uint32(18).fork()).ldelim(),t.dims!=null&&t.dims.length){o.uint32(26).fork();for(var i=0;i<t.dims.length;++i)o.int64(t.dims[i]);o.ldelim()}return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.SparseTensorProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.values=S.onnx.TensorProto.decode(t,t.uint32());break}case 2:{a.indices=S.onnx.TensorProto.decode(t,t.uint32());break}case 3:{if(a.dims&&a.dims.length||(a.dims=[]),(s&7)===2)for(var u=t.uint32()+t.pos;t.pos<u;)a.dims.push(t.int64());else a.dims.push(t.int64());break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.values!=null&&t.hasOwnProperty("values")){var o=S.onnx.TensorProto.verify(t.values);if(o)return"values."+o}if(t.indices!=null&&t.hasOwnProperty("indices")){var o=S.onnx.TensorProto.verify(t.indices);if(o)return"indices."+o}if(t.dims!=null&&t.hasOwnProperty("dims")){if(!Array.isArray(t.dims))return"dims: array expected";for(var i=0;i<t.dims.length;++i)if(!E.isInteger(t.dims[i])&&!(t.dims[i]&&E.isInteger(t.dims[i].low)&&E.isInteger(t.dims[i].high)))return"dims: integer|Long[] expected"}return null},e.fromObject=function(t){if(t instanceof S.onnx.SparseTensorProto)return t;var o=new S.onnx.SparseTensorProto;if(t.values!=null){if(typeof t.values!="object")throw TypeError(".onnx.SparseTensorProto.values: object expected");o.values=S.onnx.TensorProto.fromObject(t.values)}if(t.indices!=null){if(typeof t.indices!="object")throw TypeError(".onnx.SparseTensorProto.indices: object expected");o.indices=S.onnx.TensorProto.fromObject(t.indices)}if(t.dims){if(!Array.isArray(t.dims))throw TypeError(".onnx.SparseTensorProto.dims: array expected");o.dims=[];for(var i=0;i<t.dims.length;++i)E.Long?(o.dims[i]=E.Long.fromValue(t.dims[i])).unsigned=!1:typeof t.dims[i]=="string"?o.dims[i]=parseInt(t.dims[i],10):typeof t.dims[i]=="number"?o.dims[i]=t.dims[i]:typeof t.dims[i]=="object"&&(o.dims[i]=new E.LongBits(t.dims[i].low>>>0,t.dims[i].high>>>0).toNumber())}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.dims=[]),o.defaults&&(i.values=null,i.indices=null),t.values!=null&&t.hasOwnProperty("values")&&(i.values=S.onnx.TensorProto.toObject(t.values,o)),t.indices!=null&&t.hasOwnProperty("indices")&&(i.indices=S.onnx.TensorProto.toObject(t.indices,o)),t.dims&&t.dims.length){i.dims=[];for(var a=0;a<t.dims.length;++a)typeof t.dims[a]=="number"?i.dims[a]=o.longs===String?String(t.dims[a]):t.dims[a]:i.dims[a]=o.longs===String?E.Long.prototype.toString.call(t.dims[a]):o.longs===Number?new E.LongBits(t.dims[a].low>>>0,t.dims[a].high>>>0).toNumber():t.dims[a]}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.SparseTensorProto"},e}(),r.TensorShapeProto=function(){function e(n){if(this.dim=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.dim=E.emptyArray,e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.dim!=null&&t.dim.length)for(var i=0;i<t.dim.length;++i)S.onnx.TensorShapeProto.Dimension.encode(t.dim[i],o.uint32(10).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.TensorShapeProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.dim&&a.dim.length||(a.dim=[]),a.dim.push(S.onnx.TensorShapeProto.Dimension.decode(t,t.uint32()));break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.dim!=null&&t.hasOwnProperty("dim")){if(!Array.isArray(t.dim))return"dim: array expected";for(var o=0;o<t.dim.length;++o){var i=S.onnx.TensorShapeProto.Dimension.verify(t.dim[o]);if(i)return"dim."+i}}return null},e.fromObject=function(t){if(t instanceof S.onnx.TensorShapeProto)return t;var o=new S.onnx.TensorShapeProto;if(t.dim){if(!Array.isArray(t.dim))throw TypeError(".onnx.TensorShapeProto.dim: array expected");o.dim=[];for(var i=0;i<t.dim.length;++i){if(typeof t.dim[i]!="object")throw TypeError(".onnx.TensorShapeProto.dim: object expected");o.dim[i]=S.onnx.TensorShapeProto.Dimension.fromObject(t.dim[i])}}return o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.dim=[]),t.dim&&t.dim.length){i.dim=[];for(var a=0;a<t.dim.length;++a)i.dim[a]=S.onnx.TensorShapeProto.Dimension.toObject(t.dim[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.TensorShapeProto"},e.Dimension=function(){function n(o){if(o)for(var i=Object.keys(o),a=0;a<i.length;++a)o[i[a]]!=null&&(this[i[a]]=o[i[a]])}n.prototype.dimValue=null,n.prototype.dimParam=null,n.prototype.denotation="";var t;return Object.defineProperty(n.prototype,"value",{get:E.oneOfGetter(t=["dimValue","dimParam"]),set:E.oneOfSetter(t)}),n.create=function(i){return new n(i)},n.encode=function(i,a){return a||(a=tt.create()),i.dimValue!=null&&Object.hasOwnProperty.call(i,"dimValue")&&a.uint32(8).int64(i.dimValue),i.dimParam!=null&&Object.hasOwnProperty.call(i,"dimParam")&&a.uint32(18).string(i.dimParam),i.denotation!=null&&Object.hasOwnProperty.call(i,"denotation")&&a.uint32(26).string(i.denotation),a},n.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},n.decode=function(i,a){i instanceof K||(i=K.create(i));for(var s=a===void 0?i.len:i.pos+a,u=new S.onnx.TensorShapeProto.Dimension;i.pos<s;){var l=i.uint32();switch(l>>>3){case 1:{u.dimValue=i.int64();break}case 2:{u.dimParam=i.string();break}case 3:{u.denotation=i.string();break}default:i.skipType(l&7);break}}return u},n.decodeDelimited=function(i){return i instanceof K||(i=new K(i)),this.decode(i,i.uint32())},n.verify=function(i){if(typeof i!="object"||i===null)return"object expected";var a={};if(i.dimValue!=null&&i.hasOwnProperty("dimValue")&&(a.value=1,!E.isInteger(i.dimValue)&&!(i.dimValue&&E.isInteger(i.dimValue.low)&&E.isInteger(i.dimValue.high))))return"dimValue: integer|Long expected";if(i.dimParam!=null&&i.hasOwnProperty("dimParam")){if(a.value===1)return"value: multiple values";if(a.value=1,!E.isString(i.dimParam))return"dimParam: string expected"}return i.denotation!=null&&i.hasOwnProperty("denotation")&&!E.isString(i.denotation)?"denotation: string expected":null},n.fromObject=function(i){if(i instanceof S.onnx.TensorShapeProto.Dimension)return i;var a=new S.onnx.TensorShapeProto.Dimension;return i.dimValue!=null&&(E.Long?(a.dimValue=E.Long.fromValue(i.dimValue)).unsigned=!1:typeof i.dimValue=="string"?a.dimValue=parseInt(i.dimValue,10):typeof i.dimValue=="number"?a.dimValue=i.dimValue:typeof i.dimValue=="object"&&(a.dimValue=new E.LongBits(i.dimValue.low>>>0,i.dimValue.high>>>0).toNumber())),i.dimParam!=null&&(a.dimParam=String(i.dimParam)),i.denotation!=null&&(a.denotation=String(i.denotation)),a},n.toObject=function(i,a){a||(a={});var s={};return a.defaults&&(s.denotation=""),i.dimValue!=null&&i.hasOwnProperty("dimValue")&&(typeof i.dimValue=="number"?s.dimValue=a.longs===String?String(i.dimValue):i.dimValue:s.dimValue=a.longs===String?E.Long.prototype.toString.call(i.dimValue):a.longs===Number?new E.LongBits(i.dimValue.low>>>0,i.dimValue.high>>>0).toNumber():i.dimValue,a.oneofs&&(s.value="dimValue")),i.dimParam!=null&&i.hasOwnProperty("dimParam")&&(s.dimParam=i.dimParam,a.oneofs&&(s.value="dimParam")),i.denotation!=null&&i.hasOwnProperty("denotation")&&(s.denotation=i.denotation),s},n.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},n.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TensorShapeProto.Dimension"},n}(),e}(),r.TypeProto=function(){function e(t){if(t)for(var o=Object.keys(t),i=0;i<o.length;++i)t[o[i]]!=null&&(this[o[i]]=t[o[i]])}e.prototype.tensorType=null,e.prototype.sequenceType=null,e.prototype.mapType=null,e.prototype.optionalType=null,e.prototype.sparseTensorType=null,e.prototype.denotation="";var n;return Object.defineProperty(e.prototype,"value",{get:E.oneOfGetter(n=["tensorType","sequenceType","mapType","optionalType","sparseTensorType"]),set:E.oneOfSetter(n)}),e.create=function(o){return new e(o)},e.encode=function(o,i){return i||(i=tt.create()),o.tensorType!=null&&Object.hasOwnProperty.call(o,"tensorType")&&S.onnx.TypeProto.Tensor.encode(o.tensorType,i.uint32(10).fork()).ldelim(),o.sequenceType!=null&&Object.hasOwnProperty.call(o,"sequenceType")&&S.onnx.TypeProto.Sequence.encode(o.sequenceType,i.uint32(34).fork()).ldelim(),o.mapType!=null&&Object.hasOwnProperty.call(o,"mapType")&&S.onnx.TypeProto.Map.encode(o.mapType,i.uint32(42).fork()).ldelim(),o.denotation!=null&&Object.hasOwnProperty.call(o,"denotation")&&i.uint32(50).string(o.denotation),o.sparseTensorType!=null&&Object.hasOwnProperty.call(o,"sparseTensorType")&&S.onnx.TypeProto.SparseTensor.encode(o.sparseTensorType,i.uint32(66).fork()).ldelim(),o.optionalType!=null&&Object.hasOwnProperty.call(o,"optionalType")&&S.onnx.TypeProto.Optional.encode(o.optionalType,i.uint32(74).fork()).ldelim(),i},e.encodeDelimited=function(o,i){return this.encode(o,i).ldelim()},e.decode=function(o,i){o instanceof K||(o=K.create(o));for(var a=i===void 0?o.len:o.pos+i,s=new S.onnx.TypeProto;o.pos<a;){var u=o.uint32();switch(u>>>3){case 1:{s.tensorType=S.onnx.TypeProto.Tensor.decode(o,o.uint32());break}case 4:{s.sequenceType=S.onnx.TypeProto.Sequence.decode(o,o.uint32());break}case 5:{s.mapType=S.onnx.TypeProto.Map.decode(o,o.uint32());break}case 9:{s.optionalType=S.onnx.TypeProto.Optional.decode(o,o.uint32());break}case 8:{s.sparseTensorType=S.onnx.TypeProto.SparseTensor.decode(o,o.uint32());break}case 6:{s.denotation=o.string();break}default:o.skipType(u&7);break}}return s},e.decodeDelimited=function(o){return o instanceof K||(o=new K(o)),this.decode(o,o.uint32())},e.verify=function(o){if(typeof o!="object"||o===null)return"object expected";var i={};if(o.tensorType!=null&&o.hasOwnProperty("tensorType")){i.value=1;{var a=S.onnx.TypeProto.Tensor.verify(o.tensorType);if(a)return"tensorType."+a}}if(o.sequenceType!=null&&o.hasOwnProperty("sequenceType")){if(i.value===1)return"value: multiple values";i.value=1;{var a=S.onnx.TypeProto.Sequence.verify(o.sequenceType);if(a)return"sequenceType."+a}}if(o.mapType!=null&&o.hasOwnProperty("mapType")){if(i.value===1)return"value: multiple values";i.value=1;{var a=S.onnx.TypeProto.Map.verify(o.mapType);if(a)return"mapType."+a}}if(o.optionalType!=null&&o.hasOwnProperty("optionalType")){if(i.value===1)return"value: multiple values";i.value=1;{var a=S.onnx.TypeProto.Optional.verify(o.optionalType);if(a)return"optionalType."+a}}if(o.sparseTensorType!=null&&o.hasOwnProperty("sparseTensorType")){if(i.value===1)return"value: multiple values";i.value=1;{var a=S.onnx.TypeProto.SparseTensor.verify(o.sparseTensorType);if(a)return"sparseTensorType."+a}}return o.denotation!=null&&o.hasOwnProperty("denotation")&&!E.isString(o.denotation)?"denotation: string expected":null},e.fromObject=function(o){if(o instanceof S.onnx.TypeProto)return o;var i=new S.onnx.TypeProto;if(o.tensorType!=null){if(typeof o.tensorType!="object")throw TypeError(".onnx.TypeProto.tensorType: object expected");i.tensorType=S.onnx.TypeProto.Tensor.fromObject(o.tensorType)}if(o.sequenceType!=null){if(typeof o.sequenceType!="object")throw TypeError(".onnx.TypeProto.sequenceType: object expected");i.sequenceType=S.onnx.TypeProto.Sequence.fromObject(o.sequenceType)}if(o.mapType!=null){if(typeof o.mapType!="object")throw TypeError(".onnx.TypeProto.mapType: object expected");i.mapType=S.onnx.TypeProto.Map.fromObject(o.mapType)}if(o.optionalType!=null){if(typeof o.optionalType!="object")throw TypeError(".onnx.TypeProto.optionalType: object expected");i.optionalType=S.onnx.TypeProto.Optional.fromObject(o.optionalType)}if(o.sparseTensorType!=null){if(typeof o.sparseTensorType!="object")throw TypeError(".onnx.TypeProto.sparseTensorType: object expected");i.sparseTensorType=S.onnx.TypeProto.SparseTensor.fromObject(o.sparseTensorType)}return o.denotation!=null&&(i.denotation=String(o.denotation)),i},e.toObject=function(o,i){i||(i={});var a={};return i.defaults&&(a.denotation=""),o.tensorType!=null&&o.hasOwnProperty("tensorType")&&(a.tensorType=S.onnx.TypeProto.Tensor.toObject(o.tensorType,i),i.oneofs&&(a.value="tensorType")),o.sequenceType!=null&&o.hasOwnProperty("sequenceType")&&(a.sequenceType=S.onnx.TypeProto.Sequence.toObject(o.sequenceType,i),i.oneofs&&(a.value="sequenceType")),o.mapType!=null&&o.hasOwnProperty("mapType")&&(a.mapType=S.onnx.TypeProto.Map.toObject(o.mapType,i),i.oneofs&&(a.value="mapType")),o.denotation!=null&&o.hasOwnProperty("denotation")&&(a.denotation=o.denotation),o.sparseTensorType!=null&&o.hasOwnProperty("sparseTensorType")&&(a.sparseTensorType=S.onnx.TypeProto.SparseTensor.toObject(o.sparseTensorType,i),i.oneofs&&(a.value="sparseTensorType")),o.optionalType!=null&&o.hasOwnProperty("optionalType")&&(a.optionalType=S.onnx.TypeProto.Optional.toObject(o.optionalType,i),i.oneofs&&(a.value="optionalType")),a},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(o){return o===void 0&&(o="type.googleapis.com"),o+"/onnx.TypeProto"},e.Tensor=function(){function t(o){if(o)for(var i=Object.keys(o),a=0;a<i.length;++a)o[i[a]]!=null&&(this[i[a]]=o[i[a]])}return t.prototype.elemType=0,t.prototype.shape=null,t.create=function(i){return new t(i)},t.encode=function(i,a){return a||(a=tt.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&a.uint32(8).int32(i.elemType),i.shape!=null&&Object.hasOwnProperty.call(i,"shape")&&S.onnx.TensorShapeProto.encode(i.shape,a.uint32(18).fork()).ldelim(),a},t.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},t.decode=function(i,a){i instanceof K||(i=K.create(i));for(var s=a===void 0?i.len:i.pos+a,u=new S.onnx.TypeProto.Tensor;i.pos<s;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=i.int32();break}case 2:{u.shape=S.onnx.TensorShapeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof K||(i=new K(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")&&!E.isInteger(i.elemType))return"elemType: integer expected";if(i.shape!=null&&i.hasOwnProperty("shape")){var a=S.onnx.TensorShapeProto.verify(i.shape);if(a)return"shape."+a}return null},t.fromObject=function(i){if(i instanceof S.onnx.TypeProto.Tensor)return i;var a=new S.onnx.TypeProto.Tensor;if(i.elemType!=null&&(a.elemType=i.elemType|0),i.shape!=null){if(typeof i.shape!="object")throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");a.shape=S.onnx.TensorShapeProto.fromObject(i.shape)}return a},t.toObject=function(i,a){a||(a={});var s={};return a.defaults&&(s.elemType=0,s.shape=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(s.elemType=i.elemType),i.shape!=null&&i.hasOwnProperty("shape")&&(s.shape=S.onnx.TensorShapeProto.toObject(i.shape,a)),s},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Tensor"},t}(),e.Sequence=function(){function t(o){if(o)for(var i=Object.keys(o),a=0;a<i.length;++a)o[i[a]]!=null&&(this[i[a]]=o[i[a]])}return t.prototype.elemType=null,t.create=function(i){return new t(i)},t.encode=function(i,a){return a||(a=tt.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&S.onnx.TypeProto.encode(i.elemType,a.uint32(10).fork()).ldelim(),a},t.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},t.decode=function(i,a){i instanceof K||(i=K.create(i));for(var s=a===void 0?i.len:i.pos+a,u=new S.onnx.TypeProto.Sequence;i.pos<s;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=S.onnx.TypeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof K||(i=new K(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")){var a=S.onnx.TypeProto.verify(i.elemType);if(a)return"elemType."+a}return null},t.fromObject=function(i){if(i instanceof S.onnx.TypeProto.Sequence)return i;var a=new S.onnx.TypeProto.Sequence;if(i.elemType!=null){if(typeof i.elemType!="object")throw TypeError(".onnx.TypeProto.Sequence.elemType: object expected");a.elemType=S.onnx.TypeProto.fromObject(i.elemType)}return a},t.toObject=function(i,a){a||(a={});var s={};return a.defaults&&(s.elemType=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(s.elemType=S.onnx.TypeProto.toObject(i.elemType,a)),s},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Sequence"},t}(),e.Map=function(){function t(o){if(o)for(var i=Object.keys(o),a=0;a<i.length;++a)o[i[a]]!=null&&(this[i[a]]=o[i[a]])}return t.prototype.keyType=0,t.prototype.valueType=null,t.create=function(i){return new t(i)},t.encode=function(i,a){return a||(a=tt.create()),i.keyType!=null&&Object.hasOwnProperty.call(i,"keyType")&&a.uint32(8).int32(i.keyType),i.valueType!=null&&Object.hasOwnProperty.call(i,"valueType")&&S.onnx.TypeProto.encode(i.valueType,a.uint32(18).fork()).ldelim(),a},t.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},t.decode=function(i,a){i instanceof K||(i=K.create(i));for(var s=a===void 0?i.len:i.pos+a,u=new S.onnx.TypeProto.Map;i.pos<s;){var l=i.uint32();switch(l>>>3){case 1:{u.keyType=i.int32();break}case 2:{u.valueType=S.onnx.TypeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof K||(i=new K(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.keyType!=null&&i.hasOwnProperty("keyType")&&!E.isInteger(i.keyType))return"keyType: integer expected";if(i.valueType!=null&&i.hasOwnProperty("valueType")){var a=S.onnx.TypeProto.verify(i.valueType);if(a)return"valueType."+a}return null},t.fromObject=function(i){if(i instanceof S.onnx.TypeProto.Map)return i;var a=new S.onnx.TypeProto.Map;if(i.keyType!=null&&(a.keyType=i.keyType|0),i.valueType!=null){if(typeof i.valueType!="object")throw TypeError(".onnx.TypeProto.Map.valueType: object expected");a.valueType=S.onnx.TypeProto.fromObject(i.valueType)}return a},t.toObject=function(i,a){a||(a={});var s={};return a.defaults&&(s.keyType=0,s.valueType=null),i.keyType!=null&&i.hasOwnProperty("keyType")&&(s.keyType=i.keyType),i.valueType!=null&&i.hasOwnProperty("valueType")&&(s.valueType=S.onnx.TypeProto.toObject(i.valueType,a)),s},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Map"},t}(),e.Optional=function(){function t(o){if(o)for(var i=Object.keys(o),a=0;a<i.length;++a)o[i[a]]!=null&&(this[i[a]]=o[i[a]])}return t.prototype.elemType=null,t.create=function(i){return new t(i)},t.encode=function(i,a){return a||(a=tt.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&S.onnx.TypeProto.encode(i.elemType,a.uint32(10).fork()).ldelim(),a},t.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},t.decode=function(i,a){i instanceof K||(i=K.create(i));for(var s=a===void 0?i.len:i.pos+a,u=new S.onnx.TypeProto.Optional;i.pos<s;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=S.onnx.TypeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof K||(i=new K(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")){var a=S.onnx.TypeProto.verify(i.elemType);if(a)return"elemType."+a}return null},t.fromObject=function(i){if(i instanceof S.onnx.TypeProto.Optional)return i;var a=new S.onnx.TypeProto.Optional;if(i.elemType!=null){if(typeof i.elemType!="object")throw TypeError(".onnx.TypeProto.Optional.elemType: object expected");a.elemType=S.onnx.TypeProto.fromObject(i.elemType)}return a},t.toObject=function(i,a){a||(a={});var s={};return a.defaults&&(s.elemType=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(s.elemType=S.onnx.TypeProto.toObject(i.elemType,a)),s},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.Optional"},t}(),e.SparseTensor=function(){function t(o){if(o)for(var i=Object.keys(o),a=0;a<i.length;++a)o[i[a]]!=null&&(this[i[a]]=o[i[a]])}return t.prototype.elemType=0,t.prototype.shape=null,t.create=function(i){return new t(i)},t.encode=function(i,a){return a||(a=tt.create()),i.elemType!=null&&Object.hasOwnProperty.call(i,"elemType")&&a.uint32(8).int32(i.elemType),i.shape!=null&&Object.hasOwnProperty.call(i,"shape")&&S.onnx.TensorShapeProto.encode(i.shape,a.uint32(18).fork()).ldelim(),a},t.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},t.decode=function(i,a){i instanceof K||(i=K.create(i));for(var s=a===void 0?i.len:i.pos+a,u=new S.onnx.TypeProto.SparseTensor;i.pos<s;){var l=i.uint32();switch(l>>>3){case 1:{u.elemType=i.int32();break}case 2:{u.shape=S.onnx.TensorShapeProto.decode(i,i.uint32());break}default:i.skipType(l&7);break}}return u},t.decodeDelimited=function(i){return i instanceof K||(i=new K(i)),this.decode(i,i.uint32())},t.verify=function(i){if(typeof i!="object"||i===null)return"object expected";if(i.elemType!=null&&i.hasOwnProperty("elemType")&&!E.isInteger(i.elemType))return"elemType: integer expected";if(i.shape!=null&&i.hasOwnProperty("shape")){var a=S.onnx.TensorShapeProto.verify(i.shape);if(a)return"shape."+a}return null},t.fromObject=function(i){if(i instanceof S.onnx.TypeProto.SparseTensor)return i;var a=new S.onnx.TypeProto.SparseTensor;if(i.elemType!=null&&(a.elemType=i.elemType|0),i.shape!=null){if(typeof i.shape!="object")throw TypeError(".onnx.TypeProto.SparseTensor.shape: object expected");a.shape=S.onnx.TensorShapeProto.fromObject(i.shape)}return a},t.toObject=function(i,a){a||(a={});var s={};return a.defaults&&(s.elemType=0,s.shape=null),i.elemType!=null&&i.hasOwnProperty("elemType")&&(s.elemType=i.elemType),i.shape!=null&&i.hasOwnProperty("shape")&&(s.shape=S.onnx.TensorShapeProto.toObject(i.shape,a)),s},t.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},t.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto.SparseTensor"},t}(),e}(),r.OperatorSetIdProto=function(){function e(n){if(n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.domain="",e.prototype.version=E.Long?E.Long.fromBits(0,0,!1):0,e.create=function(t){return new e(t)},e.encode=function(t,o){return o||(o=tt.create()),t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(10).string(t.domain),t.version!=null&&Object.hasOwnProperty.call(t,"version")&&o.uint32(16).int64(t.version),o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.OperatorSetIdProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.domain=t.string();break}case 2:{a.version=t.int64();break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){return typeof t!="object"||t===null?"object expected":t.domain!=null&&t.hasOwnProperty("domain")&&!E.isString(t.domain)?"domain: string expected":t.version!=null&&t.hasOwnProperty("version")&&!E.isInteger(t.version)&&!(t.version&&E.isInteger(t.version.low)&&E.isInteger(t.version.high))?"version: integer|Long expected":null},e.fromObject=function(t){if(t instanceof S.onnx.OperatorSetIdProto)return t;var o=new S.onnx.OperatorSetIdProto;return t.domain!=null&&(o.domain=String(t.domain)),t.version!=null&&(E.Long?(o.version=E.Long.fromValue(t.version)).unsigned=!1:typeof t.version=="string"?o.version=parseInt(t.version,10):typeof t.version=="number"?o.version=t.version:typeof t.version=="object"&&(o.version=new E.LongBits(t.version.low>>>0,t.version.high>>>0).toNumber())),o},e.toObject=function(t,o){o||(o={});var i={};if(o.defaults)if(i.domain="",E.Long){var a=new E.Long(0,0,!1);i.version=o.longs===String?a.toString():o.longs===Number?a.toNumber():a}else i.version=o.longs===String?"0":0;return t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),t.version!=null&&t.hasOwnProperty("version")&&(typeof t.version=="number"?i.version=o.longs===String?String(t.version):t.version:i.version=o.longs===String?E.Long.prototype.toString.call(t.version):o.longs===Number?new E.LongBits(t.version.low>>>0,t.version.high>>>0).toNumber():t.version),i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.OperatorSetIdProto"},e}(),r.OperatorStatus=function(){var e={},n=Object.create(e);return n[e[0]="EXPERIMENTAL"]=0,n[e[1]="STABLE"]=1,n}(),r.FunctionProto=function(){function e(n){if(this.input=[],this.output=[],this.attribute=[],this.attributeProto=[],this.node=[],this.opsetImport=[],n)for(var t=Object.keys(n),o=0;o<t.length;++o)n[t[o]]!=null&&(this[t[o]]=n[t[o]])}return e.prototype.name="",e.prototype.input=E.emptyArray,e.prototype.output=E.emptyArray,e.prototype.attribute=E.emptyArray,e.prototype.attributeProto=E.emptyArray,e.prototype.node=E.emptyArray,e.prototype.docString="",e.prototype.opsetImport=E.emptyArray,e.prototype.domain="",e.create=function(t){return new e(t)},e.encode=function(t,o){if(o||(o=tt.create()),t.name!=null&&Object.hasOwnProperty.call(t,"name")&&o.uint32(10).string(t.name),t.input!=null&&t.input.length)for(var i=0;i<t.input.length;++i)o.uint32(34).string(t.input[i]);if(t.output!=null&&t.output.length)for(var i=0;i<t.output.length;++i)o.uint32(42).string(t.output[i]);if(t.attribute!=null&&t.attribute.length)for(var i=0;i<t.attribute.length;++i)o.uint32(50).string(t.attribute[i]);if(t.node!=null&&t.node.length)for(var i=0;i<t.node.length;++i)S.onnx.NodeProto.encode(t.node[i],o.uint32(58).fork()).ldelim();if(t.docString!=null&&Object.hasOwnProperty.call(t,"docString")&&o.uint32(66).string(t.docString),t.opsetImport!=null&&t.opsetImport.length)for(var i=0;i<t.opsetImport.length;++i)S.onnx.OperatorSetIdProto.encode(t.opsetImport[i],o.uint32(74).fork()).ldelim();if(t.domain!=null&&Object.hasOwnProperty.call(t,"domain")&&o.uint32(82).string(t.domain),t.attributeProto!=null&&t.attributeProto.length)for(var i=0;i<t.attributeProto.length;++i)S.onnx.AttributeProto.encode(t.attributeProto[i],o.uint32(90).fork()).ldelim();return o},e.encodeDelimited=function(t,o){return this.encode(t,o).ldelim()},e.decode=function(t,o){t instanceof K||(t=K.create(t));for(var i=o===void 0?t.len:t.pos+o,a=new S.onnx.FunctionProto;t.pos<i;){var s=t.uint32();switch(s>>>3){case 1:{a.name=t.string();break}case 4:{a.input&&a.input.length||(a.input=[]),a.input.push(t.string());break}case 5:{a.output&&a.output.length||(a.output=[]),a.output.push(t.string());break}case 6:{a.attribute&&a.attribute.length||(a.attribute=[]),a.attribute.push(t.string());break}case 11:{a.attributeProto&&a.attributeProto.length||(a.attributeProto=[]),a.attributeProto.push(S.onnx.AttributeProto.decode(t,t.uint32()));break}case 7:{a.node&&a.node.length||(a.node=[]),a.node.push(S.onnx.NodeProto.decode(t,t.uint32()));break}case 8:{a.docString=t.string();break}case 9:{a.opsetImport&&a.opsetImport.length||(a.opsetImport=[]),a.opsetImport.push(S.onnx.OperatorSetIdProto.decode(t,t.uint32()));break}case 10:{a.domain=t.string();break}default:t.skipType(s&7);break}}return a},e.decodeDelimited=function(t){return t instanceof K||(t=new K(t)),this.decode(t,t.uint32())},e.verify=function(t){if(typeof t!="object"||t===null)return"object expected";if(t.name!=null&&t.hasOwnProperty("name")&&!E.isString(t.name))return"name: string expected";if(t.input!=null&&t.hasOwnProperty("input")){if(!Array.isArray(t.input))return"input: array expected";for(var o=0;o<t.input.length;++o)if(!E.isString(t.input[o]))return"input: string[] expected"}if(t.output!=null&&t.hasOwnProperty("output")){if(!Array.isArray(t.output))return"output: array expected";for(var o=0;o<t.output.length;++o)if(!E.isString(t.output[o]))return"output: string[] expected"}if(t.attribute!=null&&t.hasOwnProperty("attribute")){if(!Array.isArray(t.attribute))return"attribute: array expected";for(var o=0;o<t.attribute.length;++o)if(!E.isString(t.attribute[o]))return"attribute: string[] expected"}if(t.attributeProto!=null&&t.hasOwnProperty("attributeProto")){if(!Array.isArray(t.attributeProto))return"attributeProto: array expected";for(var o=0;o<t.attributeProto.length;++o){var i=S.onnx.AttributeProto.verify(t.attributeProto[o]);if(i)return"attributeProto."+i}}if(t.node!=null&&t.hasOwnProperty("node")){if(!Array.isArray(t.node))return"node: array expected";for(var o=0;o<t.node.length;++o){var i=S.onnx.NodeProto.verify(t.node[o]);if(i)return"node."+i}}if(t.docString!=null&&t.hasOwnProperty("docString")&&!E.isString(t.docString))return"docString: string expected";if(t.opsetImport!=null&&t.hasOwnProperty("opsetImport")){if(!Array.isArray(t.opsetImport))return"opsetImport: array expected";for(var o=0;o<t.opsetImport.length;++o){var i=S.onnx.OperatorSetIdProto.verify(t.opsetImport[o]);if(i)return"opsetImport."+i}}return t.domain!=null&&t.hasOwnProperty("domain")&&!E.isString(t.domain)?"domain: string expected":null},e.fromObject=function(t){if(t instanceof S.onnx.FunctionProto)return t;var o=new S.onnx.FunctionProto;if(t.name!=null&&(o.name=String(t.name)),t.input){if(!Array.isArray(t.input))throw TypeError(".onnx.FunctionProto.input: array expected");o.input=[];for(var i=0;i<t.input.length;++i)o.input[i]=String(t.input[i])}if(t.output){if(!Array.isArray(t.output))throw TypeError(".onnx.FunctionProto.output: array expected");o.output=[];for(var i=0;i<t.output.length;++i)o.output[i]=String(t.output[i])}if(t.attribute){if(!Array.isArray(t.attribute))throw TypeError(".onnx.FunctionProto.attribute: array expected");o.attribute=[];for(var i=0;i<t.attribute.length;++i)o.attribute[i]=String(t.attribute[i])}if(t.attributeProto){if(!Array.isArray(t.attributeProto))throw TypeError(".onnx.FunctionProto.attributeProto: array expected");o.attributeProto=[];for(var i=0;i<t.attributeProto.length;++i){if(typeof t.attributeProto[i]!="object")throw TypeError(".onnx.FunctionProto.attributeProto: object expected");o.attributeProto[i]=S.onnx.AttributeProto.fromObject(t.attributeProto[i])}}if(t.node){if(!Array.isArray(t.node))throw TypeError(".onnx.FunctionProto.node: array expected");o.node=[];for(var i=0;i<t.node.length;++i){if(typeof t.node[i]!="object")throw TypeError(".onnx.FunctionProto.node: object expected");o.node[i]=S.onnx.NodeProto.fromObject(t.node[i])}}if(t.docString!=null&&(o.docString=String(t.docString)),t.opsetImport){if(!Array.isArray(t.opsetImport))throw TypeError(".onnx.FunctionProto.opsetImport: array expected");o.opsetImport=[];for(var i=0;i<t.opsetImport.length;++i){if(typeof t.opsetImport[i]!="object")throw TypeError(".onnx.FunctionProto.opsetImport: object expected");o.opsetImport[i]=S.onnx.OperatorSetIdProto.fromObject(t.opsetImport[i])}}return t.domain!=null&&(o.domain=String(t.domain)),o},e.toObject=function(t,o){o||(o={});var i={};if((o.arrays||o.defaults)&&(i.input=[],i.output=[],i.attribute=[],i.node=[],i.opsetImport=[],i.attributeProto=[]),o.defaults&&(i.name="",i.docString="",i.domain=""),t.name!=null&&t.hasOwnProperty("name")&&(i.name=t.name),t.input&&t.input.length){i.input=[];for(var a=0;a<t.input.length;++a)i.input[a]=t.input[a]}if(t.output&&t.output.length){i.output=[];for(var a=0;a<t.output.length;++a)i.output[a]=t.output[a]}if(t.attribute&&t.attribute.length){i.attribute=[];for(var a=0;a<t.attribute.length;++a)i.attribute[a]=t.attribute[a]}if(t.node&&t.node.length){i.node=[];for(var a=0;a<t.node.length;++a)i.node[a]=S.onnx.NodeProto.toObject(t.node[a],o)}if(t.docString!=null&&t.hasOwnProperty("docString")&&(i.docString=t.docString),t.opsetImport&&t.opsetImport.length){i.opsetImport=[];for(var a=0;a<t.opsetImport.length;++a)i.opsetImport[a]=S.onnx.OperatorSetIdProto.toObject(t.opsetImport[a],o)}if(t.domain!=null&&t.hasOwnProperty("domain")&&(i.domain=t.domain),t.attributeProto&&t.attributeProto.length){i.attributeProto=[];for(var a=0;a<t.attributeProto.length;++a)i.attributeProto[a]=S.onnx.AttributeProto.toObject(t.attributeProto[a],o)}return i},e.prototype.toJSON=function(){return this.constructor.toObject(this,Ke.util.toJSONOptions)},e.getTypeUrl=function(t){return t===void 0&&(t="type.googleapis.com"),t+"/onnx.FunctionProto"},e}(),r}();tm.exports=S});function eo(r,e){if(!r)throw new Error(typeof e=="string"?e:e())}function Eo(r){return new TextDecoder().decode(r)}var Xe,Dr,_l,bt,zi,ht,Tt,ne,Po,kr,Nr,Lr,ze=N(()=>{"use strict";Vs();Xe=ye(Yr());Rr();Dr=class{static arraysEqual(e,n){if(e.length!==n.length)return!1;for(let t=0;t<e.length;t++)if(e[t]!==n[t])return!1;return!0}},_l=class{static preprocessInputShapes(e,n){let t=e.length===1?[1,e[0]]:e,o=n.length===1?[n[0],1]:n;return[t,o]}static postprocessOutputShape(e,n,t){n===1&&e.splice(e.length-2,1),t===1&&e.pop()}static calcMatMulShape(e,n){return e[1]!==n[0]?void 0:[e[0],n[1]]}},bt=class r{static calcShape(e,n,t=!1){let o=e.length,i=n.length;if(o===0)return n;if(i===0)return e;let a=Math.max(e.length,n.length),s=new Array(a);if(t){if(o<2||i<2)return;let u=_l.calcMatMulShape([e[o-2],e[o-1]],[n[i-2],n[i-1]]);if(u===void 0)return;[s[a-2],s[a-1]]=u}for(let u=t?3:1;u<=a;u++){let l=o-u<0?1:e[o-u],d=i-u<0?1:n[i-u];if(l!==d&&l>1&&d>1)return;s[a-u]=Math.max(l,d)}return s}static index(e,n){let t=new Array(n.length);return r.fillIndex(e,n,t),t}static fillIndex(e,n,t){let o=e.length-n.length;for(let i=0;i<n.length;i++)t[i]=e[o+i]%n[i]}static calc(e,n,t,o,i){let a=r.calcShape(e.dims,n.dims);if(a){if(o&&!ne.areEqual(a,e.dims))return;let s=ne.size(a),u=o?e:new ot(a,i||e.type);if(a.length===0)u.set([],t(e.get([]),n.get([])));else{let l=new Array(a.length),d=new Array(e.dims.length),p=new Array(n.dims.length),h=0,g=0,b=!1,_=!1;e.dims.length===0&&(h=e.get([]),b=!0),n.dims.length===0&&(g=n.get([]),_=!0);let I;for(let w=0;w<s;w++){I=w;for(let v=a.length-1;v>=0;v--)l[v]=I%a[v],I=Math.floor(I/a[v]);b||(r.fillIndex(l,e.dims,d),h=e.get(d)),_||(r.fillIndex(l,n.dims,p),g=n.get(p)),u.set(l,t(h,g))}}return u}}static isValidBroadcast(e,n){let t=e.length,o=n.length;if(t>o)return!1;for(let i=1;i<=t;i++)if(e[t-i]!==1&&e[t-i]!==n[o-i])return!1;return!0}static getBroadcastDims(e,n){let t=e.length,o=[];for(let i=0;i<t;i++){let a=t-1-i,s=e[a]||1;(n[n.length-1-i]||1)>1&&s===1&&o.unshift(a)}return o}},zi=class{static getShapeOfGemmResult(e,n,t,o,i){if(e.length!==2||t.length!==2)throw new Error("shape need to be of size 2");let a,s,u;n?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(o?(u=t[0],l=1):(u=t[1],l=0),t[l]!==s)throw new Error("dimension mismatch");if(a<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(i&&!bt.isValidBroadcast(i,[a,u]))throw new Error("gemm: invalid bias shape for broadcast");return[a,u,s]}},ht=class r{static tensorDataTypeFromProto(e){switch(e){case Xe.onnx.TensorProto.DataType.INT8:return"int8";case Xe.onnx.TensorProto.DataType.UINT8:return"uint8";case Xe.onnx.TensorProto.DataType.BOOL:return"bool";case Xe.onnx.TensorProto.DataType.INT16:return"int16";case Xe.onnx.TensorProto.DataType.UINT16:return"uint16";case Xe.onnx.TensorProto.DataType.INT32:return"int32";case Xe.onnx.TensorProto.DataType.UINT32:return"uint32";case Xe.onnx.TensorProto.DataType.FLOAT:return"float32";case Xe.onnx.TensorProto.DataType.DOUBLE:return"float64";case Xe.onnx.TensorProto.DataType.STRING:return"string";case Xe.onnx.TensorProto.DataType.INT64:return"int32";case Xe.onnx.TensorProto.DataType.UINT64:return"uint32";default:throw new Error(`unsupported data type: ${Xe.onnx.TensorProto.DataType[e]}`)}}static tensorDataTypeStringToEnum(e){switch(e){case"int8":return Xe.onnx.TensorProto.DataType.INT8;case"uint8":return Xe.onnx.TensorProto.DataType.UINT8;case"bool":return Xe.onnx.TensorProto.DataType.BOOL;case"int16":return Xe.onnx.TensorProto.DataType.INT16;case"uint16":return Xe.onnx.TensorProto.DataType.UINT16;case"int32":return Xe.onnx.TensorProto.DataType.INT32;case"uint32":return Xe.onnx.TensorProto.DataType.UINT32;case"float32":return Xe.onnx.TensorProto.DataType.FLOAT;case"float64":return Xe.onnx.TensorProto.DataType.DOUBLE;case"string":return Xe.onnx.TensorProto.DataType.STRING;case"int64":return Xe.onnx.TensorProto.DataType.INT64;case"uint64":return Xe.onnx.TensorProto.DataType.UINT64;default:throw new Error(`unsupported data type: ${e}`)}}static tensorDimsFromProto(e){return e.map(n=>cr.isLong(n)?n.toNumber():n)}static tensorValueTypeFromProto(e){return{tensorType:r.tensorDataTypeFromProto(e.elemType),shape:{dims:r.tensorDimsFromProto(e.shape.dim.map(n=>n.dimValue))}}}static tensorDimsFromORTFormat(e){let n=[];for(let t=0;t<e.dimsLength();t++)n.push(Tt.longToNumber(e.dims(t)));return n}static tensorAttributesFromORTFormat(e){let n=[];for(let t=0;t<e.attributesLength();t++)n.push(e.attributes(t));return n}},Tt=class{static longToNumber(e){return cr.isLong(e)?e.toNumber():typeof e=="bigint"?Number(e):e}static isLong(e){return cr.isLong(e)||typeof e=="bigint"}},ne=class r{static size(e){return r.getSizeFromDimensionRange(e,0,e.length)}static sizeFromDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,n,e.length)}static sizeToDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,0,n)}static getSizeFromDimensionRange(e,n,t){let o=1;for(let i=n;i<t;i++){if(e[i]<=0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");o*=e[i]}return o}static computeStrides(e){let n=e.length;if(n===0)return[];if(n===1)return[1];let t=new Array(n);t[n-1]=1,t[n-2]=e[n-1];for(let o=n-3;o>=0;--o)t[o]=t[o+1]*e[o+1];return t}static transpose(e){return e.slice().reverse()}static indicesToOffset(e,n,t){t===void 0&&(t=e.length);let o=0;for(let i=0;i<t;++i)o+=n[i]*e[i];return o}static offsetToIndices(e,n){let t=n.length;if(t===0)return[];if(t===1)return[e*n[0]];let o=new Array(n.length);for(let i=0;i<o.length-1;++i)o[i]=Math.floor(e/n[i]),e-=o[i]*n[i];return o[o.length-1]=e,o}static normalizeAxis(e,n){if(e<-n&&e>=n)throw new Error("unsupported axis for this operation.");return e<0?e+n:e}static normalizeAxes(e,n){return e.map(t=>this.normalizeAxis(t,n))}static incrementIndex(e,n,t){if(n.length===0||e.length===0)throw new Error("Index incrementing unsupported for scalar Tensor");if(t===void 0)t=n.length;else if(t<=0||t>n.length)throw new Error("Incorrect axis to increment on");for(let o=t-1;o>=0&&(e[o]++,!(e[o]<n[o]));--o)e[o]=0}static calculateReshapedDims(e,n){if(n.length===0){if(e.length===0||r.size(e)===1)return[];throw new Error("cannot reshape to a scalar Tensor")}let t=n.length,o=new Array(t),i=-1,a=1;for(let u=0;u<t;u++){if(n[u]<-1)throw new Error("a dimension in shape hints cannot be less than -1");if(n[u]===-1){if(i!==-1)throw new Error("at most one dimension in shape hints can be -1");i=u}else{if(n[u]===0){if(u>=e.length)throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");o[u]=e[u]}else o[u]=n[u];a*=o[u]}}let s=r.size(e);if(i!==-1){if(s%a!==0)throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${e}] Output shape: [${n}]`);o[i]=s/a}else if(a!==s)throw new Error("reshapedDims and originalDims don't have matching sizes");return o}static sortBasedOnPerm(e,n){return n?n.map(t=>e[t]):e.slice().reverse()}static padShape(e,n){let t=e.length;return e.map((o,i)=>o+n[i]+n[i+t])}static areEqual(e,n){return e.length!==n.length?!1:e.every((t,o)=>t===n[o])}static validateDimsAndCalcSize(e){if(e.length>6)throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");let n=1;for(let t of e){if(!Number.isInteger(t))throw new TypeError(`Invalid shape: ${t} is not an integer`);if(t<0||t>2147483647)throw new TypeError(`Invalid shape: length ${t} is not allowed`);n*=t}return n}static flattenShape(e,n){n<0&&(n+=e.length);let t=e.reduce((a,s)=>a*s,1),o=e.slice(n).reduce((a,s)=>a*s,1);return[t/o,o]}static squeezeShape(e,n){let t=new Array;n=r.normalizeAxes(n,e.length);for(let o=0;o<e.length;o++){let i=n.indexOf(o)>=0;if(i&&e[o]!==1)throw new Error("squeeze an axis of size different than 1");(n.length===0&&e[o]>1||n.length>0&&!i)&&t.push(e[o])}return t}static unsqueezeShape(e,n){let t=new Array(e.length+n.length);t.fill(0);for(let i=0;i<n.length;i++){let a=r.normalizeAxis(n[i],t.length);if(a>=t.length)throw new Error("'axes' has an out of range axis");if(t[a]!==0)throw new Error("'axes' has a duplicate axis");t[a]=1}let o=0;for(let i=0;i<t.length;i++)t[i]===0&&(t[i]=e[o++]);if(o!==e.length)throw new Error("the unsqueezed dimension could not be established");return t}},Po=class r{static splitShape(e,n,t,o){if(t.length===0){if(!o)throw new Error("need to know number of outputs when the 'split' attribute is not specified");r.determineSplit(e[n],o,t)}let i=[],a=[0];for(let s=0;s<t.length;++s){s!==0&&a.push(a[s-1]+t[s-1]);let u=e.slice();u[n]=t[s],i.push(u)}return[i,a]}static determineSplit(e,n,t){if(e%n!==0)throw new Error("cannot split tensor to equal sized parts");for(let o=0;o<n;++o)t.push(e/n)}},kr=class r{static adjustPoolAttributes(e,n,t,o,i,a){if(!e&&t.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let s=0;s<n.length-2;s++)s>=t.length?t.push(n[s+2]):t[s]=n[s+2];for(let s=0;s<t.length;s++)if(s<o.length){if(o[s]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let s=0;s<t.length;s++)if(s<i.length){if(i[s]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let s=0;s<t.length*2;s++)if(s<a.length){if(a[s]<0)throw new Error("pad should be greater than or equal to 1")}else a.push(0);for(let s=0;s<t.length;s++){if(t[s]<=0)throw new Error("kernel shapes need to be greater than 0");if(a[s]>=t[s]||a[s+t.length]>=t[s])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(e,n,t,o,i,a){if(a){if(i.length!==2*(e.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==e.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==e.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let s=0;s<e.length-2;s++)r.adjustPadAndReturnShape(e[s+2],n[s],t[s],o[s],i,s,s+e.length-2,a)}}static computePoolOutputShape(e,n,t,o,i,a,s){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let u=[n[0],n[1]];return r.computeShapeHelper(e,n,u,t,o,i,a,s),u}static computeConvOutputShape(e,n,t,o,i,a,s){if(e.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[e[0],n[0]];return r.computeShapeHelper(!1,e,u,t,o,i,a,s),u}static computeShapeHelper(e,n,t,o,i,a,s,u){if(e)for(let l=0;l<n.length-2;l++)t.push(1);else for(let l=0;l<n.length-2;l++)t.push(r.adjustPadAndReturnShape(n[l+2],o[l],i[l],a[l],s,l,l+n.length-2,u))}static adjustPadAndReturnShape(e,n,t,o,i,a,s,u){let l=t*(o-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return i[a]=0,i[s]=0,Math.floor((e-l)/n+1);case"SAME_LOWER":case"SAME_UPPER":if(t!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=((e+n-1)/n-1)*n+o-e;return i[a]=Math.floor(u==="SAME_LOWER"?(p+1)/2:p/2),i[s]=p-i[a],Math.floor((e+p-o)/n+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((e+i[a]+i[s]-l)/n+1)}},Nr=-34028234663852886e22,Lr=34028234663852886e22});function q$(r){switch(r){case"bool":case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;case"float64":return 8;default:throw new Error(`cannot calculate sizeof() on type ${r}`)}}function nm(r){switch(r){case Te.onnx.TensorProto.DataType.UINT8:case Te.onnx.TensorProto.DataType.INT8:case Te.onnx.TensorProto.DataType.BOOL:return 1;case Te.onnx.TensorProto.DataType.UINT16:case Te.onnx.TensorProto.DataType.INT16:return 2;case Te.onnx.TensorProto.DataType.FLOAT:case Te.onnx.TensorProto.DataType.INT32:case Te.onnx.TensorProto.DataType.UINT32:return 4;case Te.onnx.TensorProto.DataType.INT64:case Te.onnx.TensorProto.DataType.DOUBLE:case Te.onnx.TensorProto.DataType.UINT64:return 8;default:throw new Error(`cannot calculate sizeof() on type ${Te.onnx.TensorProto.DataType[r]}`)}}function j$(r,e){return new(im(e))(r)}function im(r){switch(r){case"bool":case"uint8":return Uint8Array;case"int8":return Int8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"float32":return Float32Array;case"float64":return Float64Array;default:throw new Error("unspecified error")}}function wl(r,e){if(e===Te.onnx.TensorProto.DataType.INT64||e===Io.TensorDataType.INT64){if(r.greaterThanOrEqual(2147483648)||r.lessThan(-2147483648))throw new TypeError("int64 is not supported")}else if(e===Te.onnx.TensorProto.DataType.UINT32||e===Io.TensorDataType.UINT32||e===Te.onnx.TensorProto.DataType.UINT64||e===Io.TensorDataType.UINT64){if(r.greaterThanOrEqual(4294967296)||r.lessThan(0))throw new TypeError("uint64 is not supported")}else throw new TypeError(`not a LONG type: ${Te.onnx.TensorProto.DataType[e]}`);return r.toNumber()}function rm(r,e,n){switch(e){case Te.onnx.TensorProto.DataType.BOOL:case Te.onnx.TensorProto.DataType.UINT8:return r.getUint8(n);case Te.onnx.TensorProto.DataType.INT8:return r.getInt8(n);case Te.onnx.TensorProto.DataType.UINT16:return r.getUint16(n,!0);case Te.onnx.TensorProto.DataType.INT16:return r.getInt16(n,!0);case Te.onnx.TensorProto.DataType.FLOAT:return r.getFloat32(n,!0);case Te.onnx.TensorProto.DataType.INT32:return r.getInt32(n,!0);case Te.onnx.TensorProto.DataType.UINT32:return r.getUint32(n,!0);case Te.onnx.TensorProto.DataType.INT64:return wl(cr.fromBits(r.getUint32(n,!0),r.getUint32(n+4,!0),!1),e);case Te.onnx.TensorProto.DataType.DOUBLE:return r.getFloat64(n,!0);case Te.onnx.TensorProto.DataType.UINT64:return wl(cr.fromBits(r.getUint32(n,!0),r.getUint32(n+4,!0),!0),e);default:throw new Error(`cannot read from DataView for type ${Te.onnx.TensorProto.DataType[e]}`)}}var om,Te,ot,Rr=N(()=>{"use strict";om=ye(vf());Vs();So();Te=ye(Yr());ze();ot=class r{constructor(e,n,t,o,i,a=om.Guid.create()){this.dims=e;this.type=n;this.dataProvider=t;this.asyncDataProvider=o;this.cache=i;this.dataId=a;this.size=ne.validateDimsAndCalcSize(e);let s=this.size,u=t===void 0&&o===void 0&&i===void 0;if(i!==void 0&&i.length!==s)throw new RangeError("Input dims doesn't match data length.");if(n==="string"){if(i!==void 0&&(!Array.isArray(i)||!i.every(l=>typeof l=="string")))throw new TypeError("cache should be a string array");u&&(this.cache=new Array(s))}else{if(i!==void 0){let l=im(n);if(!(i instanceof l))throw new TypeError(`cache should be type ${l.name}`)}if(u){let l=new ArrayBuffer(s*q$(n));this.cache=j$(l,n)}}}get data(){if(this.cache===void 0){let e=this.dataProvider(this.dataId);if(e.length!==this.size)throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");this.cache=e}return this.cache}get stringData(){if(this.type!=="string")throw new TypeError("data type is not string");return this.data}get integerData(){switch(this.type){case"uint8":case"int8":case"uint16":case"int16":case"int32":case"uint32":case"bool":return this.data;default:throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)")}}get floatData(){switch(this.type){case"float32":case"float64":return this.data;default:throw new TypeError("data type is not float (float32, float64)")}}get numberData(){if(this.type!=="string")return this.data;throw new TypeError("type cannot be non-number (string)")}get(e){return this.data[ne.indicesToOffset(e,this.strides)]}set(e,n){this.data[ne.indicesToOffset(e,this.strides)]=n}async getData(){return this.cache===void 0&&(this.cache=await this.asyncDataProvider(this.dataId)),this.cache}get strides(){return this._strides||(this._strides=ne.computeStrides(this.dims)),this._strides}static fromProto(e){if(!e)throw new Error("cannot construct Value from an empty tensor");let n=ht.tensorDataTypeFromProto(e.dataType),t=ht.tensorDimsFromProto(e.dims),o=new r(t,n);if(n==="string")e.stringData.forEach((i,a)=>{o.data[a]=Eo(i)});else if(e.rawData&&typeof e.rawData.byteLength=="number"&&e.rawData.byteLength>0){let i=o.data,a=new DataView(e.rawData.buffer,e.rawData.byteOffset,e.rawData.byteLength),s=nm(e.dataType),u=e.rawData.byteLength/s;if(e.rawData.byteLength%s!==0)throw new Error("invalid buffer length");if(i.length!==u)throw new Error("buffer length mismatch");for(let l=0;l<u;l++){let d=rm(a,e.dataType,l*s);i[l]=d}}else{let i;switch(e.dataType){case Te.onnx.TensorProto.DataType.FLOAT:i=e.floatData;break;case Te.onnx.TensorProto.DataType.INT32:case Te.onnx.TensorProto.DataType.INT16:case Te.onnx.TensorProto.DataType.UINT16:case Te.onnx.TensorProto.DataType.INT8:case Te.onnx.TensorProto.DataType.UINT8:case Te.onnx.TensorProto.DataType.BOOL:i=e.int32Data;break;case Te.onnx.TensorProto.DataType.INT64:i=e.int64Data;break;case Te.onnx.TensorProto.DataType.DOUBLE:i=e.doubleData;break;case Te.onnx.TensorProto.DataType.UINT32:case Te.onnx.TensorProto.DataType.UINT64:i=e.uint64Data;break;default:throw new Error("unspecific error")}if(i==null)throw new Error("failed to populate data from a tensorproto value");let a=o.data;if(a.length!==i.length)throw new Error("array length mismatch");for(let s=0;s<i.length;s++){let u=i[s];cr.isLong(u)?a[s]=wl(u,e.dataType):a[s]=u}}return o}static fromData(e,n,t){return new r(n,t,void 0,void 0,e)}static fromOrtTensor(e){if(!e)throw new Error("cannot construct Value from an empty tensor");let n=ht.tensorDimsFromORTFormat(e),t=ht.tensorDataTypeFromProto(e.dataType()),o=new r(n,t);if(t==="string")for(let i=0;i<e.stringDataLength();i++)o.data[i]=e.stringData(i);else if(e.rawDataArray()&&typeof e.rawDataLength()=="number"&&e.rawDataLength()>0){let i=o.data,a=new DataView(e.rawDataArray().buffer,e.rawDataArray().byteOffset,e.rawDataLength()),s=nm(e.dataType()),u=e.rawDataLength()/s;if(e.rawDataLength()%s!==0)throw new Error("invalid buffer length");if(i.length!==u)throw new Error("buffer length mismatch");for(let l=0;l<u;l++){let d=rm(a,e.dataType(),l*s);i[l]=d}}return o}}});function se(r){return r===1?K$:X$}function am(r){let e=se(r);return`${e.version}
      precision highp float;
      ${e.attribute} vec3 position;
      ${e.attribute} vec2 textureCoord;

      ${e.varyingVertex} vec2 TexCoords;

      void main()
      {
          gl_Position = vec4(position, 1.0);
          TexCoords = textureCoord;
      }`}function sm(r){let e=se(r);return`${e.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${e.varyingFrag} vec2 TexCoords;
    ${e.outputDeclaration}
    const vec2 halfCR = vec2(0.5, 0.5);

    // Custom vector types to handle higher dimenalities.
    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    `}function um(r,e){let n=se(r);return`
  void main() {
    int indices[${e}];
    toVec(TexCoords, indices);
    vec4 result = vec4(process(indices));
    ${n.output} = result;
  }
  `}var K$,X$,Je=N(()=>{"use strict";K$={version:"",attribute:"attribute",varyingVertex:"varying",varyingFrag:"varying",texture2D:"texture2D",output:"gl_FragColor",outputDeclaration:""},X$={version:"#version 300 es",attribute:"in",varyingVertex:"out",varyingFrag:"in",texture2D:"texture",output:"outputColor",outputDeclaration:"out vec4 outputColor;"}});var Ae=N(()=>{"use strict"});async function vl(r,e=t=>0,n){return new Promise((t,o)=>{let i=0,a=()=>{if(r()){t();return}i++;let s=e(i);if(n!=null&&i>=n){o();return}setTimeout(a,s)};a()})}function Mi(r){return eo(typeof r<"u"&&r.length!==0,()=>"empty string found for sampler name"),"get"+r.charAt(0).toUpperCase()+r.slice(1)}function lm(r){return eo(typeof r<"u"&&r.length!==0,()=>"empty string found for sampler name"),"get"+r.charAt(0).toUpperCase()+r.slice(1)+"AtOutCoords"}function to(r,e){let n=JSON.parse(JSON.stringify(r));return n=e,n}function no(r,e){return e.map(n=>r[n]).join(", ")}function yt(r){if(r<=1)return"int";if(r===2)return"ivec2";if(r===3)return"ivec3";if(r===4)return"ivec4";if(r===5)return"ivec5";if(r===6)return"ivec6";throw Error(`GPU for rank ${r} is not yet supported`)}function Xt(r=6){return["x","y","z","w","u","v"].slice(0,r)}var zn=N(()=>{"use strict";ze()});function Z$(r,e){return Xt(e).map(n=>`${r}.${n}`)}function ro(r,e){return e===1?[r]:Z$(r,e)}function Mn(){return`
    float getChannel(vec4 frag, int dim) {
      int modCoord = imod(dim, 2);
      return modCoord == 0 ? frag.r : frag.g;
    }

    float getChannel(vec4 frag, vec2 innerDims) {
      vec2 modCoord = mod(innerDims, 2.);
      return modCoord.x == 0. ?
        (modCoord.y == 0. ? frag.r : frag.g) :
        (modCoord.y == 0. ? frag.b : frag.a);
    }
  `}var zr=N(()=>{"use strict";zn()});function Q$(r,e,n){if(r===0)return"false";if(r===1)return`rc > ${e[0]}`;let t="";for(let o=r-2;o<r;o++)t+=`${n[o]} >= ${e[o-r+2]}`,o<r-1&&(t+="||");return t}function Y$(r,e){let n=r.length;if(n===0)return"getA(), 0, 0, 0";if(n===1)return`getA(rc),
            rc + 1 >= ${r[0]} ? 0. : getA(rc + 1),
            0, 0`;let t="r, c",o="r, cp1",i="rp1, c",a="rp1, cp1",s="";if(n>2)for(let u=0;u<n-2;++u)s=s+`${e[u]},`;return`getA(${s}${t}),
          rEdge ? 0. : getA(${s}${i}),
          cEdge ? 0. : getA(${s}${o}),
          rEdge || cEdge ? 0. : getA(${s}${a})`}function eA(r,e,n,t){return r===0||r===1?"":`
    int r = ${e[r-2]};
    int c = ${e[r-1]};
    int rp1 = ${e[r-2]} + 1;
    int cp1 = ${e[r-1]} + 1;
    bool rEdge = rp1 >= ${t};
    bool cEdge = cp1 >= ${n};
    `}var cm,J$,dm,pm=N(()=>{"use strict";Je();Ae();zn();zr();cm={name:"pack",inputNames:["A"],inputTypes:[1]},J$=(r,e)=>{let n=se(r.session.backend.glContext.version),t=e.dims,o=t.length,i=e.dims.length,a=yt(i),s=ro("rc",i),u=eA(i,s,t[t.length-2],t[t.length-1]),l;o===0?l=[1,1]:o===1?l=[t[0],1]:l=[t[i-1],t[i-2]];let d=Q$(i,l,s),p=Y$(t,s),h=`
        void main() {
          ${a} rc = getOutputCoords();

          if(${d}) {
            ${n.output} = vec4(0);
          } else {
            ${u}

            ${n.output} = vec4(${p});
          }
        }
      `;return{...cm,hasMain:!0,output:{dims:e.dims,type:e.type,textureType:2},shaderSource:h}},dm=(r,e)=>({...cm,get:()=>J$(r,e)})});function xl(r){if(r.length===0)return[1,1,1];let e=1;for(let n=0;n<r.length-2;++n)e*=r[n];return[e,r.length>1?r[r.length-2]:1,r[r.length-1]]}function hm(r,e){let n=!1;return r.length===0||e.length===0?n=!0:r.length<2||e.length<2?n=r[r.length-1]===e[e.length-1]:n=r[r.length-1]===e[e.length-1]&&r[r.length-2]===e[e.length-2],n}function rA(r){let e=ne.computeStrides(r),n=["b","r","c"],t="index";return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${e.map((i,a)=>{let s=`int ${n[a]} = ${t} / ${i}`,u=a===e.length-1?`int ${n[a+1]} = ${t} - ${n[a]} * ${i}`:`index -= ${n[a]} * ${i}`;return`${s}; ${u};`}).join("")}
      return ivec3(b, r, c);
    }
  `}function oA(r){let e=ne.computeStrides(r);return`
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${e[0]} + coords.z * ${e[1]} + coords.y;
  }
`}var tA,nA,fm,mm=N(()=>{"use strict";ze();Je();Ae();zr();tA=r=>({name:"Reshape (packed)",inputTypes:[2],inputNames:["A"],cacheHint:`${r}`}),nA=(r,e,n,t)=>{let o=e.dims,i=t,a="";for(let l=0;l<4;l++){let d="";switch(l){case 0:d="outputCoords = rc;";break;case 1:d="outputCoords = ivec3(rc.x, rc.y+1, rc.z);";break;case 2:d="outputCoords = ivec3(rc.x, rc.y, rc.z+1);";break;case 3:d="outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";break;default:throw new Error}a+=`
        ${d}
        ${l>0?"if(outputCoords.y < rows && outputCoords.z < cols){":""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${l}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${l>0?"}":""}
      `}let s=se(r.session.backend.glContext.version),u=`
      ${rA(o)}
      ${oA(i)}
      ${Mn()}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.0);

        ivec3 outputCoords;
        int rows = ${i[2]};
        int cols = ${i[1]};

        ${a}
        ${s.output} = result;
      }
    `;return{...n,output:{dims:i,type:e.type,textureType:2},shaderSource:u,hasMain:!0}},fm=(r,e,n)=>{let t=tA(n);return{...t,get:()=>nA(r,e,t,n)}}});var Tl,gm=N(()=>{"use strict";Je();Ae();Tl=(r,e)=>{let n=e.shape,t=se(r.session.backend.glContext.version),o=`
    const float FLOAT_MAX = 1.70141184e38;
    const float FLOAT_MIN = 1.17549435e-38;

    bool isNaN(float val) {
      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;
    }

    highp vec4 encodeAsUint8(highp float v) {
      if (isNaN(v)) {
        return vec4(255, 255, 255, 255);
      }

      highp float av = abs(v);

      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      highp float e = floor(log2(av));
      highp float m = exp2(fract(log2(av))) - 1.0;

      c[2] = floor(128.0 * m);
      m -= c[2] / 128.0;
      c[1] = floor(32768.0 * m);
      m -= c[1] / 32768.0;
      c[0] = floor(8388608.0 * m);

      highp float ebias = e + 127.0;
      c[3] = floor(ebias / 2.0);
      ebias -= c[3] * 2.0;
      c[2] += floor(ebias) * 128.0;

      c[3] += 128.0 * step(0.0, -v);

      return c / 255.0;
    }

    void main() {
      float value = ${t.texture2D}(X,TexCoords).r;
      ${t.output} = encodeAsUint8(value);
    }`,i={name:"Uint8Encode",inputTypes:[0],inputNames:["X"],output:{dims:n,type:e.tensor.type,textureType:3},shaderSource:o,hasMain:!0};return r.executeProgram(i,[e.tensor])}});function aA(r,e){if(r===1)return"rc";let n="";for(let t=0;t<r;t++)n+=e[t],t<r-1&&(n+=",");return n}var bm,iA,ym,_m=N(()=>{"use strict";Je();Ae();zn();zr();bm={name:"unpack",inputNames:["A"],inputTypes:[2]},iA=(r,e)=>{let n=e.dims.length,t=ro("rc",n),o=t.slice(-2),i=yt(n),a=Mn(),u=e.dims.length===0?"":aA(n,t),l=n<=1?"rc":`vec2(${o.join(",")})`,d=se(r.session.backend.glContext.version),p=`
    ${a}
    void main() {
      ${i} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${u});

       ${d.output} = vec4(getChannel(packedInput, ${l}), 0, 0, 0);
     }
   `;return{...bm,hasMain:!0,output:{dims:e.dims,type:e.type,textureType:0},shaderSource:p}},ym=(r,e)=>({...bm,get:()=>iA(r,e)})});var Bi,Co,Fi,Do=N(()=>{"use strict";Dt();Bi=class{constructor(e,n=1){if(n===1)this.internalFormat=e.R32F,this.format=e.RED,this.textureType=e.FLOAT,this.channelSize=n;else if(n===4)this.internalFormat=e.RGBA32F,this.format=e.RGBA,this.textureType=e.FLOAT,this.channelSize=n;else throw new Error(`Invalid number of channels: ${n}`)}encode(e,n){let t,o;return e.constructor!==Float32Array&&(Be.warning("Encoder","data was not of type Float32; creating new Float32Array"),o=new Float32Array(e)),n*this.channelSize>e.length?(Be.warning("Encoder","Source data too small. Allocating larger array"),o=e,t=this.allocate(n*this.channelSize),o.forEach((i,a)=>t[a]=i)):(o=e,t=o),t}allocate(e){return new Float32Array(e*4)}decode(e,n){return this.channelSize===1?e.filter((o,i)=>i%4===0).subarray(0,n):e.subarray(0,n)}},Co=class{constructor(e,n=1,t){if(n!==1&&n!==4)throw new Error(`Invalid number of channels: ${n}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.channelSize=n,this.textureType=t||e.FLOAT}encode(e,n){let t=e;return this.channelSize===1&&(Be.verbose("Encoder","Exploding into a larger array"),t=this.allocate(n),e.forEach((o,i)=>t[i*4]=o)),t}allocate(e){return new Float32Array(e*4)}decode(e,n){return this.channelSize===1?e.filter((o,i)=>i%4===0).subarray(0,n):e.subarray(0,n)}},Fi=class{constructor(e,n=1){this.channelSize=4;if(n===1)this.internalFormat=e.ALPHA,this.format=e.ALPHA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=n;else if(n===4)this.internalFormat=e.RGBA,this.format=e.RGBA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=n;else throw new Error(`Invalid number of channels: ${n}`)}encode(e,n){return new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}allocate(e){return new Uint8Array(e*this.channelSize)}decode(e,n){if(e instanceof Uint8Array)return e.subarray(0,n);throw new Error(`Invalid array type: ${e.constructor}`)}}});var ko,wm,Il,vm=N(()=>{"use strict";ze();Ae();ko=(r,e,n)=>{let t=n===0||n===1?1:4,o=n===2,i=n===1||n===2,a=n===4?e.length-1:void 0,s=n===4?e.map((u,l)=>l===e.length-1?u*4:u):void 0;return Il(r,e,t,s,{isPacked:o,reverseWH:i,breakAxis:a})},wm=(r,e,n)=>{let t=ko(r,e,n);return[t.width,t.height]},Il=(r,e,n=1,t,o)=>{let i=!!(o&&o.isPacked),[a,s]=r.computeTextureWH(i&&t||e,o),u=e.length,l=e.slice(0);if(u===0&&(l=[1]),n===1)t=e;else if(i){if(n!==4)throw new Error("a packed texture must be 4-channel");t=e,u>0&&(l[u-1]=Math.ceil(l[u-1]/2)),u>1&&(l[u-2]=Math.ceil(l[u-2]/2))}else if(!t)throw new Error("Unpacked shape is needed when using channels > 1");return{width:a,height:s,channels:n,isPacked:i,shape:l,strides:ne.computeStrides(l),unpackedShape:t,reversedWH:o&&o.reverseWH}}});var uA,Vi,Tm=N(()=>{"use strict";Dt();Rr();ze();pm();mm();gm();_m();Do();vm();Ae();uA=(r,e)=>{let n=e.map(o=>`${o.unpackedShape.join(",")};${o.width}x${o.height}`).join("_"),t=r.name;return r.cacheHint&&(t+="["+r.cacheHint+"]"),t+=":"+n,t},Vi=class{constructor(e){this.session=e;this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map}calculateTextureWidthAndHeight(e,n){return wm(this.session.layoutStrategy,e,n)}executeProgram(e,n){if(n.length<e.inputNames.length)throw new Error(`Input size mustn't be less than ${e.inputNames.length}.`);if(e.inputNames.length!==e.inputTypes.length)throw new Error("input names size does not match input types");let t=[];for(let l=0;l<e.inputNames.length;++l)t[l]=this.getOrCreateTextureData(n[l],e.inputTypes[l]);let o=uA(e,t),i=this.session.programManager.getArtifact(o),a=i?i.programInfo:typeof e.get=="function"?e.get():e,s=ko(this.session.layoutStrategy,a.output.dims,a.output.textureType),u=this.createTextureData(s,a.output.type);return i||(i=this.session.programManager.build(a,t,u),this.session.programManager.setArtifact(o,i)),this.runProgram(i,t,u),u}run(e,n){return this.executeProgram(e,n).tensor}runProgram(e,n,t){for(let o=0;o<n.length;++o)if(!!n[o].isPacked!=(e.programInfo.inputTypes[o]===2))throw new Error(`input[${o}] property packed inconsistent`);if(!!t.isPacked!=(e.programInfo.output.textureType===2))throw new Error("output property packed inconsistent");this.session.programManager.run(e,n,t)}getOrCreateTextureData(e,n){let t=this.getTextureData(e.dataId,n===2);if(!t&&(t=this.getTextureData(e.dataId,n!==2),t))return n===2?this.pack(t):this.unpack(t);if(!t){let o=ko(this.session.layoutStrategy,e.dims,n);if(n===4){let s=e.dims;if(s.length===4){let u=[s[0],Math.ceil(s[1]*s[2]*s[3]/4)],l=ko(this.session.layoutStrategy,u,n),d=e.numberData;if(s[1]*s[2]*s[3]%4!==0){let p=s[0],h=s[1]*s[2]*s[3],g=Math.ceil(h*1/4)*4,b=p*g;d=new Float32Array(b);for(let _=0;_<p;++_){let I=_*h,w=_*g+_%1*h;d.set(e.numberData.subarray(I,I+h),w)}}return this.createTextureData(l,e.type,d,e,1)}}if(n===2){let i=Il(this.session.layoutStrategy,e.dims,1,[],{reverseWH:!0}),a=this.createTextureData(i,e.type,e.numberData,e,1);t=this.pack(a)}else t=this.createTextureData(o,e.type,e.numberData,e,1)}return t}createTextureDataFromLayoutBindTensor(e,n,t,o){return this.createTextureData(e,n,t,o,1)}createTextureData(e,n,t,o,i){Be.verbose("InferenceHandler",`Creating TextureData: layout:[${JSON.stringify(e)}]`);let a=this.session.textureManager.createTextureFromLayout(n,e,t,i);return this.createTextureDataFromTexture(e,n,a,o)}reshapeUnpacked(e,n){let t=this.getOrCreateTextureData(e,0),o={channels:t.channels,height:t.height,width:t.width,shape:n.length!==0?n:[1],strides:ne.computeStrides(n),unpackedShape:n};return this.createTextureDataFromTexture(o,e.type,t.texture).tensor}reshapePacked(e,n){let t=this.getOrCreateTextureData(e,2);if(hm(e.dims,n)){let l={channels:t.channels,height:t.height,width:t.width,shape:n.length!==0?n:[1],strides:ne.computeStrides(n),unpackedShape:n,isPacked:!0};return this.createTextureDataFromTexture(l,e.type,t.texture).tensor}let o=xl(e.dims),i=xl(n),a=this.reshapePacked(e,o),s=this.run(fm(this,a,i),[a]);return this.reshapePacked(s,n)}cast(e,n){let t=this.getOrCreateTextureData(e,0);return this.createTextureDataFromTexture(t,n,t.texture).tensor}createTextureDataFromTexture(e,n,t,o,i){let a={...e,tensor:o||new ot(e.unpackedShape,n,s=>this.readTexture(a),async s=>this.readTextureAsync(a),void 0,i),texture:t};return this.setTextureData(a.tensor.dataId,a,e.isPacked),a}getTextureData(e,n=!1){return this.session.isInitializer(e)?this.session.getTextureData(e,n):n?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,n,t=!1){this.session.isInitializer(e)?this.session.setTextureData(e,n,t):(t?this.packedTextureDataCache:this.unpackedTextureDataCache).set(e,n)}isTextureLayoutCached(e,n=!1){return!!this.getTextureData(e.dataId,n)}dispose(){this.session.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.unpackedTextureDataCache=new Map}readTexture(e){return e.isPacked?this.readTexture(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTexture(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(Tl(this,e))}async readTextureAsync(e){return e.isPacked?this.readTextureAsync(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTextureAsync(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(Tl(this,e))}pack(e){return this.executeProgram(dm(this,e.tensor),[e.tensor])}unpack(e){return this.executeProgram(ym(this,e.tensor),[e.tensor])}}});var Sl,we,dt=N(()=>{"use strict";Sl=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},we=r=>new Sl(r)});var Im,Sm,$m,lA,cA,Am=N(()=>{"use strict";dt();Je();Ae();Im={name:"BatchNormalization",inputNames:["A","Scale","B","Mean","Variance"],inputTypes:[0,0,0,0,0]},Sm=(r,e,n)=>(cA(e),[r.run({...Im,cacheHint:n.cacheKey,get:()=>lA(r,e,n)},e)]),$m=r=>{let e=r.attributes.getFloat("epsilon",1e-5),n=r.attributes.getFloat("momentum",.9),t=r.attributes.getInt("spatial",1);return we({epsilon:e,momentum:n,spatial:t})},lA=(r,e,n)=>{let t=se(r.session.backend.glContext.version),o=e[0].dims.length,[i,a]=r.calculateTextureWidthAndHeight(e[1].dims,0),s=`
  float process(int[${o}] indices) {
    vec2 position = offsetToCoords(indices[1], ${i}, ${a});
    float scale = getColorAsFloat(${t.texture2D}(Scale, position));
    float mean = getColorAsFloat(${t.texture2D}(Mean, position));
    float variance = getColorAsFloat(${t.texture2D}(Variance, position));
    float b = getColorAsFloat(${t.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${n.epsilon})) ) + b;
  }`;return{...Im,output:{dims:e[0].dims,type:e[0].type,textureType:0},shaderSource:s}},cA=r=>{if(!r||r.length!==5)throw new Error("BatchNormalization requires 5 inputs.");let e=r[0],n=r[1],t=r[2],o=r[3],i=r[4];if(e.dims.length<3||n.dims.length!==1||t.dims.length!==1||o.dims.length!==1||i.dims.length!==1)throw new Error("invalid input shape.");if(n.dims[0]!==e.dims[1]||t.dims[0]!==e.dims[1]||o.dims[0]!==e.dims[1]||i.dims[0]!==e.dims[1])throw new Error("invalid input shape.");if(e.type!=="float32"&&e.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||t.type!=="float32"&&t.type!=="float64"||o.type!=="float32"&&o.type!=="float64"||i.type!=="float32"&&i.type!=="float64")throw new Error("invalid input tensor types.")}});var Gi,Mt,X,No,Ui,Qn=N(()=>{"use strict";Gi=class{constructor(e,n,t,o){this.glContext=e;this.programInfo=n;this.inputTextureLayouts=t;this.outputTextureLayout=o}},Mt=class{constructor(e){this.context=e}},X=class{constructor(e,n){this.routineBody=e;this.dependencies=n}},No=class{constructor(e,n,t){this.name=e;t?this.dependencies=t:this.dependencies=[],n&&(this.routineBody=n)}addDependency(e){e&&this.dependencies.push(e)}},Ui=class{static returnOrderedNodes(e){if(!e||e.length===0)return[];if(e.length===1)return e;let n=new Set,t=new Set,o=new Array;return this.createOrderedNodes(e,n,t,o),o}static createOrderedNodes(e,n,t,o){for(let i=0;i<e.length;++i)this.dfsTraverse(e[i],n,t,o)}static dfsTraverse(e,n,t,o){if(!e||t.has(e.name))return;if(n.has(e.name))throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");n.add(e.name);let i=e.dependencies;if(i&&i.length>0)for(let a=0;a<i.length;++a)this.dfsTraverse(i[a],n,t,o);o.push(e),t.add(e.name),n.delete(e.name)}}});function pA(){let r="add_";return{body:`
  float ${r}(float a, float b) {
    return a + b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `,name:r,type:0}}function fA(){let r="div_";return{body:`
  float ${r}(float a, float b) {
    return a / b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `,name:r,type:0}}function hA(){let r="mul_";return{body:`
  float ${r}(float a, float b) {
    return a * b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `,name:r,type:0}}function mA(){let r="sub_";return{body:`
  float ${r}(float a, float b) {
    return a - b;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `,name:r,type:0}}function gA(){let r="equal_";return{body:`
  float ${r}(float a, float b) {
    return float(a == b);
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `,name:r,type:0}}function bA(){let r="greater_";return{body:`
  float ${r}(float a, float b) {
    return float(a > b);
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `,name:r,type:0}}function yA(){let r="less_";return{body:`
  float ${r}(float a, float b) {
    return float(a < b);
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `,name:r,type:0}}function _A(){let r="and_";return{body:`
  float ${r}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `,name:r,type:0}}function wA(){let r="or_";return{body:`
  float ${r}(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `,name:r,type:0}}function vA(){let r="xor_";return{body:`
  float ${r}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `,name:r,type:0}}function xA(){return IA("pow")}function TA(){let r="prelu_";return{body:`
  float ${r}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${r}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `,name:r,type:0}}function IA(r){let e=`${r}_`;return{body:`
  float ${e}(float a, float b) {
    return ${r}(a, b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return ${r}(v1, v2);
  }
  `,name:e,type:0}}var Bt,SA,Om,Pm,Em,Cm,Dm,km,Nm,Lm,Rm,zm,Mm,Bm,Fm=N(()=>{"use strict";ze();Qn();Je();Ae();Bt=(r,e,n,t=e[0].type,o)=>{let i=r.session.pack?2:0;return{name:n.name,inputNames:["A","B"],inputTypes:[i,i],cacheHint:o,get:()=>SA(r,e,n,t)}},SA=(r,e,n,t=e[0].type)=>{let o=r.session.pack?2:0,i=!ne.areEqual(e[0].dims,e[1].dims),a=e[0].dims,s=r.session.pack;if(i){let d=bt.calcShape(e[0].dims,e[1].dims,!1);if(!d)throw new Error("Can't perform binary op on the given tensors");a=d;let p=a.length,h=e[0].dims.length!==0?e[0].dims.length:1,g=e[1].dims.length!==0?e[1].dims.length:1,b=e[0].dims.length!==0?"bcastIndices_A(indices, aindices);":"aindices[0] = 0;",_=e[1].dims.length!==0?"bcastIndices_B(indices, bindices);":"bindices[0] = 0;",I=se(r.session.backend.glContext.version),w=s?`
      ${n.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${n.name}(a, b);
        ${I.output} = result;
      }`:`
      ${n.body}
      float process(int indices[${p}]) {
        int aindices[${h}];
        int bindices[${g}];
        ${b}
        ${_}
        return ${n.name}(_A(aindices), _B(bindices));
      }`;return{name:n.name,inputNames:["A","B"],inputTypes:[o,o],output:{dims:a,type:t,textureType:o},shaderSource:w,hasMain:s}}let u=se(r.session.backend.glContext.version),l=`
    ${n.body}
    void main() {
      vec4 v1 = ${u.texture2D}(A, TexCoords);
      vec4 v2 = ${u.texture2D}(B, TexCoords);
      vec4 result = ${n.name}(v1, v2);
      ${u.output} = result;
    }
    `;return{name:n.name,inputNames:["A","B"],inputTypes:[o,o],output:{dims:e[0].dims,type:t,textureType:o},shaderSource:l,hasMain:!0}},Om=(r,e)=>[r.run(Bt(r,e,pA()),e)],Pm=(r,e)=>[r.run(Bt(r,e,_A(),"bool"),e)],Em=(r,e)=>[r.run(Bt(r,e,fA()),e)],Cm=(r,e)=>[r.run(Bt(r,e,gA(),"bool"),e)],Dm=(r,e)=>[r.run(Bt(r,e,bA(),"bool"),e)],km=(r,e)=>[r.run(Bt(r,e,yA(),"bool"),e)],Nm=(r,e)=>[r.run(Bt(r,e,hA()),e)],Lm=(r,e)=>[r.run(Bt(r,e,wA(),"bool"),e)],Rm=(r,e)=>[r.run(Bt(r,e,xA()),e)],zm=(r,e)=>[r.run(Bt(r,e,TA()),e)],Mm=(r,e)=>[r.run(Bt(r,e,mA()),e)],Bm=(r,e)=>[r.run(Bt(r,e,vA(),"bool"),e)]});var Vm,Gm,AA,Um=N(()=>{"use strict";ze();Vm=(r,e,n)=>(AA(e),[r.cast(e[0],n)]),Gm=r=>ht.tensorDataTypeFromProto(r.attributes.getInt("to")),AA=r=>{if(!r||r.length!==1)throw new Error("Cast requires 1 input.");if(r[0].type==="string")throw new Error("Invalid input type.")}});var OA,PA,Wm,Wi,Hm=N(()=>{"use strict";Je();Ae();zn();zr();OA=(r,e)=>({name:"Concat (packed)",inputNames:Array.from({length:r},(n,t)=>`X${t}`),inputTypes:Array(r).fill(2),cacheHint:e}),PA=(r,e,n,t)=>{let o=n[0].dims.slice();if(t>=o.length||t<-1*o.length)throw new Error("axis specified for concat doesn't match input dimensionality");t<0&&(t=o.length+t);let i=o.slice(0);for(let P=1;P<n.length;P++){let C=n[P].dims.slice();for(let R=0;R<o.length;R++)if(R===t)i[t]+=C[R];else if(o[R]!==C[R])throw new Error("non concat dimensions must match")}let a=i.length,s=ro("coords",a),u=yt(a),l=Mn(),d=n.map(P=>P.dims),p=Xt(a),h=new Array(d.length-1);h[0]=d[0][t];for(let P=1;P<h.length;P++)h[P]=h[P-1]+d[P][t];let g=p[t],b=p.slice(-2),_=p.join(),I=`if (${g} < ${h[0]}) {
        return getChannel(
            getX0(${_}), vec2(${b.join()}));
        }`;for(let P=1;P<h.length;P++){let C=h[P-1];I+=`
            if (${g} < ${h[P]}  && ${g} >= ${h[P-1]}) {
              return getChannel(
                getX${P}(${Wi(p,g,C)}),
                vec2(${Wi(b,g,C)}));
            }`}let w=h.length,v=h[h.length-1];I+=`
            return getChannel(
              getX${w}(${Wi(p,g,v)}),
              vec2(${Wi(b,g,v)}));`;let $=se(r.session.backend.glContext.version),A=`
          ${l}
          float getValue(${p.map(P=>"int "+P)}) {
            ${I}
          }

          void main() {
            ${u} coords = getOutputCoords();
            int lastDim = coords.${p[a-1]};
            coords.${p[a-1]} = coords.${p[a-2]};
            coords.${p[a-2]} = lastDim;

            vec4 result = vec4(getValue(${s}), 0., 0., 0.);

            ${s[a-1]} = ${s[a-1]} + 1;
            if (${s[a-1]} < ${i[a-1]}) {
              result.g = getValue(${s});
            }

            ${s[a-2]} = ${s[a-2]} + 1;
            if (${s[a-2]} < ${i[a-2]}) {
              result.a = getValue(${s});
            }

            ${s[a-1]} = ${s[a-1]} - 1;
            if (${s[a-2]} < ${i[a-2]} &&
                ${s[a-1]} < ${i[a-1]}) {
              result.b = getValue(${s});
            }
            ${$.output} = result;
          }
        `;return{...e,output:{dims:i,type:n[0].type,textureType:2},shaderSource:A,hasMain:!0}},Wm=(r,e,n)=>{let t=OA(e.length,n.cacheKey);return{...t,get:()=>PA(r,t,e,n.axis)}},Wi=(r,e,n)=>{let t=r.indexOf(e);return r.map((i,a)=>a===t?`${i} - ${n}`:i).join()}});var qm,EA,CA,DA,jm,kA,NA,LA,Km,RA,Xm=N(()=>{"use strict";dt();Ae();Hm();qm=(r,e,n)=>(RA(e),r.session.pack&&e[0].dims.length>1?[r.run(Wm(r,e,n),e)]:[r.run(DA(r,e,n),e)]),EA=(r,e)=>({name:"Concat",inputNames:Array.from({length:r},(n,t)=>`X${t}`),inputTypes:Array(r).fill(0),cacheHint:e}),CA=(r,e,n,t)=>{let o=n[0].dims.slice();if(t>=o.length||t<-1*o.length)throw new Error("axis specified for concat doesn't match input dimensionality");t<0&&(t=o.length+t);let i=o.slice(0);for(let g=1;g<n.length;g++){let b=n[g].dims.slice();for(let _=0;_<o.length;_++)if(_===t)i[t]+=b[_];else if(o[_]!==b[_])throw new Error("non concat dimensions must match")}let a=i.length,s=new Array(n.length),u=0;for(let g=0;g<s.length;++g)u+=n[g].dims[t],s[g]=u;let l="";n.length<5?l=jm(s):l=kA(s);let d=NA(n.length,a),p=LA(s),h=`
        ${d}
        ${p}
        ${l}
        float process(int indices[${a}]) {
          int textureIndex = getTextureWhereDataResides (indices[${t}]);

          if(textureIndex != 0) {
            indices[${t}] = indices[${t}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;return{...e,output:{dims:i,type:n[0].type,textureType:0},shaderSource:h}},DA=(r,e,n)=>{let t=EA(e.length,n.cacheKey);return{...t,get:()=>CA(r,t,e,n.axis)}},jm=r=>`int getTextureWhereDataResides(int index) {
      ${r.map((n,t)=>`if(index<${n}) {return ${t};}
`).join("")}
    }`,kA=r=>jm(r),NA=(r,e)=>{let n=[`float fetchDataFromCorrectTexture(int textureIndex, int indices[${e}]) {`];for(let t=0;t<r;++t)t===0?n.push(`	if (textureIndex == ${t}) { return _X${t}(indices); }`):t===r-1?n.push(`	else { return _X${t}(indices); }`):n.push(`	else if (textureIndex == ${t}) { return _X${t}(indices); }`);return n.push("	}"),n.join(`
`)},LA=r=>{let e=["int getSizeInConcatAxisValueFromIndex(int index) {"];for(let n=0;n<r.length;++n)n===0?e.push(`	if (index == ${n}) { return ${r[n]}; }`):n===r.length-1?e.push(`	else { return ${r[n]}; }`):e.push(`	else if (index == ${n}) { return ${r[n]}; }`);return e.push("	}"),e.join(`
`)},Km=r=>we({axis:r.attributes.getInt("axis")}),RA=r=>{if(!r||r.length<1)throw new Error("too few inputs");let e=r[0].type,n=r[0].dims.length;if(e==="string")throw new Error("string tensor is not supported yet");for(let t of r){if(t.type!==e)throw new Error("input tensors should be one type");if(t.dims.length!==n)throw new Error("input tensors should have the same shape")}}});function zA(){return Ft("abs")}function MA(){return Ft("acos")}function BA(){return Ft("asin")}function FA(){return Ft("atan")}function VA(){return Ft("ceil")}function GA(){return Ft("cos")}function UA(r){let e="elu";return{body:`
  const float alpha = float(${r});

  float ${e}_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 ${e}_(vec4 v) {
    return vec4(${e}_(v.x), ${e}_(v.y), ${e}_(v.z), ${e}_(v.w));
  }
  `,name:e,type:0}}function WA(){return Ft("exp")}function HA(){return Ft("floor")}function $l(r,e){let n="clip";return{body:`
  const float min = float(${r});
  const float max = float(${e});

  float ${n}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${n}_(vec4 v) {
    return clamp(v, min, max);
  }
  `,name:n,type:0}}function qA(){let r="indentity";return{body:`
  float ${r}_(float a) {
    return a;
  }
  vec4 ${r}_(vec4 v) {
    return v;
  }
  `,name:r,type:0}}function jA(r){let e="leakyRelu";return{body:`
  const float alpha = float(${r});

  float ${e}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${e}_(vec4 v) {
    return vec4(${e}_(v.x), ${e}_(v.y), ${e}_(v.z), ${e}_(v.w));
  }
  `,name:e,type:0}}function KA(){return Ft("log")}function XA(){let r="neg";return{body:`
  float ${r}_(float a) {
    return -a;
  }
  vec4 ${r}_(vec4 v) {
    return -v;
  }
  `,name:r,type:0}}function ZA(){let r="not";return{body:`
  float ${r}_(float a) {
    return float( ! bool(a) );
  }
  bool ${r}_(bool a) {
    return !a;
  }
  vec4 ${r}_(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 ${r}_(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `,name:r,type:0}}function JA(){return Ft("sin")}function Al(){let r="relu";return{body:`
  float ${r}_(float a) {
    return max( a, 0.0 );
  }
  vec4 ${r}_(vec4 v) {
    return max( v, 0.0 );
  }
  `,name:r,type:0}}function Ol(){let r="sigmoid";return{body:`
  float ${r}_(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${r}_(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `,name:r,type:0}}function QA(){return Ft("sqrt")}function YA(){return Ft("tan")}function eO(){let r="tanh";return{body:`
  float ${r}_(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${r}_(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `,name:r,type:0}}function Ft(r){return{body:`
  float ${r}_(float a) {
    return ${r}(a);
  }
  vec4 ${r}_(vec4 v) {
    return ${r}(v);
  }
  `,name:r,type:0}}var tO,nt,Zm,Jm,Qm,Ym,Pl,eg,tg,nO,ng,rg,og,ig,ag,sg,El,ug,lg,cg,dg,pg,fg,hg,mg,gg,bg,yg,Cl=N(()=>{"use strict";dt();ze();Qn();Je();Ae();tO=(r,e,n,t)=>{let o=r.session.pack?2:0,i=se(r.session.backend.glContext.version);return{...e,output:{dims:n.dims,type:n.type,textureType:o},shaderSource:`
     ${t.body}
     void main() {
       vec4 v = ${i.texture2D}(A, TexCoords);
       v = ${t.name}_(v);
       ${i.output} = v;
     }
     `,hasMain:!0}},nt=(r,e,n,t)=>{let o=r.session.pack?2:0,i={name:n.name,inputTypes:[o],inputNames:["A"],cacheHint:t};return{...i,get:()=>tO(r,i,e,n)}},Zm=(r,e)=>[r.run(nt(r,e[0],zA()),e)],Jm=(r,e)=>[r.run(nt(r,e[0],MA()),e)],Qm=(r,e)=>[r.run(nt(r,e[0],BA()),e)],Ym=(r,e)=>[r.run(nt(r,e[0],FA()),e)],Pl=(r,e,n)=>[r.run(nt(r,e[0],$l(n.min,n.max),n.cacheKey),e)],eg=r=>we({min:r.attributes.getFloat("min",Nr),max:r.attributes.getFloat("max",Lr)}),tg=(r,e)=>{let n=nO(r,e);return Pl(r,[e[0]],n)},nO=(r,e)=>{if(e.length>=3&&(!r.session.isInitializer(e[1].dataId)||!r.session.isInitializer(e[2].dataId)))throw new Error("dynamic clip attributes are not allowed");let n=e.length>=3?e[1].numberData[0]:Nr,t=e.length>=3?e[2].numberData[0]:Lr;return we({min:n,max:t})},ng=(r,e)=>[r.run(nt(r,e[0],VA()),e)],rg=(r,e)=>[r.run(nt(r,e[0],GA()),e)],og=(r,e,n)=>[r.run(nt(r,e[0],UA(n.alpha),n.cacheKey),e)],ig=r=>we({alpha:r.attributes.getFloat("alpha",1)}),ag=(r,e)=>[r.run(nt(r,e[0],WA()),e)],sg=(r,e)=>[r.run(nt(r,e[0],HA()),e)],El=(r,e)=>[r.run(nt(r,e[0],qA()),e)],ug=(r,e,n)=>[r.run(nt(r,e[0],jA(n.alpha),n.cacheKey),e)],lg=r=>we({alpha:r.attributes.getFloat("alpha",.01)}),cg=(r,e)=>[r.run(nt(r,e[0],KA()),e)],dg=(r,e)=>[r.run(nt(r,e[0],XA()),e)],pg=(r,e)=>[r.run(nt(r,e[0],ZA()),e)],fg=(r,e)=>[r.run(nt(r,e[0],Al()),e)],hg=(r,e)=>[r.run(nt(r,e[0],Ol()),e)],mg=(r,e)=>[r.run(nt(r,e[0],JA()),e)],gg=(r,e)=>[r.run(nt(r,e[0],QA()),e)],bg=(r,e)=>[r.run(nt(r,e[0],YA()),e)],yg=(r,e)=>[r.run(nt(r,e[0],eO()),e)]});function Bn(r){let e;switch(r.activation){case"Relu":e=Al();break;case"Sigmoid":e=Ol();break;case"Clip":e=$l(r.clipMin,r.clipMax);break;default:return{activationFunction:"",applyActivation:""}}let n=e.name,t=e.body,o=`value = ${n}_(value);`;return{activationFunction:t,applyActivation:o}}var oo,Mr=N(()=>{"use strict";ze();Cl();oo=r=>{let e=r.getString("activation","");if(e==="Clip"){let[n,t]=r.getFloats("activation_params",[Nr,Lr]);return{activation:e,clipMax:t,clipMin:n,activationCacheKey:`${e}:${n},${t}`}}return{activation:e,activationCacheKey:e}}});var oO,iO,_g,wg=N(()=>{"use strict";Dt();Je();Ae();Hi();Mr();oO=(r,e)=>({name:"GroupedConv",inputNames:r?["X","W","Bias"]:["X","W"],inputTypes:r?[0,0,0]:[0,0],cacheHint:e}),iO=(r,e,n,t)=>{let i=e.length>2?"value += getBias(output_channel);":"",a=e[0].dims.slice(),s=e[1].dims.slice(),u=s[0]/t.group;Be.verbose("GroupedConv",`autpPad:${t.autoPad}, dilations:${t.dilations}, group:${t.group}, kernelShape:${t.kernelShape}, pads:${t.pads}, strides:${t.strides}`);let l=io(a,s,t.dilations,t.pads,t.strides),d=se(r.session.backend.glContext.version),{activationFunction:p,applyActivation:h}=Bn(t),g=`
  const ivec2 strides = ivec2(${t.strides[0]}, ${t.strides[1]});
  const ivec2 pads = ivec2(${t.pads[0]}, ${t.pads[1]});
  ${p}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${u};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${s[1]}; wInChannel++) {
      int input_channel = group_id * ${s[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${s[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${t.dilations[0]};

        if (xHeight < 0 || xHeight >= ${a[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${s[3]}; wWidth++) {
          int xWidth = xRCCorner.y + wWidth * ${t.dilations[1]};
          if (xWidth < 0 || xWidth >= ${a[3]}) {
            continue;
          }

          float xVal = getX(batch, input_channel, xWidth, xHeight);
          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);
          value += xVal*wVal;
        }
      }
    }
    ${i}
    ${h}
    ${d.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:l,type:e[0].type,textureType:0},shaderSource:g,hasMain:!0}},_g=(r,e,n)=>{let t=oO(e.length>2,n.cacheKey);return{...t,get:()=>iO(r,e,t,n)}}});var aO,sO,vg,xg=N(()=>{"use strict";Je();Ae();zr();aO=r=>({name:"Im2Col (packed)",inputNames:["A"],inputTypes:[2],cacheHint:r}),sO=(r,e,n,t,o,i)=>{let a=n.dims,s=t.dims,u=2,l=3,d=o.length,p=[s[1]*s[2]*s[3],o[2]*o[3]],h=s[2]*s[3],g=Mn(),b=se(r.session.backend.glContext.version),_="";for(let w=0;w<=1;w++)for(let v=0;v<=1;v++)_+=`
            blockIndex = rc.x + ${v};
            pos = rc.y + ${w};

            if(blockIndex < ${p[1]} && pos < ${p[0]}) {
              offsetY = int(blockIndex / (${o[d-1]})) * ${i.strides[0]} -
                ${i.pads[0]};
              d0 = offsetY + ${i.dilations[0]} * (imod(pos, ${h}) / ${s[2]});

              if(d0 < ${a[u]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${o[d-1]}) * ${i.strides[1]} -
                  ${i.pads[1]};
                d1 = offsetX + ${i.dilations[1]} * imod(imod(pos, ${h}), ${s[2]});

                if(d1 < ${a[l]} && d1 >= 0) {

                  ch = int(float(pos)/ ${h}.);
                    innerDims = vec2(d0, d1);
                    result[${w*2+v}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;let I=`
      ${g}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${_}
          ${b.output} = result;
      }
            `;return{...e,output:{dims:p,type:n.type,textureType:2},shaderSource:I,hasMain:!0}},vg=(r,e,n,t,o)=>{let i=aO(o.cacheKey);return{...i,get:()=>sO(r,i,e,n,t,o)}}});function lO(r,e,n){let t=e[0].dims,o=e[1].dims,i=bt.calcShape(t,o,!0);if(!i)throw new Error("Can't use matmul on the given tensors");let a=yt(i.length),s=Xt(),{activationFunction:u,applyActivation:l}=Bn(n),d=e.length>2,p=d?"value += getBiasForMatmul();":"",h=d?`${kl(a,s,e[2].dims,i,!1)}`:"",g=i.length,b=t.length,_=o.length,I=t[t.length-1],w=`
    ${u}
    ${h}
    float process(int indices[${g}]) {
        int a[${b}];
        int b[${_}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${I}; ++k) {
            a[${b-1}] = k;
            b[${_-2}] = k;
            value += _A(a) * _B(b);
        }
        ${p}
        ${l}
        return value;
    }`;return{...r,output:{dims:i,type:e[0].type,textureType:0},shaderSource:w}}function Dl(r,e){let n=uO(r.length>2,e.activationCacheKey);return{...n,get:()=>lO(n,r,e)}}function kl(r,e,n,t,o){let i="",a=n.length,s=t.length,u=s-a;s<2&&a>0?i="coords":i=n.map((_,I)=>`coords.${e[I+u]}`).join(", ");let d=bt.getBroadcastDims(n,t).map(_=>`coords.${e[_+u]} = 0;`).join(`
`),h=ne.size(n)===1,g="vec4(outputValue.xx, outputValue.yy)";return h&&(g="vec4(outputValue.x)"),o?`
vec4 getBiasForMatmul() {
  ${r} coords = getOutputCoords();
  ${d}
  vec4 outputValue = getBias(${i});
  return ${g};
}`:`
float getBiasForMatmul() {
  ${r} coords = getOutputCoords();
  ${d}
  return getBias(coords.x);
}`}var Tg,Ig,uO,cO,qi=N(()=>{"use strict";ze();Ae();zn();Mr();Nl();Tg=(r,e,n)=>(cO(e),r.session.pack?[r.run(ji(r,e,n),e)]:[r.run(Dl(e,n),e)]),Ig=r=>oo(r.attributes),uO=(r,e)=>({name:"MatMul",inputNames:r?["A","B","Bias"]:["A","B"],inputTypes:r?[0,0,0]:[0,0],cacheHint:e});cO=r=>{if(!r||r.length!==2)throw new Error("MatMul requires 2 inputs.");if(r[0].dims[r[0].dims.length-1]!==r[1].dims[r[1].dims.length-2])throw new Error("shared dimension does not match.");if(r[0].type!=="float32"&&r[0].type!=="float64"||r[1].type!=="float32"&&r[1].type!=="float64")throw new Error("inputs should be float type");if(r[0].type!==r[1].type)throw new Error("inputs types should match")}});function fO(r,e,n,t){let o=[],i=[],a=n[0].dims,s=n[1].dims,u=a.length,l=s.length,d=t.length,p=d-u,h=d-l;o=a.map(($,A)=>`coords.${e[A+p]}`),o[u-1]="i*2",o.join(", "),i=s.map(($,A)=>`coords.${e[A+h]}`),i[l-2]="i*2",i.join(", ");let g=bt.getBroadcastDims(a,t),b=bt.getBroadcastDims(s,t),_=g.map($=>`coords.${e[$+p]} = 0;`).join(`
`),I=b.map($=>`coords.${e[$+h]} = 0;`).join(`
`),w=`int lastDim = coords.${e[d-1]};
  coords.${e[d-1]} = coords.${e[d-2]};
  coords.${e[d-2]} = lastDim;`;return`
vec4 getAAtOutCoordsMatmul(int i) {
  ${r} coords = getOutputCoords();
  ${w}
  ${_}
  vec4 outputValue = getA(${o});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${r} coords = getOutputCoords();
  ${w}
  ${I}
  vec4 outputValue = getB(${i});
  return outputValue;
}`}function hO(r,e){let n="";for(let t=0;t<e-2;t++)n+=`rc.${r[t]}, `;return n+=`rc.${r[e-2]}, i*2`,n}function mO(r,e){let n="";for(let t=0;t<e-2;t++)n+=`rc.${r[t]}, `;return n+=`i*2, rc.${r[e-1]}`,n}var dO,pO,ji,Nl=N(()=>{"use strict";ze();Je();Ae();zn();Mr();qi();dO=(r,e)=>({name:"MatMul (packed)",inputNames:r?["A","B","Bias"]:["A","B"],inputTypes:r?[2,2,2]:[2,2],cacheHint:e}),pO=(r,e,n,t)=>{let o=n.length>2,i=o?"value += getBiasForMatmul();":"",a=n[0].dims,s=n[1].dims,u=bt.calcShape(a,s,!0),l=!ne.areEqual(n[0].dims,n[1].dims);if(!u)throw new Error("Can't use matmul on the given tensors");let d=a[a.length-1],p=Math.ceil(d/2),h=a.length,g=s.length,b=se(r.session.backend.glContext.version),_=yt(u.length),I=u.length,w=Xt(),{activationFunction:v,applyActivation:$}=Bn(t),A=o?`${kl(_,w,n[2].dims,u,!0)}`:"",P=l?`${fO(_,w,n,u)}`:"",C=l?"getAAtOutCoordsMatmul(i)":`getA(${hO(w,h)})`,R=l?"getBAtOutCoordsMatmul(i)":`getB(${mO(w,g)})`,x=l?"":`${_} rc =
          getOutputCoords(); int lastDim = rc.${w[I-1]}; rc.${w[I-1]} =
          rc.${w[I-2]}; rc.${w[I-2]} = lastDim;
      `,B=`
            ${P}
            ${A}
            ${v}
            void main() {
              ${x}

              vec4 value = vec4(0);
              for (int i = 0; i < ${p}; i++) {
                vec4 a = ${C};
                vec4 b = ${R};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${i}
              ${$}
              ${b.output} = value;
            }`;return{...e,output:{dims:u,type:n[0].type,textureType:2},shaderSource:B,hasMain:!0}},ji=(r,e,n)=>{let t=dO(e.length>2,n.activationCacheKey);return{...t,get:()=>pO(r,t,e,n)}}});var Sg,$g=N(()=>{"use strict";Hi();xg();Nl();Sg=(r,e,n)=>{let t=e[0].dims,o=e[1].dims,i=io(t,o,n.dilations,n.pads,n.strides),a=r.run(vg(r,e[0],e[1],i,n),[e[0]]),s=r.reshapePacked(e[1],[o[0],o[1]*o[2]*o[3]]),u=e.length===3?[s,a,e[2]]:[s,a],l=r.run(ji(r,u,n),u);return r.reshapePacked(l,i)}});var gO,bO,Ag,Ll,Rl=N(()=>{"use strict";Ae();gO=r=>({name:"Im2Col",inputNames:["X"],inputTypes:[0],cacheHint:r}),bO=(r,e,n,t,o,i)=>{let a=n.dims,s=t.dims,u=o.length,l=Ll(a,s,o,4),d=`
        const int XC = ${a[1]};
        const int XH = ${a[2]};
        const int XW = ${a[3]};
        const int KH = ${i.kernelShape[0]};
        const int KW = ${i.kernelShape[1]};
        const int dilationH = ${i.dilations[0]};
        const int dilationW = ${i.dilations[1]};
        const int strideH = ${i.strides[0]};
        const int strideW = ${i.strides[1]};
        const int padH = ${i.pads[0]};
        const int padW = ${i.pads[1]};
        const int KHKW = KH*KW;
        const int XCKHKW = XC * KHKW;
        const int outputChannels = 4;
        vec4 process(int indices[${u}]) {
          int b  = indices[0]; // batch size
          int oh = indices[1] * strideH - padH; //output height
          int ow = indices[2] * strideW - padW; //output width
          int p = indices[3] * outputChannels; //patch
          vec4 value = vec4(0.0);
          for(int i=0; i < outputChannels; ++i) {
            if(p < XCKHKW) {
              int patchC = p / KHKW;
              int patchH = (p - patchC*KHKW) / KW;
              int patchW = (p - patchC*KHKW) - patchH * KW;
              int xh2 = oh + patchH * dilationH;
              int xw2 = ow + patchW * dilationW;
              int x[${a.length}];
              x[0] = b;
              x[1] = patchC;
              x[2] = xh2;
              x[3] = xw2;
              if(xh2 >= 0 &&
                  xh2 < XH &&
                  xw2 >= 0 &&
                  xw2 < XW) {
                value[i] = _X(x);
              }
            }
            ++p;
          }
          return value;
        }
        `;return{...e,output:{dims:l,type:n.type,textureType:4},shaderSource:d}},Ag=(r,e,n,t,o)=>{let i=gO(o.cacheKey);return{...i,get:()=>bO(r,i,e,n,t,o)}},Ll=(r,e,n,t=4)=>[n[0],n[2],n[3],Math.ceil(r[1]*e[2]*e[3]/t)]});var yO,_O,Og,Pg=N(()=>{"use strict";ze();Je();Ae();Mr();Rl();yO=(r,e)=>({name:"ConvDotProduct",inputNames:r?["Im2Col","K","B"]:["Im2Col","K"],inputTypes:r?[0,4,0]:[0,4],cacheKey:e.activationCacheKey}),_O=(r,e,n,t,o)=>{let i=n[0].dims,a=n[1].dims,s=[a[0],Math.ceil(i[1]*a[2]*a[3]/4)],u=Ll(i,a,t),[l,d]=r.calculateTextureWidthAndHeight(s,4),p=ne.computeStrides(u),[h,g]=r.calculateTextureWidthAndHeight(u,4),b=t.length,_=n.length<3?"0.0":"_B(b)",I=Math.ceil(i[1]*a[2]*a[3]/4),{activationFunction:w,applyActivation:v}=Bn(o),$=se(r.session.backend.glContext.version),A=`
${w}
float process(int indices[${b}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${p[0]} + im2col[1] * ${p[1]} + im2col[2] * ${p[2]};
  int kernelOffset = indices[1] * ${s[1]};
  float value = ${_};
  for (int i = 0; i < ${I}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${h}, ${g});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${l}, ${d});
    value += dot(${$.texture2D}(Im2Col, im2colCoords), ${$.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${v}
  return value;
}`;return{...e,output:{dims:t,type:n[0].type,textureType:0},shaderSource:A}},Og=(r,e,n,t)=>{let o=yO(e.length>2,t);return{...o,get:()=>_O(r,o,e,n,t)}}});var io,zl,wO,vO,xO,TO,Ml,IO,Hi=N(()=>{"use strict";dt();ze();wg();$g();Pg();Mr();Rl();qi();io=(r,e,n,t,o)=>{let i=r[0],a=r.slice(2),s=a.length,u=e[0],d=e.slice(2).map((b,_)=>b+(b-1)*(n[_]-1)),h=a.map((b,_)=>b+t[_]+t[_+s]).map((b,_)=>Math.floor((b-d[_]+o[_])/o[_]));return[i,u].concat(...h)},zl=(r,e,n)=>(IO(e,n),wO(r,e,n)),wO=(r,e,n)=>{let t=TO(n,e),o=r.session.pack,i=t.kernelShape[0]===1&&t.kernelShape[1]===1;return t.group>1?[r.run(_g(r,e,t),e)]:i&&o?[vO(r,e,t)]:o&&e[0].dims.length===4&&e[0].dims[0]===1&&!i?[Sg(r,e,t)]:[xO(r,e,t)]},vO=(r,e,n)=>{let t=e[0].dims,o=e[1].dims,i=io(t,o,n.dilations,n.pads,n.strides),a=r.reshapeUnpacked(e[0],[t[1],t[2]*t[3]]),s=r.reshapeUnpacked(e[1],[o[0],o[1]]),u=e.length>2?[s,a,e[2]]:[s,a],l=r.run(Dl(u,n),u);return r.reshapeUnpacked(l,i)},xO=(r,e,n)=>{let t=e[0].dims,o=e[1].dims,i=io(t,o,n.dilations,n.pads,n.strides),a=r.run(Ag(r,e[0],e[1],i,n),[e[0]]),s=e.length===3?[a,e[1],e[2]]:[a,e[1]];return r.run(Og(r,e,i,n),s)},TO=(r,e)=>{let n=r.kernelShape.slice();if(r.kernelShape.length===0)for(let i=2;i<e[1].dims.length;++i)n.push(e[1].dims[i]);let t=r.pads.slice();kr.adjustPadsBasedOnAutoPad(e[0].dims,r.strides,r.dilations,n,t,r.autoPad);let o=Object.assign({},r);return Object.assign(o,{kernelShape:n,pads:t,cacheKey:r.cacheKey}),o},Ml=r=>{let e=r.attributes,n=oo(e),t=e.getString("auto_pad","NOTSET"),o=e.getInts("dilations",[1,1]),i=e.getInt("group",1),a=e.getInts("kernel_shape",[]),s=e.getInts("pads",[0,0,0,0]),u=e.getInts("strides",[1,1]);return we({autoPad:t,dilations:o,group:i,kernelShape:a,pads:s,strides:u,...n})},IO=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length!==4||r[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=r[0].dims[1],t=r[1].dims[1]*e.group;if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(r.length===3&&(r[2].dims.length!==1||r[1].dims[0]!==r[2].dims[0]))throw new Error("invalid bias");let o=r[0].dims.length-2;if(e.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(e.strides.length!==o)throw new Error(`strides should be ${o}D`);if(e.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape");if(r[0].type!=="float32"||r[1].type!=="float32")throw new Error("Conv input(X,W) should be float tensor");if(r.length===3&&r[2].type!=="float32")throw new Error("Conv input(bias) should be float tensor")}});var SO,$O,AO,Eg,OO,PO,EO,CO,DO,kO,Cg,NO,Dg=N(()=>{"use strict";dt();Je();Ae();Mr();SO=(r,e,n,t,o,i)=>(r-1)*e+n+(t-1)*o+1-i,$O=(r,e,n,t,o)=>{let i=Math.floor(r/2);e==="SAME_UPPER"?(n[t]=i,n[o]=r-i):e==="SAME_LOWER"&&(n[t]=r-i,n[o]=i)},AO=(r,e,n,t,o,i,a,s)=>{let u=r.length-2,l=s.length===0;for(let d=0;d<u;++d){let p=l?r[d+2]*i[d]:s[d],h=SO(r[d+2],i[d],o[d],e[d],n[d],p);$O(h,t,o,d,d+u),l&&s.push(i[d]*(r[d+2]-1)+a[d]+(e[d]-1)*n[d]+1-o[d]-o[d+u])}},Eg=(r,e,n)=>(NO(e,n),OO(r,e,n)),OO=(r,e,n)=>{let t=kO(n,e);return[DO(r,e,t)]},PO=(r,e)=>({name:"ConvTranspose",inputNames:r?["X","W","B"]:["X","W"],inputTypes:r?[0,0,0]:[0,0],cacheHint:e}),EO=(r,e,n,t)=>{let i=e.length>2?"getB(output_channel)":"0.0",a=e[0].dims,s=e[1].dims,u=s[1],l=s[0]/t.group,d=[e[0].dims[0],e[1].dims[1]*t.group,...t.outputShape],p=se(r.session.backend.glContext.version),{activationFunction:h,applyActivation:g}=Bn(t),b=`
  const ivec2 strides = ivec2(${t.strides[0]}, ${t.strides[1]});
  const ivec2 pads = ivec2(${t.pads[0]}, ${t.pads[1]});
  ${h}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${u};
    int wOutChannel = output_channel - group_id * ${u};

    float value = ${i};
    for (int inChannelOffset = 0; inChannelOffset < ${l}; inChannelOffset++) {
      int input_channel = group_id * ${l} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${s[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${s[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${t.dilations[0]}, wHOff * ${t.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${a[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${a[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${g}
    ${p.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:d,type:e[0].type,textureType:0},shaderSource:b,hasMain:!0}},CO=(r,e,n)=>{let t=PO(e.length>2,n.cacheKey);return{...t,get:()=>EO(r,e,t,n)}},DO=(r,e,n)=>r.run(CO(r,e,n),e),kO=(r,e)=>{let n=r.kernelShape.slice();if(r.kernelShape.length===0)for(let s=2;s<e[1].dims.length;++s)n.push(e[1].dims[s]);let t=r.pads.slice(),o=r.outputShape.slice(),i=e[0].dims;AO(i,n,r.dilations,r.autoPad,t,r.strides,r.outputPadding,o);let a=Object.assign({},r);return Object.assign(a,{kernelShape:n,pads:t,outputShape:o,cacheKey:r.cacheKey}),a},Cg=r=>{let e=r.attributes,n=oo(e),t=e.getString("auto_pad","NOTSET"),o=e.getInts("dilations",[1,1]),i=e.getInt("group",1),a=e.getInts("kernel_shape",[]),s=e.getInts("output_padding",[0,0]),u=e.getInts("output_shape",[]),l=e.getInts("pads",[0,0,0,0]),d=e.getInts("strides",[1,1]);return we({autoPad:t,dilations:o,group:i,kernelShape:a,outputPadding:s,outputShape:u,pads:l,strides:d,...n})},NO=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length!==4||r[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=r[0].dims[1],t=r[1].dims[0];if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=r[1].dims[1]*e.group;if(r.length===3&&(r[2].dims.length!==1||r[2].dims[0]!==o))throw new Error("invalid bias");let i=r[0].dims.length-2;if(e.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(e.strides.length!==i)throw new Error(`strides should be ${i}D`);if(e.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(e.outputPadding.length!==i)throw new Error(`output_padding should be ${i}D`);if(e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape");if(e.outputShape.length!==0&&e.outputShape.length!==r[0].dims.length-2)throw new Error("invalid output shape");if(r[0].type!=="float32"||r[1].type!=="float32")throw new Error("ConvTranspose input(X,W) should be float tensor");if(r.length===3&&r[2].type!=="float32")throw new Error("ConvTranspose input(bias) should be float tensor")}});var kg,Br,Ng,LO,Lg,RO,zO,MO,Ki=N(()=>{"use strict";dt();ze();Ae();kg={name:"Transpose",inputNames:["A"],inputTypes:[0]},Br=(r,e,n)=>(MO(e),[r.run({...kg,cacheHint:n.cacheKey,get:()=>LO(r,e[0],n.perm)},e)]),Ng=r=>we({perm:r.attributes.getInts("perm",[])}),LO=(r,e,n)=>{let t=e.dims;n=Lg(t,n);let o=RO(t,n),i=t.length,a=`
      ${zO("perm",n,i)}
      float process(int indices[${i}]) {
        int a[${i}];
        perm(a, indices);
        return _A(a);
      }`;return{...kg,output:{dims:o,type:e.type,textureType:0},shaderSource:a}},Lg=(r,e)=>(e&&e.length!==r.length&&(e=[...r.keys()].reverse()),e),RO=(r,e)=>(e=Lg(r,e),ne.sortBasedOnPerm(r,e)),zO=(r,e,n)=>{let t=[];t.push(`void ${r}(out int a[${n}], int src[${n}]) {`);for(let o=0;o<n;++o)t.push(`	a[${e[o]}]=src[${o}];`);return t.push("	}"),t.join(`
`)},MO=r=>{if(!r||r.length!==1)throw new Error("Transpose requires 1 input.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("input should be float tensor")}});var Rg,zg,BO,Mg=N(()=>{"use strict";Ki();Rg=(r,e,n)=>{BO(e);let t=n.blocksize,o=t*t,i=n.mode==="DCR"?[0,3,4,1,5,2]:[0,1,4,2,5,3],a=n.mode==="DCR"?[e[0].dims[0],t,t,e[0].dims[1]/o,e[0].dims[2],e[0].dims[3]]:[e[0].dims[0],e[0].dims[1]/o,t,t,e[0].dims[2],e[0].dims[3]],s=r.reshapeUnpacked(e[0],a),u={perm:i,cacheKey:`${i}`},[l]=Br(r,[s],u),d=[e[0].dims[0],e[0].dims[1]/o,e[0].dims[2]*t,e[0].dims[3]*t];return[r.reshapeUnpacked(l,d)]},zg=r=>{let e=r.attributes.getInt("blocksize");if(e<1)throw new Error(`blocksize must be >= 1, but got : ${e} for DepthToSpace`);let n=r.attributes.getString("mode","DCR");if(n!=="DCR"&&n!=="CRD")throw new Error(`unrecognized mode: ${n} for DepthToSpace`);return{mode:n,blocksize:e}},BO=r=>{if(r.length!==1)throw new Error(`DepthToSpace expect 1 inputs, but got ${r.length}`);if(r[0].type==="string"||r[0].dims.length!==4)throw new TypeError("DepthToSpace input should be a 4-D numeric tensor")}});var Bg,Fg,FO,Vg=N(()=>{"use strict";ze();Bg=(r,e,n)=>{FO(e,n);let t=ne.flattenShape(e[0].dims,n);return[r.reshapeUnpacked(e[0],t)]},Fg=r=>r.attributes.getInt("axis",1),FO=(r,e)=>{if(!r||r.length!==1)throw new Error("Flatten requires 1 input.");let n=r[0].dims.length;if(n===0)throw new Error("scalar tensor is not supported.");if(e<-n||e>n)throw new Error("Invalid axis");if(r[0].type==="string")throw new Error("string tensor is not supported.")}});var mr,Lo=N(()=>{"use strict";mr=["float32","float64","int32","int16","int8","uint16","uint32","uint8"]});var Gg,Ug,VO,GO,UO,WO,Wg=N(()=>{"use strict";dt();Lo();ze();Ae();Gg=(r,e,n)=>(WO(e,n.axis),[r.run(UO(r,e,n),e)]),Ug=r=>we({axis:r.attributes.getInt("axis",0)}),VO={name:"Gather",inputNames:["A","B"],inputTypes:[0,0]},GO=(r,e,n,t)=>{let o=n[0].dims.slice(),i=n[1].dims.slice(),a=new Array(o.length+i.length-1);t=ne.normalizeAxis(t,o.length);let s=[];for(let h=0;h<a.length;h++)h<t?(a[h]=o[h],s.push(`inputIdx[${h}] = outputIdx[${h}];`)):h<t+i.length?(a[h]=i[h-t],s.push(`indexDataIdx[${h-t}] = outputIdx[${h}];`)):(a[h]=o[h-i.length+1],s.push(`inputIdx[${h-i.length+1}] = outputIdx[${h}];`));let u=a.length||1,l=o.length,d=i.length||1,p=`
      float process(int outputIdx[${u}]) {
        int inputIdx[${l}];
        int indexDataIdx[${d}];
        indexDataIdx[0] = 0;
        ${s.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${t}] = idx < 0 ? idx + ${o[t]} : idx;
        return _A(inputIdx);
      }`;return{...e,output:{dims:a,type:n[0].type,textureType:0},shaderSource:p}},UO=(r,e,n)=>{let t={...VO,cacheHint:n.cacheKey};return{...t,get:()=>GO(r,t,e,n.axis)}},WO=(r,e)=>{if(!r||r.length!==2)throw new Error("Gather requires 2 inputs.");let n=r[0].dims.length;if(n<1)throw new Error("Invalid input shape.");if(e<-n||e>n-1)throw new Error("Invalid axis.");if(mr.indexOf(r[0].type)===-1)throw new Error("Invaid input type.");if(r[1].type!=="int32"&&r[1].type!=="int16")throw new Error("Invaid input type.")}});var Bl,Hg,qg,jg,HO,qO,jO,Kg=N(()=>{"use strict";dt();ze();Ae();Bl=(r,e,n)=>(jO(e,n),[r.run(HO(e,n),e)]),Hg=(r,e)=>{let n=r.attributes.getInt("transA",0)!==0,t=r.attributes.getInt("transB",0)!==0,o=r.attributes.getFloat("alpha",1),i=r.attributes.getFloat("beta",1);return we({transA:n,transB:t,alpha:o,beta:i,isOptionalC:e})},qg=r=>Hg(r,!1),jg=r=>Hg(r,!0),HO=(r,e)=>{let n={name:"Gemm",inputNames:r.length===3?["A","B","C"]:["A","B"],inputTypes:r.length===3?[0,0,0]:[0,0],key:e.cacheKey};return{...n,get:()=>qO(n,r,e)}},qO=(r,e,n)=>{let t=e[0].dims.slice(),o=e[1].dims.slice(),[i,a]=zi.getShapeOfGemmResult(t,n.transA,o,n.transB,e.length===3?e[2].dims:void 0),s=[i,a];if(!s)throw new Error("Can't use gemm on the given tensors");let u=t[t.length-1],l="";n.transA&&(u=t[0]),n.transA&&n.transB?l="value += _A_T(a) * _B_T(b);":n.transA&&!n.transB?l="value += _A_T(a) * _B(b);":!n.transA&&n.transB?l="value += _A(a) * _B_T(b);":!n.transA&&!n.transB&&(l="value += _A(a) * _B(b);");let d=s.length,p=e.length===3?`int c[${e[2].dims.length}];`:"",h=e.length===3?"bcastIndices_C(indices, c);":"",g=e.length===3?"value += beta * _C(c);":"",b=`
      float process(int indices[${d}]) {
          int a[${d}];
          int b[${d}];
          ${p}

          copyVec(indices, a);
          copyVec(indices, b);
          ${h}

          float value = 0.0;
          for (int k=0; k<${u}; ++k) {
              a[${d-1}] = k;
              b[${d-2}] = k;
              ${l}
          }

          value = value * alpha;
          ${g}
          return value;
      }`;return{...r,output:{dims:s,type:e[0].type,textureType:0},variables:[{name:"alpha",type:"float",data:n.alpha},{name:"beta",type:"float",data:n.beta}],shaderSource:b}},jO=(r,e)=>{if(!r)throw new Error("Input is missing");if(e.isOptionalC&&(r.length<2||r.length>3))throw new Error("Invaid input shape.");if(!e.isOptionalC&&r.length!==3)throw new Error("Gemm requires 3 inputs");if(r.length===3&&r[2].dims.length!==1&&r[2].dims.length!==2)throw new Error("Invalid input shape of C");if(r[0].type!=="float32"&&r[0].type!=="float64"||r[1].type!=="float32"&&r[1].type!=="float64"||r.length===3&&r[2].type!=="float32"&&r[2].type!=="float64")throw new Error("Invalid input type.");if(r[0].type!==r[1].type||r.length===3&&r[0].type!==r[2].type)throw new Error("Input types are mismatched")}});var Xg,Zg,KO,XO,ZO,JO,QO,Jg=N(()=>{"use strict";dt();Ae();Xg=(r,e,n)=>(QO(e),[r.run(ZO(r,e,n),e)]),Zg=r=>{let e=r.attributes.getFloat("scale"),n=r.attributes.getFloats("bias");return we({scale:e,bias:n})},KO={name:"ImageScaler",inputNames:["X"],inputTypes:[0]},XO=(r,e,n,t)=>{let o=n[0].dims.slice(),i=o.length,s=`
      ${JO(t.bias.length)}
      float process(int indices[${i}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;return{...e,output:{dims:o,type:n[0].type,textureType:0},variables:[{name:"bias",type:"float",arrayLength:t.bias.length,data:t.bias},{name:"scale",type:"float",data:t.scale}],shaderSource:s}},ZO=(r,e,n)=>{let t={...KO,cacheHint:n.cacheKey};return{...t,get:()=>XO(r,t,e,n)}},JO=r=>{let e=[`float getBias(float bias[${r}], int channel) {`];for(let n=0;n<r;++n)n===0?e.push(`	if (channel == ${n}) { return bias[${n}]; }`):n===r-1?e.push(`	else { return bias[${n}]; }`):e.push(`	else if (channel == ${n}) { return bias[${n}]; }`);return e.push("	}"),e.join(`
`)},QO=r=>{if(!r||r.length!==1)throw new Error("ImageScaler requires 1 input.");if(r[0].dims.length!==4)throw new Error("Invalid input shape.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.")}});var Yg,eb,Qg,YO,eP,tP,nP,rP,oP,tb=N(()=>{"use strict";Je();Ae();Yg=(r,e,n)=>{oP(e);let t=r.run(eP(e[0]),e);return[r.run(rP(r,e[0],n,t.dims),[e[0],t,e[1],e[2]])]},eb=r=>r.attributes.getFloat("epsilon",1e-5),Qg={name:"InstanceNormalization_MeanAndVariance",inputNames:["X"],inputTypes:[0]},YO=(r,e)=>{let n=e.dims.slice(),t=n[1],o=n[2]*n[3],i=[n[0],t],a=`
      vec4 process(int[2] indices) {
        vec4 v = vec4(0.0);
        int a[4];
        a[0] = indices[0];
        a[1] = indices[1];
        float temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += x;
          }
        }
        float mean = temp / float(${o});
        temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += (x - mean) * (x - mean);
          }
        }
        v.r = mean;
        v.g = temp / float(${o});

        return v;
      }`;return{...r,output:{dims:i,type:e.type,textureType:4},shaderSource:a}},eP=r=>({...Qg,get:()=>YO(Qg,r)}),tP={name:"InstanceNormalization_ComputeOutput",inputNames:["X","MeanAndVariance","Scale","B"],inputTypes:[0,4,0,0]},nP=(r,e,n,t,o)=>{let i=se(r.session.backend.glContext.version),[a,s]=r.calculateTextureWidthAndHeight(o,4),[u,l]=[a/4,s],d=`
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${u}, ${l});
        return ${i.texture2D}(MeanAndVariance, coords);
      }

      float process(int[4] indices) {
        int mv[2];
        mv[0] = indices[0];
        mv[1] = indices[1];
        vec4 mean_and_variance = get_MeanAndVariance(mv);
        float mean = mean_and_variance.r;
        float variance = mean_and_variance.g;

        int sb[1];
        sb[0] = indices[1];
        float scale = _Scale(sb);
        float b = _B(sb);

        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;
      }`;return{...e,output:{dims:n.dims,type:n.type,textureType:0},variables:[{name:"epsilon",type:"float",data:t}],shaderSource:d}},rP=(r,e,n,t)=>{let o={...tP,cacheHint:`${n}`};return{...o,get:()=>nP(r,o,e,n,t)}},oP=r=>{if(!r||r.length!==3)throw new Error("InstanceNormalization requires 3 inputs.");let e=r[0],n=r[1],t=r[2];if(e.dims.length<3||n.dims.length!==1||t.dims.length!==1)throw new Error("Invalid input shape.");if(n.dims[0]!==e.dims[1]||t.dims[0]!==e.dims[1])throw new Error("Input shapes are mismatched.");if(e.type!=="float32"&&e.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||t.type!=="float32"&&t.type!=="float64")throw new Error("Invalid input type.");if(r[0].dims.length!==4)throw new Error("Only support 4-D input shape.")}});function iP(r,e){let n=r[0].dims[1],t=r[0].dims.length,o=-Math.floor((e.size-1)/2),i=Math.ceil((e.size-1)/2),a=`float(${e.alpha}) / float(${e.size})`,s=`float(${e.bias})`,u=`float(${e.beta})`,l=`
    float process(int indices[${t}]) {
        int c = indices[1];
        float x = _X(indices);
        float square_sum = 0.0;

        for (int i = ${o}; i <= ${i}; i++) {
          int idx = c + i;
          if (c >= 0 && c < ${n}) {
            indices[1] = idx;
            float j = _X(indices);
            square_sum += j * j;
          }
        }
        return x / pow(${s} + ${a} * square_sum, ${u});
    }`;return{...ob,cacheHint:e.cacheKey,output:{dims:r[0].dims,type:r[0].type,textureType:0},shaderSource:l}}function aP(r,e){return{...ob,cacheHint:e.cacheKey,get:()=>iP(r,e)}}var nb,rb,ob,sP,ib=N(()=>{"use strict";dt();Ae();nb=(r,e,n)=>(sP(e),[r.run(aP(e,n),e)]),rb=r=>{let e=r.attributes.getFloat("alpha",1e-4),n=r.attributes.getFloat("beta",.75),t=r.attributes.getFloat("bias",1),o=r.attributes.getInt("size");return we({alpha:e,beta:n,bias:t,size:o})},ob={name:"LRN",inputNames:["X"],inputTypes:[0]};sP=r=>{if(!r||r.length!==1)throw new Error("LRN requires 1 input.");if(r[0].dims.length!==4)throw new Error('currently only support LRN for input with "NCHW" format');if(r[0].type!=="float32")throw new Error("input should be float type")}});var uP,Fl,ab,sb,ub,lP,cP,dP,pP,fP,hP,mP,gP,lb=N(()=>{"use strict";dt();ze();Je();Ae();uP={name:"Pad",inputNames:["A"],inputTypes:[0]},Fl=(r,e,n)=>(dP(e),[r.run({...uP,cacheHint:n.cacheKey,get:()=>cP(r,e[0],n)},e)]),ab=r=>{let e=r.attributes.getString("mode","constant"),n=r.attributes.getFloat("value",0),t=r.attributes.getInts("pads");return we({mode:e,value:n,pads:t})},sb=(r,e,n)=>{pP(e);let t=lP(r,e,n);return Fl(r,[e[0]],t)},ub=r=>r.attributes.getString("mode","constant"),lP=(r,e,n)=>{if(!r.session.isInitializer(e[1].dataId)||e.length>=3&&!r.session.isInitializer(e[2].dataId))throw new Error("dynamic pad attributes are not allowed");let t=Array.from(e[1].integerData),o=e.length>=3?e[2].floatData[0]:0;return we({mode:n,pads:t,value:o})},cP=(r,e,n)=>{let t=ne.padShape(e.dims.slice(),n.pads),o=t.length,a=`
      ${fP(r,e,n)}
      float process(int[${o}] indices) {
          return padA(indices);
      }`;return{name:"Pad",inputNames:["A"],inputTypes:[0],output:{dims:t,type:e.type,textureType:0},shaderSource:a}},dP=r=>{if(!r||r.length!==1)throw new Error("Pad requires 1 input");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.")},pP=r=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Pad requires 2 or 3 inputs");if(r[1].type!=="int32")throw new Error("Invalid input type.");if(r.length>=3&&r[2].type==="string")throw new Error("Invalid input type.")},fP=(r,e,n)=>{let t=se(r.session.backend.glContext.version),[o,i]=r.calculateTextureWidthAndHeight(e.dims,0),a=ne.computeStrides(e.dims);switch(n.mode){case"constant":return hP(t,e.dims,a,o,i,n.pads,n.value);case"reflect":return mP(t,e.dims,a,o,i,n.pads);case"edge":return gP(t,e.dims,a,o,i,n.pads);default:throw new Error("Invalid mode")}},hP=(r,e,n,t,o,i,a)=>{let s=e.length,u="";for(let l=s-1;l>=0;--l)u+=`
        k = m[${l}] - ${i[l]};
        if (k < 0)  return constant;
        if (k >= ${e[l]}) return constant;
        offset += k * ${n[l]};
        `;return`
      float padA(int m[${s}]) {
        const float constant = float(${a});
        int offset = 0;
        int k = 0;
        ${u}
        vec2 coords = offsetToCoords(offset, ${t}, ${o});
        float value = getColorAsFloat(${r.texture2D}(A, coords));
        return value;
      }
      `},mP=(r,e,n,t,o,i)=>{let a=e.length,s="";for(let u=a-1;u>=0;--u)s+=`
        k = m[${u}] - ${i[u]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2*(e[u]-1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${e[u]}) { k = _2n_1 - k; }
        }
        offset += k * ${n[u]};
        `;return`
      float padA(int m[${a}]) {
        int offset = 0;
        int k = 0;
        ${s}
        vec2 coords = offsetToCoords(offset, ${t}, ${o});
        float value = getColorAsFloat(${r.texture2D}(A, coords));
        return value;
      }
      `},gP=(r,e,n,t,o,i)=>{let a=e.length,s="";for(let u=a-1;u>=0;--u)s+=`
        k = m[${u}] - ${i[u]};
        if (k < 0)  k = 0;
        if (k >= ${e[u]}) k = ${e[u]-1};
        offset += k * ${n[u]};
      `;return`
      float padA(int m[${a}]) {
        int offset = 0;
        int k = 0;
        ${s}
        vec2 coords = offsetToCoords(offset, ${t}, ${o});
        float value = getColorAsFloat(${r.texture2D}(A, coords));
        return value;
      }
      `}});var db,pb,fb,hb,mb,gb,bb,yb,_b,bP,cb,wb,Zi,vb,Xi,yP,xb=N(()=>{"use strict";dt();ze();Ae();db=(r,e,n)=>{Zi(e);let t={name:"AveragePool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[r.run({...t,get:()=>fb(e,t,!1,n)},e)]},pb=r=>{let e=r.attributes.getString("auto_pad","NOTSET"),n=r.attributes.getInt("ceil_mode",0),t=r.attributes.getInt("count_include_pad",0)!==0,o=r.attributes.getInts("kernel_shape"),i=r.attributes.getInts("strides",[]),a=r.attributes.getInts("pads",[]);if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");return we({autoPad:e,ceilMode:n,countIncludePad:t,kernelShape:o,strides:i,pads:a})},fb=(r,e,n,t)=>{let[o,i]=_b(r,t,n),a=ne.size(o.kernelShape),s="value += _X(x);",u="";o.countIncludePad?u+=`value /= float(${a});`:u+=`value /= float(${a} - pad);`;let d=`
        ${vb(r[0].dims,o,s,u,"0.0")}
      `;return{...e,output:{dims:i,type:r[0].type,textureType:0},shaderSource:d}},hb=(r,e,n)=>{Zi(e);let t={name:"GlobalAveragePool",inputNames:["X"],inputTypes:[0],cacheHint:`${n.countIncludePad}`};return[r.run({...t,get:()=>fb(e,t,!0,n)},e)]},mb=r=>{let e=r.attributes.getInt("count_include_pad",0)!==0;return we({autoPad:"",ceilMode:0,countIncludePad:e,kernelShape:[],strides:[],pads:[]})},gb=(r,e,n)=>{Zi(e);let t={name:"MaxPool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[r.run({...t,get:()=>yb(e,t,!1,n)},e)]},bb=r=>{let e=r.attributes.getString("auto_pad","NOTSET"),n=r.attributes.getInt("ceil_mode",0),t=r.attributes.getInts("kernel_shape"),o=r.attributes.getInts("strides",[]),i=r.attributes.getInts("pads",[]),a=r.attributes.getInt("storage_order",0),s=r.attributes.getInts("dilations",[]);if(a!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");return we({autoPad:e,ceilMode:n,countIncludePad:!1,kernelShape:t,strides:o,pads:i,storageOrder:a,dilations:s})},yb=(r,e,n,t)=>{let[o,i]=_b(r,t,n),l=`
      ${vb(r[0].dims,o,`
      value = max(_X(x), value);
    `,"","-1e5")}
    `;return{...e,output:{dims:i,type:r[0].type,textureType:0},shaderSource:l}},_b=(r,e,n)=>{let t=r[0].dims.slice(),o=Object.hasOwnProperty.call(e,"dilations"),i=e.kernelShape.slice(),a=e.strides.slice(),s=o?e.dilations.slice():[],u=e.pads.slice();kr.adjustPoolAttributes(n,t,i,a,s,u);let l=kr.computePoolOutputShape(n,t,a,s,i,u,e.autoPad),d=Object.assign({},e);return o?Object.assign(d,{kernelShape:i,strides:a,pads:u,dilations:s,cacheKey:e.cacheKey}):Object.assign(d,{kernelShape:i,strides:a,pads:u,cacheKey:e.cacheKey}),[d,l]},bP={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""},cb={name:"GlobalMaxPool",inputNames:["X"],inputTypes:[0]},wb=(r,e)=>(Zi(e),[r.run({...cb,get:()=>yb(e,cb,!0,bP)},e)]),Zi=r=>{if(!r||r.length!==1)throw new Error("Pool ops requires 1 input.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.")},vb=(r,e,n,t,o)=>{let i=r.length;if(e.kernelShape.length<=2){let a=e.kernelShape[e.kernelShape.length-1],s=e.strides[e.strides.length-1],u=e.pads[e.pads.length/2-1],l=e.pads[e.pads.length-1],d=r[i-1],p="",h="",g="";if(u+l!==0?p=`
          for (int i = 0; i < ${a}; i++) {
            x[${i} - 1] = indices[${i} - 1] * ${s} - ${u} + i;
            if (x[${i} - 1] < 0 || x[${i} - 1] >= ${d}) {
              pad++;
              continue;
            }
            ${n}
          }`:p=`
          for (int i = 0; i < ${a}; i++) {
            x[${i} - 1] = indices[${i} - 1] * ${s} - ${u} + i;
            ${n}
          }`,e.kernelShape.length===2){let _=e.kernelShape[e.kernelShape.length-2],I=e.strides[e.strides.length-2],w=e.pads[e.pads.length/2-2],v=e.pads[e.pads.length-2],$=r[i-2];w+v!==0?h=`
            for (int j = 0; j < ${_}; j++) {
              x[${i} - 2] = indices[${i} - 2] * ${I} - ${w} + j;
              if (x[${i} - 2] < 0 || x[${i} - 2] >= ${$}) {
                pad+= ${a};
                continue;
              }
          `:h=`
            for (int j = 0; j < ${_}; j++) {
              x[${i} - 2] = indices[${i} - 2] * ${I} - ${w} + j;
            `,g=`
          }
        `}return`
        float process(int indices[${i}]) {
          int x[${i}];
          copyVec(indices, x);

          float value = ${o};
          int pad = 0;
          ${h}
          ${p}
          ${g}
          ${t}
          return value;
        }
      `}else{let a=ne.size(e.kernelShape),s=ne.computeStrides(e.kernelShape),u=s.length,l=e.pads.length,d=yP(u),p=Xi(r,"inputDims"),h=Xi(e.pads,"pads"),g=Xi(s,"kernelStrides"),b=Xi(e.strides,"strides"),_=e.pads.reduce((v,$)=>v+$),I="";return _?I=`
            if (x[j] >= inputDims[j] || x[j] < 0) {
              pad++;
              isPad = true;
              break;
            }
          }
          if (!isPad) {
            ${n}
          }`:I=`
          }
          ${n}
        `,`
        ${d}
        float process(int indices[${i}]) {
          int x[${i}];
          copyVec(indices, x);
          int offset[${u}];
          int pads[${l}];
          int inputDims[${i}];
          int kernelStrides[${u}];
          int strides[${u}];
          ${h}
          ${p}
          ${b}
          ${g}

          float value = ${o};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${a}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${i} - ${u}; j < ${i}; j++) {
              x[j] = indices[j] * strides[j - ${i} + ${u}]
                + offset[j - ${i} + ${u}] - pads[j - 2];
              ${I}
          }
          ${t}

          return value;
        }
      `}},Xi=(r,e)=>{let n="";for(let t=0;t<r.length;t++)n+=`
      ${e}[${t}] = ${r[t]};
    `;return n},yP=r=>`
  void offsetToIndices(int offset, int[${r}] strides, out int[${r}] indices) {
    if (${r} == 0) {
      return;
    }
    for (int i = 0; i < ${r} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${r} - 1] = offset;
  }`});var Fr,gr,_P,wP,Tb,Ib,Sb,$b,Ab,Ob,Pb,Eb=N(()=>{"use strict";dt();Lo();ze();Ae();Fr=(r,e,n,t,o)=>{wP(e);let i={name:t,inputNames:["A"],inputTypes:[0]};return[r.run({...i,cacheHint:n.cacheKey,get:()=>_P(r,e,n,t,o,i)},e)]},gr=r=>{let e=r.attributes.getInts("axes",[]),n=r.attributes.getInt("keepdims",1)===1;return we({axes:e,keepDims:n})},_P=(r,e,n,t,o,i)=>{let a=[],s=e[0].dims.length||1,u=[],l=ne.normalizeAxes(n.axes,e[0].dims.length),d=o(e,l),p=d[1];for(let b=0;b<e[0].dims.length;b++)l.indexOf(b)>=0||l.length===0?(n.keepDims&&a.push(1),p=`
          for(int j${b} = 0; j${b} < ${e[0].dims[b]}; j${b}++) {
            inputIdx[${b}] = j${b};
            ${p}
          }`):(u.push(`inputIdx[${b}] = outputIdx[${a.length}];`),a.push(e[0].dims[b]));let g=`
      float process(int outputIdx[${a.length||1}]) {
        float value;                 // final result
        int inputIdx[${s}];      // addressing input data
        ${u.join(`
`)}
        ${d[0]}       // init ops for reduce max/min
        ${p}
        ${d[2]}       // final computation for reduce mean
        return value;
      }`;return{...i,output:{dims:a,type:e[0].type,textureType:0},shaderSource:g}},wP=r=>{if(!r||r.length!==1)throw new Error("Reduce op requires 1 input.");if(mr.indexOf(r[0].type)===-1)throw new Error("Invalid input type.")},Tb=(r,e,n)=>Fr(r,e,n,"ReduceSum",()=>["value = 0.0;","value += _A(inputIdx);",""]),Ib=(r,e,n)=>Fr(r,e,n,"ReduceMean",(o,i)=>{let a=1;for(let s=0;s<o[0].dims.length;s++)(i.indexOf(s)>=0||i.length===0)&&(a*=o[0].dims[s]);return["value = 0.0;","value += _A(inputIdx);",`value /= ${a}.;`]}),Sb=(r,e,n)=>Fr(r,e,n,"ReduceMax",(o,i)=>{let a=[];for(let s=0;s<o[0].dims.length;s++)(i.indexOf(s)>=0||i.length===0)&&a.push(`inputIdx[${s}] = 0;`);return[`${a.join(`
`)}
value = _A(inputIdx);`,"value = max(value, _A(inputIdx));",""]}),$b=(r,e,n)=>Fr(r,e,n,"ReduceMin",(o,i)=>{let a=[];for(let s=0;s<o[0].dims.length;s++)(i.indexOf(s)>=0||i.length===0)&&a.push(`inputIdx[${s}] = 0;`);return[`${a.join(`
`)}
value = _A(inputIdx);`,"value = min(value, _A(inputIdx));",""]}),Ab=(r,e,n)=>Fr(r,e,n,"ReduceProd",()=>["value = 1.0;","value *= _A(inputIdx);",""]),Ob=(r,e,n)=>Fr(r,e,n,"ReduceLogSum",()=>["value = 0.0;","value += _A(inputIdx);","value = log(value);"]),Pb=(r,e,n)=>Fr(r,e,n,"ReduceLogSumSquare",()=>["float t; value = 0.0;","t = _A(inputIdx); value += t * t;",""])});var Cb,Db=N(()=>{"use strict";ze();Cb=(r,e)=>{let n=ne.calculateReshapedDims(e[0].dims,e[1].integerData);return r.session.pack?[r.reshapePacked(e[0],n)]:[r.reshapeUnpacked(e[0],n)]}});var kb,Vl,Nb,Lb,Ro,vP,Gl,Ji,Ul=N(()=>{"use strict";dt();Je();Ae();kb={name:"Upsample",inputNames:["X"],inputTypes:[0]},Vl=(r,e,n)=>(Gl(e,n),[r.run({...kb,cacheHint:n.cacheKey,get:()=>vP(r,e,n)},e)]),Nb=r=>Ro(r,7),Lb=r=>Ro(r,9),Ro=(r,e)=>{let n=e>=10,t=r.attributes.getString("mode","nearest");if(t!=="nearest"&&t!=="linear"&&(e<11||t!=="cubic"))throw new Error(`unrecognized mode: ${t}`);let o=[];e<9&&(o=r.attributes.getFloats("scales"),Ji(o,t,n));let i=r.attributes.getFloat("extrapolation_value",0),a=e>10?r.attributes.getString("coordinate_transformation_mode","half_pixel"):"asymmetric";if(["asymmetric","pytorch_half_pixel","tf_half_pixel_for_nn","align_corners","tf_crop_and_resize","half_pixel"].indexOf(a)===-1)throw new Error(`coordinate_transform_mode '${a}' is not supported`);let s=a==="tf_crop_and_resize",u=s,l=t==="nearest"&&e>=11?r.attributes.getString("nearest_mode","round_prefer_floor"):"";if(["round_prefer_floor","round_prefer_ceil","floor","ceil",""].indexOf(l)===-1)throw new Error(`nearest_mode '${l}' is not supported`);let d=r.attributes.getFloat("cubic_coeff_a",-.75),p=r.attributes.getInt("exclude_outside",0)!==0;if(p&&t!=="cubic")throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");let h=e<11?!0:t==="nearest"&&a==="asymmetric"&&l==="floor",g=0,b=0,_=0;return e>10?r.inputs.length>2?(g=1,b=2,_=3):(b=1,_=2):e===9&&(b=1),we({opset:e,isResize:n,mode:t,scales:o,extrapolationValue:i,coordinateTransformMode:a,useExtrapolation:u,needRoiInput:s,nearestMode:l,cubicCoefficientA:d,excludeOutside:p,useNearest2xOptimization:h,roiInputIdx:g,scalesInputIdx:b,sizesInputIdx:_})},vP=(r,e,n)=>{let t=se(r.session.backend.glContext.version),[o,i]=r.calculateTextureWidthAndHeight(e[0].dims,0),a=e[0].dims.map((_,I)=>Math.floor(_*n.scales[I])),[s,u]=r.calculateTextureWidthAndHeight(a,0),l=a.length,d=new Array(l),p=new Array(l),h=`
      int output_pitches[${l}];
      int input_pitches[${l}];
      `;for(let _=l-1;_>=0;_--)d[_]=_===l-1?1:d[_+1]*a[_+1],p[_]=_===l-1?1:p[_+1]*e[0].dims[_+1],h+=`
        output_pitches[${_}] = ${d[_]};
        input_pitches[${_}] = ${p[_]};
        `;let g=`
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${o}, ${i});
        float value = getColorAsFloat(${t.texture2D}(X, coords));
        return value;
      }
      `,b=n.mode==="nearest"?`
    ${g}
    float process(int indices[${l}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${s}, ${u});

      ${h}

      int d, m;
      for (int dim = 0; dim < ${l}; ++dim) {
        d = output_index / output_pitches[dim];
        m = output_index - d * output_pitches[dim];
        output_index = m;

        if (scales[dim] != 1 && d > 0) {
          int d2 = d / scales[dim];
          m = d - d2 * scales[dim];
          d = d2;
        }
        input_index += input_pitches[dim] * d;
      }

      return getInputFloat(input_index);
    }`:l===4?`
    ${g}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${s}, ${u});

      ${h}

      int m;
      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m / output_pitches[1];
      m = m - index_of_dim1 * output_pitches[1];
      index_of_dim2 = m / output_pitches[2];
      m = m - index_of_dim2 * output_pitches[2];
      index_of_dim3 = m;

      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;
      index_of_input_dim2 = index_of_dim2 / scales[2];
      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];
      index_of_input_dim3 = index_of_dim3 / scales[3];
      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];

      input_index = index_of_dim0 * input_pitches[0] +
            index_of_dim1 * input_pitches[1] +
            index_of_input_dim2 * input_pitches[2] +
            index_of_input_dim3;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim2 = false;
      if (index_of_input_dim2 == (${e[0].dims[2]} - 1)) {
        // It's the end in dimension 2
        x01 = x00;
        end_of_dim2 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[2]);
      }

      if (index_of_input_dim3 == (input_pitches[2] - 1)) {
        // It's the end in dimension 3
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);
    }`:`
    ${g}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${s}, ${u});

      ${h}

      int m;
      int index_of_dim0, index_of_dim1;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m;

      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;
      index_of_input_dim0 = index_of_dim0 / scales[0];
      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];
      index_of_input_dim1 = index_of_dim1 / scales[1];
      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];

      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim0 = false;
      if (index_of_input_dim0 == (${e[0].dims[0]} - 1)) {
        // It's the end in dimension 0
        x01 = x00;
        end_of_dim0 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[0]);
      }

      if (index_of_input_dim1 == (input_pitches[0] - 1)) {
        // It's the end in dimension 1
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);
    }`;return{...kb,output:{dims:a,type:e[0].type,textureType:0},shaderSource:b,variables:[{name:"scales",type:"int",arrayLength:n.scales.length,data:n.scales.map(_=>Math.ceil(_))}]}},Gl=(r,e)=>{if(!r||e.opset<9&&r.length!==1||e.opset>=9&&e.opset<11&&r.length!==2||e.opset>=11&&r.length<2)throw new Error("invalid inputs.");if(e.scales.length>0&&r[0].dims.length!==e.scales.length)throw new Error("Invalid input shape.");if(r[0].type==="string")throw new Error("Invalid input tensor types.")},Ji=(r,e,n)=>{if(n){for(let t of r)if(t<=0)throw new Error("Scale value should be greater than 0.")}else for(let t of r)if(t<1)throw new Error("Scale value should be greater than or equal to 1.");if((e==="linear"||e==="cubic")&&r.length!==2&&(r.length!==4||r[0]!==1||r[1]!==1))throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${n?"Resize":"Upsample"} opeartor.`)}});var Wl,Hl,Rb,zb,xP,TP,IP,SP,Mb=N(()=>{"use strict";Je();Ae();zn();zr();Ul();Wl={name:"Resize",inputNames:["A"],inputTypes:[2]},Hl=(r,e,n)=>(Gl(e,n),[r.run({...Wl,cacheHint:n.cacheKey,get:()=>xP(r,e,n)},e)]),Rb=r=>Ro(r,10),zb=r=>Ro(r,11),xP=(r,e,n)=>{let t=se(r.session.backend.glContext.version),[o,i]=TP(e,n);if(o.every($=>$===1)&&n.coordinateTransformMode!=="tf_crop_and_resize")return{...Wl,output:{dims:i,type:e[0].type,textureType:2},hasMain:!0,shaderSource:`void main() {
                    vec4 v = ${t.texture2D}(X, TexCoords);
                    ${t.output} = v;
                }`};let s=i.length;if(s<2)throw new Error(`output dimension should be at least 2, but got ${s}`);let u=i[s-2],l=i[s-1],d=e[0].dims;if(s!==d.length)throw new Error(`output dimension should match input ${d.length}, but got ${s}`);let p=d[s-2],h=d[s-1],g=o[s-2],b=o[s-1],_="";if(n.mode!=="linear")throw new Error(`resize (packed) does not support mode: '${n.mode}'`);switch(n.coordinateTransformMode){case"asymmetric":_=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;break;case"half_pixel":_=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;break;case"pytorch_half_pixel":_=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${l}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${u}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${l}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${u}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;break;case"align_corners":_=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${l}.0 - 1.0, ${u}.0 - 1.0, ${l}.0 - 1.0,
                            ${u}.0 - 1.0);
                        vec4 original = vec4(${h}.0 - 1.0, ${p}.0 - 1.0, ${h}.0 - 1.0,
                            ${p}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;break;default:throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${n.coordinateTransformMode}'`)}let I=yt(s),w=Mn(),v=`
            const vec2 inputWH = vec2(${p}.0, ${h}.0);
            const vec4 scaleWHWH = vec4(float(${g}), float(${b}), float(${g}), float(${b}));
            ${w}
            ${_}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${I} rc = getOutputCoords();

                int batch = rc[0];
                int depth = rc[1];

                // retrieve the 4 coordinates that is used in the 4 packed output values.
                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);

                // calculate the source index in fraction
                vec4 sourceFrac = getSourceFracIndex(coords);

                // get the lower and upper bound of the 4 values that will be packed into one texel.
                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));
                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));
                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));
                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));

                bool hasNextRow = rc.w < ${u-1};
                bool hasNextCol = rc.z < ${l-1};

                // pack x00, x01, x10, x11's top-left corner into one vec4 structure
                vec4 topLeft = vec4(
                    getAValue(batch, depth, x00.x, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);

                // pack x00, x01, x10, x11's top-right corner into one vec4 structure
                vec4 topRight = vec4(
                    getAValue(batch, depth, x00.x, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);

                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure
                vec4 bottomLeft = vec4(
                    getAValue(batch, depth, x00.z, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);

                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure
                vec4 bottomRight = vec4(
                    getAValue(batch, depth, x00.z, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);

                // calculate the interpolation fraction on u and v direction
                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);
                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));

                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);
                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);
                vec4 newValue = mix(top, bottom, clampFrac.xxzz);

                ${t.output} = vec4(newValue);
            }
        `;return{...Wl,output:{dims:i,type:e[0].type,textureType:2},hasMain:!0,shaderSource:v}},TP=(r,e)=>{let t=r[0].dims,o=e.scales,i;if(o.length===0){let s=r[e.scalesInputIdx];if(s&&s.size!==0){if(r[e.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");o=IP(s,e.mode,e.isResize)}else{let u=r[e.sizesInputIdx];if(!u||u.size===0)throw new Error("Either scales or sizes MUST be provided as input.");i=Array.from(u.integerData),o=SP(i,t,e.mode,e.isResize)}}else if(r[e.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");let a=i||t.map((s,u)=>Math.floor(s*o[u]));return[o,a]},IP=(r,e,n)=>{let t=Array.from(r.floatData);return Ji(t,e,n),t},SP=(r,e,n,t)=>{let o=e.length,i=new Array(o);for(let a=0,s=o;a<s;a++)if(e[a]===0){if(r[a]!==0)throw new Error("Input dim is zero but required output dim is non-zero.");i[a]=1}else i[a]=r[a]/e[a];return Ji(i,n,t),i}});var Bb,$P,Fb=N(()=>{"use strict";Rr();Bb=(r,e)=>($P(e),[new ot([e[0].dims.length],"int32",void 0,void 0,new Int32Array(e[0].dims))]),$P=r=>{if(!r||r.length!==1)throw new Error("Shape requires 1 input.")}});var ql,Vb,Gb,Ub,AP,Wb,OP,PP,Hb=N(()=>{"use strict";dt();Lo();ze();Ae();ql={name:"Slice",inputNames:["A"],inputTypes:[0]},Vb=(r,e,n)=>(AP(e),[r.run({...ql,cacheHint:n.cacheKey,get:()=>Ub(r,e[0],n)},e)]),Gb=r=>{let e=r.attributes.getInts("starts"),n=r.attributes.getInts("ends"),t=r.attributes.getInts("axes",[]);return we({starts:e,ends:n,axes:t})},Ub=(r,e,n)=>{let t=n.axes.length===0?e.dims.slice(0).map((p,h)=>h):n.axes,o=ne.normalizeAxes(t,e.dims.length),i=n.starts.map((p,h)=>p>e.dims[o[h]]-1?e.dims[o[h]]:ne.normalizeAxis(p,e.dims[o[h]])),a=n.ends.map((p,h)=>p>e.dims[o[h]]-1?e.dims[o[h]]:ne.normalizeAxis(p,e.dims[o[h]])),s=e.dims.slice(),u=[];for(let p=0;p<o.length;p++)s[o[p]]=a[p]-i[p],i[p]>0&&u.push(`outputIdx[${o[p]}] += ${i[p]};`);let d=`
      float process(int outputIdx[${s.length}]) {
        ${u.join(`
      `)}
        return _A(outputIdx);
      }`;return{...ql,output:{dims:s,type:e.type,textureType:0},shaderSource:d}},AP=r=>{if(!r||r.length!==1)throw new Error("Slice requires 1 input.");if(mr.indexOf(r[0].type)===-1)throw new Error("Invalid input type.")},Wb=(r,e)=>{PP(e);let n=OP(r,e);return[r.run({...ql,cacheHint:n.cacheKey,get:()=>Ub(r,e[0],n)},[e[0]])]},OP=(r,e)=>{if(!r.session.isInitializer(e[1].dataId)||!r.session.isInitializer(e[2].dataId)||e.length>=4&&!r.session.isInitializer(e[3].dataId)||e.length>=5&&!r.session.isInitializer(e[4].dataId))throw new Error("dynamic slice attributes are not allowed");if(e.length>=5&&e[4].integerData.some(a=>a!==1))throw new Error("currently non-1 steps is not supported for Slice");let n=Array.from(e[1].integerData),t=Array.from(e[2].integerData),o=e.length>=4?Array.from(e[3].integerData):[],i=`${o};${n};${t}`;return{starts:n,ends:t,axes:o,cacheKey:i}},PP=r=>{if(!r||r.length<3||r.length>5)throw new Error("Invalid input number.");if(r[1].type!=="int32"||r[1].dims.length!==1)throw new Error("Invalid input type.");if(r[2].type!=="int32"||r[2].dims.length!==1)throw new Error("Invalid input type.");if(r.length>=4&&(r[3].type!=="int32"||r[3].dims.length!==1))throw new Error("Invalid input type.");if(r.length>=5&&(r[4].type!=="int32"||r[4].dims.length!==1))throw new Error("Invalid input type.")}});var qb,jb,Kb,Xb,Zb,Jb,Qb,Yb,EP,CP,DP,ey,ty=N(()=>{"use strict";dt();ze();Je();Ae();Ki();qb={name:"SoftmaxComputeMax",inputNames:["A"],inputTypes:[0]},jb={name:"SoftmaxComputeScale",inputNames:["A","Max"],inputTypes:[0,0]},Kb={name:"SoftMax",inputNames:["A","Max","Norm"],inputTypes:[0,0,0]},Xb=(r,e,n)=>{ey(e);let t=e[0].dims.slice(),o=ne.normalizeAxis(n.axis,t.length),i=ne.sizeToDimension(t,o),a=ne.sizeFromDimension(t,o);return Yb(r,e,n,i,a)},Zb=r=>we({axis:r.attributes.getInt("axis",1)}),Jb=r=>we({axis:r.attributes.getInt("axis",-1)}),Qb=(r,e,n)=>{ey(e);let t=e[0].dims.slice(),o=ne.normalizeAxis(n.axis,t.length),i=t.length,a=o!==i-1,s=[],u=[],l=[],d;a&&(u=Array.from({length:i}).map((b,_)=>_),u[o]=i-1,u[i-1]=o,u.map(b=>s.push(t[b])),d=we({perm:u}),l=Br(r,e,d));let p=a?ne.sizeToDimension(s,i-1):ne.sizeToDimension(t,i-1),h=a?ne.sizeFromDimension(s,i-1):ne.sizeFromDimension(t,i-1),g=Yb(r,a?l:e,n,p,h);return a?Br(r,g,d):g},Yb=(r,e,n,t,o)=>{let i=EP(r,e[0],t,o,[t]),a=r.run({...qb,cacheHint:n.cacheKey,get:()=>i},e),s=CP(r,e[0],t,o,i.output.dims,[t]),u=r.run({...jb,cacheHint:n.cacheKey,get:()=>s},[e[0],a]),l=DP(r,e[0],t,o,i.output.dims,s.output.dims);return[r.run({...Kb,cacheHint:n.cacheKey,get:()=>l},[e[0],a,u])]},EP=(r,e,n,t,o)=>{let[i,a]=r.calculateTextureWidthAndHeight(e.dims,0),s=o.length;if(n<1||t<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(o.length!==1)throw new Error("Dimensionality of the output should be 1");if(o[0]!==n)throw new Error("Shape of the output should be equal to logical row count");let u=se(r.session.backend.glContext.version),l=`
      float process(int[${s}] indices) {
        int logical_row_start_offset = indices[0] * ${t};

        float max = getColorAsFloat(${u.texture2D}(A, offsetToCoords(logical_row_start_offset, ${i},
        ${a} )));
        for(int i=1; i<${t}; ++i)
        {
          float current = getColorAsFloat(${u.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${i}, ${a})));
          if(current > max)
          max = current;
        }

        return max;
      }`;return{...qb,output:{dims:o,type:e.type,textureType:0},shaderSource:l}},CP=(r,e,n,t,o,i)=>{let[a,s]=r.calculateTextureWidthAndHeight(e.dims,0),u=i.length;if(n<1||t<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(i.length!==1)throw new Error("Dimensionality of the output should be 1");if(i[0]!==n)throw new Error("Shape of the output should be equal to logical row count");if(o.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(o[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let l=se(r.session.backend.glContext.version),d=`
      float process(int[${u}] indices) {
        int logical_row_start_offset = indices[0] * ${t};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${t}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${l.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${a}, ${s}))) - max);
        }

        return norm_factor;
      }`;return{...jb,output:{dims:i,type:e.type,textureType:0},shaderSource:d}},DP=(r,e,n,t,o,i)=>{let[a,s]=r.calculateTextureWidthAndHeight(e.dims,0),u=e.dims.length;if(n<1||t<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(o.length!==1||i.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(o[0]!==n||i[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let l=`
      float process(int[${u}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${a}, ${s});

      //determine the logical row for this index
      int logical_row_index[1];
      logical_row_index[0] = offset / ${t};

      float norm_factor = _Norm(logical_row_index);

      // avoid possible division by 0
      // if norm_facor is 0, all elements are zero
      // if so, return 0
      if(norm_factor == 0.0)
        return 0.0;

      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;
    }`;return{...Kb,output:{dims:e.dims,type:e.type,textureType:0},shaderSource:l}},ey=r=>{if(!r||r.length!==1)throw new Error("Softmax requires 1 input.");if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type")}});var ny,ry,oy,kP,NP,LP,iy=N(()=>{"use strict";dt();ze();Ae();ny={name:"Split",inputNames:["A"],inputTypes:[0]},ry=(r,e,n)=>{LP(e);let t=ne.normalizeAxis(n.axis,e[0].dims.length),o=kP(r,e,t,n),i=[];for(let a=0;a<o;++a)i.push(r.run({...ny,cacheHint:`${n.cacheKey};${a}`,get:()=>NP(r,e[0],n,t,a)},e));return i},oy=r=>{let e=r.attributes.getInt("axis",0),n=r.attributes.getInts("split",[]),t=r.outputs.length;return we({axis:e,split:n,numOutputs:t})},kP=(r,e,n,t)=>{let[,o]=Po.splitShape(e[0].dims,n,t.split,t.numOutputs);return o.length},NP=(r,e,n,t,o)=>{let[i,a]=Po.splitShape(e.dims,t,n.split,n.numOutputs),s=a[o],u=i[o],d=`
      float process(int indices[${u.length}]) {
        indices[${t}] += ${s};
        return _A(indices);
      }
    `;return{...ny,cacheHint:`${n.cacheKey}:${o}`,output:{dims:u,type:e.type,textureType:0},shaderSource:d}},LP=r=>{if(!r||r.length!==1)throw new Error("Split requires one input.");if(r[0].type!=="int8"&&r[0].type!=="uint8"&&r[0].type!=="int16"&&r[0].type!=="uint16"&&r[0].type!=="int32"&&r[0].type!=="uint32"&&r[0].type!=="float32"&&r[0].type!=="float64"&&r[0].type!=="bool")throw new Error("Invalid input type.")}});var jl,ay,sy,RP,zP,uy=N(()=>{"use strict";ze();jl=(r,e,n)=>{RP(e);let t=ne.squeezeShape(e[0].dims,n);return[r.reshapeUnpacked(e[0],t)]},ay=(r,e)=>(zP(e),jl(r,[e[0]],Array.from(e[1].integerData))),sy=r=>r.attributes.getInts("axes"),RP=r=>{if(!r||r.length!==1)throw new Error("Squeeze requires 1 input.");if(r[0].type==="string")throw new Error("invalid input tensor types.")},zP=r=>{if(!r||r.length!==2)throw new Error("Squeeze requires 2 inputs.");if(r[1].type!=="int32")throw new Error("Invalid input type.")}});var ly,MP,BP,cy=N(()=>{"use strict";Je();Ae();ly=(r,e)=>{BP(e);let n={name:"Sum",inputNames:e.map((o,i)=>`X${i}`),inputTypes:new Array(e.length).fill(0)};return[r.run({...n,get:()=>MP(r,e,n)},e)]},MP=(r,e,n)=>{let t=se(r.session.backend.glContext.version),o=e[0].dims.slice(),a=`
      void main() {
        vec4 result = ${e.map((s,u)=>`${t.texture2D}(X${u},TexCoords)`).join(" + ")};
        ${t.output} = result;
      }
    `;return{...n,output:{dims:o,type:e[0].type,textureType:0},hasMain:!0,shaderSource:a}},BP=r=>{if(!r||r.length===0)throw new Error("Sum requires inputs.");let e=r[0].dims.length;for(let n=1;n<r.length;n++){if(e!==r[n].dims.length)throw new Error("Input shapes are mismatched.");for(let t=0;t<e;t++)if(r[0].dims[t]!==r[n].dims[t])throw new Error("Input shapes are not matched.")}if(r[0].type!=="float32"&&r[0].type!=="float64")throw new Error("Invalid input type.");for(let n=1;n<r.length;n++)if(r[0].type!==r[n].type)throw new Error("Input types are not matched.")}});var dy,FP,VP,py=N(()=>{"use strict";Lo();Ae();dy=(r,e)=>{VP(e);let n={name:"Tile",inputNames:["A"],inputTypes:[0]};return[r.run({...n,get:()=>FP(r,e,n)},e)]},FP=(r,e,n)=>{let t=e[0].dims.slice(),o=new Array(t.length),i=[];for(let u=0;u<t.length;u++)o[u]=t[u]*e[1].numberData[u],i.push(`inputIdx[${u}] = int(mod(float(outputIdx[${u}]), ${t[u]}.));`);let a=o.length,s=`
      float process(int outputIdx[${a}]) {
        int inputIdx[${a}];
        ${i.join(`
`)}
        return _A(inputIdx);
      }
    `;return{...n,output:{dims:o,type:e[0].type,textureType:0},shaderSource:s}},VP=r=>{if(!r||r.length!==2)throw new Error("Tile requires 2 input.");if(r[1].dims.length!==1)throw new Error("The second input shape must 1 dimension.");if(r[1].dims[0]!==r[0].dims.length)throw new Error("Invalid input shape.");if(mr.indexOf(r[0].type)===-1)throw new Error("Invalid input type.");if(r[1].type!=="int32"&&r[1].type!=="int16")throw new Error("Invalid repeat type.")}});var Kl,fy,hy,GP,UP,my=N(()=>{"use strict";ze();Kl=(r,e,n)=>{GP(e);let t=ne.unsqueezeShape(e[0].dims,n);return[r.reshapeUnpacked(e[0],t)]},fy=(r,e)=>(UP(e),Kl(r,[e[0]],Array.from(e[1].integerData))),hy=r=>r.attributes.getInts("axes"),GP=r=>{if(!r||r.length!==1)throw new Error("Unsqueeze requires 1 input.");if(r[0].type==="string")throw new Error("invalid input tensor types.")},UP=r=>{if(!r||r.length!==2)throw new Error("Unsqueeze requires 2 inputs.");if(r[1].type!=="int32")throw new Error("Invalid input type.")}});var gy,by=N(()=>{"use strict";Am();Fm();Um();Xm();Hi();Dg();Mg();Vg();Wg();Kg();Jg();tb();ib();qi();lb();xb();Eb();Db();Mb();Fb();Hb();ty();iy();uy();cy();py();Ki();Cl();my();Ul();gy=[["Abs","","6+",Zm],["Acos","","7+",Jm],["Add","","7+",Om],["And","","7+",Pm],["Asin","","7+",Qm],["Atan","","7+",Ym],["AveragePool","","7+",db,pb],["BatchNormalization","","7+",Sm,$m],["Cast","","6+",Vm,Gm],["Ceil","","6+",ng],["Clip","","6-10",Pl,eg],["Clip","","11+",tg],["Concat","","4+",qm,Km],["Conv","","1+",zl,Ml],["ConvTranspose","","1+",Eg,Cg],["Cos","","7+",rg],["Div","","7+",Em],["Dropout","","7+",El],["DepthToSpace","","1+",Rg,zg],["Equal","","7+",Cm],["Elu","","6+",og,ig],["Exp","","6+",ag],["Flatten","","1+",Bg,Fg],["Floor","","6+",sg],["FusedConv","com.microsoft","1+",zl,Ml],["Gather","","1+",Gg,Ug],["Gemm","","7-10",Bl,qg],["Gemm","","11+",Bl,jg],["GlobalAveragePool","","1+",hb,mb],["GlobalMaxPool","","1+",wb],["Greater","","7+",Dm],["Identity","","1+",El],["ImageScaler","","1+",Xg,Zg],["InstanceNormalization","","6+",Yg,eb],["LeakyRelu","","6+",ug,lg],["Less","","7+",km],["LRN","","1+",nb,rb],["Log","","6+",cg],["MatMul","","1+",Tg,Ig],["MaxPool","","1+",gb,bb],["Mul","","7+",Nm],["Neg","","6+",dg],["Not","","1+",pg],["Or","","7+",Lm],["Pad","","2-10",Fl,ab],["Pad","","11+",sb,ub],["Pow","","7+",Rm],["PRelu","","7+",zm],["ReduceLogSum","","1+",Ob,gr],["ReduceMax","","1+",Sb,gr],["ReduceMean","","1+",Ib,gr],["ReduceMin","","1+",$b,gr],["ReduceProd","","1+",Ab,gr],["ReduceSum","","1-12",Tb,gr],["ReduceSumSquare","","1+",Pb,gr],["Relu","","6+",fg],["Reshape","","5+",Cb],["Resize","","10",Hl,Rb],["Resize","","11+",Hl,zb],["Shape","","1+",Bb],["Sigmoid","","6+",hg],["Sin","","7+",mg],["Slice","","10+",Wb],["Slice","","1-9",Vb,Gb],["Softmax","","1-12",Xb,Zb],["Softmax","","13+",Qb,Jb],["Split","","2-12",ry,oy],["Sqrt","","6+",gg],["Squeeze","","1-12",jl,sy],["Squeeze","","13+",ay],["Sub","","7+",Mm],["Sum","","6+",ly],["Tan","","7+",bg],["Tanh","","6+",yg],["Tile","","6+",dy],["Transpose","","1+",Br,Ng],["Upsample","","7-8",Vl,Nb],["Upsample","","9",Vl,Lb],["Unsqueeze","","1-12",Kl,hy],["Unsqueeze","","13+",fy],["Xor","","7+",Bm]]});function _y(r){let e={},n;for(;(n=yy.exec(r))!==null;){let t=n[3].split(",").map(o=>{let i=o.trim().split(" ");return i&&i.length===2?{type:i[0],name:i[1]}:null}).filter(o=>o!==null);e[n[2]]={params:t,body:n[4]}}for(let t in e){let o=WP.replace("__FUNC__",t),i=new RegExp(o,"gm");for(;(n=i.exec(r))!==null;){let a=n[1],s=n[2],u=n[3].split(","),l=a?`${a} ${s};`:"",d=e[t].body,p="";e[t].params.forEach((g,b)=>{g&&(p+=`${g.type} ${g.name} = ${u[b]};
`)}),d=`${p}
 ${d}`,d=d.replace("return",`${s} = `);let h=`
      ${l}
      {
        ${d}
      }
      `;r=r.replace(n[0],h)}}return r=r.replace(yy,""),r}var yy,WP,wy=N(()=>{"use strict";yy=/@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm,WP="(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;"});function ao(r,e){let n=[],t=[],o=e!=null&&Array.isArray(e)&&e.length===0,i=e==null||o?null:HP(e,r).sort(),a=0;for(let s=0;s<r.length;++s){if(i!=null){if(i[a]===s&&r[s]!==1)throw new Error(`Can't squeeze axis ${s} since its dim '${r[s]}' is not 1`);(i[a]==null||i[a]>s)&&r[s]===1&&(n.push(r[s]),t.push(s)),i[a]<=s&&a++}r[s]!==1&&(n.push(r[s]),t.push(s))}return{newShape:n,keptDims:t}}function HP(r,e){let n=e.length;return r=r==null?e.map((t,o)=>o):[].concat(r),eo(r.every(t=>t>=-n&&t<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${r}`),eo(r.every(qP),()=>`All values in axis param must be integers but got axis ${r}`),r.map(t=>t<0?n+t:t)}function qP(r){return r%1===0}function jP(r){if(r.length===0)return 1;let e=r[0];for(let n=1;n<r.length;n++)e*=r[n];return e}function vy(r){let e=Math.ceil(Math.sqrt(r));return[e,Math.ceil(r/e)]}var Qi,Xl=N(()=>{"use strict";Dt();ze();Qi=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,n){let t=this.computeTexture(e,n);return n&&n.isPacked&&(t[0]/=2,t[1]/=2),n&&n.reverseWH?[t[1],t[0]]:t}computeTexture(e,n){let t=n&&n.isPacked;if(e.length===0)return t?[2,2]:[1,1];let o=this.maxTextureSize;if(n&&n.breakAxis!==void 0){let s=n.breakAxis>=e.length?1:e.slice(n.breakAxis).reduce((l,d)=>l*d),u=n.breakAxis<=0?1:e.slice(0,n.breakAxis).reduce((l,d)=>l*d);if(s>o||u>o)Be.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${n.breakAxis}`);else return[s,u]}let i=e.slice(0);t&&(o=o*2,i=i.map((s,u)=>u>=i.length-2?i[u]%2===0?i[u]:i[u]+1:i[u]),i.length===1&&(i=[2,i[0]])),i.length!==2&&(i=ao(i).newShape);let a=jP(i);return i.length<=1&&a<=o?[1,a]:i.length===2&&i[0]<=o&&i[1]<=o?i:i.length===3&&i[0]*i[1]<=o&&i[2]<=o?[i[0]*i[1],i[2]]:i.length===3&&i[0]<=o&&i[1]*i[2]<=o?[i[0],i[1]*i[2]]:i.length===4&&i[0]*i[1]*i[2]<=o&&i[3]<=o?[i[0]*i[1]*i[2],i[3]]:i.length===4&&i[0]<=o&&i[1]*i[2]*i[3]<=o?[i[0],i[1]*i[2]*i[3]]:t?vy(a/4).map(s=>s*2):vy(a)}}});var Yi,xy=N(()=>{"use strict";ze();Qn();Je();Xl();zn();Yi=class extends Mt{constructor(e){super(e)}getFunctions(){return{...this.offsetToCoords(),...this.coordsToOffset(),...this.toVec(),...this.valueFrom(),...this.getCommonUtilFuncs(),...this.getInputsSamplingSnippets(),...this.getOutputSamplingSnippet()}}getCustomTypes(){return{}}offsetToCoords(){let e="offsetToCoords";return{offsetToCoords:new X(`
      vec2 ${e}(int offset, int width, int height) {
        int t = offset / width;
        int s = offset - t*width;
        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);
        return coords;
      }
      `)}}coordsToOffset(){let e="coordsToOffset";return{coordsToOffset:new X(`
      int ${e}(vec2 coords, int width, int height) {
        float s = coords.s * float(width);
        float t = coords.t * float(height);
        int offset = int(t) * width + int(s);
        return offset;
      }
      `)}}getOutputSamplingSnippet(){let e=this.context.outputTextureLayout;return e.isPacked?this.getPackedOutputSamplingSnippet(e):this.getUnpackedOutputSamplingSnippet(e)}getPackedOutputSamplingSnippet(e){let n=e.unpackedShape,t=[e.width,e.height],o={},i="getOutputCoords";switch(n.length){case 0:o[i]=this.getOutputScalarCoords();break;case 1:o[i]=this.getOutputPacked1DCoords(n,t);break;case 2:o[i]=this.getOutputPacked2DCoords(n,t);break;case 3:o[i]=this.getOutputPacked3DCoords(n,t);break;default:o[i]=this.getOutputPackedNDCoords(n,t)}let s=`
      void setOutput(vec4 val) {
        ${se(this.context.glContext.version).output} = val;
      }
    `,u="floatTextureSetRGBA";return o[u]=new X(s),o}getUnpackedOutputSamplingSnippet(e){let n=e.unpackedShape,t=[e.width,e.height],o={},i="getOutputCoords";switch(n.length){case 0:o[i]=this.getOutputScalarCoords();break;case 1:o[i]=this.getOutputUnpacked1DCoords(n,t);break;case 2:o[i]=this.getOutputUnpacked2DCoords(n,t);break;case 3:o[i]=this.getOutputUnpacked3DCoords(n,t);break;case 4:o[i]=this.getOutputUnpacked4DCoords(n,t);break;case 5:o[i]=this.getOutputUnpacked5DCoords(n,t);break;case 6:o[i]=this.getOutputUnpacked6DCoords(n,t);break;default:throw new Error(`Unsupported output dimensionality: ${n.length}`)}let s=`
        void setOutput(float val) {
          ${se(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `,u="floatTextureSetR";return o[u]=new X(s),o}getOutputScalarCoords(){return new X(`
      int getOutputCoords() {
        return 0;
      }
    `)}getOutputPacked1DCoords(e,n){let t=n,o="";return t[0]===1?(o=`
          int getOutputCoords() {
            return 2 * int(TexCoords.y * ${t[1]}.0);
          }
        `,new X(o)):t[1]===1?(o=`
          int getOutputCoords() {
            return 2 * int(TexCoords.x * ${t[0]}.0);
          }
        `,new X(o)):(o=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                 vec2(${t[0]}, ${t[1]}));
          return 2 * (resTexRC.y * ${t[0]} + resTexRC.x);
        }
      `,new X(o))}getOutputPacked2DCoords(e,n){let t="";if(Dr.arraysEqual(e,n))return t=`
        ivec2 getOutputCoords() {
          return 2 * ivec2(TexCoords.xy * vec2(${n[0]}, ${n[1]}));
        }
      `,new X(t);let o=n,i=Math.ceil(e[1]/2);return t=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${o[0]}, ${o[1]}));

          int index = resTexRC.y * ${o[0]} + resTexRC.x;

          // reverse r and c order for packed texture
          int r = imod(index, ${i}) * 2;
          int c = 2 * (index / ${i});

          return ivec2(r, c);
        }
      `,new X(t)}getOutputPacked3DCoords(e,n){let t=[n[0],n[1]],o=Math.ceil(e[2]/2),i=o*Math.ceil(e[1]/2),a=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;

          int b = index / ${i};
          index -= b * ${i};

          // reverse r and c order for packed texture
          int r = imod(index, ${o}) * 2;
          int c = 2 * (index / ${o});

          return ivec3(b, r, c);
        }
      `;return new X(a)}getOutputPackedNDCoords(e,n){let t=[n[0],n[1]],o=Math.ceil(e[e.length-1]/2),i=o*Math.ceil(e[e.length-2]/2),a=i,s="",u="b, r, c";for(let d=2;d<e.length-1;d++)a*=e[e.length-d-1],s=`
      int b${d} = index / ${a};
      index -= b${d} * ${a};
    `+s,u=`b${d}, `+u;let l=`
      ivec${e.length} getOutputCoords() {
        ivec2 resTexRC = ivec2(TexCoords.xy *
                              vec2(${t[0]}, ${t[1]}));
        int index = resTexRC.y * ${t[0]} + resTexRC.x;

        ${s}

        int b = index / ${i};
        index -= b * ${i};

        // reverse r and c order for packed texture
        int r = imod(index, ${o}) * 2;
        int c = 2 * (index / ${o});

        return ivec${e.length}(${u});
      }
    `;return new X(l)}getOutputUnpacked1DCoords(e,n){let t=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          return resTexRC.y * ${n[0]} + resTexRC.x;
        }
      `;return new X(t)}getOutputUnpacked2DCoords(e,n){let t=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          int index = resTexRC.y * ${n[0]} + resTexRC.x;
          int r = index / ${e[1]};
          int c = index - r * ${e[1]};
          return ivec2(r, c);
        }
      `;return new X(t)}getOutputUnpacked3DCoords(e,n){let t="",o=e.length,i=null;o<2&&(i=[]),i=new Array(o-1),i[o-2]=e[o-1];for(let u=o-3;u>=0;--u)i[u]=i[u+1]*e[u+1];let a=["r","c","d"],s=i.map((u,l)=>{let d=`int ${a[l]} = index / ${u}`,p=l===i.length-1?`int ${a[l+1]} = index - ${a[l]} * ${u}`:`index -= ${a[l]} * ${u}`;return`${d}; ${p};`}).join("");return t=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          int index = resTexRC.y * ${n[0]} + resTexRC.x;
          ${s}
          return ivec3(r, c, d);
        }
      `,new X(t)}getOutputUnpacked4DCoords(e,n){let t="",o=e.length,i=null;o<2&&(i=[]),i=new Array(o-1),i[o-2]=e[o-1];for(let u=o-3;u>=0;--u)i[u]=i[u+1]*e[u+1];let a=["r","c","d","d2"],s=i.map((u,l)=>{let d=`int ${a[l]} = index / ${u}`,p=l===i.length-1?`int ${a[l+1]} = index - ${a[l]} * ${u}`:`index -= ${a[l]} * ${u}`;return`${d}; ${p};`}).join("");return t=`
      ivec4 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          int index = resTexRC.y * ${n[0]} + resTexRC.x;
          ${s}
          return ivec4(r, c, d, d2);
        }
      `,new X(t)}getOutputUnpacked5DCoords(e,n){let t="",o=e.length,i=null;o<2&&(i=[]),i=new Array(o-1),i[o-2]=e[o-1];for(let u=o-3;u>=0;--u)i[u]=i[u+1]*e[u+1];let a=["r","c","d","d2","d3"],s=i.map((u,l)=>{let d=`int ${a[l]} = index / ${u}`,p=l===i.length-1?`int ${a[l+1]} = index - ${a[l]} * ${u}`:`index -= ${a[l]} * ${u}`;return`${d}; ${p};`}).join("");return t=`
      ivec5 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          int index = resTexRC.y * ${n[0]} + resTexRC.x;
          ${s}
          return ivec5(r, c, d, d2, d3);
        }
      `,new X(t)}getOutputUnpacked6DCoords(e,n){let t="",o=e.length,i=null;o<2&&(i=[]),i=new Array(o-1),i[o-2]=e[o-1];for(let u=o-3;u>=0;--u)i[u]=i[u+1]*e[u+1];let a=["r","c","d","d2","d3","d4"],s=i.map((u,l)=>{let d=`int ${a[l]} = index / ${u}`,p=l===i.length-1?`int ${a[l+1]} = index - ${a[l]} * ${u}`:`index -= ${a[l]} * ${u}`;return`${d}; ${p};`}).join("");return t=`
     ivec6 getOutputCoords() {
         ivec2 resTexRC = ivec2(TexCoords.xy *
                               vec2(${n[0]}, ${n[1]}));
         int index = resTexRC.y * ${n[0]} + resTexRC.x;
         ${s}
         return ivec6(r, c, d, d2, d3, d4);
       }
     `,new X(t)}getCommonUtilFuncs(){let e={},n="uvFromFlat";e[n]=new X(`
    vec2 uvFromFlat(int texNumR, int texNumC, int index) {
      int texC = index / texNumR;
      int texR = index - texC * texNumR;
      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to
      //       v.
      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);
    }
    `),n="packedUVfrom1D",e[n]=new X(`
      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
        int texelIndex = index / 2;
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),n="packedUVfrom2D",e[n]=new X(`
      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {
        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),n="packedUVfrom3D",e[n]=new X(`
      vec2 packedUVfrom3D(int texNumR, int texNumC,
          int texelsInBatch, int texelsInLogicalRow, int b,
          int row, int col) {
        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = index / texNumC;
        int texC = index - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),n="sampleTexture";let t=se(this.context.glContext.version);return e[n]=new X(`
        float sampleTexture(sampler2D textureSampler, vec2 uv) {
            return ${t.texture2D}(textureSampler, uv).r;
        }`),e}getInputsSamplingSnippets(){let e={},n=this.context.outputTextureLayout;return this.context.programInfo.inputNames.forEach((t,o)=>{let i=this.context.inputTextureLayouts[o],a=Mi(t);i.isPacked?e[a]=this.getPackedSamplerFromInput(a,t,i):e[a]=this.getUnpackedSamplerFromInput(a,t,i);let s=lm(t);i.unpackedShape.length<=n.unpackedShape.length&&(i.isPacked?e[s]=this.getPackedSamplerAtOutputCoords(s,i,n,t):e[s]=this.getUnpackedSamplerAtOutputCoords(s,i,n,t))}),e}getPackedSamplerAtOutputCoords(e,n,t,o){let i=n.unpackedShape,a=t.unpackedShape,u=Mi(o),l=i.length,d=a.length,p=bt.getBroadcastDims(i,a),h=yt(d),g=d-l,b,_=Xt();l===0?b="":d<2&&p.length>=1?b="coords = 0;":b=p.map(x=>`coords.${_[x+g]} = 0;`).join(`
`);let I="";d<2&&l>0?I="coords":I=i.map((x,B)=>`coords.${_[B+g]}`).join(", ");let w="return outputValue;",$=ne.size(i)===1,P=ne.size(a)===1;if(l===1&&!$&&!P)w=`
        return vec4(outputValue.xy, outputValue.xy);
      `;else if($&&!P)d===1?w=`
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        `:w=`
          return vec4(outputValue.x);
        `;else if(p.length){let x=l-2,B=l-1;p.indexOf(x)>-1&&p.indexOf(B)>-1?w="return vec4(outputValue.x);":p.indexOf(x)>-1?w="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":p.indexOf(B)>-1&&(w="return vec4(outputValue.xx, outputValue.zz);")}let C=`
        int lastDim = coords.${_[d-1]};
        coords.${_[d-1]} = coords.${_[d-2]};
        coords.${_[d-2]} = lastDim;
      `,R=`
      vec4 ${e}() {
        ${h} coords = getOutputCoords();
        ${C}
        ${b}
        vec4 outputValue = ${u}(${I});
        ${w}
      }
    `;return new X(R,["coordinates.getOutputCoords"])}getUnpackedSamplerAtOutputCoords(e,n,t,o){let i=[t.width,t.height],a=[n.width,n.height],s=n.unpackedShape.length,u=t.unpackedShape.length,l=n.unpackedShape,d=t.unpackedShape,p=Mi(o);if(s===u&&Dr.arraysEqual(a,i)){let $=`
          float ${e}() {
            return sampleTexture(${o}, TexCoords);
          }
        `;return new X($,["coordinates.sampleTexture"])}let h=yt(u),g=bt.getBroadcastDims(l,d),b=u-s,_,I=Xt();s===0?_="":u<2&&g.length>=1?_="coords = 0;":_=g.map($=>`coords.${I[$+b]} = 0;`).join(`
`);let w="";u<2&&s>0?w="coords":w=n.unpackedShape.map(($,A)=>`coords.${I[A+b]}`).join(", ");let v=`
        float ${e}() {
          ${h} coords = getOutputCoords();
          ${_}
          return ${p}(${w});
        }
      `;return new X(v,["coordinates.getOutputCoords"])}getPackedSamplerFromInput(e,n,t){switch(t.unpackedShape.length){case 0:return this.getPackedSamplerScalar(e,n);case 1:return this.getPackedSampler1D(e,n,t);case 2:return this.getPackedSampler2D(e,n,t);case 3:return this.getPackedSampler3D(e,n,t);default:return this.getPackedSamplerND(e,n,t)}}getUnpackedSamplerFromInput(e,n,t){let o=t.unpackedShape;switch(o.length){case 0:return this.getUnpackedSamplerScalar(e,n,t);case 1:return this.getUnpackedSampler1D(e,n,t);case 2:return this.getUnpackedSampler2D(e,n,t);case 3:return this.getUnpackedSampler3D(e,n,t);case 4:return this.getUnpackedSampler4D(e,n,t);case 5:return this.getUnpackedSampler5D(e,n,t);case 6:return this.getUnpackedSampler6D(e,n,t);default:throw new Error(`Unsupported dimension ${o.length}-D`)}}getPackedSamplerScalar(e,n){let t=se(this.context.glContext.version),o=`
          vec4 ${e}() {
            return ${t.texture2D}(${n}, halfCR);
          }
        `;return new X(o)}getPackedSampler1D(e,n,t){let o=[t.width,t.height],i=[o[1],o[0]],a=se(this.context.glContext.version),u=`vec4 ${e}(int index) {
      vec2 uv = packedUVfrom1D(
      ${i[0]}, ${i[1]}, index);
      return ${a.texture2D}(${n}, uv);
    }`;return new X(u,["coordinates.packedUVfrom1D"])}getPackedSampler2D(e,n,t){let o=t.unpackedShape,i=[t.width,t.height],a=se(this.context.glContext.version),s=i[0],u=i[1];if(i!=null&&Dr.arraysEqual(o,i)){let g=`vec4 ${e}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${u}.0, ${s}.0);
        return ${a.texture2D}(${n}, uv);
      }`;return new X(g)}let l=i,d=Math.ceil(o[1]/2),h=`vec4 ${e}(int row, int col) {
      vec2 uv = packedUVfrom2D(${l[1]}, ${l[0]}, ${d}, row, col);
      return ${a.texture2D}(${n}, uv);
    }`;return new X(h,["coordinates.packedUVfrom2D"])}getPackedSampler3D(e,n,t){let o=t.unpackedShape,i=[t.width,t.height],a=[i[0],i[1]],s=se(this.context.glContext.version);if(o[0]===1){let b=o.slice(1),_=[1,2],I=to(o,b),w=["b","row","col"],v=JSON.parse(JSON.stringify(t));v.unpackedShape=I;let $=this.getPackedSamplerFromInput(e,n,v),P=`${$.routineBody}
      vec4 ${e}(int b, int row, int col) {
        return ${e}(${no(w,_)});
      } `;return new X(P,$.dependencies)}let u=a[0],l=a[1],d=Math.ceil(o[2]/2),p=d*Math.ceil(o[1]/2),g=`vec4 ${e}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${l}, ${u}, ${p}, ${d}, b, row, col);
      return ${s.texture2D}(${n}, uv);}`;return new X(g,["coordinates.packedUVfrom3D"])}getPackedSamplerND(e,n,t){let o=t.unpackedShape,i=o.length,a=[t.width,t.height],s=se(this.context.glContext.version),u=[a[0],a[1]],l=u[1],d=u[0],p=Math.ceil(o[i-1]/2),h=p*Math.ceil(o[i-2]/2),g="int b, int row, int col",b=`b * ${h} + (row / 2) * ${p} + (col / 2)`;for(let w=2;w<i-1;w++)g=`int b${w}, `+g,h*=o[i-w-1],b=`b${w} * ${h} + `+b;let I=`vec4 ${e}(${g}) {
      int index = ${b};
      int texR = index / ${d};
      int texC = index - texR * ${d};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}, ${l});
      return ${s.texture2D}(${n}, uv);
    }`;return new X(I)}getUnpackedSamplerScalar(e,n,t){let[o,i]=[t.width,t.height];if(o===1&&i===1){let s=`
          float ${e}() {
            return sampleTexture(${n}, halfCR);
          }
        `;return new X(s,["coordinates.sampleTexture"])}let a=`
        float ${e}() {
          int offset_${n} = coordsToOffset(TexCoords, ${o}, ${i});
          vec2 uv = uvFromFlat(${o}, ${i}, offset_${n});
          return sampleTexture(${n}, uv);
        }
      `;return new X(a,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler1D(e,n,t){let o=t.width,i=t.height;if(i===1&&o===1){let s=`
        float ${e}(int index) {
          return sampleTexture(${n}, halfCR);
        }
      `;return new X(s,["coordinates.sampleTexture"])}if(i===1){let s=`
          float ${e}(int index) {
            vec2 uv = vec2((float(index) + 0.5) / ${o}.0, 0.5);
            return sampleTexture(${n}, uv);
          }
        `;return new X(s,["coordinates.sampleTexture"])}if(o===1){let s=`
          float ${e}(int index) {
            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${i}.0);
            return sampleTexture(${n}, uv);
          }
        `;return new X(s,["coordinates.sampleTexture"])}let a=`
        float ${e}(int index) {
          vec2 uv = uvFromFlat(${o}, ${i}, index);
          return sampleTexture(${n}, uv);
        }
      `;return new X(a,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler2D(e,n,t){let o=t.unpackedShape,i=[t.height,t.width];if(i!=null&&Dr.arraysEqual(o,i)){let h=i[1],g=i[0],b=`
          float ${e}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${h}.0, ${g}.0);
            return sampleTexture(${n}, uv);
          }
        `;return new X(b,["coordinates.sampleTexture"])}let{newShape:a,keptDims:s}=ao(o),u=a;if(u.length<o.length){let h=to(o,u),g=JSON.parse(JSON.stringify(t));g.unpackedShape=h;let b=["col","row"],_=`
          ${this.getUnpackedSamplerFromInput(e,n,g).routineBody}
          float ${e}(int row, int col) {
            return ${e}(${no(b,s)});
          }
        `;return new X(_,["coordinates.sampleTexture"])}let l=i[1],d=i[0];if(d===1){let h=`
          float ${e}(int row, int col) {
            int offset_${n} = coordsToOffset(TexCoords, ${l}, ${d});
            float index = dot(vec3(row, col, offset_${n}), vec3(${o[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
            return sampleTexture(${n}, uv);
          }
        `;return new X(h,["coordinates.sampleTexture","coordinates.coordsToOffset"])}if(l===1){let h=`
          float ${e}(int row, int col) {
            int offset_${n} = coordsToOffset(TexCoords, ${l}, ${d});
            float index = dot(vec3(row, col, offset_${n}), vec3(${o[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${d}.0, 0.5);
            return sampleTexture(${n}, uv);
          }
        `;return new X(h,["coordinates.sampleTexture","coordinates.coordsToOffset"])}let p=`
        float ${e}(int row, int col) {
          int index = col * ${o[1]} + row;
          vec2 uv = uvFromFlat(${l}, ${d}, index);
          return sampleTexture(${n}, uv);
        }
      `;return new X(p,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler3D(e,n,t){let o=t.unpackedShape,i=o[1]*o[2],a=o[2],{newShape:s,keptDims:u}=ao(o),l=s;if(l.length<o.length){let g=to(o,l),b=["batch","col","row"],_=JSON.parse(JSON.stringify(t));_.unpackedShape=g;let I=this.getUnpackedSamplerFromInput(e,n,_),w=u.reverse(),v=`
          ${I.routineBody}
          float ${e}(int batch, int row, int col) {
            return ${e}(${no(b,w)});
          }
        `;return new X(v,I.dependencies)}let d=t.width,p=t.height,h=`
          float ${e}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${i} + col * ${a} + row;
            vec2 uv = uvFromFlat(${d}, ${p}, index);
            return sampleTexture(${n}, uv);
          }
      `;return new X(h,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler4D(e,n,t){let o=t.unpackedShape,i=o[3],a=o[2]*i,s=o[1]*a,u=t.width,l=t.height,d=`
        float ${e}(int row, int col, int depth, int depth2) {
          int index = row * ${s} + col * ${a} +
              depth2 * ${i} + depth;
          vec2 uv = uvFromFlat(${u}, ${l}, index);
          return sampleTexture(${n}, uv);
        }
      `;return new X(d,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler5D(e,n,t){let o=t.unpackedShape,i=o[4],a=o[3]*i,s=o[2]*a,u=o[1]*s,{newShape:l,keptDims:d}=ao(o);if(l.length<o.length){let b=to(o,l),_=["row","col","depth","depth2","depth3"],I=JSON.parse(JSON.stringify(t));I.unpackedShape=b;let w=`
          ${this.getUnpackedSamplerFromInput(e,n,I).routineBody}
          float ${e}(int row, int col, int depth, int depth2, int depth3) {
            return ${e}(${no(_,d)});
          }
        `;return new X(w,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let p=t.width,h=t.height,g=`
        float ${e}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${u} + col * ${s} + depth * ${a} +
          depth3 * ${i} + depth2;
          vec2 uv = uvFromFlat(${p}, ${h}, index);
          return sampleTexture(${n}, uv);
        }
      `;return new X(g,["coordinates.sampleTexture","coordinates.uvFromFlat"])}getUnpackedSampler6D(e,n,t){let o=t.unpackedShape,i=o[5],a=o[4]*i,s=o[3]*a,u=o[2]*s,l=o[1]*u,{newShape:d,keptDims:p}=ao(o);if(d.length<o.length){let _=to(o,d),I=["row","col","depth","depth2","depth3","depth4"],w=JSON.parse(JSON.stringify(t));w.unpackedShape=_;let v=`
            ${this.getUnpackedSamplerFromInput(e,n,w).routineBody}
            float ${e}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${e}(${no(I,p)});
            }
          `;return new X(v,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let h=t.width,g=t.height,b=`
          float ${e}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${l} + col * ${u} + depth * ${s} +
            depth2 * ${a} + depth3 * ${i} + depth4;
            vec2 uv = uvFromFlat(${h}, ${g}, index);
            return sampleTexture(${n}, uv);
          }
        `;return new X(b,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}toVec(){let e=this.context.outputTextureLayout,n=e.shape.length,t=e.strides,o=e.width,i=e.height,a=[];for(let u=0;u<n-1;++u)a.push(`
        c[${u}] = offset / ${t[u]};`),a.push(`
        offset -= c[${u}] * ${t[u]};`);a.push(`
        c[${n-1}] = offset;`);let s=`
      void toVec(vec2 texCoords, out int c[${n}]) {
        int offset = coordsToOffset(texCoords, ${o}, ${i});
        ${a.join("")}
      }
      void toVec(int offset, out int c[${n}]) {
        ${a.join("")}
      }
    `;return{toVec:new X(s,["coordinates.coordsToOffset"])}}valueFrom(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t],a=(o.unpackedShape.length>0?o.unpackedShape:o.shape).length,s=`_${n}`;e[s]=new X(this.getValueFromSingle(n,a,o.width,o.height,!1),[`shapeUtils.indicesToOffset${s}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"]),s=s+"_T",e[s]=new X(this.getValueFromSingle(n,a,o.width,o.height,!0),[`shapeUtils.indicesToOffset${s}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"])}),e}getValueFromSingle(e,n,t,o,i){let a=`_${e}`;i&&(a=a+"_T");let s=se(this.context.glContext.version);return`
        float ${a}(int m[${n}]) {
          int offset = indicesToOffset${a}(m);
          vec2 coords = offsetToCoords(offset, ${t}, ${o});
          float value = getColorAsFloat(${s.texture2D}(${e}, coords));
          return value;
        }
        `}getPackedValueFrom(e,n,t,o,i){let a=`_${e}_Pack`;i&&(a=a+"_T");let s=se(this.context.glContext.version);return`
        vec4 ${a}(int m[${n}]) {
          int offset = indicesToOffset_${e}(m);
          vec2 coords = offsetToCoords(offset, ${t}, ${o});
          return ${s.texture2D}(${e}, coords);
        }
        `}}});var ea,Ty=N(()=>{"use strict";Qn();ea=class r extends Mt{constructor(e){super(e)}getFunctions(){return{...this.encodeFloat32(),...this.decodeFloat32()}}getCustomTypes(){return{}}encodeFloat32(){return{encode:new X(`highp vec4 encode(highp float f) {
        return vec4(f, 0.0, 0.0, 0.0);
      }
        `)}}decodeFloat32(){return{decode:new X(`highp float decode(highp vec4 rgba) {
        return rgba.r;
      }
        `)}}encodeUint8(){let e=r.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{encode:new X(`
      highp vec4 encode(highp float f) {
        highp float F = abs(f);
        highp float Sign = step(0.0,-f);
        highp float Exponent = floor(log2(F));
        highp float Mantissa = (exp2(- Exponent) * F);
        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));
        highp vec4 rgba;
        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));
        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));
        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
        ${e}
        rgba = rgba / 255.0; // values need to be normalized to [0,1]
        return rgba;
    }
        `)}}decodeUint8(){let e=r.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{decode:new X(`
        highp float decode(highp vec4 rgba) {
          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]
          ${e}
          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;
          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;
          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
          return Result;
      }
        `)}}static isLittleEndian(){let e=new ArrayBuffer(4),n=new Uint32Array(e),t=new Uint8Array(e);if(n[0]=3735928559,t[0]===239)return!0;if(t[0]===222)return!1;throw new Error("unknown endianness")}}});var ta,Iy=N(()=>{"use strict";Qn();Je();ta=class extends Mt{constructor(e){super(e)}getFunctions(){return{...this.setFragColor(),...this.getColorAsFloat()}}getCustomTypes(){return{}}setFragColor(){let e=se(this.context.glContext.version);return{setFragColor:new X(`
        void setFragColor(float value) {
            ${e.output} = encode(value);
        }
        `,["encoding.encode"])}}getColorAsFloat(){return{getColorAsFloat:new X(`
        float getColorAsFloat(vec4 color) {
            return decode(color);
        }
        `,["encoding.decode"])}}}});var na,Sy=N(()=>{"use strict";Qn();na=class r extends Mt{constructor(e){super(e)}getFunctions(){return{...this.bcastIndex(),...this.bcastMatmulIndex(),...this.offsetToIndices(),...this.indicesToOffset(),...this.incrementIndices()}}getCustomTypes(){return{}}bcastIndex(){let e=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((t,o)=>{let i=this.context.inputTextureLayouts[o].unpackedShape;if(i.length<=e){let a=i.length,s=e-a,u=`bcastIndices_${t}`,l="";for(let p=0;p<a;++p)l+=`
          realIndices[${p}] = int( mod(float(bcastedIndices[${s+p}]), ${i[p]}.0) );
          `;let d=`
        void ${u} (int bcastedIndices[${e}], out int realIndices[${a}]) {
          ${l}
        }
        `;n[u]=new X(d)}}),n}bcastMatmulIndex(){let e=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((t,o)=>{let i=this.context.inputTextureLayouts[o].shape;if(!(i.length<2||i.length>e)){let a=i.length,s=e-a,u=`bcastMatmulIndices_${t}`,l="";for(let p=0;p<a-2;++p)l+=`
          realIndices[${p}] = int( mod(float(bcastedIndices[${s+p}]), ${i[p]}.0) );
          `;let d=`
        void ${u}(int bcastedIndices[${e}], out int realIndices[${a}]) {
          ${l}
          realIndices[${a-1}] = bcastedIndices[${e-1}];
          realIndices[${a-2}] = bcastedIndices[${e-2}];
        }
        `;n[u]=new X(d)}}),n}indicesToOffset(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t].shape,i=this.context.inputTextureLayouts[t].strides,a=o.length,s=`indicesToOffset_${n}`;e[s]=new X(r.indexToOffsetSingle(s,a,i)),s=`indicesToOffset_${n}_T`,e[s]=new X(r.indexToOffsetSingle(s,a,i.slice().reverse()))}),e}static indexToOffsetSingle(e,n,t){let o="";for(let i=n-1;i>=0;--i)o+=`
        offset += indices[${i}] * ${t[i]};
        `;return`
      int ${e}(int indices[${n}]) {
        int offset = 0;
        ${o}
        return offset;
      }
      `}offsetToIndices(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t].shape,i=this.context.inputTextureLayouts[t].strides,a=o.length,s=`offsetToIndices_${n}`;e[s]=new X(r.offsetToIndicesSingle(s,a,i)),s=`offsetToIndices_${n}_T`,e[s]=new X(r.offsetToIndicesSingle(s,a,i.slice().reverse()))}),e}static offsetToIndicesSingle(e,n,t){let o=[];for(let i=0;i<n-1;++i)o.push(`
      indices[${i}] = offset / ${t[i]};`),o.push(`
        offset -= indices[${i}] * ${t[i]};`);return o.push(`
      indices[${n-1}] = offset;`),`
      void ${e}(int offset, out int indices[${n}]) {
        ${o.join("")}
      }
      `}incrementIndices(){let e={};return this.context.programInfo.inputNames.forEach((n,t)=>{let o=this.context.inputTextureLayouts[t].shape,i=o.length,a=`incrementIndices_${n}`,s="";for(let l=0;l<i;++l)s+=`
        shape[${l}] = ${o[l]};`;let u=`
        void ${a}(int axis, out int indices[${i}]) {
          int shape[${i}];
          ${s};
          for(int i = ${i} -1 ; i >= 0; --i) {
            if(i > axis) continue;
            indices[i] += 1;
            if(indices[i] < shape[i]) {
              break;
            }
            indices[i] = 0;
          }
        }
        `;e[a]=new X(u)}),e}}});var ra,$y=N(()=>{"use strict";Qn();ra=class extends Mt{constructor(e){super(e)}getCustomTypes(){return{}}getFunctions(){return{...this.binaryVecFunctions(),...this.copyVec(),...this.setVecItem(),...this.getVecItem()}}binaryVecFunctions(){let n=this.context.outputTextureLayout.shape.length,t={add:"+=",sub:"-=",mul:"*=",div:"/="},o={};for(let i in t){let a=`${i}Vec`,s="";for(let l=0;l<n;++l)s+=`
          dest[${l}] ${t[i]} src[${l}];
          `;let u=`
        void ${a}(int src[${n}], out int dest[${n}]) {
          ${s}
        }
        `;o[a]=new X(u)}return o}copyVec(){let n=this.context.outputTextureLayout.shape.length,t="";for(let i=0;i<n;++i)t+=`
        dest[${i}] = src[${i}];
        `;let o=`
      void copyVec(int src[${n}], out int dest[${n}]) {
        ${t}
      }
      `;return{copyVec:new X(o)}}setVecItem(){let n=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index =${n} + index;
        if (index == 0)
            m[0] = value;
        `;for(let i=1;i<n-1;++i)t+=`
        else if (index == ${i})
            m[${i}] = value;
            `;t+=`
        else
            m[${n-1}] = value;
        `;let o=`
      void setVecItem(out int m[${n}], int index, int value) {
        ${t}
      }
        `;return{setVecItem:new X(o)}}getVecItem(){let n=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index = ${n} + index;
        if (index == 0)
            return m[0];
      `;for(let i=1;i<n-1;++i)t+=`
        else if (index == ${i})
            return m[${i}];
      `;t+=`
        else
            return m[${n-1}];
        `;let o=`
      int getVecItem(int m[${n}], int index) {
        ${t}
      }
    `;return{getVecItem:new X(o)}}}});var Zl,Ay=N(()=>{"use strict";xy();Ty();Iy();Sy();$y();Zl={encoding:ea,fragcolor:ta,vec:ra,shapeUtils:na,coordinates:Yi}});var oa,Oy=N(()=>{"use strict";Qn();wy();Ay();Je();oa=class{constructor(e,n,t,o){this.libs={};this.glslLibRoutineDependencyGraph={};this.context=new Gi(e,n,t,o),Object.keys(Zl).forEach(a=>{let s=new Zl[a](this.context);this.libs[a]=s});let i=this.glslLibRoutineDependencyGraph;for(let a in this.libs){let u=this.libs[a].getFunctions();for(let l in u){let d=a+"."+l,p;i[d]?(p=i[d],p.routineBody=u[l].routineBody):(p=new No(d,u[l].routineBody),i[d]=p);let h=u[l].dependencies;if(h)for(let g=0;g<h.length;++g)if(i[h[g]])p.addDependency(i[h[g]]);else{let b=new No(h[g]);i[h[g]]=b,p.addDependency(b)}}}}preprocess(){let e=this.context.programInfo,n=e.shaderSource;return this.context.programInfo.hasMain||(n=`${n}
      ${um(this.context.glContext.version,this.context.outputTextureLayout.shape.length)}`),n=_y(n),`${sm(this.context.glContext.version)}
    ${this.getUniforms(e.inputNames,e.variables)}
    ${this.getImports(n)}
    ${n}`}getImports(e){let n=this.selectGlslLibRoutinesToBeIncluded(e);if(n.length===0)return"";let t="";for(let o=0;o<n.length;++o)if(n[o].routineBody)t+=n[o].routineBody+`
`;else throw new Error(`Missing body for the Glsl Library routine: ${n[o].name}`);return t}selectGlslLibRoutinesToBeIncluded(e){let n=[];return Object.keys(this.glslLibRoutineDependencyGraph).forEach(t=>{let o=t.split(".")[1];e.indexOf(o)!==-1&&n.push(this.glslLibRoutineDependencyGraph[t])}),Ui.returnOrderedNodes(n)}getUniforms(e,n){let t=[];if(e)for(let o of e)t.push(`uniform sampler2D ${o};`);if(n)for(let o of n)t.push(`uniform ${o.type} ${o.name}${o.arrayLength?`[${o.arrayLength}]`:""};`);return t.join(`
`)}}});var ia,Py=N(()=>{"use strict";ft();Dt();Oy();Je();ia=class{constructor(e,n,t){this.profiler=e;this.glContext=n;this.textureLayoutStrategy=t;this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,n){this.repo.set(e,n)}run(e,n,t){this.profiler.event("op",`ProgramManager.run ${e.programInfo.name??"unknown kernel"}`,()=>{let o=this.glContext.gl,i=e.program;o.useProgram(i);try{this.bindOutput(t),this.attributesBound||this.bindAttributes(e.attribLocations),this.bindUniforms(e.uniformLocations,e.programInfo.variables??[],n)}catch(a){throw Be.error("ProgramManager",e.programInfo.shaderSource),a}this.profiler.event("backend","GlContext.draw()",()=>{this.glContext.draw()})},this.glContext)}dispose(){this.vertexShader&&this.glContext.deleteShader(this.vertexShader),this.repo.forEach(e=>this.glContext.deleteProgram(e.program))}build(e,n,t){return this.profiler.event("backend","ProgramManager.build",()=>{let o=new oa(this.glContext,e,n,t),i=o.preprocess(),a=this.compile(i);return{programInfo:e,program:a,uniformLocations:this.getUniformLocations(a,o.context.programInfo.inputNames,o.context.programInfo.variables),attribLocations:this.getAttribLocations(a)}})}compile(e){if(!this.vertexShader){Be.verbose("ProrgramManager","Compiling and caching Vertex shader for the first time");let o=am(this.glContext.version);this.vertexShader=this.glContext.compileShader(o,this.glContext.gl.VERTEX_SHADER)}ce.debug&&Be.verbose("ProrgramManager",`FragShader:
${e}
`);let n=this.glContext.compileShader(e,this.glContext.gl.FRAGMENT_SHADER),t=this.glContext.createProgram(this.vertexShader,n);return this.glContext.deleteShader(n),t}bindOutput(e){let n=e.width,t=e.height;Be.verbose("ProrgramManager",`Binding output texture to Framebuffer: w/h=${n}/${t}, shape=${e.shape}, type=${e.tensor.type}`),this.glContext.attachFramebuffer(e.texture,n,t)}bindAttributes(e){let n=e.position,t=e.textureCoord;this.glContext.setVertexAttributes(n,t),this.attributesBound=!0}bindUniforms(e,n,t){let o=this.glContext.gl,i=0;for(let{name:a,type:s,location:u,arrayLength:l}of e){let d=n.find(p=>p.name===a)?.data;if(s!=="sampler2D"&&!d)throw new Error(`variable '${a}' does not have data defined in program info`);switch(s){case"sampler2D":this.bindTexture(t[i],u,i),i++;break;case"float":l?o.uniform1fv(u,d):o.uniform1f(u,d);break;case"int":l?o.uniform1iv(u,d):o.uniform1i(u,d);break;default:throw new Error(`Uniform not implemented: ${s}`)}}}bindTexture(e,n,t){this.glContext.bindTextureToUniform(e.texture,t,n)}getAttribLocations(e){return{position:this.getAttribLocation(e,"position"),textureCoord:this.getAttribLocation(e,"textureCoord")}}getUniformLocations(e,n,t){let o=[];if(n)for(let i of n)o.push({name:i,type:"sampler2D",location:this.getUniformLocation(e,i)});if(t)for(let i of t)o.push({...i,location:this.getUniformLocation(e,i.name)});return o}getUniformLocation(e,n){let o=this.glContext.gl.getUniformLocation(e,n);if(o===null)throw new Error(`Uniform ${n} not found.`);return o}getAttribLocation(e,n){return this.glContext.gl.getAttribLocation(e,n)}}});var aa,Ey=N(()=>{"use strict";Dt();Do();aa=class{constructor(e,n,t,o){this.glContext=e;this.layoutStrategy=n;this.profiler=t;this.config=o;this.pendingRead=new Map;o.reuseTextures&&(this.inUseTextures=new Map,this.idleTextures=new Map,this.textureLookup=new Map)}createTextureFromLayout(e,n,t,o){let i=this.toEncoderType(e),a=this.glContext.getEncoder(i,n.channels||1,o);if(n.isPacked&&o===1)throw new Error("not implemented");let s=n.width,u=n.height,l,d;if(this.config.reuseTextures){l=`${s}x${u}_${a.format}_${a.internalFormat}_${a.textureType}`,d=this.inUseTextures.get(l),d||(d=[],this.inUseTextures.set(l,d));let h=this.idleTextures.get(l);if(h&&h.length>0){let g=h.pop();return d.push(g),o===1&&this.glContext.updateTexture(g,s,u,a,this.toTextureData(e,t)),g}}Be.verbose("TextureManager",`Creating new texture of size ${n.width}x${n.height}`);let p=this.glContext.allocateTexture(s,u,a,this.toTextureData(e,t));return this.config.reuseTextures&&(d.push(p),this.textureLookup.set(p,l)),p}readTexture(e,n,t){return t||(t=1),this.profiler.event("backend","TextureManager.readTexture",()=>{let o=e.shape.reduce((a,s)=>a*s)*t,i=this.glContext.readTexture(e.texture,e.width,e.height,o,this.toEncoderType(n),t);return this.toTensorData(n,i)})}async readTextureAsync(e,n,t){let o=e.tensor.dataId;if(t||(t=1),this.pendingRead.has(o)){let i=this.pendingRead.get(o);return new Promise(a=>i?.push(a))}return this.profiler.event("backend","TextureManager.readTextureAsync",async()=>{this.pendingRead.set(o,[]);let i=e.shape.reduce((l,d)=>l*d)*t;await this.glContext.createAndWaitForFence();let a=this.glContext.readTexture(e.texture,e.width,e.height,i,this.toEncoderType(n),t),s=this.toTensorData(n,a),u=this.pendingRead.get(o);return this.pendingRead.delete(o),u?.forEach(l=>l(s)),s})}readUint8TextureAsFloat(e){return this.profiler.event("backend","TextureManager.readUint8TextureAsFloat",()=>{let n=e.shape.reduce((o,i)=>o*i),t=this.glContext.readTexture(e.texture,e.width,e.height,n*4,"byte",4);return new Float32Array(t.buffer,t.byteOffset,n)})}releaseTexture(e,n){let t;if(this.config.reuseTextures&&(t=this.textureLookup.get(e.texture),t)){n&&this.textureLookup.delete(t);let o=this.inUseTextures.get(t);if(o){let i=o.indexOf(e.texture);if(i!==-1){o.splice(i,1);let a=this.idleTextures.get(t);a||(a=[],this.idleTextures.set(t,a)),a.push(e.texture)}}}(!t||n)&&(Be.verbose("TextureManager",`Deleting texture of size ${e.width}x${e.height}`),this.glContext.deleteTexture(e.texture))}toTensorData(e,n){switch(e){case"int16":return n instanceof Int16Array?n:Int16Array.from(n);case"int32":return n instanceof Int32Array?n:Int32Array.from(n);case"int8":return n instanceof Int8Array?n:Int8Array.from(n);case"uint16":return n instanceof Uint16Array?n:Uint16Array.from(n);case"uint32":return n instanceof Uint32Array?n:Uint32Array.from(n);case"uint8":case"bool":return n instanceof Uint8Array?n:Uint8Array.from(n);case"float32":return n instanceof Float32Array?n:Float32Array.from(n);case"float64":return n instanceof Float64Array?n:Float64Array.from(n);default:throw new Error(`TensorData type ${e} is not supported`)}}toTextureData(e,n){if(n)return n instanceof Float32Array?n:new Float32Array(n)}toEncoderType(e){return"float"}clearActiveTextures(){this.glContext.clearActiveTextures()}}});var sa,Cy=N(()=>{"use strict";Dt();wf();Tm();by();Py();Xl();Ey();sa=class{constructor(e,n){this.backend=e;this.context=n;this.layoutStrategy=new Qi(e.glContext.maxTextureSize),this.programManager=new ia(this.context.profiler,e.glContext,this.layoutStrategy),this.textureManager=new aa(e.glContext,this.layoutStrategy,this.context.profiler,{reuseTextures:e.textureCacheMode==="full"}),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map,this.pack=e.pack,this.pack2unpackMap=new Map,this.unpack2packMap=new Map}createInferenceHandler(){return new Vi(this)}onGraphInitialized(e){let n=e.getValues().filter(t=>t.from===-1&&t.tensor).map(t=>t.tensor.dataId);this.initializers=new Set(n)}isInitializer(e){return this.initializers?this.initializers.has(e):!1}addInitializer(e){this.initializers.add(e)}getTextureData(e,n){return n?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,n,t=!1){Be.verbose("WebGLSessionHandler","Storing Texture data in cache"),t?this.packedTextureDataCache.set(e,n):this.unpackedTextureDataCache.set(e,n)}dispose(){this.programManager.dispose(),this.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.unpackedTextureDataCache=new Map}resolve(e,n,t){let o=_f(e,n,gy);return{impl:o.opImpl,context:o.opInit?o.opInit(e,t):e}}}});function KP(r){let e=0;for(;e<r.length&&r[e]();++e);return e-1}var zo,Dy=N(()=>{"use strict";ft();Do();Do();zn();zo=class{constructor(e,n){this.frameBufferBound=!1;this.itemsToPoll=[];this.gl=e,this.version=n,this.getExtensions(),this.vertexbuffer=this.createVertexbuffer(),this.framebuffer=this.createFramebuffer(),this.queryVitalParameters()}allocateTexture(e,n,t,o){let i=this.gl,a=i.createTexture();i.bindTexture(i.TEXTURE_2D,a),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);let s=o?t.encode(o,e*n):null;return i.texImage2D(i.TEXTURE_2D,0,t.internalFormat,e,n,0,t.format,t.textureType,s),this.checkError(),a}updateTexture(e,n,t,o,i){let a=this.gl;a.bindTexture(a.TEXTURE_2D,e);let s=o.encode(i,n*t);a.texSubImage2D(a.TEXTURE_2D,0,0,0,n,t,o.format,o.textureType,s),this.checkError()}attachFramebuffer(e,n,t){let o=this.gl;o.bindTexture(o.TEXTURE_2D,e),o.bindFramebuffer(o.FRAMEBUFFER,this.framebuffer),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,e,0),this.checkError(),o.viewport(0,0,n,t),o.scissor(0,0,n,t)}readTexture(e,n,t,o,i,a){let s=this.gl;a||(a=1),this.frameBufferBound||this.attachFramebuffer(e,n,t);let u=this.getEncoder(i,a),l=u.allocate(n*t);return s.bindTexture(s.TEXTURE_2D,e),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,e,0),s.readPixels(0,0,n,t,s.RGBA,u.textureType,l),this.checkError(),u.decode(l,o)}isFramebufferReady(){return!0}getActiveTexture(){let e=this.gl;return`TEXTURE${e.getParameter(this.gl.ACTIVE_TEXTURE)-e.TEXTURE0}`}getTextureBinding(){return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D)}getFramebufferBinding(){return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)}setVertexAttributes(e,n){let t=this.gl;t.vertexAttribPointer(e,3,t.FLOAT,!1,20,0),t.enableVertexAttribArray(e),n!==-1&&(t.vertexAttribPointer(n,2,t.FLOAT,!1,20,12),t.enableVertexAttribArray(n)),this.checkError()}createProgram(e,n){let t=this.gl,o=t.createProgram();return t.attachShader(o,e),t.attachShader(o,n),t.linkProgram(o),o}compileShader(e,n){let t=this.gl,o=t.createShader(n);if(!o)throw new Error(`createShader() returned null with type ${n}`);if(t.shaderSource(o,e),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)===!1)throw new Error(`Failed to compile shader: ${t.getShaderInfoLog(o)}
Shader source:
${e}`);return o}deleteShader(e){this.gl.deleteShader(e)}bindTextureToUniform(e,n,t){let o=this.gl;o.activeTexture(o.TEXTURE0+n),this.checkError(),o.bindTexture(o.TEXTURE_2D,e),this.checkError(),o.uniform1i(t,n),this.checkError()}draw(){this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.checkError()}checkError(){if(ce.debug){let e=this.gl,n=e.getError(),t="";switch(n){case e.NO_ERROR:return;case e.INVALID_ENUM:t="INVALID_ENUM";break;case e.INVALID_VALUE:t="INVALID_VALUE";break;case e.INVALID_OPERATION:t="INVALID_OPERATION";break;case e.INVALID_FRAMEBUFFER_OPERATION:t="INVALID_FRAMEBUFFER_OPERATION";break;case e.OUT_OF_MEMORY:t="OUT_OF_MEMORY";break;case e.CONTEXT_LOST_WEBGL:t="CONTEXT_LOST_WEBGL";break;default:t=`Unknown WebGL Error: ${n.toString(16)}`}throw new Error(t)}}deleteTexture(e){this.gl.deleteTexture(e)}deleteProgram(e){this.gl.deleteProgram(e)}getEncoder(e,n,t=0){if(this.version===2)return new Bi(this.gl,n);switch(e){case"float":return t===1||this.isRenderFloat32Supported?new Co(this.gl,n):new Co(this.gl,n,this.textureHalfFloatExtension.HALF_FLOAT_OES);case"int":throw new Error("not implemented");case"byte":return new Fi(this.gl,n);default:throw new Error(`Invalid dataType: ${e}`)}}clearActiveTextures(){let e=this.gl;for(let n=0;n<this.maxTextureImageUnits;++n)e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,null)}dispose(){if(this.disposed)return;let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(this.framebuffer),e.bindBuffer(e.ARRAY_BUFFER,null),e.deleteBuffer(this.vertexbuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.finish(),this.disposed=!0}createDefaultGeometry(){return new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0])}createVertexbuffer(){let e=this.gl,n=e.createBuffer();if(!n)throw new Error("createBuffer() returned null");let t=this.createDefaultGeometry();return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),this.checkError(),n}createFramebuffer(){let e=this.gl.createFramebuffer();if(!e)throw new Error("createFramebuffer returned null");return e}queryVitalParameters(){let e=this.gl;if(this.isFloatTextureAttachableToFrameBuffer=this.checkFloatTextureAttachableToFrameBuffer(),this.isRenderFloat32Supported=this.checkRenderFloat32(),this.isFloat32DownloadSupported=this.checkFloat32Download(),this.version===1&&!this.textureHalfFloatExtension&&!this.isRenderFloat32Supported)throw new Error("both float32 and float16 TextureType are not supported");this.isBlendSupported=!this.isRenderFloat32Supported||this.checkFloat32Blend(),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxTextureImageUnits=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.version}getExtensions(){this.version===2?(this.colorBufferFloatExtension=this.gl.getExtension("EXT_color_buffer_float"),this.disjointTimerQueryWebgl2Extension=this.gl.getExtension("EXT_disjoint_timer_query_webgl2")):(this.textureFloatExtension=this.gl.getExtension("OES_texture_float"),this.textureHalfFloatExtension=this.gl.getExtension("OES_texture_half_float"))}checkFloatTextureAttachableToFrameBuffer(){let e=this.gl,n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);let t=this.version===2?e.RGBA32F:e.RGBA;e.texImage2D(e.TEXTURE_2D,0,t,1,1,0,e.RGBA,e.FLOAT,null);let o=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,o),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0);let i=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(n),e.deleteFramebuffer(o),i}checkRenderFloat32(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension)return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Download(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension||!this.gl.getExtension("WEBGL_color_buffer_float"))return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Blend(){let e=this.gl,n,t,o,i,a;try{n=e.createTexture(),t=e.createFramebuffer(),e.bindTexture(e.TEXTURE_2D,n);let s=this.version===2?e.RGBA32F:e.RGBA;return e.texImage2D(e.TEXTURE_2D,0,s,1,1,0,e.RGBA,e.FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,t),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.enable(e.BLEND),o=e.createShader(e.VERTEX_SHADER),!o||(e.shaderSource(o,"void main(){}"),e.compileShader(o),i=e.createShader(e.FRAGMENT_SHADER),!i)||(e.shaderSource(i,"precision highp float;void main(){gl_FragColor=vec4(0.5);}"),e.compileShader(i),a=e.createProgram(),!a)?!1:(e.attachShader(a,o),e.attachShader(a,i),e.linkProgram(a),e.useProgram(a),e.drawArrays(e.POINTS,0,1),e.getError()===e.NO_ERROR)}finally{e.disable(e.BLEND),a&&e.deleteProgram(a),o&&e.deleteShader(o),i&&e.deleteShader(i),t&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(t)),n&&(e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(n))}}beginTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,n=this.disjointTimerQueryWebgl2Extension,t=e.createQuery();return e.beginQuery(n.TIME_ELAPSED_EXT,t),t}else throw new Error("WebGL1 profiling currently not supported.")}endTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,n=this.disjointTimerQueryWebgl2Extension;e.endQuery(n.TIME_ELAPSED_EXT);return}else throw new Error("WebGL1 profiling currently not supported")}isTimerResultAvailable(e){let n=!1,t=!1;if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let o=this.gl,i=this.disjointTimerQueryWebgl2Extension;n=o.getQueryParameter(e,o.QUERY_RESULT_AVAILABLE),t=o.getParameter(i.GPU_DISJOINT_EXT)}else throw new Error("WebGL1 profiling currently not supported");return n&&!t}getTimerResult(e){let n=0;if(this.version===2){let t=this.gl;n=t.getQueryParameter(e,t.QUERY_RESULT),t.deleteQuery(e)}else throw new Error("WebGL1 profiling currently not supported");return n/1e6}async waitForQueryAndGetTime(e){return await vl(()=>this.isTimerResultAvailable(e)),this.getTimerResult(e)}async createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let n,t=e,o=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),o===null?n=()=>!0:n=()=>{let i=t.clientWaitSync(o,0,0);return i===t.ALREADY_SIGNALED||i===t.CONDITION_SATISFIED},{query:o,isFencePassed:n}}async pollFence(e){return new Promise(n=>{this.addItemToPoll(()=>e.isFencePassed(),()=>n())})}pollItems(){let e=KP(this.itemsToPoll.map(n=>n.isDoneFn));for(let n=0;n<=e;++n){let{resolveFn:t}=this.itemsToPoll[n];t()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}async addItemToPoll(e,n){this.itemsToPoll.push({isDoneFn:e,resolveFn:n}),!(this.itemsToPoll.length>1)&&await vl(()=>(this.pollItems(),this.itemsToPoll.length===0))}}});function Jl(r){let e;if((!r||r==="webgl2")&&"webgl2"in so?e=so.webgl2:(!r||r==="webgl")&&"webgl"in so&&(e=so.webgl),!e)try{let t=ZP();e=ky(t,r)}catch{let t=XP();e=ky(t,r)}r=r||e.version===1?"webgl":"webgl2";let n=e.gl;return so[r]=e,n.isContextLost()?(delete so[r],Jl(r)):(n.disable(n.DEPTH_TEST),n.disable(n.STENCIL_TEST),n.disable(n.BLEND),n.disable(n.DITHER),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SAMPLE_COVERAGE),n.enable(n.SCISSOR_TEST),n.enable(n.CULL_FACE),n.cullFace(n.BACK),e)}function ky(r,e){let n={alpha:!1,depth:!1,antialias:!1,stencil:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1,failIfMajorPerformanceCaveat:!1},t,o=n;if((!e||e==="webgl2")&&(t=r.getContext("webgl2",o),t))try{return new zo(t,2)}catch(i){Be.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl2'. Error: ${i}`)}if((!e||e==="webgl")&&(t=r.getContext("webgl",o)||r.getContext("experimental-webgl",o),t))try{return new zo(t,1)}catch(i){Be.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${i}`)}throw new Error("WebGL is not supported")}function XP(){if(typeof document>"u")throw new TypeError("failed to create canvas: document is not supported");let r=document.createElement("canvas");return r.width=1,r.height=1,r}function ZP(){if(typeof OffscreenCanvas>"u")throw new TypeError("failed to create offscreen canvas: OffscreenCanvas is not supported");return new OffscreenCanvas(1,1)}var so,Ny=N(()=>{"use strict";Dt();Dy();so={}});var ua,Ly=N(()=>{"use strict";ft();Dt();Cy();Ny();ua=class{get contextId(){return ce.webgl.contextId}set contextId(e){ce.webgl.contextId=e}get matmulMaxBatchSize(){return ce.webgl.matmulMaxBatchSize}set matmulMaxBatchSize(e){ce.webgl.matmulMaxBatchSize=e}get textureCacheMode(){return ce.webgl.textureCacheMode}set textureCacheMode(e){ce.webgl.textureCacheMode=e}get pack(){return ce.webgl.pack}set pack(e){ce.webgl.pack=e}get async(){return ce.webgl.async}set async(e){ce.webgl.async=e}initialize(){try{return this.glContext=Jl(this.contextId),typeof this.matmulMaxBatchSize!="number"&&(this.matmulMaxBatchSize=16),typeof this.textureCacheMode!="string"&&(this.textureCacheMode="full"),typeof this.pack!="boolean"&&(this.pack=!1),typeof this.async!="boolean"&&(this.async=!1),Be.setWithEnv(ce),ce.webgl.context||Object.defineProperty(ce.webgl,"context",{value:this.glContext.gl}),Be.verbose("WebGLBackend",`Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`),!0}catch(e){return Be.warning("WebGLBackend",`Unable to initialize WebGLBackend. ${e}`),!1}}createSessionHandler(e){return new sa(this,e)}dispose(){this.glContext.dispose()}}});async function Ql(r){if(r){let e=typeof r=="string"?[r]:r;for(let n of e){let t=Ry.get(n);if(t)return t;let o=await QP(n);if(o)return o}}else return Ql(["webgl"]);throw new Error("no available backend to use")}async function QP(r){let e=JP;if(typeof e[r]<"u"&&YP(e[r])){let n=e[r],t=n.initialize();if(typeof t=="object"&&"then"in t&&(t=await t),t)return Ry.set(r,n),n}}function YP(r){let e=r;return"initialize"in e&&typeof e.initialize=="function"&&"createSessionHandler"in e&&typeof e.createSessionHandler=="function"&&"dispose"in e&&typeof e.dispose=="function"}var Ry,JP,zy=N(()=>{"use strict";Ly();Ry=new Map,JP={webgl:new ua}});var Yl,la,My=N(()=>{"use strict";Dt();Yl=class{constructor(e,n){this.op=e;this.node=n}},la=class{constructor(e,n,t){this.graph=e;this.profiler=t;this.initialize(n)}initialize(e){this.profiler.event("session","ExecutionPlan.initialize",()=>{let n=this.graph.getNodes();if(n.length!==e.length)throw new Error("The size of nodes and OPs do not match.");this._ops=e.map((t,o)=>new Yl(t,n[o])),this.reset(),this._starter=[],this._ops.forEach((t,o)=>{let i=!0;for(let a of t.node.inputs)if(!this._values[a]&&this.graph.getInputIndices().indexOf(a)===-1){i=!1;break}i&&this._starter.push(o)})})}reset(){this._values=this.graph.getValues().map(e=>e.tensor)}async execute(e,n){return this.profiler.event("session","ExecutionPlan.execute",async()=>{this.reset();let t=e.createInferenceHandler(),o=this.graph.getInputIndices();if(n.length!==o.length)throw new Error(`number of input tensors don't match the number of inputs to the model: actual: ${n.length} expected: ${o.length}`);n.forEach((d,p)=>{let h=o[p];this._values[h]=d});let i=this._starter.slice(0),a=this.graph.getValues(),s=this.graph.getNodes(),u=0;for(;u<i.length;){let d=i[u++],p=this._ops[d],h=p.node.inputs.map(I=>this._values[I]);if(h.indexOf(void 0)!==-1)throw new Error(`unresolved input detected: op: ${p.node}`);let g=h;Be.verbose("ExecPlan",`Running op:${p.node.name} (${g.map((I,w)=>`'${p.node.inputs[w]}': ${I.type}[${I.dims.join(",")}]`).join(", ")})`);let b=await this.profiler.event("node",p.node.name,async()=>p.op.impl(t,g,p.op.context));if(b.length!==p.node.outputs.length)throw new Error("the size of output does not match model definition.");b.forEach((I,w)=>{let v=p.node.outputs[w];if(this._values[v])throw new Error(`output [${v}] already has value: op:${p.node.name}`);this._values[v]=I});let _=new Set;b.forEach((I,w)=>{let v=p.node.outputs[w];for(let $ of a[v].to){let A=s[$],P=!0;for(let C of A.inputs)if(!this._values[C]){P=!1;break}P&&_.add($)}}),i.push(..._)}let l=[];for(let d=0;d<this.graph.getOutputIndices().length;d++){let p=this.graph.getOutputIndices()[d],h=this._values[p];if(h===void 0)throw new Error(`required output [${p}] does not have value`);p===0?await h.getData():h.data,l.push(h)}return Be.verbose("ExecPlan","disposing of inferenceHandler"),t.dispose(),l})}}});var Se,Mo,By=N(()=>{"use strict";So();Se=ye(Yr());Rr();ze();Mo=class r{constructor(e){if(this._attributes=new Map,e!=null){for(let n of e)n instanceof Se.onnx.AttributeProto?this._attributes.set(n.name,[r.getValue(n),r.getType(n)]):n instanceof Ci.Attribute&&this._attributes.set(n.name(),[r.getValue(n),r.getType(n)]);if(this._attributes.size<e.length)throw new Error("duplicated attribute names")}}set(e,n,t){this._attributes.set(e,[t,n])}delete(e){this._attributes.delete(e)}getFloat(e,n){return this.get(e,"float",n)}getInt(e,n){return this.get(e,"int",n)}getString(e,n){return this.get(e,"string",n)}getTensor(e,n){return this.get(e,"tensor",n)}getFloats(e,n){return this.get(e,"floats",n)}getInts(e,n){return this.get(e,"ints",n)}getStrings(e,n){return this.get(e,"strings",n)}getTensors(e,n){return this.get(e,"tensors",n)}get(e,n,t){let o=this._attributes.get(e);if(o===void 0){if(t!==void 0)return t;throw new Error(`required attribute not found: ${e}`)}if(o[1]!==n)throw new Error(`type mismatch: expected ${n} but got ${o[1]}`);return o[0]}static getType(e){let n=e instanceof Se.onnx.AttributeProto?e.type:e.type();switch(n){case Se.onnx.AttributeProto.AttributeType.FLOAT:return"float";case Se.onnx.AttributeProto.AttributeType.INT:return"int";case Se.onnx.AttributeProto.AttributeType.STRING:return"string";case Se.onnx.AttributeProto.AttributeType.TENSOR:return"tensor";case Se.onnx.AttributeProto.AttributeType.FLOATS:return"floats";case Se.onnx.AttributeProto.AttributeType.INTS:return"ints";case Se.onnx.AttributeProto.AttributeType.STRINGS:return"strings";case Se.onnx.AttributeProto.AttributeType.TENSORS:return"tensors";default:throw new Error(`attribute type is not supported yet: ${Se.onnx.AttributeProto.AttributeType[n]}`)}}static getValue(e){let n=e instanceof Se.onnx.AttributeProto?e.type:e.type();if(n===Se.onnx.AttributeProto.AttributeType.GRAPH||n===Se.onnx.AttributeProto.AttributeType.GRAPHS)throw new Error("graph attribute is not supported yet");let t=this.getValueNoCheck(e);if(n===Se.onnx.AttributeProto.AttributeType.INT&&Tt.isLong(t))return Tt.longToNumber(t);if(n===Se.onnx.AttributeProto.AttributeType.INTS){let o=t,i=new Array(o.length);for(let a=0;a<o.length;a++){let s=o[a];i[a]=Tt.longToNumber(s)}return i}if(n===Se.onnx.AttributeProto.AttributeType.TENSOR)return e instanceof Se.onnx.AttributeProto?ot.fromProto(t):ot.fromOrtTensor(t);if(n===Se.onnx.AttributeProto.AttributeType.TENSORS){if(e instanceof Se.onnx.AttributeProto)return t.map(i=>ot.fromProto(i));if(e instanceof Ci.Attribute)return t.map(i=>ot.fromOrtTensor(i))}return n===Se.onnx.AttributeProto.AttributeType.STRING&&e instanceof Se.onnx.AttributeProto?Eo(t):n===Se.onnx.AttributeProto.AttributeType.STRINGS&&e instanceof Se.onnx.AttributeProto?t.map(Eo):t}static getValueNoCheck(e){return e instanceof Se.onnx.AttributeProto?this.getValueNoCheckFromOnnxFormat(e):this.getValueNoCheckFromOrtFormat(e)}static getValueNoCheckFromOnnxFormat(e){switch(e.type){case Se.onnx.AttributeProto.AttributeType.FLOAT:return e.f;case Se.onnx.AttributeProto.AttributeType.INT:return e.i;case Se.onnx.AttributeProto.AttributeType.STRING:return e.s;case Se.onnx.AttributeProto.AttributeType.TENSOR:return e.t;case Se.onnx.AttributeProto.AttributeType.GRAPH:return e.g;case Se.onnx.AttributeProto.AttributeType.FLOATS:return e.floats;case Se.onnx.AttributeProto.AttributeType.INTS:return e.ints;case Se.onnx.AttributeProto.AttributeType.STRINGS:return e.strings;case Se.onnx.AttributeProto.AttributeType.TENSORS:return e.tensors;case Se.onnx.AttributeProto.AttributeType.GRAPHS:return e.graphs;default:throw new Error(`unsupported attribute type: ${Se.onnx.AttributeProto.AttributeType[e.type]}`)}}static getValueNoCheckFromOrtFormat(e){switch(e.type()){case Rt.AttributeType.FLOAT:return e.f();case Rt.AttributeType.INT:return e.i();case Rt.AttributeType.STRING:return e.s();case Rt.AttributeType.TENSOR:return e.t();case Rt.AttributeType.GRAPH:return e.g();case Rt.AttributeType.FLOATS:return e.floatsArray();case Rt.AttributeType.INTS:{let n=[];for(let t=0;t<e.intsLength();t++)n.push(e.ints(t));return n}case Rt.AttributeType.STRINGS:{let n=[];for(let t=0;t<e.stringsLength();t++)n.push(e.strings(t));return n}case Rt.AttributeType.TENSORS:{let n=[];for(let t=0;t<e.tensorsLength();t++)n.push(e.tensors(t));return n}default:throw new Error(`unsupported attribute type: ${Rt.AttributeType[e.type()]}`)}}}});var tc,nc,Fn,ca,ec,Fy=N(()=>{"use strict";By();So();tc=ye(Yr());Rr();ze();nc={from:(r,e)=>new ec(r,e)},Fn=class{constructor(e){this._from=void 0,this._to=[],this.tensor=void 0,this.type=void 0,e&&(this.type=ht.tensorValueTypeFromProto(e.type.tensorType))}get from(){return this._from}get to(){return this._to}},ca=class{constructor(e,n){e instanceof tc.onnx.NodeProto?(this.name=e.name,this.opType=e.opType,this.attributes=new Mo(e.attribute)):e instanceof rl.Node&&(this.name=n??e.name(),this.opType=e.opType(),this.attributes=new Mo(ht.tensorAttributesFromORTFormat(e))),this.inputs=[],this.outputs=[],this.executeNode=!0}},ec=class{constructor(e,n){if(!e)throw new TypeError("graph is empty");this.buildGraph(e),this.transformGraph(n),this.checkIsAcyclic()}getInputIndices(){return this._allInputIndices}getInputNames(){return this._allInputNames}getOutputIndices(){return this._allOutputIndices}getOutputNames(){return this._allOutputNames}getValues(){return this._allData}getNodes(){return this._nodes}buildGraph(e){if(e instanceof tc.onnx.GraphProto)this.buildGraphFromOnnxFormat(e);else if(e instanceof tl.Graph)this.buildGraphFromOrtFormat(e);else throw new TypeError("Graph type is not supported.")}buildGraphFromOnnxFormat(e){let n=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let t=new Map;if(!e.input)throw new Error("missing information in graph: input");let o=[];for(let i of e.input){if(n.has(i.name))throw new Error(`duplicated input name: ${i.name}`);let a=this._allData.push(new Fn(i))-1;n.set(i.name,a),o.push(i.name)}if(!e.initializer)throw new Error("missing information in graph: initializer");for(let i of e.initializer){let a=n.get(i.name);if(a===void 0){let s=new Fn;s.type={shape:{dims:ht.tensorDimsFromProto(i.dims)},tensorType:ht.tensorDataTypeFromProto(i.dataType)},a=this._allData.push(s)-1,n.set(i.name,a)}this._allData[a]._from=-1,this._allData[a].tensor=ot.fromProto(i)}for(let i=0;i<this._allData.length;i++)this._allData[i].tensor||(this._allInputIndices.push(i),this._allInputNames.push(o[i]));if(!e.output)throw new Error("missing information in graph: output");for(let i of e.output){if(n.has(i.name))throw new Error(`duplicated output name: ${i.name}`);let a=this._allData.push(new Fn(i))-1;n.set(i.name,a),this._allOutputIndices.push(a),this._allOutputNames.push(i.name)}if(!e.node)throw new Error("missing information in graph: node");for(let i of e.node){if(!i.name)for(let s=0;;s++){let u=`unnamed_${i.opType}_${s}`;if(!t.has(u)){i.name=u;break}}if(t.has(i.name))throw new Error(`duplicated node name: ${i.name}`);let a=this._nodes.push(new ca(i))-1;t.set(i.name,a)}for(let i=0;i<this._nodes.length;i++){let a=this._nodes[i],s=e.node[i];if(!s.output)throw new Error(`missing output for node: ${s.name}`);for(let u of s.output){let l=n.get(u);if(typeof l>"u"&&(l=this._allData.push(new Fn)-1,n.set(u,l)),a.outputs.push(l),this._allData[l]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${l}`);if(this._allData[l]._from=i,s.opType==="Constant"){if(!s.attribute||s.attribute.length!==1||!s.attribute[0].t)throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(!s.output||s.output.length!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");a.outputs.pop(),a.executeNode=!1,this._allData[l]._from=-1,this._allData[l].tensor=ot.fromProto(s.attribute[0].t)}}}for(let i=0;i<this._nodes.length;i++){let a=this._nodes[i],s=e.node[i];if(!s.input)throw new Error(`missing input for node: ${s.name}`);for(let u of s.input){let l=n.get(u);if(typeof l>"u"){if(u===""&&(s.input.length===3||s.input.length===4)&&s.opType==="Resize")continue;throw new Error(`unrecognized input '${u}' for node: ${s.name}`)}a.inputs.push(l),this._allData[l]._to.push(i)}}return!0}buildGraphFromOrtFormat(e){let n=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let t=new Map,o=[];for(let i=0;i<e.inputsLength();i++){let a=e.inputs(i);if(n.has(a))throw new Error(`duplicated input name: ${a}`);for(let s=0;s<e.nodeArgsLength();s++)if(e.nodeArgs(s)?.name()===a){let u=new Fn;if(e.nodeArgs(s)?.type()?.valueType()!==il.TypeInfoValue.tensor_type)throw new Error("Unexpected value type for the nodeArg.");let d=e.nodeArgs(s).type().value(new ol.TensorTypeAndShape),p=ht.tensorDataTypeFromProto(d.elemType()),h=d.shape(),g=[];for(let _=0;_<h.dimLength();_++)g.push(Tt.longToNumber(h.dim(_).value().dimValue()));u.type={shape:{dims:g},tensorType:p};let b=this._allData.push(u)-1;n.set(a,b),o.push(a)}}for(let i=0;i<e.initializersLength();i++){let a=e.initializers(i),s=n.get(a.name());if(s===void 0){let u=new Fn,l=ht.tensorDimsFromORTFormat(a),d=ht.tensorDataTypeFromProto(a.dataType());u.type={shape:{dims:l},tensorType:d},s=this._allData.push(u)-1,n.set(a.name(),s)}this._allData[s]._from=-1,this._allData[s].tensor=ot.fromOrtTensor(a)}for(let i=0;i<this._allData.length;i++)this._allData[i].tensor||(this._allInputIndices.push(i),this._allInputNames.push(o[i]));for(let i=0;i<e.outputsLength();i++){let a=e.outputs(i);if(n.has(a))throw new Error(`duplicated output name: ${a}`);let s=this._allData.push(new Fn)-1;n.set(a,s),this._allOutputIndices.push(s),this._allOutputNames.push(a)}if(!e.nodes)throw new Error("missing information in graph: node");for(let i=0;i<e.nodesLength();i++){let a=e.nodes(i),s=a.name();if(!s)for(let l=0;s=`unnamed_${a.opType()}_${l}`,!!t.has(s);l++);if(t.has(s))throw new Error(`duplicated node name: ${s}`);let u=this._nodes.push(new ca(a,s))-1;t.set(s,u)}for(let i=0;i<this._nodes.length;i++){let a=this._nodes[i],s=e.nodes(i);if(s==null)throw new Error(`No node exists at index ${i}`);if(s?.outputsLength()===0)throw new Error(`missing output for node: ${s.name}`);for(let u=0;u<s?.outputsLength();u++){let l=s?.outputs(u),d=n.get(l);if(typeof d>"u"&&(d=this._allData.push(new Fn)-1,n.set(l,d)),a.outputs.push(d),this._allData[d]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${d}`);if(this._allData[d]._from=i,s.opType()==="Constant"){if(s.attributesLength()!==1||!s.attributes(0).t())throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(s.outputsLength()!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");a.outputs.pop(),a.executeNode=!1,this._allData[d]._from=-1,this._allData[d].tensor=ot.fromOrtTensor(s.attributes(0).t())}}}for(let i=0;i<this._nodes.length;i++){let a=this._nodes[i],s=e.nodes(i);if(s.inputsLength()===0)throw new Error(`missing input for node: ${s.name}`);for(let u=0;u<s.inputsLength();u++){let l=s.inputs(u),d=n.get(l);if(typeof d>"u")throw new Error(`unrecognized input '${l}' for node: ${s.name()}`);a.inputs.push(d),this._allData[d]._to.push(i)}}}checkIsAcyclic(){let e=new Set;this._allInputIndices.forEach(o=>{this._allData[o]._to.forEach(a=>{e.add(a)})});let n=Array.from(e),t=new Array(this._nodes.length).fill("white");for(;n.length>0;){let o=n.pop();t[o]==="gray"?t[o]="black":(n.push(o),t[o]="gray",this._nodes[o].outputs.forEach(i=>{let a=this._allData[i];if(typeof a.tensor<"u")throw new Error("node outputs should not be initialized");if(a._from!==o)throw new Error("from property of the Value object doesn't match index of Node being processed");a._to.forEach(s=>{if(t[s]==="gray")throw new Error("model graph is cyclic");t[s]==="white"&&n.push(s)})}))}}transformGraph(e){this.removeAllIdentityNodes(),this.removeAllDropoutNodes(),this.fuseConvActivationNodes(),e&&e.transformGraph(this),this.finalizeGraph()}finalizeGraph(){let e=0,n=new Array(this._nodes.length,0),t=0;for(let o=0;o<this._nodes.length;o++)n[o]=t,this._nodes[o].executeNode?(t!==o&&(this._nodes[t]=this._nodes[o]),t++):this._nodes[o].outputs.forEach(i=>{this._allData[i]._from=-2});this._nodes.splice(t,this._nodes.length-t);for(let o=0;o<this._allData.length;o++){let i=this._allData[o];i._from!==void 0&&i._from!==-1&&i._from!==-2&&(i._from=n[i._from]);for(let a=0;a<i._to.length;a++)if(i._to[a]>=0)i._to[a]=n[i._to[a]];else throw new Error("Trying to update a removed node")}e=0;for(let o=0;o<this._allData.length;o++){if(this._allData[o].from===-2&&this._allOutputIndices.indexOf(o+e)===-1){e++,this._allData.splice(o,1),o--;continue}if(e>0){let i=-1;this._allData[o].from!==void 0&&this._allData[o].from!==-1?(i=this._nodes[this._allData[o].from].outputs.indexOf(o+e),i!==-1&&(this._nodes[this._allData[o].from].outputs[i]=o)):(i=this._allInputIndices.indexOf(o+e),i!==-1&&(this._allInputIndices[i]=o)),this._allData[o].to.forEach(a=>{i=this._nodes[a].inputs.indexOf(o+e),i!==-1&&(this._nodes[a].inputs[i]=o)}),this._allData[o].to.length===0&&(i=this._allOutputIndices.indexOf(o+e),i!==-1&&(this._allOutputIndices[i]=o))}}}deleteNode(e){let n=this._nodes[e];if(n.outputs.length>1){for(let s=1;s<n.outputs.length;s++)if(this._allData[n.outputs[s]].to.length>0)throw new Error("Node deletion with more than one output connected to other nodes is not supported. ")}n.executeNode=!1;let t=n.inputs[0],o=n.outputs[0],i=this._allData[o].to;for(let s=0;s<n.inputs.length;s++){let u=this._allData[n.inputs[s]].to.indexOf(e);if(u===-1)throw new Error("The Value object doesn't have the current Node in it's 'to' property ");this._allData[n.inputs[s]].to.splice(u,1)}this._allData[o]._to=[];let a=this._allOutputIndices.indexOf(o);if(a!==-1&&(this._allOutputIndices[a]=t),i&&i.length>0)for(let s of i){let u=this._nodes[s].inputs.indexOf(o);if(u===-1)throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");this._nodes[s].inputs[u]=t,this._allData[t].to.push(s)}}removeAllDropoutNodes(){let e=0;for(let n of this._nodes){if(n.opType==="Dropout"){if(n.inputs.length!==1)throw new Error("Dropout nodes should only contain one input. ");if(n.outputs.length!==1&&n.outputs.length!==2)throw new Error("Dropout nodes should contain either 1 or 2 output(s)");if(n.outputs.length===2&&this._allData[n.outputs[1]]._to.length!==0)throw new Error("Dropout nodes's second output should not be referenced by other nodes");this.deleteNode(e)}e++}}removeAllIdentityNodes(){let e=0;for(let n of this._nodes)n.opType==="Identity"&&this.deleteNode(e),e++}isActivation(e){switch(e.opType){case"Relu":case"Sigmoid":case"Clip":return!0;default:return!1}}fuseConvActivationNodes(){for(let e of this._nodes)if(e.opType==="Conv"){let n=this._allData[e.outputs[0]]._to;if(n.length===1&&this.isActivation(this._nodes[n[0]])){let t=this._nodes[n[0]];if(t.opType==="Clip")if(t.inputs.length===1)try{e.attributes.set("activation_params","floats",[t.attributes.getFloat("min"),t.attributes.getFloat("max")])}catch{e.attributes.set("activation_params","floats",[Nr,Lr])}else if(t.inputs.length>=3&&this._allData[t.inputs[1]].tensor!==void 0&&this._allData[t.inputs[2]].tensor!==void 0)e.attributes.set("activation_params","floats",[this._allData[t.inputs[1]].tensor.floatData[0],this._allData[t.inputs[2]].tensor.floatData[0]]);else continue;e.attributes.set("activation","string",t.opType),this.deleteNode(n[0])}}}}});var Vy,Gy,da,Uy=N(()=>{"use strict";Vy=ye(Re());Fy();So();Gy=ye(Yr());ze();da=class{constructor(){}load(e,n,t){let o;if(!t)try{this.loadFromOnnxFormat(e,n);return}catch(i){if(t!==void 0)throw i;o=i}try{this.loadFromOrtFormat(e,n)}catch(i){throw t!==void 0?i:new Error(`Failed to load model as ONNX format: ${o}
as ORT format: ${i}`)}}loadFromOnnxFormat(e,n){let t=Gy.onnx.ModelProto.decode(e);if(Tt.longToNumber(t.irVersion)<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=t.opsetImport.map(i=>({domain:i.domain,version:Tt.longToNumber(i.version)})),this._graph=nc.from(t.graph,n)}loadFromOrtFormat(e,n){let t=new Vy.ByteBuffer(e),o=nl.InferenceSession.getRootAsInferenceSession(t).model();if(Tt.longToNumber(o.irVersion())<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=[];for(let a=0;a<o.opsetImportLength();a++){let s=o.opsetImport(a);this._opsets.push({domain:s?.domain(),version:Tt.longToNumber(s.version())})}this._graph=nc.from(o.graph(),n)}get graph(){return this._graph}get opsets(){return this._opsets}}});var pa,Wy=N(()=>{"use strict";zy();My();Dt();Uy();pa=class{constructor(e={}){this._initialized=!1,this.backendHint=e.backendHint,this.profiler=bi.create(e.profiler),this.context={profiler:this.profiler,graphInputTypes:[],graphInputDims:[]}}get inputNames(){return this._model.graph.getInputNames()}get outputNames(){return this._model.graph.getOutputNames()}startProfiling(){this.profiler.start()}endProfiling(){this.profiler.stop()}async loadModel(e,n,t){await this.profiler.event("session","Session.loadModel",async()=>{let o=await Ql(this.backendHint);if(this.sessionHandler=o.createSessionHandler(this.context),this._model=new da,typeof e=="string"){let i=e.endsWith(".ort");{let s=await(await fetch(e)).arrayBuffer();this.initialize(new Uint8Array(s),i)}}else if(ArrayBuffer.isView(e))this.initialize(e);else{let i=new Uint8Array(e,n||0,t||e.byteLength);this.initialize(i)}})}initialize(e,n){if(this._initialized)throw new Error("already initialized");this.profiler.event("session","Session.initialize",()=>{let t=this.sessionHandler.transformGraph?this.sessionHandler:void 0;this._model.load(e,t,n),this.sessionHandler.onGraphInitialized&&this.sessionHandler.onGraphInitialized(this._model.graph),this.initializeOps(this._model.graph),this._executionPlan=new la(this._model.graph,this._ops,this.profiler)}),this._initialized=!0}async run(e){if(!this._initialized)throw new Error("session not initialized yet");return this.profiler.event("session","Session.run",async()=>{let n=this.normalizeAndValidateInputs(e),t=await this._executionPlan.execute(this.sessionHandler,n);return this.createOutput(t)})}normalizeAndValidateInputs(e){let n=this._model.graph.getInputNames();if(Array.isArray(e)){if(e.length!==n.length)throw new Error(`incorrect input array length: expected ${n.length} but got ${e.length}`)}else{if(e.size!==n.length)throw new Error(`incorrect input map size: expected ${n.length} but got ${e.size}`);let t=new Array(e.size),o=0;for(let i=0;i<n.length;++i){let a=e.get(n[i]);if(!a)throw new Error(`missing input tensor for: '${name}'`);t[o++]=a}e=t}if(!this.context.graphInputTypes||this.context.graphInputTypes.length===0||!this.context.graphInputDims||this.context.graphInputDims.length===0){let t=this._model.graph.getInputIndices(),o=this._model.graph.getValues(),i=new Array(t.length);for(let a=0;a<t.length;++a){let s=o[t[a]];i[a]=s.type.shape.dims,this.context.graphInputTypes.push(s.type.tensorType),this.context.graphInputDims.push(e[a].dims)}this.validateInputTensorDims(i,e,!0)}else this.validateInputTensorDims(this.context.graphInputDims,e,!1);return this.validateInputTensorTypes(this.context.graphInputTypes,e),e}validateInputTensorTypes(e,n){for(let t=0;t<n.length;t++){let o=e[t],i=n[t].type;if(o!==i)throw new Error(`input tensor[${t}] check failed: expected type '${o}' but got ${i}`)}}validateInputTensorDims(e,n,t){for(let o=0;o<n.length;o++){let i=e[o],a=n[o].dims;if(!this.compareTensorDims(i,a,t))throw new Error(`input tensor[${o}] check failed: expected shape '[${i.join(",")}]' but got [${a.join(",")}]`)}}compareTensorDims(e,n,t){if(e.length!==n.length)return!1;for(let o=0;o<e.length;++o)if(e[o]!==n[o]&&(!t||e[o]!==0))return!1;return!0}createOutput(e){let n=this._model.graph.getOutputNames();if(e.length!==n.length)throw new Error("expected number of outputs do not match number of generated outputs");let t=new Map;for(let o=0;o<n.length;++o)t.set(n[o],e[o]);return t}initializeOps(e){let n=e.getNodes();this._ops=new Array(n.length);for(let t=0;t<n.length;t++)this._ops[t]=this.sessionHandler.resolve(n[t],this._model.opsets,e)}}});var fa,Hy=N(()=>{"use strict";ft();Rr();fa=class{constructor(e){this.session=e;this.inputNames=this.session.inputNames,this.outputNames=this.session.outputNames}get inputMetadata(){throw new Error("Getting model metadata is not supported in webgl backend.")}get outputMetadata(){throw new Error("Getting model metadata is not supported in webgl backend.")}async dispose(){}async run(e,n,t){let o=new Map;for(let s in e)if(Object.hasOwnProperty.call(e,s)){let u=e[s];o.set(s,new ot(u.dims,u.type,void 0,void 0,u.data))}let i=await this.session.run(o),a={};return i.forEach((s,u)=>{a[u]=new $t(s.type,s.data,s.dims)}),a}startProfiling(){this.session.startProfiling()}endProfiling(){this.session.endProfiling()}}});var qy={};Sr(qy,{onnxjsBackend:()=>e3});var rc,e3,jy=N(()=>{"use strict";Wy();Hy();rc=class{async init(){}async createInferenceSessionHandler(e,n){let t=new pa(n);return typeof e=="string"?await t.loadModel(e):await t.loadModel(e),new fa(t)}},e3=new rc});var ha=N(()=>{"use strict"});var Zy={};Sr(Zy,{default:()=>t3});var Ky,Xy,t3,Jy=N(()=>{"use strict";oc();br();ma();Ky="ort-wasm-proxy-worker",Xy=globalThis.self?.name===Ky;Xy&&(self.onmessage=r=>{let{type:e,in:n}=r.data;try{switch(e){case"init-wasm":ga(n.wasm).then(()=>{ba(n).then(()=>{postMessage({type:e})},t=>{postMessage({type:e,err:t})})},t=>{postMessage({type:e,err:t})});break;case"init-ep":{let{epName:t,env:o}=n;ya(o,t).then(()=>{postMessage({type:e})},i=>{postMessage({type:e,err:i})});break}case"copy-from":{let{buffer:t}=n,o=Bo(t);postMessage({type:e,out:o});break}case"create":{let{model:t,options:o}=n;_a(t,o).then(i=>{postMessage({type:e,out:i})},i=>{postMessage({type:e,err:i})});break}case"release":wa(n),postMessage({type:e});break;case"run":{let{sessionId:t,inputIndices:o,inputs:i,outputIndices:a,options:s}=n;va(t,o,i,a,new Array(a.length).fill(null),s).then(u=>{u.some(l=>l[3]!=="cpu")?postMessage({type:e,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:e,out:u},Ta([...i,...u]))},u=>{postMessage({type:e,err:u})});break}case"end-profiling":xa(n),postMessage({type:e});break;default:}}catch(t){postMessage({type:e,err:t})}});t3=Xy?null:r=>new Worker(r??Pt,{type:"module",name:Ky})});var Yy={};Sr(Yy,{default:()=>n3});async function Qy(r={}){var e=r,n=!!globalThis.window,t=!!globalThis.WorkerGlobalScope,o=t&&self.name?.startsWith("em-pthread");e.mountExternalData=(c,f)=>{c.startsWith("./")&&(c=c.substring(2)),(e.Zc||(e.Zc=new Map)).set(c,f)},e.unmountExternalData=()=>{delete e.Zc},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,ae:!0}).buffer.constructor;let i=c=>async(...f)=>{try{if(e.$c)throw Error("Session already started");let y=e.$c={Nd:f[0],errors:[]},m=await c(...f);if(e.$c!==y)throw Error("Session mismatch");e.gd?.flush();let T=y.errors;if(0<T.length){let O=await Promise.all(T);if(O=O.filter(k=>k),0<O.length)throw Error(O.join(`
`))}return m}finally{e.$c=null}};e.jsepInit=(c,f)=>{if(c==="webgpu"){[e.gd,e.Dd,e.Hd,e.jd,e.Gd,e.ac,e.Id,e.Kd,e.Ed,e.Fd,e.Jd]=f;let y=e.gd;e.jsepRegisterBuffer=(m,T,O,k)=>y.registerBuffer(m,T,O,k),e.jsepGetBuffer=m=>y.getBuffer(m),e.jsepCreateDownloader=(m,T,O)=>y.createDownloader(m,T,O),e.jsepOnCreateSession=m=>{y.onCreateSession(m)},e.jsepOnReleaseSession=m=>{y.onReleaseSession(m)},e.jsepOnRunStart=m=>y.onRunStart(m),e.Ld=(m,T)=>{y.upload(m,T)}}else if(c==="webnn"){let y=f[0];[e.Zd,e.vd,e.webnnEnsureTensor,e.wd,e.webnnDownloadTensor,e.Yd,e.webnnEnableTraceEvent]=f.slice(1),e.webnnReleaseTensorId=e.vd,e.webnnUploadTensor=e.wd,e.webnnRegisterMLContext=e.Yd,e.webnnOnRunStart=m=>y.onRunStart(m),e.webnnOnRunEnd=y.onRunEnd.bind(y),e.webnnOnReleaseSession=m=>{y.onReleaseSession(m)},e.webnnCreateMLTensorDownloader=(m,T)=>y.createMLTensorDownloader(m,T),e.webnnRegisterMLTensor=(m,T,O,k)=>y.registerMLTensor(m,T,O,k),e.webnnCreateMLContext=m=>y.createMLContext(m),e.webnnRegisterMLConstant=(m,T,O,k,M,j)=>y.registerMLConstant(m,T,O,k,M,e.Zc,j),e.webnnRegisterGraphInput=y.registerGraphInput.bind(y),e.webnnIsGraphInput=y.isGraphInput.bind(y),e.webnnRegisterGraphOutput=y.registerGraphOutput.bind(y),e.webnnIsGraphOutput=y.isGraphOutput.bind(y),e.webnnCreateTemporaryTensor=y.createTemporaryTensor.bind(y),e.webnnIsGraphInputOutputTypeSupported=y.isGraphInputOutputTypeSupported.bind(y)}};let a=()=>{let c=f=>(...y)=>{let m=tn;return y=f(...y),tn!=m?new Promise((T,O)=>{gs={resolve:T,reject:O}}):y};(()=>{for(let f of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])e[f]=c(e[f])})(),i!==void 0&&(e._OrtRun=i(e._OrtRun),e._OrtRunWithBinding=i(e._OrtRunWithBinding)),a=void 0};e.asyncInit=()=>{a?.()};var s,u,l=(c,f)=>{throw f},d=import.meta.url,p="";if(n||t){try{p=new URL(".",d).href}catch{}t&&(u=c=>{var f=new XMLHttpRequest;return f.open("GET",c,!1),f.responseType="arraybuffer",f.send(null),new Uint8Array(f.response)}),s=async c=>{if(R(c))return new Promise((y,m)=>{var T=new XMLHttpRequest;T.open("GET",c,!0),T.responseType="arraybuffer",T.onload=()=>{T.status==200||T.status==0&&T.response?y(T.response):m(T.status)},T.onerror=m,T.send(null)});var f=await fetch(c,{credentials:"same-origin"});if(f.ok)return f.arrayBuffer();throw Error(f.status+" : "+f.url)}}var h,g,b,_,I,w,v=console.log.bind(console),$=console.error.bind(console),A=v,P=$,C=!1,R=c=>c.startsWith("file://");function x(){nr.buffer!=G.buffer&&mt()}if(o){let c=function(f){try{var y=f.data,m=y.Uc;if(m==="load"){let T=[];self.onmessage=O=>T.push(O),w=()=>{postMessage({Uc:"loaded"});for(let O of T)c(O);self.onmessage=c};for(let O of y.Ad)e[O]&&!e[O].proxy||(e[O]=(...k)=>{postMessage({Uc:"callHandler",zd:O,args:k})},O=="print"&&(A=e[O]),O=="printErr"&&(P=e[O]));nr=y.Vd,mt(),g=y.Wd,Ne(),si()}else if(m==="run"){(function(T){var O=(x(),U)[T+52>>>2>>>0];T=(x(),U)[T+56>>>2>>>0],Xd(O,O-T),_e(O)})(y.Tc),vs(y.Tc,0,0,1,0,0),Zc(),fs(y.Tc),B||(Ud(),B=!0);try{Wx(y.Pd,y.dd)}catch(T){if(T!="unwind")throw T}}else y.target!=="setimmediate"&&(m==="checkMailbox"?B&&ei():m&&(P(`worker: received unknown command ${m}`),P(y)))}catch(T){throw Wd(),T}};var ED=c,B=!1;self.onunhandledrejection=f=>{throw f.reason||f},self.onmessage=c}var G,Y,J,ie,z,U,te,oe,ee,de,ge,Ie=!1;function mt(){var c=nr.buffer;e.HEAP8=G=new Int8Array(c),J=new Int16Array(c),e.HEAPU8=Y=new Uint8Array(c),ie=new Uint16Array(c),e.HEAP32=z=new Int32Array(c),e.HEAPU32=U=new Uint32Array(c),te=new Float32Array(c),oe=new Float64Array(c),ee=new BigInt64Array(c),de=new BigUint64Array(c)}function Ve(){Ie=!0,o?w():Zn.tb()}function F(c){throw P(c="Aborted("+c+")"),C=!0,c=new WebAssembly.RuntimeError(c+". Build with -sASSERTIONS for more info."),I?.(c),c}function q(){return{a:{ma:m2,hb:h2,g:Hx,J:qx,f:jx,o:Kx,h:Xx,ha:Zx,b:Jx,T:Qx,Ia:nd,n:Yx,_:ad,Ya:sd,Ea:ud,Ga:ld,Za:cd,Wa:dd,Pa:pd,Va:fd,ka:hd,Fa:md,Ca:gd,Xa:bd,Da:yd,cb:eT,ea:nT,xa:rT,va:iT,da:sT,O:uT,H:lT,wa:cT,Z:bT,ya:yT,Sa:_T,Aa:vT,Ja:xT,ta:TT,fa:IT,Ra:fs,$a:ST,R:PT,r:NT,c:ds,ib:LT,y:RT,M:zT,D:MT,l:BT,s:$d,jb:FT,I:VT,S:GT,j:UT,u:WT,q:HT,k:qT,Ma:jT,Na:KT,Oa:XT,Ka:Ed,La:Cd,ua:Dd,eb:JT,bb:e2,v:t2,aa:n2,ga:r2,ab:QT,V:o2,_a:i2,Ba:a2,F:ZT,U:s2,la:ii,za:l2,gb:u2,fb:c2,Ta:Rd,Ua:zd,Ha:as,$:Md,ja:Bd,Qa:Fd,ia:Vd,lb:Q2,na:H2,mb:J2,oa:W2,G:L2,d:_2,t:b2,w:g2,B:P2,pb:V2,K:D2,x:x2,pa:G2,X:q2,ba:F2,nb:Z2,ob:X2,ra:R2,qa:B2,qb:z2,N:k2,Y:U2,e:y2,A:v2,m:w2,kb:Y2,p:I2,z:S2,C:T2,E:$2,L:E2,rb:N2,Q:j2,ca:C2,W:K2,sb:O2,sa:A2,P:M2,i:p2,a:nr,db:Xo}}}async function Ne(){function c(m,T){var O=Zn=m.exports;m={};for(let[k,M]of Object.entries(O))typeof M=="function"?(O=$T(M),m[k]=O):m[k]=M;return Zn=m,Zn=function(){var k=Zn,M=Z=>be=>Z(be)>>>0,j=Z=>()=>Z()>>>0;return(k=Object.assign({},k)).ub=M(k.ub),k.Yb=j(k.Yb),k._b=M(k._b),k.mc=M(k.mc),k.nc=j(k.nc),k.rc=M(k.rc),k}(),Kc.push(Zn.$b),Gd=(m=Zn).ub,Ud=m.vb,e._OrtInit=m.wb,e._OrtGetLastError=m.xb,e._OrtCreateSessionOptions=m.yb,e._OrtAppendExecutionProvider=m.zb,e._OrtAddFreeDimensionOverride=m.Ab,e._OrtAddSessionConfigEntry=m.Bb,e._OrtReleaseSessionOptions=m.Cb,e._OrtCreateSession=m.Db,e._OrtReleaseSession=m.Eb,e._OrtGetInputOutputCount=m.Fb,e._OrtGetInputOutputMetadata=m.Gb,e._OrtFree=m.Hb,e._OrtCreateTensor=m.Ib,e._OrtGetTensorData=m.Jb,e._OrtReleaseTensor=m.Kb,e._OrtCreateRunOptions=m.Lb,e._OrtAddRunConfigEntry=m.Mb,e._OrtReleaseRunOptions=m.Nb,e._OrtCreateBinding=m.Ob,e._OrtBindInput=m.Pb,e._OrtBindOutput=m.Qb,e._OrtClearBoundOutputs=m.Rb,e._OrtReleaseBinding=m.Sb,e._OrtRunWithBinding=m.Tb,e._OrtRun=m.Ub,e._OrtEndProfiling=m.Vb,e._JsepOutput=m.Wb,e._JsepGetNodeName=m.Xb,ai=m.Yb,nn=e._free=m.Zb,bo=e._malloc=m._b,vs=m.bc,Wd=m.cc,Hd=m.dc,qd=m.ec,xs=m.fc,jd=m.gc,Kd=m.hc,xe=m.ic,yo=m.jc,Xd=m.kc,_e=m.lc,Ts=m.mc,ve=m.nc,Zd=m.oc,Is=m.pc,Jd=m.qc,Qd=m.rc,Yd=m.sc,Ss=m.tc,ep=m.uc,tp=m.vc,np=m.wc,rp=m.xc,op=m.yc,ip=m.zc,ap=m.Ac,sp=m.Bc,up=m.Cc,lp=m.Dc,cp=m.Ec,dp=m.Fc,pp=m.Gc,fp=m.Hc,hp=m.Ic,mp=m.Jc,gp=m.Kc,bp=m.Lc,yp=m.Mc,_p=m.Nc,wp=m.Oc,vp=m.Pc,xp=m.Rc,Tp=m.Sc,Ip=m.bd,Sp=m.cd,$p=m.hd,Ap=m.ld,Op=m.md,Pp=m.nd,Ep=m.od,Cp=m.pd,Dp=m.qd,kp=m.rd,Np=m.sd,Lp=m.xd,Rp=m.Rd,zp=m.Sd,Mp=m.Td,Bp=m.Ud,g=T,Zn}var f,y=q();return e.instantiateWasm?new Promise(m=>{e.instantiateWasm(y,(T,O)=>{m(c(T,O))})}):o?c(new WebAssembly.Instance(g,q()),g):(ge??=e.locateFile?e.locateFile?e.locateFile("ort-wasm-simd-threaded.jsep.wasm",p):p+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href,f=await async function(m){var T=ge;if(!h&&!R(T))try{var O=fetch(T,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(O,m)}catch(k){P(`wasm streaming compile failed: ${k}`),P("falling back to ArrayBuffer instantiation")}return async function(k,M){try{var j=await async function(Z){if(!h)try{var be=await s(Z);return new Uint8Array(be)}catch{}if(Z==ge&&h)Z=new Uint8Array(h);else{if(!u)throw"both async and sync fetching of the wasm failed";Z=u(Z)}return Z}(k);return await WebAssembly.instantiate(j,M)}catch(Z){P(`failed to asynchronously prepare wasm: ${Z}`),F(Z)}}(T,m)}(y),c(f.instance,f.module))}class rt{name="ExitStatus";constructor(f){this.message=`Program terminated with exit(${f})`,this.status=f}}var Ge=c=>{c.terminate(),c.onmessage=()=>{}},at=[],Ee=0,He=null,Gt=c=>{tr.length==0&&(Qc(),Jc(tr[0]));var f=tr.pop();if(!f)return 6;mo.push(f),xr[c.Tc]=f,f.Tc=c.Tc;var y={Uc:"run",Pd:c.Od,dd:c.dd,Tc:c.Tc};return f.postMessage(y,c.ud),0},St=0,We=(c,f,...y)=>{var m,T=16*y.length,O=ve(),k=Ts(T),M=k>>>3;for(m of y)typeof m=="bigint"?((x(),ee)[M++>>>0]=1n,(x(),ee)[M++>>>0]=m):((x(),ee)[M++>>>0]=0n,(x(),oe)[M++>>>0]=m);return c=Hd(c,0,T,k,f),_e(O),c};function Xo(c){if(o)return We(0,1,c);if(b=c,!(0<St)){for(var f of mo)Ge(f);for(f of tr)Ge(f);tr=[],mo=[],xr={},C=!0}l(0,new rt(c))}function jc(c){if(o)return We(1,0,c);as(c)}var as=c=>{if(b=c,o)throw jc(c),"unwind";Xo(c)},tr=[],mo=[],Kc=[],xr={},Xc=c=>{var f=c.Tc;delete xr[f],tr.push(c),mo.splice(mo.indexOf(c),1),c.Tc=0,qd(f)};function Zc(){Kc.forEach(c=>c())}var Jc=c=>new Promise(f=>{c.onmessage=T=>{var O=T.data;if(T=O.Uc,O.ad&&O.ad!=ai()){var k=xr[O.ad];k?k.postMessage(O,O.ud):P(`Internal error! Worker sent a message "${T}" to target pthread ${O.ad}, but that thread no longer exists!`)}else T==="checkMailbox"?ei():T==="spawnThread"?Gt(O):T==="cleanupThread"?Yo(()=>{Xc(xr[O.Qd])}):T==="loaded"?(c.loaded=!0,f(c)):O.target==="setimmediate"?c.postMessage(O):T==="uncaughtException"?c.onerror(O.error):T==="callHandler"?e[O.zd](...O.args):T&&P(`worker sent an unknown command ${T}`)},c.onerror=T=>{throw P(`worker sent an error! ${T.filename}:${T.lineno}: ${T.message}`),T};var y,m=[];for(y of[])e.propertyIsEnumerable(y)&&m.push(y);c.postMessage({Uc:"load",Ad:m,Vd:nr,Wd:g})});function Qc(){var c=new Worker((()=>{let f=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new f("ort.all.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});tr.push(c)}var nr,Wx=(c,f)=>{St=0,c=Ss(c,f),0<St?b=c:xs(c)},Zo=[],Jo=0;function Hx(c){var f=new ss(c>>>=0);return(x(),G)[f.Vc+12>>>0]==0&&(Yc(f,!0),Jo--),ed(f,!1),Zo.push(f),Qd(c)}var jr=0,qx=()=>{xe(0,0);var c=Zo.pop();Zd(c.ed),jr=0};function Yc(c,f){f=f?1:0,(x(),G)[c.Vc+12>>>0]=f}function ed(c,f){f=f?1:0,(x(),G)[c.Vc+13>>>0]=f}class ss{constructor(f){this.ed=f,this.Vc=f-24}}var us=c=>{var f=jr;if(!f)return yo(0),0;var y=new ss(f);(x(),U)[y.Vc+16>>>2>>>0]=f;var m=(x(),U)[y.Vc+4>>>2>>>0];if(!m)return yo(0),f;for(var T of c){if(T===0||T===m)break;if(Jd(T,m,y.Vc+16))return yo(T),f}return yo(m),f};function jx(){return us([])}function Kx(c){return us([c>>>0])}function Xx(c,f,y,m){return us([c>>>0,f>>>0,y>>>0,m>>>0])}var Zx=()=>{var c=Zo.pop();c||F("no exception to throw");var f=c.ed;throw(x(),G)[c.Vc+13>>>0]==0&&(Zo.push(c),ed(c,!0),Yc(c,!1),Jo++),Is(f),jr=f};function Jx(c,f,y){var m=new ss(c>>>=0);throw f>>>=0,y>>>=0,(x(),U)[m.Vc+16>>>2>>>0]=0,(x(),U)[m.Vc+4>>>2>>>0]=f,(x(),U)[m.Vc+8>>>2>>>0]=y,Is(c),Jo++,jr=c}var Qx=()=>Jo;function td(c,f,y,m){return o?We(2,1,c,f,y,m):nd(c,f,y,m)}function nd(c,f,y,m){if(c>>>=0,f>>>=0,y>>>=0,m>>>=0,!globalThis.SharedArrayBuffer)return 6;var T=[];return o&&T.length===0?td(c,f,y,m):(c={Od:y,Tc:c,dd:m,ud:T},o?(c.Uc="spawnThread",postMessage(c,T),0):Gt(c))}function Yx(c){throw jr||=c>>>0,jr}var rd=globalThis.TextDecoder&&new TextDecoder,od=(c,f,y,m)=>{if(y=f+y,m)return y;for(;c[f]&&!(f>=y);)++f;return f},id=(c,f=0,y,m)=>{if(16<(y=od(c,f>>>=0,y,m))-f&&c.buffer&&rd)return rd.decode(c.buffer instanceof ArrayBuffer?c.subarray(f,y):c.slice(f,y));for(m="";f<y;){var T=c[f++];if(128&T){var O=63&c[f++];if((224&T)==192)m+=String.fromCharCode((31&T)<<6|O);else{var k=63&c[f++];65536>(T=(240&T)==224?(15&T)<<12|O<<6|k:(7&T)<<18|O<<12|k<<6|63&c[f++])?m+=String.fromCharCode(T):(T-=65536,m+=String.fromCharCode(55296|T>>10,56320|1023&T))}}else m+=String.fromCharCode(T)}return m},Ye=(c,f,y)=>(c>>>=0)?id((x(),Y),c,f,y):"";function ad(c,f,y){return o?We(3,1,c,f,y):0}function sd(c,f){if(o)return We(4,1,c,f)}function ud(c,f){if(o)return We(5,1,c,f)}function ld(c,f,y){if(o)return We(6,1,c,f,y)}function cd(c,f,y){return o?We(7,1,c,f,y):0}function dd(c,f){if(o)return We(8,1,c,f)}function pd(c,f,y){if(o)return We(9,1,c,f,y)}function fd(c,f,y,m){if(o)return We(10,1,c,f,y,m)}function hd(c,f,y,m){if(o)return We(11,1,c,f,y,m)}function md(c,f,y,m){if(o)return We(12,1,c,f,y,m)}function gd(c){if(o)return We(13,1,c)}function bd(c,f){if(o)return We(14,1,c,f)}function yd(c,f,y){if(o)return We(15,1,c,f,y)}var eT=()=>F(""),en=c=>{c>>>=0;for(var f="";;){var y=(x(),Y)[c++>>>0];if(!y)return f;f+=String.fromCharCode(y)}},ls={},cs={},tT={},Kr=class extends Error{constructor(c){super(c),this.name="BindingError"}};function Xn(c,f,y={}){return function(m,T,O={}){var k=T.name;if(!m)throw new Kr(`type "${k}" must have a positive integer typeid pointer`);if(cs.hasOwnProperty(m)){if(O.Bd)return;throw new Kr(`Cannot register type '${k}' twice`)}cs[m]=T,delete tT[m],ls.hasOwnProperty(m)&&(T=ls[m],delete ls[m],T.forEach(M=>M()))}(c,f,y)}var _d=(c,f,y)=>{switch(f){case 1:return y?m=>(x(),G)[m>>>0]:m=>(x(),Y)[m>>>0];case 2:return y?m=>(x(),J)[m>>>1>>>0]:m=>(x(),ie)[m>>>1>>>0];case 4:return y?m=>(x(),z)[m>>>2>>>0]:m=>(x(),U)[m>>>2>>>0];case 8:return y?m=>(x(),ee)[m>>>3>>>0]:m=>(x(),de)[m>>>3>>>0];default:throw new TypeError(`invalid integer width (${f}): ${c}`)}};function nT(c,f,y,m,T){c>>>=0,y>>>=0,f=en(f>>>0);let O=k=>k;if(m=m===0n){let k=8*y;O=M=>BigInt.asUintN(k,M),T=O(T)}Xn(c,{name:f,Qc:O,Xc:(k,M)=>(typeof M=="number"&&(M=BigInt(M)),M),Wc:_d(f,y,!m),Yc:null})}function rT(c,f,y,m){Xn(c>>>=0,{name:f=en(f>>>0),Qc:function(T){return!!T},Xc:function(T,O){return O?y:m},Wc:function(T){return this.Qc((x(),Y)[T>>>0])},Yc:null})}var wd=[],Tr=[0,1,,1,null,1,!0,1,!1,1];function ds(c){9<(c>>>=0)&&--Tr[c+1]==0&&(Tr[c]=void 0,wd.push(c))}var Ct=c=>{if(!c)throw new Kr(`Cannot use deleted val. handle = ${c}`);return Tr[c]},Ut=c=>{switch(c){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let f=wd.pop()||Tr.length;return Tr[f]=c,Tr[f+1]=1,f}};function ps(c){return this.Qc((x(),U)[c>>>2>>>0])}var oT={name:"emscripten::val",Qc:c=>{var f=Ct(c);return ds(c),f},Xc:(c,f)=>Ut(f),Wc:ps,Yc:null};function iT(c){return Xn(c>>>0,oT)}var aT=(c,f)=>{switch(f){case 4:return function(y){return this.Qc((x(),te)[y>>>2>>>0])};case 8:return function(y){return this.Qc((x(),oe)[y>>>3>>>0])};default:throw new TypeError(`invalid float width (${f}): ${c}`)}};function sT(c,f,y){y>>>=0,Xn(c>>>=0,{name:f=en(f>>>0),Qc:m=>m,Xc:(m,T)=>T,Wc:aT(f,y),Yc:null})}function uT(c,f,y,m,T){c>>>=0,y>>>=0,f=en(f>>>0);let O=M=>M;if(m===0){var k=32-8*y;O=M=>M<<k>>>k,T=O(T)}Xn(c,{name:f,Qc:O,Xc:(M,j)=>j,Wc:_d(f,y,m!==0),Yc:null})}function lT(c,f,y){function m(O){var k=(x(),U)[O>>>2>>>0];return O=(x(),U)[O+4>>>2>>>0],new T((x(),G).buffer,O,k)}var T=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][f];Xn(c>>>=0,{name:y=en(y>>>0),Qc:m,Wc:m},{Bd:!0})}var rr=(c,f,y)=>{var m=(x(),Y);if(f>>>=0,0<y){var T=f;y=f+y-1;for(var O=0;O<c.length;++O){var k=c.codePointAt(O);if(127>=k){if(f>=y)break;m[f++>>>0]=k}else if(2047>=k){if(f+1>=y)break;m[f++>>>0]=192|k>>6,m[f++>>>0]=128|63&k}else if(65535>=k){if(f+2>=y)break;m[f++>>>0]=224|k>>12,m[f++>>>0]=128|k>>6&63,m[f++>>>0]=128|63&k}else{if(f+3>=y)break;m[f++>>>0]=240|k>>18,m[f++>>>0]=128|k>>12&63,m[f++>>>0]=128|k>>6&63,m[f++>>>0]=128|63&k,O++}}m[f>>>0]=0,c=f-T}else c=0;return c},Qo=c=>{for(var f=0,y=0;y<c.length;++y){var m=c.charCodeAt(y);127>=m?f++:2047>=m?f+=2:55296<=m&&57343>=m?(f+=4,++y):f+=3}return f};function cT(c,f){Xn(c>>>=0,{name:f=en(f>>>0),Qc(y){var m=(x(),U)[y>>>2>>>0];return m=Ye(y+4,m,!0),nn(y),m},Xc(y,m){m instanceof ArrayBuffer&&(m=new Uint8Array(m));var T=typeof m=="string";if(!(T||ArrayBuffer.isView(m)&&m.BYTES_PER_ELEMENT==1))throw new Kr("Cannot pass non-string to std::string");var O=T?Qo(m):m.length,k=bo(4+O+1),M=k+4;return(x(),U)[k>>>2>>>0]=O,T?rr(m,M,O+1):(x(),Y).set(m,M>>>0),y!==null&&y.push(nn,k),k},Wc:ps,Yc(y){nn(y)}})}var vd=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,dT=(c,f,y)=>{if(c>>>=1,16<(f=od((x(),ie),c,f/2,y))-c&&vd)return vd.decode((x(),ie).slice(c,f));for(y="";c<f;++c){var m=(x(),ie)[c>>>0];y+=String.fromCharCode(m)}return y},pT=(c,f,y)=>{if(y??=2147483647,2>y)return 0;var m=f;y=(y-=2)<2*c.length?y/2:c.length;for(var T=0;T<y;++T){var O=c.charCodeAt(T);(x(),J)[f>>>1>>>0]=O,f+=2}return(x(),J)[f>>>1>>>0]=0,f-m},fT=c=>2*c.length,hT=(c,f,y)=>{var m="";c>>>=2;for(var T=0;!(T>=f/4);T++){var O=(x(),U)[c+T>>>0];if(!O&&!y)break;m+=String.fromCodePoint(O)}return m},mT=(c,f,y)=>{if(f>>>=0,y??=2147483647,4>y)return 0;var m=f;y=m+y-4;for(var T=0;T<c.length;++T){var O=c.codePointAt(T);if(65535<O&&T++,(x(),z)[f>>>2>>>0]=O,(f+=4)+4>y)break}return(x(),z)[f>>>2>>>0]=0,f-m},gT=c=>{for(var f=0,y=0;y<c.length;++y)65535<c.codePointAt(y)&&y++,f+=4;return f};function bT(c,f,y){if(c>>>=0,f>>>=0,y=en(y>>>=0),f===2)var m=dT,T=pT,O=fT;else m=hT,T=mT,O=gT;Xn(c,{name:y,Qc:k=>{var M=(x(),U)[k>>>2>>>0];return M=m(k+4,M*f,!0),nn(k),M},Xc:(k,M)=>{if(typeof M!="string")throw new Kr(`Cannot pass non-string to C++ string type ${y}`);var j=O(M),Z=bo(4+j+f);return(x(),U)[Z>>>2>>>0]=j/f,T(M,Z+4,j+f),k!==null&&k.push(nn,Z),Z},Wc:ps,Yc(k){nn(k)}})}function yT(c,f){Xn(c>>>=0,{Cd:!0,name:f=en(f>>>0),Qc:()=>{},Xc:()=>{}})}function _T(c){vs(c>>>0,!t,1,!n,131072,!1),Zc()}var Yo=c=>{if(!C)try{if(c(),!(0<St))try{o?ai()&&xs(b):as(b)}catch(f){f instanceof rt||f=="unwind"||l(0,f)}}catch(f){f instanceof rt||f=="unwind"||l(0,f)}},wT=!Atomics.waitAsync||globalThis.navigator?.userAgent&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function fs(c){c>>>=0,wT||(Atomics.waitAsync((x(),z),c>>>2,c).value.then(ei),c+=128,Atomics.store((x(),z),c>>>2,1))}var ei=()=>Yo(()=>{var c=ai();c&&(fs(c),Kd())});function vT(c,f){(c>>>=0)==f>>>0?setTimeout(ei):o?postMessage({ad:c,Uc:"checkMailbox"}):(c=xr[c])&&c.postMessage({Uc:"checkMailbox"})}var hs=[];function xT(c,f,y,m,T){for(f>>>=0,T>>>=0,hs.length=0,y=T>>>3,m=T+m>>>3;y<m;){var O;O=(x(),ee)[y++>>>0]?(x(),ee)[y++>>>0]:(x(),oe)[y++>>>0],hs.push(O)}return(f?$s[f]:f2[c])(...hs)}var TT=()=>{St=0};function IT(c){c>>>=0,o?postMessage({Uc:"cleanupThread",Qd:c}):Xc(xr[c])}function ST(c){}var ti=c=>{try{c()}catch(f){F(f)}};function $T(c){var f=(...y)=>{ni.push(c);try{return c(...y)}finally{C||(ni.pop(),tn&&or===1&&ni.length===0&&(or=0,St+=1,ti(zp),typeof Fibers<"u"&&Fibers.ce()))}};return Id.set(c,f),f}var or=0,tn=null,xd=0,ni=[],ms=new Map,Td=new Map,Id=new Map,AT=0,gs=null,OT=[],Sd=c=>function(f){if(!C){if(or===0){var y=!1,m=!1;f((T=0)=>{if(!C&&(xd=T,y=!0,m)){or=2,ti(()=>Mp(tn)),typeof MainLoop<"u"&&MainLoop.yd&&MainLoop.resume(),T=!1;try{var O=function(){var j=(x(),z)[tn+8>>>2>>>0];return j=Td.get(j),j=Id.get(j),--St,j()}()}catch(j){O=j,T=!0}var k=!1;if(!tn){var M=gs;M&&(gs=null,(T?M.reject:M.resolve)(O),k=!0)}if(T&&!k)throw O}}),m=!0,y||(or=1,tn=function(){var T=bo(65548),O=T+12;if((x(),U)[T>>>2>>>0]=O,(x(),U)[T+4>>>2>>>0]=O+65536,O=ni[0],!ms.has(O)){var k=AT++;ms.set(O,k),Td.set(k,O)}return O=ms.get(O),(x(),z)[T+8>>>2>>>0]=O,T}(),typeof MainLoop<"u"&&MainLoop.yd&&MainLoop.pause(),ti(()=>Rp(tn)))}else or===2?(or=0,ti(Bp),nn(tn),tn=null,OT.forEach(Yo)):F(`invalid state: ${or}`);return xd}}(f=>{c().then(f)});function PT(c){return c>>>=0,Sd(async()=>{var f=await Ct(c);return Ut(f)})}var bs=[],ET=c=>{var f=bs.length;return bs.push(c),f},CT=(c,f)=>{for(var y=Array(c),m=0;m<c;++m){var T=m,O=(x(),U)[f+4*m>>>2>>>0],k=cs[O];if(k===void 0)throw c=`parameter ${m}`,O=Gd(O),f=en(O),nn(O),new Kr(`${c} has unknown type ${f}`);y[T]=k}return y},DT=(c,f,y)=>{var m=[];return c=c(m,y),m.length&&((x(),U)[f>>>2>>>0]=Ut(m)),c},kT={},ri=c=>{var f=kT[c];return f===void 0?en(c):f};function NT(c,f,y){var[m,...T]=CT(c,f>>>0);f=m.Xc.bind(m);var O=T.map(j=>j.Wc.bind(j));c--;var k={toValue:Ct};switch(c=O.map((j,Z)=>{var be=`argFromPtr${Z}`;return k[be]=j,`${be}(args${Z?"+"+8*Z:""})`}),y){case 0:var M="toValue(handle)";break;case 2:M="new (toValue(handle))";break;case 3:M="";break;case 1:k.getStringOrSymbol=ri,M="toValue(handle)[getStringOrSymbol(methodName)]"}return M+=`(${c})`,m.Cd||(k.toReturnWire=f,k.emval_returnValue=DT,M=`return emval_returnValue(toReturnWire, destructorsRef, ${M})`),M=`return function (handle, methodName, destructorsRef, args) {
  ${M}
  }`,y=new Function(Object.keys(k),M)(...Object.values(k)),M=`methodCaller<(${T.map(j=>j.name)}) => ${m.name}>`,ET(Object.defineProperty(y,"name",{value:M}))}function LT(c,f){return f>>>=0,(c=Ct(c>>>0))==Ct(f)}function RT(c){return(c>>>=0)?(c=ri(c),Ut(globalThis[c])):Ut(globalThis)}function zT(c){return c=ri(c>>>0),Ut(e[c])}function MT(c,f){return f>>>=0,c=Ct(c>>>0),f=Ct(f),Ut(c[f])}function BT(c){9<(c>>>=0)&&(Tr[c+1]+=1)}function $d(c,f,y,m,T){return bs[c>>>0](f>>>0,y>>>0,m>>>0,T>>>0)}function FT(c,f,y,m,T){return $d(c>>>0,f>>>0,y>>>0,m>>>0,T>>>0)}function VT(){return Ut([])}function GT(c){c=Ct(c>>>0);for(var f=Array(c.length),y=0;y<c.length;y++)f[y]=c[y];return Ut(f)}function UT(c){return Ut(ri(c>>>0))}function WT(){return Ut({})}function HT(c){for(var f=Ct(c>>>=0);f.length;){var y=f.pop();f.pop()(y)}ds(c)}function qT(c,f,y){f>>>=0,y>>>=0,c=Ct(c>>>0),f=Ct(f),y=Ct(y),c[f]=y}function jT(c,f){c=-9007199254740992>c||9007199254740992<c?NaN:Number(c),f>>>=0,c=new Date(1e3*c),(x(),z)[f>>>2>>>0]=c.getUTCSeconds(),(x(),z)[f+4>>>2>>>0]=c.getUTCMinutes(),(x(),z)[f+8>>>2>>>0]=c.getUTCHours(),(x(),z)[f+12>>>2>>>0]=c.getUTCDate(),(x(),z)[f+16>>>2>>>0]=c.getUTCMonth(),(x(),z)[f+20>>>2>>>0]=c.getUTCFullYear()-1900,(x(),z)[f+24>>>2>>>0]=c.getUTCDay(),c=(c.getTime()-Date.UTC(c.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(x(),z)[f+28>>>2>>>0]=c}var Ad=c=>c%4==0&&(c%100!=0||c%400==0),Od=[0,31,60,91,121,152,182,213,244,274,305,335],Pd=[0,31,59,90,120,151,181,212,243,273,304,334];function KT(c,f){c=-9007199254740992>c||9007199254740992<c?NaN:Number(c),f>>>=0,c=new Date(1e3*c),(x(),z)[f>>>2>>>0]=c.getSeconds(),(x(),z)[f+4>>>2>>>0]=c.getMinutes(),(x(),z)[f+8>>>2>>>0]=c.getHours(),(x(),z)[f+12>>>2>>>0]=c.getDate(),(x(),z)[f+16>>>2>>>0]=c.getMonth(),(x(),z)[f+20>>>2>>>0]=c.getFullYear()-1900,(x(),z)[f+24>>>2>>>0]=c.getDay();var y=(Ad(c.getFullYear())?Od:Pd)[c.getMonth()]+c.getDate()-1|0;(x(),z)[f+28>>>2>>>0]=y,(x(),z)[f+36>>>2>>>0]=-60*c.getTimezoneOffset(),y=new Date(c.getFullYear(),6,1).getTimezoneOffset();var m=new Date(c.getFullYear(),0,1).getTimezoneOffset();c=0|(y!=m&&c.getTimezoneOffset()==Math.min(m,y)),(x(),z)[f+32>>>2>>>0]=c}function XT(c){c>>>=0;var f=new Date((x(),z)[c+20>>>2>>>0]+1900,(x(),z)[c+16>>>2>>>0],(x(),z)[c+12>>>2>>>0],(x(),z)[c+8>>>2>>>0],(x(),z)[c+4>>>2>>>0],(x(),z)[c>>>2>>>0],0),y=(x(),z)[c+32>>>2>>>0],m=f.getTimezoneOffset(),T=new Date(f.getFullYear(),6,1).getTimezoneOffset(),O=new Date(f.getFullYear(),0,1).getTimezoneOffset(),k=Math.min(O,T);return 0>y?(x(),z)[c+32>>>2>>>0]=+(T!=O&&k==m):0<y!=(k==m)&&(T=Math.max(O,T),f.setTime(f.getTime()+6e4*((0<y?k:T)-m))),(x(),z)[c+24>>>2>>>0]=f.getDay(),y=(Ad(f.getFullYear())?Od:Pd)[f.getMonth()]+f.getDate()-1|0,(x(),z)[c+28>>>2>>>0]=y,(x(),z)[c>>>2>>>0]=f.getSeconds(),(x(),z)[c+4>>>2>>>0]=f.getMinutes(),(x(),z)[c+8>>>2>>>0]=f.getHours(),(x(),z)[c+12>>>2>>>0]=f.getDate(),(x(),z)[c+16>>>2>>>0]=f.getMonth(),(x(),z)[c+20>>>2>>>0]=f.getYear(),c=f.getTime(),BigInt(isNaN(c)?-1:c/1e3)}function Ed(c,f,y,m,T,O,k){return o?We(16,1,c,f,y,m,T,O,k):-52}function Cd(c,f,y,m,T,O){if(o)return We(17,1,c,f,y,m,T,O)}var go={},ZT=()=>performance.timeOrigin+performance.now();function Dd(c,f){if(o)return We(18,1,c,f);if(go[c]&&(clearTimeout(go[c].id),delete go[c]),!f)return 0;var y=setTimeout(()=>{delete go[c],Yo(()=>jd(c,performance.timeOrigin+performance.now()))},f);return go[c]={id:y,be:f},0}function JT(c,f,y,m){c>>>=0,f>>>=0,y>>>=0,m>>>=0;var T=new Date().getFullYear(),O=new Date(T,0,1).getTimezoneOffset();T=new Date(T,6,1).getTimezoneOffset();var k=Math.max(O,T);(x(),U)[c>>>2>>>0]=60*k,(x(),z)[f>>>2>>>0]=+(O!=T),c=(f=M=>{var j=Math.abs(M);return`UTC${0<=M?"-":"+"}${String(Math.floor(j/60)).padStart(2,"0")}${String(j%60).padStart(2,"0")}`})(O),f=f(T),T<O?(rr(c,y,17),rr(f,m,17)):(rr(c,m,17),rr(f,y,17))}var QT=()=>Date.now(),YT=1;function e2(c,f,y){if(y>>>=0,!(0<=c&&3>=c))return 28;if(c===0)c=Date.now();else{if(!YT)return 52;c=performance.timeOrigin+performance.now()}return c=Math.round(1e6*c),(x(),ee)[y>>>3>>>0]=BigInt(c),0}var ys=[],kd=(c,f)=>{ys.length=0;for(var y;y=(x(),Y)[c++>>>0];){var m=y!=105;f+=(m&=y!=112)&&f%8?4:0,ys.push(y==112?(x(),U)[f>>>2>>>0]:y==106?(x(),ee)[f>>>3>>>0]:y==105?(x(),z)[f>>>2>>>0]:(x(),oe)[f>>>3>>>0]),f+=m?8:4}return ys};function t2(c,f,y){return c>>>=0,f=kd(f>>>0,y>>>0),$s[c](...f)}function n2(c,f,y){return c>>>=0,f=kd(f>>>0,y>>>0),$s[c](...f)}var r2=()=>{};function o2(c,f){return P(Ye(c>>>0,f>>>0))}var i2=()=>{throw St+=1,"unwind"};function a2(){return 4294901760}var s2=()=>navigator.hardwareConcurrency,Ir={},oi=c=>{var f;return(f=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(c))?+f[1]:(f=/:(\d+):\d+(?:\)|$)/.exec(c))?2147483648|+f[1]:0},Nd=c=>{for(var f of c)(c=oi(f))&&(Ir[c]=f)};function u2(){var c=Error().stack.toString().split(`
`);return c[0]=="Error"&&c.shift(),Nd(c),Ir.kd=oi(c[3]),Ir.Md=c,Ir.kd}function ii(c){if(!(c=Ir[c>>>0]))return 0;var f;if(f=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(c))c=f[1];else if(f=/^\s+at (.*) \(.*\)$/.exec(c))c=f[1];else{if(!(f=/^(.+?)@/.exec(c)))return 0;c=f[1]}nn(ii.td??0),f=Qo(c)+1;var y=bo(f);return y&&rr(c,y,f),ii.td=y,ii.td}function l2(c){c>>>=0;var f=(x(),Y).length;if(c<=f||4294901760<c)return!1;for(var y=1;4>=y;y*=2){var m=f*(1+.2/y);m=Math.min(m,c+100663296);e:{m=(Math.min(4294901760,65536*Math.ceil(Math.max(c,m)/65536))-nr.buffer.byteLength+65535)/65536|0;try{nr.grow(m),mt();var T=1;break e}catch{}T=void 0}if(T)return!0}return!1}function c2(c,f,y){if(c>>>=0,f>>>=0,Ir.kd==c)var m=Ir.Md;else(m=Error().stack.toString().split(`
`))[0]=="Error"&&m.shift(),Nd(m);for(var T=3;m[T]&&oi(m[T])!=c;)++T;for(c=0;c<y&&m[c+T];++c)(x(),z)[f+4*c>>>2>>>0]=oi(m[c+T]);return c}var _s,ws={},Ld=()=>{if(!_s){var c,f={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(globalThis.navigator?.language??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(c in ws)ws[c]===void 0?delete f[c]:f[c]=ws[c];var y=[];for(c in f)y.push(`${c}=${f[c]}`);_s=y}return _s};function Rd(c,f){if(o)return We(19,1,c,f);c>>>=0,f>>>=0;var y,m=0,T=0;for(y of Ld()){var O=f+m;(x(),U)[c+T>>>2>>>0]=O,m+=rr(y,O,1/0)+1,T+=4}return 0}function zd(c,f){if(o)return We(20,1,c,f);c>>>=0,f>>>=0;var y=Ld();for(var m of((x(),U)[c>>>2>>>0]=y.length,c=0,y))c+=Qo(m)+1;return(x(),U)[f>>>2>>>0]=c,0}function Md(c){return o?We(21,1,c):52}function Bd(c,f,y,m){return o?We(22,1,c,f,y,m):52}function Fd(c,f,y,m){return o?We(23,1,c,f,y,m):70}var d2=[null,[],[]];function Vd(c,f,y,m){if(o)return We(24,1,c,f,y,m);f>>>=0,y>>>=0,m>>>=0;for(var T=0,O=0;O<y;O++){var k=(x(),U)[f>>>2>>>0],M=(x(),U)[f+4>>>2>>>0];f+=8;for(var j=0;j<M;j++){var Z=c,be=(x(),Y)[k+j>>>0],$e=d2[Z];be===0||be===10?((Z===1?A:P)(id($e)),$e.length=0):$e.push(be)}T+=M}return(x(),U)[m>>>2>>>0]=T,0}function p2(c){return c>>>0}o||function(){for(var c=e.numThreads-1;c--;)Qc();at.push(async()=>{var f=async function(){if(!o)return Promise.all(tr.map(Jc))}();Ee++,await f,--Ee==0&&He&&(f=He,He=null,f())})}(),o||(nr=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),mt()),e.wasmBinary&&(h=e.wasmBinary),e.stackSave=()=>ve(),e.stackRestore=c=>_e(c),e.stackAlloc=c=>Ts(c),e.setValue=function(c,f,y="i8"){switch(y.endsWith("*")&&(y="*"),y){case"i1":case"i8":(x(),G)[c>>>0]=f;break;case"i16":(x(),J)[c>>>1>>>0]=f;break;case"i32":(x(),z)[c>>>2>>>0]=f;break;case"i64":(x(),ee)[c>>>3>>>0]=BigInt(f);break;case"float":(x(),te)[c>>>2>>>0]=f;break;case"double":(x(),oe)[c>>>3>>>0]=f;break;case"*":(x(),U)[c>>>2>>>0]=f;break;default:F(`invalid type for setValue: ${y}`)}},e.getValue=function(c,f="i8"){switch(f.endsWith("*")&&(f="*"),f){case"i1":case"i8":return(x(),G)[c>>>0];case"i16":return(x(),J)[c>>>1>>>0];case"i32":return(x(),z)[c>>>2>>>0];case"i64":return(x(),ee)[c>>>3>>>0];case"float":return(x(),te)[c>>>2>>>0];case"double":return(x(),oe)[c>>>3>>>0];case"*":return(x(),U)[c>>>2>>>0];default:F(`invalid type for getValue: ${f}`)}},e.UTF8ToString=Ye,e.stringToUTF8=rr,e.lengthBytesUTF8=Qo;var Gd,Ud,ai,nn,bo,vs,Wd,Hd,qd,xs,jd,Kd,xe,yo,Xd,_e,Ts,ve,Zd,Is,Jd,Qd,Yd,Ss,ep,tp,np,rp,op,ip,ap,sp,up,lp,cp,dp,pp,fp,hp,mp,gp,bp,yp,_p,wp,vp,xp,Tp,Ip,Sp,$p,Ap,Op,Pp,Ep,Cp,Dp,kp,Np,Lp,Rp,zp,Mp,Bp,Zn,f2=[Xo,jc,td,ad,sd,ud,ld,cd,dd,pd,fd,hd,md,gd,bd,yd,Ed,Cd,Dd,Rd,zd,Md,Bd,Fd,Vd],$s={947036:(c,f,y,m,T)=>{if(e===void 0||!e.Zc)return 1;if((c=Ye(Number(c>>>0))).startsWith("./")&&(c=c.substring(2)),!(c=e.Zc.get(c)))return 2;if(f=Number(f>>>0),y=Number(y>>>0),m=Number(m>>>0),f+y>c.byteLength)return 3;try{let O=c.subarray(f,f+y);switch(T){case 0:(x(),Y).set(O,m>>>0);break;case 1:e.Xd?e.Xd(m,O):e.Ld(m,O);break;default:return 4}return 0}catch{return 4}},947860:(c,f,y)=>{e.wd(c,(x(),Y).subarray(f>>>0,f+y>>>0))},947924:()=>e.Zd(),947966:c=>{e.vd(c)},948003:()=>{e.Ed()},948034:()=>{e.Fd()},948063:()=>{e.Jd()},948088:c=>e.Dd(c),948121:c=>e.Hd(c),948153:(c,f,y)=>{e.jd(Number(c),Number(f),Number(y),!0)},948216:(c,f,y)=>{e.jd(Number(c),Number(f),Number(y))},948273:()=>typeof wasmOffsetConverter<"u",948330:c=>{e.ac("Abs",c,void 0)},948381:c=>{e.ac("Neg",c,void 0)},948432:c=>{e.ac("Floor",c,void 0)},948485:c=>{e.ac("Ceil",c,void 0)},948537:c=>{e.ac("Reciprocal",c,void 0)},948595:c=>{e.ac("Sqrt",c,void 0)},948647:c=>{e.ac("Exp",c,void 0)},948698:c=>{e.ac("Erf",c,void 0)},948749:c=>{e.ac("Sigmoid",c,void 0)},948804:(c,f,y)=>{e.ac("HardSigmoid",c,{alpha:f,beta:y})},948883:c=>{e.ac("Log",c,void 0)},948934:c=>{e.ac("Sin",c,void 0)},948985:c=>{e.ac("Cos",c,void 0)},949036:c=>{e.ac("Tan",c,void 0)},949087:c=>{e.ac("Asin",c,void 0)},949139:c=>{e.ac("Acos",c,void 0)},949191:c=>{e.ac("Atan",c,void 0)},949243:c=>{e.ac("Sinh",c,void 0)},949295:c=>{e.ac("Cosh",c,void 0)},949347:c=>{e.ac("Asinh",c,void 0)},949400:c=>{e.ac("Acosh",c,void 0)},949453:c=>{e.ac("Atanh",c,void 0)},949506:c=>{e.ac("Tanh",c,void 0)},949558:c=>{e.ac("Not",c,void 0)},949609:(c,f,y)=>{e.ac("Clip",c,{min:f,max:y})},949678:c=>{e.ac("Clip",c,void 0)},949730:(c,f)=>{e.ac("Elu",c,{alpha:f})},949788:c=>{e.ac("Gelu",c,void 0)},949840:c=>{e.ac("Relu",c,void 0)},949892:(c,f)=>{e.ac("LeakyRelu",c,{alpha:f})},949956:(c,f)=>{e.ac("ThresholdedRelu",c,{alpha:f})},950026:(c,f)=>{e.ac("Cast",c,{to:f})},950084:c=>{e.ac("Add",c,void 0)},950135:c=>{e.ac("Sub",c,void 0)},950186:c=>{e.ac("Mul",c,void 0)},950237:c=>{e.ac("Div",c,void 0)},950288:c=>{e.ac("Pow",c,void 0)},950339:c=>{e.ac("Equal",c,void 0)},950392:c=>{e.ac("Greater",c,void 0)},950447:c=>{e.ac("GreaterOrEqual",c,void 0)},950509:c=>{e.ac("Less",c,void 0)},950561:c=>{e.ac("LessOrEqual",c,void 0)},950620:(c,f,y,m,T)=>{e.ac("ReduceMean",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},950795:(c,f,y,m,T)=>{e.ac("ReduceMax",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},950969:(c,f,y,m,T)=>{e.ac("ReduceMin",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},951143:(c,f,y,m,T)=>{e.ac("ReduceProd",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},951318:(c,f,y,m,T)=>{e.ac("ReduceSum",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},951492:(c,f,y,m,T)=>{e.ac("ReduceL1",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},951665:(c,f,y,m,T)=>{e.ac("ReduceL2",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},951838:(c,f,y,m,T)=>{e.ac("ReduceLogSum",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},952015:(c,f,y,m,T)=>{e.ac("ReduceSumSquare",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},952195:(c,f,y,m,T)=>{e.ac("ReduceLogSumExp",c,{keepDims:!!f,noopWithEmptyAxes:!!y,axes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},952375:c=>{e.ac("Where",c,void 0)},952428:(c,f,y)=>{e.ac("Transpose",c,{perm:f?Array.from((x(),z).subarray(Number(f)>>>0,Number(y)>>>0)):[]})},952552:(c,f,y,m)=>{e.ac("DepthToSpace",c,{blocksize:f,mode:Ye(y),format:m?"NHWC":"NCHW"})},952685:(c,f,y,m)=>{e.ac("DepthToSpace",c,{blocksize:f,mode:Ye(y),format:m?"NHWC":"NCHW"})},952818:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe,ir)=>{e.ac("ConvTranspose",c,{format:j?"NHWC":"NCHW",autoPad:f,dilations:[y],group:m,kernelShape:[T],pads:[O,k],strides:[M],wIsConst:()=>!!(x(),G)[Z>>>0],outputPadding:be?Array.from((x(),z).subarray(Number(be)>>>0,Number($e)>>>0)):[],outputShape:Ue?Array.from((x(),z).subarray(Number(Ue)>>>0,Number(qe)>>>0)):[],activation:Ye(ir)})},953251:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe)=>{e.ac("ConvTranspose",c,{format:M?"NHWC":"NCHW",autoPad:f,dilations:Array.from((x(),z).subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),group:m,kernelShape:Array.from((x(),z).subarray(Number(T)>>>0,2+(Number(T)>>>0)>>>0)),pads:Array.from((x(),z).subarray(Number(O)>>>0,4+(Number(O)>>>0)>>>0)),strides:Array.from((x(),z).subarray(Number(k)>>>0,2+(Number(k)>>>0)>>>0)),wIsConst:()=>!!(x(),G)[j>>>0],outputPadding:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],outputShape:$e?Array.from((x(),z).subarray(Number($e)>>>0,Number(Ue)>>>0)):[],activation:Ye(qe)})},953912:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe,ir)=>{e.ac("ConvTranspose",c,{format:j?"NHWC":"NCHW",autoPad:f,dilations:[y],group:m,kernelShape:[T],pads:[O,k],strides:[M],wIsConst:()=>!!(x(),G)[Z>>>0],outputPadding:be?Array.from((x(),z).subarray(Number(be)>>>0,Number($e)>>>0)):[],outputShape:Ue?Array.from((x(),z).subarray(Number(Ue)>>>0,Number(qe)>>>0)):[],activation:Ye(ir)})},954345:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe)=>{e.ac("ConvTranspose",c,{format:M?"NHWC":"NCHW",autoPad:f,dilations:Array.from((x(),z).subarray(Number(y)>>>0,2+(Number(y)>>>0)>>>0)),group:m,kernelShape:Array.from((x(),z).subarray(Number(T)>>>0,2+(Number(T)>>>0)>>>0)),pads:Array.from((x(),z).subarray(Number(O)>>>0,4+(Number(O)>>>0)>>>0)),strides:Array.from((x(),z).subarray(Number(k)>>>0,2+(Number(k)>>>0)>>>0)),wIsConst:()=>!!(x(),G)[j>>>0],outputPadding:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],outputShape:$e?Array.from((x(),z).subarray(Number($e)>>>0,Number(Ue)>>>0)):[],activation:Ye(qe)})},955006:(c,f)=>{e.ac("GlobalAveragePool",c,{format:f?"NHWC":"NCHW"})},955097:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe)=>{e.ac("AveragePool",c,{format:qe?"NHWC":"NCHW",auto_pad:f,ceil_mode:y,count_include_pad:m,storage_order:T,dilations:O?Array.from((x(),z).subarray(Number(O)>>>0,Number(k)>>>0)):[],kernel_shape:M?Array.from((x(),z).subarray(Number(M)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],strides:$e?Array.from((x(),z).subarray(Number($e)>>>0,Number(Ue)>>>0)):[]})},955576:(c,f)=>{e.ac("GlobalAveragePool",c,{format:f?"NHWC":"NCHW"})},955667:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe)=>{e.ac("AveragePool",c,{format:qe?"NHWC":"NCHW",auto_pad:f,ceil_mode:y,count_include_pad:m,storage_order:T,dilations:O?Array.from((x(),z).subarray(Number(O)>>>0,Number(k)>>>0)):[],kernel_shape:M?Array.from((x(),z).subarray(Number(M)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],strides:$e?Array.from((x(),z).subarray(Number($e)>>>0,Number(Ue)>>>0)):[]})},956146:(c,f)=>{e.ac("GlobalMaxPool",c,{format:f?"NHWC":"NCHW"})},956233:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe)=>{e.ac("MaxPool",c,{format:qe?"NHWC":"NCHW",auto_pad:f,ceil_mode:y,count_include_pad:m,storage_order:T,dilations:O?Array.from((x(),z).subarray(Number(O)>>>0,Number(k)>>>0)):[],kernel_shape:M?Array.from((x(),z).subarray(Number(M)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],strides:$e?Array.from((x(),z).subarray(Number($e)>>>0,Number(Ue)>>>0)):[]})},956708:(c,f)=>{e.ac("GlobalMaxPool",c,{format:f?"NHWC":"NCHW"})},956795:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe)=>{e.ac("MaxPool",c,{format:qe?"NHWC":"NCHW",auto_pad:f,ceil_mode:y,count_include_pad:m,storage_order:T,dilations:O?Array.from((x(),z).subarray(Number(O)>>>0,Number(k)>>>0)):[],kernel_shape:M?Array.from((x(),z).subarray(Number(M)>>>0,Number(j)>>>0)):[],pads:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],strides:$e?Array.from((x(),z).subarray(Number($e)>>>0,Number(Ue)>>>0)):[]})},957270:(c,f,y,m,T)=>{e.ac("Gemm",c,{alpha:f,beta:y,transA:m,transB:T})},957374:c=>{e.ac("MatMul",c,void 0)},957428:(c,f,y,m)=>{e.ac("ArgMax",c,{keepDims:!!f,selectLastIndex:!!y,axis:m})},957536:(c,f,y,m)=>{e.ac("ArgMin",c,{keepDims:!!f,selectLastIndex:!!y,axis:m})},957644:(c,f)=>{e.ac("Softmax",c,{axis:f})},957707:(c,f)=>{e.ac("Concat",c,{axis:f})},957767:(c,f,y,m,T)=>{e.ac("Split",c,{axis:f,numOutputs:y,splitSizes:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},957923:c=>{e.ac("Expand",c,void 0)},957977:(c,f)=>{e.ac("Gather",c,{axis:Number(f)})},958048:(c,f)=>{e.ac("GatherElements",c,{axis:Number(f)})},958127:(c,f)=>{e.ac("GatherND",c,{batch_dims:Number(f)})},958206:(c,f,y,m,T,O,k,M,j,Z,be)=>{e.ac("Resize",c,{antialias:f,axes:y?Array.from((x(),z).subarray(Number(y)>>>0,Number(m)>>>0)):[],coordinateTransformMode:Ye(T),cubicCoeffA:O,excludeOutside:k,extrapolationValue:M,keepAspectRatioPolicy:Ye(j),mode:Ye(Z),nearestMode:Ye(be)})},958568:(c,f,y,m,T,O,k)=>{e.ac("Slice",c,{starts:f?Array.from((x(),z).subarray(Number(f)>>>0,Number(y)>>>0)):[],ends:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[],axes:O?Array.from((x(),z).subarray(Number(O)>>>0,Number(k)>>>0)):[]})},958832:c=>{e.ac("Tile",c,void 0)},958884:(c,f,y)=>{e.ac("InstanceNormalization",c,{epsilon:f,format:y?"NHWC":"NCHW"})},958998:(c,f,y)=>{e.ac("InstanceNormalization",c,{epsilon:f,format:y?"NHWC":"NCHW"})},959112:c=>{e.ac("Range",c,void 0)},959165:(c,f)=>{e.ac("Einsum",c,{equation:Ye(f)})},959246:(c,f,y,m,T)=>{e.ac("Pad",c,{mode:f,value:y,pads:m?Array.from((x(),z).subarray(Number(m)>>>0,Number(T)>>>0)):[]})},959389:(c,f,y,m,T,O)=>{e.ac("BatchNormalization",c,{epsilon:f,momentum:y,spatial:!!T,trainingMode:!!m,format:O?"NHWC":"NCHW"})},959558:(c,f,y,m,T,O)=>{e.ac("BatchNormalization",c,{epsilon:f,momentum:y,spatial:!!T,trainingMode:!!m,format:O?"NHWC":"NCHW"})},959727:(c,f,y)=>{e.ac("CumSum",c,{exclusive:Number(f),reverse:Number(y)})},959824:(c,f,y)=>{e.ac("DequantizeLinear",c,{axis:f,blockSize:y})},959914:(c,f,y,m,T)=>{e.ac("GridSample",c,{align_corners:f,mode:Ye(y),padding_mode:Ye(m),format:T?"NHWC":"NCHW"})},960084:(c,f,y,m,T)=>{e.ac("GridSample",c,{align_corners:f,mode:Ye(y),padding_mode:Ye(m),format:T?"NHWC":"NCHW"})},960254:(c,f)=>{e.ac("ScatterND",c,{reduction:Ye(f)})},960339:(c,f,y,m,T,O,k,M,j)=>{e.ac("Attention",c,{numHeads:f,isUnidirectional:y,maskFilterValue:m,scale:T,doRotary:O,qkvHiddenSizes:k?Array.from((x(),z).subarray(Number(M)>>>0,Number(M)+k>>>0)):[],pastPresentShareBuffer:!!j})},960611:c=>{e.ac("BiasAdd",c,void 0)},960666:c=>{e.ac("BiasSplitGelu",c,void 0)},960727:c=>{e.ac("FastGelu",c,void 0)},960783:(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe,ir,As)=>{e.ac("Conv",c,{format:$e?"NHWC":"NCHW",auto_pad:f,dilations:y?Array.from((x(),z).subarray(Number(y)>>>0,Number(m)>>>0)):[],group:T,kernel_shape:O?Array.from((x(),z).subarray(Number(O)>>>0,Number(k)>>>0)):[],pads:M?Array.from((x(),z).subarray(Number(M)>>>0,Number(j)>>>0)):[],strides:Z?Array.from((x(),z).subarray(Number(Z)>>>0,Number(be)>>>0)):[],w_is_const:()=>!!(x(),G)[Number(Ue)>>>0],activation:Ye(qe),activation_params:ir?Array.from((x(),te).subarray(Number(ir)>>>0,Number(As)>>>0)):[]})},961367:c=>{e.ac("Gelu",c,void 0)},961419:(c,f,y,m,T,O,k,M,j)=>{e.ac("GroupQueryAttention",c,{numHeads:f,kvNumHeads:y,scale:m,softcap:T,doRotary:O,rotaryInterleaved:k,smoothSoftmax:M,localWindowSize:j})},961636:(c,f,y,m)=>{e.ac("LayerNormalization",c,{axis:f,epsilon:y,simplified:!!m})},961747:(c,f,y,m)=>{e.ac("LayerNormalization",c,{axis:f,epsilon:y,simplified:!!m})},961858:(c,f,y,m,T,O)=>{e.ac("MatMulNBits",c,{k:f,n:y,accuracyLevel:m,bits:T,blockSize:O})},961985:(c,f,y,m,T,O)=>{e.ac("MultiHeadAttention",c,{numHeads:f,isUnidirectional:y,maskFilterValue:m,scale:T,doRotary:O})},962144:(c,f)=>{e.ac("QuickGelu",c,{alpha:f})},962208:(c,f,y,m,T)=>{e.ac("RotaryEmbedding",c,{interleaved:!!f,numHeads:y,rotaryEmbeddingDim:m,scale:T})},962347:(c,f,y)=>{e.ac("SkipLayerNormalization",c,{epsilon:f,simplified:!!y})},962449:(c,f,y)=>{e.ac("SkipLayerNormalization",c,{epsilon:f,simplified:!!y})},962551:(c,f,y,m)=>{e.ac("GatherBlockQuantized",c,{gatherAxis:f,quantizeAxis:y,blockSize:m})},962672:c=>{e.Id(c)},962706:(c,f)=>e.Kd(Number(c),Number(f),e.$c.Nd,e.$c.errors)};function h2(c,f,y){return Sd(async()=>{await e.Gd(Number(c),Number(f),Number(y))})}function m2(){return typeof wasmOffsetConverter<"u"}function g2(c,f,y,m){var T=ve();try{return sp(c,f,y,m)}catch(O){if(_e(T),O!==O+0)throw O;xe(1,0)}}function b2(c,f,y){var m=ve();try{return rp(c,f,y)}catch(T){if(_e(m),T!==T+0)throw T;xe(1,0)}}function y2(c){var f=ve();try{ep(c)}catch(y){if(_e(f),y!==y+0)throw y;xe(1,0)}}function _2(c,f){var y=ve();try{return Ss(c,f)}catch(m){if(_e(y),m!==m+0)throw m;xe(1,0)}}function w2(c,f,y){var m=ve();try{Yd(c,f,y)}catch(T){if(_e(m),T!==T+0)throw T;xe(1,0)}}function v2(c,f){var y=ve();try{up(c,f)}catch(m){if(_e(y),m!==m+0)throw m;xe(1,0)}}function x2(c,f,y,m,T,O,k){var M=ve();try{return ip(c,f,y,m,T,O,k)}catch(j){if(_e(M),j!==j+0)throw j;xe(1,0)}}function T2(c,f,y,m,T,O){var k=ve();try{tp(c,f,y,m,T,O)}catch(M){if(_e(k),M!==M+0)throw M;xe(1,0)}}function I2(c,f,y,m){var T=ve();try{ap(c,f,y,m)}catch(O){if(_e(T),O!==O+0)throw O;xe(1,0)}}function S2(c,f,y,m,T){var O=ve();try{np(c,f,y,m,T)}catch(k){if(_e(O),k!==k+0)throw k;xe(1,0)}}function $2(c,f,y,m,T,O,k){var M=ve();try{cp(c,f,y,m,T,O,k)}catch(j){if(_e(M),j!==j+0)throw j;xe(1,0)}}function A2(c,f,y,m,T,O,k){var M=ve();try{dp(c,f,y,m,T,O,k)}catch(j){if(_e(M),j!==j+0)throw j;xe(1,0)}}function O2(c,f,y,m,T,O,k,M){var j=ve();try{mp(c,f,y,m,T,O,k,M)}catch(Z){if(_e(j),Z!==Z+0)throw Z;xe(1,0)}}function P2(c,f,y,m,T){var O=ve();try{return lp(c,f,y,m,T)}catch(k){if(_e(O),k!==k+0)throw k;xe(1,0)}}function E2(c,f,y,m,T,O,k,M){var j=ve();try{gp(c,f,y,m,T,O,k,M)}catch(Z){if(_e(j),Z!==Z+0)throw Z;xe(1,0)}}function C2(c,f,y,m,T,O,k,M,j,Z,be,$e){var Ue=ve();try{pp(c,f,y,m,T,O,k,M,j,Z,be,$e)}catch(qe){if(_e(Ue),qe!==qe+0)throw qe;xe(1,0)}}function D2(c,f,y,m,T,O){var k=ve();try{return fp(c,f,y,m,T,O)}catch(M){if(_e(k),M!==M+0)throw M;xe(1,0)}}function k2(c,f,y){var m=ve();try{return bp(c,f,y)}catch(T){if(_e(m),T!==T+0)throw T;return xe(1,0),0n}}function N2(c,f,y,m,T,O,k,M,j){var Z=ve();try{op(c,f,y,m,T,O,k,M,j)}catch(be){if(_e(Z),be!==be+0)throw be;xe(1,0)}}function L2(c){var f=ve();try{return yp(c)}catch(y){if(_e(f),y!==y+0)throw y;xe(1,0)}}function R2(c,f,y){var m=ve();try{return _p(c,f,y)}catch(T){if(_e(m),T!==T+0)throw T;xe(1,0)}}function z2(c,f){var y=ve();try{return Lp(c,f)}catch(m){if(_e(y),m!==m+0)throw m;return xe(1,0),0n}}function M2(c,f,y,m,T){var O=ve();try{wp(c,f,y,m,T)}catch(k){if(_e(O),k!==k+0)throw k;xe(1,0)}}function B2(c){var f=ve();try{return vp(c)}catch(y){if(_e(f),y!==y+0)throw y;return xe(1,0),0n}}function F2(c,f,y,m,T,O){var k=ve();try{return Ap(c,f,y,m,T,O)}catch(M){if(_e(k),M!==M+0)throw M;xe(1,0)}}function V2(c,f,y,m,T,O){var k=ve();try{return Op(c,f,y,m,T,O)}catch(M){if(_e(k),M!==M+0)throw M;xe(1,0)}}function G2(c,f,y,m,T,O,k,M){var j=ve();try{return hp(c,f,y,m,T,O,k,M)}catch(Z){if(_e(j),Z!==Z+0)throw Z;xe(1,0)}}function U2(c,f,y,m,T){var O=ve();try{return Pp(c,f,y,m,T)}catch(k){if(_e(O),k!==k+0)throw k;return xe(1,0),0n}}function W2(c,f,y,m){var T=ve();try{return Ep(c,f,y,m)}catch(O){if(_e(T),O!==O+0)throw O;xe(1,0)}}function H2(c,f,y,m){var T=ve();try{return Cp(c,f,y,m)}catch(O){if(_e(T),O!==O+0)throw O;xe(1,0)}}function q2(c,f,y,m,T,O,k,M,j,Z,be,$e){var Ue=ve();try{return Dp(c,f,y,m,T,O,k,M,j,Z,be,$e)}catch(qe){if(_e(Ue),qe!==qe+0)throw qe;xe(1,0)}}function j2(c,f,y,m,T,O,k,M,j,Z,be){var $e=ve();try{Sp(c,f,y,m,T,O,k,M,j,Z,be)}catch(Ue){if(_e($e),Ue!==Ue+0)throw Ue;xe(1,0)}}function K2(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe,ir,As){var eI=ve();try{$p(c,f,y,m,T,O,k,M,j,Z,be,$e,Ue,qe,ir,As)}catch(Os){if(_e(eI),Os!==Os+0)throw Os;xe(1,0)}}function X2(c,f,y,m){var T=ve();try{return kp(c,f,y,m)}catch(O){if(_e(T),O!==O+0)throw O;xe(1,0)}}function Z2(c,f,y,m,T){var O=ve();try{return Np(c,f,y,m,T)}catch(k){if(_e(O),k!==k+0)throw k;xe(1,0)}}function J2(c,f,y){var m=ve();try{return xp(c,f,y)}catch(T){if(_e(m),T!==T+0)throw T;xe(1,0)}}function Q2(c,f,y){var m=ve();try{return Tp(c,f,y)}catch(T){if(_e(m),T!==T+0)throw T;xe(1,0)}}function Y2(c,f,y,m){var T=ve();try{Ip(c,f,y,m)}catch(O){if(_e(T),O!==O+0)throw O;xe(1,0)}}function si(){if(0<Ee)He=si;else if(o)_?.(e),Ve();else{for(var c=at;0<c.length;)c.shift()(e);0<Ee?He=si:(e.calledRun=!0,C||(Ve(),_?.(e)))}}return o||(Zn=await Ne(),si()),e.PTR_SIZE=4,Ie?e:new Promise((c,f)=>{_=c,I=f})}var n3,r3,e_=N(()=>{"use strict";n3=Qy,r3=globalThis.self?.name?.startsWith("em-pthread");r3&&Qy()});var r_,ac,o3,Pt,o_,ic,i3,a3,i_,s3,t_,a_,n_,s_,ma=N(()=>{"use strict";ha();r_=typeof location>"u"?void 0:location.origin,ac=import.meta.url>"file:"&&import.meta.url<"file;",o3=()=>{if(!!1){if(ac){let r=URL;return new URL(new r("ort.all.bundle.min.mjs",import.meta.url).href,r_).href}return import.meta.url}},Pt=o3(),o_=()=>{if(Pt&&!Pt.startsWith("blob:"))return Pt.substring(0,Pt.lastIndexOf("/")+1)},ic=(r,e)=>{try{let n=e??Pt;return(n?new URL(r,n):new URL(r)).origin===r_}catch{return!1}},i3=(r,e)=>{let n=e??Pt;try{return(n?new URL(r,n):new URL(r)).href}catch{return}},a3=(r,e)=>`${e??"./"}${r}`,i_=async r=>{let n=await(await fetch(r,{credentials:"same-origin"})).blob();return URL.createObjectURL(n)},s3=async r=>(await import(/*webpackIgnore:true*/ /*@vite-ignore*/r)).default,t_=(Jy(),Xr(Zy)).default,a_=async()=>{if(!Pt)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(ic(Pt))return[void 0,t_()];let r=await i_(Pt);return[r,t_(r)]},n_=(e_(),Xr(Yy)).default,s_=async(r,e,n,t)=>{let o=n_&&!(r||e);if(o)if(Pt)o=ic(Pt)||t&&!n;else if(t&&!n)o=!0;else throw new Error("cannot determine the script source URL.");if(o)return[void 0,n_];{let i="ort-wasm-simd-threaded.jsep.mjs",a=r??i3(i,e),s=!!1&&n&&a&&!ic(a,e),u=s?await i_(a):a??a3(i,e);return[s?u:void 0,await s3(u)]}}});var sc,uc,Ia,u_,u3,l3,c3,ga,Me,br=N(()=>{"use strict";ma();uc=!1,Ia=!1,u_=!1,u3=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},l3=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},c3=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ga=async r=>{if(uc)return Promise.resolve();if(Ia)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(u_)throw new Error("previous call to 'initializeWebAssembly()' failed.");Ia=!0;let e=r.initTimeout,n=r.numThreads;if(r.simd!==!1){if(r.simd==="relaxed"){if(!c3())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!l3())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let t=u3();n>1&&!t&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+n+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),r.numThreads=n=1);let o=r.wasmPaths,i=typeof o=="string"?o:void 0,a=o?.mjs,s=a?.href??a,u=o?.wasm,l=u?.href??u,d=r.wasmBinary,[p,h]=await s_(s,i,n>1,!!d||!!l),g=!1,b=[];if(e>0&&b.push(new Promise(_=>{setTimeout(()=>{g=!0,_()},e)})),b.push(new Promise((_,I)=>{let w={numThreads:n};if(d)w.wasmBinary=d,w.locateFile=v=>v;else if(l||i)w.locateFile=v=>l??i+v;else if(s&&s.indexOf("blob:")!==0)w.locateFile=v=>new URL(v,s).href;else if(p){let v=o_();v&&(w.locateFile=$=>v+$)}h(w).then(v=>{Ia=!1,uc=!0,sc=v,_(),p&&URL.revokeObjectURL(p)},v=>{Ia=!1,u_=!0,I(v)})})),await Promise.race(b),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${e}ms`)},Me=()=>{if(uc&&sc)return sc;throw new Error("WebAssembly is not initialized yet.")}});var Et,Fo,Oe,Sa=N(()=>{"use strict";br();Et=(r,e)=>{let n=Me(),t=n.lengthBytesUTF8(r)+1,o=n._malloc(t);return n.stringToUTF8(r,o,t),e.push(o),o},Fo=(r,e,n,t)=>{if(typeof r=="object"&&r!==null){if(n.has(r))throw new Error("Circular reference in options");n.add(r)}Object.entries(r).forEach(([o,i])=>{let a=e?e+o:o;if(typeof i=="object")Fo(i,a+".",n,t);else if(typeof i=="string"||typeof i=="number")t(a,i.toString());else if(typeof i=="boolean")t(a,i?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof i}`)})},Oe=r=>{let e=Me(),n=e.stackSave();try{let t=e.PTR_SIZE,o=e.stackAlloc(2*t);e._OrtGetLastError(o,o+t);let i=Number(e.getValue(o,t===4?"i32":"i64")),a=e.getValue(o+t,"*"),s=a?e.UTF8ToString(a):"";throw new Error(`${r} ERROR_CODE: ${i}, ERROR_MESSAGE: ${s}`)}finally{e.stackRestore(n)}}});var l_,c_=N(()=>{"use strict";br();Sa();l_=r=>{let e=Me(),n=0,t=[],o=r||{};try{if(r?.logSeverityLevel===void 0)o.logSeverityLevel=2;else if(typeof r.logSeverityLevel!="number"||!Number.isInteger(r.logSeverityLevel)||r.logSeverityLevel<0||r.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${r.logSeverityLevel}`);if(r?.logVerbosityLevel===void 0)o.logVerbosityLevel=0;else if(typeof r.logVerbosityLevel!="number"||!Number.isInteger(r.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${r.logVerbosityLevel}`);r?.terminate===void 0&&(o.terminate=!1);let i=0;return r?.tag!==void 0&&(i=Et(r.tag,t)),n=e._OrtCreateRunOptions(o.logSeverityLevel,o.logVerbosityLevel,!!o.terminate,i),n===0&&Oe("Can't create run options."),r?.extra!==void 0&&Fo(r.extra,"",new WeakSet,(a,s)=>{let u=Et(a,t),l=Et(s,t);e._OrtAddRunConfigEntry(n,u,l)!==0&&Oe(`Can't set a run config entry: ${a} - ${s}.`)}),[n,t]}catch(i){throw n!==0&&e._OrtReleaseRunOptions(n),t.forEach(a=>e._free(a)),i}}});var d3,p3,f3,$a,h3,d_,p_=N(()=>{"use strict";br();Sa();d3=r=>{switch(r){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${r}`)}},p3=r=>{switch(r){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${r}`)}},f3=r=>{r.extra||(r.extra={}),r.extra.session||(r.extra.session={});let e=r.extra.session;e.use_ort_model_bytes_directly||(e.use_ort_model_bytes_directly="1"),r.executionProviders&&r.executionProviders.some(n=>(typeof n=="string"?n:n.name)==="webgpu")&&(r.enableMemPattern=!1)},$a=(r,e,n,t)=>{let o=Et(e,t),i=Et(n,t);Me()._OrtAddSessionConfigEntry(r,o,i)!==0&&Oe(`Can't set a session config entry: ${e} - ${n}.`)},h3=async(r,e,n)=>{let t=e.executionProviders;for(let o of t){let i=typeof o=="string"?o:o.name,a=[];switch(i){case"webnn":if(i="WEBNN",typeof o!="string"){let h=o?.deviceType;h&&$a(r,"deviceType",h,n)}break;case"webgpu":if(i="JS",typeof o!="string"){let p=o;if(p?.preferredLayout){if(p.preferredLayout!=="NCHW"&&p.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${p.preferredLayout}`);$a(r,"preferredLayout",p.preferredLayout,n)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${i}`)}let s=Et(i,n),u=a.length,l=0,d=0;if(u>0){l=Me()._malloc(u*Me().PTR_SIZE),n.push(l),d=Me()._malloc(u*Me().PTR_SIZE),n.push(d);for(let p=0;p<u;p++)Me().setValue(l+p*Me().PTR_SIZE,a[p][0],"*"),Me().setValue(d+p*Me().PTR_SIZE,a[p][1],"*")}await Me()._OrtAppendExecutionProvider(r,s,l,d,u)!==0&&Oe(`Can't append execution provider: ${i}.`)}},d_=async r=>{let e=Me(),n=0,t=[],o=r||{};f3(o);try{let i=d3(o.graphOptimizationLevel??"all"),a=p3(o.executionMode??"sequential"),s=typeof o.logId=="string"?Et(o.logId,t):0,u=o.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let l=o.logVerbosityLevel??0;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log verbosity level is not valid: ${l}`);let d=typeof o.optimizedModelFilePath=="string"?Et(o.optimizedModelFilePath,t):0;if(n=e._OrtCreateSessionOptions(i,!!o.enableCpuMemArena,!!o.enableMemPattern,a,!!o.enableProfiling,0,s,u,l,d),n===0&&Oe("Can't create session options."),o.executionProviders&&await h3(n,o,t),o.enableGraphCapture!==void 0){if(typeof o.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);$a(n,"enableGraphCapture",o.enableGraphCapture.toString(),t)}if(o.freeDimensionOverrides)for(let[p,h]of Object.entries(o.freeDimensionOverrides)){if(typeof p!="string")throw new Error(`free dimension override name must be a string: ${p}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let g=Et(p,t);e._OrtAddFreeDimensionOverride(n,g,h)!==0&&Oe(`Can't set a free dimension override: ${p} - ${h}.`)}return o.extra!==void 0&&Fo(o.extra,"",new WeakSet,(p,h)=>{$a(n,p,h,t)}),[n,t]}catch(i){throw n!==0&&e._OrtReleaseSessionOptions(n)!==0&&Oe("Can't release session options."),t.forEach(a=>e._free(a)),i}}});var yr,Vn,_r,uo,Vo,Aa,Oa,lc,ue=N(()=>{"use strict";yr=r=>{switch(r){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${r}`)}},Vn=r=>{switch(r){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${r}`)}},_r=(r,e)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][r],t=typeof e=="number"?e:e.reduce((o,i)=>o*i,1);return n>0?Math.ceil(t*n):void 0},uo=r=>{switch(r){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${r}`)}},Vo=r=>{switch(r){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${r}`)}},Aa=r=>r==="float32"||r==="float16"||r==="int32"||r==="int64"||r==="uint32"||r==="uint8"||r==="bool"||r==="uint4"||r==="int4",Oa=r=>r==="float32"||r==="float16"||r==="int32"||r==="int64"||r==="uint32"||r==="uint64"||r==="int8"||r==="uint8"||r==="bool"||r==="uint4"||r==="int4",lc=r=>{switch(r){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${r}`)}}});var Go,cc=N(()=>{"use strict";ha();Go=async r=>{if(typeof r=="string")if(!1)try{let{readFile:e}=Ps("node:fs/promises");return new Uint8Array(await e(r))}catch(e){if(e.code==="ERR_FS_FILE_TOO_LARGE"){let{createReadStream:n}=Ps("node:fs"),t=n(r),o=[];for await(let i of t)o.push(i);return new Uint8Array(Buffer.concat(o))}throw e}else{let e=await fetch(r);if(!e.ok)throw new Error(`failed to load external data file: ${r}`);let n=e.headers.get("Content-Length"),t=n?parseInt(n,10):0;if(t<1073741824)return new Uint8Array(await e.arrayBuffer());{if(!e.body)throw new Error(`failed to load external data file: ${r}, no response body.`);let o=e.body.getReader(),i;try{i=new ArrayBuffer(t)}catch(s){if(s instanceof RangeError){let u=Math.ceil(t/65536);i=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw s}let a=0;for(;;){let{done:s,value:u}=await o.read();if(s)break;let l=u.byteLength;new Uint8Array(i,a,l).set(u),a+=l}return new Uint8Array(i,0,t)}}else return r instanceof Blob?new Uint8Array(await r.arrayBuffer()):r instanceof Uint8Array?r:new Uint8Array(r)}});var m3,g3,f_,h_,Pa,b3,me,Gn=N(()=>{"use strict";ue();m3=["V","I","W","E","F"],g3=(r,e)=>{console.log(`[${m3[r]},${new Date().toISOString()}]${e}`)},Pa=(r,e)=>{f_=r,h_=e},b3=(r,e)=>{let n=Vo(r),t=Vo(f_);n>=t&&g3(n,typeof e=="function"?e():e)},me=(...r)=>{h_&&b3(...r)}});var dc,Un,D,Gr,Ea,m_,g_,pe=N(()=>{"use strict";dc=class{static calcMatMulShape(e,n){return e[1]!==n[0]?void 0:[e[0],n[1]]}},Un=class{static calcShape(e,n,t=!1){let o=e.length,i=n.length;if(o===0)return n;if(i===0)return e;let a=Math.max(e.length,n.length),s=new Array(a);if(t){if(o<2||i<2)return;let u=dc.calcMatMulShape([e[o-2],e[o-1]],[n[i-2],n[i-1]]);if(u===void 0)return;[s[a-2],s[a-1]]=u}for(let u=t?3:1;u<=a;u++){let l=o-u<0?1:e[o-u],d=i-u<0?1:n[i-u];if(l!==d&&l>1&&d>1)return;let p=Math.max(l,d);if(l&&d)s[a-u]=Math.max(l,d);else{if(p>1)return;s[a-u]=0}}return s}static isValidBroadcast(e,n){let t=e.length,o=n.length;if(t>o)return!1;for(let i=1;i<=t;i++)if(e[t-i]!==1&&e[t-i]!==n[o-i])return!1;return!0}},D=class r{static size(e){return r.getSizeFromDimensionRange(e,0,e.length)}static convertShape(e,n=4){let t=e.length;if(t===0)return[];let o=new Array(t),i=t-1;for(;i>=0;){if(e[i]%n===0){o[i]=e[i]/n;break}if(n%e[i]!==0)throw new Error("cannot convert shape");o[i]=1,n/=e[i],i--}for(i--;i>=0;i--)o[i]=e[i];return o}static sizeFromDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,n,e.length)}static sizeToDimension(e,n){if(n<0||n>e.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${e.length} dimensions.`);return r.getSizeFromDimensionRange(e,0,n)}static getSizeFromDimensionRange(e,n,t){let o=1;for(let i=n;i<t;i++){if(e[i]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");o*=Number(e[i])}return o}static computeStrides(e){let n=e.length;if(n===0)return[];if(n===1)return[1];let t=new Array(n);t[n-1]=1,t[n-2]=e[n-1];for(let o=n-3;o>=0;--o)t[o]=t[o+1]*e[o+1];return t}static normalizeAxis(e,n){if(e<-n&&e>=n)throw new Error("unsupported axis for this operation.");return e<0?e+n:e}static normalizeAxes(e,n){return e.map(t=>this.normalizeAxis(t,n??e.length))}static sortBasedOnPerm(e,n){return n?n.map(t=>e[t]):e.slice().reverse()}static padShape(e,n){let t=e.length;return e.map((o,i)=>o+n[i]+n[i+t])}static areEqual(e,n){return e.length!==n.length?!1:e.every((t,o)=>t===n[o])}},Gr=class r{static adjustPoolAttributes(e,n,t,o,i,a){if(!e&&t.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let s=0;s<n.length-2;s++)s>=t.length?t.push(n[s+2]):t[s]=n[s+2];for(let s=0;s<t.length;s++)if(s<o.length){if(o[s]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let s=0;s<t.length;s++)if(s<i.length){if(i[s]<0)throw new Error("dilations should be greater than or equal to 1")}else i.push(1);for(let s=0;s<t.length*2;s++)if(s<a.length){if(a[s]<0)throw new Error("pad should be greater than or equal to 1")}else a.push(0);for(let s=0;s<t.length;s++){if(t[s]<=0)throw new Error("kernel shapes need to be greater than 0");if(a[s]>=t[s]||a[s+t.length]>=t[s])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(e,n,t,o,i,a,s){if(s){if(i.length!==2*(e.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==e.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==e.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<e.length-2;u++)r.adjustPadAndReturnShape(e[u+(a?1:2)],n[u],t[u],o[u],i,u,u+e.length-2,s)}}static computePoolOutputShape(e,n,t,o,i,a,s){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let u=[n[0],n[1]];return r.computeShapeHelper(e,n,u,t,o,i,a,s),u}static computeConvOutputShape(e,n,t,o,i,a,s){if(e.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[e[0],n[0]];return r.computeShapeHelper(!1,e,u,t,o,i,a,s),u}static computeShapeHelper(e,n,t,o,i,a,s,u){if(e)for(let l=0;l<n.length-2;l++)t.push(1);else for(let l=0;l<n.length-2;l++)t.push(r.adjustPadAndReturnShape(n[l+2],o[l],i[l],a[l],s,l,l+n.length-2,u))}static adjustPadAndReturnShape(e,n,t,o,i,a,s,u){let l=t*(o-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return i[a]=0,i[s]=0,Math.floor((e-l)/n+1);case"SAME_LOWER":case"SAME_UPPER":if(t!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=((e+n-1)/n-1)*n+o-e;return i[a]=Math.floor(u==="SAME_LOWER"?(p+1)/2:p/2),i[s]=p-i[a],Math.floor((e+p-o)/n+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((e+i[a]+i[s]-l)/n+1)}},Ea=class{static getShapeOfGemmResult(e,n,t,o,i){if(e.length!==2||t.length!==2)throw new Error("shape need to be of size 2");let a,s,u;n?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(o?(u=t[0],l=1):(u=t[1],l=0),t[l]!==s)throw new Error("dimension mismatch");if(a<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(i&&!Un.isValidBroadcast(i,[a,u]))throw new Error("gemm: invalid bias shape for broadcast");return[a,u,s]}},m_=-34028234663852886e22,g_=34028234663852886e22});var Ca,pc=N(()=>{"use strict";ue();Ca=(r,e)=>new(uo(e))(r)});var y_,hc,__,y3,b_,_3,w_,Da,ka,fc,v_,x_=N(()=>{"use strict";ue();Gn();y_=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),hc=(r,e)=>{if(e==="int32")return r;let n=y_.get(e);if(!n)throw new Error(`WebNN backend does not support data type: ${e}`);let t=n/8;if(r.byteLength%t!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${t}.`);let o=r.byteLength/t,i=new(uo(e))(r.buffer,r.byteOffset,o);switch(e){case"int64":case"uint64":{let a=new Int32Array(o);for(let s=0;s<o;s++){let u=i[s];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");a[s]=Number(u)}return new Uint8Array(a.buffer)}case"int8":case"uint8":case"uint32":{if(e==="uint32"&&i.some(s=>s>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let a=Int32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from ${e} to 'int32'`)}},__=(r,e)=>{if(e==="int32")return r;if(r.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let n=r.byteLength/4,t=new Int32Array(r.buffer,r.byteOffset,n);switch(e){case"int64":{let o=BigInt64Array.from(t,BigInt);return new Uint8Array(o.buffer)}case"uint64":{if(t.some(i=>i<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let o=BigUint64Array.from(t,BigInt);return new Uint8Array(o.buffer)}case"int8":{if(t.some(i=>i<-128||i>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let o=Int8Array.from(t,Number);return new Uint8Array(o.buffer)}case"uint8":{if(t.some(o=>o<0||o>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(t,Number)}case"uint32":{if(t.some(i=>i<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let o=Uint32Array.from(t,Number);return new Uint8Array(o.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${e}`)}},y3=1,b_=()=>y3++,_3=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),w_=(r,e)=>{let n=y_.get(r);if(!n)throw new Error(`WebNN backend does not support data type: ${r}`);return e.length>0?Math.ceil(e.reduce((t,o)=>t*o)*n/8):0},Da=class{constructor(e){this.isDataConverted=!1;let{sessionId:n,context:t,tensor:o,dataType:i,shape:a,fallbackDataType:s}=e;this.sessionId=n,this.mlContext=t,this.mlTensor=o,this.dataType=i,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return w_(this.dataType,this.tensorShape)}destroy(){me("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let n=await this.mlContext.readTensor(this.mlTensor),t=__(new Uint8Array(n),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(t);return}else return t.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,n,t){return this.mlContext===e&&this.dataType===n&&this.tensorShape.length===t.length&&this.tensorShape.every((o,i)=>o===t[i])}setIsDataConverted(e){this.isDataConverted=e}},ka=class{constructor(e,n){this.tensorManager=e;this.wrapper=n}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,n,t,o){let i=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!a?.input.dataTypes.includes(n)){if(s=_3.get(n),!s||a?.input.dataTypes.includes(s))throw new Error(`WebNN backend does not support data type: ${n}`);me("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${n} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(i,n,t))return this.wrapper.tensor;if(o){if(this.wrapper.byteLength!==w_(n,t))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,n,t,u,!0,!0,s),o&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let n=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")n=hc(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(n);return}else me("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(n):this.activeUpload=new Uint8Array(n)}async download(e){if(this.activeUpload){let n=this.wrapper?.isDataConverted?__(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(n):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(n);return}else return n.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},fc=class{constructor(e){this.backend=e;this.tensorTrackersById=new Map;this.freeTensors=[];this.externalTensors=new Set}getMLContext(e){let n=this.backend.getMLContext(e);if(!n)throw new Error("MLContext not found for session.");return n}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=b_();return this.tensorTrackersById.set(e,new ka(this)),e}releaseTensorId(e){let n=this.tensorTrackersById.get(e);n&&(this.tensorTrackersById.delete(e),n.tensorWrapper&&this.releaseTensor(n.tensorWrapper))}async ensureTensor(e,n,t,o,i){me("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${n}, dataType: ${t}, shape: ${o}, copyOld: ${i}}`);let a=this.tensorTrackersById.get(n);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,t,o,i)}upload(e,n){let t=this.tensorTrackersById.get(e);if(!t)throw new Error("Tensor not found.");t.upload(n)}async download(e,n){me("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${n?.byteLength}}`);let t=this.tensorTrackersById.get(e);if(!t)throw new Error("Tensor not found.");return t.download(n)}releaseTensorsForSession(e){for(let n of this.freeTensors)n.sessionId===e&&n.destroy();this.freeTensors=this.freeTensors.filter(n=>n.sessionId!==e)}registerTensor(e,n,t,o){let i=this.getMLContext(e),a=b_(),s=new Da({sessionId:e,context:i,tensor:n,dataType:t,shape:o});return this.tensorTrackersById.set(a,new ka(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,n,t,o,i,a,s){let u=this.getMLContext(e);for(let[d,p]of this.freeTensors.entries())if(p.canReuseTensor(u,n,t)){me("verbose",()=>`[WebNN] Reusing tensor {dataType: ${n}, ${s?`fallbackDataType: ${s},`:""} shape: ${t}`);let h=this.freeTensors.splice(d,1)[0];return h.sessionId=e,h}me("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${n}, ${s?`fallbackDataType: ${s},`:""} shape: ${t}}`);let l=await u.createTensor({dataType:s??n,shape:t,dimensions:t,usage:o,writable:i,readable:a});return new Da({sessionId:e,context:u,tensor:l,dataType:n,shape:t,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},v_=(...r)=>new fc(...r)});var Na,w3,La,T_=N(()=>{"use strict";ue();br();pc();x_();Gn();Na=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),w3=(r,e)=>{if(r===e)return!0;if(r===void 0||e===void 0)return!1;let n=Object.keys(r).sort(),t=Object.keys(e).sort();return n.length===t.length&&n.every((o,i)=>o===t[i]&&r[o]===e[o])},La=class{constructor(e){this.tensorManager=v_(this);this.mlContextBySessionId=new Map;this.sessionIdsByMLContext=new Map;this.mlContextCache=[];this.sessionGraphInputs=new Map;this.sessionGraphOutputs=new Map;this.temporaryGraphInputs=[];this.temporaryGraphOutputs=[];this.temporarySessionTensorIds=new Map;this.mlOpSupportLimitsBySessionId=new Map;Pa(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){me("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){me("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let n=this.temporarySessionTensorIds.get(e);if(n){for(let t of n)me("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${t}}`),this.tensorManager.releaseTensorId(t);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let t=this.mlContextCache.findIndex(o=>o.gpuDevice===e);if(t!==-1)return this.mlContextCache[t].mlContext;{let o=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:o}),o}}else if(e===void 0){let t=this.mlContextCache.findIndex(o=>o.options===void 0&&o.gpuDevice===void 0);if(t!==-1)return this.mlContextCache[t].mlContext;{let o=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:o}),o}}let n=this.mlContextCache.findIndex(t=>w3(t.options,e));if(n!==-1)return this.mlContextCache[n].mlContext;{let t=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:t}),t}}registerMLContext(e,n){this.mlContextBySessionId.set(e,n);let t=this.sessionIdsByMLContext.get(n);t||(t=new Set,this.sessionIdsByMLContext.set(n,t)),t.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,n.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let n=this.mlContextBySessionId.get(e);if(!n)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let t=this.sessionIdsByMLContext.get(n);if(t.delete(e),t.size===0){this.sessionIdsByMLContext.delete(n);let o=this.mlContextCache.findIndex(i=>i.mlContext===n);o!==-1&&this.mlContextCache.splice(o,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){me("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,n,t,o,i){let a=Na.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,n,a,o,i)}async createTemporaryTensor(e,n,t){me("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${n}, shape: ${t}}`);let o=Na.get(n);if(!o)throw new Error(`Unsupported ONNX data type: ${n}`);let i=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,i,o,t,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(i):this.temporarySessionTensorIds.set(e,[i]),i}uploadTensor(e,n){if(!Me().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");me("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${n.byteLength}}`),this.tensorManager.upload(e,n)}async downloadTensor(e,n){return this.tensorManager.download(e,n)}createMLTensorDownloader(e,n){return async()=>{let t=await this.tensorManager.download(e);return Ca(t,n)}}registerMLTensor(e,n,t,o){let i=Na.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.registerTensor(e,n,i,o);return me("verbose",()=>`[WebNN] registerMLTensor {tensor: ${n}, dataType: ${i}, dimensions: ${o}} -> {tensorId: ${a}}`),a}registerMLConstant(e,n,t,o,i,a,s=!1){if(!a)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=a.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(n+t>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(n,n+t).buffer,p;switch(i.dataType){case"float32":p=new Float32Array(d);break;case"float16":p=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":p=new Int32Array(d);break;case"uint32":p=new Uint32Array(d);break;case"int64":if(s){let h=hc(new Uint8Array(d),"int64");p=new Int32Array(h.buffer),i.dataType="int32"}else p=new BigInt64Array(d);break;case"uint64":p=new BigUint64Array(d);break;case"int8":p=new Int8Array(d);break;case"int4":case"uint4":case"uint8":p=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${i.dataType} in creating WebNN Constant from external data.`)}return me("verbose",()=>`[WebNN] registerMLConstant {dataType: ${i.dataType}, shape: ${i.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),o.constant(i,p)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,n){let t=this.sessionGraphInputs.get(e);return t?t.includes(n):!1}isGraphOutput(e,n){let t=this.sessionGraphOutputs.get(e);return t?t.includes(n):!1}isGraphInputOutputTypeSupported(e,n,t=!0){let o=Na.get(yr(n)),i=this.mlOpSupportLimitsBySessionId.get(e);return typeof o>"u"?!1:t?!!i?.input.dataTypes.includes(o):!!i?.output.dataTypes.includes(o)}flush(){}}});var Ra=N(()=>{"use strict"});var I_,mc,gc,v3,x3,S_,yc,bc,A_,O_=N(()=>{"use strict";Gn();Ra();I_=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),mc=[],gc=r=>Math.ceil(Number(r)/16)*16,v3=r=>{for(let e=0;e<mc.length;e++){let n=mc[e];if(r<=n)return n}return Math.ceil(r/16)*16},x3=1,S_=()=>x3++,yc=async(r,e,n,t)=>{let o=gc(n),i=r.device.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let a=r.getCommandEncoder();r.endComputePass(),a.copyBufferToBuffer(e,0,i,0,o),r.flush(),await i.mapAsync(GPUMapMode.READ);let s=i.getMappedRange();if(t){let u=t();return u.set(new Uint8Array(s,0,n)),u}else return new Uint8Array(s.slice(0,n))}finally{i.destroy()}},bc=class{constructor(e){this.backend=e;this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[n]of I_)mc.push(n),this.freeBuffers.set(n,[]),this.freeUniformBuffers.set(n,[]);this.sessionCount=0}upload(e,n){let t=n.buffer,o=n.byteOffset,i=n.byteLength,a=gc(i),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==i)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${i}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:a,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(t,o,i)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,s.gpuData.buffer,0,a),this.backend.device.queue.submit([d.finish()]),u.destroy(),me("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,n){let t=this.storageCache.get(e);if(!t)throw new Error("source gpu data for memcpy does not exist");let o=this.storageCache.get(n);if(!o)throw new Error("destination gpu data for memcpy does not exist");if(t.originalSize!==o.originalSize)throw new Error("inconsistent source and destination gpu data size");let i=gc(t.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(t.gpuData.buffer,0,o.gpuData.buffer,0,i)}registerExternalBuffer(e,n,t){let o;if(t){if(o=t[0],e===t[1])return me("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${n}) => id=${o}, buffer is the same, skip.`),o;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else o=S_();return this.storageCache.set(o,{gpuData:{id:o,type:0,buffer:e},originalSize:n}),me("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${n}) => id=${o}, registered.`),o}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),me("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let t=v3(e),o,i=(n&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(n&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(i||a){let l=(i?this.freeBuffers:this.freeUniformBuffers).get(t);l?l.length>0?o=l.pop():o=this.backend.device.createBuffer({size:t,usage:n}):o=this.backend.device.createBuffer({size:t,usage:n})}else o=this.backend.device.createBuffer({size:t,usage:n});let s={id:S_(),type:0,buffer:o};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),me("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let n=typeof e=="bigint"?Number(e):e,t=this.storageCache.get(n);if(!t){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return me("verbose",()=>`[WebGPU] GpuDataManager.release(id=${n}), gpuDataId=${t.gpuData.id}`),this.storageCache.delete(n),this.buffersPending.push(t.gpuData.buffer),t.originalSize}async download(e,n){let t=this.storageCache.get(Number(e));if(!t)throw new Error("data does not exist");await yc(this.backend,t.gpuData.buffer,t.originalSize,n)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let n=I_.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let t=this.freeBuffers.get(e.size)||[];n===void 0||t.length>=n?e.destroy():t.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let t=this.freeUniformBuffers.get(e.size)||[];n===void 0||t.length>=n?e.destroy():t.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let n of this.buffersPending)e.push(n);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(n=>{n.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(n=>{n.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(n=>{n.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let n=this.capturedPendingBuffers.get(e);n&&(n.forEach(t=>{t.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(me("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(t=>{t.gpuData.buffer.destroy()}),this.storageCache=new Map)}},A_=(...r)=>new bc(...r)});var _c,le,Qe=N(()=>{"use strict";_c=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},le=r=>new _c(r)});var Ur,vc,Fe,ut,W,Pe,xc,Wr,Zt,Q,za,L,V,P_,Ma,wc,E_,he=N(()=>{"use strict";ue();pe();Ur=64,vc=(r,e)=>{if(e===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(r)){case 10:return e>1?`vec${e}<f16>`:"f16";case 1:return e>1?`vec${e}<f32>`:"f32";case 6:return e>1?`vec${e}<i32>`:"i32";case 12:return e>1?`vec${e}<u32>`:"u32";case 7:if(e>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(e>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(e!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${r}`)}},Fe=(r,e=1)=>{let n=vc(r,e);return typeof n=="string"?n:n[0]},ut=(r,e=1)=>{let n=vc(r,e);return typeof n=="string"?n:n[1]},W=(...r)=>{let e=[];return r.forEach(n=>{n.length!==0&&e.push({type:12,data:n},{type:12,data:D.computeStrides(n)})}),e},Pe=r=>r%4===0?4:r%2===0?2:1,xc=(r="f32",e,n="0")=>!e||e===1?`${r}(${n})`:`vec${e}<${r}>(${n})`,Wr=(r,e,n)=>r==="f32"?n:e===1?`f32(${n})`:`vec${e}<f32>(${n})`,Zt=(r,e)=>e===4?`(${r}.x + ${r}.y + ${r}.z + ${r}.w)`:e===2?`(${r}.x + ${r}.y)`:e===3?`(${r}.x + ${r}.y + ${r}.z)`:r,Q=(r,e,n,t)=>r.startsWith("uniforms.")&&n>4?typeof e=="string"?t==="f16"?`${r}[(${e}) / 8][(${e}) % 8 / 4][(${e}) % 8 % 4]`:`${r}[(${e}) / 4][(${e}) % 4]`:t==="f16"?`${r}[${Math.floor(e/8)}][${Math.floor(e%8/4)}][${e%8%4}]`:`${r}[${Math.floor(e/4)}][${e%4}]`:n>1?`${r}[${e}]`:r,za=(r,e,n,t,o)=>{let i=typeof n=="number",a=i?n:n.length,s=[...new Array(a).keys()],u=a<2?"u32":a<=4?`vec${a}<u32>`:`array<u32, ${a}>`,l=vc(e,o),d=typeof l=="string"?l:l[1],p=typeof l=="string"?l:l[0],h={indices:u,value:d,storage:p,tensor:e},g=F=>typeof F=="string"?F:`${F}u`,b={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},_=i?"uniforms.":"",I=`${_}${r}_shape`,w=`${_}${r}_strides`,v="";for(let F=0;F<a-1;F++)v+=`
    let dim${F} = current / ${Q(w,F,a)};
    let rest${F} = current % ${Q(w,F,a)};
    indices[${F}] = dim${F};
    current = rest${F};
    `;v+=`indices[${a-1}] = current;`;let $=a<2?"":`
  fn o2i_${r}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${v}
    return indices;
  }`,A=F=>(b.offsetToIndices=!0,a<2?F:`o2i_${r}(${F})`),P=[];if(a>=2)for(let F=a-1;F>=0;F--)P.push(`${Q(w,F,a)} * (indices[${F}])`);let C=a<2?"":`
  fn i2o_${r}(indices: ${h.indices}) -> u32 {
    return ${P.join("+")};
  }`,R=F=>(b.indicesToOffset=!0,a<2?F:`i2o_${r}(${F})`),x=(...F)=>a===0?"0u":`${h.indices}(${F.map(g).join(",")})`,B=(F,q)=>a<2?`${F}`:`${Q(F,q,a)}`,G=(F,q,Ne)=>a<2?`${F}=${Ne};`:`${Q(F,q,a)}=${Ne};`,Y={},J=(F,q)=>{b.broadcastedIndicesToOffset=!0;let Ne=`${q.name}broadcastedIndicesTo${r}Offset`;if(Ne in Y)return`${Ne}(${F})`;let rt=[];for(let Ge=a-1;Ge>=0;Ge--){let at=q.indicesGet("outputIndices",Ge+q.rank-a);rt.push(`${B(w,Ge)} * (${at} % ${B(I,Ge)})`)}return Y[Ne]=`fn ${Ne}(outputIndices: ${q.type.indices}) -> u32 {
             return ${rt.length>0?rt.join("+"):"0u"};
           }`,`${Ne}(${F})`},ie=(F,q)=>(()=>{if(h.storage===h.value)return`${r}[${F}]=${q};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${r}[${F}]=vec2<u32>(u32(${q}), select(0u, 0xFFFFFFFFu, ${q} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${r}[${F}]=vec2<u32>(u32(${q}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${r}[${F}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${q}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),z=F=>(()=>{if(h.storage===h.value)return`${r}[${F}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${r}[${F}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${r}[${F}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${r}[${F}] & 0xFFu), bool(${r}[${F}] & 0xFF00u), bool(${r}[${F}] & 0xFF0000u), bool(${r}[${F}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),U=a<2?"":`
  fn get_${r}ByIndices(indices: ${h.indices}) -> ${d} {
    return ${z(`i2o_${r}(indices)`)};
  }`,te=a<2?"":(()=>{let F=s.map(Ne=>`d${Ne}: u32`).join(", "),q=s.map(Ne=>`d${Ne}`).join(", ");return`
  fn get_${r}(${F}) -> ${d} {
    return get_${r}ByIndices(${x(q)});
  }`})(),oe=(...F)=>{if(F.length!==a)throw new Error(`indices length must be ${a}`);let q=F.map(g).join(",");return a===0?z("0u"):a===1?z(q[0]):(b.get=!0,b.getByIndices=!0,b.indicesToOffset=!0,`get_${r}(${q})`)},ee=F=>a<2?z(F):(b.getByIndices=!0,b.indicesToOffset=!0,`get_${r}ByIndices(${F})`),de=a<2?"":`
  fn set_${r}ByIndices(indices: ${h.indices}, value: ${d}) {
    ${ie(`i2o_${r}(indices)`,"value")}
  }`,ge=a<2?"":(()=>{let F=s.map(Ne=>`d${Ne}: u32`).join(", "),q=s.map(Ne=>`d${Ne}`).join(", ");return`
  fn set_${r}(${F}, value: ${d}) {
    set_${r}ByIndices(${x(q)}, value);
  }`})();return{impl:()=>{let F=[],q=!1;return b.offsetToIndices&&(F.push($),q=!0),b.indicesToOffset&&(F.push(C),q=!0),b.broadcastedIndicesToOffset&&(Object.values(Y).forEach(Ne=>F.push(Ne)),q=!0),b.set&&(F.push(ge),q=!0),b.setByIndices&&(F.push(de),q=!0),b.get&&(F.push(te),q=!0),b.getByIndices&&(F.push(U),q=!0),!i&&q&&F.unshift(`const ${I} = ${h.indices}(${n.join(",")});`,`const ${w} = ${h.indices}(${D.computeStrides(n).join(",")});`),F.join(`
`)},type:h,offsetToIndices:A,indicesToOffset:R,broadcastedIndicesToOffset:J,indices:x,indicesGet:B,indicesSet:G,set:(...F)=>{if(F.length!==a+1)throw new Error(`indices length must be ${a}`);let q=F[a];if(typeof q!="string")throw new Error("value must be string");let Ne=F.slice(0,a).map(g).join(",");return a===0?ie("0u",q):a===1?ie(Ne[0],q):(b.set=!0,b.setByIndices=!0,b.indicesToOffset=!0,`set_${r}(${Ne}, ${q})`)},setByOffset:ie,setByIndices:(F,q)=>a<2?ie(F,q):(b.setByIndices=!0,b.indicesToOffset=!0,`set_${r}ByIndices(${F}, ${q});`),get:oe,getByOffset:z,getByIndices:ee,usage:t,name:r,strides:w,shape:I,rank:a}},L=(r,e,n,t=1)=>za(r,e,n,"input",t),V=(r,e,n,t=1)=>za(r,e,n,"output",t),P_=(r,e,n)=>za(r,e,n,"atomicOutput",1),Ma=(r,e,n,t=1)=>za(r,e,n,"internal",t),wc=class{constructor(e,n){this.normalizedDispatchGroup=e;this.limits=n;this.internalVariables=[];this.variables=[];this.uniforms=[];this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Ur){let n=typeof e=="number"?e:e[0],t=typeof e=="number"?1:e[1],o=typeof e=="number"?1:e[2];if(n>this.limits.maxComputeWorkgroupSizeX||t>this.limits.maxComputeWorkgroupSizeY||o>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${n}, ${t}, ${o}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(n*t*o>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${n}, ${t}, ${o}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let i=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=i?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=i?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${n*t*o}u + local_idx;`;return`@compute @workgroup_size(${n}, ${t}, ${o})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,n){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let t=e.usage==="input"?"read":"read_write",o=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${n}) var<storage, ${t}> ${e.name}: array<${o}>;`}declareVariables(...e){return e.map(n=>this.declareVariable(n,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(n=>this.registerInternalVariable(n)),this}registerUniform(e,n,t=1){return this.uniforms.push({name:e,type:n,length:t}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:n,type:t,length:o}of this.uniforms)if(o&&o>4)t==="f16"?e.push(`@align(16) ${n}:array<mat2x4<${t}>, ${Math.ceil(o/8)}>`):e.push(`${n}:array<vec4<${t}>, ${Math.ceil(o/4)}>`);else{let i=o==null||o===1?t:`vec${o}<${t}>`;e.push(`${n}:${i}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=n=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(n)];return this.uniforms.map(n=>[e(n.type),n.length??1])}},E_=(r,e)=>new wc(r,e)});var T3,C_,I3,S3,$3,A3,lt,D_,k_,Yn=N(()=>{"use strict";ue();pe();Qe();he();T3=(r,e)=>{if(!r||r.length!==1)throw new Error("Transpose requires 1 input.");if(e.length!==0&&e.length!==r[0].dims.length)throw new Error(`perm size ${e.length} does not match input rank ${r[0].dims.length}`)},C_=(r,e)=>e.length!==0?e:[...new Array(r).keys()].reverse(),I3=(r,e)=>D.sortBasedOnPerm(r,C_(r.length,e)),S3=(r,e,n,t)=>{let o=`fn perm(i: ${t.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let i=0;i<e;++i)o+=`a[${r[i]}]=i[${i}];`;return o+="return a;}"},$3=(r,e)=>{let n=[],t=[];for(let o=0;o<r.length;++o)r[o]!==1&&n.push(r[o]),r[e[o]]!==1&&t.push(e[o]);return{newShape:n,newPerm:t}},A3=(r,e)=>{let n=0;for(let t=0;t<r.length;++t)if(e[r[t]]!==1){if(r[t]<n)return!1;n=r[t]}return!0},lt=(r,e)=>{let n=r.dataType,t=r.dims.length,o=C_(t,e),i=I3(r.dims,o),a=r.dims,s=i,u=t<2||A3(o,r.dims),l;if(u)return l=_=>{let I=L("input",n,a,4),w=V("output",n,s,4);return`
  ${_.registerUniform("output_size","u32").declareVariables(I,w)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=D.size(i);return{outputs:[{dims:i,dataType:r.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:l};let{newShape:d,newPerm:p}=$3(r.dims,o),h=D.areEqual(p,[2,3,1]),g=D.areEqual(p,[3,1,2]);if(d.length===2||h||g){a=h?[d[0],d[1]*d[2]]:g?[d[0]*d[1],d[2]]:d,s=[a[1],a[0]];let _=16;return l=I=>{let w=L("a",n,a.length),v=V("output",n,s.length);return`
  ${I.registerUniform("output_size","u32").declareVariables(w,v)}
  var<workgroup> tile : array<array<${v.type.value}, ${_+1}>, ${_}>;
  ${I.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${w.getByIndices(`${w.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${v.setByIndices(`${v.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let I=D.size(i);return{outputs:[{dims:i,dataType:r.dataType}],dispatchGroup:{x:Math.ceil(s[1]/_),y:Math.ceil(s[0]/_)},programUniforms:[{type:12,data:I},...W(a,s)]}},getShaderSource:l}}return l=_=>{let I=L("a",n,a.length),w=V("output",n,s.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(I,w)}

  ${S3(o,t,I,w)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",I.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${e}`,inputDependencies:["rank"]},getRunData:()=>{let _=D.size(i);return{outputs:[{dims:i,dataType:r.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...W(a,s)]}},getShaderSource:l}},D_=(r,e)=>{T3(r.inputs,e.perm),r.compute(lt(r.inputs[0],e.perm))},k_=r=>le({perm:r.perm})});var O3,P3,E3,C3,D3,k3,N3,L3,R3,z3,Wn,N_,L_,R_,z_,M_,B_,F_,V_,G_,U_,W_=N(()=>{"use strict";ue();pe();he();Ba();Yn();O3={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},P3={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},E3={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},C3={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},D3=(r,e)=>{let n=[];for(let t=e-r;t<e;++t)n.push(t);return n},k3=(r,e)=>{let n=[],t=r.length;for(let i=0;i<t;i++)e.indexOf(i)===-1&&n.push(r[i]);let o=e.map(i=>r[i]);return[n,o]},N3=(r,e)=>{let n=r.length+e.length,t=[],o=0;for(let i=0;i<n;i++)e.indexOf(i)===-1?t.push(r[o++]):t.push(1);return t},L3=(r,e)=>{for(let n=0;n<r.length;++n)if(r[r.length-n-1]!==e-1-n)return!1;return!0},R3=(r,e)=>{let n=[];if(!L3(r,e)){for(let t=0;t<e;++t)r.indexOf(t)===-1&&n.push(t);r.forEach(t=>n.push(t))}return n},z3=(r,e,n,t,o,i,a)=>{let s=n[0].dims,u=D.size(i),l=D.size(a),d=L("_A",n[0].dataType,s),p=V("output",o,i),h=64;u===1&&(h=256);let g=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,b=_=>`
        ${_.registerUniform("reduceSize","u32").declareVariables(d,p)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${_.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${E3[t]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${d.getByOffset("offset + k")});
           bestValue = ${O3[t]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${P3[t]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${p.setByOffset("outputIndex",`${t==="mean"?`${p.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${p.type.storage}(${C3[t]})`}`)};
         }
        }`;return{name:r,shaderCache:{hint:`${e};${h}`,inputDependencies:["type"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:i,dataType:o}],dispatchGroup:{x:u},programUniforms:[{type:12,data:l}]})}},Wn=(r,e,n,t)=>{let o=r.inputs.length===1?n:Tc(r.inputs,n),i=o.axes;i.length===0&&!o.noopWithEmptyAxes&&(i=r.inputs[0].dims.map((g,b)=>b));let a=D.normalizeAxes(i,r.inputs[0].dims.length),s=a,u=r.inputs[0],l=R3(s,r.inputs[0].dims.length);l.length>0&&(u=r.compute(lt(r.inputs[0],l),{inputs:[0],outputs:[-1]})[0],s=D3(s.length,u.dims.length));let[d,p]=k3(u.dims,s),h=d;o.keepDims&&(h=N3(d,a)),r.compute(z3(e,o.cacheKey,[u],t,r.inputs[0].dataType,h,p),{inputs:[u]})},N_=(r,e)=>{Wn(r,"ReduceMeanShared",e,"mean")},L_=(r,e)=>{Wn(r,"ReduceL1Shared",e,"l1")},R_=(r,e)=>{Wn(r,"ReduceL2Shared",e,"l2")},z_=(r,e)=>{Wn(r,"ReduceLogSumExpShared",e,"logSumExp")},M_=(r,e)=>{Wn(r,"ReduceMaxShared",e,"max")},B_=(r,e)=>{Wn(r,"ReduceMinShared",e,"min")},F_=(r,e)=>{Wn(r,"ReduceProdShared",e,"prod")},V_=(r,e)=>{Wn(r,"ReduceSumShared",e,"sum")},G_=(r,e)=>{Wn(r,"ReduceSumSquareShared",e,"sumSquare")},U_=(r,e)=>{Wn(r,"ReduceLogSumShared",e,"logSum")}});var Hn,M3,Fa,Tc,qn,B3,F3,V3,G3,U3,W3,H3,q3,j3,K3,jn,H_,q_,j_,K_,X_,Z_,J_,Q_,Y_,e0,Ba=N(()=>{"use strict";ue();pe();Qe();he();W_();Hn=r=>{if(!r||r.length===0||r.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(r.length===2&&r[1].dims.length!==1)throw new Error("Invalid axes input dims.")},M3=r=>["","",`var value = ${r.getByIndices("input_indices")};`,""],Fa=(r,e,n,t,o,i,a=!1,s=!1)=>{let u=[],l=n[0].dims,d=l.length,p=D.normalizeAxes(o,d),h=!s&&p.length===0;l.forEach((I,w)=>{h||p.indexOf(w)>=0?a&&u.push(1):u.push(I)});let g=u.length,b=D.size(u);return{name:r,shaderCache:e,getShaderSource:I=>{let w=[],v=L("_A",n[0].dataType,d),$=V("output",i,g),A=t(v,$,p),P=A[2];for(let C=0,R=0;C<d;C++)h||p.indexOf(C)>=0?(a&&R++,P=`for(var j${C}: u32 = 0; j${C} < ${l[C]}; j${C}++) {
                  ${A[2].includes("last_index")?`let last_index = j${C};`:""}
                  ${v.indicesSet("input_indices",C,`j${C}`)}
                  ${P}
                }`):(w.push(`${v.indicesSet("input_indices",C,$.indicesGet("output_indices",R))};`),R++);return`

        ${I.registerUniform("output_size","u32").declareVariables(v,$)}

        ${I.mainStart()}
          ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${v.type.indices};
          let output_indices = ${$.offsetToIndices("global_idx")};

          ${w.join(`
`)}
          ${A[0]}       // init ops for reduce max/min
          ${A[1]}
          ${P}
          ${A[3]}
          ${A.length===4?$.setByOffset("global_idx","value"):A.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:i}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:[{type:12,data:b},...W(l,u)]})}},Tc=(r,e)=>{let n=[];return r[1].dims[0]>0&&r[1].getBigInt64Array().forEach(t=>n.push(Number(t))),le({axes:n,keepDims:e.keepDims,noopWithEmptyAxes:e.noopWithEmptyAxes})},qn=(r,e,n,t)=>{let o=r.inputs,i=o.length===1?n:Tc(o,n);r.compute(Fa(e,{hint:i.cacheKey,inputDependencies:["rank"]},[o[0]],i.noopWithEmptyAxes&&i.axes.length===0?M3:t,i.axes,o[0].dataType,i.keepDims,i.noopWithEmptyAxes),{inputs:[0]})},B3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceLogSum",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${t.getByIndices("input_indices")};`,"value = log(value);"])},F3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceL1",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += abs(${t.getByIndices("input_indices")});`,""])},V3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceL2",e,(t,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${t.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},G3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceLogSumExp",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += exp(${t.getByIndices("input_indices")});`,"value = log(value);"])},U3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceMax",e,(t,o,i)=>{let a=[];for(let s=0;s<t.rank;s++)(i.indexOf(s)>=0||i.length===0)&&a.push(t.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};`,`value = max(value, ${t.getByIndices("input_indices")});`,""]})},W3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceMean",e,(t,o,i)=>{let a=1;for(let s=0;s<t.rank;s++)(i.indexOf(s)>=0||i.length===0)&&(a*=r.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${t.getByIndices("input_indices")});`,`let value = ${o.type.value}(sum / ${a});`]})},H3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceMin",e,(t,o,i)=>{let a=[];for(let s=0;s<t.rank;s++)(i.indexOf(s)>=0||i.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};`,`value = min(value, ${t.getByIndices("input_indices")});`,""]})},q3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceProd",e,(t,o)=>[`var value = ${o.type.storage}(1);`,"",`value *= ${t.getByIndices("input_indices")};`,""])},j3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceSum",e,(t,o)=>[`var value = ${o.type.storage}(0);`,"",`value += ${t.getByIndices("input_indices")};`,""])},K3=(r,e)=>{Hn(r.inputs),qn(r,"ReduceSumSquare",e,(t,o)=>[`var t = ${o.type.value}(0); var value = ${o.type.value}(0);`,"",`t = ${t.getByIndices("input_indices")}; value += t * t;`,""])},jn=(r,e,n)=>{if(e.length===0)return n;let t=1,o=1;for(let i=0;i<e.length;i++)e.indexOf(i)===-1?t*=r[i]:o*=r[i];return o<32&&t>1024},H_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?W3(r,e):N_(r,e)},q_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?F3(r,e):L_(r,e)},j_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?V3(r,e):R_(r,e)},K_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?G3(r,e):z_(r,e)},X_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?U3(r,e):M_(r,e)},Z_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?H3(r,e):B_(r,e)},J_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?q3(r,e):F_(r,e)},Q_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?j3(r,e):V_(r,e)},Y_=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?K3(r,e):G_(r,e)},e0=(r,e)=>{jn(r.inputs[0].dims,e.axes,e.noopWithEmptyAxes)?B3(r,e):U_(r,e)}});var t0,n0,r0,Ic,o0=N(()=>{"use strict";ue();Qe();Ba();t0=r=>{if(!r||r.length===0||r.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(r[0].dataType!==1)throw new Error("Invalid input type.")},n0=(r,e)=>{t0(r.inputs);let n=(t,o,i)=>{let a=[];for(let s=0;s<t.rank;s++)(i.indexOf(s)>=0||i.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${t.getByIndices("input_indices")} ${e.selectLastIndex>0?"<=":"<"} value) {
         value = ${t.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};r.compute(Fa("ArgMin",{hint:e.cacheKey,inputDependencies:["rank"]},[r.inputs[0]],n,[e.axis],7,e.keepDims),{inputs:[0]})},r0=(r,e)=>{t0(r.inputs);let n=(t,o,i)=>{let a=[];for(let s=0;s<t.rank;s++)(i.indexOf(s)>=0||i.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${t.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${t.getByIndices("input_indices")} ${e.selectLastIndex>0?">=":">"} value) {
         value = ${t.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};r.compute(Fa("argMax",{hint:e.cacheKey,inputDependencies:["rank"]},[r.inputs[0]],n,[e.axis],7,e.keepDims),{inputs:[0]})},Ic=r=>le(r)});var X3,Sc,Z3,J3,Q3,lo,Y3,i0,Va=N(()=>{"use strict";ue();pe();Ra();he();X3=(r,e)=>{let n=r[0],t=r[1],o=r[2],i=r[3],a=r[4],s=r[5];if(a&&s)throw new Error("Attention cannot have both past and attention_bias");if(n.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=n.dims[0],l=n.dims[1],d=n.dims[2];if(o.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(t.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(t.dims[0]!==d)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(o.dims[0]!==t.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let p=o.dims[0]/3,h=p,g=h;if(e.qkvHiddenSizes.length>0){if(e.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let $ of e.qkvHiddenSizes)if($%e.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");p=e.qkvHiddenSizes[0],h=e.qkvHiddenSizes[1],g=e.qkvHiddenSizes[2]}let b=l;if(p!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(o.dims[0]!==p+h+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let _=0;if(a){if(h!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(a.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(a.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(a.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(a.dims[2]!==e.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(a.dims[4]!==h/e.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');e.pastPresentShareBuffer||(_=a.dims[3])}let I=b+_,w=-1,v=0;if(i)throw new Error("Mask not supported");if(a)throw new Error("past is not supported");if(s){if(s.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(s.dims[0]!==u||s.dims[1]!==e.numHeads||s.dims[2]!==l||s.dims[3]!==I)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:l,pastSequenceLength:_,kvSequenceLength:b,totalSequenceLength:I,maxSequenceLength:w,inputHiddenSize:d,hiddenSize:p,vHiddenSize:g,headSize:Math.floor(p/e.numHeads),vHeadSize:Math.floor(g/e.numHeads),numHeads:e.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:e.maskFilterValue,maskType:v,scale:e.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Sc=(r,e,n)=>e&&r?`
      let total_sequence_length_input = u32(${e.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${r?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Z3=(r,e,n,t,o,i,a,s)=>{let u=Pe(a?1:i),l=64,d=i/u;d<l&&(l=32);let p=Math.ceil(i/u/l),h=[{type:12,data:e},{type:12,data:n},{type:12,data:t},{type:12,data:o},{type:12,data:d},{type:12,data:p}],g=Fe(r.dataType,u),b=ut(1,u),_=["type"];a&&_.push("type"),s&&_.push("type");let I=w=>{let v=V("x",r.dataType,r.dims,u),$=[v],A=a?L("seq_lens",a.dataType,a.dims):void 0;A&&$.push(A);let P=s?L("total_sequence_length_input",s.dataType,s.dims):void 0;P&&$.push(P);let C=ut(r.dataType),R=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${l}>;
  var<workgroup> thread_sum: array<f32, ${l}>;
  ${w.registerUniforms(R).declareVariables(...$)}
  ${w.mainStart([l,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Sc(A,P,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${l}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${a?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${b}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${b}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(u){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${l}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${b}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${b}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(u){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${l}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${v.type.value}(${C}(1.0) / ${C}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${b}(x[offset + i]);
        x[offset + i] = ${v.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${a?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${v.type.value}(${C}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${l};${g};${u}`,inputDependencies:_},getShaderSource:I,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:o,z:e*n},programUniforms:h})}},J3=(r,e,n,t,o,i,a,s,u)=>{let l=a+i.kvSequenceLength,d=[i.batchSize,i.numHeads,i.sequenceLength,l],p=r>1&&t,h=i.kvNumHeads?i.kvNumHeads:i.numHeads,g=p?[i.batchSize,h,l,i.headSize]:void 0,b=i.nReps?i.nReps:1,_=i.scale===0?1/Math.sqrt(i.headSize):i.scale,I=Pe(i.headSize),w=i.headSize/I,v=12,$={x:Math.ceil(l/v),y:Math.ceil(i.sequenceLength/v),z:i.batchSize*i.numHeads},A=[{type:12,data:i.sequenceLength},{type:12,data:w},{type:12,data:l},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:1,data:_},{type:12,data:a},{type:12,data:i.kvSequenceLength},{type:12,data:b}],P=p&&t&&D.size(t.dims)>0,C=["type","type"];P&&C.push("type"),o&&C.push("type"),s&&C.push("type"),u&&C.push("type");let R=[{dims:d,dataType:e.dataType,gpuDataType:0}];p&&R.push({dims:g,dataType:e.dataType,gpuDataType:0});let x=B=>{let G=L("q",e.dataType,e.dims,I),Y=L("key",n.dataType,n.dims,I),J=[G,Y];if(P){let de=L("past_key",t.dataType,t.dims,I);J.push(de)}o&&J.push(L("attention_bias",o.dataType,o.dims));let ie=s?L("seq_lens",s.dataType,s.dims):void 0;ie&&J.push(ie);let z=u?L("total_sequence_length_input",u.dataType,u.dims):void 0;z&&J.push(z);let U=V("output",e.dataType,d),te=[U];p&&te.push(V("present_key",e.dataType,g,I));let oe=ut(1,I),ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${v}u;

  var<workgroup> tileQ: array<${G.type.storage}, ${v*v}>;
  var<workgroup> tileK: array<${G.type.storage}, ${v*v}>;
  ${B.registerUniforms(ee).declareVariables(...J,...te)}
  ${B.mainStart([v,v,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${b===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${b===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Sc(ie,z,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${P&&p?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${p?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${oe}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${P&&p?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${p?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${oe}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(I){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${I}`)}})()};
        output[outputIdx] = ${U.type.value} (sum * uniforms.alpha) + ${o?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${I};${o!==void 0};${t!==void 0};${r}`,inputDependencies:C},getRunData:()=>({outputs:R,dispatchGroup:$,programUniforms:A}),getShaderSource:x}},Q3=(r,e,n,t,o,i,a=void 0,s=void 0)=>{let u=i+o.kvSequenceLength,l=o.nReps?o.nReps:1,d=o.vHiddenSize*l,p=r>1&&t,h=o.kvNumHeads?o.kvNumHeads:o.numHeads,g=p?[o.batchSize,h,u,o.headSize]:void 0,b=[o.batchSize,o.sequenceLength,d],_=12,I={x:Math.ceil(o.vHeadSize/_),y:Math.ceil(o.sequenceLength/_),z:o.batchSize*o.numHeads},w=[{type:12,data:o.sequenceLength},{type:12,data:u},{type:12,data:o.vHeadSize},{type:12,data:o.numHeads},{type:12,data:o.headSize},{type:12,data:d},{type:12,data:i},{type:12,data:o.kvSequenceLength},{type:12,data:l}],v=p&&t&&D.size(t.dims)>0,$=["type","type"];v&&$.push("type"),a&&$.push("type"),s&&$.push("type");let A=[{dims:b,dataType:e.dataType,gpuDataType:0}];p&&A.push({dims:g,dataType:e.dataType,gpuDataType:0});let P=C=>{let R=L("probs",e.dataType,e.dims),x=L("v",n.dataType,n.dims),B=[R,x];v&&B.push(L("past_value",t.dataType,t.dims));let G=a?L("seq_lens",a.dataType,a.dims):void 0;a&&B.push(G);let Y=s?L("total_sequence_length_input",s.dataType,s.dims):void 0;s&&B.push(Y);let ie=[V("output",e.dataType,b)];p&&ie.push(V("present_value",e.dataType,g));let z=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;
  var<workgroup> tileQ: array<${R.type.value}, ${_*_}>;
  var<workgroup> tileV: array<${R.type.value}, ${_*_}>;
  ${C.registerUniforms(z).declareVariables(...B,...ie)}
  ${C.mainStart([_,_,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${l===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${l===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Sc(G,Y,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${v&&p?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${p?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${R.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${v&&p?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${p?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${t!==void 0};${r}`,inputDependencies:$},getRunData:()=>({outputs:A,dispatchGroup:I,programUniforms:w}),getShaderSource:P}},lo=(r,e,n,t,o,i,a,s,u,l,d=void 0,p=void 0)=>{let h=Math.min(r.outputCount,1+(a?1:0)+(s?1:0)),g=h>1?l.pastSequenceLength:0,b=g+l.kvSequenceLength,_=u&&D.size(u.dims)>0?u:void 0,I=[e,n];h>1&&a&&D.size(a.dims)>0&&I.push(a),_&&I.push(_),d&&I.push(d),p&&I.push(p);let w=r.compute(J3(h,e,n,a,_,l,g,d,p),{inputs:I,outputs:h>1?[-1,1]:[-1]})[0];r.compute(Z3(w,l.batchSize,l.numHeads,g,l.sequenceLength,b,d,p),{inputs:d&&p?[w,d,p]:[w],outputs:[]});let v=[w,t];h>1&&s&&D.size(s.dims)>0&&v.push(s),d&&v.push(d),p&&v.push(p),r.compute(Q3(h,w,t,s,l,g,d,p),{inputs:v,outputs:h>1?[0,2]:[0]})},Y3=(r,e)=>{let n=[e.batchSize,e.numHeads,e.sequenceLength,e.headSize],t=e.sequenceLength,o=e.inputHiddenSize,i=e.headSize,a=12,s={x:Math.ceil(e.headSize/a),y:Math.ceil(e.sequenceLength/a),z:e.batchSize*e.numHeads},u=[r.inputs[0],r.inputs[1],r.inputs[2]],l=[{type:12,data:t},{type:12,data:o},{type:12,data:i},{type:12,data:e.numHeads},{type:12,data:e.headSize},{type:12,data:e.hiddenSize},{type:12,data:e.hiddenSize+e.hiddenSize+e.vHiddenSize}],d=p=>{let h=V("output_q",u[0].dataType,n),g=V("output_k",u[0].dataType,n),b=V("output_v",u[0].dataType,n),_=L("input",u[0].dataType,u[0].dims),I=L("weight",u[1].dataType,u[1].dims),w=L("bias",u[2].dataType,u[2].dims),v=_.type.storage,$=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${a}u;
  var<workgroup> tileInput: array<${v}, ${a*a}>;
  var<workgroup> tileWeightQ: array<${v}, ${a*a}>;
  var<workgroup> tileWeightK: array<${v}, ${a*a}>;
  var<workgroup> tileWeightV: array<${v}, ${a*a}>;
  ${p.registerUniforms($).declareVariables(_,I,w,h,g,b)}
  ${p.mainStart([a,a,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${v}(0);
    var valueK = ${v}(0);
    var valueV = ${v}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return r.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:r.inputs[0].dataType,gpuDataType:0}],dispatchGroup:s,programUniforms:l}),getShaderSource:d},{inputs:u,outputs:[-1,-1,-1]})},i0=(r,e)=>{let n=X3(r.inputs,e),[t,o,i]=Y3(r,n);return lo(r,t,o,i,r.inputs[4],void 0,void 0,void 0,r.inputs[5],n)}});var eE,tE,nE,a0,s0=N(()=>{"use strict";ft();ue();pe();Qe();he();eE=(r,e)=>{if(!r||r.length!==5)throw new Error("BatchNormalization requires 5 inputs");let n=(t,o,i)=>{let a=o.length;if(a!==t.length)throw new Error(`${i}: num dimensions != ${a}`);o.forEach((s,u)=>{if(s!==t[u])throw new Error(`${i}: dim[${u}] do not match`)})};if(r[0].dims.length>1){let t=e.format==="NHWC"?e.spatial?r[0].dims.slice(-1):r[0].dims.slice(-1).concat(r[0].dims.slice(1,r[0].dims.length-1)):r[0].dims.slice(1,e.spatial?2:void 0);n(r[1].dims,t,"Invalid input scale"),n(r[2].dims,t,"Invalid input B"),n(r[3].dims,t,"Invalid input mean"),n(r[4].dims,t,"Invalid input var")}else n(r[1].dims,[1],"Invalid input scale"),n(r[2].dims,[1],"Invalid input B"),n(r[3].dims,[1],"Invalid input mean"),n(r[4].dims,[1],"Invalid input var")},tE=(r,e)=>{let{epsilon:n,spatial:t,format:o}=e,i=r[0].dims,a=t?Pe(i[i.length-1]):1,s=o==="NHWC"&&i.length>1?a:1,u=D.size(i)/a,l=t,d=l?i.length:i,p=L("x",r[0].dataType,r[0].dims,a),h=L("scale",r[1].dataType,r[1].dims,s),g=L("bias",r[2].dataType,r[2].dims,s),b=L("inputMean",r[3].dataType,r[3].dims,s),_=L("inputVar",r[4].dataType,r[4].dims,s),I=V("y",r[0].dataType,d,a),w=()=>{let $="";if(t)$=`let cOffset = ${i.length===1?"0u":o==="NHWC"?`outputIndices[${i.length-1}] / ${a}`:"outputIndices[1]"};`;else if(o==="NCHW")$=`
            ${I.indicesSet("outputIndices","0","0")}
            let cOffset = ${I.indicesToOffset("outputIndices")};`;else{$=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${i.length-1}];`;for(let A=1;A<h.rank;A++)$+=`cIndices[${A}] = outputIndices[${A}];`;$+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return $},v=$=>`
  const epsilon = ${n};
  ${$.registerUniform("outputSize","u32").declareVariables(p,h,g,b,_,I)}
  ${$.mainStart()}
  ${$.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${I.offsetToIndices(`global_idx * ${a}`)};
    ${w()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${b.getByOffset("cOffset")};
    let inputVar = ${_.getByOffset("cOffset")};
    let x = ${p.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${I.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${e.epsilon}_${e.format}_${t}_${a}`,inputDependencies:l?["rank","type","type","type","type"]:void 0},getShaderSource:v,getRunData:()=>({outputs:[{dims:r[0].dims,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l?[{type:12,data:u},...W(i)]:[{type:12,data:u}]})}},nE=r=>le(r),a0=(r,e)=>{let{inputs:n,outputCount:t}=r,o=nE({...e,outputCount:t});if(ce.webgpu.validateInputContent&&eE(n,o),e.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");r.compute(tE(n,o))}});var rE,oE,u0,l0=N(()=>{"use strict";pe();he();rE=r=>{if(r[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(r[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(r[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(r[0].dims[2]!==r[1].dims[0])throw new Error("last dimension of input and bias are not the same")},oE=r=>{let e=r[0].dims,n=r[0].dims[2],t=D.size(e)/4,o=r[0].dataType,i=L("input",o,e,4),a=L("bias",o,[n],4),s=L("residual",o,e,4),u=V("output",o,e,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:e,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(t/64)}}),getShaderSource:d=>`
  const channels = ${n}u / 4;
  ${d.declareVariables(i,a,s,u)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(t)}
    let value = ${i.getByOffset("global_idx")}
      + ${a.getByOffset("global_idx % channels")} + ${s.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},u0=r=>{rE(r.inputs),r.compute(oE(r.inputs))}});var iE,ke,c0,d0,p0,f0,h0,m0,g0,b0,y0,aE,_0,w0,v0,x0,Uo,T0,Ga,I0,S0,$0,A0,O0,P0,E0,C0,D0,k0,N0,L0,R0,z0,M0,B0,F0,V0,$c,Ac,G0,U0,W0,sE,uE,H0,Ua=N(()=>{"use strict";ue();pe();Qe();he();iE=(r,e,n,t,o,i,a)=>{let s=Math.ceil(e/4),u="";typeof o=="string"?u=`${o}(a)`:u=o("a");let l=L("inputData",n,[s],4),d=V("outputData",t,[s],4),p=[{name:"vec_size",type:"u32"}];return a&&p.push(...a),`
      ${r.registerUniforms(p).declareVariables(l,d)}

  ${i??""}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${l.getByOffset("global_idx")};
    ${d.setByOffset("global_idx",u)}
  }`},ke=(r,e,n,t,o,i=r.dataType,a,s)=>{let u=[{type:12,data:Math.ceil(D.size(r.dims)/4)}];return a&&u.push(...a),{name:e,shaderCache:{hint:o,inputDependencies:["type"]},getShaderSource:l=>iE(l,D.size(r.dims),r.dataType,i,n,t,s),getRunData:l=>({outputs:[{dims:r.dims,dataType:i}],dispatchGroup:{x:Math.ceil(D.size(l[0].dims)/64/4)},programUniforms:u})}},c0=r=>{r.compute(ke(r.inputs[0],"Abs","abs"))},d0=r=>{r.compute(ke(r.inputs[0],"Acos","acos"))},p0=r=>{r.compute(ke(r.inputs[0],"Acosh","acosh"))},f0=r=>{r.compute(ke(r.inputs[0],"Asin","asin"))},h0=r=>{r.compute(ke(r.inputs[0],"Asinh","asinh"))},m0=r=>{r.compute(ke(r.inputs[0],"Atan","atan"))},g0=r=>{r.compute(ke(r.inputs[0],"Atanh","atanh"))},b0=r=>le(r),y0=(r,e)=>{let n;switch(e.to){case 10:n="vec4<f16>";break;case 1:n="vec4<f32>";break;case 12:n="vec4<u32>";break;case 6:n="vec4<i32>";break;case 9:n="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${e.to}`)}r.compute(ke(r.inputs[0],"Cast",n,void 0,e.cacheKey,e.to))},aE=r=>{let e,n,t=r.length>=2&&r[1].data!==0,o=r.length>=3&&r[2].data!==0;switch(r[0].dataType){case 1:e=t?r[1].getFloat32Array()[0]:-34028234663852886e22,n=o?r[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:e=t?r[1].getUint16Array()[0]:64511,n=o?r[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return le({min:e,max:n})},_0=(r,e)=>{let n=e||aE(r.inputs),t=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"Clip",o=>`clamp(${o}, vec4<${t}>(uniforms.min), vec4<${t}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:r.inputs[0].dataType,data:n.min},{type:r.inputs[0].dataType,data:n.max}],[{name:"min",type:t},{name:"max",type:t}]),{inputs:[0]})},w0=r=>{r.compute(ke(r.inputs[0],"Ceil","ceil"))},v0=r=>{r.compute(ke(r.inputs[0],"Cos","cos"))},x0=r=>{r.compute(ke(r.inputs[0],"Cosh","cosh"))},Uo=r=>le(r),T0=(r,e)=>{let n=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"Elu",t=>`elu_vf32(${t})`,`
  const elu_alpha_ = ${n}(${e.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,e.cacheKey))},Ga=(r="f32")=>`
const r0: ${r} = 0.3275911;
const r1: ${r} = 0.254829592;
const r2: ${r} = -0.284496736;
const r3: ${r} = 1.421413741;
const r4: ${r} = -1.453152027;
const r5: ${r} = 1.061405429;

fn erf_vf32(v: vec4<${r}>) -> vec4<${r}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,I0=r=>{let e=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"Erf",n=>`erf_vf32(${n})`,Ga(e)))},S0=r=>{r.compute(ke(r.inputs[0],"Exp","exp"))},$0=r=>{r.compute(ke(r.inputs[0],"Floor","floor"))},A0=r=>{let e=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"Gelu",n=>`0.5 * ${n} * (1.0 + erf_vf32(${n} * 0.7071067811865475))`,Ga(e)))},O0=(r,e)=>{let n=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"LeakyRelu",t=>`select(leaky_relu_alpha_ * ${t}, ${t}, ${t} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${e.alpha});`,e.cacheKey))},P0=r=>{r.compute(ke(r.inputs[0],"Not",e=>`!${e}`))},E0=r=>{r.compute(ke(r.inputs[0],"Neg",e=>`-${e}`))},C0=r=>{r.compute(ke(r.inputs[0],"Reciprocal",e=>`1.0/${e}`))},D0=r=>{let e=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"Relu",n=>`select(vec4<${e}>(0.0), ${n}, ${n} > vec4<${e}>(0.0))`))},k0=r=>{r.compute(ke(r.inputs[0],"Sigmoid",e=>`(1.0 / (1.0 + exp(-${e})))`))},N0=r=>le(r),L0=(r,e)=>{let n=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"HardSigmoid",t=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${e.alpha} * ${t} + vec4<${n}>(${e.beta})))`,void 0,e.cacheKey))},R0=r=>{r.compute(ke(r.inputs[0],"Sin","sin"))},z0=r=>{r.compute(ke(r.inputs[0],"Sinh","sinh"))},M0=r=>{r.compute(ke(r.inputs[0],"Sqrt","sqrt"))},B0=r=>{r.compute(ke(r.inputs[0],"Tan","tan"))},F0=r=>`sign(${r}) * (1 - exp(-2 * abs(${r}))) / (1 + exp(-2 * abs(${r})))`,V0=r=>{r.compute(ke(r.inputs[0],"Tanh",F0))},$c=(r="f32")=>`
const fast_gelu_a: ${r} = 0.5;
const fast_gelu_b: ${r} = 0.7978845608028654;
const fast_gelu_c: ${r} = 0.035677408136300125;

fn tanh_v(v: vec4<${r}>) -> vec4<${r}> {
  return ${F0("v")};
}
`,Ac=r=>`(fast_gelu_a + fast_gelu_a * tanh_v(${r} * (fast_gelu_c * ${r} * ${r} + fast_gelu_b))) * ${r}`,G0=r=>{let e=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"FastGelu",Ac,$c(e),void 0,r.inputs[0].dataType))},U0=(r,e)=>{let n=ut(r.inputs[0].dataType);return r.compute(ke(r.inputs[0],"ThresholdedRelu",t=>`select(vec4<${n}>(0.0), ${t}, ${t} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${e.alpha});`,e.cacheKey)),0},W0=r=>{r.compute(ke(r.inputs[0],"Log","log"))},sE=(r,e)=>`
const alpha = vec4<${r}>(${e});
const one = ${r}(1.0);
const zero = ${r}(0.0);

fn quick_gelu_impl(x: vec4<${r}>) -> vec4<${r}> {
  let v = x *alpha;
  var x1 : vec4<${r}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,uE=r=>`quick_gelu_impl(${r})`,H0=(r,e)=>{let n=ut(r.inputs[0].dataType);r.compute(ke(r.inputs[0],"QuickGelu",uE,sE(n,e.alpha),e.cacheKey,r.inputs[0].dataType))}});var lE,cE,j0,K0=N(()=>{"use strict";pe();he();Ua();lE=r=>{if(r[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(r[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(r[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(r[0].dims[2]!==r[1].dims[0])throw new Error("last dimension of input and bias are not the same")},cE=r=>{let e=r[0].dims.slice();e[2]=e[2]/2;let n=L("input",r[0].dataType,r[0].dims,4),t=L("bias",r[0].dataType,[r[0].dims[2]],4),o=V("output",r[0].dataType,e,4),i=D.size(e)/4,a=Fe(r[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:e,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${r[0].dims[2]/4/2}u;

  ${u.declareVariables(n,t,o)}

  ${Ga(a)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},j0=r=>{lE(r.inputs),r.compute(cE(r.inputs))}});var dE,pE,Kn,X0,Z0,J0,Q0,Y0,ew,tw,nw,rw,ow,iw=N(()=>{"use strict";ue();pe();he();dE=(r,e,n,t,o,i,a,s,u,l,d,p)=>{let h,g;typeof s=="string"?h=g=(v,$)=>`${s}((${v}),(${$}))`:typeof s=="function"?h=g=s:(h=s.scalar,g=s.vector);let b=V("outputData",d,t.length,4),_=L("aData",u,e.length,4),I=L("bData",l,n.length,4),w;if(o)if(i){let v=D.size(e)===1,$=D.size(n)===1,A=e.length>0&&e[e.length-1]%4===0,P=n.length>0&&n[n.length-1]%4===0;v||$?w=b.setByOffset("global_idx",g(v?`${_.type.value}(${_.getByOffset("0")}.x)`:_.getByOffset("global_idx"),$?`${I.type.value}(${I.getByOffset("0")}.x)`:I.getByOffset("global_idx"))):w=`
            let outputIndices = ${b.offsetToIndices("global_idx * 4u")};
            let offsetA = ${_.broadcastedIndicesToOffset("outputIndices",b)};
            let offsetB = ${I.broadcastedIndicesToOffset("outputIndices",b)};
            ${b.setByOffset("global_idx",g(a||A?_.getByOffset("offsetA / 4u"):`${_.type.value}(${_.getByOffset("offsetA / 4u")}[offsetA % 4u])`,a||P?I.getByOffset("offsetB / 4u"):`${I.type.value}(${I.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else w=b.setByOffset("global_idx",g(_.getByOffset("global_idx"),I.getByOffset("global_idx")));else{if(!i)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let v=($,A,P="")=>{let C=`aData[indexA${A}][componentA${A}]`,R=`bData[indexB${A}][componentB${A}]`;return`
            let outputIndices${A} = ${b.offsetToIndices(`global_idx * 4u + ${A}u`)};
            let offsetA${A} = ${_.broadcastedIndicesToOffset(`outputIndices${A}`,b)};
            let offsetB${A} = ${I.broadcastedIndicesToOffset(`outputIndices${A}`,b)};
            let indexA${A} = offsetA${A} / 4u;
            let indexB${A} = offsetB${A} / 4u;
            let componentA${A} = offsetA${A} % 4u;
            let componentB${A} = offsetB${A} % 4u;
            ${$}[${A}] = ${P}(${h(C,R)});
          `};d===9?w=`
            var data = vec4<u32>(0);
            ${v("data",0,"u32")}
            ${v("data",1,"u32")}
            ${v("data",2,"u32")}
            ${v("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:w=`
            ${v("outputData[global_idx]",0)}
            ${v("outputData[global_idx]",1)}
            ${v("outputData[global_idx]",2)}
            ${v("outputData[global_idx]",3)}
          `}return`
        ${r.registerUniform("vec_size","u32").declareVariables(_,I,b)}

        ${p??""}

        ${r.mainStart()}
        ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${w}
      }`},pE=(r,e,n,t,o,i,a=n.dataType)=>{let s=n.dims.map(Number),u=t.dims.map(Number),l=!D.areEqual(s,u),d=s,p=D.size(s),h=!1,g=!1,b=[l];if(l){let _=Un.calcShape(s,u,!1);if(!_)throw new Error("Can't perform binary op on the given tensors");d=_.slice(),p=D.size(d);let I=D.size(s)===1,w=D.size(u)===1,v=s.length>0&&s[s.length-1]%4===0,$=u.length>0&&u[u.length-1]%4===0;b.push(I),b.push(w),b.push(v),b.push($);let A=1;for(let P=1;P<d.length;P++){let C=s[s.length-P],R=u[u.length-P];if(C===R)A*=C;else break}A%4===0?(g=!0,h=!0):(I||w||v||$)&&(h=!0)}else h=!0;return b.push(h),{name:r,shaderCache:{hint:e+b.map(_=>_.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:_=>dE(_,s,u,d,h,l,g,o,n.dataType,t.dataType,a,i),getRunData:()=>({outputs:[{dims:d,dataType:a}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:Math.ceil(D.size(d)/4)},...W(s,u,d)]})}},Kn=(r,e,n,t,o,i)=>{r.compute(pE(e,o??"",r.inputs[0],r.inputs[1],n,t,i))},X0=r=>{Kn(r,"Add",(e,n)=>`${e}+${n}`)},Z0=r=>{Kn(r,"Div",(e,n)=>`${e}/${n}`)},J0=r=>{Kn(r,"Equal",{scalar:(e,n)=>`u32(${e}==${n})`,vector:(e,n)=>`vec4<u32>(${e}==${n})`},void 0,void 0,9)},Q0=r=>{Kn(r,"Mul",(e,n)=>`${e}*${n}`)},Y0=r=>{let e=L("input",r.inputs[0].dataType,r.inputs[0].dims).type.value;Kn(r,"Pow",{scalar:(t,o)=>`pow_custom(${t},${o})`,vector:(t,o)=>`pow_vector_custom(${t},${o})`},`
    fn pow_custom(a : ${e}, b : ${e}) -> ${e} {
      if (b == ${e}(0.0)) {
        return ${e}(1.0);
      } else if (a < ${e}(0.0) && f32(b) != floor(f32(b))) {
        return ${e}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${e}(1.0), round(f32(abs(b) % ${e}(2.0))) != 1.0) * ${e}(${e==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${e}>, b : vec4<${e}>) -> vec4<${e}> {
      // TODO: implement vectorized pow
      return vec4<${e}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},ew=r=>{Kn(r,"Sub",(e,n)=>`${e}-${n}`)},tw=r=>{Kn(r,"Greater",{scalar:(e,n)=>`u32(${e}>${n})`,vector:(e,n)=>`vec4<u32>(${e}>${n})`},void 0,void 0,9)},nw=r=>{Kn(r,"Less",{scalar:(e,n)=>`u32(${e}<${n})`,vector:(e,n)=>`vec4<u32>(${e}<${n})`},void 0,void 0,9)},rw=r=>{Kn(r,"GreaterOrEqual",{scalar:(e,n)=>`u32(${e}>=${n})`,vector:(e,n)=>`vec4<u32>(${e}>=${n})`},void 0,void 0,9)},ow=r=>{Kn(r,"LessOrEqual",{scalar:(e,n)=>`u32(${e}<=${n})`,vector:(e,n)=>`vec4<u32>(${e}<=${n})`},void 0,void 0,9)}});var hE,mE,gE,bE,aw,sw,uw=N(()=>{"use strict";ue();pe();Qe();he();hE=(r,e)=>{if(!r||r.length<1)throw new Error("too few inputs");let n=0,t=r[n],o=t.dataType,i=t.dims.length;r.forEach((a,s)=>{if(s!==n){if(a.dataType!==o)throw new Error("input tensors should be one type");if(a.dims.length!==i)throw new Error("input tensors should have the same shape");a.dims.forEach((u,l)=>{if(l!==e&&u!==t.dims[l])throw new Error("non concat dimensions must match")})}})},mE=(r,e)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${r}u>(${e});
    for (var i: u32 = 0u; i < ${r}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${r}u;
  }`,gE=(r,e)=>{let n=r.length,t=[];for(let o=0;o<n;++o){let i=e.setByOffset("global_idx",r[o].getByIndices("indices"));n===1?t.push(i):o===0?t.push(`if (inputIndex == ${o}u) { ${i} }`):o===n-1?t.push(`else { ${i} }`):t.push(`else if (inputIndex == ${o}) { ${i} }`)}return t.join(`
`)},bE=(r,e,n,t)=>{let o=D.size(n),i=new Array(r.length),a=new Array(r.length),s=0,u=[],l=[],d=[{type:12,data:o}];for(let _=0;_<r.length;++_)s+=r[_].dims[e],i[_]=s,l.push(r[_].dims.length),a[_]=L(`input${_}`,t,l[_]),u.push("rank"),d.push({type:12,data:i[_]});for(let _=0;_<r.length;++_)d.push(...W(r[_].dims));d.push(...W(n));let p=V("output",t,n.length),h=p.indicesGet("indices",e),g=Array.from(Array(i.length).keys()).map(_=>`uniforms.sizeInConcatAxis${_}`).join(","),b=_=>`

  ${(()=>{_.registerUniform("outputSize","u32");for(let I=0;I<r.length;I++)_.registerUniform(`sizeInConcatAxis${I}`,"u32");return _.declareVariables(...a,p)})()}

  ${mE(i.length,g)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${p.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${i.length}u>(${g});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${gE(a,p)}
  }`;return{name:"Concat",shaderCache:{hint:`${e}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:n,dataType:t}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:d}),getShaderSource:b}},aw=(r,e)=>{let n=r.inputs,t=n[0].dims,o=D.normalizeAxis(e.axis,t.length);hE(n,o);let i=t.slice();i[o]=n.reduce((s,u)=>s+(u.dims.length>o?u.dims[o]:0),0);let a=n.filter(s=>D.size(s.dims)>0);r.compute(bE(a,o,i,n[0].dataType),{inputs:a})},sw=r=>le({axis:r.axis})});var Jt,Qt,Yt,Wa,wr=N(()=>{"use strict";ue();pe();Jt=(r,e,n="f32")=>{switch(r.activation){case"Relu":return`value = max(value, ${e}(0.0));`;case"Sigmoid":return`value = (${e}(1.0) / (${e}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${e}(${n}(uniforms.clip_min)), ${e}(${n}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${e}(0.0), min(${e}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${n}(uniforms.alpha) * value, value, value >= ${e}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${r.activation}`)}},Qt=(r,e)=>{r.activation==="Clip"?e.push({type:1,data:r.clipMax},{type:1,data:r.clipMin}):r.activation==="HardSigmoid"?e.push({type:1,data:r.alpha},{type:1,data:r.beta}):r.activation==="LeakyRelu"&&e.push({type:1,data:r.alpha})},Yt=(r,e)=>{r.activation==="Clip"?e.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):r.activation==="HardSigmoid"?e.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):r.activation==="LeakyRelu"&&e.push({name:"alpha",type:"f32"})},Wa=r=>{let e=r?.activation||"";if(e==="HardSigmoid"){let[n,t]=r?.activation_params||[.2,.5];return{activation:e,alpha:n,beta:t}}else if(e==="Clip"){let[n,t]=r?.activation_params||[m_,g_];return{activation:e,clipMax:t,clipMin:n}}else if(e==="LeakyRelu"){let[n]=r?.activation_params||[.01];return{activation:e,alpha:n}}return{activation:e}}});var it,lw,Ha=N(()=>{"use strict";it=(r,e)=>{switch(r){case 1:return e;case 2:return`vec2<${e}>`;case 3:return`vec3<${e}>`;case 4:return`vec4<${e}>`;default:throw new Error(`${r}-component is not supported.`)}},lw=r=>`
      ${r?"value = value + getBiasByOutputCoords(coords);":""}
      `});var cw,dw=N(()=>{"use strict";cw=r=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${r}.x), i32(${r}.y), i32(${r}.z), 1));
}
`});var Wo,qa,ja=N(()=>{"use strict";ue();pe();he();wr();Wo=(r,e,n,t,o)=>{let i=t-n;return`
      ${Array.from({length:n}).map((a,s)=>`
      if (${Q(e.shape,s,e.rank)} != 1) {
        ${e.indicesSet(r,s,Q(o,s+i,t))}
      } else {
        ${e.indicesSet(r,s,0)}
      }`).join("")}
`},qa=(r,e,n,t,o=!1,i)=>{let a=r[0].dims,s=r[1].dims,u=a[a.length-2],l=s[s.length-1],d=a[a.length-1],p=Pe(l),h=Pe(d),g=Pe(u),b=D.size(n)/p/g,_=r.length>2,I=t?t.slice(0,-2):n.slice(0,-2),v=[D.size(I),u,l],$=[{type:12,data:b},{type:12,data:u},{type:12,data:l},{type:12,data:d}];Qt(e,$),$.push(...W(I,a,s)),_&&$.push(...W(r[2].dims)),$.push(...W(v));let A=P=>{let C=Ma("batch_dims",r[0].dataType,I.length),R=L("a",r[0].dataType,a.length,h),x=L("b",r[1].dataType,s.length,p),B=V("output",r[0].dataType,v.length,p),G=Fe(B.type.tensor),Y=Jt(e,B.type.value,G),J=[R,x],ie="";if(_){let te=o?p:1;J.push(L("bias",r[2].dataType,r[2].dims.length,te)),ie=`${o?`value += bias[col / ${te}];`:`value += ${B.type.value}(bias[row + i]);`}`}let z=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Yt(e,z);let U=()=>{let te=`var a_data: ${R.type.value};`;for(let oe=0;oe<h;oe++)te+=`
              let b_data${oe} = b[(b_offset + (k + ${oe}) * uniforms.N + col) / ${p}];`;for(let oe=0;oe<g;oe++){te+=`a_data = a[(a_offset + (row + ${oe}) * uniforms.K + k) / ${h}];`;for(let ee=0;ee<h;ee++)te+=`
            values[${oe}] = fma(${x.type.value}(a_data${h===1?"":`[${ee}]`}), b_data${ee}, values[${oe}]);
`}return te};return`
  ${P.registerUniforms(z).registerInternalVariables(C).declareVariables(...J,B)}
  ${P.mainStart()}
    ${P.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${p})) * ${p};
    var index1 = global_idx / (uniforms.N / ${p});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${n.length===2?"":`let batch_indices = ${C.offsetToIndices("batch")};`}

    var a_indices: ${R.type.indices};
    ${Wo("a_indices",R,R.rank-2,C.rank,"batch_indices")}
    ${R.indicesSet("a_indices",R.rank-2,0)}
    ${R.indicesSet("a_indices",R.rank-1,0)}
    let a_offset = ${R.indicesToOffset("a_indices")};

    var b_indices: ${x.type.indices};
    ${Wo("b_indices",x,x.rank-2,C.rank,"batch_indices")}
    ${x.indicesSet("b_indices",x.rank-2,0)}
    ${x.indicesSet("b_indices",x.rank-1,0)}
    let b_offset = ${x.indicesToOffset("b_indices")};
    var values: array<${B.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${U()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${ie}
      ${Y}
      let cur_indices = ${B.type.indices}(batch, row + i, col);
      let offset = ${B.indicesToOffset("cur_indices")};
      ${B.setByOffset(`offset / ${p}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${e.activation};${p};${h};${g};${o}`,inputDependencies:_?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(n):n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:$}),getShaderSource:A}}});var yE,_E,Oc,pw,wE,Pc,vE,Ho,Ka=N(()=>{"use strict";ue();pe();he();wr();ja();Ha();yE=(r,e)=>r?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${e?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${e?", batchIndices":""});
        `,_E=(r,e)=>r?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${e===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${e===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${e===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Oc=(r,e,n="f32",t,o=!1,i=32,a=!1,s=32)=>{let u=e[1]*r[1],l=e[0]*r[0],d=o?u:i,p=o?i:u,h=d/e[0],g=i/e[1];if(!((o&&h===4&&r[1]===4||!o&&(h===3||h===4))&&d%e[0]===0&&i%e[1]===0&&r[0]===4))throw new Error(`If transposeA ${o} is true, innerElementSize ${h} and workPerThread[1] ${r[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${d} must be divisible by workgroupSize[0]${e[0]}. tileInner ${i} must be divisible by workgroupSize[1] ${e[1]}. colPerThread ${r[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${n}>, ${d/h}>, ${p}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${l/r[0]}>, ${i}>;

const rowPerThread = ${r[1]};
const colPerThread = ${r[0]};
const innerElementSize = ${h};
const tileInner = ${i};

@compute @workgroup_size(${e[0]}, ${e[1]}, ${e[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${a?"0":"i32(globalId.z)"};
  ${t?`let batchIndices = ${t.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${a?`${Math.ceil(s/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${a?`i32(globalId.z) * ${s}`:"0"};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${g};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${yE(o,t)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${t?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${_E(o,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},pw=(r,e)=>r?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${e?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${e?", batchIndices":""});
            `,wE=r=>r?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Pc=(r,e,n="f32",t,o=!1,i=32,a=!1,s=32,u=!1)=>{let l=r[1]*e[1],d=r[0]*e[0],p=o?l:i,h=o?i:l;if(!(h%e[1]===0&&p%e[0]===0&&i%e[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${e[1]}, tileAWidth ${p} must be divisible by workgroupSize[0]${e[0]}, tileInner ${i} must be divisible by workgroupSize[1]${e[1]}`);let g=h/e[1],b=p/e[0],_=i/e[1],I=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${l};
    let globalColStart = i32(workgroupId.x) * ${d};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${e[1]}) {
        for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${e[0]}) {
          ${pw(o,t)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${i}; inputRow = inputRow + ${e[1]}) {
            for (var inputCol = localCol; inputCol < ${d}; inputCol = inputCol + ${e[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${t?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${e[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${o?`mm_Asub[k][localRow + innerRow * ${e[1]}];`:`mm_Asub[localRow + innerRow * ${e[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${e[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${e[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${l};

let tileRowA = i32(localId.y) * ${g};
let tileColA = i32(localId.x) * ${b};
let tileRowB = i32(localId.y) * ${_};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${b}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${pw(o,t)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${t?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${wE(o)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${p}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${d}>, ${i}>;
  const rowPerThread = ${r[1]};
  const colPerThread = ${r[0]};
  const tileInner = ${i};

@compute @workgroup_size(${e[0]}, ${e[1]}, ${e[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${a?"0":"i32(globalId.z)"};
    ${t?`let batchIndices = ${t.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${a?`${Math.ceil(s/i)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${a?`i32(globalId.z) * ${s}`:"0"};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${I}
  }
`},vE=(r,e,n,t,o=!1)=>{let[i,a,s,u]=t,l=Fe(t[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${it(r,l)} {
      var value = ${it(r,l)}(0.0);
      let col = colIn * ${r};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${a.type.indices};
        ${Wo("aIndices",a,a.rank-2,i.rank,"batchIndices")}
        ${a.indicesSet("aIndices",a.rank-2,"u32(row)")}
        ${a.indicesSet("aIndices",a.rank-1,"u32(colIn)")}
        value = ${a.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${i.type.indices}) -> ${it(r,l)} {
      var value = ${it(r,l)}(0.0);
      let col = colIn * ${r};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${s.type.indices};
        ${Wo("bIndices",s,s.rank-2,i.rank,"batchIndices")}
        ${s.indicesSet("bIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("bIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${it(r,l)}) {
      let col = colIn * ${r};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${e?`value = value + ${o?"bias[colIn]":`${it(r,l)}(bias[row])`};`:""}
        ${n}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Ho=(r,e,n,t,o=!1,i)=>{let a=r[0].dims,s=r[1].dims,u=a.slice(0,-2),l=s.slice(0,-2),d=t?t.slice(0,-2):n.slice(0,-2),p=D.size(d),h=a[a.length-2],g=a[a.length-1],b=s[s.length-1],_=g%4===0&&b%4===0,I=h<=8?[4,1,1]:[4,4,1],w=[8,8,1],v=[Math.ceil(b/w[0]/I[0]),Math.ceil(h/w[1]/I[1]),Math.ceil(p/w[2]/I[2])],$=_?4:1,A=[...u,h,g/$],P=A.length,C=[...l,g,b/$],R=C.length,x=[p,h,b/$],B=[{type:6,data:h},{type:6,data:b},{type:6,data:g}];Qt(e,B),B.push(...W(d,A,C));let G=["rank","rank"],Y=r.length>2;Y&&(B.push(...W(r[2].dims)),G.push("rank")),B.push(...W(x));let J=ie=>{let z=d.length,U=Ma("batchDims",r[0].dataType,z,1),te=Fe(r[0].dataType),oe=L("a",r[0].dataType,P,$),ee=L("b",r[1].dataType,R,$),de=V("result",r[0].dataType,x.length,$),ge=[oe,ee];if(Y){let q=o?$:1;ge.push(L("bias",r[2].dataType,r[2].dims.length,q))}let Ie=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Yt(e,Ie);let mt=Fe(de.type.tensor),Ve=Jt(e,de.type.value,mt),F=vE($,Y,Ve,[U,oe,ee,de],o);return`
  ${ie.registerUniforms(Ie).registerInternalVariables(U).declareVariables(...ge,de)}
  ${F}
  ${_?Oc(I,w,te,U):Pc(I,w,te,U)}
                   `};return{name:"MatMul",shaderCache:{hint:`${I};${e.activation};${_};${o}`,inputDependencies:G},getRunData:()=>({outputs:[{dims:i?i(n):n,dataType:r[0].dataType}],dispatchGroup:{x:v[0],y:v[1],z:v[2]},programUniforms:B}),getShaderSource:J}}});var xE,fw,hw=N(()=>{"use strict";ue();Gn();he();wr();Ha();dw();Ka();xE=(r,e,n,t,o=!1,i,a=4,s=4,u=4,l="f32")=>{let d=G=>{switch(G){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${l}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${G} is not supported.`)}},p=G=>{switch(G){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${G} is not supported.`)}},h=r?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,g=r?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,b=r?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",_=r?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",I=r?"row":"col",w=r?"col":"row",v=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${r?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${I} / outWidth;
    let outCol = ${I} % outWidth;

    let WRow = ${w} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${w} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${w} % inChannels;
    var resData = ${it(a,l)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${b} && xCol >= 0 && xCol < ${_}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${d(a)}
    }
    return resData;`,$=r?e&&t?`
    let col = colIn * ${a};
    ${v}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${v}
    }
    return ${it(a,l)}(0.0);`:t&&n?`
    let col = colIn * ${a};
    ${v}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${v}
    }
    return ${it(a,l)}(0.0);`,A=r?t&&n?p(s):`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${p(s)}
    }
    return ${it(s,l)}(0.0);`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${p(s)}
    }
    return ${it(s,l)}(0.0);`,P=it(u,l),C=r?it(a,l):it(s,l),R=r?it(s,l):it(a,l),x=Jt(i,P,l);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${r?$:A}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${R} {
      ${r?A:$}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${P}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${r?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${g}
      ${lw(o)}
      ${x}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},fw=(r,e,n,t,o,i,a,s,u)=>{let l=e.format==="NHWC",d=l?r[0].dims[3]:r[0].dims[1],p=n[0],h=l?n[2]:n[3],g=l?n[1]:n[2],b=l?n[3]:n[1],_=l&&(d%4===0||d%3===0)&&b%4===0,I=l?b:h*g,w=l?h*g:b,v=[8,8,1],$=t<=8?[4,1,1]:[4,4,1],A=[Math.ceil(I/v[0]/$[0]),Math.ceil(w/v[1]/$[1]),Math.ceil(p/v[2]/$[2])];me("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${A}`);let P=_?l&&d%4!==0?3:4:1,C=v[1]*$[1],R=v[0]*$[0],x=Math.max(v[0]*P,v[1]),B=t%C===0,G=o%R===0,Y=i%x===0,J=_?[P,4,4]:[1,1,1],ie=[{type:6,data:t},{type:6,data:o},{type:6,data:i},{type:6,data:[e.pads[0],e.pads[1]]},{type:6,data:e.strides},{type:6,data:e.dilations}];Qt(e,ie),ie.push(...W(r[0].dims,r[1].dims));let z=["rank","rank"];a&&(ie.push(...W(r[2].dims)),z.push("rank")),ie.push(...W(n));let U=te=>{let oe=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Yt(e,oe);let ee=_?4:1,de=Fe(r[0].dataType),ge=`
      fn setOutputAtIndex(flatIndex : i32, value : ${_?`vec4<${de}>`:de}) {
        result[flatIndex] = ${_?`vec4<${de}>`:de}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${_?`vec4<${de}>`:de}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${_?"/ 4":""}, value);
      }`,Ie=L("x",r[0].dataType,r[0].dims.length,P===3?1:P),mt=L("w",r[1].dataType,r[1].dims.length,ee),Ve=[Ie,mt],F=V("result",r[0].dataType,n.length,ee);if(a){let q=L("bias",r[2].dataType,r[2].dims.length,ee);Ve.push(q),ge+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${_?`vec4<${de}>`:de} {
          return bias[coords.${l?"w":"y"}${_?"/ 4":""}];
        }`}return`
        ${cw("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${te.registerUniforms(oe).declareVariables(...Ve,F)}
        ${ge}
        ${xE(l,B,G,Y,a,e,J[0],J[1],J[2],de)}
        ${_?Oc($,v,de,void 0,!l,x):Pc($,v,de,void 0,!l,x,!1,void 0,s)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${e.cacheKey};${P};${_};${B};${G};${Y};${C};${R};${x}`,inputDependencies:z},getRunData:()=>({outputs:[{dims:u?u(n):n,dataType:r[0].dataType}],dispatchGroup:{x:A[0],y:A[1],z:A[2]},programUniforms:ie}),getShaderSource:U}}});var TE,mw,Xa,IE,gw,SE,bw,yw,_w=N(()=>{"use strict";ue();Gn();pe();he();wr();Ha();TE=r=>{let e=1;for(let n=0;n<r.length;n++)e*=r[n];return e},mw=r=>typeof r=="number"?[r,r,r]:r,Xa=(r,e)=>e<=1?r:r+(r-1)*(e-1),IE=(r,e,n,t=1)=>{let o=Xa(e,t);return Math.floor((r[0]*(n-1)-n+o)/2)},gw=(r,e,n,t,o)=>{o==null&&(o=IE(r,e[0],t[0]));let i=[0,0,0,n];for(let a=0;a<3;a++)r[a]+2*o>=e[a]&&(i[a]=Math.trunc((r[a]-e[a]+2*o)/t[a]+1));return i},SE=(r,e,n,t,o,i,a,s,u,l)=>{let d,p,h,g;if(r==="VALID"&&(r=0),typeof r=="number"){d={top:r,bottom:r,left:r,right:r,front:r,back:r};let b=gw([e,n,t,1],[s,u,l],1,[o,i,a],r);p=b[0],h=b[1],g=b[2]}else if(Array.isArray(r)){if(!r.every((_,I,w)=>_===w[0]))throw Error(`Unsupported padding parameter: ${r}`);d={top:r[0],bottom:r[1],left:r[2],right:r[3],front:r[4],back:r[5]};let b=gw([e,n,t,1],[s,u,l],1,[o,i,a],r[0]);p=b[0],h=b[1],g=b[2]}else if(r==="SAME_UPPER"){p=Math.ceil(e/o),h=Math.ceil(n/i),g=Math.ceil(t/a);let b=(p-1)*o+s-e,_=(h-1)*i+u-n,I=(g-1)*a+l-t,w=Math.floor(b/2),v=b-w,$=Math.floor(_/2),A=_-$,P=Math.floor(I/2),C=I-P;d={top:$,bottom:A,left:P,right:C,front:w,back:v}}else throw Error(`Unknown padding parameter: ${r}`);return{padInfo:d,outDepth:p,outHeight:h,outWidth:g}},bw=(r,e,n,t,o,i=!1,a="channelsLast")=>{let s,u,l,d,p;if(a==="channelsLast")[s,u,l,d,p]=r;else if(a==="channelsFirst")[s,p,u,l,d]=r;else throw new Error(`Unknown dataFormat ${a}`);let[h,,g,b,_]=e,[I,w,v]=mw(n),[$,A,P]=mw(t),C=Xa(g,$),R=Xa(b,A),x=Xa(_,P),{padInfo:B,outDepth:G,outHeight:Y,outWidth:J}=SE(o,u,l,d,I,w,v,C,R,x),ie=i?h*p:h,z=[0,0,0,0,0];return a==="channelsFirst"?z=[s,ie,G,Y,J]:a==="channelsLast"&&(z=[s,G,Y,J,ie]),{batchSize:s,dataFormat:a,inDepth:u,inHeight:l,inWidth:d,inChannels:p,outDepth:G,outHeight:Y,outWidth:J,outChannels:ie,padInfo:B,strideDepth:I,strideHeight:w,strideWidth:v,filterDepth:g,filterHeight:b,filterWidth:_,effectiveFilterDepth:C,effectiveFilterHeight:R,effectiveFilterWidth:x,dilationDepth:$,dilationHeight:A,dilationWidth:P,inShape:r,outShape:z,filterShape:e}},yw=(r,e,n,t,o,i)=>{let a=i==="channelsLast",s=a?r[0].dims[3]:r[0].dims[1],u=!1,l=[64,1,1],d={x:n.map((v,$)=>$)},p=[Math.ceil(TE(d.x.map(v=>n[v]))/l[0]),1,1];me("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let h=u?a&&s%4!==0?3:4:1,g=D.size(n),b=[{type:12,data:g},{type:12,data:t},{type:12,data:o},{type:12,data:e.strides},{type:12,data:e.dilations}];Qt(e,b),b.push(...W(r[0].dims,r[1].dims));let _=["rank","rank"],I=r.length===3;I&&(b.push(...W(r[2].dims)),_.push("rank")),b.push(...W(n));let w=v=>{let $=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:t.length},{name:"pads",type:"u32",length:o.length},{name:"strides",type:"u32",length:e.strides.length},{name:"dilations",type:"u32",length:e.dilations.length}];Yt(e,$);let A=u?4:1,P=Fe(r[0].dataType),C=L("x",r[0].dataType,r[0].dims.length,h===3?1:h),R=L("W",r[1].dataType,r[1].dims.length,A),x=[C,R],B=V("result",r[0].dataType,n.length,A),G="";if(I){let ie=L("bias",r[2].dataType,r[2].dims.length,A);x.push(ie),G+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${P}>`:P} {
          return bias[${a?Q("coords",4,5):Q("coords",1,5)}${u?"/ 4":""}];
        }`}let Y=it(h,P),J=Jt(e,Y,P);return`
            ${G}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${R.getByIndices("aIndices")};
            }
          ${v.registerUniforms($).declareVariables(...x,B)}
          ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${B.offsetToIndices("global_idx")};
              let batch = ${Q("coords",0,C.rank)};
              let d2 = ${a?Q("coords",C.rank-1,C.rank):Q("coords",1,C.rank)};
              let xFRCCorner = vec3<u32>(${a?Q("coords",1,C.rank):Q("coords",2,C.rank)},
              ${a?Q("coords",2,C.rank):Q("coords",3,C.rank)},
              ${a?Q("coords",3,C.rank):Q("coords",4,C.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${a?Q("uniforms.x_shape",1,C.rank):Q("uniforms.x_shape",2,C.rank)};
              let xShapeZ = ${a?Q("uniforms.x_shape",2,C.rank):Q("uniforms.x_shape",3,C.rank)};
              let xShapeW = ${a?Q("uniforms.x_shape",3,C.rank):Q("uniforms.x_shape",4,C.rank)};
              let xShapeU = ${a?Q("uniforms.x_shape",4,C.rank):Q("uniforms.x_shape",1,C.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${a?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${a?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${a?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${a?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${I?"value = value + getBiasByOutputCoords(coords)":""};
              ${J}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${e.cacheKey};${a};${h};${I}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:b}),getShaderSource:w}}});var ww,vw,xw=N(()=>{"use strict";ue();pe();he();wr();ww=(r,e,n,t)=>{let o=r.length>2,i=o?"value += b[output_channel];":"",a=r[0].dims,s=r[1].dims,u=e.format==="NHWC",l=u?n[3]:n[1],d=l/e.group,p=u&&d>=4?Pe(l):1,h=D.size(n)/p,g=[{type:12,data:h},{type:12,data:e.dilations},{type:12,data:[e.strides[0],e.strides[1]]},{type:12,data:[e.pads[0],e.pads[1]]},{type:12,data:d}];Qt(e,g),g.push(...W(a,[s[0],s[1],s[2],s[3]/p]));let b=o?["rank","rank","rank"]:["rank","rank"];g.push(...W([n[0],n[1],n[2],n[3]/p]));let _=I=>{let w=V("output",r[0].dataType,n.length,p),v=Fe(w.type.tensor),$=Jt(e,w.type.value,v),A=L("x",r[0].dataType,a.length),P=L("w",r[1].dataType,s.length,p),C=[A,P];o&&C.push(L("b",r[2].dataType,r[2].dims,p));let R=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:e.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Yt(e,R);let x=u?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${A.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${P.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${A.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${P.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${I.registerUniforms(R).declareVariables(...C,w)}

  ${I.mainStart()}
    ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${w.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${p} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u?2:1}];

    var value: ${w.type.value} = ${w.type.value}(0);
    ${x}
    ${i}
    ${$}
    ${w.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${e.cacheKey}_${p}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:t?t(n):n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:_}},vw=(r,e,n,t)=>{let o=r.length>2,i=Pe(n[3]),a=Pe(n[2]),s=D.size(n)/i/a,u=[r[0].dims[0],r[0].dims[1],r[0].dims[2],r[0].dims[3]/i],l=[r[1].dims[0],r[1].dims[1],r[1].dims[2],r[1].dims[3]/i],d=[n[0],n[1],n[2],n[3]/i],p=[{type:12,data:s},{type:6,data:[e.strides[0],e.strides[1]]},{type:6,data:[e.pads[0],e.pads[1]]}];Qt(e,p),p.push(...W(u,l,d));let h=(a-1)*e.strides[1]+l[1],g=b=>{let _=V("output",r[0].dataType,d.length,i),I=Fe(_.type.tensor),w=Jt(e,_.type.value,I),v=L("x",r[0].dataType,u.length,i),$=L("w",r[1].dataType,l.length,i),A=[v,$];o&&A.push(L("b",r[2].dataType,r[2].dims,i));let P=o?"value += b[output_channel];":"",C=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Yt(e,C),`
  ${b.registerUniforms(C).declareVariables(...A,_)}
  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${a}u;
    let col = (index1 % width1) * ${a}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${v.type.value}, ${h}>;
    var values: array<${_.type.value}, ${a}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${l[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${v.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${v.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${l[1]}; w_width++) {
          let w_val = ${$.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${a}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${a}u; i++) {
      var value = values[i];
      ${P}
      ${w}
      ${_.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${e.cacheKey};${i};${a};${h};${l[0]};${l[1]}`,inputDependencies:o?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:t?t(n):n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:p}),getShaderSource:g}}});var $E,Ec,AE,Cc,Dc,Tw,OE,PE,kc,Iw=N(()=>{"use strict";pe();hw();_w();Ka();xw();wr();ja();Yn();$E=(r,e,n,t,o,i)=>{let a=r[0],s=r.slice(i?1:2,i?3:4),u=s.length,l=e[0],p=e.slice(2).map((b,_)=>b+(b-1)*(n[_]-1)),g=s.map((b,_)=>b+t[_]+t[_+u]).map((b,_)=>Math.floor((b-p[_]+o[_])/o[_]));return g.splice(0,0,a),g.splice(i?3:1,0,l),g},Ec=[2,3,1,0],AE=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length>5)throw new Error("greater than 5D is not supported");if(r[0].dims.length!==r[1].dims.length)throw new Error("filter does not have same dimension as input");let n=r[0].dims[e.format==="NHWC"?r[0].dims.length-1:1],t=r[1].dims[1]*e.group;if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(r.length===3&&(r[2].dims.length!==1||r[1].dims[0]!==r[2].dims[0]))throw new Error("invalid bias");let o=r[0].dims.length-2;if(e.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(e.strides.length!==o)throw new Error(`strides should be ${o}D`);if(e.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape")},Cc=(r,e)=>{let n=r.kernelShape.slice();n.length<e[1].dims.length-2&&n.push(...Array(e[1].dims.length-2-n.length).fill(0));for(let i=2;i<e[1].dims.length;++i)n[i-2]===0&&(n[i-2]=e[1].dims[i]);let t=r.pads.slice();Gr.adjustPadsBasedOnAutoPad(e[0].dims,r.strides,r.dilations,n,t,r.format==="NHWC",r.autoPad);let o=Object.assign({},r);return Object.assign(o,{kernelShape:n,pads:t}),o},Dc=r=>{let e=Wa(r),n=r.format,t=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][r.auto_pad],o=r.dilations,i=r.group,a=r.kernel_shape,s=r.pads,u=r.strides,l=r.w_is_const();return{autoPad:t,format:n,dilations:o,group:i,kernelShape:a,pads:s,strides:u,wIsConst:l,...e,cacheKey:`${r.format};${e.activation};`}},Tw=(r,e,n,t)=>{let o=n.format==="NHWC",i=$E(e[0].dims,e[1].dims,n.dilations,n.pads,n.strides,o);if(n.group!==1){let C=[e[0]];if(o){let x=r.kernelCustomData.wT??r.compute(lt(e[1],Ec),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=x),C.push(x)}else C.push(e[1]);e.length===3&&C.push(e[2]),!r.adapterInfo.isArchitecture("ampere")&&o&&e[1].dims[0]===n.group&&e[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?r.compute(vw(C,n,i,t),{inputs:C}):r.compute(ww(C,n,i,t),{inputs:C});return}let a=e.length===3,s=e[0].dims[o?1:2],u=e[0].dims[o?2:3],l=e[0].dims[o?3:1],d=e[1].dims[2],p=e[1].dims[3],h=i[o?1:2],g=i[o?2:3],b=i[o?3:1],_=o&&d===s&&p===u&&n.pads[0]===0&&n.pads[1]===0;if(_||d===1&&p===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let C=i[0],R,x,B,G=[];if(o){let ie=r.kernelCustomData.wT??r.compute(lt(e[1],Ec),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=ie),_){let z=s*u*l;R=e[0].reshape([1,C,z]),x=ie.reshape([1,z,b]),B=[1,C,b]}else R=e[0].reshape([C,s*u,l]),x=ie.reshape([1,l,b]),B=[C,h*g,b];G.push(R),G.push(x)}else R=e[0].reshape([C,l,s*u]),x=e[1].reshape([1,b,l]),B=[C,b,h*g],G.push(x),G.push(R);a&&G.push(e[2]);let Y=B[2],J=G[0].dims[G[0].dims.length-1];Y<8&&J<8?r.compute(qa(G,n,i,B,o,t),{inputs:G}):r.compute(Ho(G,n,i,B,o,t),{inputs:G});return}let I=!0,w=r.kernelCustomData.wT??r.compute(lt(e[1],Ec),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=w);let v=[e[0],w];a&&v.push(e[2]);let $=o?h*g:b,A=o?b:h*g,P=d*p*l;r.compute(fw(v,n,i,$,A,P,a,I,t),{inputs:v})},OE=(r,e)=>{let n=e.format==="NHWC",t=[r.inputs[0].reshape(n?[r.inputs[0].dims[0],1,r.inputs[0].dims[1],r.inputs[0].dims[2]]:[r.inputs[0].dims[0],r.inputs[0].dims[1],1,r.inputs[0].dims[2]]),r.inputs[1].reshape([r.inputs[1].dims[0],r.inputs[1].dims[1],1,r.inputs[1].dims[2]])];r.inputs.length===3&&t.push(r.inputs[2]);let o=[0,e.pads[0],0,e.pads[1]],i=[1].concat(e.strides),a=[1].concat(e.dilations),s=[1].concat(e.kernelShape),u=Cc({...e,pads:o,strides:i,dilations:a,kernelShape:s},t);Tw(r,t,u,l=>n?[l[0],l[2],l[3]]:[l[0],l[1],l[3]])},PE=(r,e,n)=>{let t=n.format==="NHWC"?"channelsLast":"channelsFirst",o=Cc(n,e),i=n.autoPad==="NOTSET"?n.pads:n.autoPad,a=bw(e[0].dims,e[1].dims,n.strides,n.dilations,i,!1,t);r.compute(yw(e,o,a.outShape,[a.filterDepth,a.filterHeight,a.filterWidth],[a.padInfo.front,a.padInfo.top,a.padInfo.left],t))},kc=(r,e)=>{if(AE(r.inputs,e),r.inputs[0].dims.length===3)OE(r,e);else if(r.inputs[0].dims.length===5)PE(r,r.inputs,e);else{let n=Cc(e,r.inputs);Tw(r,r.inputs,n)}}});var Sw,$w=N(()=>{"use strict";ue();Gn();pe();he();Sw=(r,e,n)=>{let t=r.length>2,o=e.outputShape,i=e.format==="NHWC",a=e.group,s=r[1].dims,u=s[2]/a,l=s[3],d=i?Pe(u):1,p=i&&l===1&&u>=4,h=p?Math.floor(u/4)*4:Math.floor(u/d)*d,g=u-h,b=i?Pe(l):1,_=i?l===1?d:b:1,I=D.size(o)/b,w=[Math.ceil(I/64),1,1];me("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${w}`);let v=["rank","rank"],$=[e.strides[0],e.strides[1]],A=[e.kernelShape[i?1:2],e.kernelShape[i?2:3]],P=[e.dilations[0],e.dilations[1]],C=[A[0]+(e.dilations[0]<=1?0:(e.kernelShape[i?1:2]-1)*(e.dilations[0]-1)),A[1]+(e.dilations[1]<=1?0:(e.kernelShape[i?2:3]-1)*(e.dilations[1]-1))],R=[C[0]-1-Math.floor((e.pads[0]+e.pads[2])/2),C[1]-1-Math.floor((e.pads[1]+e.pads[3])/2)],x=[{type:12,data:I},{type:12,data:$},{type:12,data:A},{type:12,data:P},{type:12,data:C},{type:6,data:R},{type:12,data:h},{type:12,data:u},{type:12,data:l},...W(r[0].dims,r[1].dims)];t&&(x.push(...W(r[2].dims)),v.push("rank")),x.push(...W(o));let B=G=>{let Y=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:$.length},{name:"filter_dims",type:"u32",length:A.length},{name:"dilations",type:"u32",length:A.length},{name:"effective_filter_dims",type:"u32",length:C.length},{name:"pads",type:"i32",length:R.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],J=Fe(r[0].dataType),ie=i?1:2,z=i?2:3,U=i?3:1,te=L("W",r[1].dataType,r[1].dims.length,_),oe=L("Dy",r[0].dataType,r[0].dims.length,d),ee=[oe,te];t&&ee.push(L("bias",r[2].dataType,[o[U]].length,b));let de=V("result",r[0].dataType,o.length,b),ge=()=>{let Ve="";if(p)d===4?Ve+=`
        let xValue = ${oe.getByOffset("x_offset")};
        let wValue = ${te.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:d===2?Ve+=`
          dotProd = dotProd + dot(vec4<${J}>(${oe.getByOffset("x_offset")}, ${oe.getByOffset("x_offset + 1u")}), vec4<${J}>(${te.getByOffset("w_offset")}, ${te.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:d===1&&(Ve+=`
          dotProd = dotProd + dot(vec4<${J}>(${oe.getByOffset("x_offset")}, ${oe.getByOffset("x_offset + 1u")}, ${oe.getByOffset("x_offset + 2u")}, ${oe.getByOffset("x_offset + 3u")}), vec4<${J}>(${te.getByOffset("w_offset")}, ${te.getByOffset("w_offset + 1u")}, ${te.getByOffset("w_offset + 2u")}, ${te.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(Ve+=`
                  let xValue = ${i?oe.getByOffset(`${oe.indicesToOffset(`${oe.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${d}`):oe.get("batch","inputChannel","idyR","idyC")};
        `,d===1)Ve+=`
          let w_offset = ${te.indicesToOffset(`${te.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${te.getByOffset(`w_offset / ${_}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let F=0;F<d;F++)Ve+=`
            let wValue${F} = ${te.getByOffset(`${te.indicesToOffset(`${te.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${F}, wOutChannel)`)} / ${_}`)};
            dotProd = dotProd + xValue[${F}] * wValue${F};`;return Ve},Ie=()=>{if(g===0)return"";if(!p)throw new Error(`packInputAs4 ${p} is not true.`);let Ve="";if(d===1){Ve+="dotProd = dotProd";for(let F=0;F<g;F++)Ve+=`
            + ${oe.getByOffset(`x_offset + ${F}`)} * ${te.getByOffset(`w_offset + ${F}`)}`;Ve+=";"}else if(d===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);Ve+=`
          let xValue = ${oe.getByOffset("x_offset")};
          let wValue = ${te.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return Ve},mt=`
            let outputIndices = ${de.offsetToIndices(`global_idx * ${b}`)};
            let batch = ${de.indicesGet("outputIndices",0)};
            let d1 = ${de.indicesGet("outputIndices",U)};
            let r = ${de.indicesGet("outputIndices",ie)};
            let c = ${de.indicesGet("outputIndices",z)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${de.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${J}(dyRCorner) + ${J}(wR)) / ${J}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${J}(uniforms.Dy_shape[${ie}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${J}(dyCCorner) + ${J}(wC)) / ${J}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${J}(uniforms.Dy_shape[${z}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${p?`
                var x_offset = ${oe.indicesToOffset(`${oe.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${d};
                var w_offset = ${te.indicesToOffset(`${te.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${_};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${p?4:d}) {
                  ${ge()}
                  inputChannel = inputChannel + ${p?4:d};
                }
                ${Ie()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${t?` + bias[d1 / ${b}]`:""};
            ${de.setByOffset("global_idx","value")};
          `;return`
    ${G.registerUniforms(Y).declareVariables(...ee,de)}
      ${G.mainStart()}
      ${G.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${mt}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${e.cacheKey};${d}${_}${b}${p}${g}`,inputDependencies:v},getRunData:()=>({dispatchGroup:{x:w[0],y:w[1],z:w[2]},outputs:[{dims:n?n(o):o,dataType:r[0].dataType}],programUniforms:x}),getShaderSource:B}}});var EE,CE,DE,Aw,Ow,kE,Pw,NE,Ew,Cw=N(()=>{"use strict";$w();wr();Yn();EE=(r,e,n,t,o,i)=>(r-1)*e+n+(t-1)*o+1-i,CE=(r,e,n,t,o)=>{let i=Math.floor(r/2);e==="SAME_UPPER"?(n[t]=i,n[o]=r-i):e==="SAME_LOWER"&&(n[t]=r-i,n[o]=i)},DE=(r,e,n,t,o,i,a,s,u,l)=>{let d=r.length-2,p=l.length===0;u.length<d&&u.push(...Array(d-u.length).fill(0));let h=r[0],g=e[s?3:1]*o;for(let b=0,_=r.length-d-(s?1:0);b<d;++b,++_){let I=r[_],w=p?I*a[b]:l[b],v=EE(I,a[b],i[b],e[_],n[b],w);CE(v,t,i,b,b+d),p&&l.push(a[b]*(I-1)+u[b]+(e[_]-1)*n[b]+1-i[b]-i[b+d])}l.splice(0,0,h),l.splice(s?3:1,0,g)},Aw=(r,e)=>{let n=r.kernelShape.slice();if(r.kernelShape.length===0||r.kernelShape.reduce((p,h)=>p*h,1)===0){n.length=0;for(let p=2;p<e[1].dims.length;++p)n.push(e[1].dims[p])}let t=r.format==="NHWC";n.splice(0,0,e[1].dims[0]),n.splice(t?3:1,0,e[1].dims[1]);let o=r.pads.slice(),i=r.outputShape.slice(),a=r.outputPadding.slice(),s=e[0].dims,u=r.dilations.slice();if(u.reduce((p,h)=>p+h,0)===0){let p=e[0].dims.length-2;u=new Array(p).fill(1)}let l=r.strides.slice();if(l.reduce((p,h)=>p+h,0)===0){let p=e[0].dims.length-2;l=new Array(p).fill(1)}DE(s,n,u,r.autoPad,r.group,o,l,t,a,i);let d=Object.assign({},r);return Object.assign(d,{kernelShape:n,pads:o,outputPadding:a,outputShape:i,dilations:u,strides:l}),d},Ow=r=>{let e=Wa(r),n=r.format,t=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof r.autoPad>"u"?0:r.autoPad],o=r.dilations,i=r.group??1,a=r.kernelShape,s=r.pads,u=r.strides,l=r.wIsConst(),d=r.outputPadding,p=r.outputShape;return{autoPad:t,format:n,dilations:o,group:i,kernelShape:a,outputPadding:d,outputShape:p,pads:s,strides:u,wIsConst:l,...e,cacheKey:`${r.format};${e.activation};`}},kE=(r,e)=>{if(!r||r.length!==2&&r.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(r[0].dims.length!==4&&r[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(r[0].dims.length!==r[1].dims.length)throw new Error("filter does not have same dimension as input");let n=r[0].dims[e.format==="NHWC"?r[0].dims.length-1:1],t=r[1].dims[0];if(n!==t)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=r[1].dims[1]*e.group;if(r.length===3&&(r[2].dims.length!==1||r[2].dims[0]!==o))throw new Error("invalid bias");let i=r[0].dims.length-2;if(e.dilations.reduce((d,p)=>d+p,0)>0&&e.dilations.length!==i)throw new Error(`dilations should be ${i}D`);if(e.strides.reduce((d,p)=>d+p,0)>0&&e.strides.length!==i)throw new Error(`strides should be ${i}D`);if(e.pads.reduce((d,p)=>d+p,0)>0&&e.pads.length!==i*2)throw new Error(`pads should be ${i*2}D`);if(e.outputPadding.length!==i&&e.outputPadding.length!==0)throw new Error(`output_padding should be ${i}D`);if(e.kernelShape.reduce((d,p)=>d+p,0)>0&&e.kernelShape.length!==0&&e.kernelShape.length!==r[1].dims.length-2)throw new Error("invalid kernel shape");if(e.outputShape.length!==0&&e.outputShape.length!==r[0].dims.length-2)throw new Error("invalid output shape")},Pw=(r,e,n,t)=>{let o=r.kernelCustomData.wT??r.compute(lt(e[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!r.kernelCustomData.wT&&(r.kernelCustomData.wT=o);let i=[e[0],o];e.length===3&&i.push(e[2]),r.compute(Sw(i,n,t),{inputs:i})},NE=(r,e)=>{let n=e.format==="NHWC",t=[r.inputs[0].reshape(n?[r.inputs[0].dims[0],1,r.inputs[0].dims[1],r.inputs[0].dims[2]]:[r.inputs[0].dims[0],r.inputs[0].dims[1],1,r.inputs[0].dims[2]]),r.inputs[1].reshape([r.inputs[1].dims[0],r.inputs[1].dims[1],1,r.inputs[1].dims[2]])];r.inputs.length===3&&t.push(r.inputs[2]);let o=e.kernelShape;(o.length===0||o[0]===0)&&(o=[r.inputs[1].dims[2]]);let i=e.dilations;(i.length===0||i[0]===0)&&(i=[1]);let a=e.strides;(a.length===0||a[0]===0)&&(a=[1]);let s=e.pads;s.length===0&&(s=[0,0]),s=[0,s[0],0,s[1]],a=[1].concat(a),i=[1].concat(i),o=[1].concat(o);let u=e.outputPadding;u=[0].concat(u);let l=Aw({...e,pads:s,strides:a,dilations:i,kernelShape:o,outputPadding:u},t);Pw(r,t,l,d=>n?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Ew=(r,e)=>{if(kE(r.inputs,e),r.inputs[0].dims.length===3)NE(r,e);else{let n=Aw(e,r.inputs);Pw(r,r.inputs,n)}}});var LE,Dw,kw,Nw=N(()=>{"use strict";ue();pe();Qe();he();LE=(r,e,n,t)=>{let o=D.size(e),i=e.length,a=L("input",r,i),s=V("output",r,i),u=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),l=D.normalizeAxis(u,i),d=p=>{let h=` i32(${a.indicesGet("inputIndices","uniforms.axis")}) `,g=Q("uniforms.input_shape","uniforms.axis",i),b=t.reverse?h+(t.exclusive?" + 1":""):"0",_=t.reverse?g:h+(t.exclusive?"":" + 1");return`
                ${p.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(a,s)}
                ${p.mainStart()}
                  ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${s.offsetToIndices("global_idx")};
                  var sum = ${s.type.value}(0);
                  let first : i32 = ${b};
                  let last : i32 = ${_};
                  for (var i : i32 = first; i < last; i++) {
                    ${a.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${a.getByIndices("inputIndices")};
                  }
                  ${s.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:e,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:l},...W(e,e)]}),getShaderSource:d}},Dw=(r,e)=>{let n=r.inputs[0].dims,t=r.inputs[0].dataType,o=r.inputs[1];r.compute(LE(t,n,o,e),{inputs:[0]})},kw=r=>{let e=r.exclusive===1,n=r.reverse===1;return le({exclusive:e,reverse:n})}});var RE,zE,ME,Lw,Rw,zw=N(()=>{"use strict";ue();pe();Qe();he();RE=r=>{if(!r||r.length!==1)throw new Error("DepthToSpace requires 1 input.");if(r[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},zE=(r,e,n,t)=>{let o=[];o.push(`fn perm(i: ${t.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let i=0;i<e;++i)o.push(n.indicesSet("a",r[i],`i[${i}]`));return o.push("return a;}"),o.join(`
`)},ME=(r,e)=>{let n,t,o,i,a,s,u=e.format==="NHWC",l=e.blocksize,d=e.mode==="DCR";u?([n,t,o,i]=r.dims,a=d?[n,t,o,l,l,i/l**2]:[n,t,o,i/l**2,l,l],s=d?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,t,o,i]=[r.dims[0],r.dims[2],r.dims[3],r.dims[1]],a=d?[n,l,l,i/l**2,t,o]:[n,i/l**2,l,l,t,o],s=d?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let p=r.reshape(a),h=p.dims.length,g=r.dataType,b=L("a",g,h),_=V("output",g,h),I=w=>`
  ${w.registerUniform("output_size","u32").declareVariables(b,_)}

  ${zE(s,h,b,_)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${_.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${_.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${r.dims};${e.blocksize};${e.mode}`,inputDependencies:["rank"]},getRunData:w=>{let v=u?[n,t*l,o*l,i/l**2]:[n,i/l**2,t*l,o*l],$=D.size(v),A=p.dims,P=D.sortBasedOnPerm(A,s);return{outputs:[{dims:v,dataType:w[0].dataType}],dispatchGroup:{x:Math.ceil($/64)},programUniforms:[{type:12,data:$},...W(A,P)]}},getShaderSource:I}},Lw=(r,e)=>{RE(r.inputs),r.compute(ME(r.inputs[0],e))},Rw=r=>le({blocksize:r.blocksize,mode:r.mode,format:r.format})});var Nc,Za,Mw,BE,FE,Lc,Rc,Bw,VE,Fw,Vw,Gw=N(()=>{"use strict";ue();pe();Qe();he();Nc="[a-zA-Z]|\\.\\.\\.",Za="("+Nc+")+",Mw="^"+Za+"$",BE="("+Za+",)*"+Za,FE="^"+BE+"$",Lc=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,n){let t=this.symbolToIndices.get(e);t===void 0?t=[n]:t.push(n),this.symbolToIndices.set(e,t)}},Rc=class{constructor(e,n){this.equation=n;this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[t,o]=n.includes("->")?n.split("->",2):[n,""];if(!t.match(RegExp(FE)))throw new Error("Invalid LHS term");if(t.split(",").forEach((s,u)=>{let l=e[u].dims.slice();if(!s.match(RegExp(Mw)))throw new Error("Invalid LHS term");let d=this.processTerm(s,!0,l,u);this.lhs.push(d)}),o==="")o+=[...this.symbolToInfo.entries()].filter(([s,u])=>u.count===1||s==="...").map(([s])=>s).join("");else if(!o.match(RegExp(Za)))throw new Error("Invalid RHS");o.match(RegExp(Nc,"g"))?.forEach(s=>{if(s==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let u=this.symbolToInfo.get(s);if(u===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(u.dimValue)}}),this.rhs=this.processTerm(o,!1,this.outputDims)}addSymbol(e,n,t){let o=this.symbolToInfo.get(e);if(o!==void 0){if(o.dimValue!==n&&o.count!==1)throw new Error("Dimension mismatch");o.count++,o.inputIndices.push(t)}else o={count:1,dimValue:n,inputIndices:[t]};this.symbolToInfo.set(e,o)}processTerm(e,n,t,o=-1){let i=t.length,a=!1,s=[],u=0;if(!e.match(RegExp(Mw))&&!n&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Nc,"g")),d=new Lc(o);return l?.forEach((p,h)=>{if(p==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let g=i-l.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(s=t.slice(u,u+g),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(n)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let b=0;b<s.length;b++){let _=String.fromCharCode(48+b);d.addSymbol(_,h+b),this.addSymbol(_,t[u++],o)}}else d.addSymbol(p,h+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(p,t[u++],o)}),d}},Bw=r=>r+"_max",VE=(r,e,n,t)=>{let i=r.map(d=>d.length).map((d,p)=>L(`input${p}`,e,d)),a=D.size(t),s=V("output",e,t.length),u=[...n.symbolToInfo.keys()].filter(d=>!n.rhs.symbolToIndices.has(d)),l=d=>{let p=[],h="var prod = 1.0;",g="var sum = 0.0;",b="sum += prod;",_=[],I=[],w=[],v=[],$=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((P,C)=>{if(n.rhs.symbolToIndices.has(C)){let R=n.rhs.symbolToIndices.get(C)?.[0];R!==void 0&&n.lhs.forEach((x,B)=>{if(P.inputIndices.includes(B)){let G=x.symbolToIndices.get(C);if(G===void 0)throw new Error("Invalid symbol error");G.forEach(Y=>{p.push(`${i[B].indicesSet(`input${B}Indices`,Y,s.indicesGet("outputIndices",R))}`)})}})}else n.lhs.forEach((R,x)=>{if(P.inputIndices.includes(x)){let B=R.symbolToIndices.get(C);if(B===void 0)throw new Error("Invalid symbol error");B.forEach(G=>{_.push(`${i[x].indicesSet(`input${x}Indices`,G,`${C}`)}`)}),v.push(`prod *= ${i[x].getByIndices(`input${x}Indices`)};`)}}),I.push(`for(var ${C}: u32 = 0; ${C} < uniforms.${Bw(C)}; ${C}++) {`),w.push("}")});let A=$?[...p,`let sum = ${i.map((P,C)=>P.getByIndices(`input${C}Indices`)).join(" * ")};`]:[...p,g,...I,..._,h,...v,b,...w];return`
            ${d.registerUniforms(u.map(P=>({name:`${Bw(P)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...i,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${i.map((P,C)=>`var input${C}Indices: ${i[C].type.indices};`).join(`
`)}
            ${A.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:r.map(()=>"rank")},getRunData:()=>{let d=u.filter(h=>n.symbolToInfo.has(h)).map(h=>({type:12,data:n.symbolToInfo.get(h)?.dimValue||0}));d.push({type:12,data:a});let p=r.map((h,g)=>[...W(h)]).reduce((h,g)=>h.concat(g),d);return p.push(...W(t)),{outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:p}},getShaderSource:l}},Fw=(r,e)=>{let n=new Rc(r.inputs,e.equation),t=n.outputDims,o=r.inputs.map((i,a)=>i.dims);r.compute(VE(o,r.inputs[0].dataType,n,t))},Vw=r=>{let e=r.equation.replace(/\s+/g,"");return le({equation:e})}});var GE,Uw,UE,WE,Ww,Hw=N(()=>{"use strict";ue();pe();he();GE=r=>{if(!r||r.length!==2)throw new Error("Expand requires 2 input.");let e=r[0].dims,n=Array.from(r[1].getBigInt64Array(),Number),t=n.length<e.length?0:n.length-e.length,o=e.length<n.length?0:e.length-n.length;for(;t<n.length&&o<e.length;++t,++o)if(n[t]!==e[o]&&n[t]!==1&&e[o]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Uw=(r,e)=>{let n=r.length-e.length,t=[];for(let o=0;o<n;++o)t.push(r[o]);for(let o=0;o<e.length;++o)t.push(e[o]===1?r[o+n]:e[o]);return t},UE=(r,e)=>r.length>e.length?Uw(r,e):Uw(e,r),WE=r=>{let e=r[0].dims,n=Array.from(r[1].getBigInt64Array(),Number),t=UE(e,n),o=r[0].dataType,i=o===9||D.size(e)===1,a=o===9||e.length>0&&e[e.length-1]%4===0?4:1,s=i||t.length>0&&t[t.length-1]%4===0?4:1,u=Math.ceil(D.size(t)/s),l=p=>{let h=L("input",o,e.length,a),g=V("output",o,t.length,s),b;if(o===9){let _=(I,w,v="")=>`
          let outputIndices${w} = ${g.offsetToIndices(`outputOffset + ${w}u`)};
          let offset${w} = ${h.broadcastedIndicesToOffset(`outputIndices${w}`,g)};
          let index${w} = offset${w} / 4u;
          let component${w} = offset${w} % 4u;
          ${I}[${w}] = ${v}(${h.getByOffset(`index${w}`)}[component${w}]);
        `;b=`
        let outputOffset = global_idx * ${s};
        var data = vec4<u32>(0);
        ${_("data",0,"u32")}
        ${_("data",1,"u32")}
        ${_("data",2,"u32")}
        ${_("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else b=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${s}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${h.getByOffset(`inputOffset / ${a}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${p.registerUniform("vec_size","u32").declareVariables(h,g)}
    ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${b}`},d=[{type:12,data:u},...W(e,t)];return{name:"Expand",shaderCache:{hint:`${t.length};${a}${s}`,inputDependencies:["rank"]},getShaderSource:l,getRunData:()=>({outputs:[{dims:t,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:d})}},Ww=r=>{GE(r.inputs),r.compute(WE(r.inputs),{inputs:[0]})}});var HE,qw,jw=N(()=>{"use strict";ue();pe();he();Ua();HE=r=>{let e=r[0].dataType,n=D.size(r[0].dims),t=D.size(r[1].dims),o=t%4===0,i=a=>{let s=L("x",e,[1],4),u=L("bias",e,[1],4),l=V("y",e,[1],4),d=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],p=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${u.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,h=o?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${p(0)}${p(1)}${p(2)}${p(3)}
      let bias = ${s.type.value}(bias0, bias1, bias2, bias3);`;return`${a.registerUniforms(d).declareVariables(s,u,l)}

    ${$c(ut(e))}

    ${a.mainStart(Ur)}
      ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${s.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${l.setByOffset("global_idx",Ac("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${o}`,inputDependencies:["type","type"]},getShaderSource:i,getRunData:a=>({outputs:[{dims:a[0].dims,dataType:a[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:t}],dispatchGroup:{x:Math.ceil(n/Ur/4)}})}},qw=r=>{r.inputs.length<2||D.size(r.inputs[1].dims)===0?G0(r):r.compute(HE(r.inputs))}});var qE,jE,Kw,Xw,Zw=N(()=>{"use strict";ue();pe();Qe();he();qE=r=>{if(!r||r.length!==2)throw new Error("Gather requires 2 inputs.")},jE=(r,e)=>{let n=r[0].dims,t=r[1].dims,o=n.length,i=D.normalizeAxis(e.axis,o),a=n.slice(0);a.splice(i,1,...t);let s=n[i],u=r[0].dataType===9?4:1,l=Math.ceil(D.size(a)/u),d=[{type:12,data:l},{type:6,data:s},{type:12,data:i},...W(r[0].dims,r[1].dims,a)],p=h=>{let g=L("data",r[0].dataType,r[0].dims.length,u),b=L("inputIndices",r[1].dataType,r[1].dims.length),_=V("output",r[0].dataType,a.length,u),I=v=>{let $=t.length,A=`var indicesIndices${v}  = ${b.type.indices}(0);`;for(let P=0;P<$;P++)A+=`${$>1?`indicesIndices${v}[${P}]`:`indicesIndices${v}`} = ${a.length>1?`outputIndices${v}[uniforms.axis + ${P}]`:`outputIndices${v}`};`;A+=`
          var idx${v} = ${b.getByIndices(`indicesIndices${v}`)};
          if (idx${v} < 0) {
            idx${v} = idx${v} + uniforms.axisDimLimit;
          }
          var dataIndices${v} : ${g.type.indices};
        `;for(let P=0,C=0;P<o;P++)P===i?(A+=`${o>1?`dataIndices${v}[${P}]`:`dataIndices${v}`} = u32(idx${v});`,C+=$):(A+=`${o>1?`dataIndices${v}[${P}]`:`dataIndices${v}`} = ${a.length>1?`outputIndices${v}[${C}]`:`outputIndices${v}`};`,C++);return A},w;if(r[0].dataType===9){let v=($,A,P="")=>`
          let outputIndices${A} = ${_.offsetToIndices(`outputOffset + ${A}u`)};
          ${I(A)};
          let offset${A} = ${g.indicesToOffset(`dataIndices${A}`)};
          let index${A} = offset${A} / 4u;
          let component${A} = offset${A} % 4u;
          ${$}[${A}] = ${P}(${g.getByOffset(`index${A}`)}[component${A}]);
        `;w=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${v("value",0,"u32")}
        ${v("value",1,"u32")}
        ${v("value",2,"u32")}
        ${v("value",3,"u32")}
        ${_.setByOffset("global_idx","value")}
      `}else w=`
      let outputIndices = ${_.offsetToIndices("global_idx")};
      ${I("")};
      let value = ${g.getByIndices("dataIndices")};
      ${_.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,b,_)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${w}
      }`};return{name:"Gather",shaderCache:{hint:e.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:p}},Kw=r=>le({axis:r.axis}),Xw=(r,e)=>{let n=r.inputs;qE(n),r.compute(jE(r.inputs,e))}});var KE,Jw,Qw,Yw=N(()=>{"use strict";ue();pe();he();KE=(r,e,n,t,o,i,a,s,u)=>{let l=[{type:12,data:i},{type:12,data:t},{type:12,data:o},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:12,data:u}],d=[i];l.push(...W(e.dims,d));let p=h=>{let g=L("indices_data",e.dataType,e.dims.length),b=V("input_slice_offsets_data",12,1,1),_=[g,b],I=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:o.length},{name:"sizes_from_slice_dims_data",type:"u32",length:n.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(I).declareVariables(..._)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${o.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${n.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return r.compute({name:"computeSliceOffsets",shaderCache:{hint:`${o.length}_${n.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:d,dataType:r.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:l}),getShaderSource:p},{inputs:[e],outputs:[-1]})[0]},Jw=(r,e)=>{let n=r.inputs,t=n[0].dims,o=n[0].dataType,i=n[1].dims,a=i[i.length-1],s=D.sizeToDimension(i,i.length-1),u=D.sizeFromDimension(t,e.batchDims+a),l=D.sizeToDimension(t,e.batchDims),d=D.sizeFromDimension(t,e.batchDims),p=s/l,h=new Array(a),g=u;for(let A=0;A<a;++A)h[a-1-A]=g,g*=t[e.batchDims+a-1-A];let b=KE(r,n[1],h,e.batchDims,t,s,p,d,a),_=e.batchDims+a;if(_>t.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let I=i.slice(0,-1).concat(t.slice(_)),w=D.size(I),v=[{type:12,data:w},{type:12,data:u},...W(n[0].dims,b.dims,I)],$=A=>{let P=L("data",n[0].dataType,n[0].dims.length),C=L("slice_offsets",12,b.dims.length),R=V("output",n[0].dataType,I.length);return`
          ${A.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(P,C,R)}
            ${A.mainStart()}
            ${A.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};r.compute({name:"GatherND",shaderCache:{hint:e.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:I,dataType:o}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:v}),getShaderSource:$},{inputs:[n[0],b]})},Qw=r=>({batchDims:r.batch_dims,cacheKey:""})});var XE,ZE,ev,tv,nv=N(()=>{"use strict";ue();pe();Qe();he();XE=(r,e)=>{if(r.length<3||r.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let n=D.normalizeAxis(e.quantizeAxis,r[0].dims.length),t=e.blockSize,o=r[0],i=r[2],a=r.length===4?r[3]:void 0;if(i.dims.length!==o.dims.length||!o.dims.map((s,u)=>u===n?Math.ceil(s/t)===i.dims[u]:s===i.dims[u]).reduce((s,u)=>s&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(a){if(a.dataType!==o.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(a.dims.length!==i.dims.length||!a.dims.map((s,u)=>s===i.dims[u]).reduce((s,u)=>s&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},ZE=(r,e)=>{let n=r[0].dims,t=r[1].dims,o=n.length,i=D.normalizeAxis(e.gatherAxis,o),a=D.normalizeAxis(e.quantizeAxis,o),s=n.slice(0);s.splice(i,1,...t);let u=D.size(s),l=r[2].dataType,p=r[0].dataType===22,h=[{type:12,data:u},{type:12,data:a},{type:12,data:i},{type:12,data:e.blockSize},...W(...r.map((b,_)=>b.dims),s)],g=b=>{let _=L("data",r[0].dataType,r[0].dims.length),I=L("inputIndices",r[1].dataType,r[1].dims.length),w=L("scales",r[2].dataType,r[2].dims.length),v=r.length>3?L("zeroPoint",r[3].dataType,r[3].dims.length):void 0,$=V("output",l,s.length),A=[_,I,w];v&&A.push(v);let P=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${b.registerUniforms(P).declareVariables(...A,$)}
        ${b.mainStart()}
        let output_indices = ${$.offsetToIndices("global_idx")};
        var indices_indices = ${I.type.indices}(0);
        ${t.length>1?`
          for (var i: u32 = 0; i < ${t.length}; i++) {
            let index = ${$.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${I.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${$.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${$.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${I.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${n[i]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${s.length}; i++) {
          let index = ${$.indicesGet("output_indices",`i + ${t.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${p?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${w.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${w.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${w.getByIndices("scale_indices")};
        ${v?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${v.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${v.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${p?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ut(l)}(quantized_data - zero_point) * scale;
        ${$.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${e.cacheKey};${r.filter((b,_)=>_!==1).map(b=>b.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:r.length},(b,_)=>"rank")},getRunData:()=>({outputs:[{dims:s,dataType:l}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:h}),getShaderSource:g}},ev=(r,e)=>{let n=r.inputs;XE(n,e),r.compute(ZE(r.inputs,e))},tv=r=>le({blockSize:r.blockSize,gatherAxis:r.gatherAxis,quantizeAxis:r.quantizeAxis})});var JE,QE,rv,ov,iv=N(()=>{"use strict";ue();pe();Qe();he();JE=r=>{if(!r||r.length!==2)throw new Error("GatherElements requires 2 inputs.");if(r[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(r[0].dims.length!==r[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},QE=(r,e)=>{let n=r[0].dims,t=r[0].dataType,o=n.length,i=r[1].dims,a=r[1].dataType,s=D.normalizeAxis(e.axis,o),u=n[s],l=i.slice(0),d=D.size(l),p=L("input",t,o),h=L("indicesInput",a,i.length),g=V("output",t,l.length),b=[{type:12,data:d},{type:6,data:u},{type:12,data:s}];return b.push(...W(n,i,l)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:l,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:b}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(p,h,g)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${p.type.indices}(outputIndices);
      ${p.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${p.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},rv=r=>le({axis:r.axis}),ov=(r,e)=>{let n=r.inputs;JE(n),r.compute(QE(r.inputs,e))}});var YE,eC,av,sv,uv=N(()=>{"use strict";ue();pe();he();YE=r=>{if(!r)throw new Error("Input is missing");if(r.length<2||r.length>3)throw new Error("Invaid input number.");if(r.length===3&&r[2].dims.length>2)throw new Error("Invalid input shape of C");if(r[0].dataType!==r[1].dataType||r.length===3&&r[0].dataType!==r[2].dataType)throw new Error("Input types are mismatched")},eC=(r,e)=>{let n=r[0].dims.slice(),t=r[1].dims.slice(),[o,i,a]=Ea.getShapeOfGemmResult(n,e.transA,t,e.transB,r.length===3?r[2].dims:void 0),s=[o,i];if(!s)throw new Error("Can't use gemm on the given tensors");let u=16,l=Math.ceil(i/u),d=Math.ceil(o/u),p=!0,h=D.size(s),g=[{type:12,data:p?l:h},{type:12,data:o},{type:12,data:i},{type:12,data:a},{type:1,data:e.alpha},{type:1,data:e.beta}],b=["type","type"];r.length===3&&(g.push(...W(r[2].dims)),b.push("rank")),g.push(...W(s));let _=w=>{let v="";e.transA&&e.transB?v="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":e.transA&&!e.transB?v="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!e.transA&&e.transB?v="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!e.transA&&!e.transB&&(v="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let $=e.alpha===1?"":"value *= uniforms.alpha;",A=L("a",r[0].dataType,r[0].dims),P=L("b",r[1].dataType,r[1].dims),C=A.type.value,R=null,x=[A,P];r.length===3&&(R=L("c",r[2].dataType,r[2].dims.length),x.push(R));let B=V("output",r[0].dataType,s.length);x.push(B);let G=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${w.registerUniforms(G).declareVariables(...x)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${C}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${v}
    }

    ${$}
    ${R!=null?`let cOffset = ${R.broadcastedIndicesToOffset("vec2(m, n)",B)}; value += ${C}(uniforms.beta) * ${R.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},I=w=>{let v=L("a",r[0].dataType,r[0].dims),$=L("b",r[1].dataType,r[1].dims),A=null,P=[v,$];r.length===3&&(A=L("c",r[2].dataType,r[2].dims.length),P.push(A));let C=V("output",r[0].dataType,s.length);P.push(C);let R=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],x="",B="";e.transA&&e.transB?(B=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):e.transA&&!e.transB?(B=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,x="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!e.transA&&e.transB?(B=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!e.transA&&!e.transB&&(B=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${v.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${$.type.value}(0);
      }
      `,x="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let G=e.alpha===1?"":"value *= uniforms.alpha;";return`
  ${w.registerUniforms(R).declareVariables(...P)}
  var<workgroup> tile_a: array<array<${v.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${$.type.storage}, ${u}>, ${u}>;
  ${w.mainStart([u,u,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${C.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${B}
      k_start = k_start + ${u};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${u}; k++) {
        ${x}
      }
      workgroupBarrier();
    }

    ${G}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${A!=null?`let cOffset = ${A.broadcastedIndicesToOffset("vec2(m, n)",C)}; value += ${C.type.value}(uniforms.beta) * ${A.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return p?{name:"GemmShared",shaderCache:{hint:`${e.cacheKey}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:s,dataType:r[0].dataType}],dispatchGroup:{x:l*d},programUniforms:g}),getShaderSource:I}:{name:"Gemm",shaderCache:{hint:`${e.cacheKey}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:s,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:_}},av=r=>{let e=r.transA,n=r.transB,t=r.alpha,o=r.beta;return{transA:e,transB:n,alpha:t,beta:o,cacheKey:`${r.transA};${r.transB};${r.alpha===1}`}},sv=(r,e)=>{YE(r.inputs),r.compute(eC(r.inputs,e))}});var er,vr,co,po,tC,nC,rC,oC,iC,aC,sC,uC,lv,cv,dv=N(()=>{"use strict";ue();pe();Qe();he();[er,vr,co,po]=[0,1,2,3],tC=r=>{if(r[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(r[0].dims.length!==r[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(r[0].dims.length-2!==r[1].dims[r[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${r[0].dims.length-2}`);if(r[0].dims[0]!==r[1].dims[0])throw new Error("grid batch size must match input batch size")},nC=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,rC=r=>`
  fn gs_bicubic_interpolate(p: mat4x4<${r}>, x: f32, y: f32) -> ${r} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${r}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,oC=r=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${r.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,iC=r=>`
  ${r.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,aC=(r,e,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${e} {
     var pixel = ${e}(0);
     var indices = vec4<u32>(0);
     indices[${er}] = batch;
     indices[${vr}] = channel;`+(()=>{switch(n.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${co}] = u32(r);
            indices[${po}] = u32(c);
          } else {
            return ${e}(0);
          }
        `;case"border":return`
          indices[${co}] = u32(clamp(r, 0, H - 1));
          indices[${po}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${co}] = gs_reflect(r, border[1], border[3]);
          indices[${po}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${r.getByIndices("indices")};
  }
`,sC=(r,e,n)=>(()=>{switch(n.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${er}], indices[${vr}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${er}], indices[${vr}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${er}], indices[${vr}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${er}], indices[${vr}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${er}], indices[${vr}], border);

          let dx2 = ${e}(f32(x2) - x);
          let dx1 = ${e}(x - f32(x1));
          let dy2 = ${e}(f32(y2) - y);
          let dy1 = ${e}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${e}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${er}], indices[${vr}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${n.mode} is not supported`)}})()+`${r.setByOffset("global_idx","result")}`,uC=(r,e)=>{let n=L("x",r[0].dataType,r[0].dims.length),t=[r[1].dims[0],r[1].dims[1],r[1].dims[2]],o=L("grid",r[1].dataType,t.length,2),i=[r[0].dims[0],r[0].dims[1],r[1].dims[1],r[1].dims[2]];e.format==="NHWC"&&(i=[r[0].dims[0],r[1].dims[1],r[1].dims[2],r[0].dims[3]],[er,vr,co,po]=[0,3,1,2]);let a=V("output",r[0].dataType,i.length),s=n.type.value,u=D.size(i),l=[{type:12,data:u},...W(r[0].dims,t,i)],d=p=>`
  ${p.registerUniform("output_size","u32").declareVariables(n,o,a)}
  ${nC}
  ${rC(s)}
  ${oC(e)}
  ${iC(e)}
  ${aC(n,s,e)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${co}]);
      let W_in = i32(uniforms.x_shape[${po}]);

      ${e.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${a.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${er}], indices[${co}], indices[${po}]);
      let nxy = ${o.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${sC(a,s,e)}
  }`;return{name:"GridSample",shaderCache:{hint:`${e.cacheKey}`,inputDependencies:["type","type"]},getRunData:p=>{let h=D.size(i);return{outputs:[{dims:i,dataType:p[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:l}},getShaderSource:d}},lv=(r,e)=>{tC(r.inputs),r.compute(uC(r.inputs,e))},cv=r=>le({alignCorners:r.align_corners,mode:r.mode,paddingMode:r.padding_mode,format:r.format})});var It,dC,fv,pv,pC,qo,hv,zc=N(()=>{"use strict";ue();pe();Qe();Ra();Va();he();Yn();It=(r,e)=>r.length>e&&r[e].dims.length>0?r[e]:void 0,dC=(r,e)=>{let n=r[0],t=It(r,1),o=It(r,2),i=It(r,3),a=It(r,4),s=It(r,5),u=It(r,6),l=It(r,7);if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let d=n.dims[0],p=n.dims[1],h=n.dims.length===3?n.dims[2]:e.numHeads*n.dims[4],g=p,b=0,_=0,I=Math.floor(h/e.numHeads);if(u&&l&&D.size(u.dims)&&D.size(l.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==d||u.dims[1]!==e.numHeads||u.dims[3]!==I)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[0]!==d||l.dims[1]!==e.numHeads||l.dims[3]!==I)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==l.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(l.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');b=u.dims[2],_=u.dims[2]}else if(u&&D.size(u.dims)||l&&D.size(l.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let w;if(t&&D.size(t.dims)>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(t.dims.length<3||t.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==t.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(t.dims.length===3){if(t.dims[2]!==n.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');w=2,g=t.dims[1]}else if(t.dims.length===5){if(t.dims[2]!==e.numHeads||t.dims[3]!==2||t.dims[4]!==I)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');w=5,g=t.dims[1]}else{if(t.dims[1]!==e.numHeads||t.dims[3]!==I)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');w=0,g=t.dims[2]}}else{if(n.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(n.dims[2]!==e.numHeads||n.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');w=3}if(i&&D.size(i.dims)>0){if(i.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(t&&t.dims.length===5&&t.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let v=b+g,$=0;if(a&&D.size(a.dims)>0){$=8;let R=a.dims;throw R.length===1?R[0]===d?$=1:R[0]===3*d+2&&($=3):R.length===2&&R[0]===d&&R[1]===v&&($=5),$===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let A=!1,P=h;if(o&&D.size(o.dims)>0){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(g!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');P=o.dims[2]}else{if(g!==o.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');P=o.dims[1]*o.dims[3],A=!0}}let C=!1;if(a&&D.size(a.dims)>0)throw new Error("Key padding mask is not supported");if(s&&D.size(s.dims)>0){if(s.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(s.dims[0]!==d||s.dims[1]!==e.numHeads||s.dims[2]!==p||s.dims[3]!==v)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:d,sequenceLength:p,pastSequenceLength:b,kvSequenceLength:g,totalSequenceLength:v,maxSequenceLength:_,inputHiddenSize:0,hiddenSize:h,vHiddenSize:P,headSize:I,vHeadSize:Math.floor(P/e.numHeads),numHeads:e.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:e.maskFilterValue,maskType:$,scale:e.scale,broadcastResPosBias:C,passPastInKv:A,qkvFormat:w}},fv=r=>le({...r}),pv=le({perm:[0,2,1,3]}),pC=(r,e,n,t,o,i,a)=>{let s=[t,o,i],u=D.size(s),l=[{type:12,data:u},{type:12,data:a},{type:12,data:i}],d=p=>{let h=V("qkv_with_bias",e.dataType,s),g=L("qkv",e.dataType,s),b=L("bias",n.dataType,s),_=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${p.registerUniforms(_).declareVariables(g,b,h)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return r.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:s,dataType:e.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d},{inputs:[e,n],outputs:[-1]})[0]},qo=(r,e,n,t,o,i,a,s)=>{let u=i;if(a&&D.size(a.dims)>0){if(t===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=pC(r,i,a,e,t,n*o,s),u=u.reshape([e,t,n,o]),n===1||t===1?u:r.compute(lt(u,pv.perm),{inputs:[u],outputs:[-1]})[0]}else return i.dims.length===3&&(u=i.reshape([e,t,n,o])),n===1||t===1?u:r.compute(lt(u,pv.perm),{inputs:[u],outputs:[-1]})[0]},hv=(r,e)=>{let n=dC(r.inputs,e),t=r.inputs[0],o=It(r.inputs,1),i=It(r.inputs,2),a=It(r.inputs,3),s=It(r.inputs,4),u=It(r.inputs,5),l=It(r.inputs,6),d=It(r.inputs,7);if(t.dims.length===5)throw new Error("Packed QKV is not implemented");if(o?.dims.length===5)throw new Error("Packed KV is not implemented");let p=o&&i&&o.dims.length===4&&i.dims.length===4,h=qo(r,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t,a,0);if(p)return lo(r,h,o,i,s,void 0,l,d,u,n);if(!o||!i)throw new Error("key and value must be provided");let g=qo(r,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,o,a,n.hiddenSize),b=qo(r,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,i,a,2*n.hiddenSize);lo(r,h,g,b,s,void 0,l,d,u,n)}});var fC,hC,mC,gC,Mc,mv,gv,Bc=N(()=>{"use strict";ue();pe();Qe();he();fC=r=>{if(!r||r.length<1)throw new Error("too few inputs")},hC=(r,e)=>{let n=[],t=e.numOutputs;return r[1].dims[0]>0&&(r[1].getBigInt64Array().forEach(o=>n.push(Number(o))),t=n.length),le({numOutputs:t,axis:e.axis,splitSizes:n})},mC=r=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${r}u; i += 1u ) {
    if (index < ${Q("uniforms.size_in_split_axis","i",r)}) {
        return i;
    }
    }
    return ${r}u;
}`,gC=r=>{let e=r.length,n=[];for(let t=0;t<e;++t){let o=r[t].setByIndices("indices","input[global_idx]");e===1?n.push(o):t===0?n.push(`if (output_number == ${t}u) { ${o} }`):t===e-1?n.push(`else { ${o} }`):n.push(`else if (output_number == ${t}) { ${o} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${r[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},Mc=(r,e)=>{let n=r[0].dims,t=D.size(n),o=r[0].dataType,i=D.normalizeAxis(e.axis,n.length),a=new Array(e.numOutputs),s=L("input",o,n.length),u=new Array(e.numOutputs),l=[],d=[],p=0,h=[{type:12,data:t}];for(let b=0;b<e.numOutputs;b++){p+=e.splitSizes[b],u[b]=p;let _=n.slice();_[i]=e.splitSizes[b],d.push(_),a[b]=V(`output${b}`,o,_.length),l.push({dims:d[b],dataType:r[0].dataType})}h.push({type:12,data:u},...W(n,...d));let g=b=>`
  ${b.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(s,...a)}
  ${mC(u.length)}
  ${gC(a)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${s.offsetToIndices("global_idx")};
    var index = ${s.indicesGet("indices",i)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Q("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${s.indicesSet("indices",i,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:e.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:l,dispatchGroup:{x:Math.ceil(t/64)},programUniforms:h})}},mv=(r,e)=>{fC(r.inputs);let n=r.inputs.length===1?e:hC(r.inputs,e);r.compute(Mc(r.inputs,n),{inputs:[0]})},gv=r=>{let e=r.axis,n=r.splitSizes,t=r.numOutputs<0?n.length:r.numOutputs;if(t!==n.length)throw new Error("numOutputs and splitSizes length must be equal");return le({axis:e,numOutputs:t,splitSizes:n})}});var bC,Ja,bv,Fc=N(()=>{"use strict";ue();pe();Qe();he();bC=(r,e)=>{let[n,t,o,i]=r,{numHeads:a,rotaryEmbeddingDim:s}=e;if(n.dims.length!==3&&n.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!D.areEqual(t.dims,[])&&!D.areEqual(t.dims,[1])&&t.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${t.dims.length}`);if(o.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(i.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${i.dims.length}`);if(!D.areEqual(o.dims,i.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(s>0&&a===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=n.dims[0],l=n.dims[n.dims.length-2],d=o.dims[0],p=D.sizeFromDimension(n.dims,1)/l,h=s===0?o.dims[1]*2:p/a;if(s>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(t.dims.length===2){if(u!==t.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${t.dims[0]}`);if(l!==t.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${t.dims[1]}`)}if(h/2!==o.dims[1]&&s/2!==o.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`);if(l>d)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},Ja=(r,e)=>{let{interleaved:n,numHeads:t,rotaryEmbeddingDim:o,scale:i}=e,a=r[0].dims[0],s=D.sizeFromDimension(r[0].dims,1),u=r[0].dims[r[0].dims.length-2],l=s/u,d=r[2].dims[1],p=o===0?d*2:l/t,h=new Array(a,u,l/p,p-d),g=D.computeStrides(h),b=[{type:1,data:i},{type:12,data:h},{type:12,data:g},...r[0].dims.length===3?new Array({type:12,data:[s,l,p,1]}):[],...r[0].dims.length===4?new Array({type:12,data:[s,p,u*p,1]}):[],...W(r[0].dims,r[1].dims,r[2].dims,r[3].dims,r[0].dims)],_=I=>{let w=L("input",r[0].dataType,r[0].dims.length),v=L("position_ids",r[1].dataType,r[1].dims.length),$=L("cos_cache",r[2].dataType,r[2].dims.length),A=L("sin_cache",r[3].dataType,r[3].dims.length),P=V("output",r[0].dataType,r[0].dims.length);return I.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${I.declareVariables(w,v,$,A,P)}

        ${I.mainStart(Ur)}
          let half_rotary_emb_dim = uniforms.${$.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${I.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${v.broadcastedIndicesToOffset("bsnh.xy",V("",v.type.tensor,2))};
            let position_id =
                u32(${v.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${w.getByOffset("i")} * ${$.get("position_id","bsnh[3]")} -
                ${w.getByOffset("j")} * ${A.get("position_id","bsnh[3]")};
            ${P.setByOffset("i","re")}
            let im = ${w.getByOffset("i")} * ${A.get("position_id","bsnh[3]")} +
                ${w.getByOffset("j")} * ${$.get("position_id","bsnh[3]")};
            ${P.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${P.setByOffset("k",w.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:le({interleaved:n}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:r[0].dims,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(D.size(h)/Ur)},programUniforms:b})}},bv=(r,e)=>{bC(r.inputs,e),r.compute(Ja(r.inputs,e))}});var yC,_C,yv,wC,_v,wv=N(()=>{"use strict";Qe();ue();Va();zc();Bc();Yn();Fc();he();yC=(r,e)=>{if(e.doRotary&&r.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let n=r[0],t=r[1],o=r[2],i=r[3],a=r[4];if(e.doRotary!==0&&r.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(e.localWindowSize!==-1)throw new Error("Local attention is not supported");if(e.softcap!==0)throw new Error("Softcap is not supported");if(e.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(e.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let s=!1,u=n.dims[0],l=n.dims[1],d=n.dims.length===3?s?n.dims[2]/3:n.dims[2]:e.numHeads*n.dims[4],p=l,h=0,g=!t||t.dims.length===0,b=Math.floor(g?d/(e.numHeads+2*e.kvNumHeads):d/e.numHeads);g&&(d=b*e.numHeads);let _=i&&i.dims.length!==0,I=a&&a.dims.length!==0;if(_&&i.dims.length===4&&i.dims[0]===u&&i.dims[1]!==e.kvNumHeads&&i.dims[2]===e.kvNumHeads&&i.dims[3]===b)throw new Error("BSNH pastKey/pastValue is not supported");if(_&&I){if(i.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(a.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=i.dims[2]}else if(_||I)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v=1;if(t&&t.dims.length>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(t.dims.length<3||t.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==t.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(t.dims.length===3){if(n.dims[2]%t.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');p=t.dims[1]}else if(t.dims.length===5){if(t.dims[2]!==e.numHeads||t.dims[3]!==2||t.dims[4]!==b)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');p=t.dims[1]}else{if(t.dims[1]!==e.numHeads||t.dims[3]!==b)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');p=t.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==e.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}let $=0,A=!1,P=e.kvNumHeads?b*e.kvNumHeads:d;if(o&&o.dims.length>0){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(p!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');P=o.dims[2]}else{if(p!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');P=o.dims[1]*o.dims[3],A=!0}}let C=r.length>4?r[5]:void 0;if(C&&C.dims.length!==1&&C.dims[0]!==u)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:u,sequenceLength:l,pastSequenceLength:h,kvSequenceLength:p,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:d,vHiddenSize:P,headSize:b,vHeadSize:Math.floor(P/e.kvNumHeads),numHeads:e.numHeads,kvNumHeads:e.kvNumHeads,nReps:e.numHeads/e.kvNumHeads,pastPresentShareBuffer:!1,maskType:$,scale:e.scale,broadcastResPosBias:!1,passPastInKv:A,qkvFormat:v}},_C=le({perm:[0,2,1,3]}),yv=(r,e,n)=>{let t=e,o=n.kvNumHeads;return e.dims.length===3&&n.kvSequenceLength!==0&&(t=e.reshape([n.batchSize,n.kvSequenceLength,o,n.headSize]),t=r.compute(lt(t,_C.perm),{inputs:[t],outputs:[-1]})[0]),t},wC=(r,e,n,t)=>{let o=7,i=["type","type"],a=[r*e],s=r*e,u=[{type:12,data:s},{type:12,data:e},{type:12,data:r}],l=d=>{let p=L("seq_lens",n.dataType,n.dims),h=L("total_seq_lens",t.dataType,t.dims),g=V("pos_ids",o,a),b=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${d.registerUniforms(b).declareVariables(p,h,g)}
  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${p.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${g.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${r};${e}`,inputDependencies:i},getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u}),getShaderSource:l}},_v=(r,e)=>{let n=yC(r.inputs,e);if(r.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(r.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let t=r.inputs[0],o=r.inputs[1]&&r.inputs[1].dims.length>0?r.inputs[1]:void 0,i=r.inputs[2]&&r.inputs[2].dims.length>0?r.inputs[2]:void 0,a=r.inputs[3]&&r.inputs[3].dims.length!==0?r.inputs[3]:void 0,s=r.inputs[4]&&r.inputs[4].dims.length!==0?r.inputs[4]:void 0,u=r.inputs.length>4?r.inputs[5]:void 0,l=r.inputs.length>5?r.inputs[6]:void 0,d=n.kvNumHeads?n.kvNumHeads:n.numHeads,p=le({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,d*n.headSize,d*n.headSize]}),[h,g,b]=!o&&!i?r.compute(Mc([t],p),{inputs:[t],outputs:[-1,-1,-1]}):[t,o,i],_,I;if(e.doRotary){let A=r.compute(wC(n.batchSize,n.sequenceLength,u,l),{inputs:[u,l],outputs:[-1]})[0],P=r.inputs[7],C=r.inputs[8],R=le({interleaved:e.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:e.scale}),x=[h,A,P,C],B=[-1];_=r.compute(Ja(x,R),{inputs:x,outputs:B})[0],x.splice(0,1,g);let G=le({interleaved:e.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:e.scale});I=r.compute(Ja(x,G),{inputs:x,outputs:B})[0]}let w=qo(r,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,e.doRotary?_:h,void 0,0),v=yv(r,e.doRotary?I:g,n),$=yv(r,b,n);lo(r,w,v,$,void 0,void 0,a,s,void 0,n,u,l)}});var vv,vC,xC,xv,Tv=N(()=>{"use strict";ue();pe();Yn();he();vv=(r,e,n,t,o,i,a,s)=>{let u=Pe(i),l=u===1?"f32":`vec${u}f`,d=u===1?"vec2f":`mat2x${u}f`,p=o*a,h=64;p===1&&(h=256);let g=[o,a,i/u],b=[o,a,2],_=["rank","type","type"],I=[];I.push(...W(g,b));let w=v=>{let $=L("x",e.dataType,3,u),A=L("scale",n.dataType,n.dims),P=L("bias",t.dataType,t.dims),C=V("output",1,3,2),R=[$,A,P,C];return`
  var<workgroup> workgroup_shared : array<${d}, ${h}>;
  const workgroup_size = ${h}u;
  ${v.declareVariables(...R)}
  ${v.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${l}(0);
    var squared_sum = ${l}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${l}(${$.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${d}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Zt("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${Zt("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${s}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return r.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${s};${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:b,dataType:1}],dispatchGroup:{x:p},programUniforms:I}),getShaderSource:w},{inputs:[e,n,t],outputs:[-1]})[0]},vC=(r,e,n)=>{let t=e[0].dims,o=t,i=2,a=t[0],s=t[1],u=D.sizeFromDimension(t,i),l=Pe(u),d=D.size(o)/l,p=vv(r,e[0],e[1],e[2],a,u,s,n.epsilon),h=[a,s,u/l],g=[a,s],b=["type","none"],_=I=>{let w=L("x",e[0].dataType,h.length,l),v=L("scale_shift",1,g.length,2),$=V("output",e[0].dataType,h.length,l),A=[w,v,$];return`
  ${I.registerUniform("output_size","u32").declareVariables(...A)}
  ${I.mainStart()}
  ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${$.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${v.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${w.getByOffset("global_idx")} * ${$.type.value}(scale_shift.x) + ${$.type.value}(scale_shift.y);
      ${$.setByOffset("global_idx","value")};
  }`};r.compute({name:"InstanceNormalization",shaderCache:{hint:`${l}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:[{type:12,data:d},...W(h,g,h)]}),getShaderSource:_},{inputs:[e[0],p]})},xC=(r,e,n)=>{let t=e[0].dims,o=t,i=t[0],a=t[t.length-1],s=D.sizeFromDimension(t,1)/a,u=Pe(a),l=D.size(o)/u,d=[{type:12,data:s},{type:12,data:Math.floor(a/u)}],p=["type","type"],h=!1,g=[0,t.length-1];for(let w=0;w<t.length-2;w++)h=h||t[w+1]!==1,g.push(w+1);h=h&&t[t.length-1]!==1;let b=h?r.compute(lt(r.inputs[0],g),{inputs:[r.inputs[0]],outputs:[-1]})[0]:r.inputs[0].reshape(Array.from({length:t.length},(w,v)=>t[g[v]])),_=vv(r,b,e[1],e[2],i,s,a,n.epsilon),I=w=>{let v=Fe(e[0].dataType),$=u===1?"vec2f":`mat${u}x2f`,A=R=>{let x=R===0?"x":"y",B=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${v}(${B}(scale.${x}))`;case 2:return`vec2<${v}>(${B}(scale[0].${x}, scale[1].${x}))`;case 4:return`vec4<${v}>(${B}(scale[0].${x}, scale[1].${x}, scale[2].${x}, scale[3].${x}))`;default:throw new Error(`Not supported compoents ${u}`)}},P=L("input",e[0].dataType,e[0].dims,u),C=V("output",e[0].dataType,o,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${P.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${$}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${C.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${w.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${A(0)}, ${A(1)});
  }`};r.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:I},{inputs:[e[0],_]})},xv=(r,e)=>{e.format==="NHWC"?xC(r,r.inputs,e):vC(r,r.inputs,e)}});var TC,IC,Iv,Sv=N(()=>{"use strict";ue();pe();he();TC=r=>{if(!r||r.length<2)throw new Error("layerNorm requires at least 2 inputs.")},IC=(r,e,n)=>{let t=e.simplified,o=r[0].dims,i=r[1],a=!t&&r[2],s=o,u=D.normalizeAxis(e.axis,o.length),l=D.sizeToDimension(o,u),d=D.sizeFromDimension(o,u),p=D.size(i.dims),h=a?D.size(a.dims):0;if(p!==d||a&&h!==d)throw new Error(`Size of X.shape()[axis:] == ${d}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${p} and bias size of ${h}`);let g=[];for(let P=0;P<o.length;++P)P<u?g.push(o[P]):g.push(1);let b=Pe(d),_=["type","type"],I=[{type:12,data:l},{type:1,data:d},{type:12,data:Math.floor(d/b)},{type:1,data:e.epsilon}];a&&_.push("type");let w=n>1,v=n>2,$=P=>{let C=Fe(r[0].dataType),R=[L("x",r[0].dataType,r[0].dims,b),L("scale",i.dataType,i.dims,b)];a&&R.push(L("bias",a.dataType,a.dims,b)),R.push(V("output",r[0].dataType,s,b)),w&&R.push(V("mean_data_output",1,g)),v&&R.push(V("inv_std_output",1,g));let x=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${P.registerUniforms(x).declareVariables(...R)}
  ${P.mainStart()}
    ${P.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${xc("f32",b)};
    var mean_square_vector = ${xc("f32",b)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Wr(C,b,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Zt("mean_vector",b)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Zt("mean_square_vector",b)} / uniforms.norm_size ${t?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Wr(C,b,"x[j + offset]")};
      let f32scale = ${Wr(C,b,"scale[j]")};
      output[j + offset] = ${R[0].type.value}((f32input ${t?"":"- mean"}) * inv_std_dev * f32scale
        ${a?`+ ${Wr(C,b,"bias[j]")}`:""}
      );
    }

    ${w?"mean_data_output[global_idx] = mean":""};
    ${v?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},A=[{dims:s,dataType:r[0].dataType}];return w&&A.push({dims:g,dataType:1}),v&&A.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${b};${n};${t}`,inputDependencies:_},getRunData:()=>({outputs:A,dispatchGroup:{x:Math.ceil(l/64)},programUniforms:I}),getShaderSource:$}},Iv=(r,e)=>{TC(r.inputs),r.compute(IC(r.inputs,e,r.outputCount))}});var SC,$v,Av=N(()=>{"use strict";pe();ja();Ka();SC=r=>{if(!r||r.length!==2)throw new Error("MatMul requires 2 inputs.");if(r[0].dims[r[0].dims.length-1]!==r[1].dims[r[1].dims.length-2])throw new Error("shared dimension does not match.")},$v=r=>{SC(r.inputs);let e=Un.calcShape(r.inputs[0].dims,r.inputs[1].dims,!0);if(!e)throw new Error("Can't use matmul on the given tensors");let n=e[e.length-1],t=r.inputs[0].dims[r.inputs[0].dims.length-1];if(n<8&&t<8)r.compute(qa(r.inputs,{activation:""},e));else{let o=e[e.length-2],i=D.size(r.inputs[0].dims.slice(0,-2)),a=D.size(r.inputs[1].dims.slice(0,-2));if(i!==1&&o===1&&a===1){let s=r.inputs[0].reshape([1,i,t]),u=r.inputs[1].reshape([1,t,n]),l=[1,i,n],d=[s,u];r.compute(Ho(d,{activation:""},e,l),{inputs:d})}else r.compute(Ho(r.inputs,{activation:""},e))}}});var $C,AC,OC,Ov,Pv,Ev=N(()=>{"use strict";ue();pe();Qe();he();$C=(r,e)=>{if(r.length<3||r.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let n=r[0],t=n.dims.length;if(n.dims[t-1]!==e.k)throw new Error("The last dim of input shape does not match the k value");let o=Math.floor((e.k+e.blockSize-1)/e.blockSize),i=e.blockSize/8*e.bits,a=r[1];if(!D.areEqual(a.dims,[e.n,o,i]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=r[2].dims;if(D.size(u)!==e.n*o)throw new Error("scales input size error.");if(r.length===4){let d=r[3].dims,p=e.n*(e.bits===8?o:Math.floor((o*e.bits+7)/8));if(D.size(d)!==p)throw new Error("zeroPoints input size error.")}},AC=(r,e)=>{let n=r[0].dims,t=n.length,o=n[t-2],i=e.k,a=e.n,s=n.slice(0,t-2),u=D.size(s),d=r[1].dims[2]/4,p=r[0].dataType,h=Pe(e.k),g=Pe(d),b=Pe(a),_=s.concat([o,a]),I=o>1&&a/b%2===0?2:1,w=D.size(_)/b/I,v=64,$=[],A=[u,o,i/h],P=D.convertShape(r[1].dims).slice();P.splice(-1,1,d/g),$.push(...W(A)),$.push(...W(P)),$.push(...W(r[2].dims)),r.length===4&&$.push(...W(D.convertShape(r[3].dims)));let C=[u,o,a/b];$.push(...W(C));let R=x=>{let B=A.length,G=L("a",r[0].dataType,B,h),Y=L("b",12,P.length,g),J=L("scales",r[2].dataType,r[2].dims.length),ie=[G,Y,J],z=r.length===4?L("zero_points",12,r[3].dims.length):void 0;z&&ie.push(z);let U=C.length,te=V("output",r[0].dataType,U,b),oe=Fe(r[0].dataType),ee=(()=>{switch(h){case 1:return`array<${oe}, 8>`;case 2:return`mat4x2<${oe}>`;case 4:return`mat2x4<${oe}>`;default:throw new Error(`${h}-component is not supported.`)}})(),de=Math.floor(32/e.bits),ge=Math.floor(de/8),Ie=()=>{let F="";for(let q=0;q<ge;q++){let Ne=q*e.bits*4,rt=Ne+e.bits;F+=`
          // reuse a data (pass ${q})
            var input_offset${q>0?q:""} = ${q===0?G.indicesToOffset(`${G.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${q>0?q:""}: ${ee};
            for (var j${q>0?q:""}: u32 = 0; j${q>0?q:""} < ${8/h}; j${q>0?q:""}++) {
              a_data${q>0?q:""}[j${q>0?q:""}] = ${G.getByOffset(`input_offset${q>0?q:""}`)};
              input_offset${q>0?q:""}++;
            }
          `;for(let Ge=0;Ge<b*I;Ge++)F+=`
            b_value = ${g===1?`b${Ge}_data`:`b${Ge}_data[i]`};
            ${e.bits===2?`{
              let half_word = b_value >> ${q*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Ne}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${rt}u) & b_mask);`}
            b_quantized_values = ${ee}(${Array.from({length:4},(at,Ee)=>`${oe}(b_value_lower[${Ee}]), ${oe}(b_value_upper[${Ee}])`).join(", ")});
            b_dequantized_values = ${h===1?`${ee}(${Array.from({length:8},(at,Ee)=>`(b_quantized_values[${Ee}] - ${z?`zero_point${Ge}`:"zero_point"}) * scale${Ge}`).join(", ")});`:`(b_quantized_values - ${ee}(${Array(8).fill(`${z?`zero_point${Ge}`:"zero_point"}`).join(",")})) * scale${Ge};`};
            workgroup_shared[local_id.x * ${I} + ${Math.floor(Ge/b)}]${b>1?`[${Ge%b}]`:""} += ${Array.from({length:8/h},(at,Ee)=>`${h===1?`a_data${q>0?q:""}[${Ee}] * b_dequantized_values[${Ee}]`:`dot(a_data${q>0?q:""}[${Ee}], b_dequantized_values[${Ee}])`}`).join(" + ")};
          `}return F},mt=()=>{let F=`
            var col_index = col * ${b};
            ${z?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/e.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,e.bits-1)} for unsigned ${e.bits}-bit quantization.
            let zero_point = ${oe}(${Math.pow(2,e.bits-1).toFixed(1)});`}
            `;for(let q=0;q<b*I;q++)F+=`
            let scale${q} = ${J.getByOffset("col_index * nBlocksPerCol + block")};
            ${z?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${e.bits}u);
            zero_point_word = ${z.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${q} = ${oe}((zero_point_word) & ${e.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return F},Ve=()=>{let F=`col_index = col * ${b};`;for(let q=0;q<b*I;q++)F+=`
            let b${q}_data = ${Y.getByIndices(`${Y.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return F+=`
            var b_value: u32;
            let b_mask: u32 = ${e.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${ee};
            var b_dequantized_values: ${ee};`,F};return`
        var<workgroup> workgroup_shared: array<${te.type.value}, ${I*v}>;
        ${x.declareVariables(...ie,te)}
        ${x.mainStart([v,1,1])}
          let output_indices = ${te.offsetToIndices(`(global_idx / ${v}) * ${I}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${v}) {
            //process one block
            var word_offset: u32 = block * ${e.blockSize/h};
            ${mt()}
            for (var word: u32 = 0; word < ${d}; word += ${g}) {
              ${Ve()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${Ie()}
                word_offset += ${de/h};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${I}) {
            var output_value: ${te.type.value} = ${te.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${v}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${I};
            }
            ${te.setByIndices(`${te.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${e.blockSize};${e.bits};${h};${g};${b};${I};${v}`,inputDependencies:Array(r.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:p}],dispatchGroup:{x:w},programUniforms:$}),getShaderSource:R}},OC=(r,e)=>{let n=r[0].dims,t=n.length,o=n[t-2],i=e.k,a=e.n,s=n.slice(0,t-2),u=D.size(s),d=r[1].dims[2]/4,p=r[0].dataType,h=Pe(e.k),g=Pe(d),b=s.concat([o,a]),_=128,I=a%8===0?8:a%4===0?4:1,w=_/I,v=Math.floor(32/e.bits),$=w*g*v,A=$/h,P=$/e.blockSize,C=D.size(b)/I,R=[],x=[u,o,i/h],B=D.convertShape(r[1].dims).slice();B.splice(-1,1,d/g),R.push(...W(x)),R.push(...W(B)),R.push(...W(r[2].dims)),r.length===4&&R.push(...W(D.convertShape(r[3].dims)));let G=[u,o,a];R.push(...W(G));let Y=J=>{let ie=x.length,z=L("a",r[0].dataType,ie,h),U=L("b",12,B.length,g),te=L("scales",r[2].dataType,r[2].dims.length),oe=[z,U,te],ee=r.length===4?L("zero_points",12,r[3].dims.length):void 0;ee&&oe.push(ee);let de=G.length,ge=V("output",r[0].dataType,de),Ie=Fe(r[0].dataType),mt=()=>{switch(h){case 1:return`
          let a_data0 = vec4<${Ie}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${Ie}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${Ie}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${Ie}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${h}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${z.type.value}, ${A}>;
        var<workgroup> inter_results: array<array<${ge.type.value}, ${w}>, ${I}>;
        ${J.declareVariables(...oe,ge)}
        ${J.mainStart([w,I,1])}
          let output_indices = ${ge.offsetToIndices(`workgroup_index * ${I}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${P} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${A};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${A}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${z.getByIndices(`${z.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${z.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${P} + local_id.x;
            ${ee?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/e.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${e.bits}u);
            let zero_point_word = ${ee.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${Ie}((zero_point_word) & ${e.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,e.bits-1)} for unsigned ${e.bits}-bit quantization.
            let zero_point = ${Ie}(${Math.pow(2,e.bits-1).toFixed(1)});`}
            let scale = ${te.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${U.getByIndices(`${U.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${e.blockSize/h};
            for (var i: u32 = 0; i < ${g}; i++) {
              let b_value = ${g===1?"b_data":"b_data[i]"};
              ${(()=>{let Ve=Math.floor(v/8),F="";for(let q=0;q<Ve;q++){let Ne=q*e.bits*4,rt=Ne+e.bits;F+=`
              ${mt()}
              {${e.bits===2?`
                let half_word = b_value >> ${q*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Ne}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${rt}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${Ie}>(${Array.from({length:4},(Ge,at)=>`${Ie}(b_value_lower[${at}]), ${Ie}(b_value_upper[${at}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${Ie}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Ge,at)=>`${`dot(a_data${at}, b_dequantized_values[${at}])`}`).join(" + ")};
              }
              word_offset += ${8/h};`}return F})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${I}) {
            var output_value: ${ge.type.value} = ${ge.type.value}(0);
            for (var b = 0u; b < ${w}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ge.setByIndices(`${ge.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${e.blockSize};${h};${g};${w};${I}`,inputDependencies:Array(r.length).fill("rank")},getRunData:()=>({outputs:[{dims:b,dataType:p}],dispatchGroup:{x:C},programUniforms:R}),getShaderSource:Y}},Ov=(r,e)=>{$C(r.inputs,e),e.blockSize===32&&r.adapterInfo.isVendor("intel")&&r.adapterInfo.isArchitecture("gen-12lp")?r.compute(OC(r.inputs,e)):r.compute(AC(r.inputs,e))},Pv=r=>le(r)});var PC,EC,CC,DC,kC,NC,LC,RC,Cv,Dv=N(()=>{"use strict";ue();pe();he();PC=r=>{if(!r||r.length<1)throw new Error("Too few inputs");if(r[0].dataType!==1&&r[0].dataType!==10)throw new Error("Input type must be float or float16.");if(r.length>=2){let e=r[0].dims.length*2===r[1].dims[0];if(r.length===4&&(e=r[3].dims[0]*2===r[1].dims[0]),!e)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},EC=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
            k = i32(${r.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Q("uniforms.x_shape",o,e)})) {
              break;
            }
            offset += k * i32(${Q("uniforms.x_strides",o,e)});
        `;return`
          value = ${r.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${t}
            value = x[offset];
          }
      `},CC=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
                k = i32(${r.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Q("uniforms.x_shape",o,e)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Q("uniforms.x_shape",o,e)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Q("uniforms.x_strides",o,e)});
            `;return`
              var offset = 0;
              var k = 0;
              ${t}
              value = x[offset];
          `},DC=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
                k = i32(${r.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Q("uniforms.x_shape",o,e)})) {
                  k = i32(${Q("uniforms.x_shape",o,e)}) - 1;
                }
                offset += k * i32(${Q("uniforms.x_strides",o,e)});
            `;return`
              var offset = 0;
              var k = 0;
              ${t}
              value = x[offset];
          `},kC=(r,e,n)=>{let t="";for(let o=e-1;o>=0;--o)t+=`
                k = i32(${r.indicesGet("indices",o)}) - ${Q("uniforms.pads",o,n)};
                if (k < 0)  {
                  k += i32(${Q("uniforms.x_shape",o,e)}]);
                }
                if (k >= i32(${Q("uniforms.x_shape",o,e)})) {
                  k -= i32(${Q("uniforms.x_shape",o,e)});
                }
                offset += k * i32(${Q("uniforms.x_strides",o,e)});
            `;return`
              var offset = 0;
              var k = 0;
              ${t}
              value = x[offset];
          `},NC=(r,e,n)=>{switch(n.mode){case 0:return EC(r,e,n.pads.length);case 1:return CC(r,e,n.pads.length);case 2:return DC(r,e,n.pads.length);case 3:return kC(r,e,n.pads.length);default:throw new Error("Invalid mode")}},LC=(r,e)=>{let n=D.padShape(r[0].dims.slice(),e.pads),t=r[0].dims,o=D.size(n),i=[{type:12,data:o},{type:6,data:e.pads}],a=r.length>=3&&r[2].data;e.mode===0&&i.push({type:a?r[2].dataType:1,data:e.value}),i.push(...W(r[0].dims,n));let s=["rank"],u=l=>{let d=V("output",r[0].dataType,n.length),p=L("x",r[0].dataType,t.length),h=p.type.value,g=NC(d,t.length,e),b=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:e.pads.length}];return e.mode===0&&b.push({name:"constant_value",type:a?h:"f32"}),`
            ${l.registerUniforms(b).declareVariables(p,d)}
            ${l.mainStart()}
            ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${d.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${e.mode}${a}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:n,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(D.size(n)/64)},programUniforms:i}),getShaderSource:u}},RC=(r,e)=>{if(r.length>1){let n=r[1].getBigInt64Array(),t=r.length>=3&&r[2].data?r[2].dataType===10?r[2].getUint16Array()[0]:r[2].getFloat32Array()[0]:0,o=r[0].dims.length,i=new Int32Array(2*o).fill(0);if(r.length>=4){let s=r[3].getBigInt64Array();for(let u=0;u<s.length;u++)i[Number(s[u])]=Number(n[u]),i[Number(s[u])+o]=Number(n[u+s.length])}else n.forEach((s,u)=>i[Number(u)]=Number(s));let a=[];return i.forEach(s=>a.push(s)),{mode:e.mode,value:t,pads:a}}else return e},Cv=(r,e)=>{PC(r.inputs);let n=RC(r.inputs,e);r.compute(LC(r.inputs,n),{inputs:[0]})}});var Qa,kv,Nv,Lv,Rv,zC,MC,zv,Mv,Bv,Fv,Vv,Gv,Uv,Wv,Hv,qv,jv,Kv,Xv=N(()=>{"use strict";ft();ue();pe();he();Qa=r=>{if(ce.webgpu.validateInputContent&&(!r||r.length!==1))throw new Error("Pool ops requires 1 input.")},kv=(r,e,n)=>{let t=e.format==="NHWC",o=r.dims.slice();t&&o.splice(1,0,o.pop());let i=Object.hasOwnProperty.call(e,"dilations"),a=e.kernelShape.slice(),s=e.strides.slice(),u=i?e.dilations.slice():[],l=e.pads.slice();Gr.adjustPoolAttributes(n,o,a,s,u,l);let d=Gr.computePoolOutputShape(n,o,s,u,a,l,e.autoPad),p=Object.assign({},e);i?Object.assign(p,{kernelShape:a,strides:s,pads:l,dilations:u,cacheKey:e.cacheKey}):Object.assign(p,{kernelShape:a,strides:s,pads:l,cacheKey:e.cacheKey});let h=d.slice();return h.push(h.splice(1,1)[0]),[p,t?h:d]},Nv=(r,e)=>{let n=e.format==="NHWC",t=D.size(r),o=D.size(e.kernelShape),i=[{type:12,data:t},{type:12,data:o}],a=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(e.kernelShape.length<=2){let s=e.kernelShape[e.kernelShape.length-1],u=e.strides[e.strides.length-1],l=e.pads[e.pads.length/2-1],d=e.pads[e.pads.length-1],p=!!(l+d);i.push({type:12,data:s},{type:12,data:u},{type:12,data:l},{type:12,data:d}),a.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(e.kernelShape.length===2){let g=e.kernelShape[e.kernelShape.length-2],b=e.strides[e.strides.length-2],_=e.pads[e.pads.length/2-2],I=e.pads[e.pads.length-2];h=!!(_+I),i.push({type:12,data:g},{type:12,data:b},{type:12,data:_},{type:12,data:I}),a.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[i,a,!0,p,h]}else{if(n)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let s=D.computeStrides(e.kernelShape);i.push({type:12,data:s},{type:12,data:e.pads},{type:12,data:e.strides}),a.push({name:"kernelStrides",type:"u32",length:s.length},{name:"pads",type:"u32",length:e.pads.length},{name:"strides",type:"u32",length:e.strides.length});let u=e.pads.reduce((l,d)=>l+d);return[i,a,!!u,!1,!1]}},Lv=(r,e,n,t,o,i,a,s,u,l,d,p)=>{let h=o.format==="NHWC",g=e.type.value,b=V("output",e.type.tensor,t);if(o.kernelShape.length<=2){let _="",I="",w="",v=n-(h?2:1);if(d?_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${v}] < 0 || xIndices[${v}]
                      >= uniforms.x_shape[${v}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${e.indicesToOffset("xIndices")}];
                  ${i}
                }`:_=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${v}] = indices[${v}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${e.indicesToOffset("xIndices")}];
                  ${i}
                }`,o.kernelShape.length===2){let A=n-(h?3:2);p?I=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${A}] = indices[${A}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${A}] < 0 || xIndices[${A}] >= uniforms.x_shape[${A}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:I=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${A}] = indices[${A}] * uniforms.sh - uniforms.phStart + j;
                `,w=`
              }
            `}return`
            ${r.registerUniforms(u).declareVariables(e,b)}

            ${r.mainStart()}
              ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${b.offsetToIndices("global_idx")};
              var xIndices = ${b.offsetToIndices("global_idx")};

              var value = ${g}(${s});
              var pad = 0;
              ${I}
              ${_}
              ${w}
              ${a}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let _=o.kernelShape.length,I=o.pads.length,w="";return l?w=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${e.indicesToOffset("xIndices")}];
                ${i}
              }`:w=`
              }
              let x_val = x[${e.indicesToOffset("xIndices")}];
              ${i}
            `,`
            ${r.registerUniforms(u).declareVariables(e,b)}

            ${r.mainStart()}
              ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${b.offsetToIndices("global_idx")};
              var xIndices = ${b.offsetToIndices("global_idx")};

              var offsets: array<u32, ${_}>;

              var value = ${g}(${s});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${_-1}u; j++) {
                  offsets[j] = offset / ${Q("uniforms.kernelStrides","j",_)};
                  offset -= offsets[j] * ${Q("uniforms.kernelStrides","j",_)};
                }
                offsets[${_-1}] = offset;

                isPad = false;
                for (var j = ${n-_}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${Q("uniforms.strides",`j - ${n-_}u`,_)}
                    + offsets[j - ${n-_}u] - ${Q("uniforms.pads","j - 2u",I)};
                  ${w}
              }
              ${a}

              output[global_idx] = value;
            }`}},Rv=r=>`${r.format};${r.ceilMode};${r.autoPad};${r.kernelShape.length}`,zC=r=>`${Rv(r)};${r.countIncludePad}`,MC=r=>`${Rv(r)};${r.storageOrder};${r.dilations}`,zv=r=>({format:r.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][r.auto_pad],ceilMode:r.ceil_mode,kernelShape:r.kernel_shape,strides:r.strides,pads:r.pads}),Mv=(r,e,n,t)=>{let[o,i]=kv(e,t,n),a=L("x",e.dataType,e.dims.length),s=a.type.value,u="value += x_val;",l="";o.countIncludePad?l+=`value /= ${s}(uniforms.kernelSize);`:l+=`value /= ${s}(i32(uniforms.kernelSize) - pad);`;let[d,p,h,g,b]=Nv(i,o);d.push(...W(e.dims,i));let _=["rank"];return{name:r,shaderCache:{hint:`${t.cacheKey};${h};${g};${b}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(D.size(i)/64)},programUniforms:d}),getShaderSource:I=>Lv(I,a,e.dims.length,i.length,o,u,l,0,p,h,g,b)}},Bv=r=>{let e=r.count_include_pad!==0,n=zv(r);if(n.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let t={countIncludePad:e,...n,cacheKey:""};return{...t,cacheKey:zC(t)}},Fv=(r,e)=>{Qa(r.inputs),r.compute(Mv("AveragePool",r.inputs[0],!1,e))},Vv={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Gv=r=>{let e=r.format;return{format:e,...Vv,cacheKey:e}},Uv=(r,e)=>{Qa(r.inputs),r.compute(Mv("GlobalAveragePool",r.inputs[0],!0,e))},Wv=(r,e,n,t)=>{let[o,i]=kv(e,t,n),a=`
      value = max(x_val, value);
    `,s="",u=L("x",e.dataType,e.dims.length),l=["rank"],[d,p,h,g,b]=Nv(i,o);return d.push(...W(e.dims,i)),{name:r,shaderCache:{hint:`${t.cacheKey};${h};${g};${b}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:i,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(D.size(i)/64)},programUniforms:d}),getShaderSource:_=>Lv(_,u,e.dims.length,i.length,o,a,s,e.dataType===10?-65504:-1e5,p,h,g,b)}},Hv=(r,e)=>{Qa(r.inputs),r.compute(Wv("MaxPool",r.inputs[0],!1,e))},qv=r=>{let e=r.storage_order,n=r.dilations,t=zv(r);if(e!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(t.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let o={storageOrder:e,dilations:n,...t,cacheKey:""};return{...o,cacheKey:MC(o)}},jv=r=>{let e=r.format;return{format:e,...Vv,cacheKey:e}},Kv=(r,e)=>{Qa(r.inputs),r.compute(Wv("GlobalMaxPool",r.inputs[0],!0,e))}});var FC,VC,Zv,Jv,Qv=N(()=>{"use strict";ue();pe();Qe();he();FC=(r,e)=>{if(r.length<2||r.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(r.length===3&&r[1].dims===r[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(r.length===3&&r[0].dataType!==r[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(r[1].dims.length!==0&&r[1].dims.length!==1&&r[1].dims.length!==r[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(r.length>2){if(r[0].dataType!==r[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(r[1].dims.length!==r[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!r[1].dims.map((n,t)=>n===r[2].dims[t]).reduce((n,t)=>n&&t,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(e.blockSize>0){if(r[1].dims.length===0||r[1].dims.length===1&&r[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!r[1].dims.map((o,i)=>i===e.axis||o===r[0].dims[i]).reduce((o,i)=>o&&i,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(r[1].dims.length!==r[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let n=r[0].dims[e.axis],t=r[1].dims[e.axis];if(e.blockSize<Math.ceil(n/t)||e.blockSize>Math.ceil(n/(t-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},VC=(r,e)=>{let n=D.normalizeAxis(e.axis,r[0].dims.length),t=r[0].dataType,o=t===3,i=r[0].dims,a=r[1].dataType,s=D.size(i),u=t===3||t===2,l=u?[Math.ceil(D.size(r[0].dims)/4)]:r[0].dims,d=r[1].dims,p=r.length>2?r[2]:void 0,h=p?u?[Math.ceil(D.size(p.dims)/4)]:p.dims:void 0,g=d.length===0||d.length===1&&d[0]===1,b=g===!1&&d.length===1,_=Pe(s),I=g&&(!u||_===4),w=I?_:1,v=I&&!u?_:1,$=L("input",u?12:t,l.length,v),A=L("scale",a,d.length),P=p?L("zero_point",u?12:t,h.length):void 0,C=V("output",a,i.length,w),R=[$,A];P&&R.push(P);let x=[l,d];p&&x.push(h);let B=[{type:12,data:s/w},{type:12,data:n},{type:12,data:e.blockSize},...W(...x,i)],G=Y=>{let J=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${Y.registerUniforms(J).declareVariables(...R,C)}
      ${Y.mainStart()}
          ${Y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${$.getByOffset("global_idx / 4")};
            let x_vec = ${o?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${w===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${$.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${A.getByOffset("0")}`:b?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${A.getByOffset("scale_index")};`:`
            var scale_indices: ${A.type.indices} = output_indices;
            let index = ${A.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${A.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${A.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${P?g?u?`
                let zero_point_input = ${P.getByOffset("0")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${P.getByOffset("0")}`:b?u?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${P.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${P.getByOffset("zero_point_index")};`:u?`
                let zero_point_offset = ${A.indicesToOffset("scale_indices")};
                let zero_point_input = ${P.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${P.getByIndices("scale_indices")};`:`let zero_point_value = ${u?o?"i32":"u32":$.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:e.cacheKey,inputDependencies:P?["rank","rank","rank"]:["rank","rank"]},getShaderSource:G,getRunData:()=>({outputs:[{dims:i,dataType:a}],dispatchGroup:{x:Math.ceil(s/w/64),y:1,z:1},programUniforms:B})}},Zv=(r,e)=>{FC(r.inputs,e),r.compute(VC(r.inputs,e))},Jv=r=>le({axis:r.axis,blockSize:r.blockSize})});var GC,UC,Yv,ex=N(()=>{"use strict";ft();ue();he();GC=(r,e,n)=>{let t=r===e,o=r<e&&n<0,i=r>e&&n>0;if(t||o||i)throw new Error("Range these inputs' contents are invalid.")},UC=(r,e,n,t)=>{let o=Math.abs(Math.ceil((e-r)/n)),i=[o],a=o,s=[{type:12,data:a},{type:t,data:r},{type:t,data:n},...W(i)],u=l=>{let d=V("output",t,i.length),p=d.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:p},{name:"delta",type:p}];return`
        ${l.registerUniforms(h).declareVariables(d)}
        ${l.mainStart()}
        ${l.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${p}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${t}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:s})}},Yv=r=>{let e=0,n=0,t=0;r.inputs[0].dataType===6?(e=r.inputs[0].getInt32Array()[0],n=r.inputs[1].getInt32Array()[0],t=r.inputs[2].getInt32Array()[0]):r.inputs[0].dataType===1&&(e=r.inputs[0].getFloat32Array()[0],n=r.inputs[1].getFloat32Array()[0],t=r.inputs[2].getFloat32Array()[0]),ce.webgpu.validateInputContent&&GC(e,n,t),r.compute(UC(e,n,t,r.inputs[0].dataType),{inputs:[]})}});var WC,HC,tx,nx,rx=N(()=>{"use strict";ue();pe();Qe();he();WC=(r,e,n,t)=>{if(r!=="none"&&t!=="i32"&&t!=="u32"&&t!=="f32")throw new Error(`Input ${t} is not supported with reduction ${r}.`);let o=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,i=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${e}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(r){case"none":return`${e}=${n};`;case"add":return t==="i32"||t==="u32"?`atomicAdd(&${e}, bitcast<${t}>(${n}));`:`
              ${o}bitcast<${t}>(oldValue) + (${n})${i}`;case"max":return t==="i32"||t==="u32"?`atomicMax(&${e}, bitcast<${t}>(${n}));`:`
                ${o}max(bitcast<f32>(oldValue), (${n}))${i}`;case"min":return t==="i32"||t==="u32"?`atomicMin(&${e}, bitcast<${t}>(${n}));`:`${o}min(bitcast<${t}>(oldValue), (${n}))${i}`;case"mul":return`${o}(bitcast<${t}>(oldValue) * (${n}))${i}`;default:throw new Error(`Reduction ${r} is not supported.`)}},HC=(r,e)=>{let n=r[0].dims,t=r[1].dims,o=n,i=1,a=Math.ceil(D.sizeToDimension(t,t.length-1)/i),s=t[t.length-1],u=D.sizeFromDimension(n,s),l=[{type:12,data:a},{type:12,data:s},{type:12,data:u},...W(r[1].dims,r[2].dims,o)],d=p=>{let h=L("indices",r[1].dataType,r[1].dims.length),g=L("updates",r[2].dataType,r[2].dims.length,i),b=e.reduction!=="none"&&e.reduction!==""?P_("output",r[0].dataType,o.length):V("output",r[0].dataType,o.length,i);return`
      ${p.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(h,g,b)}
      ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${r[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${WC(e.reduction,"output[data_offset + i]","value",b.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${e.cacheKey}_${e.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:o,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:l}),getShaderSource:d}},tx=r=>le({reduction:r.reduction}),nx=(r,e)=>{r.compute(HC(r.inputs,e),{inputs:[r.inputs[1],r.inputs[2]],outputs:[]})}});var qC,jC,KC,ox,XC,ZC,JC,QC,YC,eD,tD,nD,ix,rD,oD,iD,aD,sD,ax,sx,ux=N(()=>{"use strict";ue();pe();Qe();he();qC=(r,e)=>{if(r.every(n=>n>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),r.length>0){if(e.mode==="linear"){if(!(r.length===2||r.length===3||r.length===4&&r[0]===1&&r[1]===1||r.length===4&&r[0]===1&&r[3]===1||r.length===5&&r[0]===1&&r[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(e.mode==="cubic"&&!(r.length===2||r.length===4&&r[0]===1&&r[1]===1||r.length===4&&r[0]===1&&r[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},jC=(r,e,n)=>{e.every(o=>o>=0&&o<n||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let t=new Array(n).fill(1);return e.forEach((o,i)=>t[o]=r[i]),t},KC=(r,e,n,t,o,i)=>{let[a,s,u]=n>10?[1,2,3]:[-1,r.length>1?1:-1,-1],l=r[0].dims.length;if(a>0&&r.length>a&&r[a].dims.length>0)r[a].getFloat32Array().forEach(d=>i.push(d));else if(e.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(s>0&&r.length>s&&r[s].dims.length===1&&r[s].dims[0]>0){if(r[s].getFloat32Array().forEach(d=>t.push(d)),t.length!==0&&t.length!==l&&n>=18&&t.length!==e.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");qC(t,e),e.axes.length>0&&jC(t,e.axes,l).forEach((d,p)=>t[p]=d)}if(u>0&&r.length>u&&r[u].dims.length===1&&r[u].dims[0]>0&&(r[u].getBigInt64Array().forEach(d=>o.push(Number(d))),o.length!==0&&o.length!==l&&n>=18&&o.length!==e.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(e.axes.length>0){if(t.length!==0&&t.length!==e.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(o.length!==0&&o.length!==e.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof t<"u"&&typeof o<"u"&&t.length>0&&o.length>l)throw new Error("Resize requires only of scales or sizes to be specified")},ox=(r,e,n,t)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${r}) * (${e});
  let whole = ${t}(big / (${n}));
  let fract = ${t}(big % (${n})) / ${t}(${n});
  return whole + fract;
`,XC=(r,e)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${e} { `+(()=>{switch(r){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${e}(xResized) / ${e}(xScale);
          } else {
            ${ox("xResized","lengthOriginal","lengthResized",e)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${e}(xResized) + 0.5) / ${e}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${e}(xResized) + 0.5) / ${e}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ox("xResized","lengthOriginal - 1","lengthResized - 1",e)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${e}(roiStart) * ${e}(lengthOriginal - 1) +
                        (${e}(xResized) * ${e}(roiEnd - roiStart) * ${e}(lengthOriginal - 1)) /
                        ${e}(lengthResized - 1);
                  } else {
                    return 0.5 * ${e}(roiStart + roiEnd) * ${e}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${e}xScale * ${e}(lengthResized);
                  const adjustment = ${e}(lengthResized) / outputWidth;
                  const center = ${e}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${e}(xResized) + 0.5) / ${e}(xScale)) - 0.5;`;case"half_pixel":return`return ((${e}(xResized) + 0.5) / ${e}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${r} is not supported`)}})()+"}",ZC=(r,e,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(r){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(e<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${r} is not supported`)}})()+"}",JC=(r,e,n)=>{let t=new Array(n).fill(0).concat(new Array(n).fill(1)),o=r.length===0?t:r.slice();return e.length>0?(e.forEach((i,a)=>{t[i]=o[a],t[a+n]=o[e.length+a]}),t):o},QC=(r,e,n,t)=>{let o=[];if(n.length>0)if(t.length>0){if(r.forEach(i=>o.push(i)),Math.max(...t)>r.length)throw new Error("axes is out of bound");t.forEach((i,a)=>o[i]=n[a])}else n.forEach(i=>o.push(i));else{if(e.length===0)throw new Error("Resize requires either scales or sizes.");o=r.map((i,a)=>Math.round(i*e[a]))}return o},YC=(r,e,n)=>{let t=(()=>{switch(n.keepAspectRatioPolicy){case"not_larger":return n.axes.length>0?Math.min(...n.axes.map(i=>e[i]),Number.MAX_VALUE):Math.min(...e,Number.MAX_VALUE);case"not_smaller":return n.axes.length>0?Math.max(...n.axes.map(i=>e[i]),Number.MIN_VALUE):Math.max(...e,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();e.fill(1,0,e.length);let o=r.slice();return n.axes.length>0?(n.axes.forEach(i=>e[i]=t),n.axes.forEach(i=>o[i]=Math.round(r[i]*e[i]))):(e.fill(t,0,e.length),o.forEach((i,a)=>o[a]=Math.round(i*e[a]))),o},eD=(r,e,n,t,o)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${r.type.indices}) -> array<${r.type.value}, ${n.length}> {
      var original_indices: array<${r.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${r.indicesGet("output_indices","i")};
        var scale = ${Q("uniforms.scales","i",t)};
        var roi_low = ${Q("uniforms.roi","i",o)};
        var roi_hi = ${Q("uniforms.roi",`i + ${e.length}`,o)};
        if (scale == 1.0) {
          original_indices[i] = ${r.type.value}(output_index);
        } else {
          var input_shape_i = ${Q("uniforms.input_shape","i",e.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,tD=(r,e,n,t,o,i,a)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> ${r.type.indices} {
      var input_indices: ${r.type.indices};
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Q("uniforms.scales","i",o)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Q("uniforms.roi","i",i)};
          var roi_hi = ${Q("uniforms.roi",`i + ${n.length}`,i)};
          var input_shape_i = ${Q("uniforms.input_shape","i",n.length)};
          var output_shape_i = ${Q("uniforms.output_shape","i",t.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${a} || (original_idx >= 0 && original_idx < ${e.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${e.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${r.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,nD=(r,e)=>`
    fn checkInputIndices(input_indices: ${r.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${e.length}; i++) {
        var input_index = ${r.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Q("uniforms.input_shape","i",e.length)}) {
          return false;
        }
      }
      return true;
    }`,ix=(r,e,n,t)=>r.rank>t?`
    ${r.indicesSet("input_indices",e,"channel")};
    ${r.indicesSet("input_indices",n,"batch")};
`:"",rD=(r,e,n,t,o)=>{let[a,s,u,l]=n.length===2?[-1,0,1,-1]:[0,2,3,1],d=r.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${r.type.indices};
      ${r.indicesSet("input_indices",s,`max(0, min(row, ${n[s]} - 1))`)};
      ${r.indicesSet("input_indices",u,`max(0, min(col, ${n[u]} - 1))`)};
      ${ix(r,l,a,2)}
      return ${r.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${e.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${t?`if (row < 0 || row > (${n[s]} - 1) || col < 0 || col > (${n[u]} - 1)) {
        return ${o};
      }`:""};
      row = max(0, min(row, ${n[s]} - 1));
      col = max(0, min(col, ${n[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},oD=(r,e,n,t,o,i,a,s,u,l)=>{let d=n.length===2,p=!0,[h,g]=d?[0,1]:p?[2,3]:[1,2],b=r.type.value,_=I=>{let w=I===h?"row":"col";return`
      fn ${w}CubicInterpolation(input_indices: ${r.type.indices}, output_indices: ${e.type.indices}) -> ${b} {
        var output_index = ${e.indicesGet("output_indices",I)};
        var originalIdx: ${b} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[I]},
        ${t[I]}, ${n[I]}, ${i[I]}, ${i[I]} + ${n.length});
        var fractOriginalIdx: ${b} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${s} && (originalIdx < 0 || originalIdx > (${n[I]} - 1))) {
          return ${u};
        }
        var data: array<${b}, 4> = array<${b}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${w}: ${b} = originalIdx + ${b}(i);
          if (${w} < 0 || ${w} >= ${n[I]}) {
            ${l?`coefs[i + 1] = 0.0;
                        continue;`:s?`return ${u};`:`${w} = max(0, min(${w}, ${n[I]} - 1));`};
          }
        var input_indices_copy: ${r.type.indices} = input_indices;
          ${r.indicesSet("input_indices_copy",I,`u32(${w})`)};
          data[i + 1] = ${I===h?r.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(h)};
    ${_(g)};
  fn getCubicInterpolationCoefs(s: ${b}) -> array<${b}, 4> {
    var absS = abs(s);
    var coeffs: array<${b}, 4> = array<${b}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${b} = 1.0 - absS;
    var twoMinusAbsS: ${b} = 2.0 - absS;
    var onePlusAbsS: ${b} = 1.0 + absS;
    coeffs[0] = ((${a} * onePlusAbsS - 5 * ${a}) * onePlusAbsS + 8 * ${a}) * onePlusAbsS - 4 * ${a};
    coeffs[1] = ((${a} + 2) * absS - (${a} + 3)) * absS * absS + 1;
    coeffs[2] = ((${a} + 2) * oneMinusAbsS - (${a} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${a} * twoMinusAbsS - 5 * ${a}) * twoMinusAbsS + 8 * ${a}) * twoMinusAbsS - 4 * ${a};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${b}, 4>, coefs: array<${b}, 4>) -> ${b} {
    var coefsSum: ${b} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${e.type.indices}) -> ${b} {
    var input_indices: ${r.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},iD=(r,e,n,t,o)=>{let[a,s,u,l,d]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],p=r.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${p} {
      var input_indices: ${r.type.indices};
      ${r.indicesSet("input_indices",s,`max(0, min(depth, ${n[s]} - 1))`)};
      ${r.indicesSet("input_indices",u,`max(0, min(height, ${n[u]} - 1))`)};
      ${r.indicesSet("input_indices",l,`max(0, min(width, ${n[l]} - 1))`)};
      ${ix(r,d,a,3)}
      return ${r.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${e.type.indices}) -> ${p} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${p} = originalIndices[${s}];
      var height:${p} = originalIndices[${u}];
      var width:${p} = originalIndices[${l}];
      ${t?`if (depth < 0 || depth > (${n[s]} - 1) || height < 0 || height > (${n[u]} - 1) || width < 0 || (width > ${n[l]} - 1)) {
      return ${o};
        }`:""};

    depth = max(0, min(depth, ${n[s]} - 1));
      height = max(0, min(height, ${n[u]} - 1));
      width = max(0, min(width, ${n[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${p} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${p} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${p} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${p} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${p} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${p} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${p} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${p} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${p} = abs(depth - ${p}(depth1));
      var dx2: ${p} = abs(${p}(depth2) - depth);
      var dy1: ${p} = abs(height - ${p}(height1));
      var dy2: ${p} = abs(${p}(height2) - height);
      var dz1: ${p} = abs(width - ${p}(width1));
      var dz2: ${p} = abs(${p}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},aD=(r,e,n,t,o,i)=>{let a=r.dims,s=JC(i,e.axes,a.length),u=QC(a,t,o,e.axes),l=t.slice();t.length===0&&(l=a.map((v,$)=>v===0?1:u[$]/v),e.keepAspectRatioPolicy!=="stretch"&&(u=YC(a,l,e)));let d=V("output",r.dataType,u.length),p=L("input",r.dataType,a.length),h=D.size(u),g=a.length===u.length&&a.every((v,$)=>v===u[$]),b=e.coordinateTransformMode==="tf_crop_and_resize",_=e.extrapolationValue,I=p.type.value,w=v=>`
      ${g?"":`
      ${XC(e.coordinateTransformMode,I)};
      ${(()=>{switch(e.mode){case"nearest":return`
              ${nD(p,a)};
              ${ZC(e.nearestMode,n,I)};
              ${tD(p,d,a,u,l.length,s.length,b)};
              `;case"linear":return`
              ${eD(d,a,u,l.length,s.length)};
              ${(()=>{if(a.length===2||a.length===4)return`${rD(p,d,a,b,_)}`;if(a.length===3||a.length===5)return`${iD(p,d,a,b,_)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(a.length===2||a.length===4)return`${oD(p,d,a,u,l,s,e.cubicCoeffA,b,e.extrapolationValue,e.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${v.registerUniform("output_size","u32").registerUniform("scales","f32",l.length).registerUniform("roi","f32",s.length).declareVariables(p,d)}
      ${v.mainStart()}
        ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${d.offsetToIndices("global_idx")};
        var input_indices: ${p.type.indices};
        ${(()=>{switch(e.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${p.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${e.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${a.length===2||a.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${e.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${e.cacheKey}|${n}|${l.length>0?e.mode==="cubic"?l:l.length:""}|${o.length>0?o:""}|${s.length>0?s:""}|${g}|${e.mode==="nearest"?a.length:a}`,inputDependencies:["rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:u,dataType:r.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:l},{type:1,data:s},...W(a,u)]})}},sD=r=>{let e=r.customDataBuffer;return new Uint32Array(e,e.byteOffset,1)[0]},ax=(r,e)=>{let n=[],t=[],o=[],i=sD(r);if(e.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");KC(r.inputs,e,i,n,t,o),r.compute(aD(r.inputs[0],e,i,n,t,o),{inputs:[0]})},sx=r=>{let e=r.antialias,n=r.axes,t=r.coordinateTransformMode,o=r.cubicCoeffA,i=r.excludeOutside!==0,a=r.extrapolationValue,s=r.keepAspectRatioPolicy,u=r.mode,l=r.nearestMode===""?"simple":r.nearestMode;return le({antialias:e,axes:n,coordinateTransformMode:t,cubicCoeffA:o,excludeOutside:i,extrapolationValue:a,keepAspectRatioPolicy:s,mode:u,nearestMode:l})}});var uD,lD,lx,cx=N(()=>{"use strict";ue();pe();he();uD=r=>{if(!r||r.length<3)throw new Error("layerNorm requires at least 3 inputs.");let e=r[0],n=r[1],t=r[2];if(e.dataType!==n.dataType||e.dataType!==t.dataType)throw new Error("All inputs must have the same data type");if(e.dims.length!==3&&e.dims.length!==2)throw new Error("Input must be 2D or 3D");if(n.dims.length!==3&&n.dims.length!==2)throw new Error("Skip must be 2D or 3D");let o=e.dims[e.dims.length-1],i=e.dims[e.dims.length-2];if(n.dims[n.dims.length-1]!==o)throw new Error("Skip must have the same hidden size as input");if(n.dims[n.dims.length-2]!==i)throw new Error("Skip must have the same sequence length as input");if(t.dims.length!==1)throw new Error("Gamma must be 1D");if(t.dims[t.dims.length-1]!==o)throw new Error("Gamma must have the same hidden size as input");if(r.length>3){let a=r[3];if(a.dims.length!==1)throw new Error("Beta must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Beta must have the same hidden size as input")}if(r.length>4){let a=r[4];if(a.dims.length!==1)throw new Error("Bias must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Bias must have the same hidden size as input")}},lD=(r,e,n,t)=>{let o=e.simplified,i=r[0].dims,a=D.size(i),s=i,u=a,l=i.slice(-1)[0],d=t?i.slice(0,-1).concat(1):[],p=!o&&r.length>3,h=r.length>4,g=t&&n>1,b=t&&n>2,_=n>3,I=64,w=Pe(l),v=[{type:12,data:u},{type:12,data:w},{type:12,data:l},{type:1,data:e.epsilon}],$=P=>{let C=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],R=[L("x",r[0].dataType,r[0].dims,w),L("skip",r[1].dataType,r[1].dims,w),L("gamma",r[2].dataType,r[2].dims,w)];p&&R.push(L("beta",r[3].dataType,r[3].dims,w)),h&&R.push(L("bias",r[4].dataType,r[4].dims,w)),R.push(V("output",r[0].dataType,s,w)),g&&R.push(V("mean_output",1,d)),b&&R.push(V("inv_std_output",1,d)),_&&R.push(V("input_skip_bias_sum",r[0].dataType,s,w));let x=Fe(r[0].dataType),B=Fe(1,w);return`

      ${P.registerUniforms(C).declareVariables(...R)}
      var<workgroup> sum_shared : array<${B}, ${I}>;
      var<workgroup> sum_squared_shared : array<${B}, ${I}>;

      ${P.mainStart([I,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${I};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${I};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${I-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":x+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${_?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Wr(x,w,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${I};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Zt("sum",w)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Zt("square_sum",w)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${b?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${x}(mean)`}) *
            ${x}(inv_std_dev) * gamma[offset1d + i]
            ${p?"+ beta[offset1d + i]":""};
        }
      }`},A=[{dims:s,dataType:r[0].dataType}];return n>1&&A.push({dims:d,dataType:1}),n>2&&A.push({dims:d,dataType:1}),n>3&&A.push({dims:i,dataType:r[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${w};${g};${b};${_}`,inputDependencies:r.map((P,C)=>"type")},getShaderSource:$,getRunData:()=>({outputs:A,dispatchGroup:{x:Math.ceil(u/l)},programUniforms:v})}},lx=(r,e)=>{uD(r.inputs);let t=[0];r.outputCount>1&&t.push(-3),r.outputCount>2&&t.push(-3),r.outputCount>3&&t.push(3),r.compute(lD(r.inputs,e,r.outputCount,!1),{outputs:t})}});var cD,Ya,dD,dx,pD,fD,px,fx,hx=N(()=>{"use strict";ue();pe();Qe();he();cD=(r,e)=>{if(!r||r.length<1)throw new Error("too few inputs");if(e.axes.length!==0){if(e.axes.length!==e.starts.length||e.axes.length!==e.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(e.starts.length!==e.ends.length)throw new Error("starts and ends must have the same length");r.slice(1).forEach((n,t)=>{if(r[t+1].dataType!==6&&r[t+1].dataType!==7)throw new Error(`Input ${t} must be an array of int32 or int64`)})},Ya=(r,e)=>{let n=[];if(r.length>e)if(r[e].dataType===7)r[e].getBigInt64Array().forEach(t=>n.push(Number(t)));else if(r[e].dataType===6)r[e].getInt32Array().forEach(t=>n.push(Number(t)));else throw new Error(`Input ${e} must be an array of int32 or int64`);return n},dD=(r,e)=>{if(r.length>1){let n=Ya(r,1),t=Ya(r,2),o=Ya(r,3);return o.length===0&&(o=[...Array(r[0].dims.length).keys()]),le({starts:n,ends:t,axes:o})}else return e},dx=(r,e,n,t,o)=>{let i=r;return r<0&&(i+=n[t[e]]),o[e]<0?Math.max(0,Math.min(i,n[t[e]]-1)):Math.max(0,Math.min(i,n[t[e]]))},pD=(r,e,n)=>`fn calculateInputIndices(output_indices: ${e.type.indices}) -> ${r.type.indices} {
          var input_indices: ${r.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${Q("uniforms.input_shape","i",n.length)};
            let steps_i = ${Q("uniforms.steps","i",n.length)};
            let signs_i = ${Q("uniforms.signs","i",n.length)};
            let starts_i = ${Q("uniforms.starts","i",n.length)};
            var output_index = ${e.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${r.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,fD=(r,e)=>{let n=r[0].dims,t=D.size(n),o=e.axes.length>0?D.normalizeAxes(e.axes,n.length):[...Array(n.length).keys()],i=Ya(r,4);i.forEach(w=>w!==0||(()=>{throw new Error("step cannot be 0")})),i.length===0&&(i=Array(o.length).fill(1));let a=e.starts.map((w,v)=>dx(w,v,n,o,i)),s=e.ends.map((w,v)=>dx(w,v,n,o,i));if(o.length!==a.length||o.length!==s.length)throw new Error("start, ends and axes should have the same number of elements");if(o.length!==n.length)for(let w=0;w<n.length;++w)o.includes(w)||(a.splice(w,0,0),s.splice(w,0,n[w]),i.splice(w,0,1));let u=i.map(w=>Math.sign(w));i.forEach((w,v,$)=>{if(w<0){let A=(s[v]-a[v])/w,P=a[v],C=P+A*i[v];a[v]=C,s[v]=P,$[v]=-w}});let l=n.slice(0);o.forEach((w,v)=>{l[w]=Math.ceil((s[w]-a[w])/i[w])});let d={dims:l,dataType:r[0].dataType},p=V("output",r[0].dataType,l.length),h=L("input",r[0].dataType,r[0].dims.length),g=D.size(l),b=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:a.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:i.length}],_=[{type:12,data:g},{type:12,data:a},{type:6,data:u},{type:12,data:i},...W(r[0].dims,l)],I=w=>`
      ${w.registerUniforms(b).declareVariables(h,p)}
        ${pD(h,p,n)}
        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${p.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${p.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${a.length}_${i.length}`,inputDependencies:["rank"]},getShaderSource:I,getRunData:()=>({outputs:[d],dispatchGroup:{x:Math.ceil(t/64)},programUniforms:_})}},px=(r,e)=>{cD(r.inputs,e);let n=dD(r.inputs,e);r.compute(fD(r.inputs,n),{inputs:[0]})},fx=r=>{let e=r.starts,n=r.ends,t=r.axes;return le({starts:e,ends:n,axes:t})}});var hD,mD,mx,gx,bx=N(()=>{"use strict";ue();pe();Qe();Yn();he();hD=r=>{if(!r||r.length!==1)throw new Error("Softmax op requires 1 input.")},mD=(r,e)=>{let n=r.inputs[0],t=n.dims,o=D.size(t),i=t.length,a=D.normalizeAxis(e.axis,i),s=a<t.length-1,u,l=[];s?(l=Array.from({length:i},(R,x)=>x),l[a]=i-1,l[i-1]=a,u=r.compute(lt(n,l),{inputs:[n],outputs:[-1]})[0]):u=n;let d=u.dims,p=d[i-1],h=o/p,g=Pe(p),b=p/g,_=64;h===1&&(_=256);let I=(R,x)=>x===4?`max(max(${R}.x, ${R}.y), max(${R}.z, ${R}.w))`:x===2?`max(${R}.x, ${R}.y)`:x===3?`max(max(${R}.x, ${R}.y), ${R}.z)`:R,w=L("x",u.dataType,u.dims,g),v=V("result",u.dataType,u.dims,g),$=w.type.value,A=Fe(u.dataType)==="f32"?`var threadMax = ${$}(-3.4028234663852886e+38f);`:`var threadMax = ${$}(-65504.0h);`,P=R=>`
      var<workgroup> rowMaxShared : ${$};
      var<workgroup> rowSumShared : ${$};
      var<workgroup> threadShared : array<${$}, ${_}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${$} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${$}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${R.registerUniform("packedCols","i32").declareVariables(w,v)}
      ${R.mainStart(_)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${_};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${A}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${$}(${I("threadShared[0]",g)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${$}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${$}(${Zt("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${$}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,C=r.compute({name:"Softmax",shaderCache:{hint:`${g};${_}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:d,dataType:u.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:b}]}),getShaderSource:P},{inputs:[u],outputs:[s?-1:0]})[0];s&&r.compute(lt(C,l),{inputs:[C]})},mx=(r,e)=>{hD(r.inputs),mD(r,e)},gx=r=>le({axis:r.axis})});var yx,gD,bD,yD,_x,wx=N(()=>{"use strict";ue();pe();he();yx=r=>Array.from(r.getBigInt64Array(),Number),gD=r=>{if(!r||r.length!==2)throw new Error("Tile requires 2 inputs.");if(r[0].dataType!==1&&r[0].dataType!==10&&r[0].dataType!==6&&r[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(r[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(r[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(yx(r[1]).length!==r[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},bD=(r,e)=>{let n=[];for(let t=0;t<r.length;++t)n.push(r[t]*e[t]);return n},yD=(r,e)=>{let n=r[0].dims,t=e??yx(r[1]),o=bD(n,t),i=D.size(o),a=r[0].dataType,s=L("input",a,n.length),u=V("output",a,o.length),l=d=>`
      const inputShape = ${s.indices(...n)};
      ${d.registerUniform("output_size","u32").declareVariables(s,u)}
      ${d.mainStart()}
      ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${s.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${s.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${u.indicesGet("output_indices","i")}  % input_dim_i;

        ${s.indicesSet("input_indices","i","input_dim_value")}
      }
      ${u.setByOffset("global_idx",s.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:o,dataType:r[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...W(r[0].dims,o)]}),getShaderSource:l}},_x=r=>{gD(r.inputs),r.compute(yD(r.inputs),{inputs:[0]})}});var _D,wD,vx,xx=N(()=>{"use strict";ue();pe();he();_D=(r,e,n,t,o)=>{let i=V("output_data",o,n.length,4),a=L("a_data",e[1].dataType,e[1].dims.length,4),s=L("b_data",e[2].dataType,e[2].dims.length,4),u=L("c_data",e[0].dataType,e[0].dims.length,4),l,d=(p,h,g)=>`select(${h}, ${p}, ${g})`;if(!t)l=i.setByOffset("global_idx",d(a.getByOffset("global_idx"),s.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let p=(h,g,b="")=>{let _=`a_data[index_a${g}][component_a${g}]`,I=`b_data[index_b${g}][component_b${g}]`,w=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
            let output_indices${g} = ${i.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offset_a${g} = ${a.broadcastedIndicesToOffset(`output_indices${g}`,i)};
            let offset_b${g} = ${s.broadcastedIndicesToOffset(`output_indices${g}`,i)};
            let offset_c${g} = ${u.broadcastedIndicesToOffset(`output_indices${g}`,i)};
            let index_a${g} = offset_a${g} / 4u;
            let index_b${g} = offset_b${g} / 4u;
            let index_c${g} = offset_c${g} / 4u;
            let component_a${g} = offset_a${g} % 4u;
            let component_b${g} = offset_b${g} % 4u;
            let component_c${g} = offset_c${g} % 4u;
            ${h}[${g}] = ${b}(${d(_,I,w)});
          `};o===9?l=`
            var data = vec4<u32>(0);
            ${p("data",0,"u32")}
            ${p("data",1,"u32")}
            ${p("data",2,"u32")}
            ${p("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:l=`
            ${p("output_data[global_idx]",0)}
            ${p("output_data[global_idx]",1)}
            ${p("output_data[global_idx]",2)}
            ${p("output_data[global_idx]",3)}
          `}return`
        ${r.registerUniform("vec_size","u32").declareVariables(u,a,s,i)}
        ${r.mainStart()}
        ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${l}
      }`},wD=r=>{let e=r[1].dims,n=r[2].dims,t=r[0].dims,o=r[1].dataType,i=!(D.areEqual(e,n)&&D.areEqual(n,t)),a=e,s=D.size(e);if(i){let l=Un.calcShape(Un.calcShape(e,n,!1),t,!1);if(!l)throw new Error("Can't perform where op on the given tensors");a=l,s=D.size(a)}let u=Math.ceil(s/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:l=>_D(l,r,a,i,o),getRunData:()=>({outputs:[{dims:a,dataType:o}],dispatchGroup:{x:Math.ceil(s/64/4)},programUniforms:[{type:12,data:u},...W(t,e,n,a)]})}},vx=r=>{r.compute(wD(r.inputs))}});var Tx,Ix=N(()=>{"use strict";o0();Va();s0();l0();K0();iw();uw();Iw();Cw();Nw();zw();Gw();Hw();jw();Zw();Yw();nv();iv();uv();dv();wv();Tv();Sv();Av();Ev();zc();Dv();Xv();Qv();ex();rx();Ba();ux();Fc();cx();hx();bx();Bc();wx();Yn();Ua();xx();Tx=new Map([["Abs",[c0]],["Acos",[d0]],["Acosh",[p0]],["Add",[X0]],["ArgMax",[r0,Ic]],["ArgMin",[n0,Ic]],["Asin",[f0]],["Asinh",[h0]],["Atan",[m0]],["Atanh",[g0]],["Attention",[i0]],["AveragePool",[Fv,Bv]],["BatchNormalization",[a0]],["BiasAdd",[u0]],["BiasSplitGelu",[j0]],["Cast",[y0,b0]],["Ceil",[w0]],["Clip",[_0]],["Concat",[aw,sw]],["Conv",[kc,Dc]],["ConvTranspose",[Ew,Ow]],["Cos",[v0]],["Cosh",[x0]],["CumSum",[Dw,kw]],["DepthToSpace",[Lw,Rw]],["DequantizeLinear",[Zv,Jv]],["Div",[Z0]],["Einsum",[Fw,Vw]],["Elu",[T0,Uo]],["Equal",[J0]],["Erf",[I0]],["Exp",[S0]],["Expand",[Ww]],["FastGelu",[qw]],["Floor",[$0]],["FusedConv",[kc,Dc]],["Gather",[Xw,Kw]],["GatherElements",[ov,rv]],["GatherBlockQuantized",[ev,tv]],["GatherND",[Jw,Qw]],["Gelu",[A0]],["Gemm",[sv,av]],["GlobalAveragePool",[Uv,Gv]],["GlobalMaxPool",[Kv,jv]],["Greater",[tw]],["GreaterOrEqual",[rw]],["GridSample",[lv,cv]],["GroupQueryAttention",[_v]],["HardSigmoid",[L0,N0]],["InstanceNormalization",[xv]],["LayerNormalization",[Iv]],["LeakyRelu",[O0,Uo]],["Less",[nw]],["LessOrEqual",[ow]],["Log",[W0]],["MatMul",[$v]],["MatMulNBits",[Ov,Pv]],["MaxPool",[Hv,qv]],["Mul",[Q0]],["MultiHeadAttention",[hv,fv]],["Neg",[E0]],["Not",[P0]],["Pad",[Cv]],["Pow",[Y0]],["QuickGelu",[H0,Uo]],["Range",[Yv]],["Reciprocal",[C0]],["ReduceMin",[Z_]],["ReduceMean",[H_]],["ReduceMax",[X_]],["ReduceSum",[Q_]],["ReduceProd",[J_]],["ReduceL1",[q_]],["ReduceL2",[j_]],["ReduceLogSum",[e0]],["ReduceLogSumExp",[K_]],["ReduceSumSquare",[Y_]],["Relu",[D0]],["Resize",[ax,sx]],["RotaryEmbedding",[bv]],["ScatterND",[nx,tx]],["Sigmoid",[k0]],["Sin",[R0]],["Sinh",[z0]],["Slice",[px,fx]],["SkipLayerNormalization",[lx]],["Split",[mv,gv]],["Sqrt",[M0]],["Softmax",[mx,gx]],["Sub",[ew]],["Tan",[B0]],["Tanh",[V0]],["ThresholdedRelu",[U0,Uo]],["Tile",[_x]],["Transpose",[D_,k_]],["Where",[vx]]])});var es,Sx=N(()=>{"use strict";ft();Gn();he();es=class{constructor(e){this.backend=e;this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,n){this.repo.set(e,n)}run(e,n,t,o,i){At(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of n)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});i&&u.push({binding:u.length,resource:i});let l=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:o};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...o),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),_t(e.programInfo.name)}dispose(){}build(e,n){At(e.name);let t=this.backend.device,o=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(p=>{t.features.has(p.feature)&&o.push(`enable ${p.extension};`)});let a=E_(n,this.backend.device.limits),s=e.getShaderSource(a),u=`${o.join(`
`)}
${a.additionalImplementations}
${s}`,l=t.createShaderModule({code:u,label:e.name});me("verbose",()=>`[WebGPU] ${e.name} shader code: ${u}`);let d=t.createComputePipeline({compute:{module:l,entryPoint:"main"},layout:"auto",label:e.name});return _t(e.name),{programInfo:e,computePipeline:d,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let n=typeof e=="number"?e:e.x,t=typeof e=="number"?1:e.y||1,o=typeof e=="number"?1:e.z||1,i=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(n<=i&&t<=i&&o<=i)return[n,t,o];let a=n*t*o,s=Math.ceil(Math.sqrt(a));if(s>i){if(s=Math.ceil(Math.cbrt(a)),s>i)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}});var $x={};Sr($x,{WebGpuBackend:()=>Gc});var vD,xD,Vc,Gc,Ax=N(()=>{"use strict";ft();ue();Gn();pc();O_();Ix();Sx();vD=(r,e)=>{if(e.length!==r.length)throw new Error(`inputDependencies length ${e.length} is not equal to inputTensors length ${r.length}.`);let n=[];for(let t=0;t<r.length;++t){let o=r[t].dataType;switch(e[t]){case"none":{n.push("");break}case"type":{n.push(`${o}`);break}case"rank":{let i=r[t].dims.length;n.push(`${o};${i}`);break}case"dims":{let i=r[t].dims.join(",");n.push(`${o};${i}`);break}default:throw new Error(`unsupported input dependency: ${e[t]}`)}}return n.join("|")},xD=(r,e,n)=>{let t=r.name;return r.shaderCache?.hint&&(t+="["+r.shaderCache.hint+"]"),t+=":"+n+`:${vD(e,r.shaderCache?.inputDependencies??new Array(e.length).fill("dims"))}`,t},Vc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Gc=class{constructor(){this.currentSessionId=null;this.currentKernelId=null;this.commandEncoder=null;this.computePassEncoder=null;this.maxDispatchNumber=16;this.pendingDispatchNumber=0;this.pendingKernels=[];this.pendingQueries=new Map;this.sessionStatus="default";this.capturedCommandList=new Map;this.capturedPendingKernels=new Map;this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,n){this.env=e;let t=[],o={requiredLimits:{maxComputeWorkgroupStorageSize:n.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:n.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:n.limits.maxStorageBufferBindingSize,maxBufferSize:n.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:n.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:n.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:n.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:n.limits.maxComputeWorkgroupSizeZ},requiredFeatures:t},i=a=>n.features.has(a)&&t.push(a)&&!0;i("chromium-experimental-timestamp-query-inside-passes")||i("timestamp-query"),i("shader-f16"),i("subgroups"),this.device=await n.requestDevice(o),this.adapterInfo=new Vc(n.info||await n.requestAdapterInfo()),this.gpuDataManager=A_(this),this.programManager=new es(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Pa(e.logLevel,!!e.debug),this.device.onuncapturederror=a=>{a.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${a.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:n,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&this.env?.webgpu&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),n={};this.queryType==="at-passes"&&(n.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(n)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;At(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let n=new BigUint64Array(e.getMappedRange()),t=this.pendingQueries.get(e);for(let o=0;o<n.length/2;o++){let i=t[o],a=i.kernelId,s=this.kernels.get(a),u=s.kernelType,l=s.kernelName,d=i.programName,p=i.inputTensorViews,h=i.outputTensorViews,g=n[o*2],b=n[o*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=g);let _=Number(g-this.queryTimeBase),I=Number(b-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger(I))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:p.map(w=>({dims:w.dims,dataType:Vn(w.dataType)})),outputsMetadata:h.map(w=>({dims:w.dims,dataType:Vn(w.dataType)})),kernelId:a,kernelType:u,kernelName:l,programName:d,startTime:_,endTime:I});else{let w="";p.forEach(($,A)=>{w+=`input[${A}]: [${$.dims}] | ${Vn($.dataType)}, `});let v="";h.forEach(($,A)=>{v+=`output[${A}]: [${$.dims}] | ${Vn($.dataType)}, `}),console.log(`[profiling] kernel "${a}|${u}|${l}|${d}" ${w}${v}start time: ${_} ns, execution time: ${I-_} ns`)}di("GPU",`${d}::${g}::${b}`)}e.unmap(),this.pendingQueries.delete(e)}),_t()}run(e,n,t,o,i,a){At(e.name);let s=[];for(let $=0;$<n.length;++$){let A=n[$].data;if(A===0)continue;let P=this.gpuDataManager.get(A);if(!P)throw new Error(`no GPU data for input: ${A}`);s.push(P)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(n),p=t.length===0?u.map(($,A)=>A):t;if(p.length!==u.length)throw new Error(`Output size ${p.length} must be equal to ${u.length}.`);let h=[],g=[];for(let $=0;$<u.length;++$){if(!Number.isInteger(p[$])||p[$]<-3||p[$]>=a)throw new Error(`Invalid output index: ${p[$]}`);if(p[$]===-3)continue;let A=p[$]===-1,P=p[$]===-2,C=A||P?i(u[$].dataType,u[$].dims):o(p[$],u[$].dataType,u[$].dims);if(h.push(C),C.data===0)continue;let R=this.gpuDataManager.get(C.data);if(!R)throw new Error(`no GPU data for output: ${C.data}`);if(A&&this.temporaryData.push(R),P){let x=this.kernelPersistentData.get(this.currentKernelId);x||(x=[],this.kernelPersistentData.set(this.currentKernelId,x)),x.push(R)}g.push(R)}if(s.length!==n.length||g.length!==h.length){if(g.length===0)return _t(e.name),h;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let b;if(d){let $=0,A=[];d.forEach(x=>{let B=typeof x.data=="number"?[x.data]:x.data;if(B.length===0)return;let G=x.type===10?2:4,Y,J;x.type===10?(J=B.length>4?16:B.length>2?8:B.length*G,Y=B.length>4?16:G*B.length):(J=B.length<=2?B.length*G:16,Y=16),$=Math.ceil($/J)*J,A.push($);let ie=x.type===10?8:4;$+=B.length>4?Math.ceil(B.length/ie)*Y:B.length*G});let P=16;$=Math.ceil($/P)*P;let C=new ArrayBuffer($);d.forEach((x,B)=>{let G=A[B],Y=typeof x.data=="number"?[x.data]:x.data;if(x.type===6)new Int32Array(C,G,Y.length).set(Y);else if(x.type===12)new Uint32Array(C,G,Y.length).set(Y);else if(x.type===10)new Uint16Array(C,G,Y.length).set(Y);else if(x.type===1)new Float32Array(C,G,Y.length).set(Y);else throw new Error(`Unsupported uniform type: ${Vn(x.type)}`)});let R=this.gpuDataManager.create($,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(R.buffer,0,C,0,$),this.gpuDataManager.release(R.id),b={offset:0,size:$,buffer:R.buffer}}let _=this.programManager.normalizeDispatchGroupSize(l),I=_[1]===1&&_[2]===1,w=xD(e,n,I),v=this.programManager.getArtifact(w);if(v||(v=this.programManager.build(e,_),this.programManager.setArtifact(w,v),me("info",()=>`[artifact] key: ${w}, programName: ${e.name}`)),d&&v.uniformVariablesInfo){if(d.length!==v.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${d.length} in program "${v.programInfo.name}".`);for(let $=0;$<d.length;$++){let A=d[$],P=A.type,C=typeof A.data=="number"?1:A.data.length,[R,x]=v.uniformVariablesInfo[$];if(P!==R||C!==x)throw new Error(`Uniform variable ${$} mismatch: expect type ${R} with size ${x}, got type ${P} with size ${C} in program "${v.programInfo.name}".`)}}if(me("info",()=>`[ProgramManager] run "${e.name}" (key=${w}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let $={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:n,outputTensorViews:h};this.pendingKernels.push($),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push($)}return this.programManager.run(v,s,g,_,b),_t(e.name),h}upload(e,n){this.gpuDataManager.upload(e,n)}memcpy(e,n){this.gpuDataManager.memcpy(e,n)}async download(e,n){await this.gpuDataManager.download(e,n)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,n,t,o){let i=Tx.get(e);if(!i)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:o,kernelEntry:i[0],attributes:[i[1],t]};this.kernels.set(n,a)}releaseKernel(e){let n=this.kernelPersistentData.get(e);if(n){for(let t of n)this.gpuDataManager.release(t.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,n,t){let o=this.kernels.get(e);if(!o)throw new Error(`kernel not created: ${e}`);let i=o.kernelType,a=o.kernelName,s=o.kernelEntry,u=o.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${i}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),me("info",()=>`[WebGPU] Start to run kernel "[${i}] ${a}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(n,u[1]),0}catch(d){return t.push(Promise.resolve(`[WebGPU] Kernel "[${i}] ${a}" failed. ${d}`)),1}finally{l&&t.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${i}] ${a}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,n,t,o){let i=this.sessionExternalDataMapping.get(e);i||(i=new Map,this.sessionExternalDataMapping.set(e,i));let a=i.get(n),s=this.gpuDataManager.registerExternalBuffer(t,o,a);return i.set(n,[s,t]),s}unregisterBuffers(e){let n=this.sessionExternalDataMapping.get(e);n&&(n.forEach(t=>this.gpuDataManager.unregisterExternalBuffer(t[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let n=this.gpuDataManager.get(e);if(!n)throw new Error(`no GPU data for buffer: ${e}`);return n.buffer}createDownloader(e,n,t){return async()=>{let o=await yc(this,e,n);return Ca(o.buffer,t)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){me("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){me("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){me("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),n=this.capturedPendingKernels.get(this.currentSessionId),t=e.length;this.pendingKernels=[];for(let o=0;o<t;o++){let i=this.getComputePassEncoder(),a=e[o];this.writeTimestamp(this.pendingDispatchNumber*2),i.setPipeline(a.computePipeline),i.setBindGroup(0,a.bindGroup),i.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(n[o]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}});var Ox={};Sr(Ox,{init:()=>TD});var jo,Uc,TD,Px=N(()=>{"use strict";ue();Gn();pe();T_();jo=class r{constructor(e,n,t,o){this.module=e;this.dataType=n;this.data=t;this.dims=o}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let e=D.size(this.dims);return e===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,e)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let e=D.size(this.dims);return e===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,e)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let e=D.size(this.dims);return e===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,e)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let e=D.size(this.dims);return e===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,e)}reshape(e){if(D.size(e)!==D.size(this.dims))throw new Error("Invalid new shape");return new r(this.module,this.dataType,this.data,e)}},Uc=class{constructor(e,n,t){this.module=e;this.backend=n;this.customDataOffset=0;this.customDataSize=0;this.adapterInfo=n.adapterInfo;let o=e.PTR_SIZE,i=t/e.PTR_SIZE,a=o===4?"i32":"i64";this.opKernelContext=Number(e.getValue(o*i++,a));let s=Number(e.getValue(o*i++,a));this.outputCount=Number(e.getValue(o*i++,a)),this.customDataOffset=Number(e.getValue(o*i++,"*")),this.customDataSize=Number(e.getValue(o*i++,a));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(o*i++,a)),p=Number(e.getValue(o*i++,"*")),h=Number(e.getValue(o*i++,a)),g=[];for(let b=0;b<h;b++)g.push(Number(e.getValue(o*i++,a)));u.push(new jo(e,d,p,g))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,n){let t=n?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,o=n?.outputs??[],i=(s,u,l)=>new jo(this.module,u,this.output(s,l),l),a=(s,u)=>{let l=_r(s,u);if(!l)throw new Error(`Unsupported data type: ${s}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new jo(this.module,s,d,u)};return this.backend.run(e,t,o,i,a,this.outputCount)}output(e,n){let t=this.module.stackSave();try{let o=this.module.PTR_SIZE,i=o===4?"i32":"i64",a=this.module.stackAlloc((1+n.length)*o);this.module.setValue(a,n.length,i);for(let s=0;s<n.length;s++)this.module.setValue(a+o*(s+1),n[s],i);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(o){throw new Error(`Failed to generate kernel's output[${e}] with dims [${n}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${o}`)}finally{this.module.stackRestore(t)}}},TD=async(r,e,n,t)=>{let o=e.jsepInit;if(!o)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(r==="webgpu"){let i=(Ax(),Xr($x)).WebGpuBackend,a=new i;await a.initialize(n,t),o("webgpu",[a,s=>a.alloc(Number(s)),s=>a.free(s),(s,u,l,d=!1)=>{if(d)me("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(s)}, dst=${Number(u)}, size=${Number(l)}`),a.memcpy(Number(s),Number(u));else{me("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(s)}, gpuDataId=${Number(u)}, size=${Number(l)}`);let p=e.HEAPU8.subarray(Number(s>>>0),Number(s>>>0)+Number(l));a.upload(Number(u),p)}},async(s,u,l)=>{me("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${s}, dataOffset=${u}, size=${l}`),await a.download(Number(s),()=>e.HEAPU8.subarray(Number(u)>>>0,Number(u+l)>>>0))},(s,u,l)=>a.createKernel(s,Number(u),l,e.UTF8ToString(e._JsepGetNodeName(Number(u)))),s=>a.releaseKernel(s),(s,u,l,d)=>{me("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${l}, kernel=${s}, contextDataOffset=${u}`);let p=new Uc(e,a,Number(u));return a.computeKernel(Number(s),p,d)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let i=new La(n);o("webnn",[i,()=>i.reserveTensorId(),a=>i.releaseTensorId(a),async(a,s,u,l,d)=>i.ensureTensor(a,s,u,l,d),(a,s)=>{i.uploadTensor(a,s)},async(a,s)=>i.downloadTensor(a,s),(a,s)=>i.registerMLContext(a,s),!!n.trace])}}});var ID,ba,ya,Hr,SD,Ex,Bo,_a,wa,Cx,va,xa,Ta,oc=N(()=>{"use strict";ft();c_();p_();ue();br();Sa();cc();ID=(r,e)=>{Me()._OrtInit(r,e)!==0&&Oe("Can't initialize onnxruntime.")},ba=async r=>{ID(r.wasm.numThreads,Vo(r.logLevel))},ya=async(r,e)=>{Me().asyncInit?.();let n=r.webgpu.adapter;if(e==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let t=r.webgpu.powerPreference;if(t!==void 0&&t!=="low-power"&&t!=="high-performance")throw new Error(`Invalid powerPreference setting: "${t}"`);let o=r.webgpu.forceFallbackAdapter;if(o!==void 0&&typeof o!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${o}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:t,forceFallbackAdapter:o}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(e==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let t=(Px(),Xr(Ox)).init;e==="webgpu"&&await t("webgpu",Me(),r,n),e==="webnn"&&await t("webnn",Me(),r)}},Hr=new Map,SD=r=>{let e=Me(),n=e.stackSave();try{let t=e.PTR_SIZE,o=e.stackAlloc(2*t);e._OrtGetInputOutputCount(r,o,o+t)!==0&&Oe("Can't get session input/output count.");let a=t===4?"i32":"i64";return[Number(e.getValue(o,a)),Number(e.getValue(o+t,a))]}finally{e.stackRestore(n)}},Ex=(r,e)=>{let n=Me(),t=n.stackSave(),o=0;try{let i=n.PTR_SIZE,a=n.stackAlloc(2*i);n._OrtGetInputOutputMetadata(r,e,a,a+i)!==0&&Oe("Can't get session input/output metadata.");let u=Number(n.getValue(a,"*"));o=Number(n.getValue(a+i,"*"));let l=n.HEAP32[o/4];if(l===0)return[u,0];let d=n.HEAPU32[o/4+1],p=[];for(let h=0;h<d;h++){let g=Number(n.getValue(o+8+h*i,"*"));p.push(g!==0?n.UTF8ToString(g):Number(n.getValue(o+8+(h+d)*i,"*")))}return[u,l,p]}finally{n.stackRestore(t),o!==0&&n._OrtFree(o)}},Bo=r=>{let e=Me(),n=e._malloc(r.byteLength);if(n===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${r.byteLength}.`);return e.HEAPU8.set(r,n),[n,r.byteLength]},_a=async(r,e)=>{let n,t,o=Me();Array.isArray(r)?[n,t]=r:r.buffer===o.HEAPU8.buffer?[n,t]=[r.byteOffset,r.byteLength]:[n,t]=Bo(r);let i=0,a=0,s=0,u=[],l=[],d=[];try{if([a,u]=await d_(e),e?.externalData&&o.mountExternalData){let A=[];for(let P of e.externalData){let C=typeof P=="string"?P:P.path;A.push(Go(typeof P=="string"?P:P.data).then(R=>{o.mountExternalData(C,R)}))}await Promise.all(A)}for(let A of e?.executionProviders??[])if((typeof A=="string"?A:A.name)==="webnn"){if(o.shouldTransferToMLTensor=!1,typeof A!="string"){let C=A,R=C?.context,x=C?.gpuDevice,B=C?.deviceType,G=C?.powerPreference;R?o.currentContext=R:x?o.currentContext=await o.webnnCreateMLContext(x):o.currentContext=await o.webnnCreateMLContext({deviceType:B,powerPreference:G})}else o.currentContext=await o.webnnCreateMLContext();break}i=await o._OrtCreateSession(n,t,a),o.webgpuOnCreateSession?.(i),i===0&&Oe("Can't create a session."),o.jsepOnCreateSession?.(),o.currentContext&&(o.webnnRegisterMLContext(i,o.currentContext),o.currentContext=void 0,o.shouldTransferToMLTensor=!0);let[p,h]=SD(i),g=!!e?.enableGraphCapture,b=[],_=[],I=[],w=[],v=[];for(let A=0;A<p;A++){let[P,C,R]=Ex(i,A);P===0&&Oe("Can't get an input name."),l.push(P);let x=o.UTF8ToString(P);b.push(x),I.push(C===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:Vn(C),shape:R})}for(let A=0;A<h;A++){let[P,C,R]=Ex(i,A+p);P===0&&Oe("Can't get an output name."),d.push(P);let x=o.UTF8ToString(P);_.push(x),w.push(C===0?{name:x,isTensor:!1}:{name:x,isTensor:!0,type:Vn(C),shape:R});{if(g&&e?.preferredOutputLocation===void 0){v.push("gpu-buffer");continue}let B=typeof e?.preferredOutputLocation=="string"?e.preferredOutputLocation:e?.preferredOutputLocation?.[x]??"cpu",G=o.webnnIsGraphOutput;if(B==="cpu"&&G&&G(i,x)){v.push("ml-tensor-cpu-output");continue}if(B!=="cpu"&&B!=="cpu-pinned"&&B!=="gpu-buffer"&&B!=="ml-tensor")throw new Error(`Not supported preferred output location: ${B}.`);if(g&&B!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${B}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);v.push(B)}}let $=null;return v.some(A=>A==="gpu-buffer"||A==="ml-tensor"||A==="ml-tensor-cpu-output")&&(s=o._OrtCreateBinding(i),s===0&&Oe("Can't create IO binding."),$={handle:s,outputPreferredLocations:v,outputPreferredLocationsEncoded:v.map(A=>A==="ml-tensor-cpu-output"?"ml-tensor":A).map(A=>lc(A))}),Hr.set(i,[i,l,d,$,g,!1]),[i,b,_,I,w]}catch(p){throw l.forEach(h=>o._OrtFree(h)),d.forEach(h=>o._OrtFree(h)),s!==0&&o._OrtReleaseBinding(s)!==0&&Oe("Can't release IO binding."),i!==0&&o._OrtReleaseSession(i)!==0&&Oe("Can't release session."),p}finally{o._free(n),a!==0&&o._OrtReleaseSessionOptions(a)!==0&&Oe("Can't release session options."),u.forEach(p=>o._free(p)),o.unmountExternalData?.()}},wa=r=>{let e=Me(),n=Hr.get(r);if(!n)throw new Error(`cannot release session. invalid session id: ${r}`);let[t,o,i,a,s]=n;a&&(s&&e._OrtClearBoundOutputs(a.handle)!==0&&Oe("Can't clear bound outputs."),e._OrtReleaseBinding(a.handle)!==0&&Oe("Can't release IO binding.")),e.jsepOnReleaseSession?.(r),e.webnnOnReleaseSession?.(r),e.webgpuOnReleaseSession?.(r),o.forEach(u=>e._OrtFree(u)),i.forEach(u=>e._OrtFree(u)),e._OrtReleaseSession(t)!==0&&Oe("Can't release session."),Hr.delete(r)},Cx=async(r,e,n,t,o,i,a=!1)=>{if(!r){e.push(0);return}let s=Me(),u=s.PTR_SIZE,l=r[0],d=r[1],p=r[3],h=p,g,b;if(l==="string"&&(p==="gpu-buffer"||p==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(a&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let w=r[2].gpuBuffer;b=_r(yr(l),d);{let v=s.jsepRegisterBuffer;if(!v)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=v(t,i,w,b)}}else if(p==="ml-tensor"){let w=r[2].mlTensor;b=_r(yr(l),d);let v=s.webnnRegisterMLTensor;if(!v)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=v(t,w,yr(l),d)}else{let w=r[2];if(Array.isArray(w)){b=u*w.length,g=s._malloc(b),n.push(g);for(let v=0;v<w.length;v++){if(typeof w[v]!="string")throw new TypeError(`tensor data at index ${v} is not a string`);s.setValue(g+v*u,Et(w[v],n),"*")}}else{let v=s.webnnIsGraphInput,$=s.webnnIsGraphOutput;if(l!=="string"&&v&&$){let A=s.UTF8ToString(o);if(v(t,A)||$(t,A)){let P=yr(l);b=_r(P,d),h="ml-tensor";let C=s.webnnCreateTemporaryTensor,R=s.webnnUploadTensor;if(!C||!R)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let x=await C(t,P,d);R(x,new Uint8Array(w.buffer,w.byteOffset,w.byteLength)),g=x}else b=w.byteLength,g=s._malloc(b),n.push(g),s.HEAPU8.set(new Uint8Array(w.buffer,w.byteOffset,b),g)}else b=w.byteLength,g=s._malloc(b),n.push(g),s.HEAPU8.set(new Uint8Array(w.buffer,w.byteOffset,b),g)}}let _=s.stackSave(),I=s.stackAlloc(4*d.length);try{d.forEach((v,$)=>s.setValue(I+$*u,v,u===4?"i32":"i64"));let w=s._OrtCreateTensor(yr(l),g,b,I,d.length,lc(h));w===0&&Oe(`Can't create tensor for input/output. session=${t}, index=${i}.`),e.push(w)}finally{s.stackRestore(_)}},va=async(r,e,n,t,o,i)=>{let a=Me(),s=a.PTR_SIZE,u=Hr.get(r);if(!u)throw new Error(`cannot run inference. invalid session id: ${r}`);let l=u[0],d=u[1],p=u[2],h=u[3],g=u[4],b=u[5],_=e.length,I=t.length,w=0,v=[],$=[],A=[],P=[],C=[],R=a.stackSave(),x=a.stackAlloc(_*s),B=a.stackAlloc(_*s),G=a.stackAlloc(I*s),Y=a.stackAlloc(I*s);try{[w,v]=l_(i),sr("wasm prepareInputOutputTensor");for(let U=0;U<_;U++)await Cx(n[U],$,P,r,d[e[U]],e[U],g);for(let U=0;U<I;U++)await Cx(o[U],A,P,r,p[t[U]],_+t[U],g);ur("wasm prepareInputOutputTensor");for(let U=0;U<_;U++)a.setValue(x+U*s,$[U],"*"),a.setValue(B+U*s,d[e[U]],"*");for(let U=0;U<I;U++)a.setValue(G+U*s,A[U],"*"),a.setValue(Y+U*s,p[t[U]],"*");if(h&&!b){let{handle:U,outputPreferredLocations:te,outputPreferredLocationsEncoded:oe}=h;if(d.length!==_)throw new Error(`input count from feeds (${_}) is expected to be always equal to model's input count (${d.length}).`);sr("wasm bindInputsOutputs");for(let ee=0;ee<_;ee++){let de=e[ee];await a._OrtBindInput(U,d[de],$[ee])!==0&&Oe(`Can't bind input[${ee}] for session=${r}.`)}for(let ee=0;ee<I;ee++){let de=t[ee];o[ee]?.[3]?(C.push(A[ee]),a._OrtBindOutput(U,p[de],A[ee],0)!==0&&Oe(`Can't bind pre-allocated output[${ee}] for session=${r}.`)):a._OrtBindOutput(U,p[de],0,oe[de])!==0&&Oe(`Can't bind output[${ee}] to ${te[ee]} for session=${r}.`)}ur("wasm bindInputsOutputs"),Hr.set(r,[l,d,p,h,g,!0])}a.jsepOnRunStart?.(l),a.webnnOnRunStart?.(l);let J;h?J=await a._OrtRunWithBinding(l,h.handle,I,G,w):J=await a._OrtRun(l,B,x,_,Y,I,G,w),J!==0&&Oe("failed to call OrtRun().");let ie=[],z=[];sr("wasm ProcessOutputTensor");for(let U=0;U<I;U++){let te=Number(a.getValue(G+U*s,"*"));if(te===A[U]||C.includes(A[U])){ie.push(o[U]),te!==A[U]&&a._OrtReleaseTensor(te)!==0&&Oe("Can't release tensor.");continue}let oe=a.stackSave(),ee=a.stackAlloc(4*s),de=!1,ge,Ie=0;try{a._OrtGetTensorData(te,ee,ee+s,ee+2*s,ee+3*s)!==0&&Oe(`Can't access output tensor data on index ${U}.`);let Ve=s===4?"i32":"i64",F=Number(a.getValue(ee,Ve));Ie=a.getValue(ee+s,"*");let q=a.getValue(ee+s*2,"*"),Ne=Number(a.getValue(ee+s*3,Ve)),rt=[];for(let Ee=0;Ee<Ne;Ee++)rt.push(Number(a.getValue(q+Ee*s,Ve)));a._OrtFree(q)!==0&&Oe("Can't free memory for tensor dims.");let Ge=rt.reduce((Ee,He)=>Ee*He,1);ge=Vn(F);let at=h?.outputPreferredLocations[t[U]];if(ge==="string"){if(at==="gpu-buffer"||at==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ee=[];for(let He=0;He<Ge;He++){let Gt=a.getValue(Ie+He*s,"*"),St=a.getValue(Ie+(He+1)*s,"*"),We=He===Ge-1?void 0:St-Gt;Ee.push(a.UTF8ToString(Gt,We))}ie.push([ge,rt,Ee,"cpu"])}else if(at==="gpu-buffer"&&Ge>0){let Ee=a.jsepGetBuffer;if(!Ee)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let He=Ee(Ie),Gt=_r(F,Ge);if(Gt===void 0||!Aa(ge))throw new Error(`Unsupported data type: ${ge}`);de=!0,ie.push([ge,rt,{gpuBuffer:He,download:a.jsepCreateDownloader(He,Gt,ge),dispose:()=>{a._OrtReleaseTensor(te)!==0&&Oe("Can't release tensor.")}},"gpu-buffer"])}else if(at==="ml-tensor"&&Ge>0){let Ee=a.webnnEnsureTensor,He=a.webnnIsGraphInputOutputTypeSupported;if(!Ee||!He)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(_r(F,Ge)===void 0||!Oa(ge))throw new Error(`Unsupported data type: ${ge}`);if(!He(r,ge,!1))throw new Error(`preferredLocation "ml-tensor" for ${ge} output is not supported by current WebNN Context.`);let St=await Ee(r,Ie,F,rt,!1);de=!0,ie.push([ge,rt,{mlTensor:St,download:a.webnnCreateMLTensorDownloader(Ie,ge),dispose:()=>{a.webnnReleaseTensorId(Ie),a._OrtReleaseTensor(te)}},"ml-tensor"])}else if(at==="ml-tensor-cpu-output"&&Ge>0){let Ee=a.webnnCreateMLTensorDownloader(Ie,ge)(),He=ie.length;de=!0,z.push((async()=>{let Gt=[He,await Ee];return a.webnnReleaseTensorId(Ie),a._OrtReleaseTensor(te),Gt})()),ie.push([ge,rt,[],"cpu"])}else{let Ee=uo(ge),He=new Ee(Ge);new Uint8Array(He.buffer,He.byteOffset,He.byteLength).set(a.HEAPU8.subarray(Ie,Ie+He.byteLength)),ie.push([ge,rt,He,"cpu"])}}finally{a.stackRestore(oe),ge==="string"&&Ie&&a._free(Ie),de||a._OrtReleaseTensor(te)}}h&&!g&&(a._OrtClearBoundOutputs(h.handle)!==0&&Oe("Can't clear bound outputs."),Hr.set(r,[l,d,p,h,g,!1]));for(let[U,te]of await Promise.all(z))ie[U][2]=te;return ur("wasm ProcessOutputTensor"),ie}finally{a.webnnOnRunEnd?.(l),a.stackRestore(R),$.forEach(J=>a._OrtReleaseTensor(J)),A.forEach(J=>a._OrtReleaseTensor(J)),P.forEach(J=>a._free(J)),w!==0&&a._OrtReleaseRunOptions(w),v.forEach(J=>a._free(J))}},xa=r=>{let e=Me(),n=Hr.get(r);if(!n)throw new Error("invalid session id");let t=n[0],o=e._OrtEndProfiling(t);o===0&&Oe("Can't get an profile file name."),e._OrtFree(o)},Ta=r=>{let e=[];for(let n of r){let t=n[2];!Array.isArray(t)&&"buffer"in t&&e.push(t.buffer)}return e}});var qr,Vt,Ko,ns,rs,ts,Wc,Hc,fo,ho,AD,Dx,kx,Nx,Lx,Rx,zx,Mx,qc=N(()=>{"use strict";ft();oc();br();ma();qr=()=>!!ce.wasm.proxy&&typeof document<"u",Ko=!1,ns=!1,rs=!1,Hc=new Map,fo=(r,e)=>{let n=Hc.get(r);n?n.push(e):Hc.set(r,[e])},ho=()=>{if(Ko||!ns||rs||!Vt)throw new Error("worker not ready")},AD=r=>{switch(r.data.type){case"init-wasm":Ko=!1,r.data.err?(rs=!0,Wc[1](r.data.err)):(ns=!0,Wc[0]()),ts&&(URL.revokeObjectURL(ts),ts=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let e=Hc.get(r.data.type);r.data.err?e.shift()[1](r.data.err):e.shift()[0](r.data.out);break}default:}},Dx=async()=>{if(!ns){if(Ko)throw new Error("multiple calls to 'initWasm()' detected.");if(rs)throw new Error("previous call to 'initWasm()' failed.");if(Ko=!0,qr())return new Promise((r,e)=>{Vt?.terminate(),a_().then(([n,t])=>{try{Vt=t,Vt.onerror=i=>e(i),Vt.onmessage=AD,Wc=[r,e];let o={type:"init-wasm",in:ce};!o.in.wasm.wasmPaths&&(n||ac)&&(o.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href}),Vt.postMessage(o),ts=n}catch(o){e(o)}},e)});try{await ga(ce.wasm),await ba(ce),ns=!0}catch(r){throw rs=!0,r}finally{Ko=!1}}},kx=async r=>{if(qr())return ho(),new Promise((e,n)=>{fo("init-ep",[e,n]);let t={type:"init-ep",in:{epName:r,env:ce}};Vt.postMessage(t)});await ya(ce,r)},Nx=async r=>qr()?(ho(),new Promise((e,n)=>{fo("copy-from",[e,n]);let t={type:"copy-from",in:{buffer:r}};Vt.postMessage(t,[r.buffer])})):Bo(r),Lx=async(r,e)=>{if(qr()){if(e?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return ho(),new Promise((n,t)=>{fo("create",[n,t]);let o={type:"create",in:{model:r,options:{...e}}},i=[];r instanceof Uint8Array&&i.push(r.buffer),Vt.postMessage(o,i)})}else return _a(r,e)},Rx=async r=>{if(qr())return ho(),new Promise((e,n)=>{fo("release",[e,n]);let t={type:"release",in:r};Vt.postMessage(t)});wa(r)},zx=async(r,e,n,t,o,i)=>{if(qr()){if(n.some(a=>a[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(o.some(a=>a))throw new Error("pre-allocated output tensor is not supported for proxy.");return ho(),new Promise((a,s)=>{fo("run",[a,s]);let u=n,l={type:"run",in:{sessionId:r,inputIndices:e,inputs:u,outputIndices:t,options:i}};Vt.postMessage(l,Ta(u))})}else return va(r,e,n,t,o,i)},Mx=async r=>{if(qr())return ho(),new Promise((e,n)=>{fo("end-profiling",[e,n]);let t={type:"end-profiling",in:r};Vt.postMessage(t)});xa(r)}});var Bx,OD,os,Fx=N(()=>{"use strict";ft();qc();ue();ha();cc();Bx=(r,e)=>{switch(r.location){case"cpu":return[r.type,r.dims,r.data,"cpu"];case"gpu-buffer":return[r.type,r.dims,{gpuBuffer:r.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[r.type,r.dims,{mlTensor:r.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${r.location} for ${e()}`)}},OD=r=>{switch(r[3]){case"cpu":return new $t(r[0],r[2],r[1]);case"gpu-buffer":{let e=r[0];if(!Aa(e))throw new Error(`not supported data type: ${e} for deserializing GPU tensor`);let{gpuBuffer:n,download:t,dispose:o}=r[2];return $t.fromGpuBuffer(n,{dataType:e,dims:r[1],download:t,dispose:o})}case"ml-tensor":{let e=r[0];if(!Oa(e))throw new Error(`not supported data type: ${e} for deserializing MLTensor tensor`);let{mlTensor:n,download:t,dispose:o}=r[2];return $t.fromMLTensor(n,{dataType:e,dims:r[1],download:t,dispose:o})}default:throw new Error(`invalid data location: ${r[3]}`)}},os=class{async fetchModelAndCopyToWasmMemory(e){return Nx(await Go(e))}async loadModel(e,n){At();let t;typeof e=="string"?t=await this.fetchModelAndCopyToWasmMemory(e):t=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Lx(t,n),_t()}async dispose(){return Rx(this.sessionId)}async run(e,n,t){At();let o=[],i=[];Object.entries(e).forEach(h=>{let g=h[0],b=h[1],_=this.inputNames.indexOf(g);if(_===-1)throw new Error(`invalid input '${g}'`);o.push(b),i.push(_)});let a=[],s=[];Object.entries(n).forEach(h=>{let g=h[0],b=h[1],_=this.outputNames.indexOf(g);if(_===-1)throw new Error(`invalid output '${g}'`);a.push(b),s.push(_)});let u=o.map((h,g)=>Bx(h,()=>`input "${this.inputNames[i[g]]}"`)),l=a.map((h,g)=>h?Bx(h,()=>`output "${this.outputNames[s[g]]}"`):null),d=await zx(this.sessionId,i,u,s,l,t),p={};for(let h=0;h<d.length;h++)p[this.outputNames[s[h]]]=a[h]??OD(d[h]);return _t(),p}startProfiling(){}endProfiling(){Mx(this.sessionId)}}});var Gx={};Sr(Gx,{OnnxruntimeWebAssemblyBackend:()=>is,initializeFlags:()=>Vx,wasmBackend:()=>PD});var Vx,is,PD,Ux=N(()=>{"use strict";ft();qc();Fx();Vx=()=>{(typeof ce.wasm.initTimeout!="number"||ce.wasm.initTimeout<0)&&(ce.wasm.initTimeout=0);let r=ce.wasm.simd;if(typeof r!="boolean"&&r!==void 0&&r!=="fixed"&&r!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${r}". Reset it to \`false\` and ignore SIMD feature checking.`),ce.wasm.simd=!1),typeof ce.wasm.proxy!="boolean"&&(ce.wasm.proxy=!1),typeof ce.wasm.trace!="boolean"&&(ce.wasm.trace=!1),typeof ce.wasm.numThreads!="number"||!Number.isInteger(ce.wasm.numThreads)||ce.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ce.wasm.numThreads=1;else{let e=typeof navigator>"u"?Ps("node:os").cpus().length:navigator.hardwareConcurrency;ce.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},is=class{async init(e){Vx(),await Dx(),await kx(e)}async createInferenceSessionHandler(e,n){let t=new os;return await t.loadModel(e,n),t}},PD=new is});ft();ft();ft();var gf="1.25.0-dev.20260327-722743c0e2";var lK=Ls;{let r=(jy(),Xr(qy)).onnxjsBackend;ar("webgl",r,-10)}{let r=(Ux(),Xr(Gx)).wasmBackend;ar("webgpu",r,5),ar("webnn",r,5),ar("cpu",r,10),ar("wasm",r,10)}Object.defineProperty(ce.versions,"web",{value:gf,enumerable:!0});export{sI as InferenceSession,di as TRACE,sr as TRACE_EVENT_BEGIN,ur as TRACE_EVENT_END,At as TRACE_FUNC_BEGIN,_t as TRACE_FUNC_END,$t as Tensor,lK as default,ce as env,ar as registerBackend};
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/*! Bundled license information:

long/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=ort.all.bundle.min.mjs.map
