"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar_1 = require("chokidar");
const fs = require("fs");
const path = require("path");
const logger_1 = require("../logger");
const parser_1 = require("../parser");
const utils_1 = require("../utils");
const readFile = utils_1.promisify(fs.readFile);
const writeFile = utils_1.promisify(fs.writeFile);
const deleteFile = utils_1.promisify(fs.unlink);
exports.plugin = utils_1.freeze({
    type: 'file',
    read: (filePath) => readFile(filePath, 'utf8').catch(logger_1.logger.error),
    write: (filePath, content) => writeFile(filePath, content).catch(logger_1.logger.error),
    delete: (filePath) => deleteFile(filePath).catch(logger_1.logger.error),
    watch({ sourcePath, destinationPath, destination }) {
        logger_1.logger.log(`[${exports.plugin.type.toUpperCase()}] ${sourcePath} -> ${destinationPath}`);
        const sourcePattern = parser_1.pattern(sourcePath);
        const destinationPattern = parser_1.pattern(destinationPath);
        const watcher = chokidar_1.watch(sourcePattern.replace('*'), { persistent: true });
        watcher.on('ready', exports.watchFiles(watcher, sourcePattern, destinationPattern, destination));
    }
});
exports.watchFiles = (watcher, sourcePattern, destinationPattern, destination) => () => {
    watcher.on('error', utils_1.partial(logger_1.logger.error, '[ERROR]'));
    watcher.on('add', exports.writeToDestination(sourcePattern, destinationPattern, destination));
    watcher.on('change', exports.writeToDestination(sourcePattern, destinationPattern, destination));
    watcher.on('unlink', exports.deleteFromDestination(sourcePattern, destinationPattern, destination));
};
exports.writeToDestination = (sourcePattern, destinationPattern, destination) => (filePath) => {
    const sourcePath = exports.normalizePath(filePath);
    const data = sourcePattern.extract(sourcePath);
    const destinationPath = destinationPattern.replace(data);
    logger_1.logger.log(`[WRITE] ${sourcePath} -> ${destinationPath}`);
    return exports.plugin.read(sourcePath).then((content) => destination.write(destinationPath, content));
};
exports.deleteFromDestination = (sourcePattern, destinationPattern, destination) => (filePath) => {
    const sourcePath = exports.normalizePath(filePath);
    const data = sourcePattern.extract(sourcePath);
    const destinationPath = destinationPattern.replace(data);
    logger_1.logger.log(`[DELETE] ${sourcePath} -> ${destinationPath}`);
    return destination.delete(destinationPath);
};
exports.normalizePath = (filePath) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
