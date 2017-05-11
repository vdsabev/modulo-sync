// TODO: Write tests
// TODO: Refactor in FP
// TODO: Improve CLI options and allow installing globally
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download

import * as dotenv from 'dotenv';
dotenv.config();

import { watch } from 'chokidar';
import * as logger from './logger';

const googleCloudStorage = require('@google-cloud/storage');
const storage = googleCloudStorage({ projectId: process.env.GOOGLE_PROJECT_ID, keyFilename: './key.json' });
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);

const startWatchingFiles = () => {
  watcher
    .on('add', uploadFile)
    .on('change', uploadFile)
    .on('unlink', deleteFile)
    .on('error', logger.error);
};

const uploadFile = (localPath: string) => {
  logger.log('[UPLOAD]', localPath);
  bucket.upload(localPath, { destination: remotePath(localPath) }).catch(logger.error);
};

const deleteFile = (localPath: string) => {
  logger.log('[DELETE]', localPath);
  bucket.file(remotePath(localPath)).delete().catch(logger.error);
};

const remotePath = (localPath: string) => localPath.replace(/\\/g, '/');

const localFolder = process.argv[2];
const watcher = watch(`./${localFolder}/**/*`, { persistent: true });
watcher.on('ready', startWatchingFiles);
