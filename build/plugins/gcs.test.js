"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const path = require("path");
jest.mock('path', () => (Object.assign({}, path, { sep: '/' })));
const utils_1 = require("../utils");
const readStream = {
    push: jest.fn(),
    pipe: jest.fn(() => readStream),
    on: jest.fn(() => readStream)
};
jest.mock('stream', utils_1.constant({ Readable: jest.fn(utils_1.constant(readStream)) }));
const stream_1 = require("stream");
const fileResult = {
    download: jest.fn(() => fileResult),
    delete: jest.fn(() => fileResult),
    catch: jest.fn(() => fileResult),
    createWriteStream: jest.fn()
};
const file = jest.fn(utils_1.constant(fileResult));
jest.mock('@google-cloud/storage', () => jest.fn(utils_1.constant({ bucket: utils_1.constant({ file }) })));
jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
const logger_1 = require("../logger");
const gcs_1 = require("./gcs");
describe(`read`, () => {
    it(`should read reference`, () => {
        gcs_1.plugin.read('read');
        expect(file).toHaveBeenLastCalledWith('read');
        expect(file().download).toHaveBeenCalled();
        expect(file().catch).toHaveBeenLastCalledWith(logger_1.logger.error);
    });
});
describe(`write`, () => {
    it(`should create read stream and call bucket API methods`, () => {
        gcs_1.plugin.write('write', 'content');
        expect(file).toHaveBeenLastCalledWith('write');
        expect(file().createWriteStream).toHaveBeenCalled();
        expect(stream_1.Readable).toHaveBeenCalled();
    });
});
describe(`delete`, () => {
    it(`should call bucket API methods`, () => {
        gcs_1.plugin.delete('delete');
        expect(file).toHaveBeenLastCalledWith('delete');
        expect(file().delete).toHaveBeenCalled();
        expect(file().catch).toHaveBeenLastCalledWith(logger_1.logger.error);
    });
});
describe(`watch`, () => {
    it(`should log action`, () => {
        if (!gcs_1.plugin.watch)
            throw new Error('Invalid plugin watch function!');
        gcs_1.plugin.watch({ sourcePath: 'a', destinationPath: 'b', destination: gcs_1.plugin });
        expect(logger_1.logger.log).toHaveBeenLastCalledWith('[GCS] a -> b');
    });
});
