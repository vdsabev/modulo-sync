"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const stream_1 = require("stream");
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
    type: 'gcs',
    read: (sourcePath) => bucket.file(sourcePath).download().catch(logger_1.logger.error),
    write: (destinationPath, content) => new Promise((resolve, reject) => {
        const writeStream = bucket.file(destinationPath).createWriteStream();
        const readStream = new stream_1.Readable();
        readStream.push(content);
        readStream.push(null);
        readStream.pipe(writeStream).on('close', resolve).on('error', reject);
    }),
    delete: (destinationPath) => bucket.file(destinationPath).delete().catch(logger_1.logger.error),
    watch({ sourcePath, destinationPath, destination }) {
        logger_1.logger.log(`[GCS] ${sourcePath} -> ${destinationPath}`);
        // TODO: Implement
    }
});
