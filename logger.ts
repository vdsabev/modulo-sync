exports.log = console.log;
exports.error = console.error;
exports.maybeError = (e: Error) => e ? exports.error(e) : null;

export const { log, error, maybeError } = exports;
