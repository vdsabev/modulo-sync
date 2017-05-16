import 'jest';

import { parse, pattern } from './parser';

describe(`parse`, () => {
  it(`should extract local store from string`, () => {
    const { source, destination } = parse('local://posts/:postId/content.md,firebase://postContent/:postId');
    expect(source).toEqual({ type: 'local', path: 'posts/:postId/content.md' });
    expect(destination).toEqual({ type: 'firebase', path: 'postContent/:postId' });
  });

  it(`should extract firebase store from string`, () => {
    const { source, destination } = parse('firebase://postContent/:postId,gcs://posts/:postId');
    expect(source).toEqual({ type: 'firebase', path: 'postContent/:postId' });
    expect(destination).toEqual({ type: 'gcs', path: 'posts/:postId' });
  });

  it(`should extract gcs store from string`, () => {
    const { source, destination } = parse('gcs://posts/:postId,local://posts/:postId/content.md');
    expect(source).toEqual({ type: 'gcs', path: 'posts/:postId' });
    expect(destination).toEqual({ type: 'local', path: 'posts/:postId/content.md' });
  });
});

describe(`pattern`, () => {
  describe(`replace`, () => {
    it(`should return path if no matches found`, () => {
      expect(pattern('a/b/c').replace({ a: '1' })).toBe('a/b/c');
    });

    it(`should replace match with empty string if no data matches`, () => {
      expect(pattern('a/:b/c').replace({ a: '1' })).toBe('a//c');
    });

    it(`should replace match with data`, () => {
      expect(pattern('postContent/:postId').replace({ postId: '1' })).toBe('postContent/1');
    });

    it(`should replace multiple matches with data`, () => {
      expect(pattern(':a/:b/:c').replace({ a: '1', b: '2', c: '3' })).toBe('1/2/3');
    });

    it(`should replace data in absolute path`, () => {
      const absolutePattern = pattern('C:\\Projects\\modulo-sync\\posts\\:postId\\content.md', '\\');
      expect(absolutePattern.replace({ postId: '1' })).toBe('C:\\Projects\\modulo-sync\\posts\\1\\content.md');
    });
  });

  describe(`extract`, () => {
    it(`should return empty object if no matches found`, () => {
      expect(pattern('a').extract('1')).toEqual({});
    });

    it(`should return data if match found`, () => {
      expect(pattern('a/:b/c').extract('a//c')).toEqual({ b: '' });
    });

    it(`should return data if multiple matches found`, () => {
      expect(pattern('a/:b/c').extract('a/2/c')).toEqual({ b: '2' });
    });

    it(`should ignore extra original fragments`, () => {
      expect(pattern('a/:b/c/d/:e/f').extract('a/2/c')).toEqual({ b: '2' });
    });

    it(`should ignore extra replaced fragments`, () => {
      expect(pattern('a/:b/c').extract('a/2/c/a/4/c')).toEqual({ b: '2' });
    });
  });
});
