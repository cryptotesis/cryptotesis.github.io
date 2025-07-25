
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort
var g;g||=typeof Module != 'undefined' ? Module : {};var aa="object"==typeof window,ba="undefined"!=typeof WorkerGlobalScope,ca="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node&&"renderer"!=process.type;"use strict";
g.onRuntimeInitialized=function(){function a(f,l){switch(typeof l){case "boolean":ac(f,l?1:0);break;case "number":bc(f,l);break;case "string":cc(f,l,-1,-1);break;case "object":if(null===l)jb(f);else if(null!=l.length){var n=da(l.length);m.set(l,n);dc(f,n,l.length,-1);ea(n)}else sa(f,"Wrong API use : tried to return a value of an unknown type ("+l+").",-1);break;default:jb(f)}}function b(f,l){for(var n=[],p=0;p<f;p+=1){var v=q(l+4*p,"i32"),x=ec(v);if(1===x||2===x)v=fc(v);else if(3===x)v=gc(v);else if(4===
x){x=v;v=hc(x);x=ic(x);for(var L=new Uint8Array(v),J=0;J<v;J+=1)L[J]=m[x+J];v=L}else v=null;n.push(v)}return n}function c(f,l){this.Qa=f;this.db=l;this.Oa=1;this.lb=[]}function d(f,l){this.db=l;this.eb=fa(f);if(null===this.eb)throw Error("Unable to allocate memory for the SQL string");this.kb=this.eb;this.Za=this.pb=null}function e(f){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=f){var l=this.filename,n="/",p=l;n&&(n="string"==typeof n?n:ha(n),p=l?ia(n+"/"+l):n);l=ja(!0,!0);p=ka(p,
l);if(f){if("string"==typeof f){n=Array(f.length);for(var v=0,x=f.length;v<x;++v)n[v]=f.charCodeAt(v);f=n}la(p,l|146);n=ma(p,577);na(n,f,0,f.length,0);oa(n);la(p,l)}}this.handleError(r(this.filename,h));this.db=q(h,"i32");mb(this.db);this.fb={};this.Sa={}}var h=u(4),k=g.cwrap,r=k("sqlite3_open","number",["string","number"]),w=k("sqlite3_close_v2","number",["number"]),t=k("sqlite3_exec","number",["number","string","number","number","number"]),A=k("sqlite3_changes","number",["number"]),F=k("sqlite3_prepare_v2",
"number",["number","string","number","number","number"]),nb=k("sqlite3_sql","string",["number"]),kc=k("sqlite3_normalized_sql","string",["number"]),ob=k("sqlite3_prepare_v2","number",["number","number","number","number","number"]),lc=k("sqlite3_bind_text","number",["number","number","number","number","number"]),pb=k("sqlite3_bind_blob","number",["number","number","number","number","number"]),mc=k("sqlite3_bind_double","number",["number","number","number"]),nc=k("sqlite3_bind_int","number",["number",
"number","number"]),oc=k("sqlite3_bind_parameter_index","number",["number","string"]),pc=k("sqlite3_step","number",["number"]),qc=k("sqlite3_errmsg","string",["number"]),rc=k("sqlite3_column_count","number",["number"]),sc=k("sqlite3_data_count","number",["number"]),tc=k("sqlite3_column_double","number",["number","number"]),qb=k("sqlite3_column_text","string",["number","number"]),uc=k("sqlite3_column_blob","number",["number","number"]),vc=k("sqlite3_column_bytes","number",["number","number"]),wc=k("sqlite3_column_type",
"number",["number","number"]),xc=k("sqlite3_column_name","string",["number","number"]),yc=k("sqlite3_reset","number",["number"]),zc=k("sqlite3_clear_bindings","number",["number"]),Ac=k("sqlite3_finalize","number",["number"]),rb=k("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),ec=k("sqlite3_value_type","number",["number"]),hc=k("sqlite3_value_bytes","number",["number"]),gc=k("sqlite3_value_text","string",["number"]),ic=k("sqlite3_value_blob",
"number",["number"]),fc=k("sqlite3_value_double","number",["number"]),bc=k("sqlite3_result_double","",["number","number"]),jb=k("sqlite3_result_null","",["number"]),cc=k("sqlite3_result_text","",["number","string","number","number"]),dc=k("sqlite3_result_blob","",["number","number","number","number"]),ac=k("sqlite3_result_int","",["number","number"]),sa=k("sqlite3_result_error","",["number","string","number"]),sb=k("sqlite3_aggregate_context","number",["number","number"]),mb=k("RegisterExtensionFunctions",
"number",["number"]),tb=k("sqlite3_update_hook","number",["number","number","number"]);c.prototype.bind=function(f){if(!this.Qa)throw"Statement closed";this.reset();return Array.isArray(f)?this.Cb(f):null!=f&&"object"===typeof f?this.Db(f):!0};c.prototype.step=function(){if(!this.Qa)throw"Statement closed";this.Oa=1;var f=pc(this.Qa);switch(f){case 100:return!0;case 101:return!1;default:throw this.db.handleError(f);}};c.prototype.wb=function(f){null==f&&(f=this.Oa,this.Oa+=1);return tc(this.Qa,f)};
c.prototype.Gb=function(f){null==f&&(f=this.Oa,this.Oa+=1);f=qb(this.Qa,f);if("function"!==typeof BigInt)throw Error("BigInt is not supported");return BigInt(f)};c.prototype.Hb=function(f){null==f&&(f=this.Oa,this.Oa+=1);return qb(this.Qa,f)};c.prototype.getBlob=function(f){null==f&&(f=this.Oa,this.Oa+=1);var l=vc(this.Qa,f);f=uc(this.Qa,f);for(var n=new Uint8Array(l),p=0;p<l;p+=1)n[p]=m[f+p];return n};c.prototype.get=function(f,l){l=l||{};null!=f&&this.bind(f)&&this.step();f=[];for(var n=sc(this.Qa),
p=0;p<n;p+=1)switch(wc(this.Qa,p)){case 1:var v=l.useBigInt?this.Gb(p):this.wb(p);f.push(v);break;case 2:f.push(this.wb(p));break;case 3:f.push(this.Hb(p));break;case 4:f.push(this.getBlob(p));break;default:f.push(null)}return f};c.prototype.getColumnNames=function(){for(var f=[],l=rc(this.Qa),n=0;n<l;n+=1)f.push(xc(this.Qa,n));return f};c.prototype.getAsObject=function(f,l){f=this.get(f,l);l=this.getColumnNames();for(var n={},p=0;p<l.length;p+=1)n[l[p]]=f[p];return n};c.prototype.getSQL=function(){return nb(this.Qa)};
c.prototype.getNormalizedSQL=function(){return kc(this.Qa)};c.prototype.run=function(f){null!=f&&this.bind(f);this.step();return this.reset()};c.prototype.sb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);f=fa(f);this.lb.push(f);this.db.handleError(lc(this.Qa,l,f,-1,0))};c.prototype.Bb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);var n=da(f.length);m.set(f,n);this.lb.push(n);this.db.handleError(pb(this.Qa,l,n,f.length,0))};c.prototype.rb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);this.db.handleError((f===
(f|0)?nc:mc)(this.Qa,l,f))};c.prototype.Eb=function(f){null==f&&(f=this.Oa,this.Oa+=1);pb(this.Qa,f,0,0,0)};c.prototype.tb=function(f,l){null==l&&(l=this.Oa,this.Oa+=1);switch(typeof f){case "string":this.sb(f,l);return;case "number":this.rb(f,l);return;case "bigint":this.sb(f.toString(),l);return;case "boolean":this.rb(f+0,l);return;case "object":if(null===f){this.Eb(l);return}if(null!=f.length){this.Bb(f,l);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+f+").";};c.prototype.Db=
function(f){var l=this;Object.keys(f).forEach(function(n){var p=oc(l.Qa,n);0!==p&&l.tb(f[n],p)});return!0};c.prototype.Cb=function(f){for(var l=0;l<f.length;l+=1)this.tb(f[l],l+1);return!0};c.prototype.reset=function(){this.freemem();return 0===zc(this.Qa)&&0===yc(this.Qa)};c.prototype.freemem=function(){for(var f;void 0!==(f=this.lb.pop());)ea(f)};c.prototype.free=function(){this.freemem();var f=0===Ac(this.Qa);delete this.db.fb[this.Qa];this.Qa=0;return f};d.prototype.next=function(){if(null===
this.eb)return{done:!0};null!==this.Za&&(this.Za.free(),this.Za=null);if(!this.db.db)throw this.mb(),Error("Database closed");var f=pa(),l=u(4);qa(h);qa(l);try{this.db.handleError(ob(this.db.db,this.kb,-1,h,l));this.kb=q(l,"i32");var n=q(h,"i32");if(0===n)return this.mb(),{done:!0};this.Za=new c(n,this.db);this.db.fb[n]=this.Za;return{value:this.Za,done:!1}}catch(p){throw this.pb=ra(this.kb),this.mb(),p;}finally{ta(f)}};d.prototype.mb=function(){ea(this.eb);this.eb=null};d.prototype.getRemainingSQL=
function(){return null!==this.pb?this.pb:ra(this.kb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(d.prototype[Symbol.iterator]=function(){return this});e.prototype.run=function(f,l){if(!this.db)throw"Database closed";if(l){f=this.prepare(f,l);try{f.step()}finally{f.free()}}else this.handleError(t(this.db,f,0,0,h));return this};e.prototype.exec=function(f,l,n){if(!this.db)throw"Database closed";var p=null,v=null,x=null;try{x=v=fa(f);var L=u(4);for(f=[];0!==q(x,"i8");){qa(h);qa(L);
this.handleError(ob(this.db,x,-1,h,L));var J=q(h,"i32");x=q(L,"i32");if(0!==J){var I=null;p=new c(J,this);for(null!=l&&p.bind(l);p.step();)null===I&&(I={columns:p.getColumnNames(),values:[]},f.push(I)),I.values.push(p.get(null,n));p.free()}}return f}catch(M){throw p&&p.free(),M;}finally{v&&ea(v)}};e.prototype.each=function(f,l,n,p,v){"function"===typeof l&&(p=n,n=l,l=void 0);f=this.prepare(f,l);try{for(;f.step();)n(f.getAsObject(null,v))}finally{f.free()}if("function"===typeof p)return p()};e.prototype.prepare=
function(f,l){qa(h);this.handleError(F(this.db,f,-1,h,0));f=q(h,"i32");if(0===f)throw"Nothing to prepare";var n=new c(f,this);null!=l&&n.bind(l);return this.fb[f]=n};e.prototype.iterateStatements=function(f){return new d(f,this)};e.prototype["export"]=function(){Object.values(this.fb).forEach(function(l){l.free()});Object.values(this.Sa).forEach(y);this.Sa={};this.handleError(w(this.db));var f=ua(this.filename);this.handleError(r(this.filename,h));this.db=q(h,"i32");mb(this.db);return f};e.prototype.close=
function(){null!==this.db&&(Object.values(this.fb).forEach(function(f){f.free()}),Object.values(this.Sa).forEach(y),this.Sa={},this.Ya&&(y(this.Ya),this.Ya=void 0),this.handleError(w(this.db)),va("/"+this.filename),this.db=null)};e.prototype.handleError=function(f){if(0===f)return null;f=qc(this.db);throw Error(f);};e.prototype.getRowsModified=function(){return A(this.db)};e.prototype.create_function=function(f,l){Object.prototype.hasOwnProperty.call(this.Sa,f)&&(y(this.Sa[f]),delete this.Sa[f]);
var n=wa(function(p,v,x){v=b(v,x);try{var L=l.apply(null,v)}catch(J){sa(p,J,-1);return}a(p,L)},"viii");this.Sa[f]=n;this.handleError(rb(this.db,f,l.length,1,0,n,0,0,0));return this};e.prototype.create_aggregate=function(f,l){var n=l.init||function(){return null},p=l.finalize||function(I){return I},v=l.step;if(!v)throw"An aggregate function must have a step function in "+f;var x={};Object.hasOwnProperty.call(this.Sa,f)&&(y(this.Sa[f]),delete this.Sa[f]);l=f+"__finalize";Object.hasOwnProperty.call(this.Sa,
l)&&(y(this.Sa[l]),delete this.Sa[l]);var L=wa(function(I,M,Pa){var X=sb(I,1);Object.hasOwnProperty.call(x,X)||(x[X]=n());M=b(M,Pa);M=[x[X]].concat(M);try{x[X]=v.apply(null,M)}catch(Cc){delete x[X],sa(I,Cc,-1)}},"viii"),J=wa(function(I){var M=sb(I,1);try{var Pa=p(x[M])}catch(X){delete x[M];sa(I,X,-1);return}a(I,Pa);delete x[M]},"vi");this.Sa[f]=L;this.Sa[l]=J;this.handleError(rb(this.db,f,v.length-1,1,0,0,L,J,0));return this};e.prototype.updateHook=function(f){this.Ya&&(tb(this.db,0,0),y(this.Ya),
this.Ya=void 0);if(!f)return this;this.Ya=wa(function(l,n,p,v,x){switch(n){case 18:l="insert";break;case 23:l="update";break;case 9:l="delete";break;default:throw"unknown operationCode in updateHook callback: "+n;}p=p?z(B,p):"";v=v?z(B,v):"";if(x>Number.MAX_SAFE_INTEGER)throw"rowId too big to fit inside a Number";f(l,p,v,Number(x))},"viiiij");tb(this.db,this.Ya,0);return this};g.Database=e};var xa={...g},ya="./this.program",za=(a,b)=>{throw b;},C="",Aa,Ba;
if(ca){var fs=require("fs");require("path");C=__dirname+"/";Ba=a=>{a=Ca(a)?new URL(a):a;return fs.readFileSync(a)};Aa=async a=>{a=Ca(a)?new URL(a):a;return fs.readFileSync(a,void 0)};!g.thisProgram&&1<process.argv.length&&(ya=process.argv[1].replace(/\\/g,"/"));process.argv.slice(2);"undefined"!=typeof module&&(module.exports=g);za=(a,b)=>{process.exitCode=a;throw b;}}else if(aa||ba)ba?C=self.location.href:"undefined"!=typeof document&&document.currentScript&&(C=document.currentScript.src),C=C.startsWith("blob:")?
"":C.slice(0,C.replace(/[?#].*/,"").lastIndexOf("/")+1),ba&&(Ba=a=>{var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)}),Aa=async a=>{if(Ca(a))return new Promise((c,d)=>{var e=new XMLHttpRequest;e.open("GET",a,!0);e.responseType="arraybuffer";e.onload=()=>{200==e.status||0==e.status&&e.response?c(e.response):d(e.status)};e.onerror=d;e.send(null)});var b=await fetch(a,{credentials:"same-origin"});if(b.ok)return b.arrayBuffer();throw Error(b.status+
" : "+b.url);};var Da=g.print||console.log.bind(console),Ea=g.printErr||console.error.bind(console);Object.assign(g,xa);xa=null;g.thisProgram&&(ya=g.thisProgram);var Fa=g.wasmBinary,Ga,Ha=!1,Ia,m,B,Ja,D,E,Ka,G,La,Ca=a=>a.startsWith("file://");
function Ma(){var a=Ga.buffer;g.HEAP8=m=new Int8Array(a);g.HEAP16=Ja=new Int16Array(a);g.HEAPU8=B=new Uint8Array(a);g.HEAPU16=new Uint16Array(a);g.HEAP32=D=new Int32Array(a);g.HEAPU32=E=new Uint32Array(a);g.HEAPF32=Ka=new Float32Array(a);g.HEAPF64=La=new Float64Array(a);g.HEAP64=G=new BigInt64Array(a);g.HEAPU64=new BigUint64Array(a)}var H=0,Na=null;function Oa(a){g.onAbort?.(a);a="Aborted("+a+")";Ea(a);Ha=!0;throw new WebAssembly.RuntimeError(a+". Build with -sASSERTIONS for more info.");}var Qa;
async function Ra(a){if(!Fa)try{var b=await Aa(a);return new Uint8Array(b)}catch{}if(a==Qa&&Fa)a=new Uint8Array(Fa);else if(Ba)a=Ba(a);else throw"both async and sync fetching of the wasm failed";return a}async function Sa(a,b){try{var c=await Ra(a);return await WebAssembly.instantiate(c,b)}catch(d){Ea(`failed to asynchronously prepare wasm: ${d}`),Oa(d)}}
async function Ta(a){var b=Qa;if(!Fa&&"function"==typeof WebAssembly.instantiateStreaming&&!Ca(b)&&!ca)try{var c=fetch(b,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(c,a)}catch(d){Ea(`wasm streaming compile failed: ${d}`),Ea("falling back to ArrayBuffer instantiation")}return Sa(b,a)}class Ua{name="ExitStatus";constructor(a){this.message=`Program terminated with exit(${a})`;this.status=a}}
var Va=a=>{for(;0<a.length;)a.shift()(g)},Wa=[],Xa=[],Ya=()=>{var a=g.preRun.shift();Xa.unshift(a)};function q(a,b="i8"){b.endsWith("*")&&(b="*");switch(b){case "i1":return m[a];case "i8":return m[a];case "i16":return Ja[a>>1];case "i32":return D[a>>2];case "i64":return G[a>>3];case "float":return Ka[a>>2];case "double":return La[a>>3];case "*":return E[a>>2];default:Oa(`invalid type for getValue: ${b}`)}}var Za=g.noExitRuntime||!0;
function qa(a){var b="i32";b.endsWith("*")&&(b="*");switch(b){case "i1":m[a]=0;break;case "i8":m[a]=0;break;case "i16":Ja[a>>1]=0;break;case "i32":D[a>>2]=0;break;case "i64":G[a>>3]=BigInt(0);break;case "float":Ka[a>>2]=0;break;case "double":La[a>>3]=0;break;case "*":E[a>>2]=0;break;default:Oa(`invalid type for setValue: ${b}`)}}
var $a="undefined"!=typeof TextDecoder?new TextDecoder:void 0,z=(a,b=0,c=NaN)=>{var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.buffer&&$a)return $a.decode(a.subarray(b,c));for(d="";b<c;){var e=a[b++];if(e&128){var h=a[b++]&63;if(192==(e&224))d+=String.fromCharCode((e&31)<<6|h);else{var k=a[b++]&63;e=224==(e&240)?(e&15)<<12|h<<6|k:(e&7)<<18|h<<12|k<<6|a[b++]&63;65536>e?d+=String.fromCharCode(e):(e-=65536,d+=String.fromCharCode(55296|e>>10,56320|e&1023))}}else d+=String.fromCharCode(e)}return d},
ra=(a,b)=>a?z(B,a,b):"",ab=(a,b)=>{for(var c=0,d=a.length-1;0<=d;d--){var e=a[d];"."===e?a.splice(d,1):".."===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a},ia=a=>{var b="/"===a.charAt(0),c="/"===a.slice(-1);(a=ab(a.split("/").filter(d=>!!d),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a},bb=a=>{var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&=b.slice(0,-1);return a+b},
cb=a=>a&&a.match(/([^\/]+|\/)\/*$/)[1],db=()=>{if(ca){var a=require("crypto");return b=>a.randomFillSync(b)}return b=>crypto.getRandomValues(b)},eb=a=>{(eb=db())(a)},fb=(...a)=>{for(var b="",c=!1,d=a.length-1;-1<=d&&!c;d--){c=0<=d?a[d]:"/";if("string"!=typeof c)throw new TypeError("Arguments to path.resolve must be strings");if(!c)return"";b=c+"/"+b;c="/"===c.charAt(0)}b=ab(b.split("/").filter(e=>!!e),!c).join("/");return(c?"/":"")+b||"."},gb=[],hb=a=>{for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);
127>=d?b++:2047>=d?b+=2:55296<=d&&57343>=d?(b+=4,++c):b+=3}return b},K=(a,b,c,d)=>{if(!(0<d))return 0;var e=c;d=c+d-1;for(var h=0;h<a.length;++h){var k=a.charCodeAt(h);if(55296<=k&&57343>=k){var r=a.charCodeAt(++h);k=65536+((k&1023)<<10)|r&1023}if(127>=k){if(c>=d)break;b[c++]=k}else{if(2047>=k){if(c+1>=d)break;b[c++]=192|k>>6}else{if(65535>=k){if(c+2>=d)break;b[c++]=224|k>>12}else{if(c+3>=d)break;b[c++]=240|k>>18;b[c++]=128|k>>12&63}b[c++]=128|k>>6&63}b[c++]=128|k&63}}b[c]=0;return c-e},ib=[];
function kb(a,b){ib[a]={input:[],output:[],cb:b};lb(a,ub)}
var ub={open(a){var b=ib[a.node.rdev];if(!b)throw new N(43);a.tty=b;a.seekable=!1},close(a){a.tty.cb.fsync(a.tty)},fsync(a){a.tty.cb.fsync(a.tty)},read(a,b,c,d){if(!a.tty||!a.tty.cb.xb)throw new N(60);for(var e=0,h=0;h<d;h++){try{var k=a.tty.cb.xb(a.tty)}catch(r){throw new N(29);}if(void 0===k&&0===e)throw new N(6);if(null===k||void 0===k)break;e++;b[c+h]=k}e&&(a.node.atime=Date.now());return e},write(a,b,c,d){if(!a.tty||!a.tty.cb.qb)throw new N(60);try{for(var e=0;e<d;e++)a.tty.cb.qb(a.tty,b[c+e])}catch(h){throw new N(29);
}d&&(a.node.mtime=a.node.ctime=Date.now());return e}},vb={xb(){a:{if(!gb.length){var a=null;if(ca){var b=Buffer.alloc(256),c=0,d=process.stdin.fd;try{c=fs.readSync(d,b,0,256)}catch(e){if(e.toString().includes("EOF"))c=0;else throw e;}0<c&&(a=b.slice(0,c).toString("utf-8"))}else"undefined"!=typeof window&&"function"==typeof window.prompt&&(a=window.prompt("Input: "),null!==a&&(a+="\n"));if(!a){a=null;break a}b=Array(hb(a)+1);a=K(a,b,0,b.length);b.length=a;gb=b}a=gb.shift()}return a},qb(a,b){null===
b||10===b?(Da(z(a.output)),a.output=[]):0!=b&&a.output.push(b)},fsync(a){0<a.output?.length&&(Da(z(a.output)),a.output=[])},Tb(){return{Ob:25856,Qb:5,Nb:191,Pb:35387,Mb:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},Ub(){return 0},Vb(){return[24,80]}},wb={qb(a,b){null===b||10===b?(Ea(z(a.output)),a.output=[]):0!=b&&a.output.push(b)},fsync(a){0<a.output?.length&&(Ea(z(a.output)),a.output=[])}},O={Wa:null,Xa(){return O.createNode(null,"/",16895,0)},createNode(a,b,c,d){if(24576===
(c&61440)||4096===(c&61440))throw new N(63);O.Wa||(O.Wa={dir:{node:{Ta:O.La.Ta,Ua:O.La.Ua,lookup:O.La.lookup,hb:O.La.hb,rename:O.La.rename,unlink:O.La.unlink,rmdir:O.La.rmdir,readdir:O.La.readdir,symlink:O.La.symlink},stream:{Va:O.Ma.Va}},file:{node:{Ta:O.La.Ta,Ua:O.La.Ua},stream:{Va:O.Ma.Va,read:O.Ma.read,write:O.Ma.write,ib:O.Ma.ib,jb:O.Ma.jb}},link:{node:{Ta:O.La.Ta,Ua:O.La.Ua,readlink:O.La.readlink},stream:{}},ub:{node:{Ta:O.La.Ta,Ua:O.La.Ua},stream:xb}});c=yb(a,b,c,d);P(c.mode)?(c.La=O.Wa.dir.node,
c.Ma=O.Wa.dir.stream,c.Na={}):32768===(c.mode&61440)?(c.La=O.Wa.file.node,c.Ma=O.Wa.file.stream,c.Ra=0,c.Na=null):40960===(c.mode&61440)?(c.La=O.Wa.link.node,c.Ma=O.Wa.link.stream):8192===(c.mode&61440)&&(c.La=O.Wa.ub.node,c.Ma=O.Wa.ub.stream);c.atime=c.mtime=c.ctime=Date.now();a&&(a.Na[b]=c,a.atime=a.mtime=a.ctime=c.atime);return c},Sb(a){return a.Na?a.Na.subarray?a.Na.subarray(0,a.Ra):new Uint8Array(a.Na):new Uint8Array(0)},La:{Ta(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=
a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;P(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Ra:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.atime);b.mtime=new Date(a.mtime);b.ctime=new Date(a.ctime);b.blksize=4096;b.blocks=Math.ceil(b.size/b.blksize);return b},Ua(a,b){for(var c of["mode","atime","mtime","ctime"])null!=b[c]&&(a[c]=b[c]);void 0!==b.size&&(b=b.size,a.Ra!=b&&(0==b?(a.Na=null,a.Ra=0):(c=a.Na,a.Na=new Uint8Array(b),c&&a.Na.set(c.subarray(0,Math.min(b,
a.Ra))),a.Ra=b)))},lookup(){throw O.vb;},hb(a,b,c,d){return O.createNode(a,b,c,d)},rename(a,b,c){try{var d=Q(b,c)}catch(h){}if(d){if(P(a.mode))for(var e in d.Na)throw new N(55);zb(d)}delete a.parent.Na[a.name];b.Na[c]=a;a.name=c;b.ctime=b.mtime=a.parent.ctime=a.parent.mtime=Date.now()},unlink(a,b){delete a.Na[b];a.ctime=a.mtime=Date.now()},rmdir(a,b){var c=Q(a,b),d;for(d in c.Na)throw new N(55);delete a.Na[b];a.ctime=a.mtime=Date.now()},readdir(a){return[".","..",...Object.keys(a.Na)]},symlink(a,
b,c){a=O.createNode(a,b,41471,0);a.link=c;return a},readlink(a){if(40960!==(a.mode&61440))throw new N(28);return a.link}},Ma:{read(a,b,c,d,e){var h=a.node.Na;if(e>=a.node.Ra)return 0;a=Math.min(a.node.Ra-e,d);if(8<a&&h.subarray)b.set(h.subarray(e,e+a),c);else for(d=0;d<a;d++)b[c+d]=h[e+d];return a},write(a,b,c,d,e,h){b.buffer===m.buffer&&(h=!1);if(!d)return 0;a=a.node;a.mtime=a.ctime=Date.now();if(b.subarray&&(!a.Na||a.Na.subarray)){if(h)return a.Na=b.subarray(c,c+d),a.Ra=d;if(0===a.Ra&&0===e)return a.Na=
b.slice(c,c+d),a.Ra=d;if(e+d<=a.Ra)return a.Na.set(b.subarray(c,c+d),e),d}h=e+d;var k=a.Na?a.Na.length:0;k>=h||(h=Math.max(h,k*(1048576>k?2:1.125)>>>0),0!=k&&(h=Math.max(h,256)),k=a.Na,a.Na=new Uint8Array(h),0<a.Ra&&a.Na.set(k.subarray(0,a.Ra),0));if(a.Na.subarray&&b.subarray)a.Na.set(b.subarray(c,c+d),e);else for(h=0;h<d;h++)a.Na[e+h]=b[c+h];a.Ra=Math.max(a.Ra,e+d);return d},Va(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Ra);if(0>b)throw new N(28);return b},ib(a,b,c,
d,e){if(32768!==(a.node.mode&61440))throw new N(43);a=a.node.Na;if(e&2||!a||a.buffer!==m.buffer){e=!0;d=65536*Math.ceil(b/65536);var h=Ab(65536,d);h&&B.fill(0,h,h+d);d=h;if(!d)throw new N(48);if(a){if(0<c||c+b<a.length)a.subarray?a=a.subarray(c,c+b):a=Array.prototype.slice.call(a,c,c+b);m.set(a,d)}}else e=!1,d=a.byteOffset;return{Kb:d,Ab:e}},jb(a,b,c,d){O.Ma.write(a,b,0,d,c,!1);return 0}}},ja=(a,b)=>{var c=0;a&&(c|=365);b&&(c|=146);return c},Bb=null,Cb={},Db=[],Eb=1,R=null,Fb=!1,Gb=!0,Hb={},N=class{name="ErrnoError";constructor(a){this.Pa=
a}},Ib=class{gb={};node=null;get flags(){return this.gb.flags}set flags(a){this.gb.flags=a}get position(){return this.gb.position}set position(a){this.gb.position=a}},Jb=class{La={};Ma={};ab=null;constructor(a,b,c,d){a||=this;this.parent=a;this.Xa=a.Xa;this.id=Eb++;this.name=b;this.mode=c;this.rdev=d;this.atime=this.mtime=this.ctime=Date.now()}get read(){return 365===(this.mode&365)}set read(a){a?this.mode|=365:this.mode&=-366}get write(){return 146===(this.mode&146)}set write(a){a?this.mode|=146:
this.mode&=-147}};
function S(a,b={}){if(!a)throw new N(44);b.nb??(b.nb=!0);"/"===a.charAt(0)||(a="//"+a);var c=0;a:for(;40>c;c++){a=a.split("/").filter(r=>!!r);for(var d=Bb,e="/",h=0;h<a.length;h++){var k=h===a.length-1;if(k&&b.parent)break;if("."!==a[h])if(".."===a[h])e=bb(e),d=d.parent;else{e=ia(e+"/"+a[h]);try{d=Q(d,a[h])}catch(r){if(44===r?.Pa&&k&&b.Jb)return{path:e};throw r;}!d.ab||k&&!b.nb||(d=d.ab.root);if(40960===(d.mode&61440)&&(!k||b.$a)){if(!d.La.readlink)throw new N(52);d=d.La.readlink(d);"/"===d.charAt(0)||
(d=bb(e)+"/"+d);a=d+"/"+a.slice(h+1).join("/");continue a}}}return{path:e,node:d}}throw new N(32);}function ha(a){for(var b;;){if(a===a.parent)return a=a.Xa.zb,b?"/"!==a[a.length-1]?`${a}/${b}`:a+b:a;b=b?`${a.name}/${b}`:a.name;a=a.parent}}function Kb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%R.length}function zb(a){var b=Kb(a.parent.id,a.name);if(R[b]===a)R[b]=a.bb;else for(b=R[b];b;){if(b.bb===a){b.bb=a.bb;break}b=b.bb}}
function Q(a,b){var c=P(a.mode)?(c=Lb(a,"x"))?c:a.La.lookup?0:2:54;if(c)throw new N(c);for(c=R[Kb(a.id,b)];c;c=c.bb){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.La.lookup(a,b)}function yb(a,b,c,d){a=new Jb(a,b,c,d);b=Kb(a.parent.id,a.name);a.bb=R[b];return R[b]=a}function P(a){return 16384===(a&61440)}function Mb(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}
function Lb(a,b){if(Gb)return 0;if(!b.includes("r")||a.mode&292){if(b.includes("w")&&!(a.mode&146)||b.includes("x")&&!(a.mode&73))return 2}else return 2;return 0}function Nb(a,b){if(!P(a.mode))return 54;try{return Q(a,b),20}catch(c){}return Lb(a,"wx")}function Ob(a,b,c){try{var d=Q(a,b)}catch(e){return e.Pa}if(a=Lb(a,"wx"))return a;if(c){if(!P(d.mode))return 54;if(d===d.parent||"/"===ha(d))return 10}else if(P(d.mode))return 31;return 0}function Pb(a){if(!a)throw new N(63);return a}
function T(a){a=Db[a];if(!a)throw new N(8);return a}function Qb(a,b=-1){a=Object.assign(new Ib,a);if(-1==b)a:{for(b=0;4096>=b;b++)if(!Db[b])break a;throw new N(33);}a.fd=b;return Db[b]=a}function Rb(a,b=-1){a=Qb(a,b);a.Ma?.Rb?.(a);return a}function Sb(a,b,c){var d=a?.Ma.Ua;a=d?a:b;d??=b.La.Ua;Pb(d);d(a,c)}var xb={open(a){a.Ma=Cb[a.node.rdev].Ma;a.Ma.open?.(a)},Va(){throw new N(70);}};function lb(a,b){Cb[a]={Ma:b}}
function Tb(a,b){var c="/"===b;if(c&&Bb)throw new N(10);if(!c&&b){var d=S(b,{nb:!1});b=d.path;d=d.node;if(d.ab)throw new N(10);if(!P(d.mode))throw new N(54);}b={type:a,Wb:{},zb:b,Ib:[]};a=a.Xa(b);a.Xa=b;b.root=a;c?Bb=a:d&&(d.ab=b,d.Xa&&d.Xa.Ib.push(b))}function Ub(a,b,c){var d=S(a,{parent:!0}).node;a=cb(a);if(!a)throw new N(28);if("."===a||".."===a)throw new N(20);var e=Nb(d,a);if(e)throw new N(e);if(!d.La.hb)throw new N(63);return d.La.hb(d,a,b,c)}
function ka(a,b=438){return Ub(a,b&4095|32768,0)}function U(a,b=511){return Ub(a,b&1023|16384,0)}function Vb(a,b,c){"undefined"==typeof c&&(c=b,b=438);Ub(a,b|8192,c)}function Wb(a,b){if(!fb(a))throw new N(44);var c=S(b,{parent:!0}).node;if(!c)throw new N(44);b=cb(b);var d=Nb(c,b);if(d)throw new N(d);if(!c.La.symlink)throw new N(63);c.La.symlink(c,b,a)}
function Xb(a){var b=S(a,{parent:!0}).node;a=cb(a);var c=Q(b,a),d=Ob(b,a,!0);if(d)throw new N(d);if(!b.La.rmdir)throw new N(63);if(c.ab)throw new N(10);b.La.rmdir(b,a);zb(c)}function va(a){var b=S(a,{parent:!0}).node;if(!b)throw new N(44);a=cb(a);var c=Q(b,a),d=Ob(b,a,!1);if(d)throw new N(d);if(!b.La.unlink)throw new N(63);if(c.ab)throw new N(10);b.La.unlink(b,a);zb(c)}function Yb(a,b){a=S(a,{$a:!b}).node;return Pb(a.La.Ta)(a)}
function Zb(a,b,c,d){Sb(a,b,{mode:c&4095|b.mode&-4096,ctime:Date.now(),Fb:d})}function la(a,b){a="string"==typeof a?S(a,{$a:!0}).node:a;Zb(null,a,b)}function $b(a,b,c){if(P(b.mode))throw new N(31);if(32768!==(b.mode&61440))throw new N(28);var d=Lb(b,"w");if(d)throw new N(d);Sb(a,b,{size:c,timestamp:Date.now()})}
function ma(a,b,c=438){if(""===a)throw new N(44);if("string"==typeof b){var d={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090}[b];if("undefined"==typeof d)throw Error(`Unknown file open mode: ${b}`);b=d}c=b&64?c&4095|32768:0;if("object"==typeof a)d=a;else{var e=a.endsWith("/");a=S(a,{$a:!(b&131072),Jb:!0});d=a.node;a=a.path}var h=!1;if(b&64)if(d){if(b&128)throw new N(20);}else{if(e)throw new N(31);d=Ub(a,c|511,0);h=!0}if(!d)throw new N(44);8192===(d.mode&61440)&&(b&=-513);if(b&65536&&!P(d.mode))throw new N(54);
if(!h&&(e=d?40960===(d.mode&61440)?32:P(d.mode)&&("r"!==Mb(b)||b&576)?31:Lb(d,Mb(b)):44))throw new N(e);b&512&&!h&&(e=d,e="string"==typeof e?S(e,{$a:!0}).node:e,$b(null,e,0));b&=-131713;e=Qb({node:d,path:ha(d),flags:b,seekable:!0,position:0,Ma:d.Ma,Lb:[],error:!1});e.Ma.open&&e.Ma.open(e);h&&la(d,c&511);!g.logReadFiles||b&1||a in Hb||(Hb[a]=1);return e}function oa(a){if(null===a.fd)throw new N(8);a.ob&&(a.ob=null);try{a.Ma.close&&a.Ma.close(a)}catch(b){throw b;}finally{Db[a.fd]=null}a.fd=null}
function jc(a,b,c){if(null===a.fd)throw new N(8);if(!a.seekable||!a.Ma.Va)throw new N(70);if(0!=c&&1!=c&&2!=c)throw new N(28);a.position=a.Ma.Va(a,b,c);a.Lb=[]}function Bc(a,b,c,d,e){if(0>d||0>e)throw new N(28);if(null===a.fd)throw new N(8);if(1===(a.flags&2097155))throw new N(8);if(P(a.node.mode))throw new N(31);if(!a.Ma.read)throw new N(28);var h="undefined"!=typeof e;if(!h)e=a.position;else if(!a.seekable)throw new N(70);b=a.Ma.read(a,b,c,d,e);h||(a.position+=b);return b}
function na(a,b,c,d,e){if(0>d||0>e)throw new N(28);if(null===a.fd)throw new N(8);if(0===(a.flags&2097155))throw new N(8);if(P(a.node.mode))throw new N(31);if(!a.Ma.write)throw new N(28);a.seekable&&a.flags&1024&&jc(a,0,2);var h="undefined"!=typeof e;if(!h)e=a.position;else if(!a.seekable)throw new N(70);b=a.Ma.write(a,b,c,d,e,void 0);h||(a.position+=b);return b}
function ua(a){var b="binary";if("utf8"!==b&&"binary"!==b)throw Error(`Invalid encoding type "${b}"`);var c;var d=ma(a,d||0);a=Yb(a).size;var e=new Uint8Array(a);Bc(d,e,0,a,0);"utf8"===b?c=z(e):"binary"===b&&(c=e);oa(d);return c}
function V(a,b,c){a=ia("/dev/"+a);var d=ja(!!b,!!c);V.yb??(V.yb=64);var e=V.yb++<<8|0;lb(e,{open(h){h.seekable=!1},close(){c?.buffer?.length&&c(10)},read(h,k,r,w){for(var t=0,A=0;A<w;A++){try{var F=b()}catch(nb){throw new N(29);}if(void 0===F&&0===t)throw new N(6);if(null===F||void 0===F)break;t++;k[r+A]=F}t&&(h.node.atime=Date.now());return t},write(h,k,r,w){for(var t=0;t<w;t++)try{c(k[r+t])}catch(A){throw new N(29);}w&&(h.node.mtime=h.node.ctime=Date.now());return t}});Vb(a,d,e)}var W={};
function Dc(a,b,c){if("/"===b.charAt(0))return b;a=-100===a?"/":T(a).path;if(0==b.length){if(!c)throw new N(44);return a}return a+"/"+b}
function Ec(a,b){D[a>>2]=b.dev;D[a+4>>2]=b.mode;E[a+8>>2]=b.nlink;D[a+12>>2]=b.uid;D[a+16>>2]=b.gid;D[a+20>>2]=b.rdev;G[a+24>>3]=BigInt(b.size);D[a+32>>2]=4096;D[a+36>>2]=b.blocks;var c=b.atime.getTime(),d=b.mtime.getTime(),e=b.ctime.getTime();G[a+40>>3]=BigInt(Math.floor(c/1E3));E[a+48>>2]=c%1E3*1E6;G[a+56>>3]=BigInt(Math.floor(d/1E3));E[a+64>>2]=d%1E3*1E6;G[a+72>>3]=BigInt(Math.floor(e/1E3));E[a+80>>2]=e%1E3*1E6;G[a+88>>3]=BigInt(b.ino);return 0}
var Fc=void 0,Gc=()=>{var a=D[+Fc>>2];Fc+=4;return a},Hc=0,Ic=[0,31,60,91,121,152,182,213,244,274,305,335],Jc=[0,31,59,90,120,151,181,212,243,273,304,334],Kc={},Lc=a=>{Ia=a;Za||0<Hc||(g.onExit?.(a),Ha=!0);za(a,new Ua(a))},Mc=a=>{if(!Ha)try{if(a(),!(Za||0<Hc))try{Ia=a=Ia,Lc(a)}catch(b){b instanceof Ua||"unwind"==b||za(1,b)}}catch(b){b instanceof Ua||"unwind"==b||za(1,b)}},Nc={},Pc=()=>{if(!Oc){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&
navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:ya||"./this.program"},b;for(b in Nc)void 0===Nc[b]?delete a[b]:a[b]=Nc[b];var c=[];for(b in a)c.push(`${b}=${a[b]}`);Oc=c}return Oc},Oc,Qc=(a,b,c,d)=>{var e={string:t=>{var A=0;if(null!==t&&void 0!==t&&0!==t){A=hb(t)+1;var F=u(A);K(t,B,F,A);A=F}return A},array:t=>{var A=u(t.length);m.set(t,A);return A}};a=g["_"+a];var h=[],k=0;if(d)for(var r=0;r<d.length;r++){var w=e[c[r]];w?(0===k&&(k=pa()),h[r]=w(d[r])):h[r]=d[r]}c=a(...h);
return c=function(t){0!==k&&ta(k);return"string"===b?t?z(B,t):"":"boolean"===b?!!t:t}(c)},fa=a=>{var b=hb(a)+1,c=da(b);c&&K(a,B,c,b);return c},Rc,Sc=[],Y,y=a=>{Rc.delete(Y.get(a));Y.set(a,null);Sc.push(a)},wa=(a,b)=>{if(!Rc){Rc=new WeakMap;var c=Y.length;if(Rc)for(var d=0;d<0+c;d++){var e=Y.get(d);e&&Rc.set(e,d)}}if(c=Rc.get(a)||0)return c;if(Sc.length)c=Sc.pop();else{try{Y.grow(1)}catch(w){if(!(w instanceof RangeError))throw w;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}c=Y.length-
1}try{Y.set(c,a)}catch(w){if(!(w instanceof TypeError))throw w;if("function"==typeof WebAssembly.Function){var h=WebAssembly.Function;d={i:"i32",j:"i64",f:"f32",d:"f64",e:"externref",p:"i32"};e={parameters:[],results:"v"==b[0]?[]:[d[b[0]]]};for(var k=1;k<b.length;++k)e.parameters.push(d[b[k]]);b=new h(e,a)}else{d=[1];e=b.slice(0,1);b=b.slice(1);k={i:127,p:127,j:126,f:125,d:124,e:111};d.push(96);var r=b.length;128>r?d.push(r):d.push(r%128|128,r>>7);for(h of b)d.push(k[h]);"v"==e?d.push(0):d.push(1,
k[e]);b=[0,97,115,109,1,0,0,0,1];h=d.length;128>h?b.push(h):b.push(h%128|128,h>>7);b.push(...d);b.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);b=new WebAssembly.Module(new Uint8Array(b));b=(new WebAssembly.Instance(b,{e:{f:a}})).exports.f}Y.set(c,b)}Rc.set(a,c);return c};R=Array(4096);Tb(O,"/");U("/tmp");U("/home");U("/home/web_user");
(function(){U("/dev");lb(259,{read:()=>0,write:(d,e,h,k)=>k,Va:()=>0});Vb("/dev/null",259);kb(1280,vb);kb(1536,wb);Vb("/dev/tty",1280);Vb("/dev/tty1",1536);var a=new Uint8Array(1024),b=0,c=()=>{0===b&&(eb(a),b=a.byteLength);return a[--b]};V("random",c);V("urandom",c);U("/dev/shm");U("/dev/shm/tmp")})();
(function(){U("/proc");var a=U("/proc/self");U("/proc/self/fd");Tb({Xa(){var b=yb(a,"fd",16895,73);b.Ma={Va:O.Ma.Va};b.La={lookup(c,d){c=+d;var e=T(c);c={parent:null,Xa:{zb:"fake"},La:{readlink:()=>e.path},id:c+1};return c.parent=c},readdir(){return Array.from(Db.entries()).filter(([,c])=>c).map(([c])=>c.toString())}};return b}},"/proc/self/fd")})();O.vb=new N(44);O.vb.stack="<generic error, no stack>";
var Uc={a:(a,b,c,d)=>Oa(`Assertion failed: ${a?z(B,a):""}, at: `+[b?b?z(B,b):"":"unknown filename",c,d?d?z(B,d):"":"unknown function"]),i:function(a,b){try{return a=a?z(B,a):"",la(a,b),0}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return-c.Pa}},L:function(a,b,c){try{b=b?z(B,b):"";b=Dc(a,b);if(c&-8)return-28;var d=S(b,{$a:!0}).node;if(!d)return-44;a="";c&4&&(a+="r");c&2&&(a+="w");c&1&&(a+="x");return a&&Lb(d,a)?-2:0}catch(e){if("undefined"==typeof W||"ErrnoError"!==e.name)throw e;
return-e.Pa}},j:function(a,b){try{var c=T(a);Zb(c,c.node,b,!1);return 0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return-d.Pa}},h:function(a){try{var b=T(a);Sb(b,b.node,{timestamp:Date.now(),Fb:!1});return 0}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return-c.Pa}},b:function(a,b,c){Fc=c;try{var d=T(a);switch(b){case 0:var e=Gc();if(0>e)break;for(;Db[e];)e++;return Rb(d,e).fd;case 1:case 2:return 0;case 3:return d.flags;case 4:return e=Gc(),d.flags|=e,0;
case 12:return e=Gc(),Ja[e+0>>1]=2,0;case 13:case 14:return 0}return-28}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return-h.Pa}},g:function(a,b){try{var c=T(a),d=c.node,e=c.Ma.Ta;a=e?c:d;e??=d.La.Ta;Pb(e);var h=e(a);return Ec(b,h)}catch(k){if("undefined"==typeof W||"ErrnoError"!==k.name)throw k;return-k.Pa}},H:function(a,b){b=-9007199254740992>b||9007199254740992<b?NaN:Number(b);try{if(isNaN(b))return 61;var c=T(a);if(0>b||0===(c.flags&2097155))throw new N(28);$b(c,c.node,b);
return 0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return-d.Pa}},G:function(a,b){try{if(0===b)return-28;var c=hb("/")+1;if(b<c)return-68;K("/",B,a,b);return c}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return-d.Pa}},K:function(a,b){try{return a=a?z(B,a):"",Ec(b,Yb(a,!0))}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return-c.Pa}},C:function(a,b,c){try{return b=b?z(B,b):"",b=Dc(a,b),U(b,c),0}catch(d){if("undefined"==typeof W||"ErrnoError"!==
d.name)throw d;return-d.Pa}},J:function(a,b,c,d){try{b=b?z(B,b):"";var e=d&256;b=Dc(a,b,d&4096);return Ec(c,e?Yb(b,!0):Yb(b))}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return-h.Pa}},x:function(a,b,c,d){Fc=d;try{b=b?z(B,b):"";b=Dc(a,b);var e=d?Gc():0;return ma(b,c,e).fd}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return-h.Pa}},v:function(a,b,c,d){try{b=b?z(B,b):"";b=Dc(a,b);if(0>=d)return-28;var e=S(b).node;if(!e)throw new N(44);if(!e.La.readlink)throw new N(28);
var h=e.La.readlink(e);var k=Math.min(d,hb(h)),r=m[c+k];K(h,B,c,d+1);m[c+k]=r;return k}catch(w){if("undefined"==typeof W||"ErrnoError"!==w.name)throw w;return-w.Pa}},u:function(a){try{return a=a?z(B,a):"",Xb(a),0}catch(b){if("undefined"==typeof W||"ErrnoError"!==b.name)throw b;return-b.Pa}},f:function(a,b){try{return a=a?z(B,a):"",Ec(b,Yb(a))}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return-c.Pa}},r:function(a,b,c){try{return b=b?z(B,b):"",b=Dc(a,b),0===c?va(b):512===c?Xb(b):
Oa("Invalid flags passed to unlinkat"),0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return-d.Pa}},q:function(a,b,c){try{b=b?z(B,b):"";b=Dc(a,b,!0);var d=Date.now(),e,h;if(c){var k=E[c>>2]+4294967296*D[c+4>>2],r=D[c+8>>2];1073741823==r?e=d:1073741822==r?e=null:e=1E3*k+r/1E6;c+=16;k=E[c>>2]+4294967296*D[c+4>>2];r=D[c+8>>2];1073741823==r?h=d:1073741822==r?h=null:h=1E3*k+r/1E6}else h=e=d;if(null!==(h??e)){a=e;var w=S(b,{$a:!0}).node;Pb(w.La.Ua)(w,{atime:a,mtime:h})}return 0}catch(t){if("undefined"==
typeof W||"ErrnoError"!==t.name)throw t;return-t.Pa}},m:()=>Oa(""),l:()=>{Za=!1;Hc=0},A:function(a,b){a=-9007199254740992>a||9007199254740992<a?NaN:Number(a);a=new Date(1E3*a);D[b>>2]=a.getSeconds();D[b+4>>2]=a.getMinutes();D[b+8>>2]=a.getHours();D[b+12>>2]=a.getDate();D[b+16>>2]=a.getMonth();D[b+20>>2]=a.getFullYear()-1900;D[b+24>>2]=a.getDay();var c=a.getFullYear();D[b+28>>2]=(0!==c%4||0===c%100&&0!==c%400?Jc:Ic)[a.getMonth()]+a.getDate()-1|0;D[b+36>>2]=-(60*a.getTimezoneOffset());c=(new Date(a.getFullYear(),
6,1)).getTimezoneOffset();var d=(new Date(a.getFullYear(),0,1)).getTimezoneOffset();D[b+32>>2]=(c!=d&&a.getTimezoneOffset()==Math.min(d,c))|0},y:function(a,b,c,d,e,h,k){e=-9007199254740992>e||9007199254740992<e?NaN:Number(e);try{if(isNaN(e))return 61;var r=T(d);if(0!==(b&2)&&0===(c&2)&&2!==(r.flags&2097155))throw new N(2);if(1===(r.flags&2097155))throw new N(2);if(!r.Ma.ib)throw new N(43);if(!a)throw new N(28);var w=r.Ma.ib(r,a,e,b,c);var t=w.Kb;D[h>>2]=w.Ab;E[k>>2]=t;return 0}catch(A){if("undefined"==
typeof W||"ErrnoError"!==A.name)throw A;return-A.Pa}},z:function(a,b,c,d,e,h){h=-9007199254740992>h||9007199254740992<h?NaN:Number(h);try{var k=T(e);if(c&2){c=h;if(32768!==(k.node.mode&61440))throw new N(43);if(!(d&2)){var r=B.slice(a,a+b);k.Ma.jb&&k.Ma.jb(k,r,c,b,d)}}}catch(w){if("undefined"==typeof W||"ErrnoError"!==w.name)throw w;return-w.Pa}},n:(a,b)=>{Kc[a]&&(clearTimeout(Kc[a].id),delete Kc[a]);if(!b)return 0;var c=setTimeout(()=>{delete Kc[a];Mc(()=>Tc(a,performance.now()))},b);Kc[a]={id:c,
Xb:b};return 0},B:(a,b,c,d)=>{var e=(new Date).getFullYear(),h=(new Date(e,0,1)).getTimezoneOffset();e=(new Date(e,6,1)).getTimezoneOffset();E[a>>2]=60*Math.max(h,e);D[b>>2]=Number(h!=e);b=k=>{var r=Math.abs(k);return`UTC${0<=k?"-":"+"}${String(Math.floor(r/60)).padStart(2,"0")}${String(r%60).padStart(2,"0")}`};a=b(h);b=b(e);e<h?(K(a,B,c,17),K(b,B,d,17)):(K(a,B,d,17),K(b,B,c,17))},d:()=>Date.now(),s:()=>2147483648,c:()=>performance.now(),o:a=>{var b=B.length;a>>>=0;if(2147483648<a)return!1;for(var c=
1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);a:{d=(Math.min(2147483648,65536*Math.ceil(Math.max(a,d)/65536))-Ga.buffer.byteLength+65535)/65536|0;try{Ga.grow(d);Ma();var e=1;break a}catch(h){}e=void 0}if(e)return!0}return!1},E:(a,b)=>{var c=0;Pc().forEach((d,e)=>{var h=b+c;e=E[a+4*e>>2]=h;for(h=0;h<d.length;++h)m[e++]=d.charCodeAt(h);m[e]=0;c+=d.length+1});return 0},F:(a,b)=>{var c=Pc();E[a>>2]=c.length;var d=0;c.forEach(e=>d+=e.length+1);E[b>>2]=d;return 0},e:function(a){try{var b=T(a);
oa(b);return 0}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;return c.Pa}},p:function(a,b){try{var c=T(a);m[b]=c.tty?2:P(c.mode)?3:40960===(c.mode&61440)?7:4;Ja[b+2>>1]=0;G[b+8>>3]=BigInt(0);G[b+16>>3]=BigInt(0);return 0}catch(d){if("undefined"==typeof W||"ErrnoError"!==d.name)throw d;return d.Pa}},w:function(a,b,c,d){try{a:{var e=T(a);a=b;for(var h,k=b=0;k<c;k++){var r=E[a>>2],w=E[a+4>>2];a+=8;var t=Bc(e,m,r,w,h);if(0>t){var A=-1;break a}b+=t;if(t<w)break;"undefined"!=typeof h&&
(h+=t)}A=b}E[d>>2]=A;return 0}catch(F){if("undefined"==typeof W||"ErrnoError"!==F.name)throw F;return F.Pa}},D:function(a,b,c,d){b=-9007199254740992>b||9007199254740992<b?NaN:Number(b);try{if(isNaN(b))return 61;var e=T(a);jc(e,b,c);G[d>>3]=BigInt(e.position);e.ob&&0===b&&0===c&&(e.ob=null);return 0}catch(h){if("undefined"==typeof W||"ErrnoError"!==h.name)throw h;return h.Pa}},I:function(a){try{var b=T(a);return b.Ma?.fsync?b.Ma.fsync(b):0}catch(c){if("undefined"==typeof W||"ErrnoError"!==c.name)throw c;
return c.Pa}},t:function(a,b,c,d){try{a:{var e=T(a);a=b;for(var h,k=b=0;k<c;k++){var r=E[a>>2],w=E[a+4>>2];a+=8;var t=na(e,m,r,w,h);if(0>t){var A=-1;break a}b+=t;if(t<w)break;"undefined"!=typeof h&&(h+=t)}A=b}E[d>>2]=A;return 0}catch(F){if("undefined"==typeof W||"ErrnoError"!==F.name)throw F;return F.Pa}},k:Lc},Z;
(async function(){function a(c){Z=c.exports;Ga=Z.M;Ma();Y=Z.O;H--;g.monitorRunDependencies?.(H);0==H&&Na&&(c=Na,Na=null,c());return Z}H++;g.monitorRunDependencies?.(H);var b={a:Uc};if(g.instantiateWasm)return new Promise(c=>{g.instantiateWasm(b,(d,e)=>{a(d,e);c(d.exports)})});Qa??=g.locateFile?g.locateFile("sql-wasm.wasm",C):C+"sql-wasm.wasm";return a((await Ta(b)).instance)})();g._sqlite3_free=a=>(g._sqlite3_free=Z.P)(a);g._sqlite3_value_text=a=>(g._sqlite3_value_text=Z.Q)(a);
g._sqlite3_prepare_v2=(a,b,c,d,e)=>(g._sqlite3_prepare_v2=Z.R)(a,b,c,d,e);g._sqlite3_step=a=>(g._sqlite3_step=Z.S)(a);g._sqlite3_reset=a=>(g._sqlite3_reset=Z.T)(a);g._sqlite3_exec=(a,b,c,d,e)=>(g._sqlite3_exec=Z.U)(a,b,c,d,e);g._sqlite3_finalize=a=>(g._sqlite3_finalize=Z.V)(a);g._sqlite3_column_name=(a,b)=>(g._sqlite3_column_name=Z.W)(a,b);g._sqlite3_column_text=(a,b)=>(g._sqlite3_column_text=Z.X)(a,b);g._sqlite3_column_type=(a,b)=>(g._sqlite3_column_type=Z.Y)(a,b);
g._sqlite3_errmsg=a=>(g._sqlite3_errmsg=Z.Z)(a);g._sqlite3_clear_bindings=a=>(g._sqlite3_clear_bindings=Z._)(a);g._sqlite3_value_blob=a=>(g._sqlite3_value_blob=Z.$)(a);g._sqlite3_value_bytes=a=>(g._sqlite3_value_bytes=Z.aa)(a);g._sqlite3_value_double=a=>(g._sqlite3_value_double=Z.ba)(a);g._sqlite3_value_int=a=>(g._sqlite3_value_int=Z.ca)(a);g._sqlite3_value_type=a=>(g._sqlite3_value_type=Z.da)(a);g._sqlite3_result_blob=(a,b,c,d)=>(g._sqlite3_result_blob=Z.ea)(a,b,c,d);
g._sqlite3_result_double=(a,b)=>(g._sqlite3_result_double=Z.fa)(a,b);g._sqlite3_result_error=(a,b,c)=>(g._sqlite3_result_error=Z.ga)(a,b,c);g._sqlite3_result_int=(a,b)=>(g._sqlite3_result_int=Z.ha)(a,b);g._sqlite3_result_int64=(a,b)=>(g._sqlite3_result_int64=Z.ia)(a,b);g._sqlite3_result_null=a=>(g._sqlite3_result_null=Z.ja)(a);g._sqlite3_result_text=(a,b,c,d)=>(g._sqlite3_result_text=Z.ka)(a,b,c,d);g._sqlite3_aggregate_context=(a,b)=>(g._sqlite3_aggregate_context=Z.la)(a,b);
g._sqlite3_column_count=a=>(g._sqlite3_column_count=Z.ma)(a);g._sqlite3_data_count=a=>(g._sqlite3_data_count=Z.na)(a);g._sqlite3_column_blob=(a,b)=>(g._sqlite3_column_blob=Z.oa)(a,b);g._sqlite3_column_bytes=(a,b)=>(g._sqlite3_column_bytes=Z.pa)(a,b);g._sqlite3_column_double=(a,b)=>(g._sqlite3_column_double=Z.qa)(a,b);g._sqlite3_bind_blob=(a,b,c,d,e)=>(g._sqlite3_bind_blob=Z.ra)(a,b,c,d,e);g._sqlite3_bind_double=(a,b,c)=>(g._sqlite3_bind_double=Z.sa)(a,b,c);
g._sqlite3_bind_int=(a,b,c)=>(g._sqlite3_bind_int=Z.ta)(a,b,c);g._sqlite3_bind_text=(a,b,c,d,e)=>(g._sqlite3_bind_text=Z.ua)(a,b,c,d,e);g._sqlite3_bind_parameter_index=(a,b)=>(g._sqlite3_bind_parameter_index=Z.va)(a,b);g._sqlite3_sql=a=>(g._sqlite3_sql=Z.wa)(a);g._sqlite3_normalized_sql=a=>(g._sqlite3_normalized_sql=Z.xa)(a);g._sqlite3_changes=a=>(g._sqlite3_changes=Z.ya)(a);g._sqlite3_close_v2=a=>(g._sqlite3_close_v2=Z.za)(a);
g._sqlite3_create_function_v2=(a,b,c,d,e,h,k,r,w)=>(g._sqlite3_create_function_v2=Z.Aa)(a,b,c,d,e,h,k,r,w);g._sqlite3_update_hook=(a,b,c)=>(g._sqlite3_update_hook=Z.Ba)(a,b,c);g._sqlite3_open=(a,b)=>(g._sqlite3_open=Z.Ca)(a,b);var da=g._malloc=a=>(da=g._malloc=Z.Da)(a),ea=g._free=a=>(ea=g._free=Z.Ea)(a);g._RegisterExtensionFunctions=a=>(g._RegisterExtensionFunctions=Z.Fa)(a);var Ab=(a,b)=>(Ab=Z.Ga)(a,b),Tc=(a,b)=>(Tc=Z.Ha)(a,b),ta=a=>(ta=Z.Ia)(a),u=a=>(u=Z.Ja)(a),pa=()=>(pa=Z.Ka)();
g.stackSave=()=>pa();g.stackRestore=a=>ta(a);g.stackAlloc=a=>u(a);g.cwrap=(a,b,c,d)=>{var e=!c||c.every(h=>"number"===h||"boolean"===h);return"string"!==b&&e&&!d?g["_"+a]:(...h)=>Qc(a,b,c,h)};g.addFunction=wa;g.removeFunction=y;g.UTF8ToString=ra;g.stringToNewUTF8=fa;g.writeArrayToMemory=(a,b)=>{m.set(a,b)};
function Vc(){function a(){g.calledRun=!0;if(!Ha){if(!g.noFSInit&&!Fb){var b,c;Fb=!0;d??=g.stdin;b??=g.stdout;c??=g.stderr;d?V("stdin",d):Wb("/dev/tty","/dev/stdin");b?V("stdout",null,b):Wb("/dev/tty","/dev/stdout");c?V("stderr",null,c):Wb("/dev/tty1","/dev/stderr");ma("/dev/stdin",0);ma("/dev/stdout",1);ma("/dev/stderr",1)}Z.N();Gb=!1;g.onRuntimeInitialized?.();if(g.postRun)for("function"==typeof g.postRun&&(g.postRun=[g.postRun]);g.postRun.length;){var d=g.postRun.shift();Wa.unshift(d)}Va(Wa)}}
if(0<H)Na=Vc;else{if(g.preRun)for("function"==typeof g.preRun&&(g.preRun=[g.preRun]);g.preRun.length;)Ya();Va(Xa);0<H?Na=Vc:g.setStatus?(g.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>g.setStatus(""),1);a()},1)):a()}}if(g.preInit)for("function"==typeof g.preInit&&(g.preInit=[g.preInit]);0<g.preInit.length;)g.preInit.pop()();Vc();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

"use strict";

var db;

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    var config = data["config"] ? data["config"] : {};
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"], config)
            });
        case "getRowsModified":
            return postMessage({
                id: data["id"],
                rowsModified: db.getRowsModified()
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done, config);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

db = null;
var sqlModuleReady = initSqlJs();

function global_sqljs_message_handler(event) {
    return sqlModuleReady
        .then(onModuleReady.bind(event))
        .catch(onError.bind(event));
}

if (typeof importScripts === "function") {
    self.onmessage = global_sqljs_message_handler;
}

if (typeof require === "function") {
    // eslint-disable-next-line global-require
    var worker_threads = require("worker_threads");
    var parentPort = worker_threads.parentPort;
    // eslint-disable-next-line no-undef
    globalThis.postMessage = parentPort.postMessage.bind(parentPort);
    parentPort.on("message", function onmessage(data) {
        var event = { data: data };
        global_sqljs_message_handler(event);
    });

    if (typeof process !== "undefined") {
        process.on("uncaughtException", function uncaughtException(err) {
            postMessage({ error: err.message });
        });
        process.on("unhandledRejection", function unhandledRejection(err) {
            postMessage({ error: err.message });
        });
    }
}
