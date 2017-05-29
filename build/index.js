"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const logger_1 = require("./logger");
const parser_1 = require("./parser");
const utils_1 = require("./utils");
// TODO: If no plugins found in config, log a warning message before exiting
// TODO: Support path arrays
config_1.config.events.map((configEvent) => {
    const settings = [];
    utils_1.keys(configEvent).map((definition) => {
        const path = configEvent[definition];
        settings.push(Object.assign({}, parser_1.parseEventDefinition(definition), { path }));
    });
    const events = settings.filter((setting) => setting.type === 'event');
    const actions = settings.filter((setting) => setting.type === 'action');
    events.map((event) => {
        const { plugin: source } = require(`./plugins/${event.plugin}`);
        const sourcePattern = parser_1.pattern(event.path);
        actions.map((action) => {
            const { plugin: destination } = require(`./plugins/${action.plugin}`);
            const destinationPattern = parser_1.pattern(action.path);
            source.on(event.params, sourcePattern, (sourcePath, ...args) => {
                const data = sourcePattern.extract(sourcePath);
                const destinationPath = destinationPattern.replace(data);
                logger_1.logger.log(`${event.plugin} [${event.params.join(', ')}]: ${sourcePath} -> ${action.plugin} (${action.params.join(', ')}): ${destinationPath}`);
                destination.do(action.params, destinationPath, ...args);
            });
        });
    });
});
