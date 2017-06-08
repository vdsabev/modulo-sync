import { Pattern } from '../pattern';

// TODO: Make methods optional
interface ModuloPlugin {
  on(eventNames: string[], sourcePattern: Pattern, fn: Function): void;
  do(actionNames: string[], ...args: any[]): void;
}
