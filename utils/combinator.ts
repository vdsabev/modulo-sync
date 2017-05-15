// S
export const substitution = (f: Function) => (g: Function) => (x: any) => f(x)(g(x));

// K
export const constant = <T>(value: T) => () => value;

// I
export const identity = <T>(x: T) => x;
