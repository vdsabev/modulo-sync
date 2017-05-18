import 'jest';

import { left, right, invoke, sequence, partial, promisify } from './function';

describe(`left`, () => {
  it(`should call left function with rest arguments when value is true`, () => {
    const l = jest.fn(); const r = jest.fn();
    left(l, r)(true, 'a', 'b');
    expect(l).toHaveBeenLastCalledWith(true, 'a', 'b');
    expect(r).not.toHaveBeenCalled();
  });

  it(`should call right function with rest arguments when value is false`, () => {
    const l = jest.fn(); const r = jest.fn();
    left(l, r)(false, 'a', 'b');
    expect(l).not.toHaveBeenCalled();
    expect(r).toHaveBeenLastCalledWith(false, 'a', 'b');
  });
});

describe(`right`, () => {
  it(`should call right function with rest arguments when value is true`, () => {
    const l = jest.fn(); const r = jest.fn();
    right(l, r)(true, 'a', 'b');
    expect(l).not.toHaveBeenCalled();
    expect(r).toHaveBeenLastCalledWith(true, 'a', 'b');
  });

  it(`should call left function with rest arguments when value is false`, () => {
    const l = jest.fn(); const r = jest.fn();
    right(l, r)(false, 'a', 'b');
    expect(l).toHaveBeenLastCalledWith(false, 'a', 'b');
    expect(r).not.toHaveBeenCalled();
  });
});

describe(`invoke`, () => {
  it(`should return a function`, () => {
    expect(typeof invoke('a')).toBe('function');
  });

  it(`should invoke the function by name when called`, () => {
    const pop = invoke('pop');
    const array = [1, 2, 3];
    expect(pop(array)).toBe(3);
  });

  it(`should invoke the function with multiple arguments`, () => {
    const getWithoutFirstAndLast = invoke('slice', 1, -1);
    const array = [1, 2, 3, 4, 5];
    expect(getWithoutFirstAndLast(array)).toEqual([2, 3, 4]);
  });
});

describe(`sequence`, () => {
  const double = (n: number) => n * 2;
  const tripple = (n: number) => n * 3;
  const quadrupple = (n: number) => n * 4;

  it(`should execute 1 function`, () => {
    expect(sequence(double)(2)).toBe(4);
  });

  it(`should execute 2 functions and return last result`, () => {
    expect(sequence(double, tripple)(2)).toBe(6);
  });

  it(`should execute 3 functions and return last result`, () => {
    expect(sequence(double, tripple, quadrupple)(2)).toBe(8);
  });
});

describe(`partial`, () => {
  const add = (a: number, b = 0, c = 0) => a + b + c;
  const append = (a: string, b = '', c = '') => a + b + c;

  it(`should call the function with 1 partial argument`, () => {
    const add1 = partial(add, 1);
    expect(add1(2, 3)).toBe(6);
  });

  it(`should call the function with 2 partial arguments`, () => {
    const add1And2 = partial(add, 1, 2);
    expect(add1And2(3)).toBe(6);
  });

  it(`should call the function with 3 partial arguments`, () => {
    const add1And2And3 = partial(add, 1, 2, 3);
    expect(add1And2And3()).toBe(6);
  });
});

describe(`promisify`, () => {
  const asyncDiv = (a: number, b: number, callback: Function) => {
    if (!b) return callback('Division by 0!');
    callback(null, a / b);
  };

  it(`should return a function`, () => {
    const fn = jest.fn();
    const promisifiedFn = promisify(fn);
    expect(typeof promisifiedFn).toBe('function');
  });

  it(`should return a promise when called`, () => {
    const fn = jest.fn();
    const promisifiedFn = promisify(fn);
    expect(promisifiedFn()).toBeInstanceOf(Promise);
  });

  it(`should resolve promise`, async () => {
    const promisifiedDiv = promisify(asyncDiv);
    const errorHandler = jest.fn();
    expect(await promisifiedDiv(2, 2).catch(errorHandler)).toBe(1);
    expect(errorHandler).not.toHaveBeenCalled();
  });

  it(`should reject promise`, async () => {
    const promisifiedDiv = promisify(asyncDiv);
    const errorHandler = jest.fn();
    expect(await promisifiedDiv(2, 0).catch(errorHandler)).toBe(undefined);
    expect(errorHandler).toHaveBeenLastCalledWith('Division by 0!');
  });
});
