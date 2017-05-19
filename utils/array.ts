import { compose } from './combinator';
import { invoke } from './invoke';
import { partial } from './partial';
import { get } from './object';

export const filter = partial(invoke, 'filter');
export const find = partial(invoke, 'find');
export const join = partial(invoke, 'join');
export const map = partial(invoke, 'map');
export const reduce = partial(invoke, 'reduce');

export const pluck = compose(map, get);

export const first = <T = any>(array: T[] | null): T | undefined => array ? array[0] : undefined;
export const last = <T = any>(array: T[] | null): T | undefined => array ? array[array.length - 1] : undefined;
