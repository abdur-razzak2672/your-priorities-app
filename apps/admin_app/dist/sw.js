if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,c)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const n={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return n;default:return e(r)}})).then(e=>{const r=c(...e);return s.default||(s.default=r),s})}))}}define("./sw.js",["./workbox-80efdfd1"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"050687c3.js",revision:"ab28c93b2f5a7ebe657069f02546c312"},{url:"2e043d37.js",revision:"6f0c51a6d5e31fcd1ad81f6053551020"},{url:"543687e4.js",revision:"49327856be36e9b1462891628ca7981d"},{url:"6d0ca65b.js",revision:"1f1e7024a577e811e168624e34b54d99"},{url:"7b062c34.js",revision:"2cdecc831fd7dc3d98ab31aa31c30c58"},{url:"94b64793.js",revision:"41881d56e8a4bf6b27836d2410703000"},{url:"998afe45.js",revision:"88e2c9c212d1229147c992964e856193"},{url:"d47f3e3c.js",revision:"ad43495d526e43982a53070e4cca92f8"},{url:"ec134414.js",revision:"100e19380cbf643b9cb01f348373e7df"},{url:"f69f9111.js",revision:"6bb0a05740ae2cd6ba57b0c878cff678"},{url:"index.html",revision:"074ded97f1513ba4bb3c8db50c17a369"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/index.html"))),e.registerRoute("polyfills/*.js",new e.CacheFirst,"GET")}));
//# sourceMappingURL=sw.js.map
