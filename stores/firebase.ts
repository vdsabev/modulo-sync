import { watch, FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import { logger } from '../logger';
import { _, pipe, sequence, promisify, partial } from '../utils';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve('private/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const database = firebase.database();

export const sync = (source: string, destination: string) => {
  logger.log(`[FIREBASE] ${source} -> ${destination}`);

  const watcher = watch(source, { persistent: true });
  watcher.on('ready', startWatchingFiles(watcher, destination));
};

export const startWatchingFiles = (watcher: FSWatcher, destination: string) => () => {
  watcher
    .on('add', sequence(partial(logger.log, '[CREATE]'), partial(uploadFile, _, destination)))
    .on('change', sequence(partial(logger.log, '[UPDATE]'), partial(uploadFile, _, destination)))
    .on('unlink', sequence(partial(logger.log, '[DELETE]'), partial(deleteFile, _, destination)))
    .on('error', partial(logger.error, '[ERROR]'));
};

export const uploadFile = async (source: string, destination: string) => {
  const readFile = promisify(fs.readFile);
  const file = await readFile(source, 'utf8').catch(logger.error);
  await database.ref(getDestination(source, destination)).set(file).catch(logger.error);
};

export const deleteFile = async (source: string, destination: string) => {
  await database.ref(getDestination(source, destination)).remove().catch(logger.error);
};

export const getDestination = (source: string, destination: string): string => [destination, source.split(path.sep)[1]].join('/');
