import { config, parseWatchContent, parseEventDefinition, parseEventContent } from './config';
import { logger } from './logger';
import { pattern, Pattern } from './pattern';
import { pipe, compose, keys, values, first, ternary, is, identity, contains } from './utils';

const parseWatchContentWithImports = parseWatchContent(config.import);
const parseEventContentWithImports = parseEventContent(config.import);
const getPluginName = (pluginName: string): string => {
  const containsPlugin = contains(pluginName);
  if (containsPlugin(config.import)) return pluginName;

  // ternary(is('string'), identity, compose(first, values));
  for (const importDefinition of config.import.filter(is('object'))) {
    if (containsPlugin(keys(importDefinition))) return (<any>importDefinition)[pluginName];
  }

  throw new Error(`Unknown import: ${pluginName}`);
};

// TODO: If no events found in config, log a warning message before exiting
// TODO: Support path arrays
config.events.map((configEvent) => {
  if (!configEvent.watch) return logger.error(`Invalid config event: watch missing in ${JSON.stringify(configEvent, null, 2)}`);

  const watch = parseWatchContentWithImports(configEvent.watch);
  const { plugin: watchPlugin } = require(`./plugins/${watch.plugin}`);

  keys(configEvent).map((definition) => {
    if (definition === 'watch') return;

    const events = parseEventDefinition(definition);
    const fns = parseEventContentWithImports(configEvent[definition]);

    watchPlugin.on(events, pattern(watch.path), async (path: string) => {
      let arg: any = path;
      for (const fn of fns) {
        console.log(`do ${fn.plugin}.${fn.method}(${[arg, ...fn.args].map(JSON.stringify).join(', ')})`);
        // TODO: Make sure the require is non-blocking on subsequent requests
        const fnModule = require(`./plugins/${getPluginName(fn.plugin)}`);
        if (fnModule.plugin && fnModule.plugin.do) {
          arg = await fnModule.plugin.do(fn.method, arg, ...fn.args).catch(logger.error);
        }
        else {
          arg = fnModule[fn.method](arg, ...fn.args);
        }
      }
    });
  });
});
