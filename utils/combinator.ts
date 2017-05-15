// S
export const substitution = (f: Function) => (g: Function) => (x: any) => f(x)(g(x));

// K
export const constant = <T>(value: T) => () => value;

// I
export const identity = <T>(x: T) => x;

// Invert
export const invert = (f: Function) => (x: any) => (y: any) => f(y)(x);
