import { watch, FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import * as logger from '../logger';
import { promisify } from '../utils';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve('private/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const localFolder = process.argv[2] || 'posts';
const database = firebase.database();

export const sync = () => {
  logger.log('[STORE] Firebase');
  const watcher = watch(`./${localFolder}/*/content.md`, { persistent: true });
  watcher.on('ready', startWatchingFiles(watcher));
};

export const startWatchingFiles = (watcher: FSWatcher) => () => {
  watcher
    .on('add', uploadFile)
    .on('change', uploadFile)
    .on('unlink', deleteFile)
    .on('error', logger.error);
};

export const uploadFile = async (localPath: string) => {
  logger.log('[UPLOAD]', localPath);
  const key = getPathKey(localPath);
  const readFile = promisify(fs.readFile);
  const file = await readFile(localPath, 'utf8').catch(logger.error);
  await database.ref(`postContent/${key}`).set(file).catch(logger.error);
};

export const deleteFile = async (localPath: string) => {
  logger.log('[DELETE]', localPath);
  const key = getPathKey(localPath);
  await database.ref(`postContent/${key}`).remove().catch(logger.error);
};

export const getPathKey = (localPath: string): string => {
  const [root, key, filename] = localPath.split(path.sep);
  return key;
};
