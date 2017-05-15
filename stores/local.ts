import { logger } from '../logger';

export const type: StoreType = 'local';

export const sync = ({ source, destination }: StoreOptions) => {
  logger.log(`[LOCAL] ${source.path} -> ${destination.path}`);
  // TODO
};
