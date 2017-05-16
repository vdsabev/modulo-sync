import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { sync } from './gcs';

describe(`sync`, () => {
  it(`should log action`, () => {
    sync({ source: { type: 'gcs', path: 'a' }, destination: { type: 'gcs', path: 'b' } });
    expect(logger.log).toHaveBeenLastCalledWith('[GCS] a -> b');
  });
});
