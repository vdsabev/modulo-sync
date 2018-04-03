import * as path from 'path';
// import { Readable } from 'stream';

import { config } from '../config';
import { logger } from '../logger';

const googleCloudStorage = require('@google-cloud/storage');
const storage = googleCloudStorage({
  projectId: config.options.gcs.projectId,
  keyFilename: path.resolve(process.cwd(), config.options.gcs.keyFilename || 'keys/gcs.json')
});
const bucket = storage.bucket(config.options.gcs.bucket);

export const watch = (eventNames: string[]) => {
  logger.error(`WARNING: Events aren't supported for plugin: gcs`);
};

export const run = (actionNames: string[], ...args: any[]) => {
  logger.error(`WARNING: Actions aren't supported for plugin: gcs`);
};

// export const plugin: any = freeze({
//   type: <ModuloPluginType>'gcs',
//   read: (sourcePath: string) => bucket.file(sourcePath).download().catch(logger.error),
//   write: (destinationPath: string, content: string) => new Promise<void>((resolve, reject) => {
//     const writeStream = bucket.file(destinationPath).createWriteStream();
//     const readStream = new Readable();
//     readStream.push(content);
//     readStream.push(null);
//     readStream.pipe(writeStream).on('close', resolve).on('error', reject);
//   }),
//   delete: (destinationPath: string) => bucket.file(destinationPath).delete().catch(logger.error),
//   watch({ sourcePath, destinationPath, destination }: WatchOptions) {
//     logger.log(`[GCS] ${sourcePath} -> ${destinationPath}`);
//     // TODO: Implement
//   }
// });
