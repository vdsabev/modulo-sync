import 'jest';

const watcher: any = { on: jest.fn(() => watcher) };
const watch = jest.fn(() => watcher);
jest.mock('chokidar', () => ({ watch }));

import { constant, last } from '../utils';

const database = {
  ref: jest.fn(constant({
    set: jest.fn(constant({ catch: jest.fn() })),
    remove: jest.fn(constant({ catch: jest.fn() }))
  }))
};
const firebaseAdmin = {
  initializeApp: () => ({ database: () => database }),
  credential: {
    cert: () => 'a'
  }
};
jest.mock('firebase-admin', () => firebaseAdmin);

const fs = { readFile: jest.fn((path: string, encoding: string, next: Function) => next(null, path)) };
jest.mock('fs', () => fs);

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

jest.mock(path.resolve('private/firebase.json'), () => '', { virtual: true });

// import { store, uploadFile, deleteFile, getDestination } from './firebase';
import { store } from './firebase';

describe(`watch`, () => {
  it(`should log action`, () => {
    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[FIREBASE] a -> b');
  });
});

// describe(`uploadFile`, () => {
//   it(`should read file`, () => {
//     uploadFile('a/b/c', 'x/y/z');
//     expect(fs.readFile.mock.calls[0][0]).toBe('a/b/c');
//   });

//   it(`should call database API methods`, () => {
//     uploadFile('a/b/c', 'x/y/z');
//     expect(fs.readFile.mock.calls[0][0]).toBe('a/b/c');
//     expect(database.ref).toHaveBeenLastCalledWith('x/y/z/b');
//     expect(database.ref().set).toHaveBeenLastCalledWith('a/b/c');
//     expect(database.ref().set().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });

// describe(`deleteFile`, () => {
//   it(`should call database API methods`, () => {
//     deleteFile('a/b/c', 'x/y/z');
//     expect(database.ref).toHaveBeenLastCalledWith('x/y/z/b');
//     expect(database.ref().remove).toHaveBeenCalled();
//     expect(database.ref().remove().catch).toHaveBeenLastCalledWith(logger.error);
//   });
// });

// describe(`getDestination`, () => {
//   it(`should return the name of the root folder's subfolder`, () => {
//     expect(getDestination('a/b/c', 'x/y/z')).toBe('x/y/z/b');
//   });
// });
