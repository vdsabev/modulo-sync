"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compote_fp_1 = require("compote-fp");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const yaml = require("js-yaml");
exports.parseWatchContent = (imports) => {
    const isImported = compote_fp_1.isContained(imports);
    return (content) => {
        const [plugin, path] = content.split(/\s+/);
        if (!isImported(plugin))
            throw new Error(`You must import a plugin before you can use it: ${plugin}`);
        return { plugin, path: path.replace(/(^['"]|['"]$)/g, '') };
    };
};
exports.parseEventDefinition = compote_fp_1.pipe(compote_fp_1.replace(/(^on\s*|[\[\]\(\)])/g, ''), compote_fp_1.split(/\s*,\s*/));
exports.parseEventContent = (imports) => {
    const isImported = compote_fp_1.isContained(imports);
    return compote_fp_1.pipe(compote_fp_1.split(/\s*>>\s*/), compote_fp_1.map((expression) => {
        const [fnDefinition, ...args] = expression.split(/\s+/);
        const [plugin, method] = fnDefinition.split('.');
        return {
            plugin,
            method,
            args: args.map(removeCommas).map((arg) => {
                const [argPlugin, argMethod] = arg.split('.');
                if (isImported(argPlugin)) {
                    return {
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
const removeCommas = compote_fp_1.replace(/(^\s*,\s*|\s*,\s*$)/g, '');
// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFilePath = '.modulo.yml';
const configFile = fs.readFileSync(path.resolve(process.cwd(), configFilePath), 'utf8');
exports.config = yaml.safeLoad(configFile);
// Set default values
compote_fp_1.setDefault(exports.config, {})('config');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = compote_fp_1.pipe(compote_fp_1.match(/plugins\/(\w+)/), compote_fp_1.last, compote_fp_1.setDefault(exports.config.config, {}));
plugins.map(setPluginDefault);
