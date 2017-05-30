import 'jest';

import { parseEventDefinition } from './config';

describe(`parseEventDefinition`, () => {
  it(`should parse event with plugin and params`, () => {
    expect(parseEventDefinition('on file [add, change]')).toEqual({
      type: 'event',
      plugin: 'file',
      params: ['add', 'change']
    });
  });

  it(`should ignore square and round brackets`, () => {
    expect(parseEventDefinition('on file add, change')).toEqual({
      type: 'event',
      plugin: 'file',
      params: ['add', 'change']
    });
  });

  it(`should parse action with plugin and params`, () => {
    expect(parseEventDefinition('do firebase (set)')).toEqual({
      type: 'action',
      plugin: 'firebase',
      params: ['set']
    });
  });
});
