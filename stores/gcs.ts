import { logger } from '../logger';
import { freeze } from '../utils';

export const type: StoreType = 'gcs';

export const store: Store = freeze({
  type: <StoreType>'gcs',
  watch({ sourcePath, destinationPath, destination }: WatchOptions) {
    logger.log(`[GCS] ${sourcePath} -> ${destinationPath}`);
    // TODO: Implement
  },
  read: (path: string) => Promise.resolve(''),
  write: (path: string, content: string) => Promise.resolve(),
  delete: (path: string) => Promise.resolve()
});

// const googleCloudStorage = require('@google-cloud/storage');
// const storage = googleCloudStorage({ projectId: process.env.GCS_PROJECT_ID, keyFilename: path.resolve('private/storage.json') });
// const bucket = storage.bucket(process.env.GCS_BUCKET);

// const uploadFile = (localPath: string) => {
//   logger.log('[UPLOAD]', localPath);
//   bucket.upload(localPath, { destination: remotePath(localPath) }).catch(logger.error);
// };

// const deleteFile = (localPath: string) => {
//   logger.log('[DELETE]', localPath);
//   bucket.file(remotePath(localPath)).delete().catch(logger.error);
// };

// const remotePath = (localPath: string) => localPath.replace(/\\/g, '/');
