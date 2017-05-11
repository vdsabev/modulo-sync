// TODO: Write tests
// TODO: Refactor in FP
// TODO: Improve CLI options and allow installing globally
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download
// TODO: Extract firebase database & google cloud storage in separate files
// TODO: Allow using like this:
// `npm start database/postContent/${key},posts/**/content.md storage/posts/${key},posts/**/!(content.md)`

import * as dotenv from 'dotenv';
dotenv.config();

import { watch } from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

import * as logger from './logger';

const firebaseAdmin = require('firebase-admin');
const databaseKey = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(databaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const localFolder = process.argv[2];
// TODO: Make this configurable
const database = firebase.database().ref('postContent');

const startWatchingFiles = () => {
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
    database.child(key).set(file).catch(logger.error);
  });
};

const deleteFile = (localPath: string) => {
  logger.log('[DELETE]', localPath);
  const [root, key, filename] = localPath.split(path.sep);
  database.child(key).remove().catch(logger.error);
};

// TODO: Make this configurable
const watcher = watch(`./${localFolder}/*/content.md`, { persistent: true });
watcher.on('ready', startWatchingFiles);

// const googleCloudStorage = require('@google-cloud/storage');
// const storage = googleCloudStorage({ projectId: process.env.FIREBASE_PROJECT_ID, keyFilename: './key.json' });
// const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

// const uploadFile = (localPath: string) => {
//   logger.log('[UPLOAD]', localPath);
//   bucket.upload(localPath, { destination: remotePath(localPath) }).catch(logger.error);
// };

// const deleteFile = (localPath: string) => {
//   logger.log('[DELETE]', localPath);
//   bucket.file(remotePath(localPath)).delete().catch(logger.error);
// };

// const remotePath = (localPath: string) => localPath.replace(/\\/g, '/');
