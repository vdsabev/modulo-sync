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
