import { watch, FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../logger';
import { Pattern } from '../parser';
import { promisify, freeze, partial } from '../utils';

const readFile = promisify(fs.readFile);

export const plugin: ModuloPlugin = freeze({
  on(eventNames: string[], sourcePattern: Pattern, fn: Function) {
    const watcher = watch(sourcePattern.replace('*'), { persistent: true });
    watcher.on('ready', () => {
      watcher.on('error', partial(logger.error, '[ERROR]'));
      eventNames.map(startWatching(watcher, fn));
    });
  },
  do(actionNames: string[], ...args: any[]) {
    actionNames.map((actionName) => (<any>fs)[actionName](...args));
  }
});

export const startWatching = (watcher: FSWatcher, fn: Function) => (eventName: string) => {
  watcher.on(eventName, async (filePath: string) => {
    const sourcePath = normalizePath(filePath);
    const args: any[] = [];
    switch (eventName) {
      case 'add':
      case 'change':
        args.push(await readFile(filePath, 'utf8'));
        break;
    }
    fn(sourcePath, ...args);
  });
};

export const normalizePath = (filePath: string) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
