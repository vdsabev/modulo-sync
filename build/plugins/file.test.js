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
require("jest");
const originalFs = require("fs");
const fs = Object.assign({}, originalFs, { readFile: jest.fn((filePath, encoding, callback) => callback(filePath === 'error' ? filePath : null, filePath)), writeFile: jest.fn((filePath, content, callback) => callback(filePath === 'error' ? filePath : null, filePath)), unlink: jest.fn((filePath, callback) => callback(filePath === 'error' ? filePath : null, filePath)) });
jest.mock('fs', () => fs);
const path = require("path");
jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
const logger_1 = require("../logger");
const parser_1 = require("../parser");
const utils_1 = require("../utils");
const file_1 = require("./file");
describe(`read`, () => {
    it(`should read file`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.plugin.read('a/b/c');
        expect(utils_1.last(fs.readFile.mock.calls)[0]).toBe('a/b/c');
        expect(utils_1.last(fs.readFile.mock.calls)[1]).toBe('utf8');
    }));
    it(`should handle error`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.plugin.read('error');
        expect(logger_1.logger.error).toHaveBeenLastCalledWith('error');
    }));
});
describe(`write`, () => {
    it(`should write file`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.plugin.write('a/b/c', 'xyz');
        expect(utils_1.last(fs.writeFile.mock.calls)[0]).toBe('a/b/c');
        expect(utils_1.last(fs.writeFile.mock.calls)[1]).toBe('xyz');
    }));
    it(`should handle error`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.plugin.write('error', 'xyz');
        expect(logger_1.logger.error).toHaveBeenLastCalledWith('error');
    }));
});
describe(`delete`, () => {
    it(`should delete file`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.plugin.delete('a/b/c');
        expect(utils_1.last(fs.unlink.mock.calls)[0]).toBe('a/b/c');
    }));
    it(`should handle error`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.plugin.delete('error');
        expect(logger_1.logger.error).toHaveBeenLastCalledWith('error');
    }));
});
describe(`watch`, () => {
    it(`should log action`, () => {
        if (!file_1.plugin.watch)
            throw new Error('Invalid plugin watch function!');
        file_1.plugin.watch({ sourcePath: 'a', destinationPath: 'b', destination: file_1.plugin });
        expect(logger_1.logger.log).toHaveBeenLastCalledWith('[FILE] a -> b');
    });
});
describe(`watchFiles`, () => {
    it(`should register watcher events`, () => {
        const watcher = { on: jest.fn() };
        file_1.watchFiles(watcher, parser_1.pattern(''), parser_1.pattern(''), file_1.plugin)();
        expect(watcher.on.mock.calls[0][0]).toBe('error');
        expect(watcher.on.mock.calls[1][0]).toBe('add');
        expect(watcher.on.mock.calls[2][0]).toBe('change');
        expect(watcher.on.mock.calls[3][0]).toBe('unlink');
    });
});
describe(`writeToDestination`, () => {
    it(`should log action, read from source, then write to destination`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.writeToDestination(parser_1.pattern('a/:id'), parser_1.pattern('b/:id'), file_1.plugin)('a/1');
        expect(logger_1.logger.log).toHaveBeenLastCalledWith('[WRITE] a/1 -> b/1');
        expect(utils_1.last(fs.readFile.mock.calls)[0]).toBe('a/1');
        expect(utils_1.last(fs.writeFile.mock.calls)[0]).toBe('b/1');
        expect(utils_1.last(fs.writeFile.mock.calls)[1]).toBe('a/1');
    }));
});
describe(`deleteFromDestination`, () => {
    it(`should log action, then delete from destination`, () => __awaiter(this, void 0, void 0, function* () {
        yield file_1.deleteFromDestination(parser_1.pattern('a/:id'), parser_1.pattern('b/:id'), file_1.plugin)('a/1');
        expect(logger_1.logger.log).toHaveBeenLastCalledWith('[DELETE] a/1 -> b/1');
        expect(utils_1.last(fs.unlink.mock.calls)[0]).toBe('b/1');
    }));
});
describe(`normalizePath`, () => {
    it(`should return the same string if no back slashes found`, () => {
        expect(file_1.normalizePath('a/b/c')).toBe('a/b/c');
    });
    it(`should replace back slashes with forward slashes`, () => {
        expect(file_1.normalizePath(`a${path.sep}b${path.sep}c`)).toBe('a/b/c');
    });
});
