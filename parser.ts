import { pipe, map, join, identity, isContained, ternary, cap } from './utils';

export const parse = (fullPath: string): { type: ModuloPluginType, path: string } => {
  const [type, path] = fullPath.split('://');
  return { type: <ModuloPluginType>type, path };
};

export interface Pattern {
  replace(data: string | Record<string, string>): string;
  extract(replacedPath: string): Record<string, string>;
}

export const pattern = (path: string, separator = '/'): Pattern => {
  const pathFragments = path.split(separator);
  const pathMatches = path.match(/:\w+/g) || [];
  const isInMatches = isContained(pathMatches);

  return {
    replace(data: string | Record<string, string>) {
      if (typeof data === 'string') return path.replace(/:\w+/g, data);

      const getFragment = ternary(cap(isInMatches), getDataByFragment(data), identity);
      const replace = pipe(map(getFragment), join(separator));
      return replace(pathFragments);
    },

    extract(replacedPath: string) {
      const data: Record<string, string> = {};
      replacedPath.split(separator).map((replacedFragment, index) => {
        const originalFragment = pathFragments[index];
        if (isInMatches(originalFragment)) {
          data[normalizeFragment(originalFragment)] = replacedFragment;
        }
      });

      return data;
    }
  };
};

const getDataByFragment = (data: Record<string, string>) => (fragment: string) => data[fragment.replace(':', '')] || '';

const normalizeFragment = (fragment: string) => fragment.replace(':', '');
