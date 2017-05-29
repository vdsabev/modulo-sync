"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const npmRun = require('npm-run');
exports.plugin = utils_1.freeze({
    // TODO: Remove when plugin methods become optional
    on(eventNames) {
        logger_1.logger.error(`WARNING: Events aren't supported for plugin: exec`);
    },
    do(actionNames, ...args) {
        actionNames.map((actionName) => npmRun([actionName, ...args].join(' ')));
    }
});