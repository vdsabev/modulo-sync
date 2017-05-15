import 'jest';

import { sequence, pipe, compose } from './compose';

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

describe(`pipe`, () => {
  const add1 = (value: number) => value + 1;
  const multiplyBy2 = (value: number) => value * 2;

  it(`should call left function, then right function`, () => {
    const result = pipe(add1, multiplyBy2)(0);
    expect(result).toBe(2);
  });
});

describe(`compose`, () => {
  const add1 = (value: number) => value + 1;
  const multiplyBy2 = (value: number) => value * 2;

  it(`should call right function, then left function`, () => {
    const result = compose(add1, multiplyBy2)(0);
    expect(result).toBe(1);
  });
});
