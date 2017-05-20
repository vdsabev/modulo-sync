import * as path from 'path';

interface Config {
  sync: {
    keys: Record<StoreType, string>,
    stores: { from: string, to: string }[]
  };
}

// TODO: Handle require exception
// TODO: Set default values
// TODO: Handle null references
// TODO: Validate config
const packageJson = require(path.resolve(process.cwd(), './package.json'));
export const config: Config = packageJson.modulo;
