import 'jest';

import content from './content';

it(`should return the input unchanged`, async () => {
  expect(await content('a')).toBe('a');
});
