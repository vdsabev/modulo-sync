"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const watcher = { on: jest.fn(() => watcher) };
const watch = jest.fn(() => watcher);
jest.mock('chokidar', () => ({ watch }));
const config_1 = require("../config");
const utils_1 = require("../utils");
const database = {
    ref: jest.fn(utils_1.constant({
        set: jest.fn(utils_1.constant({ catch: jest.fn() })),
        remove: jest.fn(utils_1.constant({ catch: jest.fn() })),
        catch: jest.fn()
    }))
};
jest.mock('firebase-admin', () => ({
    initializeApp: () => ({ database: () => database }),
    credential: { cert: () => 'a' }
}));
const path = require("path");
jest.mock(path.resolve(process.cwd(), config_1.config.plugins.firebase.keyFilename), () => '', { virtual: true });
jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
const logger_1 = require("../logger");
const firebase_1 = require("./firebase");
describe(`read`, () => {
    it(`should read reference`, () => {
        firebase_1.plugin.read('a/b/c');
        expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
        expect(database.ref().catch).toHaveBeenLastCalledWith(logger_1.logger.error);
    });
});
describe(`write`, () => {
    it(`should call database API methods`, () => {
        firebase_1.plugin.write('a/b/c', 'content');
        expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
        expect(database.ref().set).toHaveBeenLastCalledWith('content');
        expect(database.ref().set().catch).toHaveBeenLastCalledWith(logger_1.logger.error);
    });
});
describe(`delete`, () => {
    it(`should call database API methods`, () => {
        firebase_1.plugin.delete('a/b/c');
        expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
        expect(database.ref().remove).toHaveBeenCalled();
        expect(database.ref().remove().catch).toHaveBeenLastCalledWith(logger_1.logger.error);
    });
});
describe(`watch`, () => {
    it(`should log action`, () => {
        if (!firebase_1.plugin.watch)
            throw new Error('Invalid plugin watch function!');
        firebase_1.plugin.watch({ sourcePath: 'a', destinationPath: 'b', destination: firebase_1.plugin });
        expect(logger_1.logger.log).toHaveBeenLastCalledWith('[FIREBASE] a -> b');
    });
});
