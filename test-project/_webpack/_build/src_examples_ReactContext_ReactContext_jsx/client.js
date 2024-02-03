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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/index.js\");\n/* harmony import */ var _ThemeContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ThemeContext */ \"./src/examples/ReactContext/ThemeContext.jsx\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ThemeContext__WEBPACK_IMPORTED_MODULE_1__.ThemeProvider, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ThemeContext__WEBPACK_IMPORTED_MODULE_1__[\"default\"].Consumer, null, function (context) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"h1\", null, \"Context: \", context);\n  }));\n});\n\n//# sourceURL=webpack://@uiengine/test-project/./src/examples/ReactContext/ReactContext.jsx?");

/***/ }),

/***/ "./src/examples/ReactContext/ThemeContext.jsx":
/*!****************************************************!*\
  !*** ./src/examples/ReactContext/ThemeContext.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/index.js\");\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\nfunction _toPropertyKey(t) { var i = _toPrimitive(t, \"string\"); return \"symbol\" == _typeof(i) ? i : String(i); }\nfunction _toPrimitive(t, r) { if (\"object\" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || \"default\"); if (\"object\" != _typeof(i)) return i; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (\"string\" === r ? String : Number)(t); }\nfunction _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } else if (call !== void 0) { throw new TypeError(\"Derived constructors may only return object or undefined\"); } return _assertThisInitialized(self); }\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\nfunction _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, \"prototype\", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nvar ThemeContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext('light');\nvar ThemeProvider = /*#__PURE__*/function (_Component) {\n  _inherits(ThemeProvider, _Component);\n  function ThemeProvider() {\n    _classCallCheck(this, ThemeProvider);\n    return _callSuper(this, ThemeProvider, arguments);\n  }\n  _createClass(ThemeProvider, [{\n    key: \"render\",\n    value: function render() {\n      var _this$props = this.props,\n        children = _this$props.children,\n        _this$props$value = _this$props.value,\n        value = _this$props$value === void 0 ? 'dark' : _this$props$value;\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(ThemeContext.Provider, {\n        value: value\n      }, children);\n    }\n  }]);\n  return ThemeProvider;\n}(react__WEBPACK_IMPORTED_MODULE_0__.Component);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ThemeContext);\n\n//# sourceURL=webpack://@uiengine/test-project/./src/examples/ReactContext/ThemeContext.jsx?");

/***/ }),

/***/ "../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/cjs/react.production.min.js":
/*!*******************************************************************************************************************!*\
  !*** ../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/cjs/react.production.min.js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("/**\n * @license React\n * react.production.min.js\n *\n * Copyright (c) Facebook, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\nvar l=Symbol.for(\"react.element\"),n=Symbol.for(\"react.portal\"),p=Symbol.for(\"react.fragment\"),q=Symbol.for(\"react.strict_mode\"),r=Symbol.for(\"react.profiler\"),t=Symbol.for(\"react.provider\"),u=Symbol.for(\"react.context\"),v=Symbol.for(\"react.forward_ref\"),w=Symbol.for(\"react.suspense\"),x=Symbol.for(\"react.memo\"),y=Symbol.for(\"react.lazy\"),z=Symbol.iterator;function A(a){if(null===a||\"object\"!==typeof a)return null;a=z&&a[z]||a[\"@@iterator\"];return\"function\"===typeof a?a:null}\nvar B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}E.prototype.isReactComponent={};\nE.prototype.setState=function(a,b){if(\"object\"!==typeof a&&\"function\"!==typeof a&&null!=a)throw Error(\"setState(...): takes an object of state variables to update or a function which returns an object of state variables.\");this.updater.enqueueSetState(this,a,b,\"setState\")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,\"forceUpdate\")};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}var H=G.prototype=new F;\nH.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};\nfunction M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=\"\"+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return{$$typeof:l,type:a,key:k,ref:h,props:c,_owner:K.current}}\nfunction N(a,b){return{$$typeof:l,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return\"object\"===typeof a&&null!==a&&a.$$typeof===l}function escape(a){var b={\"=\":\"=0\",\":\":\"=2\"};return\"$\"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\\/+/g;function Q(a,b){return\"object\"===typeof a&&null!==a&&null!=a.key?escape(\"\"+a.key):b.toString(36)}\nfunction R(a,b,e,d,c){var k=typeof a;if(\"undefined\"===k||\"boolean\"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case \"string\":case \"number\":h=!0;break;case \"object\":switch(a.$$typeof){case l:case n:h=!0}}if(h)return h=a,c=c(h),a=\"\"===d?\".\"+Q(h,0):d,I(c)?(e=\"\",null!=a&&(e=a.replace(P,\"$&/\")+\"/\"),R(c,b,e,\"\",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?\"\":(\"\"+c.key).replace(P,\"$&/\")+\"/\")+a)),b.push(c)),1;h=0;d=\"\"===d?\".\":d+\":\";if(I(a))for(var g=0;g<a.length;g++){k=\na[g];var f=d+Q(k,g);h+=R(k,b,e,f,c)}else if(f=A(a),\"function\"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if(\"object\"===k)throw b=String(a),Error(\"Objects are not valid as a React child (found: \"+(\"[object Object]\"===b?\"object with keys {\"+Object.keys(a).join(\", \")+\"}\":b)+\"). If you meant to render a collection of children, use an array instead.\");return h}\nfunction S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,\"\",\"\",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b});-1===a._status&&(a._status=0,a._result=b)}if(1===a._status)return a._result.default;throw a._result;}\nvar U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};exports.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments)},e)},count:function(a){var b=0;S(a,function(){b++});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error(\"React.Children.only expected to receive a single React element child.\");return a}};exports.Component=E;exports.Fragment=p;\nexports.Profiler=r;exports.PureComponent=G;exports.StrictMode=q;exports.Suspense=w;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;\nexports.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error(\"React.cloneElement(...): The argument must be a React element, but you passed \"+a+\".\");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=\"\"+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);\nfor(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g}return{$$typeof:l,type:a.type,key:c,ref:k,props:d,_owner:h}};exports.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};exports.createElement=M;exports.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};\nexports.forwardRef=function(a){return{$$typeof:v,render:a}};exports.isValidElement=O;exports.lazy=function(a){return{$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};exports.memo=function(a,b){return{$$typeof:x,type:a,compare:void 0===b?null:b}};exports.startTransition=function(a){var b=V.transition;V.transition={};try{a()}finally{V.transition=b}};exports.unstable_act=function(){throw Error(\"act(...) is not supported in production builds of React.\");};\nexports.useCallback=function(a,b){return U.current.useCallback(a,b)};exports.useContext=function(a){return U.current.useContext(a)};exports.useDebugValue=function(){};exports.useDeferredValue=function(a){return U.current.useDeferredValue(a)};exports.useEffect=function(a,b){return U.current.useEffect(a,b)};exports.useId=function(){return U.current.useId()};exports.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};\nexports.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};exports.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};exports.useMemo=function(a,b){return U.current.useMemo(a,b)};exports.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};exports.useRef=function(a){return U.current.useRef(a)};exports.useState=function(a){return U.current.useState(a)};exports.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};\nexports.useTransition=function(){return U.current.useTransition()};exports.version=\"18.2.0\";\n\n\n//# sourceURL=webpack://@uiengine/test-project/../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/cjs/react.production.min.js?");

/***/ }),

/***/ "../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/index.js":
/*!************************************************************************************************!*\
  !*** ../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/index.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nif (true) {\n  module.exports = __webpack_require__(/*! ./cjs/react.production.min.js */ \"../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/cjs/react.production.min.js\");\n} else {}\n\n\n//# sourceURL=webpack://@uiengine/test-project/../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/index.js?");

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