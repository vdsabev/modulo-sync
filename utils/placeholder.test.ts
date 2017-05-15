import 'jest';

import { _, replacePlaceholderInObject, replacePlaceholderInArray } from './placeholder';

describe(`replacePlaceholderInObject`, () => {
  it(`00`, () => {
    expect(replacePlaceholderInObject({ a: 1, b: 2 }, 3)).toEqual({ a: 1, b: 2 });
  });

  it(`01`, () => {
    expect(replacePlaceholderInObject({ a: 1, b: _ }, 3)).toEqual({ a: 1, b: 3 });
  });

  it(`10`, () => {
    expect(replacePlaceholderInObject({ a: _, b: 2 }, 3)).toEqual({ a: 3, b: 2 });
  });

  it(`11`, () => {
    expect(replacePlaceholderInObject({ a: _, b: _ }, 3)).toEqual({ a: 3, b: 3 });
  });
});

describe(`replacePlaceholderInArray`, () => {
  it(`should replace array values: 000`, () => {
    expect(replacePlaceholderInArray([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it(`should replace array values: 001`, () => {
    expect(replacePlaceholderInArray([1, 2, _], [4, 5, 6])).toEqual([1, 2, 4, 5, 6]);
  });

  it(`should replace array values: 010`, () => {
    expect(replacePlaceholderInArray([1, _, 3], [4, 5, 6])).toEqual([1, 4, 3, 5, 6]);
  });

  it(`should replace array values: 011`, () => {
    expect(replacePlaceholderInArray([1, _, _], [4, 5, 6])).toEqual([1, 4, 5, 6]);
  });

  it(`should replace array values: 100`, () => {
    expect(replacePlaceholderInArray([_, 2, 3], [4, 5, 6])).toEqual([4, 2, 3, 5, 6]);
  });

  it(`should replace array values: 101`, () => {
    expect(replacePlaceholderInArray([_, 2, _], [4, 5, 6])).toEqual([4, 2, 5, 6]);
  });

  it(`should replace array values: 110`, () => {
    expect(replacePlaceholderInArray([_, _, 3], [4, 5, 6])).toEqual([4, 5, 3, 6]);
  });

  it(`should replace array values: 111`, () => {
    expect(replacePlaceholderInArray([_, _, _], [4, 5, 6])).toEqual([4, 5, 6]);
  });

  it(`should replace object values`, () => {
    expect(replacePlaceholderInArray<any>([{ a: _, b: _ }, { c: _, d: _ }, { e: _, f: _ }], [4, 5, 6])).toEqual([{ a: 4, b: 4 }, { c: 5, d: 5 }, { e: 6, f: 6 }]);
  });
});
