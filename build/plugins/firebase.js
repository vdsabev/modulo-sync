"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const config_1 = require("../config");
const firebaseAdmin = require('firebase-admin');
const firebaseKey = require(path.resolve(process.cwd(), config_1.config.options.firebase.keyFilename || 'keys/firebase.json'));
const firebase = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseKey),
    databaseURL: config_1.config.options.firebase.databaseURL
});
const database = firebase.database();
exports.default = () => ({
    on(eventNames, sourcePattern, fn) {
        const ref = database.ref(sourcePattern.replace(''));
        // Avoid multiple `child_added` events
        // https://stackoverflow.com/questions/27978078/how-to-separate-initial-data-load-from-incremental-children-with-firebase
        let loaded;
        ref.once('value').then(() => loaded = true);
        eventNames.map(startWatching(ref, fn, sourcePattern, () => loaded));
    },
    do(methodName, destinationPath, ...args) {
        const ref = database.ref(destinationPath);
        return ref[methodName](...args);
    }
});
const startWatching = (ref, fn, sourcePattern, loaded) => (eventName) => {
    ref.on(eventName, (snapshot) => {
        if (loaded()) {
            fn(sourcePattern.replace(snapshot.key), snapshot.val());
        }
    });
};
