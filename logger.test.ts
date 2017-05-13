import 'jest';

import * as logger from './logger';

describe(`log`, () => {
  it(`should equal console.log`, () => {
    expect(logger.log).toEqual(console.log);
  });
});

describe(`error`, () => {
  it(`should equal console.error`, () => {
    expect(logger.error).toEqual(console.error);
  });
});

describe(`maybeError`, () => {
  it(`should log error if truth`, () => {
    const originalError = logger.error;
    (<any>logger).error = jest.fn();
    logger.maybeError(true);
    expect(logger.error).toHaveBeenLastCalledWith(true);
    (<any>logger).error = originalError;
  });

  it(`should not log error if false`, () => {
    const originalError = logger.error;
    (<any>logger).error = jest.fn();
    logger.maybeError(false);
    expect(logger.error).not.toHaveBeenLastCalledWith(false);
    (<any>logger).error = originalError;
  });
});
