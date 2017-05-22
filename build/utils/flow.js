"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.left = (f, g) => (x, ...y) => x ? f(x, ...y) : g(x, ...y);
exports.right = (f, g) => (x, ...y) => x ? g(x, ...y) : f(x, ...y);
exports.ternary = (f, g, h) => (...x) => f(...x) ? g(...x) : h(...x);
