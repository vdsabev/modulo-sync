"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const string_1 = require("./string");
describe(`match`, () => {
    it(`should match string to regex`, () => {
        expect(string_1.match(/a/)('abc')[0]).toBe('a');
    });
});
