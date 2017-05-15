import 'jest';

import { parse } from './parser';

describe(`parse`, () => {
  it(`should extract local store from string`, () => {
    const store: Store = parse('local://./posts/:postId/content.md');
    expect(store.type).toBe('local');
    expect(store.path).toBe('./posts/:postId/content.md');
  });

  it(`should extract firebase store from string`, () => {
    const store: Store = parse('firebase://postContent/:postId');
    expect(store.type).toBe('firebase');
    expect(store.path).toBe('postContent/:postId');
  });

  it(`should extract gcs store from string`, () => {
    const store: Store = parse('gcs://posts/:postId');
    expect(store.type).toBe('gcs');
    expect(store.path).toBe('posts/:postId');
  });
});
