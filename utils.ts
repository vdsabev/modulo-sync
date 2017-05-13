export const assertNever = (obj: never) => {
  throw new Error('Unexpected object');
};

export const promisify = <T extends Function>(fn: T) => (...args: any[]) => new Promise(
  (resolve: Function, reject: Function) => {
    fn(...args, (error: any, ...resultArgs: any[]) => {
      if (error) return reject(error);
      resolve(...resultArgs);
    });
  }
);

export const left = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? l(value, ...args) : r(value, ...args);
export const right = (l: Function, r: Function) => (value: any, ...args: any[]) => value ? r(value, ...args) : l(value, ...args);

export const flowRight = (l: Function, r: Function) => (value: any) => r(l(value));
export const flowLeft = (l: Function, r: Function) => (value: any) => l(r(value));

export const invoke = (fnName: string, ...args: any[]) => (obj: any) => obj[fnName](...args);
export const constant = <T = any>(value: T) => () => value;

export const last = <T>(array: T[] | null): T | undefined => array ? array[array.length - 1] : undefined;
