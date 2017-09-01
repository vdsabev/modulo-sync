import { freeze } from 'compote-fp';
import * as path from 'path';

import { config } from '../config';
import { logger } from '../logger';
import { pattern, Pattern } from '../pattern';

const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve(process.cwd(), config.config.firebase.keyFilename || 'keys/firebase.json'));

const firebase = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
  databaseURL: config.config.firebase.databaseURL
});

const database = firebase.database();

export const plugin: any = freeze({
  on(eventNames: string[], sourcePattern: Pattern, fn: Function) {
    const ref = database.ref(sourcePattern.replace(''));

    // Avoid multiple `child_added` events
    // https://stackoverflow.com/questions/27978078/how-to-separate-initial-data-load-from-incremental-children-with-firebase
    let loaded: boolean;
    ref.once('value').then(() => loaded = true);
    eventNames.map(startWatching(ref, fn, sourcePattern, () => loaded));
  },
  do(methodName: string, destinationPath: string, ...args: any[]) {
    const ref = database.ref(destinationPath);
    return ref[methodName](...args);
  }
});

export const startWatching = (ref: any, fn: Function, sourcePattern: Pattern, loaded: () => boolean) => (eventName: string) => {
  ref.on(eventName, (snapshot: any) => {
    if (loaded()) {
      fn(sourcePattern.replace(snapshot.key), snapshot.val());
    }
  });
};
