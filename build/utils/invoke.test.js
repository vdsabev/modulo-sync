"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const invoke_1 = require("./invoke");
describe(`invoke`, () => {
    it(`should return a function`, () => {
        expect(typeof invoke_1.invoke('a')).toBe('function');
    });
    it(`should invoke the function by name when called`, () => {
        const pop = invoke_1.invoke('pop');
        const array = [1, 2, 3];
        expect(pop(array)).toBe(3);
    });
    it(`should invoke the function with multiple arguments`, () => {
        const getWithoutFirstAndLast = invoke_1.invoke('slice', 1, -1);
        const array = [1, 2, 3, 4, 5];
        expect(getWithoutFirstAndLast(array)).toEqual([2, 3, 4]);
    });
});
