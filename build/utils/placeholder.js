"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const object_1 = require("./object");
exports._ = object_1.freeze({ type: 'placeholder' }); // Placeholder
exports.isPlaceholder = utils_1.equal(exports._);
exports.hasPlaceholder = utils_1.contains(exports._);
exports.replacePlaceholderInObject = (placeholderObject, replacementValue) => {
    const replacedObject = {};
    object_1.keys(placeholderObject).map((key) => {
        const value = placeholderObject[key];
        replacedObject[key] = exports.isPlaceholder(value) ? replacementValue : value;
    });
    return replacedObject;
};
exports.replacePlaceholderInArray = (placeholderArray, replacementValues) => {
    const replacementValuesCopy = replacementValues.slice();
    const replacedArray = placeholderArray.map((item) => {
        if (exports.isPlaceholder(item))
            return replacementValuesCopy.shift();
        if (exports.hasPlaceholder(item))
            return exports.replacePlaceholderInObject(item, replacementValuesCopy.shift());
        return item;
    });
    return replacedArray.concat(replacementValuesCopy);
};
