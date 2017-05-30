"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.pattern = (path, separator = '/') => {
    const pathFragments = path.split(separator);
    const pathMatches = path.match(/:\w+/g) || [];
    const isAMatch = utils_1.isContained(pathMatches);
    return {
        replace(data) {
            if (typeof data === 'string')
                return path.replace(/:\w+/g, data);
            const getFragment = utils_1.ternary(utils_1.cap(isAMatch), getDataByFragment(data), utils_1.identity);
            const replace = utils_1.pipe(utils_1.map(getFragment), utils_1.join(separator));
            return replace(pathFragments);
        },
        extract(replacedPath) {
            const data = {};
            replacedPath.split(separator).map((replacedFragment, index) => {
                const originalFragment = pathFragments[index];
                if (isAMatch(originalFragment)) {
                    data[normalizeFragment(originalFragment)] = replacedFragment;
                }
            });
            return data;
        }
    };
};
const getDataByFragment = (data) => (fragment) => data[fragment.replace(':', '')] || '';
const normalizeFragment = (fragment) => fragment.replace(':', '');
