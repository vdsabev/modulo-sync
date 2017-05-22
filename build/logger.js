"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createLogger = (output, ...args) => {
    const logger = createLogger;
    logger.log = output.log.bind(null, ...args);
    logger.error = output.error.bind(null, ...args);
    logger.maybeError = (e) => e && logger.error ? logger.error(e) : null;
    return logger;
};
// Default logger that outputs to the console
exports.logger = createLogger(console);
