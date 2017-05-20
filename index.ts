require('dotenv').config();

import { config } from './config';
import { parse } from './parser';

// TODO: Refactor
const syncStore = ({ from, to }: { from: string, to: string }) => {
  const options = { source: parse(from), destination: parse(to) };

  // TODO: Handle require exceptions
  const { store: source }: { store: Store } = require(`./stores/${options.source.type}`);
  const { store: destination }: { store: Store } = require(`./stores/${options.destination.type}`);

  // TODO: Handle case where there's no watch function for the store
  if (!source.watch) return;

  source.watch({
    sourcePath: options.source.path,
    destinationPath: options.destination.path,
    destination
  });
};

// TODO: If no stores found in config, log a warning message before exiting
config.sync.stores.map(syncStore);
