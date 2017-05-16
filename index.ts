require('dotenv').config();

// TODO: Improve CLI options
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download

import { parse } from './parser';

const options = parse('local://posts/:postId/content.md,firebase://postContent/:postId');

const { store: source }: { store: Store } = require(`./stores/${options.source.type}`);
const { store: destination }: { store: Store } = require(`./stores/${options.destination.type}`);

source.watch({
  sourcePath: options.source.path,
  destinationPath: options.destination.path,
  destination
});
