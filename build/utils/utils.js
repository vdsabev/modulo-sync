"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combinator_1 = require("./combinator");
const object_1 = require("./object");
// TODO: Rewrite in point-free style
exports.contains = (...valuesToFind) => (obj) => {
    const getLength = object_1.get('length');
    const hasSameLengthAs = combinator_1.compose(exports.equal, getLength);
    const hasSameLengthAsValues = combinator_1.compose(hasSameLengthAs(valuesToFind), getLength);
    if (Array.isArray(obj))
        return hasSameLengthAsValues(valuesToFind.filter((value) => obj.indexOf(value) !== -1));
    if (obj && typeof obj === 'object') {
        const objValues = object_1.values(obj);
        return hasSameLengthAsValues(valuesToFind.filter((value) => objValues.indexOf(value) !== -1));
    }
    return false;
};
exports.isContained = combinator_1.invert(exports.contains);
exports.assertNever = (obj) => {
    throw new Error('Unexpected object');
};
exports.equal = (value1) => (value2) => value1 === value2;
exports.notEqual = combinator_1.compose(combinator_1.not, exports.equal);
exports.type = (value) => typeof value;
exports.is = (typeToCompare) => combinator_1.compose(exports.equal(typeToCompare), exports.type);
exports.result = (value, ...args) => typeof value === 'function' ? value(...args) : value;
