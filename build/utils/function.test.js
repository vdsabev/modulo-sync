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
require("jest");
const utils_1 = require("./utils");
const function_1 = require("./function");
describe(`cap`, () => {
    const isDigit = utils_1.isContained([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    it(`should set 1 argument by default`, () => {
        const isDigitFirst = function_1.cap(isDigit);
        expect(isDigitFirst(1, 2, 3)).toEqual(true);
        expect(isDigitFirst(1, 2, 30)).toEqual(true);
        expect(isDigitFirst(1, 20, 30)).toEqual(true);
        expect(isDigitFirst(10, 20, 30)).toEqual(false);
    });
    it(`should allow setting 2 arguments`, () => {
        const isDigitFirst2 = function_1.cap(isDigit, 2);
        expect(isDigitFirst2(1, 2, 3)).toEqual(true);
        expect(isDigitFirst2(1, 2, 30)).toEqual(true);
        expect(isDigitFirst2(1, 20, 30)).toEqual(false);
        expect(isDigitFirst2(10, 20, 30)).toEqual(false);
    });
    it(`should allow setting more than the total number of passed arguments`, () => {
        const isDigitFirst10 = function_1.cap(isDigit, 10);
        expect(isDigitFirst10(1, 2, 3)).toEqual(true);
        expect(isDigitFirst10(1, 2, 30)).toEqual(false);
        expect(isDigitFirst10(1, 20, 30)).toEqual(false);
        expect(isDigitFirst10(10, 20, 30)).toEqual(false);
    });
});
describe(`sequence`, () => {
    const double = (n) => n * 2;
    const tripple = (n) => n * 3;
    const quadrupple = (n) => n * 4;
    it(`should execute 1 function`, () => {
        expect(function_1.sequence(double)(2)).toBe(4);
    });
    it(`should execute 2 functions and return last result`, () => {
        expect(function_1.sequence(double, tripple)(2)).toBe(6);
    });
    it(`should execute 3 functions and return last result`, () => {
        expect(function_1.sequence(double, tripple, quadrupple)(2)).toBe(8);
    });
});
describe(`promisify`, () => {
    const asyncDiv = (a, b, callback) => {
        if (!b)
            return callback('Division by 0!');
        callback(null, a / b);
    };
    it(`should return a function`, () => {
        const fn = jest.fn();
        const promisifiedFn = function_1.promisify(fn);
        expect(typeof promisifiedFn).toBe('function');
    });
    it(`should return a promise when called`, () => {
        const fn = jest.fn();
        const promisifiedFn = function_1.promisify(fn);
        expect(promisifiedFn()).toBeInstanceOf(Promise);
    });
    it(`should resolve promise`, () => __awaiter(this, void 0, void 0, function* () {
        const promisifiedDiv = function_1.promisify(asyncDiv);
        const errorHandler = jest.fn();
        expect(yield promisifiedDiv(2, 2).catch(errorHandler)).toBe(1);
        expect(errorHandler).not.toHaveBeenCalled();
    }));
    it(`should reject promise`, () => __awaiter(this, void 0, void 0, function* () {
        const promisifiedDiv = function_1.promisify(asyncDiv);
        const errorHandler = jest.fn();
        expect(yield promisifiedDiv(2, 0).catch(errorHandler)).toBe(undefined);
        expect(errorHandler).toHaveBeenLastCalledWith('Division by 0!');
    }));
});
