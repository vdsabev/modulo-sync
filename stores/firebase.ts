import { watch, FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../logger';
import { pipe, sequence, promisify, partial } from '../utils';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve('private/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const remotePath = 'postContent';
const files = `./posts/*/content.md`;
const database = firebase.database();

export const sync = sequence(partial(logger.log, '[STORE] Firebase'), () => {
  const watcher = watch(files, { persistent: true });
  watcher.on('ready', startWatchingFiles(watcher));
});

export const startWatchingFiles = (watcher: FSWatcher) => () => {
  watcher
    .on('add', sequence(partial(logger.log, '[CREATE]'), uploadFile))
    .on('change', sequence(partial(logger.log, '[UPDATE]'), uploadFile))
    .on('unlink', sequence(partial(logger.log, '[DELETE]'), deleteFile))
    .on('error', partial(logger.error, '[ERROR]'));
};

export const uploadFile = async (localPath: string) => {
  const readFile = promisify(fs.readFile);
  const file = await readFile(localPath, 'utf8').catch(logger.error);
  await database.ref(getRemotePath(localPath)).set(file).catch(logger.error);
};

export const deleteFile = async (localPath: string) => {
  await database.ref(getRemotePath(localPath)).remove().catch(logger.error);
};

export const getRemotePath = (localPath: string): string => {
  const key = localPath.split(path.sep)[1];
  return `${remotePath}/${key}`;
};
