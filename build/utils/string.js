"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invoke_1 = require("./invoke");
const partial_1 = require("./partial");
exports.match = partial_1.partial(invoke_1.invoke, 'match');
