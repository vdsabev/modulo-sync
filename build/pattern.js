"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compote_fp_1 = require("compote-fp");
exports.pattern = (path, separator = '/') => {
    const pathFragments = path.split(separator);
    const pathMatches = path.match(/:\w+/g) || [];
    const isAMatch = compote_fp_1.isContained(pathMatches);
    return {
        replace(data) {
            if (typeof data === 'string')
                return path.replace(/:\w+/g, data);
            const getFragment = compote_fp_1.ternary(compote_fp_1.cap(isAMatch), getDataByFragment(data), compote_fp_1.identity);
            const replace = compote_fp_1.pipe(compote_fp_1.map(getFragment), compote_fp_1.join(separator));
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
