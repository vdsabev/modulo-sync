import 'jest';

import { get, set, keys, values, setDefault } from './object';

describe(`get`, () => {
  it(`should create a function that gets property`, () => {
    const getName = get('name');
    expect(typeof getName).toBe('function');
    expect(getName({ id: 0, name: 'a' })).toBe('a');
  });
});

describe(`set`, () => {
  it(`should create a function that sets property`, () => {
    const setName = set('name');
    expect(typeof setName).toBe('function');
    const userA = { id: 0, name: 'a' };
    const userB = setName(userA, 'b');
    expect(userB.name).toBe('b');
    expect(userB).not.toBe(userA);
  });
});

describe(`keys`, () => {
  it(`should be Object.keys`, () => {
    expect(keys).toBe(Object.keys);
  });
});

describe(`values`, () => {
  it(`should return object values`, () => {
    expect(values({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3]);
  });
});

describe(`setDefault`, () => {
  it(`should not change object value if defined`, () => {
    const oldValue = { a: 1 };
    const obj = { value: oldValue };
    const newValue = { b: 2 };
    setDefault(obj, newValue)('value');
    expect(obj.value).toBe(oldValue);
  });

  it(`should change object value if null`, () => {
    const oldValue = null;
    const obj = { value: oldValue };
    const newValue = { b: 2 };
    setDefault(obj, newValue)('value');
    expect(obj.value).toBe(newValue);
  });
});
