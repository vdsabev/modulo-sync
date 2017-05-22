"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./array");
exports.cap = (f, numberOfArguments = 1) => (...x) => f(...x.slice(0, numberOfArguments));
exports.sequence = (...fns) => (...args) => array_1.last(fns.map((fn) => fn(...args)));
exports.promisify = (fn) => (...args) => new Promise((resolve, reject) => {
    fn(...args, (error, result) => {
        if (error)
            return reject(error);
        resolve(result);
    });
});
