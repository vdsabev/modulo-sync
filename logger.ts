export const logger = exports.logger = {
  log: console.log,
  error: console.error,
  maybeError: (e: any) => e ? logger.error(e) : null
};
