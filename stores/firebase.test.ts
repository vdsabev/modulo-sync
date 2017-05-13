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

import { sync, startWatchingFiles, uploadFile, deleteFile, getPathKey } from './firebase';

describe(`sync`, () => {
  it(`should log action`, () => {
    sync();
    expect(logger.log).toHaveBeenLastCalledWith('[STORE] Firebase');
  });

  it(`should call watch with the correct parameters`, () => {
    sync();
    expect(watch).toHaveBeenLastCalledWith(`./posts/*/content.md`, { persistent: true });
  });

  it(`should start watching files when ready`, () => {
    sync();
    expect(last<any>(watcher.on.mock.calls)[0]).toBe('ready');
    expect(typeof last<any>(watcher.on.mock.calls)[1]).toBe('function');
  });
});

describe(`startWatchingFiles`, () => {
  it(`should call corresponding methods on file events`, () => {
    const mockWatcher: any = { on: jest.fn(() => mockWatcher) };
    startWatchingFiles(mockWatcher)();
    expect(mockWatcher.on.mock.calls[0][0]).toBe('add');
    expect(mockWatcher.on.mock.calls[1][0]).toBe('change');
    expect(mockWatcher.on.mock.calls[2][0]).toBe('unlink');
    expect(mockWatcher.on.mock.calls[3][0]).toBe('error');
  });
});

describe(`uploadFile`, () => {
  it(`should read file`, () => {
    uploadFile('a/b/c');
    expect(fs.readFile.mock.calls[0][0]).toBe('a/b/c');
  });

  it(`should call database API methods`, () => {
    uploadFile('a/b/c');
    expect(fs.readFile.mock.calls[0][0]).toBe('a/b/c');
    expect(database.ref).toHaveBeenLastCalledWith('postContent/b');
    expect(database.ref().set).toHaveBeenLastCalledWith('a/b/c');
    expect(database.ref().set().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`deleteFile`, () => {
  it(`should call database API methods`, () => {
    deleteFile('a/b/c');
    expect(database.ref).toHaveBeenLastCalledWith('postContent/b');
    expect(database.ref().remove).toHaveBeenCalled();
    expect(database.ref().remove().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`getPathKey`, () => {
  it(`should return the name of the root folder's subfolder`, () => {
    const localPath = ['a', 'b', 'c'].join('/');
    expect(getPathKey(localPath)).toBe('b');
  });
});
