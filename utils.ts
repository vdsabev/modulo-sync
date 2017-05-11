export const left = (l: Function, r: Function) => (value: any) => value ? l(value) : r(value);
export const right = (l: Function, r: Function) => (value: any) => value ? r(value) : l(value);

export const flowToRight = (l: Function, r: Function) => (value: any) => l(r(value));
export const flowToLeft = (l: Function, r: Function) => (value: any) => r(l(value));
