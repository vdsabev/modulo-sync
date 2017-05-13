// TODO: Refactor in FP
// TODO: Improve CLI options
// TODO: Allow installing globally
// TODO: Store upload tasks and cancel them if a new one starts at the same path before the previous one has finished
// TODO: Add option for full initial upload
// TODO: Add option for full initial download
// TODO: Extract firebase database & google cloud storage in separate files
// TODO: Allow using like this:
// `npm start local://./posts/:postId/content.md,firebase://postContent/${postId} local://./posts/:postId/!(content.md),gcs://posts/${postId}`

import * as glob from 'glob';
import { flowRight, invoke } from './utils';

export const requireAndSync = flowRight(require, invoke('sync'));
glob.sync('./stores/!(*.test).js', { cwd: __dirname }).forEach(requireAndSync);
