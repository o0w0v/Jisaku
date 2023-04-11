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

/***/ "./ts/index.ts":
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
/***/ (() => {

eval("\r\nclass User {\r\n    constructor(familyName, givenName, age) {\r\n        this.age = age;\r\n        this.familyName = familyName;\r\n        this.givenName = givenName;\r\n    }\r\n}\r\nconst user = new User('海老原', '賢次', 44); // 名前と年齢は適当に\r\nconst contentsElem = document.getElementById('contents');\r\nif (!!contentsElem) {\r\n    contentsElem.innerText = `${user.familyName} ${user.givenName}`;\r\n}\r\n\n\n//# sourceURL=webpack://jisaku_mitsumori/./ts/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./ts/index.ts"]();
/******/ 	
/******/ })()
;