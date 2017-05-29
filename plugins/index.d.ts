// TODO: Make methods optional
interface ModuloPlugin {
  on(eventNames: string[], ...args: any[]): any;
  do(actionNames: string[], ...args: any[]): any;
}
