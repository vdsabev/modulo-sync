import { last } from './array';
import { replacePlaceholderInArray } from './placeholder';

export const left = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? l(value, ...args) : r(value, ...args);
export const right = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? r(value, ...args) : l(value, ...args);

export const invoke = (fnName: string, ...args: any[]) => (obj: any) => obj[fnName](...args);

export const sequence = (...fns: Function[]) => (...x: any[]) => last(fns.map((fn) => fn(...x)));

export const partial = (fn: Function, ...partialArgs: any[]) => (...otherArgs: any[]) => fn(...replacePlaceholderInArray(partialArgs, otherArgs));

export const promisify = (fn: Function) => (...args: any[]) => new Promise(
  (resolve: Function, reject: Function) => {
    fn(...args, (error: any, result: any) => {
      if (error) return reject(error);
      resolve(result);
    });
  }
);
