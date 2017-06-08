"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = require("chokidar");
const fs = require("fs");
const path = require("path");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
exports.plugin = utils_1.freeze({
    on(eventNames, sourcePattern, fn) {
        const watcher = chokidar_1.watch(sourcePattern.replace('*'), { persistent: true });
        watcher.on('ready', () => {
            watcher.on('error', utils_1.partial(logger_1.logger.error, '[ERROR]'));
            eventNames.map((eventName) => {
                watcher.on(eventName, (filePath) => {
                    const sourcePath = exports.normalizePath(filePath);
                    fn(sourcePath);
                });
            });
        });
    },
    do(method, ...args) {
        return utils_1.promisify(fs[method])(...args);
    }
});
exports.normalizePath = (filePath) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
