import { logger } from '../logger';
import { freeze } from '../utils';

const npmRun = require('npm-run');

export const plugin: ModuloPlugin = freeze({
  // TODO: Remove when plugin methods become optional
  on(eventNames: string[]) {
    logger.error(`WARNING: Events aren't supported for plugin: exec`);
  },
  do(actionNames: string[], ...args: any[]) {
    actionNames.map((actionName) => npmRun([actionName, ...args].join(' ')));
  }
});
