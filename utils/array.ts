import { compose } from './combinator';
import { get } from './object';

// TODO: Write tests
export const map = (fn: Function) => <T>(array: T[]) => array.map(<any>fn);

// TODO: Write tests
export const pluck = compose(map, get);

export const first = <T = any>(array: T[] | null): T | undefined => array ? array[0] : undefined;
export const last = <T = any>(array: T[] | null): T | undefined => array ? array[array.length - 1] : undefined;
