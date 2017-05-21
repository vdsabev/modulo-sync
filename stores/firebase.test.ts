import 'jest';

const watcher: any = { on: jest.fn(() => watcher) };
const watch = jest.fn(() => watcher);
jest.mock('chokidar', () => ({ watch }));

import { config } from '../config';
import { constant } from '../utils';

const database = {
  ref: jest.fn(constant({
    set: jest.fn(constant({ catch: jest.fn() })),
    remove: jest.fn(constant({ catch: jest.fn() })),
    catch: jest.fn()
  }))
};
jest.mock('firebase-admin', () => ({
  initializeApp: () => ({ database: () => database }),
  credential: { cert: () => 'a' }
}));

import * as path from 'path';
jest.mock(path.resolve(process.cwd(), config.sync.keys.firebase), () => '', { virtual: true });

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { store } from './firebase';

describe(`read`, () => {
  it(`should read reference`, () => {
    store.read('a/b/c');
    expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
    expect(database.ref().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`write`, () => {
  it(`should call database API methods`, () => {
    store.write('a/b/c', 'content');
    expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
    expect(database.ref().set).toHaveBeenLastCalledWith('content');
    expect(database.ref().set().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`delete`, () => {
  it(`should call database API methods`, () => {
    store.delete('a/b/c');
    expect(database.ref).toHaveBeenLastCalledWith('a/b/c');
    expect(database.ref().remove).toHaveBeenCalled();
    expect(database.ref().remove().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`watch`, () => {
  it(`should log action`, () => {
    if (!store.watch) throw new Error('Invalid store watch function!');

    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[FIREBASE] a -> b');
  });
});
