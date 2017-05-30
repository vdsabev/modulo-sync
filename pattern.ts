import { pipe, map, join, identity, isContained, ternary, cap } from './utils';

// Pattern
export interface Pattern {
  replace(data: string | Record<string, string>): string;
  extract(replacedPath: string): Record<string, string>;
}

export const pattern = (path: string, separator = '/'): Pattern => {
  const pathFragments = path.split(separator);
  const pathMatches = path.match(/:\w+/g) || [];
  const isAMatch = isContained(pathMatches);

  return {
    replace(data: string | Record<string, string>) {
      if (typeof data === 'string') return path.replace(/:\w+/g, data);

      const getFragment = ternary(cap(isAMatch), getDataByFragment(data), identity);
      const replace = pipe(map(getFragment), join(separator));
      return replace(pathFragments);
    },

    extract(replacedPath: string) {
      const data: Record<string, string> = {};
      replacedPath.split(separator).map((replacedFragment, index) => {
        const originalFragment = pathFragments[index];
        if (isAMatch(originalFragment)) {
          data[normalizeFragment(originalFragment)] = replacedFragment;
        }
      });

      return data;
    }
  };
};

const getDataByFragment = (data: Record<string, string>) => (fragment: string) => data[fragment.replace(':', '')] || '';

const normalizeFragment = (fragment: string) => fragment.replace(':', '');
