import 'jest';

import { substitution, constant, identity, invert } from './combinator';

describe(`substitution`, () => {
  const add = (x: number) => (y: number) => x + y;
  const multiply = (x: number) => (y: number) => x * y;
  const double = (x: number) => x * 2;

  it(`should`, () => {
    expect(substitution(add)(double)(1)).toBe(3);
  });

  it(`should`, () => {
    expect(substitution(multiply)(double)(1)).toBe(2);
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

describe(`identity`, () => {
  it(`should return 1 for 1`, () => {
    expect(identity(1)).toBe(1);
  });

  it(`should return a for a`, () => {
    expect(identity('a')).toBe('a');
  });

  it(`should return itself`, () => {
    expect(identity(identity)).toBe(identity);
  });
});

describe(`invert`, () => {
  it(`should switch argument order`, () => {
    const divide = (x: number) => (y: number) => x / y;
    expect(divide(10)(5)).toBe(invert(divide)(5)(10));
  });
});
