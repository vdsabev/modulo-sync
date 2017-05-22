"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const utils_1 = require("./utils");
// TODO: Refactor
const syncPlugin = (event) => {
    utils_1.keys(event.for).map((sourceType) => {
        // TODO: Handle require exceptions
        const { plugin: source } = require(`./plugins/${sourceType}`);
        // TODO: Handle case where there's no watch function for the plugin
        if (!source.watch)
            return;
        const sourcePaths = utils_1.arrayize(event.for[sourceType]);
        sourcePaths.map((sourcePath) => {
            utils_1.keys(event.do).map((destinationType) => {
                // TODO: Handle require exceptions
                const { plugin: destination } = require(`./plugins/${destinationType}`);
                const destinationPaths = utils_1.arrayize(event.do[destinationType]);
                destinationPaths.map((destinationPath) => {
                    // TODO: Handle case where there's no watch function for the plugin
                    if (!source.watch)
                        return;
                    source.watch({ sourcePath, destinationPath, destination });
                });
            });
        });
    });
};
// TODO: If no plugins found in config, log a warning message before exiting
config_1.config.events.map(syncPlugin);
