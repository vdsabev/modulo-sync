import * as path from 'path';
import { Readable } from 'stream';

import { logger } from '../logger';
import { freeze } from '../utils';

const googleCloudStorage = require('@google-cloud/storage');
const storage = googleCloudStorage({ projectId: process.env.GCS_PROJECT_ID, keyFilename: path.resolve('private/gcs.json') });
const bucket = storage.bucket(process.env.GCS_BUCKET);

export const store: Store = freeze({
  type: <StoreType>'gcs',
  read: (sourcePath: string) => bucket.file(sourcePath).download().catch(logger.error),
  write: (destinationPath: string, content: string) => new Promise<void>((resolve, reject) => {
    const writeStream = bucket.file(destinationPath).createWriteStream();
    const readStream = new Readable();
    readStream.push(content);
    readStream.push(null);
    readStream.pipe(writeStream).on('close', resolve).on('error', reject);
  }),
  delete: (destinationPath: string) => bucket.file(destinationPath).delete().catch(logger.error),
  watch({ sourcePath, destinationPath, destination }: WatchOptions) {
    logger.log(`[GCS] ${sourcePath} -> ${destinationPath}`);
    // TODO: Implement
  }
});
