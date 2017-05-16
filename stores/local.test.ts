import 'jest';

import * as path from 'path';
jest.mock('path', () => ({ ...path, sep: '/' }));

jest.mock('../logger', () => ({ logger: { log: jest.fn(), error: jest.fn() } }));
import { logger } from '../logger';

import { store } from './local';

describe(`watch`, () => {
  it(`should log action`, () => {
    store.watch({ sourcePath: 'a', destinationPath: 'b', destination: store });
    expect(logger.log).toHaveBeenLastCalledWith('[LOCAL] a -> b');
  });
});
