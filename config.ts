import { pipe, replace, split, match, last, setDefault } from 'compote-fp';
import * as glob from 'glob';

export interface Config {
  options: Record<string, any>;
  events: ConfigEvent[];
}

interface ConfigEvent {
  watch: Function;
  [key: string]: any | any[];
}

export const parseEventDefinition: (definition: string) => string[] = pipe(replace(/(^on\s*|[\[\]\(\)])/g, ''), split(/\s*,\s*/));

// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFactoryPath = './modulo.config';
const configFactory = require(configFactoryPath);
export const config: Config = configFactory();

// Set default values
setDefault(config, {})('options');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = pipe(match(/plugins\/(\w+)/), last, setDefault(config.options, {}));
plugins.map(setPluginDefault);
