import { config, ConfigEvent } from './config';
import { parse } from './parser';
import { arrayize, keys } from './utils';

// TODO: Refactor
const syncPlugin = (event: ConfigEvent) => {
  keys(event.for).map((sourceType: ModuloPluginType) => {
    // TODO: Handle require exceptions
    const { plugin: source }: { plugin: ModuloPlugin } = require(`./plugins/${sourceType}`);

    // TODO: Handle case where there's no watch function for the plugin
    if (!source.watch) return;

    const sourcePaths: string[] = arrayize(event.for[sourceType]);
    sourcePaths.map((sourcePath) => {
      keys(event.do).map((destinationType: ModuloPluginType) => {
        // TODO: Handle require exceptions
        const { plugin: destination }: { plugin: ModuloPlugin } = require(`./plugins/${destinationType}`);
        const destinationPaths: string[] = arrayize(event.do[destinationType]);
        destinationPaths.map((destinationPath) => {
          // TODO: Handle case where there's no watch function for the plugin
          if (!source.watch) return;
          source.watch({ sourcePath, destinationPath, destination });
        });
      });
    });
  });
};

// TODO: If no plugins found in config, log a warning message before exiting
config.events.map(syncPlugin);
