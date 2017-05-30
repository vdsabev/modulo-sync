import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { pipe, match, last, setDefault } from './utils';

export interface Config {
  plugins: Record<string, Record<string, string>>;
  events: ConfigEvent[];
}

export interface ConfigEvent extends Record<string, string> {
}

export interface EventSettings {
  type: EventType;
  plugin: string;
  params: string[];
}

export type EventType = 'event' | 'action';

export const parseEventDefinition = (definition: string): EventSettings => {
  const [type, plugin, ...params] = definition.split(/\s+/);
  return {
    type: getEventType(type),
    plugin,
    params: getEventParams(params.join(''))
  };
};

const getEventType = (type: string): EventType => {
  switch (type) {
    case 'on': return 'event';
    case 'do': return 'action';
    default: throw new Error(`Invalid event type: ${type}`);
  }
};

const getEventParams = (params: string): string[] => params.replace(/[\[\]\(\)]/g, '').split(',');

// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFilePath = '.modulo.yml';
const configFile = fs.readFileSync(path.resolve(process.cwd(), configFilePath), 'utf8');
export const config: Config = yaml.safeLoad(configFile);

// Set default values
setDefault(config, {})('plugins');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = pipe(match(/plugins\/(\w+)/), last, setDefault(config.plugins, {}));
plugins.map(setPluginDefault);
