import 'jest';

import { assertNever, left, right, flowRight, flowLeft, invoke } from './utils';

describe(`assertNever`, () => {
  it(`should throw an error when called`, () => {
    expect(assertNever).toThrowError(`Unexpected object`);
  });

  it(`should not throw an error when not called`, () => {
    expect(() => {
      const x = 0;
      if (typeof x === 'string') {
        assertNever(x);
      }
    }).not.toThrowError();
  });
});

describe(`left`, () => {
  const l = jest.fn();
  const r = jest.fn();

  it(`should call left function when value is true`, () => {
    left(l, r)(true);
    expect(l).toHaveBeenCalledWith(true);
  });

  it(`should call right function when value is false`, () => {
    left(l, r)(false);
    expect(r).toHaveBeenCalledWith(false);
  });
});

describe(`right`, () => {
  const l = jest.fn();
  const r = jest.fn();

  it(`should call right function when value is true`, () => {
    right(l, r)(true);
    expect(r).toHaveBeenCalledWith(true);
  });

  it(`should call left function when value is false`, () => {
    right(l, r)(false);
    expect(l).toHaveBeenCalledWith(false);
  });
});

describe(`flowRight`, () => {
  const add1 = (value: number) => value + 1;
  const multiplyBy2 = (value: number) => value * 2;

  it(`should call left function, then right function`, () => {
    const result = flowRight(add1, multiplyBy2)(0);
    expect(result).toBe(2);
  });
});

describe(`flowLeft`, () => {
  const add1 = (value: number) => value + 1;
  const multiplyBy2 = (value: number) => value * 2;

  it(`should call right function, then left function`, () => {
    const result = flowLeft(add1, multiplyBy2)(0);
    expect(result).toBe(1);
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
