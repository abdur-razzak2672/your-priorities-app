if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,c)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const d={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return d;default:return e(r)}})).then(e=>{const r=c(...e);return s.default||(s.default=r),s})}))}}define("./sw.js",["./workbox-80efdfd1"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"07f1c784.js",revision:"b0ec78818edbfe17e60bde31c4ba4a2b"},{url:"2bc4ffce.js",revision:"249d2286f40b5477f1e4b43b3e8031a3"},{url:"5d455374.js",revision:"cdab64251ca72ee33344e1937e8d595b"},{url:"6255b0b7.js",revision:"006d8bf2b37c0593d366d507e2d570f3"},{url:"745fccde.js",revision:"049d039e7dd8b1f52a0a33f5626bee06"},{url:"8625a690.js",revision:"c2fd343dbfde576323ea04c255d703e8"},{url:"998afe45.js",revision:"f176fba8de6aca93ae9d0b22c961977a"},{url:"a9c1350d.js",revision:"0ed94173fc62e8cc061c7b64d069691b"},{url:"aac99731.js",revision:"1a6f8647b9726c6fb4b541ccc3613317"},{url:"bc9c360d.js",revision:"ffdd7a49f413e0198324468ffff0d6b5"},{url:"f345e3e8.js",revision:"d8cf3c2688a70902ee2d4834002c46dd"},{url:"index.html",revision:"41ce53c338ef0dfea485ee61b896195b"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/index.html"))),e.registerRoute("polyfills/*.js",new e.CacheFirst,"GET")}));
//# sourceMappingURL=sw.js.map
