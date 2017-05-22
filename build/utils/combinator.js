"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// S
exports.substitution = (f) => (g) => (...x) => f(...x)(g(...x));
// K
exports.constant = (x) => () => x;
// I
exports.identity = (x) => x;
// Pipe
exports.pipe = (...fs) => (...x) => fs.slice(1).reduce((result, f) => f(result), fs[0](...x));
// Compose
exports.compose = (...fs) => exports.pipe(...fs.slice().reverse());
// Invert
exports.invert = (f) => (...x) => (...y) => f(...y)(...x);
// Not
exports.not = (f) => (...x) => !f(...x);
