"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = (key) => (obj) => obj[key];
exports.set = (key) => (obj, value) => (Object.assign({}, obj, { [key]: value }));
exports.keys = Object.keys;
exports.values = (obj) => exports.keys(obj).map((key) => obj[key]);
exports.freeze = Object.freeze;
exports.seal = Object.seal;
exports.setDefault = (obj, value) => (key) => {
    if (obj[key] == null)
        obj[key] = value;
};
