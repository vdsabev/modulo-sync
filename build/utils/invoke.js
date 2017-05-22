"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoke = (fnName, ...args) => (obj) => obj[fnName](...args);
