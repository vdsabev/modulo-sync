export const log = console.log;
export const error = console.error.bind(console, `[ERROR]:`);
export const maybeError = (e: Error) => e ? error(e) : null;
