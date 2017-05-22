"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const combinator_1 = require("./combinator");
const utils_1 = require("./utils");
describe(`substitution`, () => {
    const add = (x) => (y) => x + y;
    const multiply = (x) => (y) => x * y;
    const double = (x) => x * 2;
    it(`should`, () => {
        expect(combinator_1.substitution(add)(double)(1)).toBe(3);
    });
    it(`should`, () => {
        expect(combinator_1.substitution(multiply)(double)(1)).toBe(2);
    });
});
describe(`constant`, () => {
    it(`should return a function`, () => {
        expect(typeof combinator_1.constant('a')).toBe('function');
    });
    it(`should return the value passed when called`, () => {
        expect(combinator_1.constant('a')()).toBe('a');
    });
});
describe(`identity`, () => {
    it(`should return 1 for 1`, () => {
        expect(combinator_1.identity(1)).toBe(1);
    });
    it(`should return a for a`, () => {
        expect(combinator_1.identity('a')).toBe('a');
    });
    it(`should return itself`, () => {
        expect(combinator_1.identity(combinator_1.identity)).toBe(combinator_1.identity);
    });
});
describe(`pipe`, () => {
    const add1 = (value) => value + 1;
    const multiplyBy2 = (value) => value * 2;
    it(`should call left function, then right function`, () => {
        const result = combinator_1.pipe(add1, multiplyBy2)(0);
        expect(result).toBe(2);
    });
    it(`should call left function, then right function`, () => {
        const result = combinator_1.pipe(add1, multiplyBy2, add1, multiplyBy2)(0);
        expect(result).toBe(6);
    });
});
describe(`compose`, () => {
    const add1 = (value) => value + 1;
    const multiplyBy2 = (value) => value * 2;
    it(`should call right function, then left function`, () => {
        const result = combinator_1.compose(add1, multiplyBy2)(0);
        expect(result).toBe(1);
    });
    it(`should compose more than 2 functions`, () => {
        const result = combinator_1.compose(add1, multiplyBy2, add1, multiplyBy2)(0);
        expect(result).toBe(3);
    });
});
describe(`invert`, () => {
    it(`should switch argument order`, () => {
        const divide = (x) => (y) => x / y;
        expect(divide(10)(5)).toBe(combinator_1.invert(divide)(5)(10));
    });
});
describe(`not`, () => {
    const notEqual = combinator_1.compose(combinator_1.not, utils_1.equal);
    it(`should return the opposite result`, () => {
        expect(notEqual(1)(2)).toBe(true);
    });
    it(`should return the opposite result`, () => {
        expect(notEqual(1)(1)).toBe(false);
    });
});
