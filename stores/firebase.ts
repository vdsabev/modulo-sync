import * as path from 'path';

import { logger } from '../logger';
import { freeze } from '../utils';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve('private/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const database = firebase.database();

export const store: Store = freeze({
  type: <StoreType>'firebase',
  read: (sourcePath: string) => database.ref(sourcePath).catch(logger.error),
  write: (destinationPath: string, content: string) => database.ref(destinationPath).set(content).catch(logger.error),
  delete: (path: string) => database.ref(path).remove().catch(logger.error),
  watch({ sourcePath, destinationPath, destination }: WatchOptions) {
    logger.log(`[FIREBASE] ${sourcePath} -> ${destinationPath}`);
    // TODO: Implement
  }
});
