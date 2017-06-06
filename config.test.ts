import 'jest';

import { parseWatchContent, parseEventDefinition, parseEventContent } from './config';

describe(`parseWatchContent`, () => {
  const parseWatchContentWithImports = parseWatchContent(['file']);

  it(`should extract imported plugin`, () => {
    const path = 'posts/:postId/content.md';
    expect(parseWatchContentWithImports(`file '${path}'`).plugin).toBe('file');
  });

  it(`should fail for non-imported plugin`, () => {
    const path = 'posts/:postId/content.md';
    expect(() => parseWatchContentWithImports(`a '${path}'`)).toThrowError();
  });

  it(`should fail if no plugin`, () => {
    const path = 'posts/:postId/content.md';
    expect(() => parseWatchContentWithImports(`'${path}'`)).toThrowError();
  });

  it(`should remove single quotes from path`, () => {
    const path = 'posts/:postId/content.md';
    expect(parseWatchContentWithImports(`file '${path}'`).path).toBe(path);
  });

  it(`should remove double quotes from path`, () => {
    const path = 'posts/:postId/content.md';
    expect(parseWatchContentWithImports(`file "${path}"`).path).toBe(path);
  });

  it(`should not remove quotes in the middle of path`, () => {
    const path = `post's/:postId/"content".md`;
    expect(parseWatchContentWithImports(`file '${path}'`).path).toBe(path);
    expect(parseWatchContentWithImports(`file "${path}"`).path).toBe(path);
  });
});

describe(`parseEventDefinition`, () => {
  it(`should parse event with plugin and params`, () => {
    expect(parseEventDefinition('on [add, change]')).toEqual(['add', 'change']);
  });

  it(`should ignore square and round brackets`, () => {
    expect(parseEventDefinition('on add, change')).toEqual(['add', 'change']);
  });

  it(`should work the same without prefix`, () => {
    expect(parseEventDefinition('[add, change]')).toEqual(['add', 'change']);
  });

  it(`should ignore spaces`, () => {
    expect(parseEventDefinition('on[add,change]')).toEqual(['add', 'change']);
  });

  it(`should fail if another prefix is used`, () => {
    expect(parseEventDefinition('when [add, change]')).not.toEqual(['add', 'change']);
  });
});

describe(`parseEventContent`, () => {
  const parseEventContentWithImports = parseEventContent(['file', 'firebase', '$']);

  it(`should extract function calls`, () => {
    expect(parseEventContentWithImports(`file.readFile >> firebase.set 'postContent/:postId'`)).toEqual([
      { plugin: 'file', method: 'readFile', args: [] },
      { plugin: 'firebase', method: 'set', args: [`'postContent/:postId'`] }
    ]);
  });

  it(`should extract multiple arguments`, () => {
    expect(parseEventContentWithImports(`$.partial a, b, c`)).toEqual([
      { plugin: '$', method: 'partial', args: ['a', 'b', 'c'] }
    ]);
  });

  it(`should extract nested method arguments`, () => {
    expect(parseEventContentWithImports(`$.partial firebase.remove, 'postContent/:postId'`)).toEqual([
      {
        plugin: '$', method: 'partial', args: [
          { plugin: 'firebase', method: 'remove', args: [] },
          `'postContent/:postId'`
        ]
      }
    ]);
  });
});
