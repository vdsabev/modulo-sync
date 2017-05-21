import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

import { constant } from '../utils';

const readStream: any = {
  push: jest.fn(),
  pipe: jest.fn(() => readStream),
  on: jest.fn(() => readStream)
};
jest.mock('stream', constant({ Readable: jest.fn(constant(readStream)) }));
import { Readable } from 'stream';

const fileResult: any = {
  download: jest.fn(() => fileResult),
  delete: jest.fn(() => fileResult),
  catch: jest.fn(() => fileResult),
  createWriteStream: jest.fn()
};
const file = jest.fn(constant(fileResult));
jest.mock('@google-cloud/storage', () => jest.fn(constant({ bucket: constant({ file }) })));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { store } from './gcs';

describe(`read`, () => {
  it(`should read reference`, () => {
    store.read('read');
    expect(file).toHaveBeenLastCalledWith('read');
    expect(file().download).toHaveBeenCalled();
    expect(file().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`write`, () => {
  it(`should create read stream and call bucket API methods`, () => {
    store.write('write', 'content');
    expect(file).toHaveBeenLastCalledWith('write');
    expect(file().createWriteStream).toHaveBeenCalled();
    expect(Readable).toHaveBeenCalled();
  });
});

describe(`delete`, () => {
  it(`should call bucket API methods`, () => {
    store.delete('delete');
    expect(file).toHaveBeenLastCalledWith('delete');
    expect(file().delete).toHaveBeenCalled();
    expect(file().catch).toHaveBeenLastCalledWith(logger.error);
  });
});

describe(`watch`, () => {
  it(`should log action`, () => {
    if (!store.watch) throw new Error('Invalid store watch function!');

    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[GCS] a -> b');
  });
});
