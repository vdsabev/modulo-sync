import { constant } from './combinator';
import { compose } from './compose';

export const get = (key: string) => (obj: any) => obj[key];

export const set = (key: string) => (obj: any, value: any) => ({ ...obj, [key]: value });

export const contains = (value: any) => <T>(obj: T): boolean => {
  if (Array.isArray(obj)) return obj.indexOf(value) !== -1;
  // TODO: Rewrite using equal & get
  if (obj && typeof obj === 'object') return Object.keys(obj).find((key) => (<any>obj)[key] === value) != null;
  return false;
};

export const assertNever = (obj: never) => {
  throw new Error('Unexpected object');
};

export const equal = (value1: any) => (value2: any) => value1 === value2;

export const type = (value: any) => typeof value;

export const is = (typeToCompare: string) => compose(equal(typeToCompare), type);

export const result = <T>(value: T | ((...args: any[]) => T), ...args: any[]): T => typeof value === 'function' ? value(...args) : value;
