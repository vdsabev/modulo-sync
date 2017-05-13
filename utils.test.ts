import 'jest';

import { assertNever, promisify, left, right, flowRight, flowLeft, invoke, constant, partial, last } from './utils';

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

describe(`promisify`, () => {
  const asyncDiv = (a: number, b: number, next: Function) => {
    if (!b) return next('Division by 0!');
    next(null, a / b);
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

describe(`left`, () => {
  it(`should call left function when value is true`, () => {
    const l = jest.fn(); const r = jest.fn();
    left(l, r)(true);
    expect(l).toHaveBeenLastCalledWith(true);
    expect(r).not.toHaveBeenCalled();
  });

  it(`should call left function with rest arguments`, () => {
    const l = jest.fn(); const r = jest.fn();
    left(l, r)('a', 'b', 'c');
    expect(l).toHaveBeenLastCalledWith('a', 'b', 'c');
    expect(r).not.toHaveBeenCalled();
  });

  it(`should call right function when value is false`, () => {
    const l = jest.fn(); const r = jest.fn();
    left(l, r)(false);
    expect(l).not.toHaveBeenCalled();
    expect(r).toHaveBeenLastCalledWith(false);
  });

  it(`should call right function with rest arguments`, () => {
    const l = jest.fn(); const r = jest.fn();
    left(l, r)(null, 'b', 'c');
    expect(l).not.toHaveBeenCalled();
    expect(r).toHaveBeenLastCalledWith(null, 'b', 'c');
  });
});

describe(`right`, () => {
  const l = jest.fn();
  const r = jest.fn();

  it(`should call right function when value is true`, () => {
    right(l, r)(true);
    expect(r).toHaveBeenLastCalledWith(true);
  });

  it(`should call left function when value is false`, () => {
    right(l, r)(false);
    expect(l).toHaveBeenLastCalledWith(false);
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

describe(`constant`, () => {
  it(`should return a function`, () => {
    expect(typeof constant('a')).toBe('function');
  });

  it(`should return the value passed when called`, () => {
    expect(constant('a')()).toBe('a');
  });
});

describe(`partial`, () => {
  const add = (a: number, b = 0, c = 0) => a + b + c;

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

describe(`last`, () => {
  it(`should return last array item when multiple items`, () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it(`should return last array item when single item`, () => {
    expect(last([1])).toBe(1);
  });

  it(`should return undefined when no items`, () => {
    expect(last([])).toBe(undefined);
  });

  it(`should return undefined when null`, () => {
    expect(last(null)).toBe(undefined);
  });
});
