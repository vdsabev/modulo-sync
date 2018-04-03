import { parseEventDefinition } from './config';

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
