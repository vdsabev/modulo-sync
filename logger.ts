export interface Logger extends LoggerOutput {
  (output: LoggerOutput, ...args: any[]): Logger;
  maybeError(e: any): void;
}

interface LoggerOutput {
  log(...args: any[]): void;
  error(...args: any[]): void;
}

const createLogger = (output: LoggerOutput, ...args: any[]): Logger => {
  const logger = <Logger>createLogger;

  logger.log = output.log.bind(null, ...args);
  logger.error = output.error.bind(null, ...args);
  logger.maybeError = (e: any) => e && logger.error ? logger.error(e) : null;

  return logger;
};

// Default logger that outputs to the console
export const logger = createLogger(console);
