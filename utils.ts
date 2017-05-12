export const assertNever = (obj: never) => {
  throw new Error('Unexpected object');
};

export const left = (l: Function, r: Function) => (value: any) => value ? l(value) : r(value);
export const right = (l: Function, r: Function) => (value: any) => value ? r(value) : l(value);

export const flowRight = (l: Function, r: Function) => (value: any) => r(l(value));
export const flowLeft = (l: Function, r: Function) => (value: any) => l(r(value));

export const invoke = (fnName: string, ...args: any[]) => (obj: any) => obj[fnName](...args);
