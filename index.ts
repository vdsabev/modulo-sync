// TODO: Improve CLI options
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download

import * as glob from 'glob';
import { pipe, invoke } from './utils';

const localPath = './posts/*/content.md';
const remotePath = 'postContent';

export const requireAndSync = pipe(require, invoke('sync', localPath, remotePath));
glob.sync('./stores/!(*.test).js', { cwd: __dirname }).map(requireAndSync);
