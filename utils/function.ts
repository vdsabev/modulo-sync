import { last } from './array';

export const left = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? l(value, ...args) : r(value, ...args);
export const right = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? r(value, ...args) : l(value, ...args);

export const sequence = (...fns: Function[]) => (...args: any[]) => last(fns.map((fn) => fn(...args)));

export const promisify = (fn: Function) => (...args: any[]) => new Promise(
  (resolve: Function, reject: Function) => {
    fn(...args, (error: any, result: any) => {
      if (error) return reject(error);
      resolve(result);
    });
  }
);
