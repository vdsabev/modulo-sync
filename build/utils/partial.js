"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const placeholder_1 = require("./placeholder");
exports.partial = (fn, ...partialArgs) => (...otherArgs) => fn(...placeholder_1.replacePlaceholderInArray(partialArgs, otherArgs));
