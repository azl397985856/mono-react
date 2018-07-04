/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../src/mini-react-dom.js":
/*!**********************************************************!*\
  !*** /Users/luxiaopeng/mini-react/src/mini-react-dom.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst isListener = propName => propName.startsWith(\"on\");\nconst isAttribute = propName => !isListener(propName) && propName != \"children\";\n\nconst ReactDOM = {\n  render: (vdom, el) => {\n    const { type, props } = vdom;\n\n    // Create DOM element\n    const isTextElement = type === \"TEXT\";\n    const dom = isTextElement\n      ? document.createTextNode(\"\")\n      : document.createElement(type);\n\n    // 添加监听函数\n    Object.keys(props)\n      .filter(isListener)\n      .forEach(name => {\n        const eventType = name.toLowerCase().substring(2);\n        dom.addEventListener(eventType, props[name]);\n      });\n\n    //  添加Attributes\n    Object.keys(props)\n      .filter(isAttribute)\n      .forEach(name => {\n        // className特殊逻辑\n        if (name === \"className\") {\n          dom.class = props[name];\n        } else {\n          dom[name] = props[name];\n        }\n      });\n\n    // 递归children\n    const childElements = props.children || [];\n    childElements.forEach(childElement => ReactDOM.render(childElement, dom));\n\n    // 插入到真实dom\n    el.appendChild(dom);\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ReactDOM);\n\n\n//# sourceURL=webpack:////Users/luxiaopeng/mini-react/src/mini-react-dom.js?");

/***/ }),

/***/ "../../src/mini-react.js":
/*!******************************************************!*\
  !*** /Users/luxiaopeng/mini-react/src/mini-react.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst TEXT_ELEMENT = \"TEXT\";\n\nfunction createTextElement(value) {\n  return createElement(TEXT_ELEMENT, { nodeValue: value });\n}\n\nclass Component {\n  constructor(props) {\n    this.props = props;\n  }\n}\n// createElement前两个参数分别为type和props\n// 之后的所有参数都会被看作children\n// 当然props.children 也会被看作children(createElement会进行合并)\nfunction $createElement(type, _props, ...children) {\n  const props = Object.assign({}, _props);\n\n  const hasChildren = children.length > 0;\n  const mergedChildren = hasChildren ? [].concat(...children) : [];\n\n  props.children = mergedChildren\n    .filter(c => c != null && c !== false)\n    .map(c => (c instanceof Object ? c : createTextElement(c)));\n  return { type, props };\n}\n\nfunction createElement(el, props, ...children) {\n  return $createElement(el, props || {}, children);\n}\n\nconst React = {\n  createElement,\n  Component\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (React);\n\n\n//# sourceURL=webpack:////Users/luxiaopeng/mini-react/src/mini-react.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const React = __webpack_require__(/*! ../../../src/mini-react */ \"../../src/mini-react.js\");\nconst ReactDOM = __webpack_require__(/*! ../../../src/mini-react-dom */ \"../../src/mini-react-dom.js\");\n\n// root\nconst root = document.getElementById(\"root\");\n\n// our Elements\nconst helloWorld = ({ name }) =>\n  React.createElement(\"div\", { name: \"lucifer\" }, `Hello ${name}`);\n\n// render to dom\nReactDOM.render(helloWorld({ name: \"lucifer\" }), root);\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });