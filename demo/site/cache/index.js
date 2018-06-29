!function(n){function t(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var e={};t.m=n,t.c=e,t.i=function(n){return n},t.d=function(n,e,r){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:r})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="/cache",t(t.s=3)}([function(n,t,e){"use strict";var r=function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")},o=function(){function n(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}return function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}}(),i=function(){var n=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));return Boolean("serviceWorker"in navigator)&&("https:"===window.location.protocol||n)},a=function(){function n(t){r(this,n),this.options=Object.assign({},n.defaultOptions,t),this.scriptName=String(this.options.filename),i()&&this._init()}return o(n,[{key:"_init",value:function(){this._load(),this._online(),this._offline()}},{key:"_load",value:function(){var n=this;window.addEventListener("load",function(){navigator.serviceWorker.register(n.scriptName).then(function(t){console.log("Registered events at scope: ",t.scope),n._handleInstallingOrUpdating(t),t.onupdatefound=function(){return n._handleInstallingOrUpdating(t)}}).catch(function(n){return console.error("Error during service worker registration:",n),this.options.onError(n),Promise.reject(n)})})}},{key:"_handleInstallingOrUpdating",value:function(n){var t=this,e=n.installing||n.waiting,r=function(){switch(e.state){case"redundant":t.options.onUpdateFailed(),e.onstatechange=null;break;case"installing":t.options.onUpdating();break;case"installed":t.options.onUpdateReady();break;case"activated":t.options.onUpdated(),e.onstatechange=null}},o=function(){switch(e.state){case"redundant":t.options.onInstallFailed(),e.onstatechange=null;break;case"installing":case"installed":break;case"activated":t.options.onInstalled(),e.onstatechange=null}};if(e&&!e.onstatechange){var i=void 0;n.active?(r(),i=r):(o(),i=o),e.onstatechange=i}}},{key:"_online",value:function(){var n=this;window.addEventListener("online",function(){return n.options.online()})}},{key:"_offline",value:function(){var n=this;window.addEventListener("offline",function(){return n.options.offline()})}}]),n}();a.defaultOptions={filename:"",onError:function(){},onInstalled:function(){return console.log("serviceWorker:安装成功")},onInstallFailed:function(){return console.log("serviceWorker:安装失败")},onUpdating:function(){return console.log("serviceWorker:更新中...")},onUpdateReady:function(){window.confirm("serviceWorker:更新完成，有新的资源可用，是否启用？")&&a.skipWaiting()},onUpdated:function(){return window.location.reload()},onUpdateFailed:function(){return console.log("serviceWorker:更新失败")},online:function(){},offline:function(){}},a.skipWaiting=function(n,t){navigator.serviceWorker.getRegistration().then(function(e){if(!e||!e.waiting)return void(n&&n());e.waiting.postMessage({action:"skipWaiting"}),t&&t()})},a.update=function(){navigator.serviceWorker.getRegistration().then(function(n){return n&&n.update()})},n.exports=a},,function(n,t,e){var r=e(5);"string"==typeof r&&(r=[[n.i,r,""]]);var o={};o.transform=void 0;e(7)(r,o);r.locals&&(n.exports=r.locals)},function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=e(2),o=(e.n(r),e(0));new(e.n(o).a)({filename:"/cache/service-worker.js"})},,function(n,t,e){t=n.exports=e(6)(void 0),t.push([n.i,"body{background:#fdfdfd}",""])},function(n,t){function e(n,t){var e=n[1]||"",o=n[3];if(!o)return e;if(t&&"function"==typeof btoa){var i=r(o);return[e].concat(o.sources.map(function(n){return"/*# sourceURL="+o.sourceRoot+n+" */"})).concat([i]).join("\n")}return[e].join("\n")}function r(n){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"}n.exports=function(n){var t=[];return t.toString=function(){return this.map(function(t){var r=e(t,n);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(n,e){"string"==typeof n&&(n=[[null,n,""]]);for(var r={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(r[i]=!0)}for(o=0;o<n.length;o++){var a=n[o];"number"==typeof a[0]&&r[a[0]]||(e&&!a[2]?a[2]=e:e&&(a[2]="("+a[2]+") and ("+e+")"),t.push(a))}},t}},function(n,t,e){function r(n,t){for(var e=0;e<n.length;e++){var r=n[e],o=v[r.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](r.parts[i]);for(;i<r.parts.length;i++)o.parts.push(l(r.parts[i],t))}else{for(var a=[],i=0;i<r.parts.length;i++)a.push(l(r.parts[i],t));v[r.id]={id:r.id,refs:1,parts:a}}}}function o(n,t){for(var e=[],r={},o=0;o<n.length;o++){var i=n[o],a=t.base?i[0]+t.base:i[0],s=i[1],c=i[2],u=i[3],l={css:s,media:c,sourceMap:u};r[a]?r[a].parts.push(l):e.push(r[a]={id:a,parts:[l]})}return e}function i(n,t){var e=g(n.insertInto);if(!e)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=w[w.length-1];if("top"===n.insertAt)r?r.nextSibling?e.insertBefore(t,r.nextSibling):e.appendChild(t):e.insertBefore(t,e.firstChild),w.push(t);else{if("bottom"!==n.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");e.appendChild(t)}}function a(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n);var t=w.indexOf(n);t>=0&&w.splice(t,1)}function s(n){var t=document.createElement("style");return n.attrs.type="text/css",u(t,n.attrs),i(n,t),t}function c(n){var t=document.createElement("link");return n.attrs.type="text/css",n.attrs.rel="stylesheet",u(t,n.attrs),i(n,t),t}function u(n,t){Object.keys(t).forEach(function(e){n.setAttribute(e,t[e])})}function l(n,t){var e,r,o,i;if(t.transform&&n.css){if(!(i=t.transform(n.css)))return function(){};n.css=i}if(t.singleton){var u=m++;e=b||(b=s(t)),r=f.bind(null,e,u,!1),o=f.bind(null,e,u,!0)}else n.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(e=c(t),r=p.bind(null,e,t),o=function(){a(e),e.href&&URL.revokeObjectURL(e.href)}):(e=s(t),r=d.bind(null,e),o=function(){a(e)});return r(n),function(t){if(t){if(t.css===n.css&&t.media===n.media&&t.sourceMap===n.sourceMap)return;r(n=t)}else o()}}function f(n,t,e,r){var o=e?"":r.css;if(n.styleSheet)n.styleSheet.cssText=U(t,o);else{var i=document.createTextNode(o),a=n.childNodes;a[t]&&n.removeChild(a[t]),a.length?n.insertBefore(i,a[t]):n.appendChild(i)}}function d(n,t){var e=t.css,r=t.media;if(r&&n.setAttribute("media",r),n.styleSheet)n.styleSheet.cssText=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(e))}}function p(n,t,e){var r=e.css,o=e.sourceMap,i=void 0===t.convertToAbsoluteUrls&&o;(t.convertToAbsoluteUrls||i)&&(r=y(r)),o&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var a=new Blob([r],{type:"text/css"}),s=n.href;n.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var v={},h=function(n){var t;return function(){return void 0===t&&(t=n.apply(this,arguments)),t}}(function(){return window&&document&&document.all&&!window.atob}),g=function(n){var t={};return function(e){return void 0===t[e]&&(t[e]=n.call(this,e)),t[e]}}(function(n){return document.querySelector(n)}),b=null,m=0,w=[],y=e(8);n.exports=function(n,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");t=t||{},t.attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=h()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var e=o(n,t);return r(e,t),function(n){for(var i=[],a=0;a<e.length;a++){var s=e[a],c=v[s.id];c.refs--,i.push(c)}if(n){r(o(n,t),t)}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete v[c.id]}}}};var U=function(){var n=[];return function(t,e){return n[t]=e,n.filter(Boolean).join("\n")}}()},function(n,t){n.exports=function(n){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!n||"string"!=typeof n)return n;var e=t.protocol+"//"+t.host,r=e+t.pathname.replace(/\/[^\/]*$/,"/");return n.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(n,t){var o=t.trim().replace(/^"(.*)"$/,function(n,t){return t}).replace(/^'(.*)'$/,function(n,t){return t});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(o))return n;var i;return i=0===o.indexOf("//")?o:0===o.indexOf("/")?e+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}}]);