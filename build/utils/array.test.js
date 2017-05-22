"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const array_1 = require("./array");
describe(`createArray`, () => {
    it(`should return an array`, () => {
        expect(array_1.createArray(1, 2, 3)).toEqual([1, 2, 3]);
    });
});
describe(`arrayize`, () => {
    it(`should wrap value in an array`, () => {
        expect(array_1.arrayize(1)).toEqual([1]);
    });
    it(`should not wrap value if already an array`, () => {
        const array = [1];
        expect(array_1.arrayize(array)).toBe(array);
    });
});
describe(`map`, () => {
    it(`should create a function`, () => {
        const double = array_1.map((x) => x * 2);
        expect(double([1, 2, 3])).toEqual([2, 4, 6]);
    });
});
describe(`first`, () => {
    it(`should return first array item when multiple items`, () => {
        expect(array_1.first([1, 2, 3])).toBe(1);
    });
    it(`should return first array item when single item`, () => {
        expect(array_1.first([1])).toBe(1);
    });
    it(`should return undefined when no items`, () => {
        expect(array_1.first([])).toBe(undefined);
    });
    it(`should return undefined when null`, () => {
        expect(array_1.first(null)).toBe(undefined);
    });
});
describe(`last`, () => {
    it(`should return last array item when multiple items`, () => {
        expect(array_1.last([1, 2, 3])).toBe(3);
    });
    it(`should return last array item when single item`, () => {
        expect(array_1.last([1])).toBe(1);
    });
    it(`should return undefined when no items`, () => {
        expect(array_1.last([])).toBe(undefined);
    });
    it(`should return undefined when null`, () => {
        expect(array_1.last(null)).toBe(undefined);
    });
});
