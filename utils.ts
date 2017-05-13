export const _ = {}; // Placeholder

export const replacePlaceholder = (arr1: any[], arr2: any[]): any[] => {
  const arr2Copy = arr2.slice();
  const arr1Replaced = arr1.map((item, index) => item === _ ? arr2Copy.shift() : item);
  return arr1Replaced.concat(arr2Copy);
};

export const assertNever = (obj: never) => {
  throw new Error('Unexpected object');
};

export const promisify = (fn: Function) => (...args: any[]) => new Promise(
  (resolve: Function, reject: Function) => {
    fn(...args, (error: any, ...resultArgs: any[]) => {
      if (error) return reject(error);
      resolve(...resultArgs);
    });
  }
);

export const left = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? l(value, ...args) : r(value, ...args);
export const right = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? r(value, ...args) : l(value, ...args);

export const pipe = (l: Function, r: Function) => (...args: any[]) => r(l(...args));
export const compose = (l: Function, r: Function) => (...args: any[]) => l(r(...args));
export const sequence = (...fns: Function[]) => (...args: any[]) => last(fns.map((fn) => fn(...args)));

export const invoke = (fnName: string, ...args: any[]) => (obj: any) => obj[fnName](...args);
export const constant = <T = any>(value: T) => () => value;
export const partial = (fn: Function, ...partialArgs: any[]) => (...otherArgs: any[]) => fn(...replacePlaceholder(partialArgs, otherArgs));

export const first = <T = any>(array: T[] | null): T | undefined => array ? array[0] : undefined;
export const last = <T = any>(array: T[] | null): T | undefined => array ? array[array.length - 1] : undefined;
