"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
it(`TODO`);
// const watcher: any = { on: jest.fn(() => watcher) };
// const watch = jest.fn(() => watcher);
// jest.mock('chokidar', () => ({ watch }));
// import { config } from '../config';
// import { constant } from 'compote-fp';
// const database = {
//   ref: jest.fn(constant({
//     set: jest.fn(constant({ catch: jest.fn() })),
//     remove: jest.fn(constant({ catch: jest.fn() })),
//     catch: jest.fn()
//   }))
// };
// jest.mock('firebase-admin', () => ({
//   initializeApp: () => ({ database: () => database }),
//   credential: { cert: () => 'a' }
// }));
// import * as path from 'path';
// jest.mock(path.resolve(process.cwd(), config.config.firebase.keyFilename), () => '', { virtual: true });
// jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
// import { logger } from '../logger';
// import { plugin } from './firebase';
// describe(`read`, () => {
//   it(`should read reference`, () => {
//     plugin.read('a/b/c');
//     expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
//     expect(database.ref().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });
// describe(`write`, () => {
//   it(`should call database API methods`, () => {
//     plugin.write('a/b/c', 'content');
//     expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
//     expect(database.ref().set).toHaveBeenLastCalledWith('content');
//     expect(database.ref().set().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });
// describe(`delete`, () => {
//   it(`should call database API methods`, () => {
//     plugin.delete('a/b/c');
//     expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
//     expect(database.ref().remove).toHaveBeenCalled();
//     expect(database.ref().remove().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });
// describe(`watch`, () => {
//   it(`should log action`, () => {
//     if (!plugin.watch) throw new Error('Invalid plugin watch function!');
//     plugin.watch({ sourcePath: 'a', destinationPath: 'b', destination: plugin });
//     expect(logger.log).toHaveBeenLastCalledWith('[FIREBASE] a -> b');
//   });
// });
