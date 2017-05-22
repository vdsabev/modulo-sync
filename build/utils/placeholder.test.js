"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const placeholder_1 = require("./placeholder");
describe(`isPlaceholder`, () => {
    it(`should return true for _`, () => {
        expect(placeholder_1.isPlaceholder(placeholder_1._)).toBe(true);
    });
    it(`should return false for anything else`, () => {
        expect(placeholder_1.isPlaceholder({ type: 'placeholder' })).toBe(false);
    });
});
describe(`hasPlaceholder`, () => {
    it(`should return true if array contains placeholder`, () => {
        expect(placeholder_1.hasPlaceholder([1, placeholder_1._, 3])).toBe(true);
    });
    it(`should return true if array only contains placeholders`, () => {
        expect(placeholder_1.hasPlaceholder([placeholder_1._, placeholder_1._])).toBe(true);
    });
    it(`should return false if array doesn't contain placeholder`, () => {
        expect(placeholder_1.hasPlaceholder([1, 2, 3])).toBe(false);
    });
    it(`should return true if object contains placeholder`, () => {
        expect(placeholder_1.hasPlaceholder({ a: 1, b: placeholder_1._, c: 3 })).toBe(true);
    });
    it(`should return true if object only contains placeholders`, () => {
        expect(placeholder_1.hasPlaceholder({ a: placeholder_1._, b: placeholder_1._ })).toBe(true);
    });
    it(`should return false if object doesn't contain placeholder`, () => {
        expect(placeholder_1.hasPlaceholder({ a: 1, b: 2, c: 3 })).toBe(false);
    });
});
describe(`replacePlaceholderInObject`, () => {
    it(`00`, () => {
        expect(placeholder_1.replacePlaceholderInObject({ a: 1, b: 2 }, 3)).toEqual({ a: 1, b: 2 });
    });
    it(`01`, () => {
        expect(placeholder_1.replacePlaceholderInObject({ a: 1, b: placeholder_1._ }, 3)).toEqual({ a: 1, b: 3 });
    });
    it(`10`, () => {
        expect(placeholder_1.replacePlaceholderInObject({ a: placeholder_1._, b: 2 }, 3)).toEqual({ a: 3, b: 2 });
    });
    it(`11`, () => {
        expect(placeholder_1.replacePlaceholderInObject({ a: placeholder_1._, b: placeholder_1._ }, 3)).toEqual({ a: 3, b: 3 });
    });
});
describe(`replacePlaceholderInArray`, () => {
    it(`should replace array values: 000`, () => {
        expect(placeholder_1.replacePlaceholderInArray([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it(`should replace array values: 001`, () => {
        expect(placeholder_1.replacePlaceholderInArray([1, 2, placeholder_1._], [4, 5, 6])).toEqual([1, 2, 4, 5, 6]);
    });
    it(`should replace array values: 010`, () => {
        expect(placeholder_1.replacePlaceholderInArray([1, placeholder_1._, 3], [4, 5, 6])).toEqual([1, 4, 3, 5, 6]);
    });
    it(`should replace array values: 011`, () => {
        expect(placeholder_1.replacePlaceholderInArray([1, placeholder_1._, placeholder_1._], [4, 5, 6])).toEqual([1, 4, 5, 6]);
    });
    it(`should replace array values: 100`, () => {
        expect(placeholder_1.replacePlaceholderInArray([placeholder_1._, 2, 3], [4, 5, 6])).toEqual([4, 2, 3, 5, 6]);
    });
    it(`should replace array values: 101`, () => {
        expect(placeholder_1.replacePlaceholderInArray([placeholder_1._, 2, placeholder_1._], [4, 5, 6])).toEqual([4, 2, 5, 6]);
    });
    it(`should replace array values: 110`, () => {
        expect(placeholder_1.replacePlaceholderInArray([placeholder_1._, placeholder_1._, 3], [4, 5, 6])).toEqual([4, 5, 3, 6]);
    });
    it(`should replace array values: 111`, () => {
        expect(placeholder_1.replacePlaceholderInArray([placeholder_1._, placeholder_1._, placeholder_1._], [4, 5, 6])).toEqual([4, 5, 6]);
    });
    it(`should replace object values`, () => {
        const array = placeholder_1.replacePlaceholderInArray([{ a: placeholder_1._, b: placeholder_1._ }, { a: placeholder_1._, c: placeholder_1._ }, { b: placeholder_1._, c: placeholder_1._ }], [4, 5, 6]);
        expect(array).toEqual([{ a: 4, b: 4 }, { a: 5, c: 5 }, { b: 6, c: 6 }]);
    });
});
