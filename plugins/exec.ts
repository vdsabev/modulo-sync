import { logger } from '../logger';

const npmRun = require('npm-run');

export const run = (actionNames: string[], ...args: any[]) => {
  actionNames.map((actionName) => npmRun([actionName, ...args].join(' ')));
};
