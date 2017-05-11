import * as dotenv from 'dotenv';
dotenv.config();

import { watch } from 'chokidar';
import * as firebase from 'firebase/app'; // TODO: Use require instead?
import 'firebase/auth';
import 'firebase/storage';
import { readFile } from 'fs';
import { sep as pathSeparator } from 'path';

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const remotePathPrefix = 'posts';
const ref = firebase.storage().ref(remotePathPrefix);

const localFolder = 'public';
const localFolderRegex = new RegExp(`$${localFolder}\\${pathSeparator}`);
const localFilesGlob = `./${localFolder}/**/*`;

let ready: { watch?: boolean, auth?: boolean } = {};
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
const watcher = watch(localFilesGlob, { persistent: true });

watcher
  .on('ready', () => ready.watch = true)
  .on('add', uploadFile)
  .on('change', uploadFile)
  .on('unlink', deleteFile)
  .on('error', logError);

firebase.auth()
  .signInWithEmailAndPassword(process.env.FIREBASE_AUTH_EMAIL, process.env.FIREBASE_AUTH_PASSWORD)
  .then(() => ready.auth = true);

function uploadFile(filename: string) {
  if (!isReady()) return;

  const path = getStoragePath(filename);
  console['log']('[UPLOAD]', path);
  readFile(filename, (error, file) => {
    if (error) return logError(error);
    // TODO: Upload file
    // ref.child('filename');
  });
}

function deleteFile(filename: string) {
  if (!isReady()) return;

  const path = getStoragePath(filename);
  console['log']('[DELETE]', path);
  // TODO: Delete file
  // ref.child('filename');
}

function isReady(): boolean {
  return ready.watch && ready.auth;
}

function getStoragePath(filename: string): string {
  return filename.replace(localFolderRegex, '');
}

function logError(error: Error) {
  console.error(`[ERROR]:`, error);
}
