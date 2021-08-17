/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/examples/ReactContext/ReactContext.jsx":
/*!****************************************************!*\
  !*** ./src/examples/ReactContext/ReactContext.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/index.js\");\n/* harmony import */ var _ThemeContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ThemeContext */ \"./src/examples/ReactContext/ThemeContext.jsx\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ThemeContext__WEBPACK_IMPORTED_MODULE_1__.ThemeProvider, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ThemeContext__WEBPACK_IMPORTED_MODULE_1__.default.Consumer, null, function (context) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"h1\", null, \"Context: \", context);\n  }));\n});\n\n//# sourceURL=webpack://@uiengine/test-project/./src/examples/ReactContext/ReactContext.jsx?");

/***/ }),

/***/ "./src/examples/ReactContext/ThemeContext.jsx":
/*!****************************************************!*\
  !*** ./src/examples/ReactContext/ThemeContext.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ThemeProvider\": () => (/* binding */ ThemeProvider),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/index.js\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } else if (call !== void 0) { throw new TypeError(\"Derived constructors may only return object or undefined\"); } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\n\nvar ThemeContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext('light');\nvar ThemeProvider = /*#__PURE__*/function (_Component) {\n  _inherits(ThemeProvider, _Component);\n\n  var _super = _createSuper(ThemeProvider);\n\n  function ThemeProvider() {\n    _classCallCheck(this, ThemeProvider);\n\n    return _super.apply(this, arguments);\n  }\n\n  _createClass(ThemeProvider, [{\n    key: \"render\",\n    value: function render() {\n      var _this$props = this.props,\n          children = _this$props.children,\n          _this$props$value = _this$props.value,\n          value = _this$props$value === void 0 ? 'dark' : _this$props$value;\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThemeContext.Provider, {\n        value: value\n      }, children);\n    }\n  }]);\n\n  return ThemeProvider;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ThemeContext);\n\n//# sourceURL=webpack://@uiengine/test-project/./src/examples/ReactContext/ThemeContext.jsx?");

/***/ }),

/***/ "../../.yarn/cache/object-assign-npm-4.1.1-1004ad6dec-66cf021898.zip/node_modules/object-assign/index.js":
/*!***************************************************************************************************************!*\
  !*** ../../.yarn/cache/object-assign-npm-4.1.1-1004ad6dec-66cf021898.zip/node_modules/object-assign/index.js ***!
  \***************************************************************************************************************/
/***/ ((module) => {

eval("/*\nobject-assign\n(c) Sindre Sorhus\n@license MIT\n*/\n\n\n/* eslint-disable no-unused-vars */\nvar getOwnPropertySymbols = Object.getOwnPropertySymbols;\nvar hasOwnProperty = Object.prototype.hasOwnProperty;\nvar propIsEnumerable = Object.prototype.propertyIsEnumerable;\n\nfunction toObject(val) {\n\tif (val === null || val === undefined) {\n\t\tthrow new TypeError('Object.assign cannot be called with null or undefined');\n\t}\n\n\treturn Object(val);\n}\n\nfunction shouldUseNative() {\n\ttry {\n\t\tif (!Object.assign) {\n\t\t\treturn false;\n\t\t}\n\n\t\t// Detect buggy property enumeration order in older V8 versions.\n\n\t\t// https://bugs.chromium.org/p/v8/issues/detail?id=4118\n\t\tvar test1 = new String('abc');  // eslint-disable-line no-new-wrappers\n\t\ttest1[5] = 'de';\n\t\tif (Object.getOwnPropertyNames(test1)[0] === '5') {\n\t\t\treturn false;\n\t\t}\n\n\t\t// https://bugs.chromium.org/p/v8/issues/detail?id=3056\n\t\tvar test2 = {};\n\t\tfor (var i = 0; i < 10; i++) {\n\t\t\ttest2['_' + String.fromCharCode(i)] = i;\n\t\t}\n\t\tvar order2 = Object.getOwnPropertyNames(test2).map(function (n) {\n\t\t\treturn test2[n];\n\t\t});\n\t\tif (order2.join('') !== '0123456789') {\n\t\t\treturn false;\n\t\t}\n\n\t\t// https://bugs.chromium.org/p/v8/issues/detail?id=3056\n\t\tvar test3 = {};\n\t\t'abcdefghijklmnopqrst'.split('').forEach(function (letter) {\n\t\t\ttest3[letter] = letter;\n\t\t});\n\t\tif (Object.keys(Object.assign({}, test3)).join('') !==\n\t\t\t\t'abcdefghijklmnopqrst') {\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t} catch (err) {\n\t\t// We don't expect any of the above to throw, but better to be safe.\n\t\treturn false;\n\t}\n}\n\nmodule.exports = shouldUseNative() ? Object.assign : function (target, source) {\n\tvar from;\n\tvar to = toObject(target);\n\tvar symbols;\n\n\tfor (var s = 1; s < arguments.length; s++) {\n\t\tfrom = Object(arguments[s]);\n\n\t\tfor (var key in from) {\n\t\t\tif (hasOwnProperty.call(from, key)) {\n\t\t\t\tto[key] = from[key];\n\t\t\t}\n\t\t}\n\n\t\tif (getOwnPropertySymbols) {\n\t\t\tsymbols = getOwnPropertySymbols(from);\n\t\t\tfor (var i = 0; i < symbols.length; i++) {\n\t\t\t\tif (propIsEnumerable.call(from, symbols[i])) {\n\t\t\t\t\tto[symbols[i]] = from[symbols[i]];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\treturn to;\n};\n\n\n//# sourceURL=webpack://@uiengine/test-project/../../.yarn/cache/object-assign-npm-4.1.1-1004ad6dec-66cf021898.zip/node_modules/object-assign/index.js?");

/***/ }),

/***/ "../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/cjs/react.production.min.js":
/*!*******************************************************************************************************************!*\
  !*** ../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/cjs/react.production.min.js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("/** @license React v17.0.2\n * react.production.min.js\n *\n * Copyright (c) Facebook, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\nvar l=__webpack_require__(/*! object-assign */ \"../../.yarn/cache/object-assign-npm-4.1.1-1004ad6dec-66cf021898.zip/node_modules/object-assign/index.js\"),n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;\nif(\"function\"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w(\"react.element\");p=w(\"react.portal\");exports.Fragment=w(\"react.fragment\");exports.StrictMode=w(\"react.strict_mode\");exports.Profiler=w(\"react.profiler\");q=w(\"react.provider\");r=w(\"react.context\");t=w(\"react.forward_ref\");exports.Suspense=w(\"react.suspense\");u=w(\"react.memo\");v=w(\"react.lazy\")}var x=\"function\"===typeof Symbol&&Symbol.iterator;\nfunction y(a){if(null===a||\"object\"!==typeof a)return null;a=x&&a[x]||a[\"@@iterator\"];return\"function\"===typeof a?a:null}function z(a){for(var b=\"https://reactjs.org/docs/error-decoder.html?invariant=\"+a,c=1;c<arguments.length;c++)b+=\"&args[]=\"+encodeURIComponent(arguments[c]);return\"Minified React error #\"+a+\"; visit \"+b+\" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.\"}\nvar A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if(\"object\"!==typeof a&&\"function\"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,\"setState\")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,\"forceUpdate\")};\nfunction D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};\nfunction J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=\"\"+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}\nfunction K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return\"object\"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={\"=\":\"=0\",\":\":\"=2\"};return\"$\"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\\/+/g;function N(a,b){return\"object\"===typeof a&&null!==a&&null!=a.key?escape(\"\"+a.key):b.toString(36)}\nfunction O(a,b,c,e,d){var k=typeof a;if(\"undefined\"===k||\"boolean\"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case \"string\":case \"number\":h=!0;break;case \"object\":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=\"\"===e?\".\"+N(h,0):e,Array.isArray(d)?(c=\"\",null!=a&&(c=a.replace(M,\"$&/\")+\"/\"),O(d,b,c,\"\",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?\"\":(\"\"+d.key).replace(M,\"$&/\")+\"/\")+a)),b.push(d)),1;h=0;e=\"\"===e?\".\":e+\":\";if(Array.isArray(a))for(var g=\n0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),\"function\"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if(\"object\"===k)throw b=\"\"+a,Error(z(31,\"[object Object]\"===b?\"object with keys {\"+Object.keys(a).join(\", \")+\"}\":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,\"\",\"\",function(a){return b.call(c,a,d++)});return e}\nfunction Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};\nexports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;\nexports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=\"\"+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,\nkey:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};exports.forwardRef=function(a){return{$$typeof:t,render:a}};exports.isValidElement=L;\nexports.lazy=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};\nexports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version=\"17.0.2\";\n\n\n//# sourceURL=webpack://@uiengine/test-project/../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/cjs/react.production.min.js?");

/***/ }),

/***/ "../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/index.js":
/*!************************************************************************************************!*\
  !*** ../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/index.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nif (true) {\n  module.exports = __webpack_require__(/*! ./cjs/react.production.min.js */ \"../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/cjs/react.production.min.js\");\n} else {}\n\n\n//# sourceURL=webpack://@uiengine/test-project/../../.yarn/cache/react-npm-17.0.2-99ba37d931-7d0dfebafe.zip/node_modules/react/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/examples/ReactContext/ReactContext.jsx");
/******/ 	
/******/ })()
;