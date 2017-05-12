import { watch } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import * as logger from '../logger';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve('private/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const localFolder = process.argv[2];
const database = firebase.database();

// TODO: Make configurable
export const sync = () => {
  logger.log('[STORE] Firebase');
  const watcher = watch(`./${localFolder}/*/content.md`, { persistent: true });
  watcher.on('ready', startWatchingFiles(watcher));
};

const startWatchingFiles = (watcher: fs.FSWatcher) => () => {
  watcher
    .on('add', uploadFile)
    .on('change', uploadFile)
    .on('unlink', deleteFile)
    .on('error', logger.error);
};

const uploadFile = (localPath: string) => {
  logger.log('[UPLOAD]', localPath);
  const [root, key, filename] = localPath.split(path.sep);
  fs.readFile(localPath, 'utf8', (error, file) => {
    if (error) return logger.error(error);
    database.ref(`postContent/${key}`).set(file).catch(logger.error);
  });
};

const deleteFile = (localPath: string) => {
  logger.log('[DELETE]', localPath);
  const [root, key, filename] = localPath.split(path.sep);
  database.ref(`postContent/${key}`).remove().catch(logger.error);
};
