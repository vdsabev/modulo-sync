import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { match, last, setDefault, compose } from './utils';

interface Config {
  plugins: Record<ModuloPluginType, Record<string, string>>;
  events: ConfigEvent[];
}

export interface ConfigEvent {
  for: ConfigPluginRecord;
  do: ConfigPluginRecord;
}

type ConfigPluginRecord = Record<ModuloPluginType, string | string[]>;

// TODO: Handle readFileSync exception
// TODO: Set default values
// TODO: Handle null references
// TODO: Validate config
const configFilePath = '.modulo.yml';
const configFile = fs.readFileSync(path.resolve(process.cwd(), configFilePath), 'utf8');
export const config: Config = yaml.safeLoad(configFile);

setDefault(config, {})('plugins');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const getPluginType = compose(last, match(/plugins\/(\w+)/));
const setPluginDefault = compose(setDefault(config.plugins, {}), getPluginType);
plugins.map(setPluginDefault);
