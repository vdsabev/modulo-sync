import { watch, FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../logger';
import { flowRight, promisify, partial } from '../utils';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve('private/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const localFolder = 'posts';
const database = firebase.database();

export const sync = flowRight(partial(logger.log, '[STORE] Firebase'), () => {
  const watcher = watch(`./${localFolder}/*/content.md`, { persistent: true });
  watcher.on('ready', startWatchingFiles(watcher));
});

export const startWatchingFiles = (watcher: FSWatcher) => () => {
  watcher
    .on('add', flowRight(partial(logger.log, '[CREATE]'), uploadFile))
    .on('change', flowRight(partial(logger.log, '[UPDATE]'), uploadFile))
    .on('unlink', flowRight(partial(logger.log, '[DELETE]'), deleteFile))
    .on('error', partial(logger.error, '[ERROR]'));
};

export const uploadFile = async (localPath: string) => {
  const key = getPathKey(localPath);
  const readFile = promisify(fs.readFile);
  const file = await readFile(localPath, 'utf8').catch(logger.error);
  await database.ref(`postContent/${key}`).set(file).catch(logger.error);
};

export const deleteFile = async (localPath: string) => {
  const key = getPathKey(localPath);
  await database.ref(`postContent/${key}`).remove().catch(logger.error);
};

export const getPathKey = (localPath: string): string => localPath.split(path.sep)[1];
