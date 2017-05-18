import 'jest';

import * as originalFs from 'fs';
const fs = {
  ...originalFs,
  readFile: jest.fn((filePath: string, encoding: string, callback: Function) => callback(filePath === 'error' ? filePath : null, filePath)),
  writeFile: jest.fn((filePath: string, content: string, callback: Function) => callback(filePath === 'error' ? filePath : null, filePath)),
  unlink: jest.fn((filePath: string, callback: Function) => callback(filePath === 'error' ? filePath : null, filePath))
};
jest.mock('fs', () => fs);

import * as path from 'path';

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';
import { pattern } from '../parser';
import { last } from '../utils';

import { store, watchFiles, writeToDestination, deleteFromDestination, normalizePath } from './local';

describe(`read`, () => {
  it(`should read file`, async () => {
    await store.read('a/b/c');
    expect(last<any>(fs.readFile.mock.calls)[0]).toBe('a/b/c');
    expect(last<any>(fs.readFile.mock.calls)[1]).toBe('utf8');
  });

  it(`should handle error`, async () => {
    await store.read('error');
    expect(logger.error).toHaveBeenLastCalledWith('error');
  });
});

describe(`write`, () => {
  it(`should write file`, async () => {
    await store.write('a/b/c', 'xyz');
    expect(last<any>(fs.writeFile.mock.calls)[0]).toBe('a/b/c');
    expect(last<any>(fs.writeFile.mock.calls)[1]).toBe('xyz');
  });

  it(`should handle error`, async () => {
    await store.write('error', 'xyz');
    expect(logger.error).toHaveBeenLastCalledWith('error');
  });
});

describe(`delete`, () => {
  it(`should delete file`, async () => {
    await store.delete('a/b/c');
    expect(last<any>(fs.unlink.mock.calls)[0]).toBe('a/b/c');
  });

  it(`should handle error`, async () => {
    await store.delete('error');
    expect(logger.error).toHaveBeenLastCalledWith('error');
  });
});

describe(`watch`, () => {
  it(`should log action`, () => {
    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[LOCAL] a -> b');
  });
});

describe(`watchFiles`, () =>  {
  it(`should register watcher events`, () => {
    const watcher = { on: jest.fn() };
    watchFiles(<any>watcher, pattern(''), pattern(''), store)();
    expect(watcher.on.mock.calls[0][0]).toBe('error');
    expect(watcher.on.mock.calls[1][0]).toBe('add');
    expect(watcher.on.mock.calls[2][0]).toBe('change');
    expect(watcher.on.mock.calls[3][0]).toBe('unlink');
  });
});

describe(`writeToDestination`, () => {
  it(`should log action, read from source, then write to destination`, async () => {
    await writeToDestination(pattern('a/:id'), pattern('b/:id'), store)('a/1');
    expect(logger.log).toHaveBeenLastCalledWith('[WRITE] a/1 -> b/1');
    expect(last<any>(fs.readFile.mock.calls)[0]).toBe('a/1');
    expect(last<any>(fs.writeFile.mock.calls)[0]).toBe('b/1');
    expect(last<any>(fs.writeFile.mock.calls)[1]).toBe('a/1');
  });
});

describe(`deleteFromDestination`, () => {
  it(`should log action, then delete from destination`, async () => {
    await deleteFromDestination(pattern('a/:id'), pattern('b/:id'), store)('a/1');
    expect(logger.log).toHaveBeenLastCalledWith('[DELETE] a/1 -> b/1');
    expect(last<any>(fs.unlink.mock.calls)[0]).toBe('b/1');
  });
});

describe(`normalizePath`, () => {
  it(`should return the same string if no back slashes found`, () => {
    expect(normalizePath('a/b/c')).toBe('a/b/c');
  });

  it(`should replace back slashes with forward slashes`, () => {
    expect(normalizePath(`a${path.sep}b${path.sep}c`)).toBe('a/b/c');
  });
});
