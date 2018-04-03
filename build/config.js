"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compote_fp_1 = require("compote-fp");
const glob = require("glob");
exports.parseEventDefinition = compote_fp_1.pipe(compote_fp_1.replace(/(^on\s*|[\[\]\(\)])/g, ''), compote_fp_1.split(/\s*,\s*/));
// TODO: Handle readFileSync exception
// TODO: Handle null references
// TODO: Validate config
const configFactoryPath = './modulo.config';
const configFactory = require(configFactoryPath);
exports.config = configFactory();
// Set default values
compote_fp_1.setDefault(exports.config, {})('options');
const plugins = glob.sync('plugins/!(*.d|*.test).ts');
const setPluginDefault = compote_fp_1.pipe(compote_fp_1.match(/plugins\/(\w+)/), compote_fp_1.last, compote_fp_1.setDefault(exports.config.options, {}));
plugins.map(setPluginDefault);
