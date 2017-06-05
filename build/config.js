"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const yaml = require("js-yaml");
const utils_1 = require("./utils");
exports.parseWatchContent = (imports) => {
    const isImported = utils_1.isContained(imports);
    return (content) => {
        const [plugin, path] = content.split(/\s+/);
        if (!isImported(plugin))
            throw new Error(`You must import a plugin before you can use it: ${plugin}`);
        return { plugin, path: path.replace(/(^['"]|['"]$)/g, '') };
    };
};
exports.parseEventDefinition = utils_1.pipe(utils_1.replace(/(^on\s*|[\[\]\(\)])/g, ''), utils_1.split(/\s*,\s*/));
exports.parseEventContent = (imports) => {
    const isImported = utils_1.isContained(imports);
    return (content) => {
        // TODO: Support << for compose
        return content.split(/\s*>>\s*/).map((pipe) => {
            const [fnDefinition, ...args] = pipe.split(/\s+/);
            const [plugin, method] = fnDefinition.split('.');
            return {
                plugin,
                method,
                args: args.map(removeCommas)
            };
        });
    };
};
const removeCommas = utils_1.replace(/(^\s*,\s*|\s*,\s*$)/g, '');
// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFilePath = '.modulo.yml';
const configFile = fs.readFileSync(path.resolve(process.cwd(), configFilePath), 'utf8');
exports.config = yaml.safeLoad(configFile);
// Set default values
utils_1.setDefault(exports.config, {})('config');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = utils_1.pipe(utils_1.match(/plugins\/(\w+)/), utils_1.last, utils_1.setDefault(exports.config.config, {}));
plugins.map(setPluginDefault);
