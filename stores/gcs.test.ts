import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

jest.mock('../logger', () => ({ log: jest.fn(), error: jest.fn() }));
import * as logger from '../logger';

import { sync } from './gcs';

describe(`sync`, () => {
  it(`should log action`, () => {
    sync();
    expect(logger.log).toHaveBeenLastCalledWith('[STORE] GCS');
  });
});
