import { logger } from '../logger';

export const sync = (source: string, destination: string) => {
  logger.log(`[LOCAL] ${source} -> ${destination}`);
  // TODO
};
