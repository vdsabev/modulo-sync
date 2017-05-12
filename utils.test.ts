import 'jest';

import { assertNever, left, right, flowToRight, flowToLeft } from './utils';

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

describe(`flowToRight`, () => {
  const add1 = (value: number) => value + 1;
  const multiplyBy2 = (value: number) => value * 2;

  it(`should call left function, then right function`, () => {
    const result = flowToRight(add1, multiplyBy2)(0);
    expect(result).toEqual(2);
  });
});

describe(`flowToLeft`, () => {
  const add1 = (value: number) => value + 1;
  const multiplyBy2 = (value: number) => value * 2;

  it(`should call right function, then left function`, () => {
    const result = flowToLeft(add1, multiplyBy2)(0);
    expect(result).toEqual(1);
  });
});
