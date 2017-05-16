// S
export const substitution = (f: Function) => (g: Function) => (...x: any[]) => f(...x)(g(...x));

// K
export const constant = <T>(value: T) => () => value;

// I
export const identity = <T>(x: T): T => x;

// Compose
export const compose = (f: Function, g: Function) => (...x: any[]) => f(g(...x));

// Pipe
export const pipe = (f: Function, g: Function) => (...x: any[]) => g(f(...x));

// Invert
export const invert = (f: Function) => (...x: any[]) => (...y: any[]) => f(...y)(...x);

// Not
export const not = (f: Function) => (...x: any[]) => !f(...x);
