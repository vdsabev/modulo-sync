"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const yaml = require("js-yaml");
const utils_1 = require("./utils");
// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFilePath = '.modulo.yml';
const configFile = fs.readFileSync(path.resolve(process.cwd(), configFilePath), 'utf8');
exports.config = yaml.safeLoad(configFile);
// Set default values
utils_1.setDefault(exports.config, {})('plugins');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = utils_1.pipe(utils_1.match(/plugins\/(\w+)/), utils_1.last, utils_1.setDefault(exports.config.plugins, {}));
plugins.map(setPluginDefault);
