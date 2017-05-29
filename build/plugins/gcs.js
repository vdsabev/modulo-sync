"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const config_1 = require("../config");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const googleCloudStorage = require('@google-cloud/storage');
const storage = googleCloudStorage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: path.resolve(process.cwd(), config_1.config.plugins.gcs.keyFilename || 'keys/gcs.json')
});
const bucket = storage.bucket(config_1.config.plugins.gcs.bucket);
exports.plugin = utils_1.freeze({
    on(eventNames) {
        logger_1.logger.error(`WARNING: Events aren't supported for plugin: gcs`);
    },
    do(actionNames, ...args) {
        logger_1.logger.error(`WARNING: Actions aren't supported for plugin: gcs`);
    }
});
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
