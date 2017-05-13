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

import { sync, startWatchingFiles, uploadFile, deleteFile, getDestination } from './firebase';

describe(`sync`, () => {
  it(`should log action`, () => {
    sync('a', 'b');
    expect(logger.log).toHaveBeenLastCalledWith('[FIREBASE] a -> b');
  });

  it(`should call watch with the correct parameters`, () => {
    sync('a', 'b');
    expect(watch).toHaveBeenLastCalledWith('a', { persistent: true });
  });

  it(`should start watching files when ready`, () => {
    sync('a', 'b');
    expect(last<any>(watcher.on.mock.calls)[0]).toBe('ready');
    expect(typeof last<any>(watcher.on.mock.calls)[1]).toBe('function');
  });
});

describe(`startWatchingFiles`, () => {
  it(`should call corresponding methods on file events`, () => {
    const mockWatcher: any = { on: jest.fn(() => mockWatcher) };
    startWatchingFiles(mockWatcher, 'b')();
    expect(mockWatcher.on.mock.calls[0][0]).toBe('add');
    expect(mockWatcher.on.mock.calls[1][0]).toBe('change');
    expect(mockWatcher.on.mock.calls[2][0]).toBe('unlink');
    expect(mockWatcher.on.mock.calls[3][0]).toBe('error');
  });
});

describe(`uploadFile`, () => {
  it(`should read file`, () => {
    uploadFile('a/b/c', 'x/y/z');
    expect(fs.readFile.mock.calls[0][0]).toBe('a/b/c');
  });

  it(`should call database API methods`, () => {
    uploadFile('a/b/c', 'x/y/z');
    expect(fs.readFile.mock.calls[0][0]).toBe('a/b/c');
    expect(database.ref).toHaveBeenLastCalledWith('x/y/z/b');
    expect(database.ref().set).toHaveBeenLastCalledWith('a/b/c');
    expect(database.ref().set().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`deleteFile`, () => {
  it(`should call database API methods`, () => {
    deleteFile('a/b/c', 'x/y/z');
    expect(database.ref).toHaveBeenLastCalledWith('x/y/z/b');
    expect(database.ref().remove).toHaveBeenCalled();
    expect(database.ref().remove().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`getDestination`, () => {
  it(`should return the name of the root folder's subfolder`, () => {
    expect(getDestination('a/b/c', 'x/y/z')).toBe('x/y/z/b');
  });
});
