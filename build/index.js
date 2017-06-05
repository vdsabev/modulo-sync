"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
// TODO: If no events found in config, log a warning message before exiting
// TODO: Support path arrays
config_1.config.events.map((configEvent) => {
    // const settings: any[] = [];
    // keys(configEvent).map((definition) => {
    //   const path = configEvent[definition];
    //   settings.push({ ...parseEventDefinition(definition), path });
    // });
    //
    // const events = settings.filter((setting) => setting.type === 'event');
    // const actions = settings.filter((setting) => setting.type === 'action');
    //
    // events.map((event) => {
    //   const { plugin: source }: { plugin: ModuloPlugin } = require(`./plugins/${event.plugin}`);
    //   const sourcePattern = pattern(event.path);
    //
    //   actions.map((action) => {
    //     const { plugin: destination }: { plugin: ModuloPlugin } = require(`./plugins/${action.plugin}`);
    //     const destinationPattern = pattern(action.path);
    //
    //     source.on(event.params, sourcePattern, (sourcePath: string, ...args: any[]) => {
    //       const data = sourcePattern.extract(sourcePath);
    //       const destinationPath = destinationPattern.replace(data);
    //       logger.log(`${event.plugin} [${event.params.join(', ')}]: ${sourcePath} -> ${action.plugin} (${action.params.join(', ')}): ${destinationPath}`);
    //       destination.do(action.params, destinationPath, ...args);
    //     });
    //   });
    // });
});
