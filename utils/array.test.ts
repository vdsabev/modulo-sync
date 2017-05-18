import 'jest';

import { map, first, last } from './array';

describe(`map`, () => {
  it(`should create a function`, () => {
    const double = map((x: number) => x * 2);
    expect(double([1, 2, 3])).toEqual([2, 4, 6]);
  });
});

describe(`first`, () => {
  it(`should return first array item when multiple items`, () => {
    expect(first([1, 2, 3])).toBe(1);
  });

  it(`should return first array item when single item`, () => {
    expect(first([1])).toBe(1);
  });

  it(`should return undefined when no items`, () => {
    expect(first([])).toBe(undefined);
  });

  it(`should return undefined when null`, () => {
    expect(first(null)).toBe(undefined);
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
