if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,c)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const f={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return f;default:return e(r)}})).then(e=>{const r=c(...e);return s.default||(s.default=r),s})}))}}define("./sw.js",["./workbox-80efdfd1"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"21484eb2.js",revision:"dceeda4eb77316fe6d301d87d9551c78"},{url:"6255b0b7.js",revision:"006d8bf2b37c0593d366d507e2d570f3"},{url:"667b835f.js",revision:"c9fffdeeebcfbf328ed58404d35794c3"},{url:"757ebb11.js",revision:"6a4a6eef35421913fcf540adda5e5320"},{url:"845a1093.js",revision:"4b2a23ae10d15c9beef5420ae4e85674"},{url:"8a45ccb2.js",revision:"71b9ba39751566592616600fcce499e4"},{url:"8e8f78cd.js",revision:"3229a81ba79a119f5fe4a752e936d5d6"},{url:"998afe45.js",revision:"f176fba8de6aca93ae9d0b22c961977a"},{url:"b03c12bb.js",revision:"6b396122b3478426bcbcb57e383f148e"},{url:"b52f9e86.js",revision:"a68dd366acece8f628b8ee1175b0f935"},{url:"f3157fa4.js",revision:"6cc8fb2ace3e12c9ee7874beb96831b4"},{url:"index.html",revision:"fb07b3d6805ecb81ce25fe6eb9159cc0"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/index.html"))),e.registerRoute("polyfills/*.js",new e.CacheFirst,"GET")}));
//# sourceMappingURL=sw.js.map
