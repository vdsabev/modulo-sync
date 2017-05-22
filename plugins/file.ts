import { watch, FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../logger';
import { pattern, Pattern } from '../parser';
import { sequence, promisify, partial, freeze } from '../utils';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);

export const plugin: ModuloPlugin = freeze({
  type: <ModuloPluginType>'file',
  read: (filePath: string) => readFile(filePath, 'utf8').catch(logger.error),
  write: (filePath: string, content: string) => writeFile(filePath, content).catch(logger.error),
  delete: (filePath: string) => deleteFile(filePath).catch(logger.error),
  watch({ sourcePath, destinationPath, destination }: WatchOptions) {
    logger.log(`[${plugin.type.toUpperCase()}] ${sourcePath} -> ${destinationPath}`);

    const sourcePattern = pattern(sourcePath);
    const destinationPattern = pattern(destinationPath);

    const watcher = watch(sourcePattern.replace('*'), { persistent: true });
    watcher.on('ready', watchFiles(watcher, sourcePattern, destinationPattern, destination));
  }
});

export const watchFiles = (watcher: FSWatcher, sourcePattern: Pattern, destinationPattern: Pattern, destination: ModuloPlugin) => () => {
  watcher.on('error', partial(logger.error, '[ERROR]'));
  watcher.on('add', writeToDestination(sourcePattern, destinationPattern, destination));
  watcher.on('change', writeToDestination(sourcePattern, destinationPattern, destination));
  watcher.on('unlink', deleteFromDestination(sourcePattern, destinationPattern, destination));
};

export const writeToDestination = (sourcePattern: Pattern, destinationPattern: Pattern, destination: ModuloPlugin) => (filePath: string) => {
  const sourcePath = normalizePath(filePath);
  const data = sourcePattern.extract(sourcePath);
  const destinationPath = destinationPattern.replace(data);
  logger.log(`[WRITE] ${sourcePath} -> ${destinationPath}`);

  return plugin.read(sourcePath).then((content) => destination.write(destinationPath, content));
};

export const deleteFromDestination = (sourcePattern: Pattern, destinationPattern: Pattern, destination: ModuloPlugin) => (filePath: string) => {
  const sourcePath = normalizePath(filePath);
  const data = sourcePattern.extract(sourcePath);
  const destinationPath = destinationPattern.replace(data);
  logger.log(`[DELETE] ${sourcePath} -> ${destinationPath}`);

  return destination.delete(destinationPath);
};

export const normalizePath = (filePath: string) => filePath.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
