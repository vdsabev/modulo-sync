// TODO: Improve CLI options
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download

import * as glob from 'glob';

import { parse } from './parser';
import { get, isContained } from './utils';

const sourceStore = parse('local://./posts/*/content.md');
const destinationStore = parse('firebase://postContent');

export const isInOptions = isContained([sourceStore.type, destinationStore.type]);

export const requireAndSync = (filename: string) => {
  const store: StoreModule = require(filename);
  if (isInOptions(store.type)) {
    store.sync({ source: sourceStore, destination: destinationStore });
  }
};

const storesGlob = './stores/!(*.test).js';
glob.sync(storesGlob, { cwd: __dirname }).map(requireAndSync);
