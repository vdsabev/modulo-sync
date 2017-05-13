import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { sync } from './gcs';

describe(`sync`, () => {
  it(`should log action`, () => {
    sync('a', 'b');
    expect(logger.log).toHaveBeenLastCalledWith('[GCS] a -> b');
  });
});
