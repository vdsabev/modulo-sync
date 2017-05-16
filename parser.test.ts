import 'jest';

import { parse } from './parser';

describe(`parse`, () => {
  it(`should extract local store from string`, () => {
    const { source, destination } = parse('local://./posts/:postId/content.md,firebase://postContent/:postId');
    expect(source).toEqual({ type: 'local', path: './posts/:postId/content.md' });
    expect(destination).toEqual({ type: 'firebase', path: 'postContent/:postId' });
  });

  it(`should extract firebase store from string`, () => {
    const { source, destination } = parse('firebase://postContent/:postId,gcs://posts/:postId');
    expect(source).toEqual({ type: 'firebase', path: 'postContent/:postId' });
    expect(destination).toEqual({ type: 'gcs', path: 'posts/:postId' });
  });

  it(`should extract gcs store from string`, () => {
    const { source, destination } = parse('gcs://posts/:postId,local://./posts/:postId/content.md');
    expect(source).toEqual({ type: 'gcs', path: 'posts/:postId' });
    expect(destination).toEqual({ type: 'local', path: './posts/:postId/content.md' });
  });
});
