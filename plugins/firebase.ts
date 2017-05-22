import * as path from 'path';

import { config } from '../config';
import { logger } from '../logger';
import { freeze } from '../utils';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve(process.cwd(), config.plugins.firebase.keyFilename || 'keys/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: config.plugins.firebase.databaseURL
});

const database = firebase.database();

export const plugin: ModuloPlugin = freeze({
  type: <ModuloPluginType>'firebase',
  read: (sourcePath: string) => database.ref(sourcePath).catch(logger.error),
  write: (destinationPath: string, content: string) => database.ref(destinationPath).set(content).catch(logger.error),
  delete: (path: string) => database.ref(path).remove().catch(logger.error),
  watch({ sourcePath, destinationPath, destination }: WatchOptions) {
    logger.log(`[FIREBASE] ${sourcePath} -> ${destinationPath}`);
    // TODO: Implement
  }
});
