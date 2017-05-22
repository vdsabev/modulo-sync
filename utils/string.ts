import { invoke } from './invoke';
import { partial } from './partial';

export const match = partial(invoke, 'match');
