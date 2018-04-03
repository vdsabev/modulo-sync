import { logger as defaultLogger, Logger } from './logger';

const testLogger = (logger: Logger) => {
  it(`should be a function and have all properties`, () => {
    expect(typeof logger).toBe('function');
    expect(typeof logger.log).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.maybeError).toBe('function');
  });

  describe(`maybeError`, () => {
    it(`should log error if true`, () => {
      const originalError = logger.error;
      logger.error = jest.fn();
      logger.maybeError(true);
      expect(logger.error).toHaveBeenLastCalledWith(true);
      logger.error = originalError;
    });

    it(`should not log error if false`, () => {
      const originalError = logger.error;
      logger.error = jest.fn();
      logger.maybeError(false);
      expect(logger.error).not.toHaveBeenLastCalledWith(false);
      logger.error = originalError;
    });
  });
};

describe(`default logger`, () => {
  testLogger(defaultLogger);
});

describe(`new logger`, () => {
  const output = { log: jest.fn(), error: jest.fn() };
  const logger = defaultLogger(output, 'new');
  testLogger(logger);

  it(`should output to log with the extra arguments`, () => {
    logger.log('log');
    expect(output.log).toHaveBeenLastCalledWith('new', 'log');
  });

  it(`should output to error with the extra arguments`, () => {
    logger.error('error');
    expect(output.error).toHaveBeenLastCalledWith('new', 'error');
  });

  it(`should output to error without the extra arguments`, () => {
    logger.maybeError('maybeError');
    expect(output.error).toHaveBeenLastCalledWith('new', 'maybeError');
  });
});
