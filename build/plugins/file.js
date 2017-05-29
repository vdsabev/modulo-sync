"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = require("chokidar");
const fs = require("fs");
const path = require("path");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const readFile = utils_1.promisify(fs.readFile);
exports.plugin = utils_1.freeze({
    on(eventNames, sourcePattern, fn) {
        const watcher = chokidar_1.watch(sourcePattern.replace('*'), { persistent: true });
        watcher.on('ready', () => {
            watcher.on('error', utils_1.partial(logger_1.logger.error, '[ERROR]'));
            eventNames.map(exports.startWatching(watcher, fn));
        });
    },
    do(actionNames, ...args) {
        actionNames.map((actionName) => fs[actionName](...args));
    }
});
exports.startWatching = (watcher, fn) => (eventName) => {
    watcher.on(eventName, (filePath) => __awaiter(this, void 0, void 0, function* () {
        const sourcePath = exports.normalizePath(filePath);
        const args = [];
        switch (eventName) {
            case 'add':
            case 'change':
                args.push(yield readFile(filePath, 'utf8'));
                break;
        }
        fn(sourcePath, ...args);
    }));
};
exports.normalizePath = (filePath) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
