import { isContained, pipe, replace, split, match, last, setDefault, map } from 'compote-fp';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface Config {
  import: ConfigImport[];
  config: Record<string, Record<string, string>>;
  events: ConfigEvent[];
}

export type ConfigImport = string | Record<string, string>;

export interface ConfigEvent {
  watch: string;
  [key: string]: string;
}

interface ParsedFunction {
  plugin: string;
  method: string;
  args: any[];
}

export const parseWatchContent = (imports: ConfigImport[]) => {
  const isImported = isContained(imports);
  return (content: string) => {
    const [plugin, path] = content.split(/\s+/);
    if (!isImported(plugin)) throw new Error(`You must import a plugin before you can use it: ${plugin}`);

    return { plugin, path: path.replace(/(^['"]|['"]$)/g, '') };
  };
};

export const parseEventDefinition: (definition: string) => string[] = pipe(replace(/(^on\s*|[\[\]\(\)])/g, ''), split(/\s*,\s*/));

export const parseEventContent = (imports: ConfigImport[]) => {
  const isImported = isContained(imports);

  return <(expressions: string) => ParsedFunction[]>pipe(split(/\s*>>\s*/), map((expression: string) => {
    const [fnDefinition, ...args] = expression.split(/\s+/);
    const [plugin, method] = fnDefinition.split('.');
    return <ParsedFunction>{
      plugin,
      method,
      args: args.map(removeCommas).map((arg: string) => {
        const [argPlugin, argMethod] = arg.split('.');
        if (isImported(argPlugin)) {
          return <ParsedFunction>{
            plugin: argPlugin,
            method: argMethod,
            args: []
          };
        }
        return arg;
      })
    };
  }));
};

const removeCommas = replace(/(^\s*,\s*|\s*,\s*$)/g, '');

// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFilePath = '.modulo.yml';
const configFile = fs.readFileSync(path.resolve(process.cwd(), configFilePath), 'utf8');
export const config: Config = yaml.safeLoad(configFile);

// Set default values
setDefault(config, {})('config');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = pipe(match(/plugins\/(\w+)/), last, setDefault(config.config, {}));
plugins.map(setPluginDefault);
