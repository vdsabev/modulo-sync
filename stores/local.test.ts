import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { sync } from './local';

describe(`sync`, () => {
  it(`should log action`, () => {
    sync();
    expect(logger.log).toHaveBeenLastCalledWith('[STORE] Local');
  });
});
