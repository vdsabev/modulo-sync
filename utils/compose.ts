import { last } from './array';

export const sequence = (...fns: Function[]) => (...args: any[]) => last(fns.map((fn) => fn(...args)));
export const pipe = (l: Function, r: Function) => (...args: any[]) => r(l(...args));
export const compose = (l: Function, r: Function) => (...args: any[]) => l(r(...args));
