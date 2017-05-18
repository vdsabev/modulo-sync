import 'jest';

import * as originalFs from 'fs';
const fs = { ...originalFs, readFile: jest.fn(), writeFile: jest.fn(), unlink: jest.fn() };
jest.mock('fs', () => fs);

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';
import { last } from '../utils';

import { store } from './local';

describe(`read`, () => {
  it(`should read file`, () => {
    store.read('a/b/c');
    expect(last<any>(fs.readFile.mock.calls)[0]).toBe('a/b/c');
    expect(last<any>(fs.readFile.mock.calls)[1]).toBe('utf8');
  });
});

describe(`write`, () => {
  it(`should write file`, () => {
    store.write('a/b/c', 'xyz');
    expect(last<any>(fs.writeFile.mock.calls)[0]).toBe('a/b/c');
    expect(last<any>(fs.writeFile.mock.calls)[1]).toBe('xyz');
  });
});

describe(`delete`, () => {
  it(`should delete file`, () => {
    store.delete('a/b/c');
    expect(last<any>(fs.unlink.mock.calls)[0]).toBe('a/b/c');
  });
});

describe(`watch`, () => {
  it(`should log action`, () => {
    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[LOCAL] a -> b');
  });
});
