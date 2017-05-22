"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const partial_1 = require("./partial");
describe(`partial`, () => {
    const add = (a, b = 0, c = 0) => a + b + c;
    const append = (a, b = '', c = '') => a + b + c;
    it(`should call the function with 1 partial argument`, () => {
        const add1 = partial_1.partial(add, 1);
        expect(add1(2, 3)).toBe(6);
    });
    it(`should call the function with 2 partial arguments`, () => {
        const add1And2 = partial_1.partial(add, 1, 2);
        expect(add1And2(3)).toBe(6);
    });
    it(`should call the function with 3 partial arguments`, () => {
        const add1And2And3 = partial_1.partial(add, 1, 2, 3);
        expect(add1And2And3()).toBe(6);
    });
});
