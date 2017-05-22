"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const config_1 = require("../config");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve(process.cwd(), config_1.config.plugins.firebase.keyFilename || 'keys/firebase.json'));
const firebase = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseKey),
    databaseURL: config_1.config.plugins.firebase.databaseURL
});
const database = firebase.database();
exports.plugin = utils_1.freeze({
    type: 'firebase',
    read: (sourcePath) => database.ref(sourcePath).catch(logger_1.logger.error),
    write: (destinationPath, content) => database.ref(destinationPath).set(content).catch(logger_1.logger.error),
    delete: (path) => database.ref(path).remove().catch(logger_1.logger.error),
    watch({ sourcePath, destinationPath, destination }) {
        logger_1.logger.log(`[FIREBASE] ${sourcePath} -> ${destinationPath}`);
        // TODO: Implement
    }
});
