import 'jest';

import { constant } from './utils';

const glob = { sync: jest.fn(constant({ map: jest.fn() })) };
jest.mock('glob', () => glob);

import { requireAndSync } from './index';

describe(`requireAndSync`, () => {
  it(`should require a file, then call its sync method`, () => {
    const file = { sync: jest.fn() };
    jest.mock('./index.test', () => file);

    requireAndSync('./index.test');
    expect(file.sync).toHaveBeenLastCalledWith({ source: './index.test', destination: 'postContent' });
  });
});

it(`should call glob.sync`, () => {
  expect(glob.sync).toHaveBeenLastCalledWith('./stores/!(*.test).js', { cwd: __dirname });
  expect(glob.sync().map).toHaveBeenLastCalledWith(requireAndSync);
});
