import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

const bucket = jest.fn();
jest.mock('@google-cloud/storage', () => jest.fn(() => ({ bucket })));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { store } from './gcs';

describe(`watch`, () => {
  it(`should log action`, () => {
    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[GCS] a -> b');
  });
});
