import 'jest';

import { constant } from './utils';

const glob = { sync: jest.fn(constant({ forEach: jest.fn() })) };
jest.mock('glob', () => glob);

import { requireAndSync } from './index';

describe(`requireAndSync`, () => {
  it(`should require a file, then call its sync method`, () => {
    const file = { sync: jest.fn() };
    jest.mock('./index.test', () => file);
    requireAndSync('./index.test');
    expect(file.sync).toHaveBeenCalled();
  });
});

it(`should call glob.sync`, () => {
  expect(glob.sync).toHaveBeenLastCalledWith('./stores/!(*.test).js', { cwd: __dirname });
  expect(glob.sync().forEach).toHaveBeenLastCalledWith(requireAndSync);
});
