// TODO: Improve CLI options
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download

import * as glob from 'glob';

import { parse } from './parser';
import { compose, pluck, values, isContained } from './utils';

const options = parse('local://./posts/*/content.md,firebase://postContent');
const pluckTypes = compose(pluck('type'), values);
const isInTypes = isContained(pluckTypes(options));

export const requireAndSync = (filename: string) => {
  const store: StoreModule = require(filename);
  if (isInTypes(store.type)) {
    store.sync(options);
  }
};

const storesGlob = './stores/!(*.test).js';
glob.sync(storesGlob, { cwd: __dirname }).map(requireAndSync);
