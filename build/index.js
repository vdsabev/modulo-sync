"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const compote_fp_1 = require("compote-fp");
const config_1 = require("./config");
const logger_1 = require("./logger");
const pattern_1 = require("./pattern");
const parseWatchContentWithImports = config_1.parseWatchContent(config_1.config.import);
const parseEventContentWithImports = config_1.parseEventContent(config_1.config.import);
const getPluginName = (pluginName) => {
    const containsPlugin = compote_fp_1.contains(pluginName);
    if (containsPlugin(config_1.config.import))
        return pluginName;
    // ternary(is('string'), identity, compose(first, values));
    for (const importDefinition of config_1.config.import.filter(compote_fp_1.is('object'))) {
        if (containsPlugin(compote_fp_1.keys(importDefinition)))
            return importDefinition[pluginName];
    }
    throw new Error(`Unknown import: ${pluginName}`);
};
// TODO: If no events found in config, log a warning message before exiting
// TODO: Support path arrays
config_1.config.events.map((configEvent) => {
    if (!configEvent.watch)
        return logger_1.logger.error(`Invalid config event: watch missing in ${JSON.stringify(configEvent, null, 2)}`);
    const watch = parseWatchContentWithImports(configEvent.watch);
    const { plugin: watchPlugin } = require(`./plugins/${watch.plugin}`);
    compote_fp_1.keys(configEvent).map((definition) => {
        if (definition === 'watch')
            return;
        const events = config_1.parseEventDefinition(definition);
        const fns = parseEventContentWithImports(configEvent[definition]);
        watchPlugin.on(events, pattern_1.pattern(watch.path), (path) => __awaiter(this, void 0, void 0, function* () {
            let arg = path;
            for (const fn of fns) {
                console.log(`do ${fn.plugin}.${fn.method}(${[arg, ...fn.args].map(stringify).join(', ')})`);
                // TODO: Make sure the require is non-blocking on subsequent requests; use cache if it is
                const fnModule = require(`./plugins/${getPluginName(fn.plugin)}`);
                if (fnModule.plugin && fnModule.plugin.do) {
                    arg = yield fnModule.plugin.do(fn.method, arg, ...fn.args).catch(logger_1.logger.error);
                }
                else {
                    arg = fnModule[fn.method](...fn.args)(arg);
                }
            }
        }));
    });
});
// `JSON.stringify` returns `undefined` for anonymous functions, but `toString` works fine
const stringify = (s) => JSON.stringify(s) || s && s.toString();
