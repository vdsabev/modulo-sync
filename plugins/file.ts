import { watch, FSWatcher } from 'chokidar';
import { freeze, partial, promisify } from 'compote-fp';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../logger';
import { Pattern } from '../pattern';

export const plugin: any = freeze({
  on(eventNames: string[], sourcePattern: Pattern, fn: Function) {
    const watcher = watch(sourcePattern.replace('*'), { persistent: true });
    watcher.on('ready', () => {
      watcher.on('error', partial(logger.error, '[ERROR]'));
      eventNames.map((eventName: string) => {
        watcher.on(eventName, (filePath: string) => {
          const sourcePath = normalizePath(filePath);
          fn(sourcePath);
        });
      });
    });
  },
  do(method: string, ...args: any[]) {
    return promisify((<any>fs)[method])(...args);
  }
});

export const normalizePath = (filePath: string) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
