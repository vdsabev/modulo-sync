import { arrayize, keys } from 'compote-fp';

import { config, parseEventDefinition } from './config';
import { logger } from './logger';
import { pattern, Pattern } from './pattern';

// TODO: If no events found in config, log a warning message before exiting
// TODO: Support path arrays
config.events.map((configEvent) => {
  if (!configEvent.watch) return logger.error(`Invalid config event: watch missing in ${JSON.stringify(configEvent, null, 2)}`);

  keys(configEvent).map((definition) => {
    if (definition === 'watch') return;

    const events = parseEventDefinition(definition);
    const fns = arrayize(configEvent[definition]);

    configEvent.watch(events, async (path: string) => {
      let arg: any = path;
      for (const fn of fns) {
        // TODO: Make sure the require is non-blocking on subsequent requests; use cache if it is
        arg = await fn(arg).catch(logger.error);
      }
    });
  });
});

// `JSON.stringify` returns `undefined` for anonymous functions, but `toString` works fine
const stringify = (s: string) => JSON.stringify(s) || s && s.toString();
