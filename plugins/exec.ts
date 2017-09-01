import { freeze } from 'compote-fp';
import { logger } from '../logger';

const npmRun = require('npm-run');

export const plugin: any = freeze({
  // TODO: Remove when plugin methods become optional
  on(eventNames: string[]) {
    logger.error(`WARNING: Events aren't supported for plugin: exec`);
  },
  do(actionNames: string[], ...args: any[]) {
    actionNames.map((actionName) => npmRun([actionName, ...args].join(' ')));
  }
});
