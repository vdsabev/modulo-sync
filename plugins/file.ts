import * as fs from 'fs';
import * as path from 'path';

import * as chokidar from 'chokidar';
import { partial, promisify } from 'compote-fp';

import { logger } from '../logger';
import { Pattern } from '../pattern';

export const watch = (sourcePattern: Pattern) => (eventNames: string[], fn: Function) => {
  const watcher = chokidar.watch(sourcePattern.replace('*'), { persistent: true });
  watcher.on('ready', () => {
    watcher.on('error', partial(logger.error, '[ERROR]'));
    eventNames.map((eventName: string) => {
      watcher.on(eventName, (filePath: string) => {
        const sourcePath = normalizePath(filePath);
        fn(sourcePath);
      });
    });
  });
};

const normalizePath = (filePath: string) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');

export const run = (method: string, ...args: any[]) => promisify((<any>fs)[method])(...args);
